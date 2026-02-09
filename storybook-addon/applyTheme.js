import { STORAGE_KEYS } from './constants.js';
import { getStoredValue } from './storage.js';

// Load manifest from dist at runtime
async function loadManifest() {
  try {
    const basePath = document.baseURI?.replace(/\/(index|iframe)\.html$/, '').replace(/\/$/, '') || '';
    const response = await fetch(`${basePath}/themes.manifest.json`);
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Ignore errors - will use fallback
  }
  return [];
}

let themesCache = null;

export async function getThemes() {
  if (!themesCache) {
    themesCache = await loadManifest();
  }
  return themesCache;
}

// Synchronous access - will be populated after first async load
export const themes = [];

// Initialize themes on load
if (typeof window !== 'undefined') {
  getThemes().then((loaded) => {
    themes.length = 0;
    themes.push(...loaded);
  });
}

function resolveHref(fileName) {
  const baseURI = document.baseURI ?? '';
  const path = baseURI.split('?')[0].replace(/\/(index|iframe)\.html$/, '').replace(/\/$/, '');
  return `${path}/css/${fileName}`;
}

export function applyTheme(themeId) {
  const theme = themes.find((t) => t.id === themeId);
  if (!theme) return;

  const href = resolveHref(theme.fileName);
  const current = document.querySelector('link[data-theme]');
  if (current?.href === href) return;

  current?.remove();
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.theme = theme.id;
  document.head.appendChild(link);
}

export function applyColorMode(mode) {
  const html = document.documentElement;
  const isDark = mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (mode === 'auto') {
    html.setAttribute('data-color-mode', isDark ? 'dark' : 'light');
  } else {
    html.setAttribute('data-color-mode', mode);
  }

  const bg = isDark ? '#181b34' : '';
  html.style.backgroundColor = bg;
  document.querySelectorAll('div.sbdocs-preview').forEach((el) => {
    el.style.backgroundColor = bg;
  });
}

export function applyRadiusMode(mode) {
  document.documentElement.setAttribute('data-radius-mode', mode);
}

export function applyAll() {
  applyTheme(getStoredValue(STORAGE_KEYS.theme, 'all'));
  applyColorMode(getStoredValue(STORAGE_KEYS.colorMode, 'auto'));
  applyRadiusMode(getStoredValue(STORAGE_KEYS.radiusMode, 'rounded'));
}
