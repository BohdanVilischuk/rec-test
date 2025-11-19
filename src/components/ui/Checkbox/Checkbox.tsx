import React, { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', ...props }) => {
  const checkboxClasses = [styles.checkbox, className].filter(Boolean).join(' ');

  const checkboxElement = <input type="checkbox" className={checkboxClasses} {...props} />;

  if (label) {
    return (
      <label className={styles.label}>
        {checkboxElement}
        <span className={styles.labelText}>{label}</span>
      </label>
    );
  }

  return checkboxElement;
};

export default Checkbox;
