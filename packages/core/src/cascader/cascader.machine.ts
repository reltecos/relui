/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Cascader state machine — framework-agnostic headless cascader logic.
 * Cascader state machine — framework bağımsız headless cascader mantığı.
 *
 * Hiyerarşik seçim, çok seviyeli kolon yönetimi, klavye navigasyonu.
 * Hierarchical selection, multi-level column management, keyboard navigation.
 *
 * @packageDocumentation
 */

import type {
  CascaderProps,
  CascaderMachineContext,
  CascaderEvent,
  CascaderTriggerDOMProps,
  CascaderColumnDOMProps,
  CascaderOptionDOMProps,
  CascaderOption,
  CascaderValue,
  CascaderInteractionState,
  CascaderAPI,
} from './cascader.types';

// ── Yardımcı — Güvenli erişim / Safe access ────────────────────────

function getOption(options: CascaderOption[], index: number): CascaderOption | undefined {
  return options[index];
}

// ── Yardımcı — Seçenek ağacında yol izleme / Path traversal ────────

/**
 * Verilen yol değerlerine göre hiyerarşik seçenekleri izle.
 * Traverse hierarchical options by given path values.
 *
 * @returns Her seviyedeki seçenek listesi / Options at each level
 */
export function getColumnsFromPath(
  rootOptions: CascaderOption[],
  path: CascaderValue[],
): CascaderOption[][] {
  const columns: CascaderOption[][] = [rootOptions];
  let current = rootOptions;

  for (const val of path) {
    const found = current.find((opt) => opt.value === val);
    if (found && found.children && found.children.length > 0) {
      columns.push(found.children);
      current = found.children;
    } else {
      break;
    }
  }

  return columns;
}

/**
 * Verilen yolun etiketlerini al.
 * Get labels for given path.
 */
export function getLabelsFromPath(
  rootOptions: CascaderOption[],
  path: CascaderValue[],
): string[] {
  const labels: string[] = [];
  let current = rootOptions;

  for (const val of path) {
    const found = current.find((opt) => opt.value === val);
    if (found) {
      labels.push(found.label);
      if (found.children && found.children.length > 0) {
        current = found.children;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return labels;
}

/**
 * Verilen seviyedeki seçenekleri al.
 * Get options at given level.
 */
function getOptionsAtLevelFromContext(
  rootOptions: CascaderOption[],
  activePath: CascaderValue[],
  level: number,
): CascaderOption[] {
  if (level === 0) return rootOptions;

  let current = rootOptions;
  for (let i = 0; i < level; i++) {
    const val = activePath[i];
    if (val === undefined) return [];
    const found = current.find((opt) => opt.value === val);
    if (found && found.children && found.children.length > 0) {
      current = found.children;
    } else {
      return [];
    }
  }
  return current;
}

// ── Yardımcı — Sonraki aktif indeks / Next enabled index ───────────

function findEnabledIndex(
  options: CascaderOption[],
  startIndex: number,
  direction: 'forward' | 'backward',
  wrap: boolean = true,
): number {
  const len = options.length;
  if (len === 0) return -1;

  const step = direction === 'forward' ? 1 : -1;
  let index = startIndex;

  for (let i = 0; i < len; i++) {
    index = index + step;
    if (wrap) {
      index = ((index % len) + len) % len;
    } else {
      if (index < 0 || index >= len) return -1;
    }

    const opt = getOption(options, index);
    if (opt && !opt.disabled) return index;
  }

  return -1;
}

function findFirstEnabledIndex(options: CascaderOption[]): number {
  for (let i = 0; i < options.length; i++) {
    const opt = getOption(options, i);
    if (opt && !opt.disabled) return i;
  }
  return -1;
}

function findLastEnabledIndex(options: CascaderOption[]): number {
  for (let i = options.length - 1; i >= 0; i--) {
    const opt = getOption(options, i);
    if (opt && !opt.disabled) return i;
  }
  return -1;
}

function findIndexByValue(options: CascaderOption[], value: CascaderValue | undefined): number {
  if (value === undefined) return -1;
  for (let i = 0; i < options.length; i++) {
    const opt = getOption(options, i);
    if (opt && opt.value === value) return i;
  }
  return -1;
}

// ── Context oluşturucu / Context creator ────────────────────────────

function createInitialContext(props: CascaderProps): CascaderMachineContext {
  const selectedPath = props.value ?? props.defaultValue ?? [];

  return {
    interactionState: 'idle',
    options: props.options,
    selectedPath,
    isOpen: false,
    activePath: [],
    highlightedIndex: -1,
    activeLevel: 0,
    placeholder: props.placeholder ?? '',
    expandTrigger: props.expandTrigger ?? 'click',
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: CascaderMachineContext,
  event: CascaderEvent,
): CascaderMachineContext {
  // ── Prop güncellemeleri her zaman uygulanır ──
  if (event.type === 'SET_DISABLED') {
    if (event.value === ctx.disabled) return ctx;
    return {
      ...ctx,
      disabled: event.value,
      interactionState: event.value ? 'idle' : ctx.interactionState,
      isOpen: event.value ? false : ctx.isOpen,
      activePath: event.value ? [] : ctx.activePath,
      highlightedIndex: event.value ? -1 : ctx.highlightedIndex,
      activeLevel: event.value ? 0 : ctx.activeLevel,
    };
  }

  if (event.type === 'SET_READ_ONLY') {
    if (event.value === ctx.readOnly) return ctx;
    return { ...ctx, readOnly: event.value };
  }

  if (event.type === 'SET_INVALID') {
    if (event.value === ctx.invalid) return ctx;
    return { ...ctx, invalid: event.value };
  }

  if (event.type === 'SET_OPTIONS') {
    return {
      ...ctx,
      options: event.options,
      activePath: [],
      highlightedIndex: -1,
      activeLevel: 0,
    };
  }

  if (event.type === 'SET_VALUE') {
    const pathsEqual = ctx.selectedPath.length === event.value.length &&
      ctx.selectedPath.every((v, i) => v === event.value[i]);
    if (pathsEqual) return ctx;
    return { ...ctx, selectedPath: event.value };
  }

  // ── Disabled durumda etkileşim engellenir ──
  if (ctx.disabled) return ctx;

  // ── Dropdown açma/kapama ──
  if (event.type === 'OPEN') {
    if (ctx.isOpen || ctx.readOnly) return ctx;
    // Açılırken seçili yolu active path olarak ayarla
    const activePath = [...ctx.selectedPath];
    const levelOptions = getOptionsAtLevelFromContext(ctx.options, activePath, 0);
    const hlValue = activePath[0];
    const hlIndex = hlValue !== undefined
      ? findIndexByValue(levelOptions, hlValue)
      : findFirstEnabledIndex(levelOptions);

    return {
      ...ctx,
      isOpen: true,
      interactionState: 'open',
      activePath,
      activeLevel: 0,
      highlightedIndex: hlIndex >= 0 ? hlIndex : findFirstEnabledIndex(levelOptions),
    };
  }

  if (event.type === 'CLOSE') {
    if (!ctx.isOpen) return ctx;
    return {
      ...ctx,
      isOpen: false,
      interactionState: 'focused',
      activePath: [],
      highlightedIndex: -1,
      activeLevel: 0,
    };
  }

  if (event.type === 'TOGGLE') {
    if (ctx.readOnly) return ctx;
    if (ctx.isOpen) {
      return {
        ...ctx,
        isOpen: false,
        interactionState: 'focused',
        activePath: [],
        highlightedIndex: -1,
        activeLevel: 0,
      };
    }
    const activePath = [...ctx.selectedPath];
    const levelOptions = getOptionsAtLevelFromContext(ctx.options, activePath, 0);
    const hlValue = activePath[0];
    const hlIndex = hlValue !== undefined
      ? findIndexByValue(levelOptions, hlValue)
      : findFirstEnabledIndex(levelOptions);

    return {
      ...ctx,
      isOpen: true,
      interactionState: 'open',
      activePath,
      activeLevel: 0,
      highlightedIndex: hlIndex >= 0 ? hlIndex : findFirstEnabledIndex(levelOptions),
    };
  }

  // ── Seçim (yaprak düğüm — son seviye) ──
  if (event.type === 'SELECT') {
    return {
      ...ctx,
      selectedPath: event.path,
      isOpen: false,
      interactionState: 'focused',
      activePath: [],
      highlightedIndex: -1,
      activeLevel: 0,
    };
  }

  // ── Expand — belirli seviyede seçenek genişlet ──
  if (event.type === 'EXPAND') {
    if (!ctx.isOpen) return ctx;
    const { level, value } = event;

    // Aktif yolu bu seviyeye kadar kes, yeni değeri ekle
    const newActivePath = ctx.activePath.slice(0, level);
    newActivePath[level] = value;

    // Highlight'ı expand edilen seçenekte tut
    const levelOptions = getOptionsAtLevelFromContext(ctx.options, newActivePath, level);
    const hlIndex = findIndexByValue(levelOptions, value);

    return {
      ...ctx,
      activePath: newActivePath,
      activeLevel: level,
      highlightedIndex: hlIndex >= 0 ? hlIndex : -1,
    };
  }

  // ── Highlight ──
  if (event.type === 'HIGHLIGHT') {
    if (!ctx.isOpen) return ctx;
    const levelOptions = getOptionsAtLevelFromContext(
      ctx.options,
      ctx.activePath,
      ctx.activeLevel,
    );
    if (event.index >= 0 && event.index < levelOptions.length) {
      const opt = getOption(levelOptions, event.index);
      if (opt && opt.disabled) return ctx;
    }
    return { ...ctx, highlightedIndex: event.index };
  }

  if (event.type === 'HIGHLIGHT_NEXT') {
    if (!ctx.isOpen) return ctx;
    const levelOptions = getOptionsAtLevelFromContext(
      ctx.options,
      ctx.activePath,
      ctx.activeLevel,
    );
    const next = findEnabledIndex(levelOptions, ctx.highlightedIndex, 'forward');
    if (next < 0 || next === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: next };
  }

  if (event.type === 'HIGHLIGHT_PREV') {
    if (!ctx.isOpen) return ctx;
    const levelOptions = getOptionsAtLevelFromContext(
      ctx.options,
      ctx.activePath,
      ctx.activeLevel,
    );
    const prev = findEnabledIndex(levelOptions, ctx.highlightedIndex, 'backward');
    if (prev < 0 || prev === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: prev };
  }

  if (event.type === 'HIGHLIGHT_FIRST') {
    if (!ctx.isOpen) return ctx;
    const levelOptions = getOptionsAtLevelFromContext(
      ctx.options,
      ctx.activePath,
      ctx.activeLevel,
    );
    const first = findFirstEnabledIndex(levelOptions);
    if (first < 0 || first === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: first };
  }

  if (event.type === 'HIGHLIGHT_LAST') {
    if (!ctx.isOpen) return ctx;
    const levelOptions = getOptionsAtLevelFromContext(
      ctx.options,
      ctx.activePath,
      ctx.activeLevel,
    );
    const last = findLastEnabledIndex(levelOptions);
    if (last < 0 || last === ctx.highlightedIndex) return ctx;
    return { ...ctx, highlightedIndex: last };
  }

  // ── Level navigasyonu (ArrowRight / ArrowLeft) ──
  if (event.type === 'LEVEL_NEXT') {
    if (!ctx.isOpen) return ctx;
    // Mevcut seviyedeki highlight edilen seçeneğin children'ı varsa bir sonraki seviyeye geç
    const levelOptions = getOptionsAtLevelFromContext(
      ctx.options,
      ctx.activePath,
      ctx.activeLevel,
    );
    const currentOpt = getOption(levelOptions, ctx.highlightedIndex);
    if (!currentOpt || !currentOpt.children || currentOpt.children.length === 0) return ctx;
    if (currentOpt.disabled) return ctx;

    // Expand et ve bir sonraki seviyeye geç
    const newActivePath = ctx.activePath.slice(0, ctx.activeLevel);
    newActivePath[ctx.activeLevel] = currentOpt.value;

    const nextLevel = ctx.activeLevel + 1;
    const nextLevelOptions = getOptionsAtLevelFromContext(
      ctx.options,
      newActivePath,
      nextLevel,
    );
    const firstEnabled = findFirstEnabledIndex(nextLevelOptions);

    return {
      ...ctx,
      activePath: newActivePath,
      activeLevel: nextLevel,
      highlightedIndex: firstEnabled >= 0 ? firstEnabled : 0,
    };
  }

  if (event.type === 'LEVEL_PREV') {
    if (!ctx.isOpen) return ctx;
    if (ctx.activeLevel <= 0) return ctx;

    const prevLevel = ctx.activeLevel - 1;
    // Önceki seviyedeki aktif değerin indeksini bul
    const prevLevelOptions = getOptionsAtLevelFromContext(
      ctx.options,
      ctx.activePath,
      prevLevel,
    );
    const prevValue = ctx.activePath[prevLevel];
    const prevIndex = prevValue !== undefined
      ? findIndexByValue(prevLevelOptions, prevValue)
      : 0;

    return {
      ...ctx,
      activeLevel: prevLevel,
      highlightedIndex: prevIndex >= 0 ? prevIndex : 0,
    };
  }

  // ── Etkileşim state geçişleri ──
  const { interactionState } = ctx;
  let nextState: CascaderInteractionState = interactionState;

  switch (event.type) {
    case 'POINTER_ENTER':
      if (interactionState === 'idle') {
        nextState = 'hover';
      }
      break;

    case 'POINTER_LEAVE':
      if (interactionState === 'hover') {
        nextState = 'idle';
      }
      break;

    case 'FOCUS':
      if (!ctx.isOpen) {
        nextState = 'focused';
      }
      break;

    case 'BLUR':
      if (ctx.isOpen) {
        return {
          ...ctx,
          isOpen: false,
          interactionState: 'idle',
          activePath: [],
          highlightedIndex: -1,
          activeLevel: 0,
        };
      }
      nextState = 'idle';
      break;
  }

  if (nextState === interactionState) return ctx;
  return { ...ctx, interactionState: nextState };
}

// ── DOM Props üreticileri / DOM Props generators ────────────────────

function getTriggerProps(ctx: CascaderMachineContext): CascaderTriggerDOMProps {
  return {
    role: 'combobox',
    'aria-expanded': ctx.isOpen,
    'aria-haspopup': 'listbox',
    'aria-disabled': ctx.disabled ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
    'data-state': ctx.interactionState,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
    tabIndex: 0,
  };
}

function getColumnProps(level: number): CascaderColumnDOMProps {
  return {
    role: 'listbox',
    tabIndex: -1,
    'aria-label': `Seviye ${level + 1}`,
  };
}

function getOptionProps(
  ctx: CascaderMachineContext,
  level: number,
  index: number,
): CascaderOptionDOMProps {
  const levelOptions = getOptionsAtLevelFromContext(ctx.options, ctx.activePath, level);
  const opt = getOption(levelOptions, index);
  if (!opt) {
    return {
      role: 'option',
      'aria-selected': false,
    };
  }

  const isSelected = ctx.selectedPath[level] === opt.value;
  const isHighlighted = level === ctx.activeLevel && index === ctx.highlightedIndex;
  const isDisabled = opt.disabled === true;
  const isExpanded = ctx.activePath[level] === opt.value &&
    opt.children !== undefined && opt.children.length > 0;

  return {
    role: 'option',
    'aria-selected': isSelected,
    'aria-disabled': isDisabled ? true : undefined,
    'data-highlighted': isHighlighted ? '' : undefined,
    'data-disabled': isDisabled ? '' : undefined,
    'data-expanded': isExpanded ? '' : undefined,
  };
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Cascader state machine oluştur.
 * Create a cascader state machine.
 *
 * @example
 * ```ts
 * const cascader = createCascader({
 *   options: [
 *     {
 *       value: 'tr', label: 'Türkiye',
 *       children: [
 *         { value: 'ist', label: 'İstanbul' },
 *         { value: 'ank', label: 'Ankara' },
 *       ],
 *     },
 *     {
 *       value: 'us', label: 'ABD',
 *       children: [
 *         { value: 'ny', label: 'New York' },
 *         { value: 'la', label: 'Los Angeles' },
 *       ],
 *     },
 *   ],
 *   placeholder: 'Konum seçin',
 * });
 *
 * cascader.send({ type: 'OPEN' });
 * cascader.send({ type: 'SELECT', path: ['tr', 'ist'] });
 * cascader.getSelectedLabels(); // ['Türkiye', 'İstanbul']
 * ```
 */
export function createCascader(props: CascaderProps): CascaderAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: CascaderEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getTriggerProps() {
      return getTriggerProps(ctx);
    },

    getColumnProps(level: number) {
      return getColumnProps(level);
    },

    getOptionProps(level: number, index: number) {
      return getOptionProps(ctx, level, index);
    },

    isOpen() {
      return ctx.isOpen;
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },

    getOptionsAtLevel(level: number) {
      return getOptionsAtLevelFromContext(ctx.options, ctx.activePath, level);
    },

    getSelectedLabels() {
      return getLabelsFromPath(ctx.options, ctx.selectedPath);
    },

    getSelectedLabel() {
      const labels = getLabelsFromPath(ctx.options, ctx.selectedPath);
      return labels.length > 0 ? labels[labels.length - 1] : undefined;
    },
  };
}
