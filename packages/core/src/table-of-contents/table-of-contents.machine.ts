/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * createTableOfContents — scroll spy navigasyon state machine.
 * createTableOfContents — scroll spy navigation state machine.
 *
 * Baslik listesini tutar, aktif basligi izler, scrollTo destekler.
 *
 * @packageDocumentation
 */

import type {
  TocItem,
  TocEvent,
  TocContext,
  TocConfig,
  TocAPI,
} from './table-of-contents.types';

// ── Factory ────────────────────────────────────────────

export function createTableOfContents(config: TocConfig = {}): TocAPI {
  // ── State ──
  const ctx: TocContext = {
    items: config.items ?? [],
    activeId: config.activeId ?? null,
    offset: config.offset ?? 0,
    scrollTarget: null,
  };

  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((fn) => fn());
  }

  // ── Helpers ──

  function findItem(id: string): TocItem | undefined {
    return ctx.items.find((item) => item.id === id);
  }

  // ── Send ──

  function send(event: TocEvent): void {
    switch (event.type) {
      case 'SET_ITEMS': {
        ctx.items = event.items;
        // Aktif id listede yoksa sifirla
        if (ctx.activeId && !event.items.some((i) => i.id === ctx.activeId)) {
          ctx.activeId = null;
          config.onChange?.(null);
        }
        notify();
        break;
      }

      case 'SET_ACTIVE': {
        if (ctx.activeId !== event.id) {
          ctx.activeId = event.id;
          config.onChange?.(event.id);
          notify();
        }
        break;
      }

      case 'SCROLL_TO': {
        const item = findItem(event.id);
        if (!item || item.disabled) return;

        ctx.scrollTarget = event.id;
        ctx.activeId = event.id;
        config.onChange?.(event.id);
        config.onScrollTo?.(event.id);
        notify();
        break;
      }

      case 'SET_OFFSET': {
        ctx.offset = event.offset;
        notify();
        break;
      }
    }
  }

  // ── DOM Props ──

  function getNavProps(): Record<string, unknown> {
    return {
      role: 'navigation',
      'aria-label': 'Table of contents',
    };
  }

  function getLinkProps(id: string): Record<string, unknown> {
    const item = findItem(id);
    const isActive = ctx.activeId === id;
    const isDisabled = item?.disabled ?? false;

    return {
      href: `#${id}`,
      'aria-current': isActive ? 'location' : undefined,
      'aria-disabled': isDisabled || undefined,
      'data-active': isActive || undefined,
      'data-depth': item?.depth ?? 0,
    };
  }

  // ── API ──

  return {
    getContext: () => ctx,
    send,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    getNavProps,
    getLinkProps,
  };
}
