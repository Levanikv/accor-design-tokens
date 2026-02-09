import { STORAGE_KEYS } from './constants.js';

function broadcastTheme() {
  const message = {
    type: 'apply-theme',
    themeId: localStorage.getItem(STORAGE_KEYS.theme) ?? 'all',
    colorMode: localStorage.getItem(STORAGE_KEYS.colorMode) ?? 'auto',
    radiusMode: localStorage.getItem(STORAGE_KEYS.radiusMode) ?? 'rounded',
  };

  document.querySelectorAll('iframe').forEach((iframe) => {
    iframe.contentWindow?.postMessage(message, '*');
  });
}

window.addEventListener('message', (event) => {
  if (event.data?.type === 'ads-theme-change') {
    broadcastTheme();
  }
});

// Broadcast on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', broadcastTheme);
} else {
  broadcastTheme();
}
