// src/components/Dashboard/formatters.js
// Utility functions for formatting data

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const daysUntilExpiry = (expiryDateString) => {
  const expiryDate = new Date(expiryDateString);
  const today = new Date();

  // Set both dates to midnight for accurate day calculation
  expiryDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};
