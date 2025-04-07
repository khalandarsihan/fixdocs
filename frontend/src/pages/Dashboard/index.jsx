import React from 'react';
import { formatDate, daysUntilExpiry } from '../../lib/utils';

const Dashboard = ({ data = {} }) => {
  // Extract data or use defaults if not available
  const stats = data?.stats || {
    totalDocuments: 0,
    expiringDocuments: 0,
    businessCount: 0,
    personnelCount: 0,
    alertsCount: 0,
    completedTasks: 0
  };
  
  const recentAlerts = data?.recentAlerts || [];
  const upcomingRenewals = data?.upcomingRenewals || [];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">FixDocs Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="dashboard-stat">
          <div className="dashboard-stat-value">{stats.totalDocuments}</div>
          <div className="dashboard-stat-label">Total Documents</div>
        </div>
        
        <div className="dashboard-stat">
          <div className="dashboard-stat-value text-amber-500">{stats.expiringDocuments}</div>
          <div className="dashboard-stat-label">Documents Expiring Soon</div>
        </div>
        
        <div className="dashboard-stat">
          <div className="dashboard-stat-value">{stats.businessCount}</div>
          <div className="dashboard-stat-label">Businesses</div>
        </div>
        
        <div className="dashboard-stat">
          <div className="dashboard-stat-value">{stats.personnelCount}</div>
          <div className="dashboard-stat-label">Personnel</div>
        </div>
        
        <div className="dashboard-stat">
          <div className="dashboard-stat-value text-red-500">{stats.alertsCount}</div>
          <div className="dashboard-stat-label">Open Alerts</div>
        </div>
        
        <div className="dashboard-stat">
          <div className="dashboard-stat-value text-green-500">{stats.completedTasks}</div>
          <div className="dashboard-stat-label">Completed Tasks</div>
        </div>
      </div>
      
      {/* Recent Alerts */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Alerts</h2>
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          {recentAlerts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAlerts.map((alert, index) => (
                    <tr key={alert.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.type === 'Expiry' ? 'bg-amber-100 text-amber-800' : 
                          alert.type === 'Compliance' ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{alert.document}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{alert.entity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(alert.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
            <div className="p-6 text-center text-gray-500">No recent alerts found.</div>
          )}
        </div>
      </div>
      
      {/* Upcoming Renewals */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Renewals</h2>
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          {upcomingRenewals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingRenewals.map((renewal, index) => {
                    const daysLeft = daysUntilExpiry(renewal.expiryDate);
                    
                    return (
                      <tr key={renewal.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{renewal.document}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{renewal.entity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(renewal.expiryDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-medium ${
                            daysLeft <= 7 ? 'text-red-600' : 
                            daysLeft <= 30 ? 'text-amber-600' : 
                            'text-green-600'
                          }`}>
                            {daysLeft} days
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="btn btn-primary text-xs">Renew</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">No upcoming renewals found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
