# # Copyright (c) 2025, Simon Wanyama and contributors
# # For license information, please see license.txt

# import frappe
# from frappe import _

# def execute(filters=None):
#     if not filters:
#         filters = {}
        
#     if not filters.get("from_date"):
#         filters["from_date"] = frappe.utils.add_months(frappe.utils.nowdate(), -1)
#     if not filters.get("to_date"):
#         filters["to_date"] = frappe.utils.nowdate()
    
#     # First get all unique dates and statuses
#     query = """
#         SELECT DISTINCT
#             DATE(creation) as date,
#             status
#         FROM 
#             `tabWork`
#         WHERE 
#             creation BETWEEN %(from_date)s AND %(to_date)s
#         ORDER BY 
#             date
#     """
    
#     raw_data = frappe.db.sql(query, filters, as_dict=1)
    
#     # Get the count for each status on each date
#     pivot_query = """
#         SELECT 
#             DATE(creation) as date,
#             SUM(IF(status = 'Open', 1, 0)) as Open,
#             SUM(IF(status = 'Working', 1, 0)) as Working,
#             SUM(IF(status = 'Complete', 1, 0)) as Complete,
#             SUM(IF(status = 'Cancelled', 1, 0)) as Cancelled
#         FROM 
#             `tabWork`
#         WHERE 
#             creation BETWEEN %(from_date)s AND %(to_date)s
#         GROUP BY 
#             DATE(creation)
#         ORDER BY 
#             date
#     """
    
#     # Define columns for the pivoted data
#     columns = [
#         {
#             "fieldname": "date",
#             "label": _("Date"),
#             "fieldtype": "Date",
#             "width": 120
#         },
#         {
#             "fieldname": "Open",
#             "label": _("Open"),
#             "fieldtype": "Int",
#             "width": 120
#         },
#         {
#             "fieldname": "Working",
#             "label": _("Working"),
#             "fieldtype": "Int",
#             "width": 120
#         },
#         {
#             "fieldname": "Complete",
#             "label": _("Complete"),
#             "fieldtype": "Int",
#             "width": 120
#         },
#         {
#             "fieldname": "Cancelled",
#             "label": _("Cancelled"),
#             "fieldtype": "Int",
#             "width": 120
#         }
#     ]
    
#     data = frappe.db.sql(pivot_query, filters, as_dict=1)
    
#     return columns, data

import frappe
from frappe import _

def execute(filters=None):
    if not filters:
        filters = {}
        
    if not filters.get("from_date"):
        filters["from_date"] = frappe.utils.add_months(frappe.utils.nowdate(), -3)
    if not filters.get("to_date"):
        filters["to_date"] = frappe.utils.nowdate()
    
    # Modified query with escaped % signs for MySQL date formatting
    pivot_query = """
        SELECT 
            STR_TO_DATE(DATE_FORMAT(creation, '%%Y-%%v'), '%%Y-%%v') as date,
            CONCAT('Week ', WEEK(creation), ' ', DATE_FORMAT(MIN(creation), '%%b')) as period,
            SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as Open,
            SUM(CASE WHEN status = 'Working' THEN 1 ELSE 0 END) as Working,
            SUM(CASE WHEN status = 'Complete' THEN 1 ELSE 0 END) as Complete,
            SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as Cancelled
        FROM 
            `tabWork`
        WHERE 
            creation BETWEEN %(from_date)s AND %(to_date)s
        GROUP BY 
            YEARWEEK(creation)
        ORDER BY 
            date
    """
    
    columns = [
        {
            "fieldname": "period",
            "label": _("Period"),
            "fieldtype": "Data",
            "width": 150
        },
        {
            "fieldname": "Open",
            "label": _("Open"),
            "fieldtype": "Int",
            "width": 120
        },
        {
            "fieldname": "Working",
            "label": _("Working"),
            "fieldtype": "Int",
            "width": 120
        },
        {
            "fieldname": "Complete",
            "label": _("Complete"),
            "fieldtype": "Int",
            "width": 120
        },
        {
            "fieldname": "Cancelled",
            "label": _("Cancelled"),
            "fieldtype": "Int",
            "width": 120
        }
    ]
    
    data = frappe.db.sql(pivot_query, filters, as_dict=1)
    
    return columns, data


# import frappe
# from frappe import _

# def execute(filters=None):
#     if not filters:
#         filters = {}
        
#     if not filters.get("from_date"):
#         filters["from_date"] = frappe.utils.add_months(frappe.utils.nowdate(), -2)
#     if not filters.get("to_date"):
#         filters["to_date"] = frappe.utils.nowdate()
    
#     # Modified query for monthly grouping
#     pivot_query = """
#         SELECT 
#             DATE_FORMAT(creation, '%%Y-%%m-01') as date,
#             DATE_FORMAT(creation, '%%b %%Y') as period,
#             SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as Open,
#             SUM(CASE WHEN status = 'Working' THEN 1 ELSE 0 END) as Working,
#             SUM(CASE WHEN status = 'Complete' THEN 1 ELSE 0 END) as Complete,
#             SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as Cancelled
#         FROM 
#             `tabWork`
#         WHERE 
#             creation BETWEEN %(from_date)s AND %(to_date)s
#         GROUP BY 
#             DATE_FORMAT(creation, '%%Y-%%m')
#         ORDER BY 
#             date
#     """
    
#     columns = [
#         {
#             "fieldname": "period",
#             "label": _("Period"),
#             "fieldtype": "Data",
#             "width": 150
#         },
#         {
#             "fieldname": "Open",
#             "label": _("Open"),
#             "fieldtype": "Int",
#             "width": 120
#         },
#         {
#             "fieldname": "Working",
#             "label": _("Working"),
#             "fieldtype": "Int",
#             "width": 120
#         },
#         {
#             "fieldname": "Complete",
#             "label": _("Complete"),
#             "fieldtype": "Int",
#             "width": 120
#         },
#         {
#             "fieldname": "Cancelled",
#             "label": _("Cancelled"),
#             "fieldtype": "Int",
#             "width": 120
#         }
#     ]
    
#     data = frappe.db.sql(pivot_query, filters, as_dict=1)
    
#     return columns, data