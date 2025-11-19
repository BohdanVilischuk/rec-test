import { BoardState, Column } from '../types';

const STORAGE_KEY = 'kanban-board-data';

/**
 * Default columns that cannot be deleted
 */
export const BASE_COLUMN_IDS = ['todo', 'in-progress', 'done'];

/**
 * Default columns for initial board setup
 */
const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', order: 0, color: '#3b82f6' },
  { id: 'in-progress', title: 'In Progress', order: 1, color: '#f59e0b' },
  { id: 'done', title: 'Done', order: 2, color: '#10b981' }
];

/**
 * Check if column is a base column that cannot be deleted
 */
export const isBaseColumn = (columnId: string): boolean => {
  return BASE_COLUMN_IDS.includes(columnId);
};

/**
 * Load board state from localStorage
 * @returns BoardState object with columns and tasks
 */
export const loadBoardState = (): BoardState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load board state:', error);
  }
  
  return {
    columns: DEFAULT_COLUMNS,
    tasks: []
  };
};

/**
 * Save board state to localStorage
 * @param state - BoardState to save
 */
export const saveBoardState = (state: BoardState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save board state:', error);
  }
};

/**
 * Clear all board data from localStorage
 */
export const clearBoardState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear board state:', error);
  }
};
