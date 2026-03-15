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
import { Combobox } from './Combobox';

// ── Test verileri / Test data ───────────────────────────────────────

const basicOptions = [
  { value: 'tr', label: 'Türkiye' },
  { value: 'us', label: 'ABD' },
  { value: 'de', label: 'Almanya' },
];

const withDisabledOptions = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B', disabled: true },
  { value: 'c', label: 'C' },
];

/**
 * Helper — Combobox render eder.
 */
function renderCombobox(props: Record<string, unknown> = {}) {
  const defaultProps = {
    'aria-label': 'Ulke',
    options: basicOptions,
    ...props,
  };
  return render(<Combobox {...defaultProps} />);
}

function getInput() {
  return screen.getByRole('combobox', { name: 'Ulke' });
}

describe('Combobox', () => {
  // ── Render ──────────────────────────────────────────────────────

  it('render edilir / renders', () => {
    renderCombobox();
    expect(getInput()).toBeInTheDocument();
  });

  it('role combobox / role is combobox', () => {
    renderCombobox();
    expect(getInput()).toHaveAttribute('role', 'combobox');
  });

  it('aria-autocomplete list / aria-autocomplete is list', () => {
    renderCombobox();
    expect(getInput()).toHaveAttribute('aria-autocomplete', 'list');
  });

  it('aria-expanded false baslangicta / aria-expanded false initially', () => {
    renderCombobox();
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
  });

  it('ref forward edilir / ref is forwarded', () => {
    const ref = vi.fn();
    render(<Combobox ref={ref} options={basicOptions} aria-label="Ulke" />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Placeholder ───────────────────────────────────────────────

  it('placeholder gosterilir / placeholder is shown', () => {
    renderCombobox({ placeholder: 'Ulke arayin' });
    expect(getInput()).toHaveAttribute('placeholder', 'Ulke arayin');
  });

  it('secili deger gosterilir / selected value is shown', () => {
    renderCombobox({ value: 'tr' });
    expect(getInput()).toHaveValue('Türkiye');
  });

  // ── Focus ile açılma ───────────────────────────────────────────

  it('focus ile dropdown acilir / dropdown opens on focus', () => {
    renderCombobox();
    fireEvent.focus(getInput());
    expect(getInput()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('focus ile tum secenekler gosterilir / focus shows all options', () => {
    renderCombobox();
    fireEvent.focus(getInput());
    expect(screen.getByText('Türkiye')).toBeInTheDocument();
    expect(screen.getByText('ABD')).toBeInTheDocument();
    expect(screen.getByText('Almanya')).toBeInTheDocument();
  });

  // ── Arama / Filtreleme ────────────────────────────────────────

  it('yazinca dropdown acilir / dropdown opens on type', () => {
    renderCombobox();
    fireEvent.change(getInput(), { target: { value: 'tür' } });
    expect(getInput()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('yazinca filtreleme yapar / typing filters options', () => {
    renderCombobox();
    fireEvent.change(getInput(), { target: { value: 'tür' } });
    expect(screen.getByText('Türkiye')).toBeInTheDocument();
    expect(screen.queryByText('ABD')).not.toBeInTheDocument();
  });

  it('eslesme yoksa sonuc bulunamadi gosterir / no match shows no results', () => {
    renderCombobox();
    fireEvent.change(getInput(), { target: { value: 'xyz' } });
    expect(screen.getByText('Sonuc bulunamadi')).toBeInTheDocument();
  });

  it('onSearchChange cagrilir / onSearchChange is called', () => {
    const onSearchChange = vi.fn();
    renderCombobox({ onSearchChange });
    fireEvent.change(getInput(), { target: { value: 'test' } });
    expect(onSearchChange).toHaveBeenCalledWith('test');
  });

  // ── Acma / Kapama ─────────────────────────────────────────────

  it('ArrowDown ile acilir / opens with ArrowDown', () => {
    renderCombobox();
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    expect(getInput()).toHaveAttribute('aria-expanded', 'true');
  });

  it('Escape ile kapanir / closes with Escape', () => {
    renderCombobox();
    fireEvent.change(getInput(), { target: { value: 'a' } });
    fireEvent.keyDown(getInput(), { key: 'Escape' });
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
  });

  // ── Secim ─────────────────────────────────────────────────────

  it('tiklayinca secer ve kapatir / click selects and closes', () => {
    const onValueChange = vi.fn();
    renderCombobox({ onValueChange });
    fireEvent.change(getInput(), { target: { value: 'a' } });
    fireEvent.click(screen.getByText('ABD'));
    expect(onValueChange).toHaveBeenCalledWith('us');
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
    expect(getInput()).toHaveValue('ABD');
  });

  it('Enter ile secer / selects with Enter', () => {
    const onValueChange = vi.fn();
    renderCombobox({ onValueChange });
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    // Ilk secenek highlight edili
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('tr');
  });

  it('secim sonrasi arama temizlenir / search cleared after selection', () => {
    renderCombobox();
    fireEvent.change(getInput(), { target: { value: 'tür' } });
    fireEvent.click(screen.getByText('Türkiye'));
    expect(getInput()).toHaveValue('Türkiye');
  });

  it('onOpenChange acilinca cagrilir / onOpenChange called on open', () => {
    const onOpenChange = vi.fn();
    renderCombobox({ onOpenChange });
    fireEvent.change(getInput(), { target: { value: 'a' } });
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  // ── Klavye navigasyon ─────────────────────────────────────────

  it('ArrowUp ile acilir / opens with ArrowUp', () => {
    renderCombobox();
    fireEvent.keyDown(getInput(), { key: 'ArrowUp' });
    expect(getInput()).toHaveAttribute('aria-expanded', 'true');
  });

  it('ArrowDown ile navigate eder / navigates with ArrowDown', () => {
    renderCombobox();
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    // İlk seçenek highlighted
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    // İkinci seçenek highlighted
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(getInput()).toHaveValue('ABD');
  });

  // ── Disabled ──────────────────────────────────────────────────

  it('disabled iken arama etkisiz / search ignored when disabled', () => {
    renderCombobox({ disabled: true });
    fireEvent.change(getInput(), { target: { value: 'test' } });
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
  });

  it('disabled data attribute / disabled data attribute', () => {
    renderCombobox({ disabled: true });
    expect(getInput()).toHaveAttribute('data-disabled', '');
  });

  // ── ReadOnly ──────────────────────────────────────────────────

  it('readOnly iken acilamaz / cannot open when readOnly', () => {
    renderCombobox({ readOnly: true });
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
  });

  it('readOnly data attribute / readOnly data attribute', () => {
    renderCombobox({ readOnly: true });
    expect(getInput()).toHaveAttribute('data-readonly', '');
  });

  // ── Invalid ───────────────────────────────────────────────────

  it('invalid data attribute / invalid data attribute', () => {
    renderCombobox({ invalid: true });
    expect(getInput()).toHaveAttribute('data-invalid', '');
    expect(getInput()).toHaveAttribute('aria-invalid', 'true');
  });

  // ── Required ──────────────────────────────────────────────────

  it('required aria attribute / required aria attribute', () => {
    renderCombobox({ required: true });
    expect(getInput()).toHaveAttribute('aria-required', 'true');
  });

  // ── Disabled option ───────────────────────────────────────────

  it('disabled secenek tiklanamaz / disabled option cannot be clicked', () => {
    const onValueChange = vi.fn();
    render(<Combobox options={withDisabledOptions} aria-label="Ulke" onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    fireEvent.click(screen.getByText('B'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  // ── Name / hidden input ───────────────────────────────────────

  it('name ile hidden input render edilir / hidden input rendered with name', () => {
    const { container } = renderCombobox({ name: 'country', value: 'tr' });
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).toBeInTheDocument();
    expect(hidden).toHaveAttribute('name', 'country');
    expect(hidden).toHaveAttribute('value', 'tr');
  });

  // ── Variants & Sizes ──────────────────────────────────────────

  it('farkli variant render edilir / different variant renders', () => {
    renderCombobox({ variant: 'filled' });
    expect(getInput()).toBeInTheDocument();
  });

  it('farkli size render edilir / different size renders', () => {
    const { unmount } = render(
      <Combobox options={basicOptions} size="sm" aria-label="Kucuk" />,
    );
    const smClass = screen.getByRole('combobox').className;
    unmount();

    render(<Combobox options={basicOptions} size="xl" aria-label="Buyuk" />);
    const xlClass = screen.getByRole('combobox').className;

    expect(smClass).not.toBe(xlClass);
  });

  // ── Clear ─────────────────────────────────────────────────────

  it('temizle butonu secili degerken gorunur / clear button visible when value selected', () => {
    renderCombobox({ value: 'tr' });
    expect(screen.getByLabelText('Temizle')).toBeInTheDocument();
  });

  it('temizle butonu secimi kaldirir / clear button removes selection', () => {
    const onValueChange = vi.fn();
    renderCombobox({ onValueChange, value: 'tr' });
    fireEvent.click(screen.getByLabelText('Temizle'));
    expect(onValueChange).toHaveBeenCalledWith(undefined);
  });

  // ── classNames & styles ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    const { container } = renderCombobox({ classNames: { root: 'slot-root' } });
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = renderCombobox({ styles: { root: { padding: '10px' } } });
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = renderCombobox({
      className: 'legacy',
      classNames: { root: 'slot-root' },
    });
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveClass('legacy');
    expect(root).toHaveClass('slot-root');
  });

  it('style + styles.root birlestirilir', () => {
    const { container } = renderCombobox({
      style: { margin: '4px' },
      styles: { root: { padding: '10px' } },
    });
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveStyle({ margin: '4px' });
    expect(root).toHaveStyle({ padding: '10px' });
  });

  it('classNames.input uygulanir', () => {
    renderCombobox({ classNames: { input: 'my-input' } });

    expect(getInput()).toHaveClass('my-input');
  });

  it('styles.listbox uygulanir', () => {
    renderCombobox({ styles: { listbox: { maxHeight: '200px' } } });
    fireEvent.focus(getInput());

    expect(screen.getByRole('listbox')).toHaveStyle({ maxHeight: '200px' });
  });
});

// ── Compound API ──

describe('Combobox (Compound)', () => {
  it('compound: root render edilir', () => {
    render(
      <Combobox options={basicOptions}>
        <Combobox.Input />
        <Combobox.Content />
      </Combobox>,
    );
    expect(screen.getByTestId('combobox-root')).toBeInTheDocument();
  });

  it('compound: input render edilir', () => {
    render(
      <Combobox options={basicOptions}>
        <Combobox.Input />
        <Combobox.Content />
      </Combobox>,
    );
    expect(screen.getByTestId('combobox-input')).toBeInTheDocument();
  });

  it('compound: content focus ile acilir', () => {
    render(
      <Combobox options={basicOptions}>
        <Combobox.Input />
        <Combobox.Content />
      </Combobox>,
    );
    const input = screen.getByTestId('combobox-input');
    fireEvent.focus(input);
    expect(screen.getByTestId('combobox-content')).toBeInTheDocument();
  });

  it('compound: secim yapilir', () => {
    const onValueChange = vi.fn();
    render(
      <Combobox options={basicOptions} onValueChange={onValueChange}>
        <Combobox.Input />
        <Combobox.Content />
      </Combobox>,
    );
    const input = screen.getByTestId('combobox-input');
    fireEvent.focus(input);
    fireEvent.click(screen.getByText('ABD'));
    expect(onValueChange).toHaveBeenCalledWith('us');
  });

  it('compound: empty sonuc gosterir', () => {
    render(
      <Combobox options={basicOptions}>
        <Combobox.Input />
        <Combobox.Content />
      </Combobox>,
    );
    const input = screen.getByTestId('combobox-input');
    fireEvent.change(input, { target: { value: 'xyz' } });
    expect(screen.getByTestId('combobox-empty')).toBeInTheDocument();
  });
});
