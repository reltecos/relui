/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ImageGallery — resim galerisi bilesen (Dual API).
 * ImageGallery — image gallery component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useCallback, useEffect, type ReactNode } from 'react';
import type { GalleryImageDef } from '@relteco/relui-core';
import {
  rootStyle, gridStyle, gridItemStyle, gridImgStyle,
  lightboxStyle, lightboxImgStyle, navButtonStyle, navPrevStyle, navNextStyle,
  thumbnailStripStyle, thumbnailStyle,
} from './image-gallery.css';
import { useImageGallery } from './useImageGallery';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type ImageGallerySlot = 'root' | 'grid' | 'lightbox' | 'thumbnail' | 'navigation';

interface ImageGalleryCtxValue {
  images: GalleryImageDef[];
  activeIndex: number;
  lightboxOpen: boolean;
  onSelect: (i: number) => void;
  onOpenLightbox: (i: number) => void;
  onCloseLightbox: () => void;
  onNext: () => void;
  onPrev: () => void;
  classNames: ClassNames<ImageGallerySlot> | undefined;
  styles: Styles<ImageGallerySlot> | undefined;
}

const ImageGalleryCtx = createContext<ImageGalleryCtxValue | null>(null);
function useImageGalleryContext(): ImageGalleryCtxValue {
  const c = useContext(ImageGalleryCtx);
  if (!c) throw new Error('ImageGallery compound sub-components must be used within <ImageGallery>.');
  return c;
}

// ── Sub: Grid ──

export interface ImageGalleryGridProps { className?: string }
const ImageGalleryGrid = forwardRef<HTMLDivElement, ImageGalleryGridProps>(
  function ImageGalleryGrid(props, ref) {
    const { className } = props;
    const ctx = useImageGalleryContext();
    const slot = getSlotProps('grid', gridStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="imagegallery-grid">
        {ctx.images.map((img, i) => (
          <div key={img.id} className={gridItemStyle} data-active={ctx.activeIndex === i}
            onClick={() => ctx.onOpenLightbox(i)} data-testid="imagegallery-gridItem">
            <img src={img.thumbnail ?? img.src} alt={img.alt ?? ''} className={gridImgStyle} />
          </div>
        ))}
      </div>
    );
  },
);

// ── Sub: Lightbox ──

export interface ImageGalleryLightboxProps { className?: string }
const ImageGalleryLightbox = forwardRef<HTMLDivElement, ImageGalleryLightboxProps>(
  function ImageGalleryLightbox(props, ref) {
    const { className } = props;
    const ctx = useImageGalleryContext();
    if (!ctx.lightboxOpen) return null;
    const slot = getSlotProps('lightbox', lightboxStyle, ctx.classNames, ctx.styles);
    const nSlot = getSlotProps('navigation', '', ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const img = ctx.images[ctx.activeIndex];

    return (
      <div ref={ref} className={cls} style={slot.style} onClick={ctx.onCloseLightbox}
        data-testid="imagegallery-lightbox" role="dialog" aria-label="Image lightbox">
        <button type="button" className={`${navButtonStyle} ${navPrevStyle} ${nSlot.className}`}
          style={nSlot.style} onClick={(e) => { e.stopPropagation(); ctx.onPrev(); }}
          data-testid="imagegallery-prev" aria-label="Previous">&lsaquo;</button>
        {img && <img src={img.src} alt={img.alt ?? ''} className={lightboxImgStyle} onClick={(e) => e.stopPropagation()} />}
        <button type="button" className={`${navButtonStyle} ${navNextStyle} ${nSlot.className}`}
          style={nSlot.style} onClick={(e) => { e.stopPropagation(); ctx.onNext(); }}
          data-testid="imagegallery-next" aria-label="Next">&rsaquo;</button>
      </div>
    );
  },
);

// ── Sub: Thumbnails ──

export interface ImageGalleryThumbnailsProps { className?: string }
const ImageGalleryThumbnails = forwardRef<HTMLDivElement, ImageGalleryThumbnailsProps>(
  function ImageGalleryThumbnails(props, ref) {
    const { className } = props;
    const ctx = useImageGalleryContext();
    const slot = getSlotProps('thumbnail', thumbnailStripStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="imagegallery-thumbnails">
        {ctx.images.map((img, i) => (
          <img key={img.id} src={img.thumbnail ?? img.src} alt={img.alt ?? ''}
            className={thumbnailStyle} data-active={ctx.activeIndex === i}
            onClick={() => ctx.onSelect(i)} data-testid="imagegallery-thumb" />
        ))}
      </div>
    );
  },
);

// ── Props ──

export interface ImageGalleryComponentProps extends SlotStyleProps<ImageGallerySlot> {
  images: GalleryImageDef[];
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ImageGalleryBase = forwardRef<HTMLDivElement, ImageGalleryComponentProps>(
  function ImageGallery(props, ref) {
    const { images, defaultIndex, onIndexChange, children, className, style: styleProp, classNames, styles } = props;
    const { context, send } = useImageGallery({ images, defaultIndex, onIndexChange });

    const onSelect = useCallback((i: number) => send({ type: 'SELECT', index: i }), [send]);
    const onOpenLightbox = useCallback((i: number) => send({ type: 'OPEN_LIGHTBOX', index: i }), [send]);
    const onCloseLightbox = useCallback(() => send({ type: 'CLOSE_LIGHTBOX' }), [send]);
    const onNext = useCallback(() => send({ type: 'NEXT' }), [send]);
    const onPrev = useCallback(() => send({ type: 'PREV' }), [send]);

    // Keyboard nav
    useEffect(() => {
      if (!context.lightboxOpen) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') onNext();
        else if (e.key === 'ArrowLeft') onPrev();
        else if (e.key === 'Escape') onCloseLightbox();
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [context.lightboxOpen, onNext, onPrev, onCloseLightbox]);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: ImageGalleryCtxValue = {
      images, activeIndex: context.activeIndex, lightboxOpen: context.lightboxOpen,
      onSelect, onOpenLightbox, onCloseLightbox, onNext, onPrev, classNames, styles,
    };

    if (children) {
      return (<ImageGalleryCtx.Provider value={ctxValue}><div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="imagegallery-root">{children}</div></ImageGalleryCtx.Provider>);
    }

    return (
      <ImageGalleryCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="imagegallery-root">
          <ImageGalleryGrid />
          <ImageGalleryThumbnails />
          <ImageGalleryLightbox />
        </div>
      </ImageGalleryCtx.Provider>
    );
  },
);

export const ImageGallery = Object.assign(ImageGalleryBase, {
  Grid: ImageGalleryGrid,
  Lightbox: ImageGalleryLightbox,
  Thumbnails: ImageGalleryThumbnails,
});
