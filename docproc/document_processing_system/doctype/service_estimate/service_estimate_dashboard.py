from frappe import _

def get_data():
    return {
        'fieldname': 'service_estimate',
        'transactions': [
            {
                'items': ['Work']
            },
            {
                'items': ['Sales Invoice']
            },
            {
                'items': ['Alert']
            }
        ],
        'non_standard_fieldnames': {
            'Work': 'linked_service_estimate',
            'Sales Invoice': 'custom_linked_service_estimate',
            'Alert': 'linked_service_estimate'
        }
    }