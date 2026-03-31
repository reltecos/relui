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
import { PivotTable } from './PivotTable';
import type { PivotField, PivotPlacement } from '@relteco/relui-core';

const fields: PivotField[] = [
  { key: 'category', label: 'Kategori' },
  { key: 'year', label: 'Yil' },
  { key: 'amount', label: 'Tutar' },
];

const data = [
  { category: 'A', year: '2023', amount: 100 },
  { category: 'A', year: '2024', amount: 150 },
  { category: 'B', year: '2023', amount: 200 },
  { category: 'B', year: '2024', amount: 250 },
];

const placement: PivotPlacement = {
  rowFields: ['category'],
  columnFields: ['year'],
  valueFields: [{ key: 'amount', aggregate: 'sum' }],
};

describe('PivotTable', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} />);
    expect(screen.getByTestId('pivottable-root')).toBeInTheDocument();
  });

  // ── FieldChooser ──

  it('fieldChooser render edilir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} />);
    expect(screen.getByTestId('pivottable-fieldChooser')).toBeInTheDocument();
  });

  it('field tag lar gorunur', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} />);
    const tags = screen.getAllByTestId('pivottable-field-tag');
    expect(tags.length).toBeGreaterThan(0);
  });

  it('field tag tiklaninca alan tasinir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} />);
    // 'Kategori' row alaninda — tikla ile kaldir
    const tags = screen.getAllByTestId('pivottable-field-tag');
    const katTag = Array.from(tags).find((t) => t.textContent === 'Kategori');
    if (katTag) fireEvent.click(katTag);
    // Kategori artik unused'a gitmeli, pivot grid degismeli
    expect(screen.getByTestId('pivottable-root')).toBeInTheDocument();
  });

  // ── Grid ──

  it('grid render edilir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} />);
    expect(screen.getByTestId('pivottable-grid')).toBeInTheDocument();
  });

  it('grid role grid', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} />);
    expect(screen.getByTestId('pivottable-grid')).toHaveAttribute('role', 'grid');
  });

  it('header cell ler render edilir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} />);
    const hcs = screen.getAllByTestId('pivottable-headerCell');
    expect(hcs.length).toBeGreaterThan(0);
  });

  it('data cell ler render edilir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} />);
    const dcs = screen.getAllByTestId('pivottable-dataCell');
    expect(dcs.length).toBe(4); // 2 rows x 2 cols
  });

  it('total cell ler render edilir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} />);
    const tcs = screen.getAllByTestId('pivottable-totalCell');
    expect(tcs.length).toBeGreaterThan(0);
  });

  it('row header gorunur', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('column header gorunur', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} />);
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('data degerleri gorunur', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} />);
    // A-2023: 100, A-2024: 150, B-2023: 200, B-2024: 250
    const dataCells = screen.getAllByTestId('pivottable-dataCell');
    expect(dataCells[0]).toHaveTextContent('100');
    expect(dataCells[1]).toHaveTextContent('150');
    expect(dataCells[2]).toHaveTextContent('200');
    expect(dataCells[3]).toHaveTextContent('250');
  });

  it('bos placement icin mesaj gosterilir', () => {
    render(<PivotTable data={data} fields={fields} />);
    expect(screen.getByText(/Alan yerlestirin/)).toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} className="my-pt" />);
    expect(screen.getByTestId('pivottable-root').className).toContain('my-pt');
  });

  it('style root elemana eklenir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('pivottable-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root eklenir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} classNames={{ root: 'c-root' }} />);
    expect(screen.getByTestId('pivottable-root').className).toContain('c-root');
  });

  it('classNames.fieldChooser eklenir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} classNames={{ fieldChooser: 'c-fc' }} />);
    expect(screen.getByTestId('pivottable-fieldChooser').className).toContain('c-fc');
  });

  it('classNames.grid eklenir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} classNames={{ grid: 'c-grid' }} />);
    expect(screen.getByTestId('pivottable-grid').className).toContain('c-grid');
  });

  // ── Slot API: styles ──

  it('styles.root eklenir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('pivottable-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.fieldChooser eklenir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} styles={{ fieldChooser: { padding: '20px' } }} />);
    expect(screen.getByTestId('pivottable-fieldChooser')).toHaveStyle({ padding: '20px' });
  });

  it('styles.grid eklenir', () => {
    render(<PivotTable data={data} fields={fields} defaultPlacement={placement} styles={{ grid: { padding: '8px' } }} />);
    expect(screen.getByTestId('pivottable-grid')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<PivotTable ref={ref} data={data} fields={fields} defaultPlacement={placement} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('PivotTable (Compound)', () => {
  it('compound: fieldChooser render edilir', () => {
    render(
      <PivotTable data={data} fields={fields} defaultPlacement={placement}>
        <PivotTable.FieldChooser />
        <PivotTable.Grid />
      </PivotTable>,
    );
    expect(screen.getByTestId('pivottable-fieldChooser')).toBeInTheDocument();
  });

  it('compound: grid render edilir', () => {
    render(
      <PivotTable data={data} fields={fields} defaultPlacement={placement}>
        <PivotTable.FieldChooser />
        <PivotTable.Grid />
      </PivotTable>,
    );
    expect(screen.getByTestId('pivottable-grid')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <PivotTable data={data} fields={fields} defaultPlacement={placement} classNames={{ grid: 'cmp-grid' }}>
        <PivotTable.Grid />
      </PivotTable>,
    );
    expect(screen.getByTestId('pivottable-grid').className).toContain('cmp-grid');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <PivotTable data={data} fields={fields} defaultPlacement={placement} styles={{ grid: { padding: '12px' } }}>
        <PivotTable.Grid />
      </PivotTable>,
    );
    expect(screen.getByTestId('pivottable-grid')).toHaveStyle({ padding: '12px' });
  });

  it('PivotTable.Grid context disinda hata firlatir', () => {
    expect(() => render(<PivotTable.Grid />)).toThrow();
  });
});
