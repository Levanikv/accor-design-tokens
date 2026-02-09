import { describe, expect, it } from 'vitest';

import {
  cssTransform,
  collectTokens,
  groupByMode,
  groupMediaQueries,
  lineHeightsToRem,
  scssTransform,
} from '../scripts/transforms.js';

describe('transforms', () => {
  describe('groupByMode', () => {
    it('should group items by their mode property', () => {
      const input = [
        { name: 'a', value: '1', mode: 'light' },
        { name: 'b', value: '2', mode: 'dark' },
        { name: 'c', value: '3', mode: 'light' },
      ];
      const result = groupByMode(input);

      expect(result).toEqual({
        light: [
          { name: 'a', value: '1' },
          { name: 'c', value: '3' },
        ],
        dark: [{ name: 'b', value: '2' }],
      });
    });

    it('should handle empty array', () => {
      const result = groupByMode([]);
      expect(result).toEqual({});
    });

    it('should handle single mode', () => {
      const input = [
        { name: 'a', value: '1', mode: 'light' },
        { name: 'b', value: '2', mode: 'light' },
      ];
      const result = groupByMode(input);

      expect(result).toEqual({
        light: [
          { name: 'a', value: '1' },
          { name: 'b', value: '2' },
        ],
      });
    });

    it('should handle multiple modes', () => {
      const input = [
        { name: 'a', value: '1', mode: 'light' },
        { name: 'b', value: '2', mode: 'dark' },
        { name: 'c', value: '3', mode: 'auto' },
      ];
      const result = groupByMode(input);

      expect(result).toHaveProperty('light');
      expect(result).toHaveProperty('dark');
      expect(result).toHaveProperty('auto');
    });
  });

  describe('collectTokens', () => {
    it('should collect root tokens', () => {
      const dictionary = {
        allTokens: [
          { name: 'colors-primary', $value: '#000' },
          { name: 'spacing-md', $value: '16px' },
        ],
      };

      const result = collectTokens(dictionary);
      expect(result.root).toHaveLength(2);
      expect(result.root.some((t) => t.name === 'colors-primary')).toBe(true);
    });

    it('should collect color mode tokens', () => {
      const dictionary = {
        allTokens: [
          { name: 'color-modes-dark-colors-background', $value: '#000' },
          { name: 'color-modes-light-colors-background', $value: '#fff' },
        ],
      };

      const result = collectTokens(dictionary);
      expect(result.colorMode).toHaveLength(2);
      expect(result.root.some((t) => t.name === 'colors-background')).toBe(true);
    });

    it('should collect radius mode tokens', () => {
      const dictionary = {
        allTokens: [
          { name: 'radius-rounded-border-sm', $value: '4px' },
          { name: 'radius-sharp-border-sm', $value: '0px' },
        ],
      };

      const result = collectTokens(dictionary);
      expect(result.radiusMode).toHaveLength(2);
      expect(result.root.some((t) => t.name === 'border-sm')).toBe(true);
    });

    it('should collect breakpoint tokens', () => {
      const dictionary = {
        allTokens: [
          { name: 'breakpoints-mobile-sm-320-767-wel-sem-padding-inline', $value: '8px' },
        ],
      };

      const result = collectTokens(dictionary);
      expect(result.media).toHaveLength(1);
      expect(result.media[0].media).toEqual({ min: 320, max: 767 });
    });

    it('should filter excluded tokens', () => {
      const dictionary = {
        allTokens: [
          { name: 'wel-sem-text-breakpoint-name', $value: 'Mobile' },
          { name: 'wel-web-b-sem-color-primary', $value: '#000' },
          { name: 'brand-name', $value: 'Accor' },
          { name: 'colors-primary', $value: '#000' },
        ],
      };

      const result = collectTokens(dictionary);
      expect(result.root).toHaveLength(1);
      expect(result.root[0].name).toBe('colors-primary');
    });

    it('should handle breakpoint with min 1280', () => {
      const dictionary = {
        allTokens: [
          { name: 'breakpoints-desktop-md-1280-1439-wel-sem-padding-inline', $value: '16px' },
        ],
      };

      const result = collectTokens(dictionary);
      expect(result.root.some((t) => t.name === 'wel-sem-padding-inline')).toBe(true);
    });

    it('should exclude breakpoint tokens with text-breakpoint-name', () => {
      const dictionary = {
        allTokens: [
          { name: 'breakpoints-mobile-sm-320-767-wel-sem-text-breakpoint-name', $value: 'Mobile' },
        ],
      };

      const result = collectTokens(dictionary);
      expect(result.media).toHaveLength(0);
    });

    it('should handle border mode tokens', () => {
      const dictionary = {
        allTokens: [
          { name: 'borders-mode-1-sem-border-default', $value: '1px solid' },
        ],
      };

      const result = collectTokens(dictionary);
      expect(result.root.some((t) => t.name === 'sem-border-default')).toBe(true);
    });
  });

  describe('groupMediaQueries', () => {
    it('should build media queries grouped by range', () => {
      const mediaTokens = [
        { name: 'token1', value: '10px', media: { min: 320, max: 767 } },
        { name: 'token2', value: '20px', media: { min: 768, max: 1023 } },
        { name: 'token3', value: '30px', media: { min: 1024, max: 1280 } },
      ];

      const result = groupMediaQueries(mediaTokens);
      const keys = Object.keys(result);

      expect(keys).toContain('@media (max-width: 767px)');
      expect(keys).toContain('@media (min-width: 768px) and (max-width: 1023px)');
      expect(keys).toContain('@media (min-width: 1024px)');
    });

    it('should handle first breakpoint with max-width only', () => {
      const mediaTokens = [
        { name: 'token1', value: '10px', media: { min: 320, max: 767 } },
        { name: 'token2', value: '20px', media: { min: 768, max: 1023 } },
      ];

      const result = groupMediaQueries(mediaTokens);
      expect(result).toHaveProperty('@media (max-width: 767px)');
      expect(result['@media (max-width: 767px)']).toHaveLength(1);
    });

    it('should handle last breakpoint with min-width only', () => {
      const mediaTokens = [
        { name: 'token1', value: '10px', media: { min: 320, max: 767 } },
        { name: 'token2', value: '20px', media: { min: 768, max: 9999 } },
      ];

      const result = groupMediaQueries(mediaTokens);
      expect(result).toHaveProperty('@media (min-width: 768px)');
    });

    it('should handle single breakpoint', () => {
      const mediaTokens = [
        { name: 'token1', value: '10px', media: { min: 320, max: 767 } },
      ];

      const result = groupMediaQueries(mediaTokens);
      expect(result).toHaveProperty('@media (max-width: 767px)');
      expect(result['@media (max-width: 767px)']).toHaveLength(1);
    });

    it('should group multiple tokens in same media query', () => {
      const mediaTokens = [
        { name: 'token1', value: '10px', media: { min: 320, max: 767 } },
        { name: 'token2', value: '20px', media: { min: 320, max: 767 } },
      ];

      const result = groupMediaQueries(mediaTokens);
      expect(result['@media (max-width: 767px)']).toHaveLength(2);
    });
  });

  describe('lineHeightsToRem', () => {
    it('should convert numeric values to rem', () => {
      expect(lineHeightsToRem({ $value: 24 })).toBe('1.5rem');
      expect(lineHeightsToRem({ $value: 32 })).toBe('2rem');
      expect(lineHeightsToRem({ $value: 16 })).toBe('1rem');
    });

    it('should convert string numeric values to rem', () => {
      expect(lineHeightsToRem({ $value: '32' })).toBe('2rem');
      expect(lineHeightsToRem({ $value: '24' })).toBe('1.5rem');
    });

    it('should keep rem values as-is', () => {
      expect(lineHeightsToRem({ $value: '1.5rem' })).toBe('1.5rem');
      expect(lineHeightsToRem({ $value: '2rem' })).toBe('2rem');
    });

    it('should keep px values as-is', () => {
      expect(lineHeightsToRem({ $value: '24px' })).toBe('24px');
      expect(lineHeightsToRem({ $value: '16px' })).toBe('16px');
    });

    it('should keep non-numeric values as-is', () => {
      expect(lineHeightsToRem({ $value: 'auto' })).toBe('auto');
      expect(lineHeightsToRem({ $value: 'normal' })).toBe('normal');
    });

    it('should handle decimal values', () => {
      expect(lineHeightsToRem({ $value: 20.5 })).toBe('1.28125rem');
    });

    it('should handle zero value', () => {
      expect(lineHeightsToRem({ $value: 0 })).toBe('0rem');
    });

    it('should handle empty string', () => {
      expect(lineHeightsToRem({ $value: '' })).toBe('');
    });

    it('should handle null/undefined values', () => {
      expect(lineHeightsToRem({ $value: null })).toBe(null);
      expect(lineHeightsToRem({ $value: undefined })).toBe(undefined);
    });
  });

  describe('cssTransform', () => {
    it('should generate expected CSS from token dictionary', () => {
      const dictionary = {
        allTokens: [
          { name: 'colors-primary', $value: '#000' },
          { name: 'color-modes-light-colors-background', $value: '#fff' },
          { name: 'radius-rounded-border-sm', $value: '4px' },
          { name: 'breakpoints-mobile-sm-1280-1439-wel-sem-padding-inline', $value: '8px' },
        ],
      };

      const output = cssTransform({ dictionary });

      expect(output).toContain(':root');
      expect(output).toContain('--colors-primary: #000;');
      expect(output).toContain('--colors-background: #fff;');
      expect(output).toContain('--border-sm: 4px;');
    });

    it('should include color mode CSS blocks', () => {
      const dictionary = {
        allTokens: [
          { name: 'color-modes-dark-colors-background', $value: '#000' },
          { name: 'color-modes-light-colors-background', $value: '#fff' },
        ],
      };

      const output = cssTransform({ dictionary });

      expect(output).toContain('[data-color-mode="dark"]');
      expect(output).toContain('[data-color-mode="light"]');
    });

    it('should include radius mode CSS blocks', () => {
      const dictionary = {
        allTokens: [
          { name: 'radius-rounded-border-sm', $value: '4px' },
          { name: 'radius-sharp-border-sm', $value: '0px' },
        ],
      };

      const output = cssTransform({ dictionary });

      expect(output).toContain('[data-radius-mode="rounded"]');
      expect(output).toContain('[data-radius-mode="sharp"]');
    });

    it('should include media query CSS blocks', () => {
      const dictionary = {
        allTokens: [
          { name: 'breakpoints-mobile-sm-320-767-wel-sem-padding-inline', $value: '8px' },
        ],
      };

      const output = cssTransform({ dictionary });

      expect(output).toContain('@media');
    });

    it('should filter out excluded tokens', () => {
      const dictionary = {
        allTokens: [
          { name: 'wel-sem-text-breakpoint-name', $value: 'Mobile' },
          { name: 'wel-web-b-sem-color-primary', $value: '#000' },
          { name: 'brand-name', $value: 'Accor' },
          { name: 'colors-primary', $value: '#000' },
        ],
      };

      const output = cssTransform({ dictionary });

      expect(output).not.toContain('wel-sem-text-breakpoint-name');
      expect(output).not.toContain('wel-web-b-sem-color-primary');
      expect(output).not.toContain('brand-name');
      expect(output).toContain('--colors-primary: #000;');
    });

    it('should handle empty dictionary', () => {
      const dictionary = {
        allTokens: [],
      };

      const output = cssTransform({ dictionary });
      expect(output).toContain(':root');
    });

    it('should generate correct CSS structure', () => {
      const dictionary = {
        allTokens: [
          { name: 'colors-primary', $value: '#000' },
          { name: 'color-modes-dark-colors-background', $value: '#111' },
          { name: 'radius-rounded-border-sm', $value: '4px' },
          { name: 'breakpoints-mobile-sm-320-767-wel-sem-spacing', $value: '8px' },
        ],
      };

      const output = cssTransform({ dictionary });

      // Check structure
      expect(output).toContain(':root {');
      expect(output).toContain('[data-color-mode="dark"]');
      expect(output).toContain('[data-radius-mode="rounded"]');
      expect(output).toContain('@media');
    });
  });

  describe('scssTransform', () => {
    it('should generate SCSS vars from sem/comp tokens only', () => {
      const dictionary = {
        allTokens: [
          { name: 'wel-sem-color-primary' },
          { name: 'wel-comp-spacing-lg' },
          { name: 'primitives-color-blue' },
        ],
      };

      const output = scssTransform({ dictionary });

      expect(output).toContain('$wel-sem-color-primary: var(--wel-sem-color-primary);');
      expect(output).toContain('$wel-comp-spacing-lg: var(--wel-comp-spacing-lg);');
      expect(output).not.toContain('primitives');
    });

    it('should filter out excluded tokens', () => {
      const dictionary = {
        allTokens: [
          { name: 'wel-sem-text-breakpoint-name' },
          { name: 'wel-web-b-sem-color-primary' },
          { name: 'wel-sem-color-primary' },
        ],
      };

      const output = scssTransform({ dictionary });

      expect(output).not.toContain('wel-sem-text-breakpoint-name');
      expect(output).not.toContain('wel-web-b-sem-color-primary');
      expect(output).toContain('wel-sem-color-primary');
    });

    it('should handle tokens without wel-sem or wel-comp prefix', () => {
      const dictionary = {
        allTokens: [
          { name: 'colors-primary' },
          { name: 'wel-sem-color-primary' },
        ],
      };

      const output = scssTransform({ dictionary });

      expect(output).not.toContain('colors-primary');
      expect(output).toContain('wel-sem-color-primary');
    });

    it('should handle empty dictionary', () => {
      const dictionary = {
        allTokens: [],
      };

      const output = scssTransform({ dictionary });
      expect(output).toBe('');
    });

    it('should generate unique SCSS variables', () => {
      const dictionary = {
        allTokens: [
          { name: 'wel-sem-color-primary' },
          { name: 'wel-sem-color-primary' }, // duplicate
          { name: 'wel-comp-spacing-lg' },
        ],
      };

      const output = scssTransform({ dictionary });
      const lines = output.split('\n').filter(Boolean);

      expect(lines).toHaveLength(2);
      expect(lines).toContain('$wel-sem-color-primary: var(--wel-sem-color-primary);');
      expect(lines).toContain('$wel-comp-spacing-lg: var(--wel-comp-spacing-lg);');
    });

    it('should handle tokens with different prefixes', () => {
      const dictionary = {
        allTokens: [
          { name: 'wel-sem-color-primary' },
          { name: 'wel-comp-spacing-lg' },
          { name: 'other-prefix-token' },
        ],
      };

      const output = scssTransform({ dictionary });

      expect(output).toContain('wel-sem-color-primary');
      expect(output).toContain('wel-comp-spacing-lg');
      expect(output).not.toContain('other-prefix-token');
    });
  });
});
