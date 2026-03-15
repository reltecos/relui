/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Pagination — styled pagination bilesen (Dual API).
 * Pagination — styled pagination component (Dual API).
 *
 * Props-based: `<Pagination totalItems={100} pageSize={10} />`
 * Compound:    `<Pagination totalItems={100}><Pagination.PrevButton /><Pagination.PageButton page={1} /><Pagination.NextButton /></Pagination>`
 *
 * WAI-ARIA: nav[aria-label="Pagination"] + button per page.
 * Prev/Next + first/last + sayfa numaralari + ellipsis.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
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
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

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

// ── Context (Compound API) ──────────────────────────────────────

interface PaginationContextValue {
  size: PaginationSize;
  variant: PaginationVariant;
  currentPage: number;
  totalPages: number;
  onPageChange: ((page: number) => void) | undefined;
  goToPage: (page: number) => void;
  goToPrev: () => void;
  goToNext: () => void;
  classNames: ClassNames<PaginationSlot> | undefined;
  styles: Styles<PaginationSlot> | undefined;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePaginationContext(): PaginationContextValue {
  const ctx = useContext(PaginationContext);
  if (!ctx) throw new Error('Pagination compound sub-components must be used within <Pagination>.');
  return ctx;
}

// ── Compound: Pagination.PrevButton ─────────────────────────────

/** Pagination.PrevButton props */
export interface PaginationPrevButtonProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const PaginationPrevButton = forwardRef<HTMLButtonElement, PaginationPrevButtonProps>(
  function PaginationPrevButton(props, ref) {
    const { children = '\u2039', className } = props;
    const ctx = usePaginationContext();
    const controlClass = paginationControlRecipe({ size: ctx.size });
    const slot = getSlotProps('control', controlClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <li>
        <button
          ref={ref}
          type="button"
          className={cls}
          style={slot.style}
          disabled={ctx.currentPage <= 1}
          onClick={ctx.goToPrev}
          aria-label="Onceki sayfa"
          data-testid="pagination-prev"
        >
          {children}
        </button>
      </li>
    );
  },
);

// ── Compound: Pagination.NextButton ─────────────────────────────

/** Pagination.NextButton props */
export interface PaginationNextButtonProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const PaginationNextButton = forwardRef<HTMLButtonElement, PaginationNextButtonProps>(
  function PaginationNextButton(props, ref) {
    const { children = '\u203A', className } = props;
    const ctx = usePaginationContext();
    const controlClass = paginationControlRecipe({ size: ctx.size });
    const slot = getSlotProps('control', controlClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <li>
        <button
          ref={ref}
          type="button"
          className={cls}
          style={slot.style}
          disabled={ctx.currentPage >= ctx.totalPages}
          onClick={ctx.goToNext}
          aria-label="Sonraki sayfa"
          data-testid="pagination-next"
        >
          {children}
        </button>
      </li>
    );
  },
);

// ── Compound: Pagination.PageButton ─────────────────────────────

/** Pagination.PageButton props */
export interface PaginationPageButtonProps {
  /** Sayfa numarasi / Page number */
  page: number;
  /** Icerik (varsayilan: sayfa numarasi) / Content (default: page number) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const PaginationPageButton = forwardRef<HTMLButtonElement, PaginationPageButtonProps>(
  function PaginationPageButton(props, ref) {
    const { page, children, className } = props;
    const ctx = usePaginationContext();
    const pageClass = paginationPageRecipe({ variant: ctx.variant, size: ctx.size });
    const slot = getSlotProps('page', pageClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const isCurrent = page === ctx.currentPage;

    return (
      <li>
        <button
          ref={ref}
          type="button"
          className={cls}
          style={slot.style}
          aria-current={isCurrent ? 'page' : undefined}
          data-selected={isCurrent ? '' : undefined}
          onClick={() => {
            if (!isCurrent) ctx.goToPage(page);
          }}
          data-testid="pagination-page"
        >
          {children ?? page}
        </button>
      </li>
    );
  },
);

// ── Pagination Component Props ──────────────────────────────────────

export interface PaginationComponentProps extends UsePaginationProps, SlotStyleProps<PaginationSlot> {
  /** Boyut / Size */
  size?: PaginationSize;

  /** Gorsel variant / Visual variant */
  variant?: PaginationVariant;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;

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

// ── Component ───────────────────────────────────────────────────────

/**
 * Pagination bilesen — sayfa navigasyonu (Dual API).
 * Pagination component — page navigation (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <Pagination totalItems={100} pageSize={10} onPageChange={(p) => console.log(p)} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Pagination totalItems={100} pageSize={10}>
 *   <Pagination.PrevButton />
 *   <Pagination.PageButton page={1} />
 *   <Pagination.PageButton page={2} />
 *   <Pagination.PageButton page={3} />
 *   <Pagination.NextButton />
 * </Pagination>
 * ```
 */
const PaginationBase = forwardRef<HTMLElement, PaginationComponentProps>(
  function Pagination(props, ref) {
    const {
      size = 'md',
      variant = 'outline',
      children,
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

    const ctxValue: PaginationContextValue = {
      size,
      variant,
      currentPage: page,
      totalPages,
      onPageChange: paginationProps.onPageChange,
      goToPage: (p: number) => getPageProps(p).onClick(),
      goToPrev: prevProps.onClick,
      goToNext: nextProps.onClick,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <PaginationContext.Provider value={ctxValue}>
          <nav
            ref={ref}
            className={combinedRootClassName}
            style={combinedRootStyle}
            id={id}
            {...navProps}
            data-testid="pagination-root"
          >
            <ul className={listSlot.className} style={listSlot.style}>
              {children}
            </ul>
          </nav>
        </PaginationContext.Provider>
      );
    }

    // ── Props-based API ──
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

/**
 * Pagination bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Pagination totalItems={100} pageSize={10} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Pagination totalItems={100} pageSize={10}>
 *   <Pagination.PrevButton />
 *   <Pagination.PageButton page={1} />
 *   <Pagination.PageButton page={2} />
 *   <Pagination.NextButton />
 * </Pagination>
 * ```
 */
export const Pagination = Object.assign(PaginationBase, {
  PrevButton: PaginationPrevButton,
  NextButton: PaginationNextButton,
  PageButton: PaginationPageButton,
});
