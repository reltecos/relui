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
import { BookLayout } from './BookLayout';

const defaultRender = (i: number) => <div>Page {i + 1}</div>;

describe('BookLayout', () => {
  it('renders with data-book-layout', () => {
    render(
      <BookLayout
        data-testid="root"
        totalPages={3}
        renderPage={defaultRender}
      />,
    );
    expect(screen.getByTestId('root')).toHaveAttribute('data-book-layout');
  });

  it('renders first page by default', () => {
    render(
      <BookLayout totalPages={3} renderPage={defaultRender} />,
    );
    expect(screen.getByText('Page 1')).toBeInTheDocument();
  });

  it('renders specific start page', () => {
    render(
      <BookLayout totalPages={5} currentPage={2} renderPage={defaultRender} />,
    );
    expect(screen.getByText('Page 3')).toBeInTheDocument();
  });

  it('does not render page content when totalPages=0', () => {
    const renderPage = vi.fn(defaultRender);
    render(
      <BookLayout totalPages={0} renderPage={renderPage} />,
    );
    expect(renderPage).not.toHaveBeenCalled();
  });

  it('sets data-current-page and data-total-pages', () => {
    render(
      <BookLayout
        data-testid="root"
        totalPages={5}
        currentPage={2}
        renderPage={defaultRender}
      />,
    );
    const root = screen.getByTestId('root');
    expect(root).toHaveAttribute('data-current-page', '2');
    expect(root).toHaveAttribute('data-total-pages', '5');
  });

  // ── Navigation ──────────────────────────────────────

  describe('navigation', () => {
    it('next button navigates forward', () => {
      const { container } = render(
        <BookLayout totalPages={5} renderPage={defaultRender} />,
      );
      const nextBtn = container.querySelector('[data-book-next]') as HTMLElement;
      fireEvent.click(nextBtn);
      expect(screen.getByText('Page 2')).toBeInTheDocument();
    });

    it('prev button navigates backward', () => {
      const { container } = render(
        <BookLayout totalPages={5} currentPage={3} renderPage={defaultRender} />,
      );
      const prevBtn = container.querySelector('[data-book-prev]') as HTMLElement;
      fireEvent.click(prevBtn);
      expect(screen.getByText('Page 3')).toBeInTheDocument();
    });

    it('prev button is disabled at first page', () => {
      const { container } = render(
        <BookLayout totalPages={5} currentPage={0} renderPage={defaultRender} />,
      );
      const prevBtn = container.querySelector('[data-book-prev]') as HTMLElement;
      expect(prevBtn).toBeDisabled();
    });

    it('next button is disabled at last page', () => {
      const { container } = render(
        <BookLayout totalPages={5} currentPage={4} renderPage={defaultRender} />,
      );
      const nextBtn = container.querySelector('[data-book-next]') as HTMLElement;
      expect(nextBtn).toBeDisabled();
    });

    it('loop enables wrapping', () => {
      const { container } = render(
        <BookLayout totalPages={3} currentPage={2} loop renderPage={defaultRender} />,
      );
      const nextBtn = container.querySelector('[data-book-next]') as HTMLElement;
      expect(nextBtn).not.toBeDisabled();
      fireEvent.click(nextBtn);
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });

    it('calls onPageChange on navigation', () => {
      const onPageChange = vi.fn();
      const { container } = render(
        <BookLayout
          totalPages={5}
          currentPage={0}
          onPageChange={onPageChange}
          renderPage={defaultRender}
        />,
      );
      const nextBtn = container.querySelector('[data-book-next]') as HTMLElement;
      fireEvent.click(nextBtn);
      expect(onPageChange).toHaveBeenCalledWith(1);
    });
  });

  // ── Controls ────────────────────────────────────────

  describe('controls', () => {
    it('renders page indicator', () => {
      const { container } = render(
        <BookLayout totalPages={10} currentPage={4} renderPage={defaultRender} />,
      );
      const indicator = container.querySelector('[data-book-indicator]');
      expect(indicator).toHaveTextContent('5 / 10');
    });

    it('hides controls when showControls=false', () => {
      const { container } = render(
        <BookLayout
          totalPages={5}
          showControls={false}
          renderPage={defaultRender}
        />,
      );
      expect(container.querySelector('[data-book-controls]')).not.toBeInTheDocument();
    });

    it('hides page indicator when showPageIndicator=false', () => {
      const { container } = render(
        <BookLayout
          totalPages={5}
          showPageIndicator={false}
          renderPage={defaultRender}
        />,
      );
      expect(container.querySelector('[data-book-indicator]')).not.toBeInTheDocument();
    });

    it('does not render controls when totalPages=0', () => {
      const { container } = render(
        <BookLayout totalPages={0} renderPage={defaultRender} />,
      );
      expect(container.querySelector('[data-book-controls]')).not.toBeInTheDocument();
    });

    it('renders custom prev/next labels', () => {
      const { container } = render(
        <BookLayout
          totalPages={5}
          prevLabel="Back"
          nextLabel="Forward"
          renderPage={defaultRender}
        />,
      );
      const prevBtn = container.querySelector('[data-book-prev]') as HTMLElement;
      const nextBtn = container.querySelector('[data-book-next]') as HTMLElement;
      expect(prevBtn).toHaveTextContent('Back');
      expect(nextBtn).toHaveTextContent('Forward');
    });

    it('prev/next buttons have aria-labels', () => {
      const { container } = render(
        <BookLayout totalPages={5} renderPage={defaultRender} />,
      );
      expect(container.querySelector('[data-book-prev]')).toHaveAttribute('aria-label', 'Previous page');
      expect(container.querySelector('[data-book-next]')).toHaveAttribute('aria-label', 'Next page');
    });
  });

  // ── Ref & HTML attributes ───────────────────────────

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <BookLayout
        ref={(el) => { refValue = el; }}
        data-testid="root"
        totalPages={3}
        renderPage={defaultRender}
      />,
    );
    expect(refValue).toBe(screen.getByTestId('root'));
  });

  it('passes through HTML attributes', () => {
    render(
      <BookLayout
        data-testid="root"
        id="my-book"
        aria-label="Book"
        totalPages={3}
        renderPage={defaultRender}
      />,
    );
    const el = screen.getByTestId('root');
    expect(el).toHaveAttribute('id', 'my-book');
    expect(el).toHaveAttribute('aria-label', 'Book');
  });

  // ── classNames & styles ─────────────────────────────

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(
        <BookLayout
          data-testid="root"
          classNames={{ root: 'slot-root' }}
          totalPages={3}
          renderPage={defaultRender}
        />,
      );
      expect(screen.getByTestId('root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <BookLayout
          data-testid="root"
          styles={{ root: { opacity: '0.9' } }}
          totalPages={3}
          renderPage={defaultRender}
        />,
      );
      expect(screen.getByTestId('root')).toHaveStyle({ opacity: '0.9' });
    });

    it('merges className + classNames.root', () => {
      render(
        <BookLayout
          data-testid="root"
          className="outer"
          classNames={{ root: 'inner' }}
          totalPages={3}
          renderPage={defaultRender}
        />,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <BookLayout
          data-testid="root"
          style={{ margin: 4 }}
          styles={{ root: { padding: 8 } }}
          totalPages={3}
          renderPage={defaultRender}
        />,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveStyle({ margin: '4px', padding: '8px' });
    });

    it('applies classNames.page', () => {
      const { container } = render(
        <BookLayout
          classNames={{ page: 'custom-page' }}
          totalPages={3}
          renderPage={defaultRender}
        />,
      );
      const page = container.querySelector('[data-book-page]');
      expect(page).toHaveClass('custom-page');
    });

    it('applies classNames.controls', () => {
      const { container } = render(
        <BookLayout
          classNames={{ controls: 'custom-controls' }}
          totalPages={3}
          renderPage={defaultRender}
        />,
      );
      const controls = container.querySelector('[data-book-controls]');
      expect(controls).toHaveClass('custom-controls');
    });

    it('applies styles.pageIndicator', () => {
      const { container } = render(
        <BookLayout
          styles={{ pageIndicator: { fontSize: 18 } }}
          totalPages={3}
          renderPage={defaultRender}
        />,
      );
      const indicator = container.querySelector('[data-book-indicator]') as HTMLElement;
      expect(indicator).toHaveStyle({ fontSize: '18px' });
    });
  });
});
