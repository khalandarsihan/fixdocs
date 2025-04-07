frappe.listview_settings["Alert"] = {
  hide_name_filter: true,
  hide_name_column: true,

  onload(listview) {
    this.add_trigger_alerts_button(listview);
    this.add_bill_to_field(listview);
    this.move_bill_to_to_filter_area();
    this.create_estimate(listview);

    listview.filter_area.add([["Alert", "status", "in", ["Open"]]]);

    // Use jQuery to hide the Add Alert button based on its class
    setTimeout(() => {
      $("button.btn-primary.btn-sm.primary-action").hide();
    }, 100);
  },

  add_trigger_alerts_button(listview) {
    listview.page
      .add_inner_button("Trigger Alerts", function () {
        frappe.call({
          method:
            "docproc.document_processing_system.utils.generate_alerts.trigger_check_expiring_documents",
          callback: function () {
            location.reload();
          },
        });
      })
      .removeClass("btn-default")
      .addClass("btn-primary");
  },

  move_bill_to_to_filter_area() {
    setTimeout(function () {
      var billToDropdown = $("select[data-fieldname='bill_to']").closest(
        ".form-group"
      );
      var targetSection = $(".standard-filter-section");
      if (billToDropdown.length && targetSection.length) {
        billToDropdown.appendTo(targetSection);
      }
    }, 500);
  },

  add_bill_to_field(listview) {
    frappe.call({
      method:
        "docproc.document_processing_system.doctype.alert.alert.get_bill_to_values",
      callback: function (r) {
        if (r.message) {
          const bill_to_options = r.message;
          listview.page.add_field({
            fieldtype: "Select",
            label: "Bill To",
            fieldname: "bill_to",
            options: [""].concat(bill_to_options),
            change: function () {
              let bill_to = listview.page.fields_dict.bill_to.get_value();
              if (bill_to) {
                listview.filter_area.add("Alert", "bill_to", "=", bill_to);
              } else {
                listview.filter_area.remove("Alert", "bill_to");
              }
              listview.refresh();
            },
          });
        }
      },
    });
  },

  create_estimate(listview) {
    listview.page.add_action_item(__("Create Estimate"), async function () {
      let selected_docs = listview.get_checked_items();
      if (selected_docs.length === 0) {
        frappe.msgprint(
          __("Please select at least one alert to create an Estimate.")
        );
        return;
      }

      let alert_data = [];
      // First, filter out alerts that already have linked estimates
      let validDocs = selected_docs.filter(async (doc) => {
        let alert_doc = await frappe.db.get_doc("Alert", doc.name);
        return (
          !alert_doc.linked_service_estimate ||
          alert_doc.linked_service_estimate.trim().length === 0
        );
      });

      if (validDocs.length === 0) {
        frappe.msgprint(
          __(
            "All selected alerts already have linked estimates. Please select alerts without existing estimates."
          )
        );
        return;
      }

      for (let doc of validDocs) {
        let alert_doc = await frappe.db.get_doc("Alert", doc.name);
        if (alert_doc) {
          // Get owner based on alert type directly from the form
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
          alert_data.push({
            alert_id: alert_doc.name,
            document: alert_doc.document_type,
            id: alert_doc.document_id,
            bill_to: alert_doc.bill_to,
            owner: owner,
            alert_type: alert_doc.alert_type,
            status: alert_doc.status,
          });
        }
      }

      // Check if all selected alerts have status "Open"
      let allOpen = alert_data.every((alert) => alert.status === "Open");
      if (!allOpen) {
        frappe.msgprint(
          __("Please select only Open Alerts to create an Estimate.")
        );
        return;
      }

      // Check if all selected alerts have the same "Bill To"
      let allSameBillTo = alert_data.every(
        (alert) => alert.bill_to === alert_data[0].bill_to
      );
      if (!allSameBillTo) {
        frappe.msgprint(
          __(
            "Please select alerts with the same Bill To to create an Estimate."
          )
        );
        return;
      }

      // Create the table HTML for confirmation dialog
      let table_html = `
          <table class="table table-bordered">
            <thead>
              <tr>
                <th><input type="checkbox" id="select-all" /></th>
                <th>Document</th>
                <th>ID</th>
                <th>Owner</th>
                <th>Bill To</th>
              </tr>
            </thead>
            <tbody>
              ${alert_data
                .map(
                  (item, index) => `
                <tr>
                  <td><input type="checkbox" class="row-select" data-index="${index}" checked /></td>
                  <td>${item.document}</td>
                  <td>${item.id}</td>
                  <td>${item.owner}</td>
                  <td>${item.bill_to}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>`;

      // Add "select-all" functionality
      $(document).on("change", "#select-all", function () {
        let isChecked = $(this).is(":checked");
        $(".row-select").prop("checked", isChecked);
      });

      // Show confirmation dialog
      frappe
        .confirm(
          `
          <span>
            <h4>Create Estimate for Alerts?</h4>
            ${table_html}
          </span>`,
          async () => {
            let selected_rows = [];
            $(".row-select:checked").each(function () {
              let index = $(this).data("index");
              selected_rows.push(alert_data[index]);
            });

            if (selected_rows.length === 0) {
              frappe.msgprint(__("Please select at least one row."));
              return;
            }

            try {
              let response = await frappe.call({
                method:
                  "docproc.document_processing_system.doctype.alert.alert.create_estimate_from_alerts",
                args: { selected_rows: selected_rows },
              });

              if (response.message && response.message.success) {
                window.location.href = response.message.estimate_url;
              } else {
                frappe.msgprint(__("Failed to create estimations."));
              }
            } catch (err) {
              console.error("Error creating estimations:", err);
              frappe.msgprint(
                __("An error occurred while creating estimations.")
              );
            }
          },
          () => {
            // No action on cancel
          }
        )
        .addClass("btn-info");
    });
  },
};
