/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createBookLayout } from './book-layout.machine';

describe('createBookLayout', () => {
  // ── Initial state ────────────────────────────────────

  it('defaults to page 0 with 0 total pages', () => {
    const api = createBookLayout();
    expect(api.getCurrentPage()).toBe(0);
    expect(api.getTotalPages()).toBe(0);
  });

  it('accepts initial props', () => {
    const api = createBookLayout({ totalPages: 10, currentPage: 3 });
    expect(api.getCurrentPage()).toBe(3);
    expect(api.getTotalPages()).toBe(10);
  });

  it('clamps currentPage to totalPages-1', () => {
    const api = createBookLayout({ totalPages: 5, currentPage: 10 });
    expect(api.getCurrentPage()).toBe(4);
  });

  it('clamps currentPage to 0 minimum', () => {
    const api = createBookLayout({ totalPages: 5, currentPage: -1 });
    expect(api.getCurrentPage()).toBe(0);
  });

  // ── NEXT_PAGE ──────────────────────────────────────────

  describe('NEXT_PAGE', () => {
    it('advances to next page', () => {
      const api = createBookLayout({ totalPages: 5, currentPage: 0 });
      api.send({ type: 'NEXT_PAGE' });
      expect(api.getCurrentPage()).toBe(1);
    });

    it('stops at last page without loop', () => {
      const api = createBookLayout({ totalPages: 3, currentPage: 2 });
      api.send({ type: 'NEXT_PAGE' });
      expect(api.getCurrentPage()).toBe(2);
    });

    it('wraps to first page with loop', () => {
      const api = createBookLayout({ totalPages: 3, currentPage: 2, loop: true });
      api.send({ type: 'NEXT_PAGE' });
      expect(api.getCurrentPage()).toBe(0);
    });

    it('does nothing with 0 pages', () => {
      const api = createBookLayout({ totalPages: 0 });
      api.send({ type: 'NEXT_PAGE' });
      expect(api.getCurrentPage()).toBe(0);
    });
  });

  // ── PREV_PAGE ──────────────────────────────────────────

  describe('PREV_PAGE', () => {
    it('goes to previous page', () => {
      const api = createBookLayout({ totalPages: 5, currentPage: 3 });
      api.send({ type: 'PREV_PAGE' });
      expect(api.getCurrentPage()).toBe(2);
    });

    it('stops at first page without loop', () => {
      const api = createBookLayout({ totalPages: 3, currentPage: 0 });
      api.send({ type: 'PREV_PAGE' });
      expect(api.getCurrentPage()).toBe(0);
    });

    it('wraps to last page with loop', () => {
      const api = createBookLayout({ totalPages: 3, currentPage: 0, loop: true });
      api.send({ type: 'PREV_PAGE' });
      expect(api.getCurrentPage()).toBe(2);
    });
  });

  // ── GO_TO_PAGE ─────────────────────────────────────────

  describe('GO_TO_PAGE', () => {
    it('navigates to specific page', () => {
      const api = createBookLayout({ totalPages: 10 });
      api.send({ type: 'GO_TO_PAGE', page: 5 });
      expect(api.getCurrentPage()).toBe(5);
    });

    it('clamps to valid range', () => {
      const api = createBookLayout({ totalPages: 5 });
      api.send({ type: 'GO_TO_PAGE', page: 20 });
      expect(api.getCurrentPage()).toBe(4);
    });

    it('clamps negative to 0', () => {
      const api = createBookLayout({ totalPages: 5, currentPage: 3 });
      api.send({ type: 'GO_TO_PAGE', page: -1 });
      expect(api.getCurrentPage()).toBe(0);
    });
  });

  // ── FIRST_PAGE / LAST_PAGE ─────────────────────────────

  it('FIRST_PAGE goes to page 0', () => {
    const api = createBookLayout({ totalPages: 10, currentPage: 7 });
    api.send({ type: 'FIRST_PAGE' });
    expect(api.getCurrentPage()).toBe(0);
  });

  it('LAST_PAGE goes to last page', () => {
    const api = createBookLayout({ totalPages: 10, currentPage: 0 });
    api.send({ type: 'LAST_PAGE' });
    expect(api.getCurrentPage()).toBe(9);
  });

  // ── SET_TOTAL_PAGES ────────────────────────────────────

  describe('SET_TOTAL_PAGES', () => {
    it('updates total pages', () => {
      const api = createBookLayout({ totalPages: 5 });
      api.send({ type: 'SET_TOTAL_PAGES', value: 10 });
      expect(api.getTotalPages()).toBe(10);
    });

    it('clamps currentPage when reducing', () => {
      const api = createBookLayout({ totalPages: 10, currentPage: 8 });
      api.send({ type: 'SET_TOTAL_PAGES', value: 5 });
      expect(api.getCurrentPage()).toBe(4);
    });

    it('resets to 0 when set to 0', () => {
      const api = createBookLayout({ totalPages: 5, currentPage: 3 });
      api.send({ type: 'SET_TOTAL_PAGES', value: 0 });
      expect(api.getCurrentPage()).toBe(0);
      expect(api.getTotalPages()).toBe(0);
    });
  });

  // ── Helper methods ─────────────────────────────────────

  describe('helpers', () => {
    it('isFirstPage returns true at page 0', () => {
      const api = createBookLayout({ totalPages: 5, currentPage: 0 });
      expect(api.isFirstPage()).toBe(true);
    });

    it('isFirstPage returns false at other pages', () => {
      const api = createBookLayout({ totalPages: 5, currentPage: 2 });
      expect(api.isFirstPage()).toBe(false);
    });

    it('isLastPage returns true at last page', () => {
      const api = createBookLayout({ totalPages: 5, currentPage: 4 });
      expect(api.isLastPage()).toBe(true);
    });

    it('isLastPage returns true with 0 pages', () => {
      const api = createBookLayout({ totalPages: 0 });
      expect(api.isLastPage()).toBe(true);
    });

    it('canGoNext with loop', () => {
      const api = createBookLayout({ totalPages: 3, currentPage: 2, loop: true });
      expect(api.canGoNext()).toBe(true);
    });

    it('canGoNext without loop at last page', () => {
      const api = createBookLayout({ totalPages: 3, currentPage: 2 });
      expect(api.canGoNext()).toBe(false);
    });

    it('canGoPrev with loop', () => {
      const api = createBookLayout({ totalPages: 3, currentPage: 0, loop: true });
      expect(api.canGoPrev()).toBe(true);
    });

    it('canGoPrev without loop at first page', () => {
      const api = createBookLayout({ totalPages: 3, currentPage: 0 });
      expect(api.canGoPrev()).toBe(false);
    });
  });
});
