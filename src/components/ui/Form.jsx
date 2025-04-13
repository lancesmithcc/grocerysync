import React from 'react';

function Form({
  children,
  onSubmit,
  className = '',
  ...restProps
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };
  
  const baseClass = `form ${className}`.trim();
  
  return (
    <form
      className={baseClass}
      onSubmit={handleSubmit}
      {...restProps}
    >
      {children}
    </form>
  );
}

// Form layout components
Form.Group = ({ children, className = '', ...props }) => (
  <div className={`form-group ${className}`} {...props}>
    {children}
  </div>
);

Form.Row = ({ children, className = '', ...props }) => (
  <div className={`form-row ${className}`} {...props}>
    {children}
  </div>
);

Form.Label = ({ children, htmlFor, className = '', ...props }) => (
  <label className={`form-label ${className}`} htmlFor={htmlFor} {...props}>
    {children}
  </label>
);

export default Form; 