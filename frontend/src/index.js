// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { FrappeProvider } from "frappe-react-sdk";
import App from "./components/App";
import "./styles/base.css";

// Function to render with FrappeProvider wrapper
const renderWithProvider = (component, container) => {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <FrappeProvider socketPort={window.socketPort}>
        {component}
      </FrappeProvider>
    </React.StrictMode>
  );
};

// Dashboard Container
const dashboardContainer = document.getElementById("fixdocs-dashboard");
if (dashboardContainer) {
  renderWithProvider(<App module="dashboard" />, dashboardContainer);
}

// Business Container
const businessContainer = document.getElementById("fixdocs-business");
if (businessContainer) {
  renderWithProvider(<App module="business" />, businessContainer);
}

// Personnel Container
const personnelContainer = document.getElementById("fixdocs-personnel");
if (personnelContainer) {
  renderWithProvider(<App module="personnel" />, personnelContainer);
}

// Alerts Container
const alertsContainer = document.getElementById("fixdocs-alerts");
if (alertsContainer) {
  renderWithProvider(<App module="alerts" />, alertsContainer);
}

// Document Container
const documentContainer = document.getElementById("fixdocs-document");
if (documentContainer) {
  const documentId = documentContainer.dataset.documentId;
  renderWithProvider(
    <App module="document" documentId={documentId} />,
    documentContainer
  );
}
