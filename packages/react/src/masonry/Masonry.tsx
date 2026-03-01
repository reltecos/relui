/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Masonry — Pinterest tarzı grid layout bileşeni.
 *
 * Item'ları en kısa kolona yerleştirerek masonry layout oluşturur.
 * ResizeObserver ile container genişliğini, MutationObserver ile
 * item yüksekliklerini otomatik takip eder.
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
import { createMasonry } from '@relteco/relui-core';
import type { MasonryAPI } from '@relteco/relui-core';
import { getSlotProps, type SlotStyleProps } from '../utils';

/** Masonry slot isimleri. */
export type MasonrySlot = 'root' | 'item';

/** Masonry bileşen prop'ları. */
export interface MasonryComponentProps
  extends SlotStyleProps<MasonrySlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Kolon sayısı. Varsayılan: 3. */
  columns?: number;
  /** Kolon arası boşluk (px). Varsayılan: 16. */
  gap?: number;
  /** Satır arası boşluk (px). Belirlenmezse gap kullanılır. */
  rowGap?: number;
}

/**
 * Masonry — Pinterest tarzı grid layout.
 *
 * @example
 * ```tsx
 * <Masonry columns={3} gap={16}>
 *   <div>Card 1</div>
 *   <div>Card 2</div>
 *   <div>Card 3</div>
 * </Masonry>
 * ```
 */
export const Masonry = forwardRef<HTMLDivElement, MasonryComponentProps>(
  function Masonry(props, ref) {
    const {
      children,
      className,
      style,
      classNames,
      styles,
      columns = 3,
      gap = 16,
      rowGap,
      ...rest
    } = props;

    const apiRef = useRef<MasonryAPI | null>(null);
    if (apiRef.current === null) {
      apiRef.current = createMasonry({ columns, gap, rowGap });
    }
    const api = apiRef.current;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    // ── Ref merge ────────────────────────────────────────

    const mergedRef = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    // ── Prop sync ────────────────────────────────────────

    useEffect(() => {
      api.send({ type: 'SET_COLUMNS', value: columns });
      forceRender();
    }, [api, columns]);

    useEffect(() => {
      api.send({ type: 'SET_GAP', value: gap });
      forceRender();
    }, [api, gap]);

    // ── ResizeObserver — container width ─────────────────

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const updateLayout = () => {
        const containerWidth = container.clientWidth;
        api.send({ type: 'SET_CONTAINER_WIDTH', value: containerWidth });

        // Item yüksekliklerini oku
        const heights = itemRefs.current
          .filter((el): el is HTMLDivElement => el !== null)
          .map((el) => el.offsetHeight);

        api.send({ type: 'SET_ITEMS', heights });
        forceRender();
      };

      updateLayout();

      const ro = new ResizeObserver(updateLayout);
      ro.observe(container);

      return () => ro.disconnect();
    }, [api, Children.count(children)]);

    // ── Pozisyonları hesapla ─────────────────────────────

    const positions = api.getPositions();
    const totalHeight = api.getTotalHeight();

    // ── Slot props ───────────────────────────────────────

    const rootSlot = getSlotProps(
      'root',
      undefined,
      classNames,
      styles,
      { position: 'relative' as const, ...style },
    );

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    const childArray = Children.toArray(children);

    return (
      <div
        ref={mergedRef}
        {...rest}
        className={finalClass}
        style={{ ...rootSlot.style, height: totalHeight > 0 ? totalHeight : undefined }}
      >
        {childArray.map((child, i) => {
          const pos = positions[i];
          const itemSlot = getSlotProps('item', undefined, classNames, styles);

          const itemStyle: CSSProperties = pos
            ? {
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                width: pos.width,
              }
            : { visibility: 'hidden' as const };

          return (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              className={itemSlot.className || undefined}
              style={{ ...itemSlot.style, ...itemStyle }}
              data-masonry-column={pos?.column}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  },
);
