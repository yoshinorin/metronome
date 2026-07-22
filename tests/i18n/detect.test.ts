import { detectLanguage } from '../../src/i18n';

describe('detectLanguage', () => {
  it('detects Japanese from ja and ja-JP', () => {
    expect(detectLanguage('ja')).toBe('ja');
    expect(detectLanguage('ja-JP')).toBe('ja');
    expect(detectLanguage('JA-JP')).toBe('ja');
  });

  it('falls back to English for everything else', () => {
    expect(detectLanguage('en-US')).toBe('en');
    expect(detectLanguage('de-DE')).toBe('en');
    expect(detectLanguage('')).toBe('en');
  });
});
