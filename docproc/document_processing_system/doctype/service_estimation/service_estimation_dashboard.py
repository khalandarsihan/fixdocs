from frappe import _

def get_data():
    return {
        'fieldname': 'service_estimation',
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
            'Work': 'linked_service_estimation',
            'Sales Invoice': 'custom_linked_service_estimation',
            'Alert': 'linked_service_estimation'
        }
    }