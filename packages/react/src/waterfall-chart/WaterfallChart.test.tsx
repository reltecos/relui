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
import { WaterfallChart } from './WaterfallChart';

const data = [
  { label: 'Start', value: 100, type: 'increase' as const },
  { label: 'Gain', value: 50, type: 'increase' as const },
  { label: 'Loss', value: 30, type: 'decrease' as const },
  { label: 'Total', value: 0, type: 'total' as const },
];

describe('WaterfallChart', () => {
  it('root render edilir', () => { render(<WaterfallChart data={data} />); expect(screen.getByTestId('waterfallchart-root')).toBeInTheDocument(); });
  it('svg render edilir', () => { render(<WaterfallChart data={data} />); expect(screen.getByTestId('waterfallchart-svg')).toBeInTheDocument(); });
  it('svg role img', () => { render(<WaterfallChart data={data} />); expect(screen.getByTestId('waterfallchart-svg')).toHaveAttribute('role', 'img'); });
  it('bar group render edilir', () => { render(<WaterfallChart data={data} />); expect(screen.getByTestId('waterfallchart-bar')).toBeInTheDocument(); });
  it('rect ler render edilir', () => { render(<WaterfallChart data={data} />); expect(screen.getAllByTestId('waterfallchart-rect').length).toBe(4); });
  it('connector cizgileri render edilir', () => { render(<WaterfallChart data={data} />); expect(screen.getAllByTestId('waterfallchart-connector').length).toBe(3); });
  it('axis render edilir', () => { render(<WaterfallChart data={data} />); expect(screen.getByTestId('waterfallchart-axis')).toBeInTheDocument(); });
  it('axis label lar render edilir', () => { render(<WaterfallChart data={data} />); expect(screen.getAllByTestId('waterfallchart-axisLabel').length).toBe(4); });
  it('label icerigi dogru', () => { render(<WaterfallChart data={data} />); expect(screen.getByText('Start')).toBeInTheDocument(); });
  it('className root eklenir', () => { render(<WaterfallChart data={data} className="my-wc" />); expect(screen.getByTestId('waterfallchart-root').className).toContain('my-wc'); });
  it('style root eklenir', () => { render(<WaterfallChart data={data} style={{ padding: '8px' }} />); expect(screen.getByTestId('waterfallchart-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<WaterfallChart data={data} classNames={{ root: 'c-r' }} />); expect(screen.getByTestId('waterfallchart-root').className).toContain('c-r'); });
  it('styles.root eklenir', () => { render(<WaterfallChart data={data} styles={{ root: { padding: '16px' } }} />); expect(screen.getByTestId('waterfallchart-root')).toHaveStyle({ padding: '16px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<WaterfallChart ref={ref} data={data} />); expect(ref).toHaveBeenCalled(); });
});

describe('WaterfallChart (Compound)', () => {
  it('compound: bars render edilir', () => {
    render(<WaterfallChart data={data}><svg viewBox="0 0 500 300"><WaterfallChart.Bars /><WaterfallChart.Axis /></svg></WaterfallChart>);
    expect(screen.getByTestId('waterfallchart-bar')).toBeInTheDocument();
  });
  it('WaterfallChart.Bars context disinda hata', () => { expect(() => render(<WaterfallChart.Bars />)).toThrow(); });
});
