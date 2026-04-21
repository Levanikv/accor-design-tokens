import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import fs from 'fs';
import path from 'path';

register(StyleDictionary, { excludeParentKeys: true });

// ─── Color helpers ──────────────────────────────────────────

function resolveHex(value) {
  if (!value || typeof value !== 'string') return null;
  if (value.startsWith('{') && value.endsWith('}')) return null;

  const rgbaMatch = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    const alpha = a !== undefined ? parseFloat(a) : 1;
    return { r: parseInt(r), g: parseInt(g), b: parseInt(b), a: alpha };
  }

  const hex8 = value.match(/^#([A-Fa-f0-9]{8})$/);
  if (hex8) {
    const h = hex8[1];
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: parseInt(h.slice(6, 8), 16) / 255
    };
  }

  const hex6 = value.match(/^#([A-Fa-f0-9]{6})$/);
  if (hex6) {
    const h = hex6[1];
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: 1
    };
  }

  return null;
}

function toHexComponent(n) {
  return '0x' + n.toString(16).padStart(2, '0').toUpperCase();
}

function makeColorEntry(rgba, appearance) {
  const entry = {
    color: {
      'color-space': 'srgb',
      components: {
        alpha: rgba.a.toFixed(3),
        blue: toHexComponent(rgba.b),
        green: toHexComponent(rgba.g),
        red: toHexComponent(rgba.r)
      }
    },
    idiom: 'universal'
  };

  if (appearance === 'dark') {
    entry.appearances = [{ appearance: 'luminosity', value: 'dark' }];
  }

  return entry;
}

function makeColorsetContents(lightRgba, darkRgba) {
  const colors = [];
  if (lightRgba) colors.push(makeColorEntry(lightRgba));
  if (darkRgba) colors.push(makeColorEntry(darkRgba, 'dark'));
  return {
    colors,
    info: { author: 'xcode', version: 1 }
  };
}

// ─── Token naming helpers ───────────────────────────────────

// kebab-case → camelCase
function toCamelCase(str) {
  return str
    .split('-')
    .map((part, i) => i === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

// ─── Collect tokens via Style Dictionary ────────────────────

const colorsMap = new Map(); // tokenName → { light: rgba, dark: rgba }

StyleDictionary.registerFormat({
  name: 'ios/collect',
  format: ({ dictionary, options }) => {
    const mode = options.mode;

    dictionary.allTokens
      .filter(token => {
        if ((token.$type || token.type) !== 'color') return false;
        const pathStr = token.path.join('.').toLowerCase();
        if (pathStr.includes('hover') || pathStr.includes('pressed')) return false;
        return true;
      })
      .forEach(token => {
        const value = token.value || token.$value;
        const rgba = resolveHex(value);
        if (!rgba) return;

        const relevantPath = token.path.slice(3); // skip wel.sem.color
        const tokenName = relevantPath.join('-');

        if (!colorsMap.has(tokenName)) {
          colorsMap.set(tokenName, {});
        }
        colorsMap.get(tokenName)[mode] = rgba;
      });

    return '';
  }
});

// ─── Write .xcassets structure ───────────────────────────────

function writeXcassets(outputDir) {
  const xcassetsDir = path.join(outputDir, 'Colors.xcassets');

  // Clean previous output
  if (fs.existsSync(xcassetsDir)) {
    fs.rmSync(xcassetsDir, { recursive: true });
  }
  fs.mkdirSync(xcassetsDir, { recursive: true });

  // Root Contents.json
  fs.writeFileSync(
    path.join(xcassetsDir, 'Contents.json'),
    JSON.stringify({ info: { author: 'xcode', version: 1 } }, null, 2) + '\n'
  );

  // Flat structure: all colorsets directly in Colors.xcassets/
  let totalColorsets = 0;

  const sortedTokens = Array.from(colorsMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  for (const [tokenName, colors] of sortedTokens) {
    const colorsetName = toCamelCase(tokenName);
    const colorsetDir = path.join(xcassetsDir, `${colorsetName}.colorset`);
    fs.mkdirSync(colorsetDir, { recursive: true });

    const contents = makeColorsetContents(colors.light, colors.dark);
    fs.writeFileSync(
      path.join(colorsetDir, 'Contents.json'),
      JSON.stringify(contents, null, 2) + '\n'
    );
    totalColorsets++;
  }

  console.log(`  - ${totalColorsets} colorsets`);
}

// ─── Main build ─────────────────────────────────────────────

export async function buildAppiOS() {
  console.log('Building design tokens for iOS (xcassets)...\n');

  colorsMap.clear();

  // Collect light mode
  const lightSD = new StyleDictionary({
    source: ['src/primitives/all.json', 'src/brands/brandBook.json', 'src/colorModes/light.json'],
    log: { verbosity: 'silent', errors: { brokenReferences: 'warn' } },
    platforms: {
      ios: {
        transformGroup: 'tokens-studio',
        buildPath: 'dist/ios/',
        files: [{
          destination: '_light_temp.txt',
          format: 'ios/collect',
          filter: (token) => token.path[0] === 'wel' && token.path[1] === 'sem' && token.path[2] === 'color',
          options: { mode: 'light' }
        }]
      }
    }
  });

  try { await lightSD.buildAllPlatforms(); } catch (e) {
    console.log('Light mode warning:', e.message.split('\n')[0]);
  }

  // Collect dark mode
  const darkSD = new StyleDictionary({
    source: ['src/primitives/all.json', 'src/brands/brandBook.json', 'src/colorModes/dark.json'],
    log: { verbosity: 'silent', errors: { brokenReferences: 'warn' } },
    platforms: {
      ios: {
        transformGroup: 'tokens-studio',
        buildPath: 'dist/ios/',
        files: [{
          destination: '_dark_temp.txt',
          format: 'ios/collect',
          filter: (token) => token.path[0] === 'wel' && token.path[1] === 'sem' && token.path[2] === 'color',
          options: { mode: 'dark' }
        }]
      }
    }
  });

  try { await darkSD.buildAllPlatforms(); } catch (e) {
    console.log('Dark mode warning:', e.message.split('\n')[0]);
  }

  // Write .xcassets
  writeXcassets('dist/ios');

  // Clean temp files
  try {
    fs.unlinkSync('dist/ios/_light_temp.txt');
    fs.unlinkSync('dist/ios/_dark_temp.txt');
  } catch (e) { /* ignore */ }

  console.log('\nBuild complete! Output in dist/ios/Colors.xcassets/');
}
