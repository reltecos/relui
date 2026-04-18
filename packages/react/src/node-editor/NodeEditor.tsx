/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NodeEditor — node tabanli gorsel editor bilesen (Dual API).
 * NodeEditor — node-based visual editor component (Dual API).
 *
 * Props-based: `<NodeEditor nodes={[...]} edges={[...]} onChange={fn} />`
 * Compound:
 * ```tsx
 * <NodeEditor nodes={nodes} edges={edges}>
 *   <NodeEditor.Toolbar />
 *   <NodeEditor.Canvas />
 *   <NodeEditor.Minimap />
 * </NodeEditor>
 * ```
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { GraphNode, GraphEdge, GraphGroup } from '@relteco/relui-core';
import {
  rootStyle,
  canvasStyle,
  svgLayerStyle,
  nodeLayerStyle,
  toolbarStyle,
  toolbarButtonStyle,
  nodeStyle,
  nodeHeaderStyle,
  nodeBodyStyle,
  portStyle,
  portDotStyle,
  edgeStyle,
  groupStyle,
  groupLabelStyle,
  minimapStyle,
} from './node-editor.css';
import { useNodeEditor, type UseNodeEditorProps } from './useNodeEditor';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type NodeEditorSlot =
  | 'root'
  | 'canvas'
  | 'node'
  | 'nodeHeader'
  | 'nodeBody'
  | 'port'
  | 'edge'
  | 'group'
  | 'minimap'
  | 'toolbar';

// ── Context ──────���──────────────────────────────────

interface NodeEditorContextValue {
  nodes: readonly GraphNode[];
  edges: readonly GraphEdge[];
  groups: readonly GraphGroup[];
  selectedIds: ReadonlySet<string>;
  zoom: number;
  panX: number;
  panY: number;
  canUndo: boolean;
  canRedo: boolean;
  deleteNode: (id: string) => void;
  moveNode: (id: string, x: number, y: number) => void;
  toggleCollapse: (id: string) => void;
  disconnect: (id: string) => void;
  select: (ids: string[]) => void;
  deselectAll: () => void;
  setZoom: (z: number) => void;
  setPan: (px: number, py: number) => void;
  undo: () => void;
  redo: () => void;
  classNames: ClassNames<NodeEditorSlot> | undefined;
  styles: Styles<NodeEditorSlot> | undefined;
}

const NodeEditorContext = createContext<NodeEditorContextValue | null>(null);

function useNodeEditorContext(): NodeEditorContextValue {
  const ctx = useContext(NodeEditorContext);
  if (!ctx) throw new Error('NodeEditor compound sub-components must be used within <NodeEditor>.');
  return ctx;
}

// ── Internal: Bezier edge path ──────────────────────

function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = Math.abs(x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

// ── Internal: Render node ───────────────────────────

function RenderNode(props: {
  node: GraphNode;
  selected: boolean;
  ctx: NodeEditorContextValue;
}) {
  const { node, selected, ctx } = props;
  const nSlot = getSlotProps('node', nodeStyle, ctx.classNames, ctx.styles);
  const hSlot = getSlotProps('nodeHeader', nodeHeaderStyle, ctx.classNames, ctx.styles);
  const bSlot = getSlotProps('nodeBody', nodeBodyStyle, ctx.classNames, ctx.styles);
  const pSlot = getSlotProps('port', portStyle, ctx.classNames, ctx.styles);

  return (
    <div
      className={nSlot.className}
      style={{
        ...nSlot.style,
        left: node.x * ctx.zoom + ctx.panX,
        top: node.y * ctx.zoom + ctx.panY,
        width: node.width * ctx.zoom,
        transform: `scale(${ctx.zoom})`,
        transformOrigin: 'top left',
      }}
      data-selected={selected}
      data-testid="node-editor-node"
      data-node-id={node.id}
      onClick={(e) => {
        e.stopPropagation();
        ctx.select([node.id]);
      }}
    >
      <div className={hSlot.className} style={hSlot.style} data-testid="node-editor-node-header">
        {node.label}
      </div>
      {!node.collapsed && (
        <div className={bSlot.className} style={bSlot.style} data-testid="node-editor-node-body">
          {node.ports.map((port) => (
            <div
              key={port.id}
              className={pSlot.className}
              style={{
                ...pSlot.style,
                flexDirection: port.direction === 'output' ? 'row-reverse' : 'row',
              }}
              data-testid="node-editor-port"
              data-port-id={port.id}
              data-direction={port.direction}
            >
              <span
                className={portDotStyle}
                style={{ backgroundColor: getPortColor(port.dataType) }}
              />
              <span>{port.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getPortColor(dataType: string): string {
  switch (dataType) {
    case 'number': return 'var(--rel-color-primary, #3b82f6)';
    case 'string': return 'var(--rel-color-success, #10b981)';
    case 'boolean': return 'var(--rel-color-warning, #f59e0b)';
    default: return 'var(--rel-color-text-secondary, #6b7280)';
  }
}

// ── Internal: Render edges ──────────────────────────

function RenderEdges(props: { ctx: NodeEditorContextValue }) {
  const { ctx } = props;
  const eSlot = getSlotProps('edge', edgeStyle, ctx.classNames, ctx.styles);

  return (
    <svg className={svgLayerStyle} data-testid="node-editor-svg">
      {ctx.edges.map((edge) => {
        const srcNode = ctx.nodes.find((n) => n.id === edge.sourceNodeId);
        const tgtNode = ctx.nodes.find((n) => n.id === edge.targetNodeId);
        if (!srcNode || !tgtNode) return null;

        const x1 = (srcNode.x + srcNode.width) * ctx.zoom + ctx.panX;
        const y1 = (srcNode.y + srcNode.height / 2) * ctx.zoom + ctx.panY;
        const x2 = tgtNode.x * ctx.zoom + ctx.panX;
        const y2 = (tgtNode.y + tgtNode.height / 2) * ctx.zoom + ctx.panY;

        return (
          <path
            key={edge.id}
            d={bezierPath(x1, y1, x2, y2)}
            className={eSlot.className}
            style={eSlot.style}
            data-testid="node-editor-edge"
            data-edge-id={edge.id}
          />
        );
      })}
    </svg>
  );
}

// ── Compound: NodeEditor.Toolbar ────────────────────

export interface NodeEditorToolbarProps {
  className?: string;
}

const NodeEditorToolbar = forwardRef<HTMLDivElement, NodeEditorToolbarProps>(
  function NodeEditorToolbar(props, ref) {
    const { className } = props;
    const ctx = useNodeEditorContext();
    const slot = getSlotProps('toolbar', toolbarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="node-editor-toolbar" role="toolbar">
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.undo()} disabled={!ctx.canUndo} aria-label="Undo" data-testid="node-editor-btn-undo">Undo</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.redo()} disabled={!ctx.canRedo} aria-label="Redo" data-testid="node-editor-btn-redo">Redo</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.setZoom(ctx.zoom + 0.1)} aria-label="Zoom in" data-testid="node-editor-btn-zoom-in">+</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.setZoom(ctx.zoom - 0.1)} aria-label="Zoom out" data-testid="node-editor-btn-zoom-out">-</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => { ctx.setZoom(1); ctx.setPan(0, 0); }} aria-label="Reset view" data-testid="node-editor-btn-reset">Reset</button>
      </div>
    );
  },
);

// ── Compound: NodeEditor.Canvas ─────────────────────

export interface NodeEditorCanvasProps {
  className?: string;
}

const NodeEditorCanvas = forwardRef<HTMLDivElement, NodeEditorCanvasProps>(
  function NodeEditorCanvas(props, ref) {
    const { className } = props;
    const ctx = useNodeEditorContext();
    const slot = getSlotProps('canvas', canvasStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="node-editor-canvas"
        onClick={() => ctx.deselectAll()}
      >
        {/* Groups */}
        {ctx.groups.map((g) => {
          const gSlot = getSlotProps('group', groupStyle, ctx.classNames, ctx.styles);
          return (
            <div
              key={g.id}
              className={gSlot.className}
              style={{
                ...gSlot.style,
                left: g.x * ctx.zoom + ctx.panX,
                top: g.y * ctx.zoom + ctx.panY,
                width: g.width * ctx.zoom,
                height: g.height * ctx.zoom,
              }}
              data-testid="node-editor-group"
            >
              <span className={groupLabelStyle}>{g.label}</span>
            </div>
          );
        })}

        {/* Edges (SVG) */}
        <RenderEdges ctx={ctx} />

        {/* Nodes (HTML) */}
        <div className={nodeLayerStyle}>
          {ctx.nodes.map((node) => (
            <RenderNode
              key={node.id}
              node={node}
              selected={ctx.selectedIds.has(node.id)}
              ctx={ctx}
            />
          ))}
        </div>
      </div>
    );
  },
);

// ── Compound: NodeEditor.Minimap ────────────────────

export interface NodeEditorMinimapProps {
  className?: string;
}

const NodeEditorMinimap = forwardRef<HTMLDivElement, NodeEditorMinimapProps>(
  function NodeEditorMinimap(props, ref) {
    const { className } = props;
    const ctx = useNodeEditorContext();
    const slot = getSlotProps('minimap', minimapStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    // Calculate bounds
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const n of ctx.nodes) {
      if (n.x < minX) minX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.x + n.width > maxX) maxX = n.x + n.width;
      if (n.y + n.height > maxY) maxY = n.y + n.height;
    }
    const graphW = Math.max(maxX - minX, 1);
    const graphH = Math.max(maxY - minY, 1);
    const scale = Math.min(140 / graphW, 90 / graphH);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="node-editor-minimap">
        <svg width="150" height="100" viewBox="0 0 150 100">
          {ctx.nodes.map((n) => (
            <rect
              key={n.id}
              x={5 + (n.x - minX) * scale}
              y={5 + (n.y - minY) * scale}
              width={Math.max(n.width * scale, 2)}
              height={Math.max(n.height * scale, 2)}
              fill={ctx.selectedIds.has(n.id) ? 'var(--rel-color-primary, #3b82f6)' : 'var(--rel-color-border, #94a3b8)'}
              rx={1}
            />
          ))}
        </svg>
      </div>
    );
  },
);

// ── Compound: NodeEditor.Node (standalone) ──────────

export interface NodeEditorNodeProps {
  /** Node verisi / Node data */
  node: GraphNode;
  /** Ek className / Additional className */
  className?: string;
}

const NodeEditorNode = forwardRef<HTMLDivElement, NodeEditorNodeProps>(
  function NodeEditorNode(props, ref) {
    const { node, className } = props;
    const ctx = useNodeEditorContext();
    const nSlot = getSlotProps('node', nodeStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${nSlot.className} ${className}` : nSlot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={nSlot.style}
        data-testid="node-editor-node"
        data-node-id={node.id}
      >
        <div className={nodeHeaderStyle} data-testid="node-editor-node-header">{node.label}</div>
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface NodeEditorComponentProps extends SlotStyleProps<NodeEditorSlot> {
  /** Dugumler / Nodes */
  nodes?: GraphNode[];
  /** Baglantilar / Edges */
  edges?: GraphEdge[];
  /** Gruplar / Groups */
  groups?: GraphGroup[];
  /** Grid boyutu / Grid size */
  gridSize?: number;
  /** Snap to grid / Snap to grid */
  snapToGrid?: boolean;
  /** Degisince callback / On change */
  onChange?: (nodes: readonly GraphNode[], edges: readonly GraphEdge[]) => void;
  /** Compound children / Compound children */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const NodeEditorBase = forwardRef<HTMLDivElement, NodeEditorComponentProps>(
  function NodeEditor(props, ref) {
    const {
      nodes: nodesProp,
      edges: edgesProp,
      groups: groupsProp,
      gridSize,
      snapToGrid,
      onChange,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseNodeEditorProps = {
      defaultNodes: nodesProp,
      defaultEdges: edgesProp,
      defaultGroups: groupsProp,
      gridSize,
      snapToGrid,
      onChange,
    };
    const editor = useNodeEditor(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: NodeEditorContextValue = {
      nodes: editor.nodes,
      edges: editor.edges,
      groups: editor.groups,
      selectedIds: editor.selectedIds,
      zoom: editor.zoom,
      panX: editor.panX,
      panY: editor.panY,
      canUndo: editor.canUndo,
      canRedo: editor.canRedo,
      deleteNode: editor.deleteNode,
      moveNode: editor.moveNode,
      toggleCollapse: editor.toggleCollapse,
      disconnect: editor.disconnect,
      select: editor.select,
      deselectAll: editor.deselectAll,
      setZoom: editor.setZoom,
      setPan: editor.setPan,
      undo: editor.undo,
      redo: editor.redo,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <NodeEditorContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="node-editor-root"
            role="application"
            aria-label="Node editor"
          >
            {children}
          </div>
        </NodeEditorContext.Provider>
      );
    }

    // ── Props-based API ──
    return (
      <NodeEditorContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="node-editor-root"
          role="application"
          aria-label="Node editor"
        >
          <NodeEditorToolbar />
          <NodeEditorCanvas />
          <NodeEditorMinimap />
        </div>
      </NodeEditorContext.Provider>
    );
  },
);

export const NodeEditor = Object.assign(NodeEditorBase, {
  Toolbar: NodeEditorToolbar,
  Canvas: NodeEditorCanvas,
  Minimap: NodeEditorMinimap,
  Node: NodeEditorNode,
});
