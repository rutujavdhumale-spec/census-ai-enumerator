import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type TextSize = 'sm' | 'md' | 'lg' | 'xl';

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  resetTextSize: () => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  toggleHighContrast: () => void;
  isSpeaking: boolean;
  speakText: (text: string, langCode?: string) => void;
  stopSpeaking: () => void;
  srAnnouncement: string;
  announce: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    try {
      return (localStorage.getItem('census_text_size') as TextSize) || 'md';
    } catch {
      return 'md';
    }
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('census_high_contrast') === 'true';
    } catch {
      return false;
    }
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [srAnnouncement, setSrAnnouncement] = useState<string>('');
  const announcementTimeoutRef = useRef<any>(null);

  // Apply font size class to body
  useEffect(() => {
    document.body.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl');
    document.body.classList.add(`font-size-${textSize}`);
    try {
      localStorage.setItem('census_text_size', textSize);
    } catch {}
  }, [textSize]);

  // Apply high contrast class to body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    try {
      localStorage.setItem('census_high_contrast', highContrast.toString());
    } catch {}
  }, [highContrast]);

  const setTextSize = (size: TextSize) => setTextSizeState(size);

  const increaseTextSize = () => {
    if (textSize === 'sm') setTextSizeState('md');
    else if (textSize === 'md') setTextSizeState('lg');
    else if (textSize === 'lg') setTextSizeState('xl');
  };

  const decreaseTextSize = () => {
    if (textSize === 'xl') setTextSizeState('lg');
    else if (textSize === 'lg') setTextSizeState('md');
    else if (textSize === 'md') setTextSizeState('sm');
  };

  const resetTextSize = () => setTextSizeState('md');

  const setHighContrast = (val: boolean) => setHighContrastState(val);
  const toggleHighContrast = () => setHighContrastState(prev => !prev);

  // Speech Synthesis TTS Helper
  const speakText = (text: string, langCode: string = 'en') => {
    if (!('speechSynthesis' in window)) {
      announce('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = langCode === 'hi' ? 'hi-IN' : 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    announce('Playing audio narration.');
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      announce('Audio narration stopped.');
    }
  };

  const announce = (message: string) => {
    setSrAnnouncement(message);
    if (announcementTimeoutRef.current) {
      clearTimeout(announcementTimeoutRef.current);
    }
    announcementTimeoutRef.current = setTimeout(() => {
      setSrAnnouncement('');
    }, 4000);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        increaseTextSize,
        decreaseTextSize,
        resetTextSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
        isSpeaking,
        speakText,
        stopSpeaking,
        srAnnouncement,
        announce
      }}
    >
      {/* Live Region for Screen Reader Announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {srAnnouncement}
      </div>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
