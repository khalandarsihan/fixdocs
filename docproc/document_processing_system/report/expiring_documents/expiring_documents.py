import frappe
from frappe import _


def execute(filters=None):
	if filters == None:
		filters = {}

	columns = get_columns()
	data = get_data(filters)

	charts = get_charts(data)[1]
	summary = get_summary(data)

	return columns, data, None, None, summary

def get_columns():
    return [
        {"label": _("Document"), "fieldname": "document_type", "fieldtype": "Data", "width": 150},
        {"label": _("Document ID"), "fieldname": "document_id", "fieldtype": "Data", "width": 150},
		{"label": _("Status"), "fieldname": "status", "fieldtype": "Data", "width": 100},
		{"label": _("Bill To"), "fieldname": "bill_to", "fieldtype": "Data", "width": 150},
        {"label": _("Date of Issue"), "fieldname": "date_of_issue", "fieldtype": "Date", "width": 100},
        {"label": _("Date of Expiry"), "fieldname": "date_of_expiry", "fieldtype": "Date", "width": 100},
        {"label": _("Expires In"), "fieldname": "expires_in", "fieldtype": "Int", "width": 100},
        {"label": _("Alert"), "fieldname": "alert_name", "fieldtype": "Link", "options": "Alert", "width": 150},
        {"label": _("Alert Type"), "fieldname": "alert_type", "fieldtype": "Data", "width": 100},
        {"label": _("Created On"), "fieldname": "creation", "fieldtype": "Date", "width": 100},
        {"label": _("Last Updated On"), "fieldname": "modified", "fieldtype": "Date", "width": 100}
    ]

def get_data(filters):
	conditions = get_conditions(filters)
	query = f"""
		SELECT
			ad.document_type,
			ad.document_id,
			ad.date_of_issue,
			ad.date_of_expiry,
			CAST(ad.expires_in AS INT) as expires_in,
			a.name as alert_name,
			a.alert_type,
			a.bill_to,
			a.status,
			a.creation,
			a.modified
		FROM
			`tabAlert` a
			JOIN `tabAlert Documents` ad ON a.name = ad.parent
		WHERE
			{conditions}
	"""
	data = frappe.db.sql(query, filters, as_dict=1)
	return data

def get_conditions(filters):
    conditions = ["1=1"]
    if filters.get("status"):
        conditions.append("a.status = %(status)s")
    if filters.get("bill_to"):
        conditions.append("a.bill_to = %(bill_to)s")
    if filters.get("expires_in"):
        conditions.append("CAST(ad.expires_in AS INT) <= %(expires_in)s")
    if filters.get("alert_type"):
        conditions.append("a.alert_type = %(alert_type)s")

    return " AND ".join(conditions)

def get_charts(data):
    document_types = {}
    for row in data:
        document_type = row["document_type"]
        if document_type:
            document_types[document_type] = document_types.get(document_type, 0) + 1
    
    chart1 = {
        "type": "pie",
        "title": "Document Types Distribution",
        "data": {
            "labels": list(document_types.keys()),
            "datasets": [{
                "values": list(document_types.values())
            }]
        }
    }
    
    bill_tos = {}
    for row in data:
        bill_to = row["bill_to"]
        if bill_to:
            bill_tos[bill_to] = bill_tos.get(bill_to, 0) + 1
    
    chart2 = {
        "type": "bar",
        "title": "Documents by Bill To",
        "data": {
            "labels": list(bill_tos.keys()),
            "datasets": [{
                "values": list(bill_tos.values())
            }]
        }
    }

    return [chart1, chart2]

def get_summary(data):
	total_documents = len(data)
	expiring_soon = len([d for d in data if 0 < int(d['expires_in']) <= 7])
	alert_type_distribution = {
		"Personnel": len([d for d in data if d['alert_type'] == "Personnel"]),
		"Business": len([d for d in data if d['alert_type'] == "Business"])
	}

	personnel_type = alert_type_distribution["Personnel"]
	business_type = alert_type_distribution["Business"]
	
	avg_time_to_expiry = sum([int(d['expires_in']) for d in data]) / total_documents if total_documents > 0 else 0
	avg_time_to_expiry = round(avg_time_to_expiry, 1)


	expire_in_7_days = f'<a href="/app/query-report/Expiring%20Documents?status=Open&expires_in=7" style="color:red">{expiring_soon}</a>'
	personnel_docs = f'<a href="/app/query-report/Expiring%20Documents?status=Open&alert_type=Personnel&expires_in=30" style="color:orange">{personnel_type}</a>'
	business_docs = f'<a href="/app/query-report/Expiring%20Documents?status=Open&alert_type=Business&expires_in=30" style="color:orange">{business_type}</a>'

	report_summary = [
		{"value": total_documents, "label": "Total Alert Docs", "datatype": "Data"},
		{"value": expire_in_7_days, "label": "Critical (7 days)", "datatype": "Data"},
		{"value": personnel_docs, "label": "Personnel Docs", "datatype": "Data"},
		{"value": business_docs, "label": "Business Docs", "datatype": "Data"},
		{"value": f'{avg_time_to_expiry} days', "label": "Average Time to Expiry", "datatype": "Data"},
	]

	return report_summary
