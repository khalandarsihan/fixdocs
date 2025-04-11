// app/lib/frappe-service.ts
import { FrappeApp } from 'frappe-js-sdk';

// Define the base URL for your Frappe server
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://172.180.3.3000';

// Create a FrappeApp instance
export const frappe = new FrappeApp(BASE_URL);

// Create a database instance
export const db = frappe.db();

// Create a call instance for custom methods
export const call = frappe.call();

// Define types
export interface Company {
  id: number;
  name: string;
  licenseExpiry: string;
  matafiExpiry: string;
  laborExpiry: string;
  immigrationExpiry: string;
  eChannelExpiry: string;
  docName?: string;
}

// Company service functions
export const companyService = {
  // Get all companies
  async getCompanies(): Promise<Company[]> {
    try {
      const response = await call.get('docproc.api.business_api.get_companies');
      console.log('API Response:', response);
      
      if (response.message && response.message.status === 'success') {
        return response.message.data;
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
      const response = await call.post('docproc.api.business_api.add_company', {
        company_data: companyData
      });
      
      if (response.message && response.message.status === 'success') {
        return { 
          success: true, 
          message: response.message.message 
        };
      }
      
      return { 
        success: false, 
        message: response.message?.message || 'Failed to add company' 
      };
    } catch (error) {
      console.error('Error adding company:', error);
      return { 
        success: false, 
        message: 'An error occurred while adding the company' 
      };
    }
  },

  // Get a business document directly
  async getBusinessDoc(docName: string) {
    try {
      return await db.getDoc('Business', docName);
    } catch (error) {
      console.error('Error getting business:', error);
      throw error;
    }
  }
};