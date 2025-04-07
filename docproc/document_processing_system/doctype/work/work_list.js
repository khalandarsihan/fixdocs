// Configure the list view settings for the "Work" Doctype
frappe.listview_settings["Work"] = {
  hide_name_column: true, // Hide the "Name" column in the list view to declutter the view and focus on more relevant columns
  hide_name_filter: true, // Hide the "Name" search filter to prevent filtering based on the "Name" field
  add_fields: ["progress_percentage"], // Ensure progress percentage is available for list view display
  get_indicator: function (doc) {
    // Dynamically set the color based on progress percentage
    const color = doc.progress_percentage === 100 ? "green" : "orange";

    return [
      `Progress: ${doc.progress_percentage || 0}%`, // Label
      color, // Color
      "progress", // Indicator type
    ];
  },
};
