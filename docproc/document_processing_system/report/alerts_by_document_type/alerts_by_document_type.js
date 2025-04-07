// Copyright (c) 2025, Khalandar Sihan and contributors
// For license information, please see license.txt

// alerts_by_document_type.js
frappe.query_reports["Alerts by Document Type"] = {
  filters: [
    {
      fieldname: "from_date",
      label: "From Date",
      fieldtype: "Date",
      default: frappe.datetime.add_months(frappe.datetime.get_today(), -1),
      reqd: 1,
    },
    {
      fieldname: "to_date",
      label: "To Date",
      fieldtype: "Date",
      default: frappe.datetime.get_today(),
      reqd: 1,
    },
    {
      fieldname: "document_type",
      label: "Document Type",
      fieldtype: "Link",
      options: "Legal Document",
    },
  ],
};
