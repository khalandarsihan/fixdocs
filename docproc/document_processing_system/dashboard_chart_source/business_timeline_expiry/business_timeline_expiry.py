import frappe
import datetime
from collections import defaultdict
from frappe import _
from frappe.utils.dashboard import cache_source


@frappe.whitelist()
@cache_source
def get(
	chart_name=None,
	chart=None,
	no_cache=None,
	filters=None,
	from_date=None,
	to_date=None,
	timespan=None,
	time_interval=None,
	heatmap_year=None,
):
    # labels, datapoints = [], []
    filters = frappe.parse_json(filters)

    business_filters = [["active", "=", 1]]
    if filters and filters.get("company"):
        business_filters.append(["company", "=", filters.get("company")])

    business_list =  []
    business_fields = [
        "name", "licence_issue_date", "licence_expiry_date",
        "matafi_issue_date", "matafi_expiry_date",
        "iec_issue_date", "iec_expiry_date",
        "lec_issue_date", "lec_expiry_date",
        "e_channel_expiry_date"
            ]
    businesses = frappe.get_list("Business", filters=business_filters, fields=business_fields, order_by="name")
    for business in businesses:
        business_list.append({
            "Commercial Licence": [{"licence_issue_date": business.get("licence_issue_date"), "licence_expiry_date": business.get("licence_expiry_date")}],
            "Matafi": [{"matafi_issue_date": business.get("matafi_issue_date"), "matafi_expiry_date": business.get("matafi_expiry_date")}],
            "Immigration Card": [{"iec_issue_date": business.get("iec_issue_date"), "iec_expiry_date": business.get("iec_expiry_date")}],
            "Labor Card": [{"lec_issue_date": business.get("lec_issue_date"), "lec_expiry_date": business.get("lec_expiry_date")}],
            "E-Channel": [{"e_channel_expiry_date": business.get("e_channel_expiry_date")}]
        })
    if not businesses:
        return []

    count_result = count_expiring_records_each_month(business_list)
    count_result = dict(count_result)

    labels = list(count_result.keys())
    datapoints = list(count_result.values())

    return {
        "labels": labels,
        "datasets": [{"name": _("Documents Expiring"), "values": datapoints}],
        "type": "bar",
    }

# Function to check if a date is within a given month
def is_expiring_in_month(expiry_date, target_year, target_month):
    if expiry_date is None:
        return False
    return expiry_date.year == target_year and expiry_date.month == target_month

# Function to count expiring records each month for the next six months
def count_expiring_records_each_month(data):
    result = defaultdict(int)
    today = datetime.date.today()
    
    for i in range(6):
        target_date = today + datetime.timedelta(days=30 * i)
        target_year, target_month = target_date.year, target_date.month
        month_name = target_date.strftime('%B')
        
        for record in data:
            for key, value_list in record.items():
                for item in value_list:
                    for k, v in item.items():
                        if 'expiry' in k and is_expiring_in_month(v, target_year, target_month):
                            result[month_name] += 1
    return result