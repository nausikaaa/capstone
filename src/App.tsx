import { useState, useEffect } from 'react';
import type { Property } from './types/property';
import { localStorageUtils } from './utils/localStorage';
import { apiClient } from './services/api';
import { PropertyForm } from './components/PropertyForm';
import { PropertyList } from './components/PropertyList';
import './App.css';

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Load properties from localStorage on mount
  useEffect(() => {
    const stored = localStorageUtils.getProperties();
    setProperties(stored);
  }, []);

  // Show notification with auto-dismiss
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle adding a new property
  const handleAddProperty = async (url: string) => {
    // Check if URL already exists
    if (localStorageUtils.propertyExists(url)) {
      throw new Error('This property has already been added');
    }

    setIsLoading(true);
    try {
      // Fetch property data from backend
      const propertyData = await apiClient.scrapeProperty(url);

      console.log('=== RECEIVED PROPERTY DATA ===');
      console.log('Property data:', propertyData);
      console.log('Available fields:', Object.keys(propertyData));
      console.log('==============================');

      // Create new property object
      const newProperty: Property = {
        id: crypto.randomUUID(),
        url,
        data: propertyData,
        notes: '',
        rating: null,
        dateAdded: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      };

      // Save to localStorage
      localStorageUtils.addProperty(newProperty);

      // Update state
      setProperties([newProperty, ...properties]);

      showNotification('success', 'Property added successfully!');
    } catch (error) {
      console.error('Error adding property:', error);
      throw error; // Re-throw to let form handle it
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating a property
  const handleUpdateProperty = (id: string, updates: Partial<Property>) => {
    try {
      localStorageUtils.updateProperty(id, updates);
      setProperties((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, ...updates, dateModified: new Date().toISOString() }
            : p
        )
      );
    } catch (error) {
      showNotification('error', 'Failed to update property');
    }
  };

  // Handle deleting a property
  const handleDeleteProperty = (id: string) => {
    try {
      localStorageUtils.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      showNotification('success', 'Property deleted');
    } catch (error) {
      showNotification('error', 'Failed to delete property');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏠 Property Tracker</h1>
        <p>Track and organize your favorite Idealista.com properties</p>
      </header>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <main className="app-main">
        <PropertyForm onSubmit={handleAddProperty} isLoading={isLoading} />
        <PropertyList
          properties={properties}
          onUpdate={handleUpdateProperty}
          onDelete={handleDeleteProperty}
        />
      </main>
    </div>
  );
}

export default App;
