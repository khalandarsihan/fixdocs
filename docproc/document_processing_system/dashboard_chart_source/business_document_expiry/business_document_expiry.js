frappe.provide("frappe.dashboards.chart_sources");

frappe.dashboards.chart_sources["Business Document Expiry"] = {
	method: "docproc.document_processing_system.dashboard_chart_source.business_document_expiry.business_document_expiry.get",
	filters: [
		// {
		// 	fieldname: "company",
		// 	label: __("Company"),
		// 	fieldtype: "Link",
		// 	options: "Company",
		// 	default: frappe.defaults.get_user_default("Company"),
		// },
		// {
		// 	fieldname: "document_type",
		// 	label: __("Document Type"),
		// 	fieldtype: "Select",
		// 	options: ["Business", "Personnel"],
		// 	default: "Business",
		// },
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
