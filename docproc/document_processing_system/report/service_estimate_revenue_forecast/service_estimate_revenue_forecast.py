# Copyright (c) 2024, Your Name and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def execute(filters=None):
    columns = [
        {
            "fieldname": "month",
            "label": _("Month"),
            "fieldtype": "Data",
            "width": 120
        },
        {
            "fieldname": "expected_revenue",
            "label": _("Expected Revenue"),
            "fieldtype": "Currency",
            "width": 150
        },
        {
            "fieldname": "historical_revenue",
            "label": _("Historical Revenue"),
            "fieldtype": "Currency",
            "width": 150
        }
    ]

    data = frappe.db.sql("""
        SELECT 
            DATE_FORMAT(date, '%Y-%m') as month,
            SUM(IF(status = 'Open' AND service_name IS NOT NULL, grand_total, 0)) as expected_revenue,
            SUM(IF(status = 'Complete' AND service_name IS NOT NULL, grand_total, 0)) as historical_revenue
        FROM 
            `tabService Estimate`
        WHERE 
            status IN ('Open', 'Complete')
            AND service_name IS NOT NULL
        GROUP BY 
            DATE_FORMAT(date, '%Y-%m')
        ORDER BY
            month DESC
    """, as_dict=1)

    chart = {
        "type": "bar",
        "data": {
            "labels": [row.month for row in data],
            "datasets": [
                {
                    "name": "Expected Revenue",
                    "values": [row.expected_revenue for row in data]
                },
                {
                    "name": "Historical Revenue",
                    "values": [row.historical_revenue for row in data]
                }
            ]
        }
    }

    return columns, data, None, chart


