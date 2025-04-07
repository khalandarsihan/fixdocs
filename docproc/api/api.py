# docproc/api/api.py
import frappe
from frappe import _
import json
from datetime import datetime, timedelta

@frappe.whitelist()
def get_app_data(module, document_id=None):
    """
    Main API endpoint for the FixDocs React application
    
    Args:
        module (str): The module being requested (dashboard, business, personnel, alerts, document)
        document_id (str, optional): Document ID if viewing a specific document
        
    Returns:
        dict: Data for the requested module
    """
    try:
        if module == "dashboard":
            return get_dashboard_data()
        elif module == "business":
            return get_businesses_data()
        elif module == "personnel":
            return get_personnel_data()
        elif module == "alerts":
            return get_alerts_data()
        elif module == "document" and document_id:
            return get_document_data(document_id)
        else:
            return {"error": "Invalid module or missing document ID"}
    except Exception as e:
        frappe.log_error(f"Error in get_app_data: {str(e)}", "FixDocs API Error")
        return {"error": str(e)}

@frappe.whitelist()
def get_dashboard_data():
    """
    Get data for the dashboard module
    
    Returns:
        dict: Dashboard metrics, alerts, and upcoming renewals
    """
    try:
        # Get counts from various doctypes
        stats = {
            "companies": frappe.db.count("Business"),
            "individuals": frappe.db.count("Personnel"),
            "alerts": frappe.db.count("Alert", filters={"status": "Open"}),
            "estimates": frappe.db.count("Service Estimate"),
            "works": frappe.db.count("Work"),
            "invoices": frappe.db.count("Sales Invoice"),
            "payments": frappe.db.count("Payment Entry")
        }
        
        # Get recent alerts (last 30 days)
        recent_alerts = frappe.get_all(
            "Alert",
            # fields=["name", "alert_type", "status"],
            fields=[
                "name", "alert_type", "business", "personnel", "vehicle",
                "status", "bill_to", "document_type", "document_id",
                "date_of_issue", "date_of_expiry", "expires_in", 
                "linked_service_estimate", "creation", "modified"
            ],
            filters={"date_of_expiry": [">=", frappe.utils.add_days(frappe.utils.nowdate(), -30)]},
            order_by="date_of_expiry desc",
            limit=10
        )
        
        # Get upcoming document renewals
        upcoming_renewals = []
        
        # For business documents - using licence_expiry_date from Business
        business_docs = frappe.get_all(
            "Business",
            fields=["name", "company_name", "licence_expiry_date as expiry_date"],
            filters={"licence_expiry_date": [">=", frappe.utils.nowdate()]},
            order_by="licence_expiry_date asc",
            limit=100   # Increased limit to get more businesses
        )
        
        for doc in business_docs:
            upcoming_renewals.append({
                "document": "Company Commercial License",
                "entity": doc.company_name,
                "expiryDate": doc.expiry_date
            })
        
        # For personnel documents - checking passport expiry dates
        personnel_docs = frappe.get_all(
            "Personnel",
            fields=["name", "full_name", "passport_id", "passport_date_of_expiry"],
            filters=[
                ["passport_date_of_expiry", ">=", frappe.utils.nowdate()]
            ],
            order_by="passport_date_of_expiry asc",
            limit=100   # Increased limit to get more personnel
        )
        
        # Add passport entries if they exist
        for doc in personnel_docs:
            if doc.passport_date_of_expiry:
                upcoming_renewals.append({
                    "document": "Passport",
                    "entity": doc.full_name,
                    "expiryDate": doc.passport_date_of_expiry,
                    "documentId": doc.passport_id
                })
        
        # Sort by expiry date and limit to 10 items
        upcoming_renewals = sorted(upcoming_renewals, key=lambda x: x["expiryDate"])[:10]
        
        # Get recent works
        recent_works = frappe.get_all(
            "Work",
            fields=["name", "service_name", "work_creation_date", "notes as duration"],
            order_by="creation desc",
            limit=50
        )
        
        # Format the works for display
        formatted_works = [{
            "title": work.service_name,
            "date": work.work_creation_date,
            # "duration": f"{work.duration or 30} min" if work.duration else "30 min"
        } for work in recent_works]
        
        return {
            "stats": stats,
            "recentAlerts": recent_alerts,
            "upcomingRenewals": upcoming_renewals,
            "recentWorks": formatted_works
        }
    
    except Exception as e:
        frappe.log_error(f"Error in get_dashboard_data: {str(e)}", "FixDocs API Error")
        return {"error": str(e)}

@frappe.whitelist()
def get_businesses_data():
    """
    Get data for the businesses module
    
    Returns:
        dict: List of businesses with key metrics
    """
    try:
        businesses = frappe.get_all(
            "Business",
            fields=["name", "company_name", "active", "company_legal_type", 
                    "licence_expiry_date", "creation"],
            order_by="creation desc"
        )
        
        formatted_businesses = []
        for business in businesses:
            # Calculate days until license expiry
            expiry_days = None
            if business.licence_expiry_date:
                today = datetime.now().date()
                expiry = datetime.strptime(str(business.licence_expiry_date), '%Y-%m-%d').date()
                expiry_days = (expiry - today).days
            
            # Get document count for this business - counting child table entries
            doc_count = len(frappe.get_all("Legal Documents", 
                                          filters={"parent": business.name},
                                          as_list=1))
            
            formatted_businesses.append({
                "id": business.name,
                "name": business.company_name,
                "legalType": business.company_legal_type,
                "isActive": business.active == 1,
                "licenseExpiryDate": business.licence_expiry_date,
                "expiryDays": expiry_days,
                "documentCount": doc_count,
                "creationDate": business.creation
            })
        
        return {
            "businesses": formatted_businesses
        }
    
    except Exception as e:
        frappe.log_error(f"Error in get_businesses_data: {str(e)}", "FixDocs API Error")
        return {"error": str(e)}

@frappe.whitelist()
def get_personnel_data():
    """
    Get data for the personnel module
    
    Returns:
        dict: List of individuals with key metrics
    """
    try:
        individuals = frappe.get_all(
            "Personnel",
            fields=["name", "full_name", "personnel_type", "resident_status", 
                    "visa_type", "primary_personnel", "active", "creation"],
            order_by="creation desc"
        )
        
        formatted_individuals = []
        for individual in individuals:
            # Get document count for this individual - counting child table entries
            doc_count = len(frappe.get_all("Legal Documents", 
                                          filters={"parent": individual.name},
                                          as_list=1))
            
            # Get passport expiry date if available
            passport_expiry = frappe.db.get_value("Personnel", individual.name, "passport_date_of_expiry")
            passport_id = frappe.db.get_value("Personnel", individual.name, "passport_id")
            
            # Calculate days until passport expiry
            expiry_days = None
            if passport_expiry:
                today = datetime.now().date()
                expiry = datetime.strptime(str(passport_expiry), '%Y-%m-%d').date()
                expiry_days = (expiry - today).days
            
            formatted_individuals.append({
                "id": individual.name,
                "name": individual.full_name,
                "type": individual.personnel_type,
                "residentStatus": individual.resident_status,
                "visaType": individual.visa_type,
                "employer": individual.primary_personnel,
                "isActive": individual.active == 1,
                "documentCount": doc_count,
                "passportId": passport_id,
                "passportExpiryDate": passport_expiry,
                "expiryDays": expiry_days,
                "creationDate": individual.creation
            })
        
        return {
            "individuals": formatted_individuals
        }
    
    except Exception as e:
        frappe.log_error(f"Error in get_personnel_data: {str(e)}", "FixDocs API Error")
        return {"error": str(e)}

@frappe.whitelist()
def get_alerts_data():
    """
    Get data for the alerts module
    
    Returns:
        dict: List of alerts with details
    """
    try:
        alerts = frappe.get_all(
            "Alert",
            fields=["name", "document_type as title", "document_id as description", 
                    "alert_type", "bill_to as entity", "date_of_expiry as date", 
                    "status", "expires_in as priority", "creation"],
            order_by="expires_in asc",  # Prioritize by expiry days
            limit=50
        )
        
        formatted_alerts = [{
            "id": alert.name,
            "title": alert.title or f"Document: {alert.description}",
            "description": alert.description,
            "type": alert.alert_type,
            "entity": alert.entity,
            "date": alert.date,
            "status": alert.status,
            "priority": "High" if alert.priority and int(alert.priority) <= 30 else "Medium" if alert.priority and int(alert.priority) <= 60 else "Low",
            "creationDate": alert.creation
        } for alert in alerts]
        
        # Get alert statistics
        stats = {
            "total": len(alerts),
            "open": len([a for a in formatted_alerts if a["status"] == "Open"]),
            "inProgress": len([a for a in formatted_alerts if a["status"] == "Follow-Up"]),
            "resolved": len([a for a in formatted_alerts if a["status"] in ["Service Estimate", "Partial Quotation", "Work-Order"]]),
            "highPriority": len([a for a in formatted_alerts if a["priority"] == "High"])
        }
        
        return {
            "alerts": formatted_alerts,
            "stats": stats
        }
    
    except Exception as e:
        frappe.log_error(f"Error in get_alerts_data: {str(e)}", "FixDocs API Error")
        return {"error": str(e)}

@frappe.whitelist()
def get_document_data(document_id):
    """
    Get data for a specific document
    
    Args:
        document_id (str): The document ID to retrieve
        
    Returns:
        dict: Document details
    """
    try:
        # Determine if this is a Legal Documents entry
        try:
            # First check if this is a child table document from Legal Documents
            legal_doc = frappe.db.get_value("Legal Documents", 
                                          filters={"name": document_id},
                                          fieldname=["parent", "parenttype", "document_type", "document_number", 
                                                     "date_of_issue", "date_of_expiry", "status"])
            
            if legal_doc:
                parent, parenttype, doc_type, doc_number, issue_date, expiry_date, status = legal_doc
                
                # Format for frontend
                document_data = {
                    "id": document_id,
                    "documentType": doc_type,
                    "docNumber": doc_number,
                    "entity": parent,
                    "entityType": parenttype,
                    "issueDate": issue_date,
                    "expiryDate": expiry_date,
                    "status": status or "Active",
                    "attachments": []
                }
                
                # Get attachments
                attachments = frappe.get_all(
                    "File",
                    fields=["name", "file_name", "file_url", "is_private"],
                    filters={
                        "attached_to_name": document_id,
                        "attached_to_doctype": "Legal Documents"
                    }
                )
                
                document_data["attachments"] = [{
                    "id": attachment.name,
                    "fileName": attachment.file_name,
                    "url": attachment.file_url,
                    "isPrivate": attachment.is_private
                } for attachment in attachments]
                
                return {
                    "document": document_data
                }
            else:
                return {"error": "Document not found"}
        except Exception as e:
            frappe.log_error(f"Error checking legal document: {str(e)}", "FixDocs API Error")
            return {"error": "Error processing document"}
        

    
    except Exception as e:
        frappe.log_error(f"Error in get_document_data: {str(e)}", "FixDocs API Error")
        return {"error": str(e)}

@frappe.whitelist()
def get_alerts_data():
    """
    Get data for the alerts module matching Frappe list view fields
    
    Returns:
        dict: List of alerts with details and statistics
    """
    try:
        # Get alerts with all necessary fields - using same fields as the Frappe list view
        alerts = frappe.get_all(
            "Alert",
            fields=[
                "name", "alert_type", "business", "personnel", "vehicle",
                "status", "bill_to", "document_type", "document_id",
                "date_of_issue", "date_of_expiry", "expires_in", 
                "linked_service_estimate", "creation", "modified"
            ],
            filters={"status": ["!=", "Canceled"]},  # Exclude canceled alerts
            order_by="date_of_expiry asc, status asc",  # Order by expiry date first
            limit=2000  # Higher limit to match Frappe's list view
        )  # <-- This closing parenthesis was missing

        # Format alerts for frontend display matching Frappe list view
        formatted_alerts = []
        for alert in alerts:
            formatted_alerts.append({
                "id": alert.name,
                "alertType": alert.alert_type,
                "billTo": alert.bill_to or "",
                "business": alert.business or "",
                "personnel": alert.personnel or "",
                "vehicle": alert.vehicle or "",
                "documentType": alert.document_type or "",
                "documentId": alert.document_id or "",
                "dateOfIssue": alert.date_of_issue,
                "dateOfExpiry": alert.date_of_expiry,
                "expiresIn": alert.expires_in,
                "status": alert.status,
                "linkedEstimate": alert.linked_service_estimate,
                "creation": alert.creation,
                "modified": alert.modified
            })
        
        # Calculate alert statistics
        stats = {
            "total": len(alerts),
            "open": len([a for a in alerts if a.status == "Open"]),
            "inProgress": len([a for a in alerts if a.status == "Follow-Up"]),
            "resolved": len([a for a in alerts if a.status in ["Service Estimate", "Partial Quotation", "Work-Order"]]),
            "highPriority": len([a for a in alerts if a.expires_in and int(a.expires_in) <= 30])
        }
        
        return {
            "alerts": formatted_alerts,
            "stats": stats
        }

    except Exception as e:
        frappe.log_error(f"Error in get_alerts_data: {str(e)}", "FixDocs API Error")
        return {"error": str(e)}


@frappe.whitelist()
def get_alert_details(alert_id):
    """
    Get detailed data for a specific alert
    
    Args:
        alert_id (str): The alert ID to retrieve
        
    Returns:
        dict: Alert details including associated documents
    """
    try:
        if not frappe.db.exists("Alert", alert_id):
            return {"error": "Alert not found"}
        
        # Get basic alert data
        alert = frappe.get_doc("Alert", alert_id)
        
        # Format data for frontend
        alert_data = {
            "id": alert.name,
            "alertType": alert.alert_type,
            "status": alert.status,
            "billTo": alert.bill_to,
            "documentType": alert.document_type,
            "documentId": alert.document_id,
            "dateOfIssue": alert.date_of_issue,
            "dateOfExpiry": alert.date_of_expiry,
            "expiresIn": alert.expires_in,
            "linkedEstimate": alert.linked_service_estimate,
            "creationDate": alert.creation,
            "modifiedDate": alert.modified
        }
        
        # Add the specific entity details based on alert type
        if alert.alert_type == "Business":
            alert_data["business"] = alert.business
        elif alert.alert_type == "Personnel":
            alert_data["personnel"] = alert.personnel
            alert_data["personnelBusinessOwner"] = alert.personnel_business_owner
            alert_data["personnelPrimaryOwner"] = alert.personnel_primary_owner
        elif alert.alert_type == "Vehicle":
            alert_data["vehicle"] = alert.vehicle
            alert_data["vehicleBusinessOwner"] = alert.vehicle_business_owner
            alert_data["vehiclePersonnelOwner"] = alert.vehicle_personnel_owner
        
        # Get associated documents if any
        if hasattr(alert, 'expiring_documents') and alert.expiring_documents:
            docs = []
            for doc in alert.expiring_documents:
                docs.append({
                    "documentType": doc.document_type,
                    "documentId": doc.document_id,
                    "dateOfIssue": doc.date_of_issue,
                    "dateOfExpiry": doc.date_of_expiry,
                    "expiresIn": doc.expires_in
                })
            alert_data["documents"] = docs
        
        return {
            "alert": alert_data
        }
    
    except Exception as e:
        frappe.log_error(f"Error in get_alert_details: {str(e)}", "FixDocs API Error")
        return {"error": str(e)}

@frappe.whitelist()
def update_alert_status(alert_id, status):
    """
    Update the status of an alert
    
    Args:
        alert_id (str): The alert ID to update
        status (str): The new status
        
    Returns:
        dict: Success or error message
    """
    try:
        if not frappe.db.exists("Alert", alert_id):
            return {"success": False, "message": "Alert not found"}
        
        # Validate status
        valid_statuses = ["Open", "Follow-Up", "Service Estimate", "Partial Quotation", "Work-Order", "Canceled"]
        if status not in valid_statuses:
            return {"success": False, "message": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}
        
        # Update alert status
        frappe.db.set_value("Alert", alert_id, "status", status)
        frappe.db.commit()
        
        return {
            "success": True,
            "message": f"Alert status updated to {status}"
        }
    
    except Exception as e:
        frappe.log_error(f"Error in update_alert_status: {str(e)}", "FixDocs API Error")
        return {"success": False, "message": str(e)}

@frappe.whitelist()
def get_recent_alerts(limit=10):
    """
    Get recent alerts for dashboard
    
    Args:
        limit (int): Maximum number of alerts to return
    
    Returns:
        list: Recent alerts
    """
    try:
        # Get recent alerts
        alerts = frappe.get_all(
            "Alert",
            fields=[
                "name", "document_type as title", "document_id as description", 
                "alert_type as type", "bill_to as entity", "date_of_expiry as date", 
                "status", "expires_in"
            ],
            filters={"status": "Open"},
            order_by="expires_in asc",
            limit=int(limit)
        )
        
        # Format alerts for frontend display
        formatted_alerts = []
        for alert in alerts:
            # Calculate priority based on expires_in days
            priority = "High"
            if alert.expires_in:
                days_left = int(alert.expires_in)
                if days_left > 60:
                    priority = "Low"
                elif days_left > 30:
                    priority = "Medium"
            
            # Add to formatted list
            formatted_alerts.append({
                "id": alert.name,
                "title": alert.title,
                "description": alert.description,
                "type": alert.type,
                "entity": alert.entity or "Unknown",
                "date": alert.date,
                "status": alert.status,
                "priority": priority
            })
        
        return formatted_alerts
    
    except Exception as e:
        frappe.log_error(f"Error in get_recent_alerts: {str(e)}", "FixDocs API Error")
        return []