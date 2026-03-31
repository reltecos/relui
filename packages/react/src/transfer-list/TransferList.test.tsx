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
import { TransferList } from './TransferList';
import type { TransferItemDef } from '@relteco/relui-core';

const sampleItems: TransferItemDef[] = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Charlie' },
  { id: 'd', label: 'Delta' },
  { id: 'e', label: 'Echo' },
];

describe('TransferList', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<TransferList items={sampleItems} />);
    expect(screen.getByTestId('transferlist-root')).toBeInTheDocument();
  });

  it('sourceList render edilir', () => {
    render(<TransferList items={sampleItems} />);
    expect(screen.getByTestId('transferlist-sourceList')).toBeInTheDocument();
  });

  it('targetList render edilir', () => {
    render(<TransferList items={sampleItems} />);
    expect(screen.getByTestId('transferlist-targetList')).toBeInTheDocument();
  });

  it('actions render edilir', () => {
    render(<TransferList items={sampleItems} />);
    expect(screen.getByTestId('transferlist-actions')).toBeInTheDocument();
  });

  // ── Items ──

  it('tum ogeler kaynakta gorunur', () => {
    render(<TransferList items={sampleItems} />);
    const items = screen.getAllByTestId('transferlist-item');
    expect(items.length).toBe(5);
  });

  it('defaultTargetIds ile ogeler hedefte', () => {
    render(<TransferList items={sampleItems} defaultTargetIds={['c', 'd']} />);
    const items = screen.getAllByTestId('transferlist-item');
    // 3 source + 2 target = 5
    expect(items.length).toBe(5);
  });

  // ── Selection ──

  it('kaynak oge tiklaninca secilir', () => {
    render(<TransferList items={sampleItems} />);
    const items = screen.getAllByTestId('transferlist-item');
    fireEvent.click(items[0] as HTMLElement);
    expect(items[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('tekrar tikla ile secim kalkar', () => {
    render(<TransferList items={sampleItems} />);
    const items = screen.getAllByTestId('transferlist-item');
    fireEvent.click(items[0] as HTMLElement);
    fireEvent.click(items[0] as HTMLElement);
    expect(items[0]).toHaveAttribute('aria-selected', 'false');
  });

  // ── Move ──

  it('move right ile secili oge hedefe tasir', () => {
    render(<TransferList items={sampleItems} />);
    // Select first item
    fireEvent.click(screen.getAllByTestId('transferlist-item')[0] as HTMLElement);
    // Move right
    fireEvent.click(screen.getByTestId('transferlist-move-right'));
    // Now Alpha should be in target list
    const targetList = screen.getByTestId('transferlist-targetList');
    expect(targetList).toHaveTextContent('Alpha');
  });

  it('move left ile secili oge kaynaga tasir', () => {
    render(<TransferList items={sampleItems} defaultTargetIds={['c']} />);
    // Find 'Charlie' in target and click
    const targetItems = screen.getByTestId('transferlist-targetList').querySelectorAll('[data-testid="transferlist-item"]');
    fireEvent.click(targetItems[0] as HTMLElement);
    // Move left
    fireEvent.click(screen.getByTestId('transferlist-move-left'));
    // Charlie should be back in source
    const sourceList = screen.getByTestId('transferlist-sourceList');
    expect(sourceList).toHaveTextContent('Charlie');
  });

  it('move all right tum kaynak ogelerini tasir', () => {
    render(<TransferList items={sampleItems} />);
    fireEvent.click(screen.getByTestId('transferlist-move-all-right'));
    const sourceItems = screen.getByTestId('transferlist-sourceList').querySelectorAll('[data-testid="transferlist-item"]');
    expect(sourceItems.length).toBe(0);
  });

  it('move all left tum hedef ogelerini tasir', () => {
    render(<TransferList items={sampleItems} defaultTargetIds={['a', 'b', 'c', 'd', 'e']} />);
    fireEvent.click(screen.getByTestId('transferlist-move-all-left'));
    const targetItems = screen.getByTestId('transferlist-targetList').querySelectorAll('[data-testid="transferlist-item"]');
    expect(targetItems.length).toBe(0);
  });

  // ── Buttons disabled ──

  it('move right secim yoksa disabled', () => {
    render(<TransferList items={sampleItems} />);
    expect(screen.getByTestId('transferlist-move-right')).toBeDisabled();
  });

  it('move left secim yoksa disabled', () => {
    render(<TransferList items={sampleItems} />);
    expect(screen.getByTestId('transferlist-move-left')).toBeDisabled();
  });

  // ── Filter ──

  it('kaynak filtre arama yapar', () => {
    render(<TransferList items={sampleItems} />);
    const inputs = screen.getAllByTestId('transferlist-searchInput');
    fireEvent.change(inputs[0] as HTMLElement, { target: { value: 'alp' } });
    const sourceItems = screen.getByTestId('transferlist-sourceList').querySelectorAll('[data-testid="transferlist-item"]');
    expect(sourceItems.length).toBe(1);
    expect(sourceItems[0]).toHaveTextContent('Alpha');
  });

  it('hedef filtre arama yapar', () => {
    render(<TransferList items={sampleItems} defaultTargetIds={['a', 'b']} />);
    const inputs = screen.getAllByTestId('transferlist-searchInput');
    fireEvent.change(inputs[1] as HTMLElement, { target: { value: 'bet' } });
    const targetItems = screen.getByTestId('transferlist-targetList').querySelectorAll('[data-testid="transferlist-item"]');
    expect(targetItems.length).toBe(1);
    expect(targetItems[0]).toHaveTextContent('Beta');
  });

  // ── Callbacks ──

  it('onTargetChange cagirilir', () => {
    const onTargetChange = vi.fn();
    render(<TransferList items={sampleItems} onTargetChange={onTargetChange} />);
    fireEvent.click(screen.getAllByTestId('transferlist-item')[0] as HTMLElement);
    fireEvent.click(screen.getByTestId('transferlist-move-right'));
    expect(onTargetChange).toHaveBeenCalled();
  });

  // ── A11Y ──

  it('listbox role var', () => {
    render(<TransferList items={sampleItems} />);
    const listboxes = screen.getAllByRole('listbox');
    expect(listboxes.length).toBe(2);
  });

  it('option role var', () => {
    render(<TransferList items={sampleItems} />);
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(5);
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<TransferList items={sampleItems} className="my-tl" />);
    expect(screen.getByTestId('transferlist-root').className).toContain('my-tl');
  });

  it('style root elemana eklenir', () => {
    render(<TransferList items={sampleItems} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('transferlist-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<TransferList items={sampleItems} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('transferlist-root').className).toContain('custom-root');
  });

  it('classNames.sourceList sourceList elemana eklenir', () => {
    render(<TransferList items={sampleItems} classNames={{ sourceList: 'custom-src' }} />);
    expect(screen.getByTestId('transferlist-sourceList').className).toContain('custom-src');
  });

  it('classNames.targetList targetList elemana eklenir', () => {
    render(<TransferList items={sampleItems} classNames={{ targetList: 'custom-tgt' }} />);
    expect(screen.getByTestId('transferlist-targetList').className).toContain('custom-tgt');
  });

  it('classNames.actions actions elemana eklenir', () => {
    render(<TransferList items={sampleItems} classNames={{ actions: 'custom-act' }} />);
    expect(screen.getByTestId('transferlist-actions').className).toContain('custom-act');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<TransferList items={sampleItems} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('transferlist-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.sourceList sourceList elemana eklenir', () => {
    render(<TransferList items={sampleItems} styles={{ sourceList: { padding: '12px' } }} />);
    expect(screen.getByTestId('transferlist-sourceList')).toHaveStyle({ padding: '12px' });
  });

  it('styles.targetList targetList elemana eklenir', () => {
    render(<TransferList items={sampleItems} styles={{ targetList: { padding: '12px' } }} />);
    expect(screen.getByTestId('transferlist-targetList')).toHaveStyle({ padding: '12px' });
  });

  it('styles.actions actions elemana eklenir', () => {
    render(<TransferList items={sampleItems} styles={{ actions: { padding: '8px' } }} />);
    expect(screen.getByTestId('transferlist-actions')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<TransferList ref={ref} items={sampleItems} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('TransferList (Compound)', () => {
  it('compound: sourceList render edilir', () => {
    render(
      <TransferList items={sampleItems}>
        <TransferList.SourceList />
        <TransferList.Actions />
        <TransferList.TargetList />
      </TransferList>,
    );
    expect(screen.getByTestId('transferlist-sourceList')).toBeInTheDocument();
  });

  it('compound: actions render edilir', () => {
    render(
      <TransferList items={sampleItems}>
        <TransferList.SourceList />
        <TransferList.Actions />
        <TransferList.TargetList />
      </TransferList>,
    );
    expect(screen.getByTestId('transferlist-actions')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <TransferList items={sampleItems} classNames={{ sourceList: 'cmp-src' }}>
        <TransferList.SourceList />
        <TransferList.Actions />
        <TransferList.TargetList />
      </TransferList>,
    );
    expect(screen.getByTestId('transferlist-sourceList').className).toContain('cmp-src');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <TransferList items={sampleItems} styles={{ actions: { padding: '20px' } }}>
        <TransferList.SourceList />
        <TransferList.Actions />
        <TransferList.TargetList />
      </TransferList>,
    );
    expect(screen.getByTestId('transferlist-actions')).toHaveStyle({ padding: '20px' });
  });

  it('TransferList.SourceList context disinda hata firlatir', () => {
    expect(() => render(<TransferList.SourceList />)).toThrow();
  });
});
