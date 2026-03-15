/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MDI (Multiple Document Interface) — ic ice pencere yonetimi bilesen (Dual API).
 *
 * Props-based: `<MDI windows={[...]} renderWindow={...} />`
 * Compound:    `<MDI><MDI.Window id="doc1" title="Doc 1">...</MDI.Window><MDI.Toolbar /></MDI>`
 *
 * @packageDocumentation
 */

import React, {
  forwardRef,
  createContext,
  useContext,
  useRef,
  useReducer,
  useEffect,
  useCallback,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createMDI } from '@relteco/relui-core';
import type { MDIAPI, MDIWindowConfig } from '@relteco/relui-core';
import {
  rootStyle,
  windowStyle,
  windowMaximizedStyle,
  titleBarStyle,
  titleBarActiveStyle,
  titleBarInactiveStyle,
  titleStyle,
  controlsStyle,
  controlButtonStyle,
  contentStyle,
  taskbarStyle,
  taskbarItemStyle,
} from './mdi.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** MDI slot isimleri. */
export type MDISlot = 'root' | 'window' | 'titleBar' | 'title' | 'controls' | 'content' | 'taskbar' | 'taskbarItem';

// ── Context (Compound API) ──────────────────────────

interface MDIContextValue {
  classNames: ClassNames<MDISlot> | undefined;
  styles: Styles<MDISlot> | undefined;
}

const MDIContext = createContext<MDIContextValue | null>(null);

function useMDIContext(): MDIContextValue {
  const ctx = useContext(MDIContext);
  if (!ctx) throw new Error('MDI compound sub-components must be used within <MDI>.');
  return ctx;
}

// ── Compound: MDI.Window ────────────────────────────

/** MDI.Window props */
export interface MDIWindowProps {
  /** Pencere ID */
  id: string;
  /** Pencere basligi / Window title */
  title: string;
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const MDIWindow = forwardRef<HTMLDivElement, MDIWindowProps>(
  function MDIWindow(props, ref) {
    const { id, title, children, className } = props;
    const ctx = useMDIContext();
    const slot = getSlotProps('window', windowStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls || undefined}
        style={slot.style}
        data-mdi-window={id}
        data-testid="mdi-window"
      >
        <div className={`${titleBarStyle} ${titleBarInactiveStyle}`} data-mdi-title-bar>
          <div className={titleStyle}>{title}</div>
        </div>
        <div className={contentStyle} data-mdi-content>
          {children}
        </div>
      </div>
    );
  },
);

// ── Compound: MDI.Toolbar ───────────────────────────

/** MDI.Toolbar props */
export interface MDIToolbarProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const MDIToolbar = forwardRef<HTMLDivElement, MDIToolbarProps>(
  function MDIToolbar(props, ref) {
    const { children, className } = props;
    const ctx = useMDIContext();
    const slot = getSlotProps('taskbar', taskbarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls || undefined}
        style={slot.style}
        data-mdi-taskbar
        data-testid="mdi-toolbar"
      >
        {children}
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

/** MDI bilesen prop'lari. */
export interface MDIComponentProps
  extends SlotStyleProps<MDISlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Baslangic pencereleri. */
  windows?: MDIWindowConfig[];
  /** Pencere icerigi render fonksiyonu. */
  renderWindow?: (windowId: string, title: string) => ReactNode;
  /** Taskbar goster. Varsayilan: true. */
  showTaskbar?: boolean;
  /** Pencere kapatildiginda cagrilir. */
  onWindowClose?: (id: string) => void;
  /** Aktif pencere degistiginde cagrilir. */
  onActiveWindowChange?: (id: string | null) => void;
  /** Compound API icin children */
  children?: ReactNode;
}

// ── Component ─────────────────────────────────────────

const MDIBase = forwardRef<HTMLDivElement, MDIComponentProps>(
  function MDI(props, ref) {
    const {
      children,
      className,
      style,
      classNames,
      styles: slotStyles,
      windows: initialWindows,
      renderWindow,
      showTaskbar = true,
      onWindowClose,
      onActiveWindowChange,
      ...rest
    } = props;

    const apiRef = useRef<MDIAPI | null>(null);
    if (apiRef.current === null) {
      apiRef.current = createMDI({ windows: initialWindows });
    }
    const api = apiRef.current;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // ── Ref merge ─────────────────────────────────────
    const mergedRef = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    // ── ResizeObserver ────────────────────────────────
    useEffect(() => {
      const node = containerRef.current;
      if (!node) return;

      const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          api.send({
            type: 'SET_CONTAINER_SIZE',
            width: entry.contentRect.width,
            height: entry.contentRect.height - (showTaskbar ? 36 : 0),
          });
        }
      });
      ro.observe(node);
      return () => ro.disconnect();
    }, [api, showTaskbar]);

    // ── Drag state ────────────────────────────────────
    const dragRef = useRef<{
      windowId: string;
      startX: number;
      startY: number;
      origX: number;
      origY: number;
    } | null>(null);

    const handleTitleBarPointerDown = useCallback((e: React.PointerEvent, windowId: string) => {
      if ((e.target as HTMLElement).closest('[data-mdi-control]')) return;
      e.preventDefault();
      const win = api.getWindow(windowId);
      if (!win || win.state === 'maximized') return;

      dragRef.current = {
        windowId,
        startX: e.clientX,
        startY: e.clientY,
        origX: win.x,
        origY: win.y,
      };

      api.send({ type: 'ACTIVATE_WINDOW', id: windowId });
      forceRender();
    }, [api]);

    useEffect(() => {
      const handlePointerMove = (e: PointerEvent) => {
        if (!dragRef.current) return;
        const { windowId, startX, startY, origX, origY } = dragRef.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        api.send({ type: 'MOVE_WINDOW', id: windowId, x: origX + dx, y: origY + dy });
        forceRender();
      };

      const handlePointerUp = () => {
        dragRef.current = null;
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }, [api]);

    // ── Window control handlers ───────────────────────
    const handleMinimize = (id: string) => {
      api.send({ type: 'MINIMIZE_WINDOW', id });
      forceRender();
      onActiveWindowChange?.(api.getActiveWindowId());
    };

    const handleMaximize = (id: string) => {
      const win = api.getWindow(id);
      if (!win) return;
      if (win.state === 'maximized') {
        api.send({ type: 'RESTORE_WINDOW', id });
      } else {
        api.send({ type: 'MAXIMIZE_WINDOW', id });
      }
      forceRender();
    };

    const handleClose = (id: string) => {
      api.send({ type: 'CLOSE_WINDOW', id });
      forceRender();
      onWindowClose?.(id);
      onActiveWindowChange?.(api.getActiveWindowId());
    };

    const handleActivate = (id: string) => {
      const win = api.getWindow(id);
      if (win?.state === 'minimized') {
        api.send({ type: 'RESTORE_WINDOW', id });
      }
      api.send({ type: 'ACTIVATE_WINDOW', id });
      forceRender();
      onActiveWindowChange?.(id);
    };

    // ── State ─────────────────────────────────────────
    const allWindows = api.getWindows();

    // ── Slot props ────────────────────────────────────
    const rootSlot = getSlotProps('root', rootStyle, classNames, slotStyles, style);
    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    const ctxValue: MDIContextValue = {
      classNames,
      styles: slotStyles,
    };

    // ── Compound API check ──
    const hasCompoundChildren = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        (child.type === MDIWindow || child.type === MDIToolbar),
    );

    if (hasCompoundChildren) {
      return (
        <MDIContext.Provider value={ctxValue}>
          <div
            ref={mergedRef}
            {...rest}
            className={finalClass}
            style={rootSlot.style}
            data-mdi
          >
            {children}
          </div>
        </MDIContext.Provider>
      );
    }

    // ── Props-based API ──
    return (
      <div
        ref={mergedRef}
        {...rest}
        className={finalClass}
        style={rootSlot.style}
        data-mdi
      >
        {/* Windows */}
        {allWindows.map((win) => {
          if (win.state === 'minimized') return null;

          const winCls = win.state === 'maximized'
            ? `${windowStyle} ${windowMaximizedStyle}`
            : windowStyle;
          const windowSlot = getSlotProps('window', winCls, classNames, slotStyles, {
            left: win.x,
            top: win.y,
            width: win.width,
            height: win.height,
            zIndex: win.zIndex,
            boxShadow: win.active
              ? '0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)'
              : '0 4px 16px rgba(0,0,0,0.1)',
          });

          const tbCls = win.active
            ? `${titleBarStyle} ${titleBarActiveStyle}`
            : `${titleBarStyle} ${titleBarInactiveStyle}`;
          const titleBarSlot = getSlotProps('titleBar', tbCls, classNames, slotStyles);

          const titleSlot = getSlotProps('title', titleStyle, classNames, slotStyles, {
            color: win.active ? 'var(--rel-color-text-inverse, #fff)' : 'var(--rel-color-text, #1e293b)',
          });

          const controlsSlot = getSlotProps('controls', controlsStyle, classNames, slotStyles);
          const contentSlot = getSlotProps('content', contentStyle, classNames, slotStyles);

          return (
            <div
              key={win.id}
              className={windowSlot.className || undefined}
              style={windowSlot.style}
              data-mdi-window={win.id}
              data-mdi-state={win.state}
              data-mdi-active={win.active || undefined}
              onClick={() => handleActivate(win.id)}
            >
              <div
                className={titleBarSlot.className || undefined}
                style={titleBarSlot.style}
                onPointerDown={(e) => handleTitleBarPointerDown(e, win.id)}
                data-mdi-title-bar
              >
                <div
                  className={titleSlot.className || undefined}
                  style={titleSlot.style}
                >
                  {win.title}
                </div>
                <div
                  className={controlsSlot.className || undefined}
                  style={controlsSlot.style}
                >
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleMinimize(win.id); }}
                    className={controlButtonStyle}
                    style={win.active ? { color: 'var(--rel-color-text-inverse-muted, rgba(255,255,255,0.8))' } : undefined}
                    aria-label="Minimize"
                    data-mdi-control="minimize"
                  >
                    &#x2014;
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleMaximize(win.id); }}
                    className={controlButtonStyle}
                    style={win.active ? { color: 'var(--rel-color-text-inverse-muted, rgba(255,255,255,0.8))' } : undefined}
                    aria-label={win.state === 'maximized' ? 'Restore' : 'Maximize'}
                    data-mdi-control="maximize"
                  >
                    {win.state === 'maximized' ? '\u29C9' : '\u25A1'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleClose(win.id); }}
                    className={controlButtonStyle}
                    style={win.active ? { color: 'var(--rel-color-text-inverse-muted, rgba(255,255,255,0.8))' } : undefined}
                    aria-label="Close"
                    data-mdi-control="close"
                  >
                    &#x2715;
                  </button>
                </div>
              </div>
              <div
                className={contentSlot.className || undefined}
                style={contentSlot.style}
                data-mdi-content
              >
                {renderWindow ? renderWindow(win.id, win.title) : null}
              </div>
            </div>
          );
        })}

        {/* Taskbar */}
        {showTaskbar && allWindows.length > 0 && (
          <div
            className={getSlotProps('taskbar', taskbarStyle, classNames, slotStyles).className || undefined}
            style={getSlotProps('taskbar', taskbarStyle, classNames, slotStyles).style}
            data-mdi-taskbar
          >
            {allWindows.map((win) => {
              const itemSlot = getSlotProps('taskbarItem', taskbarItemStyle, classNames, slotStyles, {
                background: win.active ? 'var(--rel-color-primary, #3b82f6)' : 'var(--rel-color-bg, #fff)',
                color: win.active ? 'var(--rel-color-text-inverse, #fff)' : 'var(--rel-color-text, #1e293b)',
                fontWeight: win.active ? 600 : 400,
              });

              return (
                <button
                  key={win.id}
                  type="button"
                  className={itemSlot.className || undefined}
                  style={itemSlot.style}
                  onClick={() => handleActivate(win.id)}
                  data-mdi-taskbar-item={win.id}
                  data-mdi-taskbar-active={win.active || undefined}
                >
                  {win.title}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

/**
 * MDI bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <MDI
 *   windows={[{ id: 'doc1', title: 'Document 1' }]}
 *   renderWindow={(id) => <div>Content for {id}</div>}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <MDI>
 *   <MDI.Window id="doc1" title="Document 1"><div>Content</div></MDI.Window>
 *   <MDI.Toolbar>Custom toolbar</MDI.Toolbar>
 * </MDI>
 * ```
 */
export const MDI = Object.assign(MDIBase, {
  Window: MDIWindow,
  Toolbar: MDIToolbar,
});
