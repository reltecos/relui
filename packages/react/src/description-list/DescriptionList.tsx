/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DescriptionList — anahtar-deger gosterim bilesen (Dual API).
 * DescriptionList — key-value display component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext } from 'react';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import {
  dlRootStyle,
  dlDirectionStyles,
  dlItemStyle,
  dlTermBaseStyle,
  dlTermSizeStyles,
  dlDescriptionBaseStyle,
  dlDescriptionSizeStyles,
} from './description-list.css';

// ── Slot ──────────────────────────────────────────────

/** DescriptionList slot isimleri / DescriptionList slot names. */
export type DescriptionListSlot = 'root' | 'item' | 'term' | 'description';

// ── Types ─────────────────────────────────────────────

/** DescriptionList yon / DescriptionList direction */
export type DescriptionListDirection = 'horizontal' | 'vertical';

/** DescriptionList boyut / DescriptionList size */
export type DescriptionListSize = 'sm' | 'md' | 'lg';

/** Aciklama listesi ogesi tanimi / Description list item definition */
export interface DescriptionItemDef {
  /** Benzersiz anahtar / Unique key */
  id: string;
  /** Terim / Term */
  term: React.ReactNode;
  /** Aciklama / Description */
  description: React.ReactNode;
}

// ── Context ───────────────────────────────────────────

interface DescriptionListContextValue {
  direction: DescriptionListDirection;
  size: DescriptionListSize;
  classNames: ClassNames<DescriptionListSlot> | undefined;
  styles: Styles<DescriptionListSlot> | undefined;
}

const DescriptionListContext = createContext<DescriptionListContextValue | null>(null);

function useDescriptionListContext(): DescriptionListContextValue {
  const ctx = useContext(DescriptionListContext);
  if (!ctx) {
    throw new Error('DescriptionList.Item must be used within <DescriptionList>');
  }
  return ctx;
}

// ── Component Props ───────────────────────────────────

export interface DescriptionListComponentProps extends SlotStyleProps<DescriptionListSlot> {
  /** Yon / Direction */
  direction?: DescriptionListDirection;
  /** Boyut / Size */
  size?: DescriptionListSize;
  /** Props-based: oge listesi / Item list for auto-render */
  items?: DescriptionItemDef[];
  /** Compound: children ile manual render */
  children?: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Item Sub-component ────────────────────────────────

export interface DescriptionListItemProps {
  /** Terim / Term */
  term: React.ReactNode;
  /** Aciklama / Description */
  description: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

const DescriptionListItem = forwardRef<HTMLDivElement, DescriptionListItemProps>(
  function DescriptionListItem(props, ref) {
    const { term, description, className, style: styleProp } = props;
    const ctx = useDescriptionListContext();

    const termVeClass = `${dlTermBaseStyle} ${dlTermSizeStyles[ctx.size]}`;
    const descVeClass = `${dlDescriptionBaseStyle} ${dlDescriptionSizeStyles[ctx.size]}`;

    const termSlot = getSlotProps('term', termVeClass, ctx.classNames, ctx.styles);
    const descSlot = getSlotProps('description', descVeClass, ctx.classNames, ctx.styles);

    if (ctx.direction === 'horizontal') {
      return (
        <>
          <dt
            className={termSlot.className}
            style={termSlot.style}
            data-testid="dl-term"
          >
            {term}
          </dt>
          <dd
            className={descSlot.className}
            style={descSlot.style}
            data-testid="dl-description"
          >
            {description}
          </dd>
        </>
      );
    }

    const itemSlot = getSlotProps('item', dlItemStyle, ctx.classNames, ctx.styles);
    const itemClassName = className
      ? `${itemSlot.className} ${className}`
      : itemSlot.className;

    return (
      <div
        ref={ref}
        className={itemClassName}
        style={{ ...itemSlot.style, ...styleProp }}
        data-testid="dl-item"
      >
        <dt
          className={termSlot.className}
          style={termSlot.style}
          data-testid="dl-term"
        >
          {term}
        </dt>
        <dd
          className={descSlot.className}
          style={descSlot.style}
          data-testid="dl-description"
        >
          {description}
        </dd>
      </div>
    );
  },
);

// ── Main Component ────────────────────────────────────

const DescriptionListBase = forwardRef<HTMLDListElement, DescriptionListComponentProps>(
  function DescriptionList(props, ref) {
    const {
      direction = 'vertical',
      size = 'md',
      items,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const rootVeClass = `${dlRootStyle} ${dlDirectionStyles[direction]}`;
    const rootSlot = getSlotProps('root', rootVeClass, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: DescriptionListContextValue = { direction, size, classNames, styles };

    return (
      <DescriptionListContext.Provider value={ctxValue}>
        <dl
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-direction={direction}
          data-size={size}
          data-testid="dl-root"
        >
          {/* Props-based: items prop verilmisse otomatik render */}
          {items && items.map((item) => (
            <DescriptionListItem
              key={item.id}
              term={item.term}
              description={item.description}
            />
          ))}
          {/* Compound: children verilmisse dogrudan render */}
          {children}
        </dl>
      </DescriptionListContext.Provider>
    );
  },
);

// ── Export ─────────────────────────────────────────────

export const DescriptionList = Object.assign(DescriptionListBase, {
  Item: DescriptionListItem,
});
