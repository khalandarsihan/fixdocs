# Copyright (c) 2024, Simon Wanyama and contributors
# For license information, please see license.txt

import frappe
import json
from frappe.model.document import Document
from frappe import _


class Alert(Document):
    def before_save(self):
        self.bill_to = self.make_bill_to()

    def make_bill_to(self):
        if self.business: 
            return self.get_doc_title("Business", self.business)
        if self.personnel_business_owner: 
            return self.get_doc_title("Business", self.personnel_business_owner)
        elif self.personnel_primary_owner: 
            return self.get_doc_title("Personnel", self.personnel_primary_owner)
        elif self.vehicle:  # Handle the vehicle case
            vehicle_id = self.vehicle.strip()

            # Validate if the vehicle exists
            if not frappe.db.exists("Car and Carrier", vehicle_id):
                frappe.throw(f"Vehicle with Mulkiya Number '{vehicle_id}' not found.")
            
            vehicle_doc = frappe.get_doc("Car and Carrier", vehicle_id)

            # Determine the owner type
            if vehicle_doc.owner_type == "Business" and vehicle_doc.business_owner:
                return self.get_doc_title("Business", vehicle_doc.business_owner)
            elif vehicle_doc.owner_type == "Personnel" and vehicle_doc.personal_owner:
                return self.get_doc_title("Personnel", vehicle_doc.personal_owner)
            else:
                frappe.throw(f"Invalid or missing owner for vehicle '{vehicle_id}'.")



    def get_doc_title(self, doctype, docname):
        return frappe.get_doc(doctype, docname).get_title()


@frappe.whitelist()
def get_bill_to_values():
	bill_to_values = frappe.db.sql_list("SELECT DISTINCT bill_to FROM `tabAlert` WHERE bill_to IS NOT NULL")
	return bill_to_values

@frappe.whitelist()
def make_alert_number_card_data():
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
	"""
	data = frappe.db.sql(query, as_dict=1)

	return {
		"value": len([d for d in data if d["status"] == "Open"]),
		"fieldtype": "Link",
		"options": "Report",
		"default": "Expiring Documents",
		"route_options": {"status": "Open"},
		"route": ["query-report", "Expiring Documents"]
	}


@frappe.whitelist()
def create_estimate_from_alerts(selected_rows):
    try:
        if isinstance(selected_rows, str):
            selected_rows = json.loads(selected_rows)
            
        if not selected_rows:
            return {"success": False, "message": "No alerts selected"}
        
        # Create new Service Estimate
        estimate = frappe.new_doc("Service Estimate")
        first_row = selected_rows[0]
        bill_to = first_row.get("bill_to")
        
        # Set quotation_to based on bill_to
        if frappe.db.exists("Business", bill_to):
            estimate.quotation_to = "Business"
            estimate.business_name = bill_to
        elif frappe.db.exists("Personnel", bill_to):
            estimate.quotation_to = "Personnel"
            estimate.personnel_name = bill_to

        # Add each alert as a service row
        for row in selected_rows:
            service_template = frappe.get_doc("Service Template", {
                "legal_document": row.get("document"),
                "service_type": "Renewal"
            })
            
            # Add to quotation_services
            service_row = estimate.append("quotation_services", {
                "service_name": service_template.name,
                "alert": row.get("alert_id"),  # Link alert ID
                "service_for": row.get("owner"),  # Vehicle/Business/Personnel from alert
                "service_sequence": len(estimate.quotation_services) + 1
            })

            # Add items from service template
            for charge in service_template.service_charge_item:
                estimate.append("items", {
                    "item_code": charge.item_code,
                    "item_name": charge.item_name,
                    "qty": charge.quantity,
                    "rate": charge.rate,
                    "amount": charge.rate * charge.quantity,
                    "uom": charge.uom,
                    "custom_service": service_template.name,
                    "custom_service_for": service_row.service_for,
                    "custom_service_sequence": service_row.service_sequence,
                    "income_account": frappe.get_cached_value('Company',
                        frappe.defaults.get_user_default("Company"),
                        'default_income_account'),
                    "cost_center": frappe.get_cached_value('Company',
                        frappe.defaults.get_user_default("Company"),
                        'cost_center'),
                    "conversion_factor": 1,
                    "base_rate": charge.rate,
                    "base_amount": charge.rate * charge.quantity
                })

        # Calculate totals before inserting
        estimate.calculate_totals()
        estimate.insert()
            
        # Update all alerts with this estimate reference
        for row in selected_rows:
            frappe.db.set_value("Alert", row.get("alert_id"), {
                "linked_service_estimate": estimate.name,
                "status": "Service Estimate"
            })
            
        return {
            "success": True,
            "estimate_url": f"/app/service-estimate/{estimate.name}"
        }
        
    except Exception as e:
        frappe.log_error("Service Estimate Creation Error", str(e))
        return {"success": False, "message": str(e)}
