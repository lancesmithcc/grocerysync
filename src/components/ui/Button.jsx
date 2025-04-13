import React from 'react';

function Button({ 
  children, 
  variant = 'primary', 
  disabled = false, 
  type = 'button',
  title,
  onClick,
  className = '',
  ...restProps
}) {
  const baseClass = `button button-${variant} ${className}`.trim();
  
  return (
    <button
      type={type}
      disabled={disabled}
      className={baseClass}
      onClick={onClick}
      title={title}
      {...restProps}
    >
      {children}
    </button>
  );
}

export default Button; 