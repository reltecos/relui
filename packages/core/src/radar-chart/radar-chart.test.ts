/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createRadarChart } from './radar-chart.machine';
import type { RadarAxis, RadarSeries } from './radar-chart.types';

const axes: RadarAxis[] = [
  { key: 'speed', label: 'Speed', max: 100 },
  { key: 'power', label: 'Power', max: 100 },
  { key: 'range', label: 'Range', max: 100 },
  { key: 'armor', label: 'Armor', max: 100 },
  { key: 'magic', label: 'Magic', max: 100 },
];

const series: RadarSeries[] = [
  { name: 'Hero', values: { speed: 80, power: 60, range: 90, armor: 40, magic: 70 } },
  { name: 'Villain', values: { speed: 50, power: 90, range: 30, armor: 80, magic: 60 } },
];

describe('createRadarChart', () => {
  it('baslangic context dogru', () => {
    const api = createRadarChart({ axes, series });
    const ctx = api.getContext();
    expect(ctx.series).toHaveLength(2);
    expect(ctx.axisLines).toHaveLength(5);
    expect(ctx.gridLines).toHaveLength(5);
  });

  it('center dogru hesaplanir', () => {
    const api = createRadarChart({ axes, series, size: 200 });
    expect(api.getContext().center).toEqual({ x: 100, y: 100 });
  });

  it('her seri icin points hesaplanir', () => {
    const api = createRadarChart({ axes, series });
    const ctx = api.getContext();
    expect(ctx.series[0]?.points).toHaveLength(5);
    expect(ctx.series[1]?.points).toHaveLength(5);
  });

  it('her seri icin path olusturulur', () => {
    const api = createRadarChart({ axes, series });
    const ctx = api.getContext();
    expect(ctx.series[0]?.path).toContain('M');
    expect(ctx.series[0]?.path).toContain('Z');
  });

  it('normalizedValue 0-1 arasinda', () => {
    const api = createRadarChart({ axes, series });
    const ctx = api.getContext();
    const points = ctx.series[0]?.points ?? [];
    for (const p of points) {
      expect(p.normalizedValue).toBeGreaterThanOrEqual(0);
      expect(p.normalizedValue).toBeLessThanOrEqual(1);
    }
  });

  it('gridLines dogru seviye sayisi', () => {
    const api = createRadarChart({ axes, series, gridLevels: 3 });
    expect(api.getContext().gridLines).toHaveLength(3);
  });

  it('gridLine path polygon (Z ile biter)', () => {
    const api = createRadarChart({ axes, series });
    const ctx = api.getContext();
    expect(ctx.gridLines[0]?.path).toContain('Z');
  });

  it('axisLine label ve key iceriyor', () => {
    const api = createRadarChart({ axes, series });
    const ctx = api.getContext();
    expect(ctx.axisLines[0]?.key).toBe('speed');
    expect(ctx.axisLines[0]?.label).toBe('Speed');
  });

  it('axisLine lineEnd koordinat iceriyor', () => {
    const api = createRadarChart({ axes, series });
    const ctx = api.getContext();
    const line = ctx.axisLines[0];
    expect(line?.lineEnd.x).toBeDefined();
    expect(line?.lineEnd.y).toBeDefined();
  });

  it('axisLine labelPos koordinat iceriyor', () => {
    const api = createRadarChart({ axes, series });
    const ctx = api.getContext();
    expect(ctx.axisLines[0]?.labelPos.x).toBeDefined();
  });

  it('seri renk atanir', () => {
    const api = createRadarChart({ axes, series });
    const ctx = api.getContext();
    expect(ctx.series[0]?.color).toBeDefined();
    expect(ctx.series[1]?.color).toBeDefined();
  });

  it('ozel seri rengi kullanilir', () => {
    const colored: RadarSeries[] = [{ name: 'A', values: { speed: 50 }, color: '#ff0000' }];
    const api = createRadarChart({ axes, series: colored });
    expect(api.getContext().series[0]?.color).toBe('#ff0000');
  });

  it('SET_DATA veriyi gunceller', () => {
    const api = createRadarChart({ axes, series });
    api.send({ type: 'SET_DATA', axes: axes.slice(0, 3), series: [series[0] as RadarSeries] });
    const ctx = api.getContext();
    expect(ctx.axisLines).toHaveLength(3);
    expect(ctx.series).toHaveLength(1);
  });

  it('SET_GRID_LEVELS grid seviyesini degistirir', () => {
    const api = createRadarChart({ axes, series });
    api.send({ type: 'SET_GRID_LEVELS', levels: 10 });
    expect(api.getContext().gridLines).toHaveLength(10);
  });

  it('bos axes ile bos context', () => {
    const api = createRadarChart({ axes: [], series: [] });
    const ctx = api.getContext();
    expect(ctx.series).toHaveLength(0);
    expect(ctx.axisLines).toHaveLength(0);
    expect(ctx.gridLines).toHaveLength(0);
  });

  it('max belirtilmemis axis icin otomatik max', () => {
    const noMaxAxes: RadarAxis[] = [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }];
    const s: RadarSeries[] = [{ name: 'S', values: { a: 50, b: 100 } }];
    const api = createRadarChart({ axes: noMaxAxes, series: s });
    const ctx = api.getContext();
    // b=100 max=100, normalized=1.0
    const bPoint = ctx.series[0]?.points.find((p) => p.axisKey === 'b');
    expect(bPoint?.normalizedValue).toBe(1);
  });

  it('subscribe bildirim alir', () => {
    const api = createRadarChart({ axes, series });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_GRID_LEVELS', levels: 3 });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createRadarChart({ axes, series });
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'SET_GRID_LEVELS', levels: 3 });
    expect(fn).not.toHaveBeenCalled();
  });
});
