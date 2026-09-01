import { describe, it, expect } from 'vitest';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../../src/i18n/translations';

describe('Accessibility & Localization Suite', () => {
  it('supports all 8 required Indian languages', () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(8);
    const codes = SUPPORTED_LANGUAGES.map(l => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('mr');
    expect(codes).toContain('bn');
    expect(codes).toContain('ta');
    expect(codes).toContain('te');
    expect(codes).toContain('kn');
    expect(codes).toContain('gu');
  });

  it('verifies essential translation keys exist across all 8 languages', () => {
    const requiredKeys = [
      'appTitle',
      'appSubtitle',
      'navPhases',
      'navStates',
      'navSimulator',
      'navPrivacy',
      'navFactCheck',
      'navAssistant',
      'navAnalytics',
      'simNoticeTitle',
      'privacyLegalShield'
    ];

    for (const lang of SUPPORTED_LANGUAGES) {
      const dict = TRANSLATIONS[lang.code];
      expect(dict).toBeDefined();
      for (const key of requiredKeys) {
        expect(dict[key], `Missing key "${key}" in language "${lang.code}"`).toBeDefined();
        expect(dict[key].length).toBeGreaterThan(0);
      }
    }
  });
});
