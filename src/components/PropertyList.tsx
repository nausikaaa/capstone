import type { Property } from '../types/property';
import { PropertyCard } from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  onUpdate: (id: string, updates: Partial<Property>) => void;
  onDelete: (id: string) => void;
}

export function PropertyList({ properties, onUpdate, onDelete }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <div className="empty-state">
        <h2>No properties yet</h2>
        <p>Start by adding a property URL from Idealista.com above.</p>
      </div>
    );
  }

  return (
    <div className="property-list">
      <h2>Your Properties ({properties.length})</h2>
      <div className="property-grid">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
