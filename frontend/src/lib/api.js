// frontend/src/lib/api.js

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
    console.log("Alerts API response:", data);

    return data;
  } catch (error) {
    console.error("Error fetching alerts data:", error);
    throw error;
  }
};

/**
 * Creates a service estimate for an alert
 * @param {string} alertId The ID of the alert
 * @returns {Promise<Object>} The result from the API
 */
export const createEstimateForAlert = async (alertId) => {
  try {
    // Prepare data for the API call
    const alertData = {
      alert_id: alertId,
      // We're only including the ID here - the backend will fetch the rest
    };

    // Call the Frappe API
    const response = await fetch(
      "/api/method/docproc.document_processing_system.doctype.alert.alert.create_estimate_from_alerts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selected_rows: [alertData],
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
    throw error;
  }
};
