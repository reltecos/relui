/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Accordion state machine.
 *
 * @packageDocumentation
 */

import type { AccordionConfig, AccordionContext, AccordionEvent, AccordionAPI } from './accordion.types';

/**
 * Accordion state machine olusturur.
 * Creates an accordion state machine.
 */
export function createAccordion(config: AccordionConfig = {}): AccordionAPI {
  const {
    allowMultiple = false,
    defaultExpanded = [],
    onExpandChange,
  } = config;

  // ── State ──
  const ctx: AccordionContext = {
    expandedIds: new Set(defaultExpanded),
  };

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    onExpandChange?.(Array.from(ctx.expandedIds));
    listeners.forEach((fn) => fn());
  }

  // ── Helpers ──
  function setExpanded(ids: Set<string>): void {
    (ctx as { expandedIds: Set<string> }).expandedIds = ids;
  }

  // ── Send ──
  function send(event: AccordionEvent): void {
    switch (event.type) {
      case 'TOGGLE': {
        const next = new Set(ctx.expandedIds);
        if (next.has(event.itemId)) {
          next.delete(event.itemId);
        } else {
          if (allowMultiple) {
            next.add(event.itemId);
          } else {
            next.clear();
            next.add(event.itemId);
          }
        }
        setExpanded(next);
        notify();
        break;
      }
      case 'EXPAND': {
        if (ctx.expandedIds.has(event.itemId)) return;
        const next = allowMultiple ? new Set(ctx.expandedIds) : new Set<string>();
        next.add(event.itemId);
        setExpanded(next);
        notify();
        break;
      }
      case 'COLLAPSE': {
        if (!ctx.expandedIds.has(event.itemId)) return;
        const next = new Set(ctx.expandedIds);
        next.delete(event.itemId);
        setExpanded(next);
        notify();
        break;
      }
      case 'EXPAND_ALL': {
        if (!allowMultiple) return;
        const next = new Set(event.itemIds);
        if (next.size === ctx.expandedIds.size) {
          let same = true;
          next.forEach((id) => {
            if (!ctx.expandedIds.has(id)) same = false;
          });
          if (same) return;
        }
        setExpanded(next);
        notify();
        break;
      }
      case 'COLLAPSE_ALL': {
        if (ctx.expandedIds.size === 0) return;
        setExpanded(new Set<string>());
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): AccordionContext {
      return ctx;
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
  };
}
