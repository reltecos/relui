/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createBulletChart } from './bullet-chart.machine';

const data = [{ label: 'Revenue', value: 270, target: 250, ranges: [{ label: 'Poor', value: 150 }, { label: 'OK', value: 225 }, { label: 'Good', value: 300 }] }];

describe('createBulletChart', () => {
  it('baslangicta tooltip null', () => { expect(createBulletChart({ data }).getContext().tooltipIndex).toBeNull(); });
  it('SET_TOOLTIP tooltip ayarlar', () => { const a = createBulletChart({ data }); a.send({ type: 'SET_TOOLTIP', index: 0, x: 100, y: 50 }); const c = a.getContext(); expect(c.tooltipIndex).toBe(0); expect(c.tooltipX).toBe(100); expect(c.tooltipY).toBe(50); });
  it('CLEAR_TOOLTIP tooltip temizler', () => { const a = createBulletChart({ data }); a.send({ type: 'SET_TOOLTIP', index: 0, x: 0, y: 0 }); a.send({ type: 'CLEAR_TOOLTIP' }); expect(a.getContext().tooltipIndex).toBeNull(); });
  it('CLEAR_TOOLTIP zaten null ise notify olmaz', () => { const a = createBulletChart({ data }); const fn = vi.fn(); a.subscribe(fn); a.send({ type: 'CLEAR_TOOLTIP' }); expect(fn).not.toHaveBeenCalled(); });
  it('subscribe calisir', () => { const a = createBulletChart({ data }); const fn = vi.fn(); a.subscribe(fn); a.send({ type: 'SET_TOOLTIP', index: 0, x: 0, y: 0 }); expect(fn).toHaveBeenCalledTimes(1); });
  it('destroy temizler', () => { const a = createBulletChart({ data }); const fn = vi.fn(); a.subscribe(fn); a.destroy(); a.send({ type: 'SET_TOOLTIP', index: 0, x: 0, y: 0 }); expect(fn).not.toHaveBeenCalled(); });
});
