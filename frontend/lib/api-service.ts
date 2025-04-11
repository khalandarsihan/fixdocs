// Place this file in your project at: app/lib/api-service.ts

import axios from 'axios';

// Define the base URL for your Frappe server
// In production, you should use environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://172.180.3.3000';

// Define types
export interface Company {
  id: number;
  name: string;
  licenseExpiry: string;
  matafiExpiry: string;
  laborExpiry: string;
  immigrationExpiry: string;
  eChannelExpiry: string;
  docName?: string; // Original document name from Frappe
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based authentication
});

// API service object
export const apiService = {
  // Get all companies
  async getCompanies(): Promise<Company[]> {
    try {
      const response = await apiClient.get('/api/method/docproc.api.business_api.get_companies');
      console.log('API Response:', response.data); // Add this for debugging
      
      if (response.data.message && response.data.message.status === 'success') {
        return response.data.message.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  },

  // Add a new company
  async addCompany(companyData: Omit<Company, 'id' | 'docName'>): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/api/method/docproc.api.business_api.add_company', {
        company_data: companyData
      });
      
      if (response.data.message && response.data.message.status === 'success') {
        return { 
          success: true, 
          message: response.data.message.message 
        };
      }
      
      return { 
        success: false, 
        message: response.data.message?.message || 'Failed to add company' 
      };
    } catch (error) {
      console.error('Error adding company:', error);
      return { 
        success: false, 
        message: 'An error occurred while adding the company' 
      };
    }
  }
};