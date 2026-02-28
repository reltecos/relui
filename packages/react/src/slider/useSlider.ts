/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useSlider — React hook for slider state machine.
 * useSlider — Slider state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 * Drag, klavye ve pointer etkileşimi yönetir.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createSlider } from '@relteco/relui-core';
import type {
  SliderProps as CoreSliderProps,
  SliderThumbDOMProps,
  SliderTrackDOMProps,
  SliderEvent,
  SliderOrientation,
} from '@relteco/relui-core';

/**
 * useSlider hook props — core props + React-specific props.
 */
export interface UseSliderProps extends CoreSliderProps {
  /**
   * Değer değiştiğinde çağrılır / Called when value changes.
   */
  onValueChange?: (value: number) => void;
}

/**
 * useSlider hook dönüş tipi.
 */
export interface UseSliderReturn {
  /** Thumb DOM attribute'ları ve event handler'lar */
  thumbProps: SliderThumbDOMProps & {
    onPointerDown: (event: React.PointerEvent) => void;
    onFocus: () => void;
    onBlur: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };

  /** Track DOM attribute'ları ve event handler'lar */
  trackProps: SliderTrackDOMProps & {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onPointerDown: (event: React.PointerEvent) => void;
  };

  /** Mevcut değer / Current value */
  value: number;

  /** Yüzde değer (0-100) / Percentage value (0-100) */
  percent: number;

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
    // Vertical: bottom → max, top → min (ters)
    ratio = 1 - (event.clientY - trackRect.top) / trackRect.height;
  }

  ratio = Math.min(Math.max(ratio, 0), 1);
  const rawValue = min + ratio * (max - min);
  return Math.round((rawValue - min) / step) * step + min;
}

/**
 * Slider state machine React hook'u.
 *
 * @example
 * ```tsx
 * const { thumbProps, trackProps, percent } = useSlider({
 *   min: 0,
 *   max: 100,
 *   value: volume,
 *   onValueChange: setVolume,
 * });
 *
 * return (
 *   <div className={rootStyle}>
 *     <div {...trackProps} ref={trackRef} className={trackStyle}>
 *       <div className={fillStyle} style={{ width: `${percent}%` }} />
 *     </div>
 *     <div {...thumbProps} style={{ left: `${percent}%` }} className={thumbStyle} />
 *   </div>
 * );
 * ```
 */
export function useSlider(props: UseSliderProps = {}): UseSliderReturn {
  const { onValueChange, ...coreProps } = props;

  // Machine ref — stable across renders
  const machineRef = useRef<ReturnType<typeof createSlider> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createSlider(coreProps);
  }
  const machine = machineRef.current;

  // Track element ref — drag hesaplamaları için
  const trackRectRef = useRef<DOMRect | null>(null);

  // Re-render counter
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync — render sırasında
  const prevValueRef = useRef(coreProps.value);
  const prevDisabledRef = useRef(coreProps.disabled);
  const prevInvalidRef = useRef(coreProps.invalid);

  if (coreProps.value !== prevValueRef.current) {
    machine.send({ type: 'SET_VALUE', value: coreProps.value ?? 0 });
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
    (event: SliderEvent) => {
      const prevCtx = machine.getContext();
      const nextCtx = machine.send(event);
      if (nextCtx !== prevCtx) {
        forceRender();

        // Değer değiştiyse callback çağır
        if (nextCtx.value !== prevCtx.value && onValueChange) {
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

  const handleFocus = useCallback(() => {
    send({ type: 'FOCUS' });
  }, [send]);

  const handleBlur = useCallback(() => {
    send({ type: 'BLUR' });
  }, [send]);

  // ── Drag handlers ──────────────────────────────────────────────

  const handleDragMove = useCallback(
    (event: PointerEvent) => {
      if (!trackRectRef.current) return;
      const ctx = machine.getContext();
      const newValue = getValueFromPointer(
        event,
        trackRectRef.current,
        ctx.min,
        ctx.max,
        ctx.step,
        ctx.orientation,
      );
      send({ type: 'CHANGE', value: newValue });
    },
    [machine, send],
  );

  const handleDragEnd = useCallback(() => {
    send({ type: 'DRAG_END' });
    document.removeEventListener('pointermove', handleDragMove);
    document.removeEventListener('pointerup', handleDragEnd);
  }, [send, handleDragMove]);

  const startDrag = useCallback(
    (event: React.PointerEvent) => {
      if (machine.isInteractionBlocked() || machine.getContext().readOnly) return;

      const trackEl = (event.currentTarget as HTMLElement).closest('[data-orientation]');
      if (trackEl) {
        trackRectRef.current = trackEl.getBoundingClientRect();
      }

      send({ type: 'DRAG_START' });

      // İlk tıklama konumundan değer hesapla
      if (trackRectRef.current) {
        const ctx = machine.getContext();
        const newValue = getValueFromPointer(
          event,
          trackRectRef.current,
          ctx.min,
          ctx.max,
          ctx.step,
          ctx.orientation,
        );
        send({ type: 'CHANGE', value: newValue });
      }

      document.addEventListener('pointermove', handleDragMove);
      document.addEventListener('pointerup', handleDragEnd);
    },
    [machine, send, handleDragMove, handleDragEnd],
  );

  const handleThumbPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (machine.isInteractionBlocked() || machine.getContext().readOnly) return;
      event.preventDefault();

      const trackEl = (event.currentTarget as HTMLElement).parentElement;
      if (trackEl) {
        const orientedEl = trackEl.closest('[data-orientation]');
        if (orientedEl) {
          trackRectRef.current = orientedEl.getBoundingClientRect();
        }
      }

      send({ type: 'DRAG_START' });

      document.addEventListener('pointermove', handleDragMove);
      document.addEventListener('pointerup', handleDragEnd);
    },
    [machine, send, handleDragMove, handleDragEnd],
  );

  // ── Keyboard handler ───────────────────────────────────────────

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const ctx = machine.getContext();
      const isHorizontal = ctx.orientation === 'horizontal';

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          event.preventDefault();
          send({ type: isHorizontal && event.key === 'ArrowRight' ? 'INCREMENT' : 'INCREMENT' });
          break;

        case 'ArrowLeft':
        case 'ArrowDown':
          event.preventDefault();
          send({ type: 'DECREMENT' });
          break;

        case 'Home':
          event.preventDefault();
          send({ type: 'SET_MIN' });
          break;

        case 'End':
          event.preventDefault();
          send({ type: 'SET_MAX' });
          break;
      }
    },
    [machine, send],
  );

  const ctx = machine.getContext();
  const thumbDomProps = machine.getThumbProps();
  const trackDomProps = machine.getTrackProps();

  return {
    thumbProps: {
      ...thumbDomProps,
      onPointerDown: handleThumbPointerDown,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
    },
    trackProps: {
      ...trackDomProps,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPointerDown: startDrag,
    },
    value: ctx.value,
    percent: machine.getPercent(),
    min: ctx.min,
    max: ctx.max,
    orientation: ctx.orientation,
    isDisabled: ctx.disabled,
    isReadOnly: ctx.readOnly,
    isInvalid: ctx.invalid,
  };
}
