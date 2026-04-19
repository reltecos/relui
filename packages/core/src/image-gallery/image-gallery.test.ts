/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createImageGallery } from './image-gallery.machine';

const imgs = [{ id: '1', src: 'a.jpg' }, { id: '2', src: 'b.jpg' }, { id: '3', src: 'c.jpg' }];

describe('createImageGallery', () => {
  it('baslangic index 0', () => { expect(createImageGallery({ images: imgs }).getContext().activeIndex).toBe(0); });
  it('defaultIndex ayarlanir', () => { expect(createImageGallery({ images: imgs, defaultIndex: 1 }).getContext().activeIndex).toBe(1); });
  it('totalImages dogru', () => { expect(createImageGallery({ images: imgs }).getContext().totalImages).toBe(3); });
  it('NEXT bir ilerler', () => { const a = createImageGallery({ images: imgs }); a.send({ type: 'NEXT' }); expect(a.getContext().activeIndex).toBe(1); });
  it('NEXT son index te notify olmaz', () => { const a = createImageGallery({ images: imgs, defaultIndex: 2 }); const fn = vi.fn(); a.subscribe(fn); a.send({ type: 'NEXT' }); expect(fn).not.toHaveBeenCalled(); });
  it('PREV bir geriler', () => { const a = createImageGallery({ images: imgs, defaultIndex: 2 }); a.send({ type: 'PREV' }); expect(a.getContext().activeIndex).toBe(1); });
  it('PREV ilk index te notify olmaz', () => { const a = createImageGallery({ images: imgs }); const fn = vi.fn(); a.subscribe(fn); a.send({ type: 'PREV' }); expect(fn).not.toHaveBeenCalled(); });
  it('SELECT index ayarlar', () => { const a = createImageGallery({ images: imgs }); a.send({ type: 'SELECT', index: 2 }); expect(a.getContext().activeIndex).toBe(2); });
  it('SELECT ayni index notify olmaz', () => { const a = createImageGallery({ images: imgs }); const fn = vi.fn(); a.subscribe(fn); a.send({ type: 'SELECT', index: 0 }); expect(fn).not.toHaveBeenCalled(); });
  it('OPEN_LIGHTBOX acilir', () => { const a = createImageGallery({ images: imgs }); a.send({ type: 'OPEN_LIGHTBOX', index: 1 }); expect(a.getContext().lightboxOpen).toBe(true); expect(a.getContext().activeIndex).toBe(1); });
  it('CLOSE_LIGHTBOX kapanir', () => { const a = createImageGallery({ images: imgs }); a.send({ type: 'OPEN_LIGHTBOX', index: 0 }); a.send({ type: 'CLOSE_LIGHTBOX' }); expect(a.getContext().lightboxOpen).toBe(false); });
  it('onIndexChange cagirilir', () => { const fn = vi.fn(); const a = createImageGallery({ images: imgs, onIndexChange: fn }); a.send({ type: 'NEXT' }); expect(fn).toHaveBeenCalledWith(1); });
  it('subscribe calisir', () => { const a = createImageGallery({ images: imgs }); const fn = vi.fn(); a.subscribe(fn); a.send({ type: 'NEXT' }); expect(fn).toHaveBeenCalled(); });
  it('destroy temizler', () => { const a = createImageGallery({ images: imgs }); const fn = vi.fn(); a.subscribe(fn); a.destroy(); a.send({ type: 'NEXT' }); expect(fn).not.toHaveBeenCalled(); });
});
