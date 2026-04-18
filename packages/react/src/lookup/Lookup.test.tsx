/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Lookup } from './Lookup';
import type { LookupItem } from '@relteco/relui-core';

const items: LookupItem[] = [
  { id: '1', label: 'Apple' },
  { id: '2', label: 'Banana' },
  { id: '3', label: 'Cherry' },
];

const mockSearch = vi.fn((_q: string) => Promise.resolve(items));

describe('Lookup', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSearch.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Root ──

  it('root render edilir', () => {
    render(<Lookup onSearch={mockSearch} />);
    expect(screen.getByTestId('lookup-root')).toBeInTheDocument();
  });

  it('input render edilir', () => {
    render(<Lookup onSearch={mockSearch} />);
    expect(screen.getByTestId('lookup-input')).toBeInTheDocument();
  });

  it('liste baslangicta kapali', () => {
    render(<Lookup onSearch={mockSearch} />);
    expect(screen.queryByTestId('lookup-list')).not.toBeInTheDocument();
  });

  // ── Search ──

  it('query girilince search cagrilir (debounce sonrasi)', async () => {
    render(<Lookup onSearch={mockSearch} debounce={100} />);
    fireEvent.change(screen.getByTestId('lookup-input'), { target: { value: 'app' } });
    await act(async () => { vi.advanceTimersByTime(150); });
    expect(mockSearch).toHaveBeenCalledWith('app');
  });

  it('sonuclar gelince liste acilir', async () => {
    render(<Lookup onSearch={mockSearch} debounce={50} />);
    fireEvent.change(screen.getByTestId('lookup-input'), { target: { value: 'a' } });
    await act(async () => { vi.advanceTimersByTime(100); });
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByTestId('lookup-list')).toBeInTheDocument();
  });

  it('sonuc itemlari render edilir', async () => {
    render(<Lookup onSearch={mockSearch} debounce={50} />);
    fireEvent.change(screen.getByTestId('lookup-input'), { target: { value: 'a' } });
    await act(async () => { vi.advanceTimersByTime(100); });
    await act(async () => { await Promise.resolve(); });
    expect(screen.getAllByTestId('lookup-item')).toHaveLength(3);
  });

  // ── Keyboard ──

  it('ArrowDown ile highlight ilerler', async () => {
    render(<Lookup onSearch={mockSearch} debounce={50} />);
    const input = screen.getByTestId('lookup-input');
    fireEvent.change(input, { target: { value: 'a' } });
    await act(async () => { vi.advanceTimersByTime(100); });
    await act(async () => { await Promise.resolve(); });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const highlighted = screen.getAllByTestId('lookup-item').find((el) => el.getAttribute('data-highlighted') !== null);
    expect(highlighted).toBeDefined();
  });

  it('Enter ile secim yapilir', async () => {
    const onSelect = vi.fn();
    render(<Lookup onSearch={mockSearch} onSelect={onSelect} debounce={50} />);
    const input = screen.getByTestId('lookup-input');
    fireEvent.change(input, { target: { value: 'a' } });
    await act(async () => { vi.advanceTimersByTime(100); });
    await act(async () => { await Promise.resolve(); });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(items[0]);
  });

  it('Escape ile liste kapanir', async () => {
    render(<Lookup onSearch={mockSearch} debounce={50} />);
    const input = screen.getByTestId('lookup-input');
    fireEvent.change(input, { target: { value: 'a' } });
    await act(async () => { vi.advanceTimersByTime(100); });
    await act(async () => { await Promise.resolve(); });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByTestId('lookup-list')).not.toBeInTheDocument();
  });

  it('item tiklaninca secim yapilir', async () => {
    const onSelect = vi.fn();
    render(<Lookup onSearch={mockSearch} onSelect={onSelect} debounce={50} />);
    fireEvent.change(screen.getByTestId('lookup-input'), { target: { value: 'a' } });
    await act(async () => { vi.advanceTimersByTime(100); });
    await act(async () => { await Promise.resolve(); });
    fireEvent.click(screen.getAllByTestId('lookup-item')[1]);
    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });

  // ── A11y ──

  it('input role combobox', () => {
    render(<Lookup onSearch={mockSearch} />);
    expect(screen.getByTestId('lookup-input')).toHaveAttribute('role', 'combobox');
  });

  it('input aria-haspopup listbox', () => {
    render(<Lookup onSearch={mockSearch} />);
    expect(screen.getByTestId('lookup-input')).toHaveAttribute('aria-haspopup', 'listbox');
  });

  // ── Placeholder ──

  it('placeholder gosterilir', () => {
    render(<Lookup onSearch={mockSearch} placeholder="Ara..." />);
    expect(screen.getByTestId('lookup-input')).toHaveAttribute('placeholder', 'Ara...');
  });

  // ── Empty results ──

  it('bos sonuc ile empty mesaji gosterilir', async () => {
    const emptySearch = vi.fn(() => Promise.resolve([]));
    render(<Lookup onSearch={emptySearch} debounce={50} />);
    fireEvent.change(screen.getByTestId('lookup-input'), { target: { value: 'xyz' } });
    await act(async () => { vi.advanceTimersByTime(100); });
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByTestId('lookup-empty')).toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Lookup onSearch={mockSearch} className="my-lk" />);
    expect(screen.getByTestId('lookup-root').className).toContain('my-lk');
  });

  it('style root elemana eklenir', () => {
    render(<Lookup onSearch={mockSearch} style={{ padding: '8px' }} />);
    expect(screen.getByTestId('lookup-root')).toHaveStyle({ padding: '8px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Lookup onSearch={mockSearch} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('lookup-root').className).toContain('custom-root');
  });

  it('classNames.input input elemana eklenir', () => {
    render(<Lookup onSearch={mockSearch} classNames={{ input: 'custom-input' }} />);
    expect(screen.getByTestId('lookup-input').className).toContain('custom-input');
  });

  it('classNames.list list elemana eklenir', async () => {
    render(<Lookup onSearch={mockSearch} classNames={{ list: 'custom-list' }} debounce={50} />);
    fireEvent.change(screen.getByTestId('lookup-input'), { target: { value: 'a' } });
    await act(async () => { vi.advanceTimersByTime(100); });
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByTestId('lookup-list').className).toContain('custom-list');
  });

  it('classNames.item item elemana eklenir', async () => {
    render(<Lookup onSearch={mockSearch} classNames={{ item: 'custom-item' }} debounce={50} />);
    fireEvent.change(screen.getByTestId('lookup-input'), { target: { value: 'a' } });
    await act(async () => { vi.advanceTimersByTime(100); });
    await act(async () => { await Promise.resolve(); });
    expect(screen.getAllByTestId('lookup-item')[0].className).toContain('custom-item');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Lookup onSearch={mockSearch} styles={{ root: { padding: '16px' } }} />);
    expect(screen.getByTestId('lookup-root')).toHaveStyle({ padding: '16px' });
  });

  it('styles.input input elemana eklenir', () => {
    render(<Lookup onSearch={mockSearch} styles={{ input: { fontSize: '18px' } }} />);
    expect(screen.getByTestId('lookup-input')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.list list elemana eklenir', async () => {
    render(<Lookup onSearch={mockSearch} styles={{ list: { padding: '12px' } }} debounce={50} />);
    fireEvent.change(screen.getByTestId('lookup-input'), { target: { value: 'a' } });
    await act(async () => { vi.advanceTimersByTime(100); });
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByTestId('lookup-list')).toHaveStyle({ padding: '12px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Lookup onSearch={mockSearch} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Lookup (Compound)', () => {
  it('compound: input render edilir', () => {
    render(
      <Lookup onSearch={mockSearch}>
        <Lookup.Input placeholder="Custom..." />
      </Lookup>,
    );
    expect(screen.getByTestId('lookup-input')).toBeInTheDocument();
    expect(screen.getByTestId('lookup-input')).toHaveAttribute('placeholder', 'Custom...');
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Lookup onSearch={mockSearch} classNames={{ input: 'cmp-input' }}>
        <Lookup.Input />
      </Lookup>,
    );
    expect(screen.getByTestId('lookup-input').className).toContain('cmp-input');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Lookup onSearch={mockSearch} styles={{ input: { fontSize: '20px' } }}>
        <Lookup.Input />
      </Lookup>,
    );
    expect(screen.getByTestId('lookup-input')).toHaveStyle({ fontSize: '20px' });
  });

  it('Lookup.Input context disinda hata firlatir', () => {
    expect(() => render(<Lookup.Input />)).toThrow();
  });
});
