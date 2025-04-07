/**
 * Fetches alerts data from the Frappe backend
 * @returns {Promise<Object>} The alerts data and stats
 */
export const fetchAlertsData = async () => {
  try {
    // Fetch data from the Frappe API
    const response = await fetch("/api/method/docproc.api.api.get_alerts_data");

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Parse the response
    const data = await response.json();

    // Return data with the message wrapper for component to use
    return data;
  } catch (error) {
    console.error("Error fetching alerts data:", error);
    // Return empty data structure to prevent component errors
    return {
      message: {
        alerts: [],
        stats: {
          total: 0,
          open: 0,
          inProgress: 0,
          resolved: 0,
          highPriority: 0,
        },
      },
    };
  }
};

/**
 * Creates an estimate for the given alert ID
 * @param {string} alertId The ID of the alert
 * @returns {Promise<Object>} The result of the create operation
 */
export const createEstimateForAlert = async (alertId) => {
  try {
    // Call the create_estimate_from_alerts method
    const response = await fetch(
      "/api/method/docproc.document_processing_system.doctype.alert.alert.create_estimate_from_alerts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selected_rows: [{ alert_id: alertId }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating estimate:", error);
    return { success: false, message: error.message };
  }
};
