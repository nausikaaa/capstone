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
  const [showScheduleDate, setShowScheduleDate] = useState(false);
  const [showVisitedDate, setShowVisitedDate] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [visitedDate, setVisitedDate] = useState('');

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

  const handleScheduleVisit = () => {
    if (scheduledDate) {
      onUpdate(property.id, {
        stage: 'scheduled',
        scheduled_visit_date: new Date(scheduledDate).toISOString(),
      });
      setShowScheduleDate(false);
      setScheduledDate('');
    }
  };

  const handleMarkVisited = () => {
    if (visitedDate) {
      onUpdate(property.id, {
        stage: 'visited',
        visited_date: new Date(visitedDate).toISOString(),
      });
      setShowVisitedDate(false);
      setVisitedDate('');
    }
  };

  const handleArchive = () => {
    onUpdate(property.id, { stage: 'archived' });
  };

  const handleUnarchive = () => {
    onUpdate(property.id, { stage: 'new' });
  };

  const handleCancelVisit = () => {
    onUpdate(property.id, {
      stage: 'new',
      scheduled_visit_date: null,
    });
  };

  const handleReschedule = () => {
    if (scheduledDate) {
      onUpdate(property.id, {
        scheduled_visit_date: new Date(scheduledDate).toISOString(),
      });
      setShowScheduleDate(false);
      setScheduledDate('');
    }
  };

  // Safely extract common property fields
  console.log('=== PROPERTY CARD DEBUG ===');
  console.log('Property data:', property.scraped_data);
  console.log('Available fields:', Object.keys(property.scraped_data));
  console.log('==========================');

  const title = property.scraped_data.title || property.scraped_data.name || 'Untitled Property';
  const price = property.scraped_data.price || property.scraped_data.priceValue || 'Price not available';
  const address = property.scraped_data.address || property.scraped_data.location || '';
  const imageUrl = (property.scraped_data.photos && property.scraped_data.photos[0] && property.scraped_data.photos[0].url) || null;
  const listingUpdateText = property.scraped_data.listingUpdateText;
  const rooms = property.scraped_data.rooms;

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
          {rooms && <p className="property-rooms">Rooms: {rooms}</p>}
          {listingUpdateText && <p className="property-update">{listingUpdateText}</p>}
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

      {/* Stage Transitions Section */}
      <div className="stage-section">
        <div className="stage-header">
          <label>Status:</label>
          <span className={`stage-badge stage-${property.stage}`}>
            {property.stage.charAt(0).toUpperCase() + property.stage.slice(1)}
          </span>
        </div>

        {/* Show scheduled date if exists */}
        {property.scheduled_visit_date && property.stage === 'scheduled' && (
          <div className="stage-info">
            Scheduled for: {new Date(property.scheduled_visit_date).toLocaleDateString()}
          </div>
        )}

        {/* Show visited date if exists */}
        {property.visited_date && property.stage === 'visited' && (
          <div className="stage-info">
            Visited on: {new Date(property.visited_date).toLocaleDateString()}
          </div>
        )}

        {/* Stage transition buttons based on current stage */}
        <div className="stage-actions">
          {property.stage === 'new' && (
            <>
              {!showScheduleDate ? (
                <button onClick={() => setShowScheduleDate(true)} className="action-button schedule">
                  Schedule Visit
                </button>
              ) : (
                <div className="date-picker-inline">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="date-input"
                  />
                  <button onClick={handleScheduleVisit} className="action-button-small confirm">
                    Confirm
                  </button>
                  <button onClick={() => setShowScheduleDate(false)} className="action-button-small cancel">
                    Cancel
                  </button>
                </div>
              )}
              <button onClick={handleArchive} className="action-button archive">
                Archive
              </button>
            </>
          )}

          {property.stage === 'scheduled' && (
            <>
              {!showVisitedDate ? (
                <button onClick={() => setShowVisitedDate(true)} className="action-button visited">
                  Mark as Visited
                </button>
              ) : (
                <div className="date-picker-inline">
                  <input
                    type="date"
                    value={visitedDate}
                    onChange={(e) => setVisitedDate(e.target.value)}
                    className="date-input"
                  />
                  <button onClick={handleMarkVisited} className="action-button-small confirm">
                    Confirm
                  </button>
                  <button onClick={() => setShowVisitedDate(false)} className="action-button-small cancel">
                    Cancel
                  </button>
                </div>
              )}
              {!showScheduleDate ? (
                <button onClick={() => setShowScheduleDate(true)} className="action-button reschedule">
                  Reschedule
                </button>
              ) : (
                <div className="date-picker-inline">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="date-input"
                  />
                  <button onClick={handleReschedule} className="action-button-small confirm">
                    Confirm
                  </button>
                  <button onClick={() => setShowScheduleDate(false)} className="action-button-small cancel">
                    Cancel
                  </button>
                </div>
              )}
              <button onClick={handleCancelVisit} className="action-button cancel-visit">
                Cancel Visit
              </button>
              <button onClick={handleArchive} className="action-button archive">
                Archive
              </button>
            </>
          )}

          {property.stage === 'visited' && (
            <button onClick={handleArchive} className="action-button archive">
              Archive
            </button>
          )}

          {property.stage === 'archived' && (
            <button onClick={handleUnarchive} className="action-button unarchive">
              Move to New
            </button>
          )}
        </div>
      </div>

      <div className="property-footer">
        <span className="date-added">
          Added: {new Date(property.created_at).toLocaleDateString()}
        </span>
        <button onClick={handleDelete} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );
}
