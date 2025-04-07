app_name = "docproc"
app_title = "Document Processing System"
app_publisher = "Simon Wanyama"
app_description = "Document Processing System"
app_email = "wanyamasp@gmail.com"
app_license = "mit"
# required_apps = []

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/docproc/css/docproc.css"
# app_include_js = "/assets/docproc/js/docproc.js"

app_include_css = "/assets/docproc/css/custom.css"


# app_include_js = [
#     "/assets/docproc/js/task_list.js"
#     ]

# include js, css files in header of web template
# web_include_css = "/assets/docproc/css/docproc.css"
# web_include_js = "/assets/docproc/js/docproc.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "docproc/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views

# doctype_js = {
#     'Quotation': 'document_processing_system/customization/quotation/quotation.js',
# }

doctype_js = {
    "Sales Invoice": [
		"document_processing_system/customization/sales_invoice/custom_scripts/sales_invoice.js"
	]
    
        # "Quotation": 
        # "document_processing_system/customization/quotation/quotation.js",
    
        # Uncomment these lines if needed
        # "public/js/quotation_cancel.js",
        # "public/js/quotation_set_as_lost.js",
    
    # "Task": "/assets/docproc/js/task_list.js"
}





# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "docproc/public/icons.svg"


# fixtures = [
#     "Legal Document",
#     "Business Legal Type",
#     "Business Issuing Authority",
#     "Custom Field",  # Includes all custom fields or can be filtered
#     # "Client Script",
#     "Property Setter",  # Includes property setters for customizations
#     {"doctype": "Workflow", "filters": [["name", "in", ["Quotation Workflow for Meme Typing"]]]},
#     {"doctype": "Workflow State"},  
#     {"doctype": "Workflow Action Master"},
#     {"doctype": "Action Type"},
# ]

# fixtures = [
#     "Legal Document",
#     "ClearDocs Settings",
#     "Business Legal Type",
#     "Business Issuing Authority",
#     "Custom Field",  # Includes all custom fields or can be filtered
#     # "Client Script",
#     "Property Setter",  # Includes property setters for customizations
#     # {"doctype": "Workflow", "filters": [["name", "in", ["Service Estimation Workflow"]]]},
#     # {"doctype": "Workflow State"},  
#     # {"doctype": "Workflow Action Master"},
#     {"doctype": "Action Type"},
#     # Adding Roles for ClearDoc
#     # {"doctype": "Role", "filters": [["role_name", "in", ["ClearDoc Admin", "ClearDoc User"]]]},
#     # Adding Custom DocPerms for ClearDoc
#     # {"doctype": "Custom DocPerm", "filters": [["role", "in", ["ClearDoc Admin", "ClearDoc User"]]]},
# ]


# fixtures = [
#    "Legal Document",
#    "ClearDocs Settings", 
#    "Business Legal Type",
#    "Business Issuing Authority",
#    "Custom Field",
#    "Property Setter",
#    {"doctype": "Action Type"},
#    {"doctype": "Role", "filters": [["name", "in", ["FixDocs Admin", "FixDocs User"]]]},
#    {"doctype": "Custom DocPerm", "filters": [["role", "in", ["FixDocs Admin", "FixDocs User"]]]}
# ]

fixtures = [
   "Legal Document",
   "ClearDocs Settings", 
   "Business Legal Type",
   "Business Issuing Authority",
   "Custom Field",
   "Property Setter",
   {"doctype": "Action Type"},
   {"doctype": "Role", "filters": [["name", "in", ["FixDocs Admin", "FixDocs User"]]]},
   {"doctype": "Custom DocPerm", "filters": [["role", "in", ["FixDocs Admin", "FixDocs User"]]]},
   # Add workspace fixtures
   {"doctype": "Workspace", "filters": [
      ["name", "in", [
         "Test",
         "FixDocs Pro",
         "Estimate",
         "ClearDocs Pro",
         "Financial Reports",
         "Receivables",
         "Payables",
         "Welcome Workspace",
         "ERPNext Settings",
         "Build",
         "ERPNext Integrations",
         "Manufacturing",
         "Quality",
         "Support",
         "Projects",
         "Assets",
         "Stock",
         "Accounting",
         "Integrations",
         "Users",
         "Tools",
         "Website",
         "Buying",
         "Selling",
         "CRM",
         "Home"
      ]]
   ]}
]


# fixtures = [
#     "Legal Document",
#     "ClearDocs Settings", 
#     "Business Legal Type",
#     "Business Issuing Authority",
#     "Custom Field",
#     "Property Setter",
#     {"doctype": "Role", "filters": [["name", "in", ["FixDocs Admin", "FixDocs User"]]]},
#     {"doctype": "Role Profile"}, # Add this
#     {"doctype": "Module Profile"}, # Add this  
#     {"doctype": "Has Role", "filters": [["role", "in", ["FixDocs Admin", "FixDocs User"]]]},
#     {"doctype": "Action Type"},
#     {"doctype": "Custom DocPerm", "filters": [["role", "in", ["FixDocs Admin", "FixDocs User"]]]}
# ]

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "docproc.utils.jinja_methods",
# 	"filters": "docproc.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "docproc.install.before_install"
# after_install = "docproc.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "docproc.uninstall.before_uninstall"
# after_uninstall = "docproc.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "docproc.utils.before_app_install"
# after_app_install = "docproc.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "docproc.utils.before_app_uninstall"
# after_app_uninstall = "docproc.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "docproc.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# override_doctype_class = {
#     "Task": "docproc.custom.task.task_list.CustomTask"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }
# doc_events = {
#     "Quotation": {
#         "on_submit": "docproc.document_processing_system.customization.quotation.quotation.trigger_update_alerts"
#     },
#     "Sales Invoice": {
#         "on_submit": "docproc.document_processing_system.customization.quotation.quotation.check_and_update_quotation"
#     }
# }

# doc_events = {
#     "Quotation": {
#         "on_submit": "docproc.document_processing_system.customization.quotation.quotation.trigger_update_alerts"
#     },
#     "Sales Invoice": {
#         "on_submit": "docproc.document_processing_system.customization.quotation.quotation.check_and_update_quotation"
#     },
#     "Action": {
#         "on_update": "docproc.document_processing_system.doctype.action.action.on_update"
#     },
#      "Service Estimation": {
#         "on_update_after_submit": [
#             "docproc.document_processing_system.doctype.service_estimation.service_estimation.create_work_records"
#         ]
#     }
    
# }


doc_events = {
    "Quotation": {
        "on_submit": "docproc.document_processing_system.customization.quotation.quotation.trigger_update_alerts"
    },
    "Action": {
        "on_update": "docproc.document_processing_system.doctype.action.action.on_update"
    },
    "Service Estimation": {
        "on_update_after_submit": [
            "docproc.document_processing_system.doctype.service_estimation.service_estimation.create_work_records",
            "docproc.document_processing_system.doctype.service_estimation.service_estimation.create_sales_invoice"
        ]
    }
}

# doc_events = {
#     "Quotation": {
#         "on_submit": "docproc.document_processing_system.customization.quotation.quotation.trigger_update_alerts"
#     },
#     "Action": {
#         "on_update": "docproc.document_processing_system.doctype.action.action.on_update"
#     },
#     "Service Estimation": {
#     "on_update_after_submit": "docproc.document_processing_system.doctype.service_estimation.service_estimation.handle_service_estimation_updates"
# }
# }


# Scheduled Tasks
# ---------------

scheduler_events = {
# 	"all": [
# 		"docproc.tasks.all"
# 	],
	"daily": [
		"docproc.document_processing_system.utils.generate_alerts.trigger_check_expiring_documents"
	],
# 	"hourly": [
# 		"docproc.tasks.hourly"
# 	],
# 	"weekly": [
# 		"docproc.tasks.weekly"
# 	],
# 	"monthly": [
# 		"docproc.tasks.monthly"
# 	],
}

# Testing
# -------

# before_tests = "docproc.install.before_tests"

# Overriding Methods
# ------------------------------

override_doctype_dashboards = {
    "Quotation": "docproc.document_processing_system.customization.quotation.custom_quotation_dashboard.get_data"
}


#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "docproc.event.get_events"
# }


# Expose your custom APIs (Optional but for clarity)
# override_whitelisted_methods = {
#     "docproc.document_processing_system.api.quotation.cancel_quotation": "docproc.document_processing_system.api.quotation.cancel_quotation",
#     "docproc.document_processing_system.api.quotation.set_as_lost": "docproc.document_processing_system.api.quotation.set_as_lost",
# }


#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "docproc.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["docproc.utils.before_request"]
# after_request = ["docproc.utils.after_request"]

# Job Events
# ----------
# before_job = ["docproc.utils.before_job"]
# after_job = ["docproc.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"docproc.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

# Make public directories for assets
app_include_css = "/assets/docproc/css/style.css"
app_include_js = ["/assets/docproc/js/react/bundle.js"]

# Add CORS configuration for your frontend
allow_cors = "*"

# Whitelist API methods
whitelisted_methods = {
    "docproc.api.api.get_dashboard_data": True,
    "docproc.api.api.get_businesses_data": True,
    "docproc.api.api.get_personnel_data": True,
    "docproc.api.api.get_alerts_data": True, 
    "docproc.api.api.get_document_data": True,
    "docproc.api.api.get_app_data": True,
}


# Add website route rules
website_route_rules = [
    {"from_route": "/dashboard", "to_route": "dashboard/index"},
    {"from_route": "/businesses", "to_route": "businesses/index"},
    {"from_route": "/personnel", "to_route": "personnel/index"},
    {"from_route": "/alerts", "to_route": "alerts/index"},
    {"from_route": "/api-test", "to_route": "api-test/index"},
    {"from_route": "/document/:document_id", "to_route": "document/index"}
]

# Update website route rules with additional pages
website_route_rules = [
    {"from_route": "/dashboard", "to_route": "dashboard/index"},
    {"from_route": "/businesses", "to_route": "businesses/index"},
    {"from_route": "/personnel", "to_route": "personnel/index"},
    {"from_route": "/alerts", "to_route": "alerts/index"},
    {"from_route": "/api-test", "to_route": "api-test/index"},
]

# Custom DocTypes dashboards
# override_doctype_dashboards = {
#     "Business": "docproc.document_processing_system.doctype.business.business_dashboard.get_data",
#     "Individual": "docproc.document_processing_system.doctype.individual.individual_dashboard.get_data"
# }