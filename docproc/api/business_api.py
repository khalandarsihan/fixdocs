import frappe
from frappe.utils import getdate, formatdate

@frappe.whitelist(allow_guest=True)  # Allow guest to help with debugging
def get_companies():
    """
    Fetch company data from Business doctype with relevant expiry dates
    """
    try:
        # Get list of all active businesses
        businesses = frappe.get_list(
            "Business",
            filters={"active": 1},
            fields=[
                "name", 
                "company_name",
                "licence_expiry_date",
                "matafi_expiry_date", 
                "lec_expiry_date", 
                "iec_expiry_date",
                "e_channel_expiry_date"
            ],
            order_by="company_name asc"
        )
        
        # Format the data to be more frontend friendly
        formatted_businesses = []
        for idx, business in enumerate(businesses):
            formatted_businesses.append({
                "id": idx + 1,  # Adding index as id for frontend
                "name": business.company_name,
                "licenseExpiry": format_date(business.licence_expiry_date),
                "matafiExpiry": format_date(business.matafi_expiry_date),
                "laborExpiry": format_date(business.lec_expiry_date),
                "immigrationExpiry": format_date(business.iec_expiry_date),
                "eChannelExpiry": format_date(business.e_channel_expiry_date),
                "docName": business.name  # Include actual document name for reference
            })
        
        return {"status": "success", "data": formatted_businesses}
    
    except Exception as e:
        frappe.log_error(f"Error in get_companies API: {str(e)}")
        return {"status": "error", "message": str(e)}

@frappe.whitelist()
def add_company(company_data):
    """
    Add a new company to Business doctype
    """
    try:
        company = frappe.get_doc({
            "doctype": "Business",
            "company_name": company_data.get("name"),
            "licence_expiry_date": company_data.get("licenseExpiry"),
            "matafi_expiry_date": company_data.get("matafiExpiry"),
            "lec_expiry_date": company_data.get("laborExpiry"),
            "iec_expiry_date": company_data.get("immigrationExpiry"),
            "e_channel_expiry_date": company_data.get("eChannelExpiry"),
            "active": 1
        })
        company.insert()
        
        return {
            "status": "success", 
            "message": f"Company {company_data.get('name')} added successfully",
            "company_id": company.name
        }
    except Exception as e:
        frappe.log_error(f"Error in add_company API: {str(e)}")
        return {"status": "error", "message": str(e)}

def format_date(date_str):
    """Format date from yyyy-mm-dd to dd-mm-yyyy"""
    if not date_str:
        return ""
    
    try:
        date_obj = getdate(date_str)
        return formatdate(date_obj, "dd-mm-yyyy")
    except:
        return date_str