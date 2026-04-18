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
import { Spreadsheet } from './Spreadsheet';

describe('Spreadsheet', () => {
  const smallProps = { columns: 5, rows: 5 };

  // ── Root ──

  it('root render edilir', () => {
    render(<Spreadsheet {...smallProps} />);
    expect(screen.getByTestId('spreadsheet-root')).toBeInTheDocument();
  });

  // ── Toolbar ──

  it('toolbar render edilir', () => {
    render(<Spreadsheet {...smallProps} />);
    expect(screen.getByTestId('spreadsheet-toolbar')).toBeInTheDocument();
  });

  it('undo butonu render edilir', () => {
    render(<Spreadsheet {...smallProps} />);
    expect(screen.getByTestId('spreadsheet-undo')).toBeInTheDocument();
  });

  it('redo butonu render edilir', () => {
    render(<Spreadsheet {...smallProps} />);
    expect(screen.getByTestId('spreadsheet-redo')).toBeInTheDocument();
  });

  it('undo baslangicta disabled', () => {
    render(<Spreadsheet {...smallProps} />);
    expect(screen.getByTestId('spreadsheet-undo')).toBeDisabled();
  });

  // ── FormulaBar ──

  it('formula bar render edilir', () => {
    render(<Spreadsheet {...smallProps} />);
    expect(screen.getByTestId('spreadsheet-formulaBar')).toBeInTheDocument();
  });

  it('cell address A1 gorunur', () => {
    render(<Spreadsheet {...smallProps} />);
    expect(screen.getByTestId('spreadsheet-cellAddress')).toHaveTextContent('A1');
  });

  it('formula input render edilir', () => {
    render(<Spreadsheet {...smallProps} />);
    expect(screen.getByTestId('spreadsheet-formulaInput')).toBeInTheDocument();
  });

  // ── Grid ──

  it('grid render edilir', () => {
    render(<Spreadsheet {...smallProps} />);
    expect(screen.getByTestId('spreadsheet-grid')).toBeInTheDocument();
  });

  it('grid role grid', () => {
    render(<Spreadsheet {...smallProps} />);
    const table = screen.getByTestId('spreadsheet-grid').querySelector('table');
    expect(table).toHaveAttribute('role', 'grid');
  });

  it('sutun basliklari render edilir', () => {
    render(<Spreadsheet {...smallProps} />);
    const colHeaders = screen.getAllByTestId('spreadsheet-colHeader');
    expect(colHeaders.length).toBe(5);
    expect(colHeaders[0]).toHaveTextContent('A');
    expect(colHeaders[4]).toHaveTextContent('E');
  });

  it('satir basliklari render edilir', () => {
    render(<Spreadsheet {...smallProps} />);
    const rowHeaders = screen.getAllByTestId('spreadsheet-rowHeader');
    expect(rowHeaders.length).toBe(5);
    expect(rowHeaders[0]).toHaveTextContent('1');
  });

  it('hucreler render edilir', () => {
    render(<Spreadsheet {...smallProps} />);
    const cells = screen.getAllByTestId('spreadsheet-cell');
    expect(cells.length).toBe(25); // 5x5
  });

  it('hucre role gridcell', () => {
    render(<Spreadsheet {...smallProps} />);
    const cells = screen.getAllByTestId('spreadsheet-cell');
    expect(cells[0]).toHaveAttribute('role', 'gridcell');
  });

  // ── Cell Selection ──

  it('hucre tikla ile secilir', () => {
    render(<Spreadsheet {...smallProps} />);
    const cells = screen.getAllByTestId('spreadsheet-cell');
    fireEvent.click(cells[6] as HTMLElement); // row 1, col 1 (B2)
    expect(cells[6]).toHaveAttribute('data-selected', 'true');
  });

  it('hucre secimi cell address gunceller', () => {
    render(<Spreadsheet {...smallProps} />);
    const cells = screen.getAllByTestId('spreadsheet-cell');
    fireEvent.click(cells[1] as HTMLElement); // row 0, col 1 (B1)
    expect(screen.getByTestId('spreadsheet-cellAddress')).toHaveTextContent('B1');
  });

  // ── Cell Editing ──

  it('cift tikla ile duzenleme baslar', () => {
    render(<Spreadsheet {...smallProps} />);
    const cells = screen.getAllByTestId('spreadsheet-cell');
    fireEvent.doubleClick(cells[0] as HTMLElement);
    expect(screen.getByTestId('spreadsheet-cellEdit')).toBeInTheDocument();
  });

  it('Enter ile duzenleme tamamlanir', () => {
    render(<Spreadsheet {...smallProps} />);
    const cells = screen.getAllByTestId('spreadsheet-cell');
    fireEvent.doubleClick(cells[0] as HTMLElement);
    const input = screen.getByTestId('spreadsheet-cellEdit') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getAllByTestId('spreadsheet-cell')[0]).toHaveTextContent('Hello');
  });

  // ── Sheet Tabs ──

  it('sheet tabs render edilir', () => {
    render(<Spreadsheet {...smallProps} />);
    expect(screen.getByTestId('spreadsheet-sheetTabs')).toBeInTheDocument();
  });

  it('sheet tab gorunur', () => {
    render(<Spreadsheet {...smallProps} />);
    const tabs = screen.getAllByTestId('spreadsheet-sheetTab');
    expect(tabs.length).toBe(1);
    expect(tabs[0]).toHaveTextContent('Sheet 1');
  });

  it('add sheet butonu calisir', () => {
    render(<Spreadsheet {...smallProps} />);
    fireEvent.click(screen.getByTestId('spreadsheet-addSheet'));
    const tabs = screen.getAllByTestId('spreadsheet-sheetTab');
    expect(tabs.length).toBe(2);
  });

  it('sheet tab role tab', () => {
    render(<Spreadsheet {...smallProps} />);
    expect(screen.getByTestId('spreadsheet-sheetTab')).toHaveAttribute('role', 'tab');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Spreadsheet {...smallProps} className="my-ss" />);
    expect(screen.getByTestId('spreadsheet-root').className).toContain('my-ss');
  });

  it('style root elemana eklenir', () => {
    render(<Spreadsheet {...smallProps} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('spreadsheet-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Spreadsheet {...smallProps} classNames={{ root: 'c-root' }} />);
    expect(screen.getByTestId('spreadsheet-root').className).toContain('c-root');
  });

  it('classNames.toolbar toolbar elemana eklenir', () => {
    render(<Spreadsheet {...smallProps} classNames={{ toolbar: 'c-tb' }} />);
    expect(screen.getByTestId('spreadsheet-toolbar').className).toContain('c-tb');
  });

  it('classNames.formulaBar formulaBar elemana eklenir', () => {
    render(<Spreadsheet {...smallProps} classNames={{ formulaBar: 'c-fb' }} />);
    expect(screen.getByTestId('spreadsheet-formulaBar').className).toContain('c-fb');
  });

  it('classNames.grid grid elemana eklenir', () => {
    render(<Spreadsheet {...smallProps} classNames={{ grid: 'c-grid' }} />);
    expect(screen.getByTestId('spreadsheet-grid').className).toContain('c-grid');
  });

  it('classNames.sheetTabs sheetTabs elemana eklenir', () => {
    render(<Spreadsheet {...smallProps} classNames={{ sheetTabs: 'c-tabs' }} />);
    expect(screen.getByTestId('spreadsheet-sheetTabs').className).toContain('c-tabs');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Spreadsheet {...smallProps} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('spreadsheet-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.toolbar toolbar elemana eklenir', () => {
    render(<Spreadsheet {...smallProps} styles={{ toolbar: { padding: '8px' } }} />);
    expect(screen.getByTestId('spreadsheet-toolbar')).toHaveStyle({ padding: '8px' });
  });

  it('styles.formulaBar formulaBar elemana eklenir', () => {
    render(<Spreadsheet {...smallProps} styles={{ formulaBar: { padding: '6px' } }} />);
    expect(screen.getByTestId('spreadsheet-formulaBar')).toHaveStyle({ padding: '6px' });
  });

  it('styles.grid grid elemana eklenir', () => {
    render(<Spreadsheet {...smallProps} styles={{ grid: { padding: '4px' } }} />);
    expect(screen.getByTestId('spreadsheet-grid')).toHaveStyle({ padding: '4px' });
  });

  it('styles.sheetTabs sheetTabs elemana eklenir', () => {
    render(<Spreadsheet {...smallProps} styles={{ sheetTabs: { padding: '2px' } }} />);
    expect(screen.getByTestId('spreadsheet-sheetTabs')).toHaveStyle({ padding: '2px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Spreadsheet ref={ref} {...smallProps} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Spreadsheet (Compound)', () => {
  const smallProps = { columns: 3, rows: 3 };

  it('compound: toolbar render edilir', () => {
    render(
      <Spreadsheet {...smallProps}>
        <Spreadsheet.Toolbar />
        <Spreadsheet.FormulaBar />
        <Spreadsheet.Grid />
        <Spreadsheet.SheetTabs />
      </Spreadsheet>,
    );
    expect(screen.getByTestId('spreadsheet-toolbar')).toBeInTheDocument();
  });

  it('compound: formulaBar render edilir', () => {
    render(
      <Spreadsheet {...smallProps}>
        <Spreadsheet.FormulaBar />
        <Spreadsheet.Grid />
      </Spreadsheet>,
    );
    expect(screen.getByTestId('spreadsheet-formulaBar')).toBeInTheDocument();
  });

  it('compound: grid render edilir', () => {
    render(
      <Spreadsheet {...smallProps}>
        <Spreadsheet.Grid />
      </Spreadsheet>,
    );
    expect(screen.getByTestId('spreadsheet-grid')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Spreadsheet {...smallProps} classNames={{ grid: 'cmp-grid' }}>
        <Spreadsheet.Grid />
      </Spreadsheet>,
    );
    expect(screen.getByTestId('spreadsheet-grid').className).toContain('cmp-grid');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Spreadsheet {...smallProps} styles={{ toolbar: { padding: '20px' } }}>
        <Spreadsheet.Toolbar />
        <Spreadsheet.Grid />
      </Spreadsheet>,
    );
    expect(screen.getByTestId('spreadsheet-toolbar')).toHaveStyle({ padding: '20px' });
  });

  it('Spreadsheet.Grid context disinda hata firlatir', () => {
    expect(() => render(<Spreadsheet.Grid />)).toThrow();
  });
});
