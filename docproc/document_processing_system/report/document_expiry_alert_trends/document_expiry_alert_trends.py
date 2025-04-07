# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _


def execute(filters=None):
    filters = frappe._dict(filters or {})

    if filters.group_by == 'Daily':
        date_format = 'DATE(creation)'
    elif filters.group_by == 'Weekly':
        date_format = 'DATE(DATE_SUB(creation, INTERVAL WEEKDAY(creation) DAY))'
    else:  # Monthly
        # Changed format to show as MMM-YY
        date_format = "DATE_FORMAT(creation, '%%b-%%y')"
    
    query = f"""SELECT 
        {date_format} as date,
        COUNT(*) as alert_count,
        alert_type
    FROM `tabAlert`
    WHERE creation BETWEEN %(from_date)s AND %(to_date)s
    GROUP BY date, alert_type
    ORDER BY date"""

    data = frappe.db.sql(query, filters, as_dict=1)

    columns = [
        {"fieldname": "date", "label": _("Date"), "fieldtype": "Data", "width": 120},  # Changed to Data type since we're using custom format
        {"fieldname": "alert_type", "label": _("Alert Type"), "fieldtype": "Data", "width": 120},
        {"fieldname": "alert_count", "label": _("Count"), "fieldtype": "Int", "width": 100}
    ]

    return columns, data

def get_chart_data(data):
    labels = list(set(d.date for d in data))
    labels.sort()  # Sort dates in ascending order
    
    datasets = []
    alert_types = list(set(d.alert_type for d in data))
    
    for alert_type in alert_types:
        values = []
        for label in labels:
            count = next(
                (d.alert_count for d in data 
                 if d.date == label and d.alert_type == alert_type),
                0
            )
            values.append(count)
            
        datasets.append({
            "name": alert_type,
            "values": values
        })

    return {
        "data": {
            "labels": labels,
            "datasets": datasets
        },
        "type": "line",
        "height": 300,
        "colors": ["#2490ef", "#28a745", "#f3a638"]  # Blue, Green, Orange
    }