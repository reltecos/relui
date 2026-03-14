/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Pagination type definitions — framework-agnostic.
 * Pagination tip tanimlari — framework bagimsiz.
 *
 * WAI-ARIA: nav[aria-label] + button per page.
 *
 * @packageDocumentation
 */

/**
 * Pagination boyutu / Pagination size.
 */
export type PaginationSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Pagination variant.
 */
export type PaginationVariant = 'outline' | 'filled' | 'subtle';

/**
 * Sayfa araligi ogesi / Page range item.
 */
export interface PaginationRangeItem {
  /** Tip: sayfa numarasi veya ellipsis / Type: page number or ellipsis */
  type: 'page' | 'ellipsis';

  /** Sayfa numarasi (type='page' ise) / Page number (if type='page') */
  page?: number;

  /** Benzersiz anahtar / Unique key */
  key: string;
}

/**
 * Core Pagination props — framework-agnostic yapilandirma.
 * Core Pagination props — framework-agnostic configuration.
 */
export interface PaginationProps {
  /** Toplam oge sayisi / Total item count */
  totalItems: number;

  /** Sayfa basi oge sayisi / Items per page */
  pageSize?: number;

  /** Baslangic sayfasi (1-tabanli) / Initial page (1-based) */
  defaultPage?: number;

  /** Kontrollü sayfa / Controlled page */
  page?: number;

  /** Mevcut sayfanin her iki yaninda gosterilecek sayfa sayisi / Siblings on each side of current */
  siblingCount?: number;

  /** Baslangic ve sondaki sabit sayfa sayisi / Fixed pages at start and end */
  boundaryCount?: number;
}

/**
 * Pagination machine context — ic durum.
 * Pagination machine context — internal state.
 */
export interface PaginationMachineContext {
  /** Mevcut sayfa (1-tabanli) / Current page (1-based) */
  page: number;

  /** Toplam oge sayisi / Total item count */
  totalItems: number;

  /** Sayfa basi oge sayisi / Items per page */
  pageSize: number;

  /** Toplam sayfa sayisi / Total page count */
  totalPages: number;

  /** Sibling sayisi / Sibling count */
  siblingCount: number;

  /** Boundary sayisi / Boundary count */
  boundaryCount: number;
}

/**
 * State machine'e gonderilebilecek event'ler.
 * Events that can be sent to the state machine.
 */
export type PaginationEvent =
  | { type: 'GO_TO_PAGE'; page: number }
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }
  | { type: 'FIRST_PAGE' }
  | { type: 'LAST_PAGE' }
  | { type: 'SET_TOTAL_ITEMS'; totalItems: number }
  | { type: 'SET_PAGE_SIZE'; pageSize: number }
  | { type: 'SET_PAGE'; page: number };

/**
 * Nav DOM attribute'lari / Nav DOM attributes.
 */
export interface PaginationNavDOMProps {
  'aria-label': string;
  role: 'navigation';
}

/**
 * Sayfa butonu DOM attribute'lari / Page button DOM attributes.
 */
export interface PaginationPageDOMProps {
  'aria-label': string;
  'aria-current': 'page' | undefined;
  'data-selected': '' | undefined;
}

/**
 * Prev/Next buton DOM attribute'lari / Prev/Next button DOM attributes.
 */
export interface PaginationControlDOMProps {
  'aria-label': string;
  'aria-disabled': true | undefined;
  'data-disabled': '' | undefined;
}
