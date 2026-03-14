/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tabs state machine — framework-agnostic headless tabs logic.
 * Tabs state machine — framework bağımsız headless tabs mantığı.
 *
 * WAI-ARIA Tabs pattern: tablist + tab + tabpanel rolleri.
 * Roving tabindex: seçili (veya focused) tab tabIndex=0, diğerleri -1.
 * Klavye: ArrowLeft/Right (horizontal) veya ArrowUp/Down (vertical),
 * Home/End ile ilk/son, Enter/Space ile seç (manual modda).
 *
 * @packageDocumentation
 */

import type {
  TabsProps,
  TabsMachineContext,
  TabsEvent,
  TabsListDOMProps,
  TabDOMProps,
  TabPanelDOMProps,
  TabsInteractionState,
  TabItem,
} from './tabs.types';

// ── Yardımcı — Güvenli erişim / Safe access ────────────────────────

function getItem(items: TabItem[], index: number): TabItem | undefined {
  return items[index];
}

// ── Yardımcı — Sonraki aktif indeks / Next enabled index ───────────

function findEnabledIndex(
  items: TabItem[],
  startIndex: number,
  direction: 'forward' | 'backward',
): number {
  const len = items.length;
  if (len === 0) return -1;

  const step = direction === 'forward' ? 1 : -1;
  let index = startIndex;

  for (let i = 0; i < len; i++) {
    index = index + step;
    index = ((index % len) + len) % len;

    const item = getItem(items, index);
    if (item && !item.disabled) {
      return index;
    }
  }

  return -1;
}

function findFirstEnabledIndex(items: TabItem[]): number {
  for (let i = 0; i < items.length; i++) {
    const item = getItem(items, i);
    if (item && !item.disabled) return i;
  }
  return -1;
}

function findLastEnabledIndex(items: TabItem[]): number {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = getItem(items, i);
    if (item && !item.disabled) return i;
  }
  return -1;
}

function findIndexByValue(items: TabItem[], value: string): number {
  for (let i = 0; i < items.length; i++) {
    const item = getItem(items, i);
    if (item && item.value === value) return i;
  }
  return -1;
}

// ── Context oluşturucu / Context creator ────────────────────────────

function createInitialContext(props: TabsProps): TabsMachineContext {
  const selectedValue = props.value ?? props.defaultValue;
  const focusedIndex = selectedValue !== undefined
    ? findIndexByValue(props.items, selectedValue)
    : -1;

  return {
    interactionState: 'idle',
    items: props.items,
    selectedValue,
    focusedIndex: focusedIndex >= 0 ? focusedIndex : findFirstEnabledIndex(props.items),
    disabled: props.disabled ?? false,
    orientation: props.orientation ?? 'horizontal',
    activationMode: props.activationMode ?? 'automatic',
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: TabsMachineContext,
  event: TabsEvent,
): TabsMachineContext {
  // ── Prop güncellemeleri her zaman uygulanır ──
  if (event.type === 'SET_DISABLED') {
    if (event.value === ctx.disabled) return ctx;
    return {
      ...ctx,
      disabled: event.value,
      interactionState: event.value ? 'idle' : ctx.interactionState,
    };
  }

  if (event.type === 'SET_VALUE') {
    if (event.value === ctx.selectedValue) return ctx;
    const idx = findIndexByValue(ctx.items, event.value);
    return {
      ...ctx,
      selectedValue: event.value,
      focusedIndex: idx >= 0 ? idx : ctx.focusedIndex,
    };
  }

  if (event.type === 'SET_ITEMS') {
    const focusedIndex = ctx.selectedValue !== undefined
      ? findIndexByValue(event.items, ctx.selectedValue)
      : findFirstEnabledIndex(event.items);
    return {
      ...ctx,
      items: event.items,
      focusedIndex: focusedIndex >= 0 ? focusedIndex : findFirstEnabledIndex(event.items),
    };
  }

  if (event.type === 'SET_ORIENTATION') {
    if (event.orientation === ctx.orientation) return ctx;
    return { ...ctx, orientation: event.orientation };
  }

  if (event.type === 'SET_ACTIVATION_MODE') {
    if (event.activationMode === ctx.activationMode) return ctx;
    return { ...ctx, activationMode: event.activationMode };
  }

  // ── Disabled durumda etkileşim engellenir ──
  if (ctx.disabled) return ctx;

  // ── Seçim ──
  if (event.type === 'SELECT') {
    if (event.value === ctx.selectedValue) return ctx;
    const idx = findIndexByValue(ctx.items, event.value);
    if (idx < 0) return ctx;
    const item = getItem(ctx.items, idx);
    if (item && item.disabled) return ctx;
    return {
      ...ctx,
      selectedValue: event.value,
      focusedIndex: idx,
    };
  }

  // ── Tab kapatma ──
  if (event.type === 'CLOSE_TAB') {
    const idx = findIndexByValue(ctx.items, event.value);
    if (idx < 0) return ctx;
    const item = getItem(ctx.items, idx);
    if (!item || !item.closable) return ctx;

    const newItems = ctx.items.filter((t) => t.value !== event.value);
    let newSelectedValue = ctx.selectedValue;
    let newFocusedIndex = ctx.focusedIndex;

    // Kapatılan tab seçiliyse → sonraki veya önceki tab'ı seç
    if (ctx.selectedValue === event.value) {
      if (newItems.length === 0) {
        newSelectedValue = undefined;
        newFocusedIndex = -1;
      } else {
        // Aynı indeksteki tab'ı veya son tab'ı seç
        const newIdx = idx >= newItems.length ? newItems.length - 1 : idx;
        const newItem = getItem(newItems, newIdx);
        newSelectedValue = newItem?.value;
        newFocusedIndex = newIdx;
      }
    } else {
      // Seçili tab kapatılmadı, focusedIndex güncelle
      newFocusedIndex = newSelectedValue !== undefined
        ? findIndexByValue(newItems, newSelectedValue)
        : findFirstEnabledIndex(newItems);
    }

    return {
      ...ctx,
      items: newItems,
      selectedValue: newSelectedValue,
      focusedIndex: newFocusedIndex >= 0 ? newFocusedIndex : findFirstEnabledIndex(newItems),
    };
  }

  // ── Focus ──
  if (event.type === 'FOCUS') {
    if (event.index < 0 || event.index >= ctx.items.length) return ctx;
    // automatic modda focus = select
    if (ctx.activationMode === 'automatic') {
      const item = getItem(ctx.items, event.index);
      if (item && !item.disabled) {
        return {
          ...ctx,
          focusedIndex: event.index,
          selectedValue: item.value,
          interactionState: 'focused',
        };
      }
    }
    return {
      ...ctx,
      focusedIndex: event.index,
      interactionState: 'focused',
    };
  }

  if (event.type === 'BLUR') {
    return { ...ctx, interactionState: 'idle' };
  }

  // ── Klavye navigasyon ──
  if (event.type === 'FOCUS_NEXT') {
    const next = findEnabledIndex(ctx.items, ctx.focusedIndex, 'forward');
    if (next < 0 || next === ctx.focusedIndex) return ctx;
    // automatic modda navigate = select
    if (ctx.activationMode === 'automatic') {
      const item = getItem(ctx.items, next);
      if (item) {
        return { ...ctx, focusedIndex: next, selectedValue: item.value };
      }
    }
    return { ...ctx, focusedIndex: next };
  }

  if (event.type === 'FOCUS_PREV') {
    const prev = findEnabledIndex(ctx.items, ctx.focusedIndex, 'backward');
    if (prev < 0 || prev === ctx.focusedIndex) return ctx;
    if (ctx.activationMode === 'automatic') {
      const item = getItem(ctx.items, prev);
      if (item) {
        return { ...ctx, focusedIndex: prev, selectedValue: item.value };
      }
    }
    return { ...ctx, focusedIndex: prev };
  }

  if (event.type === 'FOCUS_FIRST') {
    const first = findFirstEnabledIndex(ctx.items);
    if (first < 0 || first === ctx.focusedIndex) return ctx;
    if (ctx.activationMode === 'automatic') {
      const item = getItem(ctx.items, first);
      if (item) {
        return { ...ctx, focusedIndex: first, selectedValue: item.value };
      }
    }
    return { ...ctx, focusedIndex: first };
  }

  if (event.type === 'FOCUS_LAST') {
    const last = findLastEnabledIndex(ctx.items);
    if (last < 0 || last === ctx.focusedIndex) return ctx;
    if (ctx.activationMode === 'automatic') {
      const item = getItem(ctx.items, last);
      if (item) {
        return { ...ctx, focusedIndex: last, selectedValue: item.value };
      }
    }
    return { ...ctx, focusedIndex: last };
  }

  // ── Etkileşim state geçişleri ──
  const { interactionState } = ctx;
  let nextState: TabsInteractionState = interactionState;

  switch (event.type) {
    case 'POINTER_ENTER':
      if (interactionState === 'idle') nextState = 'hover';
      break;

    case 'POINTER_LEAVE':
      if (interactionState === 'hover') nextState = 'idle';
      break;
  }

  if (nextState === interactionState) return ctx;
  return { ...ctx, interactionState: nextState };
}

// ── DOM Props üreticileri / DOM Props generators ────────────────────

function getListProps(ctx: TabsMachineContext): TabsListDOMProps {
  return {
    role: 'tablist',
    'aria-orientation': ctx.orientation,
    'aria-disabled': ctx.disabled ? true : undefined,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-orientation': ctx.orientation,
  };
}

function getTabProps(
  ctx: TabsMachineContext,
  index: number,
  idPrefix: string,
): TabDOMProps {
  const item = getItem(ctx.items, index);
  const isSelected = item ? item.value === ctx.selectedValue : false;
  const isDisabled = (item ? item.disabled === true : false) || ctx.disabled;
  const isFocusTarget = index === ctx.focusedIndex;

  return {
    role: 'tab',
    tabIndex: isFocusTarget ? 0 : -1,
    'aria-selected': isSelected,
    'aria-disabled': isDisabled ? true : undefined,
    'aria-controls': `${idPrefix}-panel-${item?.value ?? index}`,
    'data-state': isSelected ? 'active' : 'inactive',
    'data-disabled': isDisabled ? '' : undefined,
    id: `${idPrefix}-tab-${item?.value ?? index}`,
  };
}

function getPanelProps(
  ctx: TabsMachineContext,
  value: string,
  idPrefix: string,
): TabPanelDOMProps {
  const isSelected = value === ctx.selectedValue;

  return {
    role: 'tabpanel',
    'aria-labelledby': `${idPrefix}-tab-${value}`,
    id: `${idPrefix}-panel-${value}`,
    tabIndex: 0,
    hidden: !isSelected,
  };
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Tabs API — state machine ve DOM props üreticileri.
 * Tabs API — state machine and DOM props generators.
 */
export interface TabsAPI {
  /** Mevcut context / Current context */
  getContext(): TabsMachineContext;

  /** Event gönder / Send event */
  send(event: TabsEvent): TabsMachineContext;

  /** Tablist DOM attribute'ları / Tablist DOM attributes */
  getListProps(): TabsListDOMProps;

  /** Tab buton DOM attribute'ları / Tab button DOM attributes */
  getTabProps(index: number): TabDOMProps;

  /** TabPanel DOM attribute'ları / TabPanel DOM attributes */
  getPanelProps(value: string): TabPanelDOMProps;

  /** Etkileşim engellenmiş mi / Is interaction blocked */
  isInteractionBlocked(): boolean;

  /** Seçili tab indeksi / Selected tab index */
  getSelectedIndex(): number;

  /** Seçili tab etiketi / Selected tab label */
  getSelectedLabel(): string | undefined;
}

/**
 * Tabs state machine oluştur.
 * Create a tabs state machine.
 *
 * @example
 * ```ts
 * const tabs = createTabs({
 *   items: [
 *     { value: 'home', label: 'Ana Sayfa' },
 *     { value: 'profile', label: 'Profil' },
 *     { value: 'settings', label: 'Ayarlar' },
 *   ],
 *   defaultValue: 'home',
 * });
 *
 * tabs.send({ type: 'SELECT', value: 'profile' });
 * tabs.getContext().selectedValue; // 'profile'
 * ```
 */
export function createTabs(
  props: TabsProps,
  idPrefix = 'tabs',
): TabsAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: TabsEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getListProps() {
      return getListProps(ctx);
    },

    getTabProps(index: number) {
      return getTabProps(ctx, index, idPrefix);
    },

    getPanelProps(value: string) {
      return getPanelProps(ctx, value, idPrefix);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },

    getSelectedIndex() {
      if (ctx.selectedValue === undefined) return -1;
      return findIndexByValue(ctx.items, ctx.selectedValue);
    },

    getSelectedLabel() {
      if (ctx.selectedValue === undefined) return undefined;
      const idx = findIndexByValue(ctx.items, ctx.selectedValue);
      if (idx < 0) return undefined;
      const item = getItem(ctx.items, idx);
      return item?.label;
    },
  };
}
