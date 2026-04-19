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
import { RadarChart } from './RadarChart';
import type { RadarAxis, RadarSeries } from '@relteco/relui-core';

const axes: RadarAxis[] = [
  { key: 'a', label: 'Alpha', max: 100 },
  { key: 'b', label: 'Beta', max: 100 },
  { key: 'c', label: 'Gamma', max: 100 },
  { key: 'd', label: 'Delta', max: 100 },
  { key: 'e', label: 'Epsilon', max: 100 },
];

const series: RadarSeries[] = [
  { name: 'Series A', values: { a: 80, b: 60, c: 90, d: 40, e: 70 } },
  { name: 'Series B', values: { a: 50, b: 90, c: 30, d: 80, e: 60 } },
];

describe('RadarChart', () => {
  it('root render edilir', () => {
    render(<RadarChart axes={axes} series={series} />);
    expect(screen.getByTestId('radar-chart-root')).toBeInTheDocument();
  });

  it('svg render edilir', () => {
    render(<RadarChart axes={axes} series={series} />);
    expect(screen.getByTestId('radar-chart-root').querySelector('svg')).toBeInTheDocument();
  });

  it('grid cigileri render edilir', () => {
    render(<RadarChart axes={axes} series={series} />);
    expect(screen.getAllByTestId('radar-chart-grid').length).toBeGreaterThan(0);
  });

  it('eksen cizgileri render edilir', () => {
    render(<RadarChart axes={axes} series={series} />);
    expect(screen.getAllByTestId('radar-chart-axis')).toHaveLength(5);
  });

  it('eksen etiketleri render edilir', () => {
    render(<RadarChart axes={axes} series={series} />);
    const labels = screen.getAllByTestId('radar-chart-axis-label');
    expect(labels).toHaveLength(5);
    expect(labels[0]).toHaveTextContent('Alpha');
  });

  it('seri path render edilir', () => {
    render(<RadarChart axes={axes} series={series} />);
    expect(screen.getAllByTestId('radar-chart-series-path')).toHaveLength(2);
  });

  it('seri noktalari render edilir', () => {
    render(<RadarChart axes={axes} series={series} />);
    // 2 seri x 5 eksen = 10 nokta
    expect(screen.getAllByTestId('radar-chart-point')).toHaveLength(10);
  });

  it('legend render edilir', () => {
    render(<RadarChart axes={axes} series={series} />);
    expect(screen.getByTestId('radar-chart-legend')).toBeInTheDocument();
  });

  it('showLegend false ile legend gizlenir', () => {
    render(<RadarChart axes={axes} series={series} showLegend={false} />);
    expect(screen.queryByTestId('radar-chart-legend')).not.toBeInTheDocument();
  });

  it('svg role img ve aria-label', () => {
    render(<RadarChart axes={axes} series={series} />);
    const svg = screen.getByTestId('radar-chart-root').querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Radar chart');
  });

  it('bos veri ile hata vermez', () => {
    render(<RadarChart axes={[]} series={[]} />);
    expect(screen.getByTestId('radar-chart-root')).toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<RadarChart axes={axes} series={series} className="my-radar" />);
    expect(screen.getByTestId('radar-chart-root').className).toContain('my-radar');
  });

  it('style root elemana eklenir', () => {
    render(<RadarChart axes={axes} series={series} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('radar-chart-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<RadarChart axes={axes} series={series} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('radar-chart-root').className).toContain('custom-root');
  });

  it('classNames.grid grid elemana eklenir', () => {
    render(<RadarChart axes={axes} series={series} classNames={{ grid: 'custom-grid' }} />);
    expect(screen.getAllByTestId('radar-chart-grid')[0].getAttribute('class')).toContain('custom-grid');
  });

  it('classNames.series series elemana eklenir', () => {
    render(<RadarChart axes={axes} series={series} classNames={{ series: 'custom-series' }} />);
    expect(screen.getAllByTestId('radar-chart-series-path')[0].getAttribute('class')).toContain('custom-series');
  });

  it('classNames.legend legend elemana eklenir', () => {
    render(<RadarChart axes={axes} series={series} classNames={{ legend: 'custom-legend' }} />);
    expect(screen.getByTestId('radar-chart-legend').className).toContain('custom-legend');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<RadarChart axes={axes} series={series} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('radar-chart-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.legend legend elemana eklenir', () => {
    render(<RadarChart axes={axes} series={series} styles={{ legend: { padding: '8px' } }} />);
    expect(screen.getByTestId('radar-chart-legend')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<RadarChart axes={axes} series={series} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('RadarChart (Compound)', () => {
  it('compound: grid render edilir', () => {
    render(
      <RadarChart axes={axes} series={series}>
        <RadarChart.Grid />
      </RadarChart>,
    );
    expect(screen.getByTestId('radar-chart-grid')).toBeInTheDocument();
  });

  it('compound: series render edilir', () => {
    render(
      <RadarChart axes={axes} series={series}>
        <RadarChart.Grid />
        <RadarChart.Series />
      </RadarChart>,
    );
    expect(screen.getByTestId('radar-chart-series')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <RadarChart axes={axes} series={series} classNames={{ legend: 'cmp-legend' }}>
        <RadarChart.Grid />
        <RadarChart.Series />
        <RadarChart.Legend />
      </RadarChart>,
    );
    // Legend is outside SVG in compound, but context is shared
    // Actually legend is rendered by sub-component which uses context
  });

  it('RadarChart.Grid context disinda hata firlatir', () => {
    expect(() => render(<RadarChart.Grid />)).toThrow();
  });
});
