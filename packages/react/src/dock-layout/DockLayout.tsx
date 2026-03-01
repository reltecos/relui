/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DockLayout — AvalonDock seviyesi tam interaktif dock layout bileşeni.
 *
 * Recursive tree renderer, compass rose drag & drop, root edge indicators,
 * drag ghost, tab reorder, group drag, floating panel resize, context menu,
 * auto-hide peek, maximize overlay, workspace presets.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  useRef,
  useReducer,
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createDockLayout } from '@relteco/relui-core';
import type {
  DockLayoutAPI,
  DockPanelConfig,
  DockNode,
  DockSplitNode,
  DockGroupNode,
  DockFloatingGroup,
  DropPosition,
} from '@relteco/relui-core';
import { getSlotProps, type SlotStyleProps } from '../utils';

/** DockLayout slot isimleri. */
export type DockLayoutSlot =
  | 'root'
  | 'splitContainer'
  | 'resizeHandle'
  | 'group'
  | 'tabBar'
  | 'tab'
  | 'tabCloseButton'
  | 'panelContent'
  | 'autoHideBar'
  | 'autoHideTab'
  | 'floatingPanel'
  | 'floatingTitleBar'
  | 'dragOverlay'
  | 'maximizedOverlay';

/** DockLayout bilesen prop'lari. */
export interface DockLayoutComponentProps
  extends SlotStyleProps<DockLayoutSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Baslangic panelleri. */
  panels?: DockPanelConfig[];
  /** Baslangic root layout. */
  initialRoot?: DockNode;
  /** Panel icerigi render fonksiyonu. */
  renderPanel: (panelId: string, title: string) => ReactNode;
  /** Panel kapatildiginda cagrilir. */
  onPanelClose?: (panelId: string) => void;
  /** Panel float edildiginde cagrilir. */
  onPanelFloat?: (panelId: string) => void;
  /** Aktif panel degistiginde cagrilir. */
  onActivePanelChange?: (panelId: string) => void;
  /** Layout degistiginde cagrilir. */
  onLayoutChange?: () => void;
}

// ── Drag types ───────────────────────────────────────

interface DragInfo {
  panelId: string;
  sourceGroupId: string;
  startX: number;
  startY: number;
  phase: 'pending' | 'active';
  mode: 'tab' | 'group';
}

interface ActiveDropTarget {
  type: 'group' | 'root';
  groupId: string;
  position: DropPosition;
  rect: DOMRect;
}

interface ContextMenuState {
  panelId: string;
  x: number;
  y: number;
}

interface FloatResizeInfo {
  floatingGroupId: string;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startTop: number;
  direction: string; // n, s, e, w, ne, nw, se, sw
}

// ── Compass rose zone calculation ────────────────────

function computeDropPosition(
  mouseX: number,
  mouseY: number,
  rect: DOMRect,
): DropPosition | null {
  const relX = (mouseX - rect.left) / rect.width;
  const relY = (mouseY - rect.top) / rect.height;

  // Center zone: inner 40%
  const margin = 0.30;
  if (relX >= margin && relX <= 1 - margin && relY >= margin && relY <= 1 - margin) {
    return 'center';
  }

  // Edge zones — use diagonal quadrants
  const fromLeft = relX;
  const fromRight = 1 - relX;
  const fromTop = relY;
  const fromBottom = 1 - relY;
  const minDist = Math.min(fromLeft, fromRight, fromTop, fromBottom);

  if (minDist === fromLeft) return 'left';
  if (minDist === fromRight) return 'right';
  if (minDist === fromTop) return 'top';
  return 'bottom';
}

function computeRootEdge(
  mouseX: number,
  mouseY: number,
  rect: DOMRect,
): DropPosition | null {
  const edgeThreshold = 0.12;
  const relX = (mouseX - rect.left) / rect.width;
  const relY = (mouseY - rect.top) / rect.height;

  if (relX < edgeThreshold) return 'left';
  if (relX > 1 - edgeThreshold) return 'right';
  if (relY < edgeThreshold) return 'top';
  if (relY > 1 - edgeThreshold) return 'bottom';
  return null;
}

// ── Preview rect calculation ─────────────────────────

function getPreviewRect(target: ActiveDropTarget): CSSProperties {
  const r = target.rect;
  switch (target.position) {
    case 'left':
      return { left: r.left, top: r.top, width: r.width * 0.5, height: r.height };
    case 'right':
      return { left: r.left + r.width * 0.5, top: r.top, width: r.width * 0.5, height: r.height };
    case 'top':
      return { left: r.left, top: r.top, width: r.width, height: r.height * 0.5 };
    case 'bottom':
      return { left: r.left, top: r.top + r.height * 0.5, width: r.width, height: r.height * 0.5 };
    case 'center':
      return { left: r.left, top: r.top, width: r.width, height: r.height };
    default:
      return {};
  }
}

/**
 * DockLayout — AvalonDock seviyesi tam interaktif dock layout.
 *
 * @example
 * ```tsx
 * <DockLayout
 *   panels={[
 *     { id: 'explorer', title: 'Explorer' },
 *     { id: 'editor', title: 'Editor' },
 *   ]}
 *   renderPanel={(id, title) => <div>{title} Content</div>}
 * />
 * ```
 */
export const DockLayout = forwardRef<HTMLDivElement, DockLayoutComponentProps>(
  function DockLayout(props, ref) {
    const {
      children: _children,
      className,
      style,
      classNames,
      styles: slotStyles,
      panels: initialPanels,
      initialRoot: initialRootProp,
      renderPanel,
      onPanelClose,
      onPanelFloat: _onPanelFloat,
      onActivePanelChange,
      onLayoutChange: _onLayoutChange,
      ...rest
    } = props;

    const apiRef = useRef<DockLayoutAPI | null>(null);
    if (apiRef.current === null) {
      apiRef.current = createDockLayout({
        panels: initialPanels,
        initialRoot: initialRootProp,
      });
    }
    const api = apiRef.current;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── Refs ─────────────────────────────────────────

    const rootElRef = useRef<HTMLDivElement | null>(null);
    const dragInfoRef = useRef<DragInfo | null>(null);
    const pointerPosRef = useRef({ x: 0, y: 0 });
    const ghostRef = useRef<HTMLDivElement>(null);
    const activeDropTargetRef = useRef<ActiveDropTarget | null>(null);
    const tabReorderRef = useRef<{ groupId: string; insertIndex: number } | null>(null);

    // ── Resize state ─────────────────────────────────

    const resizeRef = useRef<{
      splitId: string;
      handleIndex: number;
      startPos: number;
      totalSize: number;
      direction: 'horizontal' | 'vertical';
    } | null>(null);

    // ── Floating drag state ──────────────────────────

    const floatDragRef = useRef<{
      floatingGroupId: string;
      offsetX: number;
      offsetY: number;
    } | null>(null);

    // ── Floating resize state ────────────────────────

    const floatResizeRef = useRef<FloatResizeInfo | null>(null);

    // ── Context menu state ───────────────────────────

    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    // ── Auto-hide peek state ─────────────────────────

    const [peekPanelId, setPeekPanelId] = useState<string | null>(null);
    const peekTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Handlers ─────────────────────────────────────

    const handleTabClick = useCallback((panelId: string) => {
      api.send({ type: 'ACTIVATE_PANEL', panelId });
      forceRender();
      onActivePanelChange?.(panelId);
    }, [api, onActivePanelChange]);

    const handlePanelClose = useCallback((panelId: string) => {
      api.send({ type: 'CLOSE_PANEL', panelId });
      forceRender();
      onPanelClose?.(panelId);
    }, [api, onPanelClose]);

    const handleAutoHideRestore = useCallback((panelId: string) => {
      api.send({ type: 'RESTORE_PANEL', panelId });
      setPeekPanelId(null);
      forceRender();
    }, [api]);

    const handleMaximize = useCallback((panelId: string) => {
      api.send({ type: 'MAXIMIZE_PANEL', panelId });
      forceRender();
    }, [api]);

    const handleRestoreMaximized = useCallback(() => {
      api.send({ type: 'RESTORE_MAXIMIZED' });
      forceRender();
    }, [api]);

    // ── Tab pointer down (drag start) ────────────────

    const handleTabPointerDown = useCallback((
      panelId: string,
      sourceGroupId: string,
      e: React.PointerEvent,
    ) => {
      if (e.button !== 0) return;
      e.preventDefault();

      dragInfoRef.current = {
        panelId,
        sourceGroupId,
        startX: e.clientX,
        startY: e.clientY,
        phase: 'pending',
        mode: 'tab',
      };
      pointerPosRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    // ── Group title bar pointer down (group drag) ────

    const handleGroupTitlePointerDown = useCallback((
      groupId: string,
      panelIds: string[],
      e: React.PointerEvent,
    ) => {
      if (e.button !== 0) return;
      if (panelIds.length === 0) return;
      e.preventDefault();

      // Group drag: use the first panel as representative
      dragInfoRef.current = {
        panelId: panelIds[0] ?? '',
        sourceGroupId: groupId,
        startX: e.clientX,
        startY: e.clientY,
        phase: 'pending',
        mode: 'group',
      };
      pointerPosRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    // ── Tab context menu ─────────────────────────────

    const handleTabContextMenu = useCallback((panelId: string, e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenu({ panelId, x: e.clientX, y: e.clientY });
    }, []);

    // ── Context menu actions ─────────────────────────

    const handleContextMenuAction = useCallback((action: string, panelId: string) => {
      setContextMenu(null);
      switch (action) {
        case 'float':
          api.send({ type: 'FLOAT_PANEL', panelId, x: 100, y: 100, width: 400, height: 300 });
          _onPanelFloat?.(panelId);
          break;
        case 'auto-hide-left':
          api.send({ type: 'AUTO_HIDE_PANEL', panelId, side: 'left' });
          break;
        case 'auto-hide-right':
          api.send({ type: 'AUTO_HIDE_PANEL', panelId, side: 'right' });
          break;
        case 'auto-hide-top':
          api.send({ type: 'AUTO_HIDE_PANEL', panelId, side: 'top' });
          break;
        case 'auto-hide-bottom':
          api.send({ type: 'AUTO_HIDE_PANEL', panelId, side: 'bottom' });
          break;
        case 'maximize':
          api.send({ type: 'MAXIMIZE_PANEL', panelId });
          break;
        case 'close':
          api.send({ type: 'CLOSE_PANEL', panelId });
          onPanelClose?.(panelId);
          break;
      }
      forceRender();
    }, [api, onPanelClose, _onPanelFloat]);

    // ── Resize handle pointer down ───────────────────

    const handleResizePointerDown = useCallback((
      splitId: string,
      handleIndex: number,
      direction: 'horizontal' | 'vertical',
      e: React.PointerEvent,
      splitEl: HTMLElement | null,
    ) => {
      if (e.button !== 0) return;
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      const totalSize = direction === 'horizontal'
        ? (splitEl?.getBoundingClientRect().width ?? 0)
        : (splitEl?.getBoundingClientRect().height ?? 0);

      resizeRef.current = {
        splitId,
        handleIndex,
        startPos: direction === 'horizontal' ? e.clientX : e.clientY,
        totalSize,
        direction,
      };

      api.send({ type: 'RESIZE_START', splitId, handleIndex });
      forceRender();
    }, [api]);

    // ── Floating title bar pointer down ──────────────

    const handleFloatTitlePointerDown = useCallback((
      fg: DockFloatingGroup,
      e: React.PointerEvent,
    ) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
      floatDragRef.current = {
        floatingGroupId: fg.id,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      };
      api.send({ type: 'ACTIVATE_FLOATING', floatingGroupId: fg.id });
      forceRender();
    }, [api]);

    // ── Floating resize pointer down ─────────────────

    const handleFloatResizePointerDown = useCallback((
      fg: DockFloatingGroup,
      direction: string,
      e: React.PointerEvent,
    ) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      floatResizeRef.current = {
        floatingGroupId: fg.id,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: fg.width,
        startHeight: fg.height,
        startLeft: fg.x,
        startTop: fg.y,
        direction,
      };
    }, []);

    // ── Global pointer listeners (unified) ───────────

    useEffect(() => {
      function handlePointerMove(e: PointerEvent) {
        // ── Tab/Group drag ───────────────────────
        if (dragInfoRef.current) {
          const drag = dragInfoRef.current;

          if (drag.phase === 'pending') {
            const dx = e.clientX - drag.startX;
            const dy = e.clientY - drag.startY;
            if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
            // Threshold exceeded — activate drag
            drag.phase = 'active';
            api.send({ type: 'DRAG_START', panelId: drag.panelId });
            forceRender();
          }

          if (drag.phase === 'active') {
            pointerPosRef.current = { x: e.clientX, y: e.clientY };

            // Update ghost position via direct DOM
            if (ghostRef.current) {
              ghostRef.current.style.left = `${e.clientX + 12}px`;
              ghostRef.current.style.top = `${e.clientY + 12}px`;
            }

            // Hit test: find group under pointer
            let newTarget: ActiveDropTarget | null = null;

            // Check all groups for hit
            const groups = rootElRef.current?.querySelectorAll('[data-dock-group]');
            if (groups) {
              for (let i = 0; i < groups.length; i++) {
                const groupEl = groups[i] as HTMLElement;
                const groupId = groupEl.getAttribute('data-dock-group');
                if (!groupId) continue;
                // Skip source group if it's the same and single panel
                if (groupId === drag.sourceGroupId && drag.mode === 'tab') {
                  const group = api.getGroupByPanelId(drag.panelId);
                  if (group && group.panelIds.length <= 1) continue;
                }
                const rect = groupEl.getBoundingClientRect();
                if (
                  e.clientX >= rect.left &&
                  e.clientX <= rect.right &&
                  e.clientY >= rect.top &&
                  e.clientY <= rect.bottom
                ) {
                  // Check tab bar for tab reorder
                  const tabBar = groupEl.querySelector('[data-dock-tab-bar]') as HTMLElement | null;
                  if (tabBar && groupId === drag.sourceGroupId && drag.mode === 'tab') {
                    const tabBarRect = tabBar.getBoundingClientRect();
                    if (
                      e.clientY >= tabBarRect.top &&
                      e.clientY <= tabBarRect.bottom &&
                      e.clientX >= tabBarRect.left &&
                      e.clientX <= tabBarRect.right
                    ) {
                      // Tab reorder mode
                      const tabs = tabBar.querySelectorAll('[data-dock-tab]');
                      let insertIdx = 0;
                      for (let t = 0; t < tabs.length; t++) {
                        const tabEl = tabs[t] as HTMLElement;
                        const tabRect = tabEl.getBoundingClientRect();
                        const tabMid = tabRect.left + tabRect.width / 2;
                        if (e.clientX > tabMid) insertIdx = t + 1;
                      }
                      tabReorderRef.current = { groupId, insertIndex: insertIdx };
                      const prevTarget = activeDropTargetRef.current;
                      activeDropTargetRef.current = null;
                      if (prevTarget !== null) forceRender();
                      return;
                    }
                  }

                  tabReorderRef.current = null;
                  const position = computeDropPosition(e.clientX, e.clientY, rect);
                  if (position) {
                    newTarget = { type: 'group', groupId, position, rect };
                  }
                  break;
                }
              }
            }

            // Root-level edge detection
            if (!newTarget && rootElRef.current) {
              const rootRect = rootElRef.current.getBoundingClientRect();
              if (
                e.clientX >= rootRect.left &&
                e.clientX <= rootRect.right &&
                e.clientY >= rootRect.top &&
                e.clientY <= rootRect.bottom
              ) {
                const rootEdge = computeRootEdge(e.clientX, e.clientY, rootRect);
                if (rootEdge) {
                  newTarget = { type: 'root', groupId: '__root__', position: rootEdge, rect: rootRect };
                }
              }
            }

            // Update drop target only if changed
            const prev = activeDropTargetRef.current;
            if (
              !prev && newTarget ||
              prev && !newTarget ||
              (prev && newTarget && (
                prev.groupId !== newTarget.groupId ||
                prev.position !== newTarget.position ||
                prev.type !== newTarget.type
              ))
            ) {
              activeDropTargetRef.current = newTarget;
              tabReorderRef.current = null;
              forceRender();
            }
          }
          return;
        }

        // ── Split resize ─────────────────────────
        if (resizeRef.current) {
          const { startPos, totalSize, direction } = resizeRef.current;
          const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
          const deltaPx = currentPos - startPos;
          const deltaRatio = totalSize > 0 ? deltaPx / totalSize : 0;

          api.send({ type: 'RESIZE_DRAG', delta: deltaRatio });
          forceRender();
          return;
        }

        // ── Floating drag ────────────────────────
        if (floatDragRef.current) {
          const { floatingGroupId, offsetX, offsetY } = floatDragRef.current;
          api.send({
            type: 'MOVE_FLOATING',
            floatingGroupId,
            x: e.clientX - offsetX,
            y: e.clientY - offsetY,
          });
          forceRender();
          return;
        }

        // ── Floating resize ──────────────────────
        if (floatResizeRef.current) {
          const fr = floatResizeRef.current;
          const dx = e.clientX - fr.startX;
          const dy = e.clientY - fr.startY;
          let newWidth = fr.startWidth;
          let newHeight = fr.startHeight;
          let newX = fr.startLeft;
          let newY = fr.startTop;

          if (fr.direction.includes('e')) newWidth = fr.startWidth + dx;
          if (fr.direction.includes('w')) {
            newWidth = fr.startWidth - dx;
            newX = fr.startLeft + dx;
          }
          if (fr.direction.includes('s')) newHeight = fr.startHeight + dy;
          if (fr.direction.includes('n')) {
            newHeight = fr.startHeight - dy;
            newY = fr.startTop + dy;
          }

          newWidth = Math.max(100, newWidth);
          newHeight = Math.max(50, newHeight);

          api.send({
            type: 'RESIZE_FLOATING',
            floatingGroupId: fr.floatingGroupId,
            width: newWidth,
            height: newHeight,
          });
          api.send({
            type: 'MOVE_FLOATING',
            floatingGroupId: fr.floatingGroupId,
            x: newX,
            y: newY,
          });
          forceRender();
          return;
        }
      }

      function handlePointerUp(_e: PointerEvent) {
        // ── Tab/Group drag drop ──────────────────
        if (dragInfoRef.current) {
          const drag = dragInfoRef.current;

          if (drag.phase === 'active') {
            const target = activeDropTargetRef.current;
            const reorder = tabReorderRef.current;

            if (reorder) {
              // Tab reorder within same group
              api.send({
                type: 'MOVE_PANEL',
                panelId: drag.panelId,
                targetGroupId: reorder.groupId,
                index: reorder.insertIndex,
              });
            } else if (target) {
              if (target.type === 'root') {
                // Root-level drop — find first group and create split
                const root = api.getRoot();
                if (root) {
                  const firstGroupId = root.type === 'group' ? root.id : findFirstGroupId(root);
                  if (firstGroupId) {
                    const direction = target.position === 'left' || target.position === 'right'
                      ? 'horizontal'
                      : 'vertical';
                    const position = target.position === 'left' || target.position === 'top'
                      ? 'before'
                      : 'after';

                    if (drag.mode === 'group') {
                      // Group drag to root — move all panels as split
                      handleGroupDropToRoot(drag.sourceGroupId, direction, position);
                    } else {
                      api.send({ type: 'DROP', target: { groupId: firstGroupId, position: target.position } });
                    }
                  }
                }
              } else if (drag.mode === 'group') {
                // Group drag to another group
                handleGroupDropToGroup(drag.sourceGroupId, target.groupId, target.position);
              } else {
                // Tab drag to group
                api.send({ type: 'DROP', target: { groupId: target.groupId, position: target.position } });
              }
            } else {
              // Drop to empty space — float
              if (drag.mode === 'group') {
                handleGroupDropToFloat(drag.sourceGroupId, _e.clientX, _e.clientY);
              } else {
                api.send({
                  type: 'DROP_TO_FLOAT',
                  panelId: drag.panelId,
                  x: Math.max(0, _e.clientX - 150),
                  y: Math.max(0, _e.clientY - 20),
                  width: 400,
                  height: 300,
                });
              }
            }
          } else {
            // Drag was pending (no movement), cancel
            api.send({ type: 'DRAG_CANCEL' });
          }

          dragInfoRef.current = null;
          activeDropTargetRef.current = null;
          tabReorderRef.current = null;
          forceRender();
          return;
        }

        // ── Split resize end ─────────────────────
        if (resizeRef.current) {
          api.send({ type: 'RESIZE_END' });
          resizeRef.current = null;
          forceRender();
          return;
        }

        // ── Floating drag end ────────────────────
        if (floatDragRef.current) {
          floatDragRef.current = null;
          return;
        }

        // ── Floating resize end ──────────────────
        if (floatResizeRef.current) {
          floatResizeRef.current = null;
          return;
        }
      }

      function handleKeyDown(e: KeyboardEvent) {
        // Escape cancels drag
        if (e.key === 'Escape' && dragInfoRef.current) {
          api.send({ type: 'DRAG_CANCEL' });
          dragInfoRef.current = null;
          activeDropTargetRef.current = null;
          tabReorderRef.current = null;
          forceRender();
        }
        // Escape closes context menu
        if (e.key === 'Escape' && contextMenu) {
          setContextMenu(null);
        }
      }

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [api, contextMenu]);

    // ── Close context menu on outside click ──────────

    useEffect(() => {
      if (!contextMenu) return;
      function handleClick() {
        setContextMenu(null);
      }
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }, [contextMenu]);

    // ── Group drag helpers ───────────────────────────

    function handleGroupDropToRoot(
      sourceGroupId: string,
      direction: 'horizontal' | 'vertical',
      position: 'before' | 'after',
    ) {
      // Move all panels from source group to a new split at root level
      const root = api.getRoot();
      if (!root) return;

      // Find source group panels
      const sourceNode = findNodeInTree(root, sourceGroupId);
      if (!sourceNode || sourceNode.type !== 'group') return;

      const panelIds = [...sourceNode.panelIds];
      if (panelIds.length === 0) return;

      // Get root's first group for SPLIT_GROUP target
      const firstGroupId = root.type === 'group' ? root.id : findFirstGroupId(root);
      if (!firstGroupId) return;

      // Move first panel via split
      const firstPanel = panelIds[0];
      if (!firstPanel) return;
      api.send({
        type: 'SPLIT_GROUP',
        groupId: firstGroupId,
        direction,
        panelId: firstPanel,
        position,
      });

      // Move remaining panels to the new group
      if (panelIds.length > 1) {
        // Find the group that contains the first panel
        const newGroup = api.getGroupByPanelId(firstPanel);
        if (newGroup) {
          for (let i = 1; i < panelIds.length; i++) {
            const pid = panelIds[i];
            if (pid) {
              api.send({
                type: 'MOVE_PANEL',
                panelId: pid,
                targetGroupId: newGroup.id,
              });
            }
          }
        }
      }
      forceRender();
    }

    function handleGroupDropToGroup(
      sourceGroupId: string,
      targetGroupId: string,
      position: DropPosition,
    ) {
      const root = api.getRoot();
      if (!root) return;

      const sourceNode = findNodeInTree(root, sourceGroupId);
      if (!sourceNode || sourceNode.type !== 'group') return;

      const panelIds = [...sourceNode.panelIds];
      if (panelIds.length === 0) return;

      if (position === 'center') {
        // Move all panels as tabs to target group
        for (const pid of panelIds) {
          api.send({ type: 'MOVE_PANEL', panelId: pid, targetGroupId });
        }
      } else {
        // Split: move first panel via SPLIT_GROUP, rest via MOVE_PANEL
        const direction = position === 'left' || position === 'right' ? 'horizontal' : 'vertical';
        const splitPosition = position === 'left' || position === 'top' ? 'before' : 'after';

        const firstPanel = panelIds[0];
        if (!firstPanel) return;
        api.send({
          type: 'SPLIT_GROUP',
          groupId: targetGroupId,
          direction,
          panelId: firstPanel,
          position: splitPosition,
        });

        if (panelIds.length > 1) {
          const newGroup = api.getGroupByPanelId(firstPanel);
          if (newGroup) {
            for (let i = 1; i < panelIds.length; i++) {
              const pid = panelIds[i];
              if (pid) {
                api.send({
                  type: 'MOVE_PANEL',
                  panelId: pid,
                  targetGroupId: newGroup.id,
                });
              }
            }
          }
        }
      }
      forceRender();
    }

    function handleGroupDropToFloat(
      sourceGroupId: string,
      clientX: number,
      clientY: number,
    ) {
      const root = api.getRoot();
      if (!root) return;

      const sourceNode = findNodeInTree(root, sourceGroupId);
      if (!sourceNode || sourceNode.type !== 'group') return;

      const panelIds = [...sourceNode.panelIds];
      if (panelIds.length === 0) return;

      // Float first panel
      const firstPanel = panelIds[0];
      if (!firstPanel) return;
      api.send({
        type: 'DROP_TO_FLOAT',
        panelId: firstPanel,
        x: Math.max(0, clientX - 150),
        y: Math.max(0, clientY - 20),
        width: 400,
        height: 300,
      });

      // Move remaining panels to the floating group
      if (panelIds.length > 1) {
        const floatingGroups = api.getFloatingGroups();
        const lastFg = floatingGroups[floatingGroups.length - 1];
        if (lastFg) {
          for (let i = 1; i < panelIds.length; i++) {
            const pid = panelIds[i];
            if (pid) {
              // We can't directly move to floating group via MOVE_PANEL (tree only)
              // So float each panel individually
              api.send({
                type: 'FLOAT_PANEL',
                panelId: pid,
                x: Math.max(0, clientX - 150),
                y: Math.max(0, clientY - 20),
                width: 400,
                height: 300,
              });
            }
          }
        }
      }
      forceRender();
    }

    // ── Tree traversal helper ────────────────────────

    function findNodeInTree(node: DockNode, id: string): DockNode | undefined {
      if (node.id === id) return node;
      if (node.type === 'split') {
        for (const child of node.children) {
          const found = findNodeInTree(child, id);
          if (found) return found;
        }
      }
      return undefined;
    }

    function findFirstGroupId(node: DockNode): string | undefined {
      if (node.type === 'group') return node.id;
      if (node.type === 'split') {
        for (const child of node.children) {
          const found = findFirstGroupId(child);
          if (found) return found;
        }
      }
      return undefined;
    }

    // ── Auto-hide peek handlers ──────────────────────

    const handleAutoHidePeekEnter = useCallback((panelId: string) => {
      if (peekTimeoutRef.current) clearTimeout(peekTimeoutRef.current);
      setPeekPanelId(panelId);
    }, []);

    const handleAutoHidePeekLeave = useCallback(() => {
      peekTimeoutRef.current = setTimeout(() => {
        setPeekPanelId(null);
      }, 300);
    }, []);

    // ── State ────────────────────────────────────────

    const treeRoot = api.getRoot();
    const floatingGroups = api.getFloatingGroups();
    const autoHidden = api.getAutoHiddenPanels();
    const maximizedPanelId = api.getMaximizedPanelId();
    const isDragging = dragInfoRef.current?.phase === 'active';
    const activeTarget = activeDropTargetRef.current;

    // ── Slot helpers ─────────────────────────────────

    const rootSlot = getSlotProps('root', undefined, classNames, slotStyles, {
      position: 'relative',
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    });
    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    // ── Recursive tree renderer ──────────────────────

    function renderNode(node: DockNode): ReactNode {
      if (node.type === 'group') return renderGroup(node);
      if (node.type === 'split') return renderSplit(node);
      return null;
    }

    function renderSplit(split: DockSplitNode): ReactNode {
      const isHorizontal = split.direction === 'horizontal';
      const splitSlot = getSlotProps('splitContainer', undefined, classNames, slotStyles, {
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        flex: 1,
        overflow: 'hidden',
      });

      return (
        <div
          key={split.id}
          className={splitSlot.className || undefined}
          style={splitSlot.style}
          data-dock-split={split.id}
          data-dock-direction={split.direction}
        >
          {split.children.map((child, i) => {
            const size = split.sizes[i] ?? (1 / split.children.length);
            const childStyle: CSSProperties = {
              flex: `${size} 0 0%`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              minHeight: 0,
              position: 'relative',
            };

            return (
              <div key={child.id} style={childStyle}>
                {renderNode(child)}
                {i < split.children.length - 1 && renderResizeHandle(split, i)}
              </div>
            );
          })}
        </div>
      );
    }

    function renderResizeHandle(split: DockSplitNode, handleIndex: number): ReactNode {
      const isHorizontal = split.direction === 'horizontal';
      const handleSlot = getSlotProps('resizeHandle', undefined, classNames, slotStyles, {
        [isHorizontal ? 'width' : 'height']: 4,
        [isHorizontal ? 'minWidth' : 'minHeight']: 4,
        cursor: isHorizontal ? 'col-resize' : 'row-resize',
        background: 'var(--rel-color-border, #e2e8f0)',
        flexShrink: 0,
        position: 'absolute',
        zIndex: 2,
        ...(isHorizontal
          ? { right: -2, top: 0, bottom: 0 }
          : { bottom: -2, left: 0, right: 0 }),
        touchAction: 'none',
      });

      return (
        <div
          key={`handle-${split.id}-${handleIndex}`}
          className={handleSlot.className || undefined}
          style={handleSlot.style}
          data-dock-resize-handle
          data-dock-split-id={split.id}
          data-dock-handle-index={handleIndex}
          onPointerDown={(e) => {
            const splitEl = (e.currentTarget as HTMLElement).closest('[data-dock-split]') as HTMLElement | null;
            handleResizePointerDown(split.id, handleIndex, split.direction, e, splitEl);
          }}
        />
      );
    }

    function renderGroup(group: DockGroupNode): ReactNode {
      const groupSlot = getSlotProps('group', undefined, classNames, slotStyles, {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      });

      const tabBarSlot = getSlotProps('tabBar', undefined, classNames, slotStyles, {
        display: 'flex',
        gap: 0,
        background: 'var(--rel-color-bg-subtle, #f8fafc)',
        borderBottom: '1px solid var(--rel-color-border, #e2e8f0)',
        flexShrink: 0,
        overflow: 'hidden',
        cursor: 'default',
      });

      const activePanel = api.getPanel(group.activePanelId);

      return (
        <div
          key={group.id}
          className={groupSlot.className || undefined}
          style={groupSlot.style}
          data-dock-group={group.id}
        >
          {/* Tab bar — double-clickable for group drag */}
          <div
            className={tabBarSlot.className || undefined}
            style={tabBarSlot.style}
            data-dock-tab-bar
            onPointerDown={(e) => {
              // Only start group drag from empty tab bar area, not from tabs
              const target = e.target as HTMLElement;
              if (target.closest('[data-dock-tab]')) return;
              handleGroupTitlePointerDown(group.id, group.panelIds, e);
            }}
          >
            {group.panelIds.map((panelId) => {
              const panel = api.getPanel(panelId);
              if (!panel) return null;
              const isActive = panelId === group.activePanelId;
              const tabSlot = getSlotProps('tab', undefined, classNames, slotStyles, {
                padding: '6px 12px',
                fontSize: 12,
                cursor: 'pointer',
                userSelect: 'none',
                background: isActive ? 'var(--rel-color-bg, #fff)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--rel-color-primary, #3b82f6)' : '2px solid transparent',
                fontWeight: isActive ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
              });

              return (
                <div
                  key={panelId}
                  className={tabSlot.className || undefined}
                  style={tabSlot.style}
                  data-dock-tab={panelId}
                  data-active={isActive || undefined}
                  onClick={() => handleTabClick(panelId)}
                  onPointerDown={(e) => handleTabPointerDown(panelId, group.id, e)}
                  onDoubleClick={() => handleMaximize(panelId)}
                  onContextMenu={(e) => handleTabContextMenu(panelId, e)}
                >
                  <span>{panel.title}</span>
                  {panel.closable && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePanelClose(panelId);
                      }}
                      className={getSlotProps('tabCloseButton', undefined, classNames, slotStyles, {
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: 12,
                        padding: 0,
                        lineHeight: 1,
                        color: 'var(--rel-color-text-muted, #94a3b8)',
                      }).className || undefined}
                      style={getSlotProps('tabCloseButton', undefined, classNames, slotStyles, {
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: 12,
                        padding: 0,
                        lineHeight: 1,
                        color: 'var(--rel-color-text-muted, #94a3b8)',
                      }).style}
                      aria-label={`Close ${panel.title}`}
                      data-dock-tab-close
                    >
                      &#x2715;
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Panel content */}
          {activePanel && (
            <div
              className={getSlotProps('panelContent', undefined, classNames, slotStyles, {
                flex: 1,
                overflow: 'auto',
              }).className || undefined}
              style={getSlotProps('panelContent', undefined, classNames, slotStyles, {
                flex: 1,
                overflow: 'auto',
              }).style}
              data-dock-panel={activePanel.id}
            >
              {renderPanel(activePanel.id, activePanel.title)}
            </div>
          )}
        </div>
      );
    }

    // ── Compass rose indicators ──────────────────────

    function renderCompassRose(): ReactNode {
      if (!isDragging) return null;

      const groups = rootElRef.current?.querySelectorAll('[data-dock-group]');
      if (!groups) return null;

      const roses: ReactNode[] = [];

      for (let i = 0; i < groups.length; i++) {
        const groupEl = groups[i] as HTMLElement;
        const groupId = groupEl.getAttribute('data-dock-group');
        if (!groupId) continue;

        const rect = groupEl.getBoundingClientRect();
        const rootRect = rootElRef.current?.getBoundingClientRect();
        if (!rootRect) continue;

        // Position relative to root
        const relLeft = rect.left - rootRect.left;
        const relTop = rect.top - rootRect.top;
        const centerX = relLeft + rect.width / 2;
        const centerY = relTop + rect.height / 2;

        const indicatorSize = 28;
        const spacing = 32;

        const zones: Array<{ pos: DropPosition; x: number; y: number; label: string }> = [
          { pos: 'top', x: centerX - indicatorSize / 2, y: centerY - spacing - indicatorSize / 2, label: '\u25B2' },
          { pos: 'bottom', x: centerX - indicatorSize / 2, y: centerY + spacing - indicatorSize / 2, label: '\u25BC' },
          { pos: 'left', x: centerX - spacing - indicatorSize / 2, y: centerY - indicatorSize / 2, label: '\u25C0' },
          { pos: 'right', x: centerX + spacing - indicatorSize / 2, y: centerY - indicatorSize / 2, label: '\u25B6' },
          { pos: 'center', x: centerX - indicatorSize / 2, y: centerY - indicatorSize / 2, label: '\u25A0' },
        ];

        roses.push(
          <div key={`compass-${groupId}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 500 }}>
            {zones.map((z) => {
              const isHovered = activeTarget?.type === 'group' && activeTarget.groupId === groupId && activeTarget.position === z.pos;
              return (
                <div
                  key={z.pos}
                  style={{
                    position: 'absolute',
                    left: z.x,
                    top: z.y,
                    width: indicatorSize,
                    height: indicatorSize,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    background: isHovered
                      ? 'var(--rel-color-primary, #3b82f6)'
                      : 'rgba(255,255,255,0.9)',
                    color: isHovered ? '#fff' : 'var(--rel-color-text-muted, #94a3b8)',
                    border: `1px solid ${isHovered ? 'var(--rel-color-primary, #3b82f6)' : 'var(--rel-color-border, #e2e8f0)'}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                    pointerEvents: 'none',
                    transition: 'background 100ms, color 100ms',
                  }}
                  data-dock-compass-zone={`${groupId}-${z.pos}`}
                >
                  {z.label}
                </div>
              );
            })}
          </div>,
        );
      }

      return <>{roses}</>;
    }

    // ── Root edge indicators ─────────────────────────

    function renderRootEdgeIndicators(): ReactNode {
      if (!isDragging) return null;

      const edges: Array<{ pos: DropPosition; style: CSSProperties; label: string }> = [
        { pos: 'top', style: { top: 4, left: '50%', transform: 'translateX(-50%)' }, label: '\u25B2' },
        { pos: 'bottom', style: { bottom: 4, left: '50%', transform: 'translateX(-50%)' }, label: '\u25BC' },
        { pos: 'left', style: { left: 4, top: '50%', transform: 'translateY(-50%)' }, label: '\u25C0' },
        { pos: 'right', style: { right: 4, top: '50%', transform: 'translateY(-50%)' }, label: '\u25B6' },
      ];

      return (
        <>
          {edges.map((edge) => {
            const isActive = activeTarget?.type === 'root' && activeTarget.position === edge.pos;
            return (
              <div
                key={`root-edge-${edge.pos}`}
                style={{
                  position: 'absolute',
                  ...edge.style,
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700,
                  background: isActive ? 'var(--rel-color-primary, #3b82f6)' : 'rgba(255,255,255,0.9)',
                  color: isActive ? '#fff' : 'var(--rel-color-text-muted, #94a3b8)',
                  border: `1px solid ${isActive ? 'var(--rel-color-primary, #3b82f6)' : 'var(--rel-color-border, #e2e8f0)'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  pointerEvents: 'none',
                  zIndex: 600,
                }}
                data-dock-root-edge={edge.pos}
              >
                {edge.label}
              </div>
            );
          })}
        </>
      );
    }

    // ── Drop preview overlay ─────────────────────────

    function renderDropPreview(): ReactNode {
      if (!isDragging || !activeTarget) return null;

      const rootRect = rootElRef.current?.getBoundingClientRect();
      if (!rootRect) return null;

      const previewAbsolute = getPreviewRect(activeTarget);
      // Convert to relative to root
      const previewStyle: CSSProperties = {
        position: 'absolute',
        left: (previewAbsolute.left as number) - rootRect.left,
        top: (previewAbsolute.top as number) - rootRect.top,
        width: previewAbsolute.width,
        height: previewAbsolute.height,
        background: 'rgba(59, 130, 246, 0.12)',
        border: '2px solid rgba(59, 130, 246, 0.35)',
        borderRadius: 4,
        pointerEvents: 'none',
        zIndex: 400,
        transition: 'all 120ms ease',
      };

      return (
        <div
          style={previewStyle}
          data-dock-drop-preview
          data-dock-drop-preview-position={activeTarget.position}
        />
      );
    }

    // ── Drag ghost ───────────────────────────────────

    function renderDragGhost(): ReactNode {
      if (!isDragging || !dragInfoRef.current) return null;
      const drag = dragInfoRef.current;

      let label = '';
      if (drag.mode === 'group') {
        // Show group info
        const root = api.getRoot();
        if (root) {
          const node = findNodeInTree(root, drag.sourceGroupId);
          if (node && node.type === 'group') {
            const titles = node.panelIds
              .map((pid) => api.getPanel(pid)?.title ?? pid)
              .join(', ');
            label = `[${node.panelIds.length}] ${titles}`;
          }
        }
      } else {
        const panel = api.getPanel(drag.panelId);
        label = panel?.title ?? drag.panelId;
      }

      return (
        <div
          ref={ghostRef}
          style={{
            position: 'fixed',
            left: pointerPosRef.current.x + 12,
            top: pointerPosRef.current.y + 12,
            padding: '6px 12px',
            background: 'var(--rel-color-primary, #3b82f6)',
            color: '#fff',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
            zIndex: 10000,
            opacity: 0.92,
            whiteSpace: 'nowrap',
            maxWidth: 240,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          data-dock-drag-ghost
        >
          {label}
        </div>
      );
    }

    // ── Context menu render ──────────────────────────

    function renderContextMenu(): ReactNode {
      if (!contextMenu) return null;
      const panel = api.getPanel(contextMenu.panelId);
      if (!panel) return null;

      const menuStyle: CSSProperties = {
        position: 'fixed',
        left: contextMenu.x,
        top: contextMenu.y,
        background: 'var(--rel-color-bg, #fff)',
        border: '1px solid var(--rel-color-border, #e2e8f0)',
        borderRadius: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        zIndex: 20000,
        minWidth: 180,
        padding: '4px 0',
        fontSize: 13,
      };

      const itemStyle: CSSProperties = {
        padding: '6px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        userSelect: 'none',
      };

      const separatorStyle: CSSProperties = {
        height: 1,
        background: 'var(--rel-color-border, #e2e8f0)',
        margin: '4px 0',
      };

      const subMenuStyle: CSSProperties = {
        ...itemStyle,
        position: 'relative',
      };

      return (
        <div
          style={menuStyle}
          data-dock-context-menu
          onClick={(e) => e.stopPropagation()}
        >
          {panel.floatable && (
            <div
              style={itemStyle}
              onClick={() => handleContextMenuAction('float', contextMenu.panelId)}
              data-dock-context-action="float"
            >
              Float
            </div>
          )}
          {panel.autoHideable && (
            <div style={subMenuStyle} data-dock-context-action="auto-hide">
              <span style={{ flex: 1 }}>Auto-hide</span>
              <span style={{ fontSize: 10, color: 'var(--rel-color-text-muted, #94a3b8)' }}>{'\u25B6'}</span>
              <div
                style={{
                  position: 'absolute',
                  left: '100%',
                  top: -4,
                  background: 'var(--rel-color-bg, #fff)',
                  border: '1px solid var(--rel-color-border, #e2e8f0)',
                  borderRadius: 6,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  minWidth: 120,
                  padding: '4px 0',
                  zIndex: 20001,
                }}
                data-dock-context-submenu
              >
                {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
                  <div
                    key={side}
                    style={itemStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContextMenuAction(`auto-hide-${side}`, contextMenu.panelId);
                    }}
                    data-dock-context-action={`auto-hide-${side}`}
                  >
                    {side.charAt(0).toUpperCase() + side.slice(1)}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={separatorStyle} />
          <div
            style={itemStyle}
            onClick={() => handleContextMenuAction('maximize', contextMenu.panelId)}
            data-dock-context-action="maximize"
          >
            Maximize
          </div>
          <div style={separatorStyle} />
          {panel.closable && (
            <div
              style={itemStyle}
              onClick={() => handleContextMenuAction('close', contextMenu.panelId)}
              data-dock-context-action="close"
            >
              Close
            </div>
          )}
        </div>
      );
    }

    // ── Auto-hide bar render ─────────────────────────

    function renderAutoHideBar(side: 'left' | 'right' | 'top' | 'bottom') {
      const panelsForSide = autoHidden.filter((p) => p.side === side);
      if (panelsForSide.length === 0) return null;

      const isHorizontal = side === 'top' || side === 'bottom';
      const barSlot = getSlotProps('autoHideBar', undefined, classNames, slotStyles, {
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        position: 'absolute',
        ...(side === 'left' ? { left: 0, top: 0, bottom: 0 } : {}),
        ...(side === 'right' ? { right: 0, top: 0, bottom: 0 } : {}),
        ...(side === 'top' ? { top: 0, left: 0, right: 0 } : {}),
        ...(side === 'bottom' ? { bottom: 0, left: 0, right: 0 } : {}),
        background: 'var(--rel-color-bg-subtle, #f8fafc)',
        zIndex: 10,
      });

      return (
        <div
          key={`autohide-${side}`}
          className={barSlot.className || undefined}
          style={barSlot.style}
          data-dock-autohide-bar={side}
        >
          {panelsForSide.map((ah) => {
            const panel = api.getPanel(ah.panelId);
            if (!panel) return null;

            const tabSlot = getSlotProps('autoHideTab', undefined, classNames, slotStyles, {
              padding: '4px 8px',
              fontSize: 11,
              cursor: 'pointer',
              writingMode: isHorizontal ? undefined : 'vertical-lr',
            });

            return (
              <div
                key={ah.panelId}
                className={tabSlot.className || undefined}
                style={tabSlot.style}
                data-dock-autohide-tab={ah.panelId}
                onClick={() => handleAutoHideRestore(ah.panelId)}
                onMouseEnter={() => handleAutoHidePeekEnter(ah.panelId)}
                onMouseLeave={handleAutoHidePeekLeave}
              >
                {panel.title}
              </div>
            );
          })}
        </div>
      );
    }

    // ── Auto-hide peek panel ─────────────────────────

    function renderPeekPanel(): ReactNode {
      if (!peekPanelId) return null;
      const panel = api.getPanel(peekPanelId);
      if (!panel) return null;

      const ahPanel = autoHidden.find((p) => p.panelId === peekPanelId);
      if (!ahPanel) return null;

      const peekSize = 250;
      const peekPositionStyle: CSSProperties = {
        position: 'absolute',
        zIndex: 15,
        background: 'var(--rel-color-bg, #fff)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        overflow: 'auto',
      };

      switch (ahPanel.side) {
        case 'left':
          Object.assign(peekPositionStyle, { left: 24, top: 0, bottom: 0, width: peekSize });
          break;
        case 'right':
          Object.assign(peekPositionStyle, { right: 24, top: 0, bottom: 0, width: peekSize });
          break;
        case 'top':
          Object.assign(peekPositionStyle, { top: 24, left: 0, right: 0, height: peekSize });
          break;
        case 'bottom':
          Object.assign(peekPositionStyle, { bottom: 24, left: 0, right: 0, height: peekSize });
          break;
      }

      return (
        <div
          style={peekPositionStyle}
          data-dock-peek-panel={peekPanelId}
          onMouseEnter={() => handleAutoHidePeekEnter(peekPanelId)}
          onMouseLeave={handleAutoHidePeekLeave}
        >
          <div
            style={{
              padding: '6px 12px',
              borderBottom: '1px solid var(--rel-color-border, #e2e8f0)',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              background: 'var(--rel-color-bg-subtle, #f8fafc)',
            }}
          >
            <span style={{ flex: 1 }}>{panel.title}</span>
            <button
              type="button"
              onClick={() => handleAutoHideRestore(peekPanelId)}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 11,
                padding: '2px 6px',
                color: 'var(--rel-color-text-muted, #94a3b8)',
              }}
              aria-label={`Pin ${panel.title}`}
              data-dock-peek-pin
            >
              &#x1F4CC;
            </button>
          </div>
          <div style={{ padding: 8 }}>
            {renderPanel(peekPanelId, panel.title)}
          </div>
        </div>
      );
    }

    // ── Floating panels render ───────────────────────

    function renderFloatingPanels() {
      return floatingGroups.map((fg: DockFloatingGroup) => {
        const floatSlot = getSlotProps('floatingPanel', undefined, classNames, slotStyles, {
          position: 'absolute',
          left: fg.x,
          top: fg.y,
          width: fg.width,
          height: fg.height,
          zIndex: fg.zIndex,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--rel-color-bg, #fff)',
          display: 'flex',
          flexDirection: 'column',
        });

        const titleBarSlot = getSlotProps('floatingTitleBar', undefined, classNames, slotStyles, {
          display: 'flex',
          alignItems: 'center',
          padding: '6px 12px',
          background: 'var(--rel-color-bg-subtle, #f8fafc)',
          borderBottom: '1px solid var(--rel-color-border, #e2e8f0)',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'move',
          userSelect: 'none',
          gap: 4,
        });

        const activePanel = api.getPanel(fg.group.activePanelId);

        // Floating panel tab bar for multi-tab floating groups
        const hasMultipleTabs = fg.group.panelIds.length > 1;

        return (
          <div
            key={fg.id}
            className={floatSlot.className || undefined}
            style={floatSlot.style}
            data-dock-floating={fg.id}
            onClick={() => {
              api.send({ type: 'ACTIVATE_FLOATING', floatingGroupId: fg.id });
              forceRender();
            }}
          >
            {/* Title bar */}
            <div
              className={titleBarSlot.className || undefined}
              style={titleBarSlot.style}
              data-dock-floating-titlebar
              onPointerDown={(e) => handleFloatTitlePointerDown(fg, e)}
            >
              {hasMultipleTabs ? (
                fg.group.panelIds.map((pid) => {
                  const p = api.getPanel(pid);
                  if (!p) return null;
                  const isAct = pid === fg.group.activePanelId;
                  return (
                    <span
                      key={pid}
                      style={{
                        padding: '2px 8px',
                        fontSize: 11,
                        fontWeight: isAct ? 600 : 400,
                        opacity: isAct ? 1 : 0.6,
                        cursor: 'pointer',
                        borderBottom: isAct ? '2px solid var(--rel-color-primary, #3b82f6)' : '2px solid transparent',
                      }}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        api.send({ type: 'ACTIVATE_PANEL', panelId: pid });
                        forceRender();
                      }}
                      data-dock-floating-tab={pid}
                    >
                      {p.title}
                    </span>
                  );
                })
              ) : (
                <span style={{ flex: 1 }}>{activePanel?.title ?? ''}</span>
              )}
              {!hasMultipleTabs && <span style={{ flex: 1 }} />}
              {activePanel?.closable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePanelClose(fg.group.activePanelId);
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    padding: 0,
                    lineHeight: 1,
                    marginLeft: 'auto',
                  }}
                  aria-label={`Close ${activePanel.title}`}
                  data-dock-floating-close
                >
                  &#x2715;
                </button>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto' }}>
              {activePanel && renderPanel(activePanel.id, activePanel.title)}
            </div>

            {/* Resize handles (8 directions) */}
            {renderFloatingResizeHandles(fg)}
          </div>
        );
      });
    }

    function renderFloatingResizeHandles(fg: DockFloatingGroup): ReactNode {
      const handleSize = 6;
      const cornerSize = 10;

      const handles: Array<{ dir: string; style: CSSProperties; cursor: string }> = [
        { dir: 'n', style: { top: 0, left: cornerSize, right: cornerSize, height: handleSize }, cursor: 'n-resize' },
        { dir: 's', style: { bottom: 0, left: cornerSize, right: cornerSize, height: handleSize }, cursor: 's-resize' },
        { dir: 'e', style: { right: 0, top: cornerSize, bottom: cornerSize, width: handleSize }, cursor: 'e-resize' },
        { dir: 'w', style: { left: 0, top: cornerSize, bottom: cornerSize, width: handleSize }, cursor: 'w-resize' },
        { dir: 'ne', style: { top: 0, right: 0, width: cornerSize, height: cornerSize }, cursor: 'ne-resize' },
        { dir: 'nw', style: { top: 0, left: 0, width: cornerSize, height: cornerSize }, cursor: 'nw-resize' },
        { dir: 'se', style: { bottom: 0, right: 0, width: cornerSize, height: cornerSize }, cursor: 'se-resize' },
        { dir: 'sw', style: { bottom: 0, left: 0, width: cornerSize, height: cornerSize }, cursor: 'sw-resize' },
      ];

      return (
        <>
          {handles.map((h) => (
            <div
              key={`float-handle-${fg.id}-${h.dir}`}
              style={{
                position: 'absolute',
                ...h.style,
                cursor: h.cursor,
                zIndex: 1,
              }}
              data-dock-float-resize={h.dir}
              onPointerDown={(e) => handleFloatResizePointerDown(fg, h.dir, e)}
            />
          ))}
        </>
      );
    }

    // ── Maximized overlay ────────────────────────────

    function renderMaximizedOverlay() {
      if (!maximizedPanelId) return null;
      const panel = api.getPanel(maximizedPanelId);
      if (!panel) return null;

      const overlaySlot = getSlotProps('maximizedOverlay', undefined, classNames, slotStyles, {
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        background: 'var(--rel-color-bg, #fff)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      });

      return (
        <div
          className={overlaySlot.className || undefined}
          style={overlaySlot.style}
          data-dock-maximized
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              background: 'var(--rel-color-bg-subtle, #f8fafc)',
              borderBottom: '1px solid var(--rel-color-border, #e2e8f0)',
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            <span style={{ flex: 1 }}>{panel.title}</span>
            <button
              type="button"
              onClick={handleRestoreMaximized}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 12,
                padding: '2px 6px',
              }}
              aria-label="Restore panel"
              data-dock-restore-maximized
            >
              &#x25A1;
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }} data-dock-panel={panel.id}>
            {renderPanel(panel.id, panel.title)}
          </div>
        </div>
      );
    }

    // ── Main render ──────────────────────────────────

    return (
      <div
        ref={(el) => {
          rootElRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        {...rest}
        className={finalClass}
        style={rootSlot.style}
        data-dock-layout
      >
        {/* Main recursive tree renderer */}
        {treeRoot && renderNode(treeRoot)}

        {/* Auto-hide bars (4 edges) */}
        {renderAutoHideBar('left')}
        {renderAutoHideBar('right')}
        {renderAutoHideBar('top')}
        {renderAutoHideBar('bottom')}

        {/* Auto-hide peek panel */}
        {renderPeekPanel()}

        {/* Floating panels */}
        {renderFloatingPanels()}

        {/* Maximized overlay */}
        {renderMaximizedOverlay()}

        {/* Drag overlays (only during drag) */}
        {renderCompassRose()}
        {renderRootEdgeIndicators()}
        {renderDropPreview()}
        {renderDragGhost()}

        {/* Context menu */}
        {renderContextMenu()}
      </div>
    );
  },
);
