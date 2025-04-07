// src/components/App.jsx
import React, { useState, useEffect } from 'react';
import { useFrappeGetCall } from 'frappe-react-sdk';
import Dashboard from './Dashboard';
import Businesses from './Businesses';
import Personnel from './Personnel';
import Alerts from './Alerts';
import DocumentViewer from './DocumentViewer';
import ErrorBoundary from './ErrorBoundary';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

/**
 * Main App component that handles routing and module loading
 * @param {Object} props - Component props
 * @param {string} props.module - The module to display (dashboard, business, personnel, alerts, document)
 * @param {string} props.documentId - The document ID if viewing a specific document
 */
const App = ({ module, documentId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch initial app data from Frappe backend
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
        return <Businesses data={data?.message} />;
      case 'personnel':
        return <Personnel data={data?.message} />;
      case 'alerts':
        return <Alerts data={data} />;
      case 'document':
        return <DocumentViewer documentId={documentId} data={data?.message} />;
      default:
        return <div className="p-8 text-xl">Module Not Found</div>;
    }
  };
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState message={error} />;
  }
  
  return (
    <div className="fixdocs-app bg-gray-50 min-h-screen">
      <ErrorBoundary>
        {renderModule()}
      </ErrorBoundary>
    </div>
  );
};

export default App;

