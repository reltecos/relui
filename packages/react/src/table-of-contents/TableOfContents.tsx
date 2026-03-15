/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TableOfContents — scroll spy navigasyon bilesen (Dual API).
 * TableOfContents — scroll spy navigation component (Dual API).
 *
 * Props-based: `<TableOfContents items={[...]} />`
 * Compound:    `<TableOfContents items={[...]}><TableOfContents.Item id="intro"><TableOfContents.Link>Intro</TableOfContents.Link></TableOfContents.Item></TableOfContents>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import {
  tocRootRecipe,
  tocLinkRecipe,
  tocListStyle,
  tocItemStyle,
  tocIndicatorStyle,
  tocIndicatorActiveStyle,
} from './table-of-contents.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
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

// ── Context (Compound API) ──────────────────────────

interface TableOfContentsContextValue {
  variant: TableOfContentsVariant;
  size: TableOfContentsSize;
  depthIndent: number;
  activeId: string | null;
  scrollTo: (id: string) => void;
  classNames: ClassNames<TableOfContentsSlot> | undefined;
  styles: Styles<TableOfContentsSlot> | undefined;
}

const TableOfContentsContext = createContext<TableOfContentsContextValue | null>(null);

function useTableOfContentsContext(): TableOfContentsContextValue {
  const ctx = useContext(TableOfContentsContext);
  if (!ctx) throw new Error('TableOfContents compound sub-components must be used within <TableOfContents>.');
  return ctx;
}

// ── Compound: TableOfContents.Item ──────────────────

/** TableOfContents.Item props */
export interface TableOfContentsItemProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const TableOfContentsItem = forwardRef<HTMLLIElement, TableOfContentsItemProps>(
  function TableOfContentsItem(props, ref) {
    const { children, className } = props;
    const ctx = useTableOfContentsContext();
    const slot = getSlotProps('item', tocItemStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <li ref={ref} className={cls} style={slot.style} data-testid="table-of-contents-item">
        {children}
      </li>
    );
  },
);

// ── Compound: TableOfContents.Link ──────────────────

/** TableOfContents.Link props */
export interface TableOfContentsLinkProps {
  /** Hedef element id / Target element id */
  href: string;
  /** Icerik / Content */
  children: ReactNode;
  /** Derinlik seviyesi / Depth level */
  depth?: number;
  /** Pasif / Disabled */
  disabled?: boolean;
  /** Ek className / Additional className */
  className?: string;
}

const TableOfContentsLink = forwardRef<HTMLAnchorElement, TableOfContentsLinkProps>(
  function TableOfContentsLink(props, ref) {
    const { href, children, depth = 0, disabled = false, className } = props;
    const ctx = useTableOfContentsContext();

    const targetId = href.startsWith('#') ? href.slice(1) : href;
    const isActive = ctx.activeId === targetId;

    const linkClass = tocLinkRecipe({
      variant: ctx.variant,
      size: ctx.size,
      active: isActive,
      disabled,
    });
    const slot = getSlotProps('link', linkClass, ctx.classNames, ctx.styles);

    const indent = depth * ctx.depthIndent;
    const linkStyle: React.CSSProperties = {
      ...slot.style,
      paddingLeft: ctx.variant === 'dots'
        ? indent
        : (ctx.variant === 'default' ? 12 + indent : 8 + indent),
    };

    const cls = className ? `${slot.className} ${className}` : slot.className;

    const indicatorSlot = getSlotProps(
      'indicator',
      `${tocIndicatorStyle}${isActive ? ` ${tocIndicatorActiveStyle}` : ''}`,
      ctx.classNames,
      ctx.styles,
    );

    return (
      <a
        ref={ref}
        href={`#${targetId}`}
        className={cls}
        style={linkStyle}
        aria-current={isActive ? 'location' : undefined}
        aria-disabled={disabled || undefined}
        data-active={isActive || undefined}
        data-depth={depth}
        data-testid="table-of-contents-link"
        onClick={(e) => {
          e.preventDefault();
          if (!disabled) {
            ctx.scrollTo(targetId);
          }
        }}
      >
        {ctx.variant === 'dots' && (
          <span
            className={indicatorSlot.className}
            style={indicatorSlot.style}
            aria-hidden="true"
          />
        )}
        {children}
      </a>
    );
  },
);

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

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

// ── Component ────────────────────────────────────────

const TableOfContentsBase = forwardRef<HTMLElement, TableOfContentsComponentProps>(
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
      children,
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

    const ctxValue: TableOfContentsContextValue = {
      variant,
      size,
      depthIndent,
      activeId: context.activeId,
      scrollTo,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <TableOfContentsContext.Provider value={ctxValue}>
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
              {children}
            </ul>
          </nav>
        </TableOfContentsContext.Provider>
      );
    }

    // ── Props-based API (render link) ──
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

/**
 * TableOfContents bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <TableOfContents
 *   items={[
 *     { id: 'intro', label: 'Introduction', depth: 0 },
 *     { id: 'install', label: 'Installation', depth: 1 },
 *   ]}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <TableOfContents items={[{ id: 'intro', label: 'Intro', depth: 0 }]}>
 *   <TableOfContents.Item>
 *     <TableOfContents.Link href="intro" depth={0}>Introduction</TableOfContents.Link>
 *   </TableOfContents.Item>
 * </TableOfContents>
 * ```
 */
export const TableOfContents = Object.assign(TableOfContentsBase, {
  Item: TableOfContentsItem,
  Link: TableOfContentsLink,
});
