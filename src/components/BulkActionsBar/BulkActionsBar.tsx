import React from 'react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Card from '../ui/Card';
import Text from '../ui/Text';
import styles from './BulkActionsBar.module.scss';
import { Column } from '../../types';

interface BulkActionsBarProps {
  selectedCount: number;
  columns: Column[];
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
  onMove: (columnId: string) => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

/**
 * BulkActionsBar component - actions for multiple selected tasks
 */
const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  columns,
  onMarkComplete,
  onMarkIncomplete,
  onMove,
  onDelete,
  onClearSelection,
}) => {
  if (selectedCount === 0) return null;

  return (
    <Card variant="highlighted" className={styles.bulkActionsBar}>
      <div className={styles.content}>
        <Text weight="medium" color="primary">{selectedCount} task(s) selected</Text>
        <div className={styles.actions}>
          <Button onClick={onMarkComplete} variant="secondary" size="sm">
            Mark Complete
          </Button>
          <Button onClick={onMarkIncomplete} variant="secondary" size="sm">
            Mark Incomplete
          </Button>

          {columns.length > 0 && (
            <Select
              onChange={(e) => {
                if (e.target.value) {
                  onMove(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Move to...
              </option>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </Select>
          )}

          <Button onClick={onDelete} variant="danger" size="sm">
            Delete
          </Button>
          <Button onClick={onClearSelection} variant="secondary" size="sm">
            Clear Selection
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BulkActionsBar;
