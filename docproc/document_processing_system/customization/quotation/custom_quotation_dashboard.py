from frappe import _

def get_data(data=None):
    """
    Custom function for Quotation dashboard configuration with heatmap, field mappings, and categorized transactions.
    """
    return {
        "fieldname": "quotation_id",
        "non_standard_fieldnames": {
            "Work": "linked_quotation",
            "Sales Invoice": "custom_linked_quotation",
            "Alert": "linked_quotation"
        },
        "transactions": [
            {"items": ["Sales Invoice", "Work", "Alert"]},
            ],
    }
