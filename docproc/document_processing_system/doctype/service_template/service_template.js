// Copyright (c) 2024, Khalandar Sihan and contributors
// For license information, please see license.txt

/*
 * This script calculates the total amount for a service charge item 
 * in the child table based on the quantity and rate entered by the user.
 * The calculated amount is automatically set in the 'amount' field of the child table.
 */

// frappe.ui.form.on('Service Charge Item', {
//     // Trigger calculation when the quantity is updated
//     quantity: function(frm, cdt, cdn) {
//         calculate_amount(frm, cdt, cdn);
//     },
//     // Trigger calculation when the rate is updated
//     rate: function(frm, cdt, cdn) {
//         calculate_amount(frm, cdt, cdn);
//     }
// });

// /**
//  * Function to calculate the amount based on quantity and rate
//  * @param {Object} frm - The current form object
//  * @param {String} cdt - Child DocType (e.g., 'Service Charge Item')
//  * @param {String} cdn - Child DocName (unique identifier for the row in the child table)
//  */
// function calculate_amount(frm, cdt, cdn) {
//     // Get the current row from the child table
//     let row = frappe.get_doc(cdt, cdn);
    
//     // Ensure both quantity and rate are entered by the user
//     if (row.quantity && row.rate) {
//         // Set the 'amount' field in the child table as quantity * rate
//         frappe.model.set_value(cdt, cdn, 'amount', row.quantity * row.rate);
//     } else {
//         // Set 'amount' to 0 if either quantity or rate is missing
//         frappe.model.set_value(cdt, cdn, 'amount', 0);
//     }
// }


// /*
//  * This script fetches the standard selling price of an item from the 'Item Price' Doctype
//  * whenever an item is selected in the child table. 
//  * It then updates the 'cost' field of the child table with the fetched price.
//  */

// frappe.ui.form.on('Service Charge Item', {
//     // Trigger price fetch and update when the item is selected or changed
//     item: function (frm, cdt, cdn) {
//         const row = locals[cdt][cdn]; // Get the row from the child table
        
//         if (row.item) {
//             // Fetch the price for the selected item from the 'Item Price' Doctype
//             frappe.db.get_value(
//                 'Item Price', 
//                 { item_code: row.item, price_list: 'Standard Selling' }, // Filters to fetch the price
//                 'price_list_rate', // The field to retrieve
//                 (r) => {
//                     if (r && r.price_list_rate) {
//                         // Set the 'cost' field in the child table with the fetched price
//                         frappe.model.set_value(cdt, cdn, 'cost', r.price_list_rate);
//                     } else {
//                         // Set the 'cost' field to 0 if no price is found
//                         frappe.model.set_value(cdt, cdn, 'cost', 0);
//                     }
//                 }
//             );
//         }
//     }
// });



// // Main triggers for Service Charge Item
// frappe.ui.form.on('Service Charge Item', {
//     // Trigger when item_item_code is selected
//     item_item_code: function (frm, cdt, cdn) {
//         populate_item_details_and_rate(frm, cdt, cdn);
//     },
//     // Trigger calculation when quantity is updated
//     quantity: function (frm, cdt, cdn) {
//         calculate_amount(frm, cdt, cdn);
//     },
//     // Trigger calculation when rate is updated
//     rate: function (frm, cdt, cdn) {
//         calculate_amount(frm, cdt, cdn);
//     }
// });

// /**
//  * Function to populate item details, rate, and UOM when item_item_code is selected
//  * @param {Object} frm - The current form object
//  * @param {String} cdt - Child DocType
//  * @param {String} cdn - Child DocName
//  */
// function populate_item_details_and_rate(frm, cdt, cdn) {
//     const row = locals[cdt][cdn]; // Get the current row from the child table

//     if (row.item_item_code) {
//         // Fetch item details from the Item Doctype
//         frappe.db.get_doc('Item', row.item_item_code)
//             .then(item => {
//                 // Populate fields from the Item Doctype
//                 frappe.model.set_value(cdt, cdn, 'item_name', item.item_name || '');
//                 frappe.model.set_value(cdt, cdn, 'description', item.description || '');
//                 frappe.model.set_value(cdt, cdn, 'uom', item.stock_uom || '');

//                 // Fetch rate from the Item Price Doctype
//                 frappe.db.get_value(
//                     'Item Price',
//                     { item_code: row.item_item_code, price_list: 'Standard Selling' },
//                     'price_list_rate',
//                     (r) => {
//                         frappe.model.set_value(cdt, cdn, 'rate', r && r.price_list_rate ? r.price_list_rate : 0);
//                         // Trigger amount calculation after setting rate
//                         calculate_amount(frm, cdt, cdn);
//                     }
//                 );
//             })
//             .catch(err => {
//                 frappe.msgprint(__('Failed to fetch item details. Please check the Item Code.'));
//             });
//     }
// }

// /**
//  * Function to calculate the amount based on quantity and rate
//  * @param {Object} frm - The current form object
//  * @param {String} cdt - Child DocType
//  * @param {String} cdn - Child DocName
//  */
// function calculate_amount(frm, cdt, cdn) {
//     let row = locals[cdt][cdn]; // Get the current row from the child table

//     if (row.quantity && row.rate) {
//         // Calculate and set the 'amount' field
//         frappe.model.set_value(cdt, cdn, 'amount', row.quantity * row.rate);
//     } else {
//         // Default 'amount' to 0 if either quantity or rate is missing
//         frappe.model.set_value(cdt, cdn, 'amount', 0);
//     }
// }


// Main triggers for Service Charge Item
frappe.ui.form.on('Service Charge Item', {
    // Trigger when item_item_code is selected
    item_item_code: function (frm, cdt, cdn) {
        populate_item_details_and_rate(frm, cdt, cdn);
    },
    // Trigger calculation when quantity is updated
    quantity: function (frm, cdt, cdn) {
        calculate_amount(frm, cdt, cdn);
    },
    // Trigger calculation when rate is updated
    rate: function (frm, cdt, cdn) {
        calculate_amount(frm, cdt, cdn);
    }
});

/**
 * Function to populate item details, rate, and UOM when item_item_code is selected
 * @param {Object} frm - The current form object
 * @param {String} cdt - Child DocType
 * @param {String} cdn - Child DocName
 */
function populate_item_details_and_rate(frm, cdt, cdn) {
    const row = locals[cdt][cdn]; // Get the current row from the child table

    if (row.item_item_code) {
        // Fetch item details from the Item Doctype
        frappe.db.get_doc('Item', row.item_item_code)
            .then(item => {
                // Populate fields from the Item Doctype
                frappe.model.set_value(cdt, cdn, 'item_name', item.item_name || '');
                frappe.model.set_value(cdt, cdn, 'description', item.description || '');
                frappe.model.set_value(cdt, cdn, 'uom', item.stock_uom || '');

                // Fetch rate from the Item Price Doctype
                frappe.db.get_value(
                    'Item Price',
                    { item_code: row.item_item_code, price_list: 'Standard Selling' },
                    'price_list_rate',
                    (r) => {
                        frappe.model.set_value(cdt, cdn, 'rate', r && r.price_list_rate ? r.price_list_rate : 0);

                        // Trigger amount calculation after setting rate
                        calculate_amount(frm, cdt, cdn);

                        // Explicitly refresh the field values in the grid row
                        refresh_grid_row(frm, cdt, cdn);
                    }
                );
            })
            .catch(err => {
                frappe.msgprint(__('Failed to fetch item details. Please check the Item Code.'));
            });
    }
}

/**
 * Function to calculate the amount based on quantity and rate
 * @param {Object} frm - The current form object
 * @param {String} cdt - Child DocType
 * @param {String} cdn - Child DocName
 */
function calculate_amount(frm, cdt, cdn) {
    let row = locals[cdt][cdn]; // Get the current row from the child table

    if (row.quantity && row.rate) {
        // Calculate and set the 'amount' field
        frappe.model.set_value(cdt, cdn, 'amount', row.quantity * row.rate);
    } else {
        // Default 'amount' to 0 if either quantity or rate is missing
        frappe.model.set_value(cdt, cdn, 'amount', 0);
    }

    // Explicitly refresh the field values in the grid row
    refresh_grid_row(frm, cdt, cdn);
}

/**
 * Function to refresh a specific row in the child table
 * @param {Object} frm - The current form object
 * @param {String} cdt - Child DocType
 * @param {String} cdn - Child DocName
 */
function refresh_grid_row(frm, cdt, cdn) {
    const grid = frm.fields_dict['service_charges'].grid; // Replace 'service_charges' with your child table fieldname
    const row_idx = grid.get_selected_row_indexes();

    if (row_idx.length > 0) {
        grid.refresh_row(row_idx[0]); // Refresh the currently selected row
    } else {
        grid.refresh(); // Fallback to refreshing the whole grid if no row is explicitly selected
    }
}
