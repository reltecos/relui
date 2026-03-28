/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Masonry — Pinterest tarzi grid layout bilesen (Dual API).
 *
 * Props-based: `<Masonry columns={3}><div>Card 1</div></Masonry>`
 * Compound:    `<Masonry columns={3}><Masonry.Item>Card 1</Masonry.Item></Masonry>`
 *
 * Item lari en kisa kolona yerlestirerek masonry layout olusturur.
 * ResizeObserver ile container genisligini otomatik takip eder.
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
import { createMasonry } from '@relteco/relui-core';
import type { MasonryAPI } from '@relteco/relui-core';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils';

/** Masonry slot isimleri. */
export type MasonrySlot = 'root' | 'item';

// ── Context (Compound API) ──────────────────────────

interface MasonryContextValue {
  classNames: ClassNames<MasonrySlot> | undefined;
  styles: Styles<MasonrySlot> | undefined;
}

const MasonryContext = createContext<MasonryContextValue | null>(null);

function useMasonryContext(): MasonryContextValue {
  const ctx = useContext(MasonryContext);
  if (!ctx) throw new Error('Masonry compound sub-components must be used within <Masonry>.');
  return ctx;
}

// ── Compound: Masonry.Item ──────────────────────────

/** Masonry.Item props */
export interface MasonryItemProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: CSSProperties;
}

const MasonryItem = forwardRef<HTMLDivElement, MasonryItemProps>(
  function MasonryItem(props, ref) {
    const { children, className, style: styleProp } = props;
    const ctx = useMasonryContext();
    const slot = getSlotProps('item', undefined, ctx.classNames, ctx.styles);
    const cls = className
      ? [slot.className, className].filter(Boolean).join(' ')
      : slot.className || undefined;

    return (
      <div
        ref={ref}
        className={cls || undefined}
        style={{ ...slot.style, ...styleProp }}
        data-testid="masonry-item"
      >
        {children}
      </div>
    );
  },
);

// ── Component Props ──────────────────────────────────

/** Masonry bilesen props. */
export interface MasonryComponentProps
  extends SlotStyleProps<MasonrySlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Kolon sayisi. Varsayilan: 3. */
  columns?: number;
  /** Kolon arasi bosluk (px). Varsayilan: 16. */
  gap?: number;
  /** Satir arasi bosluk (px). Belirlenmezse gap kullanilir. */
  rowGap?: number;
}

// ── Component ─────────────────────────────────────────

const MasonryBase = forwardRef<HTMLDivElement, MasonryComponentProps>(
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

        // Item yuksekliklerini oku
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

    // ── Pozisyonlari hesapla ─────────────────────────────

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

    const ctxValue: MasonryContextValue = { classNames, styles };

    return (
      <MasonryContext.Provider value={ctxValue}>
        <div
          ref={mergedRef}
          {...rest}
          className={finalClass}
          style={{ ...rootSlot.style, height: totalHeight > 0 ? totalHeight : undefined }}
          data-testid="masonry-root"
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
                data-testid="masonry-item"
              >
                {child}
              </div>
            );
          })}
        </div>
      </MasonryContext.Provider>
    );
  },
);

/**
 * Masonry bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Masonry columns={3} gap={16}>
 *   <div>Card 1</div>
 *   <div>Card 2</div>
 * </Masonry>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Masonry columns={3} gap={16}>
 *   <Masonry.Item>Card 1</Masonry.Item>
 *   <Masonry.Item>Card 2</Masonry.Item>
 * </Masonry>
 * ```
 */
export const Masonry = Object.assign(MasonryBase, {
  Item: MasonryItem,
});
