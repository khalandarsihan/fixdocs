frappe.ui.form.on("Alert", {
  refresh: function (frm) {
    // Add Create Estimate button only if alert doesn't have linked estimate
    if (!frm.doc.linked_service_estimate && frm.doc.status === "Open") {
      // Add primary button at the top
      frm.page.set_primary_action(__("Create Estimate"), function () {
        create_estimate_from_form(frm);
      });
    } else {
      // Remove primary action if conditions are not met
      frm.page.clear_primary_action();
    }
  },
});

function create_estimate_from_form(frm) {
  // Get the alert data from the current form
  let alert_doc = frm.doc;

  // Get owner based on alert type
  let owner = "";
  if (alert_doc.alert_type === "Vehicle") {
    owner = alert_doc.vehicle;
  } else if (alert_doc.alert_type === "Personnel") {
    owner = alert_doc.personnel;
  } else if (alert_doc.alert_type === "Business") {
    owner = alert_doc.business;
  } else {
    owner = "Unknown";
  }

  let alert_data = [
    {
      alert_id: alert_doc.name,
      document: alert_doc.document_type,
      id: alert_doc.document_id,
      bill_to: alert_doc.bill_to,
      owner: owner,
      alert_type: alert_doc.alert_type,
      status: alert_doc.status,
    },
  ];

  // Create the table HTML for confirmation dialog
  let table_html = `
      <table class="table table-bordered">
          <thead>
              <tr>
                  <th>Document</th>
                  <th>ID</th>
                  <th>Owner</th>
                  <th>Bill To</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>${alert_data[0].document}</td>
                  <td>${alert_data[0].id}</td>
                  <td>${alert_data[0].owner}</td>
                  <td>${alert_data[0].bill_to}</td>
              </tr>
          </tbody>
      </table>`;

  // Show confirmation dialog
  frappe
    .confirm(
      `
      <span>
          <h4>Create Estimate for Alert?</h4>
          ${table_html}
      </span>`,
      async () => {
        try {
          let response = await frappe.call({
            method:
              "docproc.document_processing_system.doctype.alert.alert.create_estimate_from_alerts",
            args: { selected_rows: alert_data },
            freeze: true,
            freeze_message: __("Creating Service Estimate..."),
          });

          if (response.message && response.message.success) {
            // Clear any lingering UI states
            frm.page.clear_primary_action();

            // Show success message
            frappe.show_alert({
              message: __("Service Estimate created successfully"),
              indicator: "green",
            });

            // Small delay before redirect to ensure UI cleanup
            setTimeout(() => {
              window.location.href = response.message.estimate_url;
            }, 1000);
          } else {
            frappe.msgprint({
              title: __("Error"),
              indicator: "red",
              message: __("Failed to create estimation."),
            });
          }
        } catch (err) {
          console.error("Error creating estimation:", err);
          frappe.msgprint({
            title: __("Error"),
            indicator: "red",
            message: __("An error occurred while creating estimation."),
          });
        }
      },
      () => {
        // No action on cancel
      }
    )
    .addClass("btn-info");
}
