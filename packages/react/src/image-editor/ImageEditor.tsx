/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ImageEditor — resim duzenleme bilesen (Dual API).
 * ImageEditor — image editor component (Dual API).
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { ImageFilter } from '@relteco/relui-core';
import { UndoIcon, RedoIcon } from '@relteco/relui-icons';
import { rootStyle, toolbarStyle, toolbarButtonStyle, canvasStyle, filterPanelStyle, filterSliderStyle, filterLabelStyle } from './image-editor.css';
import { useImageEditor, type UseImageEditorProps } from './useImageEditor';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type ImageEditorSlot = 'root' | 'toolbar' | 'canvas' | 'filterPanel';

interface ImageEditorContextValue {
  rotation: number; flipH: boolean; flipV: boolean; filter: ImageFilter; cssFilter: string;
  canUndo: boolean; canRedo: boolean;
  rotateCW: () => void; rotateCCW: () => void; flipHFn: () => void; flipVFn: () => void;
  setFilter: (f: Partial<ImageFilter>) => void; resetFilter: () => void;
  undo: () => void; redo: () => void; reset: () => void;
  classNames: ClassNames<ImageEditorSlot> | undefined; styles: Styles<ImageEditorSlot> | undefined;
}

const ImageEditorContext = createContext<ImageEditorContextValue | null>(null);
function useImageEditorContext(): ImageEditorContextValue {
  const ctx = useContext(ImageEditorContext);
  if (!ctx) throw new Error('ImageEditor compound sub-components must be used within <ImageEditor>.');
  return ctx;
}

export interface ImageEditorToolbarProps { className?: string; }
const ImageEditorToolbar = forwardRef<HTMLDivElement, ImageEditorToolbarProps>(
  function ImageEditorToolbar(props, ref) {
    const { className } = props;
    const ctx = useImageEditorContext();
    const slot = getSlotProps('toolbar', toolbarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="image-editor-toolbar">
        <button type="button" className={toolbarButtonStyle} onClick={ctx.rotateCW} data-testid="image-editor-rotateCW">&#x21BB; 90</button>
        <button type="button" className={toolbarButtonStyle} onClick={ctx.rotateCCW} data-testid="image-editor-rotateCCW">&#x21BA; 90</button>
        <button type="button" className={toolbarButtonStyle} onClick={ctx.flipHFn} data-testid="image-editor-flipH">&#x2194; Flip</button>
        <button type="button" className={toolbarButtonStyle} onClick={ctx.flipVFn} data-testid="image-editor-flipV">&#x2195; Flip</button>
        <button type="button" className={toolbarButtonStyle} onClick={ctx.undo} disabled={!ctx.canUndo} aria-label="Undo" data-testid="image-editor-undo"><UndoIcon size={14} /></button>
        <button type="button" className={toolbarButtonStyle} onClick={ctx.redo} disabled={!ctx.canRedo} aria-label="Redo" data-testid="image-editor-redo"><RedoIcon size={14} /></button>
        <button type="button" className={toolbarButtonStyle} onClick={ctx.reset} data-testid="image-editor-reset">Reset</button>
      </div>
    );
  },
);

export interface ImageEditorCanvasProps { src?: string; className?: string; }
const ImageEditorCanvas = forwardRef<HTMLDivElement, ImageEditorCanvasProps>(
  function ImageEditorCanvas(props, ref) {
    const { src, className } = props;
    const ctx = useImageEditorContext();
    const slot = getSlotProps('canvas', canvasStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const transform = `rotate(${ctx.rotation}deg) scaleX(${ctx.flipH ? -1 : 1}) scaleY(${ctx.flipV ? -1 : 1})`;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="image-editor-canvas">
        {src && <img src={src} alt="Edit" style={{ maxWidth: '100%', maxHeight: '100%', transform, filter: ctx.cssFilter, transition: 'transform 200ms ease, filter 200ms ease' }} data-testid="image-editor-image" />}
      </div>
    );
  },
);

export interface ImageEditorFilterPanelProps { className?: string; }
const ImageEditorFilterPanel = forwardRef<HTMLDivElement, ImageEditorFilterPanelProps>(
  function ImageEditorFilterPanel(props, ref) {
    const { className } = props;
    const ctx = useImageEditorContext();
    const slot = getSlotProps('filterPanel', filterPanelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const filters: { key: keyof ImageFilter; label: string; min: number; max: number }[] = [
      { key: 'brightness', label: 'Parlaklik', min: 0, max: 200 },
      { key: 'contrast', label: 'Kontrast', min: 0, max: 200 },
      { key: 'saturate', label: 'Doygunluk', min: 0, max: 200 },
      { key: 'grayscale', label: 'Gri ton', min: 0, max: 100 },
      { key: 'blur', label: 'Bulanlk', min: 0, max: 20 },
    ];
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="image-editor-filterPanel">
        {filters.map((f) => (
          <div key={f.key} className={filterSliderStyle}>
            <span className={filterLabelStyle}>{f.label}</span>
            <input type="range" min={f.min} max={f.max} value={ctx.filter[f.key]} onChange={(e) => ctx.setFilter({ [f.key]: Number(e.target.value) })} style={{ flex: 1 }} data-testid={`image-editor-filter-${f.key}`} />
            <span style={{ width: 32, textAlign: 'right', fontSize: 'var(--rel-text-xs, 11px)', color: 'var(--rel-color-text-secondary, #9ca3af)' }}>{ctx.filter[f.key]}</span>
          </div>
        ))}
        <button type="button" className={toolbarButtonStyle} onClick={ctx.resetFilter} data-testid="image-editor-resetFilter">Filtreleri Sifirla</button>
      </div>
    );
  },
);

export interface ImageEditorComponentProps extends SlotStyleProps<ImageEditorSlot>, UseImageEditorProps {
  src?: string;
  showFilters?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ImageEditorBase = forwardRef<HTMLDivElement, ImageEditorComponentProps>(
  function ImageEditor(props, ref) {
    const { onChange, src, showFilters = false, children, className, style: styleProp, classNames, styles } = props;
    const editor = useImageEditor({ onChange });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const realCtx: ImageEditorContextValue = {
      rotation: editor.rotation, flipH: editor.flipH, flipV: editor.flipV,
      filter: editor.filter, cssFilter: editor.cssFilter, canUndo: editor.canUndo, canRedo: editor.canRedo,
      rotateCW: editor.rotateCW, rotateCCW: editor.rotateCCW,
      flipHFn: () => editor.api.send({ type: 'FLIP_H' }),
      flipVFn: () => editor.api.send({ type: 'FLIP_V' }),
      setFilter: editor.setFilter, resetFilter: editor.resetFilter,
      undo: editor.undo, redo: editor.redo, reset: editor.reset,
      classNames, styles,
    };

    if (children) {
      return (
        <ImageEditorContext.Provider value={realCtx}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="image-editor-root">{children}</div>
        </ImageEditorContext.Provider>
      );
    }

    return (
      <ImageEditorContext.Provider value={realCtx}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="image-editor-root">
          <ImageEditorToolbar />
          <ImageEditorCanvas src={src} />
          {showFilters && <ImageEditorFilterPanel />}
        </div>
      </ImageEditorContext.Provider>
    );
  },
);

export const ImageEditor = Object.assign(ImageEditorBase, {
  Toolbar: ImageEditorToolbar, Canvas: ImageEditorCanvas, FilterPanel: ImageEditorFilterPanel,
});
