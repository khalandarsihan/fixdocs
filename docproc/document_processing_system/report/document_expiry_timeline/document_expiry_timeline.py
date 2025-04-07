# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt


import frappe
from frappe import _
from datetime import datetime, timedelta

def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    chart = get_chart_data(data)
    
    return columns, data, None, chart

def get_columns():
    return [
        {
            "fieldname": "expiry_range",
            "label": _("Expiry Range"),
            "fieldtype": "Data",
            "width": 150
        },
        {
            "fieldname": "document_count",
            "label": _("Number of Documents"),
            "fieldtype": "Int",
            "width": 150
        },
        {
            "fieldname": "alert_status",
            "label": _("Alert Status"),
            "fieldtype": "Data",
            "width": 120
        }
    ]

def get_data(filters):
    today = datetime.now().date()
    
    # Define the ranges
    ranges = [
        (0, 7, "0-7 days"),
        (8, 15, "8-15 days"),
        (16, 30, "16-30 days"),
        (31, 45, "31-45 days"),
        (46, 60, "46-60 days")
    ]
    
    data = []
    for start_days, end_days, range_label in ranges:
        start_date = today + timedelta(days=start_days)
        end_date = today + timedelta(days=end_days)
        
        count = frappe.db.sql("""
            SELECT COUNT(*) as count
            FROM tabAlert
            WHERE date_of_expiry BETWEEN %s AND %s
            AND status != 'Canceled'
        """, (start_date, end_date))[0][0]
        
        if count:
            data.append({
                "expiry_range": range_label,
                "document_count": count,
                "alert_status": "Pending" if start_days <= 7 else "Upcoming"
            })
    
    return data

def get_chart_data(data):
    if not data:
        return None
    
    labels = []
    values = []
    
    for entry in data:
        labels.append(entry.get("expiry_range"))
        values.append(entry.get("document_count"))
    
    return {
        "data": {
            "labels": labels,
            "datasets": [
                {
                    "name": "Document Count",
                    "values": values
                }
            ]
        },
        "type": "bar",
        "colors": ["#ff5858"],  # Red shade for urgency
        "barOptions": {
            "spaceRatio": 0.2
        }
    }

