// frappe.ui.form.on("Quotation", {
//     refresh: function(frm){
//         frm.trigger('toggle_quotation_service')
//         frm.trigger('filter_quotation_services')
//         frm.trigger('filter_personnel_name')
//     },
//     custom_service_type: function(frm){
//         frm.trigger('toggle_quotation_services')
//     },
//     quotation_to: function(frm){
//         // clear party name fields
//         frm.set_value('custom_business_name', '');
//         frm.set_value('custom_personnel_name', '');
//         frm.get_field('custom_quotation_services').grid.remove_all();
//         frm.get_field('items').grid.remove_all();
//     },
//     custom_business_name: function(frm){
//         frm.set_value('party_name', frm.doc.custom_business_name)
//         frm.set_value('customer_name', frm.doc.custom_business_name)
//         // frm.trigger('fetch_and_populate_services')
//     },
//     custom_personnel_name: function(frm){
//         frm.set_value('party_name', frm.doc.custom_personnel_name)
//         frm.trigger('set_customer_name')
//         // frm.trigger('fetch_and_populate_services')
        
//     },
//     party_name: function(frm){
//         frm.cscript.party_name = function() {
//             frm.get_field('items').grid.remove_all();
//             frm.refresh_field('items');
//             frm.get_field('custom_quotation_services').grid.remove_all();
//             frm.refresh_field('custom_quotation_services');
//         };
//         // frm.get_field('items').grid.remove_all();
//         // frm.refresh_field('items');
//         // frm.get_field('custom_quotation_services').grid.remove_all();
//         // frm.refresh_field('custom_quotation_services');
//     },
//     set_customer_name: function(frm){
//         let [docname, doctype] = frm.doc.custom_personnel_name 
//             ? [frm.doc.custom_personnel_name, 'Personnel'] 
//             : [frm.doc.custom_business_name, 'Business'];
//         if(docname){
//             frappe.call({
//                 method: "docproc.document_processing_system.customization.quotation.quotation.get_customer",
//                 args: {
//                     doctype: doctype,
//                     docname: docname
//                 },
//                 callback: function(r) {
//                     if(r.message){
//                         frm.set_value('customer_name', r.message)
//                     }
//                 }
//             })
//         }
//     },
//     fetch_and_populate_services(frm){
//         // Clear tables first
//         if(frm.doc.custom_service_type == 'Renewal' && frm.doc.party_name){
//             // Get quotation data and populate tables
//             frappe.call({
//                 method: "docproc.document_processing_system.customization.quotation.quotation.fetch_quotation_data",
//                 args: {
//                     customer: frm.doc.party_name,
//                 },
//                 callback: function(r) {
//                     if(r.message){
//                         // Add items and Services
//                         const tasks = r.message.quotation_items
//                         const services = r.message.service_for
//                         var items = []

//                         for(let item of tasks){
//                             items.push({
//                                 'item_code': item.item,
//                                 'qty': item.count
//                             })
//                         }

//                         // Clear tables first
//                         frm.clear_table('items');
//                         frm.clear_table('custom_quotation_services');

//                         items.forEach(item => {
//                             let child = frm.add_child('items');
//                             frappe.model.set_value(child.doctype, child.name, 'item_code', item.item_code);
//                             frappe.model.set_value(child.doctype, child.name, 'qty', item.qty);
//                         });

                        
//                         for(let service in services){
//                             let service_for = []
//                             let child = frm.add_child('custom_quotation_services');
//                             frappe.model.set_value(child.doctype, child.name, 'service', service);
                            
//                             if (services.hasOwnProperty(service)) {
//                                 services[service].forEach(item => {
//                                     for (let key in item) {
//                                         if (item.hasOwnProperty(key)) {
//                                             service_for.push(item[key])
//                                         }
//                                     }
//                                 });
//                             }
//                             frappe.model.set_value(child.doctype, child.name, 'service_for', service_for.join(", "));
//                         }
                    
//                         // Refresh the fields to display the new rows
//                         frm.refresh_field('items');
//                         frm.refresh_field('custom_quotation_services');
//                     }
//                 }
//             })
//         }
//     },
//     filter_quotation_services: function(frm){
//         if(frm.doc.custom_service_type){
//             frm.fields_dict['custom_quotation_services'].grid.get_field('service').get_query = function(doc, cdt, cdn) {
//                 return {
//                     filters: [
//                         ['service_type', '=', frm.doc.custom_service_type]
//                     ]
//                 };
//             };
//         }
//     },
//     filter_personnel_name: function(frm){
//         if(frm.doc.quotation_to){
//             frm.set_query('custom_personnel_name', function() {
//                 return {
//                     filters: [
//                         ['is_customer', '=', true]
//                     ]
//                 };
//             });
//         }
//     },
//     toggle_quotation_services: function(frm){
//         if(frm.doc.custom_service_type == 'Renewal'){
//             frm.trigger('quotation_to', '')
//             // frm.set_df_property('custom_quotation_services', 'read_only', 1);
//         }else{
//             frm.trigger('quotation_to', '')
//             frm.set_df_property('custom_quotation_services', 'read_only', 0);
//             // frm.set_df_property('custom_quotation_services', 'hidden', 0);
//         }
//     },

// });

// frappe.ui.form.on("Quotation Services", {
//     service: function(frm, cdt, cdn){
//         let row = locals[cdt][cdn];
//         frappe.call({
//             method: "docproc.document_processing_system.customization.quotation.quotation.get_service_linked_item",
//             args: {
//                 service: row.service
//             },
//             callback: function(r) {
//                 if(r.message){
//                     console.log(r.message);
//                     if(r.message.length){
//                         // Get the existing items in the table
//                         let existing_items = frm.doc.items.map(item => item.item_code);
                        
//                         r.message.forEach(item => {
//                             // Check if the item is already in the items table
//                             if (!existing_items.includes(item)) {
//                                 let child = frm.add_child('items');
//                                 frappe.model.set_value(child.doctype, child.name, 'item_code', item);
//                                 frappe.model.set_value(child.doctype, child.name, 'qty', 1);
//                                 existing_items.push(item); // Add the item to the existing items list
//                             }
//                         });
//                     }
//                     frm.refresh_field('items');
//                 }
//             }
//         });
//     },
//     before_custom_quotation_services_remove: function(frm, cdt, cdn){
//         let row = locals[cdt][cdn];
//         if(row.service){
//             frappe.call({
//                 method: "docproc.document_processing_system.customization.quotation.quotation.get_service_linked_item",
//                 args: {
//                     service: row.service
//                 },
//                 callback: function(r) {
//                     if (r.message.length) {
//                         r.message.forEach(item_code => {
//                             // Find the item in the items table and remove it
//                             let item_to_remove = frm.doc.items.find(item => item.item_code === item_code);
//                             if (item_to_remove) {
//                                 // Get the index of the item to remove
//                                 let item_index = frm.doc.items.indexOf(item_to_remove);
//                                 if (item_index !== -1) {
//                                     // Remove the item from the items array
//                                     frm.doc.items.splice(item_index, 1);
//                                     frm.refresh_field('items');
//                                 }
//                             }
//                         });
//                     }
//                 }
//             });
//         }
//     }
// });



/**
 * Enhances the 'Quotation' Doctype by automating linked record creation workflows:
 * 
 * - Dynamic Button Addition:
 *   - Adds "Work" and "Sales Invoice" buttons if no linked records exist.
 * 
 * - Automated Record Creation:
 *   - On button click, calls server-side methods to create and navigate to new records.
 * 
 * - Error Handling:
 *   - Provides user feedback and logs errors for debugging.
 * 
 * - Efficient Workflow Management:
 *   - Streamlines creation and navigation for linked "Work" and "Sales Invoice" records.
 
 */


frappe.ui.form.on('Quotation', {
    refresh: function (frm) {
        // Check if Work already exists
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Work",
                filters: {
                    linked_quotation: frm.doc.name
                },
                limit_page_length: 1
            },
            callback: function (response) {
                if (!response.message.length) {
                    frm.add_custom_button(__('Work'), function () {
                        frappe.call({
                            method: "docproc.document_processing_system.customization.quotation.quotation.create_work_from_quotation",
                            args: {
                                quotation_id: frm.doc.name
                            },
                            callback: function (response) {
                                if (response.message) {
                                    if (response.message.work_url) {
                                        // Navigate to the appropriate page
                                        window.location.href = response.message.work_url;
                                    } else {
                                        frappe.msgprint(__('Work created, but navigation URL is missing.'));
                                    }
                                }
                            }
                        });
                    }, __("Create"));
                }
            }
        });

        // Check if submitted Sales Invoice already exists
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Sales Invoice",
                filters: {
                    custom_linked_quotation: frm.doc.name,
                    docstatus: 1 // Only submitted invoices
                },
                limit_page_length: 1
            },
            callback: function (response) {
                if (!response.message.length) {
                    frm.add_custom_button(__('Sales Invoice'), function () {
                        frappe.call({
                            method: "docproc.document_processing_system.customization.quotation.quotation.create_sales_invoice_draft",
                            args: {
                                quotation_id: frm.doc.name
                            },
                            callback: function (response) {
                                console.log("Response from backend:", response);
                                // Access the nested URL
                                if (response.message && response.message.sales_invoice_url) {
                                    console.log("Navigating to:", response.message.sales_invoice_url);
                                    window.location.href = response.message.sales_invoice_url; // Redirect
                                } else {
                                    frappe.msgprint(__('Failed to redirect: URL not returned or empty.'));
                                }
                            },
                            error: function (err) {
                                console.error("Error in backend call:", err);
                                frappe.msgprint(__('An error occurred while creating the Sales Invoice.'));
                            }
                        });
                    }, __("Create"));
                }
            }
        });
    }
});


/**
 * Streamlines 'Quotation' form behavior:
 * 
 * - Field Management:
 *   - Hides "Company" field permanently.
 *   - Toggles read-only properties based on workflow state, especially for "Cancelled."
 * 
 * - Button Visibility:
 *   - Shows or hides the "Create" button for specific workflow states.
 * 
 * - Workflow Integration:
 *   - Automatically refreshes form to apply changes on workflow state updates.
 * 
 * Simplifies user interactions and ensures consistent field behavior.
 */

frappe.ui.form.on('Quotation', {
    refresh: function (frm) {
        // Always hide the "Company" field
        frm.set_df_property('company', 'hidden', 1);

        // Define states for showing "Create" button
        const showCreateStates = ["To Work and Bill", "To Work", "To Bill"];

        // Ensure "Create" button visibility for specific states and docstatus
        setTimeout(() => {
            if (showCreateStates.includes(frm.doc.workflow_state) && frm.doc.docstatus === 1) {
                frm.page.wrapper.find('div[data-label="Create"]').show();
            } else {
                frm.page.wrapper.find('div[data-label="Create"]').hide();
            }
        }, 150);

        // Handle field properties based on workflow_state
        if (frm.doc.workflow_state === 'Cancelled') {
            // Make fields read-only
            frm.set_df_property('transaction_date', 'read_only', 1);
            frm.set_df_property('quotation_to', 'read_only', 1);
            frm.set_df_property('custom_service', 'read_only', 1);
            frm.set_df_property('custom_service_template', 'read_only', 1);
            set_read_only_for_service_fields(frm, 1); // Set read-only for any active service field
        } else {
            // Revert fields to editable for other states
            frm.set_df_property('transaction_date', 'read_only', 0);
            frm.set_df_property('quotation_to', 'read_only', 0);
            frm.set_df_property('custom_service', 'read_only', 0);
            frm.set_df_property('custom_service_template', 'read_only', 0);
            set_read_only_for_service_fields(frm, 0); // Revert to editable for any active service field
        }
    },
    workflow_state: function (frm) {
        // Trigger refresh to apply button and field visibility logic
        frm.trigger('refresh');
    }
});

// Helper Function to Handle Service Fields
function set_read_only_for_service_fields(frm, readOnly) {
    const serviceFields = [
        'custom_service_for_business',
        'custom_service_for_personnel',
        'custom_service_for_car_and_carrier'
    ];

    // Loop through the fields and set the read-only property
    serviceFields.forEach(field => {
        if (frm.fields_dict[field]) { // Check if the field exists in the form
            frm.set_df_property(field, 'read_only', readOnly);
        }
    });
}


/**
 * Controls visibility of "New" buttons for "Sales Invoice" and "Work" in 'Quotation':
 * 
 * - **Onload & Refresh:**
 *   - Hides "New" buttons for submitted documents (docstatus === 1).
 * 
 * Ensures relevant buttons are visible only for draft documents.
 */

frappe.ui.form.on("Quotation", {
    onload(frm) {
        // Target all new buttons (with class btn-new) in the form
        document.querySelectorAll(".btn-new").forEach((el) => {
            // Check if the button is for Sales Invoice
            if (el.getAttribute("data-doctype") === "Sales Invoice") {
                el.style.display = frm.doc.docstatus === 1 ? "none" : ""; // Hide if submitted
            }
            // Check if the button is for Work
            if (el.getAttribute("data-doctype") === "Work") {
                el.style.display = frm.doc.docstatus === 1 ? "none" : ""; // Hide if submitted
            }
        });
    },
    refresh(frm) {
        // Reapply the same logic on refresh
        document.querySelectorAll(".btn-new").forEach((el) => {
            if (el.getAttribute("data-doctype") === "Sales Invoice") {
                el.style.display = frm.doc.docstatus === 1 ? "none" : "";
            }
            if (el.getAttribute("data-doctype") === "Work") {
                el.style.display = frm.doc.docstatus === 1 ? "none" : "";
            }
        });
    }
});


/**
 * Manages visibility of the Actions dropdown and specific items in 'Quotation':
 * 
 * - **Refresh:**
 *   - Shows Actions dropdown for drafts (docstatus 0) and hides "Help" option.
 *   - Hides Actions dropdown for submitted documents (docstatus 1).
 * 
 * - **On Submit:**
 *   - Hides Actions dropdown post-submission.
 * 
 * - **Utility Functions:**
 *   - `hide_actions_dropdown`: Hides the Actions dropdown.
 *   - `show_actions_dropdown`: Shows the Actions dropdown.
 *   - `hide_action_list_item`: Hides a specific item in the Actions dropdown.
 * 
 * Ensures intuitive UI control based on the document's status.
 */

frappe.ui.form.on('Quotation', {
    refresh: function (frm) {
        if (frm.doc.docstatus === 0) {
            // Ensure the Actions dropdown is visible for unsaved/draft documents
            show_actions_dropdown();
            // Hide the "Help" option
            hide_action_list_item('Help');
        }

        if (frm.doc.docstatus === 1) {
            // Hide the Actions dropdown for submitted documents
            hide_actions_dropdown();
        }
    },
    on_submit: function (frm) {
        // Hide the Actions dropdown after submission
        hide_actions_dropdown();
    }
});

// Utility function to hide the Actions dropdown
function hide_actions_dropdown() {
    const dropdown = $('.btn.btn-primary.btn-sm');
    if (dropdown.length) {
        dropdown.hide();
    }
}

// Utility function to show the Actions dropdown
function show_actions_dropdown() {
    const dropdown = $('.btn.btn-primary.btn-sm');
    if (dropdown.length) {
        dropdown.show();
    }
}

// Utility function to hide a specific list item in the Actions dropdown
function hide_action_list_item(item_label) {
    const list_item = $(`.dropdown-menu li:contains('${item_label}')`);
    if (list_item.length) {
        list_item.hide();
    }
}


/**
 * Customizes the 'Quotation' form by permanently hiding specific buttons:
 * 
 * - **Hidden Buttons:**
 *   - "Set as Lost"
 *   - "Get Items From"
 *   - "Cancel"
 * 
 * Ensures a cleaner UI by removing unnecessary actions.
 */

frappe.ui.form.on('Quotation', {
    refresh: function (frm) {
        // Permanently hide the "Set as Lost" button
        setTimeout(() => {
            frm.page.wrapper.find('.custom-actions [data-label="Set%20as%20Lost"]').hide();
        }, 100);

        // Permanently hide the "Get Items From" button
        setTimeout(() => {
            frm.page.wrapper.find('.custom-actions [data-label="Get%20Items%20From"]').hide();
        }, 100);

        // Permanently hide the "Cancel" button
        setTimeout(() => {
            frm.page.wrapper.find('.btn[data-label="Cancel"]').hide();
        }, 100);
    }
});

/**
 * Customizes the 'Quotation' form by managing dropdown options and buttons:
 * 
 * - **Button Management:**
 *   - Removes "Sales Order" from the "Create" dropdown after rendering.
 *   - Clears all custom buttons if the workflow state is "Complete."
 * 
 * - **Custom Button Additions:**
 *   - Adds "Sales Invoice" and "Work" buttons under "Create" when the workflow state is "Open."
 *   - Maps newly created records to the current Quotation.
 * 
 * Streamlines button visibility and actions based on workflow state.
 */
frappe.ui.form.on("Quotation", {
    refresh: function (frm) {
        // Remove "Sales Order" option after the dropdown is rendered
        setTimeout(() => {
            frm.remove_custom_button('Sales Order', 'Create');
        }, 100); // Delay to ensure the button is rendered before removing it

        // Remove all buttons if the status is "Complete"
        if (frm.doc.workflow_state === "Complete") {
            frm.clear_custom_buttons(); // Clears all custom buttons
        }

        // Add custom buttons for "Open" status
        if (frm.doc.workflow_state === "Open") {
            // Add "Sales Invoice" option to Create dropdown
            frm.add_custom_button(__('Sales Invoice'), function () {
                frappe.model.open_mapped_doc({
                    method: "erpnext.selling.doctype.quotation.quotation.make_sales_invoice",
                    frm: frm,
                    post_process: function (invoice) {
                        // Update custom field
                        invoice.custom_linked_quotation = frm.doc.name;
                    },
                });
            }, __('Create'));

            // Add "Work" option to Create dropdown
            frm.add_custom_button(__('Work'), function () {
                frappe.model.open_mapped_doc({
                    method: "your_app.your_module.quotation.make_work",
                    frm: frm,
                    post_process: function (work) {
                        // Update custom field
                        work.linked_quotation = frm.doc.name;
                    },
                });
            }, __('Create'));
        }
    }
});


/**
 * Customizes the 'Quotation' form by managing the visibility of connections and dashboard links:
 * 
 * - **Hidden Connections:**
 *   - Hides "Sales Order" and "Auto Repeat" from connections.
 *   - Hides "Sales Order" and "Subscription" labels from the dashboard.
 * 
 * - **Dynamic Header Visibility:**
 *   - Hides the "Connections" header if no connections are visible.
 *   - Ensures the header is shown if connections remain visible.
 * 
 * Improves form clarity by removing irrelevant connections.
 */
frappe.ui.form.on('Quotation', {
    onload: function (frm) {
        setTimeout(() => {
            // Hide specific connections
            $("[data-doctype='Sales Order']").hide();
            $("[data-doctype='Auto Repeat']").hide();
            
            // Hide the "+" button based on its class
            $('.btn.btn-new.btn-secondary').hide();  // Targeting the "+" button


            // Hide the labels for Sales Order and Auto Repeat
            $(".form-dashboard .form-link-title:contains('Sales Order')").parent().hide();
            $(".form-dashboard .form-link-title:contains('Subscription')").parent().hide();

            // Check remaining visible connections
            const visibleConnections = $(".form-dashboard .row").filter(function () {
                return $(this).is(":visible");
            });

            // Hide the Connections header if no connections remain
            if (visibleConnections.length === 0) {
                $(".form-dashboard .section-head.collapsible").hide();
            } else {
                $(".form-dashboard .section-head.collapsible").show();
            }
                       
        }, 100);
    }
});


/**
 * Below script provides a comprehensive customization for the 'Quotation' Doctype.
 * It enables dynamic field visibility, populates filtered options for dependent fields, 
 * and synchronizes related data between tables and fields. Below is a detailed overview of each section:
 * 
 * - Onload Functionality: Clears tables and resets fields when the form is freshly loaded.
 * - Dynamic Field Visibility: Toggles visibility of fields based on user selection.
 * - Dependent Field Queries: Dynamically populates field options by fetching data using server-side methods.
 * - Custom Service Management: Handles the addition of services and synchronizes them across related tables.
 * - Helper Functions: Provides reusable functions for clearing tables, resetting fields, managing visibility, 
 *   and synchronizing data.
 * - Error Handling and Feedback: Includes error handling for server-side calls and provides feedback to the user.
 *
 */
frappe.ui.form.on('Quotation', {

    onload: function (frm) {
        // Clear tables only when the form is loaded fresh
        if (frm.is_new()) {
            clear_all_tables_and_fields(frm);
        }
    },

    refresh: function (frm) {
        // clear_all_tables_and_fields(frm);
        toggle_field_visibility(frm, true);
    },

    custom_service_for_business: function (frm) {
        handle_service_field(frm, 'custom_service_for_business');
    },
    custom_service_for_personnel: function (frm) {
        handle_service_field(frm, 'custom_service_for_personnel');
    },
    custom_service_for_car_and_carrier: function (frm) {
        handle_service_field(frm, 'custom_service_for_car_and_carrier');
    },

    quotation_to: function (frm) {
        clear_all_tables_and_fields(frm);
        reset_fields(frm);
        toggle_field_visibility(frm, true);

        if (frm.doc.quotation_to === "Business") {
            frm.set_df_property('custom_business_name', 'hidden', 0);

            frappe.call({
                method: 'docproc.document_processing_system.customization.quotation.quotation.get_filtered_options',
                args: {
                    doctype: 'Business',
                    filters: { active: 1 }
                },
                callback: function (r) {
                    if (r.message) {
                        frm.set_query('custom_business_name', function () {
                            return {
                                filters: [['name', 'in', r.message.map(x => x.name)]]
                            };
                        });
                    }
                }
            });
        } else if (frm.doc.quotation_to === "Personnel") {
            frm.set_df_property('custom_personnel_name', 'hidden', 0);

            frappe.call({
                method: 'docproc.document_processing_system.customization.quotation.quotation.get_filtered_options',
                args: {
                    doctype: 'Personnel',
                    filters: { active: 1, personnel_type: 'Individual' }
                },
                callback: function (r) {
                    if (r.message) {
                        frm.set_query('custom_personnel_name', function () {
                            return {
                                filters: [['name', 'in', r.message.map(x => x.name)]]
                            };
                        });
                    }
                }
            });
        }
    },

    custom_business_name: function (frm) {
        update_customer_and_party_name(frm, 'custom_business_name');
        toggle_related_fields(frm);
    },
    
    custom_personnel_name: function (frm) {
        update_customer_and_party_name(frm, 'custom_personnel_name');
        toggle_related_fields(frm);
    },

    custom_service: function (frm) {
    // Clear the dependent fields
    frm.set_value('custom_service_template', null);
    frm.set_value('custom_service_for_business', null);
    frm.set_value('custom_service_for_personnel', null);
    frm.set_value('custom_service_for_car_and_carrier', null);


        if (frm.doc.custom_service) {
            frappe.call({
                method: 'docproc.document_processing_system.customization.quotation.quotation.get_filtered_options',
                args: {
                    doctype: 'Service Template',
                    filters: { service_type: frm.doc.custom_service, active: 1 }
                },
                callback: function (r) {
                    if (r.message) {
                        frm.set_query('custom_service_template', function () {
                            return {
                                filters: [
                                    ['name', 'in', r.message.map(x => x.name)],
                                    ['document_type', '!=', frm.doc.custom_personnel_name ? 'Business Document' : '']
                                ]
                            };
                        });
                    }
                }
            });
        }
    },

    custom_service_template: async function (frm) {
        if (frm.doc.custom_service_template) {
            const service_template_doc = await frappe.db.get_doc(
                'Service Template',
                frm.doc.custom_service_template
            );
            frm.set_value('custom_document_type', service_template_doc.document_type);
            toggle_related_fields(frm);
        }
    }
});



// Helper Function to Clear All Tables and Fields
function clear_all_tables_and_fields(frm) {
    // Clear the `custom_quotation_services` table
    frm.clear_table('custom_quotation_services');
    frm.refresh_field('custom_quotation_services');

    // Clear the `items` table
    frm.clear_table('items');
    frm.refresh_field('items');

    // Clear other fields if necessary
    reset_fields(frm);
}

function handle_service_field(frm, fieldname) {
    if (frm.doc[fieldname]) {
        append_to_quotation_services(frm);

        // Clear the field after 500ms
        setTimeout(() => {
            frm.set_value(fieldname, null);
            frm.refresh_field(fieldname);
        }, 500);
    }
}


function reset_fields(frm) {
    frm.set_value('custom_business_name', null);
    frm.set_value('custom_personnel_name', null);
    frm.set_value('custom_service', null);
    frm.set_value('custom_service_template', null);
    frm.set_value('custom_document_type', null);
    frm.set_value('custom_service_for_business', null);
    frm.set_value('custom_service_for_personnel', null);
    frm.set_value('custom_service_for_car_and_carrier', null);
}

function toggle_field_visibility(frm, hide = true) {
    const fields = [
        'custom_business_name',
        'custom_personnel_name',
        'custom_document_type',
        'custom_service_for_business',
        'custom_service_for_personnel',
        'custom_service_for_car_and_carrier'
    ];
    fields.forEach(field => {
        // Keep specific fields visible if conditions are met
        if ((field === 'custom_business_name' && frm.doc.quotation_to === 'Business') ||
            (field === 'custom_personnel_name' && frm.doc.quotation_to === 'Personnel')) {
            frm.set_df_property(field, 'hidden', 0);
        } else {
            frm.set_df_property(field, 'hidden', hide ? 1 : 0);
        }
    });
}

function toggle_related_fields(frm) {
    let is_custom_service_updated = false;

    // Hide all related fields by default
    frm.set_df_property('custom_service_for_business', 'hidden', 1);
    frm.set_df_property('custom_service_for_personnel', 'hidden', 1);
    frm.set_df_property('custom_service_for_car_and_carrier', 'hidden', 1);

    // Logic for Individual Document
    if (frm.doc.custom_document_type === 'Individual Document') {
        frm.set_df_property('custom_service_for_personnel', 'hidden', 0);

        if (frm.doc.custom_business_name) {
            // Set query for business personnel
            frm.set_query('custom_service_for_personnel', function () {
                return {
                    filters: {
                        active: 1,
                        business: frm.doc.custom_business_name,
                        personnel_type: 'Business Staff'
                    }
                };
            });
        } else if (frm.doc.custom_personnel_name) {
            // Fetch filtered personnel list dynamically
            frappe.call({
                method: 'docproc.document_processing_system.customization.quotation.quotation.get_personnel_list',
                args: {
                    personnel_name: frm.doc.custom_personnel_name
                },
                callback: function (r) {
                    if (r.message && r.message.length > 0) {
                        frm.set_query('custom_service_for_personnel', function () {
                            return {
                                filters: {
                                    name: ['in', r.message]
                                }
                            };
                        });

                        // Refresh field to apply new query
                        frm.refresh_field('custom_service_for_personnel');
                    } else {
                        // Clear field if no results are returned
                        frm.fields_dict.custom_service_for_personnel.df.options = [];
                        frm.refresh_field('custom_service_for_personnel');
                    }
                }
            });
        }
    }

    // Logic for Vehicle Document
    else if (frm.doc.custom_document_type === 'Vehicle Document') {
        frm.set_df_property('custom_service_for_car_and_carrier', 'hidden', 0);

        frm.set_query('custom_service_for_car_and_carrier', function () {
            if (frm.doc.custom_business_name) {
                return {
                    filters: {
                        active: 1,
                        business_owner: frm.doc.custom_business_name
                    }
                };
            } else if (frm.doc.custom_personnel_name) {
                return {
                    filters: {
                        active: 1,
                        personal_owner: frm.doc.custom_personnel_name
                    }
                };
            }
        });
    }

//     // Logic for Business Document
    // else if (frm.doc.custom_document_type === 'Business Document') {
    //     frm.set_df_property('custom_service_for_business', 'hidden', 0);

    //     // frm.set_value('custom_service_for_business', frm.doc.custom_business_name);
        
    // }



    else if (frm.doc.custom_document_type === 'Business Document') {
        frm.set_df_property('custom_service_for_business', 'hidden', 0);
    
        // Use a field query to populate the field dynamically
        frm.set_query('custom_service_for_business', function () {
            return {
                filters: {
                    name: frm.doc.custom_business_name || ''
                }
            };
        });
    }
    

}

function update_customer_and_party_name(frm, field_name) {
    const value = frm.doc[field_name];
    if (value) {
        frm.set_value('customer_name', value); // Update customer_name
        frm.set_value('party_name', value); // Update party_name

    } else {
        // Optionally clear the fields if the value is empty
        frm.set_value('customer_name', null);
        frm.set_value('party_name', null);
    }
}


function append_to_quotation_services(frm) {

    // Skip processing if the form is currently being saved
    if (frm.doc.__is_saving) {
        return;
    }

    const serviceTemplate = frm.doc.custom_service_template;

    // Determine which service_for field has a value and is visible
    let serviceFor = null;
    if (!frm.fields_dict.custom_service_for_business.df.hidden && frm.doc.custom_service_for_business) {
        serviceFor = frm.doc.custom_service_for_business;
    } else if (!frm.fields_dict.custom_service_for_personnel.df.hidden && frm.doc.custom_service_for_personnel) {
        serviceFor = frm.doc.custom_service_for_personnel;
    } else if (!frm.fields_dict.custom_service_for_car_and_carrier.df.hidden && frm.doc.custom_service_for_car_and_carrier) {
        serviceFor = frm.doc.custom_service_for_car_and_carrier;
    }

    if (serviceTemplate && serviceFor) {
        // Determine the doctype and field to fetch based on the document type
        let fetchDoctype, fetchField;

        if (frm.doc.custom_document_type === "Vehicle Document") {
            fetchDoctype = "Car and Carrier";
            fetchField = "mulkiya_number";
        } else if (frm.doc.custom_document_type === "Individual Document") {
            fetchDoctype = "Personnel";
            fetchField = "full_name";
        } else if (frm.doc.custom_document_type === "Business Document") {
            fetchDoctype = "Business";
            fetchField = "company_name";
        }

        frappe.db.get_value(fetchDoctype, serviceFor, fetchField)
            .then(response => {
                if (response && response.message) {
                    const full_name =
                        frm.doc.custom_document_type === "Business Document"
                            ? response.message.company_name
                            : response.message[fetchField]; // Use company_name for Business Document

                    console.log("Fetched Data:", { full_name });

                    // Add row to Quotation Services
                    let new_service_row = frm.add_child('custom_quotation_services');
                    new_service_row.service = serviceTemplate;
                    new_service_row.service_for = full_name;
                    new_service_row.service_sequence = (frm.doc.custom_quotation_services || []).length + 1; // Start sequence from 1
                    frm.refresh_field('custom_quotation_services');

                    // Add corresponding entry to the Items table
                    frappe.call({
                        method: "frappe.client.get",
                        args: {
                            doctype: "Service Template",
                            name: serviceTemplate
                        },
                        callback: function (template_response) {
                            if (template_response.message) {
                                const service_template_data = template_response.message;

                                (service_template_data.service_charge_item || []).forEach(row => {
                                    const new_item_row = frm.add_child("items");

                                    new_item_row.item_code = row.item_code;
                                    new_item_row.item_name = row.item_name;
                                    new_item_row.qty = row.quantity;
                                    new_item_row.rate = row.rate;
                                    new_item_row.amount = row.amount;
                                    new_item_row.uom = row.uom;
                                    new_item_row.custom_service = serviceTemplate;
                                    new_item_row.custom_service_for = full_name;
                                    new_item_row.custom_service_sequence = new_service_row.service_sequence;
                                    new_item_row.description = row.description;
                                    new_item_row.remarks = row.remarks;
                                });

                                frm.refresh_field("items");
                                update_totals(frm);
                            }
                        }
                    });
                } else {
                    frappe.msgprint(__('Failed to fetch details.'));
                }
            })
            .catch(err => {
                frappe.msgprint({
                    title: __('Error'),
                    message: __('Failed to fetch details: ' + err.message),
                    indicator: 'red',
                });
            });
    } else {
        console.log("Conditions not met for append_to_quotation_services:", {
            serviceTemplate,
            serviceFor,
        });
    }
}

// Standalone Function to Sync Items with Services
function sync_items_with_services(frm) {
    const services = frm.doc.custom_quotation_services || [];
    const items = frm.doc.items || [];

    // Create a map of services
    const serviceMap = services.reduce((acc, service) => {
        acc[`${service.service}-${service.service_for}-${service.service_sequence}`] = true;
        return acc;
    }, {});

    // Filter items to keep only matching services
    frm.doc.items = items.filter(item => {
        const key = `${item.custom_service}-${item.custom_service_for}-${item.custom_service_sequence}`;
        return serviceMap[key];
    });

    // Renumber the rows in the items table
    frm.doc.items.forEach((item, index) => {
        item.idx = index + 1; // Ensure index starts from 1
    });

    frm.refresh_field('items');
    update_totals(frm);
}

// Trigger Sync via Quotation Services Events
frappe.ui.form.on('Quotation Services', {
    custom_quotation_services_remove: function (frm) {
        sync_items_with_services(frm); // Call standalone function
    },
    custom_quotation_services_add: function (frm) {
        sync_items_with_services(frm); // Call standalone function
    }
});

// Supporting Function to Update Totals
function update_totals(frm) {
    let total_quantity = 0;
    let total_aed = 0;

    (frm.doc.items || []).forEach(item => {
        total_quantity += item.qty || 0;
        total_aed += item.amount || 0;
    });

    frm.set_value("total_qty", total_quantity);
    frm.set_value("total", total_aed);
}