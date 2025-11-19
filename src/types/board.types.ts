/**
 * Task interface representing a single task in the Kanban board
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  columnId: string;
  order: number;
  createdAt: number;
}

/**
 * Column interface representing a column in the Kanban board
 */
export interface Column {
  id: string;
  title: string;
  order: number;
  color: string;
}

/**
 * Filter type for task completion status
 */
export type FilterType = 'all' | 'completed' | 'incomplete';

/**
 * Board state containing all columns and tasks
 */
export interface BoardState {
  columns: Column[];
  tasks: Task[];
}
