import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Property } from '../types/property';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { apiClient } from '../services/api';
import { supabase } from '../lib/supabase';

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

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

  const handleAnalyzeWindows = async () => {
    try {
      setIsAnalyzing(true);

      // Extract up to 5 photo URLs from scraped data
      const photos = property.scraped_data.photos || [];
      const imageUrls = photos
        .slice(0, 5)
        .map((photo: any) => photo.url)
        .filter((url: string) => url);

      if (imageUrls.length === 0) {
        alert('No photos available for analysis');
        return;
      }

      // Get location from scraped data if available
      const location = property.scraped_data.address || property.scraped_data.location || 'Barcelona, Spain';

      // Call analysis API
      const analysis = await apiClient.analyzeWindows(imageUrls, location);

      // Store in ai_analysis table
      const { error } = await supabase.from('ai_analysis').insert({
        property_id: property.id,
        analysis_type: 'window_analysis',
        input_data: {
          imageUrls,
          location,
          photoCount: imageUrls.length,
        },
        analysis_result: analysis,
      });

      if (error) {
        console.error('Error storing analysis:', error);
        alert('Analysis complete but failed to save to database');
      }

      setAnalysisResult(analysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Analysis error:', error);
      alert(error instanceof Error ? error.message : 'Failed to analyze windows');
    } finally {
      setIsAnalyzing(false);
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
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="property-image w-full h-48 object-cover rounded-t-lg" />
        )}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-lg font-bold text-primary mb-1">{price}</p>
          {address && <p className="text-sm text-muted-foreground mb-1">{address}</p>}
          {rooms && <p className="text-sm text-muted-foreground">Rooms: {rooms}</p>}
          {listingUpdateText && <p className="text-xs text-muted-foreground mt-1">{listingUpdateText}</p>}
          <a
            href={property.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-block mt-2"
          >
            View on Idealista →
          </a>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rating Section */}
        <div className="rating-section">
          <label className="text-sm font-medium mb-2 block">Your Rating:</label>
          <div className="flex items-center gap-2">
            <div className="star-rating flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl transition-colors ${rating && rating >= star ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400`}
                  onClick={() => handleRatingChange(star)}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
            </div>
            {(rating !== null && rating > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRatingChange(0)}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="notes-section">
          <label className="text-sm font-medium mb-2 block">Your Notes:</label>
          {isEditingNotes ? (
            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
                placeholder="Add your thoughts about this property..."
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveNotes} size="sm">
                  Save
                </Button>
                <Button onClick={handleCancelNotes} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md min-h-[60px]">
                {notes || <em>No notes yet. Click Edit to add some.</em>}
              </p>
              <Button onClick={() => setIsEditingNotes(true)} variant="outline" size="sm">
                Edit Notes
              </Button>
            </div>
          )}
        </div>

        {/* Stage Transitions Section */}
        <div className="stage-section">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">Status:</label>
            <span className={`px-3 py-1 rounded-full text-xs font-medium stage-badge stage-${property.stage}`}>
              {property.stage.charAt(0).toUpperCase() + property.stage.slice(1)}
            </span>
          </div>

          {/* Show scheduled date if exists */}
          {property.scheduled_visit_date && property.stage === 'scheduled' && (
            <div className="text-sm text-muted-foreground mb-3">
              Scheduled for: {new Date(property.scheduled_visit_date).toLocaleDateString()}
            </div>
          )}

          {/* Show visited date if exists */}
          {property.visited_date && property.stage === 'visited' && (
            <div className="text-sm text-muted-foreground mb-3">
              Visited on: {new Date(property.visited_date).toLocaleDateString()}
            </div>
          )}

          {/* Window Analysis Button - available for all non-archived properties */}
          {property.stage !== 'archived' && (
            <div className="mb-3">
              <Button
                onClick={handleAnalyzeWindows}
                disabled={isAnalyzing}
                variant="default"
                size="sm"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                {isAnalyzing ? '🔄 Analyzing...' : '🪟 Analyze Windows'}
              </Button>
            </div>
          )}

          {/* Stage transition buttons based on current stage */}
          <div className="flex flex-wrap gap-2">
            {property.stage === 'new' && (
              <>
                {!showScheduleDate ? (
                  <Button onClick={() => setShowScheduleDate(true)} variant="outline" size="sm">
                    Schedule Visit
                  </Button>
                ) : (
                  <div className="flex gap-2 w-full">
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                    />
                    <Button onClick={handleScheduleVisit} size="sm">
                      Confirm
                    </Button>
                    <Button onClick={() => setShowScheduleDate(false)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                )}
                <Button onClick={handleArchive} variant="secondary" size="sm">
                  Archive
                </Button>
              </>
            )}

            {property.stage === 'scheduled' && (
              <>
                {!showVisitedDate ? (
                  <Button onClick={() => setShowVisitedDate(true)} variant="default" size="sm">
                    Mark as Visited
                  </Button>
                ) : (
                  <div className="flex gap-2 w-full">
                    <input
                      type="date"
                      value={visitedDate}
                      onChange={(e) => setVisitedDate(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                    />
                    <Button onClick={handleMarkVisited} size="sm">
                      Confirm
                    </Button>
                    <Button onClick={() => setShowVisitedDate(false)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                )}
                {!showScheduleDate ? (
                  <Button onClick={() => setShowScheduleDate(true)} variant="outline" size="sm">
                    Reschedule
                  </Button>
                ) : (
                  <div className="flex gap-2 w-full">
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                    />
                    <Button onClick={handleReschedule} size="sm">
                      Confirm
                    </Button>
                    <Button onClick={() => setShowScheduleDate(false)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                )}
                <Button onClick={handleCancelVisit} variant="outline" size="sm">
                  Cancel Visit
                </Button>
                <Button onClick={handleArchive} variant="secondary" size="sm">
                  Archive
                </Button>
              </>
            )}

            {property.stage === 'visited' && (
              <Button onClick={handleArchive} variant="secondary" size="sm">
                Archive
              </Button>
            )}

            {property.stage === 'archived' && (
              <Button onClick={handleUnarchive} variant="outline" size="sm">
                Move to New
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Added: {new Date(property.created_at).toLocaleDateString()}
        </span>
        <Button onClick={handleDelete} variant="destructive" size="sm">
          Delete
        </Button>
      </CardFooter>

      {/* Analysis Results Modal - rendered via portal */}
      {showAnalysis && analysisResult && createPortal(
        <div
          className="analysis-overlay"
          onClick={() => setShowAnalysis(false)}
        >
          <div
            className="analysis-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="analysis-header">
              <h3>🪟 Window Analysis Results</h3>
              <button onClick={() => setShowAnalysis(false)} className="close-btn">✕</button>
            </div>

            <div className="analysis-content">
              {/* Bioclimatic Score */}
              <div className="analysis-section">
                <h4>Bioclimatic Score: {analysisResult.bioclimatic_score?.score}/10</h4>
                <div className="score-details">
                  <div className="strengths">
                    <strong>Strengths:</strong>
                    <ul>
                      {analysisResult.bioclimatic_score?.strengths.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="weaknesses">
                    <strong>Weaknesses:</strong>
                    <ul>
                      {analysisResult.bioclimatic_score?.weaknesses.map((w: string, i: number) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Window Characteristics */}
              <div className="analysis-section">
                <h4>Window Characteristics</h4>
                <div className="characteristics-grid">
                  <div><strong>Frame:</strong> {analysisResult.windows?.frame_material}</div>
                  <div><strong>Glazing:</strong> {analysisResult.windows?.glazing_type}</div>
                  <div><strong>Size:</strong> {analysisResult.windows?.size}</div>
                  <div><strong>Condition:</strong> {analysisResult.windows?.condition}</div>
                </div>
              </div>

              {/* Recommendations */}
              {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                <div className="analysis-section">
                  <h4>Recommendations</h4>
                  {analysisResult.recommendations.map((rec: any, i: number) => (
                    <div key={i} className={`recommendation ${rec.priority}`}>
                      <div className="rec-header">
                        <span className="rec-action">{rec.action}</span>
                        <span className={`rec-priority ${rec.priority}`}>{rec.priority}</span>
                      </div>
                      <div className="rec-details">
                        <span>Cost: {rec.estimated_cost}</span>
                        <span>Savings: {rec.annual_savings}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </Card>
  );
}
