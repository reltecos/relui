/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createTileLayout } from './tile-layout.machine';

describe('createTileLayout', () => {
  // ── Initial state ────────────────────────────────────

  it('defaults to 3 columns, 200 rowHeight, 8 gap', () => {
    const api = createTileLayout();
    expect(api.getColumns()).toBe(3);
    expect(api.getRowHeight()).toBe(200);
    expect(api.getGap()).toBe(8);
  });

  it('starts with empty tiles', () => {
    const api = createTileLayout();
    expect(api.getTiles()).toEqual([]);
    expect(api.getTotalRows()).toBe(0);
  });

  it('accepts initial tiles', () => {
    const api = createTileLayout({
      tiles: [
        { id: 'a', row: 0, col: 0 },
        { id: 'b', row: 0, col: 1 },
      ],
    });
    expect(api.getTiles()).toHaveLength(2);
  });

  it('accepts custom config', () => {
    const api = createTileLayout({ columns: 4, rowHeight: 150, gap: 12 });
    expect(api.getColumns()).toBe(4);
    expect(api.getRowHeight()).toBe(150);
    expect(api.getGap()).toBe(12);
  });

  // ── ADD_TILE ───────────────────────────────────────────

  describe('ADD_TILE', () => {
    it('adds a tile', () => {
      const api = createTileLayout();
      api.send({ type: 'ADD_TILE', tile: { id: 'a', row: 0, col: 0 } });
      expect(api.getTiles()).toHaveLength(1);
      expect(api.getTile('a')).toBeDefined();
    });

    it('ignores duplicate id', () => {
      const api = createTileLayout({
        tiles: [{ id: 'a', row: 0, col: 0 }],
      });
      api.send({ type: 'ADD_TILE', tile: { id: 'a', row: 1, col: 1 } });
      expect(api.getTiles()).toHaveLength(1);
    });

    it('preserves rowSpan and colSpan', () => {
      const api = createTileLayout();
      api.send({ type: 'ADD_TILE', tile: { id: 'a', row: 0, col: 0, rowSpan: 2, colSpan: 2 } });
      const tile = api.getTile('a');
      expect(tile?.rowSpan).toBe(2);
      expect(tile?.colSpan).toBe(2);
    });
  });

  // ── REMOVE_TILE ────────────────────────────────────────

  describe('REMOVE_TILE', () => {
    it('removes a tile', () => {
      const api = createTileLayout({
        tiles: [{ id: 'a', row: 0, col: 0 }],
      });
      api.send({ type: 'REMOVE_TILE', id: 'a' });
      expect(api.getTiles()).toHaveLength(0);
    });

    it('ignores non-existent id', () => {
      const api = createTileLayout({
        tiles: [{ id: 'a', row: 0, col: 0 }],
      });
      api.send({ type: 'REMOVE_TILE', id: 'b' });
      expect(api.getTiles()).toHaveLength(1);
    });
  });

  // ── MOVE_TILE ──────────────────────────────────────────

  describe('MOVE_TILE', () => {
    it('moves a tile to new position', () => {
      const api = createTileLayout({
        tiles: [{ id: 'a', row: 0, col: 0 }],
      });
      api.send({ type: 'MOVE_TILE', id: 'a', row: 1, col: 2 });
      const tile = api.getTile('a');
      expect(tile?.row).toBe(1);
      expect(tile?.col).toBe(2);
    });

    it('clamps col to columns-1', () => {
      const api = createTileLayout({ columns: 3, tiles: [{ id: 'a', row: 0, col: 0 }] });
      api.send({ type: 'MOVE_TILE', id: 'a', row: 0, col: 5 });
      expect(api.getTile('a')?.col).toBe(2);
    });

    it('clamps row to 0 minimum', () => {
      const api = createTileLayout({
        tiles: [{ id: 'a', row: 0, col: 0 }],
      });
      api.send({ type: 'MOVE_TILE', id: 'a', row: -1, col: 0 });
      expect(api.getTile('a')?.row).toBe(0);
    });
  });

  // ── RESIZE_TILE ────────────────────────────────────────

  describe('RESIZE_TILE', () => {
    it('resizes a tile', () => {
      const api = createTileLayout({
        tiles: [{ id: 'a', row: 0, col: 0 }],
      });
      api.send({ type: 'RESIZE_TILE', id: 'a', rowSpan: 2, colSpan: 3 });
      const tile = api.getTile('a');
      expect(tile?.rowSpan).toBe(2);
      expect(tile?.colSpan).toBe(3);
    });

    it('clamps colSpan to available columns', () => {
      const api = createTileLayout({
        columns: 3,
        tiles: [{ id: 'a', row: 0, col: 1 }],
      });
      api.send({ type: 'RESIZE_TILE', id: 'a', rowSpan: 1, colSpan: 5 });
      // col=1, columns=3, max colSpan = 3-1 = 2
      expect(api.getTile('a')?.colSpan).toBe(2);
    });

    it('clamps rowSpan minimum to 1', () => {
      const api = createTileLayout({
        tiles: [{ id: 'a', row: 0, col: 0 }],
      });
      api.send({ type: 'RESIZE_TILE', id: 'a', rowSpan: 0, colSpan: 1 });
      expect(api.getTile('a')?.rowSpan).toBe(1);
    });
  });

  // ── SET_COLUMNS ────────────────────────────────────────

  describe('SET_COLUMNS', () => {
    it('updates columns', () => {
      const api = createTileLayout();
      api.send({ type: 'SET_COLUMNS', value: 5 });
      expect(api.getColumns()).toBe(5);
    });

    it('clamps existing tiles when reducing columns', () => {
      const api = createTileLayout({
        columns: 4,
        tiles: [{ id: 'a', row: 0, col: 3, colSpan: 2 }],
      });
      api.send({ type: 'SET_COLUMNS', value: 3 });
      const tile = api.getTile('a');
      expect(tile?.col).toBe(2); // clamped to columns-1
      expect(tile?.colSpan).toBe(1); // clamped: 3-2=1
    });

    it('minimum columns is 1', () => {
      const api = createTileLayout();
      api.send({ type: 'SET_COLUMNS', value: 0 });
      expect(api.getColumns()).toBe(1);
    });
  });

  // ── SET_ROW_HEIGHT / SET_GAP ───────────────────────────

  it('SET_ROW_HEIGHT updates rowHeight', () => {
    const api = createTileLayout();
    api.send({ type: 'SET_ROW_HEIGHT', value: 300 });
    expect(api.getRowHeight()).toBe(300);
  });

  it('SET_GAP updates gap', () => {
    const api = createTileLayout();
    api.send({ type: 'SET_GAP', value: 16 });
    expect(api.getGap()).toBe(16);
  });

  // ── REORDER ────────────────────────────────────────────

  describe('REORDER', () => {
    it('reorders tiles', () => {
      const api = createTileLayout({
        tiles: [
          { id: 'a', row: 0, col: 0 },
          { id: 'b', row: 0, col: 1 },
          { id: 'c', row: 0, col: 2 },
        ],
      });
      api.send({ type: 'REORDER', orderedIds: ['c', 'a', 'b'] });
      const ids = api.getTiles().map((t) => t.id);
      expect(ids).toEqual(['c', 'a', 'b']);
    });

    it('keeps unlisted tiles at end', () => {
      const api = createTileLayout({
        tiles: [
          { id: 'a', row: 0, col: 0 },
          { id: 'b', row: 0, col: 1 },
          { id: 'c', row: 0, col: 2 },
        ],
      });
      api.send({ type: 'REORDER', orderedIds: ['b'] });
      const ids = api.getTiles().map((t) => t.id);
      expect(ids[0]).toBe('b');
      expect(ids).toHaveLength(3);
    });
  });

  // ── getTotalRows ───────────────────────────────────────

  describe('getTotalRows', () => {
    it('returns 0 for empty tiles', () => {
      const api = createTileLayout();
      expect(api.getTotalRows()).toBe(0);
    });

    it('calculates from max row + rowSpan', () => {
      const api = createTileLayout({
        tiles: [
          { id: 'a', row: 0, col: 0 },
          { id: 'b', row: 1, col: 0, rowSpan: 2 },
        ],
      });
      // b: row=1 + rowSpan=2 = 3
      expect(api.getTotalRows()).toBe(3);
    });
  });

  // ── Immutability ───────────────────────────────────────

  it('getTiles returns copies', () => {
    const api = createTileLayout({
      tiles: [{ id: 'a', row: 0, col: 0 }],
    });
    const tiles = api.getTiles();
    const first = tiles[0];
    if (first) first.row = 999;
    expect(api.getTile('a')?.row).toBe(0);
  });
});
