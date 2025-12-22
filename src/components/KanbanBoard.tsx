import type { Property } from '../types/property';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  properties: Property[];
  onUpdate: (id: string, updates: Partial<Property>) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function KanbanBoard({
  properties,
  onUpdate,
  onDelete,
  onAddNew,
}: KanbanBoardProps) {
  const newProperties = properties.filter((p) => p.stage === 'new');
  const scheduledProperties = properties.filter((p) => p.stage === 'scheduled');
  const visitedProperties = properties.filter((p) => p.stage === 'visited');
  const archivedProperties = properties.filter((p) => p.stage === 'archived');

  return (
    <div className="kanban-board">
      <KanbanColumn
        stage="new"
        title="New"
        color="#3b82f6"
        properties={newProperties}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onAddNew={onAddNew}
      />
      <KanbanColumn
        stage="scheduled"
        title="Scheduled"
        color="#9a3412"
        properties={scheduledProperties}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onAddNew={onAddNew}
      />
      <KanbanColumn
        stage="visited"
        title="Visited"
        color="#6b21a8"
        properties={visitedProperties}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onAddNew={onAddNew}
      />
      <KanbanColumn
        stage="archived"
        title="Archived"
        color="#6b7280"
        properties={archivedProperties}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
}
