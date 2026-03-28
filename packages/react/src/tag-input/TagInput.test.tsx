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
import { TagInput } from './TagInput';

// ── Test verileri / Test data ───────────────────────────────────────

const basicOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
];

const withDisabledOptions = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B', disabled: true },
  { value: 'c', label: 'C' },
];

/**
 * Helper — TagInput render eder.
 */
function renderTagInput(props: Record<string, unknown> = {}) {
  const defaultProps = {
    'aria-label': 'Teknolojiler',
    options: basicOptions,
    ...props,
  };
  return render(<TagInput {...defaultProps} />);
}

function getInput() {
  return screen.getByRole('combobox', { name: 'Teknolojiler' });
}

describe('TagInput', () => {
  // ── Render ──────────────────────────────────────────────────────

  it('render edilir / renders', () => {
    renderTagInput();
    expect(getInput()).toBeInTheDocument();
  });

  it('role combobox / role is combobox', () => {
    renderTagInput();
    expect(getInput()).toHaveAttribute('role', 'combobox');
  });

  it('aria-autocomplete list / aria-autocomplete is list', () => {
    renderTagInput();
    expect(getInput()).toHaveAttribute('aria-autocomplete', 'list');
  });

  it('aria-expanded false baslangicta / aria-expanded false initially', () => {
    renderTagInput();
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
  });

  it('ref forward edilir / ref is forwarded', () => {
    const ref = vi.fn();
    render(<TagInput ref={ref} options={basicOptions} aria-label="Teknolojiler" />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Placeholder ───────────────────────────────────────────────

  it('placeholder gosterilir / placeholder is shown', () => {
    renderTagInput({ placeholder: 'Teknoloji arayın' });
    expect(getInput()).toHaveAttribute('placeholder', 'Teknoloji arayın');
  });

  it('secim varken placeholder gizlenir / placeholder hidden when values exist', () => {
    renderTagInput({ defaultValue: ['react'], placeholder: 'Ara' });
    expect(getInput()).not.toHaveAttribute('placeholder');
  });

  // ── Tag'lar ────────────────────────────────────────────────────

  it('secili degerler tag olarak gosterilir / selected values shown as tags', () => {
    renderTagInput({ defaultValue: ['react', 'vue'] });
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
  });

  // ── Focus ile açılma ──────────────────────────────────────────

  it('focus ile dropdown acilir / dropdown opens on focus', () => {
    renderTagInput();
    fireEvent.focus(getInput());
    expect(getInput()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  // ── Arama / Filtreleme ────────────────────────────────────────

  it('yazinca filtreleme yapar / typing filters options', () => {
    renderTagInput();
    fireEvent.change(getInput(), { target: { value: 'rea' } });
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getByText('React')).toBeInTheDocument();
    expect(within(listbox).queryByText('Vue')).not.toBeInTheDocument();
  });

  it('eslesme yoksa sonuc bulunamadi / no match shows no results', () => {
    renderTagInput();
    fireEvent.change(getInput(), { target: { value: 'xyz' } });
    expect(screen.getByText('Sonuç bulunamadı')).toBeInTheDocument();
  });

  it('secili deger listeden cikarilir / selected value removed from list', () => {
    renderTagInput({ defaultValue: ['react'] });
    fireEvent.focus(getInput());
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).queryByText('React')).not.toBeInTheDocument();
    expect(within(listbox).getByText('Vue')).toBeInTheDocument();
  });

  // ── Seçim ─────────────────────────────────────────────────────

  it('tiklayinca secer / click selects', () => {
    const onValueChange = vi.fn();
    renderTagInput({ onValueChange });
    fireEvent.focus(getInput());
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText('Vue'));
    expect(onValueChange).toHaveBeenCalledWith(['vue']);
    expect(screen.getByText('Vue')).toBeInTheDocument();
  });

  it('Enter ile secer / selects with Enter', () => {
    const onValueChange = vi.fn();
    renderTagInput({ onValueChange });
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith(['react']);
  });

  it('secim sonrasi arama temizlenir / search cleared after selection', () => {
    renderTagInput();
    fireEvent.change(getInput(), { target: { value: 'rea' } });
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText('React'));
    expect(getInput()).toHaveValue('');
  });

  // ── Tag kaldırma ──────────────────────────────────────────────

  it('tag kaldir butonu ile kaldirir / removes with tag remove button', () => {
    const onValueChange = vi.fn();
    renderTagInput({ onValueChange, defaultValue: ['react', 'vue'] });
    const removeButtons = screen.getAllByLabelText('Kaldır');
    fireEvent.click(removeButtons[0]);
    expect(onValueChange).toHaveBeenCalledWith(['vue']);
  });

  it('Backspace ile son tag silinir / Backspace removes last tag', () => {
    const onValueChange = vi.fn();
    renderTagInput({ onValueChange, defaultValue: ['react', 'vue'] });
    fireEvent.keyDown(getInput(), { key: 'Backspace' });
    expect(onValueChange).toHaveBeenCalledWith(['react']);
  });

  // ── Clear all ─────────────────────────────────────────────────

  it('temizle butonu gorunur / clear button visible when values exist', () => {
    renderTagInput({ defaultValue: ['react'] });
    expect(screen.getByLabelText('Temizle')).toBeInTheDocument();
  });

  it('temizle butonu tum secimleri kaldirir / clear button removes all selections', () => {
    const onValueChange = vi.fn();
    renderTagInput({ onValueChange, defaultValue: ['react', 'vue'] });
    fireEvent.click(screen.getByLabelText('Temizle'));
    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  // ── Disabled ──────────────────────────────────────────────────

  it('disabled iken arama etkisiz / search ignored when disabled', () => {
    renderTagInput({ disabled: true });
    fireEvent.change(getInput(), { target: { value: 'test' } });
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
  });

  it('disabled data attribute / disabled data attribute', () => {
    renderTagInput({ disabled: true });
    expect(getInput()).toHaveAttribute('data-disabled', '');
  });

  // ── ReadOnly ──────────────────────────────────────────────────

  it('readOnly iken acilamaz / cannot open when readOnly', () => {
    renderTagInput({ readOnly: true });
    fireEvent.keyDown(getInput(), { key: 'ArrowDown' });
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
  });

  it('readOnly data attribute / readOnly data attribute', () => {
    renderTagInput({ readOnly: true });
    expect(getInput()).toHaveAttribute('data-readonly', '');
  });

  // ── Invalid ───────────────────────────────────────────────────

  it('invalid data attribute / invalid data attribute', () => {
    renderTagInput({ invalid: true });
    expect(getInput()).toHaveAttribute('data-invalid', '');
    expect(getInput()).toHaveAttribute('aria-invalid', 'true');
  });

  // ── Required ──────────────────────────────────────────────────

  it('required aria attribute / required aria attribute', () => {
    renderTagInput({ required: true });
    expect(getInput()).toHaveAttribute('aria-required', 'true');
  });

  // ── Disabled option ───────────────────────────────────────────

  it('disabled secenek tiklanamaz / disabled option cannot be clicked', () => {
    const onValueChange = vi.fn();
    render(<TagInput options={withDisabledOptions} aria-label="Teknolojiler" onValueChange={onValueChange} />);
    fireEvent.focus(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText('B'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  // ── Hidden input ──────────────────────────────────────────────

  it('name ile hidden input render edilir / hidden inputs rendered with name', () => {
    const { container } = renderTagInput({ name: 'tech', defaultValue: ['react', 'vue'] });
    const hiddens = container.querySelectorAll('input[type="hidden"]');
    expect(hiddens).toHaveLength(2);
    expect(hiddens[0]).toHaveAttribute('name', 'tech');
    expect(hiddens[0]).toHaveAttribute('value', 'react');
    expect(hiddens[1]).toHaveAttribute('value', 'vue');
  });

  // ── Sizes ─────────────────────────────────────────────────────

  it('farkli size render edilir / different size renders', () => {
    const { unmount } = render(
      <TagInput options={basicOptions} size="sm" aria-label="Kucuk" />,
    );
    const smEl = screen.getByRole('combobox');
    const smRecipe = smEl.closest('div')?.parentElement?.className;
    unmount();

    render(<TagInput options={basicOptions} size="xl" aria-label="Buyuk" />);
    const xlEl = screen.getByRole('combobox');
    const xlRecipe = xlEl.closest('div')?.parentElement?.className;

    expect(smRecipe).not.toBe(xlRecipe);
  });

  // ── Escape ────────────────────────────────────────────────────

  it('Escape ile kapanir / closes with Escape', () => {
    renderTagInput();
    fireEvent.focus(getInput());
    expect(getInput()).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(getInput(), { key: 'Escape' });
    expect(getInput()).toHaveAttribute('aria-expanded', 'false');
  });

  // ── allowCustomValue ──────────────────────────────────────────

  it('allowCustomValue ile serbest metin eklenir / custom text added with allowCustomValue', () => {
    const onValueChange = vi.fn();
    renderTagInput({ onValueChange, allowCustomValue: true });
    fireEvent.change(getInput(), { target: { value: 'solid' } });
    fireEvent.keyDown(getInput(), { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith(['solid']);
  });

  // ── Listbox multiselectable ───────────────────────────────────

  it('listbox aria-multiselectable / listbox aria-multiselectable', () => {
    renderTagInput();
    fireEvent.focus(getInput());
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
  });

  // ── classNames & styles ─────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    const { container } = renderTagInput({ classNames: { root: 'slot-root' } });
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = renderTagInput({ styles: { root: { padding: '10px' } } });
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = renderTagInput({
      className: 'legacy',
      classNames: { root: 'slot-root' },
    });
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveClass('legacy');
    expect(root).toHaveClass('slot-root');
  });

  it('classNames.input uygulanir', () => {
    renderTagInput({ classNames: { input: 'my-input' } });

    expect(getInput()).toHaveClass('my-input');
  });

  it('styles.listbox uygulanir', () => {
    renderTagInput({ styles: { listbox: { maxHeight: '200px' } } });
    fireEvent.focus(getInput());

    expect(screen.getByRole('listbox')).toHaveStyle({ maxHeight: '200px' });
  });

  it('classNames.option uygulanir', () => {
    renderTagInput({ classNames: { option: 'my-option' } });
    fireEvent.focus(getInput());

    const listbox = screen.getByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    options.forEach((opt) => {
      expect(opt).toHaveClass('my-option');
    });
  });

  // ── Slot API: styles ──

  it('styles.input uygulanir', () => {
    renderTagInput({ styles: { input: { fontSize: '18px' } } });
    expect(getInput()).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.option uygulanir', () => {
    renderTagInput({ styles: { option: { letterSpacing: '2px' } } });
    fireEvent.focus(getInput());

    const listbox = screen.getByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    options.forEach((opt) => {
      expect(opt).toHaveStyle({ letterSpacing: '2px' });
    });
  });
});

// ── Compound API ──────────────────────────────────────

describe('TagInput (Compound)', () => {
  it('compound: Tag sub-component render edilir', () => {
    render(
      <TagInput options={basicOptions} aria-label="Teknolojiler">
        <TagInput.Tag>Custom Tag</TagInput.Tag>
      </TagInput>,
    );
    expect(screen.getByTestId('tag-input-tag')).toHaveTextContent('Custom Tag');
  });

  it('compound: Input sub-component render edilir', () => {
    render(
      <TagInput options={basicOptions} aria-label="Teknolojiler">
        <TagInput.Input>
          <span data-testid="custom-input">Custom</span>
        </TagInput.Input>
      </TagInput>,
    );
    expect(screen.getByTestId('tag-input-input')).toBeInTheDocument();
    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });

  it('compound: root render edilir', () => {
    render(
      <TagInput options={basicOptions} aria-label="Teknolojiler">
        <TagInput.Tag>A</TagInput.Tag>
        <TagInput.Input />
      </TagInput>,
    );
    expect(screen.getByTestId('tag-input-root')).toBeInTheDocument();
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <TagInput options={basicOptions} aria-label="Teknolojiler" classNames={{ tag: 'cmp-tag' }}>
        <TagInput.Tag>Test</TagInput.Tag>
      </TagInput>,
    );
    expect(screen.getByTestId('tag-input-tag').className).toContain('cmp-tag');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <TagInput options={basicOptions} aria-label="Teknolojiler" styles={{ input: { padding: '10px' } }}>
        <TagInput.Input />
      </TagInput>,
    );
    expect(screen.getByTestId('tag-input-input')).toHaveStyle({ padding: '10px' });
  });
});
