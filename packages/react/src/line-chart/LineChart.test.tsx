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
import { LineChart } from './LineChart';
import type { LineSeries } from '@relteco/relui-core';

const SERIES: LineSeries[] = [
  { name: 'Gelir', data: [{ x: 0, y: 10 }, { x: 1, y: 25 }, { x: 2, y: 18 }, { x: 3, y: 30 }] },
  { name: 'Gider', data: [{ x: 0, y: 5 }, { x: 1, y: 12 }, { x: 2, y: 8 }, { x: 3, y: 20 }] },
];

describe('LineChart', () => {
  it('root render edilir', () => {
    render(<LineChart series={SERIES} />);
    expect(screen.getByTestId('line-chart-root')).toBeInTheDocument();
  });

  it('svg role=img', () => {
    render(<LineChart series={SERIES} />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Line chart');
  });

  it('series cizgileri render edilir', () => {
    render(<LineChart series={SERIES} />);
    const lines = screen.getAllByTestId('line-chart-series');
    expect(lines).toHaveLength(2);
  });

  it('grid cizgileri render edilir', () => {
    render(<LineChart series={SERIES} showGrid />);
    const grids = screen.getAllByTestId('line-chart-grid');
    expect(grids.length).toBeGreaterThan(0);
  });

  it('showGrid false ise grid gosterilmez', () => {
    render(<LineChart series={SERIES} showGrid={false} />);
    expect(screen.queryByTestId('line-chart-grid')).not.toBeInTheDocument();
  });

  it('xAxis tick etiketleri render edilir', () => {
    render(<LineChart series={SERIES} />);
    const ticks = screen.getAllByTestId('line-chart-xAxis');
    expect(ticks.length).toBeGreaterThan(0);
  });

  it('yAxis tick etiketleri render edilir', () => {
    render(<LineChart series={SERIES} />);
    const ticks = screen.getAllByTestId('line-chart-yAxis');
    expect(ticks.length).toBeGreaterThan(0);
  });

  it('showDots noktalar gosterir', () => {
    render(<LineChart series={SERIES} showDots />);
    const dots = screen.getAllByTestId('line-chart-dot');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('showDots false ise nokta yok', () => {
    render(<LineChart series={SERIES} showDots={false} />);
    expect(screen.queryByTestId('line-chart-dot')).not.toBeInTheDocument();
  });

  it('legend render edilir', () => {
    render(<LineChart series={SERIES} showLegend />);
    expect(screen.getByTestId('line-chart-legend')).toBeInTheDocument();
  });

  it('showLegend false ise legend gizlenir', () => {
    render(<LineChart series={SERIES} showLegend={false} />);
    expect(screen.queryByTestId('line-chart-legend')).not.toBeInTheDocument();
  });

  it('bos series ile cizgi yok', () => {
    render(<LineChart series={[]} />);
    expect(screen.queryByTestId('line-chart-series')).not.toBeInTheDocument();
  });

  it('custom width/height viewBox a yansir', () => {
    render(<LineChart series={SERIES} width={600} height={400} />);
    expect(screen.getByRole('img')).toHaveAttribute('viewBox', '0 0 600 400');
  });

  // ── Slot API ──

  it('className root elemana eklenir', () => {
    render(<LineChart series={SERIES} className="my-lc" />);
    expect(screen.getByTestId('line-chart-root').className).toContain('my-lc');
  });

  it('style root elemana eklenir', () => {
    render(<LineChart series={SERIES} style={{ padding: '8px' }} />);
    expect(screen.getByTestId('line-chart-root')).toHaveStyle({ padding: '8px' });
  });

  it('classNames.root root elemana eklenir', () => {
    render(<LineChart series={SERIES} classNames={{ root: 'cr' }} />);
    expect(screen.getByTestId('line-chart-root').className).toContain('cr');
  });

  it('styles.root root elemana eklenir', () => {
    render(<LineChart series={SERIES} styles={{ root: { padding: '12px' } }} />);
    expect(screen.getByTestId('line-chart-root')).toHaveStyle({ padding: '12px' });
  });

  it('classNames.legend legend elemana eklenir', () => {
    render(<LineChart series={SERIES} classNames={{ legend: 'cl' }} />);
    expect(screen.getByTestId('line-chart-legend').className).toContain('cl');
  });

  it('styles.legend legend elemana eklenir', () => {
    render(<LineChart series={SERIES} styles={{ legend: { padding: '10px' } }} />);
    expect(screen.getByTestId('line-chart-legend')).toHaveStyle({ padding: '10px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<LineChart series={SERIES} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('LineChart (Compound)', () => {
  it('compound: Grid render edilir', () => {
    render(<LineChart series={SERIES}><LineChart.Grid /></LineChart>);
    expect(screen.getByTestId('line-chart-grid')).toBeInTheDocument();
  });

  it('compound: XAxis render edilir', () => {
    render(<LineChart series={SERIES}><LineChart.XAxis /></LineChart>);
    expect(screen.getByTestId('line-chart-xAxis')).toBeInTheDocument();
  });

  it('compound: Series render edilir', () => {
    render(<LineChart series={SERIES}><LineChart.Series /></LineChart>);
    expect(screen.getByTestId('line-chart-series')).toBeInTheDocument();
  });

  it('compound: Legend render edilir', () => {
    render(<LineChart series={SERIES}><LineChart.Series /><LineChart.Legend /></LineChart>);
    expect(screen.getByTestId('line-chart-legend')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(<LineChart series={SERIES} classNames={{ series: 'cs' }}><LineChart.Series /></LineChart>);
    const g = screen.getByTestId('line-chart-series');
    const path = g.querySelector('path');
    expect(path?.getAttribute('class')).toContain('cs');
  });

  it('compound: styles context ile aktarilir', () => {
    render(<LineChart series={SERIES} styles={{ series: { opacity: '0.7' } }}><LineChart.Series /></LineChart>);
    const g = screen.getByTestId('line-chart-series');
    const path = g.querySelector('path');
    expect(path).toHaveStyle({ opacity: '0.7' });
  });

  it('LineChart.Grid context disinda hata firlatir', () => {
    expect(() => render(<LineChart.Grid />)).toThrow();
  });
});
