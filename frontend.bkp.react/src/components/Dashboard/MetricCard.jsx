    // src/components/Dashboard/MetricCard.jsx
import React from 'react';

function MetricCard({ title, value, icon, onClick }) {
  // Determine a color based on the title
  const getCardColor = () => {
    switch (title) {
      case "Companies":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      case "Individuals":
        return "bg-indigo-50 border-indigo-200 hover:bg-indigo-100";
      case "Vehicles":
        return "bg-cyan-50 border-cyan-200 hover:bg-cyan-100";
      case "Alerts":
        return "bg-red-50 border-red-200 hover:bg-red-100";
      case "Estimates":
        return "bg-violet-50 border-violet-200 hover:bg-violet-100";
      case "Works":
        return "bg-sky-50 border-sky-200 hover:bg-sky-100";
      case "Invoices":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      case "Payments":
        return "bg-teal-50 border-teal-200 hover:bg-teal-100";
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  // Get icon and text color based on title
  const getIconColor = () => {
    switch (title) {
      case "Companies":
        return "text-blue-600";
      case "Individuals":
        return "text-indigo-600";
      case "Vehicles":
        return "text-cyan-600";
      case "Alerts":
        return "text-red-600";
      case "Estimates":
        return "text-violet-600";
      case "Works":
        return "text-sky-600";
      case "Invoices":
        return "text-blue-600";
      case "Payments":
        return "text-teal-600";
      default:
        return "text-gray-600";
    }
  };

  // Get title text color based on card type
  const getTitleColor = () => {
    switch (title) {
      case "Companies":
        return "text-blue-700";
      case "Individuals":
        return "text-indigo-700";
      case "Vehicles":
        return "text-cyan-700";
      case "Alerts":
        return "text-red-700";
      case "Estimates":
        return "text-violet-700";
      case "Works":
        return "text-sky-700";
      case "Invoices":
        return "text-blue-700";
      case "Payments":
        return "text-teal-700";
      default:
        return "text-gray-700";
    }
  };

  // Get value text color based on card type
  const getValueColor = () => {
    switch (title) {
      case "Companies":
        return "text-blue-900";
      case "Individuals":
        return "text-indigo-900";
      case "Vehicles":
        return "text-cyan-900";
      case "Alerts":
        return "text-red-900";
      case "Estimates":
        return "text-violet-900";
      case "Works":
        return "text-sky-900";
      case "Invoices":
        return "text-blue-900";
      case "Payments":
        return "text-teal-900";
      default:
        return "text-gray-900";
    }
  };

  return (
    <div
      className={`rounded-lg border ${getCardColor()} p-4 space-y-2 cursor-pointer transition-all duration-200 hover:shadow-md`}
      onClick={onClick}
    >
      <p className={`text-sm font-semibold ${getTitleColor()}`}>{title}</p>
      <div className="flex items-center justify-between">
        <div className={`${getIconColor()}`}>{icon}</div>
        <div className={`text-2xl font-bold ${getValueColor()}`}>{value}</div>
      </div>
    </div>
  );
}

export default MetricCard;