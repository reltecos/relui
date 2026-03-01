/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MDI (Multiple Document Interface) — iç içe pencere yönetimi bileşeni.
 *
 * Çoklu pencere, cascade/tile düzenleme, z-ordering, minimize/maximize.
 *
 * @packageDocumentation
 */

import React, {
  forwardRef,
  useRef,
  useReducer,
  useEffect,
  useCallback,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createMDI } from '@relteco/relui-core';
import type { MDIAPI, MDIWindowConfig } from '@relteco/relui-core';
import { getSlotProps, type SlotStyleProps } from '../utils';

/** MDI slot isimleri. */
export type MDISlot = 'root' | 'window' | 'titleBar' | 'title' | 'controls' | 'content' | 'taskbar' | 'taskbarItem';

/** MDI bileşen prop'ları. */
export interface MDIComponentProps
  extends SlotStyleProps<MDISlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Başlangıç pencereleri. */
  windows?: MDIWindowConfig[];
  /** Pencere içeriği render fonksiyonu. */
  renderWindow: (windowId: string, title: string) => ReactNode;
  /** Taskbar göster. Varsayılan: true. */
  showTaskbar?: boolean;
  /** Pencere kapatıldığında çağrılır. */
  onWindowClose?: (id: string) => void;
  /** Aktif pencere değiştiğinde çağrılır. */
  onActiveWindowChange?: (id: string | null) => void;
}

/**
 * MDI — Multiple Document Interface.
 *
 * @example
 * ```tsx
 * <MDI
 *   windows={[
 *     { id: 'doc1', title: 'Document 1' },
 *     { id: 'doc2', title: 'Document 2' },
 *   ]}
 *   renderWindow={(id) => <div>Content for {id}</div>}
 * />
 * ```
 */
export const MDI = forwardRef<HTMLDivElement, MDIComponentProps>(
  function MDI(props, ref) {
    const {
      children: _children,
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

    const rootSlot = getSlotProps('root', undefined, classNames, slotStyles, {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      background: 'var(--rel-color-bg-muted, #f1f5f9)',
      ...style,
    });

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    // ── Control button style ──────────────────────────

    const controlBtnStyle: CSSProperties = {
      width: 20,
      height: 20,
      border: 'none',
      borderRadius: 3,
      background: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
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
        data-mdi
      >
        {/* Windows */}
        {allWindows.map((win) => {
          if (win.state === 'minimized') return null;

          const windowSlot = getSlotProps('window', undefined, classNames, slotStyles, {
            position: 'absolute',
            left: win.x,
            top: win.y,
            width: win.width,
            height: win.height,
            zIndex: win.zIndex,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: win.active
              ? '0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)'
              : '0 4px 16px rgba(0,0,0,0.1)',
            borderRadius: win.state === 'maximized' ? 0 : 6,
            overflow: 'hidden',
            background: 'var(--rel-color-bg, #fff)',
          });

          const titleBarSlot = getSlotProps('titleBar', undefined, classNames, slotStyles, {
            display: 'flex',
            alignItems: 'center',
            padding: '6px 10px',
            background: win.active
              ? 'var(--rel-color-primary, #3b82f6)'
              : 'var(--rel-color-bg-subtle, #f8fafc)',
            borderBottom: '1px solid var(--rel-color-border, #e2e8f0)',
            cursor: 'grab',
            userSelect: 'none',
            flexShrink: 0,
          });

          const titleSlot = getSlotProps('title', undefined, classNames, slotStyles, {
            flex: 1,
            fontSize: 12,
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap' as const,
            color: win.active ? '#fff' : 'var(--rel-color-text, #1e293b)',
          });

          const controlsSlot = getSlotProps('controls', undefined, classNames, slotStyles, {
            display: 'flex',
            gap: 2,
            marginLeft: 6,
          });

          const contentSlot = getSlotProps('content', undefined, classNames, slotStyles, {
            flex: 1,
            overflow: 'auto',
          });

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
                    style={{ ...controlBtnStyle, color: win.active ? 'rgba(255,255,255,0.8)' : controlBtnStyle.color }}
                    aria-label="Minimize"
                    data-mdi-control="minimize"
                  >
                    &#x2014;
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleMaximize(win.id); }}
                    style={{ ...controlBtnStyle, color: win.active ? 'rgba(255,255,255,0.8)' : controlBtnStyle.color }}
                    aria-label={win.state === 'maximized' ? 'Restore' : 'Maximize'}
                    data-mdi-control="maximize"
                  >
                    {win.state === 'maximized' ? '\u29C9' : '\u25A1'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleClose(win.id); }}
                    style={{ ...controlBtnStyle, color: win.active ? 'rgba(255,255,255,0.8)' : controlBtnStyle.color }}
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
                {renderWindow(win.id, win.title)}
              </div>
            </div>
          );
        })}

        {/* Taskbar */}
        {showTaskbar && allWindows.length > 0 && (
          <div
            className={getSlotProps('taskbar', undefined, classNames, slotStyles, {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              padding: '0 4px',
              background: 'var(--rel-color-bg-subtle, #f8fafc)',
              borderTop: '1px solid var(--rel-color-border, #e2e8f0)',
              zIndex: 1000,
            }).className || undefined}
            style={getSlotProps('taskbar', undefined, classNames, slotStyles, {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              padding: '0 4px',
              background: 'var(--rel-color-bg-subtle, #f8fafc)',
              borderTop: '1px solid var(--rel-color-border, #e2e8f0)',
              zIndex: 1000,
            }).style}
            data-mdi-taskbar
          >
            {allWindows.map((win) => {
              const itemSlot = getSlotProps('taskbarItem', undefined, classNames, slotStyles, {
                padding: '4px 10px',
                fontSize: 11,
                cursor: 'pointer',
                border: '1px solid var(--rel-color-border, #e2e8f0)',
                borderRadius: 3,
                background: win.active ? 'var(--rel-color-primary, #3b82f6)' : 'var(--rel-color-bg, #fff)',
                color: win.active ? '#fff' : 'var(--rel-color-text, #1e293b)',
                fontWeight: win.active ? 600 : 400,
                whiteSpace: 'nowrap' as const,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 150,
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
