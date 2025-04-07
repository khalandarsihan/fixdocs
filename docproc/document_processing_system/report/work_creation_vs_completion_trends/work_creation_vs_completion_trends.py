# # Copyright (c) 2025, Khalandar Sihan and contributors
# # For license information, please see license.txt

from frappe import _
import frappe

def execute(filters=None):
    columns = [
        {
            "fieldname": "month_year",
            "label": _("Month"),
            "fieldtype": "Data",
            "width": 120
        },
        {
            "fieldname": "created_count",
            "label": _("Works Created"),
            "fieldtype": "Int",
            "width": 140
        },
        {
            "fieldname": "completed_count",
            "label": _("Works Completed"),
            "fieldtype": "Int",
            "width": 140
        }
    ]
    
    # SQL query to get monthly counts
    data = frappe.db.sql("""
        WITH monthly_data AS (
            SELECT 
                DATE_FORMAT(work_creation_date, '%Y-%m') as month_year,
                COUNT(*) as created_count,
                SUM(CASE WHEN status = 'Complete' THEN 1 ELSE 0 END) as completed_count
            FROM `tabWork`
            WHERE 
                work_creation_date BETWEEN 
                    DATE_SUB(CURDATE(), INTERVAL 12 MONTH) AND CURDATE()
            GROUP BY DATE_FORMAT(work_creation_date, '%Y-%m')
            ORDER BY month_year DESC
        )
        SELECT 
            month_year,
            created_count,
            completed_count
        FROM monthly_data
    """, as_dict=1)

    # Chart configuration
    chart = {
        "data": {
            "labels": [row.month_year for row in data],
            "datasets": [
                {
                    "name": "Created Count",
                    "values": [row.created_count for row in data]
                },
                {
                    "name": "Completed Count",
                    "values": [row.completed_count for row in data]
                }
            ]
        },
        "type": "bar",
        "colors": ["#4B8BF4", "#34D399"], 
        "axisOptions": {
            "xAxisMode": "tick",
            "yAxisMode": "tick",
            "yIsSeries": 1
        },
        "title": "Work Creation vs Completion Trends"
    }

    return columns, data, "Work Creation vs Completion Trends", chart