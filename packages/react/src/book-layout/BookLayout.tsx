/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BookLayout — sayfa cevirme navigasyonlu konteyner (Dual API).
 *
 * Props-based: `<BookLayout totalPages={5} renderPage={(i) => ...} />`
 * Compound:    `<BookLayout><BookLayout.Page>...</BookLayout.Page><BookLayout.Navigation /></BookLayout>`
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  useRef,
  useReducer,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createBookLayout } from '@relteco/relui-core';
import type { BookLayoutAPI } from '@relteco/relui-core';
import {
  rootStyle,
  pageStyle,
  controlsStyle,
  navButtonStyle,
  navButtonDisabledStyle,
  pageIndicatorStyle,
} from './book-layout.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** BookLayout slot isimleri. */
export type BookLayoutSlot = 'root' | 'page' | 'controls' | 'prevButton' | 'nextButton' | 'pageIndicator';

// ── Context (Compound API) ──────────────────────────

interface BookLayoutContextValue {
  api: BookLayoutAPI;
  forceRender: () => void;
  onPageChange?: (page: number) => void;
  classNames: ClassNames<BookLayoutSlot> | undefined;
  styles: Styles<BookLayoutSlot> | undefined;
  prevLabel: ReactNode;
  nextLabel: ReactNode;
  showPageIndicator: boolean;
}

const BookLayoutContext = createContext<BookLayoutContextValue | null>(null);

function useBookLayoutContext(): BookLayoutContextValue {
  const ctx = useContext(BookLayoutContext);
  if (!ctx) throw new Error('BookLayout compound sub-components must be used within <BookLayout>.');
  return ctx;
}

// ── Compound: BookLayout.Page ───────────────────────

/** BookLayout.Page props */
export interface BookLayoutPageProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const BookLayoutPage = forwardRef<HTMLDivElement, BookLayoutPageProps>(
  function BookLayoutPage(props, ref) {
    const { children, className } = props;
    const ctx = useBookLayoutContext();
    const slot = getSlotProps('page', pageStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="book-layout-page"
        data-book-page
      >
        {children}
      </div>
    );
  },
);

// ── Compound: BookLayout.Navigation ─────────────────

/** BookLayout.Navigation props */
export interface BookLayoutNavigationProps {
  /** Onceki buton metni / Previous button label */
  prevLabel?: ReactNode;
  /** Sonraki buton metni / Next button label */
  nextLabel?: ReactNode;
  /** Sayfa gostergesini goster / Show page indicator */
  showPageIndicator?: boolean;
  /** Ek className / Additional className */
  className?: string;
}

const BookLayoutNavigation = forwardRef<HTMLDivElement, BookLayoutNavigationProps>(
  function BookLayoutNavigation(props, ref) {
    const ctx = useBookLayoutContext();
    const {
      prevLabel = ctx.prevLabel,
      nextLabel = ctx.nextLabel,
      showPageIndicator = ctx.showPageIndicator,
      className,
    } = props;

    const api = ctx.api;
    const page = api.getCurrentPage();
    const total = api.getTotalPages();
    const canPrev = api.canGoPrev();
    const canNext = api.canGoNext();

    const handlePrev = () => {
      api.send({ type: 'PREV_PAGE' });
      ctx.forceRender();
      ctx.onPageChange?.(api.getCurrentPage());
    };

    const handleNext = () => {
      api.send({ type: 'NEXT_PAGE' });
      ctx.forceRender();
      ctx.onPageChange?.(api.getCurrentPage());
    };

    const slot = getSlotProps('controls', controlsStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const prevBtnSlot = getSlotProps('prevButton', canPrev ? navButtonStyle : navButtonDisabledStyle, ctx.classNames, ctx.styles);
    const nextBtnSlot = getSlotProps('nextButton', canNext ? navButtonStyle : navButtonDisabledStyle, ctx.classNames, ctx.styles);
    const indicatorSlot = getSlotProps('pageIndicator', pageIndicatorStyle, ctx.classNames, ctx.styles);

    if (total <= 0) return null;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="book-layout-controls"
        data-book-controls
      >
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canPrev}
          aria-label="Previous page"
          className={prevBtnSlot.className || undefined}
          style={prevBtnSlot.style}
          data-book-prev
        >
          {prevLabel}
        </button>

        {showPageIndicator && (
          <span
            className={indicatorSlot.className || undefined}
            style={indicatorSlot.style}
            data-book-indicator
          >
            {page + 1} / {total}
          </span>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={!canNext}
          aria-label="Next page"
          className={nextBtnSlot.className || undefined}
          style={nextBtnSlot.style}
          data-book-next
        >
          {nextLabel}
        </button>
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

/** BookLayout bilesen prop'lari. */
export interface BookLayoutComponentProps
  extends SlotStyleProps<BookLayoutSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Toplam sayfa sayisi. Varsayilan: 0. */
  totalPages?: number;
  /** Baslangic sayfasi (0-based). Varsayilan: 0. */
  currentPage?: number;
  /** Dongusal navigasyon. Varsayilan: false. */
  loop?: boolean;
  /** Sayfa render fonksiyonu. pageIndex 0-based. */
  renderPage?: (pageIndex: number) => ReactNode;
  /** Navigasyon kontrollerini goster. Varsayilan: true. */
  showControls?: boolean;
  /** Sayfa gostergesini goster. Varsayilan: true. */
  showPageIndicator?: boolean;
  /** Onceki buton metni. Varsayilan: '\u2039'. */
  prevLabel?: ReactNode;
  /** Sonraki buton metni. Varsayilan: '\u203A'. */
  nextLabel?: ReactNode;
  /** Sayfa degistiginde cagrilir. */
  onPageChange?: (page: number) => void;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

// ── Component ─────────────────────────────────────────

const BookLayoutBase = forwardRef<HTMLDivElement, BookLayoutComponentProps>(
  function BookLayout(props, ref) {
    const {
      children,
      className,
      style,
      classNames,
      styles: slotStyles,
      totalPages = 0,
      currentPage = 0,
      loop = false,
      renderPage,
      showControls = true,
      showPageIndicator = true,
      prevLabel = '\u2039',
      nextLabel = '\u203A',
      onPageChange,
      ...rest
    } = props;

    const apiRef = useRef<BookLayoutAPI | null>(null);
    if (apiRef.current === null) {
      apiRef.current = createBookLayout({ totalPages, currentPage, loop });
    }
    const api = apiRef.current;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── State ─────────────────────────────────────────
    const page = api.getCurrentPage();
    const total = api.getTotalPages();
    const canPrev = api.canGoPrev();
    const canNext = api.canGoNext();

    // ── Slot props ────────────────────────────────────
    const rootSlot = getSlotProps('root', rootStyle, classNames, slotStyles);
    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    const ctxValue: BookLayoutContextValue = {
      api,
      forceRender,
      onPageChange,
      classNames,
      styles: slotStyles,
      prevLabel,
      nextLabel,
      showPageIndicator,
    };

    // ── Compound API ──
    if (children) {
      return (
        <BookLayoutContext.Provider value={ctxValue}>
          <div
            ref={ref}
            {...rest}
            className={finalClass}
            style={{ ...rootSlot.style, ...style }}
            data-book-layout
            data-current-page={page}
            data-total-pages={total}
            data-testid="book-layout-root"
          >
            {children}
          </div>
        </BookLayoutContext.Provider>
      );
    }

    // ── Props-based API ──
    // Navigation handlers
    const handlePrev = () => {
      api.send({ type: 'PREV_PAGE' });
      forceRender();
      onPageChange?.(api.getCurrentPage());
    };

    const handleNext = () => {
      api.send({ type: 'NEXT_PAGE' });
      forceRender();
      onPageChange?.(api.getCurrentPage());
    };

    const pageSlot = getSlotProps('page', pageStyle, classNames, slotStyles);
    const controlsSlotResult = getSlotProps('controls', controlsStyle, classNames, slotStyles);
    const prevBtnSlot = getSlotProps('prevButton', canPrev ? navButtonStyle : navButtonDisabledStyle, classNames, slotStyles);
    const nextBtnSlot = getSlotProps('nextButton', canNext ? navButtonStyle : navButtonDisabledStyle, classNames, slotStyles);
    const indicatorSlot = getSlotProps('pageIndicator', pageIndicatorStyle, classNames, slotStyles);

    return (
      <div
        ref={ref}
        {...rest}
        className={finalClass}
        style={{ ...rootSlot.style, ...style }}
        data-book-layout
        data-current-page={page}
        data-total-pages={total}
      >
        <div
          className={pageSlot.className || undefined}
          style={pageSlot.style}
          data-book-page
        >
          {total > 0 && renderPage ? renderPage(page) : null}
        </div>

        {showControls && total > 0 && (
          <div
            className={controlsSlotResult.className || undefined}
            style={controlsSlotResult.style}
            data-book-controls
          >
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canPrev}
              aria-label="Previous page"
              className={prevBtnSlot.className || undefined}
              style={prevBtnSlot.style}
              data-book-prev
            >
              {prevLabel}
            </button>

            {showPageIndicator && (
              <span
                className={indicatorSlot.className || undefined}
                style={indicatorSlot.style}
                data-book-indicator
              >
                {page + 1} / {total}
              </span>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!canNext}
              aria-label="Next page"
              className={nextBtnSlot.className || undefined}
              style={nextBtnSlot.style}
              data-book-next
            >
              {nextLabel}
            </button>
          </div>
        )}
      </div>
    );
  },
);

/**
 * BookLayout bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <BookLayout totalPages={5} renderPage={(i) => <div>Page {i + 1}</div>} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <BookLayout totalPages={5}>
 *   <BookLayout.Page>{renderPage(currentPage)}</BookLayout.Page>
 *   <BookLayout.Navigation />
 * </BookLayout>
 * ```
 */
export const BookLayout = Object.assign(BookLayoutBase, {
  Page: BookLayoutPage,
  Navigation: BookLayoutNavigation,
});
