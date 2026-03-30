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
import { DataGrid } from './DataGrid';
import type { ColumnDef } from '@relteco/relui-core';

const columns: ColumnDef[] = [
  { key: 'id', title: 'ID', sortable: true, filterable: true, width: 60 },
  { key: 'name', title: 'Name', sortable: true, filterable: true, editable: true },
  { key: 'age', title: 'Age', sortable: true, align: 'right' },
];

const data = [
  { id: 1, name: 'Ali', age: 30 },
  { id: 2, name: 'Veli', age: 25 },
  { id: 3, name: 'Ayse', age: 35 },
  { id: 4, name: 'Fatma', age: 28 },
  { id: 5, name: 'Mehmet', age: 40 },
];

describe('DataGrid', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<DataGrid columns={columns} data={data} />);
    expect(screen.getByTestId('data-grid-root')).toBeInTheDocument();
  });

  it('role grid set edilir', () => {
    render(<DataGrid columns={columns} data={data} />);
    expect(screen.getByTestId('data-grid-root')).toHaveAttribute('role', 'grid');
  });

  // ── Header ──

  it('header render edilir', () => {
    render(<DataGrid columns={columns} data={data} />);
    expect(screen.getByTestId('data-grid-header')).toBeInTheDocument();
  });

  it('sutun basliklari render edilir', () => {
    render(<DataGrid columns={columns} data={data} />);
    const cells = screen.getAllByTestId('data-grid-header-cell');
    expect(cells).toHaveLength(3);
    expect(cells[0]).toHaveTextContent('ID');
    expect(cells[1]).toHaveTextContent('Name');
    expect(cells[2]).toHaveTextContent('Age');
  });

  // ── Body ──

  it('satirlar render edilir', () => {
    render(<DataGrid columns={columns} data={data} />);
    const rows = screen.getAllByTestId('data-grid-row');
    expect(rows).toHaveLength(5);
  });

  it('hucre degerleri render edilir', () => {
    render(<DataGrid columns={columns} data={data} />);
    const cells = screen.getAllByTestId('data-grid-cell');
    expect(cells[0]).toHaveTextContent('1');
    expect(cells[1]).toHaveTextContent('Ali');
    expect(cells[2]).toHaveTextContent('30');
  });

  it('bos veri ile empty state gosterilir', () => {
    render(<DataGrid columns={columns} data={[]} />);
    expect(screen.getByTestId('data-grid-empty')).toBeInTheDocument();
  });

  // ── Sort ──

  it('sortable ile header tiklaninca sort ikonu gosterilir', () => {
    render(<DataGrid columns={columns} data={data} sortable />);
    const nameHeader = screen.getAllByTestId('data-grid-header-cell')[1];
    fireEvent.click(nameHeader);
    expect(screen.getByTestId('data-grid-sort-icon')).toBeInTheDocument();
  });

  it('siralama sonrasi veri yeniden siralanir', () => {
    render(<DataGrid columns={columns} data={data} sortable />);
    const nameHeader = screen.getAllByTestId('data-grid-header-cell')[1];
    fireEvent.click(nameHeader);
    const rows = screen.getAllByTestId('data-grid-row');
    const firstCells = rows.map((row) => row.querySelectorAll('[data-testid="data-grid-cell"]')[1]?.textContent);
    expect(firstCells[0]).toBe('Ali');
    expect(firstCells[1]).toBe('Ayse');
  });

  it('onSortChange callback cagrilir', () => {
    const onSortChange = vi.fn();
    render(<DataGrid columns={columns} data={data} sortable onSortChange={onSortChange} />);
    fireEvent.click(screen.getAllByTestId('data-grid-header-cell')[1]);
    expect(onSortChange).toHaveBeenCalled();
  });

  // ── Filter ──

  it('filterable ile filtre inputlari gosterilir', () => {
    render(<DataGrid columns={columns} data={data} filterable />);
    expect(screen.getByTestId('data-grid-filter-row')).toBeInTheDocument();
    expect(screen.getAllByTestId('data-grid-filter-input').length).toBeGreaterThan(0);
  });

  it('filtre ile satirlar filtrelenir', () => {
    render(<DataGrid columns={columns} data={data} filterable />);
    const filterInputs = screen.getAllByTestId('data-grid-filter-input');
    fireEvent.change(filterInputs[1], { target: { value: 'Ali' } });
    const rows = screen.getAllByTestId('data-grid-row');
    expect(rows).toHaveLength(1);
  });

  // ── Selection ──

  it('multiple selection ile checkbox gosterilir', () => {
    render(<DataGrid columns={columns} data={data} selectionMode="multiple" />);
    expect(screen.getByTestId('data-grid-select-all')).toBeInTheDocument();
    expect(screen.getAllByTestId('data-grid-row-checkbox')).toHaveLength(5);
  });

  it('checkbox ile satir secilir', () => {
    const onSelectionChange = vi.fn();
    render(<DataGrid columns={columns} data={data} selectionMode="multiple" onSelectionChange={onSelectionChange} />);
    const checkboxes = screen.getAllByTestId('data-grid-row-checkbox');
    fireEvent.click(checkboxes[0]);
    expect(onSelectionChange).toHaveBeenCalledWith(['1']);
  });

  it('select all ile tum satirlar secilir', () => {
    const onSelectionChange = vi.fn();
    render(<DataGrid columns={columns} data={data} selectionMode="multiple" onSelectionChange={onSelectionChange} />);
    fireEvent.click(screen.getByTestId('data-grid-select-all'));
    expect(onSelectionChange).toHaveBeenCalledWith(['1', '2', '3', '4', '5']);
  });

  // ── Pagination ──

  it('paginated ile footer ve pagination gosterilir', () => {
    render(<DataGrid columns={columns} data={data} paginated pageSize={2} />);
    expect(screen.getByTestId('data-grid-footer')).toBeInTheDocument();
    expect(screen.getByTestId('data-grid-pagination')).toBeInTheDocument();
  });

  it('paginated ile sadece pageSize kadar satir gosterilir', () => {
    render(<DataGrid columns={columns} data={data} paginated pageSize={2} />);
    expect(screen.getAllByTestId('data-grid-row')).toHaveLength(2);
  });

  it('sonraki sayfa butonuyla sayfa degisir', () => {
    render(<DataGrid columns={columns} data={data} paginated pageSize={2} />);
    fireEvent.click(screen.getByTestId('data-grid-next-page'));
    const rows = screen.getAllByTestId('data-grid-row');
    expect(rows).toHaveLength(2);
    expect(screen.getByTestId('data-grid-page-number')).toHaveTextContent('2 / 3');
  });

  it('ilk sayfada onceki buton disabled', () => {
    render(<DataGrid columns={columns} data={data} paginated pageSize={2} />);
    expect(screen.getByTestId('data-grid-prev-page')).toBeDisabled();
  });

  // ── Edit ──

  it('editable hucrede cift tiklayinca edit modu acilir', () => {
    render(<DataGrid columns={columns} data={data} />);
    const cells = screen.getAllByTestId('data-grid-cell');
    const nameCell = cells[1];
    fireEvent.doubleClick(nameCell);
    expect(screen.getByTestId('data-grid-edit-input')).toBeInTheDocument();
  });

  it('edit modda Enter ile commit yapilir', () => {
    const onEditCommit = vi.fn();
    render(<DataGrid columns={columns} data={data} onEditCommit={onEditCommit} />);
    const cells = screen.getAllByTestId('data-grid-cell');
    fireEvent.doubleClick(cells[1]);
    const input = screen.getByTestId('data-grid-edit-input');
    fireEvent.change(input, { target: { value: 'Yeni' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onEditCommit).toHaveBeenCalledWith('1', 'name', 'Yeni');
  });

  it('edit modda Escape ile iptal edilir', () => {
    render(<DataGrid columns={columns} data={data} />);
    const cells = screen.getAllByTestId('data-grid-cell');
    fireEvent.doubleClick(cells[1]);
    const input = screen.getByTestId('data-grid-edit-input');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByTestId('data-grid-edit-input')).not.toBeInTheDocument();
  });

  // ── Master-Detail ──

  it('renderDetail ile expand butonu gosterilir', () => {
    render(
      <DataGrid columns={columns} data={data} renderDetail={(row) => <p>Detail: {String(row['name'])}</p>} />,
    );
    expect(screen.getAllByTestId('data-grid-expand-btn')).toHaveLength(5);
  });

  it('expand butonu tiklaninca detail gosterilir', () => {
    render(
      <DataGrid columns={columns} data={data} renderDetail={(row) => <p>Detail: {String(row['name'])}</p>} />,
    );
    fireEvent.click(screen.getAllByTestId('data-grid-expand-btn')[0]);
    expect(screen.getByTestId('data-grid-detail')).toHaveTextContent('Detail: Ali');
  });

  // ── Footer ──

  it('footer toplam satir sayisi gosterilir', () => {
    render(<DataGrid columns={columns} data={data} />);
    expect(screen.getByTestId('data-grid-footer')).toHaveTextContent('5 satir');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<DataGrid columns={columns} data={data} className="my-grid" />);
    expect(screen.getByTestId('data-grid-root').className).toContain('my-grid');
  });

  it('style root elemana eklenir', () => {
    render(<DataGrid columns={columns} data={data} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('data-grid-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<DataGrid columns={columns} data={data} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('data-grid-root').className).toContain('custom-root');
  });

  it('classNames.header header elemana eklenir', () => {
    render(<DataGrid columns={columns} data={data} classNames={{ header: 'custom-header' }} />);
    expect(screen.getByTestId('data-grid-header').className).toContain('custom-header');
  });

  it('classNames.body body elemana eklenir', () => {
    render(<DataGrid columns={columns} data={data} classNames={{ body: 'custom-body' }} />);
    expect(screen.getByTestId('data-grid-body').className).toContain('custom-body');
  });

  it('classNames.footer footer elemana eklenir', () => {
    render(<DataGrid columns={columns} data={data} classNames={{ footer: 'custom-footer' }} />);
    expect(screen.getByTestId('data-grid-footer').className).toContain('custom-footer');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<DataGrid columns={columns} data={data} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('data-grid-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.header header elemana eklenir', () => {
    render(<DataGrid columns={columns} data={data} styles={{ header: { padding: '16px' } }} />);
    expect(screen.getByTestId('data-grid-header')).toHaveStyle({ padding: '16px' });
  });

  it('styles.body body elemana eklenir', () => {
    render(<DataGrid columns={columns} data={data} styles={{ body: { fontSize: '16px' } }} />);
    expect(screen.getByTestId('data-grid-body')).toHaveStyle({ fontSize: '16px' });
  });

  it('styles.footer footer elemana eklenir', () => {
    render(<DataGrid columns={columns} data={data} styles={{ footer: { padding: '12px' } }} />);
    expect(screen.getByTestId('data-grid-footer')).toHaveStyle({ padding: '12px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<DataGrid columns={columns} data={data} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('DataGrid (Compound)', () => {
  it('compound: toolbar render edilir', () => {
    render(
      <DataGrid columns={columns} data={data}>
        <DataGrid.Toolbar>Toolbar Icerik</DataGrid.Toolbar>
        <DataGrid.Header />
        <DataGrid.Body />
      </DataGrid>,
    );
    expect(screen.getByTestId('data-grid-toolbar')).toHaveTextContent('Toolbar Icerik');
  });

  it('compound: header + body render edilir', () => {
    render(
      <DataGrid columns={columns} data={data}>
        <DataGrid.Header />
        <DataGrid.Body />
      </DataGrid>,
    );
    expect(screen.getByTestId('data-grid-header')).toBeInTheDocument();
    expect(screen.getByTestId('data-grid-body')).toBeInTheDocument();
  });

  it('compound: footer render edilir', () => {
    render(
      <DataGrid columns={columns} data={data}>
        <DataGrid.Header />
        <DataGrid.Body />
        <DataGrid.Footer>Custom Footer</DataGrid.Footer>
      </DataGrid>,
    );
    expect(screen.getByTestId('data-grid-footer')).toHaveTextContent('Custom Footer');
  });

  it('compound: pagination render edilir', () => {
    render(
      <DataGrid columns={columns} data={data} paginated pageSize={2}>
        <DataGrid.Header />
        <DataGrid.Body />
        <DataGrid.Footer>
          <DataGrid.Pagination />
        </DataGrid.Footer>
      </DataGrid>,
    );
    expect(screen.getByTestId('data-grid-pagination')).toBeInTheDocument();
  });

  it('compound: column chooser render edilir', () => {
    render(
      <DataGrid columns={columns} data={data}>
        <DataGrid.Toolbar>
          <DataGrid.ColumnChooser />
        </DataGrid.Toolbar>
        <DataGrid.Header />
        <DataGrid.Body />
      </DataGrid>,
    );
    expect(screen.getByTestId('data-grid-column-chooser')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('data-grid-column-chooser-btn'));
    expect(screen.getByTestId('data-grid-column-chooser-panel')).toBeInTheDocument();
  });

  it('compound: export button render edilir', () => {
    render(
      <DataGrid columns={columns} data={data}>
        <DataGrid.Toolbar>
          <DataGrid.ExportButton format="csv" />
        </DataGrid.Toolbar>
        <DataGrid.Header />
        <DataGrid.Body />
      </DataGrid>,
    );
    expect(screen.getByTestId('data-grid-export-btn')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <DataGrid columns={columns} data={data} classNames={{ header: 'cmp-header' }}>
        <DataGrid.Header />
        <DataGrid.Body />
      </DataGrid>,
    );
    expect(screen.getByTestId('data-grid-header').className).toContain('cmp-header');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <DataGrid columns={columns} data={data} styles={{ body: { fontSize: '18px' } }}>
        <DataGrid.Header />
        <DataGrid.Body />
      </DataGrid>,
    );
    expect(screen.getByTestId('data-grid-body')).toHaveStyle({ fontSize: '18px' });
  });

  it('DataGrid.Header context disinda hata firlatir', () => {
    expect(() => render(<DataGrid.Header />)).toThrow();
  });
});
