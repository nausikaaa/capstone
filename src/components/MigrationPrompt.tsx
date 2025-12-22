import { useState } from 'react';
import { migrateLocalStorageToSupabase, getLocalStorageCount } from '../utils/migration';
import './MigrationPrompt.css';

interface MigrationPromptProps {
  userId: string;
  onComplete: () => void;
}

export function MigrationPrompt({ userId, onComplete }: MigrationPromptProps) {
  const [isMigrating, setIsMigrating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const propertyCount = getLocalStorageCount();

  const handleImport = async () => {
    setIsMigrating(true);
    setError(null);

    const result = await migrateLocalStorageToSupabase(userId);

    if (result.success) {
      onComplete();
    } else {
      setError(result.error || 'Failed to import properties');
      setIsMigrating(false);
    }
  };

  const handleDismiss = () => {
    // Don't delete localStorage data, just close the prompt
    onComplete();
  };

  return (
    <div className="migration-overlay">
      <div className="migration-modal">
        <h2>Import Your Properties</h2>
        <p>
          We found {propertyCount} {propertyCount === 1 ? 'property' : 'properties'} saved
          locally. Would you like to import {propertyCount === 1 ? 'it' : 'them'} to your
          account?
        </p>

        {error && <div className="migration-error">{error}</div>}

        <div className="migration-actions">
          <button
            onClick={handleImport}
            disabled={isMigrating}
            className="migration-button primary"
          >
            {isMigrating ? 'Importing...' : 'Import Properties'}
          </button>
          <button
            onClick={handleDismiss}
            disabled={isMigrating}
            className="migration-button secondary"
          >
            Skip
          </button>
        </div>

        <p className="migration-note">
          {isMigrating
            ? 'Please wait while we import your properties...'
            : 'You can import your properties later from your profile settings.'}
        </p>
      </div>
    </div>
  );
}
