/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { linearScale, linearScaleInvert, bandScale, getBandWidth } from './scales';
import { generateTicks, niceNum, formatTickValue } from './ticks';
import { getChartColor, interpolateColor, heatmapColorScale, CHART_COLORS } from './colors';
import {
  polarToCartesian,
  describeArc,
  describePieSlice,
  pointsToSvgPath,
  pointsToAreaPath,
} from './geometry';

// ── Scales ──

describe('linearScale', () => {
  it('0-100 domain icin 0-300 range mapper', () => {
    const scale = linearScale(0, 100, 0, 300);
    expect(scale(0)).toBe(0);
    expect(scale(50)).toBe(150);
    expect(scale(100)).toBe(300);
  });

  it('negatif domain destekler', () => {
    const scale = linearScale(-50, 50, 0, 200);
    expect(scale(0)).toBe(100);
  });

  it('domain sifir span ise rangeMin doner', () => {
    const scale = linearScale(5, 5, 0, 100);
    expect(scale(5)).toBe(0);
  });
});

describe('linearScaleInvert', () => {
  it('pixel den degere donusturur', () => {
    const inv = linearScaleInvert(0, 100, 0, 300);
    expect(inv(150)).toBe(50);
  });
});

describe('bandScale', () => {
  it('kategorileri esit aralikla dagilir', () => {
    const scale = bandScale(['A', 'B', 'C'], 0, 300, 0);
    const a = scale('A');
    const b = scale('B');
    expect(a.x).toBe(0);
    expect(b.x).toBe(100);
    expect(a.width).toBe(100);
  });

  it('padding ile araliklar daralir', () => {
    const scale = bandScale(['A', 'B'], 0, 200, 0.2);
    const a = scale('A');
    expect(a.width).toBe(80);
    expect(a.x).toBe(10);
  });

  it('bos kategori icin varsayilan doner', () => {
    const scale = bandScale([], 0, 100);
    expect(scale('X').width).toBe(0);
  });

  it('olmayan kategori icin varsayilan doner', () => {
    const scale = bandScale(['A'], 0, 100);
    expect(scale('B').width).toBe(0);
  });
});

describe('getBandWidth', () => {
  it('band genisligini hesaplar', () => {
    expect(getBandWidth(4, 0, 400, 0)).toBe(100);
  });
});

// ── Ticks ──

describe('niceNum', () => {
  it('guzel sayi uretir', () => {
    const n1 = niceNum(0.7, true);
    expect(n1 === 0.5 || n1 === 1).toBe(true);
    expect(niceNum(3.5, true)).toBe(5);
    expect(niceNum(8, true)).toBe(10);
  });
});

describe('generateTicks', () => {
  it('tick degerleri uretir', () => {
    const ticks = generateTicks(0, 100, 5);
    expect(ticks.length).toBeGreaterThanOrEqual(3);
    expect(ticks[0]).toBeLessThanOrEqual(0);
  });

  it('ayni min/max tek tick doner', () => {
    const ticks = generateTicks(5, 5);
    expect(ticks).toEqual([5]);
  });

  it('negatif aralik destekler', () => {
    const ticks = generateTicks(-50, 50, 5);
    expect(ticks.length).toBeGreaterThanOrEqual(3);
  });
});

describe('formatTickValue', () => {
  it('1000 den buyuk K formatlar', () => {
    expect(formatTickValue(1500)).toBe('1.5K');
  });

  it('1000000 den buyuk M formatlar', () => {
    expect(formatTickValue(2500000)).toBe('2.5M');
  });

  it('tam sayiyi oldugi gibi formatlar', () => {
    expect(formatTickValue(42)).toBe('42');
  });

  it('ondalik sayiyi bir basamak formatlar', () => {
    expect(formatTickValue(3.14)).toBe('3.1');
  });
});

// ── Colors ──

describe('getChartColor', () => {
  it('index ile renk doner', () => {
    expect(getChartColor(0)).toBe(CHART_COLORS[0]);
  });

  it('modulo ile tekrar eder', () => {
    expect(getChartColor(10)).toBe(CHART_COLORS[0]);
  });
});

describe('interpolateColor', () => {
  it('iki hex renk arasi interpolasyon yapar', () => {
    const result = interpolateColor('#000000', '#ffffff', 0.5);
    expect(result).toBe('rgb(128, 128, 128)');
  });

  it('t=0 ilk rengi doner', () => {
    const result = interpolateColor('#ff0000', '#0000ff', 0);
    expect(result).toBe('rgb(255, 0, 0)');
  });

  it('t=1 ikinci rengi doner', () => {
    const result = interpolateColor('#ff0000', '#0000ff', 1);
    expect(result).toBe('rgb(0, 0, 255)');
  });
});

describe('heatmapColorScale', () => {
  it('min deger icin dusuk renk doner', () => {
    const scale = heatmapColorScale(0, 100, '#000000', '#ffffff');
    expect(scale(0)).toBe('rgb(0, 0, 0)');
  });

  it('max deger icin yuksek renk doner', () => {
    const scale = heatmapColorScale(0, 100, '#000000', '#ffffff');
    expect(scale(100)).toBe('rgb(255, 255, 255)');
  });

  it('min=max ise dusuk renk doner', () => {
    const scale = heatmapColorScale(5, 5);
    expect(typeof scale(5)).toBe('string');
  });
});

// ── Geometry ──

describe('polarToCartesian', () => {
  it('0 derece icin yukari noktayi doner', () => {
    const p = polarToCartesian(50, 50, 40, 0);
    expect(Math.round(p.x)).toBe(50);
    expect(Math.round(p.y)).toBe(10);
  });

  it('90 derece icin sag noktayi doner', () => {
    const p = polarToCartesian(50, 50, 40, 90);
    expect(Math.round(p.x)).toBe(90);
    expect(Math.round(p.y)).toBe(50);
  });
});

describe('describeArc', () => {
  it('arc path string doner', () => {
    const path = describeArc(50, 50, 40, 0, 90);
    expect(path).toContain('M');
    expect(path).toContain('A');
  });
});

describe('describePieSlice', () => {
  it('inner radius 0 ise uc noktali slice doner', () => {
    const path = describePieSlice(50, 50, 40, 0, 0, 90);
    expect(path).toContain('Z');
    expect(path).toContain('L 50 50');
  });

  it('donut dilimi inner radius ile olusturulur', () => {
    const path = describePieSlice(50, 50, 40, 20, 0, 90);
    expect(path).toContain('Z');
    expect(path).not.toContain('L 50 50');
  });
});

describe('pointsToSvgPath', () => {
  it('bos array bos string doner', () => {
    expect(pointsToSvgPath([])).toBe('');
  });

  it('nokta dizisini SVG path e cevirir', () => {
    const path = pointsToSvgPath([{ x: 0, y: 0 }, { x: 10, y: 20 }]);
    expect(path).toBe('M 0 0 L 10 20');
  });
});

describe('pointsToAreaPath', () => {
  it('kapali area path olusturur', () => {
    const path = pointsToAreaPath([{ x: 0, y: 10 }, { x: 20, y: 5 }], 50);
    expect(path).toContain('Z');
    expect(path).toContain('L 20 50');
  });
});
