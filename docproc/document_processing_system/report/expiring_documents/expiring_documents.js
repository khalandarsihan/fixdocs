frappe.query_reports["Expiring Documents"] = {
    "filters": [
        {
            "fieldname": "status",
            "label": __("Status"),
            "fieldtype": "Select",
            "options": "\nOpen\nClosed",
            "default": "Open",
            "reqd": 0
        },
        {
            "fieldname": "bill_to",
            "label": __("Bill To"),
            "fieldtype": "Select",
            "options": "",
            "reqd": 0
        },
        {
            "fieldname": "expires_in",
            "label": __("Expires In"),
            "fieldtype": "Int",
            "default": 10,
            "reqd": 0
        },
        {
            "fieldname": "alert_type",
            "label": __("Document Type"),
            "fieldtype": "Select",
			"options": "\nBusiness\nPersonnel",
			"default": "",
            "reqd": 0
        }
    ],
    onload: function(report) {

       // Add a custom button to create quotation
        // report.page.add_inner_button(__('Create Quotation'), function() {
        //     openDialog(report);
        // }).removeClass('btn-default').addClass('btn-primary');


        // Fetch and set the bill_to options when the report loads
        generate_bill_to_options(report);

        // Add custom CSS
        $('<style type="text/css"> .red { color: red; } .maroon { color: maroon; } .yellow { color: yellow; } .blue { color: blue; } .orange { color: orange; } .cyan { color: cyan; } .green { color: green; } </style>').appendTo("head");
    },
    formatter: function (value, row, column, data, default_formatter) {
        if (column.fieldname == "status") {
            if (value == "Open") {
                value = "<span class='blue'>" + value + "</span>";
            } else if (value == "Follow-Up") {
                value = "<span class='orange'>" + value + "</span>";
            } else if (value == "Quotation") {
                value = "<span class='cyan'>" + value + "</span>";
            } else if (value == "Work-Order") {
                value = "<span class='green'>" + value + "</span>";
            } else if (value == "Cancelled") {
                value = "<span class='red'>" + value + "</span>";
            }
        }

        return default_formatter(value, row, column, data);
    }
};

function generate_bill_to_options(report) {
    frappe.call({
        method: 'docproc.document_processing_system.doctype.alert.alert.get_bill_to_values',
        callback: function(r) {
            if (r.message) {
                const bill_to_filter = report.get_filter('bill_to');
                bill_to_filter.df.options = '\n' + r.message.join('\n');
                bill_to_filter.refresh();
            }
        }
    });
}

// Function to open the dialog
function openDialog(report) {
    // Extract unique Bill To options from the report data
    let bill_to_options = [...new Set(report.data.map(row => row.bill_to))];

    const dialog = new frappe.ui.Dialog({
        title: 'Select Bill To and Documents',
        fields: [
            {
                label: 'Select Bill To',
                fieldname: 'bill_to',
                fieldtype: 'Select',
                options: bill_to_options,
                onchange: function() {
                    // Filter documents based on the selected Bill To
                    const selected_bill_to = this.value;
                    const filtered_documents = report.data.filter(row => row.bill_to === selected_bill_to);
                    const document_table = dialog.fields_dict.documents.df.data;
                    document_table.length = 0;  // Clear previous data
                    filtered_documents.forEach(row => {
                        document_table.push({
                            document: row.document_type,
                            document_id: row.document_id
                        });
                    });
                    dialog.fields_dict.documents.grid.refresh();
                }
            },
            {
                fieldtype: 'Table',
                fieldname: 'documents',
                label: 'Documents',
                fields: [
                    {
                        fieldtype: 'Data',
                        fieldname: 'document',
                        label: 'Document',
                        read_only: 1,
                        in_list_view: 1
                    },
                    {
                        fieldtype: 'Data',
                        fieldname: 'document_id',
                        label: 'Document ID',
                        read_only: 1,
                        in_list_view: 1
                    }
                ],
                data: [],
                get_data: function() {
                    return this.data;
                }
            }
        ],
        primary_action_label: 'Generate Quote',
        primary_action(values) {
            console.log(values);
            // LOGIC to create Quote
            dialog.hide();
        }
    });

    dialog.show();
}