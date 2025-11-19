import { useState, useCallback } from 'react';
import { Column } from '../types';

/**
 * Custom hook for managing columns state and operations
 */
export const useColumns = (initialColumns: Column[] = []) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  /**
   * Add a new column
   */
  const addColumn = useCallback((title: string) => {
    const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
    const maxOrder = columns.length > 0 ? Math.max(...columns.map(c => c.order)) : -1;
    
    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title,
      order: maxOrder + 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    
    setColumns(prev => [...prev, newColumn]);
  }, [columns]);

  /**
   * Delete a column
   */
  const deleteColumn = useCallback((columnId: string) => {
    setColumns(prev => prev.filter(c => c.id !== columnId));
  }, []);

  /**
   * Edit column title
   */
  const editColumn = useCallback((columnId: string, newTitle: string) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId ? { ...col, title: newTitle } : col
    ));
  }, []);

  /**
   * Reorder columns
   */
  const reorderColumns = useCallback((sourceIndex: number, destinationIndex: number) => {
    setColumns(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      
      return result.map((col, index) => ({ ...col, order: index }));
    });
  }, []);

  /**
   * Update columns list directly (for drag-and-drop)
   */
  const updateColumns = useCallback((newColumns: Column[]) => {
    setColumns(newColumns);
  }, []);

  return {
    columns,
    addColumn,
    deleteColumn,
    editColumn,
    reorderColumns,
    updateColumns
  };
};
