/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tabs type definitions — framework-agnostic.
 * Tabs tip tanımları — framework bağımsız.
 *
 * WAI-ARIA Tabs pattern (tablist + tab + tabpanel):
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * @packageDocumentation
 */

/**
 * Tabs boyutu / Tabs size.
 */
export type TabsSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Tabs görsel varyantı / Tabs visual variant.
 *
 * - line: alt çizgi ile aktif tab gösterimi / underline indicator
 * - enclosed: kutulu tab'lar / boxed tabs
 * - outline: dış çerçeveli / outlined tabs
 * - pills: yuvarlak hap şeklinde / pill-shaped tabs
 */
export type TabsVariant = 'line' | 'enclosed' | 'outline' | 'pills';

/**
 * Tab yönelimi / Tab orientation.
 *
 * - horizontal: yatay tab listesi (ArrowLeft/Right ile gezinme)
 * - vertical: dikey tab listesi (ArrowUp/Down ile gezinme)
 */
export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Tab aktivasyon modu / Tab activation mode.
 *
 * - automatic: focus edilen tab otomatik seçilir / focused tab is automatically selected
 * - manual: focus ve seçim ayrı, Enter/Space ile seçilir / focus and selection are separate
 */
export type TabsActivationMode = 'automatic' | 'manual';

/**
 * Tek tab tanımı / Single tab definition.
 */
export interface TabItem {
  /** Değer (benzersiz tanımlayıcı) / Value (unique identifier) */
  value: string;

  /** Görünen etiket / Display label */
  label: string;

  /** Pasif mi / Is disabled */
  disabled?: boolean;

  /** Kapatılabilir mi / Is closable */
  closable?: boolean;
}

/**
 * Tabs etkileşim durumu / Tabs interaction state.
 */
export type TabsInteractionState = 'idle' | 'hover' | 'focused';

/**
 * Core Tabs props — framework-agnostic yapılandırma.
 * Core Tabs props — framework-agnostic configuration.
 */
export interface TabsProps {
  /** Tab tanımları / Tab definitions */
  items: TabItem[];

  /** Seçili değer (controlled) / Selected value (controlled) */
  value?: string;

  /** Varsayılan değer (uncontrolled) / Default value (uncontrolled) */
  defaultValue?: string;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Yönelim / Orientation */
  orientation?: TabsOrientation;

  /** Aktivasyon modu / Activation mode */
  activationMode?: TabsActivationMode;
}

/**
 * Tabs machine context — iç durum.
 * Tabs machine context — internal state.
 */
export interface TabsMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: TabsInteractionState;

  /** Tab tanımları / Tab definitions */
  items: TabItem[];

  /** Seçili değer / Selected value */
  selectedValue: string | undefined;

  /** Focus edilen tab indeksi / Focused tab index */
  focusedIndex: number;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Yönelim / Orientation */
  orientation: TabsOrientation;

  /** Aktivasyon modu / Activation mode */
  activationMode: TabsActivationMode;
}

/**
 * State machine'e gönderilebilecek event'ler.
 * Events that can be sent to the state machine.
 */
export type TabsEvent =
  | { type: 'SELECT'; value: string }
  | { type: 'FOCUS'; index: number }
  | { type: 'BLUR' }
  | { type: 'FOCUS_NEXT' }
  | { type: 'FOCUS_PREV' }
  | { type: 'FOCUS_FIRST' }
  | { type: 'FOCUS_LAST' }
  | { type: 'CLOSE_TAB'; value: string }
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_VALUE'; value: string }
  | { type: 'SET_ITEMS'; items: TabItem[] }
  | { type: 'SET_ORIENTATION'; orientation: TabsOrientation }
  | { type: 'SET_ACTIVATION_MODE'; activationMode: TabsActivationMode };

/**
 * Tablist (root) DOM attribute'ları / Tablist DOM attributes.
 */
export interface TabsListDOMProps {
  role: 'tablist';
  'aria-orientation': TabsOrientation;
  'aria-disabled': true | undefined;
  'data-disabled': '' | undefined;
  'data-orientation': TabsOrientation;
}

/**
 * Tab buton DOM attribute'ları / Tab button DOM attributes.
 */
export interface TabDOMProps {
  role: 'tab';
  tabIndex: 0 | -1;
  'aria-selected': boolean;
  'aria-disabled': true | undefined;
  'aria-controls': string;
  'data-state': 'active' | 'inactive';
  'data-disabled': '' | undefined;
  id: string;
}

/**
 * TabPanel DOM attribute'ları / TabPanel DOM attributes.
 */
export interface TabPanelDOMProps {
  role: 'tabpanel';
  'aria-labelledby': string;
  id: string;
  tabIndex: 0;
  hidden: boolean;
}
