frappe.ui.form.on("Car and Carrier", {
    refresh: function(frm) {
        frm.trigger('validate_issue_dates');
    },
    validate_issue_dates(frm) {
        const issue_date_fields = ['mulkiya_date_of_issue'];
        for (const issue_date_field of issue_date_fields) {
            if (frm.fields_dict[issue_date_field].datepicker) {
                frm.fields_dict[issue_date_field].datepicker.update({
                    minDate: null,
                    maxDate: new Date()
                });
            }
        }
    }
});