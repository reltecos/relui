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
import { OrgChart } from './OrgChart';
import type { OrgNode } from '@relteco/relui-core';

const NODES: OrgNode[] = [
  { id: 'ceo', name: 'Ali', title: 'CEO', parentId: null, collapsed: false },
  { id: 'cto', name: 'Veli', title: 'CTO', parentId: 'ceo', collapsed: false },
  { id: 'cfo', name: 'Ayse', title: 'CFO', parentId: 'ceo', collapsed: false },
];

describe('OrgChart', () => {
  it('root render edilir', () => {
    render(<OrgChart nodes={NODES} />);
    expect(screen.getByTestId('org-chart-root')).toBeInTheDocument();
  });

  it('role application set edilir', () => {
    render(<OrgChart nodes={NODES} />);
    expect(screen.getByTestId('org-chart-root')).toHaveAttribute('role', 'application');
  });

  it('toolbar render edilir', () => {
    render(<OrgChart nodes={NODES} />);
    expect(screen.getByTestId('org-chart-toolbar')).toBeInTheDocument();
  });

  it('canvas render edilir', () => {
    render(<OrgChart nodes={NODES} />);
    expect(screen.getByTestId('org-chart-canvas')).toBeInTheDocument();
  });

  it('node lar render edilir', () => {
    render(<OrgChart nodes={NODES} />);
    expect(screen.getAllByTestId('org-chart-node')).toHaveLength(3);
  });

  it('node name gosterilir', () => {
    render(<OrgChart nodes={NODES} />);
    expect(screen.getByText('Ali')).toBeInTheDocument();
  });

  it('node title gosterilir', () => {
    render(<OrgChart nodes={NODES} />);
    expect(screen.getByText('CEO')).toBeInTheDocument();
  });

  it('edge ler SVG ile render edilir', () => {
    render(<OrgChart nodes={NODES} />);
    expect(screen.getByTestId('org-chart-svg')).toBeInTheDocument();
    expect(screen.getAllByTestId('org-chart-edge')).toHaveLength(2);
  });

  it('node tiklaninca secilir', () => {
    render(<OrgChart nodes={NODES} />);
    const nodes = screen.getAllByTestId('org-chart-node');
    fireEvent.click(nodes[0] as HTMLElement);
    expect(nodes[0]).toHaveAttribute('data-selected', 'true');
  });

  it('canvas tiklaninca secim temizlenir', () => {
    render(<OrgChart nodes={NODES} />);
    const nodes = screen.getAllByTestId('org-chart-node');
    fireEvent.click(nodes[0] as HTMLElement);
    fireEvent.click(screen.getByTestId('org-chart-canvas'));
    expect(nodes[0]).not.toHaveAttribute('data-selected', 'true');
  });

  it('expand butonu render edilir', () => {
    render(<OrgChart nodes={NODES} />);
    expect(screen.getByTestId('org-chart-btn-expand')).toBeInTheDocument();
  });

  it('collapse butonu render edilir', () => {
    render(<OrgChart nodes={NODES} />);
    expect(screen.getByTestId('org-chart-btn-collapse')).toBeInTheDocument();
  });

  it('orientation butonu render edilir', () => {
    render(<OrgChart nodes={NODES} />);
    expect(screen.getByTestId('org-chart-btn-orientation')).toBeInTheDocument();
  });

  it('bos node listesi ile hata vermez', () => {
    render(<OrgChart />);
    expect(screen.getByTestId('org-chart-root')).toBeInTheDocument();
  });

  it('className root elemana eklenir', () => {
    render(<OrgChart className="my-oc" />);
    expect(screen.getByTestId('org-chart-root').className).toContain('my-oc');
  });

  it('style root elemana eklenir', () => {
    render(<OrgChart style={{ padding: '16px' }} />);
    expect(screen.getByTestId('org-chart-root')).toHaveStyle({ padding: '16px' });
  });

  it('classNames.root root elemana eklenir', () => {
    render(<OrgChart classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('org-chart-root').className).toContain('custom-root');
  });

  it('classNames.toolbar toolbar elemana eklenir', () => {
    render(<OrgChart classNames={{ toolbar: 'custom-tb' }} />);
    expect(screen.getByTestId('org-chart-toolbar').className).toContain('custom-tb');
  });

  it('classNames.canvas canvas elemana eklenir', () => {
    render(<OrgChart classNames={{ canvas: 'custom-cv' }} />);
    expect(screen.getByTestId('org-chart-canvas').className).toContain('custom-cv');
  });

  it('styles.root root elemana eklenir', () => {
    render(<OrgChart styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('org-chart-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.toolbar toolbar elemana eklenir', () => {
    render(<OrgChart styles={{ toolbar: { padding: '12px' } }} />);
    expect(screen.getByTestId('org-chart-toolbar')).toHaveStyle({ padding: '12px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<OrgChart ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('OrgChart (Compound)', () => {
  it('compound: toolbar render edilir', () => {
    render(<OrgChart nodes={NODES}><OrgChart.Toolbar /></OrgChart>);
    expect(screen.getByTestId('org-chart-toolbar')).toBeInTheDocument();
  });

  it('compound: canvas render edilir', () => {
    render(<OrgChart nodes={NODES}><OrgChart.Canvas /></OrgChart>);
    expect(screen.getByTestId('org-chart-canvas')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(<OrgChart classNames={{ toolbar: 'cmp-tb' }}><OrgChart.Toolbar /></OrgChart>);
    expect(screen.getByTestId('org-chart-toolbar').className).toContain('cmp-tb');
  });

  it('compound: styles context ile aktarilir', () => {
    render(<OrgChart styles={{ toolbar: { padding: '30px' } }}><OrgChart.Toolbar /></OrgChart>);
    expect(screen.getByTestId('org-chart-toolbar')).toHaveStyle({ padding: '30px' });
  });

  it('OrgChart.Toolbar context disinda hata firlatir', () => {
    expect(() => render(<OrgChart.Toolbar />)).toThrow();
  });

  it('OrgChart.Canvas context disinda hata firlatir', () => {
    expect(() => render(<OrgChart.Canvas />)).toThrow();
  });
});
