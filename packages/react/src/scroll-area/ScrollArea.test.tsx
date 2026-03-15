/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ScrollArea } from './ScrollArea';

// ── ResizeObserver mock ─────────────────────────────────

let resizeCallback: ResizeObserverCallback | null = null;

class MockResizeObserver {
  callback: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.callback = cb;
    resizeCallback = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  resizeCallback = null;
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
});

function simulateResize(
  viewport: HTMLElement,
  dims: {
    clientWidth: number;
    clientHeight: number;
    scrollWidth: number;
    scrollHeight: number;
  },
) {
  Object.defineProperty(viewport, 'clientWidth', { value: dims.clientWidth, configurable: true });
  Object.defineProperty(viewport, 'clientHeight', { value: dims.clientHeight, configurable: true });
  Object.defineProperty(viewport, 'scrollWidth', { value: dims.scrollWidth, configurable: true });
  Object.defineProperty(viewport, 'scrollHeight', { value: dims.scrollHeight, configurable: true });

  if (resizeCallback) {
    const cb = resizeCallback;
    act(() => {
      cb([], {} as ResizeObserver);
    });
  }
}

describe('ScrollArea', () => {
  it('renders root and viewport', () => {
    render(
      <ScrollArea data-testid="root" height={200}>
        <div>Content</div>
      </ScrollArea>,
    );
    const root = screen.getByTestId('root');
    expect(root).toBeInTheDocument();
    expect(root.querySelector('[role="region"]')).toBeInTheDocument();
  });

  it('renders children inside viewport', () => {
    render(
      <ScrollArea height={200}>
        <p>Hello World</p>
      </ScrollArea>,
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies height and width via style', () => {
    render(
      <ScrollArea data-testid="root" height={300} width={400}>
        <div>Content</div>
      </ScrollArea>,
    );
    const root = screen.getByTestId('root');
    expect(root).toHaveStyle({ height: '300px', width: '400px' });
  });

  it('applies maxHeight via style', () => {
    render(
      <ScrollArea data-testid="root" maxHeight="50vh">
        <div>Content</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('root')).toHaveStyle({ maxHeight: '50vh' });
  });

  it('sets data-orientation attribute', () => {
    render(
      <ScrollArea data-testid="root" orientation="both">
        <div>Content</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('root')).toHaveAttribute('data-orientation', 'both');
  });

  it('sets data-type attribute', () => {
    render(
      <ScrollArea data-testid="root" type="always">
        <div>Content</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId('root')).toHaveAttribute('data-type', 'always');
  });

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <ScrollArea ref={(el) => { refValue = el; }} data-testid="root">
        <div>Content</div>
      </ScrollArea>,
    );
    expect(refValue).toBe(screen.getByTestId('root'));
  });

  it('passes through HTML attributes', () => {
    render(
      <ScrollArea data-testid="root" id="scroll-1" aria-label="Custom scroll">
        <div>Content</div>
      </ScrollArea>,
    );
    const root = screen.getByTestId('root');
    expect(root).toHaveAttribute('id', 'scroll-1');
  });

  it('viewport has role="region" and aria-label', () => {
    render(
      <ScrollArea height={200}>
        <div>Content</div>
      </ScrollArea>,
    );
    const viewport = screen.getByRole('region');
    expect(viewport).toHaveAttribute('aria-label', 'Scrollable content');
  });

  it('viewport is focusable (tabIndex=0)', () => {
    render(
      <ScrollArea height={200}>
        <div>Content</div>
      </ScrollArea>,
    );
    const viewport = screen.getByRole('region');
    expect(viewport).toHaveAttribute('tabindex', '0');
  });

  describe('orientation', () => {
    it('vertical orientation sets overflowY=scroll, overflowX=hidden', () => {
      render(
        <ScrollArea height={200} orientation="vertical">
          <div>Content</div>
        </ScrollArea>,
      );
      const viewport = screen.getByRole('region');
      expect(viewport).toHaveStyle({ overflowY: 'scroll', overflowX: 'hidden' });
    });

    it('horizontal orientation sets overflowX=scroll, overflowY=hidden', () => {
      render(
        <ScrollArea height={200} orientation="horizontal">
          <div>Content</div>
        </ScrollArea>,
      );
      const viewport = screen.getByRole('region');
      expect(viewport).toHaveStyle({ overflowX: 'scroll', overflowY: 'hidden' });
    });

    it('both orientation sets overflow=scroll', () => {
      render(
        <ScrollArea height={200} orientation="both">
          <div>Content</div>
        </ScrollArea>,
      );
      const viewport = screen.getByRole('region');
      expect(viewport).toHaveStyle({ overflow: 'scroll' });
    });
  });

  describe('scrollbar visibility', () => {
    it('type=always shows scrollbar with vertical content', () => {
      const { container } = render(
        <ScrollArea height={200} type="always" orientation="vertical">
          <div style={{ height: 1000 }}>Tall content</div>
        </ScrollArea>,
      );
      const viewport = container.querySelector('[role="region"]') as HTMLElement;
      simulateResize(viewport as HTMLElement, {
        clientWidth: 300,
        clientHeight: 200,
        scrollWidth: 300,
        scrollHeight: 1000,
      });

      const scrollbar = container.querySelector('[data-orientation="vertical"]');
      expect(scrollbar).toBeInTheDocument();
    });

    it('type=hover shows scrollbar on pointer enter', () => {
      const { container } = render(
        <ScrollArea data-testid="root" height={200} type="hover" orientation="vertical">
          <div style={{ height: 1000 }}>Tall content</div>
        </ScrollArea>,
      );
      const root = screen.getByTestId('root');
      const viewport = container.querySelector('[role="region"]') as HTMLElement;

      simulateResize(viewport as HTMLElement, {
        clientWidth: 300,
        clientHeight: 200,
        scrollWidth: 300,
        scrollHeight: 1000,
      });

      act(() => {
        fireEvent.pointerEnter(root);
      });

      const scrollbar = container.querySelector('[data-orientation="vertical"]');
      expect(scrollbar).toBeInTheDocument();
    });
  });

  describe('scroll event', () => {
    it('handles scroll event on viewport', () => {
      render(
        <ScrollArea height={200} type="always" orientation="vertical">
          <div style={{ height: 1000 }}>Content</div>
        </ScrollArea>,
      );
      const viewport = screen.getByRole('region');

      simulateResize(viewport, {
        clientWidth: 300,
        clientHeight: 200,
        scrollWidth: 300,
        scrollHeight: 1000,
      });

      act(() => {
        fireEvent.scroll(viewport, { target: { scrollTop: 100, scrollLeft: 0 } });
      });
    });
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(
        <ScrollArea data-testid="root" classNames={{ root: 'slot-root' }}>
          <div>Content</div>
        </ScrollArea>,
      );
      expect(screen.getByTestId('root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <ScrollArea data-testid="root" styles={{ root: { opacity: '0.5' } }}>
          <div>Content</div>
        </ScrollArea>,
      );
      expect(screen.getByTestId('root')).toHaveStyle({ opacity: '0.5' });
    });

    it('merges className + classNames.root', () => {
      render(
        <ScrollArea
          data-testid="root"
          className="outer"
          classNames={{ root: 'inner' }}
        >
          <div>Content</div>
        </ScrollArea>,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <ScrollArea
          data-testid="root"
          style={{ margin: 4 }}
          styles={{ root: { padding: 8 } }}
        >
          <div>Content</div>
        </ScrollArea>,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveStyle({ margin: '4px', padding: '8px' });
    });

    it('applies classNames.viewport', () => {
      render(
        <ScrollArea classNames={{ viewport: 'custom-viewport' }}>
          <div>Content</div>
        </ScrollArea>,
      );
      const viewport = screen.getByRole('region');
      expect(viewport).toHaveClass('custom-viewport');
    });

    it('applies styles.viewport', () => {
      render(
        <ScrollArea styles={{ viewport: { padding: 16 } }}>
          <div>Content</div>
        </ScrollArea>,
      );
      const viewport = screen.getByRole('region');
      expect(viewport).toHaveStyle({ padding: '16px' });
    });
  });

  describe('scrollbar size', () => {
    it('defaults to md size', () => {
      const { container } = render(
        <ScrollArea height={200} type="always" orientation="vertical">
          <div style={{ height: 1000 }}>Content</div>
        </ScrollArea>,
      );
      const viewport = container.querySelector('[role="region"]') as HTMLElement;
      simulateResize(viewport as HTMLElement, {
        clientWidth: 300,
        clientHeight: 200,
        scrollWidth: 300,
        scrollHeight: 1000,
      });
      const scrollbar = container.querySelector('[data-orientation="vertical"]');
      expect(scrollbar).toBeInTheDocument();
    });
  });

  describe('corner', () => {
    it('renders corner when both scrollbars visible', () => {
      const { container } = render(
        <ScrollArea height={200} type="always" orientation="both">
          <div style={{ height: 1000, width: 1000 }}>Big content</div>
        </ScrollArea>,
      );
      const viewport = container.querySelector('[role="region"]') as HTMLElement;
      simulateResize(viewport as HTMLElement, {
        clientWidth: 300,
        clientHeight: 200,
        scrollWidth: 1000,
        scrollHeight: 1000,
      });

      const vScrollbar = container.querySelector('[data-orientation="vertical"]');
      const hScrollbar = container.querySelector('[data-orientation="horizontal"]');
      expect(vScrollbar).toBeInTheDocument();
      expect(hScrollbar).toBeInTheDocument();
    });
  });
});

// ── Compound API ──────────────────────────────────────

describe('ScrollArea (Compound)', () => {
  it('compound: Viewport sub-component render edilir', () => {
    render(
      <ScrollArea data-testid="root" height={200}>
        <ScrollArea.Viewport data-testid="compound-viewport">
          <p>Compound icerik</p>
        </ScrollArea.Viewport>
      </ScrollArea>,
    );
    expect(screen.getByText('Compound icerik')).toBeInTheDocument();
  });

  it('compound: Scrollbar sub-component render edilir', () => {
    render(
      <ScrollArea data-testid="root" height={200}>
        <ScrollArea.Scrollbar orientation="vertical" />
      </ScrollArea>,
    );
    expect(screen.getByTestId('scroll-area-scrollbar-vertical')).toBeInTheDocument();
  });

  it('compound: Viewport classNames context ile aktarilir', () => {
    render(
      <ScrollArea data-testid="root" height={200} classNames={{ viewport: 'cmp-vp' }}>
        <ScrollArea.Viewport>
          <p>Test</p>
        </ScrollArea.Viewport>
      </ScrollArea>,
    );
    expect(screen.getByTestId('scroll-area-viewport')).toHaveClass('cmp-vp');
  });

  it('compound: Viewport styles context ile aktarilir', () => {
    render(
      <ScrollArea data-testid="root" height={200} styles={{ viewport: { padding: '20px' } }}>
        <ScrollArea.Viewport>
          <p>Test</p>
        </ScrollArea.Viewport>
      </ScrollArea>,
    );
    expect(screen.getByTestId('scroll-area-viewport')).toHaveStyle({ padding: '20px' });
  });

  it('compound: Scrollbar orientation data attribute set edilir', () => {
    render(
      <ScrollArea data-testid="root" height={200}>
        <ScrollArea.Scrollbar orientation="horizontal" />
      </ScrollArea>,
    );
    expect(screen.getByTestId('scroll-area-scrollbar-horizontal')).toHaveAttribute('data-orientation', 'horizontal');
  });
});
