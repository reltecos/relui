/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createSpotlight } from './spotlight.machine';
import type { SpotlightItem } from './spotlight.types';

// ── Test verileri / Test data ─────────────────────────────────

const basicItems: SpotlightItem[] = [
  { key: 'doc1', label: 'Document One', description: 'First document' },
  { key: 'doc2', label: 'Document Two', description: 'Second document' },
  { key: 'settings', label: 'Settings', description: 'App settings' },
  { key: 'profile', label: 'User Profile', description: 'Edit profile' },
];

const groupedItems: SpotlightItem[] = [
  { key: 'doc1', label: 'README.md', group: 'Files' },
  { key: 'doc2', label: 'package.json', group: 'Files' },
  { key: 'settings', label: 'Settings', group: 'Actions' },
  { key: 'theme', label: 'Toggle Theme', group: 'Actions' },
  { key: 'help', label: 'Help Center', group: 'Navigation' },
];

const mixedItems: SpotlightItem[] = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta', disabled: true },
  { key: 'c', label: 'Charlie' },
  { key: 'd', label: 'Delta', disabled: true },
  { key: 'e', label: 'Echo' },
];

const keywordItems: SpotlightItem[] = [
  { key: 'dark', label: 'Toggle Theme', keywords: ['dark mode', 'light mode', 'appearance'] },
  { key: 'lang', label: 'Change Language', keywords: ['locale', 'i18n', 'translation'] },
];

// ── Olusturma / Creation ────────────────────────────────────

describe('Spotlight creation', () => {
  it('varsayilan degerlerle olusturulur', () => {
    const api = createSpotlight();
    const ctx = api.getContext();
    expect(ctx.open).toBe(false);
    expect(ctx.query).toBe('');
    expect(ctx.items).toEqual([]);
    expect(ctx.filteredItems).toEqual([]);
    expect(ctx.highlightedIndex).toBe(-1);
    expect(ctx.loading).toBe(false);
    expect(ctx.recentSearches).toEqual([]);
    expect(ctx.maxRecentSearches).toBe(5);
    expect(ctx.placeholder).toBe('Search...');
    expect(ctx.emptyMessage).toBe('No results found');
    expect(ctx.loadingMessage).toBe('Searching...');
  });

  it('items ile olusturulur', () => {
    const api = createSpotlight({ items: basicItems });
    const ctx = api.getContext();
    expect(ctx.items).toHaveLength(4);
    expect(ctx.filteredItems).toHaveLength(4);
  });

  it('ozel placeholder ile olusturulur', () => {
    const api = createSpotlight({ placeholder: 'Ara...' });
    expect(api.getContext().placeholder).toBe('Ara...');
  });

  it('ozel emptyMessage ile olusturulur', () => {
    const api = createSpotlight({ emptyMessage: 'Bulunamadi' });
    expect(api.getContext().emptyMessage).toBe('Bulunamadi');
  });

  it('ozel loadingMessage ile olusturulur', () => {
    const api = createSpotlight({ loadingMessage: 'Araniyor...' });
    expect(api.getContext().loadingMessage).toBe('Araniyor...');
  });

  it('recentSearches ile olusturulur', () => {
    const api = createSpotlight({ recentSearches: ['foo', 'bar'] });
    expect(api.getContext().recentSearches).toEqual(['foo', 'bar']);
  });

  it('maxRecentSearches ile olusturulur', () => {
    const api = createSpotlight({ maxRecentSearches: 10 });
    expect(api.getContext().maxRecentSearches).toBe(10);
  });
});

// ── OPEN / CLOSE ─────────────────────────────────────────────

describe('Spotlight OPEN/CLOSE', () => {
  it('OPEN ile acilir', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    const ctx = api.getContext();
    expect(ctx.open).toBe(true);
    expect(ctx.query).toBe('');
    expect(ctx.highlightedIndex).toBe(-1);
    expect(ctx.loading).toBe(false);
  });

  it('CLOSE ile kapanir', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'doc' });
    api.send({ type: 'CLOSE' });
    const ctx = api.getContext();
    expect(ctx.open).toBe(false);
    expect(ctx.query).toBe('');
    expect(ctx.highlightedIndex).toBe(-1);
  });

  it('OPEN onceki query sifirlar', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'test' });
    api.send({ type: 'CLOSE' });
    api.send({ type: 'OPEN' });
    expect(api.getContext().query).toBe('');
    expect(api.getContext().filteredItems).toHaveLength(4);
  });

  it('OPEN loading sifirlar', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'SET_LOADING', loading: true });
    api.send({ type: 'OPEN' });
    expect(api.getContext().loading).toBe(false);
  });
});

// ── SET_QUERY / Filtreleme ───────────────────────────────────

describe('Spotlight SET_QUERY', () => {
  it('substring ile filtreler', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'doc' });
    expect(api.getContext().filteredItems).toHaveLength(2);
  });

  it('case-insensitive filtreler', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'SET_QUERY', query: 'DOCUMENT' });
    expect(api.getContext().filteredItems).toHaveLength(2);
  });

  it('bos query tum ogeleri gosterir', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'SET_QUERY', query: 'doc' });
    api.send({ type: 'SET_QUERY', query: '' });
    expect(api.getContext().filteredItems).toHaveLength(4);
  });

  it('eslesmeyen query bos sonuc doner', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'SET_QUERY', query: 'xyznonexistent' });
    expect(api.getContext().filteredItems).toHaveLength(0);
  });

  it('ilk aktif ogeyi otomatik vurgular', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'SET_QUERY', query: 'doc' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('disabled ogeyi atlayarak vurgular', () => {
    const items: SpotlightItem[] = [
      { key: 'a', label: 'Alpha', disabled: true },
      { key: 'b', label: 'Alpha Beta' },
    ];
    const api = createSpotlight({ items });
    api.send({ type: 'SET_QUERY', query: 'alpha' });
    expect(api.getContext().highlightedIndex).toBe(1);
  });

  it('description ile filtreler', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'SET_QUERY', query: 'first' });
    const filtered = api.getContext().filteredItems;
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.key).toBe('doc1');
  });

  it('keywords ile filtreler', () => {
    const api = createSpotlight({ items: keywordItems });
    api.send({ type: 'SET_QUERY', query: 'dark mode' });
    const filtered = api.getContext().filteredItems;
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.key).toBe('dark');
  });

  it('fuzzy match ile filtreler', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'SET_QUERY', query: 'dcone' });
    const filtered = api.getContext().filteredItems;
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('puana gore siralar (exact > starts > contains)', () => {
    const items: SpotlightItem[] = [
      { key: 'c', label: 'Contains Search Here' },
      { key: 'e', label: 'search' },
      { key: 's', label: 'Search Results' },
    ];
    const api = createSpotlight({ items });
    api.send({ type: 'SET_QUERY', query: 'search' });
    const filtered = api.getContext().filteredItems;
    expect(filtered[0]?.key).toBe('e'); // exact
    expect(filtered[1]?.key).toBe('s'); // starts with
    expect(filtered[2]?.key).toBe('c'); // contains
  });
});

// ── HIGHLIGHT_NEXT / HIGHLIGHT_PREV ──────────────────────────

describe('Spotlight HIGHLIGHT_NEXT', () => {
  it('ilk ogeden baslar', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('sonraki ogeye gecer', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(1);
  });

  it('sondan basa sarar', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    for (let i = 0; i < 5; i++) api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('disabled ogeyi atlar', () => {
    const api = createSpotlight({ items: mixedItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' }); // 0: Alpha
    api.send({ type: 'HIGHLIGHT_NEXT' }); // 1: Beta (disabled) -> 2: Charlie
    expect(api.getContext().highlightedIndex).toBe(2);
  });

  it('bos listede islem yapmaz', () => {
    const api = createSpotlight({ items: [] });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getContext().highlightedIndex).toBe(-1);
  });
});

describe('Spotlight HIGHLIGHT_PREV', () => {
  it('sondan baslar', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getContext().highlightedIndex).toBe(3);
  });

  it('onceki ogeye gecer', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' }); // 0
    api.send({ type: 'HIGHLIGHT_NEXT' }); // 1
    api.send({ type: 'HIGHLIGHT_PREV' }); // 0
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('bastan sona sarar', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' }); // 0
    api.send({ type: 'HIGHLIGHT_PREV' }); // wrap -> 3
    expect(api.getContext().highlightedIndex).toBe(3);
  });

  it('disabled ogeyi atlar', () => {
    const api = createSpotlight({ items: mixedItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' }); // 0: Alpha
    api.send({ type: 'HIGHLIGHT_NEXT' }); // 2: Charlie (1 disabled)
    api.send({ type: 'HIGHLIGHT_PREV' }); // 0: Alpha (1 disabled)
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('bos listede islem yapmaz', () => {
    const api = createSpotlight({ items: [] });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_PREV' });
    expect(api.getContext().highlightedIndex).toBe(-1);
  });
});

// ── SELECT / SELECT_INDEX ────────────────────────────────────

describe('Spotlight SELECT', () => {
  it('vurgulanan ogeyi secer ve kapatir', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'SELECT' });
    const ctx = api.getContext();
    expect(ctx.open).toBe(false);
    expect(ctx.query).toBe('');
    expect(ctx.highlightedIndex).toBe(-1);
  });

  it('highlightedIndex -1 iken secim yapmaz', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT' });
    expect(api.getContext().open).toBe(true);
  });

  it('disabled oge secilemez', () => {
    const api = createSpotlight({ items: mixedItems });
    api.send({ type: 'OPEN' });
    // Manually set highlight to disabled item
    api.send({ type: 'HIGHLIGHT_NEXT' }); // 0: Alpha
    api.send({ type: 'HIGHLIGHT_NEXT' }); // 2: Charlie
    api.send({ type: 'HIGHLIGHT_NEXT' }); // 4: Echo
    api.send({ type: 'HIGHLIGHT_NEXT' }); // 0: Alpha (wrap)
    expect(api.getContext().highlightedIndex).toBe(0);
  });

  it('secim sonrasi query sifirlanir', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'doc' });
    api.send({ type: 'SELECT' });
    expect(api.getContext().query).toBe('');
  });

  it('secim sonrasi son aramalara eklenir', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'document' });
    api.send({ type: 'SELECT' });
    expect(api.getContext().recentSearches).toContain('document');
  });
});

describe('Spotlight SELECT_INDEX', () => {
  it('belirtilen indeksi secer', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT_INDEX', index: 1 });
    expect(api.getContext().open).toBe(false);
  });

  it('disabled indeks secilemez', () => {
    const api = createSpotlight({ items: mixedItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT_INDEX', index: 1 }); // Beta, disabled
    expect(api.getContext().open).toBe(true);
  });

  it('gecersiz indeks secilemez', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SELECT_INDEX', index: 99 });
    expect(api.getContext().open).toBe(true);
  });

  it('secim sonrasi recent search eklenir', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'settings' });
    api.send({ type: 'SELECT_INDEX', index: 0 });
    expect(api.getContext().recentSearches).toContain('settings');
  });
});

// ── SET_ITEMS ────────────────────────────────────────────────

describe('Spotlight SET_ITEMS', () => {
  it('ogeleri gunceller', () => {
    const api = createSpotlight({ items: basicItems });
    const newItems: SpotlightItem[] = [{ key: 'x', label: 'New Item' }];
    api.send({ type: 'SET_ITEMS', items: newItems });
    expect(api.getContext().items).toHaveLength(1);
    expect(api.getContext().filteredItems).toHaveLength(1);
  });

  it('mevcut query ile yeniden filtreler', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'SET_QUERY', query: 'new' });
    expect(api.getContext().filteredItems).toHaveLength(0);

    const newItems: SpotlightItem[] = [
      ...basicItems,
      { key: 'new1', label: 'New Item' },
    ];
    api.send({ type: 'SET_ITEMS', items: newItems });
    expect(api.getContext().filteredItems).toHaveLength(1);
  });
});

// ── SET_LOADING ──────────────────────────────────────────────

describe('Spotlight SET_LOADING', () => {
  it('loading durumunu ayarlar', () => {
    const api = createSpotlight();
    api.send({ type: 'SET_LOADING', loading: true });
    expect(api.getContext().loading).toBe(true);
  });

  it('loading durumunu kapatar', () => {
    const api = createSpotlight();
    api.send({ type: 'SET_LOADING', loading: true });
    api.send({ type: 'SET_LOADING', loading: false });
    expect(api.getContext().loading).toBe(false);
  });
});

// ── Recent Searches ──────────────────────────────────────────

describe('Spotlight recent searches', () => {
  it('ADD_RECENT_SEARCH ile eklenir', () => {
    const api = createSpotlight();
    api.send({ type: 'ADD_RECENT_SEARCH', query: 'test' });
    expect(api.getContext().recentSearches).toEqual(['test']);
  });

  it('duplicate aramalar basa tasinir', () => {
    const api = createSpotlight({ recentSearches: ['a', 'b', 'c'] });
    api.send({ type: 'ADD_RECENT_SEARCH', query: 'c' });
    expect(api.getContext().recentSearches).toEqual(['c', 'a', 'b']);
  });

  it('maxRecentSearches limitini asmaaz', () => {
    const api = createSpotlight({ maxRecentSearches: 3, recentSearches: ['a', 'b', 'c'] });
    api.send({ type: 'ADD_RECENT_SEARCH', query: 'd' });
    const recents = api.getContext().recentSearches;
    expect(recents).toHaveLength(3);
    expect(recents[0]).toBe('d');
    expect(recents).not.toContain('c');
  });

  it('bos query eklenmez', () => {
    const api = createSpotlight();
    api.send({ type: 'ADD_RECENT_SEARCH', query: '' });
    expect(api.getContext().recentSearches).toEqual([]);
  });

  it('whitespace-only query eklenmez', () => {
    const api = createSpotlight();
    api.send({ type: 'ADD_RECENT_SEARCH', query: '   ' });
    expect(api.getContext().recentSearches).toEqual([]);
  });

  it('CLEAR_RECENT_SEARCHES ile temizlenir', () => {
    const api = createSpotlight({ recentSearches: ['a', 'b'] });
    api.send({ type: 'CLEAR_RECENT_SEARCHES' });
    expect(api.getContext().recentSearches).toEqual([]);
  });

  it('REMOVE_RECENT_SEARCH ile tek arama silinir', () => {
    const api = createSpotlight({ recentSearches: ['a', 'b', 'c'] });
    api.send({ type: 'REMOVE_RECENT_SEARCH', query: 'b' });
    expect(api.getContext().recentSearches).toEqual(['a', 'c']);
  });

  it('SELECT ile recent search otomatik eklenir', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'SET_QUERY', query: 'doc' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'SELECT' });
    expect(api.getContext().recentSearches).toContain('doc');
  });

  it('bos query ile SELECT recent eklenmez', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'OPEN' });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    api.send({ type: 'SELECT' });
    expect(api.getContext().recentSearches).toEqual([]);
  });
});

// ── Custom filter ────────────────────────────────────────────

describe('Spotlight custom filter', () => {
  it('ozel filtre fonksiyonu kullanir', () => {
    const filter = (item: SpotlightItem, query: string) =>
      item.key.startsWith(query);
    const api = createSpotlight({ items: basicItems, filter });
    api.send({ type: 'SET_QUERY', query: 'doc' });
    expect(api.getContext().filteredItems).toHaveLength(2);
  });

  it('ozel filtre ile siralama yapilmaz', () => {
    const items: SpotlightItem[] = [
      { key: 'z', label: 'Zebra' },
      { key: 'a', label: 'Apple' },
    ];
    const filter = () => true;
    const api = createSpotlight({ items, filter });
    api.send({ type: 'SET_QUERY', query: 'any' });
    const filtered = api.getContext().filteredItems;
    expect(filtered[0]?.key).toBe('z'); // Orijinal sira korunur
    expect(filtered[1]?.key).toBe('a');
  });
});

// ── DOM Props ────────────────────────────────────────────────

describe('Spotlight DOM props', () => {
  it('container props dialog role doner', () => {
    const api = createSpotlight();
    const props = api.getContainerProps();
    expect(props.role).toBe('dialog');
    expect(props['aria-label']).toBe('Spotlight Search');
    expect(props['aria-modal']).toBe('true');
  });

  it('input props combobox role doner', () => {
    const api = createSpotlight();
    const props = api.getInputProps();
    expect(props.role).toBe('combobox');
    expect(props['aria-expanded']).toBe('true');
    expect(props['aria-autocomplete']).toBe('list');
    expect(props['aria-controls']).toBe('spotlight-listbox');
    expect(props.id).toBe('spotlight-input');
  });

  it('input activedescendant vurgulanan ogeyi gosterir', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    expect(api.getInputProps()['aria-activedescendant']).toBe('spotlight-item-0');
  });

  it('input activedescendant vurgu yokken bos', () => {
    const api = createSpotlight({ items: basicItems });
    expect(api.getInputProps()['aria-activedescendant']).toBe('');
  });

  it('list props listbox role doner', () => {
    const api = createSpotlight();
    const props = api.getListProps();
    expect(props.role).toBe('listbox');
    expect(props.id).toBe('spotlight-listbox');
    expect(props['aria-label']).toBe('Search results');
  });

  it('item props option role doner', () => {
    const api = createSpotlight({ items: basicItems });
    const props = api.getItemProps(0);
    expect(props.role).toBe('option');
    expect(props.id).toBe('spotlight-item-0');
    expect(props['data-index']).toBe('0');
  });

  it('vurgulanan item data-highlighted gosterir', () => {
    const api = createSpotlight({ items: basicItems });
    api.send({ type: 'HIGHLIGHT_NEXT' });
    const props = api.getItemProps(0);
    expect(props['data-highlighted']).toBe('');
    expect(props['aria-selected']).toBe('true');
  });

  it('disabled item data-disabled gosterir', () => {
    const api = createSpotlight({ items: mixedItems });
    const props = api.getItemProps(1); // Beta, disabled
    expect(props['data-disabled']).toBe('');
    expect(props['aria-disabled']).toBe('true');
  });
});

// ── findItem ─────────────────────────────────────────────────

describe('Spotlight findItem', () => {
  it('var olan ogeyi bulur', () => {
    const api = createSpotlight({ items: basicItems });
    const item = api.findItem('settings');
    expect(item).not.toBeNull();
    expect(item?.label).toBe('Settings');
  });

  it('olmayan oge icin null doner', () => {
    const api = createSpotlight({ items: basicItems });
    expect(api.findItem('nonexistent')).toBeNull();
  });
});

// ── Grup destegi / Group support ─────────────────────────────

describe('Spotlight groups', () => {
  it('gruplu ogeler filtreleme sonrasi korunur', () => {
    const api = createSpotlight({ items: groupedItems });
    api.send({ type: 'SET_QUERY', query: 'settings' });
    const filtered = api.getContext().filteredItems;
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.group).toBe('Actions');
  });

  it('tum ogeler gruplariyla listelenir', () => {
    const api = createSpotlight({ items: groupedItems });
    const ctx = api.getContext();
    const groups = new Set(ctx.filteredItems.map((i) => i.group));
    expect(groups.has('Files')).toBe(true);
    expect(groups.has('Actions')).toBe(true);
    expect(groups.has('Navigation')).toBe(true);
  });
});

// ── Bilinmeyen event ─────────────────────────────────────────

describe('Spotlight unknown event', () => {
  it('bilinmeyen event hataya neden olmaz', () => {
    const api = createSpotlight({ items: basicItems });
    expect(() => {
      api.send({ type: 'UNKNOWN' } as never);
    }).not.toThrow();
  });
});
