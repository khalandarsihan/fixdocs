// Path: your_app/custom/task/task_list.js

frappe.listview_settings['Task'] = {
    hide_name_column: true,
    hide_name_filter: true,

    onload(listview) {
        console.log("Custom Task list view loaded"); // Debug log
        
        // Set custom sorting
        listview.sort_by = "custom_task_number";
        listview.sort_order = "asc";

        // Remove name column from list_view_settings
        if (listview.list_view_settings) {
            listview.list_view_settings.fields = listview.list_view_settings.fields.filter(
                field => field.fieldname !== 'name'
            );
        }

        listview.refresh();
    },

    // Keep other standard task features
    add_fields: ['subject', 'project', 'status', 'priority', 'exp_start_date', 
                 'exp_end_date', 'review_date', 'is_group', 'parent_task', '_assign', 'custom_task_number'],

    get_indicator: function(doc) {
        return [__(doc.status), {
            'Open': 'orange',
            'Working': 'orange',
            'Pending Review': 'blue',
            'Overdue': 'red',
            'Template': 'blue',
            'Completed': 'green',
            'Cancelled': 'darkgrey'
        }[doc.status], 'status,=,' + doc.status];
    },

    // Define visible columns and their order
    fields: [
        {fieldname: 'subject', width: 200},
        {fieldname: 'custom_task_number', width: 120},
        {fieldname: 'status', width: 100},
        {fieldname: 'priority', width: 100},
        {fieldname: 'exp_start_date', width: 120},
        {fieldname: 'exp_end_date', width: 120},
        {fieldname: '_assign', width: 120}
    ]
};
