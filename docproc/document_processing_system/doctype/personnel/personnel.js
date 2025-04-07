// Copyright (c) 2024, Simon Wanyama and contributors
// For license information, please see license.txt

frappe.ui.form.on("Personnel", {
  refresh(frm) {
    frm.trigger("filter_personnel_documents");
    frm.trigger("filter_personnel_vehicles");
    frm.trigger("filter_personnel_dependents");
    frm.trigger("refresh_conflict");
    frm.trigger("validate_issue_dates");
    frm.trigger("toggle_vehicles_and_dependents");
    frm.trigger("disable_edit_childtable");
  },
  validate(frm) {
    frm.trigger("validate_email");
    frm.trigger("validate_reqd_document_fields");
  },
  personnel_type(frm) {
    frm.trigger("filter_primary_personnel");
    frm.set_value("business", "");
    frm.set_value("primary_personnel", "");
  },
  validate_issue_dates(frm) {
    issue_date_fields = [
      "passport_date_of_issue",
      "visa_date_of_issue",
      "emirates_card_date_of_issue",
      "labor_card_date_of_issue",
      "health_insurance_date_of_issue",
      "driving_licence_date_of_issue",
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
  refresh_conflict(frm) {
    if (frm.doc.__needs_refresh) {
      if (frm.doc.__unsaved) {
        frm.reload_doc();
      }
    }
  },
  filter_primary_personnel(frm) {
    if (frm.doc.personnel_type == "Dependent") {
      frm.set_query("primary_personnel", function () {
        return {
          filters: [
            ["name", "!=", frm.doc.name],
            ["active", "=", 1],
          ],
        };
      });
    }
  },
  filter_personnel_documents(frm) {
    frm.fields_dict["additional_personnel_documents"].grid.get_field(
      "document_type"
    ).get_query = function (doc, cdt, cdn) {
      return {
        filters: [
          ["document_type", "=", "Individual Document"],
          ["system", "=", 0],
        ],
      };
    };
  },
  filter_personnel_vehicles(frm) {
    if (!frm.is_new()) {
      frm.fields_dict["personnel_vehicles"].grid.get_field(
        "license_plate_number"
      ).get_query = function (doc, cdt, cdn) {
        return {
          filters: [
            ["owner_type", "=", "Personnel"],
            ["personal_owner", "=", frm.doc.name],
            ["active", "=", 0],
          ],
        };
      };
    }
  },
  filter_personnel_dependents(frm) {
    if (!frm.is_new()) {
      frm.fields_dict["personnel_dependents"].grid.get_field(
        "dependent_name"
      ).get_query = function (doc, cdt, cdn) {
        return {
          filters: [
            ["personnel_type", "=", "Dependent"],
            ["primary_personnel", "=", frm.doc.name],
            ["active", "=", 0],
          ],
        };
      };
    }
  },
  validate_email(frm) {
    // Validate for General fields
    email_fields = [frm.doc.email_address];
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    for (const email of email_fields) {
      if (email && !emailPattern.test(email)) {
        frappe.msgprint(__("Please enter a Valid Email Address."));
        frappe.validated = false;
      }
    }
  },
  validate_reqd_document_fields(frm) {
    // Field Mappings
    const documents = {
      "Driving Licence": {
        document_id: "driving_licence_id",
        date_of_issue: "driving_licence_date_of_issue",
        date_of_expiry: "driving_licence_date_of_expiry",
      },
      VISA: {
        document_id: "visa_id",
        date_of_issue: "visa_date_of_issue",
        date_of_expiry: "visa_date_of_expiry",
      },
      Passport: {
        document_id: "passport_id",
        date_of_issue: "passport_date_of_issue",
        date_of_expiry: "passport_date_of_expiry",
      },
      "Health Insurance": {
        document_id: "health_insurance_card_id",
        date_of_issue: "health_insurance_date_of_issue",
        date_of_expiry: "health_insurance_date_of_expiry",
      },
      "Work Permit": {
        document_id: "labor_card_id",
        date_of_issue: "labor_card_date_of_issue",
        date_of_expiry: "labor_card_date_of_expiry",
      },
      "Employment Insurance": { date_of_expiry: "iloea_date_of_expiry" },
      "Emirates Card": {
        document_id: "emirates_card_id",
        date_of_issue: "emirates_card_date_of_issue",
        date_of_expiry: "emirates_card_date_of_expiry",
      },
    };

    // Function to format field names
    function formatFieldName(field) {
      return field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }

    // Loop through each document type
    for (let doc_type in documents) {
      let doc_fields = documents[doc_type];

      if (doc_type === "Employment Insurance") {
        let date_of_expiry = frm.doc[doc_fields.date_of_expiry];

        if (date_of_expiry) {
          // No need to check for document_id as it does not exist
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
  toggle_vehicles_and_dependents(frm) {
    const is_new = frm.is_new();
    const is_type_dependent = frm.doc.personnel_type === "Dependent";
    const has_primary_personnel = !!frm.doc.primary_personnel;
    let is_dependent = is_type_dependent && has_primary_personnel;

    if (is_dependent || is_new)
      frm.set_df_property("personnel_vehicles", "hidden", true);
    if (is_dependent || is_new)
      frm.set_df_property("personnel_dependents", "hidden", true);
  },
  disable_edit_childtable(frm) {
    $(".btn-open-row a").hide();
  },
});

// frappe.ui.form.on("Vehicles", {
//   personnel_vehicles_add(frm, cdt, cdn) {
//     $(".btn-open-row a").hide();
//   },
//   license_plate_number(frm, cdt, cdn) {
//     const row = locals[cdt][cdn];
//     const parent = frm.doc.name;
//     if (!row.license_plate_number) {
//       if (frappe.set_route("car-and-carrier/new-car-and-carrier")) {
//         frappe.route_options = {
//           owner_type: "Personnel",
//           personal_owner: frm.doc.name,
//         };
//       }
//     } else {
//       frappe.route_options = {};
//       frappe.set_route("Form", "Personnel", parent);
//       // frm.reload_doc();
//     }
//   },
//   before_personnel_vehicles_remove(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];
//     // delete the Business Vehicle with this license_plate_number(name) from Business Vehicle doctype
//     if (row.license_plate_number) {
//       frappe.call({
//         method:
//           "docproc.document_processing_system.doctype.car_and_carrier.car_and_carrier.deactivate_vehicle",
//         args: {
//           vehicle: row.license_plate_number,
//         },
//         callback: function (r) {
//           if (r.message) {
//             frappe.show_alert({
//               message: r.message,
//             });
//           }
//           frm.save();
//         },
//       });
//     }
//   },
// });

// frappe.ui.form.on('Personnel Dependents', {
//     personnel_dependents_add(frm, cdt, cdn) {
//         $('.btn-open-row a').hide();
//     },
//     dependent_name(frm, cdt, cdn) {
//         const row = locals[cdt][cdn];
//         const parent = frm.doc.name
//         // frm.reload_doc()
//         if(!row.dependent_name){
//             if(frappe.set_route('Form', 'Personnel', 'new-personnel')){
//                 frappe.route_options = {
//                     "personnel_type": 'Dependent',
//                     "primary_personnel": frm.doc.name
//                 };
//             }
//         }else{
//             frappe.route_options = {}
//             frappe.set_route('Form', 'Personnel', parent)

//         }
//     },
//     before_personnel_dependents_remove(frm, cdt, cdn) {
//         const row = locals[cdt][cdn];
//         // Deactivate the Personnel Dependent with this dependent_name(name) from Personnel doctype
//         if(row.dependent_name) {
//             frappe.call({
//                 method: 'docproc.document_processing_system.doctype.personnel.personnel.deactivate_personnel',
//                 args: {
//                     personnel: row.dependent_name,
//                 },
//                 callback: function(r) {
//                     if(!r.exc) {
//                         frm.save_or_update();
//                         frappe.show_alert({
//                             message: `Personnel ${r.message}`,
//                             indicator: 'green'
//                         });

//                     }
//                 }
//             });
//        }
//     }
// })

frappe.ui.form.on("Vehicles", {
  personnel_vehicles_add: function (frm, cdt, cdn) {
    $(".btn-open-row a").hide();
    // Navigate directly to new Car and Carrier form with auto-filled fields
    frappe.new_doc("Car and Carrier", {
      owner_type: "Personnel",
      personal_owner: frm.doc.full_name,
    });
  },

  license_plate_number(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    const parent = frm.doc.name;
    if (!row.license_plate_number) {
      frappe.new_doc("Car and Carrier", {
        owner_type: "Personnel",
        personal_owner: frm.doc.full_name,
      });
    } else {
      frappe.route_options = {};
      frappe.set_route("Form", "Personnel", parent);
    }
  },

  before_personnel_vehicles_remove: function (frm, cdt, cdn) {
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

frappe.ui.form.on("Personnel Dependents", {
  personnel_dependents_add: function (frm, cdt, cdn) {
    $(".btn-open-row a").hide();
    // Navigate directly to new Personnel form
    frappe.new_doc("Personnel", {
      personnel_type: "Dependent",
      primary_personnel: frm.doc.full_name,
    });
  },

  dependent_name(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    const parent = frm.doc.name;
    if (!row.dependent_name) {
      frappe.new_doc("Personnel", {
        personnel_type: "Dependent",
        primary_personnel: frm.doc.full_name,
      });
    } else {
      frappe.route_options = {};
      frappe.set_route("Form", "Personnel", parent);
    }
  },

  before_personnel_dependents_remove: function (frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    if (row.dependent_name) {
      frappe.call({
        method:
          "docproc.document_processing_system.doctype.personnel.personnel.deactivate_personnel",
        args: {
          personnel: row.dependent_name,
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
  additional_personnel_documents_add(frm, cdt, cdn) {
    $(".btn-open-row a").hide();

    const row = locals[cdt][cdn];
    date_of_issue_field = row.date_of_issue;
    date_of_issue_field.datepicker.update({
      minDate: null,
      maxDate: new Date(),
    });
  },
  document_type(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    const parent = frm.doc.name;
    if (!row.document_type) {
      if (frappe.set_route("legal-document/new-legal-document")) {
        frappe.route_options = {
          document_type: "Individual Document",
        };
      }
    } else {
      frappe.route_options = {};
      frappe.set_route("Form", "Personnel", parent);
    }
  },
});
