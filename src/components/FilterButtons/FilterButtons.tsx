import React from 'react';
import Button from '../ui/Button';
import styles from './FilterButtons.module.scss';
import { FilterType } from '../../types';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalTasks: number;
  completedTasks: number;
}

/**
 * FilterButtons component - buttons for filtering tasks by status
 */
const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentFilter,
  onFilterChange,
  totalTasks,
  completedTasks,
}) => {
  const activeTasks = totalTasks - completedTasks;

  return (
    <div className={styles.filterButtons}>
      <Button
        onClick={() => onFilterChange('all')}
        variant={currentFilter === 'all' ? 'primary' : 'secondary'}
      >
        All ({totalTasks})
      </Button>
      <Button
        onClick={() => onFilterChange('incomplete')}
        variant={currentFilter === 'incomplete' ? 'primary' : 'secondary'}
      >
        Active ({activeTasks})
      </Button>
      <Button
        onClick={() => onFilterChange('completed')}
        variant={currentFilter === 'completed' ? 'primary' : 'secondary'}
      >
        Done ({completedTasks})
      </Button>
    </div>
  );
};

export default FilterButtons;
