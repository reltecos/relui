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
import { PieChart } from './PieChart';

const SLICES = [
  { name: 'A', value: 30 },
  { name: 'B', value: 50 },
  { name: 'C', value: 20 },
];

describe('PieChart', () => {
  it('root render edilir', () => {
    render(<PieChart slices={SLICES} />);
    expect(screen.getByTestId('pie-chart-root')).toBeInTheDocument();
  });

  it('svg role=img', () => {
    render(<PieChart slices={SLICES} />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Pie chart');
  });

  it('dilimler render edilir', () => {
    render(<PieChart slices={SLICES} />);
    const slices = screen.getAllByTestId('pie-chart-slice');
    expect(slices).toHaveLength(3);
  });

  it('legend render edilir', () => {
    render(<PieChart slices={SLICES} showLegend />);
    expect(screen.getByTestId('pie-chart-legend')).toBeInTheDocument();
  });

  it('legend gizlenebilir', () => {
    render(<PieChart slices={SLICES} showLegend={false} />);
    expect(screen.queryByTestId('pie-chart-legend')).not.toBeInTheDocument();
  });

  it('labels gosterilir', () => {
    render(<PieChart slices={SLICES} showLabels />);
    const labels = screen.getAllByTestId('pie-chart-label');
    expect(labels).toHaveLength(3);
  });

  it('labels varsayilan gizli', () => {
    render(<PieChart slices={SLICES} />);
    expect(screen.queryByTestId('pie-chart-label')).not.toBeInTheDocument();
  });

  it('donut mode desteklenir', () => {
    render(<PieChart slices={SLICES} donut />);
    expect(screen.getAllByTestId('pie-chart-slice')).toHaveLength(3);
  });

  it('bos slices ile dilim yok', () => {
    render(<PieChart slices={[]} />);
    expect(screen.queryByTestId('pie-chart-slice')).not.toBeInTheDocument();
  });

  it('custom size SVG genisligini set eder', () => {
    render(<PieChart slices={SLICES} size={300} />);
    expect(screen.getByRole('img')).toHaveAttribute('width', '300');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<PieChart slices={SLICES} className="my-pie" />);
    expect(screen.getByTestId('pie-chart-root').className).toContain('my-pie');
  });

  it('style root elemana eklenir', () => {
    render(<PieChart slices={SLICES} style={{ padding: '8px' }} />);
    expect(screen.getByTestId('pie-chart-root')).toHaveStyle({ padding: '8px' });
  });

  // ── Slot API ──

  it('classNames.root root elemana eklenir', () => {
    render(<PieChart slices={SLICES} classNames={{ root: 'cr' }} />);
    expect(screen.getByTestId('pie-chart-root').className).toContain('cr');
  });

  it('styles.root root elemana eklenir', () => {
    render(<PieChart slices={SLICES} styles={{ root: { padding: '12px' } }} />);
    expect(screen.getByTestId('pie-chart-root')).toHaveStyle({ padding: '12px' });
  });

  it('classNames.legend legend elemana eklenir', () => {
    render(<PieChart slices={SLICES} classNames={{ legend: 'cl' }} showLegend />);
    expect(screen.getByTestId('pie-chart-legend').className).toContain('cl');
  });

  it('styles.legend legend elemana eklenir', () => {
    render(<PieChart slices={SLICES} styles={{ legend: { padding: '10px' } }} showLegend />);
    expect(screen.getByTestId('pie-chart-legend')).toHaveStyle({ padding: '10px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<PieChart slices={SLICES} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('PieChart (Compound)', () => {
  it('compound: Slice render edilir', () => {
    render(<PieChart slices={SLICES}><PieChart.Slice /></PieChart>);
    expect(screen.getByTestId('pie-chart-slice')).toBeInTheDocument();
  });

  it('compound: Legend render edilir', () => {
    render(<PieChart slices={SLICES}><PieChart.Slice /><PieChart.Legend /></PieChart>);
    expect(screen.getByTestId('pie-chart-legend')).toBeInTheDocument();
  });

  it('compound: Label render edilir', () => {
    render(<PieChart slices={SLICES}><PieChart.Slice /><PieChart.Label /></PieChart>);
    expect(screen.getByTestId('pie-chart-label')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(<PieChart slices={SLICES} classNames={{ slice: 'cs' }}><PieChart.Slice /></PieChart>);
    const g = screen.getByTestId('pie-chart-slice');
    const path = g.querySelector('path');
    expect(path?.getAttribute('class')).toContain('cs');
  });

  it('compound: styles context ile aktarilir', () => {
    render(<PieChart slices={SLICES} styles={{ slice: { opacity: '0.8' } }}><PieChart.Slice /></PieChart>);
    const g = screen.getByTestId('pie-chart-slice');
    const path = g.querySelector('path');
    expect(path).toHaveStyle({ opacity: '0.8' });
  });

  it('PieChart.Slice context disinda hata firlatir', () => {
    expect(() => render(<PieChart.Slice />)).toThrow();
  });
});
