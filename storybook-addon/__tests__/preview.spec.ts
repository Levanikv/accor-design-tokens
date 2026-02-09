import { beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS } from '../constants';

let storeValueSpy: ReturnType<typeof vi.fn>;
let getStoredValueSpy: ReturnType<typeof vi.fn>;
let applyAllSpy: ReturnType<typeof vi.fn>;
let postMessageSpy: ReturnType<typeof vi.fn>;
let triggerGlobalsUpdated: ((payload: any) => void) | undefined;

const MOCK_GLOBALS = {
  theme: 'fairmont',
  colorMode: 'dark',
  radiusMode: 'square',
};

describe('preview.ts', () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    postMessageSpy = vi.fn();
    // @ts-expect-error override parent
    window.parent = { postMessage: postMessageSpy };

    localStorage.clear();

    vi.doMock('../storage', () => ({
      storeValue: vi.fn(),
      getStoredValue: vi.fn((_, fallback: string) => fallback),
    }));

    vi.doMock('../applyTheme', () => ({
      applyAll: vi.fn(),
      themes: [{ id: 'all', name: 'All' }],
    }));

    vi.doMock('@storybook/preview-api', () => ({
      addons: {
        getChannel: () => ({
          on: vi.fn((event, cb) => {
            if (event === 'globalsUpdated') {
              triggerGlobalsUpdated = cb;
            }
          }),
        }),
      },
      makeDecorator: () => (fn: any) => fn,
    }));

    // Load preview and manually call globalUpdate
    const preview = await import('../preview');
    preview.globalUpdate();

    storeValueSpy = (await vi.importMock('../storage')).storeValue as ReturnType<typeof vi.fn>;
    getStoredValueSpy = (await vi.importMock('../storage')).getStoredValue as ReturnType<
      typeof vi.fn
    >;
    applyAllSpy = (await vi.importMock('../applyTheme')).applyAll as ReturnType<typeof vi.fn>;
  });

  it('should store new globals and broadcast message with origin', () => {
    expect(typeof triggerGlobalsUpdated).toBe('function');

    triggerGlobalsUpdated?.({ globals: MOCK_GLOBALS });

    expect(storeValueSpy).toHaveBeenCalledWith(STORAGE_KEYS.theme, 'fairmont');
    expect(storeValueSpy).toHaveBeenCalledWith(STORAGE_KEYS.colorMode, 'dark');
    expect(storeValueSpy).toHaveBeenCalledWith(STORAGE_KEYS.radiusMode, 'square');
    expect(postMessageSpy).toHaveBeenCalledWith({ type: 'ads-theme-change' }, '*');
    expect(applyAllSpy).toHaveBeenCalled();
  });

  it('should apply values from "apply-theme" message', () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: window.location.origin,
        data: {
          type: 'apply-theme',
          themeId: 'ibis',
          colorMode: 'light',
          radiusMode: 'rounded',
        },
      })
    );

    expect(storeValueSpy).toHaveBeenCalledWith(STORAGE_KEYS.theme, 'ibis');
    expect(storeValueSpy).toHaveBeenCalledWith(STORAGE_KEYS.colorMode, 'light');
    expect(storeValueSpy).toHaveBeenCalledWith(STORAGE_KEYS.radiusMode, 'rounded');
    expect(applyAllSpy).toHaveBeenCalled();
  });

  it('should ignore unrelated messages', () => {
    window.dispatchEvent(new MessageEvent('message', { data: { type: 'unknown' } }));
    expect(storeValueSpy).not.toHaveBeenCalled();
    expect(applyAllSpy).not.toHaveBeenCalled();
  });

  it('should fallback to default values using getStoredValue()', () => {
    expect(getStoredValueSpy).toHaveBeenCalledWith(STORAGE_KEYS.theme, 'all');
    expect(getStoredValueSpy).toHaveBeenCalledWith(STORAGE_KEYS.colorMode, 'auto');
    expect(getStoredValueSpy).toHaveBeenCalledWith(STORAGE_KEYS.radiusMode, 'rounded');
  });
});
