import React from 'react';
import styles from './Text.module.scss';

export type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextColor = 'primary' | 'secondary' | 'muted';

interface TextProps {
  as?: TextElement;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onDoubleClick?: () => void;
}

const sizeMap: Record<string, string> = {
  xs: 'xs',
  sm: 'sm',
  base: 'base',
  lg: 'lg',
  xl: 'xl',
  '2xl': 'xl2',
  '3xl': 'xl3',
  '4xl': 'xl4',
};

function Text(props: TextProps) {
  const Element = props.as || 'p';
  const color = props.color || 'primary';
  
  let className = '';
  
  if (props.size) {
    className = className + ' ' + styles[sizeMap[props.size]];
  }
  if (props.weight) {
    className = className + ' ' + styles[props.weight];
  }
  className = className + ' ' + styles[color];
  
  className = className.trim();

  return (
    <Element 
      className={className}
      style={props.style}
      onDoubleClick={props.onDoubleClick}
    >
      {props.children}
    </Element>
  );
}

export default Text;
