/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ImageCropper — gorsel kirpma bilesen (Dual API).
 * ImageCropper — image crop component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useCallback, type ReactNode } from 'react';
import type { CropArea, CropAspectRatio } from '@relteco/relui-core';
import { rootStyle, previewStyle, imageStyle, controlsStyle, sliderStyle, controlButtonStyle } from './image-cropper.css';
import { useImageCropper, type UseImageCropperProps } from './useImageCropper';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type ImageCropperSlot = 'root' | 'preview' | 'controls' | 'image';

interface ImageCropperContextValue {
  crop: CropArea; zoom: number; rotation: number; aspectRatio: CropAspectRatio;
  src: string;
  onSetZoom: (z: number) => void; onSetRotation: (r: number) => void;
  onSetAspectRatio: (ar: CropAspectRatio) => void; onReset: () => void;
  classNames: ClassNames<ImageCropperSlot> | undefined; styles: Styles<ImageCropperSlot> | undefined;
}

const ImageCropperCtx = createContext<ImageCropperContextValue | null>(null);
function useImageCropperContext(): ImageCropperContextValue {
  const ctx = useContext(ImageCropperCtx);
  if (!ctx) throw new Error('ImageCropper compound sub-components must be used within <ImageCropper>.');
  return ctx;
}

// ── Sub: Preview ──

export interface ImageCropperPreviewProps { className?: string }

const ImageCropperPreview = forwardRef<HTMLDivElement, ImageCropperPreviewProps>(
  function ImageCropperPreview(props, ref) {
    const { className } = props;
    const ctx = useImageCropperContext();
    const slot = getSlotProps('preview', previewStyle, ctx.classNames, ctx.styles);
    const imgSlot = getSlotProps('image', imageStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="imagecropper-preview">
        <img
          src={ctx.src}
          alt="Crop preview"
          className={imgSlot.className}
          style={{ ...imgSlot.style, transform: `scale(${ctx.zoom}) rotate(${ctx.rotation}deg)` }}
          data-testid="imagecropper-image"
        />
      </div>
    );
  },
);

// ── Sub: Controls ──

export interface ImageCropperControlsProps { className?: string }

const ImageCropperControls = forwardRef<HTMLDivElement, ImageCropperControlsProps>(
  function ImageCropperControls(props, ref) {
    const { className } = props;
    const ctx = useImageCropperContext();
    const slot = getSlotProps('controls', controlsStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="imagecropper-controls">
        <label style={{ fontSize: 'var(--rel-text-xs, 12px)' }}>Zoom</label>
        <input type="range" className={sliderStyle} min={10} max={500} value={Math.round(ctx.zoom * 100)}
          onChange={(e) => ctx.onSetZoom(Number(e.target.value) / 100)}
          data-testid="imagecropper-zoom" aria-label="Zoom" />
        <button type="button" className={controlButtonStyle} onClick={() => ctx.onSetRotation(ctx.rotation - 90)} data-testid="imagecropper-rotateLeft" aria-label="Rotate left">
          ↺
        </button>
        <button type="button" className={controlButtonStyle} onClick={() => ctx.onSetRotation(ctx.rotation + 90)} data-testid="imagecropper-rotateRight" aria-label="Rotate right">
          ↻
        </button>
        <button type="button" className={controlButtonStyle} onClick={ctx.onReset} data-testid="imagecropper-reset" aria-label="Reset">
          Sifirla
        </button>
      </div>
    );
  },
);

// ── Props ──

export interface ImageCropperComponentProps extends SlotStyleProps<ImageCropperSlot> {
  src: string;
  aspectRatio?: CropAspectRatio;
  defaultZoom?: number;
  onCropChange?: (crop: CropArea) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ImageCropperBase = forwardRef<HTMLDivElement, ImageCropperComponentProps>(
  function ImageCropper(props, ref) {
    const { src, aspectRatio, defaultZoom, onCropChange, children, className, style: styleProp, classNames, styles } = props;
    const hookProps: UseImageCropperProps = { defaultAspectRatio: aspectRatio, defaultZoom, onCropChange };
    const { context, send } = useImageCropper(hookProps);

    const onSetZoom = useCallback((z: number) => send({ type: 'SET_ZOOM', zoom: z }), [send]);
    const onSetRotation = useCallback((r: number) => send({ type: 'SET_ROTATION', rotation: r }), [send]);
    const onSetAspectRatio = useCallback((ar: CropAspectRatio) => send({ type: 'SET_ASPECT_RATIO', aspectRatio: ar }), [send]);
    const onReset = useCallback(() => send({ type: 'RESET' }), [send]);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: ImageCropperContextValue = { crop: context.crop, zoom: context.zoom, rotation: context.rotation, aspectRatio: context.aspectRatio, src, onSetZoom, onSetRotation, onSetAspectRatio, onReset, classNames, styles };

    if (children) {
      return (<ImageCropperCtx.Provider value={ctxValue}><div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="imagecropper-root">{children}</div></ImageCropperCtx.Provider>);
    }

    return (
      <ImageCropperCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="imagecropper-root">
          <ImageCropperPreview />
          <ImageCropperControls />
        </div>
      </ImageCropperCtx.Provider>
    );
  },
);

export const ImageCropper = Object.assign(ImageCropperBase, { Preview: ImageCropperPreview, Controls: ImageCropperControls });
