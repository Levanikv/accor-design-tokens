import '../manager';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS } from '../constants';

describe('manager.ts – theme broadcaster', () => {
  let iframe: HTMLIFrameElement;
  let postMessageSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    document.body.innerHTML = '';
    postMessageSpy = vi.fn();

    iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'http://localhost:3000/preview');
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageSpy },
      writable: true,
    });

    document.body.appendChild(iframe);
    localStorage.clear();
  });

  it('should broadcast stored values to all iframes', () => {
    localStorage.setItem(STORAGE_KEYS.theme, 'fairmont');
    localStorage.setItem(STORAGE_KEYS.colorMode, 'dark');
    localStorage.setItem(STORAGE_KEYS.radiusMode, 'square');

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'http://localhost:3000',
        data: { type: 'ads-theme-change' },
      })
    );

    expect(postMessageSpy).toHaveBeenCalledOnce();
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        type: 'apply-theme',
        themeId: 'fairmont',
        colorMode: 'dark',
        radiusMode: 'square',
      },
      'http://localhost:3000'
    );
  });

  it('should fallback to defaults if localStorage is empty', () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'http://localhost:3000',
        data: { type: 'ads-theme-change' },
      })
    );

    expect(postMessageSpy).toHaveBeenCalledOnce();
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        type: 'apply-theme',
        themeId: 'all',
        colorMode: 'auto',
        radiusMode: 'rounded',
      },
      'http://localhost:3000'
    );
  });

  it('should not throw if an iframe has no contentWindow', () => {
    const brokenIframe = document.createElement('iframe');
    brokenIframe.setAttribute('src', 'http://localhost:3000');
    Object.defineProperty(brokenIframe, 'contentWindow', {
      value: null,
      writable: true,
    });

    document.body.appendChild(brokenIframe);

    expect(() =>
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: 'http://localhost:3000',
          data: { type: 'ads-theme-change' },
        })
      )
    ).not.toThrow();
  });

  it('should ignore unrelated message types', () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'http://localhost:3000',
        data: { type: 'unrelated' },
      })
    );

    expect(postMessageSpy).not.toHaveBeenCalled();
  });

  it('should ignore messages from other hostnames', () => {
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'https://malicious.com',
        data: { type: 'ads-theme-change' },
      })
    );

    expect(postMessageSpy).not.toHaveBeenCalled();
  });

  it('should reply to ads-theme-handshake with correct origin', () => {
    const replySpy = vi.fn();
    const source = { postMessage: replySpy };

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'http://localhost:3000',
        data: { type: 'ads-theme-handshake' },
        source: source as unknown as MessageEventSource,
      })
    );

    expect(replySpy).toHaveBeenCalledOnce();
    expect(replySpy).toHaveBeenCalledWith(
      { type: 'ads-theme-handshake-reply' },
      'http://localhost:3000'
    );
  });
});
