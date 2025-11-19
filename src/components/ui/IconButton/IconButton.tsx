import React from 'react';
import styles from './IconButton.module.scss';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  ariaLabel?: string;
  variant?: 'default' | 'danger' | 'primary';
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  ariaLabel,
  variant = 'default',
  className = '',
  ...props
}) => {
  const classes = [styles.iconButton, styles[variant], className].filter(Boolean).join(' ');

  return (
    <button className={classes} aria-label={ariaLabel} title={ariaLabel} {...props}>
      {icon}
    </button>
  );
};

export default IconButton;
