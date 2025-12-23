import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useProperties, usePropertyMutations } from './hooks/useProperties';
import { AuthPage } from './components/auth/AuthPage';
import { MigrationPrompt } from './components/MigrationPrompt';
import { PropertyForm } from './components/PropertyForm';
import { KanbanBoard } from './components/KanbanBoard';
import { apiClient } from './services/api';
import { hasLocalStorageData } from './utils/migration';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Loader2 } from 'lucide-react';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  // Fetch all properties (no filtering needed for kanban)
  const { data: properties = [], isLoading: isLoadingProperties } = useProperties();

  const { addProperty, updateProperty, deleteProperty } = usePropertyMutations();

  // Check for localStorage data on mount
  useEffect(() => {
    if (user && hasLocalStorageData()) {
      setShowMigrationPrompt(true);
    }
  }, [user]);

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

      toast({
        title: "Success",
        description: "Property added successfully!",
      });
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
          toast({
            title: "Success",
            description: "Property updated",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update property",
            variant: "destructive",
          });
        },
      }
    );
  };

  // Handle deleting a property
  const handleDeleteProperty = (id: string) => {
    deleteProperty.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Property deleted",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete property",
          variant: "destructive",
        });
      },
    });
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      {showMigrationPrompt && (
        <MigrationPrompt
          userId={user.id}
          onComplete={() => setShowMigrationPrompt(false)}
        />
      )}

      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                🏠 Property Tracker
              </h1>
              <p className="text-muted-foreground mt-1">
                Track and organize your property viewings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button onClick={() => signOut()} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <PropertyForm onSubmit={handleAddProperty} isLoading={isAdding} />

        {isLoadingProperties ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading properties...</p>
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

      <Toaster />
    </div>
  );
}

export default App;
