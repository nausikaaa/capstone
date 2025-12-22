import { useState, type FormEvent } from 'react';

interface PropertyFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

export function PropertyForm({ onSubmit, isLoading }: PropertyFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!url.trim()) {
      setError('Please enter a property URL');
      return;
    }

    try {
      new URL(url); // Validate URL format
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    try {
      await onSubmit(url.trim());
      setUrl(''); // Clear input on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add property');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="property-form">
      <div className="form-group">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste Idealista.com property URL here..."
          className="url-input"
          disabled={isLoading}
        />
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Property'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
}
