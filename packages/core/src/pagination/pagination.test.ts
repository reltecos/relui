/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createPagination } from './pagination.machine';

// ── createPagination ────────────────────────────────────────────────

describe('createPagination', () => {
  it('varsayilan props ile olusturulabilir', () => {
    const pg = createPagination({ totalItems: 100 });
    expect(pg.getPage()).toBe(1);
    expect(pg.getTotalPages()).toBe(10);
    expect(pg.getContext().pageSize).toBe(10);
    expect(pg.getContext().siblingCount).toBe(1);
    expect(pg.getContext().boundaryCount).toBe(1);
  });

  it('ozel pageSize', () => {
    const pg = createPagination({ totalItems: 100, pageSize: 20 });
    expect(pg.getTotalPages()).toBe(5);
  });

  it('ozel defaultPage', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 5 });
    expect(pg.getPage()).toBe(5);
  });

  it('kontollu page', () => {
    const pg = createPagination({ totalItems: 100, page: 3 });
    expect(pg.getPage()).toBe(3);
  });

  it('sayfa sinir disinda ise clamp edilir', () => {
    const pg = createPagination({ totalItems: 50, pageSize: 10, defaultPage: 100 });
    expect(pg.getPage()).toBe(5);
  });

  it('sayfa 0 veya negatif ise 1 olur', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: -5 });
    expect(pg.getPage()).toBe(1);
  });

  it('totalItems=0 ise totalPages=1', () => {
    const pg = createPagination({ totalItems: 0 });
    expect(pg.getTotalPages()).toBe(1);
    expect(pg.getPage()).toBe(1);
  });

  it('totalItems tam bolunmuyorsa yukariya yuvarlanir', () => {
    const pg = createPagination({ totalItems: 101, pageSize: 10 });
    expect(pg.getTotalPages()).toBe(11);
  });

  it('ozel siblingCount ve boundaryCount', () => {
    const pg = createPagination({ totalItems: 100, siblingCount: 2, boundaryCount: 2 });
    expect(pg.getContext().siblingCount).toBe(2);
    expect(pg.getContext().boundaryCount).toBe(2);
  });
});

// ── GO_TO_PAGE ──────────────────────────────────────────────────────

describe('GO_TO_PAGE event', () => {
  it('belirli bir sayfaya gider', () => {
    const pg = createPagination({ totalItems: 100 });
    pg.send({ type: 'GO_TO_PAGE', page: 5 });
    expect(pg.getPage()).toBe(5);
  });

  it('sinir disinda clamp edilir', () => {
    const pg = createPagination({ totalItems: 100 });
    pg.send({ type: 'GO_TO_PAGE', page: 50 });
    expect(pg.getPage()).toBe(10);
  });

  it('ayni sayfaya gidilirse context degismez', () => {
    const pg = createPagination({ totalItems: 100 });
    const ctx1 = pg.getContext();
    const ctx2 = pg.send({ type: 'GO_TO_PAGE', page: 1 });
    expect(ctx2).toBe(ctx1);
  });
});

// ── NEXT_PAGE / PREV_PAGE ───────────────────────────────────────────

describe('NEXT_PAGE event', () => {
  it('sonraki sayfaya gider', () => {
    const pg = createPagination({ totalItems: 100 });
    pg.send({ type: 'NEXT_PAGE' });
    expect(pg.getPage()).toBe(2);
  });

  it('son sayfada context degismez', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 10 });
    const ctx1 = pg.getContext();
    const ctx2 = pg.send({ type: 'NEXT_PAGE' });
    expect(ctx2).toBe(ctx1);
  });
});

describe('PREV_PAGE event', () => {
  it('onceki sayfaya gider', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 5 });
    pg.send({ type: 'PREV_PAGE' });
    expect(pg.getPage()).toBe(4);
  });

  it('ilk sayfada context degismez', () => {
    const pg = createPagination({ totalItems: 100 });
    const ctx1 = pg.getContext();
    const ctx2 = pg.send({ type: 'PREV_PAGE' });
    expect(ctx2).toBe(ctx1);
  });
});

// ── FIRST_PAGE / LAST_PAGE ──────────────────────────────────────────

describe('FIRST_PAGE event', () => {
  it('ilk sayfaya gider', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 5 });
    pg.send({ type: 'FIRST_PAGE' });
    expect(pg.getPage()).toBe(1);
  });

  it('zaten ilk sayfadaysa context degismez', () => {
    const pg = createPagination({ totalItems: 100 });
    const ctx1 = pg.getContext();
    const ctx2 = pg.send({ type: 'FIRST_PAGE' });
    expect(ctx2).toBe(ctx1);
  });
});

describe('LAST_PAGE event', () => {
  it('son sayfaya gider', () => {
    const pg = createPagination({ totalItems: 100 });
    pg.send({ type: 'LAST_PAGE' });
    expect(pg.getPage()).toBe(10);
  });

  it('zaten son sayfadaysa context degismez', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 10 });
    const ctx1 = pg.getContext();
    const ctx2 = pg.send({ type: 'LAST_PAGE' });
    expect(ctx2).toBe(ctx1);
  });
});

// ── SET_TOTAL_ITEMS ─────────────────────────────────────────────────

describe('SET_TOTAL_ITEMS event', () => {
  it('totalItems gunceller', () => {
    const pg = createPagination({ totalItems: 100 });
    pg.send({ type: 'SET_TOTAL_ITEMS', totalItems: 200 });
    expect(pg.getContext().totalItems).toBe(200);
    expect(pg.getTotalPages()).toBe(20);
  });

  it('mevcut sayfa yeni toplam sayfa disinda kalirsa clamp edilir', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 10 });
    pg.send({ type: 'SET_TOTAL_ITEMS', totalItems: 30 });
    expect(pg.getPage()).toBe(3);
  });
});

// ── SET_PAGE_SIZE ───────────────────────────────────────────────────

describe('SET_PAGE_SIZE event', () => {
  it('pageSize gunceller', () => {
    const pg = createPagination({ totalItems: 100 });
    pg.send({ type: 'SET_PAGE_SIZE', pageSize: 20 });
    expect(pg.getContext().pageSize).toBe(20);
    expect(pg.getTotalPages()).toBe(5);
  });

  it('mevcut sayfa clamp edilir', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 10 });
    pg.send({ type: 'SET_PAGE_SIZE', pageSize: 50 });
    expect(pg.getPage()).toBe(2);
  });

  it('pageSize 0 veya negatif ise 1 olur', () => {
    const pg = createPagination({ totalItems: 100 });
    pg.send({ type: 'SET_PAGE_SIZE', pageSize: 0 });
    expect(pg.getContext().pageSize).toBe(1);
  });
});

// ── SET_PAGE ────────────────────────────────────────────────────────

describe('SET_PAGE event', () => {
  it('sayfayi gunceller', () => {
    const pg = createPagination({ totalItems: 100 });
    pg.send({ type: 'SET_PAGE', page: 7 });
    expect(pg.getPage()).toBe(7);
  });

  it('sinir disinda clamp edilir', () => {
    const pg = createPagination({ totalItems: 100 });
    pg.send({ type: 'SET_PAGE', page: 999 });
    expect(pg.getPage()).toBe(10);
  });
});

// ── getPageRange ────────────────────────────────────────────────────

describe('getPageRange', () => {
  it('az sayfada tum sayfalari gosterir', () => {
    const pg = createPagination({ totalItems: 50, pageSize: 10 });
    const range = pg.getPageRange();
    expect(range).toHaveLength(5);
    expect(range.every((r) => r.type === 'page')).toBe(true);
    expect(range.map((r) => r.page)).toEqual([1, 2, 3, 4, 5]);
  });

  it('cok sayfada ellipsis ekler (baslangicta)', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 1 });
    const range = pg.getPageRange();
    // boundary=1, sibling=1, current=1 → [1, 2, ..., 10]
    const types = range.map((r) => r.type);
    expect(types).toContain('ellipsis');
    const firstPage = range[0];
    expect(firstPage?.page).toBe(1);
    const lastPage = range[range.length - 1];
    expect(lastPage?.page).toBe(10);
  });

  it('cok sayfada ellipsis ekler (ortada)', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 5 });
    const range = pg.getPageRange();
    // [1, ..., 4, 5, 6, ..., 10]
    const types = range.map((r) => r.type);
    const ellipsisCount = types.filter((t) => t === 'ellipsis').length;
    expect(ellipsisCount).toBe(2);
    expect(range.find((r) => r.page === 5)).toBeDefined();
  });

  it('cok sayfada ellipsis ekler (sonda)', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 10 });
    const range = pg.getPageRange();
    // [1, ..., 9, 10]
    const types = range.map((r) => r.type);
    expect(types).toContain('ellipsis');
    const lastPage = range[range.length - 1];
    expect(lastPage?.page).toBe(10);
  });

  it('boundary=2, sibling=2 ile daha fazla sayfa gosterir', () => {
    const pg = createPagination({
      totalItems: 200,
      pageSize: 10,
      siblingCount: 2,
      boundaryCount: 2,
      defaultPage: 10,
    });
    const range = pg.getPageRange();
    // [1, 2, ..., 8, 9, 10, 11, 12, ..., 19, 20]
    const pages = range.filter((r) => r.type === 'page').map((r) => r.page);
    expect(pages).toContain(1);
    expect(pages).toContain(2);
    expect(pages).toContain(10);
    expect(pages).toContain(19);
    expect(pages).toContain(20);
  });

  it('totalItems=0 ise bos dizi', () => {
    const pg = createPagination({ totalItems: 0 });
    const range = pg.getPageRange();
    // totalPages=1 ama tek sayfa var
    expect(range).toHaveLength(1);
    expect(range[0]?.page).toBe(1);
  });

  it('her ogede benzersiz key var', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 5 });
    const range = pg.getPageRange();
    const keys = range.map((r) => r.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

// ── DOM Props ───────────────────────────────────────────────────────

describe('DOM Props', () => {
  it('getNavProps', () => {
    const pg = createPagination({ totalItems: 100 });
    expect(pg.getNavProps()).toEqual({ 'aria-label': 'Pagination', role: 'navigation' });
  });

  it('getPageProps mevcut sayfa', () => {
    const pg = createPagination({ totalItems: 100 });
    const props = pg.getPageProps(1);
    expect(props['aria-current']).toBe('page');
    expect(props['data-selected']).toBe('');
    expect(props['aria-label']).toBe('Sayfa 1');
  });

  it('getPageProps baska sayfa', () => {
    const pg = createPagination({ totalItems: 100 });
    const props = pg.getPageProps(5);
    expect(props['aria-current']).toBeUndefined();
    expect(props['data-selected']).toBeUndefined();
  });

  it('getPrevProps ilk sayfada disabled', () => {
    const pg = createPagination({ totalItems: 100 });
    const props = pg.getPrevProps();
    expect(props['aria-disabled']).toBe(true);
    expect(props['data-disabled']).toBe('');
  });

  it('getPrevProps ikinci sayfada enabled', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 2 });
    const props = pg.getPrevProps();
    expect(props['aria-disabled']).toBeUndefined();
    expect(props['data-disabled']).toBeUndefined();
  });

  it('getNextProps son sayfada disabled', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 10 });
    const props = pg.getNextProps();
    expect(props['aria-disabled']).toBe(true);
  });

  it('getNextProps ilk sayfada enabled', () => {
    const pg = createPagination({ totalItems: 100 });
    const props = pg.getNextProps();
    expect(props['aria-disabled']).toBeUndefined();
  });

  it('getFirstProps ilk sayfada disabled', () => {
    const pg = createPagination({ totalItems: 100 });
    expect(pg.getFirstProps()['aria-disabled']).toBe(true);
  });

  it('getLastProps son sayfada disabled', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 10 });
    expect(pg.getLastProps()['aria-disabled']).toBe(true);
  });
});

// ── API helpers ─────────────────────────────────────────────────────

describe('API helpers', () => {
  it('hasPrevPage', () => {
    const pg = createPagination({ totalItems: 100 });
    expect(pg.hasPrevPage()).toBe(false);
    pg.send({ type: 'NEXT_PAGE' });
    expect(pg.hasPrevPage()).toBe(true);
  });

  it('hasNextPage', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 10 });
    expect(pg.hasNextPage()).toBe(false);
    pg.send({ type: 'PREV_PAGE' });
    expect(pg.hasNextPage()).toBe(true);
  });

  it('getItemRange ilk sayfa', () => {
    const pg = createPagination({ totalItems: 100 });
    expect(pg.getItemRange()).toEqual({ start: 1, end: 10 });
  });

  it('getItemRange ortadaki sayfa', () => {
    const pg = createPagination({ totalItems: 100, defaultPage: 3 });
    expect(pg.getItemRange()).toEqual({ start: 21, end: 30 });
  });

  it('getItemRange son sayfa (tam bolunmeyen)', () => {
    const pg = createPagination({ totalItems: 95, pageSize: 10, defaultPage: 10 });
    expect(pg.getItemRange()).toEqual({ start: 91, end: 95 });
  });
});

// ── bilinmeyen event ────────────────────────────────────────────────

describe('bilinmeyen event', () => {
  it('context degismez', () => {
    const pg = createPagination({ totalItems: 100 });
    const ctx = pg.getContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx2 = pg.send({ type: 'UNKNOWN' } as any);
    expect(ctx2).toBe(ctx);
  });
});
