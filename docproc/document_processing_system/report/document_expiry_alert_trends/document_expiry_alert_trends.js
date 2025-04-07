// Copyright (c) 2025, Khalandar Sihan and contributors
// For license information, please see license.txt

frappe.query_reports["Document Expiry Alert Trends"] = {
  filters: [
    {
      fieldname: "from_date",
      label: __("From Date"),
      fieldtype: "Date",
      default: frappe.datetime.add_months(frappe.datetime.get_today(), -1),
      reqd: 1,
    },
    {
      fieldname: "to_date",
      label: __("To Date"),
      fieldtype: "Date",
      default: frappe.datetime.get_today(),
      reqd: 1,
    },
    {
      fieldname: "group_by",
      label: __("Group By"),
      fieldtype: "Select",
      options: ["Daily", "Weekly", "Monthly"],
      default: "Monthly",
      reqd: 1,
    },
    {
      fieldname: "alert_type",
      label: __("Alert Type"),
      fieldtype: "Select",
      options: "\nBusiness\nPersonnel\nVehicle",
      default: "",
    },
  ],
};
