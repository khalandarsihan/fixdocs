# Copyright (c) 2025, Simon Wanyama and contributors
# For license information, please see license.txt

import frappe
import json
from frappe.model.document import Document
from frappe import _
from frappe.utils import nowdate, add_days
from erpnext.accounts.party import get_party_account
# In service_estimate.py
from docproc.document_processing_system.doctype.work.work import create_actions_from_service

# from erpnext.accounts.utils import get_account_currency


class ServiceEstimate(Document):
    def validate(self):
        if self.has_value_changed("quotation_services"):
            # Get alerts that were linked but their rows are now removed
            current_alerts = [d.alert for d in self.quotation_services if d.alert]
            removed_alerts = frappe.get_all("Alert", 
                filters={
                    "linked_service_estimate": self.name,
                    "name": ["not in", current_alerts]
                })
                
            # Reset status of removed alerts
            for alert in removed_alerts:
                frappe.db.set_value("Alert", alert.name, {
                    "linked_service_estimate": "",
                    "status": "Open"
                })


        # Calculate totals before saving
        self.calculate_totals()
        
        
    def calculate_totals(self):
        """Calculate total, total_quantity, and grand_total"""
        total = 0
        total_quantity = 0
        
        if self.items:
            for item in self.items:
                total += float(item.amount or 0)
                total_quantity += float(item.qty or 0)
        
        self.total = total
        self.total_quantity = total_quantity
        self.grand_total = total + float(self.total_taxes_and_charges or 0)
        
        # Set in_words (AED currency format)
        self.in_words = "{:,.2f}".format(self.grand_total)
        if not self.in_words.startswith('AED'):
            self.in_words = f"AED {self.in_words}"


@frappe.whitelist()
def get_business_staff(doctype, txt, searchfield, start, page_len, filters):
   return frappe.db.sql("""
       SELECT staff_name FROM `tabBusiness Staff`
       WHERE parent = %(business_name)s
   """, {"business_name": filters.get("business_name")})



@frappe.whitelist()
def get_personnel_dependents(doctype, txt, searchfield, start, page_len, filters):
   dependents = list(frappe.db.sql("""
       SELECT dependent_name FROM `tabPersonnel Dependents`
       WHERE parent = %(personnel_name)s
   """, {"personnel_name": filters.get("personnel_name")}))


   # Append personnel_name to the result
   personnel_name = filters.get("personnel_name")
   if personnel_name:
       dependents.append((personnel_name,))


   return dependents

@frappe.whitelist()
def get_business_vehicles(doctype, txt, searchfield, start, page_len, filters):
   return frappe.db.sql("""
       SELECT license_plate_number FROM `tabVehicles`
       WHERE parent = %(business_name)s
   """, {"business_name": filters.get("business_name")})


@frappe.whitelist()
def get_personnel_vehicles(doctype, txt, searchfield, start, page_len, filters):
   return frappe.db.sql("""
       SELECT license_plate_number FROM `tabVehicles`
       WHERE parent = %(personnel_name)s
   """, {"personnel_name": filters.get("personnel_name")})
   

@frappe.whitelist()
def create_works(service_estimate):
    """Create Work records from Service Estimate"""
    estimate = frappe.get_doc("Service Estimate", service_estimate)
    created_works = []

    for service in estimate.quotation_services:
        # Create new Work document
        work = frappe.new_doc("Work")
        
        # Copy basic fields
        work.service_name = service.service_name
        work.linked_service_estimate = estimate.name
        
        # Copy quotation_to related fields
        if estimate.quotation_to == "Business":
            work.business_name = estimate.business_name
        elif estimate.quotation_to == "Personnel":
            work.personnel_name = estimate.personnel_name

        # Determine and set service_for fields
        if frappe.db.exists("Business", {"company_name": service.service_for}):
            work.service_for_business = service.service_for
        elif frappe.db.exists("Personnel", {"full_name": service.service_for}):
            work.service_for_person = service.service_for
        elif frappe.db.exists("Car and Carrier", {"license_plate_number": service.service_for}):
            work.service_for_vehicle = service.service_for

        # Copy service tasks from template
        service_template = frappe.get_doc("Service Template", service.service_name)
        for task in service_template.service_task:
            work.append("service_task", {
                "action": task.subject,
                "task_type": task.task_type,
                "mode": task.mode
            })

        work.insert()
        created_works.append(work.name)
        
        # Call the function to create actions
        create_actions_from_service(work.name, service.service_name)
        
        # Update status based on current status
        new_status = None
        if estimate.status == "To Work and Bill":
            new_status = "To Bill"
        elif estimate.status == "To Work":
            new_status = "Complete"
            
        if new_status:
            estimate.status = new_status
            estimate.save()

    return created_works


@frappe.whitelist()
def create_sales_invoice(service_estimate):
    """Create Sales Invoice from Service Estimate"""
    estimate = frappe.get_doc("Service Estimate", service_estimate)
    
    # Create new Sales Invoice
    si = frappe.new_doc("Sales Invoice")
    
    # Set customer based on quotation_to
    if estimate.quotation_to == "Business":
        si.customer = estimate.business_name
    else:
        si.customer = estimate.personnel_name
    
    # Set company details
    si.company = frappe.defaults.get_user_default("Company")
    si.posting_date = nowdate()
    
    # Get payment terms
    si.payment_due_date = add_days(nowdate(), int(estimate.payment_due_days or 0))
        
    # Set accounting details
    si.debit_to = get_party_account("Customer", si.customer, si.company)
    si.currency = frappe.defaults.get_user_default("Currency") or \
                 frappe.get_cached_value('Company', si.company, 'default_currency')
    si.conversion_rate = 1.0
    si.price_list_currency = si.currency
    si.plc_conversion_rate = 1.0
    
    # Link back to service estimate
    si.custom_linked_service_estimate = estimate.name
    
    # Copy quotation services
    for service in estimate.quotation_services:
        si.append('custom_quotation_services', {
            'service_name': service.service_name,
            'service_for': service.service_for,
            'service_sequence': service.service_sequence
        })
    
    # Copy items
    for item in estimate.items:
        si_item = si.append('items', {})
        si_item.update({
            'item_code': item.item_code,
            'item_name': item.item_name,
            'description': item.description,
            'qty': item.qty,
            'rate': item.rate,
            'amount': item.amount,
            'uom': item.uom,
            'custom_service': item.custom_service,
            'custom_service_for': item.custom_service_for,
            'custom_service_sequence': item.custom_service_sequence,
            'income_account': item.income_account,
            'cost_center': item.cost_center,
            # 'uom_conversion_factor': item.uom_conversion_factor,
            'conversion_factor': item.conversion_factor,
            'base_rate': item.base_rate,
            'base_amount': item.base_amount
        })
    
    si.set_missing_values()
    si.calculate_taxes_and_totals()
    si.insert(ignore_permissions=True)
    
    # Update service estimate
    estimate.linked_sales_invoice = si.name 
    estimate.save()
    
    return si.name


@frappe.whitelist()
def update_estimate_status(estimate_name, invoice_name):
    """Update Service Estimate status when Sales Invoice is submitted"""
    try:
        estimate = frappe.get_doc("Service Estimate", estimate_name)
        invoice = frappe.get_doc("Sales Invoice", invoice_name)
        
        if invoice.docstatus == 1:
            if estimate.status == "To Work and Bill":
                estimate.status = "To Work"
            elif estimate.status == "To Bill":
                estimate.status = "Complete"
            
            estimate.save(ignore_permissions=True)
            frappe.db.commit()
            return True
            
        return False
        
    except Exception as e:
        frappe.log_error(str(e), "Service Estimate Status Update Error")
        return False