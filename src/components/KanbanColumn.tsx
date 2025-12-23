import type { Property, PropertyStage } from '../types/property';
import { PropertyCard } from './PropertyCard';
import { Button } from './ui/button';

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
    <div className="flex flex-col w-80 min-h-[500px] rounded-xl border border-border/50 bg-secondary/30">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          <h2 className="font-bold text-sm tracking-tight uppercase text-muted-foreground">
            {title}
          </h2>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
        </Button>
      </div>
      <div className="kanban-column-body">
        {properties.length === 0 ? (
          <div className="kanban-empty">
            <p>No properties yet</p>
          </div>
        ) : (
          properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}


