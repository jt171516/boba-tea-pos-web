import React, { useEffect, useState } from 'react';

export default function AccessibilityControls() 
{
  const [fontPct, setFontPct] = useState(() => 
    {
    const saved = localStorage.getItem('fontSizePct');
    return saved ? Number(saved) : 100;
  });

  useEffect(() => 
    {
    document.documentElement.style.fontSize = `${fontPct}%`;
    localStorage.setItem('fontSizePct', fontPct);
  }, [fontPct]);

  const increase = () => setFontPct(p => Math.min(p + 10, 200));
  const decrease = () => setFontPct(p => Math.max(p - 10, 50));
  const reset    = () => setFontPct(100);

  return (
    <div className="flex items-center space-x-2">
      <button
        aria-label="Decrease text size"
        onClick={decrease}
        className="btn btn-sm"
      >
        Zoom-
      </button>
      <button
        aria-label="Reset text size"
        onClick={reset}
        className="btn btn-sm"
      >
        Realign
      </button>
      <button
        aria-label="Increase text size"
        onClick={increase}
        className="btn btn-sm"
      >
        Zoom+
      </button>
    </div>
  );
}
