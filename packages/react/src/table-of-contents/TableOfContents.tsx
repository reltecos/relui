/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TableOfContents — scroll spy navigasyon bilesen.
 * TableOfContents — scroll spy navigation component.
 *
 * Sayfadaki basliklari izler, aktif basligi highlight eder,
 * tiklayinca ilgili bolume smooth scroll yapar.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import {
  tocRootRecipe,
  tocLinkRecipe,
  tocListStyle,
  tocItemStyle,
  tocIndicatorStyle,
  tocIndicatorActiveStyle,
} from './table-of-contents.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import { useTableOfContents, type UseTableOfContentsProps } from './useTableOfContents';
import type { TocItem } from '@relteco/relui-core';

// ── Slot ──────────────────────────────────────────────

/**
 * TableOfContents slot isimleri / TableOfContents slot names.
 */
export type TableOfContentsSlot = 'root' | 'list' | 'item' | 'link' | 'indicator';

// ── Types ─────────────────────────────────────────────

/**
 * TableOfContents boyutlari / TableOfContents sizes.
 */
export type TableOfContentsSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * TableOfContents varyantlari / TableOfContents variants.
 */
export type TableOfContentsVariant = 'default' | 'filled' | 'dots';

// ── Component Props ──────────────────────────────────

export interface TableOfContentsComponentProps
  extends UseTableOfContentsProps,
    SlotStyleProps<TableOfContentsSlot> {
  /** Variant / Variant */
  variant?: TableOfContentsVariant;

  /** Boyut / Size */
  size?: TableOfContentsSize;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;

  /** aria-label */
  'aria-label'?: string;

  /** Derinlik basi girinti (px, default: 16) / Indent per depth level */
  depthIndent?: number;

  /** Ozel link render / Custom link render */
  renderLink?: (item: TocItem, isActive: boolean) => ReactNode;
}

// ── Component ────────────────────────────────────────

/**
 * TableOfContents bilesen — scroll spy navigasyon.
 * TableOfContents component — scroll spy navigation.
 *
 * @example
 * ```tsx
 * <TableOfContents
 *   items={[
 *     { id: 'intro', label: 'Introduction', depth: 0 },
 *     { id: 'install', label: 'Installation', depth: 1 },
 *   ]}
 * />
 * ```
 */
export const TableOfContents = forwardRef<HTMLElement, TableOfContentsComponentProps>(
  function TableOfContents(props, ref) {
    const {
      variant = 'default',
      size = 'md',
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      'aria-label': ariaLabel = 'Table of contents',
      depthIndent = 16,
      renderLink,
      // useTableOfContents props
      items,
      activeId: activeIdProp,
      offset,
      scrollBehavior,
      scrollContainer,
      onChange,
    } = props;

    const { context, scrollTo } = useTableOfContents({
      items,
      activeId: activeIdProp,
      offset,
      scrollBehavior,
      scrollContainer,
      onChange,
    });

    // ── Slots ──
    const rootClass = tocRootRecipe({ variant, size });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const listSlot = getSlotProps('list', tocListStyle, classNames, styles);
    const itemSlot = getSlotProps('item', tocItemStyle, classNames, styles);

    // ── Render link ──
    function renderTocLink(item: TocItem) {
      const isActive = context.activeId === item.id;
      const isDisabled = item.disabled ?? false;

      if (renderLink) {
        return renderLink(item, isActive);
      }

      const linkClass = tocLinkRecipe({
        variant,
        size,
        active: isActive,
        disabled: isDisabled,
      });
      const linkSlot = getSlotProps('link', linkClass, classNames, styles);

      const indent = item.depth * depthIndent;
      const linkStyle: React.CSSProperties = {
        ...linkSlot.style,
        paddingLeft: variant === 'dots'
          ? indent
          : (variant === 'default' ? 12 + indent : 8 + indent),
      };

      const indicatorSlot = getSlotProps(
        'indicator',
        `${tocIndicatorStyle}${isActive ? ` ${tocIndicatorActiveStyle}` : ''}`,
        classNames,
        styles,
      );

      return (
        <a
          href={`#${item.id}`}
          className={linkSlot.className}
          style={linkStyle}
          aria-current={isActive ? 'location' : undefined}
          aria-disabled={isDisabled || undefined}
          data-active={isActive || undefined}
          data-depth={item.depth}
          onClick={(e) => {
            e.preventDefault();
            if (!isDisabled) {
              scrollTo(item.id);
            }
          }}
        >
          {variant === 'dots' && (
            <span
              className={indicatorSlot.className}
              style={indicatorSlot.style}
              aria-hidden="true"
            />
          )}
          {item.label}
        </a>
      );
    }

    return (
      <nav
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        role="navigation"
        aria-label={ariaLabel}
        data-testid="table-of-contents"
      >
        <ul className={listSlot.className} style={listSlot.style}>
          {context.items.map((item) => (
            <li
              key={item.id}
              className={itemSlot.className}
              style={itemSlot.style}
            >
              {renderTocLink(item)}
            </li>
          ))}
        </ul>
      </nav>
    );
  },
);
