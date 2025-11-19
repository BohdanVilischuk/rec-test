import React, { SelectHTMLAttributes } from 'react';
import styles from './Select.module.scss';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ className = '', children, ...props }) => {
  const classes = [styles.select, className].filter(Boolean).join(' ');

  return (
    <select className={classes} {...props}>
      {children}
    </select>
  );
};

export default Select;
