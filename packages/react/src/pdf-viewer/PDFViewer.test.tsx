/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { PDFViewer } from './PDFViewer';

describe('PDFViewer', () => {
  it('root render edilir', () => { render(<PDFViewer totalPages={5} />); expect(screen.getByTestId('pdf-viewer-root')).toBeInTheDocument(); });
  it('toolbar render edilir', () => { render(<PDFViewer totalPages={5} />); expect(screen.getByTestId('pdf-viewer-toolbar')).toBeInTheDocument(); });
  it('pageInfo render edilir', () => { render(<PDFViewer totalPages={10} />); expect(screen.getByTestId('pdf-viewer-pageInfo')).toHaveTextContent('1 / 10'); });
  it('pageDisplay render edilir', () => { render(<PDFViewer totalPages={5} />); expect(screen.getByTestId('pdf-viewer-pageDisplay')).toBeInTheDocument(); });
  it('next butonu tiklaninca sayfa ilerler', () => { render(<PDFViewer totalPages={5} />); fireEvent.click(screen.getByTestId('pdf-viewer-nextButton')); expect(screen.getByTestId('pdf-viewer-pageInfo')).toHaveTextContent('2 / 5'); });
  it('prev butonu tiklaninca sayfa geri gider', () => { render(<PDFViewer totalPages={5} defaultPage={3} />); fireEvent.click(screen.getByTestId('pdf-viewer-prevButton')); expect(screen.getByTestId('pdf-viewer-pageInfo')).toHaveTextContent('2 / 5'); });
  it('ilk sayfada prev disabled', () => { render(<PDFViewer totalPages={5} />); expect(screen.getByTestId('pdf-viewer-prevButton')).toBeDisabled(); });
  it('son sayfada next disabled', () => { render(<PDFViewer totalPages={5} defaultPage={5} />); expect(screen.getByTestId('pdf-viewer-nextButton')).toBeDisabled(); });
  it('zoom kontrolleri render edilir', () => { render(<PDFViewer totalPages={5} />); expect(screen.getByTestId('pdf-viewer-zoomControls')).toBeInTheDocument(); });
  it('zoom fit butonu calisir', () => { render(<PDFViewer totalPages={5} />); fireEvent.click(screen.getByTestId('pdf-viewer-zoomFit')); expect(screen.getByTestId('pdf-viewer-root')).toBeInTheDocument(); });
  it('zoom in butonu calisir', () => { render(<PDFViewer totalPages={5} />); fireEvent.click(screen.getByTestId('pdf-viewer-zoomIn')); expect(screen.getByTestId('pdf-viewer-root')).toBeInTheDocument(); });

  // ── Slot API ──
  it('className root elemana eklenir', () => { render(<PDFViewer totalPages={5} className="my-pdf" />); expect(screen.getByTestId('pdf-viewer-root').className).toContain('my-pdf'); });
  it('style root elemana eklenir', () => { render(<PDFViewer totalPages={5} style={{ padding: '8px' }} />); expect(screen.getByTestId('pdf-viewer-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<PDFViewer totalPages={5} classNames={{ root: 'cr' }} />); expect(screen.getByTestId('pdf-viewer-root').className).toContain('cr'); });
  it('styles.root eklenir', () => { render(<PDFViewer totalPages={5} styles={{ root: { padding: '12px' } }} />); expect(screen.getByTestId('pdf-viewer-root')).toHaveStyle({ padding: '12px' }); });
  it('classNames.toolbar eklenir', () => { render(<PDFViewer totalPages={5} classNames={{ toolbar: 'ct' }} />); expect(screen.getByTestId('pdf-viewer-toolbar').className).toContain('ct'); });
  it('styles.toolbar eklenir', () => { render(<PDFViewer totalPages={5} styles={{ toolbar: { padding: '10px' } }} />); expect(screen.getByTestId('pdf-viewer-toolbar')).toHaveStyle({ padding: '10px' }); });
  it('classNames.pageDisplay eklenir', () => { render(<PDFViewer totalPages={5} classNames={{ pageDisplay: 'cpd' }} />); expect(screen.getByTestId('pdf-viewer-pageDisplay').className).toContain('cpd'); });
  it('styles.pageDisplay eklenir', () => { render(<PDFViewer totalPages={5} styles={{ pageDisplay: { padding: '20px' } }} />); expect(screen.getByTestId('pdf-viewer-pageDisplay')).toHaveStyle({ padding: '20px' }); });
  it('classNames.pageInfo eklenir', () => { render(<PDFViewer totalPages={5} classNames={{ pageInfo: 'cpi' }} />); expect(screen.getByTestId('pdf-viewer-pageInfo').className).toContain('cpi'); });
  it('styles.pageInfo eklenir', () => { render(<PDFViewer totalPages={5} styles={{ pageInfo: { fontSize: '16px' } }} />); expect(screen.getByTestId('pdf-viewer-pageInfo')).toHaveStyle({ fontSize: '16px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<PDFViewer totalPages={5} ref={ref} />); expect(ref).toHaveBeenCalled(); });
});

describe('PDFViewer (Compound)', () => {
  it('compound: Toolbar render edilir', () => { render(<PDFViewer totalPages={5}><PDFViewer.Toolbar /></PDFViewer>); expect(screen.getByTestId('pdf-viewer-toolbar')).toBeInTheDocument(); });
  it('compound: PageDisplay render edilir', () => { render(<PDFViewer totalPages={5}><PDFViewer.PageDisplay /></PDFViewer>); expect(screen.getByTestId('pdf-viewer-pageDisplay')).toBeInTheDocument(); });
  it('compound: classNames context ile aktarilir', () => { render(<PDFViewer totalPages={5} classNames={{ toolbar: 'ct' }}><PDFViewer.Toolbar /></PDFViewer>); expect(screen.getByTestId('pdf-viewer-toolbar').className).toContain('ct'); });
  it('compound: styles context ile aktarilir', () => { render(<PDFViewer totalPages={5} styles={{ toolbar: { padding: '20px' } }}><PDFViewer.Toolbar /></PDFViewer>); expect(screen.getByTestId('pdf-viewer-toolbar')).toHaveStyle({ padding: '20px' }); });
  it('PDFViewer.Toolbar context disinda hata firlatir', () => { expect(() => render(<PDFViewer.Toolbar />)).toThrow(); });
});
