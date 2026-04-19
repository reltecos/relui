/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createPDFViewer, type PDFViewerConfig, type PDFViewerAPI, type PDFZoomMode } from '@relteco/relui-core';

export type UsePDFViewerProps = PDFViewerConfig;
export type UsePDFViewerReturn = ReturnType<PDFViewerAPI['getContext']> & {
  nextPage: () => void; prevPage: () => void; setPage: (p: number) => void;
  setZoom: (mode: PDFZoomMode, percent?: number) => void; setTotalPages: (t: number) => void;
  api: PDFViewerAPI;
};

export function usePDFViewer(props: UsePDFViewerProps = {}): UsePDFViewerReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<PDFViewerAPI | null>(null);
  if (apiRef.current === null) apiRef.current = createPDFViewer(props);
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const ctx = api.getContext();
  return {
    ...ctx, api,
    nextPage: useCallback(() => api.send({ type: 'NEXT_PAGE' }), [api]),
    prevPage: useCallback(() => api.send({ type: 'PREV_PAGE' }), [api]),
    setPage: useCallback((p: number) => api.send({ type: 'SET_PAGE', page: p }), [api]),
    setZoom: useCallback((mode: PDFZoomMode, percent?: number) => api.send({ type: 'SET_ZOOM', mode, percent }), [api]),
    setTotalPages: useCallback((t: number) => api.send({ type: 'SET_TOTAL_PAGES', total: t }), [api]),
  };
}
