/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Cascader bileşeni tip tanımları.
 * Cascader component type definitions.
 *
 * Hiyerarşik, çok seviyeli seçim bileşeni.
 * Hierarchical, multi-level selection component.
 *
 * @packageDocumentation
 */

import type { SelectVariant, SelectSize } from '../select/select.types';

// ── Görsel varyantlar / Visual variants ─────────────────────────────

/** Cascader görsel varyantı / Cascader visual variant */
export type CascaderVariant = SelectVariant;

/** Cascader boyutu / Cascader size */
export type CascaderSize = SelectSize;

// ── Option / Seçenek tanımı ─────────────────────────────────────────

/** Cascader seçenek değeri / Cascader option value */
export type CascaderValue = string | number;

/**
 * Cascader seçenek tanımı (hiyerarşik).
 * Cascader option definition (hierarchical).
 */
export interface CascaderOption {
  /** Seçenek değeri / Option value */
  value: CascaderValue;

  /** Görüntülenen metin / Display label */
  label: string;

  /** Pasif mi / Is disabled */
  disabled?: boolean;

  /** Alt seçenekler (alt seviye) / Child options (sub-level) */
  children?: CascaderOption[];
}

// ── Etkileşim durumu / Interaction state ────────────────────────────

/** Cascader etkileşim durumu / Cascader interaction state */
export type CascaderInteractionState = 'idle' | 'hover' | 'focused' | 'open';

// ── Seçim modu / Selection mode ─────────────────────────────────────

/**
 * expandTrigger: Alt seviyeyi açma tetikleyicisi.
 * expandTrigger: Trigger to expand sub-level.
 * - 'click': Tıklama ile aç (varsayılan)
 * - 'hover': Üzerine gelince aç
 */
export type CascaderExpandTrigger = 'click' | 'hover';

// ── Props ───────────────────────────────────────────────────────────

/**
 * Cascader bileşeni props'ları.
 * Cascader component props.
 */
export interface CascaderProps {
  /** Hiyerarşik seçenekler / Hierarchical options */
  options: CascaderOption[];

  /** Seçili yol (controlled) / Selected path (controlled) */
  value?: CascaderValue[];

  /** Varsayılan yol (uncontrolled) / Default path */
  defaultValue?: CascaderValue[];

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /** Pasif mi / Is disabled */
  disabled?: boolean;

  /** Salt okunur mu / Is read-only */
  readOnly?: boolean;

  /** Geçersiz mi / Is invalid */
  invalid?: boolean;

  /** Zorunlu mu / Is required */
  required?: boolean;

  /** Alt seviye açma tetikleyicisi / Sub-level expand trigger */
  expandTrigger?: CascaderExpandTrigger;
}

// ── Machine Context ─────────────────────────────────────────────────

/**
 * Cascader state machine context'i.
 * Cascader state machine context.
 */
export interface CascaderMachineContext {
  /** Etkileşim durumu / Interaction state */
  interactionState: CascaderInteractionState;

  /** Tüm seçenekler (hiyerarşik) / All options (hierarchical) */
  options: CascaderOption[];

  /** Seçili yol (value dizisi) / Selected path (value array) */
  selectedPath: CascaderValue[];

  /** Dropdown açık mı / Is dropdown open */
  isOpen: boolean;

  /**
   * Aktif yol — hangi seçenek her seviyede highlight/expand edilmiş.
   * Active path — which option is highlighted/expanded at each level.
   * Uzunluğu = açık kolon sayısı.
   * Length = number of open columns.
   */
  activePath: CascaderValue[];

  /**
   * Highlight edilen indeks — aktif kolonun içindeki vurgulanan seçenek indeksi.
   * Highlighted index — index of highlighted option in the active column.
   */
  highlightedIndex: number;

  /** Aktif kolon seviyesi (0-based) / Active column level (0-based) */
  activeLevel: number;

  /** Placeholder / Placeholder */
  placeholder: string;

  /** Alt seviye açma tetikleyicisi / Sub-level expand trigger */
  expandTrigger: CascaderExpandTrigger;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Salt okunur mu / Is read-only */
  readOnly: boolean;

  /** Geçersiz mi / Is invalid */
  invalid: boolean;

  /** Zorunlu mu / Is required */
  required: boolean;
}

// ── Events ──────────────────────────────────────────────────────────

/**
 * Cascader state machine event'leri.
 * Cascader state machine events.
 */
export type CascaderEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SELECT'; path: CascaderValue[] }
  | { type: 'EXPAND'; level: number; value: CascaderValue }
  | { type: 'HIGHLIGHT'; index: number }
  | { type: 'HIGHLIGHT_NEXT' }
  | { type: 'HIGHLIGHT_PREV' }
  | { type: 'HIGHLIGHT_FIRST' }
  | { type: 'HIGHLIGHT_LAST' }
  | { type: 'LEVEL_NEXT' }
  | { type: 'LEVEL_PREV' }
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_READ_ONLY'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean }
  | { type: 'SET_OPTIONS'; options: CascaderOption[] }
  | { type: 'SET_VALUE'; value: CascaderValue[] };

// ── DOM Props ───────────────────────────────────────────────────────

/**
 * Cascader trigger DOM attribute'ları.
 * Cascader trigger DOM attributes.
 */
export interface CascaderTriggerDOMProps {
  role: 'combobox';
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-disabled'?: true;
  'aria-readonly'?: true;
  'aria-invalid'?: true;
  'aria-required'?: true;
  'data-state': CascaderInteractionState;
  'data-disabled'?: '';
  'data-readonly'?: '';
  'data-invalid'?: '';
  tabIndex: 0;
}

/**
 * Cascader kolon (column) DOM attribute'ları.
 * Cascader column DOM attributes.
 */
export interface CascaderColumnDOMProps {
  role: 'listbox';
  tabIndex: -1;
  'aria-label': string;
}

/**
 * Cascader option DOM attribute'ları.
 * Cascader option DOM attributes.
 */
export interface CascaderOptionDOMProps {
  role: 'option';
  'aria-selected': boolean;
  'aria-disabled'?: true;
  'data-highlighted'?: '';
  'data-disabled'?: '';
  'data-expanded'?: '';
}

// ── API ─────────────────────────────────────────────────────────────

/**
 * Cascader API — state machine ve DOM props üreticileri.
 * Cascader API — state machine and DOM props generators.
 */
export interface CascaderAPI {
  /** Mevcut context / Current context */
  getContext(): CascaderMachineContext;

  /** Event gönder / Send event */
  send(event: CascaderEvent): CascaderMachineContext;

  /** Trigger DOM attribute'ları / Trigger DOM attributes */
  getTriggerProps(): CascaderTriggerDOMProps;

  /** Kolon DOM attribute'ları / Column DOM attributes */
  getColumnProps(level: number): CascaderColumnDOMProps;

  /** Option DOM attribute'ları / Option DOM attributes */
  getOptionProps(level: number, index: number): CascaderOptionDOMProps;

  /** Dropdown açık mı / Is dropdown open */
  isOpen(): boolean;

  /** Etkileşim engellenmiş mi / Is interaction blocked */
  isInteractionBlocked(): boolean;

  /**
   * Verilen seviyedeki seçenekleri al.
   * Get options at given level.
   */
  getOptionsAtLevel(level: number): CascaderOption[];

  /**
   * Seçili yolun etiketlerini al.
   * Get labels for selected path.
   */
  getSelectedLabels(): string[];

  /**
   * Seçili yolun son etiketini al.
   * Get last label of selected path.
   */
  getSelectedLabel(): string | undefined;
}
