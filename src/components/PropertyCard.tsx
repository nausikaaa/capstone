import { useState } from 'react';
import type { Property } from '../types/property';

interface PropertyCardProps {
  property: Property;
  onUpdate: (id: string, updates: Partial<Property>) => void;
  onDelete: (id: string) => void;
}

export function PropertyCard({ property, onUpdate, onDelete }: PropertyCardProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(property.notes);
  const [rating, setRating] = useState(property.rating);

  const handleSaveNotes = () => {
    onUpdate(property.id, { notes });
    setIsEditingNotes(false);
  };

  const handleCancelNotes = () => {
    setNotes(property.notes);
    setIsEditingNotes(false);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    onUpdate(property.id, { rating: newRating });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this property?')) {
      onDelete(property.id);
    }
  };

  // Safely extract common property fields
  console.log('=== PROPERTY CARD DEBUG ===');
  console.log('Property data:', property.data);
  console.log('Available fields:', Object.keys(property.data));
  console.log('==========================');

  const title = property.data.title || property.data.name || 'Untitled Property';
  const price = property.data.price || property.data.priceValue || 'Price not available';
  const address = property.data.address || property.data.location || '';
  const imageUrl = property.data.image || property.data.imageUrl || property.data.thumbnail;

  return (
    <div className="property-card">
      <div className="property-header">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="property-image" />
        )}
        <div className="property-info">
          <h3 className="property-title">{title}</h3>
          <p className="property-price">{price}</p>
          {address && <p className="property-address">{address}</p>}
          <a
            href={property.url}
            target="_blank"
            rel="noopener noreferrer"
            className="property-link"
          >
            View on Idealista →
          </a>
        </div>
      </div>

      <div className="property-details">
        <div className="rating-section">
          <label>Your Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${rating && rating >= star ? 'filled' : ''}`}
                onClick={() => handleRatingChange(star)}
                aria-label={`Rate ${star} stars`}
              >
                ★
              </button>
            ))}
            {rating && (
              <button
                type="button"
                className="clear-rating"
                onClick={() => handleRatingChange(0)}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="notes-section">
          <label>Your Notes:</label>
          {isEditingNotes ? (
            <>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="notes-textarea"
                rows={4}
                placeholder="Add your thoughts about this property..."
              />
              <div className="notes-actions">
                <button onClick={handleSaveNotes} className="save-button">
                  Save
                </button>
                <button onClick={handleCancelNotes} className="cancel-button">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="notes-display">
                {notes || <em>No notes yet. Click Edit to add some.</em>}
              </p>
              <button onClick={() => setIsEditingNotes(true)} className="edit-button">
                Edit Notes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="property-footer">
        <span className="date-added">
          Added: {new Date(property.dateAdded).toLocaleDateString()}
        </span>
        <button onClick={handleDelete} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );
}
