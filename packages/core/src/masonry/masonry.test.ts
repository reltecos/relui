/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createMasonry } from './masonry.machine';

describe('createMasonry', () => {
  // ── Initial state ────────────────────────────────────

  it('defaults to 3 columns and 16px gap', () => {
    const api = createMasonry();
    expect(api.getColumns()).toBe(3);
    expect(api.getGap()).toBe(16);
  });

  it('returns empty positions with no items', () => {
    const api = createMasonry({ containerWidth: 300 });
    expect(api.getPositions()).toEqual([]);
    expect(api.getTotalHeight()).toBe(0);
  });

  it('returns empty positions with zero container width', () => {
    const api = createMasonry();
    api.send({ type: 'SET_ITEMS', heights: [100, 200] });
    expect(api.getPositions()).toEqual([]);
  });

  // ── Basic layout ─────────────────────────────────────

  describe('basic layout', () => {
    it('places items in shortest column (3 columns)', () => {
      const api = createMasonry({ columns: 3, gap: 0, containerWidth: 300 });
      api.send({ type: 'SET_ITEMS', heights: [100, 200, 150, 50] });

      const positions = api.getPositions();
      expect(positions).toHaveLength(4);

      // First 3 items → one per column
      expect(positions[0]).toEqual({ column: 0, top: 0, left: 0, width: 100 });
      expect(positions[1]).toEqual({ column: 1, top: 0, left: 100, width: 100 });
      expect(positions[2]).toEqual({ column: 2, top: 0, left: 200, width: 100 });

      // 4th item → shortest column (col 0, height 100)
      expect(positions[3]).toEqual({ column: 0, top: 100, left: 0, width: 100 });
    });

    it('places items in 2 columns', () => {
      const api = createMasonry({ columns: 2, gap: 0, containerWidth: 200 });
      api.send({ type: 'SET_ITEMS', heights: [100, 150, 80] });

      const positions = api.getPositions();
      expect(positions[0]).toEqual({ column: 0, top: 0, left: 0, width: 100 });
      expect(positions[1]).toEqual({ column: 1, top: 0, left: 100, width: 100 });
      // 3rd → col 0 (height 100 < 150)
      expect(positions[2]).toEqual({ column: 0, top: 100, left: 0, width: 100 });
    });

    it('single column stacks vertically', () => {
      const api = createMasonry({ columns: 1, gap: 0, containerWidth: 300 });
      api.send({ type: 'SET_ITEMS', heights: [100, 200, 150] });

      const positions = api.getPositions();
      expect(positions[0].top).toBe(0);
      expect(positions[1].top).toBe(100);
      expect(positions[2].top).toBe(300);
    });
  });

  // ── Gap ──────────────────────────────────────────────

  describe('gap', () => {
    it('applies column gap', () => {
      const api = createMasonry({ columns: 3, gap: 10, containerWidth: 320 });
      // columnWidth = (320 - 10*2) / 3 = 100
      api.send({ type: 'SET_ITEMS', heights: [100] });

      const positions = api.getPositions();
      expect(positions[0].width).toBe(100);
      expect(positions[0].left).toBe(0);
    });

    it('applies row gap between items in same column', () => {
      const api = createMasonry({ columns: 1, gap: 10, containerWidth: 300 });
      api.send({ type: 'SET_ITEMS', heights: [100, 200] });

      const positions = api.getPositions();
      expect(positions[0].top).toBe(0);
      expect(positions[1].top).toBe(110); // 100 + 10 gap
    });

    it('supports separate rowGap', () => {
      const api = createMasonry({ columns: 1, gap: 10, rowGap: 20, containerWidth: 300 });
      api.send({ type: 'SET_ITEMS', heights: [100, 200] });

      const positions = api.getPositions();
      expect(positions[1].top).toBe(120); // 100 + 20 rowGap
    });
  });

  // ── Total height ─────────────────────────────────────

  describe('total height', () => {
    it('calculates total height (tallest column)', () => {
      const api = createMasonry({ columns: 2, gap: 0, containerWidth: 200 });
      api.send({ type: 'SET_ITEMS', heights: [100, 200] });

      expect(api.getTotalHeight()).toBe(200);
    });

    it('includes gap in total height calculation', () => {
      const api = createMasonry({ columns: 1, gap: 10, containerWidth: 300 });
      api.send({ type: 'SET_ITEMS', heights: [100, 200] });

      // 100 + 10gap + 200 = 310
      expect(api.getTotalHeight()).toBe(310);
    });

    it('returns 0 for empty items', () => {
      const api = createMasonry({ containerWidth: 300 });
      expect(api.getTotalHeight()).toBe(0);
    });
  });

  // ── Event handlers ───────────────────────────────────

  describe('events', () => {
    it('SET_COLUMNS updates columns', () => {
      const api = createMasonry({ columns: 3 });
      api.send({ type: 'SET_COLUMNS', value: 4 });
      expect(api.getColumns()).toBe(4);
    });

    it('SET_COLUMNS clamps to minimum 1', () => {
      const api = createMasonry();
      api.send({ type: 'SET_COLUMNS', value: 0 });
      expect(api.getColumns()).toBe(1);
    });

    it('SET_GAP updates gap', () => {
      const api = createMasonry();
      api.send({ type: 'SET_GAP', value: 24 });
      expect(api.getGap()).toBe(24);
    });

    it('SET_CONTAINER_WIDTH triggers recalculation', () => {
      const api = createMasonry({ columns: 2, gap: 0 });
      api.send({ type: 'SET_ITEMS', heights: [100] });

      api.send({ type: 'SET_CONTAINER_WIDTH', value: 400 });
      const positions = api.getPositions();
      expect(positions[0].width).toBe(200);

      api.send({ type: 'SET_CONTAINER_WIDTH', value: 600 });
      const newPositions = api.getPositions();
      expect(newPositions[0].width).toBe(300);
    });

    it('SET_ITEMS replaces all heights', () => {
      const api = createMasonry({ columns: 2, gap: 0, containerWidth: 200 });
      api.send({ type: 'SET_ITEMS', heights: [100, 200, 300] });
      expect(api.getPositions()).toHaveLength(3);

      api.send({ type: 'SET_ITEMS', heights: [50] });
      expect(api.getPositions()).toHaveLength(1);
    });
  });

  // ── Column left positions with gap ────────────────────

  describe('column left positions', () => {
    it('calculates correct left for each column with gap', () => {
      const api = createMasonry({ columns: 3, gap: 20, containerWidth: 340 });
      // columnWidth = (340 - 20*2) / 3 = 100
      api.send({ type: 'SET_ITEMS', heights: [100, 100, 100] });

      const positions = api.getPositions();
      expect(positions[0].left).toBe(0);       // col 0: 0
      expect(positions[1].left).toBe(120);      // col 1: 100 + 20
      expect(positions[2].left).toBe(240);      // col 2: 200 + 40
    });
  });
});
