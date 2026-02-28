/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RangeSlider type definitions — framework-agnostic.
 * RangeSlider tip tanımları — framework bağımsız.
 *
 * İki thumb'lı aralık seçici — min/max/step, sürükle veya klavye ile.
 * Two-thumb range picker — min/max/step, drag or keyboard.
 *
 * @packageDocumentation
 */

import type { SliderSize, SliderColor, SliderOrientation, SliderInteractionState } from '../slider';

// Slider'dan ortak tipleri re-export
export type { SliderSize, SliderColor, SliderOrientation, SliderInteractionState };

/**
 * Thumb tanımlayıcısı / Thumb identifier.
 * 'start' = alt sınır, 'end' = üst sınır.
 */
export type RangeSliderThumb = 'start' | 'end';

/**
 * Core RangeSlider props — framework-agnostic yapılandırma.
 * Core RangeSlider props — framework-agnostic configuration.
 */
export interface RangeSliderProps {
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

  /** Mevcut aralık değeri / Current range value [start, end] */
  value?: [number, number];

  /** Thumb'lar arası minimum mesafe / Minimum distance between thumbs */
  minDistance?: number;

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
 * RangeSlider machine context — iç durum.
 * RangeSlider machine context — internal state.
 */
export interface RangeSliderMachineContext {
  /** Mevcut etkileşim durumu / Current interaction state */
  interactionState: SliderInteractionState;

  /** Aktif thumb (drag/focus) / Active thumb (drag/focus) */
  activeThumb: RangeSliderThumb | null;

  /** Yön / Orientation */
  orientation: SliderOrientation;

  /** Minimum değer / Minimum value */
  min: number;

  /** Maksimum değer / Maximum value */
  max: number;

  /** Adım büyüklüğü / Step size */
  step: number;

  /** Mevcut aralık [start, end] / Current range [start, end] */
  value: [number, number];

  /** Thumb'lar arası minimum mesafe / Minimum distance between thumbs */
  minDistance: number;

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
export type RangeSliderEvent =
  | { type: 'POINTER_ENTER' }
  | { type: 'POINTER_LEAVE' }
  | { type: 'FOCUS'; thumb: RangeSliderThumb }
  | { type: 'BLUR' }
  | { type: 'DRAG_START'; thumb: RangeSliderThumb }
  | { type: 'DRAG_END' }
  | { type: 'CHANGE'; thumb: RangeSliderThumb; value: number }
  | { type: 'INCREMENT'; thumb: RangeSliderThumb }
  | { type: 'DECREMENT'; thumb: RangeSliderThumb }
  | { type: 'SET_MIN'; thumb: RangeSliderThumb }
  | { type: 'SET_MAX'; thumb: RangeSliderThumb }
  | { type: 'SET_VALUE'; value: [number, number] }
  | { type: 'SET_DISABLED'; value: boolean }
  | { type: 'SET_INVALID'; value: boolean };

/**
 * RangeSlider thumb DOM attribute'ları.
 * RangeSlider thumb DOM attributes.
 */
export interface RangeSliderThumbDOMProps {
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
  'data-thumb': RangeSliderThumb;
}

/**
 * RangeSlider track DOM attribute'ları.
 * RangeSlider track DOM attributes.
 */
export interface RangeSliderTrackDOMProps {
  'data-disabled': '' | undefined;
  'data-readonly': '' | undefined;
  'data-invalid': '' | undefined;
  'data-orientation': SliderOrientation;
}
