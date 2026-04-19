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
import { BulletChart } from './BulletChart';
import type { BulletDataPoint } from '@relteco/relui-core';

const data: BulletDataPoint[] = [
  { label: 'Revenue', value: 270, target: 250, ranges: [{ label: 'Poor', value: 150 }, { label: 'OK', value: 225 }, { label: 'Good', value: 300 }] },
  { label: 'Profit', value: 35, target: 50, ranges: [{ label: 'Poor', value: 20 }, { label: 'OK', value: 40 }, { label: 'Good', value: 60 }] },
];

describe('BulletChart', () => {
  it('root render edilir', () => { render(<BulletChart data={data} />); expect(screen.getByTestId('bulletchart-root')).toBeInTheDocument(); });
  it('svg render edilir', () => { render(<BulletChart data={data} />); expect(screen.getByTestId('bulletchart-svg')).toBeInTheDocument(); });
  it('svg role img', () => { render(<BulletChart data={data} />); expect(screen.getByTestId('bulletchart-svg')).toHaveAttribute('role', 'img'); });
  it('bar group render edilir', () => { render(<BulletChart data={data} />); expect(screen.getByTestId('bulletchart-bar')).toBeInTheDocument(); });
  it('target cizgileri render edilir', () => { render(<BulletChart data={data} />); expect(screen.getAllByTestId('bulletchart-target').length).toBe(2); });
  it('range rect leri render edilir', () => { render(<BulletChart data={data} />); expect(screen.getAllByTestId('bulletchart-range').length).toBe(6); });
  it('label lar render edilir', () => { render(<BulletChart data={data} />); expect(screen.getAllByTestId('bulletchart-label').length).toBe(2); });
  it('label icerigi dogru', () => { render(<BulletChart data={data} />); expect(screen.getByText('Revenue')).toBeInTheDocument(); });
  it('className root eklenir', () => { render(<BulletChart data={data} className="my-bc" />); expect(screen.getByTestId('bulletchart-root').className).toContain('my-bc'); });
  it('style root eklenir', () => { render(<BulletChart data={data} style={{ padding: '8px' }} />); expect(screen.getByTestId('bulletchart-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<BulletChart data={data} classNames={{ root: 'c-r' }} />); expect(screen.getByTestId('bulletchart-root').className).toContain('c-r'); });
  it('styles.root eklenir', () => { render(<BulletChart data={data} styles={{ root: { padding: '16px' } }} />); expect(screen.getByTestId('bulletchart-root')).toHaveStyle({ padding: '16px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<BulletChart ref={ref} data={data} />); expect(ref).toHaveBeenCalled(); });
});

describe('BulletChart (Compound)', () => {
  it('compound: bars render edilir', () => {
    render(<BulletChart data={data}><svg viewBox="0 0 400 108"><BulletChart.Bars /></svg></BulletChart>);
    expect(screen.getByTestId('bulletchart-bar')).toBeInTheDocument();
  });
  it('compound: classNames aktarilir', () => {
    render(<BulletChart data={data} classNames={{ root: 'cmp-r' }}><svg viewBox="0 0 400 108"><BulletChart.Bars /></svg></BulletChart>);
    expect(screen.getByTestId('bulletchart-root').className).toContain('cmp-r');
  });
  it('BulletChart.Bars context disinda hata', () => { expect(() => render(<BulletChart.Bars />)).toThrow(); });
});
