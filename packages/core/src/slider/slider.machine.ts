/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Slider state machine — framework-agnostic headless slider logic.
 * Slider state machine — framework bağımsız headless slider mantığı.
 *
 * Aralık değer seçici — min/max/step, drag ve klavye.
 * WAI-ARIA Slider pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 *
 * @packageDocumentation
 */

import type {
  SliderProps,
  SliderMachineContext,
  SliderEvent,
  SliderThumbDOMProps,
  SliderTrackDOMProps,
  SliderInteractionState,
} from './slider.types';

/**
 * Değeri min/max/step sınırlarına uydur.
 * Clamp and snap value to min/max/step boundaries.
 */
function clampAndSnap(value: number, min: number, max: number, step: number): number {
  // Step'e snap
  const snapped = Math.round((value - min) / step) * step + min;
  // Min/max clamp
  return Math.min(Math.max(snapped, min), max);
}

/**
 * Yüzde hesapla / Calculate percentage (0-100).
 */
export function getPercent(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}

/**
 * Varsayılan context / Default context.
 */
function createInitialContext(props: SliderProps): SliderMachineContext {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const step = props.step ?? 1;
  const value = clampAndSnap(props.value ?? min, min, max, step);

  return {
    interactionState: 'idle',
    orientation: props.orientation ?? 'horizontal',
    min,
    max,
    step,
    value,
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
  };
}

/**
 * State geçişi / State transition.
 */
function transition(
  ctx: SliderMachineContext,
  event: SliderEvent,
): SliderMachineContext {
  // Prop güncellemeleri her zaman uygulanır
  if (event.type === 'SET_VALUE') {
    const clamped = clampAndSnap(event.value, ctx.min, ctx.max, ctx.step);
    if (clamped === ctx.value) {
      return ctx;
    }
    return { ...ctx, value: clamped };
  }

  if (event.type === 'SET_DISABLED') {
    if (event.value === ctx.disabled) {
      return ctx;
    }
    return {
      ...ctx,
      disabled: event.value,
      interactionState: event.value ? 'idle' : ctx.interactionState,
    };
  }

  if (event.type === 'SET_INVALID') {
    if (event.value === ctx.invalid) {
      return ctx;
    }
    return { ...ctx, invalid: event.value };
  }

  // Disabled durumda tüm etkileşim engellenir
  if (ctx.disabled) {
    return ctx;
  }

  // CHANGE — readOnly durumda yoksayılır
  if (event.type === 'CHANGE') {
    if (ctx.readOnly) {
      return ctx;
    }
    const clamped = clampAndSnap(event.value, ctx.min, ctx.max, ctx.step);
    if (clamped === ctx.value) {
      return ctx;
    }
    return { ...ctx, value: clamped };
  }

  // INCREMENT — bir step artır
  if (event.type === 'INCREMENT') {
    if (ctx.readOnly) {
      return ctx;
    }
    const next = clampAndSnap(ctx.value + ctx.step, ctx.min, ctx.max, ctx.step);
    if (next === ctx.value) {
      return ctx;
    }
    return { ...ctx, value: next };
  }

  // DECREMENT — bir step azalt
  if (event.type === 'DECREMENT') {
    if (ctx.readOnly) {
      return ctx;
    }
    const next = clampAndSnap(ctx.value - ctx.step, ctx.min, ctx.max, ctx.step);
    if (next === ctx.value) {
      return ctx;
    }
    return { ...ctx, value: next };
  }

  // SET_MIN — minimum değere git
  if (event.type === 'SET_MIN') {
    if (ctx.readOnly || ctx.value === ctx.min) {
      return ctx;
    }
    return { ...ctx, value: ctx.min };
  }

  // SET_MAX — maksimum değere git
  if (event.type === 'SET_MAX') {
    if (ctx.readOnly || ctx.value === ctx.max) {
      return ctx;
    }
    return { ...ctx, value: ctx.max };
  }

  // Etkileşim state geçişleri
  const { interactionState } = ctx;
  let nextState: SliderInteractionState = interactionState;

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
      if (interactionState === 'idle' || interactionState === 'hover') {
        nextState = 'focused';
      }
      break;

    case 'BLUR':
      if (interactionState === 'focused') {
        nextState = 'idle';
      }
      break;

    case 'DRAG_START':
      nextState = 'dragging';
      break;

    case 'DRAG_END':
      nextState = 'focused';
      break;
  }

  if (nextState === interactionState) {
    return ctx;
  }

  return { ...ctx, interactionState: nextState };
}

/**
 * Thumb DOM attribute'larını üret / Generate thumb DOM attributes.
 */
function getThumbProps(ctx: SliderMachineContext): SliderThumbDOMProps {
  return {
    role: 'slider',
    tabIndex: 0,
    'aria-valuemin': ctx.min,
    'aria-valuemax': ctx.max,
    'aria-valuenow': ctx.value,
    'aria-orientation': ctx.orientation,
    'aria-disabled': ctx.disabled ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'data-state': ctx.interactionState === 'dragging' ? 'dragging' : 'idle',
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
    'data-focus':
      ctx.interactionState === 'focused' || ctx.interactionState === 'dragging'
        ? ''
        : undefined,
    'data-hover': ctx.interactionState === 'hover' ? '' : undefined,
    'data-orientation': ctx.orientation,
  };
}

/**
 * Track DOM attribute'larını üret / Generate track DOM attributes.
 */
function getTrackProps(ctx: SliderMachineContext): SliderTrackDOMProps {
  return {
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
    'data-orientation': ctx.orientation,
  };
}

/**
 * Slider API — state machine, props üretici ve durum sorgulama.
 * Slider API — state machine, props generator and state queries.
 */
export interface SliderAPI {
  /** Mevcut context / Current context */
  getContext(): SliderMachineContext;

  /** Event gönder, yeni context döner / Send event, returns new context */
  send(event: SliderEvent): SliderMachineContext;

  /** Thumb DOM attribute'larını üret / Generate thumb DOM attributes */
  getThumbProps(): SliderThumbDOMProps;

  /** Track DOM attribute'larını üret / Generate track DOM attributes */
  getTrackProps(): SliderTrackDOMProps;

  /** Yüzde değer (0-100) / Percentage value (0-100) */
  getPercent(): number;

  /** Etkileşim engellenmiş mi (sadece disabled) / Is interaction blocked */
  isInteractionBlocked(): boolean;
}

/**
 * Slider state machine oluştur.
 * Create a slider state machine.
 *
 * @example
 * ```ts
 * const slider = createSlider({ min: 0, max: 100, step: 5, value: 50 });
 * const percent = slider.getPercent(); // 50
 * slider.send({ type: 'INCREMENT' }); // value: 55
 * ```
 */
export function createSlider(props: SliderProps = {}): SliderAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: SliderEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getThumbProps() {
      return getThumbProps(ctx);
    },

    getTrackProps() {
      return getTrackProps(ctx);
    },

    getPercent() {
      return getPercent(ctx.value, ctx.min, ctx.max);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },
  };
}
