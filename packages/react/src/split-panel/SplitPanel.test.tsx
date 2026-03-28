/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { SplitPanel } from './SplitPanel';

// ── ResizeObserver mock ──────────────────────────────

let resizeCallback: ResizeObserverCallback | null = null;

class MockResizeObserver implements ResizeObserver {
  constructor(cb: ResizeObserverCallback) {
    resizeCallback = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {
    resizeCallback = null;
  }
}

beforeEach(() => {
  resizeCallback = null;
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
});

function simulateResize(target: Element, width: number, height: number) {
  Object.defineProperty(target, 'clientWidth', { value: width, configurable: true });
  Object.defineProperty(target, 'clientHeight', { value: height, configurable: true });
  const cb = resizeCallback;
  if (cb) {
    act(() => {
      cb([{ target } as ResizeObserverEntry], {} as ResizeObserver);
    });
  }
}

describe('SplitPanel', () => {
  it('renders children panels', () => {
    render(
      <SplitPanel>
        <div>Left</div>
        <div>Right</div>
      </SplitPanel>,
    );
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('renders panels with data-panel-index', () => {
    const { container } = render(
      <SplitPanel>
        <div>Left</div>
        <div>Right</div>
      </SplitPanel>,
    );
    expect(container.querySelector('[data-panel-index="0"]')).toBeInTheDocument();
    expect(container.querySelector('[data-panel-index="1"]')).toBeInTheDocument();
  });

  it('renders gutter between panels', () => {
    const { container } = render(
      <SplitPanel>
        <div>Left</div>
        <div>Right</div>
      </SplitPanel>,
    );
    const gutter = container.querySelector('[data-gutter-index="0"]');
    expect(gutter).toBeInTheDocument();
    expect(gutter).toHaveAttribute('role', 'separator');
  });

  it('renders n-1 gutters for n panels', () => {
    const { container } = render(
      <SplitPanel>
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </SplitPanel>,
    );
    const gutters = container.querySelectorAll('[role="separator"]');
    expect(gutters).toHaveLength(2);
  });

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <SplitPanel ref={(el) => { refValue = el; }} data-testid="split-panel-root">
        <div>Left</div>
        <div>Right</div>
      </SplitPanel>,
    );
    expect(refValue).toBe(screen.getByTestId('split-panel-root'));
  });

  it('passes through HTML attributes', () => {
    render(
      <SplitPanel data-testid="split-panel-root" id="split" aria-label="Split panel">
        <div>Left</div>
        <div>Right</div>
      </SplitPanel>,
    );
    const el = screen.getByTestId('split-panel-root');
    expect(el).toHaveAttribute('id', 'split');
    expect(el).toHaveAttribute('aria-label', 'Split panel');
  });

  // ── Orientation ─────────────────────────────────────────

  describe('orientation', () => {
    it('defaults to horizontal (flex-direction: row)', () => {
      render(
        <SplitPanel data-testid="split-panel-root">
          <div>Left</div>
          <div>Right</div>
        </SplitPanel>,
      );
      const root = screen.getByTestId('split-panel-root');
      expect(root).toHaveStyle({ flexDirection: 'row' });
      expect(root).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('vertical uses flex-direction: column', () => {
      render(
        <SplitPanel data-testid="split-panel-root" orientation="vertical">
          <div>Top</div>
          <div>Bottom</div>
        </SplitPanel>,
      );
      const root = screen.getByTestId('split-panel-root');
      expect(root).toHaveStyle({ flexDirection: 'column' });
      expect(root).toHaveAttribute('data-orientation', 'vertical');
    });

    it('horizontal gutter has col-resize cursor', () => {
      const { container } = render(
        <SplitPanel>
          <div>Left</div>
          <div>Right</div>
        </SplitPanel>,
      );
      const gutter = container.querySelector('[data-gutter-index="0"]') as HTMLElement;
      expect(gutter).toHaveStyle({ cursor: 'col-resize' });
    });

    it('vertical gutter has row-resize cursor', () => {
      const { container } = render(
        <SplitPanel orientation="vertical">
          <div>Top</div>
          <div>Bottom</div>
        </SplitPanel>,
      );
      const gutter = container.querySelector('[data-gutter-index="0"]') as HTMLElement;
      expect(gutter).toHaveStyle({ cursor: 'row-resize' });
    });

    it('gutter aria-orientation is vertical for horizontal split', () => {
      const { container } = render(
        <SplitPanel orientation="horizontal">
          <div>Left</div>
          <div>Right</div>
        </SplitPanel>,
      );
      const gutter = container.querySelector('[data-gutter-index="0"]');
      expect(gutter).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  // ── Gutter size ─────────────────────────────────────────

  describe('gutter size', () => {
    it('applies custom gutter size', () => {
      const { container } = render(
        <SplitPanel gutterSize={12}>
          <div>Left</div>
          <div>Right</div>
        </SplitPanel>,
      );
      const gutter = container.querySelector('[data-gutter-index="0"]') as HTMLElement;
      expect(gutter).toHaveStyle({ width: '12px' });
    });
  });

  // ── Drag interaction ─────────────────────────────────────

  describe('drag', () => {
    it('sets data-dragging during pointer drag', () => {
      const { container } = render(
        <SplitPanel data-testid="split-panel-root">
          <div>Left</div>
          <div>Right</div>
        </SplitPanel>,
      );
      const root = screen.getByTestId('split-panel-root');
      simulateResize(root, 808, 400);

      const gutter = container.querySelector('[data-gutter-index="0"]') as HTMLElement;
      fireEvent.pointerDown(gutter, { clientX: 400, clientY: 200 });
      expect(root).toHaveAttribute('data-dragging');
    });
  });

  // ── classNames & styles ────────────────────────────────

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(
        <SplitPanel data-testid="split-panel-root" classNames={{ root: 'slot-root' }}>
          <div>Left</div>
          <div>Right</div>
        </SplitPanel>,
      );
      expect(screen.getByTestId('split-panel-root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <SplitPanel data-testid="split-panel-root" styles={{ root: { opacity: '0.5' } }}>
          <div>Left</div>
          <div>Right</div>
        </SplitPanel>,
      );
      expect(screen.getByTestId('split-panel-root')).toHaveStyle({ opacity: '0.5' });
    });

    it('merges className + classNames.root', () => {
      render(
        <SplitPanel data-testid="split-panel-root" className="outer" classNames={{ root: 'inner' }}>
          <div>Left</div>
          <div>Right</div>
        </SplitPanel>,
      );
      const el = screen.getByTestId('split-panel-root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <SplitPanel data-testid="split-panel-root" style={{ margin: 4 }} styles={{ root: { padding: 8 } }}>
          <div>Left</div>
          <div>Right</div>
        </SplitPanel>,
      );
      const el = screen.getByTestId('split-panel-root');
      expect(el).toHaveStyle({ margin: '4px', padding: '8px' });
    });

    it('applies classNames.panel to panel elements', () => {
      const { container } = render(
        <SplitPanel classNames={{ panel: 'custom-panel' }}>
          <div>Left</div>
          <div>Right</div>
        </SplitPanel>,
      );
      const panels = container.querySelectorAll('[data-panel-index]');
      panels.forEach((p) => {
        expect(p).toHaveClass('custom-panel');
      });
    });

    it('applies classNames.gutter to gutter elements', () => {
      const { container } = render(
        <SplitPanel classNames={{ gutter: 'custom-gutter' }}>
          <div>Left</div>
          <div>Right</div>
        </SplitPanel>,
      );
      const gutter = container.querySelector('[data-gutter-index="0"]');
      expect(gutter).toHaveClass('custom-gutter');
    });

    it('applies styles.gutter to gutter elements', () => {
      const { container } = render(
        <SplitPanel styles={{ gutter: { opacity: '0.7' } }}>
          <div>Left</div>
          <div>Right</div>
        </SplitPanel>,
      );
      const gutter = container.querySelector('[data-gutter-index="0"]') as HTMLElement;
      expect(gutter).toHaveStyle({ opacity: '0.7' });
    });
  });

  // ── Compound API ──────────────────────────────────────

  describe('compound API', () => {
    it('renders SplitPanel.Pane with content', () => {
      render(
        <SplitPanel>
          <SplitPanel.Pane>Pane Content</SplitPanel.Pane>
          <SplitPanel.Pane>Other Pane</SplitPanel.Pane>
        </SplitPanel>,
      );
      expect(screen.getByText('Pane Content')).toBeInTheDocument();
      expect(screen.getByText('Other Pane')).toBeInTheDocument();
    });

    it('renders SplitPanel.Pane with data-testid', () => {
      render(
        <SplitPanel>
          <SplitPanel.Pane>Left</SplitPanel.Pane>
          <SplitPanel.Pane>Right</SplitPanel.Pane>
        </SplitPanel>,
      );
      const panes = screen.getAllByTestId('split-panel-panel');
      // 2 wrapper panels (from SplitPanel base) + 2 inner compound Pane elements = 4
      expect(panes.length).toBe(4);
    });

    it('renders SplitPanel.Handle with role separator', () => {
      render(
        <SplitPanel>
          <SplitPanel.Pane>Left</SplitPanel.Pane>
          <SplitPanel.Handle />
          <SplitPanel.Pane>Right</SplitPanel.Pane>
        </SplitPanel>,
      );
      const gutters = screen.getAllByTestId('split-panel-gutter');
      // At least one gutter should have role=separator (compound Handle + base gutters)
      const withSeparator = gutters.filter((g) => g.getAttribute('role') === 'separator');
      expect(withSeparator.length).toBeGreaterThan(0);
    });

    it('SplitPanel.Pane accepts custom className', () => {
      render(
        <SplitPanel>
          <SplitPanel.Pane className="my-pane">Content</SplitPanel.Pane>
          <SplitPanel.Pane>Other</SplitPanel.Pane>
        </SplitPanel>,
      );
      const panes = screen.getAllByTestId('split-panel-panel');
      // panes[0] = wrapper, panes[1] = inner compound Pane with className
      const paneWithClass = panes.find((p) => p.classList.contains('my-pane'));
      expect(paneWithClass).toBeTruthy();
    });

    it('compound root has data-orientation', () => {
      render(
        <SplitPanel data-testid="split-panel-root" orientation="vertical">
          <SplitPanel.Pane>Top</SplitPanel.Pane>
          <SplitPanel.Pane>Bottom</SplitPanel.Pane>
        </SplitPanel>,
      );
      expect(screen.getByTestId('split-panel-root')).toHaveAttribute('data-orientation', 'vertical');
    });

    it('SplitPanel.Pane context disinda hata firlatir', () => {
      expect(() => render(<SplitPanel.Pane>Test</SplitPanel.Pane>)).toThrow();
    });
  });
});
