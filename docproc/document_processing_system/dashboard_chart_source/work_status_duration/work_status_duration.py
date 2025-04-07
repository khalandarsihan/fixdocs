import frappe
from frappe.utils import time_diff_in_hours
from frappe.utils.dashboard import cache_source

@frappe.whitelist()
@cache_source
def get_data(chart_name=None, chart=None, no_cache=None, filters=None, from_date=None, to_date=None, timespan=None, time_interval=None, heatmap_year=None):
    # Debug logging
    frappe.logger().debug(f"Chart name: {chart_name}")
    frappe.logger().debug(f"Filters: {filters}")
    frappe.logger().debug(f"Date range: {from_date} to {to_date}")
    
    # Get all work orders within date range if specified
    filters = {"docstatus": ["!=", 2]}  # Exclude cancelled documents
    if from_date:
        filters["creation"] = [">=", from_date]
    if to_date:
        filters["modified"] = ["<=", to_date]
        
    works = frappe.get_all(
        "Work",
        fields=["name", "creation", "modified", "status"],
        filters=filters
    )
    
    frappe.logger().debug(f"Number of works found: {len(works)}")
    
    # Initialize status duration tracking with correct status values
    status_durations = {
        "Open": [],
        "Working": [],
        "Complete": [],  # Changed from "Completed" to "Complete"
        "Cancelled": []
    }
    
    for work in works:
        version_timeline = frappe.get_all(
            "Version",
            filters={
                "ref_doctype": "Work",
                "docname": work.name
            },
            fields=["data", "creation"],
            order_by="creation"
        )
        
        frappe.logger().debug(f"Work {work.name}: {len(version_timeline)} versions found")
        
        current_status = "Open"  # Default initial status
        status_start_time = work.creation
        
        # Process version timeline
        for version in version_timeline:
            try:
                data = frappe.parse_json(version.data)
                if "changed" in data:
                    for change in data["changed"]:
                        if change[0] == "status":
                            # Validate status before using it
                            new_status = change[1]
                            if new_status in status_durations:
                                duration = time_diff_in_hours(version.creation, status_start_time)
                                status_durations[current_status].append(duration)
                                frappe.logger().debug(f"Status change in {work.name}: {current_status} -> {new_status}, duration: {duration}h")
                                current_status = new_status
                                status_start_time = version.creation
                            else:
                                frappe.logger().error(f"Invalid status found: {new_status} in work order {work.name}")
            except Exception as e:
                frappe.logger().error(f"Error processing version for {work.name}: {str(e)}")
                continue
        
        # Add duration for current status
        try:
            if current_status in status_durations:
                final_duration = time_diff_in_hours(work.modified, status_start_time)
                status_durations[current_status].append(final_duration)
                frappe.logger().debug(f"Final duration for {work.name} in {current_status}: {final_duration}h")
        except Exception as e:
            frappe.logger().error(f"Error calculating final duration for {work.name}: {str(e)}")
    
    # Calculate averages
    labels = []
    values = []
    
    for status, durations in status_durations.items():
        if durations:
            avg_hours = sum(durations) / len(durations)
            labels.append(status)
            values.append(round(avg_hours, 2))
            frappe.logger().debug(f"Status {status}: {len(durations)} records, average {avg_hours}h")
    
    result = {
        "labels": labels,
        "datasets": [{
            "name": "Average Hours",
            "values": values
        }]
    }
    
    frappe.logger().debug(f"Final chart data: {result}")
    return result