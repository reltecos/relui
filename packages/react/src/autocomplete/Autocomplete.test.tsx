/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Autocomplete } from './Autocomplete';

// ── jsdom mock ──────────────────────────────────────────

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

// ── Test data ───────────────────────────────────────────

const basicOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

const groupedOptions = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
];

// ── Props-based tests ───────────────────────────────────

describe('Autocomplete', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Autocomplete options={basicOptions} />);
    expect(screen.getByTestId('autocomplete-root')).toBeInTheDocument();
  });

  it('root data-testid dogru', () => {
    render(<Autocomplete options={basicOptions} />);
    expect(screen.getByTestId('autocomplete-root')).toBeTruthy();
  });

  it('varsayilan size md', () => {
    render(<Autocomplete options={basicOptions} />);
    expect(screen.getByTestId('autocomplete-root')).toHaveAttribute('data-size', 'md');
  });

  it('size sm set edilir', () => {
    render(<Autocomplete options={basicOptions} size="sm" />);
    expect(screen.getByTestId('autocomplete-root')).toHaveAttribute('data-size', 'sm');
  });

  it('size lg set edilir', () => {
    render(<Autocomplete options={basicOptions} size="lg" />);
    expect(screen.getByTestId('autocomplete-root')).toHaveAttribute('data-size', 'lg');
  });

  // ── Input ──

  it('input render edilir', () => {
    render(<Autocomplete options={basicOptions} />);
    expect(screen.getByTestId('autocomplete-input')).toBeInTheDocument();
  });

  it('placeholder gosterilir', () => {
    render(<Autocomplete options={basicOptions} placeholder="Search items" />);
    expect(screen.getByTestId('autocomplete-input')).toHaveAttribute('placeholder', 'Search items');
  });

  // ── Listbox kapaliyken ──

  it('listbox kapaliyken render edilmez', () => {
    render(<Autocomplete options={basicOptions} />);
    expect(screen.queryByTestId('autocomplete-listbox')).not.toBeInTheDocument();
  });

  // ── Options acildiginda ──

  it('options focus ile acilir', () => {
    render(<Autocomplete options={basicOptions} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    expect(screen.getByTestId('autocomplete-listbox')).toBeInTheDocument();
    expect(screen.getAllByTestId('autocomplete-option')).toHaveLength(3);
  });

  // ── Filtering ──

  it('filtreleme calisir', () => {
    render(<Autocomplete options={basicOptions} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.change(input, { target: { value: 'app' } });
    const opts = screen.getAllByTestId('autocomplete-option');
    expect(opts).toHaveLength(1);
    expect(opts[0]).toHaveTextContent('Apple');
  });

  // ── Select via click ──

  it('tiklayinca secenek secilir', () => {
    const onChange = vi.fn();
    render(<Autocomplete options={basicOptions} onChange={onChange} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    fireEvent.click(screen.getByText('Banana'));
    expect(onChange).toHaveBeenCalledWith('banana', 'Banana');
  });

  // ── Keyboard highlight ──

  it('ArrowDown ile vurgu yapilir', () => {
    render(<Autocomplete options={basicOptions} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const opts = screen.getAllByTestId('autocomplete-option');
    expect(opts[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('ArrowUp ile onceki vurgulanir', () => {
    render(<Autocomplete options={basicOptions} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    const opts = screen.getAllByTestId('autocomplete-option');
    expect(opts[0]).toHaveAttribute('aria-selected', 'true');
  });

  // ── noResultText ──

  it('noResultText eslesme yoksa gosterilir', () => {
    render(<Autocomplete options={basicOptions} noResultText="No items found" />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(screen.getByTestId('autocomplete-no-result')).toHaveTextContent('No items found');
  });

  it('varsayilan noResultText gosterilir', () => {
    render(<Autocomplete options={basicOptions} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(screen.getByTestId('autocomplete-no-result')).toHaveTextContent('Sonuc bulunamadi');
  });

  // ── Disabled ──

  it('disabled iken input disabled', () => {
    render(<Autocomplete options={basicOptions} disabled />);
    expect(screen.getByTestId('autocomplete-input')).toBeDisabled();
  });

  it('disabled iken listbox acilmaz', () => {
    render(<Autocomplete options={basicOptions} disabled />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    expect(screen.queryByTestId('autocomplete-listbox')).not.toBeInTheDocument();
  });

  // ── Escape kapatir ──

  it('Escape ile listbox kapanir', () => {
    render(<Autocomplete options={basicOptions} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    expect(screen.getByTestId('autocomplete-listbox')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByTestId('autocomplete-listbox')).not.toBeInTheDocument();
  });

  // ── Enter ile secim ──

  it('Enter ile highlighted secenek secilir', () => {
    const onChange = vi.fn();
    render(<Autocomplete options={basicOptions} onChange={onChange} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('apple', 'Apple');
  });

  // ── className ──

  it('className root elemana eklenir', () => {
    render(<Autocomplete options={basicOptions} className="my-auto" />);
    expect(screen.getByTestId('autocomplete-root').className).toContain('my-auto');
  });

  // ── style ──

  it('style root elemana eklenir', () => {
    render(<Autocomplete options={basicOptions} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('autocomplete-root')).toHaveStyle({ padding: '16px' });
  });

  // ── classNames slots ──

  it('classNames.root root elemana eklenir', () => {
    render(<Autocomplete options={basicOptions} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('autocomplete-root').className).toContain('custom-root');
  });

  it('classNames.input input elemana eklenir', () => {
    render(<Autocomplete options={basicOptions} classNames={{ input: 'custom-input' }} />);
    expect(screen.getByTestId('autocomplete-input').className).toContain('custom-input');
  });

  it('classNames.listbox listbox elemana eklenir', () => {
    render(<Autocomplete options={basicOptions} classNames={{ listbox: 'custom-listbox' }} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    expect(screen.getByTestId('autocomplete-listbox').className).toContain('custom-listbox');
  });

  it('classNames.option option elemana eklenir', () => {
    render(<Autocomplete options={basicOptions} classNames={{ option: 'custom-opt' }} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    const opts = screen.getAllByTestId('autocomplete-option');
    expect(opts[0]?.className).toContain('custom-opt');
  });

  // ── styles slots ──

  it('styles.root root elemana eklenir', () => {
    render(<Autocomplete options={basicOptions} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('autocomplete-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.input input elemana eklenir', () => {
    render(<Autocomplete options={basicOptions} styles={{ input: { fontSize: '20px' } }} />);
    expect(screen.getByTestId('autocomplete-input')).toHaveStyle({ fontSize: '20px' });
  });

  it('styles.listbox listbox elemana eklenir', () => {
    render(<Autocomplete options={basicOptions} styles={{ listbox: { padding: '8px' } }} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    expect(screen.getByTestId('autocomplete-listbox')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Autocomplete options={basicOptions} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Grouped options ──

  it('gruplu secenekler grup basliklarini render eder', () => {
    render(<Autocomplete options={groupedOptions} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    const groups = screen.getAllByTestId('autocomplete-option-group');
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveTextContent('Fruits');
    expect(groups[1]).toHaveTextContent('Vegetables');
  });

  // ── ARIA attributes ──

  it('role combobox root elemanda', () => {
    render(<Autocomplete options={basicOptions} />);
    expect(screen.getByTestId('autocomplete-root')).toHaveAttribute('role', 'combobox');
  });

  it('aria-expanded false baslangicta', () => {
    render(<Autocomplete options={basicOptions} />);
    expect(screen.getByTestId('autocomplete-root')).toHaveAttribute('aria-expanded', 'false');
  });

  it('aria-expanded true acikken', () => {
    render(<Autocomplete options={basicOptions} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    expect(screen.getByTestId('autocomplete-root')).toHaveAttribute('aria-expanded', 'true');
  });

  it('aria-autocomplete list input elemanda', () => {
    render(<Autocomplete options={basicOptions} />);
    expect(screen.getByTestId('autocomplete-input')).toHaveAttribute('aria-autocomplete', 'list');
  });

  it('role listbox listbox elemanda', () => {
    render(<Autocomplete options={basicOptions} />);
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    expect(screen.getByTestId('autocomplete-listbox')).toHaveAttribute('role', 'listbox');
  });
});

// ── Compound API ──

describe('Autocomplete (Compound)', () => {
  it('compound: input render edilir', () => {
    render(
      <Autocomplete options={basicOptions}>
        <Autocomplete.Input placeholder="Search" />
        <Autocomplete.List />
      </Autocomplete>,
    );
    expect(screen.getByTestId('autocomplete-input')).toBeInTheDocument();
  });

  it('compound: list render edilir acikken', () => {
    render(
      <Autocomplete options={basicOptions}>
        <Autocomplete.Input />
        <Autocomplete.List>
          <Autocomplete.Option value="apple" label="Apple" />
        </Autocomplete.List>
      </Autocomplete>,
    );
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    expect(screen.getByTestId('autocomplete-listbox')).toBeInTheDocument();
  });

  it('compound: option render edilir', () => {
    render(
      <Autocomplete options={basicOptions}>
        <Autocomplete.Input />
        <Autocomplete.List>
          <Autocomplete.Option value="apple" label="Apple" />
          <Autocomplete.Option value="banana" label="Banana" />
        </Autocomplete.List>
      </Autocomplete>,
    );
    const input = screen.getByTestId('autocomplete-input');
    fireEvent.focus(input);
    expect(screen.getAllByTestId('autocomplete-option')).toHaveLength(2);
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Autocomplete options={basicOptions} classNames={{ input: 'cmp-input' }}>
        <Autocomplete.Input />
        <Autocomplete.List />
      </Autocomplete>,
    );
    expect(screen.getByTestId('autocomplete-input').className).toContain('cmp-input');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Autocomplete options={basicOptions} styles={{ input: { fontSize: '22px' } }}>
        <Autocomplete.Input />
        <Autocomplete.List />
      </Autocomplete>,
    );
    expect(screen.getByTestId('autocomplete-input')).toHaveStyle({ fontSize: '22px' });
  });

  it('context disinda hata firlatir', () => {
    expect(() => render(<Autocomplete.Input />)).toThrow();
  });

  it('compound: root render edilir', () => {
    render(
      <Autocomplete options={basicOptions}>
        <Autocomplete.Input />
        <Autocomplete.List />
      </Autocomplete>,
    );
    expect(screen.getByTestId('autocomplete-root')).toBeInTheDocument();
  });
});
