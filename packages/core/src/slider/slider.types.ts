/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Slider type definitions — framework-agnostic.
 * Slider tip tanımları — framework bağımsız.
 *
 * Aralık değer seçici — min/max/step, sürükle veya klavye ile.
 *
 * @packageDocumentation
 */

/**
 * Slider boyutu / Slider size.
 */
export type SliderSize = 'sm' | 'md' | 'lg';

/**
 * Slider renk şeması / Slider color scheme.
 */
export type SliderColor = 'accent' | 'neutral' | 'destructive' | 'success' | 'warning';

/**
 * Slider yönü / Slider orientation.
 */
export type SliderOrientation = 'horizontal' | 'vertical';

/**
 * Slider etkileşim durumu / Slider interaction state.
 */
export type SliderInteractionState = 'idle' | 'hover' | 'focused' | 'dragging';

/**
 * Core slider props — framework-agnostic yapılandırma.
 * Core slider props — framework-agnostic configuration.
 */
export interface SliderProps {
  /** Boyut / Size */
  size?: SliderSize;

  /** Renk şeması / Color scheme */
  color?: SliderColor;

  /** Yön / Orientation */
  orientation?: SliderOrientation;

  /** Minimum değer / Minimum value */
  min?: number;

  /** Maksimum değer / Maximum value */
  max?: number;

  /** Adım büyüklüğü / Step size */
  step?: number;

  /** Mevcut değer / Current value */
  value?: number;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Salt okunur durumu / Read-only state */
  readOnly?: boolean;

  /** Geçersiz durumu / Invalid state */
  invalid?: boolean;

  /** İsim / Name attribute (form entegrasyonu) */
  name?: string;
}

/**
 * Slider machine context — iç durum.
 * Slider machine context — internal state.
 */
export interface SliderMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: SliderInteractionState;

  /** Yön / Orientation */
  orientation: SliderOrientation;

  /** Minimum değer / Minimum value */
  min: number;

  /** Maksimum değer / Maximum value */
  max: number;

  /** Adım büyüklüğü / Step size */
  step: number;

  /** Mevcut değer / Current value */
  value: number;

  /** Pasif mi / Is disabled */
  disabled: boolean;

  /** Salt okunur mu / Is read-only */
  readOnly: boolean;

  /** Geçersiz mi / Is invalid */
  invalid: boolean;
}

/**
 * State machine'e gönderilebilecek event'ler.
 * Events that can be sent to the state machine.
 */
export type SliderEvent =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'DRAG_START' }
  | { type: 'DRAG_END' }
  | { type: 'CHANGE'; value: number }
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_MIN' }
  | { type: 'SET_MAX' }
  | { type: 'SET_VALUE'; value: number }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean };

/**
 * Slider thumb DOM attribute'ları.
 * Slider thumb DOM attributes.
 */
export interface SliderThumbDOMProps {
  role: 'slider';
  tabIndex: 0;
  'aria-valuemin': number;
  'aria-valuemax': number;
  'aria-valuenow': number;
  'aria-orientation': SliderOrientation;
  'aria-disabled': boolean | undefined;
  'aria-invalid': boolean | undefined;
  'aria-readonly': boolean | undefined;
  'data-state': 'dragging' | 'idle';
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
  'data-invalid': '' | undefined;
  'data-focus': '' | undefined;
  'data-hover': '' | undefined;
  'data-orientation': SliderOrientation;
}

/**
 * Slider track DOM attribute'ları.
 * Slider track DOM attributes.
 */
export interface SliderTrackDOMProps {
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
  'data-invalid': '' | undefined;
  'data-orientation': SliderOrientation;
}
