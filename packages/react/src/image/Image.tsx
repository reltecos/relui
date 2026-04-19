/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Image — gelismis resim bilesen (Dual API).
 * Image — advanced image component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { rootStyle, imageStyle, placeholderStyle, fallbackStyle, lightboxStyle, lightboxImgStyle } from './image.css';
import { useImage } from './useImage';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type ImageSlot = 'root' | 'image' | 'placeholder' | 'fallback';

interface ImageCtxValue {
  loadState: string;
  lightboxOpen: boolean;
  src: string;
  alt: string;
  onOpenLightbox: () => void;
  onCloseLightbox: () => void;
  classNames: ClassNames<ImageSlot> | undefined;
  styles: Styles<ImageSlot> | undefined;
}

const ImageCtx = createContext<ImageCtxValue | null>(null);
function useImageContext(): ImageCtxValue {
  const c = useContext(ImageCtx);
  if (!c) throw new Error('Image compound sub-components must be used within <Image>.');
  return c;
}

// ── Sub: Img ──

export interface ImageImgProps { className?: string }
const ImageImg = forwardRef<HTMLImageElement, ImageImgProps>(
  function ImageImg(props, ref) {
    const { className } = props;
    const ctx = useImageContext();
    const slot = getSlotProps('image', imageStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <img ref={ref} src={ctx.src} alt={ctx.alt} className={cls} style={{ ...slot.style, opacity: ctx.loadState === 'loaded' ? 1 : 0 }} data-testid="image-image" onClick={ctx.onOpenLightbox} />;
  },
);

// ── Sub: Placeholder ──

export interface ImagePlaceholderProps { children?: ReactNode; className?: string }
const ImagePlaceholder = forwardRef<HTMLDivElement, ImagePlaceholderProps>(
  function ImagePlaceholder(props, ref) {
    const { children, className } = props;
    const ctx = useImageContext();
    if (ctx.loadState !== 'loading' && ctx.loadState !== 'idle') return null;
    const slot = getSlotProps('placeholder', placeholderStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <div ref={ref} className={cls} style={slot.style} data-testid="image-placeholder">{children ?? 'Yukleniyor...'}</div>;
  },
);

// ── Sub: Fallback ──

export interface ImageFallbackProps { children?: ReactNode; className?: string }
const ImageFallback = forwardRef<HTMLDivElement, ImageFallbackProps>(
  function ImageFallback(props, ref) {
    const { children, className } = props;
    const ctx = useImageContext();
    if (ctx.loadState !== 'error') return null;
    const slot = getSlotProps('fallback', fallbackStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <div ref={ref} className={cls} style={slot.style} data-testid="image-fallback">{children ?? 'Resim yuklenemedi'}</div>;
  },
);

// ── Props ──

export interface ImageComponentProps extends SlotStyleProps<ImageSlot> {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  lazy?: boolean;
  lightbox?: boolean;
  fallbackText?: string;
  onLoad?: () => void;
  onError?: () => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ImageBase = forwardRef<HTMLDivElement, ImageComponentProps>(
  function Image(props, ref) {
    const {
      src, alt = '', width, height, lazy = false, lightbox = false,
      onLoad, onError, children, className, style: styleProp, classNames, styles,
    } = props;

    const { context, send } = useImage({ lazy, onLoad, onError });
    const imgRef = useRef<HTMLImageElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    // Lazy loading with IntersectionObserver
    useEffect(() => {
      if (!lazy || context.loadState !== 'idle') return;
      const el = rootRef.current;
      if (!el || typeof IntersectionObserver === 'undefined') {
        send({ type: 'START_LOAD' });
        return;
      }
      const obs = new IntersectionObserver(
        (entries) => { if (entries[0]?.isIntersecting) { send({ type: 'START_LOAD' }); obs.disconnect(); } },
        { threshold: 0.1 },
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, [lazy, context.loadState, send]);

    const handleImgLoad = useCallback(() => { send({ type: 'LOAD_SUCCESS' }); }, [send]);
    const handleImgError = useCallback(() => { send({ type: 'LOAD_ERROR' }); }, [send]);
    const onOpenLightbox = useCallback(() => { if (lightbox) send({ type: 'OPEN_LIGHTBOX' }); }, [lightbox, send]);
    const onCloseLightbox = useCallback(() => { send({ type: 'CLOSE_LIGHTBOX' }); }, [send]);

    // Merge refs
    const mergedRef = useCallback((el: HTMLDivElement | null) => {
      (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    }, [ref]);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const sizeStyle: React.CSSProperties = {};
    if (width) sizeStyle.width = width;
    if (height) sizeStyle.height = height;

    const ctxValue: ImageCtxValue = { loadState: context.loadState, lightboxOpen: context.lightboxOpen, src, alt, onOpenLightbox, onCloseLightbox, classNames, styles };

    const shouldShowImg = context.loadState === 'loading' || context.loadState === 'loaded';

    if (children) {
      return (
        <ImageCtx.Provider value={ctxValue}>
          <div ref={mergedRef} className={rootCls} style={{ ...rootSlot.style, ...sizeStyle, ...styleProp }} data-testid="image-root">
            {children}
          </div>
        </ImageCtx.Provider>
      );
    }

    return (
      <ImageCtx.Provider value={ctxValue}>
        <div ref={mergedRef} className={rootCls} style={{ ...rootSlot.style, ...sizeStyle, ...styleProp }} data-testid="image-root" data-state={context.loadState}>
          {(context.loadState === 'loading' || context.loadState === 'idle') && (
            <div className={placeholderStyle} style={sizeStyle} data-testid="image-placeholder">Yukleniyor...</div>
          )}
          {context.loadState === 'error' && (
            <div className={fallbackStyle} style={sizeStyle} data-testid="image-fallback">Resim yuklenemedi</div>
          )}
          {shouldShowImg && (
            <img ref={imgRef} src={src} alt={alt} className={imageStyle}
              style={{ opacity: context.loadState === 'loaded' ? 1 : 0 }}
              onLoad={handleImgLoad} onError={handleImgError}
              onClick={onOpenLightbox}
              data-testid="image-image" />
          )}
          {context.lightboxOpen && (
            <div className={lightboxStyle} onClick={onCloseLightbox} data-testid="image-lightbox" role="dialog" aria-label="Image lightbox">
              <img src={src} alt={alt} className={lightboxImgStyle} />
            </div>
          )}
        </div>
      </ImageCtx.Provider>
    );
  },
);

export const Image = Object.assign(ImageBase, { Img: ImageImg, Placeholder: ImagePlaceholder, Fallback: ImageFallback });
