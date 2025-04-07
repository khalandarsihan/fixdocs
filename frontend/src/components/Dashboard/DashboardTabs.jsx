
// src/components/Dashboard/DashboardTabs.jsx
import React from 'react';
import { formatDate, daysUntilExpiry } from './formatters';

function DashboardTabs({ 
  activeTab, 
  setActiveTab, 
  recentWorks, 
  filteredAlerts, 
  filteredRenewals,
  isLoading 
}) {
  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "alerts"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Alerts
          </button>
          <button
            onClick={() => setActiveTab("renewals")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "renewals"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Renewals
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="mt-4">
        {activeTab === "overview" && (
          <OverviewTab 
            recentWorks={recentWorks} 
            filteredAlerts={filteredAlerts} 
            isLoading={isLoading} 
          />
        )}
        {activeTab === "alerts" && (
          <AlertsTab 
            filteredAlerts={filteredAlerts} 
            isLoading={isLoading} 
          />
        )}
        {activeTab === "renewals" && (
          <RenewalsTab 
            filteredRenewals={filteredRenewals} 
            isLoading={isLoading} 
          />
        )}
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab({ recentWorks, filteredAlerts, isLoading }) {
  return (
    <div className="space-y-6">
      {/* Recent Works */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Recent Works</h2>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 w-full animate-pulse bg-gray-200 rounded"></div>
              <div className="h-12 w-full animate-pulse bg-gray-200 rounded"></div>
              <div className="h-12 w-full animate-pulse bg-gray-200 rounded"></div>
            </div>
          ) : recentWorks.length > 0 ? (
            <div className="space-y-4">
              {recentWorks.map((work, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{work.title}</p>
                    <p className="text-sm text-gray-500">{formatDate(work.date)}</p>
                  </div>
                  <div className="text-sm text-gray-500">{work.duration}</div>
                </div>
              ))}
              <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium">
                View all works
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent works found
            </div>
          )}
        </div>
      </div>

      {/* Important Alerts */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Important Alerts</h2>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 w-full animate-pulse bg-gray-200 rounded"></div>
              <div className="h-12 w-full animate-pulse bg-gray-200 rounded"></div>
            </div>
          ) : filteredAlerts.length > 0 ? (
            <div className="space-y-4">
              {filteredAlerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="text-red-500 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-sm text-gray-500">{alert.description}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium">
                View all alerts
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No alerts found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AlertsTab({ filteredAlerts, isLoading }) {
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">All Alerts</h2>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : filteredAlerts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlerts.map((alert, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{alert.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{alert.description}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{alert.entity}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDate(alert.date)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        alert.status === 'Open' ? 'bg-red-100 text-red-800' : 
                        alert.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No alerts found
          </div>
        )}
      </div>
    </div>
  );
}

function RenewalsTab({ filteredRenewals, isLoading }) {
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Upcoming Renewals</h2>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : filteredRenewals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRenewals.map((renewal, index) => {
                  const days = daysUntilExpiry(renewal.expiryDate);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{renewal.document}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{renewal.entity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDate(renewal.expiryDate)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={
                          days <= 7 ? "text-red-600 font-medium" : 
                          days <= 30 ? "text-yellow-600 font-medium" : 
                          "text-green-600 font-medium"
                        }>
                          {days} days
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-xs font-medium">
                          Renew
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No upcoming renewals found
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardTabs;