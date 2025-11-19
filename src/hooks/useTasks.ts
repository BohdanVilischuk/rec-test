import { useState, useCallback } from 'react';
import { Task } from '../types';

/**
 * Custom hook for managing tasks state and operations
 */
export const useTasks = (initialTasks: Task[] = []) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  /**
   * Add a new task to a column
   */
  const addTask = useCallback((columnId: string, title: string) => {
    const columnTasks = tasks.filter(t => t.columnId === columnId);
    const maxOrder = columnTasks.length > 0 ? Math.max(...columnTasks.map(t => t.order)) : -1;
    
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random()}`,
      title,
      completed: false,
      columnId,
      order: maxOrder + 1,
      createdAt: Date.now()
    };
    
    setTasks(prev => [...prev, newTask]);
  }, [tasks]);

  /**
   * Toggle task completion status
   */
  const toggleComplete = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  /**
   * Delete a task
   */
  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  /**
   * Edit task title
   */
  const editTask = useCallback((taskId: string, newTitle: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, title: newTitle } : task
    ));
  }, []);

  /**
   * Move task to a different column
   */
  const moveTask = useCallback((taskId: string, targetColumnId: string, targetOrder: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, columnId: targetColumnId, order: targetOrder };
      }
      return task;
    }));
  }, []);

  /**
   * Reorder task within the same column
   */
  const reorderTask = useCallback((taskId: string, newOrder: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, order: newOrder };
      }
      return task;
    }));
  }, []);

  /**
   * Update tasks list directly (for drag-and-drop)
   */
  const updateTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, []);

  return {
    tasks,
    addTask,
    toggleComplete,
    deleteTask,
    editTask,
    moveTask,
    reorderTask,
    updateTasks
  };
};
