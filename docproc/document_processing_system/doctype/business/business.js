// // Copyright (c) 2024, Simon Wanyama and contributors
// // For license information, please see license.txt

frappe.ui.form.on("Business", {
  refresh(frm) {
    frm.trigger("filter_individual_partners");
    frm.trigger("filter_business_partners");
    frm.trigger("filter_business_vehicles");
    frm.trigger("filter_business_documents");
    frm.trigger("filter_business_staff");
    frm.trigger("disable_duplicate_button");
    frm.trigger("toggle_linked_tabs");
    frm.trigger("disable_edit_childtable");
    frm.trigger("refresh_conflict");
    frm.trigger("validate_issue_dates");
  },
  validate(frm) {
    validate_email_in_child_table(frm);
    frm.trigger("validate_document_fields");
  },
  validate_document_fields(frm) {
    // document fields mapping
    const documents = {
      "Company Commercial License": {
        document_id: "licence_number",
        date_of_issue: "licence_issue_date",
        date_of_expiry: "licence_expiry_date",
      },
      "Civil Defence Certificate": {
        document_id: "certificate_id",
        date_of_issue: "matafi_issue_date",
        date_of_expiry: "matafi_expiry_date",
      },
      "Immigration Establishment Card": {
        document_id: "iec_card_number",
        date_of_issue: "iec_issue_date",
        date_of_expiry: "iec_expiry_date",
        signatory_authority: "signatory_authority",
      },
      "Labor Establishment Card": {
        document_id: "lec_number",
        date_of_issue: "lec_issue_date",
        date_of_expiry: "lec_expiry_date",
      },
      "E Channel": {
        username: "e_channel_username",
        password: "e_channel_password",
        date_of_expiry: "e_channel_expiry_date",
      },
    };

    // Function to format field names
    function formatFieldName(field) {
      return field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }

    // Loop through each document type
    for (let doc_type in documents) {
      let doc_fields = documents[doc_type];

      if (doc_type === "E Channel") {
        let username = frm.doc[doc_fields.username];
        let password = frm.doc[doc_fields.password];
        let date_of_expiry = frm.doc[doc_fields.date_of_expiry];

        if (username || password || date_of_expiry) {
          if (!username) {
            frappe.msgprint(
              __("Please provide the {0} for {1}", [
                formatFieldName(doc_fields.username),
                doc_type,
              ])
            );
            frappe.validated = false;
          }
          if (!password) {
            frappe.msgprint(
              __("Please provide the {0} for {1}", [
                formatFieldName(doc_fields.password),
                doc_type,
              ])
            );
            frappe.validated = false;
          }
          if (!date_of_expiry) {
            frappe.msgprint(
              __("Please provide the expiry date for {0}", [doc_type])
            );
            frappe.validated = false;
          }
        }
      } else {
        let document_id = frm.doc[doc_fields.document_id];
        let date_of_issue = frm.doc[doc_fields.date_of_issue];
        let date_of_expiry = frm.doc[doc_fields.date_of_expiry];

        if (document_id || date_of_issue || date_of_expiry) {
          if (!document_id) {
            frappe.msgprint(
              __("Please provide the {0} for {1}", [
                formatFieldName(doc_fields.document_id),
                doc_type,
              ])
            );
            frappe.validated = false;
          }
          if (!date_of_issue) {
            frappe.msgprint(
              __("Please provide the {0} for {1}", [
                formatFieldName(doc_fields.date_of_issue),
                doc_type,
              ])
            );
            frappe.validated = false;
          }
          if (!date_of_expiry) {
            frappe.msgprint(
              __("Please provide the expiry date for {0}", [doc_type])
            );
            frappe.validated = false;
          }
        }
      }
    }
  },
  refresh_conflict(frm) {
    if (frm.doc.__needs_refresh) {
      if (frm.doc.__unsaved) {
        frm.reload_doc();
      }
    }
  },
  validate_issue_dates(frm) {
    issue_date_fields = [
      "licence_issue_date",
      "matafi_issue_date",
      "lec_issue_date",
      "iec_issue_date",
    ];

    for (const issue_date_field of issue_date_fields) {
      if (frm.fields_dict[issue_date_field].datepicker) {
        frm.fields_dict[issue_date_field].datepicker.update({
          minDate: null,
          maxDate: new Date(),
        });
      }
    }
  },
  filter_individual_partners(frm) {
    if (!frm.is_new()) {
      frm.fields_dict["individual_partners"].grid.get_field(
        "individual_partner"
      ).get_query = function (doc, cdt, cdn) {
        return {
          filters: [["active", "=", 1]],
        };
      };
    }
  },
  filter_business_partners(frm) {
    if (!frm.is_new()) {
      frm.fields_dict["business_partners"].grid.get_field(
        "business_partner"
      ).get_query = function (doc, cdt, cdn) {
        return {
          filters: [
            ["company_name", "!=", frm.doc.name],
            ["active", "=", 1],
          ],
        };
      };
    }
  },
  filter_business_vehicles(frm) {
    if (!frm.is_new()) {
      frm.fields_dict["business_vehicles"].grid.get_field(
        "license_plate_number"
      ).get_query = function (doc, cdt, cdn) {
        return {
          filters: [
            ["owner_type", "=", "Business"],
            ["business_owner", "=", frm.doc.name],
            ["active", "=", 0],
          ],
        };
      };
    }
  },
  filter_business_documents(frm) {
    frm.fields_dict["business_documents"].grid.get_field(
      "document_type"
    ).get_query = function (doc, cdt, cdn) {
      return {
        filters: [
          ["document_type", "=", "Business Document"],
          ["system", "=", 0],
        ],
      };
    };
  },
  filter_business_staff(frm) {
    frm.fields_dict["business_staff"].grid.get_field("staff_name").get_query =
      function (doc, cdt, cdn) {
        return {
          filters: [
            ["personnel_type", "=", "Business Staff"],
            ["business", "=", frm.doc.name],
            ["active", "=", 0],
          ],
        };
      };
  },
  disable_duplicate_button(frm) {
    $(document).ready(function () {
      $("a.grey-link.dropdown-item span[data-label='Duplicate']")
        .closest("li")
        .hide();
    });
  },
  toggle_linked_tabs(frm) {
    const is_new = frm.is_new();
    $("#business-vehicles_tab-tab, #business-staff_tab-tab").toggle(!is_new);
  },
  disable_edit_childtable(frm) {
    $(".btn-open-row a").hide();
  },
});

function validate_email_in_child_table(frm) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (frm.doc.business_contacts && frm.doc.business_contacts.length) {
    frm.doc.business_contacts.forEach(function (row) {
      if (row.email_address && !emailPattern.test(row.email_address)) {
        frappe.msgprint(
          __(
            "Please enter a valid email address for Business Contact: " +
              row.full_name
          )
        );
        frappe.validated = false;
        return false;
      }
    });
  }
}

// frappe.ui.form.on("Vehicles", {
//   business_vehicles_add: function (frm, cdt, cdn) {
//     $(".btn-open-row a").hide();
//   },
//   license_plate_number(frm, cdt, cdn) {
//     const row = locals[cdt][cdn];
//     const parent = frm.doc.name;
//     if (!row.license_plate_number) {
//       if (frappe.set_route("car-and-carrier/new-car-and-carrier")) {
//         frappe.route_options = {
//           owner_type: "Business",
//           business_owner: frm.doc.name,
//         };
//       }
//     } else {
//       frappe.route_options = {};
//       frappe.set_route("Form", "Business", parent);
//       frm.refresh();
//     }
//   },
//   before_business_vehicles_remove(frm, cdt, cdn) {
//     const row = locals[cdt][cdn];
//     // Deactivate Vehicle with this license_plate_number(name) from Vehicle doctype
//     if (row.license_plate_number) {
//       frappe.call({
//         method:
//           "docproc.document_processing_system.doctype.car_and_carrier.car_and_carrier.deactivate_vehicle",
//         args: {
//           vehicle: row.license_plate_number,
//         },
//         callback: function (r) {
//           if (r.message) {
//             frm.save_or_update();
//             frappe.show_alert({
//               message: r.message,
//               indicator: "blue",
//             });
//           }
//         },
//       });
//     }
//   },
// });

frappe.ui.form.on("Vehicles", {
  business_vehicles_add: function (frm, cdt, cdn) {
    $(".btn-open-row a").hide();
    // Navigate directly to new Car and Carrier form with auto-filled fields
    frappe.new_doc("Car and Carrier", {
      owner_type: "Business",
      business_owner: frm.doc.company_name,
    });
  },

  license_plate_number(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    const parent = frm.doc.name;
    if (!row.license_plate_number) {
      frappe.new_doc("Car and Carrier", {
        owner_type: "Business",
        business_owner: frm.doc.company_name,
      });
    } else {
      frappe.route_options = {};
      frappe.set_route("Form", "Business", parent);
    }
  },

  before_business_vehicles_remove: function (frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    if (row.license_plate_number) {
      frappe.call({
        method:
          "docproc.document_processing_system.doctype.car_and_carrier.car_and_carrier.deactivate_vehicle",
        args: {
          vehicle: row.license_plate_number,
        },
        callback: function (r) {
          if (r.message) {
            frm.save_or_update();
            frappe.show_alert({
              message: r.message,
              indicator: "blue",
            });
          }
        },
      });
    }
  },
});

frappe.ui.form.on("Business Staff", {
  business_staff_add: function (frm, cdt, cdn) {
    $(".btn-open-row a").hide();
    // Navigate directly to new Personnel form
    frappe.new_doc("Personnel", {
      personnel_type: "Business Staff",
      business: frm.doc.company_name,
    });
  },
  staff_name(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    const parent = frm.doc.name;
    if (!row.staff_name) {
      frappe.new_doc("Personnel", {
        personnel_type: "Business Staff",
        business: frm.doc.company_name,
      });
    } else {
      frappe.route_options = {};
      frappe.set_route("Form", "Business", parent);
    }
  },
  before_business_staff_remove: function (frm, cdt, cdn) {
    // Your existing remove code stays the same
    const row = locals[cdt][cdn];
    if (row.staff_name) {
      frappe.call({
        method:
          "docproc.document_processing_system.doctype.personnel.personnel.deactivate_personnel",
        args: {
          personnel: row.staff_name,
        },
        callback: function (r) {
          if (r.message) {
            frm.save_or_update();
            frappe.show_alert({
              message: `Personnel ${r.message}`,
              indicator: "green",
            });
          }
        },
      });
    }
  },
});

frappe.ui.form.on("Legal Documents", {
  document_type(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    const parent = frm.doc.name;
    if (!row.document_type) {
      if (frappe.set_route("legal-document/new-legal-document")) {
        frappe.route_options = {
          document_type: "Business Document",
        };
      }
    } else {
      frappe.route_options = {};
      frappe.set_route("Form", "Business", parent);
      // frm.reload_doc();
    }
  },
  business_documents_add(frm, cdt, cdn) {
    $(".btn-open-row a").hide();
  },
});

frappe.ui.form.on("Individual Partners", {
  individual_partners_add: function (frm, cdt, cdn) {
    $(".btn-open-row a").hide();
  },
});

frappe.ui.form.on("Business Partners", {
  business_partners_add: function (frm, cdt, cdn) {
    $(".btn-open-row a").hide();
  },
});

frappe.ui.form.on("Business Contacts", {
  business_contacts_add: function (frm, cdt, cdn) {
    $(".btn-open-row a").hide();
    var child = locals[cdt][cdn];
    frm.set_df_property(
      "business_contacts",
      "default",
      "+971- ",
      frm.docname,
      "phone_number",
      child.name
    );
  },
});

frappe.ui.form.on("Bank Accounts", {
  bank_accounts_add: function (frm, cdt, cdn) {
    $(".btn-open-row a").hide();
  },
});
