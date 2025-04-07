// src/components/Alerts/index.jsx
import React, { useState } from 'react';
import { createEstimateForAlert } from '../../lib/api';

const Alerts = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [processingEstimate, setProcessingEstimate] = useState(false);
  
  // Access data correctly from Frappe API structure which includes a 'message' wrapper
  const alerts = data?.message?.alerts || [];
  const stats = data?.message?.stats || { 
    total: 0, 
    open: 0, 
    inProgress: 0, 
    resolved: 0, 
    highPriority: 0 
  };
  
  // Filter alerts based on search, status, and type
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = searchQuery === '' || 
      Object.values(alert).some(value => 
        value && typeof value === 'string' && 
        value.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'open' && alert.status === 'Open') ||
      (statusFilter === 'inProgress' && alert.status === 'Follow-Up') ||
      (statusFilter === 'resolved' && ['Service Estimate', 'Partial Quotation', 'Work-Order'].includes(alert.status));
    
    const matchesType = typeFilter === 'all' || 
      (alert.alertType === typeFilter);
      
    return matchesSearch && matchesStatus && matchesType;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString();
    } catch (e) {
      return 'N/A';
    }
  };
  
  // Handle "Create Estimate" button click
  const handleCreateEstimate = async (alertId) => {
    try {
      setProcessingEstimate(true);
      const result = await createEstimateForAlert(alertId);
      
      if (result.message && result.message.success) {
        // Show success notification
        alert('Estimate created successfully!');
        
        // Navigate to the estimate page
        window.location.href = result.message.estimate_url;
      } else {
        // Show error message
        alert('Failed to create estimate: ' + (result.message?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating estimate:', error);
      alert('An error occurred while creating the estimate');
    } finally {
      setProcessingEstimate(false);
    }
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Alerts</h1>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Business">Business</option>
            <option value="Personnel">Personnel</option>
            <option value="Vehicle">Vehicle</option>
          </select>
          <input
            className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnel</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires In</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAlerts.map(alert => (
                    <tr key={alert.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <a href={`/app/alert/${alert.id}`} className="text-blue-600 hover:underline">
                          {alert.id}
                        </a>
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
                        <span className="inline-flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            alert.alertType === 'Vehicle' ? 'bg-blue-500' : 
                            alert.alertType === 'Personnel' ? 'bg-green-500' : 
                            'bg-yellow-500'
                          }`}></span>
                          {alert.alertType}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{alert.billTo}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{alert.business}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{alert.personnel}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{alert.vehicle}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{alert.documentType}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{alert.expiresIn}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {alert.status === 'Open' && !alert.linkedEstimate && (
                          <button 
                            className="text-blue-600 hover:text-blue-800 mr-2"
                            onClick={() => handleCreateEstimate(alert.id)}
                            disabled={processingEstimate}
                          >
                            {processingEstimate ? 'Creating...' : 'Create Estimate'}
                          </button>
                        )}
                        {alert.linkedEstimate && (
                          <a 
                            href={`/app/service-estimate/${alert.linkedEstimate}`}
                            className="text-green-600 hover:text-green-800"
                          >
                            View Estimate
                          </a>
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