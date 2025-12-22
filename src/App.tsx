import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useProperties, usePropertyMutations } from './hooks/useProperties';
import { AuthPage } from './components/auth/AuthPage';
import { MigrationPrompt } from './components/MigrationPrompt';
import { PropertyForm } from './components/PropertyForm';
import { KanbanBoard } from './components/KanbanBoard';
import { apiClient } from './services/api';
import { hasLocalStorageData } from './utils/migration';
import './App.css';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Fetch all properties (no filtering needed for kanban)
  const { data: properties = [], isLoading: isLoadingProperties } = useProperties();

  const { addProperty, updateProperty, deleteProperty } = usePropertyMutations();

  // Check for localStorage data on mount
  useEffect(() => {
    if (user && hasLocalStorageData()) {
      setShowMigrationPrompt(true);
    }
  }, [user]);

  // Show notification with auto-dismiss
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle adding a new property
  const handleAddProperty = async (url: string) => {
    if (!user) return;

    // Check if URL already exists
    const exists = properties.some((p) => p.url === url);
    if (exists) {
      throw new Error('This property has already been added');
    }

    setIsAdding(true);
    try {
      // Fetch property data from backend
      const propertyData = await apiClient.scrapeProperty(url);

      console.log('=== RECEIVED PROPERTY DATA ===');
      console.log('Property data:', propertyData);
      console.log('Available fields:', Object.keys(propertyData));
      console.log('==============================');

      // Add to Supabase via React Query
      await addProperty.mutateAsync({
        user_id: user.id,
        url,
        scraped_data: propertyData,
        notes: '',
        rating: null,
        enthusiasm_score: null,
        stage: 'new',
        scheduled_visit_date: null,
        visited_date: null,
      });

      showNotification('success', 'Property added successfully!');
    } catch (error) {
      console.error('Error adding property:', error);
      throw error; // Re-throw to let form handle it
    } finally {
      setIsAdding(false);
    }
  };

  // Handle updating a property
  const handleUpdateProperty = (id: string, updates: Partial<any>) => {
    updateProperty.mutate(
      { id, updates },
      {
        onSuccess: () => {
          showNotification('success', 'Property updated');
        },
        onError: () => {
          showNotification('error', 'Failed to update property');
        },
      }
    );
  };

  // Handle deleting a property
  const handleDeleteProperty = (id: string) => {
    deleteProperty.mutate(id, {
      onSuccess: () => {
        showNotification('success', 'Property deleted');
      },
      onError: () => {
        showNotification('error', 'Failed to delete property');
      },
    });
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="app">
      {showMigrationPrompt && (
        <MigrationPrompt
          userId={user.id}
          onComplete={() => setShowMigrationPrompt(false)}
        />
      )}

      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>🏠 Property Tracker</h1>
            <p>Track and organize your property viewings</p>
          </div>
          <div className="header-actions">
            <span className="user-email">{user.email}</span>
            <button onClick={() => signOut()} className="sign-out-button">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <main className="app-main">
        <PropertyForm onSubmit={handleAddProperty} isLoading={isAdding} />

        {isLoadingProperties ? (
          <div className="loading-properties">
            <div className="loading-spinner"></div>
            <p>Loading properties...</p>
          </div>
        ) : (
          <KanbanBoard
            properties={properties}
            onUpdate={handleUpdateProperty}
            onDelete={handleDeleteProperty}
            onAddNew={() => {
              // Scroll to property form
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
