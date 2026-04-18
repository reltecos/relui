/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createFontPicker } from './font-picker.machine';

describe('createFontPicker', () => {
  it('baslangic config varsayilan', () => {
    const api = createFontPicker();
    const ctx = api.getContext();
    expect(ctx.config.family).toBe('Arial');
    expect(ctx.config.size).toBe(16);
    expect(ctx.config.weight).toBe(400);
    expect(ctx.config.bold).toBe(false);
    expect(ctx.config.italic).toBe(false);
    expect(ctx.config.underline).toBe(false);
  });

  it('defaultConfig ile baslatilir', () => {
    const api = createFontPicker({ defaultConfig: { family: 'Georgia', size: 20 } });
    expect(api.getContext().config.family).toBe('Georgia');
    expect(api.getContext().config.size).toBe(20);
  });

  it('varsayilan fontlar yuklenir', () => {
    const api = createFontPicker();
    expect(api.getContext().availableFonts.length).toBeGreaterThan(0);
    expect(api.getContext().availableFonts).toContain('Arial');
  });

  it('ozel font listesi yuklenir', () => {
    const api = createFontPicker({ fonts: ['Custom1', 'Custom2'] });
    expect(api.getContext().availableFonts).toEqual(['Custom1', 'Custom2']);
  });

  it('SET_FAMILY aileyi degistirir', () => {
    const api = createFontPicker();
    api.send({ type: 'SET_FAMILY', family: 'Georgia' });
    expect(api.getContext().config.family).toBe('Georgia');
  });

  it('SET_SIZE boyutu degistirir', () => {
    const api = createFontPicker();
    api.send({ type: 'SET_SIZE', size: 24 });
    expect(api.getContext().config.size).toBe(24);
  });

  it('SET_SIZE minimum 1', () => {
    const api = createFontPicker();
    api.send({ type: 'SET_SIZE', size: 0 });
    expect(api.getContext().config.size).toBe(1);
  });

  it('SET_SIZE maximum 999', () => {
    const api = createFontPicker();
    api.send({ type: 'SET_SIZE', size: 5000 });
    expect(api.getContext().config.size).toBe(999);
  });

  it('SET_WEIGHT agirligi degistirir', () => {
    const api = createFontPicker();
    api.send({ type: 'SET_WEIGHT', weight: 600 });
    expect(api.getContext().config.weight).toBe(600);
  });

  it('TOGGLE_BOLD bold toggle yapar ve weight gunceller', () => {
    const api = createFontPicker();
    api.send({ type: 'TOGGLE_BOLD' });
    expect(api.getContext().config.bold).toBe(true);
    expect(api.getContext().config.weight).toBe(700);
    api.send({ type: 'TOGGLE_BOLD' });
    expect(api.getContext().config.bold).toBe(false);
    expect(api.getContext().config.weight).toBe(400);
  });

  it('TOGGLE_ITALIC italic toggle yapar', () => {
    const api = createFontPicker();
    api.send({ type: 'TOGGLE_ITALIC' });
    expect(api.getContext().config.italic).toBe(true);
    api.send({ type: 'TOGGLE_ITALIC' });
    expect(api.getContext().config.italic).toBe(false);
  });

  it('TOGGLE_UNDERLINE underline toggle yapar', () => {
    const api = createFontPicker();
    api.send({ type: 'TOGGLE_UNDERLINE' });
    expect(api.getContext().config.underline).toBe(true);
  });

  it('SET_CONFIG partial guncelleme yapar', () => {
    const api = createFontPicker();
    api.send({ type: 'SET_CONFIG', config: { family: 'Verdana', size: 18, bold: true } });
    const cfg = api.getContext().config;
    expect(cfg.family).toBe('Verdana');
    expect(cfg.size).toBe(18);
    expect(cfg.bold).toBe(true);
  });

  it('RESET varsayilana doner', () => {
    const api = createFontPicker({ defaultConfig: { family: 'Georgia' } });
    api.send({ type: 'SET_FAMILY', family: 'Impact' });
    api.send({ type: 'RESET' });
    expect(api.getContext().config.family).toBe('Georgia');
  });

  it('onChange callback cagrilir', () => {
    const onChange = vi.fn();
    const api = createFontPicker({ onChange });
    api.send({ type: 'SET_SIZE', size: 20 });
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].size).toBe(20);
  });

  it('subscribe bildirim alir', () => {
    const api = createFontPicker();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'TOGGLE_BOLD' });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createFontPicker();
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'TOGGLE_BOLD' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('getContext immutable kopya doner', () => {
    const api = createFontPicker();
    const ctx1 = api.getContext();
    const ctx2 = api.getContext();
    expect(ctx1.config).not.toBe(ctx2.config);
    expect(ctx1.config).toEqual(ctx2.config);
  });
});
