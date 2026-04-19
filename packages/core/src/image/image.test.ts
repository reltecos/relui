/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createImage } from './image.machine';

describe('createImage', () => {
  it('lazy false ise loading', () => { expect(createImage().getContext().loadState).toBe('loading'); });
  it('lazy true ise idle', () => { expect(createImage({ lazy: true }).getContext().loadState).toBe('idle'); });
  it('START_LOAD loading yapar', () => { const a = createImage({ lazy: true }); a.send({ type: 'START_LOAD' }); expect(a.getContext().loadState).toBe('loading'); });
  it('LOAD_SUCCESS loaded yapar', () => { const a = createImage(); a.send({ type: 'LOAD_SUCCESS' }); expect(a.getContext().loadState).toBe('loaded'); });
  it('LOAD_ERROR error yapar', () => { const a = createImage(); a.send({ type: 'LOAD_ERROR' }); expect(a.getContext().loadState).toBe('error'); });
  it('OPEN_LIGHTBOX acilir', () => { const a = createImage(); a.send({ type: 'OPEN_LIGHTBOX' }); expect(a.getContext().lightboxOpen).toBe(true); });
  it('CLOSE_LIGHTBOX kapanir', () => { const a = createImage(); a.send({ type: 'OPEN_LIGHTBOX' }); a.send({ type: 'CLOSE_LIGHTBOX' }); expect(a.getContext().lightboxOpen).toBe(false); });
  it('CLOSE_LIGHTBOX zaten kapali notify olmaz', () => { const a = createImage(); const fn = vi.fn(); a.subscribe(fn); a.send({ type: 'CLOSE_LIGHTBOX' }); expect(fn).not.toHaveBeenCalled(); });
  it('onLoad callback cagirilir', () => { const fn = vi.fn(); const a = createImage({ onLoad: fn }); a.send({ type: 'LOAD_SUCCESS' }); expect(fn).toHaveBeenCalled(); });
  it('onError callback cagirilir', () => { const fn = vi.fn(); const a = createImage({ onError: fn }); a.send({ type: 'LOAD_ERROR' }); expect(fn).toHaveBeenCalled(); });
  it('subscribe calisir', () => { const a = createImage(); const fn = vi.fn(); a.subscribe(fn); a.send({ type: 'LOAD_SUCCESS' }); expect(fn).toHaveBeenCalled(); });
  it('destroy temizler', () => { const a = createImage(); const fn = vi.fn(); a.subscribe(fn); a.destroy(); a.send({ type: 'LOAD_SUCCESS' }); expect(fn).not.toHaveBeenCalled(); });
});
