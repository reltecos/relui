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
import { Sortable } from './Sortable';

const baseItems = ['item-1', 'item-2', 'item-3', 'item-4'];

describe('Sortable', () => {
  // ── Root ──
  it('root render edilir', () => { render(<Sortable items={baseItems} />); expect(screen.getByTestId('sortable-root')).toBeInTheDocument(); });
  it('root role list', () => { render(<Sortable items={baseItems} />); expect(screen.getByTestId('sortable-root')).toHaveAttribute('role', 'list'); });
  it('varsayilan direction vertical', () => { render(<Sortable items={baseItems} />); expect(screen.getByTestId('sortable-root')).toHaveAttribute('data-direction', 'vertical'); });
  it('direction horizontal set edilir', () => { render(<Sortable items={baseItems} direction="horizontal" />); expect(screen.getByTestId('sortable-root')).toHaveAttribute('data-direction', 'horizontal'); });

  // ── Items ──
  it('ogeler render edilir', () => { render(<Sortable items={baseItems} />); expect(screen.getAllByTestId('sortable-item').length).toBe(4); });
  it('oge role listitem', () => { render(<Sortable items={baseItems} />); expect(screen.getAllByTestId('sortable-item')[0]).toHaveAttribute('role', 'listitem'); });
  it('oge draggable', () => { render(<Sortable items={baseItems} />); expect(screen.getAllByTestId('sortable-item')[0]).toHaveAttribute('draggable'); });
  it('oge data-item-id set edilir', () => { render(<Sortable items={baseItems} />); expect(screen.getAllByTestId('sortable-item')[0]).toHaveAttribute('data-item-id', 'item-1'); });

  it('renderItem ile ozel render', () => {
    render(<Sortable items={baseItems} renderItem={(id) => <span>{id.toUpperCase()}</span>} />);
    expect(screen.getByText('ITEM-1')).toBeInTheDocument();
  });

  it('dragStart ile data-dragging set edilir', () => {
    render(<Sortable items={baseItems} />);
    const item = screen.getAllByTestId('sortable-item')[0] as HTMLElement;
    fireEvent.dragStart(item);
    expect(item).toHaveAttribute('data-dragging', 'true');
  });

  // ── className & style ──
  it('className root elemana eklenir', () => { render(<Sortable items={baseItems} className="my-s" />); expect(screen.getByTestId('sortable-root').className).toContain('my-s'); });
  it('style root elemana eklenir', () => { render(<Sortable items={baseItems} style={{ padding: '16px' }} />); expect(screen.getByTestId('sortable-root')).toHaveStyle({ padding: '16px' }); });

  // ── Slot API: classNames ──
  it('classNames.root eklenir', () => { render(<Sortable items={baseItems} classNames={{ root: 'c-r' }} />); expect(screen.getByTestId('sortable-root').className).toContain('c-r'); });
  it('classNames.item eklenir', () => {
    render(<Sortable items={baseItems} classNames={{ item: 'c-i' }} />);
    expect(screen.getAllByTestId('sortable-item')[0]?.className).toContain('c-i');
  });

  // ── Slot API: styles ──
  it('styles.root eklenir', () => { render(<Sortable items={baseItems} styles={{ root: { padding: '24px' } }} />); expect(screen.getByTestId('sortable-root')).toHaveStyle({ padding: '24px' }); });
  it('styles.item eklenir', () => {
    render(<Sortable items={baseItems} styles={{ item: { padding: '8px' } }} />);
    expect(screen.getAllByTestId('sortable-item')[0]).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──
  it('ref forward edilir', () => { const ref = vi.fn(); render(<Sortable ref={ref} items={baseItems} />); expect(ref).toHaveBeenCalled(); });
});

describe('Sortable (Compound)', () => {
  it('compound: item render edilir', () => {
    render(
      <Sortable items={baseItems}>
        <Sortable.Item itemId="item-1">First</Sortable.Item>
        <Sortable.Item itemId="item-2">Second</Sortable.Item>
      </Sortable>,
    );
    expect(screen.getAllByTestId('sortable-item').length).toBe(2);
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Sortable items={baseItems} classNames={{ item: 'cmp-i' }}>
        <Sortable.Item itemId="item-1">First</Sortable.Item>
      </Sortable>,
    );
    expect(screen.getByTestId('sortable-item').className).toContain('cmp-i');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Sortable items={baseItems} styles={{ item: { padding: '12px' } }}>
        <Sortable.Item itemId="item-1">First</Sortable.Item>
      </Sortable>,
    );
    expect(screen.getByTestId('sortable-item')).toHaveStyle({ padding: '12px' });
  });

  it('compound: dragStart calisir', () => {
    render(
      <Sortable items={baseItems}>
        <Sortable.Item itemId="item-1">First</Sortable.Item>
      </Sortable>,
    );
    const item = screen.getByTestId('sortable-item');
    fireEvent.dragStart(item);
    expect(item).toHaveAttribute('data-dragging', 'true');
  });

  it('compound: placeholder surukleme yoksa gorunmez', () => {
    render(
      <Sortable items={baseItems}>
        <Sortable.Item itemId="item-1">A</Sortable.Item>
        <Sortable.Placeholder />
      </Sortable>,
    );
    expect(screen.queryByTestId('sortable-placeholder')).not.toBeInTheDocument();
  });

  it('compound: placeholder surukleme varken gorunur', () => {
    render(
      <Sortable items={baseItems}>
        <Sortable.Item itemId="item-1">A</Sortable.Item>
        <Sortable.Placeholder />
      </Sortable>,
    );
    fireEvent.dragStart(screen.getByTestId('sortable-item'));
    expect(screen.getByTestId('sortable-placeholder')).toBeInTheDocument();
  });

  it('Sortable.Item context disinda hata firlatir', () => {
    expect(() => render(<Sortable.Item itemId="x">X</Sortable.Item>)).toThrow();
  });
});
