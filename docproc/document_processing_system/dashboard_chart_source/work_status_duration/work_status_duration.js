frappe.provide("frappe.dashboards.chart_sources");

frappe.dashboards.chart_sources["Work Status Duration"] = {
  method:
    "docproc.document_processing_system.dashboard_chart_source.work_status_duration.work_status_duration.get_data",
  refreshInterval: 3600,

  chart_options: {
    type: "bar",
    height: 280,
    axisOptions: {
      xAxisMode: "tick",
      yAxisMode: "tick",
      xIsSeries: true,
    },
    tooltipOptions: {
      formatTooltipY: (d) => {
        try {
          const days = Math.floor(d / 24);
          const hours = (d % 24).toFixed(2);
          if (days > 0) {
            return `${days}d ${hours}h`;
          }
          return `${hours}h`;
        } catch (e) {
          console.error("Error formatting tooltip:", e);
          return "N/A";
        }
      },
    },
    colors: ["#5e64ff"],
  },

  filters: [
    {
      fieldname: "from_date",
      label: "From Date",
      fieldtype: "Date",
      default: frappe.datetime.add_months(frappe.datetime.get_today(), -1),
    },
    {
      fieldname: "to_date",
      label: "To Date",
      fieldtype: "Date",
      default: frappe.datetime.get_today(),
    },
  ],

  onload: function (data) {
    console.log("Chart data received:", data);
    if (!data || !data.datasets || !data.datasets.length) {
      console.error("No data available for chart");
      return;
    }

    // Validate data structure
    try {
      const hasValidData =
        data.labels &&
        data.labels.length > 0 &&
        data.datasets[0].values.length === data.labels.length;

      if (!hasValidData) {
        console.error("Invalid data structure received:", data);
      }
    } catch (e) {
      console.error("Error validating chart data:", e);
    }
  },
};
