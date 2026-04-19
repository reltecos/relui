/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createWaterfallChart } from './waterfall-chart.machine';

const data = [
  { label: 'Start', value: 100, type: 'increase' as const },
  { label: 'Gain', value: 50, type: 'increase' as const },
  { label: 'Loss', value: 30, type: 'decrease' as const },
  { label: 'Total', value: 0, type: 'total' as const },
];

describe('createWaterfallChart', () => {
  it('bars hesaplanir', () => { const c = createWaterfallChart({ data }).getContext(); expect(c.bars.length).toBe(4); });
  it('increase bar start/end dogru', () => { const b = createWaterfallChart({ data }).getContext().bars; expect(b[0]?.start).toBe(0); expect(b[0]?.end).toBe(100); });
  it('ikinci increase kumulatif', () => { const b = createWaterfallChart({ data }).getContext().bars; expect(b[1]?.start).toBe(100); expect(b[1]?.end).toBe(150); });
  it('decrease bar dogru', () => { const b = createWaterfallChart({ data }).getContext().bars; expect(b[2]?.start).toBe(150); expect(b[2]?.end).toBe(120); });
  it('total bar 0 dan baslar', () => { const b = createWaterfallChart({ data }).getContext().bars; expect(b[3]?.start).toBe(0); expect(b[3]?.end).toBe(120); });
  it('tooltip baslangicta null', () => { expect(createWaterfallChart({ data }).getContext().tooltipIndex).toBeNull(); });
  it('SET_TOOLTIP calisir', () => { const a = createWaterfallChart({ data }); a.send({ type: 'SET_TOOLTIP', index: 1, x: 10, y: 20 }); expect(a.getContext().tooltipIndex).toBe(1); });
  it('CLEAR_TOOLTIP calisir', () => { const a = createWaterfallChart({ data }); a.send({ type: 'SET_TOOLTIP', index: 0, x: 0, y: 0 }); a.send({ type: 'CLEAR_TOOLTIP' }); expect(a.getContext().tooltipIndex).toBeNull(); });
  it('subscribe calisir', () => { const a = createWaterfallChart({ data }); const fn = vi.fn(); a.subscribe(fn); a.send({ type: 'SET_TOOLTIP', index: 0, x: 0, y: 0 }); expect(fn).toHaveBeenCalled(); });
  it('destroy temizler', () => { const a = createWaterfallChart({ data }); const fn = vi.fn(); a.subscribe(fn); a.destroy(); a.send({ type: 'SET_TOOLTIP', index: 0, x: 0, y: 0 }); expect(fn).not.toHaveBeenCalled(); });
});
