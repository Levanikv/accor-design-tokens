import { addons, makeDecorator } from '@storybook/preview-api';

import { applyAll, getThemes, themes } from './applyTheme.js';
import {
  ADDON_ID,
  COLOR_MODE_TITLES,
  COLOR_MODES,
  RADIUS_MODE_TITLES,
  RADIUS_MODES,
  STORAGE_KEYS,
} from './constants.js';
import { getStoredValue, storeValue } from './storage.js';

function persistGlobals({ theme, colorMode, radiusMode }) {
  storeValue(STORAGE_KEYS.theme, theme);
  storeValue(STORAGE_KEYS.colorMode, colorMode);
  storeValue(STORAGE_KEYS.radiusMode, radiusMode);
}

// Listen for theme changes from manager
window.addEventListener('message', (event) => {
  if (event.data?.type === 'apply-theme') {
    const { themeId, colorMode, radiusMode } = event.data;
    persistGlobals({ theme: themeId, colorMode, radiusMode });
    applyAll();
  }
});

// Initialize themes early
getThemes().then((loaded) => {
  themes.length = 0;
  themes.push(...loaded);
});

export const themeGlobalTypes = {
  theme: {
    name: 'Theme',
    description: 'Design system theme',
    defaultValue: getStoredValue(STORAGE_KEYS.theme, 'all'),
    toolbar: {
      icon: 'paintbrush',
      items: themes.length > 0 
        ? themes.map(({ id, name }) => ({ value: id, title: name }))
        : [{ value: 'all', title: 'ALL' }], // Fallback - will update when themes load
      showName: true,
      dynamicTitle: true,
    },
  },
  colorMode: {
    name: 'Color Mode',
    description: 'Light / Dark / Auto',
    defaultValue: getStoredValue(STORAGE_KEYS.colorMode, 'auto'),
    toolbar: {
      icon: 'mirror',
      items: COLOR_MODES.map((m) => ({ value: m, title: COLOR_MODE_TITLES[m] })),
      showName: true,
      dynamicTitle: true,
    },
  },
  radiusMode: {
    name: 'Radius',
    description: 'Rounded / Square',
    defaultValue: getStoredValue(STORAGE_KEYS.radiusMode, 'rounded'),
    toolbar: {
      icon: 'circlehollow',
      items: RADIUS_MODES.map((m) => ({ value: m, title: RADIUS_MODE_TITLES[m] })),
      showName: true,
      dynamicTitle: true,
    },
  },
};

export const withThemeDecorator = makeDecorator({
  name: 'withThemeDecorator',
  parameterName: ADDON_ID,
  wrapper: (getStory, context) => {
    if (window.top === window) {
      persistGlobals(context.globals);
    }
    applyAll();
    return getStory(context);
  },
});

export const globalUpdate = () => {
  const channel = addons.getChannel();
  channel.on('globalsUpdated', (context) => {
    persistGlobals(context.globals);
    applyAll();
    // Notify manager to broadcast to iframes
    window.parent.postMessage({ type: 'ads-theme-change' }, '*');
  });
};
