import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  deepMerge,
  getFilesInDir,
  getNamedJsonContentByFileName,
  mergeFilesContent,
  mergeJsonFiles,
  readJsonFile,
} from '../scripts/jsonUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDir = path.join(__dirname, 'temp-test-dir');

describe('jsonUtils', () => {
  beforeEach(() => {
    // Create test directory structure
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe('getFilesInDir', () => {
    it('should return empty array for non-existent directory', () => {
      const result = getFilesInDir(testDir, 'non-existent');
      expect(result).toEqual([]);
    });

    it('should return all JSON files in directory', () => {
      fs.writeFileSync(path.join(testDir, 'file1.json'), '{"key": "value1"}');
      fs.writeFileSync(path.join(testDir, 'file2.json'), '{"key": "value2"}');
      fs.writeFileSync(path.join(testDir, 'file3.txt'), 'not json');

      const result = getFilesInDir(testDir, '.');
      expect(result).toHaveLength(2);
      expect(result.every((f) => f.endsWith('.json'))).toBe(true);
    });

    it('should filter by includedFileNames', () => {
      fs.writeFileSync(path.join(testDir, 'file1.json'), '{}');
      fs.writeFileSync(path.join(testDir, 'file2.json'), '{}');
      fs.writeFileSync(path.join(testDir, 'file3.json'), '{}');

      const result = getFilesInDir(testDir, '.', {
        includedFileNames: ['file1.json', 'file2.json'],
      });
      expect(result).toHaveLength(2);
      expect(result.some((f) => f.includes('file1.json'))).toBe(true);
      expect(result.some((f) => f.includes('file2.json'))).toBe(true);
      expect(result.some((f) => f.includes('file3.json'))).toBe(false);
    });

    it('should filter by excludedFileNames', () => {
      fs.writeFileSync(path.join(testDir, 'file1.json'), '{}');
      fs.writeFileSync(path.join(testDir, 'file2.json'), '{}');
      fs.writeFileSync(path.join(testDir, 'file3.json'), '{}');

      const result = getFilesInDir(testDir, '.', {
        excludedFileNames: ['file3.json'],
      });
      expect(result).toHaveLength(2);
      expect(result.some((f) => f.includes('file3.json'))).toBe(false);
    });

    it('should apply excludedFileNames after includedFileNames', () => {
      fs.writeFileSync(path.join(testDir, 'file1.json'), '{}');
      fs.writeFileSync(path.join(testDir, 'file2.json'), '{}');

      const result = getFilesInDir(testDir, '.', {
        includedFileNames: ['file1.json', 'file2.json'],
        excludedFileNames: ['file2.json'],
      });
      expect(result).toHaveLength(1);
      expect(result.some((f) => f.includes('file1.json'))).toBe(true);
    });
  });

  describe('readJsonFile', () => {
    it('should read and parse JSON file', () => {
      const testData = { key: 'value', nested: { prop: 123 } };
      fs.writeFileSync(path.join(testDir, 'test.json'), JSON.stringify(testData));

      const result = readJsonFile(path.join(testDir, 'test.json'));
      expect(result).toEqual(testData);
    });

    it('should throw error for invalid JSON', () => {
      fs.writeFileSync(path.join(testDir, 'invalid.json'), 'not valid json');

      expect(() => readJsonFile(path.join(testDir, 'invalid.json'))).toThrow();
    });
  });

  describe('mergeFilesContent', () => {
    it('should merge multiple JSON files', () => {
      fs.writeFileSync(path.join(testDir, 'file1.json'), '{"a": 1, "b": 2}');
      fs.writeFileSync(path.join(testDir, 'file2.json'), '{"c": 3, "d": 4}');

      const result = mergeFilesContent([
        path.join(testDir, 'file1.json'),
        path.join(testDir, 'file2.json'),
      ]);

      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    it('should handle empty array', () => {
      const result = mergeFilesContent([]);
      expect(result).toEqual({});
    });

    it('should override values from later files', () => {
      fs.writeFileSync(path.join(testDir, 'file1.json'), '{"key": "value1"}');
      fs.writeFileSync(path.join(testDir, 'file2.json'), '{"key": "value2"}');

      const result = mergeFilesContent([
        path.join(testDir, 'file1.json'),
        path.join(testDir, 'file2.json'),
      ]);

      expect(result).toEqual({ key: 'value2' });
    });
  });

  describe('getNamedJsonContentByFileName', () => {
    it('should return object keyed by filename', () => {
      fs.mkdirSync(path.join(testDir, 'subdir'), { recursive: true });
      fs.writeFileSync(path.join(testDir, 'subdir', 'file1.json'), '{"data": 1}');
      fs.writeFileSync(path.join(testDir, 'subdir', 'file2.json'), '{"data": 2}');

      const result = getNamedJsonContentByFileName(testDir, 'subdir');

      expect(result).toHaveProperty('file1');
      expect(result).toHaveProperty('file2');
      expect(result.file1).toEqual({ data: 1 });
      expect(result.file2).toEqual({ data: 2 });
    });

    it('should return empty object for non-existent directory', () => {
      const result = getNamedJsonContentByFileName(testDir, 'non-existent');
      expect(result).toEqual({});
    });

    it('should ignore non-JSON files', () => {
      fs.mkdirSync(path.join(testDir, 'subdir'), { recursive: true });
      fs.writeFileSync(path.join(testDir, 'subdir', 'file1.json'), '{"data": 1}');
      fs.writeFileSync(path.join(testDir, 'subdir', 'file2.txt'), 'not json');

      const result = getNamedJsonContentByFileName(testDir, 'subdir');

      expect(result).toHaveProperty('file1');
      expect(result).not.toHaveProperty('file2');
    });
  });

  describe('deepMerge', () => {
    it('should deep merge nested objects', () => {
      const target = { a: 1, nested: { x: 1, y: 2 } };
      const source = { b: 2, nested: { y: 3, z: 4 } };

      const result = deepMerge(target, source);

      expect(result).toEqual({
        a: 1,
        b: 2,
        nested: { x: 1, y: 3, z: 4 },
      });
    });

    it('should override primitive values', () => {
      const target = { key: 'value1' };
      const source = { key: 'value2' };

      const result = deepMerge(target, source);
      expect(result).toEqual({ key: 'value2' });
    });

    it('should not merge arrays', () => {
      const target = { arr: [1, 2] };
      const source = { arr: [3, 4] };

      const result = deepMerge(target, source);
      expect(result).toEqual({ arr: [3, 4] });
    });

    it('should handle empty objects', () => {
      const result = deepMerge({}, {});
      expect(result).toEqual({});
    });

    it('should handle deeply nested objects', () => {
      const target = { level1: { level2: { level3: { a: 1 } } } };
      const source = { level1: { level2: { level3: { b: 2 } } } };

      const result = deepMerge(target, source);
      expect(result.level1.level2.level3).toEqual({ a: 1, b: 2 });
    });
  });

  describe('mergeJsonFiles', () => {
    it('should merge files without useFilenameAsKey', () => {
      fs.writeFileSync(path.join(testDir, 'file1.json'), '{"a": 1, "b": 2}');
      fs.writeFileSync(path.join(testDir, 'file2.json'), '{"c": 3}');

      const result = mergeJsonFiles([
        path.join(testDir, 'file1.json'),
        path.join(testDir, 'file2.json'),
      ]);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should use filename as key when useFilenameAsKey is true', () => {
      fs.writeFileSync(path.join(testDir, 'file1.json'), '{"data": 1}');
      fs.writeFileSync(path.join(testDir, 'file2.json'), '{"data": 2}');

      const result = mergeJsonFiles(
        [path.join(testDir, 'file1.json'), path.join(testDir, 'file2.json')],
        { useFilenameAsKey: true }
      );

      expect(result).toHaveProperty('file1');
      expect(result).toHaveProperty('file2');
      expect(result.file1).toEqual({ data: 1 });
      expect(result.file2).toEqual({ data: 2 });
    });

    it('should skip non-existent files', () => {
      fs.writeFileSync(path.join(testDir, 'file1.json'), '{"a": 1}');

      const result = mergeJsonFiles([
        path.join(testDir, 'file1.json'),
        path.join(testDir, 'non-existent.json'),
      ]);

      expect(result).toEqual({ a: 1 });
    });

    it('should skip non-JSON files', () => {
      fs.writeFileSync(path.join(testDir, 'file1.json'), '{"a": 1}');
      fs.writeFileSync(path.join(testDir, 'file2.txt'), 'not json');

      const result = mergeJsonFiles([
        path.join(testDir, 'file1.json'),
        path.join(testDir, 'file2.txt'),
      ]);

      expect(result).toEqual({ a: 1 });
    });

    it('should handle invalid JSON gracefully', () => {
      fs.writeFileSync(path.join(testDir, 'invalid.json'), 'not valid json');
      fs.writeFileSync(path.join(testDir, 'valid.json'), '{"a": 1}');

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = mergeJsonFiles([
        path.join(testDir, 'invalid.json'),
        path.join(testDir, 'valid.json'),
      ]);

      expect(result).toEqual({ a: 1 });
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should deep merge when useFilenameAsKey is false', () => {
      fs.writeFileSync(path.join(testDir, 'file1.json'), '{"nested": {"a": 1, "b": 2}}');
      fs.writeFileSync(path.join(testDir, 'file2.json'), '{"nested": {"b": 3, "c": 4}}');

      const result = mergeJsonFiles([
        path.join(testDir, 'file1.json'),
        path.join(testDir, 'file2.json'),
      ]);

      expect(result).toEqual({
        nested: { a: 1, b: 3, c: 4 },
      });
    });

    it('should handle empty file array', () => {
      const result = mergeJsonFiles([]);
      expect(result).toEqual({});
    });
  });
});
