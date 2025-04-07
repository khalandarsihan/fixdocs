# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def execute(filters=None):
    # Define columns for the report
    columns = [
        {
            "fieldname": "service_name",
            "label": _("Service Type"),
            "fieldtype": "Link",
            "options": "Service Template",
            "width": 200
        },
        {
            "fieldname": "count",
            "label": _("Number of Works"),
            "fieldtype": "Int",
            "width": 150
        }
    ]

    # Get data using the SQL query
    data = frappe.db.sql("""
        SELECT 
            service_name,
            COUNT(*) as count
        FROM 
            tabWork
        WHERE
			status != 'Cancelled'
        GROUP BY 
            service_name
        ORDER BY 
            count DESC
        LIMIT 10
    """, as_dict=1)

    # Prepare chart data
    chart = {
        "data": {
            "labels": [row.service_name for row in data],
            "datasets": [
                {
                    "name": "Number of Works",
                    "values": [row.count for row in data]
                }
            ]
        },
        "type": "bar", 
        "height": 300,
        "colors": ["#7c96fd"]
    }

    return columns, data, None, chart