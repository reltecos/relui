/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FloatingWindow — taşınabilir/boyutlandırılabilir pencere bileşeni.
 *
 * Title bar sürükleme, minimize/maximize/restore ve resize destekler.
 *
 * @packageDocumentation
 */

import React, {
  forwardRef,
  useRef,
  useEffect,
  useReducer,
  useCallback,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createFloatingWindow } from '@relteco/relui-core';
import type { FloatingWindowAPI, WindowPosition, WindowSize } from '@relteco/relui-core';
import { getSlotProps, type SlotStyleProps } from '../utils';

/** FloatingWindow slot isimleri. */
export type FloatingWindowSlot = 'root' | 'titleBar' | 'title' | 'controls' | 'content';

/** FloatingWindow bileşen prop'ları. */
export interface FloatingWindowComponentProps
  extends SlotStyleProps<FloatingWindowSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Pencere başlığı. */
  title?: ReactNode;
  /** Başlangıç pozisyonu. */
  defaultPosition?: WindowPosition;
  /** Başlangıç boyutu. */
  defaultSize?: WindowSize;
  /** Minimum boyut. */
  minSize?: WindowSize;
  /** Maksimum boyut. */
  maxSize?: WindowSize;
  /** Taşınabilir mi. Varsayılan: true. */
  draggable?: boolean;
  /** Boyutlandırılabilir mi. Varsayılan: true. */
  resizable?: boolean;
  /** Minimize butonu göster. Varsayılan: true. */
  showMinimize?: boolean;
  /** Maximize butonu göster. Varsayılan: true. */
  showMaximize?: boolean;
  /** Close butonu göster. Varsayılan: true. */
  showClose?: boolean;
  /** z-index. */
  zIndex?: number;
  /** Kapatıldığında çağrılır. */
  onClose?: () => void;
  /** Focus aldığında çağrılır. */
  onFocus?: () => void;
  /** Pozisyon değiştiğinde çağrılır. */
  onPositionChange?: (position: WindowPosition) => void;
  /** Boyut değiştiğinde çağrılır. */
  onSizeChange?: (size: WindowSize) => void;
}

/**
 * FloatingWindow — taşınabilir/boyutlandırılabilir pencere.
 *
 * @example
 * ```tsx
 * <FloatingWindow title="My Window" defaultPosition={{ x: 100, y: 100 }}>
 *   <p>Window content</p>
 * </FloatingWindow>
 * ```
 */
export const FloatingWindow = forwardRef<HTMLDivElement, FloatingWindowComponentProps>(
  function FloatingWindow(props, ref) {
    const {
      children,
      className,
      style,
      classNames,
      styles: slotStyles,
      title,
      defaultPosition,
      defaultSize,
      minSize,
      maxSize,
      draggable = true,
      resizable = true,
      showMinimize = true,
      showMaximize = true,
      showClose = true,
      zIndex,
      onClose,
      onFocus: _onFocus,
      onPositionChange,
      onSizeChange,
      ...rest
    } = props;

    const apiRef = useRef<FloatingWindowAPI | null>(null);
    if (apiRef.current === null) {
      apiRef.current = createFloatingWindow({
        defaultPosition,
        defaultSize,
        minSize,
        maxSize,
        draggable,
        resizable,
        zIndex,
      });
    }
    const api = apiRef.current;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // ── Ref merge ────────────────────────────────────────

    const mergedRef = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    // ── Drag handlers ────────────────────────────────────

    const handleTitleBarPointerDown = useCallback((e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('[data-window-control]')) return;
      e.preventDefault();
      api.send({ type: 'DRAG_START', startX: e.clientX, startY: e.clientY });
      forceRender();
    }, [api]);

    useEffect(() => {
      const handlePointerMove = (e: PointerEvent) => {
        if (!api.isDragging()) return;
        api.send({ type: 'DRAG', currentX: e.clientX, currentY: e.clientY });
        forceRender();
      };

      const handlePointerUp = () => {
        if (!api.isDragging()) return;
        api.send({ type: 'DRAG_END' });
        forceRender();
        onPositionChange?.(api.getPosition());
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }, [api, onPositionChange]);

    // ── Window controls ──────────────────────────────────

    const handleMinimize = () => {
      api.send({ type: 'MINIMIZE' });
      forceRender();
    };

    const handleMaximize = () => {
      const state = api.getState();
      if (state === 'maximized') {
        api.send({ type: 'RESTORE' });
      } else {
        const parent = containerRef.current?.parentElement;
        const w = parent?.clientWidth ?? window.innerWidth;
        const h = parent?.clientHeight ?? window.innerHeight;
        api.send({ type: 'MAXIMIZE', containerWidth: w, containerHeight: h });
      }
      forceRender();
      onPositionChange?.(api.getPosition());
      onSizeChange?.(api.getSize());
    };

    // ── State ────────────────────────────────────────────

    const position = api.getPosition();
    const size = api.getSize();
    const windowState = api.getState();
    const currentZIndex = api.getZIndex();

    // ── Slot props ───────────────────────────────────────

    const rootSlot = getSlotProps(
      'root',
      undefined,
      classNames,
      slotStyles,
      {
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: currentZIndex,
        display: windowState === 'minimized' ? 'none' : 'flex',
        flexDirection: 'column' as const,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: windowState === 'maximized' ? 0 : 8,
        overflow: 'hidden',
        background: 'var(--rel-color-bg, #fff)',
        ...style,
      },
    );

    const titleBarSlot = getSlotProps('titleBar', undefined, classNames, slotStyles, {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      background: 'var(--rel-color-bg-subtle, #f8fafc)',
      borderBottom: '1px solid var(--rel-color-border, #e2e8f0)',
      cursor: draggable ? 'grab' : 'default',
      userSelect: 'none',
      flexShrink: 0,
    });

    const titleSlot = getSlotProps('title', undefined, classNames, slotStyles, {
      flex: 1,
      fontSize: 13,
      fontWeight: 600,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    });

    const controlsSlot = getSlotProps('controls', undefined, classNames, slotStyles, {
      display: 'flex',
      gap: 4,
      marginLeft: 8,
    });

    const contentSlot = getSlotProps('content', undefined, classNames, slotStyles, {
      flex: 1,
      overflow: 'auto',
    });

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    // ── Control button style ─────────────────────────────

    const controlBtnStyle: CSSProperties = {
      width: 24,
      height: 24,
      border: 'none',
      borderRadius: 4,
      background: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      lineHeight: 1,
      color: 'var(--rel-color-text-muted, #64748b)',
      padding: 0,
    };

    return (
      <div
        ref={mergedRef}
        {...rest}
        className={finalClass}
        style={rootSlot.style}
        data-window-state={windowState}
        data-dragging={api.isDragging() || undefined}
      >
        <div
          className={titleBarSlot.className || undefined}
          style={titleBarSlot.style}
          onPointerDown={handleTitleBarPointerDown}
          data-title-bar
        >
          <div
            className={titleSlot.className || undefined}
            style={titleSlot.style}
          >
            {title}
          </div>
          <div
            className={controlsSlot.className || undefined}
            style={controlsSlot.style}
          >
            {showMinimize && (
              <button
                type="button"
                onClick={handleMinimize}
                style={controlBtnStyle}
                aria-label="Minimize"
                data-window-control="minimize"
              >
                &#x2014;
              </button>
            )}
            {showMaximize && (
              <button
                type="button"
                onClick={handleMaximize}
                style={controlBtnStyle}
                aria-label={windowState === 'maximized' ? 'Restore' : 'Maximize'}
                data-window-control="maximize"
              >
                {windowState === 'maximized' ? '\u29C9' : '\u25A1'}
              </button>
            )}
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                style={controlBtnStyle}
                aria-label="Close"
                data-window-control="close"
              >
                &#x2715;
              </button>
            )}
          </div>
        </div>
        <div
          className={contentSlot.className || undefined}
          style={contentSlot.style}
          data-window-content
        >
          {children}
        </div>
      </div>
    );
  },
);
