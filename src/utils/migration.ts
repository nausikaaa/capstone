import { localStorageUtils } from './localStorage';
import { supabase } from '../lib/supabase';

export async function migrateLocalStorageToSupabase(
  userId: string
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const legacyProperties = localStorageUtils.getProperties();

    if (legacyProperties.length === 0) {
      return { success: true, count: 0 };
    }

    // Transform legacy format to new Supabase format
    const newProperties = legacyProperties.map((legacy) => ({
      user_id: userId,
      url: legacy.url,
      scraped_data: legacy.data,
      notes: legacy.notes || '',
      rating: legacy.rating,
      enthusiasm_score: null,
      stage: 'new' as const,
      scheduled_visit_date: null,
      visited_date: null,
      created_at: legacy.dateAdded,
      updated_at: legacy.dateModified,
    }));

    // Insert properties into Supabase
    const { error } = await supabase.from('properties').insert(newProperties);

    if (error) {
      console.error('Migration error:', error);
      return {
        success: false,
        count: 0,
        error: error.message,
      };
    }

    // Clear localStorage after successful migration
    localStorage.removeItem('property-tracker-properties');

    return {
      success: true,
      count: legacyProperties.length,
    };
  } catch (error) {
    console.error('Migration error:', error);
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function hasLocalStorageData(): boolean {
  try {
    const properties = localStorageUtils.getProperties();
    return properties.length > 0;
  } catch {
    return false;
  }
}

export function getLocalStorageCount(): number {
  try {
    const properties = localStorageUtils.getProperties();
    return properties.length;
  } catch {
    return 0;
  }
}
