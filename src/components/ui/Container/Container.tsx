import React from 'react';
import styles from './Container.module.scss';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
}

const maxWidthMap: Record<string, string> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  '2xl': 'xl2',
  '7xl': 'xl7',
  full: 'full',
};

/**
 * Container component - centered container with max width
 */
const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = '7xl',
  className = '',
  ...props
}) => {
  const classes = [styles.container, styles[maxWidthMap[maxWidth]], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Container;
