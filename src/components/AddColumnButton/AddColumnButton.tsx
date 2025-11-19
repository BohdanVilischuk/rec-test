import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import styles from './AddColumnButton.module.scss';

interface AddColumnButtonProps {
  onAdd: (title: string) => void;
}

/**
 * AddColumnButton component - button and form for adding new columns
 */
const AddColumnButton: React.FC<AddColumnButtonProps> = ({ onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    const trimmed = title.trim();
    if (trimmed) {
      onAdd(trimmed);
      setTitle('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'Escape') {
      setTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.addColumnButton}>
      {isAdding ? (
        <div className={styles.form}>
          <div className={styles.inputs}>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Column title..."
              autoFocus
            />
          </div>
          <div className={styles.buttons}>
            <Button onClick={handleAdd} variant="primary" size="sm" style={{ flex: 1 }}>
              Add
            </Button>
            <Button
              onClick={() => {
                setTitle('');
                setIsAdding(false);
              }}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className={styles.addButton}
        >
          Add Column
        </button>
      )}
    </div>
  );
};

export default AddColumnButton;
