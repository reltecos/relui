/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { PDFViewerConfig, PDFViewerContext, PDFViewerEvent, PDFViewerAPI, PDFZoomMode } from './pdf-viewer.types';

export function createPDFViewer(config: PDFViewerConfig = {}): PDFViewerAPI {
  let totalPages = config.totalPages ?? 0;
  let currentPage = Math.max(1, Math.min(config.defaultPage ?? 1, totalPages || 1));
  let zoomMode: PDFZoomMode = config.defaultZoom ?? 'fit';
  let zoomPercent = config.defaultZoomPercent ?? 100;

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }

  function send(event: PDFViewerEvent): void {
    switch (event.type) {
      case 'SET_PAGE': {
        const p = Math.max(1, Math.min(totalPages || 1, event.page));
        if (p === currentPage) return;
        currentPage = p;
        config.onPageChange?.(currentPage);
        notify(); break;
      }
      case 'NEXT_PAGE': {
        if (currentPage >= totalPages) return;
        currentPage++; config.onPageChange?.(currentPage); notify(); break;
      }
      case 'PREV_PAGE': {
        if (currentPage <= 1) return;
        currentPage--; config.onPageChange?.(currentPage); notify(); break;
      }
      case 'SET_ZOOM': {
        zoomMode = event.mode;
        if (event.percent !== undefined) zoomPercent = Math.max(10, Math.min(500, event.percent));
        notify(); break;
      }
      case 'SET_TOTAL_PAGES': {
        if (event.total === totalPages) return;
        totalPages = event.total;
        if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
        notify(); break;
      }
    }
  }

  return {
    getContext(): PDFViewerContext {
      return { currentPage, totalPages, zoomMode, zoomPercent, isFirst: currentPage <= 1, isLast: currentPage >= totalPages };
    },
    send,
    subscribe(cb) { listeners.add(cb); return () => { listeners.delete(cb); }; },
    destroy() { listeners.clear(); },
  };
}
