/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Pagination state machine — framework-agnostic headless pagination logic.
 * Pagination state machine — framework bagimsiz headless pagination mantigi.
 *
 * Sayfa araligi hesaplama: boundary + sibling + ellipsis pattern.
 *
 * @packageDocumentation
 */

import type {
  PaginationProps,
  PaginationMachineContext,
  PaginationEvent,
  PaginationRangeItem,
  PaginationNavDOMProps,
  PaginationPageDOMProps,
  PaginationControlDOMProps,
} from './pagination.types';

// ── Yardimci / Helper ──────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function computeTotalPages(totalItems: number, pageSize: number): number {
  if (totalItems <= 0 || pageSize <= 0) return 1;
  return Math.ceil(totalItems / pageSize);
}

// ── Context olusturucu / Context creator ────────────────────────────

function createInitialContext(props: PaginationProps): PaginationMachineContext {
  const pageSize = props.pageSize ?? 10;
  const totalPages = computeTotalPages(props.totalItems, pageSize);
  const page = clamp(props.page ?? props.defaultPage ?? 1, 1, totalPages);

  return {
    page,
    totalItems: props.totalItems,
    pageSize,
    totalPages,
    siblingCount: props.siblingCount ?? 1,
    boundaryCount: props.boundaryCount ?? 1,
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: PaginationMachineContext,
  event: PaginationEvent,
): PaginationMachineContext {
  if (event.type === 'GO_TO_PAGE') {
    const newPage = clamp(event.page, 1, ctx.totalPages);
    if (newPage === ctx.page) return ctx;
    return { ...ctx, page: newPage };
  }

  if (event.type === 'NEXT_PAGE') {
    if (ctx.page >= ctx.totalPages) return ctx;
    return { ...ctx, page: ctx.page + 1 };
  }

  if (event.type === 'PREV_PAGE') {
    if (ctx.page <= 1) return ctx;
    return { ...ctx, page: ctx.page - 1 };
  }

  if (event.type === 'FIRST_PAGE') {
    if (ctx.page === 1) return ctx;
    return { ...ctx, page: 1 };
  }

  if (event.type === 'LAST_PAGE') {
    if (ctx.page === ctx.totalPages) return ctx;
    return { ...ctx, page: ctx.totalPages };
  }

  if (event.type === 'SET_TOTAL_ITEMS') {
    const totalPages = computeTotalPages(event.totalItems, ctx.pageSize);
    const page = clamp(ctx.page, 1, totalPages);
    return { ...ctx, totalItems: event.totalItems, totalPages, page };
  }

  if (event.type === 'SET_PAGE_SIZE') {
    const pageSize = Math.max(1, event.pageSize);
    const totalPages = computeTotalPages(ctx.totalItems, pageSize);
    const page = clamp(ctx.page, 1, totalPages);
    return { ...ctx, pageSize, totalPages, page };
  }

  if (event.type === 'SET_PAGE') {
    const newPage = clamp(event.page, 1, ctx.totalPages);
    if (newPage === ctx.page) return ctx;
    return { ...ctx, page: newPage };
  }

  return ctx;
}

// ── Sayfa araligi hesapla / Compute page range ──────────────────────

function computePageRange(ctx: PaginationMachineContext): PaginationRangeItem[] {
  const { page, totalPages, siblingCount, boundaryCount } = ctx;

  if (totalPages <= 0) return [];

  // Toplam gosterilecek slot sayisi:
  // boundary (sol) + boundary (sag) + sibling (sol) + sibling (sag) + mevcut + 2 ellipsis
  const totalSlots = boundaryCount * 2 + siblingCount * 2 + 3;
  // +3 = current page + 2 potential ellipsis positions

  // Eger toplam sayfa <= gosterilecek slot ise hepsini goster
  if (totalPages <= totalSlots) {
    const result: PaginationRangeItem[] = [];
    for (let i = 1; i <= totalPages; i++) {
      result.push({ type: 'page', page: i, key: `page-${i}` });
    }
    return result;
  }

  const result: PaginationRangeItem[] = [];

  // Sol boundary sayfalar
  const leftBoundaryEnd = boundaryCount;
  for (let i = 1; i <= leftBoundaryEnd; i++) {
    result.push({ type: 'page', page: i, key: `page-${i}` });
  }

  // Sibling araligi
  const siblingStart = Math.max(page - siblingCount, leftBoundaryEnd + 1);
  const rightBoundaryStart = totalPages - boundaryCount + 1;
  const siblingEnd = Math.min(page + siblingCount, rightBoundaryStart - 1);

  // Sol ellipsis gerekli mi?
  if (siblingStart > leftBoundaryEnd + 1) {
    result.push({ type: 'ellipsis', key: 'ellipsis-left' });
  }

  // Sibling sayfalar (mevcut sayfa dahil)
  for (let i = siblingStart; i <= siblingEnd; i++) {
    result.push({ type: 'page', page: i, key: `page-${i}` });
  }

  // Sag ellipsis gerekli mi?
  if (siblingEnd < rightBoundaryStart - 1) {
    result.push({ type: 'ellipsis', key: 'ellipsis-right' });
  }

  // Sag boundary sayfalar
  for (let i = rightBoundaryStart; i <= totalPages; i++) {
    result.push({ type: 'page', page: i, key: `page-${i}` });
  }

  return result;
}

// ── DOM Props ureticileri / DOM Props generators ─────────────────────

function getNavProps(): PaginationNavDOMProps {
  return {
    'aria-label': 'Pagination',
    role: 'navigation',
  };
}

function getPageProps(pageNum: number, currentPage: number): PaginationPageDOMProps {
  const isSelected = pageNum === currentPage;
  return {
    'aria-label': `Sayfa ${pageNum}`,
    'aria-current': isSelected ? 'page' : undefined,
    'data-selected': isSelected ? '' : undefined,
  };
}

function getPrevProps(ctx: PaginationMachineContext): PaginationControlDOMProps {
  const isDisabled = ctx.page <= 1;
  return {
    'aria-label': 'Onceki sayfa',
    'aria-disabled': isDisabled ? true : undefined,
    'data-disabled': isDisabled ? '' : undefined,
  };
}

function getNextProps(ctx: PaginationMachineContext): PaginationControlDOMProps {
  const isDisabled = ctx.page >= ctx.totalPages;
  return {
    'aria-label': 'Sonraki sayfa',
    'aria-disabled': isDisabled ? true : undefined,
    'data-disabled': isDisabled ? '' : undefined,
  };
}

function getFirstProps(ctx: PaginationMachineContext): PaginationControlDOMProps {
  const isDisabled = ctx.page <= 1;
  return {
    'aria-label': 'Ilk sayfa',
    'aria-disabled': isDisabled ? true : undefined,
    'data-disabled': isDisabled ? '' : undefined,
  };
}

function getLastProps(ctx: PaginationMachineContext): PaginationControlDOMProps {
  const isDisabled = ctx.page >= ctx.totalPages;
  return {
    'aria-label': 'Son sayfa',
    'aria-disabled': isDisabled ? true : undefined,
    'data-disabled': isDisabled ? '' : undefined,
  };
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Pagination API — state machine ve DOM props ureticileri.
 * Pagination API — state machine and DOM props generators.
 */
export interface PaginationAPI {
  /** Mevcut context / Current context */
  getContext(): PaginationMachineContext;

  /** Event gonder / Send event */
  send(event: PaginationEvent): PaginationMachineContext;

  /** Sayfa araligi / Page range */
  getPageRange(): PaginationRangeItem[];

  /** Nav DOM attribute'lari / Nav DOM attributes */
  getNavProps(): PaginationNavDOMProps;

  /** Sayfa butonu DOM attribute'lari / Page button DOM attributes */
  getPageProps(page: number): PaginationPageDOMProps;

  /** Onceki buton DOM attribute'lari / Prev button DOM attributes */
  getPrevProps(): PaginationControlDOMProps;

  /** Sonraki buton DOM attribute'lari / Next button DOM attributes */
  getNextProps(): PaginationControlDOMProps;

  /** Ilk buton DOM attribute'lari / First button DOM attributes */
  getFirstProps(): PaginationControlDOMProps;

  /** Son buton DOM attribute'lari / Last button DOM attributes */
  getLastProps(): PaginationControlDOMProps;

  /** Onceki sayfa var mi / Has previous page */
  hasPrevPage(): boolean;

  /** Sonraki sayfa var mi / Has next page */
  hasNextPage(): boolean;

  /** Mevcut sayfa / Current page */
  getPage(): number;

  /** Toplam sayfa sayisi / Total pages */
  getTotalPages(): number;

  /** Gosterilen oge araligi / Displayed item range */
  getItemRange(): { start: number; end: number };
}

/**
 * Pagination state machine olustur.
 * Create a pagination state machine.
 *
 * @example
 * ```ts
 * const pg = createPagination({ totalItems: 100, pageSize: 10 });
 * pg.getPageRange(); // sayfa numaralari + ellipsis
 * pg.send({ type: 'NEXT_PAGE' });
 * ```
 */
export function createPagination(props: PaginationProps): PaginationAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: PaginationEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getPageRange() {
      return computePageRange(ctx);
    },

    getNavProps() {
      return getNavProps();
    },

    getPageProps(page: number) {
      return getPageProps(page, ctx.page);
    },

    getPrevProps() {
      return getPrevProps(ctx);
    },

    getNextProps() {
      return getNextProps(ctx);
    },

    getFirstProps() {
      return getFirstProps(ctx);
    },

    getLastProps() {
      return getLastProps(ctx);
    },

    hasPrevPage() {
      return ctx.page > 1;
    },

    hasNextPage() {
      return ctx.page < ctx.totalPages;
    },

    getPage() {
      return ctx.page;
    },

    getTotalPages() {
      return ctx.totalPages;
    },

    getItemRange() {
      const start = (ctx.page - 1) * ctx.pageSize + 1;
      const end = Math.min(ctx.page * ctx.pageSize, ctx.totalItems);
      return { start, end };
    },
  };
}
