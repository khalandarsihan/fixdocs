// src/components/Alerts/index.jsx
import React, { useState, useEffect } from 'react';

const Alerts = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Get alerts from data or use empty array
  const alerts = data?.alerts || [];
  const stats = data?.stats || { total: 0, open: 0, inProgress: 0, resolved: 0, highPriority: 0 };
  
  // Filter alerts based on search query and status
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      (alert.title && alert.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (alert.description && alert.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (alert.entity && alert.entity.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'open' && alert.status === 'Open') ||
      (statusFilter === 'inProgress' && alert.status === 'Follow-Up') ||
      (statusFilter === 'resolved' && ['Service Estimate', 'Partial Quotation', 'Work-Order'].includes(alert.status));
      
    return matchesSearch && matchesStatus;
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Alerts</h1>
        <input
          className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search alerts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="text-gray-500 text-sm">Total Alerts</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="text-gray-500 text-sm">Open</div>
          <div className="text-2xl font-bold text-red-600">{stats.open}</div>
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="text-gray-500 text-sm">In Progress</div>
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="text-gray-500 text-sm">Resolved</div>
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
        </div>
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="text-gray-500 text-sm">High Priority</div>
          <div className="text-2xl font-bold text-orange-600">{stats.highPriority}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Alerts</h2>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 rounded text-sm ${statusFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 rounded text-sm ${statusFilter === 'open' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}
                onClick={() => setStatusFilter('open')}
              >
                Open
              </button>
              <button 
                className={`px-3 py-1 rounded text-sm ${statusFilter === 'inProgress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
                onClick={() => setStatusFilter('inProgress')}
              >
                In Progress
              </button>
              <button 
                className={`px-3 py-1 rounded text-sm ${statusFilter === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                onClick={() => setStatusFilter('resolved')}
              >
                Resolved
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          {filteredAlerts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAlerts.map(alert => (
                    <tr key={alert.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <a href={`/alerts/${alert.id}`} className="text-blue-600 hover:underline">
                          {alert.title}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm">{alert.description}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{alert.entity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDate(alert.date)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.priority === 'High' ? 'bg-red-100 text-red-800' : 
                          alert.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          alert.status === 'Open' ? 'bg-red-100 text-red-800' : 
                          alert.status === 'Follow-Up' ? 'bg-blue-100 text-blue-800' : 
                          alert.status === 'Service Estimate' ? 'bg-green-100 text-green-800' :
                          alert.status === 'Work-Order' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {alert.status === 'Open' && (
                          <button 
                            className="text-blue-600 hover:text-blue-800 mr-2"
                            onClick={() => window.location.href = `/create-estimate/${alert.id}`}
                          >
                            Create Estimate
                          </button>
                        )}
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
    </div>
  );
};

export default Alerts;