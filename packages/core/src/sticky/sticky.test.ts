/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createSticky } from './sticky.machine';

describe('createSticky', () => {
  // ── Initial state ────────────────────────────────────

  it('starts with idle state', () => {
    const api = createSticky();
    expect(api.getState()).toBe('idle');
    expect(api.isStuck()).toBe(false);
  });

  it('defaults to position=top, offset=0, enabled=true', () => {
    const api = createSticky();
    expect(api.getPosition()).toBe('top');
    expect(api.getOffset()).toBe(0);
    expect(api.isEnabled()).toBe(true);
  });

  it('accepts initial props', () => {
    const api = createSticky({ position: 'bottom', offset: 20, enabled: false });
    expect(api.getPosition()).toBe('bottom');
    expect(api.getOffset()).toBe(20);
    expect(api.isEnabled()).toBe(false);
  });

  // ── Top position ────────────────────────────────────

  describe('position=top', () => {
    it('idle when container is below viewport top', () => {
      const api = createSticky({ position: 'top' });
      api.send({ type: 'UPDATE', containerTop: 100, containerBottom: 500, viewportHeight: 800 });
      expect(api.getState()).toBe('idle');
      expect(api.isStuck()).toBe(false);
    });

    it('stuck when container top reaches viewport top', () => {
      const api = createSticky({ position: 'top' });
      api.send({ type: 'UPDATE', containerTop: 0, containerBottom: 400, viewportHeight: 800 });
      expect(api.getState()).toBe('stuck');
      expect(api.isStuck()).toBe(true);
    });

    it('stuck when container top is above viewport top', () => {
      const api = createSticky({ position: 'top' });
      api.send({ type: 'UPDATE', containerTop: -50, containerBottom: 350, viewportHeight: 800 });
      expect(api.getState()).toBe('stuck');
    });

    it('released when container bottom passes viewport top', () => {
      const api = createSticky({ position: 'top' });
      api.send({ type: 'UPDATE', containerTop: -400, containerBottom: -10, viewportHeight: 800 });
      expect(api.getState()).toBe('released');
    });

    it('stuck with offset', () => {
      const api = createSticky({ position: 'top', offset: 50 });
      // containerTop=30 < offset=50 → stuck
      api.send({ type: 'UPDATE', containerTop: 30, containerBottom: 500, viewportHeight: 800 });
      expect(api.getState()).toBe('stuck');
    });

    it('idle with offset when container is below threshold', () => {
      const api = createSticky({ position: 'top', offset: 50 });
      // containerTop=60 > offset=50 → idle
      api.send({ type: 'UPDATE', containerTop: 60, containerBottom: 500, viewportHeight: 800 });
      expect(api.getState()).toBe('idle');
    });
  });

  // ── Bottom position ────────────────────────────────

  describe('position=bottom', () => {
    it('idle when container is above viewport bottom', () => {
      const api = createSticky({ position: 'bottom' });
      api.send({ type: 'UPDATE', containerTop: 100, containerBottom: 500, viewportHeight: 800 });
      expect(api.getState()).toBe('idle');
    });

    it('stuck when container bottom reaches viewport bottom', () => {
      const api = createSticky({ position: 'bottom' });
      api.send({ type: 'UPDATE', containerTop: 400, containerBottom: 800, viewportHeight: 800 });
      expect(api.getState()).toBe('stuck');
    });

    it('stuck when container bottom is below viewport bottom', () => {
      const api = createSticky({ position: 'bottom' });
      api.send({ type: 'UPDATE', containerTop: 500, containerBottom: 900, viewportHeight: 800 });
      expect(api.getState()).toBe('stuck');
    });

    it('released when container top passes viewport bottom', () => {
      const api = createSticky({ position: 'bottom' });
      api.send({ type: 'UPDATE', containerTop: 850, containerBottom: 1200, viewportHeight: 800 });
      expect(api.getState()).toBe('released');
    });

    it('stuck with offset', () => {
      const api = createSticky({ position: 'bottom', offset: 50 });
      // threshold = 800 - 50 = 750, containerBottom=760 >= 750 → stuck
      api.send({ type: 'UPDATE', containerTop: 400, containerBottom: 760, viewportHeight: 800 });
      expect(api.getState()).toBe('stuck');
    });
  });

  // ── Enabled/disabled ──────────────────────────────

  describe('enabled', () => {
    it('always idle when disabled', () => {
      const api = createSticky({ enabled: false });
      api.send({ type: 'UPDATE', containerTop: -100, containerBottom: 300, viewportHeight: 800 });
      expect(api.getState()).toBe('idle');
      expect(api.isStuck()).toBe(false);
    });

    it('returns to idle when disabled while stuck', () => {
      const api = createSticky();
      api.send({ type: 'UPDATE', containerTop: -50, containerBottom: 350, viewportHeight: 800 });
      expect(api.isStuck()).toBe(true);

      api.send({ type: 'SET_ENABLED', value: false });
      expect(api.getState()).toBe('idle');
      expect(api.isStuck()).toBe(false);
    });

    it('re-enables and computes on next update', () => {
      const api = createSticky({ enabled: false });
      api.send({ type: 'SET_ENABLED', value: true });
      expect(api.isEnabled()).toBe(true);

      api.send({ type: 'UPDATE', containerTop: -50, containerBottom: 350, viewportHeight: 800 });
      expect(api.isStuck()).toBe(true);
    });
  });

  // ── Prop sync ────────────────────────────────────

  describe('prop sync', () => {
    it('SET_POSITION updates position', () => {
      const api = createSticky({ position: 'top' });
      api.send({ type: 'SET_POSITION', value: 'bottom' });
      expect(api.getPosition()).toBe('bottom');
    });

    it('SET_OFFSET updates offset', () => {
      const api = createSticky({ offset: 0 });
      api.send({ type: 'SET_OFFSET', value: 30 });
      expect(api.getOffset()).toBe(30);
    });
  });

  // ── State transitions ────────────────────────────

  describe('state transitions', () => {
    it('transitions idle → stuck → released → stuck → idle', () => {
      const api = createSticky({ position: 'top' });

      // idle
      api.send({ type: 'UPDATE', containerTop: 100, containerBottom: 500, viewportHeight: 800 });
      expect(api.getState()).toBe('idle');

      // stuck
      api.send({ type: 'UPDATE', containerTop: -50, containerBottom: 350, viewportHeight: 800 });
      expect(api.getState()).toBe('stuck');

      // released (scroll down past container)
      api.send({ type: 'UPDATE', containerTop: -500, containerBottom: -100, viewportHeight: 800 });
      expect(api.getState()).toBe('released');

      // stuck again (scroll back up)
      api.send({ type: 'UPDATE', containerTop: -50, containerBottom: 350, viewportHeight: 800 });
      expect(api.getState()).toBe('stuck');

      // idle (scroll to top)
      api.send({ type: 'UPDATE', containerTop: 100, containerBottom: 500, viewportHeight: 800 });
      expect(api.getState()).toBe('idle');
    });
  });
});
