/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createCommandPalette } from './command-palette.machine';
import type { CommandPaletteItem } from './command-palette.types';

// ── Test verileri ────────────────────────────────────────────

const basicItems: CommandPaletteItem[] = [
  { key: 'save', label: 'Save File', shortcut: 'Ctrl+S', group: 'file' },
  { key: 'open', label: 'Open File', shortcut: 'Ctrl+O', group: 'file' },
  { key: 'copy', label: 'Copy', shortcut: 'Ctrl+C', group: 'edit' },
  { key: 'paste', label: 'Paste', shortcut: 'Ctrl+V', group: 'edit' },
  { key: 'find', label: 'Find', shortcut: 'Ctrl+F', group: 'edit' },
];

const mixedItems: CommandPaletteItem[] = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta', disabled: true },
  { key: 'c', label: 'Charlie' },
  { key: 'd', label: 'Delta' },
];

const iconItems: CommandPaletteItem[] = [
  { key: 'save', label: 'Save', icon: 'save', description: 'Save the current document' },
  { key: 'search', label: 'Search', icon: 'search', description: 'Search in files' },
];

const keywordItems: CommandPaletteItem[] = [
  { key: 'git-push', label: 'Git: Push', keywords: ['upload', 'remote', 'sync'] },
  { key: 'git-pull', label: 'Git: Pull', keywords: ['download', 'remote', 'sync'] },
  { key: 'format', label: 'Format Document', keywords: ['prettier', 'beautify'] },
];

// ── Olusturma ────────────────────────────────────────────────

describe('createCommandPalette', () => {
  it('machine olusturur', () => {
    const api = createCommandPalette({ items: basicItems });
    expect(api).toBeDefined();
    expect(api.getContext).toBeDefined();
    expect(api.send).toBeDefined();
  });

  it('baslangic durumu kapali', () => {
    const api = createCommandPalette({ items: basicItems });
    const ctx = api.getContext();
    expect(ctx.open).toBe(false);
    expect(ctx.query).toBe('');
    expect(ctx.highlightedIndex).toBe(-1);
  });

  it('tum ogeleri filtrelenmis olarak tutar', () => {
    const api = createCommandPalette({ items: basicItems });
    const ctx = api.getContext();
    expect(ctx.filteredItems).toHaveLength(5);
  });

  it('varsayilan placeholder kullanir', () => {
    const api = createCommandPalette({ items: basicItems });
    expect(api.getContext().placeholder).toBe('Type a command...');
  });

  it('ozel placeholder kullanir', () => {
    const api = createCommandPalette({ items: basicItems, placeholder: 'Search...' });
    expect(api.getContext().placeholder).toBe('Search...');
  });

  it('varsayilan emptyMessage kullanir', () => {
    const api = createCommandPalette({ items: basicItems });
    expect(api.getContext().emptyMessage).toBe('No results found.');
  });

  it('ozel emptyMessage kullanir', () => {
    const api = createCommandPalette({ items: basicItems, emptyMessage: 'Nothing here.' });
    expect(api.getContext().emptyMessage).toBe('Nothing here.');
  });

  it('bos items ile olusturur', () => {
    const api = createCommandPalette({ items: [] });
    expect(api.getContext().filteredItems).toHaveLength(0);
  });
});

// ── OPEN / CLOSE ─────────────────────────────────────────────

describe('OPEN / CLOSE', () => {
  it('OPEN ile acar', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    expect(api.getContext().open).toBe(true);
  });

  it('CLOSE ile kapatir', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().open).toBe(false);
  });

  it('OPEN query ve highlight sifirlar', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'save' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'CLOSE' });
    api.send({ type: 'OPEN' });
    expect(api.getContext().query).toBe('');
    expect(api.getContext().highlightedIndex).toBe(-1);
  });

  it('CLOSE query ve highlight sifirlar', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'test' });
    api.send({ type: 'CLOSE' });
    expect(api.getContext().query).toBe('');
    expect(api.getContext().highlightedIndex).toBe(-1);
  });
});

// ── SET_QUERY ────────────────────────────────────────────────

describe('SET_QUERY', () => {
  it('query gunceller', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'save' });
    expect(api.getContext().query).toBe('save');
  });

  it('substring ile filtreler', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'File' });
    const filtered = api.getContext().filteredItems;
    expect(filtered.length).toBe(2);
    expect(filtered.map((i) => i.key)).toContain('save');
    expect(filtered.map((i) => i.key)).toContain('open');
  });

  it('buyuk-kucuk harf duyarsiz filtreler', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'file' });
    expect(api.getContext().filteredItems.length).toBe(2);
  });

  it('bos query tum ogeleri gosterir', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'save' });
    api.send({ type: 'SET_QUERY', query: '' });
    expect(api.getContext().filteredItems).toHaveLength(5);
  });

  it('eslesmez query bos liste dondurur', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'xyznonexistent' });
    expect(api.getContext().filteredItems).toHaveLength(0);
    expect(api.getContext().highlightedIndex).toBe(-1);
  });

  it('query degisince ilk enabled item vurgular', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'copy' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('query degisince disabled ilk item atlar', () => {
    const items: CommandPaletteItem[] = [
      { key: 'a', label: 'Alpha', disabled: true },
      { key: 'b', label: 'Also Beta' },
    ];
    const api = createCommandPalette({ items });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'al' });
    const ctx = api.getContext();
    expect(ctx.filteredItems.length).toBe(2);
    expect(ctx.highlightedIndex).toBe(1); // disabled atlar
  });

  it('description ile filtreler', () => {
    const api = createCommandPalette({ items: iconItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'document' });
    expect(api.getContext().filteredItems.length).toBe(1);
    expect(api.getContext().filteredItems[0]?.key).toBe('save');
  });

  it('keywords ile filtreler', () => {
    const api = createCommandPalette({ items: keywordItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'prettier' });
    expect(api.getContext().filteredItems.length).toBe(1);
    expect(api.getContext().filteredItems[0]?.key).toBe('format');
  });

  it('fuzzy match ile filtreler', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    // "svfl" → "Save File" (s-v-f-l harfleri sirasyla var)
    api.send({ type: 'SET_QUERY', query: 'svfl' });
    const filtered = api.getContext().filteredItems;
    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0]?.key).toBe('save');
  });
});

// ── Siralama ─────────────────────────────────────────────────

describe('Siralama / Sorting', () => {
  it('tam eslesen onde gelir', () => {
    const items: CommandPaletteItem[] = [
      { key: 'copy-all', label: 'Copy All' },
      { key: 'copy', label: 'Copy' },
      { key: 'copy-line', label: 'Copy Line' },
    ];
    const api = createCommandPalette({ items });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'copy' });
    expect(api.getContext().filteredItems[0]?.key).toBe('copy');
  });

  it('baslar eslesen icerir eslesen oncesinde gelir', () => {
    const items: CommandPaletteItem[] = [
      { key: 'a', label: 'Auto Copy' },
      { key: 'b', label: 'Copy File' },
    ];
    const api = createCommandPalette({ items });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'copy' });
    expect(api.getContext().filteredItems[0]?.key).toBe('b'); // starts with "Copy"
  });
});

// ── HIGHLIGHT_NEXT / HIGHLIGHT_PREV ──────────────────────────

describe('HIGHLIGHT_NEXT / HIGHLIGHT_PREV', () => {
  it('HIGHLIGHT_NEXT ilk ogeyi vurgular', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('HIGHLIGHT_NEXT art arda ilerler', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(1);
  });

  it('HIGHLIGHT_NEXT sondan basa sarar', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    for (let i = 0; i < 6; i++) api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('HIGHLIGHT_PREV geriye gider', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('HIGHLIGHT_PREV bastan sona sarar', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getContext().highlightedIndex).toBe(4);
  });

  it('HIGHLIGHT_NEXT disabled ogeyi atlar', () => {
    const api = createCommandPalette({ items: mixedItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' }); // Alpha (0)
    api.send({ type: 'HIGHLIGHT_NEXT' }); // Beta (1) disabled → Charlie (2)
    expect(api.getContext().highlightedIndex).toBe(2);
  });

  it('HIGHLIGHT_PREV disabled ogeyi atlar', () => {
    const api = createCommandPalette({ items: mixedItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' }); // Alpha (0)
    api.send({ type: 'HIGHLIGHT_NEXT' }); // Charlie (2)
    api.send({ type: 'HIGHLIGHT_PREV' }); // Beta (1) disabled → Alpha (0)
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('bos liste ile HIGHLIGHT_NEXT bir sey yapmaz', () => {
    const api = createCommandPalette({ items: [] });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(-1);
  });

  it('bos liste ile HIGHLIGHT_PREV bir sey yapmaz', () => {
    const api = createCommandPalette({ items: [] });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getContext().highlightedIndex).toBe(-1);
  });
});

// ── SELECT / SELECT_INDEX ────────────────────────────────────

describe('SELECT / SELECT_INDEX', () => {
  it('SELECT vurgulu ogeyi secer ve kapatir', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'SELECT' });
    expect(api.getContext().open).toBe(false);
  });

  it('SELECT vurgu yokken bir sey yapmaz', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT' });
    expect(api.getContext().open).toBe(true);
  });

  it('SELECT disabled ogede bir sey yapmaz', () => {
    const api = createCommandPalette({ items: mixedItems });
    api.send({ type: 'OPEN' });
    // Direkt disabled item index'ine git
    const ctx = api.getContext();
    ctx.highlightedIndex = 1; // Beta — disabled
    api.send({ type: 'SELECT' });
    expect(api.getContext().open).toBe(true);
  });

  it('SELECT_INDEX ile secer ve kapatir', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT_INDEX', index: 2 });
    expect(api.getContext().open).toBe(false);
  });

  it('SELECT_INDEX disabled ogede bir sey yapmaz', () => {
    const api = createCommandPalette({ items: mixedItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT_INDEX', index: 1 }); // Beta disabled
    expect(api.getContext().open).toBe(true);
  });

  it('SELECT sonrasi query sifirlanir', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'save' });
    api.send({ type: 'SELECT' }); // vurgulu ogeyi sec
    expect(api.getContext().query).toBe('');
  });
});

// ── SET_ITEMS ────────────────────────────────────────────────

describe('SET_ITEMS', () => {
  it('ogeler gunceller', () => {
    const api = createCommandPalette({ items: basicItems });
    const newItems: CommandPaletteItem[] = [{ key: 'x', label: 'X' }];
    api.send({ type: 'SET_ITEMS', items: newItems });
    expect(api.getContext().items).toHaveLength(1);
    expect(api.getContext().filteredItems).toHaveLength(1);
  });

  it('SET_ITEMS mevcut query ile yeniden filtreler', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'new' });
    expect(api.getContext().filteredItems).toHaveLength(0);

    // Yeni item'da "new" var
    api.send({
      type: 'SET_ITEMS',
      items: [{ key: 'new-file', label: 'New File' }],
    });
    expect(api.getContext().filteredItems).toHaveLength(1);
  });

  it('SET_ITEMS highlight sinirlar', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    // index = 3
    api.send({ type: 'SET_ITEMS', items: [{ key: 'x', label: 'X' }] });
    // 1 oge var, index >= 1 → 0'a sinirlanir
    expect(api.getContext().highlightedIndex).toBe(0);
  });
});

// ── Ozel filtre ──────────────────────────────────────────────

describe('Custom filter', () => {
  it('ozel filtre fonksiyonu kullanir', () => {
    const customFilter = (item: CommandPaletteItem, query: string) =>
      item.key.startsWith(query);
    const api = createCommandPalette({ items: basicItems, filter: customFilter });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'save' });
    expect(api.getContext().filteredItems).toHaveLength(1);
    expect(api.getContext().filteredItems[0]?.key).toBe('save');
  });
});

// ── DOM Props ────────────────────────────────────────────────

describe('DOM Props', () => {
  it('getContainerProps dogru dondurur', () => {
    const api = createCommandPalette({ items: basicItems });
    const props = api.getContainerProps();
    expect(props.role).toBe('dialog');
    expect(props['aria-label']).toBe('Command Palette');
    expect(props['aria-modal']).toBe(true);
  });

  it('getInputProps dogru dondurur', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    const props = api.getInputProps();
    expect(props.role).toBe('combobox');
    expect(props['aria-expanded']).toBe(true);
    expect(props['aria-autocomplete']).toBe('list');
    expect(props['aria-controls']).toBe('command-palette-listbox');
    expect(props['aria-activedescendant']).toBeUndefined();
  });

  it('getInputProps vurgulu iken activedescendant dondurur', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    const props = api.getInputProps();
    expect(props['aria-activedescendant']).toBe('command-palette-item-0');
  });

  it('getInputProps kapali iken expanded false', () => {
    const api = createCommandPalette({ items: basicItems });
    const props = api.getInputProps();
    expect(props['aria-expanded']).toBe(false);
  });

  it('getListProps dogru dondurur', () => {
    const api = createCommandPalette({ items: basicItems });
    const props = api.getListProps();
    expect(props.role).toBe('listbox');
    expect(props.id).toBe('command-palette-listbox');
    expect(props['aria-label']).toBe('Results');
  });

  it('getItemProps dogru dondurur', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    const props = api.getItemProps(0);
    expect(props.role).toBe('option');
    expect(props.id).toBe('command-palette-item-0');
    expect(props['aria-selected']).toBe(false);
    expect(props['aria-disabled']).toBeUndefined();
    expect(props['data-highlighted']).toBeUndefined();
    expect(props['data-disabled']).toBeUndefined();
    expect(props['data-index']).toBe(0);
  });

  it('getItemProps vurgulu iken selected true', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    const props = api.getItemProps(0);
    expect(props['aria-selected']).toBe(true);
    expect(props['data-highlighted']).toBe('');
  });

  it('getItemProps disabled oge', () => {
    const api = createCommandPalette({ items: mixedItems });
    api.send({ type: 'OPEN' });
    const props = api.getItemProps(1); // Beta disabled
    expect(props['aria-disabled']).toBe(true);
    expect(props['data-disabled']).toBe('');
  });
});

// ── findItem ─────────────────────────────────────────────────

describe('findItem', () => {
  it('var olan ogeyi bulur', () => {
    const api = createCommandPalette({ items: basicItems });
    const item = api.findItem('save');
    expect(item).not.toBeNull();
    expect(item?.label).toBe('Save File');
  });

  it('var olmayan oge null dondurur', () => {
    const api = createCommandPalette({ items: basicItems });
    expect(api.findItem('nonexistent')).toBeNull();
  });
});

// ── Bilinmeyen event ─────────────────────────────────────────

describe('Unknown event', () => {
  it('bilinmeyen event bir sey yapmaz', () => {
    const api = createCommandPalette({ items: basicItems });
    const before = { ...api.getContext() };
    api.send({ type: 'UNKNOWN' } as never);
    const after = api.getContext();
    expect(after.open).toBe(before.open);
    expect(after.query).toBe(before.query);
  });
});

// ── Grup destegi ─────────────────────────────────────────────

describe('Grup destegi / Group support', () => {
  it('grup alani olan ogeler filtrelenir', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'file' });
    const filtered = api.getContext().filteredItems;
    expect(filtered.every((i) => i.group === 'file')).toBe(true);
  });

  it('karisik gruplarda filtreleme calisir', () => {
    const api = createCommandPalette({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'copy' });
    const filtered = api.getContext().filteredItems;
    expect(filtered.length).toBe(1);
    expect(filtered[0]?.group).toBe('edit');
  });
});
