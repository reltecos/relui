/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RangeSlider state machine — framework-agnostic headless range slider logic.
 * RangeSlider state machine — framework bağımsız headless range slider mantığı.
 *
 * İki thumb'lı aralık seçici — min/max/step, drag ve klavye.
 * WAI-ARIA Slider (multi-thumb) pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
 *
 * @packageDocumentation
 */

import { getPercent } from '../slider';
import type {
  RangeSliderProps,
  RangeSliderMachineContext,
  RangeSliderEvent,
  RangeSliderThumbDOMProps,
  RangeSliderTrackDOMProps,
  RangeSliderThumb,
  SliderInteractionState,
} from './range-slider.types';

/**
 * Thumb'a özgü clamp & snap.
 * Clamp and snap value for a specific thumb.
 *
 * Start thumb: [min, endValue - minDistance] aralığına sığdır.
 * End thumb: [startValue + minDistance, max] aralığına sığdır.
 */
function clampAndSnapThumb(
  thumb: RangeSliderThumb,
  rawValue: number,
  ctx: RangeSliderMachineContext,
): number {
  const { min, max, step, minDistance, value } = ctx;

  // Step'e snap
  const snapped = Math.round((rawValue - min) / step) * step + min;

  if (thumb === 'start') {
    const upperBound = value[1] - minDistance;
    return Math.min(Math.max(snapped, min), upperBound);
  } else {
    const lowerBound = value[0] + minDistance;
    return Math.min(Math.max(snapped, lowerBound), max);
  }
}

/**
 * Varsayılan context / Default context.
 */
function createInitialContext(props: RangeSliderProps): RangeSliderMachineContext {
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const step = props.step ?? 1;
  const minDistance = props.minDistance ?? 0;

  const rawStart = props.value ? props.value[0] : min;
  const rawEnd = props.value ? props.value[1] : max;

  // Clamp start & end
  const startSnapped = Math.round((rawStart - min) / step) * step + min;
  const startClamped = Math.min(Math.max(startSnapped, min), max - minDistance);
  const endSnapped = Math.round((rawEnd - min) / step) * step + min;
  const endClamped = Math.min(Math.max(endSnapped, startClamped + minDistance), max);

  return {
    interactionState: 'idle',
    activeThumb: null,
    orientation: props.orientation ?? 'horizontal',
    min,
    max,
    step,
    value: [startClamped, endClamped],
    minDistance,
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
  };
}

/**
 * State geçişi / State transition.
 */
function transition(
  ctx: RangeSliderMachineContext,
  event: RangeSliderEvent,
): RangeSliderMachineContext {
  // ── Prop güncellemeleri — her zaman uygulanır ──────────────

  if (event.type === 'SET_VALUE') {
    const tempCtx = { ...ctx, value: event.value };
    const start = clampAndSnapThumb('start', event.value[0], {
      ...tempCtx,
      value: [event.value[0], event.value[1]],
    });
    // End thumb'ın lowerBound'u yeni start'a göre
    const end = clampAndSnapThumb('end', event.value[1], {
      ...tempCtx,
      value: [start, event.value[1]],
    });

    if (start === ctx.value[0] && end === ctx.value[1]) {
      return ctx;
    }
    return { ...ctx, value: [start, end] };
  }

  if (event.type === 'SET_DISABLED') {
    if (event.value === ctx.disabled) {
      return ctx;
    }
    return {
      ...ctx,
      disabled: event.value,
      interactionState: event.value ? 'idle' : ctx.interactionState,
      activeThumb: event.value ? null : ctx.activeThumb,
    };
  }

  if (event.type === 'SET_INVALID') {
    if (event.value === ctx.invalid) {
      return ctx;
    }
    return { ...ctx, invalid: event.value };
  }

  // ── Disabled — tüm etkileşim engellenir ───────────────────

  if (ctx.disabled) {
    return ctx;
  }

  // ── Değer değişikliği event'leri ──────────────────────────

  if (event.type === 'CHANGE') {
    if (ctx.readOnly) return ctx;
    const clamped = clampAndSnapThumb(event.thumb, event.value, ctx);
    const idx = event.thumb === 'start' ? 0 : 1;
    if (clamped === ctx.value[idx]) return ctx;

    const newValue: [number, number] = [...ctx.value];
    newValue[idx] = clamped;
    return { ...ctx, value: newValue };
  }

  if (event.type === 'INCREMENT') {
    if (ctx.readOnly) return ctx;
    const idx = event.thumb === 'start' ? 0 : 1;
    const next = clampAndSnapThumb(event.thumb, ctx.value[idx] + ctx.step, ctx);
    if (next === ctx.value[idx]) return ctx;

    const newValue: [number, number] = [...ctx.value];
    newValue[idx] = next;
    return { ...ctx, value: newValue };
  }

  if (event.type === 'DECREMENT') {
    if (ctx.readOnly) return ctx;
    const idx = event.thumb === 'start' ? 0 : 1;
    const next = clampAndSnapThumb(event.thumb, ctx.value[idx] - ctx.step, ctx);
    if (next === ctx.value[idx]) return ctx;

    const newValue: [number, number] = [...ctx.value];
    newValue[idx] = next;
    return { ...ctx, value: newValue };
  }

  if (event.type === 'SET_MIN') {
    if (ctx.readOnly) return ctx;
    const idx = event.thumb === 'start' ? 0 : 1;
    const target = event.thumb === 'start' ? ctx.min : ctx.value[0] + ctx.minDistance;
    const clamped = clampAndSnapThumb(event.thumb, target, ctx);
    if (clamped === ctx.value[idx]) return ctx;

    const newValue: [number, number] = [...ctx.value];
    newValue[idx] = clamped;
    return { ...ctx, value: newValue };
  }

  if (event.type === 'SET_MAX') {
    if (ctx.readOnly) return ctx;
    const idx = event.thumb === 'start' ? 0 : 1;
    const target = event.thumb === 'start' ? ctx.value[1] - ctx.minDistance : ctx.max;
    const clamped = clampAndSnapThumb(event.thumb, target, ctx);
    if (clamped === ctx.value[idx]) return ctx;

    const newValue: [number, number] = [...ctx.value];
    newValue[idx] = clamped;
    return { ...ctx, value: newValue };
  }

  // ── Etkileşim state geçişleri ─────────────────────────────

  const { interactionState } = ctx;
  let nextState: SliderInteractionState = interactionState;
  let nextThumb: RangeSliderThumb | null = ctx.activeThumb;

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
      nextThumb = event.thumb;
      break;

    case 'BLUR':
      if (interactionState === 'focused') {
        nextState = 'idle';
        nextThumb = null;
      }
      break;

    case 'DRAG_START':
      nextState = 'dragging';
      nextThumb = event.thumb;
      break;

    case 'DRAG_END':
      nextState = 'focused';
      break;
  }

  if (nextState === interactionState && nextThumb === ctx.activeThumb) {
    return ctx;
  }

  return { ...ctx, interactionState: nextState, activeThumb: nextThumb };
}

/**
 * Thumb DOM attribute'larını üret / Generate thumb DOM attributes.
 */
function getThumbProps(
  ctx: RangeSliderMachineContext,
  thumb: RangeSliderThumb,
): RangeSliderThumbDOMProps {
  const isStart = thumb === 'start';
  const isActive = ctx.activeThumb === thumb;
  const isFocusedOrDragging =
    ctx.interactionState === 'focused' || ctx.interactionState === 'dragging';

  return {
    role: 'slider',
    tabIndex: 0,
    'aria-valuemin': isStart ? ctx.min : ctx.value[0],
    'aria-valuemax': isStart ? ctx.value[1] : ctx.max,
    'aria-valuenow': isStart ? ctx.value[0] : ctx.value[1],
    'aria-orientation': ctx.orientation,
    'aria-disabled': ctx.disabled ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'data-state':
      ctx.interactionState === 'dragging' && isActive ? 'dragging' : 'idle',
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
    'data-focus': isFocusedOrDragging && isActive ? '' : undefined,
    'data-hover': ctx.interactionState === 'hover' ? '' : undefined,
    'data-orientation': ctx.orientation,
    'data-thumb': thumb,
  };
}

/**
 * Track DOM attribute'larını üret / Generate track DOM attributes.
 */
function getTrackProps(ctx: RangeSliderMachineContext): RangeSliderTrackDOMProps {
  return {
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
    'data-orientation': ctx.orientation,
  };
}

/**
 * RangeSlider API — state machine, props üretici ve durum sorgulama.
 * RangeSlider API — state machine, props generator and state queries.
 */
export interface RangeSliderAPI {
  /** Mevcut context / Current context */
  getContext(): RangeSliderMachineContext;

  /** Event gönder, yeni context döner / Send event, returns new context */
  send(event: RangeSliderEvent): RangeSliderMachineContext;

  /** Start thumb DOM attribute'ları / Start thumb DOM attributes */
  getStartThumbProps(): RangeSliderThumbDOMProps;

  /** End thumb DOM attribute'ları / End thumb DOM attributes */
  getEndThumbProps(): RangeSliderThumbDOMProps;

  /** Track DOM attribute'ları / Track DOM attributes */
  getTrackProps(): RangeSliderTrackDOMProps;

  /** Start thumb yüzdesi (0-100) / Start thumb percentage (0-100) */
  getStartPercent(): number;

  /** End thumb yüzdesi (0-100) / End thumb percentage (0-100) */
  getEndPercent(): number;

  /** Etkileşim engellenmiş mi (sadece disabled) / Is interaction blocked */
  isInteractionBlocked(): boolean;
}

/**
 * RangeSlider state machine oluştur.
 * Create a range slider state machine.
 *
 * @example
 * ```ts
 * const rs = createRangeSlider({ min: 0, max: 100, value: [20, 80] });
 * rs.getStartPercent(); // 20
 * rs.getEndPercent();   // 80
 * rs.send({ type: 'INCREMENT', thumb: 'start' }); // value: [21, 80]
 * ```
 */
export function createRangeSlider(props: RangeSliderProps = {}): RangeSliderAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: RangeSliderEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getStartThumbProps() {
      return getThumbProps(ctx, 'start');
    },

    getEndThumbProps() {
      return getThumbProps(ctx, 'end');
    },

    getTrackProps() {
      return getTrackProps(ctx);
    },

    getStartPercent() {
      return getPercent(ctx.value[0], ctx.min, ctx.max);
    },

    getEndPercent() {
      return getPercent(ctx.value[1], ctx.min, ctx.max);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },
  };
}
