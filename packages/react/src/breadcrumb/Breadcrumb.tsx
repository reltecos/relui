/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Breadcrumb — styled breadcrumb bilesen (Dual API).
 * Breadcrumb — styled breadcrumb component (Dual API).
 *
 * Props-based: `<Breadcrumb items={[...]} />`
 * Compound:    `<Breadcrumb><Breadcrumb.Item>...</Breadcrumb.Item></Breadcrumb>`
 *
 * WAI-ARIA Breadcrumb pattern: nav + ol + aria-current="page".
 * Daraltma: cok sayida oge varsa orta kisim `...` ile gosterilir.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
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
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

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

// ── Context (Compound API) ──────────────────────────────────────

interface BreadcrumbContextValue {
  size: BreadcrumbSize;
  separator: ReactNode;
  classNames: ClassNames<BreadcrumbSlot> | undefined;
  styles: Styles<BreadcrumbSlot> | undefined;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

function useBreadcrumbContext(): BreadcrumbContextValue {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) throw new Error('Breadcrumb compound sub-components must be used within <Breadcrumb>.');
  return ctx;
}

// ── Compound: Breadcrumb.Item ─────────────────────────────────

/** Breadcrumb.Item props */
export interface BreadcrumbItemCompoundProps {
  /** Icerik / Content */
  children: ReactNode;
  /** href (link ise) / href (if link) */
  href?: string;
  /** Son oge mi / Is last item */
  isLast?: boolean;
  /** Devre disi / Disabled */
  disabled?: boolean;
  /** Ek className / Additional className */
  className?: string;
}

const BreadcrumbItemCompound = forwardRef<HTMLLIElement, BreadcrumbItemCompoundProps>(
  function BreadcrumbItem(props, ref) {
    const { children, href, isLast = false, disabled = false, className } = props;
    const ctx = useBreadcrumbContext();
    const itemSlot = getSlotProps('item', breadcrumbItemStyle, ctx.classNames, ctx.styles);
    const linkSlot = getSlotProps('link', breadcrumbLinkStyle, ctx.classNames, ctx.styles);
    const itemCls = className ? `${itemSlot.className} ${className}` : itemSlot.className;

    const isLink = href && !isLast;

    return (
      <li ref={ref} className={itemCls} style={itemSlot.style} data-testid="breadcrumb-item">
        {isLink ? (
          <a
            href={href}
            className={linkSlot.className}
            style={linkSlot.style}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
          >
            {children}
          </a>
        ) : (
          <span
            className={linkSlot.className}
            style={linkSlot.style}
            aria-current={isLast ? 'page' : undefined}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? '' : undefined}
          >
            {children}
          </span>
        )}
      </li>
    );
  },
);

// ── Compound: Breadcrumb.Separator ────────────────────────────

/** Breadcrumb.Separator props */
export interface BreadcrumbSeparatorProps {
  /** Icerik (varsayilan: context separator) / Content (default: context separator) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const BreadcrumbSeparator = forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
  function BreadcrumbSeparator(props, ref) {
    const { children, className } = props;
    const ctx = useBreadcrumbContext();
    const separatorSlot = getSlotProps('separator', breadcrumbSeparatorStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${separatorSlot.className} ${className}` : separatorSlot.className;

    return (
      <span
        ref={ref}
        className={cls}
        style={separatorSlot.style}
        aria-hidden="true"
        data-testid="breadcrumb-separator"
      >
        {children ?? ctx.separator}
      </span>
    );
  },
);

// ── Compound: Breadcrumb.Link ─────────────────────────────────

/** Breadcrumb.Link props */
export interface BreadcrumbLinkProps {
  /** Icerik / Content */
  children: ReactNode;
  /** href */
  href?: string;
  /** Son oge mi / Is last item */
  isLast?: boolean;
  /** Devre disi / Disabled */
  disabled?: boolean;
  /** Ek className / Additional className */
  className?: string;
}

const BreadcrumbLink = forwardRef<HTMLAnchorElement | HTMLSpanElement, BreadcrumbLinkProps>(
  function BreadcrumbLink(props, ref) {
    const { children, href, isLast = false, disabled = false, className } = props;
    const ctx = useBreadcrumbContext();
    const linkSlot = getSlotProps('link', breadcrumbLinkStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${linkSlot.className} ${className}` : linkSlot.className;

    const isLink = href && !isLast;

    if (isLink) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cls}
          style={linkSlot.style}
          aria-disabled={disabled || undefined}
          data-disabled={disabled ? '' : undefined}
          data-testid="breadcrumb-link"
        >
          {children}
        </a>
      );
    }

    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={cls}
        style={linkSlot.style}
        aria-current={isLast ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        data-testid="breadcrumb-link"
      >
        {children}
      </span>
    );
  },
);

// ── Breadcrumb Component Props ──────────────────────────────────────

export interface BreadcrumbComponentProps extends Partial<UseBreadcrumbProps>, SlotStyleProps<BreadcrumbSlot> {
  /** Boyut / Size */
  size?: BreadcrumbSize;

  /** Ayirici / Separator (varsayilan: '/') */
  separator?: ReactNode;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;
}

// ── Component ─────────────────────────────────────────────────────

/**
 * Breadcrumb bilesen — breadcrumb navigasyonu (Dual API).
 * Breadcrumb component — breadcrumb navigation (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { key: 'home', label: 'Ana Sayfa', href: '/' },
 *     { key: 'products', label: 'Urunler', href: '/products' },
 *     { key: 'detail', label: 'Urun Detayi' },
 *   ]}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Breadcrumb>
 *   <Breadcrumb.Item href="/">Ana Sayfa</Breadcrumb.Item>
 *   <Breadcrumb.Separator />
 *   <Breadcrumb.Item href="/products">Urunler</Breadcrumb.Item>
 *   <Breadcrumb.Separator />
 *   <Breadcrumb.Item isLast>Urun Detayi</Breadcrumb.Item>
 * </Breadcrumb>
 * ```
 */
const BreadcrumbBase = forwardRef<HTMLElement, BreadcrumbComponentProps>(
  function Breadcrumb(props, ref) {
    const {
      size = 'md',
      separator = '/',
      children,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      ...breadcrumbProps
    } = props;

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

    const ctxValue: BreadcrumbContextValue = { size, separator, classNames, styles };

    // ── Compound API ──
    if (children) {
      return (
        <BreadcrumbContext.Provider value={ctxValue}>
          <nav
            ref={ref}
            className={combinedRootClassName}
            style={combinedRootStyle}
            id={id}
            aria-label="Breadcrumb"
            data-testid="breadcrumb-root"
          >
            <ol className={listSlot.className} style={listSlot.style}>
              {children}
            </ol>
          </nav>
        </BreadcrumbContext.Provider>
      );
    }

    // ── Props-based API ──
    const resolvedProps: UseBreadcrumbProps = {
      ...breadcrumbProps,
      items: breadcrumbProps.items ?? [],
    };
    const {
      navProps,
      visibleItems,
      getItemProps,
      expand,
    } = useBreadcrumb(resolvedProps);

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

/**
 * Breadcrumb bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Breadcrumb items={[...]} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Breadcrumb>
 *   <Breadcrumb.Item href="/">Ana Sayfa</Breadcrumb.Item>
 *   <Breadcrumb.Separator />
 *   <Breadcrumb.Item href="/products">Urunler</Breadcrumb.Item>
 *   <Breadcrumb.Separator />
 *   <Breadcrumb.Item isLast>Urun Detayi</Breadcrumb.Item>
 * </Breadcrumb>
 * ```
 */
export const Breadcrumb = Object.assign(BreadcrumbBase, {
  Item: BreadcrumbItemCompound,
  Separator: BreadcrumbSeparator,
  Link: BreadcrumbLink,
});
