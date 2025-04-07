import frappe
import json
from frappe import _
from frappe.utils import now
from collections import Counter, defaultdict


def trigger_update_alerts(doc, method):
    if not doc.custom_service_type == 'Renewal':
        return
    
    quote_services = doc.custom_quotation_services
    alerts = []
    for service in quote_services: alerts.append(service.alert)
    alerts = list(set(alerts))

    # Delete Duplicate Quotes before Changing Status
    delete_duplicate_quotations(doc)

    # Change status of each alert to Quotation
    for alert in alerts:
        if not frappe.db.exists('Alert', alert): frappe.throw(_('Alert <strong>{0}</strong> does not exist').format(alert))
        frappe.db.set_value('Alert', alert, 'status', 'Quotation')
    

@frappe.whitelist()
def create_quotation_from_alerts(alert_data):
    if not alert_data: return

    alert_data = json.loads(alert_data)
    alert_ids = [alert['name'] for alert in alert_data]

    bill_to = get_primary_or_business_owner(alert_ids[0])
    bill_to_doctype = bill_to.get('doctype')
    
    bill_to_customer = get_bill_to_customer(bill_to_doctype, bill_to.get('name'))
    if not bill_to_customer: frappe.throw(_('No Customer found for Bill To <strong>{0}: {1}</strong>').format(bill_to, alert_data[0]['bill_to']))

    # Create Quotation
    quotation_data = fetch_quotation_data(bill_to_customer, alert_ids)
    quotation_items = quotation_data['quotation_items']
    quotation_items = [({'item_code': item['item'], 'qty': item['count']}) for item in quotation_items]
    service_items = quotation_data['service_items']
    
    quotation_to = bill_to_doctype
    quotation_data = {
        'doctype': 'Quotation',
        'custom_service_type': 'Renewal',
        'quotation_to': quotation_to,
        'party_name': bill_to.get('name'),
        'customer_name': bill_to_customer,
        'custom_quotation_services': service_items,
        'items': quotation_items,
    }

    if quotation_to == 'Personnel':
        quotation_data['custom_personnel_name'] = bill_to.get('name')
    elif quotation_to == 'Business':
        quotation_data['custom_business_name'] = bill_to.get('name')

    quotation = frappe.get_doc(quotation_data)
    quotation.insert(ignore_permissions=True)

    return quotation


@frappe.whitelist()
def fetch_quotation_data(customer, alerts=[]):
    if not customer: return

    alert_data = get_alert_data(customer, alerts)
    party_title = check_bill_to_name(customer)
    
    party_title = party_title.get('title')
    if not len(alert_data): frappe.throw(_('No Alerts found for <strong>{0}</strong>').format(party_title))
    alert_items, service_items = [], []
    for doc in alert_data: alert_items.append(process_alert_document(doc))
    for item in alert_items: service_items.append({
        'service': item['service'],
        'service_for': item['service_for'],
        'alert': item['alert']
    })
    quotation_items = aggregate_quote_items(alert_items)

    return {'quotation_items': quotation_items, 'service_items': service_items}


def get_alert_data(customer, alerts=[]):
    # Base query
    query = """
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
            a.modified,
            COALESCE(a.business, a.personnel) as alert_for
        FROM
            `tabAlert` a
            JOIN `tabAlert Documents` ad ON a.name = ad.parent
        WHERE
            a.bill_to = %(customer)s
    """
    
    # Add the alert filter if alerts list is not empty
    if alerts:
        query += " AND a.name IN %(alerts)s"
    
    # Prepare parameters
    params = {
        'customer': customer,
        'alerts': tuple(alerts) if alerts else None
    }
    
    # Execute query
    data = frappe.db.sql(query, params, as_dict=1)
    return data


def process_alert_document(doc):
    doc_type = doc['document_type']
    service = frappe.db.get_value('Service', {'legal_document': doc_type, 'service_type': 'Renewal'}, 'name')
    if not service: frappe.throw(_('No <strong>Renewal</strong> Service found for Legal Document <strong>{0}</strong>').format(doc_type))
    alert_for = check_bill_to_name(doc['alert_for']).get('title')
    service_items = get_service_items(service)
    return {
        'service': service,
        'service_for': alert_for,
        'service_items': service_items,
        'alert': doc['alert_name']
    }

def get_service_items(service):
    tasks_list = []
    tasks = frappe.get_all('Service Tasks', filters={'parent': service}, fields=['billable', 'government_billable', 'linked_item', 'government_linked_item'])
    tasks_list.extend([task['linked_item'] for task in tasks if task['billable']])
    tasks_list.extend([task['government_linked_item'] for task in tasks if task['government_billable']])

    return tasks_list

def aggregate_quote_items(data_items):
    #  first get item lists for each service
    service_items = []
    for item in data_items: service_items.extend(item.get('service_items'))
    #  then count items and create list of dicts
    quotation_items = []
    for k, v in Counter(service_items).items():
        quotation_items.append({
            'item': k,
            'count': v
        })
    return quotation_items

def get_bill_to_customer(bill_to_doctype, bill_to):
    try:
        if bill_to_doctype == 'Personnel':
            doc = frappe.get_doc('Personnel', bill_to)
            bill_to_customer = doc.customer
        else:
            doc = frappe.get_doc('Business', bill_to)
            bill_to_customer = doc.customer
        return bill_to_customer
    except Exception as e:
        print(f'Error fetching customer for {bill_to_doctype} with ID {bill_to}: {e}')
        return None

def get_primary_or_business_owner(alert_name):
    try:
        # Fetch the Alert document using the alert name
        alert_doc = frappe.get_doc('Alert', alert_name)

        # Get Bill to
        bill_to_name = None
        if alert_doc.business:
            bill_to_name = alert_doc.business
        elif alert_doc.personnel_primary_owner:
            bill_to_name = alert_doc.personnel_primary_owner
        elif alert_doc.personnel_business_owner:
            bill_to_name = alert_doc.personnel_business_owner

        bill_to = check_bill_to_name(bill_to_name)
       
        return bill_to

    except Exception as e:
        print(f'Error fetching owner for alert {alert_name}: {e}')
        return None

def check_bill_to_name(name):
    # Check in Personnel doctype
    personnel_exists = frappe.db.exists("Personnel", name)
    if personnel_exists:
        personnel = frappe.get_doc("Personnel", name)
        return {
            "exists": True,
            "name": personnel.name,
            "doctype": "Personnel", 
            "title": personnel.get_title()
        }

    # Check in Business doctype
    business_exists = frappe.db.exists("Business", name)
    if business_exists:
        business = frappe.get_doc("Business", name)
        return {
            "exists": True, 
            "name": business.name, 
            "doctype": "Business", 
            "title": business.get_title()
        }

    return {"exists": False, "doctype": None}

def delete_duplicate_quotations(doc):
    new_quotation_services = [(service.service, service.service_for, service.alert) for service in doc.custom_quotation_services]
    new_quotation_items = [(item.item_code, item.qty) for item in doc.items]

    existing_quotations = frappe.get_all('Quotation', filters={'docstatus': 0}, fields=['name'])

    for quotation in existing_quotations:
        existing_quotation = frappe.get_doc('Quotation', quotation.name)
        existing_services = [(service.service, service.service_for, service.alert) for service in existing_quotation.custom_quotation_services]
        existing_items = [(item.item_code, item.qty) for item in existing_quotation.items]

        if Counter(new_quotation_services) == Counter(existing_services) and Counter(new_quotation_items) == Counter(existing_items):
            frappe.delete_doc('Quotation', existing_quotation.name, force=True)


@frappe.whitelist()
def get_service_linked_item(service):
    # SQL Query to fetch billable items and government billable items
    query = """
        SELECT
            service_task,
            billable,
            linked_item,
            government_billable,
            government_linked_item
        FROM
            `tabService Tasks`
        WHERE
            parent = %s
            AND (billable = 1 OR government_billable = 1)
    """
    # Execute the query
    results = frappe.db.sql(query, (service,), as_dict=True)

    # Filter the results based on the conditions
    filtered_results = []
    for result in results:
        if result.billable:
            filtered_results.append(result.linked_item)
        if result.government_billable:
            filtered_results.append(result.government_linked_item)
    
    # Return the filtered results
    return filtered_results


# @frappe.whitelist()
# def create_work_from_quotation(quotation_id):
#     # Fetch the Quotation document
#     quotation = frappe.get_doc("Quotation", quotation_id)
#     if not quotation:
#         frappe.throw(f"Quotation with ID '{quotation_id}' not found.")
    
#     # Check if Work already exists
#     existing_work = frappe.get_all("Work", filters={"linked_quotation": quotation_id}, limit=1)
#     if existing_work:
#         frappe.throw("Work has already been created for this Quotation.")
    
#     # Get child table entries from custom_quotation_services
#     services = quotation.get("custom_quotation_services")
#     if not services:
#         frappe.throw("No services found in the Quotation.")

#     work_count = 0
#     task_count = 0
#     created_work_ids = []

#     # List of valid DocTypes for service_for_link
#     valid_doctypes = ["Personnel", "Business", "Car and Carrier"]

#     # Iterate over services in the child table
#     for service in services:
#         service_for_link_value = None
#         primary_key = None

#         # Determine the appropriate value for service_for_link
#         for doctype in valid_doctypes:
#             if doctype == "Car and Carrier":
#                 # Fetch the primary key using mulkiya_number for Car and Carrier
#                 primary_key = frappe.db.get_value("Car and Carrier", {"mulkiya_number": service.service_for}, "name")
#                 if primary_key:
#                     service_for_link_value = doctype
#                     break
#             else:
#                 # Check against the primary key for other Doctypes
#                 if frappe.db.exists(doctype, service.service_for):
#                     primary_key = service.service_for
#                     service_for_link_value = doctype
#                     break

#         # Raise an exception if service.service_for does not match any valid doctype
#         if not service_for_link_value or not primary_key:
#             frappe.throw(
#                 f"Invalid service_for value: '{service.service_for}'. Must correspond to one of {valid_doctypes}."
#             )

#         # Create a Work document
#         new_work = frappe.get_doc({
#             "doctype": "Work",
#             "linked_quotation": quotation_id,
#             "customer_name": quotation.customer_name,
#             "service": service.service,
#             "service_for": primary_key,  # Use primary key
#             "service_for_link": service_for_link_value,  # Linked doctype
#             "common_service_for": primary_key,  # Dynamic link
#         })
#         new_work.insert(ignore_permissions=True)
#         created_work_ids.append(new_work.name)

#         # Call the existing function in work.py to create tasks
#         tasks = frappe.get_attr(
#             "docproc.document_processing_system.doctype.work.work.create_tasks_from_service"
#         )(new_work.name, service.service)

#         work_count += 1
#         task_count += len(tasks)
        
#     # Update workflow_state in Quotation
#     if quotation.workflow_state == "To Work and Bill":
#         quotation.workflow_state = "To Bill"
#     elif quotation.workflow_state == "To Work":
#         quotation.workflow_state = "Complete"
#     quotation.save(ignore_permissions=True)

#     # Generate appropriate URL based on work_count
#     if work_count == 1:
#         work_url = f"{frappe.utils.get_url()}/app/work/{created_work_ids[0]}"
#     else:
#         work_url = f"{frappe.utils.get_url()}/app/work?linked_quotation={quotation_id}"

#     return {
#         "message": f"Created {work_count} Work records for Quotation {quotation_id}.",
#         "work_url": work_url
#     }


@frappe.whitelist()
def create_work_from_quotation(quotation_id):
    # Fetch the Quotation document
    quotation = frappe.get_doc("Quotation", quotation_id)
    if not quotation:
        frappe.throw(f"Quotation with ID '{quotation_id}' not found.")
    
    # Validate customer_type in Customer Doctype
    customer_type = frappe.db.get_value("Customer", {"name": quotation.customer_name}, "customer_type")
    if not customer_type:
        frappe.throw(f"Customer '{quotation.customer_name}' does not have a valid customer type.")
    
    if customer_type not in ["Company", "Individual"]:
        frappe.throw(f"Invalid customer type '{customer_type}' for Customer '{quotation.customer_name}'.")
    
    # Check if Work already exists
    existing_work = frappe.get_all("Work", filters={"linked_quotation": quotation_id}, limit=1)
    if existing_work:
        frappe.throw("Work has already been created for this Quotation.")
    
    # Get child table entries from custom_quotation_services
    services = quotation.get("custom_quotation_services")
    if not services:
        frappe.throw("No services found in the Quotation.")

    work_count = 0
    task_count = 0
    created_work_ids = []

    # List of valid DocTypes for service_for_link
    valid_doctypes = ["Personnel", "Business", "Car and Carrier"]

    # Determine customer_name_link and customer_name
    customer_name_link = "Business" if customer_type == "Company" else "Personnel"
    customer_name = quotation.customer_name  # Fetched from the Quotation document

    # Iterate over services in the child table
    for service in services:
        service_for_link_value = None
        primary_key = None

        # Determine the appropriate value for service_for_link
        for doctype in valid_doctypes:
            if doctype == "Car and Carrier":
                # Fetch the primary key using mulkiya_number for Car and Carrier
                primary_key = frappe.db.get_value("Car and Carrier", {"mulkiya_number": service.service_for}, "name")
                if primary_key:
                    service_for_link_value = doctype
                    break
            else:
                # Check against the primary key for other Doctypes
                if frappe.db.exists(doctype, service.service_for):
                    primary_key = service.service_for
                    service_for_link_value = doctype
                    break

        # Raise an exception if service.service_for does not match any valid doctype
        if not service_for_link_value or not primary_key:
            frappe.throw(
                f"Invalid service_for value: '{service.service_for}'. Must correspond to one of {valid_doctypes}."
            )

        # Create a Work document
        new_work = frappe.get_doc({
            "doctype": "Work",
            "linked_quotation": quotation_id,
            "customer_name_link": customer_name_link,  # Populate with Business or Personnel
            "custom_customer_name": customer_name,  # Populate with customer name from Quotation for display
            "customer_name": customer_name,  # Populate with customer name from Quotation
            "service": service.service,
            "service_for": primary_key,  # Use primary key
            "service_for_link": service_for_link_value,  # Linked doctype
            "common_service_for": primary_key,  # Dynamic link
        })
        new_work.insert(ignore_permissions=True)
        created_work_ids.append(new_work.name)

        # Call the existing function in work.py to create tasks
        frappe.get_attr(
            "docproc.document_processing_system.doctype.work.work.create_actions_from_service"
        )(new_work.name, service.service)

        work_count += 1
        # task_count += len(tasks)
        
    # Update workflow_state in Quotation
    if quotation.workflow_state == "To Work and Bill":
        quotation.workflow_state = "To Bill"
    elif quotation.workflow_state == "To Work":
        quotation.workflow_state = "Complete"
    quotation.save(ignore_permissions=True)

    # Generate appropriate URL based on work_count
    if work_count == 1:
        work_url = f"{frappe.utils.get_url()}/app/work/{created_work_ids[0]}"
    else:
        work_url = f"{frappe.utils.get_url()}/app/work?linked_quotation={quotation_id}"

    return {
        "message": f"Created {work_count} Work records for Quotation {quotation_id}.",
        "work_url": work_url
    }



@frappe.whitelist()
def create_sales_invoice_draft(quotation_id):
    # Fetch the Quotation document
    quotation = frappe.get_doc("Quotation", quotation_id)
    if not quotation:
        frappe.throw(f"Quotation with ID '{quotation_id}' not found.")

    # Check if Sales Invoice already exists in a submitted state
    existing_invoice = frappe.get_all(
        "Sales Invoice", filters={"custom_linked_quotation": quotation_id, "docstatus": 1}, limit=1
    )
    if existing_invoice:
        frappe.throw("A submitted Sales Invoice already exists for this Quotation.")

    # Create a Sales Invoice draft
    sales_invoice = frappe.get_doc({
        "doctype": "Sales Invoice",
        "customer": quotation.customer_name,  # Map Quotation customer to Sales Invoice customer
        "custom_linked_quotation": quotation_id,  # Link Quotation to Sales Invoice
        "items": []  # Initialize items list
    })

    # Loop through items in Quotation's items table and add to Sales Invoice's items table
    for item in quotation.get("items"):
        sales_invoice.append("items", {
            "item_code": item.item_code,
            "item_name": item.item_name,
            "description": item.description,
            "qty": item.qty,
            "rate": item.rate,
            "amount": item.amount,
            "uom": item.uom,
            "custom_service": item.get("custom_service"),
            "custom_service_for": item.get("custom_service_for"),
            "custom_service_sequence": item.get("custom_service_sequence")

        })
        
# Loop through the custom_quotation_services table and copy entries to Sales Invoice
    for service in quotation.get("custom_quotation_services"):
        sales_invoice.append("custom_quotation_services", {
            "service": service.service,
            "service_for": service.service_for,
            "alert": service.alert,
            "service_sequence": service.service_sequence
    })


    # Insert Sales Invoice as a draft
    sales_invoice.insert(ignore_permissions=True)

    # Generate the full URL for the Sales Invoice
    sales_invoice_url = f"{frappe.utils.get_url()}/app/sales-invoice/{sales_invoice.name}"
    frappe.logger().info(f"Generated Sales Invoice URL: {sales_invoice_url}")  # Log the URL for debugging

    return {
        "sales_invoice_url": sales_invoice_url
    }


@frappe.whitelist()
def check_and_update_quotation(self, method=None):
    """
    Check if a submitted Sales Invoice exists for the Quotation, 
    and update the Quotation's workflow_state if found.
    """
    # Extract the Quotation ID from the linked field
    quotation_id = self.custom_linked_quotation
    if not quotation_id:
        frappe.throw("Custom linked Quotation ID is missing.")

    # Fetch the Quotation document
    quotation = frappe.get_doc("Quotation", quotation_id)

    # Check for a submitted Sales Invoice linked to the Quotation
    submitted_invoice = frappe.get_all(
        "Sales Invoice", 
        filters={"custom_linked_quotation": quotation_id, "docstatus": 1}, 
        limit=1
    )

    if submitted_invoice:
        # Update the Quotation's workflow_state based on its current state
        if quotation.workflow_state == "To Work and Bill":
            quotation.workflow_state = "To Work"
        elif quotation.workflow_state == "To Bill":
            quotation.workflow_state = "Complete"

        # Save the updated Quotation
        quotation.save(ignore_permissions=True)

        # Log success message
        # frappe.msgprint(f"Quotation {quotation_id} workflow_state updated to {quotation.workflow_state}.")
    else:
        # Log no-invoice-found message
        # frappe.msgprint(f"No submitted Sales Invoice found for Quotation {quotation_id}.")
        pass


@frappe.whitelist()
def get_filtered_options(doctype, filters):
    """
    Fetch filtered data dynamically for Link fields in the Quotation Doctype.
    """
    try:
        return frappe.get_list(doctype, filters=filters, fields=["name"])
    except Exception as e:
        frappe.throw(str(e))


@frappe.whitelist()
def get_personnel_list(personnel_name):
    # Fetch the specific Personnel record by personnel_name
    primary_personnel = frappe.get_all(
        'Personnel',
        filters={'name': personnel_name, 'active': 1},
        fields=['name']
    )

    # Fetch all Dependent Personnel records where primary_personnel matches personnel_name
    dependent_personnel = frappe.get_all(
        'Personnel',
        filters={'personnel_type': 'Dependent', 'primary_personnel': personnel_name, 'active': 1},
        fields=['name']
    )

    # Combine the results
    result = [person['name'] for person in primary_personnel + dependent_personnel]

    return result
