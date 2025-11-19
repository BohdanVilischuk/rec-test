import React, { useState, useRef, useEffect } from 'react';
import Checkbox from '../ui/Checkbox';
import Input from '../ui/Input';
import IconButton from '../ui/IconButton';
import ConfirmModal from '../ui/ConfirmModal';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import styles from './TaskCard.module.scss';
import { Task } from '../../types';
import { highlightText } from '../../utils/search';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  searchQuery: string;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newTitle: string) => void;
  onSelect: (taskId: string, isMultiSelect: boolean) => void;
  onDropOnTask: (draggedTaskId: string, targetTaskId: string) => void;
}

/**
 * TaskCard component - represents a single draggable task
 */
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isSelected,
  searchQuery,
  onToggleComplete,
  onDelete,
  onEdit,
  onSelect,
  onDropOnTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Setup drag and drop
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({
          type: 'task',
          taskId: task.id,
          columnId: task.columnId,
        }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        getData: () => ({ taskId: task.id }),
        canDrop: ({ source }) => {
          const data = source.data as { type: string; taskId: string };
          return data.type === 'task' && data.taskId !== task.id;
        },
        onDrop: ({ source }) => {
          const data = source.data as { taskId: string };
          if (data.taskId) {
            onDropOnTask(data.taskId, task.id);
          }
        },
      })
    );
  }, [task.id, task.columnId, onDropOnTask]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleOpenEditModal = () => {
    setEditValue(task.title);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      onEdit(task.id, trimmed);
    }
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    setEditValue(task.title);
    setShowEditModal(false);
  };

  const handleInlineKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const trimmed = editValue.trim();
      if (trimmed && trimmed !== task.title) {
        onEdit(task.id, trimmed);
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setEditValue(task.title);
      setIsEditing(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) return;
    onSelect(task.id, e.ctrlKey || e.metaKey || e.shiftKey);
  };

  const highlightedParts = highlightText(task.title, searchQuery);

  let cardClasses = styles.taskCard;
  if (task.completed) cardClasses += ` ${styles.completed}`;
  if (isSelected) cardClasses += ` ${styles.selected}`;
  if (isDragging) cardClasses += ` ${styles.dragging}`;

  return (
    <div ref={cardRef} className={cardClasses} onClick={handleClick}>
      <div className={styles.content}>
        {/* Checkbox */}
        <Checkbox
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="mt-1"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Task content */}
        <div className={styles.taskContent}>
          {isEditing ? (
            <Input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={handleInlineKeyDown}
              onClick={(e) => e.stopPropagation()}
              fullWidth
            />
          ) : (
            <p
              className={`${styles.taskText} ${
                task.completed ? styles.completedText : styles.normalText
              }`}
            >
              {highlightedParts.map((part, index) =>
                part.highlight ? (
                  <span key={index} className={styles.highlight}>
                    {part.text}
                  </span>
                ) : (
                  <span key={index}>{part.text}</span>
                )
              )}
            </p>
          )}
        </div>

        {/* Action buttons */}
        {!isEditing && (
          <div className={styles.actions}>
            <IconButton
              icon="Edit"
              ariaLabel="Edit task"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            />
            <IconButton
              icon="Delete"
              ariaLabel="Delete task"
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
            />
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Edit modal */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCancelEdit}
        title="Edit Task"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </>
        }
      >
        <Input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder="Task title"
          fullWidth
          autoFocus
        />
      </Modal>
    </div>
  );
};

export default TaskCard;
