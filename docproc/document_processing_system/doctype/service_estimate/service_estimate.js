// Copyright (c) 2025, Khalandar Sihan and contributors
// For license information, please see license.txt

frappe.ui.form.on("Service Estimate", {
  // Maps document types to service categories
  document_type: function (frm) {
    const mapping = {
      "Business Document": "Business",
      "Individual Document": "Personnel",
      "Vehicle Document": "Car and Carrier",
    };

    if (frm.doc.document_type in mapping) {
      setTimeout(() => {
        frm.set_value("service_for_link", mapping[frm.doc.document_type]);
      }, 100);
    }
  },

  // Filters service names based on type and quotation
  service_type: function (frm) {
    // Clear dependent fields
    frm.set_value("service_name", "");
    frm.set_value("service_for_link", "");

    frm.set_query("service_name", function () {
      let filters = {
        service_type: frm.doc.service_type,
        active: 1,
      };

      if (frm.doc.quotation_to === "Personnel") {
        filters["document_type"] = ["!=", "Business Document"];
      }

      return { filters };
    });
  },

  before_load(frm) {
    // Remove default row from quotation_services
    if (
      frm.doc.quotation_services &&
      frm.doc.quotation_services.length === 1 &&
      !frm.doc.quotation_services[0].service_name
    ) {
      frm.doc.quotation_services = [];
    }
  },

  refresh(frm) {
    restore_alert_statuses(frm);

    // Show Save button always, but hide Actions for new forms
    frm.page.btn_primary.show();
    frm.page.actions_btn_group.toggle(!frm.is_new());

    // Remove existing custom buttons if they exist
    $(".custom-action-btn").remove();

    // Create action buttons
    const $btnContainer = frm.page.btn_primary.parent();
    const workBtn = $(
      `<button class="btn btn-primary btn-sm custom-action-btn">Work</button>`
    )
      .hide()
      .appendTo($btnContainer);
    const invoiceBtn = $(
      `<button class="btn btn-primary btn-sm custom-action-btn">Sales Invoice</button>`
    )
      .hide()
      .appendTo($btnContainer);

    // Show/hide based on status
    if (
      [
        "To Work and Bill",
        "To Work",
        "To Bill",
        "Cancelled",
        "Complete",
      ].includes(frm.doc.status)
    ) {
      frm.page.btn_primary.hide();
      frm.page.actions_btn_group.hide();

      if (["To Work and Bill", "To Work"].includes(frm.doc.status)) {
        workBtn.show();
      }
      if (["To Work and Bill", "To Bill"].includes(frm.doc.status)) {
        invoiceBtn.show();
      }

      makeFormReadOnly(frm);
    }

    // Add action handlers
    frm.page.add_action_item("Approve", () => {
      frm.set_value("status", "To Work and Bill");
      frm.save().then(() => {
        frm.page.btn_primary.hide();
        frm.page.actions_btn_group.hide();
        workBtn.show();
        invoiceBtn.show();
        makeFormReadOnly(frm);
      });
    });

    frm.page.add_action_item("Cancel", () => {
      frm.set_value("status", "Cancelled");
      frm.save().then(() => {
        frm.page.btn_primary.hide();
        frm.page.actions_btn_group.hide();
        makeFormReadOnly(frm);
      });
    });

    // Work button click handler
    workBtn.on("click", function () {
      frappe.call({
        method:
          "docproc.document_processing_system.doctype.service_estimate.service_estimate.create_works",
        args: {
          service_estimate: frm.doc.name,
        },
        callback: function (r) {
          if (r.message) {
            // If only one work was created, redirect to that work's form
            if (r.message.length === 1) {
              frappe.set_route("Form", "Work", r.message[0]);
            }
            // If multiple works were created, show the list view filtered by the estimate
            else if (r.message.length > 1) {
              frappe.set_route("List", "Work", {
                linked_service_estimate: frm.doc.name,
              });
            }
          }
        },
      });
    });

    // // Sales Invoice button click handler
    invoiceBtn.on("click", function () {
      if (["To Work and Bill", "To Bill"].includes(frm.doc.status)) {
        handleInvoiceCreation(frm);
      }
    });

    // Dynamically set query for service_for_person and service_for_vehicle
    frm.set_query("service_for_person", function () {
      if (frm.doc.quotation_to === "Business" && frm.doc.business_name) {
        return {
          query:
            "docproc.document_processing_system.doctype.service_estimate.service_estimate.get_business_staff",
          filters: { business_name: frm.doc.business_name },
        };
      } else if (
        frm.doc.quotation_to === "Personnel" &&
        frm.doc.personnel_name
      ) {
        return {
          query:
            "docproc.document_processing_system.doctype.service_estimate.service_estimate.get_personnel_dependents",
          filters: { personnel_name: frm.doc.personnel_name },
        };
      }
    });

    frm.set_query("service_for_vehicle", function () {
      if (frm.doc.quotation_to === "Business" && frm.doc.business_name) {
        return {
          query:
            "docproc.document_processing_system.doctype.service_estimate.service_estimate.get_business_vehicles",
          filters: { business_name: frm.doc.business_name },
        };
      } else if (
        frm.doc.quotation_to === "Personnel" &&
        frm.doc.personnel_name
      ) {
        return {
          query:
            "docproc.document_processing_system.doctype.service_estimate.service_estimate.get_personnel_vehicles",
          filters: { personnel_name: frm.doc.personnel_name },
        };
      }
    });
  },
  // Clears all fields when quotation type changes
  quotation_to: function (frm) {
    const fields = [
      "document_type",
      "service_type",
      "service_name",
      "service_for_link",
      "service_for_business",
      "service_for_person",
      "service_for_vehicle",
    ];
    fields.forEach((field) => frm.set_value(field, ""));
  },

  // Clears most fields when business/personnel changes
  business_name: function (frm) {
    [
      "service_type",
      "service_name",
      "service_for_link",
      "service_for_business",
      "service_for_person",
      "service_for_vehicle",
    ].forEach((field) => frm.set_value(field, ""));
  },

  personnel_name: function (frm) {
    [
      "service_type",
      "service_name",
      "service_for_link",
      "service_for_business",
      "service_for_person",
      "service_for_vehicle",
    ].forEach((field) => frm.set_value(field, ""));
  },

  // Clears linked service when name changes
  service_name: function (frm) {
    frm.set_value("service_for_link", "");
  },

  service_for_business: function (frm) {
    if (frm.doc.service_for_business && frm.doc.service_name) {
      add_service_and_items(frm, "service_for_business");
      setTimeout(() => frm.set_value("service_for_business", ""), 1000);
    }
  },

  service_for_person: function (frm) {
    if (frm.doc.service_for_person && frm.doc.service_name) {
      add_service_and_items(frm, "service_for_person");
      setTimeout(() => frm.set_value("service_for_person", ""), 1000);
    }
  },

  service_for_vehicle: function (frm) {
    if (frm.doc.service_for_vehicle && frm.doc.service_name) {
      add_service_and_items(frm, "service_for_vehicle");
      setTimeout(() => frm.set_value("service_for_vehicle", ""), 1000);
    }
  },
});

function makeFormReadOnly(frm) {
  // Disable form
  frm.disable_form();

  // Disable connections
  setTimeout(() => {
    // Target all add buttons in the transactions section
    $(".transactions .document-link").each(function () {
      const $row = $(this);
      // Hide the + button
      $row.find("button.btn.btn-new").hide();
    });
  }, 1000);

  // Disable child tables
  ["quotation_services", "items"].forEach((table) => {
    if (frm.fields_dict[table]) {
      frm.fields_dict[table].grid.cannot_add_rows = true;
      frm.fields_dict[table].grid.cannot_delete_rows = true;
      frm.fields_dict[table].grid.grid_rows.forEach((row) => {
        row.doc.docstatus = 1;
        row.refresh();
      });
    }
  });

  // Keep Work and Sales Invoice buttons enabled if status is "To Work and Bill"
  if (frm.doc.status === "To Work and Bill") {
    $('.custom-action-btn:contains("Work")').show().prop("disabled", false);
    $('.custom-action-btn:contains("Sales Invoice")')
      .show()
      .prop("disabled", false);
  }
}

function add_service_and_items(frm, service_for_field) {
  frappe.db
    .get_doc("Service Template", frm.doc.service_name)
    .then((template) => {
      // Add to quotation services
      let service_row = frm.add_child("quotation_services");
      service_row.service_name = template.service_name;
      service_row.service_for = frm.doc[service_for_field];
      service_row.service_sequence =
        (frm.doc.quotation_services || []).length + 1;

      // Add items from service template
      template.service_charge_item.forEach((charge) => {
        let item_row = frm.add_child("items");
        // Get company defaults
        frappe.call({
          method: "frappe.client.get_value",
          args: {
            doctype: "Company",
            filters: { name: frappe.defaults.get_default("company") },
            fieldname: ["cost_center", "default_income_account"],
          },
          callback: function (r) {
            if (r.message) {
              frappe.model.set_value(item_row.doctype, item_row.name, {
                item_code: charge.item_code,
                item_name: charge.item_name,
                qty: charge.quantity,
                rate: charge.rate,
                amount: charge.rate * charge.quantity,
                uom: charge.uom,
                custom_service: template.service_name,
                custom_service_for: service_row.service_for,
                custom_service_sequence: service_row.service_sequence,
                cost_center: r.message.cost_center,
                income_account: r.message.default_income_account,
                uom_conversion_factor: 1,
                conversion_factor: 1,
                base_rate: charge.rate,
                base_amount: charge.rate * charge.quantity,
              });
              frm.refresh_field("items");
              calculate_totals(frm);
            }
          },
        });
      });

      frm.refresh_fields(["quotation_services", "items"]);
      calculate_totals(frm);
      frm.set_value(service_for_field, "");
    });
}

frappe.ui.form.on("Quotation Services", {
  before_quotation_services_remove: function (frm, cdt, cdn) {
    let row = frappe.get_doc(cdt, cdn);
    if (row.alert) {
      // Store the alert info in a custom property on the form
      if (!frm.removed_alerts) frm.removed_alerts = [];
      frm.removed_alerts.push(row.alert);

      frappe.db.set_value("Alert", row.alert, {
        linked_service_estimate: "",
        status: "Open",
      });
    }
  },
  quotation_services_remove: function (frm) {
    remove_related_items(frm);
    // Save the form after removal to persist changes
    if (frm.removed_alerts && frm.removed_alerts.length) {
      frm.save().then(() => {
        // Clear the removed alerts array after successful save
        frm.removed_alerts = [];
      });
    }
  },
});

function remove_related_items(frm) {
  const valid_sequences = new Set(
    (frm.doc.quotation_services || []).map((s) => s.service_sequence)
  );

  frm.doc.items = (frm.doc.items || []).filter((item) =>
    valid_sequences.has(item.custom_service_sequence)
  );

  frm.refresh_field("items");
  calculate_totals(frm);
}

function calculate_totals(frm) {
  const total = (frm.doc.items || []).reduce(
    (sum, item) => sum + (flt(item.amount) || 0),
    0
  );

  const total_quantity = (frm.doc.items || []).reduce(
    (sum, item) => sum + (flt(item.qty) || 0),
    0
  );

  frm.set_value("total", total);
  frm.set_value("total_quantity", total_quantity);
  frm.set_value("grand_total", total + (frm.doc.total_taxes_and_charges || 0));
  frm.set_value(
    "in_words",
    total.toLocaleString("en-US", { style: "currency", currency: "AED" })
  );
}

function handleInvoiceCreation(frm) {
  frappe.call({
    method:
      "docproc.document_processing_system.doctype.service_estimate.service_estimate.create_sales_invoice",
    args: {
      service_estimate: frm.doc.name,
    },
    callback: function (r) {
      if (r.message) {
        const invoice_name = r.message;
        const estimate_name = frm.doc.name;

        const checkInvoiceStatus = () => {
          return new Promise((resolve, reject) => {
            frappe.call({
              method: "frappe.client.get_value",
              args: {
                doctype: "Sales Invoice",
                filters: { name: invoice_name },
                fieldname: ["docstatus", "name"],
              },
              callback: function (r) {
                if (r.message && r.message.docstatus === 1) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              },
            });
          });
        };

        const updateEstimateStatus = () => {
          return new Promise((resolve, reject) => {
            frappe.call({
              method:
                "docproc.document_processing_system.doctype.service_estimate.service_estimate.update_estimate_status",
              args: {
                estimate_name: estimate_name,
                invoice_name: invoice_name,
              },
              callback: function (r) {
                resolve(r.message);
              },
            });
          });
        };

        // Navigate to invoice
        frappe
          .set_route("Form", "Sales Invoice", invoice_name)
          .then(() => {
            // Setup event handler for invoice submission
            frappe.ui.form.on("Sales Invoice", "after_submit", function () {
              updateEstimateStatus();
            });

            // Start polling as backup
            const pollInvoiceSubmission = async () => {
              const maxAttempts = 15;
              let attempts = 0;

              const poll = async () => {
                if (attempts >= maxAttempts) return false;

                const isSubmitted = await checkInvoiceStatus();
                if (isSubmitted) return true;

                attempts++;
                await new Promise((resolve) => setTimeout(resolve, 2000));
                return poll();
              };

              return poll();
            };

            return pollInvoiceSubmission();
          })
          .then((submitted) => {
            if (submitted) {
              return updateEstimateStatus();
            }
          });
      }
    },
  });
}
// Alert status restoration handler
function restore_alert_statuses(frm) {
  if (!frm.doc.quotation_services || !frm.doc.name) return;

  // Get all alerts in the current quotation services
  const current_alerts = frm.doc.quotation_services
    .filter((row) => row.alert)
    .map((row) => ({
      alert: row.alert,
      service_name: row.service_name,
    }));

  // Update alert statuses if needed
  current_alerts.forEach((alert_row) => {
    frappe.db.get_value("Alert", alert_row.alert, "status").then((r) => {
      if (r && r.message && r.message.status === "Open") {
        // Update alert status back to Service Estimate
        frappe.db.set_value("Alert", alert_row.alert, {
          status: "Service Estimate",
          linked_service_estimate: frm.doc.name,
        });
      }
    });
  });
}
