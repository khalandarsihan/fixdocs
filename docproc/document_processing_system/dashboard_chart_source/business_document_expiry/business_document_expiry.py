import frappe
import datetime
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
    if filters is None:
        filters = {}

    filters = frappe.parse_json(filters)

    # document_type = filters.get("document_type", "Business")
    expiry_range = int(filters.get("expiry_range", 30))

    return get_business_document_expiry(filters, expiry_range)

    # if document_type == "Business":
    #     return get_business_document_expiry(filters, expiry_range)
    # elif document_type == "Personnel":
    #     return get_personnel_document_expiry(filters, expiry_range)
    # else:
    #     return []

def get_business_document_expiry(filters, expiry_range):
    business_filters = [["active", "=", 1]]
    
    business_list = {
        "Commercial Licence": [],
        "Matafi": [],
        "Immigration Card": [],
        "Labor Card": [],
        "E-Channel": []
    }
    
    business_fields = [
        "name", "licence_issue_date", "licence_expiry_date",
        "matafi_issue_date", "matafi_expiry_date",
        "iec_issue_date", "iec_expiry_date",
        "lec_issue_date", "lec_expiry_date",
        "e_channel_expiry_date"
    ]
    businesses = frappe.get_list("Business", filters=business_filters, fields=business_fields, order_by="name")
    for business in businesses:
        business_list["Commercial Licence"].append({"licence_issue_date": business.get("licence_issue_date"), "licence_expiry_date": business.get("licence_expiry_date")})
        business_list["Matafi"].append({"matafi_issue_date": business.get("matafi_issue_date"), "matafi_expiry_date": business.get("matafi_expiry_date")})
        business_list["Immigration Card"].append({"iec_issue_date": business.get("iec_issue_date"), "iec_expiry_date": business.get("iec_expiry_date")})
        business_list["Labor Card"].append({"lec_issue_date": business.get("lec_issue_date"), "lec_expiry_date": business.get("lec_expiry_date")})
        business_list["E-Channel"].append({"e_channel_expiry_date": business.get("e_channel_expiry_date")})
    
    if not businesses:
        return []

    result = count_expiring_records(business_list, expiry_range)

    labels = list(result.keys())
    datapoints = list(result.values())

    return {
        "labels": labels,
        "datasets": [{"name": _("Expire in next {} days".format(expiry_range)), "values": datapoints}],
        "type": "pie",
    }

# def get_personnel_document_expiry(filters, expiry_range):
#     personnel_filters = [["active", "=", 1]]

#     personnel_list = {
#         "Passport": [],
#         "VISA": [],
#         "Emirates Card": [],
#         "Labor Card": [],
#         "Health Insurance": [],
#         "ILOEA": [],
#         "Signature Card": [],
#         "Driving Licence": []
#     }
    
#     personnel_fields = [
#         "name", "passport_date_of_issue", "passport_date_of_expiry",
#         "visa_date_of_issue", "visa_date_of_expiry",
#         "emirates_card_date_of_issue", "emirates_card_date_of_expiry",
#         "labor_card_date_of_issue", "labor_card_date_of_expiry",
#         "health_insurance_date_of_issue", "health_insurance_date_of_expiry",
#         "iloea_date_of_expiry", 
#         "signature_card_date_of_issue", "signature_card_date_of_expiry",
#         "driving_licence_date_of_issue", "driving_licence_date_of_expiry"
#     ]
#     personnel = frappe.get_list("Personnel", filters=personnel_filters, fields=personnel_fields, order_by="name")
#     for person in personnel:
#         personnel_list["Passport"].append({"passport_date_of_issue": person.get("passport_date_of_issue"), "passport_date_of_expiry": person.get("passport_date_of_expiry")})
#         personnel_list["VISA"].append({"visa_date_of_issue": person.get("visa_date_of_issue"), "visa_date_of_expiry": person.get("visa_date_of_expiry")})
#         personnel_list["Emirates Card"].append({"emirates_card_date_of_issue": person.get("emirates_card_date_of_issue"), "emirates_card_date_of_expiry": person.get("emirates_card_date_of_expiry")})
#         personnel_list["Labor Card"].append({"labor_card_date_of_issue": person.get("labor_card_date_of_issue"), "labor_card_date_of_expiry": person.get("labor_card_date_of_expiry")})
#         personnel_list["Health Insurance"].append({"health_insurance_date_of_issue": person.get("health_insurance_date_of_issue"), "health_insurance_date_of_expiry": person.get("health_insurance_date_of_expiry")})
#         personnel_list["ILOEA"].append({"iloea_date_of_expiry": person.get("iloea_date_of_expiry")})
#         personnel_list["Signature Card"].append({"signature_card_date_of_issue": person.get("signature_card_date_of_issue"), "signature_card_date_of_expiry": person.get("signature_card_date_of_expiry")})
#         personnel_list["Driving Licence"].append({"driving_licence_date_of_issue": person.get("driving_licence_date_of_issue"), "driving_licence_date_of_expiry": person.get("driving_licence_date_of_expiry")})
    
#     if not personnel:
#         return []

#     result = count_expiring_records(personnel_list, expiry_range)

#     labels = list(result.keys())
#     datapoints = list(result.values())

#     return {
#         "labels": labels,
#         "datasets": [{"name": _("Expire in next {} days".format(expiry_range)), "values": datapoints}],
#         "type": "pie",
#     }

def is_expiring_within_days(expiry_date, min_days, max_days):
    if expiry_date is None:
        return False
    today = datetime.date.today()
    min_date = today + datetime.timedelta(days=min_days)
    max_date = today + datetime.timedelta(days=max_days)
    return min_date <= expiry_date <= max_date

def count_expiring_records(data, days):
    result = {}
    if days == 7:
        min_days = 1
        max_days = 7
    elif days == 30:
        min_days = 7
        max_days = 30
    elif days == 90:
        min_days = 30
        max_days = 90

    for key, value_list in data.items():
        count = 0
        for item in value_list:
            for k, v in item.items():
                if 'expiry' in k and is_expiring_within_days(v, min_days, max_days):
                    count += 1
        result[key] = count
    return result
