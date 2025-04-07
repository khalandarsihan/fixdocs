import frappe
from frappe.utils import getdate, add_to_date
from frappe.utils.dateutils import get_period_ending

@frappe.whitelist()
def get_data(timespan=None, time_interval=None):
    # Set default values if none provided
    timespan = timespan or "Last Quarter"
    time_interval = time_interval or "Monthly"
    
    labels = get_period_labels(timespan, time_interval)
    datasets = [
        {
            "name": "Service Estimates",
            "values": get_estimate_values(timespan, time_interval)
        },
        {
            "name": "Sales Invoices",
            "values": get_invoice_values(timespan, time_interval)
        }
    ]
    
    # Reverse both labels and corresponding values
    labels.reverse()
    for dataset in datasets:
        dataset["values"].reverse()
    
    return {
        "labels": labels,
        "datasets": datasets
    }

def get_period_labels(timespan, time_interval):
    # Get date ranges based on timespan
    end_date = getdate()
    start_date = get_start_date(timespan)
    
    # Generate period labels
    labels = []
    current_date = start_date
    
    while current_date <= end_date:
        if time_interval == "Monthly":
            labels.append(current_date.strftime("%b %Y"))
            current_date = add_to_date(current_date, months=1)
        elif time_interval == "Quarterly":
            labels.append(f"Q{(current_date.month-1)//3 + 1} {current_date.year}")
            current_date = add_to_date(current_date, months=3)
        elif time_interval == "Weekly":
            labels.append(f"Week {current_date.isocalendar()[1]}")
            current_date = add_to_date(current_date, days=7)
        else:  # Daily
            labels.append(current_date.strftime("%d %b"))
            current_date = add_to_date(current_date, days=1)
    return labels

def aggregate_values(data, timespan, time_interval):
    # Initialize periods
    periods = {}
    end_date = getdate()
    current_date = get_start_date(timespan)
    
    # Map time_interval to Frappe's period names
    period_map = {
        "Monthly": "Monthly",
        "Quarterly": "Quarterly",
        "Weekly": "Weekly",
        "Daily": "Daily"
    }
    
    period_type = period_map.get(time_interval, "Monthly")  # Default to Monthly if invalid
    
    while current_date <= end_date:
        # Use the period_type instead of time_interval directly
        period_end = get_period_ending(current_date, period_type)
        periods[period_end] = 0
        
        if period_type == "Monthly":
            current_date = add_to_date(current_date, months=1)
        elif period_type == "Quarterly":
            current_date = add_to_date(current_date, months=3)
        elif period_type == "Weekly":
            current_date = add_to_date(current_date, days=7)
        else:  # Daily
            current_date = add_to_date(current_date, days=1)
    
    # Aggregate data into periods
    for d in data:
        period_end = get_period_ending(d.date, period_type)
        if period_end in periods:
            periods[period_end] += d.total
    
    return list(periods.values())

def get_estimate_values(timespan, time_interval):
    # Fetch and aggregate Service Estimate data
    data = frappe.db.sql("""
        SELECT 
            DATE(date) as date,
            SUM(grand_total) as total
        FROM `tabService Estimate`
        WHERE date >= %s
        GROUP BY DATE(date)
        ORDER BY date
    """, (get_start_date(timespan),), as_dict=1)
    
    return aggregate_values(data, timespan, time_interval)

def get_invoice_values(timespan, time_interval):
    # Fetch and aggregate Sales Invoice data linked to Service Estimates
    data = frappe.db.sql("""
        SELECT 
            DATE(si.posting_date) as date,
            SUM(si.grand_total) as total
        FROM `tabSales Invoice` si
        INNER JOIN `tabService Estimate` se ON se.linked_sales_invoice = si.name
        WHERE si.posting_date >= %s
        GROUP BY DATE(si.posting_date)
        ORDER BY si.posting_date
    """, (get_start_date(timespan),), as_dict=1)
    
    return aggregate_values(data, timespan, time_interval)

def get_start_date(timespan):
    end_date = getdate()
    if timespan == "Last Year":
        return add_to_date(end_date, years=-1)
    elif timespan == "Last Quarter":
        return add_to_date(end_date, months=-3)
    elif timespan == "Last Month":
        return add_to_date(end_date, months=-1)
    else:  # Last Week
        return add_to_date(end_date, days=-7)