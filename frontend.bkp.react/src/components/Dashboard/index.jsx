// src/components/Dashboard/index.jsx
import React, { useState } from 'react';
import { useFrappeGetCall } from 'frappe-react-sdk';
import { Building, Users, Bell, FileText, Wrench, Receipt, CreditCard } from 'lucide-react';
import MetricCard from './MetricCard';
import DashboardTabs from './DashboardTabs';
import SkeletonCard from './SkeletonCard';
import SearchInput from './SearchInput';

function Dashboard({ data: propData }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch dashboard data from Frappe API if not provided through props
  const { data: fetchedData, error, isValidating } = useFrappeGetCall(
    'docproc.api.api.get_dashboard_data',
    {},
    { 
      revalidateOnFocus: false,
      revalidateIfStale: false
    }
  );
  
  // Use data from props if available, otherwise use fetched data
  const data = propData || fetchedData;

  // Extract data or use defaults if not available
  const stats = data?.message?.stats || {
    companies: "0",
    individuals: "0",
    alerts: "0",
    estimates: "0",
    works: "0",
    invoices: "0",
    payments: "0"
  };
  
  const recentAlerts = Array.isArray(data?.message?.recentAlerts) 
    ? data.message.recentAlerts 
    : [];
  
  const upcomingRenewals = Array.isArray(data?.message?.upcomingRenewals) 
    ? data.message.upcomingRenewals 
    : [];
  
  const recentWorks = Array.isArray(data?.message?.recentWorks) 
    ? data.message.recentWorks 
    : [];

  // Filter items based on search query
  const filteredAlerts = recentAlerts.filter(alert => {
    if (!alert) return false;
    
    const searchLower = searchQuery.toLowerCase();
    
    // Try different property names since API response format might vary
    const nameMatch = 
      (typeof alert.name === 'string' && alert.name.toLowerCase().includes(searchLower));
    
    const typeMatch = 
      (typeof alert.alert_type === 'string' && alert.alert_type.toLowerCase().includes(searchLower));
    
    const billToMatch = 
      (typeof alert.bill_to === 'string' && alert.bill_to.toLowerCase().includes(searchLower));
    
    const docTypeMatch = 
      (typeof alert.document_type === 'string' && alert.document_type.toLowerCase().includes(searchLower));
    
    const docIdMatch = 
      (typeof alert.document_id === 'string' && alert.document_id.toLowerCase().includes(searchLower));
    
    // Return true if searchQuery is empty or if any field matches
    return searchQuery === '' || nameMatch || typeMatch || billToMatch || docTypeMatch || docIdMatch;
  });

  const filteredRenewals = upcomingRenewals.filter(renewal => {
    if (!renewal) return false;
    
    const searchLower = searchQuery.toLowerCase();
    const documentMatch = typeof renewal.document === 'string' && renewal.document.toLowerCase().includes(searchLower);
    const entityMatch = typeof renewal.entity === 'string' && renewal.entity.toLowerCase().includes(searchLower);
    
    return searchQuery === '' || documentMatch || entityMatch;
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">FixDocs Dashboard</h1>
        <SearchInput 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {isValidating ? (
          // Show skeleton cards when loading
          Array(7).fill(0).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : (
          // Show actual metric cards when data is loaded
          <>
            <MetricCard
              title="Companies"
              value={stats.companies}
              icon={<Building className="h-5 w-5" />}
              onClick={() => console.log("Companies clicked")}
            />
            <MetricCard
              title="Individuals"
              value={stats.individuals}
              icon={<Users className="h-5 w-5" />}
              onClick={() => console.log("Individuals clicked")}
            />
            <MetricCard
              title="Alerts"
              value={stats.alerts}
              icon={<Bell className="h-5 w-5" />}
              onClick={() => console.log("Alerts clicked")}
            />
            <MetricCard
              title="Estimates"
              value={stats.estimates}
              icon={<FileText className="h-5 w-5" />}
              onClick={() => console.log("Estimates clicked")}
            />
            <MetricCard
              title="Works"
              value={stats.works}
              icon={<Wrench className="h-5 w-5" />}
              onClick={() => console.log("Works clicked")}
            />
            <MetricCard
              title="Invoices"
              value={stats.invoices}
              icon={<Receipt className="h-5 w-5" />}
              onClick={() => console.log("Invoices clicked")}
            />
            <MetricCard
              title="Payments"
              value={stats.payments}
              icon={<CreditCard className="h-5 w-5" />}
              onClick={() => console.log("Payments clicked")}
            />
          </>
        )}
      </div>

      {/* Tabs and Content */}
      <DashboardTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        recentWorks={recentWorks}
        filteredAlerts={filteredAlerts}
        filteredRenewals={filteredRenewals}
        isLoading={isValidating}
      />
    </div>
  );
}

export default Dashboard;