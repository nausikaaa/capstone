// Property data from Apify (flexible schema - we'll store whatever comes back)
export interface PropertyData {
  [key: string]: any; // Flexible to accommodate any Apify response structure
}

// Property lifecycle stages
export type PropertyStage = 'new' | 'scheduled' | 'visited' | 'archived';

// Extended property with user-added data (Supabase schema)
export interface Property {
  id: string;
  user_id: string;
  url: string;
  scraped_data: PropertyData; // Renamed from 'data' to match Supabase schema
  notes: string;
  rating: number | null; // 1-5 stars
  enthusiasm_score: number | null; // NEW: 1-10 enthusiasm level
  stage: PropertyStage; // NEW: Property lifecycle stage
  scheduled_visit_date: string | null; // NEW: When visit is scheduled
  visited_date: string | null; // NEW: When property was visited
  created_at: string;
  updated_at: string;
}

// Legacy property interface for migration from localStorage
export interface LegacyProperty {
  id: string;
  url: string;
  data: PropertyData;
  notes: string;
  rating: number | null;
  dateAdded: string;
  dateModified: string;
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
