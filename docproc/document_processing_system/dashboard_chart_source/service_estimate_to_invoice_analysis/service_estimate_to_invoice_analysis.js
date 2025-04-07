frappe.provide("frappe.dashboards.chart_sources");

frappe.dashboards.chart_sources["Service Estimate to Invoice Analysis"] = {
  method:
    "docproc.document_processing_system.dashboard_chart_source.service_estimate_to_invoice_analysis.service_estimate_to_invoice_analysis.get_data",
  filters: [
    {
      fieldname: "timespan",
      label: __("Timespan"),
      fieldtype: "Select",
      options: ["Last Year", "Last Quarter", "Last Month", "Last Week"],
      default: "Last Year",
      reqd: 1,
    },
    {
      fieldname: "time_interval",
      label: __("Time Interval"),
      fieldtype: "Select",
      options: ["Monthly", "Quarterly", "Weekly", "Daily"],
      default: "Monthly",
      reqd: 1,
    },
  ],
};
