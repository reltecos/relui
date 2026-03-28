/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Sticky } from './Sticky';

// ── IntersectionObserver mock ──────────────────────────

class MockIntersectionObserver {
  constructor(_cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

describe('Sticky', () => {
  it('renders children', () => {
    render(
      <Sticky>
        <nav>Navigation</nav>
      </Sticky>,
    );
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('applies position: sticky style', () => {
    render(
      <Sticky data-testid="sticky-root">
        <span>Content</span>
      </Sticky>,
    );
    const el = screen.getByTestId('sticky-root');
    expect(el).toHaveStyle({ position: 'sticky' });
  });

  it('applies top offset for position=top', () => {
    render(
      <Sticky data-testid="sticky-root" offset={20}>
        <span>Content</span>
      </Sticky>,
    );
    expect(screen.getByTestId('sticky-root')).toHaveStyle({ top: '20px' });
  });

  it('applies bottom offset for position=bottom', () => {
    render(
      <Sticky data-testid="sticky-root" position="bottom" offset={30}>
        <span>Content</span>
      </Sticky>,
    );
    expect(screen.getByTestId('sticky-root')).toHaveStyle({ bottom: '30px' });
  });

  it('applies z-index', () => {
    render(
      <Sticky data-testid="sticky-root" zIndex={200}>
        <span>Content</span>
      </Sticky>,
    );
    expect(screen.getByTestId('sticky-root')).toHaveStyle({ zIndex: 200 });
  });

  it('defaults z-index to 100', () => {
    render(
      <Sticky data-testid="sticky-root">
        <span>Content</span>
      </Sticky>,
    );
    expect(screen.getByTestId('sticky-root')).toHaveStyle({ zIndex: 100 });
  });

  it('sets data-position attribute', () => {
    render(
      <Sticky data-testid="sticky-root" position="bottom">
        <span>Content</span>
      </Sticky>,
    );
    expect(screen.getByTestId('sticky-root')).toHaveAttribute('data-position', 'bottom');
  });

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <Sticky ref={(el) => { refValue = el; }} data-testid="sticky-root">
        <span>Content</span>
      </Sticky>,
    );
    expect(refValue).toBe(screen.getByTestId('sticky-root'));
  });

  it('passes through HTML attributes', () => {
    render(
      <Sticky data-testid="sticky-root" id="nav-sticky" aria-label="Sticky nav">
        <span>Content</span>
      </Sticky>,
    );
    const el = screen.getByTestId('sticky-root');
    expect(el).toHaveAttribute('id', 'nav-sticky');
  });

  it('renders sentinel element', () => {
    const { container } = render(
      <Sticky>
        <span>Content</span>
      </Sticky>,
    );
    const sentinel = container.querySelector('[aria-hidden="true"]');
    expect(sentinel).toBeInTheDocument();
    expect(sentinel).toHaveStyle({ height: '0px', visibility: 'hidden' });
  });

  it('sentinel is before sticky for position=top', () => {
    const { container } = render(
      <Sticky data-testid="sticky-root" position="top">
        <span>Content</span>
      </Sticky>,
    );
    const allDivs = container.querySelectorAll('div');
    const sentinelEl = Array.from(allDivs).find(el => el.getAttribute('aria-hidden') === 'true');
    const stickyEl = screen.getByTestId('sticky-root');
    // Sentinel should appear before sticky in DOM
    expect(sentinelEl).toBeInTheDocument();
    if (sentinelEl) {
      const position = stickyEl.compareDocumentPosition(sentinelEl);
      expect(position & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
    }
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(
        <Sticky data-testid="sticky-root" classNames={{ root: 'slot-root' }}>
          <span>Content</span>
        </Sticky>,
      );
      expect(screen.getByTestId('sticky-root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <Sticky data-testid="sticky-root" styles={{ root: { opacity: '0.5' } }}>
          <span>Content</span>
        </Sticky>,
      );
      expect(screen.getByTestId('sticky-root')).toHaveStyle({ opacity: '0.5' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Sticky data-testid="sticky-root" className="outer" classNames={{ root: 'inner' }}>
          <span>Content</span>
        </Sticky>,
      );
      const el = screen.getByTestId('sticky-root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <Sticky data-testid="sticky-root" style={{ margin: 4 }} styles={{ root: { padding: 8 } }}>
          <span>Content</span>
        </Sticky>,
      );
      const el = screen.getByTestId('sticky-root');
      expect(el).toHaveStyle({ margin: '4px', padding: '8px' });
    });

    it('styles.sentinel sentinel elemana eklenir', () => {
      render(
        <Sticky styles={{ sentinel: { opacity: '0.5' } }}>
          <span>Content</span>
        </Sticky>,
      );
      expect(screen.getByTestId('sticky-sentinel')).toHaveStyle({ opacity: '0.5' });
    });

    it('styles.content content elemana eklenir', () => {
      render(
        <Sticky styles={{ content: { padding: '20px' } }}>
          <Sticky.Content>Navigation</Sticky.Content>
        </Sticky>,
      );
      expect(screen.getByTestId('sticky-content')).toHaveStyle({ padding: '20px' });
    });
  });
});

// ── Compound API ──

describe('Sticky (Compound)', () => {
  it('compound: Sticky.Content render edilir', () => {
    render(
      <Sticky data-testid="sticky-root">
        <Sticky.Content>Navigation</Sticky.Content>
      </Sticky>,
    );
    expect(screen.getByTestId('sticky-content')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('compound: Sticky.Content ref forward edilir', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <Sticky>
        <Sticky.Content ref={(el) => { refValue = el; }}>Nav</Sticky.Content>
      </Sticky>,
    );
    expect(refValue).toBe(screen.getByTestId('sticky-content'));
  });

  it('compound: position sticky uygulanir', () => {
    render(
      <Sticky data-testid="sticky-root" offset={10}>
        <Sticky.Content>Nav</Sticky.Content>
      </Sticky>,
    );
    expect(screen.getByTestId('sticky-root')).toHaveStyle({ position: 'sticky', top: '10px' });
  });
});
