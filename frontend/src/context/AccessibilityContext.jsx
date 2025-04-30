import React, { createContext, useContext, useState, useEffect } from 'react';

export function speak(text) 
{
  if (!window.speechSynthesis || !text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  window.speechSynthesis.speak(u);
}

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) 
{
  const [focusSpeechEnabled, setFocusSpeechEnabled] = useState(false);

  useEffect(() => {
    if (!focusSpeechEnabled) return;

    const handleClick = (e) => 
    {
      const el = e.target;
      let text =
        el.getAttribute('aria-label') ||
        el.innerText ||
        el.alt ||
        el.title;
      if (text) speak(text.trim());
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [focusSpeechEnabled]);

  return (
    <AccessibilityContext.Provider value={{ focusSpeechEnabled, setFocusSpeechEnabled }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() 
{
  return useContext(AccessibilityContext);
}