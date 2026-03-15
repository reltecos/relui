/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SplitPanel — yatay/dikey bolunebilir panel layout bilesen (Dual API).
 *
 * Props-based: `<SplitPanel><div>Left</div><div>Right</div></SplitPanel>`
 * Compound:    `<SplitPanel><SplitPanel.Pane>Left</SplitPanel.Pane><SplitPanel.Handle /><SplitPanel.Pane>Right</SplitPanel.Pane></SplitPanel>`
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
  Children,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createSplitPanel } from '@relteco/relui-core';
import type { SplitPanelAPI, SplitOrientation } from '@relteco/relui-core';
import { rootStyle, panelStyle, gutterStyle } from './split-panel.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** SplitPanel slot isimleri. */
export type SplitPanelSlot = 'root' | 'panel' | 'gutter';

// ── Context (Compound API) ──────────────────────────

interface SplitPanelContextValue {
  classNames: ClassNames<SplitPanelSlot> | undefined;
  styles: Styles<SplitPanelSlot> | undefined;
}

const SplitPanelContext = createContext<SplitPanelContextValue | null>(null);

function useSplitPanelContext(): SplitPanelContextValue {
  const ctx = useContext(SplitPanelContext);
  if (!ctx) throw new Error('SplitPanel compound sub-components must be used within <SplitPanel>.');
  return ctx;
}

// ── Compound: SplitPanel.Pane ───────────────────────

/** SplitPanel.Pane props */
export interface SplitPanelPaneProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SplitPanelPane = forwardRef<HTMLDivElement, SplitPanelPaneProps>(
  function SplitPanelPane(props, ref) {
    const { children, className } = props;
    const ctx = useSplitPanelContext();
    const slot = getSlotProps('panel', panelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls || undefined}
        style={slot.style}
        data-testid="split-panel-pane"
      >
        {children}
      </div>
    );
  },
);

// ── Compound: SplitPanel.Handle ─────────────────────

/** SplitPanel.Handle props */
export interface SplitPanelHandleProps {
  /** Ek className / Additional className */
  className?: string;
}

const SplitPanelHandle = forwardRef<HTMLDivElement, SplitPanelHandleProps>(
  function SplitPanelHandle(props, ref) {
    const { className } = props;
    const ctx = useSplitPanelContext();
    const slot = getSlotProps('gutter', gutterStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls || undefined}
        style={slot.style}
        role="separator"
        tabIndex={0}
        data-testid="split-panel-handle"
      >
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

/** SplitPanel bilesen prop'lari. */
export interface SplitPanelComponentProps
  extends SlotStyleProps<SplitPanelSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Bolme yonu. Varsayilan: 'horizontal'. */
  orientation?: SplitOrientation;
  /** Gutter boyutu (px). Varsayilan: 8. */
  gutterSize?: number;
  /** Her panel icin minimum boyut (px). */
  minSizes?: number[];
  /** Her panel icin maksimum boyut (px). */
  maxSizes?: number[];
  /** Her panel daraltilabilir mi. */
  collapsible?: boolean[];
  /** Baslangic boyutlari (px). */
  defaultSizes?: number[];
  /** Boyut degistiginde cagrilir. */
  onSizesChange?: (sizes: number[]) => void;
  /** Panel daraltma/acma degistiginde cagrilir. */
  onCollapseChange?: (panelIndex: number, collapsed: boolean) => void;
}

// ── Component ─────────────────────────────────────────

const SplitPanelBase = forwardRef<HTMLDivElement, SplitPanelComponentProps>(
  function SplitPanel(props, ref) {
    const {
      children,
      className,
      style,
      classNames,
      styles: slotStyles,
      orientation = 'horizontal',
      gutterSize = 8,
      minSizes,
      maxSizes,
      collapsible,
      defaultSizes,
      onSizesChange,
      onCollapseChange: _onCollapseChange,
      ...rest
    } = props;

    const childArray = Children.toArray(children);
    const panelCount = childArray.length;

    const apiRef = useRef<SplitPanelAPI | null>(null);
    if (apiRef.current === null) {
      apiRef.current = createSplitPanel({
        panelCount,
        orientation,
        gutterSize,
        minSizes,
        maxSizes,
        collapsible,
        defaultSizes,
      });
    }
    const api = apiRef.current;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const dragStartRef = useRef<number | null>(null);

    // ── Ref merge ────────────────────────────────────────
    const mergedRef = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    // ── Prop sync ────────────────────────────────────────
    useEffect(() => {
      api.send({ type: 'SET_ORIENTATION', value: orientation });
      forceRender();
    }, [api, orientation]);

    // ── ResizeObserver — container size ───────────────────
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const updateSize = () => {
        const isH = api.getOrientation() === 'horizontal';
        const size = isH ? container.clientWidth : container.clientHeight;
        api.send({ type: 'SET_CONTAINER_SIZE', value: size });
        forceRender();
      };

      updateSize();

      const ro = new ResizeObserver(updateSize);
      ro.observe(container);

      return () => ro.disconnect();
    }, [api]);

    // ── Pointer handlers ─────────────────────────────────
    const handlePointerDown = (gutterIndex: number, e: React.PointerEvent) => {
      e.preventDefault();
      const isH = api.getOrientation() === 'horizontal';
      dragStartRef.current = isH ? e.clientX : e.clientY;
      api.send({ type: 'DRAG_START', gutterIndex });
      forceRender();

      const target = e.currentTarget as HTMLElement;
      if (target.setPointerCapture) target.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!api.isDragging() || dragStartRef.current === null) return;
      const isH = api.getOrientation() === 'horizontal';
      const current = isH ? e.clientX : e.clientY;
      const delta = current - dragStartRef.current;
      api.send({ type: 'DRAG', delta });
      forceRender();
    };

    const handlePointerUp = (e: React.PointerEvent) => {
      if (!api.isDragging()) return;
      const target = e.currentTarget as HTMLElement;
      if (target.releasePointerCapture) target.releasePointerCapture(e.pointerId);
      api.send({ type: 'DRAG_END' });
      dragStartRef.current = null;
      forceRender();
      onSizesChange?.(api.getSizes());
    };

    const handleDoubleClick = (panelIndex: number) => {
      api.send({ type: 'TOGGLE_COLLAPSE', panelIndex });
      forceRender();
    };

    // ── Layout ───────────────────────────────────────────
    const currentOrientation = api.getOrientation();
    const isH = currentOrientation === 'horizontal';
    const sizes = api.getSizes();

    const rootSlot = getSlotProps('root', rootStyle, classNames, slotStyles, {
      flexDirection: isH ? 'row' : 'column',
      ...style,
    });

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    // ── Render ───────────────────────────────────────────
    const items: React.ReactNode[] = [];

    childArray.forEach((child, i) => {
      const panelSlotResult = getSlotProps('panel', panelStyle, classNames, slotStyles);
      const size = sizes[i] ?? 0;
      const collapsed = api.isCollapsed(i);

      const panelStyleOverride: CSSProperties = {
        [isH ? 'width' : 'height']: size,
        ...(collapsed ? { overflow: 'hidden' } : {}),
      };

      items.push(
        <div
          key={`panel-${i}`}
          className={panelSlotResult.className || undefined}
          style={{ ...panelSlotResult.style, ...panelStyleOverride }}
          data-panel-index={i}
          data-collapsed={collapsed || undefined}
        >
          {child}
        </div>,
      );

      // Gutter (panel'ler arasinda)
      if (i < panelCount - 1) {
        const gutterSlotResult = getSlotProps('gutter', gutterStyle, classNames, slotStyles);

        const gutterStyleOverride: CSSProperties = {
          [isH ? 'width' : 'height']: gutterSize,
          cursor: isH ? 'col-resize' : 'row-resize',
        };

        items.push(
          <div
            key={`gutter-${i}`}
            className={gutterSlotResult.className || undefined}
            style={{ ...gutterSlotResult.style, ...gutterStyleOverride }}
            data-gutter-index={i}
            role="separator"
            aria-orientation={isH ? 'vertical' : 'horizontal'}
            tabIndex={0}
            onPointerDown={(e) => handlePointerDown(i, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={() => {
              const leftCollapsible = collapsible?.[i];
              const rightCollapsible = collapsible?.[i + 1];
              if (leftCollapsible) handleDoubleClick(i);
              else if (rightCollapsible) handleDoubleClick(i + 1);
            }}
          />,
        );
      }
    });

    const ctxValue: SplitPanelContextValue = { classNames, styles: slotStyles };

    return (
      <SplitPanelContext.Provider value={ctxValue}>
        <div
          ref={mergedRef}
          {...rest}
          className={finalClass}
          style={rootSlot.style}
          data-orientation={currentOrientation}
          data-dragging={api.isDragging() || undefined}
        >
          {items}
        </div>
      </SplitPanelContext.Provider>
    );
  },
);

/**
 * SplitPanel bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <SplitPanel orientation="horizontal" defaultSizes={[300, 500]}>
 *   <div>Left Panel</div>
 *   <div>Right Panel</div>
 * </SplitPanel>
 * ```
 *
 * @example Compound
 * ```tsx
 * <SplitPanel>
 *   <SplitPanel.Pane>Left Panel</SplitPanel.Pane>
 *   <SplitPanel.Handle />
 *   <SplitPanel.Pane>Right Panel</SplitPanel.Pane>
 * </SplitPanel>
 * ```
 */
export const SplitPanel = Object.assign(SplitPanelBase, {
  Pane: SplitPanelPane,
  Handle: SplitPanelHandle,
});
