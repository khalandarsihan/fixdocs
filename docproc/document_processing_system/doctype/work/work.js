// // Copyright (c) 2024, Simon Wanyama and contributors
// // For license information, please see license.txt

// frappe.ui.form.on("Work", {
//     refresh: function(frm) {
//         frm.trigger("filter_quotations_and_alerts");
//     },
//     work_for: function(frm) {
//         frm.trigger("filter_quotations_and_alerts");
//         frm.set_value("party", "");
//         frm.set_value("business_owner", "");
//         frm.set_value("personnel_owner", "");
//         frm.get_field('services_for').grid.remove_all();
//         frm.set_value('customer', '');
//     },
//     party: function(frm) {
//         frm.set_value("business_owner", "");
//         frm.set_value("personnel_owner", "");
//         frm.trigger("get_and_populate_party_details");
//     },
//     filter_quotations_and_alerts: function(frm) {
//         console.log("Work For:", frm.doc.work_for);
//         if(frm.doc.work_for) {
//             let filters;
//             if(frm.doc.work_for === 'Quotation') {
//                 filters = {
//                     'status': 'Open'
//                 };
//             } else if(frm.doc.work_for === 'Alert') {
//                 filters = {
//                     'status': 'Quotation'
//                 };
//             }
//             console.log("Filters applied:", filters);
//             frm.set_query('party', function() {
//                 return {
//                     filters: filters
//                 };
//             });
//         }
//     },
//     get_and_populate_party_details: function(frm) {
//         if(frm.doc.party) {
//             let docname = frm.doc.party;
//             let doctype = frm.doc.work_for;
//             frappe.call({
//                 method: "frappe.client.get",
//                 args: {
//                     doctype: doctype,
//                     filters: {
//                         name: docname
//                     }
//                 },
//                 callback: function(r) {
//                     console.log(r.message);
//                     const workFor = frm.doc.work_for;
//                     const quotationTo = r.message.quotation_to;
//                     const alertType = r.message.alert_type;
//                     const partyName = r.message.party_name;
//                     const customer_name = r.message.customer_name || r.message.bill_to;
//                     const billTo = r.message.bill_to;
//                     const services = r.message.custom_quotation_services;

//                     // Handle 'Quotation' scenarios
//                     if (workFor === "Quotation") {
//                         if (quotationTo === "Business") {
//                             frm.set_value("business_owner", partyName);
//                         } else if (quotationTo === "Personnel") {
//                             frm.set_value("personnel_owner", partyName);
//                         }

//                         // Populate Customer too
//                         frm.set_value("customer", customer_name);

//                         // Populate Services
//                         if (services){
//                             frm.clear_table('services_for');
//                             services.forEach(service => {
//                                 let child = frm.add_child('services_for');
//                                 frappe.model.set_value(child.doctype, child.name, 'service', service.service);
//                                 frappe.model.set_value(child.doctype, child.name, 'service_for', service.service_for);
//                                 frappe.model.set_value(child.doctype, child.name, 'alert', service.alert);
//                             });
        
//                             // Refresh the fields to display the new rows
//                             frm.refresh_field('services_for');
//                         }
//                     }

//                     // Handle 'Alert' scenarios
//                     if (workFor === "Alert") {
//                         if (alertType === "Business") {
//                             frm.set_value("business_owner", billTo);
//                         } else if (alertType === "Personnel") {
//                             frm.set_value("personnel_owner", r.message.personnel_primary_owner);
//                         }

//                         // Populate Customer too
//                         frm.set_value("customer", customer_name);

//                         // Populate Services
//                         frappe.call({
//                             method: "fetch_quotation_services_for_alert",
//                             doc: frm.doc,
//                             args: {
//                                 alert: r.message.name
//                             },
//                             callback: (r) => {
//                                 if (r.message) {
//                                     console.log(r.message);
//                                     frm.clear_table('services_for');
//                                     r.message.forEach(service => {
//                                         let child = frm.add_child('services_for');
//                                         frappe.model.set_value(child.doctype, child.name, 'service', service.service);
//                                         frappe.model.set_value(child.doctype, child.name, 'service_for', service.service_for);
//                                         frappe.model.set_value(child.doctype, child.name, 'alert', service.alert);
//                                     });
        
//                                     // Refresh the fields to display the new rows
//                                     frm.refresh_field('services_for');
//                                 }
//                             }
//                         })
//                     }
                    
//                 }
//             });
//         }
//     }
// });


frappe.ui.form.on('Work', {

    onload_post_render: function(frm) {
  
        // Hide the "+" button based on its class
        $('.btn.btn-new.btn-secondary').hide();  // Targeting the "+" button
   },


    after_save: function(frm) {
        if (frm.doc.service) {
            // Call the server-side method to create tasks
            frappe.call({
                method: "docproc.document_processing_system.doctype.work.work.create_actions_from_service",
                args: {
                    work_id: frm.doc.name,         // The saved Work ID
                    service_name: frm.doc.service // The Service Name
                },
                callback: function(response) {
                    if (response.message) {
                        frappe.msgprint(response.message); // Display success message
                        frm.reload_doc(); // Reload the form to reflect changes
                    }
                }
            });
        }
    }
});


