/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Breadcrumb — styled breadcrumb bilesen.
 * Breadcrumb — styled breadcrumb component.
 *
 * WAI-ARIA Breadcrumb pattern: nav + ol + aria-current="page".
 * Daraltma: cok sayida oge varsa orta kisim `...` ile gosterilir.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { BreadcrumbSize } from '@relteco/relui-core';
import { useBreadcrumb, type UseBreadcrumbProps } from './useBreadcrumb';
import {
  breadcrumbNavStyle,
  breadcrumbListRecipe,
  breadcrumbItemStyle,
  breadcrumbLinkStyle,
  breadcrumbSeparatorStyle,
  breadcrumbEllipsisStyle,
} from './breadcrumb.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/**
 * Breadcrumb slot isimleri / Breadcrumb slot names.
 */
export type BreadcrumbSlot =
  | 'root'
  | 'list'
  | 'item'
  | 'link'
  | 'separator'
  | 'ellipsis';

// ── Breadcrumb Component Props ──────────────────────────────────────

export interface BreadcrumbComponentProps extends UseBreadcrumbProps, SlotStyleProps<BreadcrumbSlot> {
  /** Boyut / Size */
  size?: BreadcrumbSize;

  /** Ayirici / Separator (varsayilan: '/') */
  separator?: ReactNode;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;
}

/**
 * Breadcrumb bilesen — breadcrumb navigasyonu.
 * Breadcrumb component — breadcrumb navigation.
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { key: 'home', label: 'Ana Sayfa', href: '/' },
 *     { key: 'products', label: 'Urunler', href: '/products' },
 *     { key: 'detail', label: 'Urun Detayi' },
 *   ]}
 * />
 * ```
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbComponentProps>(
  function Breadcrumb(props, ref) {
    const {
      size = 'md',
      separator = '/',
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      ...breadcrumbProps
    } = props;

    const {
      navProps,
      visibleItems,
      getItemProps,
      expand,
    } = useBreadcrumb(breadcrumbProps);

    // ── Root (nav) slot ──
    const rootSlot = getSlotProps('root', breadcrumbNavStyle, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    // ── List (ol) slot ──
    const listRecipeClass = breadcrumbListRecipe({ size });
    const listSlot = getSlotProps('list', listRecipeClass, classNames, styles);

    // ── Item (li) slot ──
    const itemSlot = getSlotProps('item', breadcrumbItemStyle, classNames, styles);

    // ── Link slot ──
    const linkSlot = getSlotProps('link', breadcrumbLinkStyle, classNames, styles);

    // ── Separator slot ──
    const separatorSlot = getSlotProps('separator', breadcrumbSeparatorStyle, classNames, styles);

    // ── Ellipsis slot ──
    const ellipsisSlot = getSlotProps('ellipsis', breadcrumbEllipsisStyle, classNames, styles);

    return (
      <nav
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        {...navProps}
      >
        <ol className={listSlot.className} style={listSlot.style}>
          {visibleItems.map((visItem, index) => {
            const isFirst = index === 0;

            if (visItem.type === 'ellipsis') {
              return (
                <li
                  key="__ellipsis__"
                  className={itemSlot.className}
                  style={itemSlot.style}
                >
                  {!isFirst && (
                    <span
                      className={separatorSlot.className}
                      style={separatorSlot.style}
                      aria-hidden="true"
                    >
                      {separator}
                    </span>
                  )}
                  <button
                    type="button"
                    className={ellipsisSlot.className}
                    style={ellipsisSlot.style}
                    aria-label="Daha fazla"
                    onClick={expand}
                  >
                    ...
                  </button>
                </li>
              );
            }

            const item = visItem.item;
            if (!item) return null;

            const domProps = getItemProps(item, visItem.isLast);
            const isLink = item.href && !visItem.isLast;

            return (
              <li
                key={item.key}
                className={itemSlot.className}
                style={itemSlot.style}
              >
                {!isFirst && (
                  <span
                    className={separatorSlot.className}
                    style={separatorSlot.style}
                    aria-hidden="true"
                  >
                    {separator}
                  </span>
                )}
                {isLink ? (
                  <a
                    href={item.href}
                    className={linkSlot.className}
                    style={linkSlot.style}
                    {...domProps}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={linkSlot.className}
                    style={linkSlot.style}
                    {...domProps}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);
