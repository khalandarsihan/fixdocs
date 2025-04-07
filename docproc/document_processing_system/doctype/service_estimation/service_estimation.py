import frappe
from frappe.model.document import Document
from frappe.utils import money_in_words
from frappe.utils import cint


class ServiceEstimation(Document):
       
      
   def validate(self):
       if self.docstatus == 0:  # Only update totals in draft state
           self.update_totals_and_calculations()  
          
   def before_submit(self):
       # Final validation before submission
       if not self.quotation_services:
           frappe.throw('Cannot submit document without any services')
       self.update_totals_and_calculations()
      
   def update_totals_and_calculations(self):
       """Update all totals and calculations"""
       # Calculate total from items
       self.total = sum((item.amount or 0) for item in self.items or [])
      
       # Update total_taxes_and_charges if empty
       if not self.total_taxes_and_charges:
           self.total_taxes_and_charges = 0
          
       # Calculate grand total
       self.grand_total = self.total + (self.total_taxes_and_charges or 0)
      
       # Update in_words
       self.in_words = money_in_words(self.grand_total)
      
      
    
      
        
@frappe.whitelist()
def update_quotation_services(doc):
   """
   Update quotation services and related items
  
   Args:
       doc: Service Estimation document dict
   """
   if isinstance(doc, str):
       doc = frappe.parse_json(doc)


   # Validate required fields
   if not doc.get('service_name'):
       frappe.throw('Service Name is required')


   # For new documents, create a temporary doc
   if doc.get('__islocal'):
       service_doc = frappe.new_doc("Service Estimation")
       service_doc.update(doc)
   else:
       existing_doc = frappe.get_doc("Service Estimation", doc.get('name'))
       if existing_doc.docstatus != 0:  # 0 is draft state
           frappe.throw('Cannot modify submitted or cancelled document')
       service_doc = existing_doc


   # Get next sequence number
   next_sequence = 1
   if service_doc.get('quotation_services'):
       sequences = [svc.get('service_sequence') or 0 for svc in service_doc.quotation_services]
       next_sequence = (max(sequences) + 1) if sequences else 1


   # Get service_for value and type
   service_for = None
   service_for_field = None
  
   if doc.get('service_for_business'):
       service_for = doc.get('service_for_business')
       service_for_field = 'service_for_business'
   elif doc.get('service_for_person'):
       service_for = doc.get('service_for_person')
       service_for_field = 'service_for_person'
   elif doc.get('service_for_vehicle'):
       service_for = doc.get('service_for_vehicle')
       service_for_field = 'service_for_vehicle'
  
   if not service_for:
       frappe.throw('Service For (Business/Person/Vehicle) is required')


   # Initialize lists if they don't exist
   if not service_doc.get('quotation_services'):
       service_doc.quotation_services = []
   if not service_doc.get('items'):
       service_doc.items = []


   # Add to quotation_services
   service_doc.append('quotation_services', {
       'service_name': doc.get('service_name'),
       'service_for': service_for,
       'service_sequence': next_sequence
   })


   # Get service template items
   try:
       service_template = frappe.get_doc("Service Template", doc.get('service_name'))
      
       # Copy items from service template
       for charge_item in service_template.service_charge_item:
          
           # Get default accounts from Company
           company = doc.get('company') or frappe.defaults.get_user_default('company')
           if not company:
               frappe.throw('Please set default Company')


           # Get default accounts
           default_income_account = frappe.get_cached_value('Company', company,
               'default_income_account')
           default_cost_center = frappe.get_cached_value('Company', company,
               'cost_center')
          
           if not default_income_account:
               frappe.throw('Please set default Income Account in Company settings')
           if not default_cost_center:
               frappe.throw('Please set default Cost Center in Company settings')
              
           # Calculate amount in company currency
           amount = (charge_item.quantity or 1) * (charge_item.rate or 0)
          
          
           service_doc.append('items', {
               'item_code': charge_item.item_code,
               'item_name': charge_item.item_name,
               'qty': charge_item.quantity,
               'rate': charge_item.rate,
               'amount': (charge_item.quantity or 1) * (charge_item.rate or 0),
               'uom': charge_item.uom,
               'custom_service': doc.get('service_name'),
               'custom_service_for': service_for,
               'custom_service_sequence': next_sequence,
               'income_account': default_income_account,
               'cost_center': default_cost_center,
               'uom_conversion_factor': 1,
               'base_rate': charge_item.rate,
               'base_amount': amount,
               'conversion_factor': 1
           })
   except Exception as e:
       frappe.log_error(f"Error copying service template items: {str(e)}")
       frappe.throw(f"Error copying service template items: {str(e)}")


    
  
   if doc.get('__islocal'):
       service_doc.update_totals_and_calculations()
       return service_doc.as_dict()
   else:
       service_doc.save()
       return service_doc.as_dict()


  
  
@frappe.whitelist()
def remove_service_items(doc, service_sequence):
   if isinstance(doc, str):
       doc = frappe.parse_json(doc)
      
   service_doc = frappe.get_doc("Service Estimation", doc.get('name'))
   if service_doc.docstatus != 0:
       frappe.throw('Cannot modify submitted or cancelled document')
  
   # Remove items with matching sequence
   service_doc.items = [item for item in service_doc.items
                       if str(item.get('custom_service_sequence')) != str(service_sequence)]
  
  
   # Add flag to prevent refresh message
   service_doc.flags.ignore_validate = True
   service_doc.save(ignore_version=True)
  
   service_doc.save()
   return {"status": "success"}
  
  
  
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
def create_work_records(doc, method=None):
   if isinstance(doc, str):
       doc = frappe.get_doc("Service Estimation", doc)


   created_works = []
   for service in doc.quotation_services:
       work = frappe.new_doc("Work")
       work.service_name = service.service_name


       if service.service_for:
           # Try matching with specific fields in each doctype
           if frappe.db.exists("Business", {"company_name": service.service_for}):
               work.service_for_business = frappe.db.get_value("Business", {"company_name": service.service_for}, "name")
           elif frappe.db.exists("Personnel", {"full_name": service.service_for}):
               work.service_for_person = frappe.db.get_value("Personnel", {"full_name": service.service_for}, "name")
           elif frappe.db.exists("Car and Carrier", {"license_plate_number": service.service_for}):
               work.service_for_vehicle = frappe.db.get_value("Car and Carrier", {"license_plate_number": service.service_for}, "name")




       if doc.quotation_to == "Business":
           work.business_name = doc.business_name
       elif doc.quotation_to == "Personnel":
           work.personnel_name = doc.personnel_name


       work.linked_service_estimation = doc.name


       # Copy service_task from Service Template to Work
       service_template = frappe.get_doc("Service Template", service.service_name)
       if service_template:
           for task in service_template.service_task:
               work.append("service_task", {
                   "action": task.subject,
                   "task_type": task.task_type,
                   "mode": task.mode
               })


       work.insert()
       created_works.append(work.name)
              
      
   if len(created_works) == 1:
       return {
           'work_url': f"{frappe.utils.get_url()}/app/work/{created_works[0]}"
                  }
   else:
       return {
           'work_url': f"{frappe.utils.get_url()}/app/work?linked_service_estimation={doc.name}"
       }
      
      
@frappe.whitelist()
def create_sales_invoice(doc, method=None):
   if isinstance(doc, str):
       doc = frappe.get_doc("Service Estimation", doc)


   # Create new Sales Invoice
   sales_invoice = frappe.new_doc("Sales Invoice")
  
   # Set customer based on quotation_to
   if doc.quotation_to == "Business":
       sales_invoice.customer = doc.business_name
   else:
       sales_invoice.customer = doc.personnel_name
  
   # Copy common fields
   sales_invoice.total = doc.total
   sales_invoice.grand_total = doc.grand_total
   sales_invoice.total_taxes_and_charges = doc.total_taxes_and_charges
   sales_invoice.in_words = doc.in_words
   sales_invoice.custom_linked_service_estimation = doc.name
  
     # Calculate due date
   posting_date = frappe.utils.nowdate()
   sales_invoice.posting_date = posting_date
   sales_invoice.due_date = frappe.utils.add_days(posting_date, cint(doc.payment_due_days))
  
   # Copy items
   for item in doc.items:
       sales_invoice.append("items", {
           "item_code": item.item_code,
           "item_name": item.item_name,
           "qty": item.qty,
           "rate": item.rate,
           "amount": item.amount,
           "uom": item.uom,
           "income_account": item.income_account,
           "cost_center": item.cost_center,
       })
  
   # Copy quotation services
   for service in doc.quotation_services:
       sales_invoice.append("custom_quotation_services", {
           "service_name": service.service_name,
           "service_for": service.service_for,
           "service_sequence": service.service_sequence
       })
  
   sales_invoice.insert()
  
   return {
       'sales_invoice_url': f"{frappe.utils.get_url()}/app/sales-invoice/{sales_invoice.name}"
   }
