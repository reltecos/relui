/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SignaturePad — dijital imza bilesen (Dual API).
 * SignaturePad — digital signature component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { SignaturePath } from '@relteco/relui-core';
import { rootStyle, canvasStyle, controlsStyle, controlButtonStyle } from './signature-pad.css';
import { useSignaturePad, type UseSignaturePadProps } from './useSignaturePad';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type SignaturePadSlot = 'root' | 'canvas' | 'controls';

// ── Context ───────────────────────────────────────────

interface SignaturePadContextValue {
  paths: ReadonlyArray<SignaturePath>;
  currentPath: SignaturePath | null;
  canUndo: boolean;
  isEmpty: boolean;
  width: number;
  height: number;
  onDrawStart: (x: number, y: number) => void;
  onDrawMove: (x: number, y: number) => void;
  onDrawEnd: () => void;
  onUndo: () => void;
  onClear: () => void;
  classNames: ClassNames<SignaturePadSlot> | undefined;
  styles: Styles<SignaturePadSlot> | undefined;
}

const SignaturePadCtx = createContext<SignaturePadContextValue | null>(null);

function useSignaturePadContext(): SignaturePadContextValue {
  const ctx = useContext(SignaturePadCtx);
  if (!ctx) throw new Error('SignaturePad compound sub-components must be used within <SignaturePad>.');
  return ctx;
}

// ── Canvas draw helper ────────────────────────────────

function drawPaths(canvas: HTMLCanvasElement, paths: ReadonlyArray<SignaturePath>, current: SignaturePath | null): void {
  const ctx2d = canvas.getContext('2d');
  if (!ctx2d) return;
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);

  const allPaths = current ? [...paths, current] : paths;
  for (const path of allPaths) {
    if (path.points.length < 2) continue;
    ctx2d.beginPath();
    ctx2d.strokeStyle = path.strokeColor;
    ctx2d.lineWidth = path.strokeWidth;
    ctx2d.lineCap = 'round';
    ctx2d.lineJoin = 'round';
    const first = path.points[0];
    if (first) ctx2d.moveTo(first.x, first.y);
    for (let i = 1; i < path.points.length; i++) {
      const p = path.points[i];
      if (p) ctx2d.lineTo(p.x, p.y);
    }
    ctx2d.stroke();
  }
}

// ── Compound: SignaturePad.Canvas ──────────────────────

export interface SignaturePadCanvasProps { className?: string }

const SignaturePadCanvas = forwardRef<HTMLCanvasElement, SignaturePadCanvasProps>(
  function SignaturePadCanvas(props, ref) {
    const { className } = props;
    const sCtx = useSignaturePadContext();
    const slot = getSlotProps('canvas', canvasStyle, sCtx.classNames, sCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingRef = useRef(false);

    // Merge refs
    const mergedRef = useCallback((el: HTMLCanvasElement | null) => {
      (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
    }, [ref]);

    useEffect(() => {
      if (canvasRef.current) drawPaths(canvasRef.current, sCtx.paths, sCtx.currentPath);
    }, [sCtx.paths, sCtx.currentPath]);

    const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        const touch = e.touches[0];
        return { x: (touch?.clientX ?? 0) - rect.left, y: (touch?.clientY ?? 0) - rect.top };
      }
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, []);

    const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      drawingRef.current = true;
      const pos = getPos(e);
      sCtx.onDrawStart(pos.x, pos.y);
    }, [sCtx, getPos]);

    const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      const pos = getPos(e);
      sCtx.onDrawMove(pos.x, pos.y);
    }, [sCtx, getPos]);

    const handlePointerUp = useCallback(() => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      sCtx.onDrawEnd();
    }, [sCtx]);

    return (
      <canvas
        ref={mergedRef}
        className={cls}
        style={slot.style}
        width={sCtx.width}
        height={sCtx.height}
        data-testid="signaturepad-canvas"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        role="img"
        aria-label="Signature pad"
      />
    );
  },
);

// ── Compound: SignaturePad.Controls ────────────────────

export interface SignaturePadControlsProps { className?: string }

const SignaturePadControls = forwardRef<HTMLDivElement, SignaturePadControlsProps>(
  function SignaturePadControls(props, ref) {
    const { className } = props;
    const sCtx = useSignaturePadContext();
    const slot = getSlotProps('controls', controlsStyle, sCtx.classNames, sCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="signaturepad-controls">
        <button type="button" className={controlButtonStyle} onClick={sCtx.onUndo} disabled={!sCtx.canUndo} aria-label="Undo" data-testid="signaturepad-undo">
          Geri Al
        </button>
        <button type="button" className={controlButtonStyle} onClick={sCtx.onClear} disabled={sCtx.isEmpty} aria-label="Clear" data-testid="signaturepad-clear">
          Temizle
        </button>
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface SignaturePadComponentProps extends SlotStyleProps<SignaturePadSlot> {
  /** Canvas genislik / Canvas width */
  width?: number;
  /** Canvas yukseklik / Canvas height */
  height?: number;
  /** Kalinlik / Stroke width */
  strokeWidth?: number;
  /** Renk / Stroke color */
  strokeColor?: string;
  /** Degisim / On change */
  onChange?: (paths: SignaturePath[]) => void;
  /** Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const SignaturePadBase = forwardRef<HTMLDivElement, SignaturePadComponentProps>(
  function SignaturePad(props, ref) {
    const {
      width = 400, height = 200,
      strokeWidth, strokeColor, onChange,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const hookProps: UseSignaturePadProps = {
      defaultStrokeWidth: strokeWidth,
      defaultStrokeColor: strokeColor,
      onChange,
    };
    const { context, send } = useSignaturePad(hookProps);

    const onDrawStart = useCallback((x: number, y: number) => send({ type: 'DRAW_START', x, y }), [send]);
    const onDrawMove = useCallback((x: number, y: number) => send({ type: 'DRAW_MOVE', x, y }), [send]);
    const onDrawEnd = useCallback(() => send({ type: 'DRAW_END' }), [send]);
    const onUndo = useCallback(() => send({ type: 'UNDO' }), [send]);
    const onClear = useCallback(() => send({ type: 'CLEAR' }), [send]);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: SignaturePadContextValue = {
      paths: context.paths, currentPath: context.currentPath,
      canUndo: context.canUndo, isEmpty: context.isEmpty,
      width, height, onDrawStart, onDrawMove, onDrawEnd, onUndo, onClear,
      classNames, styles,
    };

    if (children) {
      return (
        <SignaturePadCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="signaturepad-root">
            {children}
          </div>
        </SignaturePadCtx.Provider>
      );
    }

    return (
      <SignaturePadCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="signaturepad-root">
          <SignaturePadCanvas />
          <SignaturePadControls />
        </div>
      </SignaturePadCtx.Provider>
    );
  },
);

export const SignaturePad = Object.assign(SignaturePadBase, {
  Canvas: SignaturePadCanvas,
  Controls: SignaturePadControls,
});
