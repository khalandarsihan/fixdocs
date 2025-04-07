// src/components/DocumentViewer/index.jsx
import React, { useState } from 'react';

const DocumentViewer = ({ documentId, data }) => {
  const document = data?.document || null;
  
  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white p-6 rounded-lg shadow-lg text-red-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">Document Not Found</h3>
            <p className="mt-1">The document you're looking for could not be found.</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate days until expiry
  const calculateDaysUntilExpiry = () => {
    if (!document.expiryDate) return null;
    
    const expiryDate = new Date(document.expiryDate);
    const today = new Date();
    
    // Set both dates to midnight for accurate day calculation
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const daysUntilExpiry = calculateDaysUntilExpiry();
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center mb-6">
        <a
          href={`/${document.entityType.toLowerCase()}s`}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {document.entityType}s
        </a>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-semibold">{document.documentType}</h1>
          <span className={`px-2 py-1 text-xs rounded-full ${
            document.status === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {document.status}
          </span>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Document Information</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Document Number</div>
                  <div className="font-medium">{document.docNumber || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Entity</div>
                  <div className="font-medium">{document.entity}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Entity Type</div>
                  <div className="font-medium">{document.entityType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Issue Date</div>
                  <div className="font-medium">{formatDate(document.issueDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Expiry Date</div>
                  <div className={`font-medium ${
                    daysUntilExpiry !== null && daysUntilExpiry < 30 
                      ? 'text-red-600' 
                      : ''
                  }`}>
                    {formatDate(document.expiryDate)}
                    {daysUntilExpiry !== null && daysUntilExpiry < 30 && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                        {daysUntilExpiry} days left
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Attachments</h2>
              {document.attachments.length > 0 ? (
                <div className="space-y-2">
                  {document.attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center p-2 border rounded hover:bg-gray-50">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-gray-500 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" 
                        />
                      </svg>
                      <a 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {attachment.fileName}
                      </a>
                      {attachment.isPrivate && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                          Private
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic">No attachments available</div>
              )}
              
              <div className="mt-6">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => alert('Document upload feature would be implemented here')}
                >
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;