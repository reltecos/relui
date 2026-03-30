/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  createColorPicker,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
} from './color-picker.machine';

// ── Color Conversion Tests ──

describe('hexToRgb', () => {
  it('6 haneli hex donusturur', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('3 haneli hex donusturur', () => {
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('hash olmadan calisir', () => {
    expect(hexToRgb('00ff00')).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('gecersiz hex icin siyah doner', () => {
    expect(hexToRgb('#xyz')).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe('rgbToHex', () => {
  it('rgb i hex e donusturur', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
  });

  it('siyah donusturur', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
  });

  it('beyaz donusturur', () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
  });
});

describe('rgbToHsl / hslToRgb', () => {
  it('kirmizi donusum yapar', () => {
    const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it('hsl den rgb ye geri donus', () => {
    const rgb = hslToRgb({ h: 0, s: 100, l: 50 });
    expect(rgb.r).toBe(255);
    expect(rgb.g).toBe(0);
    expect(rgb.b).toBe(0);
  });

  it('gri renk s=0', () => {
    const hsl = rgbToHsl({ r: 128, g: 128, b: 128 });
    expect(hsl.s).toBe(0);
  });
});

describe('rgbToHsv / hsvToRgb', () => {
  it('kirmizi donusum yapar', () => {
    const hsv = rgbToHsv({ r: 255, g: 0, b: 0 });
    expect(hsv.h).toBe(0);
    expect(hsv.s).toBe(100);
    expect(hsv.v).toBe(100);
  });

  it('hsv den rgb ye geri donus', () => {
    const rgb = hsvToRgb({ h: 0, s: 100, v: 100 });
    expect(rgb.r).toBe(255);
    expect(rgb.g).toBe(0);
    expect(rgb.b).toBe(0);
  });

  it('siyah v=0', () => {
    const rgb = hsvToRgb({ h: 0, s: 0, v: 0 });
    expect(rgb).toEqual({ r: 0, g: 0, b: 0 });
  });
});

// ── State Machine Tests ──

describe('createColorPicker', () => {
  it('varsayilan renk ile olusturulur', () => {
    const cp = createColorPicker();
    const ctx = cp.getContext();
    expect(ctx.hex).toBe('#3b82f6');
    expect(ctx.alpha).toBe(1);
  });

  it('custom renk ile olusturulur', () => {
    const cp = createColorPicker({ defaultColor: '#ff0000' });
    expect(cp.getContext().hex).toBe('#ff0000');
    expect(cp.getContext().rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('SET_HEX ile renk guncellenir', () => {
    const cp = createColorPicker();
    cp.send({ type: 'SET_HEX', hex: '#00ff00' });
    expect(cp.getContext().hex).toBe('#00ff00');
    expect(cp.getContext().rgb.g).toBe(255);
  });

  it('SET_HEX gecersiz hex i reddeder', () => {
    const cp = createColorPicker({ defaultColor: '#ff0000' });
    cp.send({ type: 'SET_HEX', hex: 'invalid' });
    expect(cp.getContext().hex).toBe('#ff0000');
  });

  it('SET_RGB ile renk guncellenir', () => {
    const cp = createColorPicker();
    cp.send({ type: 'SET_RGB', rgb: { r: 0, g: 0, b: 255 } });
    expect(cp.getContext().hex).toBe('#0000ff');
  });

  it('SET_HSV ile renk guncellenir', () => {
    const cp = createColorPicker();
    cp.send({ type: 'SET_HSV', hsv: { h: 0, s: 100, v: 100 } });
    expect(cp.getContext().hex).toBe('#ff0000');
  });

  it('SET_HSL ile renk guncellenir', () => {
    const cp = createColorPicker();
    cp.send({ type: 'SET_HSL', hsl: { h: 120, s: 100, l: 50 } });
    expect(cp.getContext().hex).toBe('#00ff00');
  });

  it('SET_ALPHA ile alpha guncellenir', () => {
    const cp = createColorPicker();
    cp.send({ type: 'SET_ALPHA', alpha: 0.5 });
    expect(cp.getContext().alpha).toBe(0.5);
  });

  it('SET_ALPHA clamp edilir', () => {
    const cp = createColorPicker();
    cp.send({ type: 'SET_ALPHA', alpha: 2 });
    expect(cp.getContext().alpha).toBe(1);
  });

  it('SET_ALPHA ayni deger notify etmez', () => {
    const onChange = vi.fn();
    const cp = createColorPicker({ defaultAlpha: 1, onChange });
    cp.send({ type: 'SET_ALPHA', alpha: 1 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('SET_HUE ile hue guncellenir', () => {
    const cp = createColorPicker({ defaultColor: '#ff0000' });
    cp.send({ type: 'SET_HUE', hue: 120 });
    const ctx = cp.getContext();
    expect(ctx.hsv.h).toBe(120);
  });

  it('SET_SATURATION_VALUE ile s ve v guncellenir', () => {
    const cp = createColorPicker({ defaultColor: '#ff0000' });
    cp.send({ type: 'SET_SATURATION_VALUE', s: 50, v: 50 });
    const ctx = cp.getContext();
    expect(ctx.hsv.s).toBe(50);
    expect(ctx.hsv.v).toBe(50);
  });

  it('onChange callback cagrilir', () => {
    const onChange = vi.fn();
    const cp = createColorPicker({ onChange });
    cp.send({ type: 'SET_HEX', hex: '#00ff00' });
    expect(onChange).toHaveBeenCalledWith('#00ff00', 1);
  });

  it('subscribe calisiyor', () => {
    const cp = createColorPicker();
    const listener = vi.fn();
    cp.subscribe(listener);
    cp.send({ type: 'SET_HEX', hex: '#ff0000' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe calisiyor', () => {
    const cp = createColorPicker();
    const listener = vi.fn();
    const unsub = cp.subscribe(listener);
    unsub();
    cp.send({ type: 'SET_HEX', hex: '#ff0000' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('destroy tum listener lari temizler', () => {
    const cp = createColorPicker();
    const listener = vi.fn();
    cp.subscribe(listener);
    cp.destroy();
    cp.send({ type: 'SET_HEX', hex: '#ff0000' });
    expect(listener).not.toHaveBeenCalled();
  });
});
