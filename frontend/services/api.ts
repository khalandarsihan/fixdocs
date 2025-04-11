import axios from 'axios';

// Use the correct port - make sure this matches your server
const API_URL = "http://dubai-typing.localhost:8001";

// Configure axios with default settings for all requests
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Company interfaces
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

export interface CompanyInput {
  name: string;
  licenseExpiry: string;
  matafiExpiry: string;
  laborExpiry: string;
  immigrationExpiry: string;
  eChannelExpiry: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// Company service for fetching data
export const companyService = {
  async getCompanies(): Promise<Company[]> {
    try {
      const response = await apiClient.get('/api/method/docproc.api.business_api.get_companies');
      console.log("API Response:", response.data);
      
      if (response.data.message && response.data.message.status === "success") {
        return response.data.message.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching companies:", error);
      return [];
    }
  },
  
  async addCompany(companyData: CompanyInput): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(
        '/api/method/docproc.api.business_api.add_company',
        { company_data: companyData }
      );
      
      if (response.data.message && response.data.message.status === "success") {
        return {
          success: true,
          message: response.data.message.message
        };
      }
      
      return {
        success: false,
        message: response.data.message?.message || "Failed to add company"
      };
    } catch (error) {
      console.error("Error adding company:", error);
      return {
        success: false,
        message: "An error occurred while adding the company"
      };
    }
  }
};