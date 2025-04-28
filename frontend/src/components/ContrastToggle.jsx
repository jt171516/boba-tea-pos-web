
import React, { useEffect, useState } from 'react';

export default function ContrastToggle() 
{
  const [highContrast, setHighContrast] = useState(() =>
    localStorage.getItem('highContrast') === 'true'
  );

  useEffect(() => 
    {
    const html = document.documentElement;
    if (highContrast) 
    {
      html.classList.add('contrast-mode');
    } 
    else 
    {
      html.classList.remove('contrast-mode');
    }
    localStorage.setItem('highContrast', highContrast);
  }, [highContrast]);

  return (
    <button
      aria-pressed={highContrast}
      aria-label="Toggle high contrast-mode"
      onClick={() => setHighContrast(c => !c)}
      className="btn btn-sm"
    >
      {highContrast ? 'Normal Contrast' : 'High Contrast'}
    </button>
  );
}
