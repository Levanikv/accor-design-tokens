import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  applyAll,
  applyColorMode,
  applyRadiusMode,
  applyTheme,
  resolveHref,
  themes,
} from '../applyTheme';
import { STORAGE_KEYS } from '../constants';
import * as storage from '../storage';

const mockTheme = { id: 'mock', fileName: 'mock.css', name: 'Mock Theme' };

const fallbackThemeId = themes[0]?.id ?? mockTheme.id;

describe('applyTheme.ts', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '<div class="sbdocs-preview"></div>';
    document.documentElement.innerHTML = '';
    document.documentElement.removeAttribute('data-color-mode');
    document.documentElement.removeAttribute('data-radius-mode');
  });

  it('resolveHref should return a valid path ending in fileName', () => {
    const href = resolveHref('brandBook.theme.css');
    expect(href.endsWith('/themes/brandBook.theme.css')).toBe(true);
  });

  it('applyTheme should inject a new <link> if not already applied', () => {
    applyTheme(fallbackThemeId);
    const link = document.querySelector('link[data-theme]') as HTMLLinkElement | null;
    expect(link).not.toBeNull();
    expect(link?.dataset.theme).toBe(fallbackThemeId);
    expect(link?.rel).toBe('stylesheet');
  });

  it('applyTheme should not re-inject link if same href already present', () => {
    applyTheme(fallbackThemeId);
    const countBefore = document.querySelectorAll('link[data-theme]').length;
    applyTheme(fallbackThemeId);
    const countAfter = document.querySelectorAll('link[data-theme]').length;
    expect(countAfter).toBe(countBefore); // no duplicate
  });

  it('applyColorMode should set "dark" mode correctly', () => {
    applyColorMode('dark');
    expect(document.documentElement.getAttribute('data-color-mode')).toBe('dark');
    expect(getComputedStyle(document.documentElement).backgroundColor).toBe('rgb(24, 27, 52)');
  });

  it('applyColorMode should remove attribute if mode is auto', () => {
    document.documentElement.setAttribute('data-color-mode', 'light');
    applyColorMode('auto');
    expect(document.documentElement.hasAttribute('data-color-mode')).toBe(false);
  });

  it('applyRadiusMode should set data-radius-mode correctly', () => {
    applyRadiusMode('square');
    expect(document.documentElement.getAttribute('data-radius-mode')).toBe('square');
  });

  it('applyAll should call applyTheme, applyColorMode, applyRadiusMode with stored values', () => {
    const getStoredValueMock = vi
      .spyOn(storage, 'getStoredValue')
      .mockImplementation(<T extends string>(key: string, fallback: T): T => {
        switch (key) {
          case STORAGE_KEYS.theme:
            return fallbackThemeId as T;
          case STORAGE_KEYS.colorMode:
            return 'dark' as T;
          case STORAGE_KEYS.radiusMode:
            return 'square' as T;
          default:
            return fallback;
        }
      });

    applyAll();

    expect(document.querySelector('link[data-theme]')).not.toBeNull();
    expect(document.documentElement.getAttribute('data-color-mode')).toBe('dark');
    expect(document.documentElement.getAttribute('data-radius-mode')).toBe('square');

    getStoredValueMock.mockRestore();
  });
});
