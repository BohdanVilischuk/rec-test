import { useState, useEffect, useCallback } from 'react';
import { FilterType } from './types';
import { useTasks, useColumns, useSelection, useBoardPersistence } from './hooks';
import { smartSearch } from './utils/search';
import { Text, Card, Container } from './components/ui';
import KanbanColumn from './components/KanbanColumn';
import SearchBar from './components/SearchBar';
import FilterButtons from './components/FilterButtons';
import BulkActionsBar from './components/BulkActionsBar';
import AddColumnButton from './components/AddColumnButton';
import styles from './App.module.scss';

/**
 * Main App component - Kanban Board with drag-and-drop functionality
 */
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Custom hooks for state management
  const {
    tasks,
    addTask,
    deleteTask,
    editTask,
    updateTasks,
  } = useTasks([]);

  const { columns, addColumn, deleteColumn, editColumn, updateColumns } = useColumns([]);

  const { selectedTasks, toggleTask, selectAll, clearSelection, removeFromSelection } = useSelection();

  // Load initial data and setup persistence
  const { loadInitialData } = useBoardPersistence(columns, tasks);

  const handleToggleComplete = useCallback(
    (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newCompleted = !task.completed;
      let newColumnId = task.columnId;

      if (newCompleted) {
        const doneColumn = columns.find(c => c.title.toLowerCase() === 'done');
        if (doneColumn) {
          newColumnId = doneColumn.id;
        }
      } else {
        const todoColumn = columns.find(c => c.title.toLowerCase() === 'to do');
        if (todoColumn) {
          newColumnId = todoColumn.id;
        }
      }

      const targetColumnTasks = tasks.filter(t => t.columnId === newColumnId && t.id !== taskId);
      const maxOrder = targetColumnTasks.length > 0
        ? Math.max(...targetColumnTasks.map(t => t.order))
        : -1;

      const updatedTasks = tasks.map(t => {
        if (t.id === taskId) {
          return { ...t, completed: newCompleted, columnId: newColumnId, order: maxOrder + 1 };
        }
        return t;
      });

      updateTasks(updatedTasks);
    },
    [tasks, columns, updateTasks]
  );

  // Initialize board data
  useEffect(() => {
    const initialData = loadInitialData();
    updateTasks(initialData.tasks);
    updateColumns(initialData.columns);
  }, []);

  const handleDropOnTask = useCallback(
    (draggedTaskId: string, targetTaskId: string) => {
      const draggedTask = tasks.find(t => t.id === draggedTaskId);
      const targetTask = tasks.find(t => t.id === targetTaskId);
      
      if (!draggedTask || !targetTask) return;
      if (draggedTask.columnId !== targetTask.columnId) return;

      const tasksToMove = selectedTasks.has(draggedTaskId)
        ? tasks.filter(t => selectedTasks.has(t.id) && t.columnId === draggedTask.columnId)
        : [draggedTask];

      const movedTaskIds = new Set(tasksToMove.map(t => t.id));
      const columnTasks = tasks
        .filter(t => t.columnId === draggedTask.columnId && !movedTaskIds.has(t.id))
        .sort((a, b) => a.order - b.order);

      const targetIndex = columnTasks.findIndex(t => t.id === targetTaskId);
      const newOrder = targetIndex >= 0 ? columnTasks[targetIndex].order : 0;

      const updatedTasks = tasks.map(t => {
        if (movedTaskIds.has(t.id)) {
          const taskIndex = tasksToMove.findIndex(mt => mt.id === t.id);
          return { ...t, order: newOrder + taskIndex };
        }
        if (t.columnId === draggedTask.columnId && t.order >= newOrder) {
          return { ...t, order: t.order + tasksToMove.length };
        }
        return t;
      });

      updateTasks(updatedTasks.sort((a, b) => a.order - b.order));
      
      if (selectedTasks.size > 0) {
        clearSelection();
      }
    },
    [tasks, selectedTasks, updateTasks, clearSelection]
  );

  const handleDropTask = useCallback(
    (taskId: string, targetColumnId: string, targetIndex: number) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const targetColumn = columns.find((c) => c.id === targetColumnId);
      const sourceColumn = columns.find((c) => c.id === task.columnId);
      const movingToDone = targetColumn?.title.toLowerCase() === 'done';
      const movingFromDone = sourceColumn?.title.toLowerCase() === 'done';

      // If task is selected, move all selected tasks together
      const tasksToMove = selectedTasks.has(taskId)
        ? tasks.filter(t => selectedTasks.has(t.id))
        : [task];

      const movedTaskIds = new Set(tasksToMove.map(t => t.id));
      const targetColumnTasks = tasks.filter((t) => t.columnId === targetColumnId && !movedTaskIds.has(t.id));
      
      const updatedTasks = tasks.map((t) => {
        if (movedTaskIds.has(t.id)) {
          const taskIndex = tasksToMove.findIndex(mt => mt.id === t.id);
          return { 
            ...t, 
            columnId: targetColumnId, 
            order: targetIndex + taskIndex,
            completed: movingToDone ? true : movingFromDone ? false : t.completed
          };
        }
        if (t.columnId === targetColumnId) {
          const currentIndex = targetColumnTasks.findIndex((ct) => ct.id === t.id);
          if (currentIndex >= targetIndex) {
            return { ...t, order: t.order + tasksToMove.length };
          }
        }
        return t;
      });

      updateTasks(updatedTasks.sort((a, b) => a.order - b.order));
      
      if (selectedTasks.size > 0) {
        clearSelection();
      }
    },
    [tasks, columns, selectedTasks, updateTasks, clearSelection]
  );

  /**
   * Handle delete with selection cleanup
   */
  const handleDeleteTask = useCallback(
    (taskId: string) => {
      deleteTask(taskId);
      removeFromSelection(taskId);
    },
    [deleteTask, removeFromSelection]
  );

  /**
   * Handle column deletion with tasks
   */
  const handleDeleteColumn = useCallback(
    (columnId: string) => {
      deleteColumn(columnId);
      // Remove tasks from deleted column
      updateTasks(tasks.filter((t) => t.columnId !== columnId));
    },
    [tasks, deleteColumn, updateTasks]
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedTasks.size === 0) return;
    
    const confirmed = confirm(`Delete ${selectedTasks.size} selected task(s)?`);
    if (!confirmed) return;

    updateTasks(tasks.filter((task) => !selectedTasks.has(task.id)));
    clearSelection();
  }, [selectedTasks, tasks, updateTasks, clearSelection]);

  const handleMarkSelected = useCallback(
    (completed: boolean) => {
      if (selectedTasks.size === 0) return;

      let targetColumnId: string | undefined;

      if (completed) {
        const doneColumn = columns.find(c => c.title.toLowerCase() === 'done');
        targetColumnId = doneColumn?.id;
      } else {
        const todoColumn = columns.find(c => c.title.toLowerCase() === 'to do');
        targetColumnId = todoColumn?.id;
      }

      if (!targetColumnId) return;

      const targetColumnTasks = tasks.filter(t => t.columnId === targetColumnId);
      const maxOrder = targetColumnTasks.length > 0
        ? Math.max(...targetColumnTasks.map(t => t.order))
        : -1;

      let orderCounter = maxOrder + 1;
      const updatedTasks = tasks.map((task) => {
        if (selectedTasks.has(task.id)) {
          return { ...task, completed, columnId: targetColumnId!, order: orderCounter++ };
        }
        return task;
      });

      updateTasks(updatedTasks);
      clearSelection();
    },
    [selectedTasks, tasks, columns, updateTasks, clearSelection]
  );

  const handleMoveSelected = useCallback(
    (targetColumnId: string) => {
      if (selectedTasks.size === 0) return;

      const targetColumnTasks = tasks.filter((t) => t.columnId === targetColumnId);
      const maxOrder = targetColumnTasks.length > 0 
        ? Math.max(...targetColumnTasks.map((t) => t.order)) 
        : -1;

      const updatedTasks = tasks.map((task, index) => {
        if (selectedTasks.has(task.id)) {
          return { ...task, columnId: targetColumnId, order: maxOrder + 1 + index };
        }
        return task;
      });
      
      updateTasks(updatedTasks);
      clearSelection();
    },
    [selectedTasks, tasks, updateTasks, clearSelection]
  );

  const getFilteredTasks = useCallback(
    (columnId: string) => {
      const columnTasks = tasks.filter((task) => task.columnId === columnId);
      
      const filtered = columnTasks.filter((task) => {
        if (filter === 'completed' && !task.completed) return false;
        if (filter === 'incomplete' && task.completed) return false;
        if (searchQuery && !smartSearch(task.title, searchQuery)) return false;
        
        return true;
      });
      
      return filtered.sort((a, b) => a.order - b.order);
    },
    [tasks, filter, searchQuery]
  );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <Container>
          <Text as="h1" size="4xl" weight="bold" style={{ marginBottom: '0.5rem' }}>
            Kanban Board
          </Text>
        </Container>
      </header>

      {/* Toolbar */}
      <Container>
        <div className={styles.toolbar}>
          {/* Search and filters */}
          <Card className={styles.searchFilterCard}>
            <div className={styles.searchFilterContent}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <FilterButtons
                currentFilter={filter}
                onFilterChange={setFilter}
                totalTasks={totalTasks}
                completedTasks={completedTasks}
              />
            </div>
          </Card>

          {/* Bulk actions */}
          <BulkActionsBar
            selectedCount={selectedTasks.size}
            columns={columns}
            onMarkComplete={() => handleMarkSelected(true)}
            onMarkIncomplete={() => handleMarkSelected(false)}
            onMove={handleMoveSelected}
            onDelete={handleDeleteSelected}
            onClearSelection={clearSelection}
          />
        </div>
      </Container>

      {/* Kanban Board */}
      <Container>
        <div className={styles.board}>
          <div className={styles.columnsContainer}>
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={getFilteredTasks(column.id)}
                selectedTasks={selectedTasks}
                searchQuery={searchQuery}
                onAddTask={addTask}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                onEditTask={editTask}
                onSelectTask={toggleTask}
                onSelectAll={selectAll}
                onDeleteColumn={handleDeleteColumn}
                onEditColumn={editColumn}
                onDropTask={handleDropTask}
                onDropOnTask={handleDropOnTask}
              />
            ))}

            {/* Add column button */}
            <AddColumnButton onAdd={addColumn} />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
