# Copyright (c) 2024, Khalandar Sihan and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _

def execute(filters=None):
    if not filters:
        filters = {}

    columns = get_columns()
    data = get_data(filters)
    chart = get_chart(data)
    summary = get_summary(data)
    
    return columns, data, None, chart, summary

def get_columns():
    return [
        {
            "fieldname": "aging_bucket",
            "label": _("Age"),
            "fieldtype": "Data",
            "width": 120
        },
        {
            "fieldname": "work_count",
            "label": _("Count"),
            "fieldtype": "Int",
            "width": 100
        },
        {
            "fieldname": "avg_days_open",
            "label": _("Avg Days Open"),
            "fieldtype": "Float",
            "width": 120,
            "precision": 1
        },
        {
            "fieldname": "total_progress",
            "label": _("Avg Progress %"),
            "fieldtype": "Float",
            "width": 120,
            "precision": 1
        }
    ]

def get_filters(filters):
    conditions = []
    
    if filters.get("business_name"):
        conditions.append("business_name = %(business_name)s")
    
    if filters.get("service_name"):
        conditions.append("service_name = %(service_name)s")
    
    if filters.get("personnel_name"):
        conditions.append("personnel_name = %(personnel_name)s")
    
    if filters.get("from_date"):
        conditions.append("work_creation_date >= %(from_date)s")
    
    if filters.get("to_date"):
        conditions.append("work_creation_date <= %(to_date)s")
    
    return " AND ".join(conditions) if conditions else ""

def get_data(filters):
    conditions = get_filters(filters)
    where_clause = f"WHERE status IN ('Open', 'Working') AND work_creation_date IS NOT NULL {f'AND {conditions}' if conditions else ''}"
    
    query = f"""
        SELECT 
            CASE 
                WHEN DATEDIFF(CURDATE(), work_creation_date) <= 7 THEN '0-7 days'
                WHEN DATEDIFF(CURDATE(), work_creation_date) <= 15 THEN '8-15 days'
                WHEN DATEDIFF(CURDATE(), work_creation_date) <= 30 THEN '16-30 days'
                WHEN DATEDIFF(CURDATE(), work_creation_date) <= 60 THEN '31-60 days'
                ELSE 'Over 60 days'
            END as aging_bucket,
            COUNT(*) as work_count,
            AVG(DATEDIFF(CURDATE(), work_creation_date)) as avg_days_open,
            AVG(IFNULL(progress_percentage, 0)) as total_progress
        FROM 
            `tabWork` 
        {where_clause}
        GROUP BY 
            CASE 
                WHEN DATEDIFF(CURDATE(), work_creation_date) <= 7 THEN '0-7 days'
                WHEN DATEDIFF(CURDATE(), work_creation_date) <= 15 THEN '8-15 days'
                WHEN DATEDIFF(CURDATE(), work_creation_date) <= 30 THEN '16-30 days'
                WHEN DATEDIFF(CURDATE(), work_creation_date) <= 60 THEN '31-60 days'
                ELSE 'Over 60 days'
            END
        ORDER BY 
            MIN(DATEDIFF(CURDATE(), work_creation_date))
    """
    
    return frappe.db.sql(query, filters, as_dict=1)

# def get_chart(data):
#     if not data:
#         return None

#     labels = [d.aging_bucket for d in data]
#     work_counts = [d.work_count for d in data]
#     progress_data = [d.total_progress for d in data]

#     return {
#         "data": {
#             "labels": labels,
#             "datasets": [
#                 {
#                     "name": "Work Count",
#                     "values": work_counts,
#                     "chartType": "bar",
#                 },
#                 {
#                     "name": "Average Progress",
#                     "values": progress_data,
#                     "chartType": "line",
#                 }
#             ]
#         },
#         "type": "bar",
#         "height": 300,
#         "colors": ["#5e64ff", "#28a745"],
#         "axisOptions": {
#             "xAxisMode": "tick",
#             "yAxisMode": "tick",
#             "yIsSeries": 1
#         }
#     }


def get_chart(data):
    if not data:
        return None

    labels = [d.aging_bucket for d in data]
    work_counts = [d.work_count for d in data]
    progress_data = [d.total_progress for d in data]

    return {
        "type": "bar",  # Just keep it as "bar"
        "data": {
            "labels": labels,
            "datasets": [
                {
                    "name": "Work Count",
                    "values": work_counts,
                    "chartType": 'bar',  # Explicitly set chartType here
                    "color": "#ff69b4"
                },
                {
                    "name": "Average Progress",
                    "values": progress_data,
                    "chartType": 'line',  # Explicitly set chartType here
                    "color": "#4682b4"
                }
            ]
        },
        "height": 300,
        "colors": ["#ff69b4", "#4682b4"]
        # "colors": ["#5e64ff", "#28a745"],
    }

def get_summary(data):
    if not data:
        return None
        
    total_works = sum(d.work_count for d in data)
    total_progress = sum(d.total_progress * d.work_count for d in data) / total_works if total_works else 0
    avg_days = sum(d.avg_days_open * d.work_count for d in data) / total_works if total_works else 0
    
    return {
        "total_open_works": total_works,
        "average_age": round(avg_days, 1),
        "average_progress": round(total_progress, 1)
    }

def get_report_filters():
    return [
        {
            "fieldname": "from_date",
            "label": _("From Date"),
            "fieldtype": "Date",
            "default": frappe.utils.add_months(frappe.utils.nowdate(), -3)
        },
        {
            "fieldname": "to_date",
            "label": _("To Date"),
            "fieldtype": "Date",
            "default": frappe.utils.nowdate()
        },
        {
            "fieldname": "business_name",
            "label": _("Business"),
            "fieldtype": "Link",
            "options": "Business"
        },
        {
            "fieldname": "service_name",
            "label": _("Service"),
            "fieldtype": "Link",
            "options": "Service Template"
        },
        {
            "fieldname": "personnel_name",
            "label": _("Personnel"),
            "fieldtype": "Link",
            "options": "Personnel"
        }
    ]