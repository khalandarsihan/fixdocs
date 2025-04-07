frappe.listview_settings['Car and Carrier'] = {
    // add fields to fetch
   
    hide_name_column: true,
    hide_name_filter: true,

    formatters: {
        owner_type: function (value, row, column, data) {
            const colorMapping = {
                "Business": "green",
                "Personnel": "blue",
            };
            if (!colorMapping[value]) {
                return value;
            }

            // Use the color from the mapping, or default to blue if it's not defined
            let colorClass = colorMapping[value] || "gray";

            // Build the HTML string with the appropriate color class
            return `<span class="indicator-pill ${colorClass} filterable no-indicator-dot ellipsis" data-filter="owner_type,=,${value}">
                        <span class="ellipsis">${value}</span>
                    </span>`;
        }
    }
}