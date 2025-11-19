import { useEffect } from 'react';
import { BoardState } from '../types';
import { loadBoardState, saveBoardState } from '../utils/storage';

/**
 * Custom hook for managing localStorage persistence
 */
export const useBoardPersistence = (
  columns: BoardState['columns'],
  tasks: BoardState['tasks']
) => {
  // Load initial data
  const loadInitialData = (): BoardState => {
    return loadBoardState();
  };

  // Save data whenever it changes
  useEffect(() => {
    if (columns.length > 0 || tasks.length > 0) {
      saveBoardState({ columns, tasks });
    }
  }, [columns, tasks]);

  return { loadInitialData };
};
