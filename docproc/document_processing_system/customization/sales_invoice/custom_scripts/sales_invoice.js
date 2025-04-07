frappe.ui.form.on("Sales Invoice", {
  refresh: function (frm) {
    // Any refresh logic if needed
  },
});

// Handle service removal in the child table
frappe.ui.form.on("Sales Invoice Services", {
  custom_quotation_services_remove: function (frm) {
    remove_related_items(frm);
  },
});

function remove_related_items(frm) {
  // Get valid sequences from current services
  const valid_sequences = new Set(
    (frm.doc.custom_quotation_services || []).map((s) => s.service_sequence)
  );

  // Filter items to keep only those with valid sequences
  frm.doc.items = (frm.doc.items || []).filter((item) =>
    valid_sequences.has(item.custom_service_sequence)
  );

  // Refresh the items field
  frm.refresh_field("items");
}

frappe.ui.form.on("Sales Invoice", {
  refresh: function (frm) {
    // Any refresh logic if needed
  },
});

// Handle changes in the Items table
frappe.ui.form.on("Sales Invoice Item", {
  qty: function (frm) {
    calculate_totals(frm);
  },
  rate: function (frm) {
    calculate_totals(frm);
  },
  amount: function (frm) {
    calculate_totals(frm);
  },
});

frappe.ui.form.on("Sales Invoice", {
  refresh: function (frm) {
    calculate_totals(frm);
  },
});

frappe.ui.form.on("Sales Invoice Item", {
  qty: function (frm) {
    if (frm.doctype === "Sales Invoice") {
      calculate_totals(frm);
    }
  },
  rate: function (frm) {
    if (frm.doctype === "Sales Invoice") {
      calculate_totals(frm);
    }
  },
  amount: function (frm) {
    if (frm.doctype === "Sales Invoice") {
      calculate_totals(frm);
    }
  },
});

function calculate_totals(frm) {
  // Check if we're on a Sales Invoice form
  if (frm.doctype !== "Sales Invoice") return;

  let total_qty = 0;
  let total = 0;

  // Calculate totals from items
  (frm.doc.items || []).forEach((item) => {
    total_qty += flt(item.qty);
    total += flt(item.amount);
  });

  // Only set total_qty if the field exists in the current form
  if (frm.fields_dict["total_qty"]) {
    frm.set_value("total_qty", total_qty);
  }

  // Set total if the field exists
  if (frm.fields_dict["total"]) {
    frm.set_value("total", total);
  }

  // Calculate and set grand total (including taxes if any)
  if (frm.fields_dict["grand_total"]) {
    const tax_amount = flt(frm.doc.total_taxes_and_charges) || 0;
    const grand_total = total + tax_amount;
    frm.set_value("grand_total", grand_total);
  }
}

// Add a cleanup function when switching between forms
frappe.ui.form.on("Service Estimate", {
  refresh: function (frm) {
    // Clear any persisting SI-specific fields from localStorage
    if (localStorage.getItem("total_qty")) {
      localStorage.removeItem("total_qty");
    }
  },
});
