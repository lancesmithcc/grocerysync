import React from 'react';

function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  ...restProps
}) {
  const baseClass = `input ${className}`.trim();
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={baseClass}
      {...restProps}
    />
  );
}

export default Input; 