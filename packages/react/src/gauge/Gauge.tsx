/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Gauge — radial gosterge bilesen (Dual API).
 * Gauge — radial gauge component (Dual API).
 *
 * Props-based: `<Gauge value={75} min={0} max={100} />`
 * Compound:    `<Gauge value={75}><Gauge.Arc /><Gauge.Needle /><Gauge.Value /></Gauge>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { GaugeArcData } from '@relteco/relui-core';
import { polarToCartesian } from '@relteco/relui-core';
import {
  rootStyle, svgStyle, arcStyle, bgArcStyle, needleStyle, valueStyle, labelStyle,
} from './gauge.css';
import { useGauge, type UseGaugeProps } from './useGauge';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type GaugeSlot = 'root' | 'arc' | 'needle' | 'value' | 'label';

// ── Context ──────────────────────────────────────────

interface GaugeContextValue {
  value: number;
  min: number;
  max: number;
  normalizedValue: number;
  needleAngle: number;
  arcs: readonly GaugeArcData[];
  backgroundArc: string;
  classNames: ClassNames<GaugeSlot> | undefined;
  styles: Styles<GaugeSlot> | undefined;
}

const GaugeContext = createContext<GaugeContextValue | null>(null);

function useGaugeContext(): GaugeContextValue {
  const ctx = useContext(GaugeContext);
  if (!ctx) throw new Error('Gauge compound sub-components must be used within <Gauge>.');
  return ctx;
}

// ── Sub: Gauge.Arc ──

export interface GaugeArcProps { className?: string; }

const GaugeArc = forwardRef<SVGGElement, GaugeArcProps>(
  function GaugeArc(props, ref) {
    const { className } = props;
    const ctx = useGaugeContext();
    const slot = getSlotProps('arc', arcStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const bgSlot = getSlotProps('arc', bgArcStyle, ctx.classNames, ctx.styles);

    return (
      <g ref={ref} data-testid="gauge-arc">
        <path d={ctx.backgroundArc} className={bgSlot.className} style={{ ...bgSlot.style, stroke: 'var(--rel-color-bg-muted, #e5e7eb)' }} />
        {ctx.arcs.map((a, i) => (
          <path key={i} d={a.path} className={cls} style={{ ...slot.style, stroke: a.color }} />
        ))}
      </g>
    );
  },
);

// ── Sub: Gauge.Needle ──

export interface GaugeNeedleProps { className?: string; }

const GaugeNeedle = forwardRef<SVGLineElement, GaugeNeedleProps>(
  function GaugeNeedle(props, ref) {
    const { className } = props;
    const ctx = useGaugeContext();
    const slot = getSlotProps('needle', needleStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const tip = polarToCartesian(50, 50, 32, ctx.needleAngle + 90);

    return (
      <line
        ref={ref}
        x1={50} y1={50} x2={tip.x} y2={tip.y}
        className={cls}
        style={{ ...slot.style, stroke: 'var(--rel-color-text, #374151)' }}
        data-testid="gauge-needle"
      />
    );
  },
);

// ── Sub: Gauge.Value ──

export interface GaugeValueProps { children?: ReactNode; className?: string; }

const GaugeValue = forwardRef<SVGTextElement, GaugeValueProps>(
  function GaugeValue(props, ref) {
    const { children, className } = props;
    const ctx = useGaugeContext();
    const slot = getSlotProps('value', valueStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <text ref={ref} x={50} y={55} className={cls} style={slot.style} data-testid="gauge-value">
        {children ?? Math.round(ctx.value)}
      </text>
    );
  },
);

// ── Sub: Gauge.Label ──

export interface GaugeLabelProps { children: ReactNode; className?: string; }

const GaugeLabel = forwardRef<SVGTextElement, GaugeLabelProps>(
  function GaugeLabel(props, ref) {
    const { children, className } = props;
    const ctx = useGaugeContext();
    const slot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <text ref={ref} x={50} y={70} className={cls} style={slot.style} data-testid="gauge-label">
        {children}
      </text>
    );
  },
);

// ── Props ────────────────────────────────────────────

export interface GaugeComponentProps extends SlotStyleProps<GaugeSlot>, UseGaugeProps {
  /** Etiket / Label */
  label?: ReactNode;
  /** Boyut / Size */
  size?: number;
  /** Compound */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

const GaugeBase = forwardRef<HTMLDivElement, GaugeComponentProps>(
  function Gauge(props, ref) {
    const {
      value: valueProp, min, max, startAngle, endAngle, segments, onChange, label,
      size = 160, children, className, style: styleProp, classNames, styles,
    } = props;

    const gauge = useGauge({ value: valueProp, min, max, startAngle, endAngle, segments, onChange });

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: GaugeContextValue = {
      value: gauge.value, min: gauge.min, max: gauge.max,
      normalizedValue: gauge.normalizedValue, needleAngle: gauge.needleAngle,
      arcs: gauge.arcs, backgroundArc: gauge.backgroundArc,
      classNames, styles,
    };

    if (children) {
      return (
        <GaugeContext.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="gauge-root">
            <svg className={svgStyle} viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Gauge">
              {children}
            </svg>
          </div>
        </GaugeContext.Provider>
      );
    }

    const tip = polarToCartesian(50, 50, 32, gauge.needleAngle + 90);
    const ndSlot = getSlotProps('needle', needleStyle, classNames, styles);
    const vlSlot = getSlotProps('value', valueStyle, classNames, styles);
    const lbSlot = getSlotProps('label', labelStyle, classNames, styles);
    const arSlot = getSlotProps('arc', arcStyle, classNames, styles);

    return (
      <GaugeContext.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="gauge-root">
          <svg className={svgStyle} viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Gauge">
            <path d={gauge.backgroundArc} className={bgArcStyle} style={{ stroke: 'var(--rel-color-bg-muted, #e5e7eb)' }} />
            {gauge.arcs.map((a, i) => (
              <path key={i} d={a.path} className={arSlot.className} style={{ ...arSlot.style, stroke: a.color }} data-testid="gauge-arc" />
            ))}
            <circle cx={50} cy={50} r={3} fill="var(--rel-color-text, #374151)" />
            <line
              x1={50} y1={50} x2={tip.x} y2={tip.y}
              className={ndSlot.className} style={{ ...ndSlot.style, stroke: 'var(--rel-color-text, #374151)' }}
              data-testid="gauge-needle"
            />
            <text x={50} y={55} className={vlSlot.className} style={vlSlot.style} data-testid="gauge-value">
              {Math.round(gauge.value)}
            </text>
            {label && (
              <text x={50} y={70} className={lbSlot.className} style={lbSlot.style} data-testid="gauge-label">
                {label}
              </text>
            )}
          </svg>
        </div>
      </GaugeContext.Provider>
    );
  },
);

/**
 * Gauge bilesen — Dual API (props-based + compound).
 */
export const Gauge = Object.assign(GaugeBase, {
  Arc: GaugeArc,
  Needle: GaugeNeedle,
  Value: GaugeValue,
  Label: GaugeLabel,
});
