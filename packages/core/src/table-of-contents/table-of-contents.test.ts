/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createTableOfContents } from './table-of-contents.machine';
import type { TocItem } from './table-of-contents.types';

// ── Helpers ──────────────────────────────────────────────

function makeItems(): TocItem[] {
  return [
    { id: 'intro', label: 'Introduction', depth: 0 },
    { id: 'getting-started', label: 'Getting Started', depth: 0 },
    { id: 'installation', label: 'Installation', depth: 1 },
    { id: 'usage', label: 'Usage', depth: 1 },
    { id: 'api', label: 'API Reference', depth: 0 },
    { id: 'props', label: 'Props', depth: 1 },
    { id: 'methods', label: 'Methods', depth: 1 },
    { id: 'faq', label: 'FAQ', depth: 0, disabled: true },
  ];
}

// ── Init ──────────────────────────────────────────────────

describe('TableOfContents init', () => {
  it('varsayilan degerlerle olusturulur', () => {
    const api = createTableOfContents();
    const ctx = api.getContext();
    expect(ctx.items).toEqual([]);
    expect(ctx.activeId).toBeNull();
    expect(ctx.offset).toBe(0);
    expect(ctx.scrollTarget).toBeNull();
  });

  it('config ile olusturulur', () => {
    const items = makeItems();
    const api = createTableOfContents({
      items,
      activeId: 'intro',
      offset: 80,
    });
    const ctx = api.getContext();
    expect(ctx.items).toBe(items);
    expect(ctx.activeId).toBe('intro');
    expect(ctx.offset).toBe(80);
  });

  it('activeId null ile olusturulabilir', () => {
    const api = createTableOfContents({ activeId: null });
    expect(api.getContext().activeId).toBeNull();
  });
});

// ── SET_ITEMS ──────────────────────────────────────────────

describe('TableOfContents SET_ITEMS', () => {
  it('items listesini gunceller', () => {
    const api = createTableOfContents();
    const items = makeItems();
    api.send({ type: 'SET_ITEMS', items });
    expect(api.getContext().items).toBe(items);
  });

  it('aktif id listede yoksa sifirlar', () => {
    const api = createTableOfContents({
      items: makeItems(),
      activeId: 'intro',
    });
    api.send({ type: 'SET_ITEMS', items: [{ id: 'new', label: 'New', depth: 0 }] });
    expect(api.getContext().activeId).toBeNull();
  });

  it('aktif id yeni listede varsa korur', () => {
    const api = createTableOfContents({
      items: makeItems(),
      activeId: 'intro',
    });
    api.send({
      type: 'SET_ITEMS',
      items: [
        { id: 'intro', label: 'Intro', depth: 0 },
        { id: 'other', label: 'Other', depth: 0 },
      ],
    });
    expect(api.getContext().activeId).toBe('intro');
  });

  it('onChange callback cagrilir (aktif id sifirlaninca)', () => {
    const onChange = vi.fn();
    const api = createTableOfContents({
      items: makeItems(),
      activeId: 'intro',
      onChange,
    });
    api.send({ type: 'SET_ITEMS', items: [] });
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('onChange cagrilmaz (aktif id korunursa)', () => {
    const onChange = vi.fn();
    const api = createTableOfContents({
      items: makeItems(),
      activeId: 'intro',
      onChange,
    });
    api.send({
      type: 'SET_ITEMS',
      items: [{ id: 'intro', label: 'Intro', depth: 0 }],
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('subscribe listener bilgilendirilir', () => {
    const api = createTableOfContents();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_ITEMS', items: makeItems() });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

// ── SET_ACTIVE ──────────────────────────────────────────────

describe('TableOfContents SET_ACTIVE', () => {
  it('aktif id guncellenir', () => {
    const api = createTableOfContents({ items: makeItems() });
    api.send({ type: 'SET_ACTIVE', id: 'api' });
    expect(api.getContext().activeId).toBe('api');
  });

  it('ayni id gonderilince degismez (onChange cagrilmaz)', () => {
    const onChange = vi.fn();
    const api = createTableOfContents({
      items: makeItems(),
      activeId: 'intro',
      onChange,
    });
    api.send({ type: 'SET_ACTIVE', id: 'intro' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('farkli id gonderilince onChange cagrilir', () => {
    const onChange = vi.fn();
    const api = createTableOfContents({
      items: makeItems(),
      activeId: 'intro',
      onChange,
    });
    api.send({ type: 'SET_ACTIVE', id: 'api' });
    expect(onChange).toHaveBeenCalledWith('api');
  });

  it('null ile sifirlanir', () => {
    const api = createTableOfContents({
      items: makeItems(),
      activeId: 'intro',
    });
    api.send({ type: 'SET_ACTIVE', id: null });
    expect(api.getContext().activeId).toBeNull();
  });
});

// ── SCROLL_TO ──────────────────────────────────────────────

describe('TableOfContents SCROLL_TO', () => {
  it('scrollTarget ve activeId guncellenir', () => {
    const api = createTableOfContents({ items: makeItems() });
    api.send({ type: 'SCROLL_TO', id: 'usage' });
    const ctx = api.getContext();
    expect(ctx.scrollTarget).toBe('usage');
    expect(ctx.activeId).toBe('usage');
  });

  it('onChange cagrilir', () => {
    const onChange = vi.fn();
    const api = createTableOfContents({
      items: makeItems(),
      onChange,
    });
    api.send({ type: 'SCROLL_TO', id: 'usage' });
    expect(onChange).toHaveBeenCalledWith('usage');
  });

  it('onScrollTo cagrilir', () => {
    const onScrollTo = vi.fn();
    const api = createTableOfContents({
      items: makeItems(),
      onScrollTo,
    });
    api.send({ type: 'SCROLL_TO', id: 'api' });
    expect(onScrollTo).toHaveBeenCalledWith('api');
  });

  it('disabled item icin calisMAZ', () => {
    const onScrollTo = vi.fn();
    const api = createTableOfContents({
      items: makeItems(),
      onScrollTo,
    });
    api.send({ type: 'SCROLL_TO', id: 'faq' });
    expect(onScrollTo).not.toHaveBeenCalled();
    expect(api.getContext().activeId).toBeNull();
  });

  it('olmayan id icin calismaz', () => {
    const onScrollTo = vi.fn();
    const api = createTableOfContents({
      items: makeItems(),
      onScrollTo,
    });
    api.send({ type: 'SCROLL_TO', id: 'nonexistent' });
    expect(onScrollTo).not.toHaveBeenCalled();
  });
});

// ── SET_OFFSET ──────────────────────────────────────────────

describe('TableOfContents SET_OFFSET', () => {
  it('offset guncellenir', () => {
    const api = createTableOfContents();
    api.send({ type: 'SET_OFFSET', offset: 100 });
    expect(api.getContext().offset).toBe(100);
  });

  it('subscribe listener bilgilendirilir', () => {
    const api = createTableOfContents();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_OFFSET', offset: 50 });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

// ── Subscribe ──────────────────────────────────────────────

describe('TableOfContents subscribe', () => {
  it('unsubscribe calisir', () => {
    const api = createTableOfContents();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'SET_ITEMS', items: makeItems() });
    expect(listener).not.toHaveBeenCalled();
  });

  it('birden fazla listener desteklenir', () => {
    const api = createTableOfContents();
    const l1 = vi.fn();
    const l2 = vi.fn();
    api.subscribe(l1);
    api.subscribe(l2);
    api.send({ type: 'SET_ITEMS', items: [] });
    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);
  });
});

// ── getNavProps ──────────────────────────────────────────────

describe('TableOfContents getNavProps', () => {
  it('role ve aria-label dondurur', () => {
    const api = createTableOfContents();
    const props = api.getNavProps();
    expect(props.role).toBe('navigation');
    expect(props['aria-label']).toBe('Table of contents');
  });
});

// ── getLinkProps ──────────────────────────────────────────────

describe('TableOfContents getLinkProps', () => {
  it('href dondurur', () => {
    const api = createTableOfContents({ items: makeItems() });
    const props = api.getLinkProps('intro');
    expect(props.href).toBe('#intro');
  });

  it('aktif link icin aria-current ayarlar', () => {
    const api = createTableOfContents({
      items: makeItems(),
      activeId: 'intro',
    });
    const props = api.getLinkProps('intro');
    expect(props['aria-current']).toBe('location');
  });

  it('inaktif link icin aria-current yok', () => {
    const api = createTableOfContents({
      items: makeItems(),
      activeId: 'intro',
    });
    const props = api.getLinkProps('api');
    expect(props['aria-current']).toBeUndefined();
  });

  it('disabled link icin aria-disabled ayarlar', () => {
    const api = createTableOfContents({ items: makeItems() });
    const props = api.getLinkProps('faq');
    expect(props['aria-disabled']).toBe(true);
  });

  it('data-active ayarlar', () => {
    const api = createTableOfContents({
      items: makeItems(),
      activeId: 'api',
    });
    expect(api.getLinkProps('api')['data-active']).toBe(true);
    expect(api.getLinkProps('intro')['data-active']).toBeUndefined();
  });

  it('data-depth ayarlar', () => {
    const api = createTableOfContents({ items: makeItems() });
    expect(api.getLinkProps('intro')['data-depth']).toBe(0);
    expect(api.getLinkProps('installation')['data-depth']).toBe(1);
  });

  it('olmayan id icin varsayilan degerler', () => {
    const api = createTableOfContents({ items: makeItems() });
    const props = api.getLinkProps('nonexistent');
    expect(props.href).toBe('#nonexistent');
    expect(props['data-depth']).toBe(0);
  });
});

// ── Complex Scenarios ──────────────────────────────────────

describe('TableOfContents complex scenarios', () => {
  it('items degisince scrollTarget korunur', () => {
    const api = createTableOfContents({ items: makeItems() });
    api.send({ type: 'SCROLL_TO', id: 'usage' });
    expect(api.getContext().scrollTarget).toBe('usage');

    api.send({
      type: 'SET_ITEMS',
      items: [
        { id: 'usage', label: 'Usage', depth: 0 },
        { id: 'new', label: 'New', depth: 0 },
      ],
    });
    expect(api.getContext().scrollTarget).toBe('usage');
  });

  it('ard arda SCROLL_TO calisir', () => {
    const onScrollTo = vi.fn();
    const api = createTableOfContents({
      items: makeItems(),
      onScrollTo,
    });
    api.send({ type: 'SCROLL_TO', id: 'intro' });
    api.send({ type: 'SCROLL_TO', id: 'api' });
    expect(onScrollTo).toHaveBeenCalledTimes(2);
    expect(api.getContext().activeId).toBe('api');
    expect(api.getContext().scrollTarget).toBe('api');
  });

  it('SET_ACTIVE sonrasi SCROLL_TO calisir', () => {
    const api = createTableOfContents({ items: makeItems() });
    api.send({ type: 'SET_ACTIVE', id: 'intro' });
    api.send({ type: 'SCROLL_TO', id: 'api' });
    expect(api.getContext().activeId).toBe('api');
  });

  it('bos items ile SCROLL_TO calismaz', () => {
    const onScrollTo = vi.fn();
    const api = createTableOfContents({ onScrollTo });
    api.send({ type: 'SCROLL_TO', id: 'intro' });
    expect(onScrollTo).not.toHaveBeenCalled();
  });
});
