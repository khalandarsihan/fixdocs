import frappe
from frappe import _
import json
from datetime import datetime, timedelta
import random  # For demo data only

@frappe.whitelist()
def get_app_data(module=None, document_id=None):
    """
    Get data for the React app based on the module
    """
    try:
        if module == "dashboard":
            return get_dashboard_data()
        elif module == "business":
            return get_business_data()
        elif module == "personnel":
            return get_personnel_data()
        elif module == "alerts":
            return get_alerts_data()
        elif module == "document" and document_id:
            return get_document_data(document_id)
        else:
            return {"error": "Invalid module or missing document ID"}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "API Error")
        return {"error": str(e)}

def get_dashboard_data():
    """Get dashboard data including stats and recent items"""
    try:
        # In a real implementation, you would query the database
        # For now, we'll return mock data
        
        # Get counts from actual doctypes if they exist
        business_count = frappe.db.count("Business") if frappe.db.exists("DocType", "Business") else random.randint(10, 50)
        personnel_count = frappe.db.count("Personnel") if frappe.db.exists("DocType", "Personnel") else random.randint(20, 100)
        alert_count = frappe.db.count("Alert", {"status": "Open"}) if frappe.db.exists("DocType", "Alert") else random.randint(5, 15)
        
        # Prepare mock data for the dashboard
        stats = {
            "totalDocuments": random.randint(50, 200),
            "expiringDocuments": random.randint(5, 20),
            "businessCount": business_count,
            "personnelCount": personnel_count,
            "alertsCount": alert_count,
            "completedTasks": random.randint(30, 80),
        }
        
        # Generate some mock recent alerts
        alert_types = ["Expiry", "Compliance", "Missing Document"]
        statuses = ["Open", "In Progress", "Resolved"]
        entities = ["ABC Corp", "XYZ LLC", "Global Trading", "John Smith", "Sarah Johnson"]
        documents = ["Trade License", "Visa", "Passport", "Commercial Registration", "Insurance"]
        
        recent_alerts = []
        for i in range(5):
            recent_alerts.append({
                "id": f"ALT-{1001 + i}",
                "type": random.choice(alert_types),
                "document": random.choice(documents),
                "entity": random.choice(entities),
                "date": (datetime.now() - timedelta(days=random.randint(0, 10))).isoformat(),
                "status": random.choices(statuses, weights=[0.6, 0.3, 0.1])[0],
            })
        
        # Generate mock upcoming renewals
        upcoming_renewals = []
        for i in range(5):
            days_left = random.randint(1, 60)
            expiry_date = (datetime.now() + timedelta(days=days_left)).isoformat()
            
            upcoming_renewals.append({
                "id": f"DOC-{2001 + i}",
                "document": random.choice(documents),
                "entity": random.choice(entities),
                "expiryDate": expiry_date,
            })
        
        return {
            "stats": stats,
            "recentAlerts": recent_alerts,
            "upcomingRenewals": upcoming_renewals,
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Dashboard Data Error")
        return {"error": str(e)}

def get_business_data():
    """Get business listing data"""
    # Implement based on your requirements
    return {"message": "Business data"}

def get_personnel_data():
    """Get personnel listing data"""
    # Implement based on your requirements
    return {"message": "Personnel data"}

def get_alerts_data():
    """Get alerts listing data"""
    # Implement based on your requirements
    return {"message": "Alerts data"}

def get_document_data(document_id):
    """Get document details"""
    # Implement based on your requirements
    return {"message": f"Document data for {document_id}"}
