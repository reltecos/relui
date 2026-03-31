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
import { TreeGrid } from './TreeGrid';
import type { TreeGridColumnDef, TreeGridRowDef } from '@relteco/relui-core';

const cols: TreeGridColumnDef[] = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'size', title: 'Size', sortable: true, align: 'right' },
];

const rows: TreeGridRowDef[] = [
  {
    id: 'src', cells: { name: 'src', size: '-' },
    children: [
      { id: 'index', cells: { name: 'index.ts', size: '1.2KB' } },
      { id: 'app', cells: { name: 'App.tsx', size: '3.4KB' } },
    ],
  },
  { id: 'readme', cells: { name: 'README.md', size: '0.8KB' } },
];

describe('TreeGrid', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    expect(screen.getByTestId('treegrid-root')).toBeInTheDocument();
  });

  it('root role treegrid', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    expect(screen.getByTestId('treegrid-root')).toHaveAttribute('role', 'treegrid');
  });

  // ── Header ──

  it('header render edilir', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    expect(screen.getByTestId('treegrid-header')).toBeInTheDocument();
  });

  it('header cell ler render edilir', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    const cells = screen.getAllByTestId('treegrid-headerCell');
    expect(cells.length).toBe(2);
    expect(cells[0]).toHaveTextContent('Name');
    expect(cells[1]).toHaveTextContent('Size');
  });

  it('header cell role columnheader', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    expect(screen.getAllByTestId('treegrid-headerCell')[0]).toHaveAttribute('role', 'columnheader');
  });

  // ── Rows ──

  it('satirlar render edilir', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    const rowEls = screen.getAllByTestId('treegrid-row');
    expect(rowEls.length).toBe(2); // Only root level
  });

  it('satir verileri gorunur', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    expect(screen.getByText('src')).toBeInTheDocument();
    expect(screen.getByText('README.md')).toBeInTheDocument();
  });

  it('satir role row', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    expect(screen.getAllByTestId('treegrid-row')[0]).toHaveAttribute('role', 'row');
  });

  it('cell role gridcell', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    expect(screen.getAllByTestId('treegrid-cell')[0]).toHaveAttribute('role', 'gridcell');
  });

  // ── Expand/Collapse ──

  it('expand button ile alt satirlar gorunur', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    fireEvent.click(screen.getByTestId('treegrid-expandButton'));
    expect(screen.getByText('index.ts')).toBeInTheDocument();
    expect(screen.getByText('App.tsx')).toBeInTheDocument();
  });

  it('tekrar click ile alt satirlar kapanir', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    fireEvent.click(screen.getByTestId('treegrid-expandButton'));
    expect(screen.getByText('index.ts')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('treegrid-expandButton'));
    expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
  });

  it('defaultExpanded ile baslangicta acik', () => {
    render(<TreeGrid columns={cols} rows={rows} defaultExpanded={['src']} />);
    expect(screen.getByText('index.ts')).toBeInTheDocument();
  });

  it('aria-expanded set edilir', () => {
    render(<TreeGrid columns={cols} rows={rows} defaultExpanded={['src']} />);
    const row = screen.getAllByTestId('treegrid-row')[0];
    expect(row).toHaveAttribute('aria-expanded', 'true');
  });

  it('aria-level set edilir', () => {
    render(<TreeGrid columns={cols} rows={rows} defaultExpanded={['src']} />);
    const rowEls = screen.getAllByTestId('treegrid-row');
    expect(rowEls[0]).toHaveAttribute('aria-level', '1');
    expect(rowEls[1]).toHaveAttribute('aria-level', '2'); // child
  });

  // ── Sort ──

  it('header click ile siralama baslar', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    fireEvent.click(screen.getAllByTestId('treegrid-headerCell')[0] as HTMLElement);
    const hc = screen.getAllByTestId('treegrid-headerCell')[0];
    expect(hc).toHaveAttribute('aria-sort', 'ascending');
  });

  it('ikinci click desc olur', () => {
    render(<TreeGrid columns={cols} rows={rows} />);
    const hc = screen.getAllByTestId('treegrid-headerCell')[0] as HTMLElement;
    fireEvent.click(hc);
    fireEvent.click(hc);
    expect(hc).toHaveAttribute('aria-sort', 'descending');
  });

  // ── Selection ──

  it('satir tikla ile secilir (single mod)', () => {
    render(<TreeGrid columns={cols} rows={rows} selectionMode="single" />);
    fireEvent.click(screen.getAllByTestId('treegrid-row')[0] as HTMLElement);
    expect(screen.getAllByTestId('treegrid-row')[0]).toHaveAttribute('data-selected', 'true');
  });

  it('onSelectionChange cagirilir', () => {
    const fn = vi.fn();
    render(<TreeGrid columns={cols} rows={rows} selectionMode="single" onSelectionChange={fn} />);
    fireEvent.click(screen.getAllByTestId('treegrid-row')[0] as HTMLElement);
    expect(fn).toHaveBeenCalled();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<TreeGrid columns={cols} rows={rows} className="my-tg" />);
    expect(screen.getByTestId('treegrid-root').className).toContain('my-tg');
  });

  it('style root elemana eklenir', () => {
    render(<TreeGrid columns={cols} rows={rows} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('treegrid-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root eklenir', () => {
    render(<TreeGrid columns={cols} rows={rows} classNames={{ root: 'c-root' }} />);
    expect(screen.getByTestId('treegrid-root').className).toContain('c-root');
  });

  it('classNames.header eklenir', () => {
    render(<TreeGrid columns={cols} rows={rows} classNames={{ header: 'c-hdr' }} />);
    expect(screen.getByTestId('treegrid-header').className).toContain('c-hdr');
  });

  it('classNames.body eklenir', () => {
    render(<TreeGrid columns={cols} rows={rows} classNames={{ body: 'c-body' }} />);
    expect(screen.getByTestId('treegrid-body').className).toContain('c-body');
  });

  // ── Slot API: styles ──

  it('styles.root eklenir', () => {
    render(<TreeGrid columns={cols} rows={rows} styles={{ root: { padding: '20px' } }} />);
    expect(screen.getByTestId('treegrid-root')).toHaveStyle({ padding: '20px' });
  });

  it('styles.header eklenir', () => {
    render(<TreeGrid columns={cols} rows={rows} styles={{ header: { padding: '8px' } }} />);
    expect(screen.getByTestId('treegrid-header')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<TreeGrid ref={ref} columns={cols} rows={rows} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound ──

describe('TreeGrid (Compound)', () => {
  it('compound: header render edilir', () => {
    render(
      <TreeGrid columns={cols}>
        <TreeGrid.Header />
        <TreeGrid.Body rows={rows} />
      </TreeGrid>,
    );
    expect(screen.getByTestId('treegrid-header')).toBeInTheDocument();
  });

  it('compound: body render edilir', () => {
    render(
      <TreeGrid columns={cols}>
        <TreeGrid.Header />
        <TreeGrid.Body rows={rows} />
      </TreeGrid>,
    );
    expect(screen.getByTestId('treegrid-body')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <TreeGrid columns={cols} classNames={{ header: 'cmp-hdr' }}>
        <TreeGrid.Header />
        <TreeGrid.Body rows={rows} />
      </TreeGrid>,
    );
    expect(screen.getByTestId('treegrid-header').className).toContain('cmp-hdr');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <TreeGrid columns={cols} styles={{ body: { padding: '12px' } }}>
        <TreeGrid.Header />
        <TreeGrid.Body rows={rows} />
      </TreeGrid>,
    );
    expect(screen.getByTestId('treegrid-body')).toHaveStyle({ padding: '12px' });
  });

  it('TreeGrid.Header context disinda hata firlatir', () => {
    expect(() => render(<TreeGrid.Header />)).toThrow();
  });
});
