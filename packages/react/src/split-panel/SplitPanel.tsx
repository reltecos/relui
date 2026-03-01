/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SplitPanel — yatay/dikey bölünebilir panel layout bileşeni.
 *
 * Panel'leri sürüklenebilir gutter'larla ayırır. Resize, collapse
 * ve min/max boyut kısıtlamaları destekler.
 *
 * @packageDocumentation
 */

import React, {
  forwardRef,
  useRef,
  useEffect,
  useReducer,
  Children,
  type CSSProperties,
} from 'react';
import { createSplitPanel } from '@relteco/relui-core';
import type { SplitPanelAPI, SplitOrientation } from '@relteco/relui-core';
import { getSlotProps, type SlotStyleProps } from '../utils';

/** SplitPanel slot isimleri. */
export type SplitPanelSlot = 'root' | 'panel' | 'gutter';

/** SplitPanel bileşen prop'ları. */
export interface SplitPanelComponentProps
  extends SlotStyleProps<SplitPanelSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Bölme yönü. Varsayılan: 'horizontal'. */
  orientation?: SplitOrientation;
  /** Gutter boyutu (px). Varsayılan: 8. */
  gutterSize?: number;
  /** Her panel için minimum boyut (px). */
  minSizes?: number[];
  /** Her panel için maksimum boyut (px). */
  maxSizes?: number[];
  /** Her panel daraltılabilir mi. */
  collapsible?: boolean[];
  /** Başlangıç boyutları (px). */
  defaultSizes?: number[];
  /** Boyut değiştiğinde çağrılır. */
  onSizesChange?: (sizes: number[]) => void;
  /** Panel daraltma/açma değiştiğinde çağrılır. */
  onCollapseChange?: (panelIndex: number, collapsed: boolean) => void;
}

/**
 * SplitPanel — yatay/dikey bölünebilir panel layout.
 *
 * @example
 * ```tsx
 * <SplitPanel orientation="horizontal" defaultSizes={[300, 500]}>
 *   <div>Left Panel</div>
 *   <div>Right Panel</div>
 * </SplitPanel>
 * ```
 */
export const SplitPanel = forwardRef<HTMLDivElement, SplitPanelComponentProps>(
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

    const rootSlot = getSlotProps(
      'root',
      undefined,
      classNames,
      slotStyles,
      {
        display: 'flex',
        flexDirection: isH ? 'row' : 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      },
    );

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    // ── Render ───────────────────────────────────────────

    const items: React.ReactNode[] = [];

    childArray.forEach((child, i) => {
      const panelSlot = getSlotProps('panel', undefined, classNames, slotStyles);
      const size = sizes[i] ?? 0;
      const collapsed = api.isCollapsed(i);

      const panelStyle: CSSProperties = {
        [isH ? 'width' : 'height']: size,
        overflow: 'auto',
        flexShrink: 0,
        ...(collapsed ? { overflow: 'hidden' } : {}),
      };

      items.push(
        <div
          key={`panel-${i}`}
          className={panelSlot.className || undefined}
          style={{ ...panelSlot.style, ...panelStyle }}
          data-panel-index={i}
          data-collapsed={collapsed || undefined}
        >
          {child}
        </div>,
      );

      // Gutter (panel'ler arasında)
      if (i < panelCount - 1) {
        const gutterSlot = getSlotProps('gutter', undefined, classNames, slotStyles);

        const gutterStyle: CSSProperties = {
          [isH ? 'width' : 'height']: gutterSize,
          flexShrink: 0,
          cursor: isH ? 'col-resize' : 'row-resize',
          background: 'var(--rel-color-border, #e2e8f0)',
          userSelect: 'none',
          touchAction: 'none',
        };

        items.push(
          <div
            key={`gutter-${i}`}
            className={gutterSlot.className || undefined}
            style={{ ...gutterSlot.style, ...gutterStyle }}
            data-gutter-index={i}
            role="separator"
            aria-orientation={isH ? 'vertical' : 'horizontal'}
            tabIndex={0}
            onPointerDown={(e) => handlePointerDown(i, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={() => {
              // Çift tıklama — bitişik collapsible paneli toggle et
              const leftCollapsible = collapsible?.[i];
              const rightCollapsible = collapsible?.[i + 1];
              if (leftCollapsible) handleDoubleClick(i);
              else if (rightCollapsible) handleDoubleClick(i + 1);
            }}
          />,
        );
      }
    });

    return (
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
    );
  },
);
