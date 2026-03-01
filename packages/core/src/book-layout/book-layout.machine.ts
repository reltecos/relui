/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BookLayout state machine — sayfa çevirme navigasyonu.
 *
 * Sayfa ileri/geri, direkt sayfa atlama ve döngüsel navigasyon.
 *
 * @packageDocumentation
 */

import type {
  BookLayoutProps,
  BookLayoutEvent,
  BookLayoutAPI,
} from './book-layout.types';

/**
 * BookLayout state machine oluşturur.
 *
 * @param props - BookLayout yapılandırması.
 * @returns BookLayout API.
 */
export function createBookLayout(props: BookLayoutProps = {}): BookLayoutAPI {
  let totalPages = Math.max(0, props.totalPages ?? 0);
  let currentPage = Math.max(0, Math.min(totalPages - 1, props.currentPage ?? 0));
  const loop = props.loop ?? false;

  // totalPages 0 ise currentPage 0'da kalır
  if (totalPages === 0) currentPage = 0;

  function send(event: BookLayoutEvent): void {
    switch (event.type) {
      case 'NEXT_PAGE': {
        if (totalPages === 0) break;
        if (currentPage < totalPages - 1) {
          currentPage++;
        } else if (loop) {
          currentPage = 0;
        }
        break;
      }

      case 'PREV_PAGE': {
        if (totalPages === 0) break;
        if (currentPage > 0) {
          currentPage--;
        } else if (loop) {
          currentPage = totalPages - 1;
        }
        break;
      }

      case 'GO_TO_PAGE': {
        if (totalPages === 0) break;
        currentPage = Math.max(0, Math.min(totalPages - 1, event.page));
        break;
      }

      case 'FIRST_PAGE': {
        currentPage = 0;
        break;
      }

      case 'LAST_PAGE': {
        if (totalPages === 0) break;
        currentPage = totalPages - 1;
        break;
      }

      case 'SET_TOTAL_PAGES': {
        totalPages = Math.max(0, event.value);
        if (totalPages === 0) {
          currentPage = 0;
        } else if (currentPage >= totalPages) {
          currentPage = totalPages - 1;
        }
        break;
      }
    }
  }

  return {
    getCurrentPage: () => currentPage,
    getTotalPages: () => totalPages,
    isFirstPage: () => currentPage === 0,
    isLastPage: () => totalPages === 0 || currentPage === totalPages - 1,
    canGoNext: () => totalPages > 0 && (currentPage < totalPages - 1 || loop),
    canGoPrev: () => totalPages > 0 && (currentPage > 0 || loop),
    send,
  };
}
