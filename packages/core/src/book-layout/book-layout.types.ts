/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BookLayout types — sayfa çevirme efektli konteyner tipleri.
 *
 * @packageDocumentation
 */

/** Sayfa geçiş yönü. */
export type PageDirection = 'forward' | 'backward';

/** BookLayout yapılandırma prop'ları. */
export interface BookLayoutProps {
  /** Toplam sayfa sayısı. Varsayılan: 0. */
  totalPages?: number;
  /** Başlangıç sayfası (0-based). Varsayılan: 0. */
  currentPage?: number;
  /** Döngüsel navigasyon (son sayfadan ilk sayfaya). Varsayılan: false. */
  loop?: boolean;
}

/** BookLayout state machine event'leri. */
export type BookLayoutEvent =
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }
  | { type: 'GO_TO_PAGE'; page: number }
  | { type: 'FIRST_PAGE' }
  | { type: 'LAST_PAGE' }
  | { type: 'SET_TOTAL_PAGES'; value: number };

/** BookLayout state machine API. */
export interface BookLayoutAPI {
  /** Mevcut sayfa (0-based). */
  getCurrentPage: () => number;
  /** Toplam sayfa sayısı. */
  getTotalPages: () => number;
  /** İlk sayfada mı. */
  isFirstPage: () => boolean;
  /** Son sayfada mı. */
  isLastPage: () => boolean;
  /** Sonraki sayfaya gidilebilir mi. */
  canGoNext: () => boolean;
  /** Önceki sayfaya gidilebilir mi. */
  canGoPrev: () => boolean;
  /** Event gönder. */
  send: (event: BookLayoutEvent) => void;
}
