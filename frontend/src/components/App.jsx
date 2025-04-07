import React, { useState, useEffect } from 'react';
import { useFrappeGetCall } from 'frappe-react-sdk';
import Dashboard from '../pages/Dashboard';

const App = ({ module, documentId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Example API call using frappe-react-sdk
  const { data, error: apiError, isValidating } = useFrappeGetCall(
    'docproc.api.api.get_app_data',
    { module, document_id: documentId },
    {
      revalidateOnFocus: false,
    }
  );
  
  useEffect(() => {
    if (apiError) {
      console.error('API Error:', apiError);
      setError('Failed to load data. Please try again.');
    }
    
    if (data && !isValidating) {
      setLoading(false);
    }
  }, [data, apiError, isValidating]);
  
  // Helper to render the correct module
  const renderModule = () => {
    switch (module) {
      case 'dashboard':
        return <Dashboard data={data?.message} />;
      case 'business':
        return <div className="p-8 text-xl">Business Module (Coming Soon)</div>;
      case 'personnel':
        return <div className="p-8 text-xl">Personnel Module (Coming Soon)</div>;
      case 'alerts':
        return <div className="p-8 text-xl">Alerts Module (Coming Soon)</div>;
      case 'document':
        return <div className="p-8 text-xl">Document Viewer: {documentId}</div>;
      default:
        return <div className="p-8 text-xl">Module Not Found</div>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white p-6 rounded-lg shadow-lg text-red-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">Error</h3>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return <div className="fixdocs-app">{renderModule()}</div>;
};

export default App;
