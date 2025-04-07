import frappe
from frappe.utils import nowdate, add_days


def reset_child_table_indices(doc, child_table_fieldname):
		"""
		Resets the idx of the child table to ensure correct sequencing.
		"""
		for idx, row in enumerate(doc.get(child_table_fieldname), start=1):
			row.idx = idx

