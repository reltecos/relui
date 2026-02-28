/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createSegmentedControl } from './segmented-control.machine';
import type { SegmentedControlOption } from './segmented-control.types';

// ── Test verileri / Test data ────────────────────────────────────────

const basicOptions: SegmentedControlOption[] = [
  { value: 'list', label: 'Liste' },
  { value: 'grid', label: 'Izgara' },
  { value: 'kanban', label: 'Kanban' },
];

const withDisabledOptions: SegmentedControlOption[] = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B', disabled: true },
  { value: 'c', label: 'C' },
];

const allDisabledOptions: SegmentedControlOption[] = [
  { value: 'x', label: 'X', disabled: true },
  { value: 'y', label: 'Y', disabled: true },
];

describe('SegmentedControl Machine', () => {
  // ── Başlangıç durumu ────────────────────────────────────────────

  describe('initial state / başlangıç durumu', () => {
    it('varsayılan context / default context', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      const ctx = sc.getContext();
      expect(ctx.selectedValue).toBeUndefined();
      expect(ctx.focusedIndex).toBe(0);
      expect(ctx.disabled).toBe(false);
      expect(ctx.readOnly).toBe(false);
      expect(ctx.interactionState).toBe('idle');
    });

    it('defaultValue ile başlangıç / initializes with defaultValue', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'grid' });
      const ctx = sc.getContext();
      expect(ctx.selectedValue).toBe('grid');
      expect(ctx.focusedIndex).toBe(1);
    });

    it('value ile başlangıç / initializes with value', () => {
      const sc = createSegmentedControl({ options: basicOptions, value: 'kanban' });
      const ctx = sc.getContext();
      expect(ctx.selectedValue).toBe('kanban');
      expect(ctx.focusedIndex).toBe(2);
    });

    it('disabled baslangic / disabled initial', () => {
      const sc = createSegmentedControl({ options: basicOptions, disabled: true });
      expect(sc.getContext().disabled).toBe(true);
    });

    it('readOnly baslangic / readOnly initial', () => {
      const sc = createSegmentedControl({ options: basicOptions, readOnly: true });
      expect(sc.getContext().readOnly).toBe(true);
    });

    it('disabled option atlanır baslangicta / disabled option skipped initially', () => {
      const opts: SegmentedControlOption[] = [
        { value: 'a', label: 'A', disabled: true },
        { value: 'b', label: 'B' },
      ];
      const sc = createSegmentedControl({ options: opts });
      expect(sc.getContext().focusedIndex).toBe(1);
    });
  });

  // ── Seçim ───────────────────────────────────────────────────────

  describe('selection / seçim', () => {
    it('segment seçer / selects segment', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'SELECT', value: 'grid' });
      expect(sc.getContext().selectedValue).toBe('grid');
      expect(sc.getContext().focusedIndex).toBe(1);
    });

    it('aynı değer seçimde değişmez / same value no change', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'list' });
      const prev = sc.getContext();
      sc.send({ type: 'SELECT', value: 'list' });
      expect(sc.getContext()).toBe(prev);
    });

    it('disabled segment seçilemez / disabled segment cannot be selected', () => {
      const sc = createSegmentedControl({ options: withDisabledOptions });
      sc.send({ type: 'SELECT', value: 'b' });
      expect(sc.getContext().selectedValue).toBeUndefined();
    });

    it('geçersiz değer seçilemez / invalid value cannot be selected', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'SELECT', value: 'nonexistent' });
      expect(sc.getContext().selectedValue).toBeUndefined();
    });

    it('readOnly iken seçim engellenir / selection blocked when readOnly', () => {
      const sc = createSegmentedControl({ options: basicOptions, readOnly: true });
      sc.send({ type: 'SELECT', value: 'grid' });
      expect(sc.getContext().selectedValue).toBeUndefined();
    });

    it('disabled iken seçim engellenir / selection blocked when disabled', () => {
      const sc = createSegmentedControl({ options: basicOptions, disabled: true });
      sc.send({ type: 'SELECT', value: 'grid' });
      expect(sc.getContext().selectedValue).toBeUndefined();
    });
  });

  // ── Klavye navigasyon ──────────────────────────────────────────

  describe('keyboard navigation / klavye navigasyon', () => {
    it('FOCUS_NEXT ile sonraki / next with FOCUS_NEXT', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'FOCUS_NEXT' });
      expect(sc.getContext().focusedIndex).toBe(1);
    });

    it('FOCUS_PREV ile önceki / prev with FOCUS_PREV', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'grid' });
      sc.send({ type: 'FOCUS_PREV' });
      expect(sc.getContext().focusedIndex).toBe(0);
    });

    it('FOCUS_NEXT sonda wrap eder / FOCUS_NEXT wraps at end', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'kanban' });
      sc.send({ type: 'FOCUS_NEXT' });
      expect(sc.getContext().focusedIndex).toBe(0);
    });

    it('FOCUS_PREV basta wrap eder / FOCUS_PREV wraps at start', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'list' });
      sc.send({ type: 'FOCUS_PREV' });
      expect(sc.getContext().focusedIndex).toBe(2);
    });

    it('FOCUS_FIRST ilk aktif / FOCUS_FIRST first enabled', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'kanban' });
      sc.send({ type: 'FOCUS_FIRST' });
      expect(sc.getContext().focusedIndex).toBe(0);
    });

    it('FOCUS_LAST son aktif / FOCUS_LAST last enabled', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'FOCUS_LAST' });
      expect(sc.getContext().focusedIndex).toBe(2);
    });

    it('disabled segment atlanır / disabled segment skipped', () => {
      const sc = createSegmentedControl({ options: withDisabledOptions });
      // focusedIndex = 0 (A)
      sc.send({ type: 'FOCUS_NEXT' });
      // B disabled → C'ye atlar
      expect(sc.getContext().focusedIndex).toBe(2);
    });

    it('disabled iken navigasyon engellenir / navigation blocked when disabled', () => {
      const sc = createSegmentedControl({ options: basicOptions, disabled: true });
      const prev = sc.getContext();
      sc.send({ type: 'FOCUS_NEXT' });
      expect(sc.getContext()).toBe(prev);
    });

    it('zaten ilk indekste FOCUS_FIRST değişmez / FOCUS_FIRST no change at first', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      const prev = sc.getContext();
      sc.send({ type: 'FOCUS_FIRST' });
      expect(sc.getContext()).toBe(prev);
    });

    it('zaten son indekste FOCUS_LAST değişmez / FOCUS_LAST no change at last', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'kanban' });
      const prev = sc.getContext();
      sc.send({ type: 'FOCUS_LAST' });
      expect(sc.getContext()).toBe(prev);
    });
  });

  // ── Focus / Blur ──────────────────────────────────────────────

  describe('focus / blur', () => {
    it('FOCUS ile focused state / FOCUS sets focused state', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'FOCUS', index: 1 });
      expect(sc.getContext().focusedIndex).toBe(1);
      expect(sc.getContext().interactionState).toBe('focused');
    });

    it('BLUR ile idle state / BLUR sets idle state', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'FOCUS', index: 0 });
      sc.send({ type: 'BLUR' });
      expect(sc.getContext().interactionState).toBe('idle');
    });

    it('geçersiz indeks FOCUS yoksar / invalid index FOCUS ignored', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      const prev = sc.getContext();
      sc.send({ type: 'FOCUS', index: -1 });
      expect(sc.getContext()).toBe(prev);
    });

    it('sınır dışı indeks FOCUS yoksar / out of bounds FOCUS ignored', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      const prev = sc.getContext();
      sc.send({ type: 'FOCUS', index: 10 });
      expect(sc.getContext()).toBe(prev);
    });
  });

  // ── Etkileşim durumları ─────────────────────────────────────────

  describe('interaction states / etkileşim durumları', () => {
    it('POINTER_ENTER hover yapabilir / POINTER_ENTER can hover', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'POINTER_ENTER' });
      expect(sc.getContext().interactionState).toBe('hover');
    });

    it('POINTER_LEAVE idle yapar / POINTER_LEAVE sets idle', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'POINTER_ENTER' });
      sc.send({ type: 'POINTER_LEAVE' });
      expect(sc.getContext().interactionState).toBe('idle');
    });

    it('focused durumda POINTER_ENTER değişmez / POINTER_ENTER no change when focused', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'FOCUS', index: 0 });
      const prev = sc.getContext();
      sc.send({ type: 'POINTER_ENTER' });
      expect(sc.getContext()).toBe(prev);
    });

    it('disabled durumda POINTER_ENTER engellenir / POINTER_ENTER blocked when disabled', () => {
      const sc = createSegmentedControl({ options: basicOptions, disabled: true });
      const prev = sc.getContext();
      sc.send({ type: 'POINTER_ENTER' });
      expect(sc.getContext()).toBe(prev);
    });
  });

  // ── Prop güncellemeleri ──────────────────────────────────────────

  describe('prop updates / prop güncellemeleri', () => {
    it('SET_DISABLED true / SET_DISABLED true', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'SET_DISABLED', value: true });
      expect(sc.getContext().disabled).toBe(true);
      expect(sc.getContext().interactionState).toBe('idle');
    });

    it('SET_DISABLED aynı değer değişmez / SET_DISABLED same value no change', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      const prev = sc.getContext();
      sc.send({ type: 'SET_DISABLED', value: false });
      expect(sc.getContext()).toBe(prev);
    });

    it('SET_READ_ONLY true / SET_READ_ONLY true', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'SET_READ_ONLY', value: true });
      expect(sc.getContext().readOnly).toBe(true);
    });

    it('SET_READ_ONLY aynı değer değişmez / SET_READ_ONLY same value no change', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      const prev = sc.getContext();
      sc.send({ type: 'SET_READ_ONLY', value: false });
      expect(sc.getContext()).toBe(prev);
    });

    it('SET_VALUE ile değer değişir / SET_VALUE changes value', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'SET_VALUE', value: 'grid' });
      expect(sc.getContext().selectedValue).toBe('grid');
      expect(sc.getContext().focusedIndex).toBe(1);
    });

    it('SET_VALUE aynı değer değişmez / SET_VALUE same value no change', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'list' });
      const prev = sc.getContext();
      sc.send({ type: 'SET_VALUE', value: 'list' });
      expect(sc.getContext()).toBe(prev);
    });

    it('SET_OPTIONS ile seçenekler güncellenir / SET_OPTIONS updates options', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'list' });
      const newOptions = [
        { value: 'list', label: 'Liste' },
        { value: 'table', label: 'Tablo' },
      ];
      sc.send({ type: 'SET_OPTIONS', options: newOptions });
      expect(sc.getContext().options).toBe(newOptions);
      expect(sc.getContext().focusedIndex).toBe(0); // 'list' hala index 0
    });

    it('SET_OPTIONS seçili değer kaybolursa focusedIndex güncellenir / SET_OPTIONS updates focusedIndex when value removed', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'kanban' });
      const newOptions = [
        { value: 'list', label: 'Liste' },
        { value: 'grid', label: 'Izgara' },
      ];
      sc.send({ type: 'SET_OPTIONS', options: newOptions });
      // kanban yok → ilk aktif index
      expect(sc.getContext().focusedIndex).toBe(0);
    });
  });

  // ── DOM Props ─────────────────────────────────────────────────

  describe('DOM props', () => {
    it('root props tablist rolü / root props tablist role', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      const props = sc.getRootProps();
      expect(props.role).toBe('tablist');
      expect(props['aria-disabled']).toBeUndefined();
      expect(props['data-disabled']).toBeUndefined();
      expect(props['data-readonly']).toBeUndefined();
    });

    it('root props disabled / root props disabled', () => {
      const sc = createSegmentedControl({ options: basicOptions, disabled: true });
      const props = sc.getRootProps();
      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('root props readOnly / root props readOnly', () => {
      const sc = createSegmentedControl({ options: basicOptions, readOnly: true });
      const props = sc.getRootProps();
      expect(props['data-readonly']).toBe('');
    });

    it('item props — seçili segment / item props — selected segment', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'list' });
      const props = sc.getItemProps(0);
      expect(props.role).toBe('tab');
      expect(props['aria-selected']).toBe(true);
      expect(props['data-state']).toBe('active');
      expect(props.tabIndex).toBe(0);
    });

    it('item props — seçili olmayan segment / item props — unselected segment', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'list' });
      const props = sc.getItemProps(1);
      expect(props['aria-selected']).toBe(false);
      expect(props['data-state']).toBe('inactive');
      expect(props.tabIndex).toBe(-1);
    });

    it('item props — disabled segment / item props — disabled segment', () => {
      const sc = createSegmentedControl({ options: withDisabledOptions });
      const props = sc.getItemProps(1);
      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('item props — tüm disabled iken / item props — when all disabled', () => {
      const sc = createSegmentedControl({ options: basicOptions, disabled: true });
      const props = sc.getItemProps(0);
      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('item props id formatı / item props id format', () => {
      const sc = createSegmentedControl({ options: basicOptions }, 'mysc');
      const props = sc.getItemProps(0);
      expect(props.id).toBe('mysc-tab-0');
    });

    it('roving tabindex — focusedIndex segment tabIndex 0 / roving tabindex', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      sc.send({ type: 'FOCUS', index: 2 });
      expect(sc.getItemProps(0).tabIndex).toBe(-1);
      expect(sc.getItemProps(1).tabIndex).toBe(-1);
      expect(sc.getItemProps(2).tabIndex).toBe(0);
    });
  });

  // ── API helper'lar ─────────────────────────────────────────────

  describe('API helpers', () => {
    it('getSelectedIndex seçili indeks / getSelectedIndex returns selected index', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'grid' });
      expect(sc.getSelectedIndex()).toBe(1);
    });

    it('getSelectedIndex seçim yoksa -1 / getSelectedIndex -1 when no selection', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      expect(sc.getSelectedIndex()).toBe(-1);
    });

    it('getSelectedLabel seçili etiket / getSelectedLabel returns label', () => {
      const sc = createSegmentedControl({ options: basicOptions, defaultValue: 'kanban' });
      expect(sc.getSelectedLabel()).toBe('Kanban');
    });

    it('getSelectedLabel seçim yoksa undefined / getSelectedLabel undefined when no selection', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      expect(sc.getSelectedLabel()).toBeUndefined();
    });

    it('isInteractionBlocked disabled iken true / isInteractionBlocked true when disabled', () => {
      const sc = createSegmentedControl({ options: basicOptions, disabled: true });
      expect(sc.isInteractionBlocked()).toBe(true);
    });

    it('isInteractionBlocked normal iken false / isInteractionBlocked false normally', () => {
      const sc = createSegmentedControl({ options: basicOptions });
      expect(sc.isInteractionBlocked()).toBe(false);
    });
  });

  // ── Edge cases ────────────────────────────────────────────────

  describe('edge cases', () => {
    it('boş options / empty options', () => {
      const sc = createSegmentedControl({ options: [] });
      expect(sc.getContext().focusedIndex).toBe(-1);
      expect(sc.getSelectedIndex()).toBe(-1);
    });

    it('tüm disabled options / all disabled options', () => {
      const sc = createSegmentedControl({ options: allDisabledOptions });
      expect(sc.getContext().focusedIndex).toBe(-1);
      sc.send({ type: 'FOCUS_NEXT' });
      expect(sc.getContext().focusedIndex).toBe(-1);
    });

    it('tek option / single option', () => {
      const sc = createSegmentedControl({
        options: [{ value: 'only', label: 'Tek' }],
        defaultValue: 'only',
      });
      expect(sc.getContext().selectedValue).toBe('only');
      sc.send({ type: 'FOCUS_NEXT' });
      expect(sc.getContext().focusedIndex).toBe(0); // wrap, tek seçenek
    });
  });
});
