frappe.listview_settings['Personnel'] = {
    // add fields to fetch
   
    hide_name_column: true,
    hide_name_filter: true,

    formatters: {
        personnel_type: function (value, row, column, data) {
            const colorMapping = {
                "Individual": "green",
                "Business Staff": "blue",
                "Dependent": "cyan"
            };
            if (!colorMapping[value]) {
                return value;
            }

            // Use the color from the mapping, or default to blue if it's not defined
            let colorClass = colorMapping[value] || "gray";

            // Build the HTML string with the appropriate color class
            return `<span class="indicator-pill ${colorClass} filterable no-indicator-dot ellipsis" data-filter="personnel_type,=,${value}">
                        <span class="ellipsis">${value}</span>
                    </span>`;
        },
        resident_status: function (value, row, column, data) {
            const colorMapping = {
                "Emirati": "green",
                "Resident": "blue",
                "Visitor": "cyan"
            };
            if (!colorMapping[value]) {
                return value;
            }

            // Use the color from the mapping, or default to blue if it's not defined
            let colorClass = colorMapping[value] || "gray";

            // Build the HTML string with the appropriate color class
            return `<span class="indicator-pill ${colorClass} filterable no-indicator-dot ellipsis" data-filter="resident_status,=,${value}">
                        <span class="ellipsis">${value}</span>
                    </span>`;
        }
    }
}