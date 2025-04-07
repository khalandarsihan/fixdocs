# import frappe

# def update_work_status(work_id):
#     # Fetch all actions related to the given work_id
#     actions = frappe.get_all("Action", filters={"service_name": work_id}, fields=["status"])

#     if not actions:
#         return  # No actions found, do nothing

#     # Extract all statuses from the related actions
#     statuses = [action["status"] for action in actions]

#     # Check for statuses and determine the Work status
#     if "Working" in statuses:
#         new_status = "Working"
#     elif all(status == "Complete" for status in statuses):
#         new_status = "Complete"
#     elif all(status == "Cancelled" for status in statuses):
#         new_status = "Cancelled"
#     elif "Cancelled" in statuses:
#         # Check additional conditions when at least one action is "Cancelled"
#         other_statuses = [status for status in statuses if status != "Cancelled"]

#         if not other_statuses:  # No other actions exist (all are Cancelled)
#             new_status = "Cancelled"
#         elif all(status == "Open" for status in other_statuses):  # Other actions are all Open
#             new_status = "Open"
#         elif all(status == "Complete" for status in other_statuses):  # Other actions are all Complete
#             new_status = "Complete"
#         elif "Working" in other_statuses:  # At least one other action is Working
#             new_status = "Working"
#         else:
#             new_status = "Open"  # Fallback for other cases
#     else:
#         new_status = "Open"  # Default or fallback status

#     # Update the status of the Work document
#     work_doc = frappe.get_doc("Work", work_id)
#     work_doc.status = new_status
#     work_doc.save(ignore_permissions=True)

import frappe

def update_work_status(work_id):
    # Fetch all actions related to the given work_id
    actions = frappe.get_all("Action", filters={"service_name": work_id}, fields=["status"])

    if not actions:
        return  # No actions found, do nothing

    # Extract all statuses from the related actions
    statuses = [action["status"] for action in actions]

    # Check for statuses and determine the Work status
    if "Working" in statuses:
        # Priority: If any action is `Working`, Work status should be `Working`
        new_status = "Working"
    elif "Cancelled" in statuses:
        # Handle cases when one or more actions are `Cancelled`
        other_statuses = [status for status in statuses if status != "Cancelled"]

        if not other_statuses:  # No other actions exist (all are Cancelled)
            new_status = "Cancelled"
        elif all(status == "Open" for status in other_statuses):  # All other actions are `Open`
            new_status = "Open"
        elif all(status == "Complete" for status in other_statuses):  # All other actions are `Complete`
            new_status = "Complete"
        else:
            # If there's a mix of `Working` and `Cancelled`, or `Working` exists
            new_status = "Working"
    elif all(status == "Complete" for status in statuses):
        # If all actions are `Complete`, Work status should be `Complete`
        new_status = "Complete"
    elif all(status == "Cancelled" for status in statuses):
        # If all actions are `Cancelled`, Work status should be `Cancelled`
        new_status = "Cancelled"
    else:
        # Default fallback: Work status should be `Open`
        new_status = "Open"

    # Update the status of the Work document
    work_doc = frappe.get_doc("Work", work_id)
    work_doc.status = new_status
    work_doc.save(ignore_permissions=True)



@frappe.whitelist()
def calculate_progress(work_name):
    # Fetch all linked actions using the service_name field
    total_actions = frappe.db.count("Action", filters={"service_name": work_name})
    completed_actions = frappe.db.count("Action", filters={"service_name": work_name, "status": "Complete"})

    # Calculate progress percentage
    if total_actions > 0:
        progress = (completed_actions / total_actions) * 100
    else:
        progress = 0

    # Update the progress_percentage field in the Work Doctype
    frappe.db.set_value("Work", work_name, "progress_percentage", progress)
    return progress
