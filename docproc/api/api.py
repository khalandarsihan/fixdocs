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
            fields=["name", "title", "description", "entity", "date", "status"],
            filters={"date": [">=", frappe.utils.add_days(frappe.utils.nowdate(), -30)]},
            order_by="date desc",
            limit=10
        )
        
        # Get upcoming document renewals
        upcoming_renewals = []
        
        # For business documents
        business_docs = frappe.get_all(
            "Business Document",
            fields=["name", "document_type", "business", "expiry_date"],
            filters={"expiry_date": [">=", frappe.utils.nowdate()]},
            order_by="expiry_date asc",
            limit=10
        )
        
        for doc in business_docs:
            upcoming_renewals.append({
                "document": doc.document_type,
                "entity": doc.business,
                "expiryDate": doc.expiry_date
            })
        
        # For individual documents
        individual_docs = frappe.get_all(
            "Individual Document",
            fields=["name", "document_type", "individual", "expiry_date"],
            filters={"expiry_date": [">=", frappe.utils.nowdate()]},
            order_by="expiry_date asc",
            limit=10
        )
        
        for doc in individual_docs:
            upcoming_renewals.append({
                "document": doc.document_type,
                "entity": doc.individual,
                "expiryDate": doc.expiry_date
            })
        
        # Sort by expiry date
        upcoming_renewals = sorted(upcoming_renewals, key=lambda x: x["expiryDate"])[:10]
        
        # Get recent works
        recent_works = frappe.get_all(
            "Work Record",
            fields=["name", "title", "creation", "duration"],
            order_by="creation desc",
            limit=5
        )
        
        # Format the works for display
        formatted_works = [{
            "title": work.title,
            "date": work.creation,
            "duration": f"{work.duration or 30} min"
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
            
            # Get document count for this business
            doc_count = frappe.db.count("Business")
            
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
            fields=["full_name", "personnel_type", "resident_status", 
                    "visa_type", "primary_personnel", "active", "creation"],
            order_by="creation desc"
        )
        
        formatted_individuals = []
        for individual in individuals:
            # Get document count for this individual
            doc_count = frappe.db.count("Personnel")
            
            # Get visa expiry date if available
            visa_expiry = frappe.db.get_value("Personnel", 
                                             {"full_name": individual.name}, 
                                             "visa_date_of_expiry")
            
            # Calculate days until visa expiry
            expiry_days = None
            if visa_expiry:
                today = datetime.now().date()
                expiry = datetime.strptime(str(visa_expiry), '%Y-%m-%d').date()
                expiry_days = (expiry - today).days
            
            formatted_individuals.append({
                # "id": individual.name,
                "name": individual.full_name,
                "type": individual.personnel_type,
                "residentStatus": individual.resident_status,
                "visaType": individual.visa_type,
                # "employer": individual.primary_personnel,
                "isActive": individual.active == 1,
                "documentCount": doc_count,
                "visaExpiryDate": visa_expiry,
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
            fields=["name", "title", "description", "alert_type", "entity", 
                    "date", "status", "priority", "creation"],
            order_by="priority desc, date asc"
        )
        
        formatted_alerts = [{
            "id": alert.name,
            "title": alert.title,
            "description": alert.description,
            "type": alert.alert_type,
            "entity": alert.entity,
            "date": alert.date,
            "status": alert.status,
            "priority": alert.priority,
            "creationDate": alert.creation
        } for alert in alerts]
        
        # Get alert statistics
        stats = {
            "total": len(alerts),
            "open": len([a for a in formatted_alerts if a["status"] == "Open"]),
            "inProgress": len([a for a in formatted_alerts if a["status"] == "In Progress"]),
            "resolved": len([a for a in formatted_alerts if a["status"] == "Resolved"]),
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
        # First, determine document type
        doc_type = None
        
        if frappe.db.exists("Business Document", document_id):
            doc_type = "Business Document"
        elif frappe.db.exists("Individual Document", document_id):
            doc_type = "Individual Document"
        else:
            return {"error": "Document not found"}
        
        # Get document data
        doc = frappe.get_doc(doc_type, document_id)
        
        # Format for frontend
        document_data = {
            "id": doc.name,
            "documentType": doc.document_type,
            "docNumber": doc.document_number,
            "entity": doc.business if doc_type == "Business Document" else doc.individual,
            "entityType": "Business" if doc_type == "Business Document" else "Individual",
            "issueDate": doc.issue_date,
            "expiryDate": doc.expiry_date,
            "status": doc.status,
            "attachments": []
        }
        
        # Get attachments
        attachments = frappe.get_all(
            "File",
            fields=["name", "file_name", "file_url", "is_private"],
            filters={
                "attached_to_name": document_id,
                "attached_to_doctype": doc_type
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
    
    except Exception as e:
        frappe.log_error(f"Error in get_document_data: {str(e)}", "FixDocs API Error")
        return {"error": str(e)}