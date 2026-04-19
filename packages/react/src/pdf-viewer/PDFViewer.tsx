/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PDFViewer — PDF goruntuleme bilesen (Dual API).
 * PDFViewer — PDF viewer component (Dual API).
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@relteco/relui-icons';
import type { PDFZoomMode } from '@relteco/relui-core';
import { rootStyle, toolbarStyle, navButtonStyle, pageInfoStyle, pageDisplayStyle, zoomControlsStyle, zoomButtonStyle } from './pdf-viewer.css';
import { usePDFViewer, type UsePDFViewerProps } from './usePDFViewer';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type PDFViewerSlot = 'root' | 'toolbar' | 'pageDisplay' | 'navigation' | 'zoomControls' | 'pageInfo';

interface PDFViewerContextValue {
  currentPage: number; totalPages: number; zoomMode: PDFZoomMode; zoomPercent: number;
  isFirst: boolean; isLast: boolean;
  nextPage: () => void; prevPage: () => void; setPage: (p: number) => void;
  setZoom: (mode: PDFZoomMode, percent?: number) => void;
  classNames: ClassNames<PDFViewerSlot> | undefined; styles: Styles<PDFViewerSlot> | undefined;
}

const PDFViewerContext = createContext<PDFViewerContextValue | null>(null);
function usePDFViewerContext(): PDFViewerContextValue {
  const ctx = useContext(PDFViewerContext);
  if (!ctx) throw new Error('PDFViewer compound sub-components must be used within <PDFViewer>.');
  return ctx;
}

export interface PDFViewerToolbarProps { className?: string; }
const PDFViewerToolbar = forwardRef<HTMLDivElement, PDFViewerToolbarProps>(
  function PDFViewerToolbar(props, ref) {
    const { className } = props;
    const ctx = usePDFViewerContext();
    const slot = getSlotProps('toolbar', toolbarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const piSlot = getSlotProps('pageInfo', pageInfoStyle, ctx.classNames, ctx.styles);
    const zmSlot = getSlotProps('zoomControls', zoomControlsStyle, ctx.classNames, ctx.styles);
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="pdf-viewer-toolbar">
        <button type="button" className={navButtonStyle} onClick={ctx.prevPage} disabled={ctx.isFirst} aria-label="Previous page" data-testid="pdf-viewer-prevButton"><ChevronLeftIcon size={14} /></button>
        <span className={piSlot.className} style={piSlot.style} data-testid="pdf-viewer-pageInfo">{ctx.currentPage} / {ctx.totalPages}</span>
        <button type="button" className={navButtonStyle} onClick={ctx.nextPage} disabled={ctx.isLast} aria-label="Next page" data-testid="pdf-viewer-nextButton"><ChevronRightIcon size={14} /></button>
        <div className={zmSlot.className} style={zmSlot.style} data-testid="pdf-viewer-zoomControls">
          <button type="button" className={zoomButtonStyle} onClick={() => ctx.setZoom('fit')} data-testid="pdf-viewer-zoomFit">Fit</button>
          <button type="button" className={zoomButtonStyle} onClick={() => ctx.setZoom('width')} data-testid="pdf-viewer-zoomWidth">Width</button>
          <button type="button" className={zoomButtonStyle} onClick={() => ctx.setZoom('percent', Math.min(ctx.zoomPercent + 25, 500))} data-testid="pdf-viewer-zoomIn">+</button>
          <button type="button" className={zoomButtonStyle} onClick={() => ctx.setZoom('percent', Math.max(ctx.zoomPercent - 25, 25))} data-testid="pdf-viewer-zoomOut">-</button>
          <span style={{ fontSize: 'var(--rel-text-xs, 11px)', color: 'var(--rel-color-text-secondary, #9ca3af)' }}>{ctx.zoomPercent}%</span>
        </div>
      </div>
    );
  },
);

export interface PDFViewerPageDisplayProps { className?: string; children?: ReactNode; }
const PDFViewerPageDisplay = forwardRef<HTMLDivElement, PDFViewerPageDisplayProps>(
  function PDFViewerPageDisplay(props, ref) {
    const { className, children } = props;
    const ctx = usePDFViewerContext();
    const slot = getSlotProps('pageDisplay', pageDisplayStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="pdf-viewer-pageDisplay">
        {children ?? <span style={{ color: 'var(--rel-color-text-secondary, #9ca3af)' }}>Sayfa {ctx.currentPage}</span>}
      </div>
    );
  },
);

export interface PDFViewerComponentProps extends SlotStyleProps<PDFViewerSlot>, UsePDFViewerProps {
  src?: string;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const PDFViewerBase = forwardRef<HTMLDivElement, PDFViewerComponentProps>(
  function PDFViewer(props, ref) {
    const { totalPages, defaultPage, defaultZoom, defaultZoomPercent, onPageChange, src, children, className, style: styleProp, classNames, styles } = props;
    const viewer = usePDFViewer({ totalPages, defaultPage, defaultZoom, defaultZoomPercent, onPageChange });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: PDFViewerContextValue = {
      ...viewer, classNames, styles,
    };

    if (children) {
      return (
        <PDFViewerContext.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="pdf-viewer-root">{children}</div>
        </PDFViewerContext.Provider>
      );
    }

    const pdSlot = getSlotProps('pageDisplay', pageDisplayStyle, classNames, styles);

    return (
      <PDFViewerContext.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="pdf-viewer-root">
          <PDFViewerToolbar />
          <div className={pdSlot.className} style={pdSlot.style} data-testid="pdf-viewer-pageDisplay">
            {src ? (
              <iframe src={`${src}#page=${viewer.currentPage}`} title="PDF" style={{ width: '100%', height: '100%', border: 'none', transform: `scale(${viewer.zoomPercent / 100})`, transformOrigin: 'top center' }} />
            ) : (
              <span style={{ color: 'var(--rel-color-text-secondary, #9ca3af)' }}>Sayfa {viewer.currentPage}</span>
            )}
          </div>
        </div>
      </PDFViewerContext.Provider>
    );
  },
);

export const PDFViewer = Object.assign(PDFViewerBase, {
  Toolbar: PDFViewerToolbar, PageDisplay: PDFViewerPageDisplay,
});
