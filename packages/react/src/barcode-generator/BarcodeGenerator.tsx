/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BarcodeGenerator — barkod uretici bilesen (Dual API).
 * BarcodeGenerator — barcode generator component (Dual API).
 *
 * Props-based: `<BarcodeGenerator value="123456" format="code128" />`
 * Compound:    `<BarcodeGenerator value="123456"><BarcodeGenerator.Svg /><BarcodeGenerator.Value /></BarcodeGenerator>`
 *
 * @packageDocumentation
 */

import { forwardRef, useMemo, type ReactNode } from 'react';
import { encodeBarcode, type BarcodeFormat } from '@relteco/relui-core';
import { rootStyle, svgStyle, labelStyle, valueStyle, errorStyle } from './barcode-generator.css';
import { BarcodeCtx, useBarcodeContext } from './barcode-context';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type BarcodeGeneratorSlot = 'root' | 'svg' | 'label' | 'value';

// ── Sub: BarcodeGenerator.Svg ───────────────────────

export interface BarcodeGeneratorSvgProps { className?: string; }

export const BarcodeGeneratorSvg = forwardRef<SVGSVGElement, BarcodeGeneratorSvgProps>(
  function BarcodeGeneratorSvg(props, ref) {
    const { className } = props;
    const ctx = useBarcodeContext();
    const slot = getSlotProps('svg', svgStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    if (!ctx.result.valid) return null;

    const barWidth = ctx.width / ctx.result.bars.length;
    return (
      <svg ref={ref} className={cls} style={slot.style} width={ctx.width} height={ctx.height} viewBox={`0 0 ${ctx.width} ${ctx.height}`} data-testid="barcode-svg" role="img" aria-label={`Barcode: ${ctx.result.text}`}>
        <rect width={ctx.width} height={ctx.height} fill={ctx.bgColor} />
        {ctx.result.bars.map((bar, i) => bar ? (
          <rect key={i} x={i * barWidth} y={0} width={barWidth} height={ctx.height} fill={ctx.barColor} />
        ) : null)}
      </svg>
    );
  },
);

// ── Sub: BarcodeGenerator.Label ──────────────────────

export interface BarcodeGeneratorLabelProps { children?: ReactNode; className?: string; }

export const BarcodeGeneratorLabel = forwardRef<HTMLSpanElement, BarcodeGeneratorLabelProps>(
  function BarcodeGeneratorLabel(props, ref) {
    const { children, className } = props;
    const ctx = useBarcodeContext();
    const slot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <span ref={ref} className={cls} style={slot.style} data-testid="barcode-label">{children}</span>;
  },
);

// ── Sub: BarcodeGenerator.Value ─────────────────────

export interface BarcodeGeneratorValueProps { className?: string; }

export const BarcodeGeneratorValue = forwardRef<HTMLSpanElement, BarcodeGeneratorValueProps>(
  function BarcodeGeneratorValue(props, ref) {
    const { className } = props;
    const ctx = useBarcodeContext();
    const slot = getSlotProps('value', valueStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <span ref={ref} className={cls} style={slot.style} data-testid="barcode-value">{ctx.result.text}</span>;
  },
);

// ── Component Props ──────────────────────────────────

export interface BarcodeGeneratorComponentProps extends SlotStyleProps<BarcodeGeneratorSlot> {
  /** Barkod degeri / Barcode value */
  value: string;
  /** Barkod formati / Barcode format */
  format?: BarcodeFormat;
  /** SVG genisligi / SVG width */
  width?: number;
  /** SVG yuksekligi / SVG height */
  height?: number;
  /** Degeri goster / Show value below barcode */
  showValue?: boolean;
  /** Etiket / Label text above barcode */
  label?: ReactNode;
  /** Bar rengi (CSS degiskeni) / Bar color */
  barColor?: string;
  /** Arka plan rengi (CSS degiskeni) / Background color */
  bgColor?: string;
  /** Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const BarcodeGeneratorBase = forwardRef<HTMLDivElement, BarcodeGeneratorComponentProps>(
  function BarcodeGenerator(props, ref) {
    const {
      value, format = 'code128', width = 200, height = 80,
      showValue = true, label, barColor = 'var(--rel-color-text, #000)', bgColor = 'var(--rel-color-bg, #fff)',
      children, className, style: styleProp, classNames, styles,
    } = props;

    const result = useMemo(() => encodeBarcode(value, format), [value, format]);
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue = { result, width, height, barColor, bgColor, classNames, styles };

    if (children) {
      return (
        <BarcodeCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="barcode-root" data-format={format}>
            {children}
          </div>
        </BarcodeCtx.Provider>
      );
    }

    if (!result.valid) {
      return (
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="barcode-root" data-format={format}>
          <span className={errorStyle} data-testid="barcode-error">Gecersiz barkod degeri</span>
        </div>
      );
    }

    const labelSlot = getSlotProps('label', labelStyle, classNames, styles);
    const valueSlot = getSlotProps('value', valueStyle, classNames, styles);

    return (
      <BarcodeCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="barcode-root" data-format={format}>
          {label !== undefined && <span className={labelSlot.className} style={labelSlot.style} data-testid="barcode-label">{label}</span>}
          <BarcodeGeneratorSvg />
          {showValue && <span className={valueSlot.className} style={valueSlot.style} data-testid="barcode-value">{result.text}</span>}
        </div>
      </BarcodeCtx.Provider>
    );
  },
);

/**
 * BarcodeGenerator bilesen — Dual API (props-based + compound).
 */
export const BarcodeGenerator = Object.assign(BarcodeGeneratorBase, {
  Svg: BarcodeGeneratorSvg,
  Label: BarcodeGeneratorLabel,
  Value: BarcodeGeneratorValue,
});
