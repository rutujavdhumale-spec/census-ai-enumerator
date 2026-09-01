import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Volume2, VolumeX, Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const {
    textSize,
    increaseTextSize,
    decreaseTextSize,
    resetTextSize,
    highContrast,
    toggleHighContrast,
    isSpeaking,
    stopSpeaking,
    speakText
  } = useAccessibility();

  const { t, language } = useLanguage();

  const handleReadHeader = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(
        `${t('appTitle')}. ${t('appSubtitle')}. ${t('heroDescription')}`,
        language
      );
    }
  };

  return (
    <div
      className="accessibility-bar"
      role="region"
      aria-label="Accessibility options and controls"
      style={{
        backgroundColor: 'var(--color-bg-subtle)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0.35rem 1rem',
        fontSize: 'var(--text-xs)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <a href="#main-content" className="skip-link">
          {t('a11ySkipToContent')}
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
            {t('a11yTextSize')}:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              onClick={decreaseTextSize}
              disabled={textSize === 'sm'}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.15rem 0.45rem', minHeight: '28px', fontSize: '11px' }}
              title="Decrease text size"
              aria-label="Decrease text size"
            >
              <ZoomOut size={13} aria-hidden="true" /> A-
            </button>
            <button
              onClick={resetTextSize}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.15rem 0.45rem', minHeight: '28px', fontSize: '11px' }}
              title="Reset text size to standard"
              aria-label="Reset text size"
            >
              <RotateCcw size={11} aria-hidden="true" /> A
            </button>
            <button
              onClick={increaseTextSize}
              disabled={textSize === 'xl'}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.15rem 0.45rem', minHeight: '28px', fontSize: '11px' }}
              title="Increase text size"
              aria-label="Increase text size"
            >
              <ZoomIn size={13} aria-hidden="true" /> A+
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggleHighContrast}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.2rem 0.6rem',
              minHeight: '28px',
              backgroundColor: highContrast ? '#ffffff' : 'transparent',
              color: highContrast ? '#000000' : 'var(--color-text-main)',
              border: '1px solid var(--color-border-strong)'
            }}
            aria-pressed={highContrast}
            title={highContrast ? t('a11yNormalContrast') : t('a11yHighContrast')}
          >
            <Eye size={13} aria-hidden="true" />
            <span>{highContrast ? t('a11yNormalContrast') : t('a11yHighContrast')}</span>
          </button>

          <button
            onClick={handleReadHeader}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.2rem 0.6rem',
              minHeight: '28px',
              backgroundColor: isSpeaking ? 'var(--color-primary-subtle)' : 'transparent',
              color: isSpeaking ? 'var(--color-primary)' : 'var(--color-text-main)',
              border: '1px solid var(--color-border-strong)'
            }}
            aria-pressed={isSpeaking}
            title={isSpeaking ? t('a11yAudioStop') : t('a11yAudioGuide')}
          >
            {isSpeaking ? <VolumeX size={13} aria-hidden="true" /> : <Volume2 size={13} aria-hidden="true" />}
            <span>{isSpeaking ? t('a11yAudioStop') : t('a11yAudioGuide')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
