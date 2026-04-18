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
import { BarChart } from './BarChart';

const S = [{ name: 'Gelir', data: [30, 50, 20] }, { name: 'Gider', data: [20, 30, 15] }];
const C = ['Ock', 'Sub', 'Mar'];

describe('BarChart', () => {
  it('root render edilir', () => { render(<BarChart series={S} categories={C} />); expect(screen.getByTestId('bar-chart-root')).toBeInTheDocument(); });
  it('svg role=img', () => { render(<BarChart series={S} categories={C} />); expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Bar chart'); });
  it('bar lar render edilir', () => { render(<BarChart series={S} categories={C} />); expect(screen.getAllByTestId('bar-chart-bar').length).toBeGreaterThan(0); });
  it('grid render edilir', () => { render(<BarChart series={S} categories={C} showGrid />); expect(screen.getAllByTestId('bar-chart-grid').length).toBeGreaterThan(0); });
  it('showGrid false ise grid yok', () => { render(<BarChart series={S} categories={C} showGrid={false} />); expect(screen.queryByTestId('bar-chart-grid')).not.toBeInTheDocument(); });
  it('xAxis etiketleri render edilir', () => { render(<BarChart series={S} categories={C} />); expect(screen.getAllByTestId('bar-chart-xAxis')).toHaveLength(3); });
  it('yAxis etiketleri render edilir', () => { render(<BarChart series={S} categories={C} />); expect(screen.getAllByTestId('bar-chart-yAxis').length).toBeGreaterThan(0); });
  it('legend render edilir', () => { render(<BarChart series={S} categories={C} showLegend />); expect(screen.getByTestId('bar-chart-legend')).toBeInTheDocument(); });
  it('showLegend false ise legend gizlenir', () => { render(<BarChart series={S} categories={C} showLegend={false} />); expect(screen.queryByTestId('bar-chart-legend')).not.toBeInTheDocument(); });
  it('bos series bar yok', () => { render(<BarChart series={[]} categories={C} />); expect(screen.queryByTestId('bar-chart-bar')).not.toBeInTheDocument(); });
  it('stacked mode desteklenir', () => { render(<BarChart series={S} categories={C} mode="stacked" />); expect(screen.getAllByTestId('bar-chart-bar').length).toBeGreaterThan(0); });
  it('custom width/height', () => { render(<BarChart series={S} categories={C} width={600} height={400} />); expect(screen.getByRole('img')).toHaveAttribute('viewBox', '0 0 600 400'); });

  // ── Slot API ──
  it('className root elemana eklenir', () => { render(<BarChart series={S} categories={C} className="my-bc" />); expect(screen.getByTestId('bar-chart-root').className).toContain('my-bc'); });
  it('style root elemana eklenir', () => { render(<BarChart series={S} categories={C} style={{ padding: '8px' }} />); expect(screen.getByTestId('bar-chart-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<BarChart series={S} categories={C} classNames={{ root: 'cr' }} />); expect(screen.getByTestId('bar-chart-root').className).toContain('cr'); });
  it('styles.root eklenir', () => { render(<BarChart series={S} categories={C} styles={{ root: { padding: '12px' } }} />); expect(screen.getByTestId('bar-chart-root')).toHaveStyle({ padding: '12px' }); });
  it('classNames.legend eklenir', () => { render(<BarChart series={S} categories={C} classNames={{ legend: 'cl' }} />); expect(screen.getByTestId('bar-chart-legend').className).toContain('cl'); });
  it('styles.legend eklenir', () => { render(<BarChart series={S} categories={C} styles={{ legend: { padding: '10px' } }} />); expect(screen.getByTestId('bar-chart-legend')).toHaveStyle({ padding: '10px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<BarChart series={S} categories={C} ref={ref} />); expect(ref).toHaveBeenCalled(); });
});

describe('BarChart (Compound)', () => {
  it('compound: Bar render edilir', () => { render(<BarChart series={S} categories={C}><BarChart.Bar /></BarChart>); expect(screen.getByTestId('bar-chart-bar')).toBeInTheDocument(); });
  it('compound: Grid render edilir', () => { render(<BarChart series={S} categories={C}><BarChart.Grid /></BarChart>); expect(screen.getByTestId('bar-chart-grid')).toBeInTheDocument(); });
  it('compound: Legend render edilir', () => { render(<BarChart series={S} categories={C}><BarChart.Bar /><BarChart.Legend /></BarChart>); expect(screen.getByTestId('bar-chart-legend')).toBeInTheDocument(); });
  it('compound: classNames context ile aktarilir', () => { render(<BarChart series={S} categories={C} classNames={{ bar: 'cb' }}><BarChart.Bar /></BarChart>); const g = screen.getByTestId('bar-chart-bar'); const r = g.querySelector('rect'); expect(r?.getAttribute('class')).toContain('cb'); });
  it('compound: styles context ile aktarilir', () => { render(<BarChart series={S} categories={C} styles={{ bar: { opacity: '0.7' } }}><BarChart.Bar /></BarChart>); const g = screen.getByTestId('bar-chart-bar'); const r = g.querySelector('rect'); expect(r).toHaveStyle({ opacity: '0.7' }); });
  it('BarChart.Bar context disinda hata firlatir', () => { expect(() => render(<BarChart.Bar />)).toThrow(); });
});
