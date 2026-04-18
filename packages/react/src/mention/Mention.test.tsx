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
import { Mention } from './Mention';
import type { MentionItem } from '@relteco/relui-core';

const items: MentionItem[] = [
  { id: '1', label: 'Alice' },
  { id: '2', label: 'Bob' },
  { id: '3', label: 'Charlie' },
];

describe('Mention', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Mention items={items} />);
    expect(screen.getByTestId('mention-root')).toBeInTheDocument();
  });

  it('input render edilir', () => {
    render(<Mention items={items} />);
    expect(screen.getByTestId('mention-input')).toBeInTheDocument();
  });

  it('liste baslangicta kapali', () => {
    render(<Mention items={items} />);
    expect(screen.queryByTestId('mention-list')).not.toBeInTheDocument();
  });

  // ── Trigger ──

  it('@ yazinca liste acilir', () => {
    render(<Mention items={items} />);
    fireEvent.change(screen.getByTestId('mention-input'), { target: { value: '@' } });
    expect(screen.getByTestId('mention-list')).toBeInTheDocument();
  });

  it('@ sonrasi query ile filtreleme yapilir', () => {
    render(<Mention items={items} />);
    fireEvent.change(screen.getByTestId('mention-input'), { target: { value: '@ali' } });
    const listItems = screen.getAllByTestId('mention-item');
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent('Alice');
  });

  it('esleme yoksa bos liste', () => {
    render(<Mention items={items} />);
    fireEvent.change(screen.getByTestId('mention-input'), { target: { value: '@xyz' } });
    expect(screen.queryByTestId('mention-item')).not.toBeInTheDocument();
  });

  // ── Keyboard ──

  it('ArrowDown ile highlight ilerler', () => {
    render(<Mention items={items} />);
    const input = screen.getByTestId('mention-input');
    fireEvent.change(input, { target: { value: '@' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const highlighted = screen.getAllByTestId('mention-item').find((el) => el.getAttribute('data-highlighted') !== null);
    expect(highlighted).toBeDefined();
  });

  it('ArrowUp ile highlight geriler', () => {
    render(<Mention items={items} />);
    const input = screen.getByTestId('mention-input');
    fireEvent.change(input, { target: { value: '@' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    const lis = screen.getAllByTestId('mention-item');
    expect(lis[0]).toHaveAttribute('data-highlighted');
  });

  it('Enter ile secim yapilir', () => {
    const onSelect = vi.fn();
    render(<Mention items={items} onSelect={onSelect} />);
    const input = screen.getByTestId('mention-input');
    fireEvent.change(input, { target: { value: '@' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(items[0]);
  });

  it('Escape ile liste kapanir', () => {
    render(<Mention items={items} />);
    const input = screen.getByTestId('mention-input');
    fireEvent.change(input, { target: { value: '@' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByTestId('mention-list')).not.toBeInTheDocument();
  });

  it('item tiklaninca secim yapilir', () => {
    const onSelect = vi.fn();
    render(<Mention items={items} onSelect={onSelect} />);
    fireEvent.change(screen.getByTestId('mention-input'), { target: { value: '@' } });
    fireEvent.click(screen.getAllByTestId('mention-item')[1]);
    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });

  // ── A11y ──

  it('input role combobox', () => {
    render(<Mention items={items} />);
    expect(screen.getByTestId('mention-input')).toHaveAttribute('role', 'combobox');
  });

  it('liste role listbox', () => {
    render(<Mention items={items} />);
    fireEvent.change(screen.getByTestId('mention-input'), { target: { value: '@' } });
    expect(screen.getByTestId('mention-list')).toHaveAttribute('role', 'listbox');
  });

  it('item role option', () => {
    render(<Mention items={items} />);
    fireEvent.change(screen.getByTestId('mention-input'), { target: { value: '@' } });
    expect(screen.getAllByTestId('mention-item')[0]).toHaveAttribute('role', 'option');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Mention items={items} className="my-mention" />);
    expect(screen.getByTestId('mention-root').className).toContain('my-mention');
  });

  it('style root elemana eklenir', () => {
    render(<Mention items={items} style={{ padding: '8px' }} />);
    expect(screen.getByTestId('mention-root')).toHaveStyle({ padding: '8px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Mention items={items} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('mention-root').className).toContain('custom-root');
  });

  it('classNames.input input elemana eklenir', () => {
    render(<Mention items={items} classNames={{ input: 'custom-input' }} />);
    expect(screen.getByTestId('mention-input').className).toContain('custom-input');
  });

  it('classNames.list list elemana eklenir', () => {
    render(<Mention items={items} classNames={{ list: 'custom-list' }} />);
    fireEvent.change(screen.getByTestId('mention-input'), { target: { value: '@' } });
    expect(screen.getByTestId('mention-list').className).toContain('custom-list');
  });

  it('classNames.item item elemana eklenir', () => {
    render(<Mention items={items} classNames={{ item: 'custom-item' }} />);
    fireEvent.change(screen.getByTestId('mention-input'), { target: { value: '@' } });
    expect(screen.getAllByTestId('mention-item')[0].className).toContain('custom-item');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Mention items={items} styles={{ root: { padding: '16px' } }} />);
    expect(screen.getByTestId('mention-root')).toHaveStyle({ padding: '16px' });
  });

  it('styles.input input elemana eklenir', () => {
    render(<Mention items={items} styles={{ input: { fontSize: '18px' } }} />);
    expect(screen.getByTestId('mention-input')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.list list elemana eklenir', () => {
    render(<Mention items={items} styles={{ list: { padding: '8px' } }} />);
    fireEvent.change(screen.getByTestId('mention-input'), { target: { value: '@' } });
    expect(screen.getByTestId('mention-list')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Mention items={items} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Mention (Compound)', () => {
  it('compound: input render edilir', () => {
    render(
      <Mention items={items}>
        <Mention.Input placeholder="Type @..." />
      </Mention>,
    );
    expect(screen.getByTestId('mention-input')).toBeInTheDocument();
  });

  it('compound: list render edilir', () => {
    render(
      <Mention items={items}>
        <Mention.Input />
        <Mention.List />
      </Mention>,
    );
    fireEvent.change(screen.getByTestId('mention-input'), { target: { value: '@' } });
    expect(screen.getByTestId('mention-list')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Mention items={items} classNames={{ input: 'cmp-input' }}>
        <Mention.Input />
      </Mention>,
    );
    expect(screen.getByTestId('mention-input').className).toContain('cmp-input');
  });

  it('Mention.Input context disinda hata firlatir', () => {
    expect(() => render(<Mention.Input />)).toThrow();
  });
});
