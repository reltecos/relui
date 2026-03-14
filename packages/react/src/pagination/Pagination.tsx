/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Pagination — styled pagination bilesen.
 * Pagination — styled pagination component.
 *
 * WAI-ARIA: nav[aria-label="Pagination"] + button per page.
 * Prev/Next + first/last + sayfa numaralari + ellipsis.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import type { PaginationSize, PaginationVariant } from '@relteco/relui-core';
import { usePagination, type UsePaginationProps } from './usePagination';
import {
  paginationRootStyle,
  paginationListRecipe,
  paginationPageRecipe,
  paginationControlRecipe,
  paginationEllipsisStyle,
  paginationInfoStyle,
} from './pagination.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/**
 * Pagination slot isimleri / Pagination slot names.
 */
export type PaginationSlot =
  | 'root'
  | 'list'
  | 'page'
  | 'control'
  | 'ellipsis'
  | 'info';

// ── Pagination Component Props ──────────────────────────────────────

export interface PaginationComponentProps extends UsePaginationProps, SlotStyleProps<PaginationSlot> {
  /** Boyut / Size */
  size?: PaginationSize;

  /** Gorsel variant / Visual variant */
  variant?: PaginationVariant;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;

  /** Ilk/Son butonlari goster / Show first/last buttons */
  showFirstLast?: boolean;

  /** Oge araligi bilgisi goster / Show item range info */
  showInfo?: boolean;

  /** Prev buton icerigi / Prev button content */
  prevLabel?: React.ReactNode;

  /** Next buton icerigi / Next button content */
  nextLabel?: React.ReactNode;

  /** First buton icerigi / First button content */
  firstLabel?: React.ReactNode;

  /** Last buton icerigi / Last button content */
  lastLabel?: React.ReactNode;
}

/**
 * Pagination bilesen — sayfa navigasyonu.
 * Pagination component — page navigation.
 *
 * @example
 * ```tsx
 * <Pagination totalItems={100} pageSize={10} onPageChange={(p) => console.log(p)} />
 * ```
 */
export const Pagination = forwardRef<HTMLElement, PaginationComponentProps>(
  function Pagination(props, ref) {
    const {
      size = 'md',
      variant = 'outline',
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      showFirstLast = false,
      showInfo = false,
      prevLabel = '\u2039',
      nextLabel = '\u203A',
      firstLabel = '\u00AB',
      lastLabel = '\u00BB',
      ...paginationProps
    } = props;

    const {
      navProps,
      pageRange,
      getPageProps,
      prevProps,
      nextProps,
      firstProps,
      lastProps,
      page,
      totalPages,
      itemRange,
    } = usePagination(paginationProps);

    // ── Root (nav) slot ──
    const rootSlot = getSlotProps('root', paginationRootStyle, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    // ── List slot ──
    const listClass = paginationListRecipe({ size });
    const listSlot = getSlotProps('list', listClass, classNames, styles);

    // ── Page slot ──
    const pageClass = paginationPageRecipe({ variant, size });
    const pageSlot = getSlotProps('page', pageClass, classNames, styles);

    // ── Control slot ──
    const controlClass = paginationControlRecipe({ size });
    const controlSlot = getSlotProps('control', controlClass, classNames, styles);

    // ── Ellipsis slot ──
    const ellipsisSlot = getSlotProps('ellipsis', paginationEllipsisStyle, classNames, styles);

    // ── Info slot ──
    const infoSlot = getSlotProps('info', paginationInfoStyle, classNames, styles);

    return (
      <nav
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        {...navProps}
      >
        <ul className={listSlot.className} style={listSlot.style}>
          {/* First */}
          {showFirstLast && (
            <li>
              <button
                type="button"
                className={controlSlot.className}
                style={controlSlot.style}
                disabled={!page || page <= 1}
                {...firstProps}
              >
                {firstLabel}
              </button>
            </li>
          )}

          {/* Prev */}
          <li>
            <button
              type="button"
              className={controlSlot.className}
              style={controlSlot.style}
              disabled={!page || page <= 1}
              {...prevProps}
            >
              {prevLabel}
            </button>
          </li>

          {/* Page numbers */}
          {pageRange.map((item) => {
            if (item.type === 'ellipsis') {
              return (
                <li key={item.key}>
                  <span
                    className={ellipsisSlot.className}
                    style={ellipsisSlot.style}
                  >
                    ...
                  </span>
                </li>
              );
            }

            const itemPage = item.page;
            if (itemPage === undefined) return null;

            const pageDomProps = getPageProps(itemPage);
            return (
              <li key={item.key}>
                <button
                  type="button"
                  className={pageSlot.className}
                  style={pageSlot.style}
                  {...pageDomProps}
                >
                  {itemPage}
                </button>
              </li>
            );
          })}

          {/* Next */}
          <li>
            <button
              type="button"
              className={controlSlot.className}
              style={controlSlot.style}
              disabled={!page || page >= totalPages}
              {...nextProps}
            >
              {nextLabel}
            </button>
          </li>

          {/* Last */}
          {showFirstLast && (
            <li>
              <button
                type="button"
                className={controlSlot.className}
                style={controlSlot.style}
                disabled={!page || page >= totalPages}
                {...lastProps}
              >
                {lastLabel}
              </button>
            </li>
          )}
        </ul>

        {/* Info text */}
        {showInfo && (
          <span className={infoSlot.className} style={infoSlot.style}>
            {itemRange.start}–{itemRange.end} / {paginationProps.totalItems}
          </span>
        )}
      </nav>
    );
  },
);
