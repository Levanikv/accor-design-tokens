import { addons } from '@storybook/manager-api';

import { ADDON_ID } from './constants.js';
import './manager.js';

// Register the addon following Storybook standard
addons.register(ADDON_ID, () => {
  // Manager.js handles the iframe communication automatically
});
