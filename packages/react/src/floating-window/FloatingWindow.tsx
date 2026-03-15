/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FloatingWindow — tasinabilir/boyutlandirilabilir pencere bilesen (Dual API).
 *
 * Props-based: `<FloatingWindow title="My Window"><p>Content</p></FloatingWindow>`
 * Compound:    `<FloatingWindow><FloatingWindow.Header title="My Window" /><FloatingWindow.Body>...</FloatingWindow.Body></FloatingWindow>`
 *
 * @packageDocumentation
 */

import React, {
  forwardRef,
  createContext,
  useContext,
  useRef,
  useEffect,
  useReducer,
  useCallback,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createFloatingWindow } from '@relteco/relui-core';
import type { FloatingWindowAPI, WindowPosition, WindowSize } from '@relteco/relui-core';
import {
  rootStyle,
  rootMaximizedStyle,
  titleBarStyle,
  titleStyle,
  controlsStyle,
  controlButtonStyle,
  contentStyle,
} from './floating-window.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** FloatingWindow slot isimleri. */
export type FloatingWindowSlot = 'root' | 'titleBar' | 'title' | 'controls' | 'content';

// ── Context (Compound API) ──────────────────────────

interface FloatingWindowContextValue {
  api: FloatingWindowAPI;
  containerRef: React.RefObject<HTMLDivElement | null>;
  forceRender: () => void;
  draggable: boolean;
  onClose?: () => void;
  onPositionChange?: (position: WindowPosition) => void;
  onSizeChange?: (size: WindowSize) => void;
  showMinimize: boolean;
  showMaximize: boolean;
  showClose: boolean;
  classNames: ClassNames<FloatingWindowSlot> | undefined;
  styles: Styles<FloatingWindowSlot> | undefined;
}

const FloatingWindowContext = createContext<FloatingWindowContextValue | null>(null);

function useFloatingWindowContext(): FloatingWindowContextValue {
  const ctx = useContext(FloatingWindowContext);
  if (!ctx) throw new Error('FloatingWindow compound sub-components must be used within <FloatingWindow>.');
  return ctx;
}

// ── Compound: FloatingWindow.Header ─────────────────

/** FloatingWindow.Header props */
export interface FloatingWindowHeaderProps {
  /** Pencere basligi / Window title */
  title?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Children (ozel icerik) / Custom content */
  children?: ReactNode;
}

const FloatingWindowHeader = forwardRef<HTMLDivElement, FloatingWindowHeaderProps>(
  function FloatingWindowHeader(props, ref) {
    const { title, className, children } = props;
    const ctx = useFloatingWindowContext();
    const api = ctx.api;
    const windowState = api.getState();

    const handleTitleBarPointerDown = useCallback((e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('[data-window-control]')) return;
      e.preventDefault();
      api.send({ type: 'DRAG_START', startX: e.clientX, startY: e.clientY });
      ctx.forceRender();
    }, [api, ctx]);

    const handleMinimize = () => {
      api.send({ type: 'MINIMIZE' });
      ctx.forceRender();
    };

    const handleMaximize = () => {
      const state = api.getState();
      if (state === 'maximized') {
        api.send({ type: 'RESTORE' });
      } else {
        const parent = ctx.containerRef.current?.parentElement;
        const w = parent?.clientWidth ?? window.innerWidth;
        const h = parent?.clientHeight ?? window.innerHeight;
        api.send({ type: 'MAXIMIZE', containerWidth: w, containerHeight: h });
      }
      ctx.forceRender();
      ctx.onPositionChange?.(api.getPosition());
      ctx.onSizeChange?.(api.getSize());
    };

    const slot = getSlotProps('titleBar', titleBarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const titleSlot = getSlotProps('title', titleStyle, ctx.classNames, ctx.styles);
    const ctrlSlot = getSlotProps('controls', controlsStyle, ctx.classNames, ctx.styles);

    return (
      <div
        ref={ref}
        className={cls}
        style={{ ...slot.style, cursor: ctx.draggable ? 'grab' : 'default' }}
        onPointerDown={handleTitleBarPointerDown}
        data-title-bar
        data-testid="floating-window-titleBar"
      >
        {children ?? (
          <>
            <div className={titleSlot.className || undefined} style={titleSlot.style}>
              {title}
            </div>
            <div className={ctrlSlot.className || undefined} style={ctrlSlot.style}>
              {ctx.showMinimize && (
                <button
                  type="button"
                  onClick={handleMinimize}
                  className={controlButtonStyle}
                  aria-label="Minimize"
                  data-window-control="minimize"
                >
                  &#x2014;
                </button>
              )}
              {ctx.showMaximize && (
                <button
                  type="button"
                  onClick={handleMaximize}
                  className={controlButtonStyle}
                  aria-label={windowState === 'maximized' ? 'Restore' : 'Maximize'}
                  data-window-control="maximize"
                >
                  {windowState === 'maximized' ? '\u29C9' : '\u25A1'}
                </button>
              )}
              {ctx.showClose && (
                <button
                  type="button"
                  onClick={ctx.onClose}
                  className={controlButtonStyle}
                  aria-label="Close"
                  data-window-control="close"
                >
                  &#x2715;
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  },
);

// ── Compound: FloatingWindow.Body ───────────────────

/** FloatingWindow.Body props */
export interface FloatingWindowBodyProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const FloatingWindowBody = forwardRef<HTMLDivElement, FloatingWindowBodyProps>(
  function FloatingWindowBody(props, ref) {
    const { children, className } = props;
    const ctx = useFloatingWindowContext();
    const slot = getSlotProps('content', contentStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-window-content
        data-testid="floating-window-content"
      >
        {children}
      </div>
    );
  },
);

// ── Compound: FloatingWindow.CloseButton ────────────

/** FloatingWindow.CloseButton props */
export interface FloatingWindowCloseButtonProps {
  /** Ek className / Additional className */
  className?: string;
  /** Children (ozel icerik) / Custom content */
  children?: ReactNode;
}

const FloatingWindowCloseButton = forwardRef<HTMLButtonElement, FloatingWindowCloseButtonProps>(
  function FloatingWindowCloseButton(props, ref) {
    const { className, children } = props;
    const ctx = useFloatingWindowContext();
    const cls = className ? `${controlButtonStyle} ${className}` : controlButtonStyle;

    return (
      <button
        ref={ref}
        type="button"
        onClick={ctx.onClose}
        className={cls}
        aria-label="Close"
        data-window-control="close"
        data-testid="floating-window-closeButton"
      >
        {children ?? '\u2715'}
      </button>
    );
  },
);

// ── Component Props ───────────────────────────────────

/** FloatingWindow bilesen prop'lari. */
export interface FloatingWindowComponentProps
  extends SlotStyleProps<FloatingWindowSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Pencere basligi. */
  title?: ReactNode;
  /** Baslangic pozisyonu. */
  defaultPosition?: WindowPosition;
  /** Baslangic boyutu. */
  defaultSize?: WindowSize;
  /** Minimum boyut. */
  minSize?: WindowSize;
  /** Maksimum boyut. */
  maxSize?: WindowSize;
  /** Tasinabilir mi. Varsayilan: true. */
  draggable?: boolean;
  /** Boyutlandirilabilir mi. Varsayilan: true. */
  resizable?: boolean;
  /** Minimize butonu goster. Varsayilan: true. */
  showMinimize?: boolean;
  /** Maximize butonu goster. Varsayilan: true. */
  showMaximize?: boolean;
  /** Close butonu goster. Varsayilan: true. */
  showClose?: boolean;
  /** z-index. */
  zIndex?: number;
  /** Kapatildiginda cagrilir. */
  onClose?: () => void;
  /** Focus aldiginda cagrilir. */
  onFocus?: () => void;
  /** Pozisyon degistiginde cagrilir. */
  onPositionChange?: (position: WindowPosition) => void;
  /** Boyut degistiginde cagrilir. */
  onSizeChange?: (size: WindowSize) => void;
}

// ── Component ─────────────────────────────────────────

const FloatingWindowBase = forwardRef<HTMLDivElement, FloatingWindowComponentProps>(
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
    const rootCls = windowState === 'maximized'
      ? `${rootStyle} ${rootMaximizedStyle}`
      : rootStyle;
    const rootSlot = getSlotProps('root', rootCls, classNames, slotStyles, {
      left: position.x,
      top: position.y,
      width: size.width,
      height: size.height,
      zIndex: currentZIndex,
      display: windowState === 'minimized' ? 'none' : undefined,
      ...style,
    });

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    // ── Check for compound usage ─────────────────────────
    const hasCompoundChildren = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        (child.type === FloatingWindowHeader ||
         child.type === FloatingWindowBody ||
         child.type === FloatingWindowCloseButton),
    );

    const ctxValue: FloatingWindowContextValue = {
      api,
      containerRef: containerRef as React.RefObject<HTMLDivElement | null>,
      forceRender,
      draggable,
      onClose,
      onPositionChange,
      onSizeChange,
      showMinimize,
      showMaximize,
      showClose,
      classNames,
      styles: slotStyles,
    };

    // ── Compound API ──
    if (hasCompoundChildren) {
      return (
        <FloatingWindowContext.Provider value={ctxValue}>
          <div
            ref={mergedRef}
            {...rest}
            className={finalClass}
            style={rootSlot.style}
            data-window-state={windowState}
            data-dragging={api.isDragging() || undefined}
          >
            {children}
          </div>
        </FloatingWindowContext.Provider>
      );
    }

    // ── Props-based API ──
    const titleBarSlot = getSlotProps('titleBar', titleBarStyle, classNames, slotStyles);
    const titleSlotResult = getSlotProps('title', titleStyle, classNames, slotStyles);
    const ctrlSlot = getSlotProps('controls', controlsStyle, classNames, slotStyles);
    const contentSlot = getSlotProps('content', contentStyle, classNames, slotStyles);

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
          style={{ ...titleBarSlot.style, cursor: draggable ? 'grab' : 'default' }}
          onPointerDown={handleTitleBarPointerDown}
          data-title-bar
        >
          <div
            className={titleSlotResult.className || undefined}
            style={titleSlotResult.style}
          >
            {title}
          </div>
          <div
            className={ctrlSlot.className || undefined}
            style={ctrlSlot.style}
          >
            {showMinimize && (
              <button
                type="button"
                onClick={handleMinimize}
                className={controlButtonStyle}
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
                className={controlButtonStyle}
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
                className={controlButtonStyle}
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

/**
 * FloatingWindow bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <FloatingWindow title="My Window" defaultPosition={{ x: 100, y: 100 }}>
 *   <p>Window content</p>
 * </FloatingWindow>
 * ```
 *
 * @example Compound
 * ```tsx
 * <FloatingWindow>
 *   <FloatingWindow.Header title="My Window" />
 *   <FloatingWindow.Body><p>Window content</p></FloatingWindow.Body>
 * </FloatingWindow>
 * ```
 */
export const FloatingWindow = Object.assign(FloatingWindowBase, {
  Header: FloatingWindowHeader,
  Body: FloatingWindowBody,
  CloseButton: FloatingWindowCloseButton,
});
