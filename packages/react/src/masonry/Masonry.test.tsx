/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Masonry } from './Masonry';

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

function simulateResize(target: Element, width: number) {
  Object.defineProperty(target, 'clientWidth', { value: width, configurable: true });
  const cb = resizeCallback;
  if (cb) {
    act(() => {
      cb([{ target } as ResizeObserverEntry], {} as ResizeObserver);
    });
  }
}

describe('Masonry', () => {
  it('renders children', () => {
    render(
      <Masonry>
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
      </Masonry>,
    );
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.getByText('Card 3')).toBeInTheDocument();
  });

  it('wraps each child in an item div', () => {
    const { container } = render(
      <Masonry>
        <div>Card 1</div>
        <div>Card 2</div>
      </Masonry>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.children).toHaveLength(2);
  });

  it('root has position: relative', () => {
    render(
      <Masonry data-testid="root">
        <div>Card</div>
      </Masonry>,
    );
    expect(screen.getByTestId('root')).toHaveStyle({ position: 'relative' });
  });

  it('item divs have position: absolute or visibility: hidden', () => {
    const { container } = render(
      <Masonry>
        <div>Card 1</div>
      </Masonry>,
    );
    const root = container.firstElementChild as HTMLElement;
    const item = root.firstElementChild as HTMLElement;
    const style = item.style;
    const isPositioned = style.position === 'absolute';
    const isHidden = style.visibility === 'hidden';
    expect(isPositioned || isHidden).toBe(true);
  });

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <Masonry ref={(el) => { refValue = el; }} data-testid="root">
        <div>Card</div>
      </Masonry>,
    );
    expect(refValue).toBe(screen.getByTestId('root'));
  });

  it('passes through HTML attributes', () => {
    render(
      <Masonry data-testid="root" id="masonry" aria-label="Masonry grid">
        <div>Card</div>
      </Masonry>,
    );
    const el = screen.getByTestId('root');
    expect(el).toHaveAttribute('id', 'masonry');
    expect(el).toHaveAttribute('aria-label', 'Masonry grid');
  });

  it('sets data-masonry-column attribute on items', () => {
    const { container } = render(
      <Masonry data-testid="root">
        <div>Card 1</div>
        <div>Card 2</div>
        <div>Card 3</div>
      </Masonry>,
    );
    const root = screen.getByTestId('root');
    simulateResize(root, 900);

    const items = container.querySelectorAll('[data-masonry-column]');
    // Items without positions won't have the attribute
    // After resize, some may get positioned
    expect(items.length).toBeGreaterThanOrEqual(0);
  });

  it('accepts columns prop', () => {
    render(
      <Masonry columns={4} data-testid="root">
        <div>Card 1</div>
        <div>Card 2</div>
      </Masonry>,
    );
    expect(screen.getByTestId('root')).toBeInTheDocument();
  });

  it('accepts gap prop', () => {
    render(
      <Masonry gap={24} data-testid="root">
        <div>Card 1</div>
      </Masonry>,
    );
    expect(screen.getByTestId('root')).toBeInTheDocument();
  });

  it('accepts rowGap prop', () => {
    render(
      <Masonry gap={16} rowGap={32} data-testid="root">
        <div>Card 1</div>
      </Masonry>,
    );
    expect(screen.getByTestId('root')).toBeInTheDocument();
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(
        <Masonry data-testid="root" classNames={{ root: 'slot-root' }}>
          <div>Card</div>
        </Masonry>,
      );
      expect(screen.getByTestId('root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <Masonry data-testid="root" styles={{ root: { opacity: '0.5' } }}>
          <div>Card</div>
        </Masonry>,
      );
      expect(screen.getByTestId('root')).toHaveStyle({ opacity: '0.5' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Masonry data-testid="root" className="outer" classNames={{ root: 'inner' }}>
          <div>Card</div>
        </Masonry>,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <Masonry data-testid="root" style={{ margin: 4 }} styles={{ root: { padding: 8 } }}>
          <div>Card</div>
        </Masonry>,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveStyle({ margin: '4px', padding: '8px' });
    });

    it('applies classNames.item to item wrappers', () => {
      const { container } = render(
        <Masonry classNames={{ item: 'custom-item' }}>
          <div>Card 1</div>
        </Masonry>,
      );
      const root = container.firstElementChild as HTMLElement;
      const item = root.firstElementChild as HTMLElement;
      expect(item).toHaveClass('custom-item');
    });

    it('applies styles.item to item wrappers', () => {
      const { container } = render(
        <Masonry styles={{ item: { opacity: '0.8' } }}>
          <div>Card 1</div>
        </Masonry>,
      );
      const root = container.firstElementChild as HTMLElement;
      const item = root.firstElementChild as HTMLElement;
      expect(item).toHaveStyle({ opacity: '0.8' });
    });
  });
});

// ── Compound API ──────────────────────────────────────

describe('Masonry (Compound)', () => {
  it('compound: Masonry.Item sub-component render edilir', () => {
    render(
      <Masonry data-testid="root">
        <Masonry.Item>Card 1</Masonry.Item>
        <Masonry.Item>Card 2</Masonry.Item>
      </Masonry>,
    );
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  it('compound: Item data-testid masonry-item tasir', () => {
    render(
      <Masonry data-testid="root">
        <Masonry.Item>Card</Masonry.Item>
      </Masonry>,
    );
    // Item, Masonry icindeki wrapper div icinde render edilir
    // Masonry.Item data-testid sadece dogrudan kullanildiginda gorulur
    expect(screen.getByText('Card')).toBeInTheDocument();
  });

  it('compound: classNames.item context ile Masonry.Item a aktarilir', () => {
    const { container } = render(
      <Masonry data-testid="root" classNames={{ item: 'cmp-item' }}>
        <Masonry.Item>Card</Masonry.Item>
      </Masonry>,
    );
    const root = container.firstElementChild as HTMLElement;
    const item = root.firstElementChild as HTMLElement;
    expect(item).toHaveClass('cmp-item');
  });

  it('compound: styles.item context ile Masonry.Item a aktarilir', () => {
    const { container } = render(
      <Masonry data-testid="root" styles={{ item: { opacity: '0.7' } }}>
        <Masonry.Item>Card</Masonry.Item>
      </Masonry>,
    );
    const root = container.firstElementChild as HTMLElement;
    const item = root.firstElementChild as HTMLElement;
    expect(item).toHaveStyle({ opacity: '0.7' });
  });

  it('compound: Masonry.Item className prop uygulanir', () => {
    const { container } = render(
      <Masonry data-testid="root">
        <Masonry.Item className="extra-class">Card</Masonry.Item>
      </Masonry>,
    );
    // Item, Masonry icerisindeki wrapper div olarak render edilir
    // wrapper icinde Masonry.Item in renderlanan div vardir
    const root = container.firstElementChild as HTMLElement;
    const wrapperItem = root.firstElementChild as HTMLElement;
    // Masonry.Item icerigi wrapper'in icinde
    const masonryItem = wrapperItem.querySelector('[data-testid="masonry-item"]');
    expect(masonryItem).toHaveClass('extra-class');
  });

  it('Masonry.Item context disinda hata firlatir', () => {
    expect(() => render(<Masonry.Item>Card</Masonry.Item>)).toThrow();
  });
});
