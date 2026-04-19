/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { TreemapChart } from './TreemapChart';
import type { TreemapNode } from '@relteco/relui-core';

const data: TreemapNode[] = [
  { name: 'A', value: 50 },
  { name: 'B', value: 30 },
  { name: 'C', value: 20 },
];

describe('TreemapChart', () => {
  it('root render edilir', () => {
    render(<TreemapChart data={data} />);
    expect(screen.getByTestId('treemap-chart-root')).toBeInTheDocument();
  });

  it('svg render edilir', () => {
    render(<TreemapChart data={data} />);
    expect(screen.getByTestId('treemap-chart-root').querySelector('svg')).toBeInTheDocument();
  });

  it('cell rect render edilir', () => {
    render(<TreemapChart data={data} />);
    expect(screen.getAllByTestId('treemap-chart-cell-rect')).toHaveLength(3);
  });

  it('label text render edilir', () => {
    render(<TreemapChart data={data} />);
    expect(screen.getAllByTestId('treemap-chart-label-text')).toHaveLength(3);
  });

  it('label icerik dogru', () => {
    render(<TreemapChart data={data} />);
    expect(screen.getAllByTestId('treemap-chart-label-text')[0]).toHaveTextContent('A');
  });

  it('showLabels false ile label gizlenir', () => {
    render(<TreemapChart data={data} showLabels={false} />);
    expect(screen.queryByTestId('treemap-chart-label-text')).not.toBeInTheDocument();
  });

  it('legend render edilir', () => {
    render(<TreemapChart data={data} />);
    expect(screen.getByTestId('treemap-chart-legend')).toBeInTheDocument();
  });

  it('showLegend false ile legend gizlenir', () => {
    render(<TreemapChart data={data} showLegend={false} />);
    expect(screen.queryByTestId('treemap-chart-legend')).not.toBeInTheDocument();
  });

  it('svg role img ve aria-label', () => {
    render(<TreemapChart data={data} />);
    const svg = screen.getByTestId('treemap-chart-root').querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Treemap chart');
  });

  it('bos veri ile hata vermez', () => {
    render(<TreemapChart data={[]} />);
    expect(screen.getByTestId('treemap-chart-root')).toBeInTheDocument();
  });

  it('custom width/height ile render edilir', () => {
    render(<TreemapChart data={data} width={500} height={400} />);
    const svg = screen.getByTestId('treemap-chart-root').querySelector('svg');
    expect(svg).toHaveAttribute('width', '500');
    expect(svg).toHaveAttribute('height', '400');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<TreemapChart data={data} className="my-treemap" />);
    expect(screen.getByTestId('treemap-chart-root').className).toContain('my-treemap');
  });

  it('style root elemana eklenir', () => {
    render(<TreemapChart data={data} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('treemap-chart-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<TreemapChart data={data} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('treemap-chart-root').className).toContain('custom-root');
  });

  it('classNames.cell cell elemana eklenir', () => {
    render(<TreemapChart data={data} classNames={{ cell: 'custom-cell' }} />);
    expect(screen.getAllByTestId('treemap-chart-cell-rect')[0].getAttribute('class')).toContain('custom-cell');
  });

  it('classNames.label label elemana eklenir', () => {
    render(<TreemapChart data={data} classNames={{ label: 'custom-label' }} />);
    expect(screen.getAllByTestId('treemap-chart-label-text')[0].getAttribute('class')).toContain('custom-label');
  });

  it('classNames.legend legend elemana eklenir', () => {
    render(<TreemapChart data={data} classNames={{ legend: 'custom-legend' }} />);
    expect(screen.getByTestId('treemap-chart-legend').className).toContain('custom-legend');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<TreemapChart data={data} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('treemap-chart-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.legend legend elemana eklenir', () => {
    render(<TreemapChart data={data} styles={{ legend: { padding: '8px' } }} />);
    expect(screen.getByTestId('treemap-chart-legend')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<TreemapChart data={data} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('TreemapChart (Compound)', () => {
  it('compound: cell render edilir', () => {
    render(
      <TreemapChart data={data}>
        <TreemapChart.Cell />
      </TreemapChart>,
    );
    expect(screen.getByTestId('treemap-chart-cell')).toBeInTheDocument();
  });

  it('compound: label render edilir', () => {
    render(
      <TreemapChart data={data}>
        <TreemapChart.Cell />
        <TreemapChart.Label />
      </TreemapChart>,
    );
    expect(screen.getByTestId('treemap-chart-label')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <TreemapChart data={data} classNames={{ legend: 'cmp-legend' }}>
        <TreemapChart.Cell />
        <TreemapChart.Label />
        <TreemapChart.Legend />
      </TreemapChart>,
    );
  });

  it('compound: legend compound modda render edilir', () => {
    render(
      <TreemapChart data={data}>
        <TreemapChart.Cell />
        <TreemapChart.Legend />
      </TreemapChart>,
    );
    expect(screen.getByTestId('treemap-chart-legend')).toBeInTheDocument();
  });

  it('TreemapChart.Cell context disinda hata firlatir', () => {
    expect(() => render(<TreemapChart.Cell />)).toThrow();
  });

  it('TreemapChart.Label context disinda hata firlatir', () => {
    expect(() => render(<TreemapChart.Label />)).toThrow();
  });

  it('TreemapChart.Legend context disinda hata firlatir', () => {
    expect(() => render(<TreemapChart.Legend />)).toThrow();
  });
});
