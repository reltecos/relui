/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type PDFZoomMode = 'fit' | 'width' | 'percent';

export type PDFViewerEvent =
  | { type: 'SET_PAGE'; page: number }
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }
  | { type: 'SET_ZOOM'; mode: PDFZoomMode; percent?: number }
  | { type: 'SET_TOTAL_PAGES'; total: number };

export interface PDFViewerContext {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly zoomMode: PDFZoomMode;
  readonly zoomPercent: number;
  readonly isFirst: boolean;
  readonly isLast: boolean;
}

export interface PDFViewerConfig {
  totalPages?: number;
  defaultPage?: number;
  defaultZoom?: PDFZoomMode;
  defaultZoomPercent?: number;
  onPageChange?: (page: number) => void;
}

export interface PDFViewerAPI {
  getContext(): PDFViewerContext;
  send(event: PDFViewerEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
