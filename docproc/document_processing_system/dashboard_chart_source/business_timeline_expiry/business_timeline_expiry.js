frappe.provide("frappe.dashboards.chart_sources");

frappe.dashboards.chart_sources["Business Timeline Expiry"] = {
	method: "docproc.document_processing_system.dashboard_chart_source.business_timeline_expiry.business_timeline_expiry.get",
	filters: [
		{
			fieldname: "company",
			label: __("Company"),
			fieldtype: "Link",
			options: "Company",
			default: frappe.defaults.get_user_default("Company"),
		},
	],
};
