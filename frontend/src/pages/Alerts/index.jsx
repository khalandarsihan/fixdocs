// frontend/src/pages/Alerts/index.jsx
import React, { useState, useEffect } from 'react';
import Alerts from '../../components/Alerts';

const AlertsPage = () => {
  const [alertsData, setAlertsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/method/docproc.api.api.get_alerts_data');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Alerts API response:', data);
        setAlertsData(data);
      } catch (err) {
        console.error('Failed to load alerts:', err);
        setError('Failed to load alerts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    
    // Optional: Set up periodic refresh
    const refreshInterval = setInterval(fetchAlerts, 60000); // Refresh every minute
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return <Alerts data={alertsData} />;
};

export default AlertsPage;