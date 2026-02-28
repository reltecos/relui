/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SegmentedControl state machine — framework-agnostic headless segmented control logic.
 * SegmentedControl state machine — framework bağımsız headless segmented control mantığı.
 *
 * WAI-ARIA Tabs pattern: tablist + tab rolleri.
 * Roving tabindex: seçili (veya focused) segment tabIndex=0, diğerleri -1.
 * Klavye: ArrowLeft/Right ile navigate, Home/End ile ilk/son, Enter/Space ile seç.
 *
 * @packageDocumentation
 */

import type {
  SegmentedControlProps,
  SegmentedControlMachineContext,
  SegmentedControlEvent,
  SegmentedControlRootDOMProps,
  SegmentedControlItemDOMProps,
  SegmentedControlInteractionState,
  SegmentedControlOption,
} from './segmented-control.types';

// ── Yardımcı — Güvenli erişim / Safe access ────────────────────────

function getOption(
  options: SegmentedControlOption[],
  index: number,
): SegmentedControlOption | undefined {
  return options[index];
}

// ── Yardımcı — Sonraki aktif indeks / Next enabled index ───────────

function findEnabledIndex(
  options: SegmentedControlOption[],
  startIndex: number,
  direction: 'forward' | 'backward',
): number {
  const len = options.length;
  if (len === 0) return -1;

  const step = direction === 'forward' ? 1 : -1;
  let index = startIndex;

  for (let i = 0; i < len; i++) {
    index = index + step;
    index = ((index % len) + len) % len;

    const opt = getOption(options, index);
    if (opt && !opt.disabled) {
      return index;
    }
  }

  return -1;
}

function findFirstEnabledIndex(options: SegmentedControlOption[]): number {
  for (let i = 0; i < options.length; i++) {
    const opt = getOption(options, i);
    if (opt && !opt.disabled) return i;
  }
  return -1;
}

function findLastEnabledIndex(options: SegmentedControlOption[]): number {
  for (let i = options.length - 1; i >= 0; i--) {
    const opt = getOption(options, i);
    if (opt && !opt.disabled) return i;
  }
  return -1;
}

function findIndexByValue(options: SegmentedControlOption[], value: string): number {
  for (let i = 0; i < options.length; i++) {
    const opt = getOption(options, i);
    if (opt && opt.value === value) return i;
  }
  return -1;
}

// ── Context oluşturucu / Context creator ────────────────────────────

function createInitialContext(
  props: SegmentedControlProps,
): SegmentedControlMachineContext {
  const selectedValue = props.value ?? props.defaultValue;
  const focusedIndex = selectedValue !== undefined
    ? findIndexByValue(props.options, selectedValue)
    : -1;

  return {
    interactionState: 'idle',
    options: props.options,
    selectedValue,
    focusedIndex: focusedIndex >= 0 ? focusedIndex : findFirstEnabledIndex(props.options),
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: SegmentedControlMachineContext,
  event: SegmentedControlEvent,
): SegmentedControlMachineContext {
  // ── Prop güncellemeleri her zaman uygulanır ──
  if (event.type === 'SET_DISABLED') {
    if (event.value === ctx.disabled) return ctx;
    return {
      ...ctx,
      disabled: event.value,
      interactionState: event.value ? 'idle' : ctx.interactionState,
    };
  }

  if (event.type === 'SET_READ_ONLY') {
    if (event.value === ctx.readOnly) return ctx;
    return { ...ctx, readOnly: event.value };
  }

  if (event.type === 'SET_VALUE') {
    if (event.value === ctx.selectedValue) return ctx;
    const idx = findIndexByValue(ctx.options, event.value);
    return {
      ...ctx,
      selectedValue: event.value,
      focusedIndex: idx >= 0 ? idx : ctx.focusedIndex,
    };
  }

  if (event.type === 'SET_OPTIONS') {
    const focusedIndex = ctx.selectedValue !== undefined
      ? findIndexByValue(event.options, ctx.selectedValue)
      : findFirstEnabledIndex(event.options);
    return {
      ...ctx,
      options: event.options,
      focusedIndex: focusedIndex >= 0 ? focusedIndex : findFirstEnabledIndex(event.options),
    };
  }

  // ── Disabled durumda etkileşim engellenir ──
  if (ctx.disabled) return ctx;

  // ── Seçim ──
  if (event.type === 'SELECT') {
    if (ctx.readOnly) return ctx;
    if (event.value === ctx.selectedValue) return ctx;
    const idx = findIndexByValue(ctx.options, event.value);
    if (idx < 0) return ctx;
    const opt = getOption(ctx.options, idx);
    if (opt && opt.disabled) return ctx;
    return {
      ...ctx,
      selectedValue: event.value,
      focusedIndex: idx,
    };
  }

  // ── Focus ──
  if (event.type === 'FOCUS') {
    if (event.index < 0 || event.index >= ctx.options.length) return ctx;
    return {
      ...ctx,
      focusedIndex: event.index,
      interactionState: 'focused',
    };
  }

  if (event.type === 'BLUR') {
    if (ctx.interactionState !== 'focused') {
      return { ...ctx, interactionState: 'idle' };
    }
    return { ...ctx, interactionState: 'idle' };
  }

  // ── Klavye navigasyon ──
  if (event.type === 'FOCUS_NEXT') {
    const next = findEnabledIndex(ctx.options, ctx.focusedIndex, 'forward');
    if (next < 0 || next === ctx.focusedIndex) return ctx;
    return { ...ctx, focusedIndex: next };
  }

  if (event.type === 'FOCUS_PREV') {
    const prev = findEnabledIndex(ctx.options, ctx.focusedIndex, 'backward');
    if (prev < 0 || prev === ctx.focusedIndex) return ctx;
    return { ...ctx, focusedIndex: prev };
  }

  if (event.type === 'FOCUS_FIRST') {
    const first = findFirstEnabledIndex(ctx.options);
    if (first < 0 || first === ctx.focusedIndex) return ctx;
    return { ...ctx, focusedIndex: first };
  }

  if (event.type === 'FOCUS_LAST') {
    const last = findLastEnabledIndex(ctx.options);
    if (last < 0 || last === ctx.focusedIndex) return ctx;
    return { ...ctx, focusedIndex: last };
  }

  // ── Etkileşim state geçişleri ──
  const { interactionState } = ctx;
  let nextState: SegmentedControlInteractionState = interactionState;

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

function getRootProps(ctx: SegmentedControlMachineContext): SegmentedControlRootDOMProps {
  return {
    role: 'tablist',
    'aria-disabled': ctx.disabled ? true : undefined,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
  };
}

function getItemProps(
  ctx: SegmentedControlMachineContext,
  index: number,
  idPrefix: string,
): SegmentedControlItemDOMProps {
  const opt = getOption(ctx.options, index);
  const isSelected = opt ? opt.value === ctx.selectedValue : false;
  const isDisabled = (opt ? opt.disabled === true : false) || ctx.disabled;
  const isFocusTarget = index === ctx.focusedIndex;

  return {
    role: 'tab',
    tabIndex: isFocusTarget ? 0 : -1,
    'aria-selected': isSelected,
    'aria-disabled': isDisabled ? true : undefined,
    'data-state': isSelected ? 'active' : 'inactive',
    'data-disabled': isDisabled ? '' : undefined,
    id: `${idPrefix}-tab-${index}`,
  };
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * SegmentedControl API — state machine ve DOM props üreticileri.
 * SegmentedControl API — state machine and DOM props generators.
 */
export interface SegmentedControlAPI {
  /** Mevcut context / Current context */
  getContext(): SegmentedControlMachineContext;

  /** Event gönder / Send event */
  send(event: SegmentedControlEvent): SegmentedControlMachineContext;

  /** Root DOM attribute'ları / Root DOM attributes */
  getRootProps(): SegmentedControlRootDOMProps;

  /** Item DOM attribute'ları / Item DOM attributes */
  getItemProps(index: number): SegmentedControlItemDOMProps;

  /** Etkileşim engellenmiş mi / Is interaction blocked */
  isInteractionBlocked(): boolean;

  /** Seçili segment indeksi / Selected segment index */
  getSelectedIndex(): number;

  /** Seçili segment etiketi / Selected segment label */
  getSelectedLabel(): string | undefined;
}

/**
 * SegmentedControl state machine oluştur.
 * Create a segmented control state machine.
 *
 * @example
 * ```ts
 * const sc = createSegmentedControl({
 *   options: [
 *     { value: 'list', label: 'Liste' },
 *     { value: 'grid', label: 'Izgara' },
 *     { value: 'kanban', label: 'Kanban' },
 *   ],
 *   defaultValue: 'list',
 * });
 *
 * sc.send({ type: 'SELECT', value: 'grid' });
 * sc.getContext().selectedValue; // 'grid'
 * ```
 */
export function createSegmentedControl(
  props: SegmentedControlProps,
  idPrefix = 'sc',
): SegmentedControlAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: SegmentedControlEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getRootProps() {
      return getRootProps(ctx);
    },

    getItemProps(index: number) {
      return getItemProps(ctx, index, idPrefix);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },

    getSelectedIndex() {
      if (ctx.selectedValue === undefined) return -1;
      return findIndexByValue(ctx.options, ctx.selectedValue);
    },

    getSelectedLabel() {
      if (ctx.selectedValue === undefined) return undefined;
      const idx = findIndexByValue(ctx.options, ctx.selectedValue);
      if (idx < 0) return undefined;
      const opt = getOption(ctx.options, idx);
      return opt?.label;
    },
  };
}
