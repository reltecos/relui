/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createBoxPlotChart } from './box-plot-chart.machine';

const data = [{ label: 'A', min: 5, q1: 15, median: 25, q3: 35, max: 45, outliers: [1, 50] }];

describe('createBoxPlotChart', () => {
  it('baslangicta tooltip null', () => { expect(createBoxPlotChart({ data }).getContext().tooltipIndex).toBeNull(); });
  it('SET_TOOLTIP calisir', () => { const a = createBoxPlotChart({ data }); a.send({ type: 'SET_TOOLTIP', index: 0, x: 10, y: 20 }); expect(a.getContext().tooltipIndex).toBe(0); });
  it('CLEAR_TOOLTIP calisir', () => { const a = createBoxPlotChart({ data }); a.send({ type: 'SET_TOOLTIP', index: 0, x: 0, y: 0 }); a.send({ type: 'CLEAR_TOOLTIP' }); expect(a.getContext().tooltipIndex).toBeNull(); });
  it('CLEAR_TOOLTIP null iken notify olmaz', () => { const a = createBoxPlotChart({ data }); const fn = vi.fn(); a.subscribe(fn); a.send({ type: 'CLEAR_TOOLTIP' }); expect(fn).not.toHaveBeenCalled(); });
  it('subscribe calisir', () => { const a = createBoxPlotChart({ data }); const fn = vi.fn(); a.subscribe(fn); a.send({ type: 'SET_TOOLTIP', index: 0, x: 0, y: 0 }); expect(fn).toHaveBeenCalled(); });
  it('destroy temizler', () => { const a = createBoxPlotChart({ data }); const fn = vi.fn(); a.subscribe(fn); a.destroy(); a.send({ type: 'SET_TOOLTIP', index: 0, x: 0, y: 0 }); expect(fn).not.toHaveBeenCalled(); });
});
