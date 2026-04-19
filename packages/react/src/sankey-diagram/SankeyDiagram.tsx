/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SankeyDiagram — sankey akis diyagrami bilesen (Dual API).
 * SankeyDiagram — sankey flow diagram component (Dual API).
 *
 * Props-based: `<SankeyDiagram nodes={nodes} links={links} />`
 * Compound:    `<SankeyDiagram nodes={nodes} links={links}><SankeyDiagram.Node /><SankeyDiagram.Link /></SankeyDiagram>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { SankeyContext } from '@relteco/relui-core';
import {
  rootStyle, nodeStyle, linkStyle, labelStyle,
  legendStyle, legendItemStyle, legendDotStyle,
} from './sankey-diagram.css';
import { useSankeyDiagram, type UseSankeyDiagramProps } from './useSankeyDiagram';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──

export type SankeyDiagramSlot = 'root' | 'node' | 'link' | 'label' | 'legend';

// ── Context ──

interface SankeyDiagramCtxValue extends SankeyContext {
  width: number;
  height: number;
  classNames: ClassNames<SankeyDiagramSlot> | undefined;
  styles: Styles<SankeyDiagramSlot> | undefined;
}

const SankeyDiagramCtx = createContext<SankeyDiagramCtxValue | null>(null);

function useSankeyDiagramCtx(): SankeyDiagramCtxValue {
  const c = useContext(SankeyDiagramCtx);
  if (!c) throw new Error('SankeyDiagram compound sub-components must be used within <SankeyDiagram>.');
  return c;
}

// ── Sub: Node ──

export interface SankeyDiagramNodeProps { className?: string; }

export const SankeyDiagramNode = forwardRef<SVGGElement, SankeyDiagramNodeProps>(
  function SankeyDiagramNode(props, ref) {
    const { className } = props;
    const ctx = useSankeyDiagramCtx();
    const slot = getSlotProps('node', nodeStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="sankey-diagram-node">
        {ctx.nodes.map((n, i) => (
          <rect
            key={i}
            x={n.x}
            y={n.y}
            width={n.width}
            height={n.height}
            fill={n.color}
            className={cls}
            style={slot.style}
            data-testid="sankey-diagram-node-rect"
          />
        ))}
      </g>
    );
  },
);

// ── Sub: Link ──

export interface SankeyDiagramLinkProps { className?: string; }

export const SankeyDiagramLink = forwardRef<SVGGElement, SankeyDiagramLinkProps>(
  function SankeyDiagramLink(props, ref) {
    const { className } = props;
    const ctx = useSankeyDiagramCtx();
    const slot = getSlotProps('link', linkStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="sankey-diagram-link">
        {ctx.links.map((l, i) => (
          <path
            key={i}
            d={l.path}
            stroke={l.color}
            strokeWidth={Math.max(1, l.width)}
            className={cls}
            style={slot.style}
            data-testid="sankey-diagram-link-path"
          />
        ))}
      </g>
    );
  },
);

// ── Sub: Label ──

export interface SankeyDiagramLabelProps { className?: string; }

export const SankeyDiagramLabel = forwardRef<SVGGElement, SankeyDiagramLabelProps>(
  function SankeyDiagramLabel(props, ref) {
    const { className } = props;
    const ctx = useSankeyDiagramCtx();
    const slot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <g ref={ref} data-testid="sankey-diagram-label">
        {ctx.nodes.map((n, i) => (
          <text
            key={i}
            x={n.x + n.width + 4}
            y={n.y + n.height / 2}
            className={cls}
            style={slot.style}
            data-testid="sankey-diagram-label-text"
          >
            {n.name}
          </text>
        ))}
      </g>
    );
  },
);

// ── Sub: Legend ──

export interface SankeyDiagramLegendProps { className?: string; }

export const SankeyDiagramLegend = forwardRef<HTMLDivElement, SankeyDiagramLegendProps>(
  function SankeyDiagramLegend(props, ref) {
    const { className } = props;
    const ctx = useSankeyDiagramCtx();
    const slot = getSlotProps('legend', legendStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="sankey-diagram-legend">
        {ctx.nodes.map((n, i) => (
          <span key={i} className={legendItemStyle}>
            <span className={legendDotStyle} style={{ backgroundColor: n.color }} />
            {n.name}: {n.value}
          </span>
        ))}
      </div>
    );
  },
);

// ── Props ──

export interface SankeyDiagramComponentProps extends SlotStyleProps<SankeyDiagramSlot>, UseSankeyDiagramProps {
  showLabels?: boolean;
  showLegend?: boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ──

export const SankeyDiagramBase = forwardRef<HTMLDivElement, SankeyDiagramComponentProps>(
  function SankeyDiagram(props, ref) {
    const {
      nodes: nodesProp, links: linksProp,
      width = 500, height = 300, nodeWidth, nodePadding,
      showLabels = true, showLegend = true,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const chart = useSankeyDiagram({ nodes: nodesProp, links: linksProp, width, height, nodeWidth, nodePadding });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: SankeyDiagramCtxValue = { ...chart, width, height, classNames, styles };

    if (children) {
      return (
        <SankeyDiagramCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="sankey-diagram-root">
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Sankey diagram">{children}</svg>
          </div>
        </SankeyDiagramCtx.Provider>
      );
    }

    const nSlot = getSlotProps('node', nodeStyle, classNames, styles);
    const lkSlot = getSlotProps('link', linkStyle, classNames, styles);
    const lbSlot = getSlotProps('label', labelStyle, classNames, styles);

    return (
      <SankeyDiagramCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="sankey-diagram-root">
          <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Sankey diagram">
            {/* Links first (behind nodes) */}
            {chart.links.map((l, i) => (
              <path
                key={`link-${i}`}
                d={l.path}
                stroke={l.color}
                strokeWidth={Math.max(1, l.width)}
                className={lkSlot.className}
                style={lkSlot.style}
                data-testid="sankey-diagram-link-path"
              />
            ))}
            {/* Nodes */}
            {chart.nodes.map((n, i) => (
              <g key={`node-${i}`}>
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.width}
                  height={n.height}
                  fill={n.color}
                  className={nSlot.className}
                  style={nSlot.style}
                  data-testid="sankey-diagram-node-rect"
                />
                {showLabels && (
                  <text
                    x={n.x + n.width + 4}
                    y={n.y + n.height / 2}
                    className={lbSlot.className}
                    style={lbSlot.style}
                    data-testid="sankey-diagram-label-text"
                  >
                    {n.name}
                  </text>
                )}
              </g>
            ))}
          </svg>
          {showLegend && <SankeyDiagramLegend />}
        </div>
      </SankeyDiagramCtx.Provider>
    );
  },
);

/**
 * SankeyDiagram bilesen — Dual API (props-based + compound).
 */
export const SankeyDiagram = Object.assign(SankeyDiagramBase, {
  Node: SankeyDiagramNode,
  Link: SankeyDiagramLink,
  Label: SankeyDiagramLabel,
  Legend: SankeyDiagramLegend,
});
