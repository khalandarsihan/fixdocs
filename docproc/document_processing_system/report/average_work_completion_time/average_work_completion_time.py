# Copyright (c) 2025, Simon Wanyama and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def execute(filters=None):
    columns = [
        {
            "fieldname": "service_name",
            "label": _("Service Type"),
            "fieldtype": "Link",
            "options": "Service Template",
            "width": 200
        },
        {
            "fieldname": "avg_completion_hours",
            "label": _("Average Completion Time (Hours)"),
            "fieldtype": "Float",
            "precision": 2,
            "width": 200
        }
    ]

    data = get_data(filters)
    
    chart = {
        "type": "bar",
        "data": {
            "labels": [row.service_name for row in data],
            "datasets": [
                {
                    "name": "Average Completion Time",
                    "values": [row.avg_completion_hours for row in data]
                }
            ]
        },
        "colors": ["#6495ED"],
        "axisOptions": {
            "xAxisMode": "tick",
            "yAxisMode": "span"
        }
    }

    return columns, data, None, chart

def get_data(filters):
    return frappe.db.sql("""
        SELECT 
            service_name,
            AVG(
                TIMESTAMPDIFF(
                    HOUR,
                    creation,
                    modified
                )
            ) as avg_completion_hours
        FROM 
            `tabWork`
        WHERE 
            status = 'Complete'
            AND creation >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY 
            service_name
        HAVING 
            avg_completion_hours > 0
        ORDER BY 
            avg_completion_hours DESC
    """, as_dict=1)