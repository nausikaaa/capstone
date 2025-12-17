import type { Property } from '../types/property';

const STORAGE_KEY = 'property-tracker-properties';

export const localStorageUtils = {
  // Get all properties from localStorage
  getProperties(): Property[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Save all properties to localStorage
  saveProperties(properties: Property[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save properties. Storage may be full.');
    }
  },

  // Add a new property
  addProperty(property: Property): void {
    const properties = this.getProperties();
    properties.unshift(property); // Add to beginning of array
    this.saveProperties(properties);
  },

  // Update an existing property
  updateProperty(id: string, updates: Partial<Property>): void {
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

  // Delete a property
  deleteProperty(id: string): void {
    const properties = this.getProperties();
    const filtered = properties.filter((p) => p.id !== id);
    this.saveProperties(filtered);
  },

  // Check if a URL already exists
  propertyExists(url: string): boolean {
    const properties = this.getProperties();
    return properties.some((p) => p.url === url);
  },
};
