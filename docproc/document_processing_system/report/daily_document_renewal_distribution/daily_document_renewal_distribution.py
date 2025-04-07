# Copyright (c) 2025, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from datetime import datetime, timedelta

def execute(filters=None):
    if not filters:
        filters = {}
    
    data = get_report_data(filters)
    columns = get_columns()
    chart = get_chart_data(data)
    
    return columns, data, None, chart

def get_report_data(filters):
    conditions = "date_of_expiry >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)"
    
    if filters.get("from_date"):
        conditions += f" AND date_of_expiry >= '{filters.get('from_date')}'"
    if filters.get("to_date"):
        conditions += f" AND date_of_expiry <= '{filters.get('to_date')}'"
    if filters.get("document_type"):
        conditions += f" AND document_type = '{filters.get('document_type')}'"
    
    # Main query matching your SQL
    query = f"""
        SELECT 
            DATE_FORMAT(date_of_expiry, '%Y-%m') as month,
            document_type,
            COUNT(*) as total_docs,
            SUM(CASE 
                WHEN DATEDIFF(date_of_expiry, CURDATE()) <= 30 THEN 1 
                ELSE 0 
            END) as expiring_30_days,
            SUM(CASE 
                WHEN DATEDIFF(date_of_expiry, CURDATE()) <= 60 THEN 1 
                ELSE 0 
            END) as expiring_60_days
        FROM `tabAlert`
        WHERE {conditions}
        GROUP BY 
            DATE_FORMAT(date_of_expiry, '%Y-%m'),
            document_type
        ORDER BY month
    """
    
    result = frappe.db.sql(query, as_dict=1)
    
    # Add formatted month name and calculate percentages
    for row in result:
        date_obj = datetime.strptime(row.month, '%Y-%m')
        row.month_year = date_obj.strftime('%B %Y')
        row.thirty_day_percentage = round((row.expiring_30_days / row.total_docs * 100), 1) if row.total_docs else 0
        row.sixty_day_percentage = round((row.expiring_60_days / row.total_docs * 100), 1) if row.total_docs else 0
    
    return result

def get_columns():
    return [
        {
            "fieldname": "month_year",
            "label": _("Month"),
            "fieldtype": "Data",
            "width": 120
        },
        {
            "fieldname": "document_type",
            "label": _("Document Type"),
            "fieldtype": "Link",
            "options": "Legal Document",
            "width": 200
        },
        {
            "fieldname": "total_docs",
            "label": _("Total Documents"),
            "fieldtype": "Int",
            "width": 130
        },
        {
            "fieldname": "expiring_30_days",
            "label": _("Expiring in 30 Days"),
            "fieldtype": "Int",
            "width": 150
        },
        {
            "fieldname": "thirty_day_percentage",
            "label": _("30 Days %"),
            "fieldtype": "Float",
            "width": 100
        },
        {
            "fieldname": "expiring_60_days",
            "label": _("Expiring in 60 Days"),
            "fieldtype": "Int",
            "width": 150
        },
        {
            "fieldname": "sixty_day_percentage",
            "label": _("60 Days %"),
            "fieldtype": "Float",
            "width": 100
        }
    ]

def get_chart_data(data):
    if not data:
        return None
    
    # Group data by document type
    doc_types = list(set(row.document_type for row in data))
    months = list(set(row.month_year for row in data))
    months.sort(key=lambda x: datetime.strptime(x, '%B %Y'))
    
    datasets = []
    for doc_type in doc_types:
        values = []
        for month in months:
            value = next(
                (row.total_docs for row in data 
                 if row.document_type == doc_type and row.month_year == month),
                0
            )
            values.append(value)
        
        datasets.append({
            'name': doc_type,
            'values': values
        })
    
    return {
        'type': 'bar',
        'data': {
            'labels': months,
            'datasets': datasets
        },
        # 'colors': ['#5e64ff', '#743ee2', '#ff5858', '#ffa00a', '#00ff00', '#2490ef'],
		# 	'colors': [
        #     '#28a745',   # Green
        #     '#743ee2',   # Purple
        #     '#ff5858',   # Red
        #     '#2490ef',   # Light Blue
        #     '#7cd6fd',   # Light Sky Blue
        #     '#36414c',   # Dark Gray
        #     '#4c00b4',   # Deep Purple
        #     '#21b9e4',   # Sky Blue
        #     '#486fef',   # Royal Blue
        #     '#8b4513',   # Brown
        #     '#00ff00',   # Lime Green
        #     '#5D6D7E',   # Steel Gray
        #     '#1ABC9C',   # Turquoise
        #     '#27AE60',   # Emerald Green
        #     '#5e64ff'    # Blue
        # ],
        'height': 300,
        'axisOptions': {
            'xAxisMode': 'tick',
            'yAxisMode': 'tick',
            'xIsSeries': 1
        },
        'barOptions': {
            'stacked': 1
        }
    }