/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createCascader, getColumnsFromPath, getLabelsFromPath } from './cascader.machine';
import type { CascaderOption } from './cascader.types';

// ── Test verileri / Test data ────────────────────────────────────────

const sampleOptions: CascaderOption[] = [
  {
    value: 'tr',
    label: 'Türkiye',
    children: [
      {
        value: 'ist',
        label: 'İstanbul',
        children: [
          { value: 'kad', label: 'Kadıköy' },
          { value: 'bes', label: 'Beşiktaş' },
        ],
      },
      { value: 'ank', label: 'Ankara' },
      { value: 'izm', label: 'İzmir', disabled: true },
    ],
  },
  {
    value: 'us',
    label: 'ABD',
    children: [
      { value: 'ny', label: 'New York' },
      { value: 'la', label: 'Los Angeles' },
    ],
  },
  { value: 'de', label: 'Almanya' },
];

function createDefault() {
  return createCascader({
    options: sampleOptions,
    placeholder: 'Konum seçin',
  });
}

// ── Helpers ──────────────────────────────────────────────────────────

describe('Cascader helpers', () => {
  it('getColumnsFromPath root dondurur (bos yol)', () => {
    const columns = getColumnsFromPath(sampleOptions, []);
    expect(columns).toHaveLength(1);
    expect(columns[0]).toBe(sampleOptions);
  });

  it('getColumnsFromPath iki seviye dondurur', () => {
    const columns = getColumnsFromPath(sampleOptions, ['tr']);
    expect(columns).toHaveLength(2);
    expect(columns[0]).toBe(sampleOptions);
    expect(columns[1]).toHaveLength(3); // İstanbul, Ankara, İzmir
  });

  it('getColumnsFromPath uc seviye dondurur', () => {
    const columns = getColumnsFromPath(sampleOptions, ['tr', 'ist']);
    expect(columns).toHaveLength(3);
    expect(columns[2]).toHaveLength(2); // Kadıköy, Beşiktaş
  });

  it('getColumnsFromPath yaprak dugumde durur', () => {
    const columns = getColumnsFromPath(sampleOptions, ['de']);
    expect(columns).toHaveLength(1); // Almanya yaprak, children yok
  });

  it('getLabelsFromPath etiketleri dondurur', () => {
    const labels = getLabelsFromPath(sampleOptions, ['tr', 'ist', 'kad']);
    expect(labels).toEqual(['Türkiye', 'İstanbul', 'Kadıköy']);
  });

  it('getLabelsFromPath bos yol icin bos dizi', () => {
    const labels = getLabelsFromPath(sampleOptions, []);
    expect(labels).toEqual([]);
  });

  it('getLabelsFromPath gecersiz yolda erken durur', () => {
    const labels = getLabelsFromPath(sampleOptions, ['tr', 'invalid']);
    expect(labels).toEqual(['Türkiye']);
  });
});

// ── Initial state ───────────────────────────────────────────────────

describe('Cascader — initial state', () => {
  it('baslangic durumu dogru', () => {
    const cascader = createDefault();
    const ctx = cascader.getContext();

    expect(ctx.isOpen).toBe(false);
    expect(ctx.interactionState).toBe('idle');
    expect(ctx.selectedPath).toEqual([]);
    expect(ctx.activePath).toEqual([]);
    expect(ctx.highlightedIndex).toBe(-1);
    expect(ctx.activeLevel).toBe(0);
    expect(ctx.placeholder).toBe('Konum seçin');
    expect(ctx.disabled).toBe(false);
    expect(ctx.readOnly).toBe(false);
  });

  it('defaultValue ile baslangic yolu ayarlanir', () => {
    const cascader = createCascader({
      options: sampleOptions,
      defaultValue: ['tr', 'ist'],
    });
    const ctx = cascader.getContext();

    expect(ctx.selectedPath).toEqual(['tr', 'ist']);
  });

  it('getSelectedLabels secili etiketleri dondurur', () => {
    const cascader = createCascader({
      options: sampleOptions,
      defaultValue: ['tr', 'ist', 'kad'],
    });

    expect(cascader.getSelectedLabels()).toEqual(['Türkiye', 'İstanbul', 'Kadıköy']);
  });

  it('getSelectedLabel son etiketi dondurur', () => {
    const cascader = createCascader({
      options: sampleOptions,
      defaultValue: ['tr', 'ist'],
    });

    expect(cascader.getSelectedLabel()).toBe('İstanbul');
  });

  it('getSelectedLabel bos yolda undefined', () => {
    const cascader = createDefault();
    expect(cascader.getSelectedLabel()).toBeUndefined();
  });
});

// ── OPEN / CLOSE / TOGGLE ───────────────────────────────────────────

describe('Cascader — OPEN / CLOSE / TOGGLE', () => {
  it('OPEN ile acar', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    const ctx = cascader.getContext();

    expect(ctx.isOpen).toBe(true);
    expect(ctx.interactionState).toBe('open');
    expect(ctx.activeLevel).toBe(0);
  });

  it('OPEN zaten acikken degisiklik yapmaz', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    const ctx1 = cascader.getContext();
    cascader.send({ type: 'OPEN' });
    const ctx2 = cascader.getContext();

    expect(ctx1).toBe(ctx2);
  });

  it('CLOSE ile kapatir', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'CLOSE' });
    const ctx = cascader.getContext();

    expect(ctx.isOpen).toBe(false);
    expect(ctx.interactionState).toBe('focused');
    expect(ctx.activePath).toEqual([]);
    expect(ctx.highlightedIndex).toBe(-1);
  });

  it('TOGGLE acip kapatir', () => {
    const cascader = createDefault();
    cascader.send({ type: 'TOGGLE' });
    expect(cascader.isOpen()).toBe(true);

    cascader.send({ type: 'TOGGLE' });
    expect(cascader.isOpen()).toBe(false);
  });

  it('readOnly durumda OPEN calismaz', () => {
    const cascader = createCascader({
      options: sampleOptions,
      readOnly: true,
    });
    cascader.send({ type: 'OPEN' });

    expect(cascader.isOpen()).toBe(false);
  });

  it('disabled durumda OPEN calismaz', () => {
    const cascader = createCascader({
      options: sampleOptions,
      disabled: true,
    });
    cascader.send({ type: 'OPEN' });

    expect(cascader.isOpen()).toBe(false);
  });

  it('OPEN secili yolu activePath olarak ayarlar', () => {
    const cascader = createCascader({
      options: sampleOptions,
      defaultValue: ['tr', 'ist'],
    });
    cascader.send({ type: 'OPEN' });
    const ctx = cascader.getContext();

    expect(ctx.activePath).toEqual(['tr', 'ist']);
  });
});

// ── SELECT ──────────────────────────────────────────────────────────

describe('Cascader — SELECT', () => {
  it('yaprak dugum secimi yapar ve kapatir', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'SELECT', path: ['tr', 'ank'] });
    const ctx = cascader.getContext();

    expect(ctx.selectedPath).toEqual(['tr', 'ank']);
    expect(ctx.isOpen).toBe(false);
    expect(ctx.activePath).toEqual([]);
  });

  it('derin secim yapar', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'SELECT', path: ['tr', 'ist', 'kad'] });

    expect(cascader.getSelectedLabels()).toEqual(['Türkiye', 'İstanbul', 'Kadıköy']);
  });
});

// ── EXPAND ──────────────────────────────────────────────────────────

describe('Cascader — EXPAND', () => {
  it('seviye 0 da expand eder', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'EXPAND', level: 0, value: 'tr' });
    const ctx = cascader.getContext();

    expect(ctx.activePath).toEqual(['tr']);
    expect(ctx.activeLevel).toBe(0);
  });

  it('seviye 1 de expand eder', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'EXPAND', level: 0, value: 'tr' });
    cascader.send({ type: 'EXPAND', level: 1, value: 'ist' });
    const ctx = cascader.getContext();

    expect(ctx.activePath).toEqual(['tr', 'ist']);
  });

  it('farkli dal secince onceki alt seviyeler temizlenir', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'EXPAND', level: 0, value: 'tr' });
    cascader.send({ type: 'EXPAND', level: 1, value: 'ist' });
    // Şimdi farklı ülkeye geç
    cascader.send({ type: 'EXPAND', level: 0, value: 'us' });
    const ctx = cascader.getContext();

    expect(ctx.activePath).toEqual(['us']);
  });

  it('kapali durumda expand calismaz', () => {
    const cascader = createDefault();
    const ctx1 = cascader.getContext();
    cascader.send({ type: 'EXPAND', level: 0, value: 'tr' });
    const ctx2 = cascader.getContext();

    expect(ctx1).toBe(ctx2);
  });
});

// ── HIGHLIGHT ───────────────────────────────────────────────────────

describe('Cascader — HIGHLIGHT', () => {
  it('HIGHLIGHT_NEXT ileri gider', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    const ctx = cascader.getContext();
    const firstIdx = ctx.highlightedIndex;

    cascader.send({ type: 'HIGHLIGHT_NEXT' });
    expect(cascader.getContext().highlightedIndex).toBe(firstIdx + 1);
  });

  it('HIGHLIGHT_PREV geri gider', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'HIGHLIGHT', index: 1 });
    cascader.send({ type: 'HIGHLIGHT_PREV' });

    expect(cascader.getContext().highlightedIndex).toBe(0);
  });

  it('HIGHLIGHT_FIRST ilk enabled indekse gider', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'HIGHLIGHT', index: 2 });
    cascader.send({ type: 'HIGHLIGHT_FIRST' });

    expect(cascader.getContext().highlightedIndex).toBe(0);
  });

  it('HIGHLIGHT_LAST son enabled indekse gider', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'HIGHLIGHT_LAST' });

    // Almanya (index 2) — son enabled option
    expect(cascader.getContext().highlightedIndex).toBe(2);
  });

  it('disabled secenegi atlayarak highlight eder', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    // Türkiye children: İstanbul(0), Ankara(1), İzmir(2 disabled)
    cascader.send({ type: 'EXPAND', level: 0, value: 'tr' });
    // Level 1 e geç
    cascader.send({ type: 'LEVEL_NEXT' });
    // Highlight last — İzmir disabled, Ankara(1) olmali
    cascader.send({ type: 'HIGHLIGHT_LAST' });

    expect(cascader.getContext().highlightedIndex).toBe(1); // Ankara
  });

  it('disabled secenek HIGHLIGHT ile ayarlanamaz', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'EXPAND', level: 0, value: 'tr' });
    cascader.send({ type: 'LEVEL_NEXT' });
    // İzmir disabled (index 2)
    const before = cascader.getContext().highlightedIndex;
    cascader.send({ type: 'HIGHLIGHT', index: 2 });

    expect(cascader.getContext().highlightedIndex).toBe(before);
  });
});

// ── LEVEL_NEXT / LEVEL_PREV ─────────────────────────────────────────

describe('Cascader — LEVEL_NEXT / LEVEL_PREV', () => {
  it('LEVEL_NEXT ile alt seviyeye gecer', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    // Highlight Türkiye (index 0, children var)
    cascader.send({ type: 'HIGHLIGHT', index: 0 });
    cascader.send({ type: 'LEVEL_NEXT' });
    const ctx = cascader.getContext();

    expect(ctx.activeLevel).toBe(1);
    expect(ctx.activePath).toEqual(['tr']);
    expect(ctx.highlightedIndex).toBe(0); // İstanbul
  });

  it('LEVEL_NEXT yaprak dugumde calismaz', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    // Almanya (index 2) — yaprak düğüm
    cascader.send({ type: 'HIGHLIGHT', index: 2 });
    const ctx1 = cascader.getContext();
    cascader.send({ type: 'LEVEL_NEXT' });
    const ctx2 = cascader.getContext();

    expect(ctx1).toBe(ctx2);
  });

  it('LEVEL_PREV ile ust seviyeye doner', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'HIGHLIGHT', index: 0 });
    cascader.send({ type: 'LEVEL_NEXT' });
    expect(cascader.getContext().activeLevel).toBe(1);

    cascader.send({ type: 'LEVEL_PREV' });
    const ctx = cascader.getContext();

    expect(ctx.activeLevel).toBe(0);
    expect(ctx.highlightedIndex).toBe(0); // Türkiye
  });

  it('LEVEL_PREV seviye 0 da calismaz', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    const ctx1 = cascader.getContext();
    cascader.send({ type: 'LEVEL_PREV' });
    const ctx2 = cascader.getContext();

    expect(ctx1).toBe(ctx2);
  });

  it('iki seviye ilerleyip geri doner', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    // Türkiye → İstanbul → Kadıköy/Beşiktaş
    cascader.send({ type: 'HIGHLIGHT', index: 0 });
    cascader.send({ type: 'LEVEL_NEXT' });
    cascader.send({ type: 'HIGHLIGHT', index: 0 }); // İstanbul
    cascader.send({ type: 'LEVEL_NEXT' });

    expect(cascader.getContext().activeLevel).toBe(2);
    expect(cascader.getContext().activePath).toEqual(['tr', 'ist']);

    cascader.send({ type: 'LEVEL_PREV' });
    expect(cascader.getContext().activeLevel).toBe(1);

    cascader.send({ type: 'LEVEL_PREV' });
    expect(cascader.getContext().activeLevel).toBe(0);
  });
});

// ── getOptionsAtLevel ───────────────────────────────────────────────

describe('Cascader — getOptionsAtLevel', () => {
  it('seviye 0 root seçenekleri dondurur', () => {
    const cascader = createDefault();
    const opts = cascader.getOptionsAtLevel(0);

    expect(opts).toHaveLength(3);
    expect(opts[0]?.label).toBe('Türkiye');
  });

  it('seviye 1 alt secenekleri dondurur', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'EXPAND', level: 0, value: 'tr' });
    const opts = cascader.getOptionsAtLevel(1);

    expect(opts).toHaveLength(3);
    expect(opts[0]?.label).toBe('İstanbul');
  });

  it('expand edilmemis seviyede bos dizi dondurur', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    const opts = cascader.getOptionsAtLevel(1);

    expect(opts).toEqual([]);
  });
});

// ── Prop sync ───────────────────────────────────────────────────────

describe('Cascader — prop sync', () => {
  it('SET_DISABLED acikken kapatir', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    expect(cascader.isOpen()).toBe(true);

    cascader.send({ type: 'SET_DISABLED', value: true });
    expect(cascader.isOpen()).toBe(false);
    expect(cascader.isInteractionBlocked()).toBe(true);
  });

  it('SET_VALUE secili yolu gunceller', () => {
    const cascader = createDefault();
    cascader.send({ type: 'SET_VALUE', value: ['us', 'ny'] });

    expect(cascader.getContext().selectedPath).toEqual(['us', 'ny']);
    expect(cascader.getSelectedLabels()).toEqual(['ABD', 'New York']);
  });

  it('SET_VALUE ayni degerle degisiklik yapmaz', () => {
    const cascader = createCascader({
      options: sampleOptions,
      defaultValue: ['tr'],
    });
    const ctx1 = cascader.getContext();
    cascader.send({ type: 'SET_VALUE', value: ['tr'] });
    const ctx2 = cascader.getContext();

    expect(ctx1).toBe(ctx2);
  });

  it('SET_OPTIONS seçenekleri günceller', () => {
    const cascader = createDefault();
    const newOptions: CascaderOption[] = [
      { value: 'x', label: 'X' },
      { value: 'y', label: 'Y' },
    ];
    cascader.send({ type: 'SET_OPTIONS', options: newOptions });

    expect(cascader.getContext().options).toBe(newOptions);
    expect(cascader.getOptionsAtLevel(0)).toHaveLength(2);
  });

  it('SET_READ_ONLY gunceller', () => {
    const cascader = createDefault();
    cascader.send({ type: 'SET_READ_ONLY', value: true });

    expect(cascader.getContext().readOnly).toBe(true);
  });

  it('SET_INVALID gunceller', () => {
    const cascader = createDefault();
    cascader.send({ type: 'SET_INVALID', value: true });

    expect(cascader.getContext().invalid).toBe(true);
  });
});

// ── Interaction states ──────────────────────────────────────────────

describe('Cascader — interaction states', () => {
  it('POINTER_ENTER idle dan hover a', () => {
    const cascader = createDefault();
    cascader.send({ type: 'POINTER_ENTER' });

    expect(cascader.getContext().interactionState).toBe('hover');
  });

  it('POINTER_LEAVE hover dan idle a', () => {
    const cascader = createDefault();
    cascader.send({ type: 'POINTER_ENTER' });
    cascader.send({ type: 'POINTER_LEAVE' });

    expect(cascader.getContext().interactionState).toBe('idle');
  });

  it('FOCUS focused a gecer', () => {
    const cascader = createDefault();
    cascader.send({ type: 'FOCUS' });

    expect(cascader.getContext().interactionState).toBe('focused');
  });

  it('BLUR idle a doner (kapali)', () => {
    const cascader = createDefault();
    cascader.send({ type: 'FOCUS' });
    cascader.send({ type: 'BLUR' });

    expect(cascader.getContext().interactionState).toBe('idle');
  });

  it('BLUR acikken kapatir ve idle a doner', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'BLUR' });

    expect(cascader.isOpen()).toBe(false);
    expect(cascader.getContext().interactionState).toBe('idle');
  });
});

// ── DOM props ───────────────────────────────────────────────────────

describe('Cascader — DOM props', () => {
  it('getTriggerProps dogru donerler', () => {
    const cascader = createDefault();
    const props = cascader.getTriggerProps();

    expect(props.role).toBe('combobox');
    expect(props['aria-expanded']).toBe(false);
    expect(props['aria-haspopup']).toBe('listbox');
    expect(props.tabIndex).toBe(0);
  });

  it('disabled trigger data-disabled set eder', () => {
    const cascader = createCascader({
      options: sampleOptions,
      disabled: true,
    });
    const props = cascader.getTriggerProps();

    expect(props['aria-disabled']).toBe(true);
    expect(props['data-disabled']).toBe('');
  });

  it('getColumnProps dogru dondurur', () => {
    const cascader = createDefault();
    const props = cascader.getColumnProps(0);

    expect(props.role).toBe('listbox');
    expect(props.tabIndex).toBe(-1);
    expect(props['aria-label']).toBe('Seviye 1');
  });

  it('getOptionProps selected ve highlighted set eder', () => {
    const cascader = createCascader({
      options: sampleOptions,
      defaultValue: ['tr'],
    });
    cascader.send({ type: 'OPEN' });

    const props = cascader.getOptionProps(0, 0); // Türkiye
    expect(props['aria-selected']).toBe(true);
    expect(props['data-highlighted']).toBe('');
  });

  it('getOptionProps expanded set eder', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'EXPAND', level: 0, value: 'tr' });

    const props = cascader.getOptionProps(0, 0); // Türkiye
    expect(props['data-expanded']).toBe('');
  });

  it('getOptionProps disabled set eder', () => {
    const cascader = createDefault();
    cascader.send({ type: 'OPEN' });
    cascader.send({ type: 'EXPAND', level: 0, value: 'tr' });

    const props = cascader.getOptionProps(1, 2); // İzmir (disabled)
    expect(props['aria-disabled']).toBe(true);
    expect(props['data-disabled']).toBe('');
  });
});

// ── Full flow ───────────────────────────────────────────────────────

describe('Cascader — full flow', () => {
  it('ac → expand → expand → sec → kapandi', () => {
    const cascader = createDefault();

    // Aç
    cascader.send({ type: 'OPEN' });
    expect(cascader.isOpen()).toBe(true);

    // Türkiye expand
    cascader.send({ type: 'EXPAND', level: 0, value: 'tr' });
    expect(cascader.getContext().activePath).toEqual(['tr']);

    // İstanbul expand
    cascader.send({ type: 'EXPAND', level: 1, value: 'ist' });
    expect(cascader.getContext().activePath).toEqual(['tr', 'ist']);

    // Kadıköy seç (yaprak)
    cascader.send({ type: 'SELECT', path: ['tr', 'ist', 'kad'] });
    expect(cascader.isOpen()).toBe(false);
    expect(cascader.getSelectedLabels()).toEqual(['Türkiye', 'İstanbul', 'Kadıköy']);
  });

  it('keyboard ile tam navigasyon', () => {
    const cascader = createDefault();

    // Aç
    cascader.send({ type: 'OPEN' });
    expect(cascader.getContext().highlightedIndex).toBe(0); // Türkiye

    // Aşağı → ABD
    cascader.send({ type: 'HIGHLIGHT_NEXT' });
    expect(cascader.getContext().highlightedIndex).toBe(1); // ABD

    // Yukarı → Türkiye
    cascader.send({ type: 'HIGHLIGHT_PREV' });
    expect(cascader.getContext().highlightedIndex).toBe(0); // Türkiye

    // Sağ → Türkiye children
    cascader.send({ type: 'LEVEL_NEXT' });
    expect(cascader.getContext().activeLevel).toBe(1);
    expect(cascader.getContext().highlightedIndex).toBe(0); // İstanbul

    // Sağ → İstanbul children
    cascader.send({ type: 'LEVEL_NEXT' });
    expect(cascader.getContext().activeLevel).toBe(2);
    expect(cascader.getContext().highlightedIndex).toBe(0); // Kadıköy

    // Sol → İstanbul seviyesine dön
    cascader.send({ type: 'LEVEL_PREV' });
    expect(cascader.getContext().activeLevel).toBe(1);
  });
});
