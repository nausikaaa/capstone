// Property data from Apify (flexible schema - we'll store whatever comes back)
export interface PropertyData {
  [key: string]: any; // Flexible to accommodate any Apify response structure
}

// Extended property with user-added data
export interface Property {
  id: string; // Unique identifier (generated client-side)
  url: string; // Original property URL
  data: PropertyData; // Raw data from Apify
  notes: string; // User's personal notes
  rating: number | null; // User's rating (1-5, or null if not rated)
  dateAdded: string; // ISO timestamp when property was added
  dateModified: string; // ISO timestamp when last modified
}

// API response types
export interface ScrapePropertyResponse {
  success: boolean;
  data: PropertyData;
}

export interface ApiError {
  error: string;
  message: string;
}
