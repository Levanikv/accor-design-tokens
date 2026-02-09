// @ts-check

/**
 * Unified build script that generates JSON tokens and CSS themes.
 * 
 * This script:
 * 1. Generates JSON token files per brand directly from source
 * 2. Generates CSS theme files from the tokens
 * 3. Writes all files to dist/ at the end
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'fs/promises';

import { register } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import { logVerbosityLevels, logWarningLevels, transforms } from 'style-dictionary/enums';

import { buildMergedThemeTokens } from './tokenBuilder.js';
import { buildAppCompose } from './buildAppCompose.js';
import { getFilesInDir } from './jsonUtils.js';
import { cssTransform, lineHeightsToRem, scssTransform } from './transforms.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');
const distDir = path.resolve(__dirname, '../dist');
const jsonDir = path.resolve(distDir, 'json');
const cssDir = path.resolve(distDir, 'css');
const manifestPath = path.join(distDir, 'themes.manifest.json');

// Register custom formats
StyleDictionary.registerFormat({
  name: 'css/custom',
  format: cssTransform,
});

StyleDictionary.registerFormat({
  name: 'scss/custom',
  format: scssTransform,
});

StyleDictionary.registerTransform({
  name: 'lineHeightsToRem',
  type: 'value',
  transitive: true,
  filter: (token) => {
    return token.$type === 'lineHeight';
  },
  transform: lineHeightsToRem,
});

/**
 * Clean semantic data inside breakpoints by removing unnecessary properties.
 * Specifically removes `typography` and `breakpointName` from the `sem` object.
 *
 * @param {Record<string, any>} breakpoints
 * @returns {Record<string, any>}
 */
function cleanBreakpoints(breakpoints) {
  const cleaned = {};

  for (const [key, value] of Object.entries(breakpoints)) {
    if (
      typeof value === 'object' &&
      value !== null &&
      typeof value.sem === 'object' &&
      value.sem !== null
    ) {
      // Remove unwanted keys while preserving the rest
      const { typography: _t, breakpointName: _b, ...restSem } = value.sem;
      cleaned[key] = {
        ...value,
        sem: restSem,
      };
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * Generates JSON tokens for all brands
 * @returns {Map<string, object>} Map of tokens per brand
 */
function generateTokens() {
  console.log('📦 Generating JSON tokens per brand...');

  const brands = getFilesInDir(srcDir, 'brands').map((filePath) =>
    path.basename(filePath, '.json')
  );

  const tokensMap = new Map();

  for (const brand of brands) {
    const mergedTokens = buildMergedThemeTokens(brand, srcDir);

    if (mergedTokens.breakpoints) {
      mergedTokens.breakpoints = cleanBreakpoints(mergedTokens.breakpoints);
    }

    tokensMap.set(brand, mergedTokens);
  }

  console.log(`✅ Generated ${tokensMap.size} token files in memory`);
  return tokensMap;
}

/**
 * Generates CSS theme files from tokens
 * @param {Map<string, object>} tokensMap - Map of tokens per brand
 */
async function generateThemes(tokensMap) {
  console.log('🎨 Generating CSS themes...');

  const themes = [];

  for (const [brandName, tokens] of tokensMap.entries()) {
    await register(StyleDictionary);

    const tokenFile = path.join(jsonDir, `${brandName}.tokens.json`);

    const sd = new StyleDictionary({
      source: [tokenFile],
      preprocessors: ['tokens-studio'],
      platforms: {
        css: {
          buildPath: cssDir,
          transformGroup: 'tokens-studio',
          transforms: [
            transforms.attributeCti,
            transforms.nameKebab,
            transforms.colorHex,
            transforms.sizePxToRem,
            transforms.sizeRem,
            'lineHeightsToRem',
          ],
          files: [
            {
              destination: `${brandName}.theme.css`,
              format: 'css/custom',
            },
          ],
        },
      },
      log: {
        warnings: logWarningLevels.warn,
        verbosity: logVerbosityLevels.verbose,
      },
    });

    await sd.buildAllPlatforms();

    themes.push({
      id: brandName,
      name: brandName.toUpperCase(),
      fileName: `${brandName}.theme.css`,
    });
  }

  if (tokensMap.has('all')) {
    await register(StyleDictionary);

    const allTokensFile = path.join(jsonDir, 'all.tokens.json');
    const scssSD = new StyleDictionary({
      source: [allTokensFile],
      platforms: {
        scss: {
          transformGroup: 'tokens-studio',
          transforms: [transforms.nameKebab],
          buildPath: distDir,
          files: [
            {
              destination: `theme.scss`,
              format: 'scss/custom',
            },
          ],
        },
      },
      log: {
        warnings: logWarningLevels.error,
        verbosity: logVerbosityLevels.verbose,
      },
    });

    await scssSD.buildAllPlatforms();
  }

  await writeFile(manifestPath, JSON.stringify(themes, null, 2));
  console.log(`✅ Generated ${themes.length} CSS themes`);
}

/**
 * Build target: 'web' | 'app' | 'all'
 * Can be set via BUILD_TARGET env var or first CLI arg (e.g. node build.js app).
 */
const BUILD_TARGET = process.env.BUILD_TARGET || process.argv[2] || 'all';
const isWeb = BUILD_TARGET === 'web' || BUILD_TARGET === 'all';
const isApp = BUILD_TARGET === 'app' || BUILD_TARGET === 'all';

/**
 * Main build function
 */
async function build() {
  try {
    console.log(`🚀 Starting build (target: ${BUILD_TARGET})...\n`);

    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true });
    }
    fs.mkdirSync(jsonDir, { recursive: true });
    fs.mkdirSync(cssDir, { recursive: true });

    if (isWeb) {
      const tokensMap = generateTokens();

      console.log('\n💾 Writing token JSON files...');
      for (const [brandName, tokens] of tokensMap.entries()) {
        const outputFilePath = path.join(jsonDir, `${brandName}.tokens.json`);
        fs.writeFileSync(outputFilePath, JSON.stringify(tokens, null, 2));
      }
      console.log(`✅ Token JSON files written to ${jsonDir}\n`);

      await generateThemes(tokensMap);
    }

    if (isApp) {
      const androidDir = path.join(distDir, 'android');
      if (!fs.existsSync(androidDir)) {
        fs.mkdirSync(androidDir, { recursive: true });
      }
      await buildAppCompose();
    }

    console.log('\n✨ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build error:', error);
    process.exit(1);
  }
}

// Run it
await build();
