# Accor Design System Tokens

Design tokens package for Accor brands, providing CSS themes, SCSS variables, and JSON tokens.

## Installation

```bash
npm install @accor/design-system-tokens
```

## Package Structure

```
dist/
├── json/              # JSON token files per brand
│   ├── all.tokens.json
│   ├── brandBook.tokens.json
│   └── ...
├── css/               # CSS theme files per brand
│   ├── all.theme.css
│   ├── brandBook.theme.css
│   └── ...
├── theme.scss         # SCSS variables file
└── themes.manifest.json  # Themes manifest
```

## Usage

### CSS Themes

Import a specific brand theme:

```html
<link rel="stylesheet" href="node_modules/@accor/design-system-tokens/dist/css/all.theme.css">
```

Or in JavaScript:

```js
import '@accor/design-system-tokens/dist/css/all.theme.css';
```

### SCSS Variables

```scss
@import '@accor/design-system-tokens/dist/theme.scss';
```

### JSON Tokens

```js
import tokens from '@accor/design-system-tokens/dist/json/all.tokens.json';
```

## Storybook Addon

The package includes a Storybook addon for managing and applying themes directly in Storybook.

### Installation

The addon is included in the package, no additional installation needed.

### Setup

#### 1. Register addon in `.storybook/main.js`

```js
export default {
  addons: [
    '@accor/design-system-tokens/storybook-addon/register',
  ],
  staticDirs: [
    { from: '../node_modules/@accor/design-system-tokens/dist', to: '/' },
  ],
};
```

#### 2. Configure preview in `.storybook/preview.js`

```js
import { themeGlobalTypes, withThemeDecorator, globalUpdate } from '@accor/design-system-tokens/storybook-addon/preview';

export const globalTypes = { ...themeGlobalTypes };
export const decorators = [withThemeDecorator];
globalUpdate();
```

### Features

- **Theme Switcher**: Switch between brand themes (all, brandBook, fairmontWIP, etc.)
- **Color Mode**: Light / Dark / Auto (system preference)
- **Radius Mode**: Rounded / Square
- **Persistence**: Preferences saved in localStorage
- **Iframe Support**: Works with Storybook's iframe mode

### API

```js
import { applyTheme, applyColorMode, applyRadiusMode } from '@accor/design-system-tokens/storybook-addon';

applyTheme('all');
applyColorMode('dark');
applyRadiusMode('rounded');
```

## Development

### Build

```bash
npm run build
```

This will:
1. Generate JSON token files for each brand
2. Generate CSS theme files for each brand
3. Generate `theme.scss` with SCSS variables
4. Generate `themes.manifest.json`

### Tests

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Available Brands

- `all` - All brands combined
- `brandBook` - Brand book
- `fairmontWIP` - Fairmont (work in progress)
- `handwrittenWIP` - Handwritten (work in progress)
- `ibisWIP` - Ibis (work in progress)
- `movenpick` - Mövenpick
- `novotelWIP` - Novotel (work in progress)
- `pullmanWIP` - Pullman (work in progress)
- `rafflesWIP` - Raffles (work in progress)
- `sofitelWIP` - Sofitel (work in progress)

## Exports

The package exports:

- `./dist/*` - All dist files
- `./storybook-addon` - Addon main entry
- `./storybook-addon/register` - Addon registration
- `./storybook-addon/preview` - Addon preview configuration
