/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useRangeSlider — React hook for range slider state machine.
 * useRangeSlider — RangeSlider state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * İki thumb'lı drag, klavye ve pointer etkileşimi yönetir.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createRangeSlider } from '@relteco/relui-core';
import type {
  RangeSliderProps as CoreRangeSliderProps,
  RangeSliderThumbDOMProps,
  RangeSliderTrackDOMProps,
  RangeSliderEvent,
  RangeSliderThumb,
  SliderOrientation,
} from '@relteco/relui-core';

/**
 * useRangeSlider hook props — core props + React-specific props.
 */
export interface UseRangeSliderProps extends CoreRangeSliderProps {
  /**
   * Değer değiştiğinde çağrılır / Called when value changes.
   */
  onValueChange?: (value: [number, number]) => void;
}

/**
 * Tek thumb için event handler'lar.
 * Event handlers for a single thumb.
 */
interface ThumbEventHandlers {
  onPointerDown: (event: React.PointerEvent) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

/**
 * useRangeSlider hook dönüş tipi.
 */
export interface UseRangeSliderReturn {
  /** Start thumb DOM attribute'ları ve event handler'lar */
  startThumbProps: RangeSliderThumbDOMProps & ThumbEventHandlers;

  /** End thumb DOM attribute'ları ve event handler'lar */
  endThumbProps: RangeSliderThumbDOMProps & ThumbEventHandlers;

  /** Track DOM attribute'ları ve event handler'lar */
  trackProps: RangeSliderTrackDOMProps & {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onPointerDown: (event: React.PointerEvent) => void;
  };

  /** Mevcut aralık değeri / Current range value */
  value: [number, number];

  /** Start yüzdesi (0-100) / Start percentage (0-100) */
  startPercent: number;

  /** End yüzdesi (0-100) / End percentage (0-100) */
  endPercent: number;

  /** Min değer */
  min: number;

  /** Max değer */
  max: number;

  /** Yön / Orientation */
  orientation: SliderOrientation;

  /** Pasif mi / Is disabled */
  isDisabled: boolean;

  /** Salt okunur mu / Is read-only */
  isReadOnly: boolean;

  /** Geçersiz mi / Is invalid */
  isInvalid: boolean;
}

/**
 * Pointer konumundan değer hesapla.
 * Calculate value from pointer position.
 */
function getValueFromPointer(
  event: { clientX: number; clientY: number },
  trackRect: DOMRect,
  min: number,
  max: number,
  step: number,
  orientation: SliderOrientation,
): number {
  let ratio: number;

  if (orientation === 'horizontal') {
    ratio = (event.clientX - trackRect.left) / trackRect.width;
  } else {
    ratio = 1 - (event.clientY - trackRect.top) / trackRect.height;
  }

  ratio = Math.min(Math.max(ratio, 0), 1);
  const rawValue = min + ratio * (max - min);
  return Math.round((rawValue - min) / step) * step + min;
}

/**
 * Pointer konumuna en yakın thumb'ı bul.
 * Find the closest thumb to the pointer position.
 */
function getClosestThumb(
  pointerValue: number,
  startValue: number,
  endValue: number,
): RangeSliderThumb {
  const distToStart = Math.abs(pointerValue - startValue);
  const distToEnd = Math.abs(pointerValue - endValue);
  return distToStart <= distToEnd ? 'start' : 'end';
}

/**
 * RangeSlider state machine React hook'u.
 *
 * @example
 * ```tsx
 * const { startThumbProps, endThumbProps, trackProps, startPercent, endPercent } = useRangeSlider({
 *   min: 0,
 *   max: 100,
 *   value: [20, 80],
 *   onValueChange: setRange,
 * });
 * ```
 */
export function useRangeSlider(props: UseRangeSliderProps = {}): UseRangeSliderReturn {
  const { onValueChange, ...coreProps } = props;

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createRangeSlider> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createRangeSlider(coreProps);
  }
  const machine = machineRef.current;

  // Track element ref — drag hesaplamaları için
  const trackRectRef = useRef<DOMRect | null>(null);

  // Aktif drag thumb
  const dragThumbRef = useRef<RangeSliderThumb | null>(null);

  // Re-render counter
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync — render sırasında
  const prevValueRef = useRef(coreProps.value);
  const prevDisabledRef = useRef(coreProps.disabled);
  const prevInvalidRef = useRef(coreProps.invalid);

  if (
    coreProps.value &&
    prevValueRef.current &&
    (coreProps.value[0] !== prevValueRef.current[0] ||
      coreProps.value[1] !== prevValueRef.current[1])
  ) {
    machine.send({ type: 'SET_VALUE', value: coreProps.value });
    prevValueRef.current = coreProps.value;
  }
  if (coreProps.disabled !== prevDisabledRef.current) {
    machine.send({ type: 'SET_DISABLED', value: coreProps.disabled ?? false });
    prevDisabledRef.current = coreProps.disabled;
  }
  if (coreProps.invalid !== prevInvalidRef.current) {
    machine.send({ type: 'SET_INVALID', value: coreProps.invalid ?? false });
    prevInvalidRef.current = coreProps.invalid;
  }

  const send = useCallback(
    (event: RangeSliderEvent) => {
      const prevCtx = machine.getContext();
      const nextCtx = machine.send(event);
      if (nextCtx !== prevCtx) {
        forceRender();

        if (
          (nextCtx.value[0] !== prevCtx.value[0] ||
            nextCtx.value[1] !== prevCtx.value[1]) &&
          onValueChange
        ) {
          onValueChange(nextCtx.value);
        }
      }
    },
    [machine, forceRender, onValueChange],
  );

  // ── Pointer handlers ───────────────────────────────────────────

  const handlePointerEnter = useCallback(() => {
    send({ type: 'POINTER_ENTER' });
  }, [send]);

  const handlePointerLeave = useCallback(() => {
    send({ type: 'POINTER_LEAVE' });
  }, [send]);

  // ── Focus/Blur — thumb-specific ────────────────────────────────

  const handleFocusStart = useCallback(() => {
    send({ type: 'FOCUS', thumb: 'start' });
  }, [send]);

  const handleFocusEnd = useCallback(() => {
    send({ type: 'FOCUS', thumb: 'end' });
  }, [send]);

  const handleBlur = useCallback(() => {
    send({ type: 'BLUR' });
  }, [send]);

  // ── Drag handlers ──────────────────────────────────────────────

  const handleDragMove = useCallback(
    (event: PointerEvent) => {
      if (!trackRectRef.current || !dragThumbRef.current) return;
      const ctx = machine.getContext();
      const newValue = getValueFromPointer(
        event,
        trackRectRef.current,
        ctx.min,
        ctx.max,
        ctx.step,
        ctx.orientation,
      );
      send({ type: 'CHANGE', thumb: dragThumbRef.current, value: newValue });
    },
    [machine, send],
  );

  const handleDragEnd = useCallback(() => {
    send({ type: 'DRAG_END' });
    dragThumbRef.current = null;
    document.removeEventListener('pointermove', handleDragMove);
    document.removeEventListener('pointerup', handleDragEnd);
  }, [send, handleDragMove]);

  const startDragForThumb = useCallback(
    (thumb: RangeSliderThumb, event: React.PointerEvent) => {
      if (machine.isInteractionBlocked() || machine.getContext().readOnly) return;
      event.preventDefault();

      const trackEl = (event.currentTarget as HTMLElement).parentElement;
      if (trackEl) {
        const orientedEl = trackEl.closest('[data-orientation]');
        if (orientedEl) {
          trackRectRef.current = orientedEl.getBoundingClientRect();
        }
      }

      dragThumbRef.current = thumb;
      send({ type: 'DRAG_START', thumb });

      document.addEventListener('pointermove', handleDragMove);
      document.addEventListener('pointerup', handleDragEnd);
    },
    [machine, send, handleDragMove, handleDragEnd],
  );

  const handleStartThumbPointerDown = useCallback(
    (event: React.PointerEvent) => {
      startDragForThumb('start', event);
    },
    [startDragForThumb],
  );

  const handleEndThumbPointerDown = useCallback(
    (event: React.PointerEvent) => {
      startDragForThumb('end', event);
    },
    [startDragForThumb],
  );

  // Track click — en yakın thumb'a snap
  const handleTrackPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (machine.isInteractionBlocked() || machine.getContext().readOnly) return;

      const trackEl = event.currentTarget as HTMLElement;
      trackRectRef.current = trackEl.getBoundingClientRect();

      const ctx = machine.getContext();
      const newValue = getValueFromPointer(
        event,
        trackRectRef.current,
        ctx.min,
        ctx.max,
        ctx.step,
        ctx.orientation,
      );

      const thumb = getClosestThumb(newValue, ctx.value[0], ctx.value[1]);
      dragThumbRef.current = thumb;

      send({ type: 'DRAG_START', thumb });
      send({ type: 'CHANGE', thumb, value: newValue });

      document.addEventListener('pointermove', handleDragMove);
      document.addEventListener('pointerup', handleDragEnd);
    },
    [machine, send, handleDragMove, handleDragEnd],
  );

  // ── Keyboard handlers — thumb-specific ─────────────────────────

  const createKeyDownHandler = useCallback(
    (thumb: RangeSliderThumb) => (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          event.preventDefault();
          send({ type: 'INCREMENT', thumb });
          break;

        case 'ArrowLeft':
        case 'ArrowDown':
          event.preventDefault();
          send({ type: 'DECREMENT', thumb });
          break;

        case 'Home':
          event.preventDefault();
          send({ type: 'SET_MIN', thumb });
          break;

        case 'End':
          event.preventDefault();
          send({ type: 'SET_MAX', thumb });
          break;
      }
    },
    [send],
  );

  const handleKeyDownStart = createKeyDownHandler('start');
  const handleKeyDownEnd = createKeyDownHandler('end');

  const ctx = machine.getContext();
  const startThumbDomProps = machine.getStartThumbProps();
  const endThumbDomProps = machine.getEndThumbProps();
  const trackDomProps = machine.getTrackProps();

  return {
    startThumbProps: {
      ...startThumbDomProps,
      onPointerDown: handleStartThumbPointerDown,
      onFocus: handleFocusStart,
      onBlur: handleBlur,
      onKeyDown: handleKeyDownStart,
    },
    endThumbProps: {
      ...endThumbDomProps,
      onPointerDown: handleEndThumbPointerDown,
      onFocus: handleFocusEnd,
      onBlur: handleBlur,
      onKeyDown: handleKeyDownEnd,
    },
    trackProps: {
      ...trackDomProps,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handleTrackPointerDown,
    },
    value: ctx.value,
    startPercent: machine.getStartPercent(),
    endPercent: machine.getEndPercent(),
    min: ctx.min,
    max: ctx.max,
    orientation: ctx.orientation,
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
  };
}
