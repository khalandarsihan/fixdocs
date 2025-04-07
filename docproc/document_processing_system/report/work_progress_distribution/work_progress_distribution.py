# Copyright (c) 2024, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def execute(filters=None):
    if not filters:
        filters = {}
    
    columns = get_columns()
    data = get_data(filters)
    chart = get_chart(data)
    
    return columns, data, None, chart

def get_columns():
    return [
        {
            "fieldname": "progress_range",
            "label": _("Progress Range"),
            "fieldtype": "Data",
            "width": 120
        },
        {
            "fieldname": "work_count",
            "label": _("Number of Works"),
            "fieldtype": "Int",
            "width": 120
        },
        {
            "fieldname": "percentage",
            "label": _("Percentage"),
            "fieldtype": "Percent",
            "width": 120
        }
    ]

def get_data(filters):
    conditions = ["status IN ('Open', 'Working')"]
    
    if filters.get("from_date"):
        conditions.append("work_creation_date >= %(from_date)s")
    if filters.get("to_date"):
        conditions.append("work_creation_date <= %(to_date)s")
    if filters.get("business_name"):
        conditions.append("business_name = %(business_name)s")
    if filters.get("service_name"):
        conditions.append("service_name = %(service_name)s")
    
    where_clause = " AND ".join(conditions)
    
    query = f"""
        WITH progress_ranges AS (
            SELECT 
                CASE 
                    WHEN progress_percentage = 0 THEN 'Not Started'
                    WHEN progress_percentage BETWEEN 1 AND 25 THEN '1-25%%'
                    WHEN progress_percentage BETWEEN 26 AND 50 THEN '26-50%%'
                    WHEN progress_percentage BETWEEN 51 AND 75 THEN '51-75%%'
                    WHEN progress_percentage BETWEEN 76 AND 99 THEN '76-99%%'
                    WHEN progress_percentage = 100 THEN 'Complete'
                END as progress_range,
                COUNT(*) as work_count
            FROM `tabWork`
            WHERE {where_clause}
            GROUP BY 
                CASE 
                    WHEN progress_percentage = 0 THEN 'Not Started'
                    WHEN progress_percentage BETWEEN 1 AND 25 THEN '1-25%%'
                    WHEN progress_percentage BETWEEN 26 AND 50 THEN '26-50%%'
                    WHEN progress_percentage BETWEEN 51 AND 75 THEN '51-75%%'
                    WHEN progress_percentage BETWEEN 76 AND 99 THEN '76-99%%'
                    WHEN progress_percentage = 100 THEN 'Complete'
                END
        )
        SELECT 
            progress_range,
            work_count,
            ROUND((work_count * 100.0) / NULLIF((SELECT SUM(work_count) FROM progress_ranges), 0), 2) as percentage
        FROM progress_ranges
        ORDER BY 
            FIELD(progress_range, 'Not Started', '1-25%%', '26-50%%', '51-75%%', '76-99%%', 'Complete');
    """
    
    try:
        data = frappe.db.sql(query, filters, as_dict=1)
        # frappe.msgprint(f"Debug - Query: {query}")  # Debug message
        # frappe.msgprint(f"Debug - Data: {data}")    # Debug message
        return data or []
    except Exception as e:
        frappe.log_error(f"Query Report Error: {str(e)}\nQuery: {query}", "Work Progress Report Error")
        return []

def get_chart(data):
    if not data:
        return None

    labels = [d.progress_range for d in data]
    datasets = [{
        'name': _('Number of Works'),
        'values': [d.work_count for d in data]
    }]

    return {
        'data': {
            'labels': labels,
            'datasets': datasets
        },
        'type': 'bar',
        'height': 300,
        'colors': ['#7CD6FD']
    }