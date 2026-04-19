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
import { PyramidChart } from './PyramidChart';

const data = [{ label: 'Top', value: 100 }, { label: 'Middle', value: 200 }, { label: 'Bottom', value: 300 }];

describe('PyramidChart', () => {
  it('root render edilir', () => { render(<PyramidChart data={data} />); expect(screen.getByTestId('pyramidchart-root')).toBeInTheDocument(); });
  it('svg render edilir', () => { render(<PyramidChart data={data} />); expect(screen.getByTestId('pyramidchart-svg')).toBeInTheDocument(); });
  it('svg role img', () => { render(<PyramidChart data={data} />); expect(screen.getByTestId('pyramidchart-svg')).toHaveAttribute('role', 'img'); });
  it('segments group render edilir', () => { render(<PyramidChart data={data} />); expect(screen.getByTestId('pyramidchart-segments')).toBeInTheDocument(); });
  it('segment polygon lar render edilir', () => { render(<PyramidChart data={data} />); expect(screen.getAllByTestId('pyramidchart-segment').length).toBe(3); });
  it('labels group render edilir', () => { render(<PyramidChart data={data} />); expect(screen.getByTestId('pyramidchart-labels')).toBeInTheDocument(); });
  it('label lar render edilir', () => { render(<PyramidChart data={data} />); expect(screen.getAllByTestId('pyramidchart-label').length).toBe(3); });
  it('label icerigi percentage icerir', () => { render(<PyramidChart data={data} />); expect(screen.getAllByTestId('pyramidchart-label')[0]?.textContent).toContain('%'); });
  it('className root eklenir', () => { render(<PyramidChart data={data} className="my-pc" />); expect(screen.getByTestId('pyramidchart-root').className).toContain('my-pc'); });
  it('style root eklenir', () => { render(<PyramidChart data={data} style={{ padding: '8px' }} />); expect(screen.getByTestId('pyramidchart-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<PyramidChart data={data} classNames={{ root: 'c-r' }} />); expect(screen.getByTestId('pyramidchart-root').className).toContain('c-r'); });
  it('styles.root eklenir', () => { render(<PyramidChart data={data} styles={{ root: { padding: '16px' } }} />); expect(screen.getByTestId('pyramidchart-root')).toHaveStyle({ padding: '16px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<PyramidChart ref={ref} data={data} />); expect(ref).toHaveBeenCalled(); });
});

describe('PyramidChart (Compound)', () => {
  it('compound: segments render edilir', () => {
    render(<PyramidChart data={data}><svg viewBox="0 0 400 300"><PyramidChart.Segments /><PyramidChart.Labels /></svg></PyramidChart>);
    expect(screen.getByTestId('pyramidchart-segments')).toBeInTheDocument();
  });
  it('PyramidChart.Segments context disinda hata', () => { expect(() => render(<PyramidChart.Segments />)).toThrow(); });
});
