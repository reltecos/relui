/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import {
  createDropdownTree,
  collectAllValues,
  findNodeByValue,
  findLabelByNodeValue,
  flattenVisibleNodes,
  filterTree,
  getSelectedLabels,
} from './dropdown-tree.machine';
import type { TreeNode, DropdownTreeProps } from './dropdown-tree.types';

// ── Test verileri / Test data ───────────────────────────────────────

const nodes: TreeNode[] = [
  {
    value: 'fruits', label: 'Meyveler',
    children: [
      { value: 'apple', label: 'Elma' },
      { value: 'banana', label: 'Muz' },
      { value: 'cherry', label: 'Kiraz', disabled: true },
    ],
  },
  {
    value: 'vegetables', label: 'Sebzeler',
    children: [
      { value: 'carrot', label: 'Havuç' },
      {
        value: 'greens', label: 'Yeşillikler',
        children: [
          { value: 'spinach', label: 'Ispanak' },
          { value: 'lettuce', label: 'Marul' },
        ],
      },
    ],
  },
  { value: 'bread', label: 'Ekmek' },
];

function createDefault(overrides?: Partial<DropdownTreeProps>) {
  return createDropdownTree({
    nodes,
    placeholder: 'Seçin',
    ...overrides,
  });
}

// ── Yardımcı fonksiyonlar ───────────────────────────────────────────

describe('collectAllValues', () => {
  it('tüm değerleri döner', () => {
    const all = collectAllValues(nodes);
    expect(all).toHaveLength(10);
    expect(all).toContain('fruits');
    expect(all).toContain('spinach');
    expect(all).toContain('bread');
  });
});

describe('findNodeByValue', () => {
  it('kök düğüm bulur', () => {
    expect(findNodeByValue(nodes, 'fruits')?.label).toBe('Meyveler');
  });

  it('derin düğüm bulur', () => {
    expect(findNodeByValue(nodes, 'spinach')?.label).toBe('Ispanak');
  });

  it('olmayan value için undefined döner', () => {
    expect(findNodeByValue(nodes, 'notexist')).toBeUndefined();
  });
});

describe('findLabelByNodeValue', () => {
  it('var olan value label döner', () => {
    expect(findLabelByNodeValue(nodes, 'apple')).toBe('Elma');
  });

  it('olmayan value için undefined döner', () => {
    expect(findLabelByNodeValue(nodes, 'nope')).toBeUndefined();
  });
});

describe('flattenVisibleNodes', () => {
  it('hiçbir şey expand değilken sadece kökler', () => {
    const flat = flattenVisibleNodes(nodes, new Set());
    expect(flat).toHaveLength(3);
    expect(flat[0].label).toBe('Meyveler');
    expect(flat[0].depth).toBe(0);
    expect(flat[0].hasChildren).toBe(true);
    expect(flat[0].isExpanded).toBe(false);
    expect(flat[2].label).toBe('Ekmek');
    expect(flat[2].hasChildren).toBe(false);
  });

  it('fruits expand edilince çocukları görünür', () => {
    const flat = flattenVisibleNodes(nodes, new Set(['fruits']));
    expect(flat).toHaveLength(6);
    expect(flat[0].label).toBe('Meyveler');
    expect(flat[0].isExpanded).toBe(true);
    expect(flat[1].label).toBe('Elma');
    expect(flat[1].depth).toBe(1);
    expect(flat[1].parentValue).toBe('fruits');
  });

  it('derin expand çalışır', () => {
    const flat = flattenVisibleNodes(nodes, new Set(['vegetables', 'greens']));
    expect(flat.some((n) => n.label === 'Ispanak')).toBe(true);
    const spinach = flat.find((n) => n.value === 'spinach');
    expect(spinach?.depth).toBe(2);
  });
});

describe('filterTree', () => {
  const defaultFilter = (node: TreeNode, search: string) =>
    node.label.toLowerCase().includes(search.toLowerCase());

  it('eşleşen düğümleri korur', () => {
    const result = filterTree(nodes, 'elma', defaultFilter);
    expect(result).toHaveLength(1); // fruits → apple eşleşir
    expect(result[0].label).toBe('Meyveler');
  });

  it('boş arama tüm ağacı döner', () => {
    expect(filterTree(nodes, '', defaultFilter)).toBe(nodes);
  });

  it('eşleşme yoksa boş döner', () => {
    expect(filterTree(nodes, 'zzzzz', defaultFilter)).toHaveLength(0);
  });
});

describe('getSelectedLabels', () => {
  it('seçili değerlerin label larını döner', () => {
    const labels = getSelectedLabels(nodes, new Set(['apple', 'carrot']));
    expect(labels).toEqual(['Elma', 'Havuç']);
  });
});

// ── Başlangıç durumu ────────────────────────────────────────────────

describe('initial state', () => {
  it('varsayılan context doğru başlar', () => {
    const api = createDefault();
    const ctx = api.getContext();
    expect(ctx.isOpen).toBe(false);
    expect(ctx.selectedValue).toBeUndefined();
    expect(ctx.selectionMode).toBe('single');
    expect(ctx.highlightedValue).toBeUndefined();
    expect(ctx.expandedValues.size).toBe(0);
    expect(ctx.disabled).toBe(false);
  });

  it('defaultValue ile başlar', () => {
    const api = createDefault({ defaultValue: 'apple' });
    expect(api.getContext().selectedValue).toBe('apple');
    expect(api.getSelectedLabels()).toEqual(['Elma']);
  });

  it('multiple mode defaultValues ile başlar', () => {
    const api = createDefault({ selectionMode: 'multiple', defaultValues: ['apple', 'carrot'] });
    expect(api.getContext().selectedValues.size).toBe(2);
    expect(api.getSelectedLabels()).toEqual(['Elma', 'Havuç']);
  });

  it('expandAll tüm parent düğümleri açar', () => {
    const api = createDefault({ expandAll: true });
    const ctx = api.getContext();
    expect(ctx.expandedValues.has('fruits')).toBe(true);
    expect(ctx.expandedValues.has('vegetables')).toBe(true);
    expect(ctx.expandedValues.has('greens')).toBe(true);
    // leaf node expand edilmez
    expect(ctx.expandedValues.has('apple')).toBe(false);
  });
});

// ── OPEN / CLOSE / TOGGLE ───────────────────────────────────────────

describe('OPEN / CLOSE / TOGGLE', () => {
  it('OPEN dropdown açar', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    expect(api.isOpen()).toBe(true);
  });

  it('OPEN zaten açıkken değişmez', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    const ctx1 = api.getContext();
    api.send({ type: 'OPEN' });
    expect(api.getContext()).toBe(ctx1);
  });

  it('CLOSE dropdown kapatır', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'CLOSE' });
    expect(api.isOpen()).toBe(false);
  });

  it('TOGGLE açar ve kapatır', () => {
    const api = createDefault();
    api.send({ type: 'TOGGLE' });
    expect(api.isOpen()).toBe(true);
    api.send({ type: 'TOGGLE' });
    expect(api.isOpen()).toBe(false);
  });

  it('readOnly durumda açılmaz', () => {
    const api = createDefault({ readOnly: true });
    api.send({ type: 'OPEN' });
    expect(api.isOpen()).toBe(false);
  });
});

// ── EXPAND / COLLAPSE ───────────────────────────────────────────────

describe('EXPAND / COLLAPSE', () => {
  it('EXPAND düğümü açar', () => {
    const api = createDefault();
    api.send({ type: 'EXPAND', value: 'fruits' });
    expect(api.getContext().expandedValues.has('fruits')).toBe(true);
    const visible = api.getVisibleNodes();
    expect(visible.some((n) => n.value === 'apple')).toBe(true);
  });

  it('COLLAPSE düğümü kapatır', () => {
    const api = createDefault({ expandAll: true });
    api.send({ type: 'COLLAPSE', value: 'fruits' });
    expect(api.getContext().expandedValues.has('fruits')).toBe(false);
  });

  it('TOGGLE_EXPAND toggle eder', () => {
    const api = createDefault();
    api.send({ type: 'TOGGLE_EXPAND', value: 'fruits' });
    expect(api.getContext().expandedValues.has('fruits')).toBe(true);
    api.send({ type: 'TOGGLE_EXPAND', value: 'fruits' });
    expect(api.getContext().expandedValues.has('fruits')).toBe(false);
  });

  it('EXPAND_ALL tüm parent düğümleri açar', () => {
    const api = createDefault();
    api.send({ type: 'EXPAND_ALL' });
    expect(api.getContext().expandedValues.has('fruits')).toBe(true);
    expect(api.getContext().expandedValues.has('vegetables')).toBe(true);
    expect(api.getContext().expandedValues.has('greens')).toBe(true);
  });

  it('COLLAPSE_ALL tüm düğümleri kapatır', () => {
    const api = createDefault({ expandAll: true });
    api.send({ type: 'COLLAPSE_ALL' });
    expect(api.getContext().expandedValues.size).toBe(0);
  });
});

// ── SELECT (single) ────────────────────────────────────────────────

describe('SELECT (single)', () => {
  it('leaf node seçer ve dropdown kapatır', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', value: 'bread' });
    expect(api.getContext().selectedValue).toBe('bread');
    expect(api.isOpen()).toBe(false);
  });

  it('disabled node seçilemez', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', value: 'cherry' });
    expect(api.getContext().selectedValue).toBeUndefined();
  });
});

// ── SELECT (multiple) ──────────────────────────────────────────────

describe('SELECT (multiple)', () => {
  it('toggle seçim yapar', () => {
    const api = createDefault({ selectionMode: 'multiple' });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', value: 'apple' });
    expect(api.getContext().selectedValues.has('apple')).toBe(true);
    // tekrar seçince kaldırır
    api.send({ type: 'SELECT', value: 'apple' });
    expect(api.getContext().selectedValues.has('apple')).toBe(false);
  });

  it('multiple seçim dropdown kapatmaz', () => {
    const api = createDefault({ selectionMode: 'multiple' });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT', value: 'apple' });
    expect(api.isOpen()).toBe(true);
  });

  it('DESELECT kaldırır', () => {
    const api = createDefault({ selectionMode: 'multiple', defaultValues: ['apple', 'carrot'] });
    api.send({ type: 'DESELECT', value: 'apple' });
    expect(api.getContext().selectedValues.has('apple')).toBe(false);
    expect(api.getContext().selectedValues.has('carrot')).toBe(true);
  });
});

// ── CLEAR ───────────────────────────────────────────────────────────

describe('CLEAR', () => {
  it('single seçimi temizler', () => {
    const api = createDefault({ defaultValue: 'apple' });
    api.send({ type: 'CLEAR' });
    expect(api.getContext().selectedValue).toBeUndefined();
  });

  it('multiple seçimi temizler', () => {
    const api = createDefault({ selectionMode: 'multiple', defaultValues: ['apple', 'carrot'] });
    api.send({ type: 'CLEAR' });
    expect(api.getContext().selectedValues.size).toBe(0);
  });
});

// ── HIGHLIGHT ───────────────────────────────────────────────────────

describe('HIGHLIGHT', () => {
  it('OPEN ilk enabled node u highlight eder', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    expect(api.getContext().highlightedValue).toBe('fruits');
  });

  it('HIGHLIGHT_NEXT sonraki görünür node a geçer', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedValue).toBe('vegetables');
  });

  it('HIGHLIGHT_NEXT expand edilmiş child lara girer', () => {
    const api = createDefault({ expandAll: true });
    api.send({ type: 'OPEN' });
    // fruits → apple
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedValue).toBe('apple');
  });

  it('HIGHLIGHT_NEXT disabled node u atlar', () => {
    const api = createDefault({ expandAll: true });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT', value: 'banana' }); // banana → cherry(disabled) → vegetables
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedValue).toBe('vegetables');
  });

  it('HIGHLIGHT_PREV önceki node a geçer', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT', value: 'bread' });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getContext().highlightedValue).toBe('vegetables');
  });

  it('HIGHLIGHT_LAST son enabled node a gider', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_LAST' });
    expect(api.getContext().highlightedValue).toBe('bread');
  });

  it('dropdown kapalıyken HIGHLIGHT etkisiz', () => {
    const api = createDefault();
    const ctx1 = api.getContext();
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext()).toBe(ctx1);
  });
});

// ── Prop sync ───────────────────────────────────────────────────────

describe('prop sync', () => {
  it('SET_DISABLED dropdown kapatır', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_DISABLED', value: true });
    expect(api.isOpen()).toBe(false);
    expect(api.isInteractionBlocked()).toBe(true);
  });

  it('SET_READ_ONLY günceller', () => {
    const api = createDefault();
    api.send({ type: 'SET_READ_ONLY', value: true });
    expect(api.getContext().readOnly).toBe(true);
  });

  it('SET_INVALID günceller', () => {
    const api = createDefault();
    api.send({ type: 'SET_INVALID', value: true });
    expect(api.getContext().invalid).toBe(true);
  });

  it('SET_VALUE dışarıdan değer atar', () => {
    const api = createDefault();
    api.send({ type: 'SET_VALUE', value: 'banana' });
    expect(api.getContext().selectedValue).toBe('banana');
  });

  it('SET_VALUES multiple değer atar', () => {
    const api = createDefault({ selectionMode: 'multiple' });
    api.send({ type: 'SET_VALUES', values: ['apple', 'carrot'] });
    expect(api.getContext().selectedValues.size).toBe(2);
  });

  it('SET_NODES ağacı günceller', () => {
    const api = createDefault();
    api.send({ type: 'SET_NODES', nodes: [{ value: 'x', label: 'X' }] });
    expect(api.getContext().nodes).toHaveLength(1);
  });
});

// ── DOM Props ───────────────────────────────────────────────────────

describe('DOM props', () => {
  it('getTriggerProps doğru attribute döner', () => {
    const api = createDefault();
    const props = api.getTriggerProps();
    expect(props.role).toBe('combobox');
    expect(props['aria-expanded']).toBe(false);
    expect(props['aria-haspopup']).toBe('tree');
    expect(props.tabIndex).toBe(0);
  });

  it('getPanelProps single mode', () => {
    const api = createDefault();
    const props = api.getPanelProps();
    expect(props.role).toBe('tree');
    expect(props['aria-multiselectable']).toBeUndefined();
  });

  it('getPanelProps multiple mode', () => {
    const api = createDefault({ selectionMode: 'multiple' });
    const props = api.getPanelProps();
    expect(props['aria-multiselectable']).toBe(true);
  });

  it('getNodeProps doğru attribute döner', () => {
    const api = createDefault({ expandAll: true });
    api.send({ type: 'OPEN' });
    const visible = api.getVisibleNodes();
    const fruitsNode = visible[0];
    const props = api.getNodeProps(fruitsNode);
    expect(props.role).toBe('treeitem');
    expect(props['aria-expanded']).toBe(true);
    expect(props['aria-selected']).toBe(false);
    expect(props['aria-level']).toBe(1);
    expect(props['data-highlighted']).toBe('');
  });

  it('seçili node aria-selected true döner', () => {
    const api = createDefault({ defaultValue: 'apple', expandAll: true });
    api.send({ type: 'OPEN' });
    const visible = api.getVisibleNodes();
    const appleNode = visible.find((n) => n.value === 'apple');
    expect(appleNode).toBeTruthy();
    const props = api.getNodeProps(appleNode as ReturnType<typeof api.getVisibleNodes>[0]);
    expect(props['aria-selected']).toBe(true);
  });

  it('disabled node data-disabled set edilir', () => {
    const api = createDefault({ expandAll: true });
    const visible = api.getVisibleNodes();
    const cherryNode = visible.find((n) => n.value === 'cherry');
    expect(cherryNode).toBeTruthy();
    const props = api.getNodeProps(cherryNode as ReturnType<typeof api.getVisibleNodes>[0]);
    expect(props['aria-disabled']).toBe(true);
    expect(props['data-disabled']).toBe('');
  });
});

// ── Etkileşim state geçişleri ───────────────────────────────────────

describe('interaction state', () => {
  it('POINTER_ENTER → hover, POINTER_LEAVE → idle', () => {
    const api = createDefault();
    api.send({ type: 'POINTER_ENTER' });
    expect(api.getContext().interactionState).toBe('hover');
    api.send({ type: 'POINTER_LEAVE' });
    expect(api.getContext().interactionState).toBe('idle');
  });

  it('BLUR açıkken kapatır', () => {
    const api = createDefault();
    api.send({ type: 'OPEN' });
    api.send({ type: 'BLUR' });
    expect(api.isOpen()).toBe(false);
    expect(api.getContext().interactionState).toBe('idle');
  });
});

// ── getSelectedLabels API ───────────────────────────────────────────

describe('getSelectedLabels', () => {
  it('single modda tek label döner', () => {
    const api = createDefault({ defaultValue: 'apple' });
    expect(api.getSelectedLabels()).toEqual(['Elma']);
  });

  it('multiple modda birden fazla label döner', () => {
    const api = createDefault({ selectionMode: 'multiple', defaultValues: ['apple', 'carrot'] });
    expect(api.getSelectedLabels()).toEqual(['Elma', 'Havuç']);
  });

  it('seçim yokken boş dizi döner', () => {
    const api = createDefault();
    expect(api.getSelectedLabels()).toEqual([]);
  });
});

// ── Full flow ───────────────────────────────────────────────────────

describe('full flow', () => {
  it('aç → expand → seç → kapat akışı', () => {
    const api = createDefault();

    api.send({ type: 'OPEN' });
    expect(api.isOpen()).toBe(true);

    api.send({ type: 'EXPAND', value: 'fruits' });
    const visible = api.getVisibleNodes();
    expect(visible.some((n) => n.value === 'apple')).toBe(true);

    api.send({ type: 'SELECT', value: 'apple' });
    expect(api.getContext().selectedValue).toBe('apple');
    expect(api.isOpen()).toBe(false);
    expect(api.getSelectedLabels()).toEqual(['Elma']);
  });
});
