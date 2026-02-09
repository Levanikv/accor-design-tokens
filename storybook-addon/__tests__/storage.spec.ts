import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getStoredValue, storeValue } from '../storage';

describe('storage.ts', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getStoredValue', () => {
    it('returns stored value if it exists', () => {
      localStorage.setItem('key', 'value');
      const result = getStoredValue('key', 'fallback');
      expect(result).toBe('value');
    });

    it('returns fallback if key does not exist', () => {
      const result = getStoredValue('unknown', 'default');
      expect(result).toBe('default');
    });

    it('returns fallback if localStorage.getItem throws', () => {
      vi.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => {
        throw new Error('Blocked');
      });

      const result = getStoredValue('key', 'fallback');
      expect(result).toBe('fallback');
    });
  });

  describe('storeValue', () => {
    it('stores value in localStorage', () => {
      storeValue('theme', 'dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('does nothing if localStorage.setItem throws', () => {
      const setItemSpy = vi
        .spyOn(window.localStorage.__proto__, 'setItem')
        .mockImplementation(() => {
          throw new Error('QuotaExceeded');
        });

      expect(() => storeValue('key', 'value')).not.toThrow();
      expect(setItemSpy).toHaveBeenCalled();
    });
  });
});
