import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Property } from '../types/property';
import { apiClient } from '../services/api';
import { supabase } from '../lib/supabase';

interface PropertyTileProps {
  property: Property;
  onUpdate: (id: string, updates: Partial<Property>) => void;
  onDelete: (id: string) => void;
}

export function PropertyTile({ property, onUpdate, onDelete }: PropertyTileProps) {
  const [showActions, setShowActions] = useState(false);
  const [showScheduleDate, setShowScheduleDate] = useState(false);
  const [showVisitedDate, setShowVisitedDate] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [visitedDate, setVisitedDate] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Extract property data
  const title = property.scraped_data.title || property.scraped_data.name || 'Untitled Property';
  const price = property.scraped_data.price || property.scraped_data.priceValue || 'Price N/A';
  const imageUrl = (property.scraped_data.photos && property.scraped_data.photos[0] && property.scraped_data.photos[0].url) || null;

  // Truncate URL for display
  const displayUrl = property.url.replace(/^https?:\/\//, '').substring(0, 30) + '...';

  const handleScheduleVisit = () => {
    if (scheduledDate) {
      onUpdate(property.id, {
        stage: 'scheduled',
        scheduled_visit_date: new Date(scheduledDate).toISOString(),
      });
      setShowScheduleDate(false);
      setScheduledDate('');
      setShowActions(false);
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
      setShowActions(false);
    }
  };

  const handleArchive = () => {
    onUpdate(property.id, { stage: 'archived' });
    setShowActions(false);
  };

  const handleUnarchive = () => {
    onUpdate(property.id, { stage: 'new' });
    setShowActions(false);
  };

  const handleCancelVisit = () => {
    onUpdate(property.id, {
      stage: 'new',
      scheduled_visit_date: null,
    });
    setShowActions(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this property?')) {
      onDelete(property.id);
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

  return (
    <div className="property-tile" onClick={() => !showAnalysis && setShowActions(!showActions)}>
      <div className="tile-header">
        <span className="tile-icon">🏠</span>
        <h3 className="tile-title">{title}</h3>
      </div>

      <div className="tile-price">{price}</div>

      {imageUrl && (
        <div className="tile-image-container">
          <img src={imageUrl} alt={title} className="tile-image" />
        </div>
      )}

      {/* Show visited date for visited properties */}
      {property.stage === 'visited' && property.visited_date && (
        <div className="tile-date">
          {new Date(property.visited_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      )}

      {/* Show scheduled date for scheduled properties */}
      {property.stage === 'scheduled' && property.scheduled_visit_date && (
        <div className="tile-date scheduled">
          Scheduled: {new Date(property.scheduled_visit_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )}

      <a
        href={property.url}
        target="_blank"
        rel="noopener noreferrer"
        className="tile-link"
        onClick={(e) => e.stopPropagation()}
      >
        {displayUrl}
      </a>

      {/* Expandable actions */}
      {showActions && (
        <div className="tile-actions" onClick={(e) => e.stopPropagation()}>
          {/* Window Analysis Button - available for all non-archived properties */}
          {property.stage !== 'archived' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAnalyzeWindows();
              }}
              disabled={isAnalyzing}
              className="tile-action-btn analysis"
            >
              {isAnalyzing ? '🔄 Analyzing...' : '🪟 Analyze Windows'}
            </button>
          )}

          {property.stage === 'new' && (
            <>
              {!showScheduleDate ? (
                <button onClick={() => setShowScheduleDate(true)} className="tile-action-btn">
                  📅 Schedule
                </button>
              ) : (
                <div className="tile-date-picker">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="tile-date-input"
                  />
                  <button onClick={handleScheduleVisit} className="tile-action-btn confirm">✓</button>
                  <button onClick={() => setShowScheduleDate(false)} className="tile-action-btn cancel">✕</button>
                </div>
              )}
              <button onClick={handleArchive} className="tile-action-btn">🗄️ Archive</button>
            </>
          )}

          {property.stage === 'scheduled' && (
            <>
              {!showVisitedDate ? (
                <button onClick={() => setShowVisitedDate(true)} className="tile-action-btn">
                  ✓ Mark Visited
                </button>
              ) : (
                <div className="tile-date-picker">
                  <input
                    type="date"
                    value={visitedDate}
                    onChange={(e) => setVisitedDate(e.target.value)}
                    className="tile-date-input"
                  />
                  <button onClick={handleMarkVisited} className="tile-action-btn confirm">✓</button>
                  <button onClick={() => setShowVisitedDate(false)} className="tile-action-btn cancel">✕</button>
                </div>
              )}
              <button onClick={handleCancelVisit} className="tile-action-btn">✕ Cancel</button>
              <button onClick={handleArchive} className="tile-action-btn">🗄️ Archive</button>
            </>
          )}

          {property.stage === 'visited' && (
            <button onClick={handleArchive} className="tile-action-btn">🗄️ Archive</button>
          )}

          {property.stage === 'archived' && (
            <button onClick={handleUnarchive} className="tile-action-btn">↩️ Restore</button>
          )}

          <button onClick={handleDelete} className="tile-action-btn delete">🗑️ Delete</button>
        </div>
      )}

      {/* Analysis Results Modal - rendered via portal to avoid flickering */}
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
    </div>
  );
}
