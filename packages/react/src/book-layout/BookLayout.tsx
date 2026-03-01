/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BookLayout — sayfa çevirme navigasyonlu konteyner.
 *
 * İleri/geri, direkt sayfa atlama ve döngüsel navigasyon.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  useRef,
  useReducer,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createBookLayout } from '@relteco/relui-core';
import type { BookLayoutAPI } from '@relteco/relui-core';
import { getSlotProps, type SlotStyleProps } from '../utils';

/** BookLayout slot isimleri. */
export type BookLayoutSlot = 'root' | 'page' | 'controls' | 'prevButton' | 'nextButton' | 'pageIndicator';

/** BookLayout bileşen prop'ları. */
export interface BookLayoutComponentProps
  extends SlotStyleProps<BookLayoutSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Toplam sayfa sayısı. Varsayılan: 0. */
  totalPages?: number;
  /** Başlangıç sayfası (0-based). Varsayılan: 0. */
  currentPage?: number;
  /** Döngüsel navigasyon. Varsayılan: false. */
  loop?: boolean;
  /** Sayfa render fonksiyonu. pageIndex 0-based. */
  renderPage: (pageIndex: number) => ReactNode;
  /** Navigasyon kontrollerini göster. Varsayılan: true. */
  showControls?: boolean;
  /** Sayfa göstergesini göster. Varsayılan: true. */
  showPageIndicator?: boolean;
  /** Önceki buton metni. Varsayılan: '‹'. */
  prevLabel?: ReactNode;
  /** Sonraki buton metni. Varsayılan: '›'. */
  nextLabel?: ReactNode;
  /** Sayfa değiştiğinde çağrılır. */
  onPageChange?: (page: number) => void;
}

/**
 * BookLayout — sayfa çevirme navigasyonlu konteyner.
 *
 * @example
 * ```tsx
 * <BookLayout
 *   totalPages={5}
 *   renderPage={(i) => <div>Page {i + 1}</div>}
 * />
 * ```
 */
export const BookLayout = forwardRef<HTMLDivElement, BookLayoutComponentProps>(
  function BookLayout(props, ref) {
    const {
      children: _children,
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

    // ── Navigation handlers ───────────────────────────
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

    // ── State ─────────────────────────────────────────
    const page = api.getCurrentPage();
    const total = api.getTotalPages();
    const canPrev = api.canGoPrev();
    const canNext = api.canGoNext();

    // ── Slot props ────────────────────────────────────
    const rootSlot = getSlotProps(
      'root',
      undefined,
      classNames,
      slotStyles,
      {
        display: 'flex',
        flexDirection: 'column' as const,
        ...style,
      },
    );

    const pageSlot = getSlotProps('page', undefined, classNames, slotStyles, {
      flex: 1,
      overflow: 'hidden',
    });

    const controlsSlot = getSlotProps('controls', undefined, classNames, slotStyles, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '8px 0',
    });

    const prevBtnSlot = getSlotProps('prevButton', undefined, classNames, slotStyles);
    const nextBtnSlot = getSlotProps('nextButton', undefined, classNames, slotStyles);

    const indicatorSlot = getSlotProps('pageIndicator', undefined, classNames, slotStyles, {
      fontSize: 13,
      color: 'var(--rel-color-text-muted, #64748b)',
    });

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    // ── Button style ──────────────────────────────────
    const navBtnBase: CSSProperties = {
      border: '1px solid var(--rel-color-border, #e2e8f0)',
      borderRadius: 4,
      background: 'var(--rel-color-bg, #fff)',
      cursor: 'pointer',
      padding: '4px 12px',
      fontSize: 18,
      lineHeight: 1,
      color: 'var(--rel-color-text, #1e293b)',
    };

    const disabledBtnStyle: CSSProperties = {
      ...navBtnBase,
      opacity: 0.4,
      cursor: 'not-allowed',
    };

    return (
      <div
        ref={ref}
        {...rest}
        className={finalClass}
        style={rootSlot.style}
        data-book-layout
        data-current-page={page}
        data-total-pages={total}
      >
        <div
          className={pageSlot.className || undefined}
          style={pageSlot.style}
          data-book-page
        >
          {total > 0 ? renderPage(page) : null}
        </div>

        {showControls && total > 0 && (
          <div
            className={controlsSlot.className || undefined}
            style={controlsSlot.style}
            data-book-controls
          >
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canPrev}
              aria-label="Previous page"
              className={prevBtnSlot.className || undefined}
              style={{ ...(canPrev ? navBtnBase : disabledBtnStyle), ...prevBtnSlot.style }}
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
              style={{ ...(canNext ? navBtnBase : disabledBtnStyle), ...nextBtnSlot.style }}
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
