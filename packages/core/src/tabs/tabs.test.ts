/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createTabs } from './tabs.machine';
import type { TabItem } from './tabs.types';

const defaultItems: TabItem[] = [
  { value: 'home', label: 'Ana Sayfa' },
  { value: 'profile', label: 'Profil' },
  { value: 'settings', label: 'Ayarlar' },
];

describe('createTabs', () => {
  // ── Oluşturma / Creation ─────────────────────────────────────────

  it('varsayılan context ile oluşturulur', () => {
    const tabs = createTabs({ items: defaultItems });
    const ctx = tabs.getContext();
    expect(ctx.items).toEqual(defaultItems);
    expect(ctx.selectedValue).toBeUndefined();
    expect(ctx.focusedIndex).toBe(0);
    expect(ctx.disabled).toBe(false);
    expect(ctx.orientation).toBe('horizontal');
    expect(ctx.activationMode).toBe('automatic');
    expect(ctx.interactionState).toBe('idle');
  });

  it('defaultValue ile oluşturulur', () => {
    const tabs = createTabs({ items: defaultItems, defaultValue: 'profile' });
    const ctx = tabs.getContext();
    expect(ctx.selectedValue).toBe('profile');
    expect(ctx.focusedIndex).toBe(1);
  });

  it('value (controlled) ile oluşturulur', () => {
    const tabs = createTabs({ items: defaultItems, value: 'settings' });
    const ctx = tabs.getContext();
    expect(ctx.selectedValue).toBe('settings');
    expect(ctx.focusedIndex).toBe(2);
  });

  it('disabled ile oluşturulur', () => {
    const tabs = createTabs({ items: defaultItems, disabled: true });
    expect(tabs.getContext().disabled).toBe(true);
  });

  it('vertical orientation ile oluşturulur', () => {
    const tabs = createTabs({ items: defaultItems, orientation: 'vertical' });
    expect(tabs.getContext().orientation).toBe('vertical');
  });

  it('manual activation ile oluşturulur', () => {
    const tabs = createTabs({ items: defaultItems, activationMode: 'manual' });
    expect(tabs.getContext().activationMode).toBe('manual');
  });

  it('ilk tab disabled ise ikinciye focus verir', () => {
    const items: TabItem[] = [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
    ];
    const tabs = createTabs({ items });
    expect(tabs.getContext().focusedIndex).toBe(1);
  });

  it('tum tablar disabled ise focusedIndex -1 olur', () => {
    const items: TabItem[] = [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B', disabled: true },
    ];
    const tabs = createTabs({ items });
    expect(tabs.getContext().focusedIndex).toBe(-1);
  });

  // ── SELECT ──────────────────────────────────────────────────────

  describe('SELECT', () => {
    it('tab secer', () => {
      const tabs = createTabs({ items: defaultItems });
      tabs.send({ type: 'SELECT', value: 'profile' });
      const ctx = tabs.getContext();
      expect(ctx.selectedValue).toBe('profile');
      expect(ctx.focusedIndex).toBe(1);
    });

    it('ayni degere secim yapmaz (no-op)', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'SELECT', value: 'home' });
      expect(after).toBe(before);
    });

    it('disabled tab secilemez', () => {
      const items: TabItem[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', disabled: true },
      ];
      const tabs = createTabs({ items, defaultValue: 'a' });
      tabs.send({ type: 'SELECT', value: 'b' });
      expect(tabs.getContext().selectedValue).toBe('a');
    });

    it('gecersiz deger ile secim yapmaz', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'SELECT', value: 'nonexistent' });
      expect(after).toBe(before);
    });

    it('disabled durumda secim engellenir', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home', disabled: true });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'SELECT', value: 'profile' });
      expect(after).toBe(before);
    });
  });

  // ── FOCUS ──────────────────────────────────────────────────────

  describe('FOCUS', () => {
    it('tab focus eder', () => {
      const tabs = createTabs({ items: defaultItems });
      tabs.send({ type: 'FOCUS', index: 2 });
      expect(tabs.getContext().focusedIndex).toBe(2);
      expect(tabs.getContext().interactionState).toBe('focused');
    });

    it('gecersiz indeks ile degismez', () => {
      const tabs = createTabs({ items: defaultItems });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'FOCUS', index: -1 });
      expect(after).toBe(before);
    });

    it('sinir disi indeks ile degismez', () => {
      const tabs = createTabs({ items: defaultItems });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'FOCUS', index: 99 });
      expect(after).toBe(before);
    });

    it('automatic modda focus = select', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      tabs.send({ type: 'FOCUS', index: 2 });
      expect(tabs.getContext().selectedValue).toBe('settings');
      expect(tabs.getContext().focusedIndex).toBe(2);
    });

    it('manual modda focus select etmez', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home', activationMode: 'manual' });
      tabs.send({ type: 'FOCUS', index: 2 });
      expect(tabs.getContext().selectedValue).toBe('home');
      expect(tabs.getContext().focusedIndex).toBe(2);
    });

    it('disabled durumda focus engellenir', () => {
      const tabs = createTabs({ items: defaultItems, disabled: true });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'FOCUS', index: 1 });
      expect(after).toBe(before);
    });
  });

  // ── BLUR ──────────────────────────────────────────────────────

  describe('BLUR', () => {
    it('idle durumuna gecer', () => {
      const tabs = createTabs({ items: defaultItems });
      tabs.send({ type: 'FOCUS', index: 0 });
      expect(tabs.getContext().interactionState).toBe('focused');
      tabs.send({ type: 'BLUR' });
      expect(tabs.getContext().interactionState).toBe('idle');
    });
  });

  // ── FOCUS_NEXT / FOCUS_PREV ──────────────────────────────────

  describe('FOCUS_NEXT', () => {
    it('sonraki taba focus verir', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      tabs.send({ type: 'FOCUS_NEXT' });
      expect(tabs.getContext().focusedIndex).toBe(1);
    });

    it('wrap around yapar (son → ilk)', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'settings' });
      tabs.send({ type: 'FOCUS_NEXT' });
      expect(tabs.getContext().focusedIndex).toBe(0);
    });

    it('disabled tabi atlar', () => {
      const items: TabItem[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', disabled: true },
        { value: 'c', label: 'C' },
      ];
      const tabs = createTabs({ items, defaultValue: 'a' });
      tabs.send({ type: 'FOCUS_NEXT' });
      expect(tabs.getContext().focusedIndex).toBe(2);
    });

    it('automatic modda navigate = select', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      tabs.send({ type: 'FOCUS_NEXT' });
      expect(tabs.getContext().selectedValue).toBe('profile');
    });

    it('manual modda navigate select etmez', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home', activationMode: 'manual' });
      tabs.send({ type: 'FOCUS_NEXT' });
      expect(tabs.getContext().focusedIndex).toBe(1);
      expect(tabs.getContext().selectedValue).toBe('home');
    });
  });

  describe('FOCUS_PREV', () => {
    it('onceki taba focus verir', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'profile' });
      tabs.send({ type: 'FOCUS_PREV' });
      expect(tabs.getContext().focusedIndex).toBe(0);
    });

    it('wrap around yapar (ilk → son)', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      tabs.send({ type: 'FOCUS_PREV' });
      expect(tabs.getContext().focusedIndex).toBe(2);
    });

    it('disabled tabi atlar', () => {
      const items: TabItem[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', disabled: true },
        { value: 'c', label: 'C' },
      ];
      const tabs = createTabs({ items, defaultValue: 'c' });
      tabs.send({ type: 'FOCUS_PREV' });
      expect(tabs.getContext().focusedIndex).toBe(0);
    });
  });

  describe('FOCUS_FIRST', () => {
    it('ilk aktif taba focus verir', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'settings' });
      tabs.send({ type: 'FOCUS_FIRST' });
      expect(tabs.getContext().focusedIndex).toBe(0);
    });

    it('ilk disabled ise sonraki aktife gider', () => {
      const items: TabItem[] = [
        { value: 'a', label: 'A', disabled: true },
        { value: 'b', label: 'B' },
      ];
      const tabs = createTabs({ items, defaultValue: 'b' });
      tabs.send({ type: 'FOCUS_FIRST' });
      expect(tabs.getContext().focusedIndex).toBe(1);
    });
  });

  describe('FOCUS_LAST', () => {
    it('son aktif taba focus verir', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      tabs.send({ type: 'FOCUS_LAST' });
      expect(tabs.getContext().focusedIndex).toBe(2);
    });

    it('son disabled ise onceki aktife gider', () => {
      const items: TabItem[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', disabled: true },
      ];
      const tabs = createTabs({ items });
      tabs.send({ type: 'FOCUS_LAST' });
      expect(tabs.getContext().focusedIndex).toBe(0);
    });
  });

  // ── CLOSE_TAB ─────────────────────────────────────────────────

  describe('CLOSE_TAB', () => {
    it('closable tabi kapatir', () => {
      const items: TabItem[] = [
        { value: 'a', label: 'A', closable: true },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ];
      const tabs = createTabs({ items, defaultValue: 'b' });
      tabs.send({ type: 'CLOSE_TAB', value: 'a' });
      expect(tabs.getContext().items).toHaveLength(2);
      expect(tabs.getContext().items[0]?.value).toBe('b');
    });

    it('closable olmayan tab kapatilamaz', () => {
      const items: TabItem[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const tabs = createTabs({ items });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'CLOSE_TAB', value: 'a' });
      expect(after).toBe(before);
    });

    it('secili tabi kapatinca sonraki secilir', () => {
      const items: TabItem[] = [
        { value: 'a', label: 'A', closable: true },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ];
      const tabs = createTabs({ items, defaultValue: 'a' });
      tabs.send({ type: 'CLOSE_TAB', value: 'a' });
      expect(tabs.getContext().selectedValue).toBe('b');
    });

    it('son tabi kapatinca sonraki olmadigi icin onceki secilir', () => {
      const items: TabItem[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C', closable: true },
      ];
      const tabs = createTabs({ items, defaultValue: 'c' });
      tabs.send({ type: 'CLOSE_TAB', value: 'c' });
      expect(tabs.getContext().selectedValue).toBe('b');
    });

    it('tek tabi kapatinca selectedValue undefined olur', () => {
      const items: TabItem[] = [
        { value: 'a', label: 'A', closable: true },
      ];
      const tabs = createTabs({ items, defaultValue: 'a' });
      tabs.send({ type: 'CLOSE_TAB', value: 'a' });
      expect(tabs.getContext().items).toHaveLength(0);
      expect(tabs.getContext().selectedValue).toBeUndefined();
    });

    it('secili olmayan tabi kapatinca selectedValue degismez', () => {
      const items: TabItem[] = [
        { value: 'a', label: 'A', closable: true },
        { value: 'b', label: 'B' },
      ];
      const tabs = createTabs({ items, defaultValue: 'b' });
      tabs.send({ type: 'CLOSE_TAB', value: 'a' });
      expect(tabs.getContext().selectedValue).toBe('b');
      expect(tabs.getContext().items).toHaveLength(1);
    });

    it('gecersiz deger ile degismez', () => {
      const tabs = createTabs({ items: defaultItems });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'CLOSE_TAB', value: 'nonexistent' });
      expect(after).toBe(before);
    });
  });

  // ── Prop Sync ─────────────────────────────────────────────────

  describe('Prop Sync', () => {
    it('SET_DISABLED: disabled state gunceller', () => {
      const tabs = createTabs({ items: defaultItems });
      tabs.send({ type: 'SET_DISABLED', value: true });
      expect(tabs.getContext().disabled).toBe(true);
      expect(tabs.getContext().interactionState).toBe('idle');
    });

    it('SET_DISABLED: ayni deger ile degismez', () => {
      const tabs = createTabs({ items: defaultItems });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'SET_DISABLED', value: false });
      expect(after).toBe(before);
    });

    it('SET_VALUE: secili degeri gunceller', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      tabs.send({ type: 'SET_VALUE', value: 'profile' });
      expect(tabs.getContext().selectedValue).toBe('profile');
      expect(tabs.getContext().focusedIndex).toBe(1);
    });

    it('SET_VALUE: ayni deger ile degismez', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'SET_VALUE', value: 'home' });
      expect(after).toBe(before);
    });

    it('SET_ITEMS: tab listesini gunceller', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      const newItems: TabItem[] = [
        { value: 'x', label: 'X' },
        { value: 'home', label: 'Ana Sayfa' },
      ];
      tabs.send({ type: 'SET_ITEMS', items: newItems });
      expect(tabs.getContext().items).toEqual(newItems);
      expect(tabs.getContext().focusedIndex).toBe(1); // home hala var
    });

    it('SET_ITEMS: secili deger artik yoksa ilk aktife focus verir', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'settings' });
      const newItems: TabItem[] = [
        { value: 'x', label: 'X' },
        { value: 'y', label: 'Y' },
      ];
      tabs.send({ type: 'SET_ITEMS', items: newItems });
      expect(tabs.getContext().focusedIndex).toBe(0);
    });

    it('SET_ORIENTATION: yonelim gunceller', () => {
      const tabs = createTabs({ items: defaultItems });
      tabs.send({ type: 'SET_ORIENTATION', orientation: 'vertical' });
      expect(tabs.getContext().orientation).toBe('vertical');
    });

    it('SET_ORIENTATION: ayni deger ile degismez', () => {
      const tabs = createTabs({ items: defaultItems });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'SET_ORIENTATION', orientation: 'horizontal' });
      expect(after).toBe(before);
    });

    it('SET_ACTIVATION_MODE: aktivasyon modu gunceller', () => {
      const tabs = createTabs({ items: defaultItems });
      tabs.send({ type: 'SET_ACTIVATION_MODE', activationMode: 'manual' });
      expect(tabs.getContext().activationMode).toBe('manual');
    });

    it('SET_ACTIVATION_MODE: ayni deger ile degismez', () => {
      const tabs = createTabs({ items: defaultItems });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'SET_ACTIVATION_MODE', activationMode: 'automatic' });
      expect(after).toBe(before);
    });
  });

  // ── Interaction State ──────────────────────────────────────────

  describe('Interaction State', () => {
    it('POINTER_ENTER: idle → hover', () => {
      const tabs = createTabs({ items: defaultItems });
      tabs.send({ type: 'POINTER_ENTER' });
      expect(tabs.getContext().interactionState).toBe('hover');
    });

    it('POINTER_LEAVE: hover → idle', () => {
      const tabs = createTabs({ items: defaultItems });
      tabs.send({ type: 'POINTER_ENTER' });
      tabs.send({ type: 'POINTER_LEAVE' });
      expect(tabs.getContext().interactionState).toBe('idle');
    });

    it('focused durumda POINTER_ENTER degismez', () => {
      const tabs = createTabs({ items: defaultItems });
      tabs.send({ type: 'FOCUS', index: 0 });
      const before = tabs.getContext();
      const after = tabs.send({ type: 'POINTER_ENTER' });
      expect(after).toBe(before);
    });
  });

  // ── DOM Props ──────────────────────────────────────────────────

  describe('DOM Props', () => {
    it('getListProps dogru dondurir', () => {
      const tabs = createTabs({ items: defaultItems });
      const props = tabs.getListProps();
      expect(props.role).toBe('tablist');
      expect(props['aria-orientation']).toBe('horizontal');
      expect(props['aria-disabled']).toBeUndefined();
      expect(props['data-disabled']).toBeUndefined();
      expect(props['data-orientation']).toBe('horizontal');
    });

    it('disabled getListProps', () => {
      const tabs = createTabs({ items: defaultItems, disabled: true });
      const props = tabs.getListProps();
      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('vertical getListProps', () => {
      const tabs = createTabs({ items: defaultItems, orientation: 'vertical' });
      const props = tabs.getListProps();
      expect(props['aria-orientation']).toBe('vertical');
      expect(props['data-orientation']).toBe('vertical');
    });

    it('getTabProps — secili tab', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      const props = tabs.getTabProps(0);
      expect(props.role).toBe('tab');
      expect(props.tabIndex).toBe(0);
      expect(props['aria-selected']).toBe(true);
      expect(props['data-state']).toBe('active');
      expect(props['aria-controls']).toBe('tabs-panel-home');
      expect(props.id).toBe('tabs-tab-home');
    });

    it('getTabProps — secili olmayan tab', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      const props = tabs.getTabProps(1);
      expect(props.tabIndex).toBe(-1);
      expect(props['aria-selected']).toBe(false);
      expect(props['data-state']).toBe('inactive');
    });

    it('getTabProps — disabled tab', () => {
      const items: TabItem[] = [
        { value: 'a', label: 'A', disabled: true },
        { value: 'b', label: 'B' },
      ];
      const tabs = createTabs({ items });
      const props = tabs.getTabProps(0);
      expect(props['aria-disabled']).toBe(true);
      expect(props['data-disabled']).toBe('');
    });

    it('getTabProps — custom idPrefix', () => {
      const tabs = createTabs({ items: defaultItems }, 'my-tabs');
      const props = tabs.getTabProps(0);
      expect(props.id).toBe('my-tabs-tab-home');
      expect(props['aria-controls']).toBe('my-tabs-panel-home');
    });

    it('getPanelProps — secili panel', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      const props = tabs.getPanelProps('home');
      expect(props.role).toBe('tabpanel');
      expect(props['aria-labelledby']).toBe('tabs-tab-home');
      expect(props.id).toBe('tabs-panel-home');
      expect(props.tabIndex).toBe(0);
      expect(props.hidden).toBe(false);
    });

    it('getPanelProps — secili olmayan panel', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'home' });
      const props = tabs.getPanelProps('profile');
      expect(props.hidden).toBe(true);
    });
  });

  // ── API Helpers ──────────────────────────────────────────────

  describe('API Helpers', () => {
    it('getSelectedIndex dogru dondurur', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'profile' });
      expect(tabs.getSelectedIndex()).toBe(1);
    });

    it('getSelectedIndex secim yoksa -1 dondurur', () => {
      const tabs = createTabs({ items: defaultItems });
      expect(tabs.getSelectedIndex()).toBe(-1);
    });

    it('getSelectedLabel dogru dondurur', () => {
      const tabs = createTabs({ items: defaultItems, defaultValue: 'profile' });
      expect(tabs.getSelectedLabel()).toBe('Profil');
    });

    it('getSelectedLabel secim yoksa undefined dondurur', () => {
      const tabs = createTabs({ items: defaultItems });
      expect(tabs.getSelectedLabel()).toBeUndefined();
    });

    it('isInteractionBlocked disabled durumda true', () => {
      const tabs = createTabs({ items: defaultItems, disabled: true });
      expect(tabs.isInteractionBlocked()).toBe(true);
    });

    it('isInteractionBlocked normal durumda false', () => {
      const tabs = createTabs({ items: defaultItems });
      expect(tabs.isInteractionBlocked()).toBe(false);
    });
  });
});
