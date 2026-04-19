/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createPyramidChart } from './pyramid-chart.machine';

const data = [{ label: 'Top', value: 100 }, { label: 'Middle', value: 200 }, { label: 'Bottom', value: 300 }];

describe('createPyramidChart', () => {
  it('segment sayisi dogru', () => { expect(createPyramidChart({ data }).getContext().segments.length).toBe(3); });
  it('ilk segment topWidth 1', () => { expect(createPyramidChart({ data }).getContext().segments[0]?.topWidth).toBe(1); });
  it('ilk segment bottomWidth 2/3', () => { const s = createPyramidChart({ data }).getContext().segments[0]; expect(Math.abs((s?.bottomWidth ?? 0) - 2 / 3)).toBeLessThan(0.01); });
  it('percentage hesaplanir', () => { const s = createPyramidChart({ data }).getContext().segments[0]; expect(Math.abs((s?.percentage ?? 0) - 100 / 6)).toBeLessThan(0.1); });
  it('son segment bottomWidth 0', () => { expect(createPyramidChart({ data }).getContext().segments[2]?.bottomWidth).toBe(0); });
  it('bos data bos segments', () => { expect(createPyramidChart({ data: [] }).getContext().segments.length).toBe(0); });
  it('tooltip baslangicta null', () => { expect(createPyramidChart({ data }).getContext().tooltipIndex).toBeNull(); });
  it('SET_TOOLTIP calisir', () => { const a = createPyramidChart({ data }); a.send({ type: 'SET_TOOLTIP', index: 0, x: 10, y: 20 }); expect(a.getContext().tooltipIndex).toBe(0); });
  it('CLEAR_TOOLTIP calisir', () => { const a = createPyramidChart({ data }); a.send({ type: 'SET_TOOLTIP', index: 0, x: 0, y: 0 }); a.send({ type: 'CLEAR_TOOLTIP' }); expect(a.getContext().tooltipIndex).toBeNull(); });
  it('subscribe calisir', () => { const a = createPyramidChart({ data }); const fn = vi.fn(); a.subscribe(fn); a.send({ type: 'SET_TOOLTIP', index: 0, x: 0, y: 0 }); expect(fn).toHaveBeenCalled(); });
  it('destroy temizler', () => { const a = createPyramidChart({ data }); const fn = vi.fn(); a.subscribe(fn); a.destroy(); a.send({ type: 'SET_TOOLTIP', index: 0, x: 0, y: 0 }); expect(fn).not.toHaveBeenCalled(); });
});
