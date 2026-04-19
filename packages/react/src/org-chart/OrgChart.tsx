/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * OrgChart — organizasyon semasi bilesen (Dual API).
 * OrgChart — organization chart component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { OrgNode, OrgNodeLayout, OrgChartOrientation } from '@relteco/relui-core';
import { rootStyle, canvasStyle, toolbarStyle, toolbarButtonStyle, nodeStyle, nodeAvatarStyle, nodeNameStyle, nodeTitleStyle, edgeSvgStyle, edgePathStyle } from './org-chart.css';
import { useOrgChart, type UseOrgChartProps } from './useOrgChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type OrgChartSlot = 'root' | 'canvas' | 'toolbar' | 'node' | 'nodeAvatar' | 'nodeName' | 'nodeTitle' | 'edge';

interface OrgChartContextValue {
  nodes: readonly OrgNode[];
  layout: readonly OrgNodeLayout[];
  selectedNodeId: string | null;
  orientation: OrgChartOrientation;
  toggleCollapse: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  select: (id: string | null) => void;
  setOrientation: (o: OrgChartOrientation) => void;
  classNames: ClassNames<OrgChartSlot> | undefined;
  styles: Styles<OrgChartSlot> | undefined;
}

const OrgChartContext = createContext<OrgChartContextValue | null>(null);

function useOrgChartContext(): OrgChartContextValue {
  const ctx = useContext(OrgChartContext);
  if (!ctx) throw new Error('OrgChart compound sub-components must be used within <OrgChart>.');
  return ctx;
}

function RenderOrgNode(props: { node: OrgNode; layoutItem: OrgNodeLayout; ctx: OrgChartContextValue }) {
  const { node, layoutItem: li, ctx } = props;
  const nSlot = getSlotProps('node', nodeStyle, ctx.classNames, ctx.styles);
  const avSlot = getSlotProps('nodeAvatar', nodeAvatarStyle, ctx.classNames, ctx.styles);
  const nmSlot = getSlotProps('nodeName', nodeNameStyle, ctx.classNames, ctx.styles);
  const ttSlot = getSlotProps('nodeTitle', nodeTitleStyle, ctx.classNames, ctx.styles);

  return (
    <div className={nSlot.className} style={{ ...nSlot.style, left: li.x, top: li.y, width: li.width, height: li.height }} data-selected={ctx.selectedNodeId === node.id} data-testid="org-chart-node" data-node-id={node.id} onClick={(e) => { e.stopPropagation(); ctx.select(node.id); }} onDoubleClick={() => ctx.toggleCollapse(node.id)}>
      {node.avatar ? <img src={node.avatar} alt={node.name} className={avSlot.className} style={avSlot.style} data-testid="org-chart-node-avatar" /> : <div className={avSlot.className} style={avSlot.style} data-testid="org-chart-node-avatar" />}
      <div className={nmSlot.className} style={nmSlot.style} data-testid="org-chart-node-name">{node.name}</div>
      <div className={ttSlot.className} style={ttSlot.style} data-testid="org-chart-node-title">{node.title}</div>
      {node.collapsed && <span style={{ fontSize: 10 }} data-testid="org-chart-collapsed-indicator">+</span>}
    </div>
  );
}

function RenderEdges(props: { ctx: OrgChartContextValue }) {
  const { ctx } = props;
  const eSlot = getSlotProps('edge', edgePathStyle, ctx.classNames, ctx.styles);
  const layoutMap = new Map(ctx.layout.map((l) => [l.id, l]));

  return (
    <svg className={edgeSvgStyle} data-testid="org-chart-svg">
      {ctx.nodes.map((node) => {
        if (!node.parentId) return null;
        const parentLayout = layoutMap.get(node.parentId);
        const childLayout = layoutMap.get(node.id);
        if (!parentLayout || !childLayout) return null;
        const px = parentLayout.x + parentLayout.width / 2;
        const py = parentLayout.y + parentLayout.height;
        const cx = childLayout.x + childLayout.width / 2;
        const cy = childLayout.y;
        const my = (py + cy) / 2;
        return <path key={node.id} d={`M ${px} ${py} L ${px} ${my} L ${cx} ${my} L ${cx} ${cy}`} className={eSlot.className} style={eSlot.style} data-testid="org-chart-edge" />;
      })}
    </svg>
  );
}

// ── Compound: Toolbar ──

export interface OrgChartToolbarProps { className?: string; }

const OrgChartToolbar = forwardRef<HTMLDivElement, OrgChartToolbarProps>(
  function OrgChartToolbar(props, ref) {
    const { className } = props;
    const ctx = useOrgChartContext();
    const slot = getSlotProps('toolbar', toolbarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="org-chart-toolbar" role="toolbar">
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.expandAll()} aria-label="Expand all" data-testid="org-chart-btn-expand">Expand</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.collapseAll()} aria-label="Collapse all" data-testid="org-chart-btn-collapse">Collapse</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.setOrientation(ctx.orientation === 'vertical' ? 'horizontal' : 'vertical')} aria-label="Toggle orientation" data-testid="org-chart-btn-orientation">{ctx.orientation === 'vertical' ? 'H' : 'V'}</button>
      </div>
    );
  },
);

// ── Compound: Canvas ──

export interface OrgChartCanvasProps { className?: string; }

const OrgChartCanvas = forwardRef<HTMLDivElement, OrgChartCanvasProps>(
  function OrgChartCanvas(props, ref) {
    const { className } = props;
    const ctx = useOrgChartContext();
    const slot = getSlotProps('canvas', canvasStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const layoutMap = new Map(ctx.layout.map((l) => [l.id, l]));

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="org-chart-canvas" onClick={() => ctx.select(null)}>
        <RenderEdges ctx={ctx} />
        {ctx.nodes.map((node) => {
          const li = layoutMap.get(node.id);
          if (!li) return null;
          return <RenderOrgNode key={node.id} node={node} layoutItem={li} ctx={ctx} />;
        })}
      </div>
    );
  },
);

// ── Component Props ──

export interface OrgChartComponentProps extends SlotStyleProps<OrgChartSlot> {
  nodes?: OrgNode[];
  defaultOrientation?: OrgChartOrientation;
  nodeWidth?: number; nodeHeight?: number; horizontalGap?: number; verticalGap?: number;
  onChange?: (nodes: readonly OrgNode[]) => void;
  children?: ReactNode;
  className?: string; style?: React.CSSProperties;
}

const OrgChartBase = forwardRef<HTMLDivElement, OrgChartComponentProps>(
  function OrgChart(props, ref) {
    const { nodes: nodesProp, defaultOrientation, nodeWidth, nodeHeight, horizontalGap, verticalGap, onChange, children, className, style: styleProp, classNames, styles } = props;
    const hookProps: UseOrgChartProps = { defaultNodes: nodesProp, defaultOrientation, nodeWidth, nodeHeight, horizontalGap, verticalGap, onChange };
    const oc = useOrgChart(hookProps);
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: OrgChartContextValue = { nodes: oc.nodes, layout: oc.layout, selectedNodeId: oc.selectedNodeId, orientation: oc.orientation, toggleCollapse: oc.toggleCollapse, expandAll: oc.expandAll, collapseAll: oc.collapseAll, select: oc.select, setOrientation: oc.setOrientation, classNames, styles };

    if (children) {
      return <OrgChartContext.Provider value={ctxValue}><div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="org-chart-root" role="application" aria-label="Organization chart">{children}</div></OrgChartContext.Provider>;
    }
    return <OrgChartContext.Provider value={ctxValue}><div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="org-chart-root" role="application" aria-label="Organization chart"><OrgChartToolbar /><OrgChartCanvas /></div></OrgChartContext.Provider>;
  },
);

export const OrgChart = Object.assign(OrgChartBase, { Toolbar: OrgChartToolbar, Canvas: OrgChartCanvas });
