/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sortable — liste ici siralama bilesen (Dual API).
 * Sortable — list reorder component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useCallback, type ReactNode } from 'react';
import type { SortableDirection } from '@relteco/relui-core';
import { rootStyle, rootHorizontalStyle, itemStyle, placeholderStyle } from './sortable.css';
import { useSortable, type UseSortableProps } from './useSortable';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type SortableSlot = 'root' | 'item' | 'placeholder';

interface SortableContextValue {
  items: ReadonlyArray<string>;
  activeId: string | null;
  overIndex: number | null;
  direction: SortableDirection;
  onDragStart: (id: string) => void;
  onDragOver: (idx: number) => void;
  onDragEnd: () => void;
  classNames: ClassNames<SortableSlot> | undefined;
  styles: Styles<SortableSlot> | undefined;
}

const SortableCtx = createContext<SortableContextValue | null>(null);
function useSortableContext(): SortableContextValue {
  const ctx = useContext(SortableCtx);
  if (!ctx) throw new Error('Sortable compound sub-components must be used within <Sortable>.');
  return ctx;
}

// ── Sub: SortableItem ──

export interface SortableItemProps {
  /** Oge id / Item ID */
  itemId: string;
  children: ReactNode;
  className?: string;
}

const SortableItem = forwardRef<HTMLDivElement, SortableItemProps>(
  function SortableItem(props, ref) {
    const { itemId, children, className } = props;
    const ctx = useSortableContext();
    const slot = getSlotProps('item', itemStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const isDragging = ctx.activeId === itemId;
    const index = ctx.items.indexOf(itemId);

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="sortable-item"
        data-item-id={itemId}
        data-dragging={isDragging}
        draggable
        onDragStart={() => ctx.onDragStart(itemId)}
        onDragOver={(e) => { e.preventDefault(); ctx.onDragOver(index); }}
        onDragEnd={() => ctx.onDragEnd()}
        role="listitem"
      >
        {children}
      </div>
    );
  },
);

// ── Sub: Placeholder ──

export interface SortablePlaceholderProps { className?: string }

const SortablePlaceholder = forwardRef<HTMLDivElement, SortablePlaceholderProps>(
  function SortablePlaceholder(props, ref) {
    const { className } = props;
    const ctx = useSortableContext();
    if (!ctx.activeId) return null;
    const slot = getSlotProps('placeholder', placeholderStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (<div ref={ref} className={cls} style={slot.style} data-testid="sortable-placeholder" />);
  },
);

// ── Props ──

export interface SortableComponentProps extends SlotStyleProps<SortableSlot> {
  /** Oge id listesi / Item ID list */
  items: string[];
  /** Yon / Direction */
  direction?: SortableDirection;
  /** Siralama degisince / On reorder */
  onReorder?: (items: string[]) => void;
  /** Props-based: her oge icin render / Render function for each item */
  renderItem?: (id: string, index: number) => ReactNode;
  /** Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const SortableBase = forwardRef<HTMLDivElement, SortableComponentProps>(
  function Sortable(props, ref) {
    const { items, direction = 'vertical', onReorder, renderItem, children, className, style: styleProp, classNames, styles } = props;
    const hookProps: UseSortableProps = { items, direction, onReorder };
    const { context, send } = useSortable(hookProps);

    const onDragStart = useCallback((id: string) => send({ type: 'DRAG_START', itemId: id }), [send]);
    const onDragOver = useCallback((idx: number) => send({ type: 'DRAG_OVER', overIndex: idx }), [send]);
    const onDragEnd = useCallback(() => send({ type: 'DRAG_END' }), [send]);

    const rootCls = direction === 'horizontal' ? `${rootStyle} ${rootHorizontalStyle}` : rootStyle;
    const rootSlot = getSlotProps('root', rootCls, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: SortableContextValue = {
      items: context.items, activeId: context.activeId, overIndex: context.overIndex,
      direction, onDragStart, onDragOver, onDragEnd, classNames, styles,
    };

    if (children) {
      return (
        <SortableCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} role="list" data-testid="sortable-root" data-direction={direction}>
            {children}
          </div>
        </SortableCtx.Provider>
      );
    }

    // Props-based
    const iSlot = getSlotProps('item', itemStyle, classNames, styles);

    return (
      <SortableCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} role="list" data-testid="sortable-root" data-direction={direction}>
          {context.items.map((id, idx) => (
            <div
              key={id}
              className={iSlot.className}
              style={iSlot.style}
              data-testid="sortable-item"
              data-item-id={id}
              data-dragging={context.activeId === id}
              draggable
              onDragStart={() => onDragStart(id)}
              onDragOver={(e) => { e.preventDefault(); onDragOver(idx); }}
              onDragEnd={() => onDragEnd()}
              role="listitem"
            >
              {renderItem ? renderItem(id, idx) : id}
            </div>
          ))}
        </div>
      </SortableCtx.Provider>
    );
  },
);

export const Sortable = Object.assign(SortableBase, {
  Item: SortableItem,
  Placeholder: SortablePlaceholder,
});
