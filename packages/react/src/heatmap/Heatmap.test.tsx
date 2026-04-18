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
import { Heatmap } from './Heatmap';

const DATA = [[1, 5, 3], [8, 2, 7], [4, 9, 6]];
const RL = ['R1', 'R2', 'R3'];
const CL = ['C1', 'C2', 'C3'];

describe('Heatmap', () => {
  it('root render edilir', () => { render(<Heatmap data={DATA} rowLabels={RL} colLabels={CL} />); expect(screen.getByTestId('heatmap-root')).toBeInTheDocument(); });
  it('svg role=img', () => { render(<Heatmap data={DATA} />); expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Heatmap'); });
  it('hucreler render edilir', () => { render(<Heatmap data={DATA} />); expect(screen.getAllByTestId('heatmap-cell')).toHaveLength(9); });
  it('xAxis etiketleri render edilir', () => { render(<Heatmap data={DATA} colLabels={CL} />); expect(screen.getAllByTestId('heatmap-xAxis')).toHaveLength(3); });
  it('yAxis etiketleri render edilir', () => { render(<Heatmap data={DATA} rowLabels={RL} />); expect(screen.getAllByTestId('heatmap-yAxis')).toHaveLength(3); });
  it('legend render edilir', () => { render(<Heatmap data={DATA} showLegend />); expect(screen.getByTestId('heatmap-legend')).toBeInTheDocument(); });
  it('showLegend false ise legend gizlenir', () => { render(<Heatmap data={DATA} showLegend={false} />); expect(screen.queryByTestId('heatmap-legend')).not.toBeInTheDocument(); });
  it('bos data ile hucre yok', () => { render(<Heatmap data={[]} />); expect(screen.queryByTestId('heatmap-cell')).not.toBeInTheDocument(); });
  it('custom size', () => { render(<Heatmap data={DATA} width={600} height={400} />); expect(screen.getByRole('img')).toHaveAttribute('viewBox', '0 0 600 400'); });

  // ── Slot API ──
  it('className root elemana eklenir', () => { render(<Heatmap data={DATA} className="my-hm" />); expect(screen.getByTestId('heatmap-root').className).toContain('my-hm'); });
  it('style root elemana eklenir', () => { render(<Heatmap data={DATA} style={{ padding: '8px' }} />); expect(screen.getByTestId('heatmap-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<Heatmap data={DATA} classNames={{ root: 'cr' }} />); expect(screen.getByTestId('heatmap-root').className).toContain('cr'); });
  it('styles.root eklenir', () => { render(<Heatmap data={DATA} styles={{ root: { padding: '12px' } }} />); expect(screen.getByTestId('heatmap-root')).toHaveStyle({ padding: '12px' }); });
  it('classNames.legend eklenir', () => { render(<Heatmap data={DATA} classNames={{ legend: 'cl' }} />); expect(screen.getByTestId('heatmap-legend').className).toContain('cl'); });
  it('styles.legend eklenir', () => { render(<Heatmap data={DATA} styles={{ legend: { padding: '10px' } }} />); expect(screen.getByTestId('heatmap-legend')).toHaveStyle({ padding: '10px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<Heatmap data={DATA} ref={ref} />); expect(ref).toHaveBeenCalled(); });
});

describe('Heatmap (Compound)', () => {
  it('compound: Grid render edilir', () => { render(<Heatmap data={DATA}><Heatmap.Grid /></Heatmap>); expect(screen.getByTestId('heatmap-grid')).toBeInTheDocument(); });
  it('compound: XAxis render edilir', () => { render(<Heatmap data={DATA} colLabels={CL}><Heatmap.XAxis /></Heatmap>); expect(screen.getByTestId('heatmap-xAxis')).toBeInTheDocument(); });
  it('compound: YAxis render edilir', () => { render(<Heatmap data={DATA} rowLabels={RL}><Heatmap.YAxis /></Heatmap>); expect(screen.getByTestId('heatmap-yAxis')).toBeInTheDocument(); });
  it('compound: Legend render edilir', () => { render(<Heatmap data={DATA}><Heatmap.Grid /><Heatmap.Legend /></Heatmap>); expect(screen.getByTestId('heatmap-legend')).toBeInTheDocument(); });
  it('compound: classNames context ile aktarilir', () => { render(<Heatmap data={DATA} classNames={{ cell: 'cc' }}><Heatmap.Grid /></Heatmap>); const g = screen.getByTestId('heatmap-grid'); const r = g.querySelector('rect'); expect(r?.getAttribute('class')).toContain('cc'); });
  it('compound: styles context ile aktarilir', () => { render(<Heatmap data={DATA} styles={{ cell: { opacity: '0.7' } }}><Heatmap.Grid /></Heatmap>); const g = screen.getByTestId('heatmap-grid'); const r = g.querySelector('rect'); expect(r).toHaveStyle({ opacity: '0.7' }); });
  it('Heatmap.Grid context disinda hata firlatir', () => { expect(() => render(<Heatmap.Grid />)).toThrow(); });
});
