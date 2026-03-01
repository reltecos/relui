/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createMDI } from './mdi.machine';

describe('createMDI', () => {
  // ── Initial state ────────────────────────────────────

  it('starts with no windows', () => {
    const api = createMDI();
    expect(api.getWindows()).toEqual([]);
    expect(api.getWindowCount()).toBe(0);
    expect(api.getActiveWindowId()).toBeNull();
  });

  it('accepts initial windows', () => {
    const api = createMDI({
      windows: [
        { id: 'a', title: 'Window A' },
        { id: 'b', title: 'Window B' },
      ],
    });
    expect(api.getWindowCount()).toBe(2);
    expect(api.getWindow('a')?.title).toBe('Window A');
  });

  it('last added window becomes active', () => {
    const api = createMDI({
      windows: [
        { id: 'a', title: 'A' },
        { id: 'b', title: 'B' },
      ],
    });
    expect(api.getActiveWindowId()).toBe('b');
  });

  it('accepts custom container size', () => {
    const api = createMDI({ containerWidth: 1200, containerHeight: 800 });
    expect(api.getContainerSize()).toEqual({ width: 1200, height: 800 });
  });

  // ── ADD_WINDOW ──────────────────────────────────────

  describe('ADD_WINDOW', () => {
    it('adds a window', () => {
      const api = createMDI();
      api.send({ type: 'ADD_WINDOW', window: { id: 'x', title: 'X' } });
      expect(api.getWindowCount()).toBe(1);
      expect(api.getWindow('x')?.title).toBe('X');
    });

    it('activates newly added window', () => {
      const api = createMDI();
      api.send({ type: 'ADD_WINDOW', window: { id: 'a', title: 'A' } });
      api.send({ type: 'ADD_WINDOW', window: { id: 'b', title: 'B' } });
      expect(api.getActiveWindowId()).toBe('b');
    });

    it('ignores duplicate id', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'ADD_WINDOW', window: { id: 'a', title: 'A2' } });
      expect(api.getWindowCount()).toBe(1);
    });

    it('applies custom position and size', () => {
      const api = createMDI();
      api.send({ type: 'ADD_WINDOW', window: { id: 'x', title: 'X', x: 100, y: 50, width: 600, height: 400 } });
      const win = api.getWindow('x');
      expect(win?.x).toBe(100);
      expect(win?.y).toBe(50);
      expect(win?.width).toBe(600);
      expect(win?.height).toBe(400);
    });

    it('defaults to 400x300', () => {
      const api = createMDI();
      api.send({ type: 'ADD_WINDOW', window: { id: 'x', title: 'X' } });
      const win = api.getWindow('x');
      expect(win?.width).toBe(400);
      expect(win?.height).toBe(300);
    });

    it('cascades offset for multiple windows', () => {
      const api = createMDI();
      api.send({ type: 'ADD_WINDOW', window: { id: 'a', title: 'A' } });
      api.send({ type: 'ADD_WINDOW', window: { id: 'b', title: 'B' } });
      const winA = api.getWindow('a');
      const winB = api.getWindow('b');
      expect(winB?.x).toBeGreaterThan(winA?.x ?? 0);
      expect(winB?.y).toBeGreaterThan(winA?.y ?? 0);
    });
  });

  // ── REMOVE_WINDOW / CLOSE_WINDOW ───────────────────

  describe('REMOVE_WINDOW / CLOSE_WINDOW', () => {
    it('removes a window', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'REMOVE_WINDOW', id: 'a' });
      expect(api.getWindowCount()).toBe(0);
    });

    it('CLOSE_WINDOW also removes', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'CLOSE_WINDOW', id: 'a' });
      expect(api.getWindowCount()).toBe(0);
    });

    it('activates next window when active is removed', () => {
      const api = createMDI({
        windows: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ],
      });
      api.send({ type: 'REMOVE_WINDOW', id: 'b' });
      expect(api.getActiveWindowId()).toBe('a');
    });
  });

  // ── ACTIVATE_WINDOW ─────────────────────────────────

  describe('ACTIVATE_WINDOW', () => {
    it('activates a window and brings to front', () => {
      const api = createMDI({
        windows: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ],
      });
      api.send({ type: 'ACTIVATE_WINDOW', id: 'a' });
      expect(api.getActiveWindowId()).toBe('a');
      expect(api.getActiveWindow()?.active).toBe(true);
      expect(api.getWindow('b')?.active).toBe(false);
    });

    it('updates z-index', () => {
      const api = createMDI({
        windows: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ],
      });
      api.send({ type: 'ACTIVATE_WINDOW', id: 'a' });
      const winA = api.getWindow('a');
      const winB = api.getWindow('b');
      expect((winA?.zIndex ?? 0) > (winB?.zIndex ?? 0)).toBe(true);
    });
  });

  // ── MINIMIZE_WINDOW ─────────────────────────────────

  describe('MINIMIZE_WINDOW', () => {
    it('minimizes a window', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'MINIMIZE_WINDOW', id: 'a' });
      expect(api.getWindow('a')?.state).toBe('minimized');
    });

    it('activates next window when minimizing active', () => {
      const api = createMDI({
        windows: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ],
      });
      api.send({ type: 'MINIMIZE_WINDOW', id: 'b' });
      expect(api.getActiveWindowId()).toBe('a');
    });

    it('deactivates minimized window', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'MINIMIZE_WINDOW', id: 'a' });
      expect(api.getWindow('a')?.active).toBe(false);
    });
  });

  // ── MAXIMIZE_WINDOW ─────────────────────────────────

  describe('MAXIMIZE_WINDOW', () => {
    it('maximizes a window to container size', () => {
      const api = createMDI({
        containerWidth: 800,
        containerHeight: 600,
        windows: [{ id: 'a', title: 'A', x: 100, y: 50, width: 400, height: 300 }],
      });
      api.send({ type: 'MAXIMIZE_WINDOW', id: 'a' });
      const win = api.getWindow('a');
      expect(win?.state).toBe('maximized');
      expect(win?.x).toBe(0);
      expect(win?.y).toBe(0);
      expect(win?.width).toBe(800);
      expect(win?.height).toBe(600);
    });

    it('saves restore rect', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A', x: 100, y: 50, width: 400, height: 300 }],
      });
      api.send({ type: 'MAXIMIZE_WINDOW', id: 'a' });
      const win = api.getWindow('a');
      expect(win?.restoreRect).toEqual({ x: 100, y: 50, width: 400, height: 300 });
    });
  });

  // ── RESTORE_WINDOW ──────────────────────────────────

  describe('RESTORE_WINDOW', () => {
    it('restores minimized window', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A', x: 100, y: 50 }],
      });
      api.send({ type: 'MINIMIZE_WINDOW', id: 'a' });
      api.send({ type: 'RESTORE_WINDOW', id: 'a' });
      const win = api.getWindow('a');
      expect(win?.state).toBe('normal');
      expect(win?.x).toBe(100);
      expect(win?.y).toBe(50);
    });

    it('restores maximized window to original rect', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A', x: 100, y: 50, width: 400, height: 300 }],
      });
      api.send({ type: 'MAXIMIZE_WINDOW', id: 'a' });
      api.send({ type: 'RESTORE_WINDOW', id: 'a' });
      const win = api.getWindow('a');
      expect(win?.state).toBe('normal');
      expect(win?.x).toBe(100);
      expect(win?.y).toBe(50);
      expect(win?.width).toBe(400);
      expect(win?.height).toBe(300);
    });
  });

  // ── MOVE_WINDOW / RESIZE_WINDOW ─────────────────────

  describe('MOVE_WINDOW', () => {
    it('moves a window', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'MOVE_WINDOW', id: 'a', x: 200, y: 150 });
      const win = api.getWindow('a');
      expect(win?.x).toBe(200);
      expect(win?.y).toBe(150);
    });

    it('does not move maximized window', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A', x: 100, y: 50 }],
      });
      api.send({ type: 'MAXIMIZE_WINDOW', id: 'a' });
      api.send({ type: 'MOVE_WINDOW', id: 'a', x: 200, y: 150 });
      expect(api.getWindow('a')?.x).toBe(0);
    });
  });

  describe('RESIZE_WINDOW', () => {
    it('resizes a window', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'RESIZE_WINDOW', id: 'a', width: 600, height: 400 });
      const win = api.getWindow('a');
      expect(win?.width).toBe(600);
      expect(win?.height).toBe(400);
    });

    it('enforces minimum size', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'RESIZE_WINDOW', id: 'a', width: 10, height: 10 });
      const win = api.getWindow('a');
      expect((win?.width ?? 0) >= 100).toBe(true);
      expect((win?.height ?? 0) >= 50).toBe(true);
    });
  });

  // ── SET_TITLE ───────────────────────────────────────

  it('SET_TITLE updates window title', () => {
    const api = createMDI({
      windows: [{ id: 'a', title: 'Old' }],
    });
    api.send({ type: 'SET_TITLE', id: 'a', title: 'New' });
    expect(api.getWindow('a')?.title).toBe('New');
  });

  // ── ARRANGE ─────────────────────────────────────────

  describe('ARRANGE', () => {
    it('cascade arranges windows', () => {
      const api = createMDI({
        windows: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
          { id: 'c', title: 'C' },
        ],
      });
      api.send({ type: 'ARRANGE', arrangement: 'cascade' });
      const wins = api.getWindows();
      // Her pencere farklı pozisyonda
      const xs = wins.map((w) => w.x);
      expect(new Set(xs).size).toBe(3);
    });

    it('tile-horizontal arranges windows vertically stacked', () => {
      const api = createMDI({
        containerWidth: 800,
        containerHeight: 600,
        windows: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ],
      });
      api.send({ type: 'ARRANGE', arrangement: 'tile-horizontal' });
      const winA = api.getWindow('a');
      const winB = api.getWindow('b');
      expect(winA?.width).toBe(800);
      expect(winB?.width).toBe(800);
      expect(winA?.height).toBe(300); // 600/2
      expect(winB?.height).toBe(300);
    });

    it('tile-vertical arranges windows side by side', () => {
      const api = createMDI({
        containerWidth: 800,
        containerHeight: 600,
        windows: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ],
      });
      api.send({ type: 'ARRANGE', arrangement: 'tile-vertical' });
      const winA = api.getWindow('a');
      const winB = api.getWindow('b');
      expect(winA?.width).toBe(400); // 800/2
      expect(winB?.width).toBe(400);
      expect(winA?.height).toBe(600);
    });

    it('skips minimized windows in tiling', () => {
      const api = createMDI({
        containerWidth: 800,
        containerHeight: 600,
        windows: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
          { id: 'c', title: 'C' },
        ],
      });
      api.send({ type: 'MINIMIZE_WINDOW', id: 'b' });
      api.send({ type: 'ARRANGE', arrangement: 'tile-horizontal' });
      expect(api.getWindow('b')?.state).toBe('minimized');
      // a ve c tile edilmiş
      expect(api.getWindow('a')?.height).toBe(300); // 600/2
    });
  });

  // ── SET_CONTAINER_SIZE ──────────────────────────────

  describe('SET_CONTAINER_SIZE', () => {
    it('updates container size', () => {
      const api = createMDI();
      api.send({ type: 'SET_CONTAINER_SIZE', width: 1200, height: 900 });
      expect(api.getContainerSize()).toEqual({ width: 1200, height: 900 });
    });

    it('updates maximized windows', () => {
      const api = createMDI({
        windows: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'MAXIMIZE_WINDOW', id: 'a' });
      api.send({ type: 'SET_CONTAINER_SIZE', width: 1200, height: 900 });
      expect(api.getWindow('a')?.width).toBe(1200);
      expect(api.getWindow('a')?.height).toBe(900);
    });
  });

  // ── Bulk operations ─────────────────────────────────

  describe('bulk operations', () => {
    it('MINIMIZE_ALL minimizes all windows', () => {
      const api = createMDI({
        windows: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ],
      });
      api.send({ type: 'MINIMIZE_ALL' });
      expect(api.getWindow('a')?.state).toBe('minimized');
      expect(api.getWindow('b')?.state).toBe('minimized');
      expect(api.getActiveWindowId()).toBeNull();
    });

    it('RESTORE_ALL restores minimized windows', () => {
      const api = createMDI({
        windows: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ],
      });
      api.send({ type: 'MINIMIZE_ALL' });
      api.send({ type: 'RESTORE_ALL' });
      expect(api.getWindow('a')?.state).toBe('normal');
      expect(api.getWindow('b')?.state).toBe('normal');
    });

    it('CLOSE_ALL removes all windows', () => {
      const api = createMDI({
        windows: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ],
      });
      api.send({ type: 'CLOSE_ALL' });
      expect(api.getWindowCount()).toBe(0);
      expect(api.getActiveWindowId()).toBeNull();
    });
  });

  // ── getWindows ordering ─────────────────────────────

  it('getWindows returns sorted by z-index', () => {
    const api = createMDI({
      windows: [
        { id: 'a', title: 'A' },
        { id: 'b', title: 'B' },
        { id: 'c', title: 'C' },
      ],
    });
    api.send({ type: 'ACTIVATE_WINDOW', id: 'a' });
    const wins = api.getWindows();
    // a should be last (highest z-index)
    expect(wins[wins.length - 1]?.id).toBe('a');
  });

  // ── Immutability ────────────────────────────────────

  it('getWindows returns copies', () => {
    const api = createMDI({
      windows: [{ id: 'a', title: 'A' }],
    });
    const wins = api.getWindows();
    const first = wins[0];
    if (first) first.title = 'Mutated';
    expect(api.getWindow('a')?.title).toBe('A');
  });
});
