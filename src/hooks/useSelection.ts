import { useState, useCallback } from 'react';

/**
 * Custom hook for managing task selection
 */
export const useSelection = () => {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  /**
   * Toggle task selection
   */
  const toggleTask = useCallback((taskId: string, isMultiSelect: boolean) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (isMultiSelect) {
        if (newSet.has(taskId)) {
          newSet.delete(taskId);
        } else {
          newSet.add(taskId);
        }
      } else {
        if (newSet.has(taskId) && newSet.size === 1) {
          newSet.clear();
        } else {
          newSet.clear();
          newSet.add(taskId);
        }
      }
      return newSet;
    });
  }, []);

  /**
   * Select all tasks in a column
   */
  const selectAll = useCallback((taskIds: string[]) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      const allSelected = taskIds.every(id => newSet.has(id));
      
      if (allSelected) {
        taskIds.forEach(id => newSet.delete(id));
      } else {
        taskIds.forEach(id => newSet.add(id));
      }
      
      return newSet;
    });
  }, []);

  /**
   * Clear all selections
   */
  const clearSelection = useCallback(() => {
    setSelectedTasks(new Set());
  }, []);

  /**
   * Remove specific task from selection
   */
  const removeFromSelection = useCallback((taskId: string) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
  }, []);

  return {
    selectedTasks,
    toggleTask,
    selectAll,
    clearSelection,
    removeFromSelection
  };
};
