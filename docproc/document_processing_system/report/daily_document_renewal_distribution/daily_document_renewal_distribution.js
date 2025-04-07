// Copyright (c) 2025, Khalandar Sihan and contributors
// For license information, please see license.txt

frappe.query_reports["Document Renewal Distribution"] = {
  filters: [
    {
      fieldname: "from_date",
      label: __("From Date"),
      fieldtype: "Date",
      default: frappe.datetime.add_months(frappe.datetime.get_today(), -12),
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
      fieldname: "document_type",
      label: __("Document Type"),
      fieldtype: "Link",
      options: "Legal Document",
    },
  ],

  formatter: function (value, row, column, data, default_formatter) {
    value = default_formatter(value, row, column, data);

    if (
      column.fieldname == "thirty_day_percentage" ||
      column.fieldname == "sixty_day_percentage"
    ) {
      value = value + "%";
    }

    if (column.fieldname.includes("expiring_") && value > 0) {
      value = `<span style="color: ${
        value > data.total_docs * 0.5 ? "red" : "orange"
      }">${value}</span>`;
    }

    if (column.fieldname == "total_docs") {
      value = `<b>${value}</b>`;
    }

    return value;
  },

  onload: function (report) {
    report.page.add_inner_button(__("Export Data"), function () {
      frappe.prompt(
        [
          {
            label: __("File Name"),
            fieldname: "file_name",
            fieldtype: "Data",
            default: "Document_Renewals_" + frappe.datetime.get_today(),
          },
        ],
        function (data) {
          frappe.request({
            method: "frappe.desk.reportview.export_query",
            args: {
              title: data.file_name,
              filters: report.get_values(),
              report_ref: report.report_name,
              file_format_type: "Excel",
            },
          });
        },
        __("Export"),
        __("Export")
      );
    });
  },
};
