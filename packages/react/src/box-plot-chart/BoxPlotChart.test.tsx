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
import { BoxPlotChart } from './BoxPlotChart';

const data = [
  { label: 'A', min: 5, q1: 15, median: 25, q3: 35, max: 45, outliers: [1, 50] },
  { label: 'B', min: 10, q1: 20, median: 30, q3: 40, max: 50 },
];

describe('BoxPlotChart', () => {
  it('root render edilir', () => { render(<BoxPlotChart data={data} />); expect(screen.getByTestId('boxplotchart-root')).toBeInTheDocument(); });
  it('svg render edilir', () => { render(<BoxPlotChart data={data} />); expect(screen.getByTestId('boxplotchart-svg')).toBeInTheDocument(); });
  it('svg role img', () => { render(<BoxPlotChart data={data} />); expect(screen.getByTestId('boxplotchart-svg')).toHaveAttribute('role', 'img'); });
  it('boxes group render edilir', () => { render(<BoxPlotChart data={data} />); expect(screen.getByTestId('boxplotchart-boxes')).toBeInTheDocument(); });
  it('box rect ler render edilir', () => { render(<BoxPlotChart data={data} />); expect(screen.getAllByTestId('boxplotchart-box').length).toBe(2); });
  it('whisker ler render edilir', () => { render(<BoxPlotChart data={data} />); expect(screen.getAllByTestId('boxplotchart-whisker').length).toBe(4); });
  it('median cizgileri render edilir', () => { render(<BoxPlotChart data={data} />); expect(screen.getAllByTestId('boxplotchart-median').length).toBe(2); });
  it('outlier noktalari render edilir', () => { render(<BoxPlotChart data={data} />); expect(screen.getAllByTestId('boxplotchart-outlier').length).toBe(2); });
  it('axis render edilir', () => { render(<BoxPlotChart data={data} />); expect(screen.getByTestId('boxplotchart-axis')).toBeInTheDocument(); });
  it('axis label lar render edilir', () => { render(<BoxPlotChart data={data} />); expect(screen.getAllByTestId('boxplotchart-axisLabel').length).toBe(2); });
  it('label icerigi dogru', () => { render(<BoxPlotChart data={data} />); expect(screen.getByText('A')).toBeInTheDocument(); });
  it('className root eklenir', () => { render(<BoxPlotChart data={data} className="my-bp" />); expect(screen.getByTestId('boxplotchart-root').className).toContain('my-bp'); });
  it('style root eklenir', () => { render(<BoxPlotChart data={data} style={{ padding: '8px' }} />); expect(screen.getByTestId('boxplotchart-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<BoxPlotChart data={data} classNames={{ root: 'c-r' }} />); expect(screen.getByTestId('boxplotchart-root').className).toContain('c-r'); });
  it('styles.root eklenir', () => { render(<BoxPlotChart data={data} styles={{ root: { padding: '16px' } }} />); expect(screen.getByTestId('boxplotchart-root')).toHaveStyle({ padding: '16px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<BoxPlotChart ref={ref} data={data} />); expect(ref).toHaveBeenCalled(); });
});

describe('BoxPlotChart (Compound)', () => {
  it('compound: boxes render edilir', () => {
    render(<BoxPlotChart data={data}><svg viewBox="0 0 500 300"><BoxPlotChart.Boxes /></svg></BoxPlotChart>);
    expect(screen.getByTestId('boxplotchart-boxes')).toBeInTheDocument();
  });
  it('BoxPlotChart.Boxes context disinda hata', () => { expect(() => render(<BoxPlotChart.Boxes />)).toThrow(); });
});
