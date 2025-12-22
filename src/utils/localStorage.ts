import type { LegacyProperty } from '../types/property';

const STORAGE_KEY = 'property-tracker-properties';

export const localStorageUtils = {
  // Get all properties from localStorage (legacy format only)
  getProperties(): LegacyProperty[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Save all properties to localStorage (legacy format only)
  saveProperties(properties: LegacyProperty[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save properties. Storage may be full.');
    }
  },

  // Add a new property (legacy format only)
  addProperty(property: LegacyProperty): void {
    const properties = this.getProperties();
    properties.unshift(property); // Add to beginning of array
    this.saveProperties(properties);
  },

  // Update an existing property (legacy format only)
  updateProperty(id: string, updates: Partial<LegacyProperty>): void {
    const properties = this.getProperties();
    const index = properties.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('Property not found');
    }

    properties[index] = {
      ...properties[index],
      ...updates,
      dateModified: new Date().toISOString(),
    };

    this.saveProperties(properties);
  },

  // Delete a property (legacy format only)
  deleteProperty(id: string): void {
    const properties = this.getProperties();
    const filtered = properties.filter((p) => p.id !== id);
    this.saveProperties(filtered);
  },

  // Check if a URL already exists (legacy format only)
  propertyExists(url: string): boolean {
    const properties = this.getProperties();
    return properties.some((p) => p.url === url);
  },
};
