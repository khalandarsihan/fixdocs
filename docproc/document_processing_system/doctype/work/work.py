# Copyright (c) 2024, Khalandar Sihan and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Work(Document):
    pass
    
@frappe.whitelist()
def create_actions_from_service(work_id, service_name):
    # Fetch the Work document by work_id
    work_doc = frappe.get_doc("Work", work_id)

    # Fetch the Service Template by service_name
    service_template = frappe.get_doc("Service Template", {"service_name": service_name})
    if not service_template:
        frappe.throw(f"Service Template with name '{service_name}' not found.")

    # Iterate through the Service Task child table in the Service Template
    for index, task in enumerate(service_template.service_task, start=1):
             
        # Create a new Action document
        new_action = frappe.get_doc({
            "doctype": "Action",
            "task_name": task.subject,                      # Maps to Action's 'task_name'
            "type": task.task_type,                        # Maps to Action's 'type'
            "mode": task.mode,                             # Maps to Action's 'mode'
            "service_name": work_id,                       # Links the Action to the Work ID
            "task_number": f"Task {index}",                # Add Task number (e.g., Task 1, Task 2, etc.)
            "customer_name_link": work_doc.customer_name_link,  # Copy customer_name_link from Work
            "custom_customer_name": work_doc.custom_customer_name,  # Copy customer_name from Work
            "service_for_link": work_doc.service_for_link,  # Link to the Doctype from Work
            "service_for": work_doc.common_service_for              # Use mulkiya_number for Car and Carrier, name for others
        })

        # Insert the new Action into the database
        new_action.insert(ignore_permissions=True)

    # Return a success message
    # return {"message": f"Actions created successfully for Service: {service_name}"}