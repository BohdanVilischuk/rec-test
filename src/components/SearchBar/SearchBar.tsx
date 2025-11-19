import React from 'react';
import Input from '../ui/Input';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * SearchBar component - input for searching tasks
 */
const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className={styles.searchBar}>
      <Input
        type="text"
        placeholder="🔍 Search tasks... (smart search enabled)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
