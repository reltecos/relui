/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createPDFViewer } from './pdf-viewer.machine';

describe('createPDFViewer', () => {
  it('varsayilan context', () => { const api = createPDFViewer(); const ctx = api.getContext(); expect(ctx.currentPage).toBe(1); expect(ctx.totalPages).toBe(0); expect(ctx.zoomMode).toBe('fit'); expect(ctx.zoomPercent).toBe(100); api.destroy(); });
  it('config ile baslar', () => { const api = createPDFViewer({ totalPages: 10, defaultPage: 5 }); expect(api.getContext().currentPage).toBe(5); expect(api.getContext().totalPages).toBe(10); api.destroy(); });
  it('NEXT_PAGE ilerler', () => { const onPageChange = vi.fn(); const api = createPDFViewer({ totalPages: 5, onPageChange }); api.send({ type: 'NEXT_PAGE' }); expect(api.getContext().currentPage).toBe(2); expect(onPageChange).toHaveBeenCalledWith(2); api.destroy(); });
  it('NEXT_PAGE son sayfada kalir', () => { const api = createPDFViewer({ totalPages: 3, defaultPage: 3 }); api.send({ type: 'NEXT_PAGE' }); expect(api.getContext().currentPage).toBe(3); api.destroy(); });
  it('PREV_PAGE geri gider', () => { const api = createPDFViewer({ totalPages: 5, defaultPage: 3 }); api.send({ type: 'PREV_PAGE' }); expect(api.getContext().currentPage).toBe(2); api.destroy(); });
  it('PREV_PAGE ilk sayfada kalir', () => { const api = createPDFViewer({ totalPages: 5, defaultPage: 1 }); api.send({ type: 'PREV_PAGE' }); expect(api.getContext().currentPage).toBe(1); api.destroy(); });
  it('SET_PAGE clamp eder', () => { const api = createPDFViewer({ totalPages: 10 }); api.send({ type: 'SET_PAGE', page: 15 }); expect(api.getContext().currentPage).toBe(10); api.send({ type: 'SET_PAGE', page: 0 }); expect(api.getContext().currentPage).toBe(1); api.destroy(); });
  it('SET_ZOOM modu degistirir', () => { const api = createPDFViewer(); api.send({ type: 'SET_ZOOM', mode: 'percent', percent: 150 }); expect(api.getContext().zoomMode).toBe('percent'); expect(api.getContext().zoomPercent).toBe(150); api.destroy(); });
  it('SET_ZOOM percent clamp eder', () => { const api = createPDFViewer(); api.send({ type: 'SET_ZOOM', mode: 'percent', percent: 600 }); expect(api.getContext().zoomPercent).toBe(500); api.destroy(); });
  it('SET_TOTAL_PAGES gunceller', () => { const api = createPDFViewer(); api.send({ type: 'SET_TOTAL_PAGES', total: 20 }); expect(api.getContext().totalPages).toBe(20); api.destroy(); });
  it('SET_TOTAL_PAGES currentPage clamp eder', () => { const api = createPDFViewer({ totalPages: 10, defaultPage: 8 }); api.send({ type: 'SET_TOTAL_PAGES', total: 5 }); expect(api.getContext().currentPage).toBe(5); api.destroy(); });
  it('isFirst/isLast flaglari dogru', () => { const api = createPDFViewer({ totalPages: 3, defaultPage: 1 }); expect(api.getContext().isFirst).toBe(true); expect(api.getContext().isLast).toBe(false); api.send({ type: 'SET_PAGE', page: 3 }); expect(api.getContext().isLast).toBe(true); api.destroy(); });
  it('subscribe/destroy', () => { const api = createPDFViewer(); const l = vi.fn(); api.subscribe(l); api.send({ type: 'SET_TOTAL_PAGES', total: 5 }); expect(l).toHaveBeenCalledTimes(1); api.destroy(); api.send({ type: 'NEXT_PAGE' }); expect(l).toHaveBeenCalledTimes(1); });
  it('zoom width modu', () => { const api = createPDFViewer(); api.send({ type: 'SET_ZOOM', mode: 'width' }); expect(api.getContext().zoomMode).toBe('width'); api.destroy(); });
  it('defaultZoom config ile baslar', () => { const api = createPDFViewer({ defaultZoom: 'width' }); expect(api.getContext().zoomMode).toBe('width'); api.destroy(); });
  it('defaultZoomPercent config ile baslar', () => { const api = createPDFViewer({ defaultZoomPercent: 75 }); expect(api.getContext().zoomPercent).toBe(75); api.destroy(); });
});
