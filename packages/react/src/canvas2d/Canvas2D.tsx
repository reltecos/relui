/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Canvas2D — 2D cizim yüzeyi bilesen (Dual API).
 * Canvas2D — 2D drawing surface component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { CanvasShape } from '@relteco/relui-core';
import { rootStyle, canvasContainerStyle, canvasElementStyle, toolbarStyle, toolbarButtonStyle, layerPanelStyle, layerItemStyle } from './canvas2d.css';
import { useCanvas2D, type UseCanvas2DProps } from './useCanvas2D';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type Canvas2DSlot = 'root' | 'canvas' | 'toolbar' | 'layerPanel';

interface Canvas2DContextValue {
  shapes: readonly CanvasShape[]; selectedIds: ReadonlySet<string>;
  zoom: number; panX: number; panY: number; canUndo: boolean; canRedo: boolean;
  select: (ids: string[]) => void; deselectAll: () => void;
  bringForward: (id: string) => void; sendBackward: (id: string) => void;
  undo: () => void; redo: () => void;
  setZoom: (z: number) => void; setPan: (px: number, py: number) => void;
  deleteShape: (id: string) => void;
  classNames: ClassNames<Canvas2DSlot> | undefined;
  styles: Styles<Canvas2DSlot> | undefined;
}

const Canvas2DContext = createContext<Canvas2DContextValue | null>(null);

function useCanvas2DContext(): Canvas2DContextValue {
  const ctx = useContext(Canvas2DContext);
  if (!ctx) throw new Error('Canvas2D compound sub-components must be used within <Canvas2D>.');
  return ctx;
}

// ── Compound: Surface ──

export interface Canvas2DSurfaceProps { className?: string; width?: number; height?: number; }

const Canvas2DSurface = forwardRef<HTMLCanvasElement, Canvas2DSurfaceProps>(
  function Canvas2DSurface(props, ref) {
    const { className, width = 800, height = 600 } = props;
    const ctx = useCanvas2DContext();
    const slot = getSlotProps('canvas', canvasElementStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <canvas ref={ref} className={cls} style={slot.style} width={width} height={height} data-testid="canvas2d-surface" aria-label="Drawing canvas" />;
  },
);

// ── Compound: Toolbar ���─

export interface Canvas2DToolbarProps { className?: string; }

const Canvas2DToolbar = forwardRef<HTMLDivElement, Canvas2DToolbarProps>(
  function Canvas2DToolbar(props, ref) {
    const { className } = props;
    const ctx = useCanvas2DContext();
    const slot = getSlotProps('toolbar', toolbarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="canvas2d-toolbar" role="toolbar">
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.undo()} disabled={!ctx.canUndo} aria-label="Undo" data-testid="canvas2d-btn-undo">Undo</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.redo()} disabled={!ctx.canRedo} aria-label="Redo" data-testid="canvas2d-btn-redo">Redo</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.setZoom(ctx.zoom + 0.1)} aria-label="Zoom in" data-testid="canvas2d-btn-zoom-in">+</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.setZoom(ctx.zoom - 0.1)} aria-label="Zoom out" data-testid="canvas2d-btn-zoom-out">-</button>
      </div>
    );
  },
);

// ── Compound: LayerPanel ──

export interface Canvas2DLayerPanelProps { className?: string; }

const Canvas2DLayerPanel = forwardRef<HTMLDivElement, Canvas2DLayerPanelProps>(
  function Canvas2DLayerPanel(props, ref) {
    const { className } = props;
    const ctx = useCanvas2DContext();
    const slot = getSlotProps('layerPanel', layerPanelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const sorted = [...ctx.shapes].sort((a, b) => b.zIndex - a.zIndex);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="canvas2d-layer-panel" aria-label="Layers">
        {sorted.map((shape) => (
          <div key={shape.id} className={layerItemStyle} data-selected={ctx.selectedIds.has(shape.id)} data-testid="canvas2d-layer-item" onClick={() => ctx.select([shape.id])}>
            <span>{shape.type}</span>
            <span style={{ marginLeft: 'auto', opacity: 0.5 }}>z:{shape.zIndex}</span>
          </div>
        ))}
      </div>
    );
  },
);

// ── Component Props ──

export interface Canvas2DComponentProps extends SlotStyleProps<Canvas2DSlot> {
  shapes?: CanvasShape[]; gridSize?: number; snapToGrid?: boolean;
  onChange?: (shapes: readonly CanvasShape[]) => void;
  children?: ReactNode; className?: string; style?: React.CSSProperties;
}

const Canvas2DBase = forwardRef<HTMLDivElement, Canvas2DComponentProps>(
  function Canvas2D(props, ref) {
    const { shapes: sp, gridSize, snapToGrid, onChange, children, className, style: styleProp, classNames, styles } = props;
    const hookProps: UseCanvas2DProps = { defaultShapes: sp, gridSize, snapToGrid, onChange };
    const c2d = useCanvas2D(hookProps);
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: Canvas2DContextValue = { shapes: c2d.shapes, selectedIds: c2d.selectedIds, zoom: c2d.zoom, panX: c2d.panX, panY: c2d.panY, canUndo: c2d.canUndo, canRedo: c2d.canRedo, select: c2d.select, deselectAll: c2d.deselectAll, bringForward: c2d.bringForward, sendBackward: c2d.sendBackward, undo: c2d.undo, redo: c2d.redo, setZoom: c2d.setZoom, setPan: c2d.setPan, deleteShape: c2d.deleteShape, classNames, styles };

    if (children) {
      return <Canvas2DContext.Provider value={ctxValue}><div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="canvas2d-root" role="application" aria-label="Canvas 2D">{children}</div></Canvas2DContext.Provider>;
    }

    return (
      <Canvas2DContext.Provider value={ctxValue}>
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="canvas2d-root" role="application" aria-label="Canvas 2D">
          <Canvas2DToolbar />
          <div className={canvasContainerStyle}><Canvas2DSurface /></div>
          <Canvas2DLayerPanel />
        </div>
      </Canvas2DContext.Provider>
    );
  },
);

export const Canvas2D = Object.assign(Canvas2DBase, { Surface: Canvas2DSurface, Toolbar: Canvas2DToolbar, LayerPanel: Canvas2DLayerPanel });
