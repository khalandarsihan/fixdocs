# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _

def execute(filters=None):
    if not filters:
        filters = {}
        
    columns = [
        {
            "fieldname": "month",
            "label": _("Month"),
            "fieldtype": "Data",
            "width": 120
        },
        {
            "fieldname": "alert_type", 
            "label": _("Alert Type"),
            "fieldtype": "Data",
            "width": 120
        },
        {
            "fieldname": "status",
            "label": _("Status"),
            "fieldtype": "Data",
            "width": 120
        },
        {
            "fieldname": "count",
            "label": _("Count"),
            "fieldtype": "Int",
            "width": 120
        }
    ]
    
    data = frappe.db.sql("""
        SELECT 
            DATE_FORMAT(creation, '%y-%m') as month,
            alert_type,
            status,
            COUNT(*) as count
        FROM `tabAlert`
        GROUP BY 
            DATE_FORMAT(creation, '%y-%m'),
            alert_type,
            status
        ORDER BY 
            STR_TO_DATE(CONCAT('20', DATE_FORMAT(creation, '%y-%m'), '-01'), '%Y-%m-%d') DESC
    """, as_dict=1)
    
    # Get sorted months for labels
    months = list(set(d.month for d in data))
    months.sort(reverse=True)  # Sort in descending order (most recent first)
    
    # Get unique alert types
    alert_types = list(set(d.alert_type for d in data if d.alert_type))
    
    # Prepare datasets
    datasets = []
    for alert_type in alert_types:
        dataset = {
            "name": alert_type,
            "values": []
        }
        for month in months:
            count = sum(d.count for d in data if d.month == month and d.alert_type == alert_type)
            dataset["values"].append(count)
        datasets.append(dataset)
    
    chart = {
        "data": {
            "labels": months,
            "datasets": datasets
        },
        "type": "line",  # Changed to line as per screenshot
        "height": 300,
        "colors": ["#ff69b4", "#4169e1", "#32cd32"]  # Pink for Business, Blue for Vehicle, Green for Personnel
    }
    
    return columns, data, None, chart