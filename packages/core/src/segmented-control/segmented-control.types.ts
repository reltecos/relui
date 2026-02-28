/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SegmentedControl type definitions — framework-agnostic.
 * SegmentedControl tip tanımları — framework bağımsız.
 *
 * WAI-ARIA Tabs pattern (tablist + tab):
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * @packageDocumentation
 */

/**
 * SegmentedControl boyutu / SegmentedControl size.
 */
export type SegmentedControlSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Tek segment seçeneği / Single segment option.
 */
export interface SegmentedControlOption {
  /** Değer / Value */
  value: string;

  /** Görünen etiket / Display label */
  label: string;

  /** Pasif mi / Is disabled */
  disabled?: boolean;
}

/**
 * SegmentedControl etkileşim durumu / Interaction state.
 */
export type SegmentedControlInteractionState = 'idle' | 'hover' | 'focused';

/**
 * Core SegmentedControl props — framework-agnostic yapılandırma.
 * Core SegmentedControl props — framework-agnostic configuration.
 */
export interface SegmentedControlProps {
  /** Seçenekler / Options */
  options: SegmentedControlOption[];

  /** Seçili değer (controlled) / Selected value (controlled) */
  value?: string;

  /** Varsayılan değer (uncontrolled) / Default value (uncontrolled) */
  defaultValue?: string;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Salt okunur durumu / Read-only state */
  readOnly?: boolean;
}

/**
 * SegmentedControl machine context — iç durum.
 * SegmentedControl machine context — internal state.
 */
export interface SegmentedControlMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: SegmentedControlInteractionState;

  /** Seçenekler / Options */
  options: SegmentedControlOption[];

  /** Seçili değer / Selected value */
  selectedValue: string | undefined;

  /** Focus edilen segment indeksi / Focused segment index */
  focusedIndex: number;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Salt okunur mu / Is read-only */
  readOnly: boolean;
}

/**
 * State machine'e gönderilebilecek event'ler.
 * Events that can be sent to the state machine.
 */
export type SegmentedControlEvent =
  | { type: 'SELECT'; value: string }
  | { type: 'FOCUS'; index: number }
  | { type: 'BLUR' }
  | { type: 'FOCUS_NEXT' }
  | { type: 'FOCUS_PREV' }
  | { type: 'FOCUS_FIRST' }
  | { type: 'FOCUS_LAST' }
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_READ_ONLY'; value: boolean }
  | { type: 'SET_VALUE'; value: string }
  | { type: 'SET_OPTIONS'; options: SegmentedControlOption[] };

/**
 * Tablist DOM attribute'ları / Tablist DOM attributes.
 */
export interface SegmentedControlRootDOMProps {
  role: 'tablist';
  'aria-disabled': true | undefined;
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
}

/**
 * Tab (segment) DOM attribute'ları / Tab (segment) DOM attributes.
 */
export interface SegmentedControlItemDOMProps {
  role: 'tab';
  tabIndex: 0 | -1;
  'aria-selected': boolean;
  'aria-disabled': true | undefined;
  'data-state': 'active' | 'inactive';
  'data-disabled': '' | undefined;
  id: string;
}
