// Copyright (c) 2025, Khalandar Sihan and contributors
// For license information, please see license.txt

frappe.query_reports["Work Aging Analysis"] = {
  filters: [
    {
      fieldname: "from_date",
      label: __("From Date"),
      fieldtype: "Date",
      default: frappe.datetime.add_months(frappe.datetime.get_today(), -3),
      reqd: 0,
    },
    {
      fieldname: "to_date",
      label: __("To Date"),
      fieldtype: "Date",
      default: frappe.datetime.get_today(),
      reqd: 0,
    },
    {
      fieldname: "business_name",
      label: __("Business"),
      fieldtype: "Link",
      options: "Business",
    },
    {
      fieldname: "service_name",
      label: __("Service"),
      fieldtype: "Link",
      options: "Service Template",
    },
    {
      fieldname: "personnel_name",
      label: __("Personnel"),
      fieldtype: "Link",
      options: "Personnel",
    },
  ],

  formatter: function (value, row, column, data, default_formatter) {
    value = default_formatter(value, row, column, data);

    if (column.fieldname == "total_progress") {
      value = `<div style="background: linear-gradient(90deg, rgba(82,190,128,0.2) ${data.total_progress}%, white ${data.total_progress}%)">${value}%</div>`;
    }

    return value;
  },
};
