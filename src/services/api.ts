import type { ScrapePropertyResponse, ApiError, PropertyData } from '../types/property';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async scrapeProperty(url: string): Promise<PropertyData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/properties/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        // Try to parse error response
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || 'Failed to scrape property');
      }

      const result: ScrapePropertyResponse = await response.json();
      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error: Failed to connect to the server');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
