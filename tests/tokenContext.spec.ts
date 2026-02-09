import { describe, expect, it } from 'vitest';

import { extractTokenContext } from '../scripts/tokenContext.js';

describe('extractTokenContext', () => {
  describe('breakpoint tokens', () => {
    it('should detect breakpoint context with mobile breakpoint', () => {
      const result = extractTokenContext('breakpoints-mobile-sm-320-767-wel-sem-padding-inline');
      expect(result).toEqual({
        context: 'breakpoint',
        min: 320,
        max: 767,
        token: 'wel-sem-padding-inline',
      });
    });

    it('should detect breakpoint context with desktop breakpoint', () => {
      const result = extractTokenContext('breakpoints-desktop-md-1280-1439-wel-sem-padding-inline');
      expect(result).toEqual({
        context: 'breakpoint',
        min: 1280,
        max: 1439,
        token: 'wel-sem-padding-inline',
      });
    });

    it('should detect breakpoint context with tablet breakpoint', () => {
      const result = extractTokenContext('breakpoints-tablet-768-1023-wel-sem-spacing-lg');
      expect(result).toEqual({
        context: 'breakpoint',
        min: 768,
        max: 1023,
        token: 'wel-sem-spacing-lg',
      });
    });
  });

  describe('color mode tokens', () => {
    it('should detect dark color mode', () => {
      const result = extractTokenContext('color-modes-dark-sem-background');
      expect(result).toEqual({
        context: 'color-mode',
        mode: 'dark',
        token: 'sem-background',
      });
    });

    it('should detect light color mode', () => {
      const result = extractTokenContext('color-modes-light-primary-bg');
      expect(result).toEqual({
        context: 'color-mode',
        mode: 'light',
        token: 'primary-bg',
      });
    });

    it('should handle color mode with multiple segments', () => {
      const result = extractTokenContext('color-modes-dark-colors-primary-background');
      expect(result).toEqual({
        context: 'color-mode',
        mode: 'dark',
        token: 'colors-primary-background',
      });
    });
  });

  describe('radius mode tokens', () => {
    it('should detect rounded radius mode', () => {
      const result = extractTokenContext('radius-rounded-sem-radius-sm');
      expect(result).toEqual({
        context: 'radius-mode',
        mode: 'rounded',
        token: 'sem-radius-sm',
      });
    });

    it('should detect radius mode with border token', () => {
      const result = extractTokenContext('radius-rounded-border-sm');
      expect(result).toEqual({
        context: 'radius-mode',
        mode: 'rounded',
        token: 'border-sm',
      });
    });
  });

  describe('border mode tokens', () => {
    it('should detect border mode with single mode identifier', () => {
      const result = extractTokenContext('borders-mode-1-sem-border-default');
      expect(result).toEqual({
        context: 'border-mode',
        mode: 'mode-1',
        token: 'sem-border-default',
      });
    });

    it('should handle border mode with hyphenated identifier', () => {
      const result = extractTokenContext('borders-custom-mode-sem-border-thick');
      expect(result).toEqual({
        context: 'border-mode',
        mode: 'custom-mode',
        token: 'sem-border-thick',
      });
    });
  });

  describe('default context', () => {
    it('should fallback to default context for standard tokens', () => {
      const result = extractTokenContext('typography-body-md');
      expect(result).toEqual({
        context: 'default',
        token: 'typography-body-md',
      });
    });

    it('should fallback to default context for semantic tokens', () => {
      const result = extractTokenContext('wel-sem-color-primary');
      expect(result).toEqual({
        context: 'default',
        token: 'wel-sem-color-primary',
      });
    });

    it('should fallback to default context for component tokens', () => {
      const result = extractTokenContext('wel-comp-spacing-lg');
      expect(result).toEqual({
        context: 'default',
        token: 'wel-comp-spacing-lg',
      });
    });

    it('should fallback to default context for primitive tokens', () => {
      const result = extractTokenContext('colors-blue-500');
      expect(result).toEqual({
        context: 'default',
        token: 'colors-blue-500',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const result = extractTokenContext('');
      expect(result).toEqual({
        context: 'default',
        token: '',
      });
    });

    it('should handle tokens with special characters', () => {
      const result = extractTokenContext('token-with-special-chars-123');
      expect(result).toEqual({
        context: 'default',
        token: 'token-with-special-chars-123',
      });
    });

    it('should handle case-insensitive color mode matching', () => {
      const result = extractTokenContext('COLOR-MODES-DARK-SEM-BACKGROUND');
      expect(result).toEqual({
        context: 'color-mode',
        mode: 'DARK',
        token: 'SEM-BACKGROUND',
      });
    });
  });
});
