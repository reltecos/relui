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
import { Select } from './Select';

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
 * Helper — Select render eder.
 */
function renderSelect(props: Record<string, unknown> = {}) {
  const defaultProps = {
    'aria-label': 'Ulke',
    options: basicOptions,
    ...props,
  };
  return render(<Select {...defaultProps} />);
}

function getTrigger() {
  return screen.getByRole('combobox', { name: 'Ulke' });
}

describe('Select', () => {
  // ── Render ──────────────────────────────────────────────────────

  it('render edilir / renders', () => {
    renderSelect();
    expect(getTrigger()).toBeInTheDocument();
  });

  it('role combobox / role is combobox', () => {
    renderSelect();
    expect(getTrigger()).toHaveAttribute('role', 'combobox');
  });

  it('aria-expanded false baslangicta / aria-expanded false initially', () => {
    renderSelect();
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('ref forward edilir / ref is forwarded', () => {
    const ref = vi.fn();
    render(<Select ref={ref} options={basicOptions} aria-label="Ulke" />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Placeholder ───────────────────────────────────────────────

  it('placeholder gosterilir / placeholder is shown', () => {
    renderSelect({ placeholder: 'Ulke secin' });
    expect(getTrigger()).toHaveTextContent('Ulke secin');
  });

  it('secili deger gosterilir / selected value is shown', () => {
    renderSelect({ value: 'tr' });
    expect(getTrigger()).toHaveTextContent('Türkiye');
  });

  // ── Acma / Kapama ─────────────────────────────────────────────

  it('tiklayinca acilir / opens on click', () => {
    renderSelect();
    fireEvent.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('tekrar tiklayinca kapanir / closes on second click', () => {
    renderSelect();
    fireEvent.click(getTrigger());
    fireEvent.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('secenekler acildiginda gosterilir / options shown when open', () => {
    renderSelect();
    fireEvent.click(getTrigger());
    expect(screen.getByText('Türkiye')).toBeInTheDocument();
    expect(screen.getByText('ABD')).toBeInTheDocument();
    expect(screen.getByText('Almanya')).toBeInTheDocument();
  });

  // ── Secim ─────────────────────────────────────────────────────

  it('secim yapilir ve kapanir / selection made and closes', () => {
    const onValueChange = vi.fn();
    renderSelect({ onValueChange });
    fireEvent.click(getTrigger());
    fireEvent.click(screen.getByText('ABD'));
    expect(onValueChange).toHaveBeenCalledWith('us');
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(getTrigger()).toHaveTextContent('ABD');
  });

  it('onOpenChange acilinca cagrilir / onOpenChange called on open', () => {
    const onOpenChange = vi.fn();
    renderSelect({ onOpenChange });
    fireEvent.click(getTrigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('onOpenChange kapaninca cagrilir / onOpenChange called on close', () => {
    const onOpenChange = vi.fn();
    renderSelect({ onOpenChange });
    fireEvent.click(getTrigger());
    fireEvent.click(getTrigger());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── Klavye / Keyboard ─────────────────────────────────────────

  it('ArrowDown ile acilir / opens with ArrowDown', () => {
    renderSelect();
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('ArrowUp ile acilir / opens with ArrowUp', () => {
    renderSelect();
    fireEvent.keyDown(getTrigger(), { key: 'ArrowUp' });
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('Escape ile kapanir / closes with Escape', () => {
    renderSelect();
    fireEvent.click(getTrigger());
    fireEvent.keyDown(getTrigger(), { key: 'Escape' });
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('Enter ile secer / selects with Enter', () => {
    const onValueChange = vi.fn();
    renderSelect({ onValueChange });
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    // Ilk secenek highlight edili
    fireEvent.keyDown(getTrigger(), { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('tr');
  });

  it('Space ile acilir / opens with Space', () => {
    renderSelect();
    fireEvent.keyDown(getTrigger(), { key: ' ' });
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  // ── Disabled ──────────────────────────────────────────────────

  it('disabled iken tiklama etkisiz / click ignored when disabled', () => {
    renderSelect({ disabled: true });
    fireEvent.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('disabled data attribute / disabled data attribute', () => {
    renderSelect({ disabled: true });
    expect(getTrigger()).toHaveAttribute('data-disabled', '');
  });

  // ── ReadOnly ──────────────────────────────────────────────────

  it('readOnly iken acilamaz / cannot open when readOnly', () => {
    renderSelect({ readOnly: true });
    fireEvent.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('readOnly data attribute / readOnly data attribute', () => {
    renderSelect({ readOnly: true });
    expect(getTrigger()).toHaveAttribute('data-readonly', '');
  });

  // ── Invalid ───────────────────────────────────────────────────

  it('invalid data attribute / invalid data attribute', () => {
    renderSelect({ invalid: true });
    expect(getTrigger()).toHaveAttribute('data-invalid', '');
    expect(getTrigger()).toHaveAttribute('aria-invalid', 'true');
  });

  // ── Required ──────────────────────────────────────────────────

  it('required aria attribute / required aria attribute', () => {
    renderSelect({ required: true });
    expect(getTrigger()).toHaveAttribute('aria-required', 'true');
  });

  // ── Gruplu secenekler ─────────────────────────────────────────

  it('grup etiketleri gosterilir / group labels are shown', () => {
    render(<Select options={groupedOptions} aria-label="Ulke" />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Avrupa')).toBeInTheDocument();
    expect(screen.getByText('Asya')).toBeInTheDocument();
  });

  it('gruplu secenekten secim yapilir / selection from grouped option', () => {
    const onValueChange = vi.fn();
    render(<Select options={groupedOptions} aria-label="Ulke" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Japonya'));
    expect(onValueChange).toHaveBeenCalledWith('jp');
  });

  // ── Disabled option ───────────────────────────────────────────

  it('disabled secenek tiklanamaz / disabled option cannot be clicked', () => {
    const onValueChange = vi.fn();
    render(<Select options={withDisabledOptions} aria-label="Ulke" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('B'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  // ── Name / hidden input ───────────────────────────────────────

  it('name ile hidden input render edilir / hidden input rendered with name', () => {
    const { container } = renderSelect({ name: 'country', value: 'tr' });
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).toBeInTheDocument();
    expect(hidden).toHaveAttribute('name', 'country');
    expect(hidden).toHaveAttribute('value', 'tr');
  });

  // ── Variants & Sizes ──────────────────────────────────────────

  it('farkli variant render edilir / different variant renders', () => {
    renderSelect({ variant: 'filled' });
    expect(getTrigger()).toBeInTheDocument();
  });

  it('farkli size render edilir / different size renders', () => {
    const { unmount } = render(
      <Select options={basicOptions} size="sm" aria-label="Kucuk" />,
    );
    const smClass = screen.getByRole('combobox').className;
    unmount();

    render(<Select options={basicOptions} size="xl" aria-label="Buyuk" />);
    const xlClass = screen.getByRole('combobox').className;

    expect(smClass).not.toBe(xlClass);
  });

  // ── Bos liste ─────────────────────────────────────────────────

  it('bos options bos mesaj gosterir / empty options shows empty message', () => {
    render(<Select options={[]} aria-label="Ulke" />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Secenek yok')).toBeInTheDocument();
  });

  // ── classNames & styles ─────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    const { container } = renderSelect({ classNames: { root: 'slot-root' } });
    const root = container.firstElementChild;
    expect(root).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = renderSelect({ styles: { root: { padding: '10px' } } });
    const root = container.firstElementChild;
    expect(root).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = renderSelect({
      className: 'legacy',
      classNames: { root: 'slot-root' },
    });
    const root = container.firstElementChild;
    expect(root).toHaveClass('legacy');
    expect(root).toHaveClass('slot-root');
  });

  it('classNames ve styles geri uyumluluk bozulmaz', () => {
    const { container } = renderSelect({ className: 'compat' });
    const root = container.firstElementChild;
    expect(root).toHaveClass('compat');
  });

  it('classNames.trigger uygulanir', () => {
    renderSelect({ classNames: { trigger: 'my-trigger' } });
    expect(getTrigger()).toHaveClass('my-trigger');
  });

  it('styles.trigger uygulanir', () => {
    renderSelect({ styles: { trigger: { fontWeight: 'bold' } } });
    expect(getTrigger()).toHaveStyle({ fontWeight: 'bold' });
  });

  it('classNames.listbox uygulanir', () => {
    renderSelect({ classNames: { listbox: 'my-listbox' } });
    fireEvent.click(getTrigger());
    expect(screen.getByRole('listbox')).toHaveClass('my-listbox');
  });

  it('styles.listbox uygulanir', () => {
    renderSelect({ styles: { listbox: { maxHeight: '200px' } } });
    fireEvent.click(getTrigger());
    expect(screen.getByRole('listbox')).toHaveStyle({ maxHeight: '200px' });
  });

  it('classNames.option uygulanir', () => {
    renderSelect({ classNames: { option: 'my-option' } });
    fireEvent.click(getTrigger());
    const options = screen.getAllByRole('option');
    options.forEach((opt) => {
      expect(opt).toHaveClass('my-option');
    });
  });

  it('styles.option uygulanir', () => {
    renderSelect({ styles: { option: { fontSize: '13px' } } });
    fireEvent.click(getTrigger());
    const options = screen.getAllByRole('option');
    options.forEach((opt) => {
      expect(opt).toHaveStyle({ fontSize: '13px' });
    });
  });

  it('classNames.groupLabel uygulanir', () => {
    render(
      <Select
        options={groupedOptions}
        aria-label="Ulke"
        classNames={{ groupLabel: 'my-group-label' }}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Avrupa')).toHaveClass('my-group-label');
    expect(screen.getByText('Asya')).toHaveClass('my-group-label');
  });

  it('styles.groupLabel uygulanir', () => {
    render(
      <Select
        options={groupedOptions}
        aria-label="Ulke"
        styles={{ groupLabel: { fontWeight: 'bold' } }}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Avrupa')).toHaveStyle({ fontWeight: 'bold' });
    expect(screen.getByText('Asya')).toHaveStyle({ fontWeight: 'bold' });
  });

  // ── Slot API: styles ──────────────────────────────────────────────

  it('styles.placeholder placeholder elemana uygulanir', () => {
    renderSelect({
      placeholder: 'Ulke secin',
      styles: { placeholder: { opacity: '0.5' } },
    });
    const trigger = getTrigger();
    const placeholder = trigger.querySelector('span');

    expect(placeholder).toHaveStyle({ opacity: '0.5' });
  });

  it('styles.value value elemana uygulanir', () => {
    renderSelect({
      value: 'tr',
      styles: { value: { fontWeight: '600' } },
    });
    const trigger = getTrigger();
    const valueSpan = trigger.querySelector('span');

    expect(valueSpan).toHaveStyle({ fontWeight: '600' });
  });
});

// ── Compound API ──

describe('Select (Compound)', () => {
  it('compound: root render edilir', () => {
    render(
      <Select options={basicOptions}>
        <Select.Trigger>
          <Select.Value placeholder="Ulke secin" />
        </Select.Trigger>
        <Select.Content />
      </Select>,
    );
    expect(screen.getByTestId('select-root')).toBeInTheDocument();
  });

  it('compound: trigger render edilir', () => {
    render(
      <Select options={basicOptions}>
        <Select.Trigger>
          <Select.Value placeholder="Ulke secin" />
        </Select.Trigger>
        <Select.Content />
      </Select>,
    );
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
  });

  it('compound: value placeholder gosterir', () => {
    render(
      <Select options={basicOptions}>
        <Select.Trigger>
          <Select.Value placeholder="Ulke secin" />
        </Select.Trigger>
        <Select.Content />
      </Select>,
    );
    expect(screen.getByTestId('select-value')).toHaveTextContent('Ulke secin');
  });

  it('compound: content acilir ve kapanir', () => {
    render(
      <Select options={basicOptions}>
        <Select.Trigger>
          <Select.Value placeholder="Ulke secin" />
        </Select.Trigger>
        <Select.Content />
      </Select>,
    );
    const trigger = screen.getByTestId('select-trigger');
    fireEvent.click(trigger);
    expect(screen.getByTestId('select-content')).toBeInTheDocument();
  });

  it('compound: secim yapilir', () => {
    const onValueChange = vi.fn();
    render(
      <Select options={basicOptions} onValueChange={onValueChange}>
        <Select.Trigger>
          <Select.Value placeholder="Ulke secin" />
        </Select.Trigger>
        <Select.Content />
      </Select>,
    );
    const trigger = screen.getByTestId('select-trigger');
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText('ABD'));
    expect(onValueChange).toHaveBeenCalledWith('us');
  });
});
