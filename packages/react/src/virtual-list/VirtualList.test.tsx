/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { VirtualList } from './VirtualList';

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ id: String(i), label: `Item ${i}` }));

describe('VirtualList', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(
      <VirtualList items={makeItems(100)} itemHeight={40} height={400}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    expect(screen.getByTestId('virtuallist-root')).toBeInTheDocument();
  });

  it('viewport render edilir', () => {
    render(
      <VirtualList items={makeItems(100)} itemHeight={40} height={400}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    expect(screen.getByTestId('virtuallist-viewport')).toBeInTheDocument();
  });

  it('inner spacer render edilir', () => {
    render(
      <VirtualList items={makeItems(100)} itemHeight={40} height={400}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    const inner = screen.getByTestId('virtuallist-inner');
    expect(inner).toBeInTheDocument();
    expect(inner).toHaveStyle({ height: '4000px' }); // 100 * 40
  });

  // ── Height ──

  it('height root elemana uygulanir', () => {
    render(
      <VirtualList items={makeItems(10)} itemHeight={40} height={300}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    expect(screen.getByTestId('virtuallist-root')).toHaveStyle({ height: '300px' });
  });

  // ── Visible items ──

  it('sadece gorunur ogeler render edilir', () => {
    render(
      <VirtualList items={makeItems(1000)} itemHeight={40} height={400}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    const items = screen.getAllByTestId('virtuallist-item');
    // ceil(400/40) + overscan(5) = 15 items (start at 0, no top overscan needed)
    expect(items.length).toBeLessThan(30);
    expect(items.length).toBeGreaterThan(0);
  });

  it('item lara data-index atanir', () => {
    render(
      <VirtualList items={makeItems(100)} itemHeight={40} height={400}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    const items = screen.getAllByTestId('virtuallist-item');
    const firstItem = items[0];
    expect(firstItem).toHaveAttribute('data-index', '0');
  });

  it('item icerik render edilir', () => {
    render(
      <VirtualList items={makeItems(10)} itemHeight={40} height={400}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    expect(screen.getByText('Item 0')).toBeInTheDocument();
    expect(screen.getByText('Item 9')).toBeInTheDocument();
  });

  // ── Empty ──

  it('bos items ile oge render edilmez', () => {
    render(
      <VirtualList items={[]} itemHeight={40} height={400}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    expect(screen.queryByTestId('virtuallist-item')).not.toBeInTheDocument();
  });

  // ── Item positioning ──

  it('item top pozisyonu dogru', () => {
    render(
      <VirtualList items={makeItems(10)} itemHeight={50} height={400}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    const items = screen.getAllByTestId('virtuallist-item');
    const firstItem = items[0];
    expect(firstItem).toHaveStyle({ top: '0px', height: '50px' });
  });

  it('ikinci item top pozisyonu itemHeight kadar', () => {
    render(
      <VirtualList items={makeItems(10)} itemHeight={50} height={400}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    const items = screen.getAllByTestId('virtuallist-item');
    if (items[1]) {
      expect(items[1]).toHaveStyle({ top: '50px' });
    }
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(
      <VirtualList items={makeItems(10)} itemHeight={40} height={400}
        className="my-vl" renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    expect(screen.getByTestId('virtuallist-root').className).toContain('my-vl');
  });

  it('style root elemana eklenir', () => {
    render(
      <VirtualList items={makeItems(10)} itemHeight={40} height={400}
        style={{ padding: '8px' }} renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    expect(screen.getByTestId('virtuallist-root')).toHaveStyle({ padding: '8px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(
      <VirtualList items={makeItems(10)} itemHeight={40} height={400}
        classNames={{ root: 'custom-root' }}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    expect(screen.getByTestId('virtuallist-root').className).toContain('custom-root');
  });

  it('classNames.viewport viewport elemana eklenir', () => {
    render(
      <VirtualList items={makeItems(10)} itemHeight={40} height={400}
        classNames={{ viewport: 'custom-vp' }}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    expect(screen.getByTestId('virtuallist-viewport').className).toContain('custom-vp');
  });

  it('classNames.item item elemana eklenir', () => {
    render(
      <VirtualList items={makeItems(10)} itemHeight={40} height={400}
        classNames={{ item: 'custom-item' }}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    const items = screen.getAllByTestId('virtuallist-item');
    expect(items[0]?.className).toContain('custom-item');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(
      <VirtualList items={makeItems(10)} itemHeight={40} height={400}
        styles={{ root: { padding: '16px' } }}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    expect(screen.getByTestId('virtuallist-root')).toHaveStyle({ padding: '16px' });
  });

  it('styles.viewport viewport elemana eklenir', () => {
    render(
      <VirtualList items={makeItems(10)} itemHeight={40} height={400}
        styles={{ viewport: { padding: '8px' } }}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    expect(screen.getByTestId('virtuallist-viewport')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(
      <VirtualList ref={ref} items={makeItems(10)} itemHeight={40} height={400}
        renderItem={(item) => <span>{String(item['label'])}</span>} />,
    );
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('VirtualList (Compound)', () => {
  it('compound: children fonksiyonu ile render edilir', () => {
    render(
      <VirtualList totalCount={100} itemHeight={40} height={400}>
        {(index) => (
          <VirtualList.Item key={index} index={index}>
            Row {index}
          </VirtualList.Item>
        )}
      </VirtualList>,
    );
    expect(screen.getByText('Row 0')).toBeInTheDocument();
  });

  it('compound: item lara data-index atanir', () => {
    render(
      <VirtualList totalCount={100} itemHeight={40} height={400}>
        {(index) => (
          <VirtualList.Item key={index} index={index}>
            Row {index}
          </VirtualList.Item>
        )}
      </VirtualList>,
    );
    const items = screen.getAllByTestId('virtuallist-item');
    expect(items[0]).toHaveAttribute('data-index', '0');
  });

  it('compound: sadece gorunur ogeler render edilir', () => {
    render(
      <VirtualList totalCount={10000} itemHeight={40} height={400}>
        {(index) => (
          <VirtualList.Item key={index} index={index}>
            Row {index}
          </VirtualList.Item>
        )}
      </VirtualList>,
    );
    const items = screen.getAllByTestId('virtuallist-item');
    expect(items.length).toBeLessThan(30);
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <VirtualList totalCount={10} itemHeight={40} height={400}
        classNames={{ item: 'cmp-item' }}>
        {(index) => (
          <VirtualList.Item key={index} index={index}>
            Row {index}
          </VirtualList.Item>
        )}
      </VirtualList>,
    );
    const items = screen.getAllByTestId('virtuallist-item');
    expect(items[0]?.className).toContain('cmp-item');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <VirtualList totalCount={10} itemHeight={40} height={400}
        styles={{ item: { padding: '4px' } }}>
        {(index) => (
          <VirtualList.Item key={index} index={index}>
            Row {index}
          </VirtualList.Item>
        )}
      </VirtualList>,
    );
    const items = screen.getAllByTestId('virtuallist-item');
    expect(items[0]).toHaveStyle({ padding: '4px' });
  });

  it('VirtualList.Item context disinda hata firlatir', () => {
    expect(() =>
      render(<VirtualList.Item index={0}>Hata</VirtualList.Item>),
    ).toThrow();
  });
});
