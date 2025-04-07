# # Copyright (c) 2024, Khalandar Sihan and contributors
# # For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class Action(Document):
	pass


# from docproc.document_processing_system.doctype.work.utils import update_work_status

# def on_update(doc, method):
#     # Update the Work status when an Action is updated
#     if doc.service_name:
#         update_work_status(doc.service_name)



from docproc.document_processing_system.doctype.work.utils import update_work_status, calculate_progress

def on_update(doc, method):
    # Update the Work status when an Action is updated
    if doc.service_name:
        update_work_status(doc.service_name)

        # Update progress percentage for the linked Work
        calculate_progress(doc.service_name)
