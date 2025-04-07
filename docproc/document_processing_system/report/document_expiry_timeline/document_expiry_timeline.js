// Copyright (c) 2025, Simon Wanyama and contributors
// For license information, please see license.txt

frappe.query_reports["Document Expiry Timeline"] = {
  filters: [
    {
      fieldname: "company",
      label: __("Company"),
      fieldtype: "Link",
      options: "Company",
      default: frappe.defaults.get_user_default("Company"),
    },
  ],

  formatter: function (value, row, column, data, default_formatter) {
    value = default_formatter(value, row, column, data);

    if (
      column.fieldname == "document_count" &&
      data.alert_status == "Pending"
    ) {
      value = "<span style='color: red'>" + value + "</span>";
    }

    return value;
  },
};
