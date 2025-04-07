// Copyright (c) 2025, Khalandar Sihan and contributors
// For license information, please see license.txt

// alert_volume_and_type_analysis.js
frappe.query_reports["Alert Volume and Type Analysis"] = {
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
      fieldname: "alert_type",
      label: __("Alert Type"),
      fieldtype: "Select",
      options: "\nBusiness\nPersonnel\nVehicle",
    },
    {
      fieldname: "status",
      label: __("Status"),
      fieldtype: "Select",
      options:
        "\nOpen\nFollow-Up\nService Estimate\nPartial Quotation\nWork-Order\nCanceled",
    },
    {
      fieldname: "document_type",
      label: __("Document Type"),
      fieldtype: "Link",
      options: "Legal Document",
    },
    {
      fieldname: "group_by",
      label: __("Group By"),
      fieldtype: "Select",
      options: "Monthly\nAlert Type\nStatus\nDocument Type",
      default: "Monthly",
    },
  ],

  formatter: function (value, row, column, data, default_formatter) {
    value = default_formatter(value, row, column, data);

    if (column.fieldname == "count" && data.count > 100) {
      value = "<span style='color:red'>" + value + "</span>";
    }

    return value;
  },
};
