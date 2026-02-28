/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MultiSelect } from './MultiSelect';

// ── Test verileri / Test data ───────────────────────────────────────

const basicOptions = [
  { value: 'tr', label: 'Türkiye' },
  { value: 'us', label: 'ABD' },
  { value: 'de', label: 'Almanya' },
];

const groupedOptions = [
  {
    label: 'Avrupa',
    options: [
      { value: 'de', label: 'Almanya' },
      { value: 'fr', label: 'Fransa' },
    ],
  },
  {
    label: 'Asya',
    options: [
      { value: 'tr', label: 'Türkiye' },
      { value: 'jp', label: 'Japonya' },
    ],
  },
];

const withDisabledOptions = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B', disabled: true },
  { value: 'c', label: 'C' },
];

/**
 * Helper — MultiSelect render eder.
 */
function renderMultiSelect(props: Record<string, unknown> = {}) {
  const defaultProps = {
    'aria-label': 'Ulke',
    options: basicOptions,
    ...props,
  };
  return render(<MultiSelect {...defaultProps} />);
}

function getTrigger() {
  return screen.getByRole('combobox', { name: 'Ulke' });
}

describe('MultiSelect', () => {
  // ── Render ──────────────────────────────────────────────────────

  it('render edilir / renders', () => {
    renderMultiSelect();
    expect(getTrigger()).toBeInTheDocument();
  });

  it('role combobox / role is combobox', () => {
    renderMultiSelect();
    expect(getTrigger()).toHaveAttribute('role', 'combobox');
  });

  it('aria-multiselectable true / aria-multiselectable is true', () => {
    renderMultiSelect();
    expect(getTrigger()).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('aria-expanded false baslangicta / aria-expanded false initially', () => {
    renderMultiSelect();
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('ref forward edilir / ref is forwarded', () => {
    const ref = vi.fn();
    render(<MultiSelect ref={ref} options={basicOptions} aria-label="Ulke" />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Placeholder ───────────────────────────────────────────────

  it('placeholder gosterilir / placeholder is shown', () => {
    renderMultiSelect({ placeholder: 'Ulke secin' });
    expect(getTrigger()).toHaveTextContent('Ulke secin');
  });

  it('secili degerler tag olarak gosterilir / selected values shown as tags', () => {
    renderMultiSelect({ value: ['tr', 'us'] });
    expect(getTrigger()).toHaveTextContent('Türkiye');
    expect(getTrigger()).toHaveTextContent('ABD');
  });

  // ── Acma / Kapama ─────────────────────────────────────────────

  it('tiklayinca acilir / opens on click', () => {
    renderMultiSelect();
    fireEvent.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('tekrar tiklayinca kapanir / closes on second click', () => {
    renderMultiSelect();
    fireEvent.click(getTrigger());
    fireEvent.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('secenekler acildiginda gosterilir / options shown when open', () => {
    renderMultiSelect();
    fireEvent.click(getTrigger());
    expect(screen.getByText('Türkiye')).toBeInTheDocument();
    expect(screen.getByText('ABD')).toBeInTheDocument();
    expect(screen.getByText('Almanya')).toBeInTheDocument();
  });

  // ── Secim ─────────────────────────────────────────────────────

  it('secim yapilir ve dropdown acik kalir / selection made and dropdown stays open', () => {
    const onValueChange = vi.fn();
    renderMultiSelect({ onValueChange });
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByText('ABD'));
    expect(onValueChange).toHaveBeenCalledWith(['us']);
    // Dropdown acik kalmali
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('birden fazla secim yapilir / multiple selections made', () => {
    const onValueChange = vi.fn();
    renderMultiSelect({ onValueChange });
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByText('Türkiye'));
    fireEvent.click(screen.getByText('Almanya'));
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(onValueChange).toHaveBeenLastCalledWith(['tr', 'de']);
  });

  it('secimi kaldirir toggle ile / removes selection with toggle', () => {
    const onValueChange = vi.fn();
    renderMultiSelect({ onValueChange, value: ['tr'] });
    fireEvent.click(getTrigger());
    // Listbox icindeki option'a tikla (tag'daki degil)
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText('Türkiye'));
    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it('onOpenChange acilinca cagrilir / onOpenChange called on open', () => {
    const onOpenChange = vi.fn();
    renderMultiSelect({ onOpenChange });
    fireEvent.click(getTrigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('onOpenChange kapaninca cagrilir / onOpenChange called on close', () => {
    const onOpenChange = vi.fn();
    renderMultiSelect({ onOpenChange });
    fireEvent.click(getTrigger());
    fireEvent.click(getTrigger());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── Klavye / Keyboard ─────────────────────────────────────────

  it('ArrowDown ile acilir / opens with ArrowDown', () => {
    renderMultiSelect();
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('ArrowUp ile acilir / opens with ArrowUp', () => {
    renderMultiSelect();
    fireEvent.keyDown(getTrigger(), { key: 'ArrowUp' });
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('Escape ile kapanir / closes with Escape', () => {
    renderMultiSelect();
    fireEvent.click(getTrigger());
    fireEvent.keyDown(getTrigger(), { key: 'Escape' });
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('Enter ile toggle eder / toggles with Enter', () => {
    const onValueChange = vi.fn();
    renderMultiSelect({ onValueChange });
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    // Ilk secenek highlight edili
    fireEvent.keyDown(getTrigger(), { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith(['tr']);
    // Dropdown acik kalmali
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('Space ile acilir / opens with Space', () => {
    renderMultiSelect();
    fireEvent.keyDown(getTrigger(), { key: ' ' });
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  // ── Disabled ──────────────────────────────────────────────────

  it('disabled iken tiklama etkisiz / click ignored when disabled', () => {
    renderMultiSelect({ disabled: true });
    fireEvent.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('disabled data attribute / disabled data attribute', () => {
    renderMultiSelect({ disabled: true });
    expect(getTrigger()).toHaveAttribute('data-disabled', '');
  });

  // ── ReadOnly ──────────────────────────────────────────────────

  it('readOnly iken acilamaz / cannot open when readOnly', () => {
    renderMultiSelect({ readOnly: true });
    fireEvent.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('readOnly data attribute / readOnly data attribute', () => {
    renderMultiSelect({ readOnly: true });
    expect(getTrigger()).toHaveAttribute('data-readonly', '');
  });

  // ── Invalid ───────────────────────────────────────────────────

  it('invalid data attribute / invalid data attribute', () => {
    renderMultiSelect({ invalid: true });
    expect(getTrigger()).toHaveAttribute('data-invalid', '');
    expect(getTrigger()).toHaveAttribute('aria-invalid', 'true');
  });

  // ── Required ──────────────────────────────────────────────────

  it('required aria attribute / required aria attribute', () => {
    renderMultiSelect({ required: true });
    expect(getTrigger()).toHaveAttribute('aria-required', 'true');
  });

  // ── Gruplu secenekler ─────────────────────────────────────────

  it('grup etiketleri gosterilir / group labels are shown', () => {
    render(<MultiSelect options={groupedOptions} aria-label="Ulke" />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Avrupa')).toBeInTheDocument();
    expect(screen.getByText('Asya')).toBeInTheDocument();
  });

  it('gruplu secenekten secim yapilir / selection from grouped option', () => {
    const onValueChange = vi.fn();
    render(<MultiSelect options={groupedOptions} aria-label="Ulke" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Japonya'));
    expect(onValueChange).toHaveBeenCalledWith(['jp']);
  });

  // ── Disabled option ───────────────────────────────────────────

  it('disabled secenek tiklanamaz / disabled option cannot be clicked', () => {
    const onValueChange = vi.fn();
    render(<MultiSelect options={withDisabledOptions} aria-label="Ulke" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('B'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  // ── Name / hidden input ───────────────────────────────────────

  it('name ile hidden input render edilir / hidden inputs rendered with name', () => {
    const { container } = renderMultiSelect({ name: 'country', value: ['tr', 'us'] });
    const hiddens = container.querySelectorAll('input[type="hidden"]');
    expect(hiddens).toHaveLength(2);
    expect(hiddens[0]).toHaveAttribute('name', 'country');
    expect(hiddens[0]).toHaveAttribute('value', 'tr');
    expect(hiddens[1]).toHaveAttribute('value', 'us');
  });

  // ── Variants & Sizes ──────────────────────────────────────────

  it('farkli variant render edilir / different variant renders', () => {
    renderMultiSelect({ variant: 'filled' });
    expect(getTrigger()).toBeInTheDocument();
  });

  it('farkli size render edilir / different size renders', () => {
    const { unmount } = render(
      <MultiSelect options={basicOptions} size="sm" aria-label="Kucuk" />,
    );
    const smClass = screen.getByRole('combobox').className;
    unmount();

    render(<MultiSelect options={basicOptions} size="xl" aria-label="Buyuk" />);
    const xlClass = screen.getByRole('combobox').className;

    expect(smClass).not.toBe(xlClass);
  });

  // ── Bos liste ─────────────────────────────────────────────────

  it('bos options bos mesaj gosterir / empty options shows empty message', () => {
    render(<MultiSelect options={[]} aria-label="Ulke" />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Seçenek yok')).toBeInTheDocument();
  });

  // ── MaxSelections ─────────────────────────────────────────────

  it('maxSelections asildiktan sonra secim yapilmaz / no selection after maxSelections', () => {
    const onValueChange = vi.fn();
    renderMultiSelect({ onValueChange, maxSelections: 2 });
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByText('Türkiye'));
    fireEvent.click(screen.getByText('ABD'));
    fireEvent.click(screen.getByText('Almanya'));
    // Sadece 2 kez cagrilmali
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(onValueChange).toHaveBeenLastCalledWith(['tr', 'us']);
  });

  // ── classNames & styles ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    const { container } = renderMultiSelect({ classNames: { root: 'slot-root' } });
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = renderMultiSelect({ styles: { root: { padding: '10px' } } });
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = renderMultiSelect({
      className: 'legacy',
      classNames: { root: 'slot-root' },
    });
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveClass('legacy');
    expect(root).toHaveClass('slot-root');
  });

  it('classNames.trigger uygulanir', () => {
    renderMultiSelect({ classNames: { trigger: 'my-trigger' } });

    expect(getTrigger()).toHaveClass('my-trigger');
  });

  it('styles.trigger uygulanir', () => {
    renderMultiSelect({ styles: { trigger: { fontSize: '15px' } } });

    expect(getTrigger()).toHaveStyle({ fontSize: '15px' });
  });

  it('classNames.listbox uygulanir', () => {
    renderMultiSelect({ classNames: { listbox: 'my-listbox' } });
    fireEvent.click(getTrigger());

    expect(screen.getByRole('listbox')).toHaveClass('my-listbox');
  });

  it('classNames.option uygulanir', () => {
    renderMultiSelect({ classNames: { option: 'my-option' } });
    fireEvent.click(getTrigger());

    const options = screen.getAllByRole('option');
    for (const opt of options) {
      expect(opt).toHaveClass('my-option');
    }
  });

  it('classNames.placeholder uygulanir', () => {
    renderMultiSelect({
      placeholder: 'Ulke secin',
      classNames: { placeholder: 'my-placeholder' },
    });
    const placeholder = getTrigger().querySelector('.my-placeholder');

    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('Ulke secin');
  });

  it('classNames.tag ve classNames.tagRemoveButton uygulanir', () => {
    renderMultiSelect({
      value: ['tr'],
      classNames: { tag: 'my-tag', tagRemoveButton: 'my-remove' },
    });
    const trigger = getTrigger();
    const tag = trigger.querySelector('.my-tag');
    const removeBtn = trigger.querySelector('.my-remove');

    expect(tag).toBeInTheDocument();
    expect(removeBtn).toBeInTheDocument();
  });
});
