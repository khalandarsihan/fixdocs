// src/components/Businesses/index.jsx
import React, { useState } from 'react';

const Businesses = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get businesses from data or use empty array
  const businesses = data?.businesses || [];
  
  // Filter businesses based on search query
  const filteredBusinesses = businesses.filter(business => 
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.legalType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Businesses</h1>
        <input
          className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search businesses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">All Businesses</h2>
        </div>
        <div className="p-4">
          {filteredBusinesses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Legal Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Expiry</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBusinesses.map(business => (
                    <tr key={business.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <a href={`/businesses/${business.id}`} className="text-blue-600 hover:underline">
                          {business.name}
                        </a>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{business.legalType}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {business.licenseExpiryDate ? (
                          <span className={business.expiryDays < 30 ? 'text-red-600' : 'text-gray-900'}>
                            {new Date(business.licenseExpiryDate).toLocaleDateString()} 
                            {business.expiryDays < 30 && ` (${business.expiryDays} days)`}
                          </span>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{business.documentCount}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          business.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {business.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No businesses found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Businesses;