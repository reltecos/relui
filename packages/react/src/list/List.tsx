/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * List — veri listesi bilesen.
 * List — data list component.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext } from 'react';
import {
  listRootStyle,
  listItemStyle,
  listItemPrimaryStyle,
  listItemSecondaryStyle,
  listItemIconStyle,
  listItemActionStyle,
} from './list.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/**
 * List slot isimleri / List slot names.
 */
export type ListSlot = 'root' | 'item' | 'itemPrimary' | 'itemSecondary' | 'itemIcon' | 'itemAction';

// ── Types ────────────────────────────────────────────

/**
 * Props-based kullanim icin item tanimi / Item definition for props-based usage.
 */
export interface ListItemDef {
  /** Benzersiz kimlik / Unique identifier */
  id: string;
  /** Ana metin / Primary text */
  primary: React.ReactNode;
  /** Yardimci metin / Secondary text */
  secondary?: React.ReactNode;
  /** Ikon / Icon */
  icon?: React.ReactNode;
  /** Aksiyon / Action element */
  action?: React.ReactNode;
}

// ── Context ──────────────────────────────────────────

interface ListContextValue {
  classNames: ClassNames<ListSlot> | undefined;
  styles: Styles<ListSlot> | undefined;
}

const ListContext = createContext<ListContextValue | null>(null);

function useListContext(): ListContextValue {
  const ctx = useContext(ListContext);
  if (!ctx) throw new Error('List.Item must be used within <List>');
  return ctx;
}

// ── Component Props ─────────────────────────────────

export interface ListComponentProps extends SlotStyleProps<ListSlot> {
  /** Props-based: item listesi / Item list for auto-render */
  items?: ListItemDef[];
  /** Compound: children ile manual render */
  children?: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── ListItem Sub-Component Props ────────────────────

export interface ListItemComponentProps {
  /** Ana metin / Primary text */
  primary: React.ReactNode;
  /** Yardimci metin / Secondary text */
  secondary?: React.ReactNode;
  /** Ikon / Icon */
  icon?: React.ReactNode;
  /** Aksiyon / Action element */
  action?: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

// ── ListItem Sub-Component ──────────────────────────

const ListItem = forwardRef<HTMLLIElement, ListItemComponentProps>(
  function ListItem(props, ref) {
    const ctx = useListContext();
    const { primary, secondary, icon, action, className } = props;

    const itemSlot = getSlotProps('item', listItemStyle, ctx.classNames, ctx.styles);
    const primarySlot = getSlotProps('itemPrimary', listItemPrimaryStyle, ctx.classNames, ctx.styles);
    const secondarySlot = getSlotProps(
      'itemSecondary',
      listItemSecondaryStyle,
      ctx.classNames,
      ctx.styles,
    );
    const iconSlot = getSlotProps('itemIcon', listItemIconStyle, ctx.classNames, ctx.styles);
    const actionSlot = getSlotProps('itemAction', listItemActionStyle, ctx.classNames, ctx.styles);

    const itemClassName = className ? `${itemSlot.className} ${className}` : itemSlot.className;

    return (
      <li ref={ref} className={itemClassName} style={itemSlot.style} role="listitem" data-testid="list-item">
        {icon !== undefined && (
          <span className={iconSlot.className} style={iconSlot.style} data-testid="list-item-icon">
            {icon}
          </span>
        )}
        <div>
          <div
            className={primarySlot.className}
            style={primarySlot.style}
            data-testid="list-item-primary"
          >
            {primary}
          </div>
          {secondary !== undefined && (
            <div
              className={secondarySlot.className}
              style={secondarySlot.style}
              data-testid="list-item-secondary"
            >
              {secondary}
            </div>
          )}
        </div>
        {action !== undefined && (
          <span
            className={actionSlot.className}
            style={actionSlot.style}
            data-testid="list-item-action"
          >
            {action}
          </span>
        )}
      </li>
    );
  },
);

// ── Main Component ──────────────────────────────────

const ListBase = forwardRef<HTMLUListElement, ListComponentProps>(
  function List(props, ref) {
    const { items, children, className, style: styleProp, classNames, styles } = props;

    const rootSlot = getSlotProps('root', listRootStyle, classNames, styles, styleProp);
    const itemSlot = getSlotProps('item', listItemStyle, classNames, styles);
    const primarySlot = getSlotProps('itemPrimary', listItemPrimaryStyle, classNames, styles);
    const secondarySlot = getSlotProps(
      'itemSecondary',
      listItemSecondaryStyle,
      classNames,
      styles,
    );
    const iconSlot = getSlotProps('itemIcon', listItemIconStyle, classNames, styles);
    const actionSlot = getSlotProps('itemAction', listItemActionStyle, classNames, styles);

    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: ListContextValue = { classNames, styles };

    return (
      <ListContext.Provider value={ctxValue}>
        <ul ref={ref} className={rootClassName} style={rootSlot.style} role="list" data-testid="list-root">
          {items &&
            items.map((item) => (
              <li
                key={item.id}
                className={itemSlot.className}
                style={itemSlot.style}
                role="listitem"
                data-testid="list-item"
              >
                {item.icon !== undefined && (
                  <span
                    className={iconSlot.className}
                    style={iconSlot.style}
                    data-testid="list-item-icon"
                  >
                    {item.icon}
                  </span>
                )}
                <div>
                  <div
                    className={primarySlot.className}
                    style={primarySlot.style}
                    data-testid="list-item-primary"
                  >
                    {item.primary}
                  </div>
                  {item.secondary !== undefined && (
                    <div
                      className={secondarySlot.className}
                      style={secondarySlot.style}
                      data-testid="list-item-secondary"
                    >
                      {item.secondary}
                    </div>
                  )}
                </div>
                {item.action !== undefined && (
                  <span
                    className={actionSlot.className}
                    style={actionSlot.style}
                    data-testid="list-item-action"
                  >
                    {item.action}
                  </span>
                )}
              </li>
            ))}
          {children}
        </ul>
      </ListContext.Provider>
    );
  },
);

// ── Export ───────────────────────────────────────────

/**
 * List bilesen — veri listesi.
 * List component — data list.
 *
 * @example
 * ```tsx
 * // Props-based
 * <List items={[
 *   { id: '1', primary: 'Elma', secondary: 'Meyve' },
 *   { id: '2', primary: 'Havuc', secondary: 'Sebze' },
 * ]} />
 *
 * // Compound
 * <List>
 *   <List.Item primary="Elma" secondary="Meyve" />
 *   <List.Item primary="Havuc" secondary="Sebze" />
 * </List>
 * ```
 */
export const List = Object.assign(ListBase, {
  Item: ListItem,
});
