import React from 'react';

function StarRating({ 
  rating, 
  setRating, 
  maxStars = 5, 
  editable = true, 
  size = '1.2em',
  color = '#FFD700', // Gold color
  inactiveColor = '#e4e5e9',
  className = ''
}) {
  const handleClick = (starIndex) => {
    if (!editable) return;
    
    // If user clicks on already selected rating, reduce by one (allows clearing)
    if (rating === starIndex + 1) {
      setRating(starIndex);
    } else {
      setRating(starIndex + 1);
    }
  };
  
  const handleKeyDown = (e, starIndex) => {
    if (!editable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(starIndex);
      e.preventDefault();
    }
  };

  return (
    <div 
      className={`star-rating ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      {[...Array(maxStars)].map((_, index) => (
        <span
          key={index}
          onClick={() => handleClick(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          role={editable ? "button" : "presentation"}
          tabIndex={editable ? 0 : -1}
          style={{
            cursor: editable ? 'pointer' : 'default',
            color: index < rating ? color : inactiveColor,
            fontSize: size,
            padding: '2px',
            userSelect: 'none'
          }}
          aria-label={editable ? `Rate ${index + 1} of ${maxStars}` : `Rated ${rating} of ${maxStars}`}
        >
          ★
        </span>
      ))}
      {editable && (
        <span className="sr-only">
          ({rating} of {maxStars})
        </span>
      )}
    </div>
  );
}

export default StarRating; 