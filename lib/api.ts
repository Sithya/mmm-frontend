/**
 * API Client for communicating with Laravel Backend
 */

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
const isServer = typeof window === 'undefined';

export const API_BASE_URL = isServer
  ? process.env.API_INTERNAL_URL
  : process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined');
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      // make safe json before parsing
      const contentType = response.headers.get('content-type');
    let data: any = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }


      if (!response.ok) {
        return {
          errors: data?.errors || data?.error?.details || { message: [data?.message || data?.error?.message || 'An error occurred'] },
        };
      }

      // Extract data from ApiResponse format if present: {success: true, data: {...}, message: "..."}
      // If backend returns {success: true, data: [...]}, extract the data field
      // Otherwise, return the data as-is for backward compatibility
      const extractedData = data?.success !== undefined && data?.data !== undefined ? data.data : data;

      return { data: extractedData };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        errors: { network: ['Network error. Please try again.'] },
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

