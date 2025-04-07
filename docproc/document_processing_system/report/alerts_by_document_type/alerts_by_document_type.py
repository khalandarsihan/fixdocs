# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt


import frappe
from frappe import _

def execute(filters=None):
    if not filters:
        filters = {}
        
    columns = [
        {
            "fieldname": "document_type",
            "label": _("Document Type"),
            "fieldtype": "Link",
            "options": "Legal Document",
            "width": 200
        },
        {
            "fieldname": "total_alerts",
            "label": _("Total Alerts"),
            "fieldtype": "Int",
            "width": 120
        },
        {
            "fieldname": "open_alerts",
            "label": _("Open"),
            "fieldtype": "Int",
            "width": 120
        },
        {
            "fieldname": "service_estimate",
            "label": _("Service Estimates"),
            "fieldtype": "Int",
            "width": 120
        },
        {
            "fieldname": "followup_alerts",
            "label": _("Follow-up Required"),
            "fieldtype": "Int",
            "width": 150
        }
    ]

    data = frappe.db.sql("""
        SELECT 
            document_type,
            COUNT(*) as total_alerts,
            SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open_alerts,
            SUM(CASE WHEN status = 'Service Estimate' THEN 1 ELSE 0 END) as service_estimate,
            SUM(CASE WHEN status = 'Follow-Up' THEN 1 ELSE 0 END) as followup_alerts
        FROM 
            `tabAlert`
        WHERE 
            docstatus < 2
            AND creation BETWEEN %(from_date)s AND %(to_date)s
            {conditions}
        GROUP BY 
            document_type
        ORDER BY 
            total_alerts DESC
    """.format(
        conditions = "AND document_type = %(document_type)s" if filters.get("document_type") else ""
    ), filters, as_dict=1)

    chart = {
        "data": {
            "labels": [row.document_type for row in data],
            "datasets": [
                {
                    "name": _("Open Alerts"),
                    "values": [row.open_alerts for row in data]
                },
                {
                    "name": _("Service Estimates"),
                    "values": [row.service_estimate for row in data]
                },
                {
                    "name": _("Follow-up Required"),
                    "values": [row.followup_alerts for row in data]
                }
            ]
        },
        "type": "bar",
        "height": 300,
        "colors": ["#ff5858", "#28a745", "#ffc107"]
    }

    return columns, data, None, chart


