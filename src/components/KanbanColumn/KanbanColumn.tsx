import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import IconButton from '../ui/IconButton';
import ConfirmModal from '../ui/ConfirmModal';
import styles from './KanbanColumn.module.scss';
import { Column, Task } from '../../types';
import TaskCard from '../TaskCard';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { isBaseColumn } from '../../utils/storage';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  selectedTasks: Set<string>;
  searchQuery: string;
  onAddTask: (columnId: string, title: string) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, newTitle: string) => void;
  onSelectTask: (taskId: string, isMultiSelect: boolean) => void;
  onSelectAll: (taskIds: string[]) => void;
  onDeleteColumn: (columnId: string) => void;
  onEditColumn: (columnId: string, newTitle: string) => void;
  onDropTask: (taskId: string, targetColumnId: string, targetIndex: number) => void;
  onDropOnTask: (draggedTaskId: string, targetTaskId: string) => void;
}

/**
 * KanbanColumn component - represents a droppable column containing tasks
 */
const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  selectedTasks,
  searchQuery,
  onAddTask,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  onSelectTask,
  onSelectAll,
  onDeleteColumn,
  onEditColumn,
  onDropTask,
  onDropOnTask,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(column.title);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const isBase = isBaseColumn(column.id);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Setup column as draggable
  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({
          type: 'column',
          columnId: column.id,
        }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      })
    );
  }, [column.id]);

  // Setup column as drop target for tasks
  useEffect(() => {
    const element = columnRef.current;
    if (!element) return;

    return combine(
      dropTargetForElements({
        element,
        getData: () => ({ columnId: column.id }),
        canDrop: ({ source }) => {
          const data = source.data as { type: string };
          return data.type === 'task';
        },
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: ({ source }) => {
          setIsDraggedOver(false);
          const data = source.data as { taskId: string; columnId: string };
          if (data.taskId) {
            onDropTask(data.taskId, column.id, tasks.length);
          }
        },
      })
    );
  }, [column.id, tasks.length, onDropTask]);

  useEffect(() => {
    if (isAddingTask && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingTask]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleAddTask = () => {
    const trimmed = newTaskTitle.trim();
    if (trimmed) {
      onAddTask(column.id, trimmed);
      setNewTaskTitle('');
    }
    setIsAddingTask(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setNewTaskTitle('');
      setIsAddingTask(false);
    }
  };

  const handleSaveTitleEdit = () => {
    const trimmed = editTitleValue.trim();
    if (trimmed && trimmed !== column.title) {
      onEditColumn(column.id, trimmed);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitleEdit();
    }
    if (e.key === 'Escape') {
      setEditTitleValue(column.title);
      setIsEditingTitle(false);
    }
  };

  const handleDeleteClick = () => {
    if (isBase) {
      alert('Cannot delete base columns (To Do, In Progress, Done)');
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDeleteColumn(column.id);
  };

  const columnTaskCount = tasks.length;
  const selectedInColumn = tasks.filter((t) => selectedTasks.has(t.id)).length;

  let columnClasses = styles.column;
  if (isDraggedOver) columnClasses += ` ${styles.draggedOver}`;
  if (isDragging) columnClasses += ` ${styles.dragging}`;

  return (
    <div ref={columnRef} className={columnClasses}>
      {/* Column header */}
      <div ref={headerRef} className={styles.header}>
        <div className={styles.titleRow}>
          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              type="text"
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onBlur={handleSaveTitleEdit}
              onKeyDown={handleTitleKeyDown}
              style={{ flex: 1, fontWeight: 600 }}
            />
          ) : (
            <h3 className={styles.title} onDoubleClick={() => setIsEditingTitle(true)}>
              <span className={styles.colorDot} style={{ backgroundColor: column.color }}></span>
              {column.title}
              <span className={styles.count}>({columnTaskCount})</span>
            </h3>
          )}

          <div className={styles.headerActions}>
            <IconButton
              icon="Select All"
              ariaLabel="Select all tasks"
              onClick={() => onSelectAll(tasks.map((t) => t.id))}
            />
            {!isBase && (
              <IconButton
                icon="×"
                ariaLabel="Delete column"
                variant="danger"
                onClick={handleDeleteClick}
              />
            )}
          </div>
        </div>

        {selectedInColumn > 0 && (
          <div className={styles.selectedInfo}>{selectedInColumn} selected</div>
        )}
      </div>

      {/* Tasks list */}
      <div className={styles.tasksList}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isSelected={selectedTasks.has(task.id)}
            searchQuery={searchQuery}
            onToggleComplete={onToggleComplete}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
            onSelect={onSelectTask}
            onDropOnTask={onDropOnTask}
          />
        ))}
      </div>

      {/* Add task section */}
      <div className={styles.addTaskSection}>
        {isAddingTask ? (
          <div className={styles.addTaskForm}>
            <Input
              ref={inputRef}
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter task title..."
            />
            <div className={styles.formButtons}>
              <Button onClick={handleAddTask} variant="primary" size="sm" style={{ flex: 1 }}>
                Add
              </Button>
              <Button
                onClick={() => {
                  setNewTaskTitle('');
                  setIsAddingTask(false);
                }}
                variant="secondary"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAddingTask(true)}
            variant="ghost"
            style={{ width: '100%' }}
          >
            Add task
          </Button>
        )}
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Column"
        message={`Are you sure you want to delete column "${column.title}"? This will also delete all tasks in this column.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default KanbanColumn;
