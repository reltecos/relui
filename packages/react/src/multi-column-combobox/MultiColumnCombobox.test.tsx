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
import { MultiColumnCombobox } from './MultiColumnCombobox';
import type { MCComboboxColumn, MCComboboxItem } from '@relteco/relui-core';

// ── Test verileri / Test data ───────────────────────────────────────

const columns: MCComboboxColumn[] = [
  { key: 'code', header: 'Kod', width: '4rem' },
  { key: 'name', header: 'İsim' },
  { key: 'dept', header: 'Departman' },
];

const items: MCComboboxItem[] = [
  { value: 1, label: 'Ali Yılmaz', data: { code: 'E001', name: 'Ali Yılmaz', dept: 'Mühendislik' } },
  { value: 2, label: 'Ayşe Demir', data: { code: 'E002', name: 'Ayşe Demir', dept: 'Pazarlama' } },
  { value: 3, label: 'Mehmet Kaya', data: { code: 'E003', name: 'Mehmet Kaya', dept: 'Mühendislik' } },
  { value: 4, label: 'Fatma Şahin', data: { code: 'E004', name: 'Fatma Şahin', dept: 'İK' }, disabled: true },
];

function renderDefault(overrides: Record<string, unknown> = {}) {
  return render(
    <MultiColumnCombobox
      columns={columns}
      items={items}
      placeholder="Çalışan arayın"
      {...overrides}
    />,
  );
}

// ── Render ──────────────────────────────────────────────────────────

describe('MultiColumnCombobox', () => {
  it('render edilir', () => {
    renderDefault();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('placeholder gösterir', () => {
    renderDefault();
    expect(screen.getByPlaceholderText('Çalışan arayın')).toBeInTheDocument();
  });

  it('defaultValue ile input label gösterir', () => {
    renderDefault({ defaultValue: 2 });
    expect(screen.getByRole('combobox')).toHaveValue('Ayşe Demir');
  });

  // ── Dropdown açma/kapama ──────────────────────────────────────────

  it('focus ile dropdown açılır', () => {
    renderDefault();
    fireEvent.focus(screen.getByRole('combobox'));
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('Escape ile dropdown kapanır', () => {
    renderDefault();
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  // ── Sütun başlıkları ─────────────────────────────────────────────

  it('sütun başlıklarını gösterir', () => {
    renderDefault();
    fireEvent.focus(screen.getByRole('combobox'));
    expect(screen.getByText('Kod')).toBeInTheDocument();
    expect(screen.getByText('İsim')).toBeInTheDocument();
    expect(screen.getByText('Departman')).toBeInTheDocument();
  });

  it('showHeaders=false başlıkları gizler', () => {
    renderDefault({ showHeaders: false });
    fireEvent.focus(screen.getByRole('combobox'));
    expect(screen.queryByText('Kod')).not.toBeInTheDocument();
  });

  // ── Veri satırları ────────────────────────────────────────────────

  it('tüm satır verilerini gösterir', () => {
    renderDefault();
    fireEvent.focus(screen.getByRole('combobox'));
    expect(screen.getByText('E001')).toBeInTheDocument();
    expect(screen.getByText('E002')).toBeInTheDocument();
    expect(screen.getByText('E003')).toBeInTheDocument();
    expect(screen.getByText('E004')).toBeInTheDocument();
    // Mühendislik birden fazla satırda var — getAllByText kullan
    expect(screen.getAllByText('Mühendislik')).toHaveLength(2);
    expect(screen.getByText('Pazarlama')).toBeInTheDocument();
  });

  // ── Filtreleme ────────────────────────────────────────────────────

  it('arama ile filtreler', () => {
    renderDefault();
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'pazarlama' } });
    // Sadece Ayşe (Pazarlama) görünmeli
    expect(screen.getByText('E002')).toBeInTheDocument();
    expect(screen.queryByText('E001')).not.toBeInTheDocument();
    expect(screen.queryByText('E003')).not.toBeInTheDocument();
  });

  it('sonuç yoksa "Sonuç bulunamadı" gösterir', () => {
    renderDefault();
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'zzzzz' } });
    expect(screen.getByText('Sonuç bulunamadı')).toBeInTheDocument();
  });

  // ── Seçim ─────────────────────────────────────────────────────────

  it('satıra tıklayarak seçer', () => {
    const onChange = vi.fn();
    renderDefault({ onValueChange: onChange });
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // İlk satıra (Ali) tıkla — row'ları bul
    const row = screen.getByText('E001').parentElement;
    expect(row).toBeTruthy();
    fireEvent.click(row as HTMLElement);
    expect(onChange).toHaveBeenCalledWith(1);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(input).toHaveValue('Ali Yılmaz');
  });

  it('disabled satır seçilemez', () => {
    const onChange = vi.fn();
    renderDefault({ onValueChange: onChange });
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    const disabledRow = screen.getByText('E004').parentElement;
    expect(disabledRow).toBeTruthy();
    fireEvent.click(disabledRow as HTMLElement);
    expect(onChange).not.toHaveBeenCalled();
    // Dropdown hala açık
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  // ── Klavye navigasyonu ────────────────────────────────────────────

  it('ArrowDown ile highlight eder', () => {
    renderDefault();
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // İlk item zaten highlight
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // İkinci item highlight olmalı
    const secondRow = document.getElementById('mccb-row-1');
    expect(secondRow?.getAttribute('data-highlighted')).toBe('');
  });

  it('Enter ile seçim yapar', () => {
    const onChange = vi.fn();
    renderDefault({ onValueChange: onChange });
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(1); // İlk item
  });

  // ── Temizleme ─────────────────────────────────────────────────────

  it('temizle butonu seçimi sıfırlar', () => {
    const onChange = vi.fn();
    renderDefault({ defaultValue: 1, onValueChange: onChange });
    const clearBtn = screen.getByLabelText('Temizle');
    fireEvent.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  // ── onOpenChange callback ─────────────────────────────────────────

  it('onOpenChange callback çağrılır', () => {
    const onOpen = vi.fn();
    renderDefault({ onOpenChange: onOpen });
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(onOpen).toHaveBeenCalledWith(true);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onOpen).toHaveBeenCalledWith(false);
  });

  // ── onSearchChange callback ───────────────────────────────────────

  it('onSearchChange callback çağrılır', () => {
    const onSearch = vi.fn();
    renderDefault({ onSearchChange: onSearch });
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'test' } });
    expect(onSearch).toHaveBeenCalledWith('test');
  });

  // ── Disabled / ReadOnly ───────────────────────────────────────────

  it('disabled durumda açılmaz', () => {
    renderDefault({ disabled: true });
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-disabled', 'true');
  });

  it('readOnly durumda açılmaz', () => {
    renderDefault({ readOnly: true });
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  // ── Props forwarding ──────────────────────────────────────────────

  it('id prop iletir', () => {
    const { container } = renderDefault({ id: 'my-mccb' });
    expect(container.querySelector('#my-mccb')).toBeInTheDocument();
  });

  it('aria-label prop iletir', () => {
    renderDefault({ 'aria-label': 'Çalışan seç' });
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', 'Çalışan seç');
  });

  it('className prop iletir', () => {
    const { container } = renderDefault({ className: 'custom-cls' });
    expect((container.firstElementChild as HTMLElement).classList.contains('custom-cls')).toBe(true);
  });

  it('name prop hidden input oluşturur', () => {
    const { container } = renderDefault({ name: 'employee', defaultValue: 1 });
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden).toBeInTheDocument();
    expect(hidden.name).toBe('employee');
    expect(hidden.value).toBe('1');
  });

  // ── classNames & styles slot API ──────────────────────────────────

  describe('classNames & styles', () => {
    it('classNames.root uygulanır', () => {
      const { container } = renderDefault({ classNames: { root: 'custom-root' } });
      expect((container.firstElementChild as HTMLElement).classList.contains('custom-root')).toBe(true);
    });

    it('styles.root uygulanır', () => {
      const { container } = renderDefault({ styles: { root: { padding: '99px' } } });
      expect((container.firstElementChild as HTMLElement).style.padding).toBe('99px');
    });

    it('classNames.input uygulanır', () => {
      renderDefault({ classNames: { input: 'custom-input' } });
      expect(screen.getByRole('combobox').classList.contains('custom-input')).toBe(true);
    });

    it('styles.input uygulanır', () => {
      renderDefault({ styles: { input: { letterSpacing: '5px' } } });
      expect(screen.getByRole('combobox').style.letterSpacing).toBe('5px');
    });

    it('classNames.row uygulanır', () => {
      renderDefault({ classNames: { row: 'custom-row' } });
      fireEvent.focus(screen.getByRole('combobox'));
      const row = document.getElementById('mccb-row-0');
      expect(row).toBeTruthy();
      expect((row as HTMLElement).classList.contains('custom-row')).toBe(true);
    });

    it('styles.cell uygulanır', () => {
      renderDefault({ styles: { cell: { fontSize: '20px' } } });
      fireEvent.focus(screen.getByRole('combobox'));
      const cells = screen.getAllByRole('gridcell');
      expect(cells[0].style.fontSize).toBe('20px');
    });

    it('classNames.headerCell uygulanır', () => {
      renderDefault({ classNames: { headerCell: 'custom-hdr' } });
      fireEvent.focus(screen.getByRole('combobox'));
      const headers = screen.getAllByRole('columnheader');
      expect(headers[0].classList.contains('custom-hdr')).toBe(true);
    });

    it('classNames.noResult uygulanır', () => {
      renderDefault({ classNames: { noResult: 'custom-noresult' } });
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'zzzz' } });
      expect(screen.getByText('Sonuç bulunamadı').classList.contains('custom-noresult')).toBe(true);
    });
  });
});

// ── Compound API ──────────────────────────────────────

describe('MultiColumnCombobox (Compound)', () => {
  it('compound: Input sub-component render edilir', () => {
    render(
      <MultiColumnCombobox columns={columns} items={items}>
        <MultiColumnCombobox.Input>
          <span data-testid="custom-input">Custom</span>
        </MultiColumnCombobox.Input>
      </MultiColumnCombobox>,
    );
    expect(screen.getByTestId('multi-column-combobox-input')).toBeInTheDocument();
    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });

  it('compound: Content sub-component render edilir', () => {
    render(
      <MultiColumnCombobox columns={columns} items={items}>
        <MultiColumnCombobox.Content>
          <div data-testid="custom-content">Icerik</div>
        </MultiColumnCombobox.Content>
      </MultiColumnCombobox>,
    );
    expect(screen.getByTestId('multi-column-combobox-content')).toBeInTheDocument();
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  it('compound: Column sub-component render edilir', () => {
    render(
      <MultiColumnCombobox columns={columns} items={items}>
        <MultiColumnCombobox.Column>Baslik</MultiColumnCombobox.Column>
      </MultiColumnCombobox>,
    );
    expect(screen.getByTestId('multi-column-combobox-column')).toHaveTextContent('Baslik');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <MultiColumnCombobox columns={columns} items={items} classNames={{ headerCell: 'cmp-hdr' }}>
        <MultiColumnCombobox.Column>Test</MultiColumnCombobox.Column>
      </MultiColumnCombobox>,
    );
    expect(screen.getByTestId('multi-column-combobox-column').className).toContain('cmp-hdr');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <MultiColumnCombobox columns={columns} items={items} styles={{ input: { fontSize: '18px' } }}>
        <MultiColumnCombobox.Input />
      </MultiColumnCombobox>,
    );
    expect(screen.getByTestId('multi-column-combobox-input')).toHaveStyle({ fontSize: '18px' });
  });
});
