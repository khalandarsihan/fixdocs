frappe.provide("frappe.dashboards.chart_sources");

frappe.dashboards.chart_sources["Personnel Documents Expiry"] = {
	method: "docproc.document_processing_system.dashboard_chart_source.personnel_documents_expiry.personnel_documents_expiry.get",
	filters: [
		{
			fieldname: "expiry_range",
			label: __("Expiry Range"),
			fieldtype: "Select",
			options: [
				{ "label": __("1-7 Days"), "value": "7" },
				{ "label": __("7-30 Days"), "value": "30" },
				{ "label": __("30-90 Days"), "value": "90" },
			],
			default: "30",
		},
	],
};
