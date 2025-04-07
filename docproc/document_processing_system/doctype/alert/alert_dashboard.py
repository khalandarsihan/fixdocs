from frappe import _

def get_data():
    return {
        "fieldname": "alert",  
        "non_standard_fieldnames": {
            "Service Estimate": "alert",  
        },
        "transactions": [
            {"items": ["Service Estimate"]}, 
        ],
    }
