/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DropdownTree bileşeni tip tanımları.
 * DropdownTree component type definitions.
 *
 * Dropdown içinde tree view — hiyerarşik seçim bileşeni.
 * Tree view inside a dropdown — hierarchical selection component.
 *
 * @packageDocumentation
 */

import type {
  SelectVariant,
  SelectSize,
  SelectInteractionState,
  SelectValue,
} from '../select/select.types';

// Re-export ortak tipler
export type {
  SelectVariant as DropdownTreeVariant,
  SelectSize as DropdownTreeSize,
  SelectValue,
};

/** DropdownTree etkileşim durumu / DropdownTree interaction state */
export type DropdownTreeInteractionState = SelectInteractionState;

/** Seçim modu / Selection mode */
export type DropdownTreeSelectionMode = 'single' | 'multiple';

// ── Tree node tanımı / Tree node definition ─────────────────────────

/**
 * Ağaç düğümü tanımı.
 * Tree node definition.
 */
export interface TreeNode {
  /** Düğüm değeri / Node value */
  value: SelectValue;

  /** Görüntülenen etiket / Display label */
  label: string;

  /** Alt düğümler / Child nodes */
  children?: TreeNode[];

  /** Pasif mi / Is disabled */
  disabled?: boolean;
}

// ── Düzleştirilmiş düğüm / Flattened node ──────────────────────────

/**
 * Düzleştirilmiş tree node (render sırasında kullanılır).
 * Flattened tree node (used during render).
 */
export interface FlatTreeNode {
  /** Düğüm değeri / Node value */
  value: SelectValue;

  /** Görüntülenen etiket / Display label */
  label: string;

  /** Derinlik seviyesi (0-tabanlı) / Depth level (0-based) */
  depth: number;

  /** Alt düğümleri var mı / Has children */
  hasChildren: boolean;

  /** Genişletilmiş mi / Is expanded */
  isExpanded: boolean;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Parent value (kök için undefined) / Parent value (undefined for root) */
  parentValue: SelectValue | undefined;
}

/** Filtre fonksiyonu / Filter function */
export type DropdownTreeFilterFn = (node: TreeNode, searchValue: string) => boolean;

// ── Props ───────────────────────────────────────────────────────────

/**
 * DropdownTree bileşeni props'ları.
 * DropdownTree component props.
 */
export interface DropdownTreeProps {
  /** Ağaç düğümleri / Tree nodes */
  nodes: TreeNode[];

  /** Seçili değer (single mode) / Selected value (single mode) */
  value?: SelectValue;

  /** Seçili değerler (multiple mode) / Selected values (multiple mode) */
  values?: SelectValue[];

  /** Varsayılan değer (single, uncontrolled) / Default value (single, uncontrolled) */
  defaultValue?: SelectValue;

  /** Varsayılan değerler (multiple, uncontrolled) / Default values (multiple, uncontrolled) */
  defaultValues?: SelectValue[];

  /** Seçim modu / Selection mode */
  selectionMode?: DropdownTreeSelectionMode;

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

  /** Başlangıçta tüm düğümler açık mı / Are all nodes expanded initially */
  expandAll?: boolean;

  /** Özel filtre fonksiyonu / Custom filter function */
  filterFn?: DropdownTreeFilterFn;
}

// ── Machine Context ─────────────────────────────────────────────────

/**
 * DropdownTree state machine context'i.
 * DropdownTree state machine context.
 */
export interface DropdownTreeMachineContext {
  /** Etkileşim durumu / Interaction state */
  interactionState: DropdownTreeInteractionState;

  /** Ağaç düğümleri / Tree nodes */
  nodes: TreeNode[];

  /** Genişletilmiş düğüm value'ları / Expanded node values */
  expandedValues: Set<SelectValue>;

  /** Seçim modu / Selection mode */
  selectionMode: DropdownTreeSelectionMode;

  /** Seçili değer (single) / Selected value (single) */
  selectedValue: SelectValue | undefined;

  /** Seçili değerler (multiple) / Selected values (multiple) */
  selectedValues: Set<SelectValue>;

  /** Arama değeri / Search value */
  searchValue: string;

  /** Highlight edilen düğüm value'su / Highlighted node value */
  highlightedValue: SelectValue | undefined;

  /** Dropdown açık mı / Is dropdown open */
  isOpen: boolean;

  /** Placeholder / Placeholder */
  placeholder: string;

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
 * DropdownTree state machine event'leri.
 * DropdownTree state machine events.
 */
export type DropdownTreeEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SELECT'; value: SelectValue }
  | { type: 'DESELECT'; value: SelectValue }
  | { type: 'CLEAR' }
  | { type: 'EXPAND'; value: SelectValue }
  | { type: 'COLLAPSE'; value: SelectValue }
  | { type: 'TOGGLE_EXPAND'; value: SelectValue }
  | { type: 'EXPAND_ALL' }
  | { type: 'COLLAPSE_ALL' }
  | { type: 'SET_SEARCH'; value: string }
  | { type: 'HIGHLIGHT'; value: SelectValue | undefined }
  | { type: 'HIGHLIGHT_NEXT' }
  | { type: 'HIGHLIGHT_PREV' }
  | { type: 'HIGHLIGHT_FIRST' }
  | { type: 'HIGHLIGHT_LAST' }
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_READ_ONLY'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean }
  | { type: 'SET_NODES'; nodes: TreeNode[] }
  | { type: 'SET_VALUE'; value: SelectValue | undefined }
  | { type: 'SET_VALUES'; values: SelectValue[] };

// ── DOM Props ───────────────────────────────────────────────────────

/**
 * DropdownTree trigger DOM attribute'ları.
 * DropdownTree trigger DOM attributes.
 */
export interface DropdownTreeTriggerDOMProps {
  role: 'combobox';
  'aria-expanded': boolean;
  'aria-haspopup': 'tree';
  'aria-disabled'?: true;
  'aria-readonly'?: true;
  'aria-invalid'?: true;
  'aria-required'?: true;
  'data-state': DropdownTreeInteractionState;
  'data-disabled'?: '';
  'data-readonly'?: '';
  'data-invalid'?: '';
  tabIndex: 0;
}

/**
 * DropdownTree tree panel DOM attribute'ları.
 * DropdownTree tree panel DOM attributes.
 */
export interface DropdownTreePanelDOMProps {
  role: 'tree';
  'aria-multiselectable'?: true;
  tabIndex: -1;
}

/**
 * DropdownTree node DOM attribute'ları.
 * DropdownTree node DOM attributes.
 */
export interface DropdownTreeNodeDOMProps {
  role: 'treeitem';
  'aria-expanded'?: boolean;
  'aria-selected': boolean;
  'aria-disabled'?: true;
  'aria-level': number;
  'data-highlighted'?: '';
  'data-disabled'?: '';
}
