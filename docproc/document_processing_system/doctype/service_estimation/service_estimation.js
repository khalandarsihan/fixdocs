frappe.ui.form.on("Service Estimation", {
  refresh: function (frm) {
    // Override the check_if_latest method
    frm.doc.check_if_latest = function () {
      return true;
    };
    frappe.model.Document.prototype.check_if_latest = function () {
      return true;
    };
  },
  before_save: function (frm) {
    frm.doc.modified = frm.doc.__oldmodified || frm.doc.modified;
    // Also override just before save
    frm.doc.check_if_latest = function () {
      return true;
    };
  },
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

  refresh: function (frm) {
    // Hide menu items based on conditions
    if (!document.querySelector("#hide-menu-items-style")) {
      const style = document.createElement("style");
      style.id = "hide-menu-items-style";
      style.textContent = `
    [data-label="Help"] { display: none !important; }
    ${
      frm.doc.workflow_state === "Complete"
        ? `
      button.btn.btn-secondary.btn-default.btn-sm[data-label="Cancel"],
      div.actions-btn-group button[data-label="Cancel"] {
        display: none !important;
      }
    `
        : ""
    }
  `;
      document.head.appendChild(style);
    }

    // Make all fields read-only if workflow_state is Cancelled
    if (frm.doc.workflow_state === "Cancelled") {
      frm.fields.forEach((field) => {
        frm.set_df_property(field.df.fieldname, "read_only", 1);
      });

      // Also make child tables read-only
      ["quotation_services", "items"].forEach((table) => {
        frm.set_df_property(table, "read_only", 1);
      });

      // Hide specific fields
      [
        "service_for_business",
        "service_for_person",
        "service_for_vehicle",
      ].forEach((field) => {
        frm.set_df_property(field, "hidden", 1);
      });
    }

    // Dynamically set query for service_for_person and service_for_vehicle

    frm.set_query("service_for_person", function () {
      if (frm.doc.quotation_to === "Business" && frm.doc.business_name) {
        return {
          query:
            "docproc.document_processing_system.doctype.service_estimation.service_estimation.get_business_staff",
          filters: { business_name: frm.doc.business_name },
        };
      } else if (
        frm.doc.quotation_to === "Personnel" &&
        frm.doc.personnel_name
      ) {
        return {
          query:
            "docproc.document_processing_system.doctype.service_estimation.service_estimation.get_personnel_dependents",
          filters: { personnel_name: frm.doc.personnel_name },
        };
      }
    });

    frm.set_query("service_for_vehicle", function () {
      if (frm.doc.quotation_to === "Business" && frm.doc.business_name) {
        return {
          query:
            "docproc.document_processing_system.doctype.service_estimation.service_estimation.get_business_vehicles",
          filters: { business_name: frm.doc.business_name },
        };
      } else if (
        frm.doc.quotation_to === "Personnel" &&
        frm.doc.personnel_name
      ) {
        return {
          query:
            "docproc.document_processing_system.doctype.service_estimation.service_estimation.get_personnel_vehicles",
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

  // Auto-clear business field after delay
  service_for_business: function (frm) {
    if (frm.doc.service_for_business) {
      frappe.call({
        method:
          "docproc.document_processing_system.doctype.service_estimation.service_estimation.update_quotation_services",
        args: {
          doc: frm.doc,
        },
        freeze: true,
        callback: function (r) {
          if (r.message) {
            // Update the local doc
            frappe.model.sync(r.message);
            frm.refresh();
          }
        },
      });
      setTimeout(() => frm.set_value("service_for_business", ""), 1000);
    }
  },

  // Auto-clear person field after delay
  service_for_person: function (frm) {
    if (frm.doc.service_for_person) {
      frappe.call({
        method:
          "docproc.document_processing_system.doctype.service_estimation.service_estimation.update_quotation_services",
        args: {
          doc: frm.doc,
        },
        freeze: true,
        callback: function (r) {
          if (r.message) {
            // Update the local doc
            frappe.model.sync(r.message);
            frm.refresh();
          }
        },
      });
      setTimeout(() => frm.set_value("service_for_person", ""), 1000);
    }
  },

  // Auto-clear vehicle field after delay
  service_for_vehicle: function (frm) {
    if (frm.doc.service_for_vehicle) {
      frappe.call({
        method:
          "docproc.document_processing_system.doctype.service_estimation.service_estimation.update_quotation_services",
        args: {
          doc: frm.doc,
        },
        freeze: true,
        callback: function (r) {
          if (r.message) {
            // Update the local doc
            frappe.model.sync(r.message);
            frm.refresh();
          }
        },
      });
      setTimeout(() => frm.set_value("service_for_vehicle", ""), 1000);
    }
  },
});

// // Add click handler for Work button
// function handle_work_creation(frm) {
//   frappe.call({
//     method:
//       "docproc.document_processing_system.doctype.service_estimation.service_estimation.create_work_records",
//     args: {
//       doc: frm.doc,
//     },
//     callback: function (r) {
//       if (r.message && r.message.length > 0) {
//         if (r.message.length === 1) {
//           frappe.set_route("Form", "Work", r.message[0]);
//         } else {
//           frappe.set_route("List", "Work", {
//             linked_service_estimation: frm.doc.name,
//           });
//         }
//       }
//     },
//   });
// }

// // Add click handler for Work button
function handle_work_creation(frm) {
  frappe.call({
    method:
      "docproc.document_processing_system.doctype.service_estimation.service_estimation.create_work_records",
    args: {
      doc: frm.doc,
    },
    freeze: true,
    callback: function (r) {
      if (r.message && r.message.work_url) {
        // Remove domain part and navigate
        const route = r.message.work_url
          .replace(frappe.utils.get_url(), "")
          .replace("/app/", "");
        window.location.href = route;
      }
    },
  });
}

function handle_generate_invoice_creation(frm) {
  frappe.call({
    method:
      "docproc.document_processing_system.doctype.service_estimation.service_estimation.create_sales_invoice",
    args: {
      doc: frm.doc,
    },
    freeze: true,
    callback: function (r) {
      if (r.message && r.message.sales_invoice_url) {
        const route = r.message.sales_invoice_url
          .replace(frappe.utils.get_url(), "")
          .replace("/app/", "");
        window.location.href = route;
      }
    },
  });
}

// Function to sync items with quotation services
function sync_items_with_services(frm) {
  const services = frm.doc.quotation_services || [];
  const items = frm.doc.items || [];

  // Create map of valid services
  const serviceMap = services.reduce((acc, service) => {
    acc[
      `${service.service_name}-${service.service_for}-${service.service_sequence}`
    ] = true;
    return acc;
  }, {});

  // Filter items to keep only those matching services
  frm.doc.items = items.filter((item) => {
    const key = `${item.custom_service}-${item.custom_service_for}-${item.custom_service_sequence}`;
    return serviceMap[key];
  });

  // Renumber items
  frm.doc.items.forEach((item, idx) => {
    item.idx = idx + 1;
  });

  frm.refresh_field("items");
  frm.trigger("update_totals_and_calculations");
}

// Quotation Services handlers
frappe.ui.form.on("Quotation Services", {
  quotation_services_remove: function (frm) {
    sync_items_with_services(frm);
  },

  quotation_services_add: function (frm) {
    sync_items_with_services(frm);
  },
});
