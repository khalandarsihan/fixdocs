// Copyright (c) 2025, Khalandar Sihan and contributors
// For license information, please see license.txt

frappe.query_reports["Work Progress Distribution"] = {
  filters: [
    {
      fieldname: "from_date",
      label: __("From Date"),
      fieldtype: "Date",
      default: frappe.datetime.add_months(frappe.datetime.get_today(), -1),
    },
    {
      fieldname: "to_date",
      label: __("To Date"),
      fieldtype: "Date",
      default: frappe.datetime.get_today(),
    },
    {
      fieldname: "business_name",
      label: __("Business"),
      fieldtype: "Link",
      options: "Business",
    },
    {
      fieldname: "personnel_name",
      label: __("Personnel"),
      fieldtype: "Link",
      options: "Personnel",
    },
    {
      fieldname: "service_name",
      label: __("Service"),
      fieldtype: "Link",
      options: "Service Template",
    },
  ],

  // Optional: Add formatter for percentage column
  formatter: function (value, row, column, data, default_formatter) {
    if (column.fieldname == "percentage") {
      value = value + "%";
    }
    return default_formatter(value, row, column, data);
  },

  // Optional: Add any onload customization
  onload: function (report) {
    // You can add any custom logic here that should run when report loads
    report.page.add_inner_button(__("Refresh Data"), function () {
      report.refresh();
    });
  },
};
