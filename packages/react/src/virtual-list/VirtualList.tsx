/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * VirtualList — sanal scroll listesi bilesen (Dual API).
 * VirtualList — virtual scroll list component (Dual API).
 *
 * Props-based: `<VirtualList items={data} itemHeight={40} height={400} renderItem={(item, i) => ...} />`
 * Compound:    `<VirtualList totalCount={N} itemHeight={40} height={400}>{(i) => <VirtualList.Item key={i}>Row {i}</VirtualList.Item>}</VirtualList>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useCallback, useRef, type ReactNode } from 'react';
import { rootStyle, viewportStyle, innerStyle, itemStyle } from './virtual-list.css';
import { useVirtualList, type UseVirtualListProps } from './useVirtualList';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** VirtualList slot isimleri / VirtualList slot names. */
export type VirtualListSlot = 'root' | 'viewport' | 'item';

// ── Context ───────────────────────────────────────────

interface VirtualListContextValue {
  itemHeight: number;
  classNames: ClassNames<VirtualListSlot> | undefined;
  styles: Styles<VirtualListSlot> | undefined;
}

const VirtualListContext = createContext<VirtualListContextValue | null>(null);

function useVirtualListContext(): VirtualListContextValue {
  const ctx = useContext(VirtualListContext);
  if (!ctx) throw new Error('VirtualList compound sub-components must be used within <VirtualList>.');
  return ctx;
}

// ── Compound: VirtualList.Item ────────────────────────

/** VirtualList.Item props */
export interface VirtualListItemProps {
  /** Oge index / Item index (used for positioning) */
  index?: number;
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const VirtualListItem = forwardRef<HTMLDivElement, VirtualListItemProps>(
  function VirtualListItem(props, ref) {
    const { index, children, className } = props;
    const ctx = useVirtualListContext();
    const slot = getSlotProps('item', itemStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const positionStyle = index !== undefined
      ? { ...slot.style, top: index * ctx.itemHeight, height: ctx.itemHeight }
      : { ...slot.style, height: ctx.itemHeight };

    return (
      <div
        ref={ref}
        className={cls}
        style={positionStyle}
        data-testid="virtuallist-item"
        data-index={index}
      >
        {children}
      </div>
    );
  },
);

// ── Item definition (props-based) ─────────────────────

/** VirtualList oge tanimi / VirtualList item definition */
export interface VirtualListItemDef {
  /** Benzersiz anahtar / Unique key */
  id: string;
  /** Oge verisi / Item data */
  [key: string]: unknown;
}

// ── Component Props ───────────────────────────────────

export interface VirtualListComponentProps extends SlotStyleProps<VirtualListSlot> {
  /** Gorunur alan yuksekligi (px) / Container height (px) */
  height: number;
  /** Sabit oge yuksekligi (px) / Fixed item height (px) */
  itemHeight: number;
  /** Overscan sayisi / Overscan count */
  overscan?: number;
  /** Props-based: oge listesi / Item list */
  items?: VirtualListItemDef[];
  /** Props-based: oge render fonksiyonu / Item render function */
  renderItem?: (item: VirtualListItemDef, index: number) => ReactNode;
  /** Compound: toplam oge sayisi / Total item count for compound mode */
  totalCount?: number;
  /** Compound: render fonksiyonu / Render function for compound mode */
  children?: ((index: number) => ReactNode) | ReactNode;
  /** Scroll degisim callback / Scroll change callback */
  onScroll?: (scrollTop: number) => void;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const VirtualListBase = forwardRef<HTMLDivElement, VirtualListComponentProps>(
  function VirtualList(props, ref) {
    const {
      height,
      itemHeight,
      overscan,
      items,
      renderItem,
      totalCount: totalCountProp,
      children,
      onScroll,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const resolvedTotalCount = items ? items.length : (totalCountProp ?? 0);

    const hookProps: UseVirtualListProps = {
      totalCount: resolvedTotalCount,
      itemHeight,
      height,
      overscan,
      onScroll,
    };

    const { context, handleScroll } = useVirtualList(hookProps);
    const { visibleRange, totalHeight } = context;
    const viewportRef = useRef<HTMLDivElement>(null);

    const onScrollEvent = useCallback(() => {
      const el = viewportRef.current;
      if (el) handleScroll(el.scrollTop);
    }, [handleScroll]);

    // ── Slots ──
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const viewportSlotResult = getSlotProps('viewport', viewportStyle, classNames, styles);

    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: VirtualListContextValue = { itemHeight, classNames, styles };

    // ── Determine render mode ──
    const isCompound = typeof children === 'function';

    // Build visible items
    const visibleItems: ReactNode[] = [];
    for (let i = visibleRange.startIndex; i < visibleRange.endIndex; i++) {
      if (isCompound) {
        // Compound: call children function
        visibleItems.push(children(i));
      } else if (items && renderItem) {
        // Props-based: use items + renderItem
        const item = items[i];
        if (item) {
          const itemSlot = getSlotProps('item', itemStyle, classNames, styles);
          visibleItems.push(
            <div
              key={item.id}
              className={itemSlot.className}
              style={{ ...itemSlot.style, top: i * itemHeight, height: itemHeight }}
              data-testid="virtuallist-item"
              data-index={i}
            >
              {renderItem(item, i)}
            </div>,
          );
        }
      }
    }

    return (
      <VirtualListContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp, height }}
          data-testid="virtuallist-root"
        >
          <div
            ref={viewportRef}
            className={viewportSlotResult.className}
            style={viewportSlotResult.style}
            onScroll={onScrollEvent}
            data-testid="virtuallist-viewport"
          >
            <div
              className={innerStyle}
              style={{ height: totalHeight }}
              data-testid="virtuallist-inner"
            >
              {visibleItems}
            </div>
          </div>
        </div>
      </VirtualListContext.Provider>
    );
  },
);

/**
 * VirtualList bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <VirtualList
 *   items={data}
 *   itemHeight={40}
 *   height={400}
 *   renderItem={(item, i) => <div>{item.label}</div>}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <VirtualList totalCount={10000} itemHeight={40} height={400}>
 *   {(index) => (
 *     <VirtualList.Item key={index} index={index}>
 *       Row {index}
 *     </VirtualList.Item>
 *   )}
 * </VirtualList>
 * ```
 */
export const VirtualList = Object.assign(VirtualListBase, {
  Item: VirtualListItem,
});
