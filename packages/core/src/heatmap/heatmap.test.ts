/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createHeatmap } from './heatmap.machine';

const DATA = [
  [1, 5, 3],
  [8, 2, 7],
  [4, 9, 6],
];
const ROW_LABELS = ['R1', 'R2', 'R3'];
const COL_LABELS = ['C1', 'C2', 'C3'];

describe('createHeatmap', () => {
  it('varsayilan context doner', () => {
    const api = createHeatmap();
    const ctx = api.getContext();
    expect(ctx.cells).toHaveLength(0);
    expect(ctx.width).toBe(400);
    expect(ctx.height).toBe(300);
    api.destroy();
  });

  it('data ile hucreler hesaplanir', () => {
    const api = createHeatmap({ data: DATA, rowLabels: ROW_LABELS, colLabels: COL_LABELS });
    const ctx = api.getContext();
    expect(ctx.cells).toHaveLength(9);
    api.destroy();
  });

  it('min ve max dogru hesaplanir', () => {
    const api = createHeatmap({ data: DATA });
    const ctx = api.getContext();
    expect(ctx.min).toBe(1);
    expect(ctx.max).toBe(9);
    api.destroy();
  });

  it('hucre pozisyonlari hesaplanir', () => {
    const api = createHeatmap({ data: DATA });
    const cell = api.getContext().cells[0];
    expect(cell).toBeDefined();
    if (cell) {
      expect(cell.width).toBeGreaterThan(0);
      expect(cell.height).toBeGreaterThan(0);
    }
    api.destroy();
  });

  it('hucre renkleri hesaplanir', () => {
    const api = createHeatmap({ data: DATA });
    const cell = api.getContext().cells[0];
    expect(cell?.color).toContain('rgb');
    api.destroy();
  });

  it('row ve col label atanir', () => {
    const api = createHeatmap({ data: DATA, rowLabels: ROW_LABELS, colLabels: COL_LABELS });
    const cell = api.getContext().cells[0];
    expect(cell?.rowLabel).toBe('R1');
    expect(cell?.colLabel).toBe('C1');
    api.destroy();
  });

  it('rowCount ve colCount dogru', () => {
    const api = createHeatmap({ data: DATA });
    expect(api.getContext().rowCount).toBe(3);
    expect(api.getContext().colCount).toBe(3);
    api.destroy();
  });

  // ── Events ──

  it('SET_DATA veriyi gunceller', () => {
    const api = createHeatmap();
    api.send({ type: 'SET_DATA', data: [[1, 2], [3, 4]] });
    expect(api.getContext().cells).toHaveLength(4);
    api.destroy();
  });

  it('SET_ROW_LABELS etiketleri gunceller', () => {
    const api = createHeatmap({ data: DATA });
    api.send({ type: 'SET_ROW_LABELS', labels: ['X', 'Y', 'Z'] });
    expect(api.getContext().rowLabels).toEqual(['X', 'Y', 'Z']);
    api.destroy();
  });

  it('SET_COL_LABELS etiketleri gunceller', () => {
    const api = createHeatmap({ data: DATA });
    api.send({ type: 'SET_COL_LABELS', labels: ['A', 'B', 'C'] });
    expect(api.getContext().colLabels).toEqual(['A', 'B', 'C']);
    api.destroy();
  });

  it('SET_SIZE boyutu gunceller', () => {
    const api = createHeatmap();
    api.send({ type: 'SET_SIZE', width: 600, height: 400 });
    expect(api.getContext().width).toBe(600);
    api.destroy();
  });

  it('SET_SIZE ayni boyut icin notify etmez', () => {
    const api = createHeatmap({ width: 400, height: 300 });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_SIZE', width: 400, height: 300 });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── Subscribe ──

  it('subscribe listener cagirilir', () => {
    const api = createHeatmap();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_DATA', data: [[1]] });
    expect(listener).toHaveBeenCalledTimes(1);
    api.destroy();
  });

  it('destroy listeners temizler', () => {
    const api = createHeatmap();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'SET_DATA', data: [[1]] });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Edge cases ──

  it('bos data bos cells doner', () => {
    const api = createHeatmap({ data: [] });
    expect(api.getContext().cells).toHaveLength(0);
    api.destroy();
  });

  it('tek hucre calisir', () => {
    const api = createHeatmap({ data: [[42]] });
    expect(api.getContext().cells).toHaveLength(1);
    api.destroy();
  });
});
