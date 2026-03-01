/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createSplitPanel } from './split-panel.machine';

describe('createSplitPanel', () => {
  // ── Initial state ────────────────────────────────────

  it('defaults to 2 panels, horizontal, gutterSize 8', () => {
    const api = createSplitPanel();
    expect(api.getPanelCount()).toBe(2);
    expect(api.getOrientation()).toBe('horizontal');
    expect(api.getGutterSize()).toBe(8);
  });

  it('starts with no dragging', () => {
    const api = createSplitPanel();
    expect(api.isDragging()).toBe(false);
    expect(api.getActiveGutter()).toBeNull();
  });

  it('panels are not collapsed by default', () => {
    const api = createSplitPanel();
    expect(api.isCollapsed(0)).toBe(false);
    expect(api.isCollapsed(1)).toBe(false);
  });

  it('distributes sizes equally when container size is set', () => {
    const api = createSplitPanel({ containerSize: 808 });
    // 808 - 8 (gutter) = 800, / 2 = 400
    const sizes = api.getSizes();
    expect(sizes[0]).toBeCloseTo(400);
    expect(sizes[1]).toBeCloseTo(400);
  });

  it('respects defaultSizes', () => {
    const api = createSplitPanel({ containerSize: 808, defaultSizes: [300, 500] });
    const sizes = api.getSizes();
    expect(sizes[0]).toBeCloseTo(300);
    expect(sizes[1]).toBeCloseTo(500);
  });

  it('normalizes defaultSizes to fit container', () => {
    const api = createSplitPanel({ containerSize: 408, defaultSizes: [600, 200] });
    const sizes = api.getSizes();
    // total = 800, available = 400, ratio = 0.5
    expect(sizes[0]).toBeCloseTo(300);
    expect(sizes[1]).toBeCloseTo(100);
  });

  it('accepts custom panelCount', () => {
    const api = createSplitPanel({ panelCount: 3, containerSize: 824 });
    // 824 - 16 (2 gutters × 8) = 808, but actually 824 - 16 = 808...
    // Wait: 3 panels = 2 gutters, 824 - 2*8 = 808, / 3 ≈ 269.33
    expect(api.getPanelCount()).toBe(3);
    const sizes = api.getSizes();
    expect(sizes).toHaveLength(3);
    const total = sizes.reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(808);
  });

  it('enforces minimum 2 panels', () => {
    const api = createSplitPanel({ panelCount: 1 });
    expect(api.getPanelCount()).toBe(2);
  });

  // ── SET_CONTAINER_SIZE ─────────────────────────────────

  describe('SET_CONTAINER_SIZE', () => {
    it('distributes sizes on first container size', () => {
      const api = createSplitPanel();
      api.send({ type: 'SET_CONTAINER_SIZE', value: 808 });
      const sizes = api.getSizes();
      expect(sizes[0]).toBeCloseTo(400);
      expect(sizes[1]).toBeCloseTo(400);
    });

    it('scales proportionally on resize', () => {
      const api = createSplitPanel({ containerSize: 808 });
      // Initial: 400, 400
      api.send({ type: 'SET_CONTAINER_SIZE', value: 1608 });
      // New available: 1600
      const sizes = api.getSizes();
      expect(sizes[0]).toBeCloseTo(800);
      expect(sizes[1]).toBeCloseTo(800);
    });

    it('preserves ratios after resize', () => {
      const api = createSplitPanel({ containerSize: 808, defaultSizes: [300, 500] });
      api.send({ type: 'SET_CONTAINER_SIZE', value: 1608 });
      const sizes = api.getSizes();
      // Ratio: 300/800 = 0.375, 500/800 = 0.625
      // New: 1600 * 0.375 = 600, 1600 * 0.625 = 1000
      expect(sizes[0]).toBeCloseTo(600);
      expect(sizes[1]).toBeCloseTo(1000);
    });
  });

  // ── Drag ───────────────────────────────────────────────

  describe('drag', () => {
    it('DRAG_START sets dragging state', () => {
      const api = createSplitPanel({ containerSize: 808 });
      api.send({ type: 'DRAG_START', gutterIndex: 0 });
      expect(api.isDragging()).toBe(true);
      expect(api.getActiveGutter()).toBe(0);
    });

    it('DRAG moves panel sizes', () => {
      const api = createSplitPanel({ containerSize: 808 });
      // Initial: 400, 400
      api.send({ type: 'DRAG_START', gutterIndex: 0 });
      api.send({ type: 'DRAG', delta: 100 });
      const sizes = api.getSizes();
      expect(sizes[0]).toBeCloseTo(500);
      expect(sizes[1]).toBeCloseTo(300);
    });

    it('DRAG in negative direction', () => {
      const api = createSplitPanel({ containerSize: 808 });
      api.send({ type: 'DRAG_START', gutterIndex: 0 });
      api.send({ type: 'DRAG', delta: -100 });
      const sizes = api.getSizes();
      expect(sizes[0]).toBeCloseTo(300);
      expect(sizes[1]).toBeCloseTo(500);
    });

    it('DRAG respects minSizes', () => {
      const api = createSplitPanel({
        containerSize: 808,
        minSizes: [200, 200],
      });
      api.send({ type: 'DRAG_START', gutterIndex: 0 });
      api.send({ type: 'DRAG', delta: 300 }); // Would make right = 100 < 200
      const sizes = api.getSizes();
      expect(sizes[0]).toBe(600);
      expect(sizes[1]).toBe(200);
    });

    it('DRAG respects maxSizes', () => {
      const api = createSplitPanel({
        containerSize: 808,
        maxSizes: [500, 500],
      });
      api.send({ type: 'DRAG_START', gutterIndex: 0 });
      api.send({ type: 'DRAG', delta: 200 }); // Would make left = 600 > 500
      const sizes = api.getSizes();
      expect(sizes[0]).toBe(500);
      expect(sizes[1]).toBe(300);
    });

    it('DRAG_END clears dragging state', () => {
      const api = createSplitPanel({ containerSize: 808 });
      api.send({ type: 'DRAG_START', gutterIndex: 0 });
      api.send({ type: 'DRAG_END' });
      expect(api.isDragging()).toBe(false);
      expect(api.getActiveGutter()).toBeNull();
    });

    it('DRAG without DRAG_START is ignored', () => {
      const api = createSplitPanel({ containerSize: 808 });
      const before = api.getSizes();
      api.send({ type: 'DRAG', delta: 100 });
      expect(api.getSizes()).toEqual(before);
    });

    it('DRAG_START with invalid gutter index is ignored', () => {
      const api = createSplitPanel({ containerSize: 808 });
      api.send({ type: 'DRAG_START', gutterIndex: 5 });
      expect(api.isDragging()).toBe(false);
    });

    it('DRAG preserves total of two adjacent panels', () => {
      const api = createSplitPanel({ containerSize: 808 });
      const before = api.getSizes();
      const totalBefore = (before[0] as number) + (before[1] as number);

      api.send({ type: 'DRAG_START', gutterIndex: 0 });
      api.send({ type: 'DRAG', delta: 150 });
      const after = api.getSizes();
      const totalAfter = (after[0] as number) + (after[1] as number);

      expect(totalAfter).toBeCloseTo(totalBefore);
    });
  });

  // ── Multi-panel drag ───────────────────────────────────

  describe('multi-panel drag', () => {
    it('3 panels: drag gutter 0 affects panels 0 and 1', () => {
      const api = createSplitPanel({ panelCount: 3, containerSize: 816 });
      // 816 - 16 (2 gutters) = 800, / 3 ≈ 266.67
      api.send({ type: 'DRAG_START', gutterIndex: 0 });
      api.send({ type: 'DRAG', delta: 50 });
      const sizes = api.getSizes();
      expect(sizes[0] as number).toBeGreaterThan(266);
      expect(sizes[1] as number).toBeLessThan(267);
      // Panel 2 unchanged
      expect(sizes[2]).toBeCloseTo(800 / 3);
    });

    it('3 panels: drag gutter 1 affects panels 1 and 2', () => {
      const api = createSplitPanel({ panelCount: 3, containerSize: 816 });
      api.send({ type: 'DRAG_START', gutterIndex: 1 });
      api.send({ type: 'DRAG', delta: 50 });
      const sizes = api.getSizes();
      // Panel 0 unchanged
      expect(sizes[0]).toBeCloseTo(800 / 3);
      expect(sizes[1] as number).toBeGreaterThan(266);
      expect(sizes[2] as number).toBeLessThan(267);
    });
  });

  // ── Collapse ───────────────────────────────────────────

  describe('collapse', () => {
    it('TOGGLE_COLLAPSE collapses a panel', () => {
      const api = createSplitPanel({
        containerSize: 808,
        collapsible: [true, false],
      });
      api.send({ type: 'TOGGLE_COLLAPSE', panelIndex: 0 });
      expect(api.isCollapsed(0)).toBe(true);
      const sizes = api.getSizes();
      expect(sizes[0]).toBe(0);
      expect(sizes[1]).toBeCloseTo(800);
    });

    it('TOGGLE_COLLAPSE expands a collapsed panel', () => {
      const api = createSplitPanel({
        containerSize: 808,
        collapsible: [true, false],
      });
      api.send({ type: 'TOGGLE_COLLAPSE', panelIndex: 0 });
      api.send({ type: 'TOGGLE_COLLAPSE', panelIndex: 0 });
      expect(api.isCollapsed(0)).toBe(false);
      const sizes = api.getSizes();
      // Should restore to original ~400
      expect(sizes[0]).toBeCloseTo(400);
    });

    it('TOGGLE_COLLAPSE does nothing for non-collapsible panel', () => {
      const api = createSplitPanel({
        containerSize: 808,
        collapsible: [false, false],
      });
      api.send({ type: 'TOGGLE_COLLAPSE', panelIndex: 0 });
      expect(api.isCollapsed(0)).toBe(false);
      expect(api.getSizes()[0]).toBeCloseTo(400);
    });

    it('TOGGLE_COLLAPSE with invalid index is ignored', () => {
      const api = createSplitPanel({ containerSize: 808 });
      api.send({ type: 'TOGGLE_COLLAPSE', panelIndex: 5 });
      expect(api.getSizes()).toHaveLength(2);
    });

    it('collapse right panel gives space to left', () => {
      const api = createSplitPanel({
        containerSize: 808,
        collapsible: [false, true],
      });
      api.send({ type: 'TOGGLE_COLLAPSE', panelIndex: 1 });
      expect(api.isCollapsed(1)).toBe(true);
      const sizes = api.getSizes();
      expect(sizes[1]).toBe(0);
      expect(sizes[0]).toBeCloseTo(800);
    });
  });

  // ── SET_SIZES ──────────────────────────────────────────

  describe('SET_SIZES', () => {
    it('updates panel sizes', () => {
      const api = createSplitPanel({ containerSize: 808 });
      api.send({ type: 'SET_SIZES', sizes: [200, 600] });
      const sizes = api.getSizes();
      expect(sizes[0]).toBe(200);
      expect(sizes[1]).toBe(600);
    });

    it('resets collapsed state', () => {
      const api = createSplitPanel({
        containerSize: 808,
        collapsible: [true, false],
      });
      api.send({ type: 'TOGGLE_COLLAPSE', panelIndex: 0 });
      expect(api.isCollapsed(0)).toBe(true);

      api.send({ type: 'SET_SIZES', sizes: [400, 400] });
      expect(api.isCollapsed(0)).toBe(false);
    });

    it('ignores SET_SIZES with wrong panel count', () => {
      const api = createSplitPanel({ containerSize: 808 });
      const before = api.getSizes();
      api.send({ type: 'SET_SIZES', sizes: [100, 200, 300] });
      expect(api.getSizes()).toEqual(before);
    });
  });

  // ── SET_ORIENTATION ────────────────────────────────────

  describe('SET_ORIENTATION', () => {
    it('changes orientation', () => {
      const api = createSplitPanel();
      api.send({ type: 'SET_ORIENTATION', value: 'vertical' });
      expect(api.getOrientation()).toBe('vertical');
    });
  });
});
