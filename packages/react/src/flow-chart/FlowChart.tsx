/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FlowChart — akis diyagrami bilesen (Dual API).
 * FlowChart — flowchart component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { FlowNode, FlowEdge } from '@relteco/relui-core';
import { rootStyle, canvasStyle, toolbarStyle, toolbarButtonStyle, nodeStyle, svgLayerStyle, edgeStyle, minimapStyle } from './flow-chart.css';
import { useFlowChart, type UseFlowChartProps } from './useFlowChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type FlowChartSlot = 'root' | 'canvas' | 'node' | 'edge' | 'toolbar' | 'minimap';

interface FlowChartContextValue {
  nodes: readonly FlowNode[]; edges: readonly FlowEdge[]; selectedIds: ReadonlySet<string>;
  zoom: number; panX: number; panY: number; canUndo: boolean; canRedo: boolean;
  select: (ids: string[]) => void; deselectAll: () => void;
  autoLayout: () => void; undo: () => void; redo: () => void;
  setZoom: (z: number) => void; setPan: (px: number, py: number) => void;
  classNames: ClassNames<FlowChartSlot> | undefined;
  styles: Styles<FlowChartSlot> | undefined;
}

const FlowChartContext = createContext<FlowChartContextValue | null>(null);

function useFlowChartContext(): FlowChartContextValue {
  const ctx = useContext(FlowChartContext);
  if (!ctx) throw new Error('FlowChart compound sub-components must be used within <FlowChart>.');
  return ctx;
}

function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = Math.abs(x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

// ── Compound: Toolbar ──

export interface FlowChartToolbarProps { className?: string; }

const FlowChartToolbar = forwardRef<HTMLDivElement, FlowChartToolbarProps>(
  function FlowChartToolbar(props, ref) {
    const { className } = props;
    const ctx = useFlowChartContext();
    const slot = getSlotProps('toolbar', toolbarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="flow-chart-toolbar" role="toolbar">
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.undo()} disabled={!ctx.canUndo} aria-label="Undo" data-testid="flow-chart-btn-undo">Undo</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.redo()} disabled={!ctx.canRedo} aria-label="Redo" data-testid="flow-chart-btn-redo">Redo</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.autoLayout()} aria-label="Auto layout" data-testid="flow-chart-btn-layout">Layout</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.setZoom(ctx.zoom + 0.1)} aria-label="Zoom in" data-testid="flow-chart-btn-zoom-in">+</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.setZoom(ctx.zoom - 0.1)} aria-label="Zoom out" data-testid="flow-chart-btn-zoom-out">-</button>
      </div>
    );
  },
);

// ── Compound: Canvas ──

export interface FlowChartCanvasProps { className?: string; }

const FlowChartCanvas = forwardRef<HTMLDivElement, FlowChartCanvasProps>(
  function FlowChartCanvas(props, ref) {
    const { className } = props;
    const ctx = useFlowChartContext();
    const slot = getSlotProps('canvas', canvasStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const nSlot = getSlotProps('node', nodeStyle, ctx.classNames, ctx.styles);
    const eSlot = getSlotProps('edge', edgeStyle, ctx.classNames, ctx.styles);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="flow-chart-canvas" onClick={() => ctx.deselectAll()}>
        <svg className={svgLayerStyle} data-testid="flow-chart-svg">
          {ctx.edges.map((edge) => {
            const src = ctx.nodes.find((n) => n.id === edge.sourceId);
            const tgt = ctx.nodes.find((n) => n.id === edge.targetId);
            if (!src || !tgt) return null;
            const x1 = (src.x + src.width) * ctx.zoom + ctx.panX;
            const y1 = (src.y + src.height / 2) * ctx.zoom + ctx.panY;
            const x2 = tgt.x * ctx.zoom + ctx.panX;
            const y2 = (tgt.y + tgt.height / 2) * ctx.zoom + ctx.panY;
            return <path key={edge.id} d={bezierPath(x1, y1, x2, y2)} className={eSlot.className} style={eSlot.style} data-testid="flow-chart-edge" data-edge-id={edge.id} />;
          })}
        </svg>
        {ctx.nodes.map((node) => (
          <div key={node.id} className={nSlot.className} style={{ ...nSlot.style, left: node.x * ctx.zoom + ctx.panX, top: node.y * ctx.zoom + ctx.panY, width: node.width * ctx.zoom }} data-selected={ctx.selectedIds.has(node.id)} data-type={node.type} data-testid="flow-chart-node" data-node-id={node.id} onClick={(e) => { e.stopPropagation(); ctx.select([node.id]); }}>
            {node.type === 'decision' ? <span style={{ transform: 'rotate(-45deg)', display: 'block' }}>{node.label}</span> : node.label}
          </div>
        ))}
      </div>
    );
  },
);

// ── Compound: Minimap ──

export interface FlowChartMinimapProps { className?: string; }

const FlowChartMinimap = forwardRef<HTMLDivElement, FlowChartMinimapProps>(
  function FlowChartMinimap(props, ref) {
    const { className } = props;
    const ctx = useFlowChartContext();
    const slot = getSlotProps('minimap', minimapStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
    for (const n of ctx.nodes) { if (n.x < minX) minX = n.x; if (n.y < minY) minY = n.y; if (n.x + n.width > maxX) maxX = n.x + n.width; if (n.y + n.height > maxY) maxY = n.y + n.height; }
    const gw = Math.max(maxX - minX, 1); const gh = Math.max(maxY - minY, 1); const sc = Math.min(140 / gw, 90 / gh);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="flow-chart-minimap">
        <svg width="150" height="100" viewBox="0 0 150 100">
          {ctx.nodes.map((n) => <rect key={n.id} x={5 + (n.x - minX) * sc} y={5 + (n.y - minY) * sc} width={Math.max(n.width * sc, 2)} height={Math.max(n.height * sc, 2)} fill={ctx.selectedIds.has(n.id) ? 'var(--rel-color-primary, #3b82f6)' : 'var(--rel-color-border, #94a3b8)'} rx={1} />)}
        </svg>
      </div>
    );
  },
);

// ── Component Props ──

export interface FlowChartComponentProps extends SlotStyleProps<FlowChartSlot> {
  nodes?: FlowNode[]; edges?: FlowEdge[]; gridSize?: number; snapToGrid?: boolean;
  onChange?: (nodes: readonly FlowNode[], edges: readonly FlowEdge[]) => void;
  children?: ReactNode; className?: string; style?: React.CSSProperties;
}

const FlowChartBase = forwardRef<HTMLDivElement, FlowChartComponentProps>(
  function FlowChart(props, ref) {
    const { nodes: np, edges: ep, gridSize, snapToGrid, onChange, children, className, style: styleProp, classNames, styles } = props;
    const hookProps: UseFlowChartProps = { defaultNodes: np, defaultEdges: ep, gridSize, snapToGrid, onChange };
    const fc = useFlowChart(hookProps);
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: FlowChartContextValue = { nodes: fc.nodes, edges: fc.edges, selectedIds: fc.selectedIds, zoom: fc.zoom, panX: fc.panX, panY: fc.panY, canUndo: fc.canUndo, canRedo: fc.canRedo, select: fc.select, deselectAll: fc.deselectAll, autoLayout: fc.autoLayout, undo: fc.undo, redo: fc.redo, setZoom: fc.setZoom, setPan: fc.setPan, classNames, styles };

    if (children) {
      return <FlowChartContext.Provider value={ctxValue}><div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="flow-chart-root" role="application" aria-label="Flow chart">{children}</div></FlowChartContext.Provider>;
    }
    return <FlowChartContext.Provider value={ctxValue}><div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="flow-chart-root" role="application" aria-label="Flow chart"><FlowChartToolbar /><FlowChartCanvas /><FlowChartMinimap /></div></FlowChartContext.Provider>;
  },
);

export const FlowChart = Object.assign(FlowChartBase, { Toolbar: FlowChartToolbar, Canvas: FlowChartCanvas, Minimap: FlowChartMinimap });
