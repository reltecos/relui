/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PropertyGrid state machine — ozellik duzenleme yonetimi.
 * PropertyGrid state machine — property editing management.
 *
 * @packageDocumentation
 */

import type {
  PropertyGridConfig,
  PropertyGridContext,
  PropertyGridEvent,
  PropertyGridAPI,
} from './property-grid.types';

/**
 * PropertyGrid state machine olusturur.
 * Creates a PropertyGrid state machine.
 */
export function createPropertyGrid(config: PropertyGridConfig): PropertyGridAPI {
  const { properties, onValueChange } = config;

  // ── State ──
  let values = new Map<string, unknown>();
  let collapsedCategories = new Set<string>();
  let filter = '';

  // Init values from property defs
  for (const prop of properties) {
    values.set(prop.key, prop.value);
  }

  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  function getContext(): PropertyGridContext {
    return { values, collapsedCategories, filter };
  }

  function send(event: PropertyGridEvent): void {
    switch (event.type) {
      case 'SET_VALUE': {
        const prop = properties.find((p) => p.key === event.key);
        if (!prop || prop.readonly) return;
        values = new Map(values);
        values.set(event.key, event.value);
        onValueChange?.(event.key, event.value);
        notify();
        break;
      }
      case 'TOGGLE_CATEGORY': {
        collapsedCategories = new Set(collapsedCategories);
        if (collapsedCategories.has(event.category)) {
          collapsedCategories.delete(event.category);
        } else {
          collapsedCategories.add(event.category);
        }
        notify();
        break;
      }
      case 'EXPAND_ALL': {
        if (collapsedCategories.size === 0) return;
        collapsedCategories = new Set();
        notify();
        break;
      }
      case 'COLLAPSE_ALL': {
        collapsedCategories = new Set(event.categories);
        notify();
        break;
      }
      case 'SET_FILTER': {
        filter = event.filter;
        notify();
        break;
      }
    }
  }

  function subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }

  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy };
}
