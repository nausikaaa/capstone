import type { Property, PropertyStage } from '../types/property';
import { PropertyTile } from './PropertyTile';

interface KanbanColumnProps {
  stage: PropertyStage;
  title: string;
  color: string;
  properties: Property[];
  onUpdate: (id: string, updates: Partial<Property>) => void;
  onDelete: (id: string) => void;
  onAddNew?: () => void;
}

const stageColors: Record<PropertyStage, string> = {
  new: '#3b82f6',
  scheduled: '#9a3412',
  visited: '#6b21a8',
  archived: '#6b7280',
};

export function KanbanColumn({
  stage,
  title,
  properties,
  onUpdate,
  onDelete,
  onAddNew,
}: KanbanColumnProps) {
  const color = stageColors[stage];

  return (
    <div className="kanban-column">
      <div className="kanban-column-header" style={{ borderTopColor: color }}>
        <div className="kanban-header-content">
          <div className="status-indicator" style={{ backgroundColor: color }}></div>
          <h2 className="kanban-column-title">{title}</h2>
        </div>
        <span className="kanban-count">{properties.length}</span>
      </div>

      <div className="kanban-column-body">
        {properties.length === 0 ? (
          <div className="kanban-empty">
            <p>No properties yet</p>
          </div>
        ) : (
          properties.map((property) => (
            <PropertyTile
              key={property.id}
              property={property}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {onAddNew && stage !== 'archived' && (
        <div className="kanban-column-footer">
          <button onClick={onAddNew} className="kanban-add-button">
            + New item
          </button>
        </div>
      )}
    </div>
  );
}
