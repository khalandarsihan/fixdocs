// src/components/Personnel/index.jsx
import React, { useState } from 'react';

const Personnel = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get individuals from data or use empty array
  const individuals = data?.individuals || [];
  
  // Filter individuals based on search query
  const filteredIndividuals = individuals.filter(individual => 
    individual.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    individual.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    individual.residentStatus.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Personnel</h1>
        <input
          className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search individuals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">All Individuals</h2>
        </div>
        <div className="p-4">
          {filteredIndividuals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport Expiry</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIndividuals.map(individual => (
                    <tr key={individual.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <a href={`/personnel/${individual.id}`} className="text-blue-600 hover:underline">
                          {individual.name}
                        </a>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{individual.type}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{individual.residentStatus}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{individual.passportId || 'N/A'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {individual.passportExpiryDate ? (
                          <span className={individual.expiryDays < 30 ? 'text-red-600' : 'text-gray-900'}>
                            {new Date(individual.passportExpiryDate).toLocaleDateString()} 
                            {individual.expiryDays < 30 && ` (${individual.expiryDays} days)`}
                          </span>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{individual.documentCount}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          individual.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {individual.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No individuals found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Personnel;