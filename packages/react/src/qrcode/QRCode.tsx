/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * QRCode — QR kod uretici bilesen (Dual API).
 * QRCode — QR code generator component (Dual API).
 *
 * Props-based: `<QRCode value="https://relteco.com" size="md" label="Tara" />`
 * Compound:    `<QRCode value="..."><QRCode.Svg /><QRCode.Label>Tara</QRCode.Label></QRCode>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useMemo, type ReactNode } from 'react';
import { generateQRCode } from '@relteco/relui-core';
import type { ErrorCorrectionLevel, QRMatrix } from '@relteco/relui-core';
import {
  rootStyle,
  sizeStyles,
  svgStyle,
  svgSizeStyles,
  labelStyle,
} from './qrcode.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** QRCode slot isimleri / QRCode slot names. */
export type QRCodeSlot = 'root' | 'svg' | 'label';

// ── Types ─────────────────────────────────────────────

/** QRCode boyutu / QRCode size */
export type QRCodeSize = 'sm' | 'md' | 'lg';

const SIZE_PX_MAP: Record<QRCodeSize, number> = { sm: 128, md: 192, lg: 256 };

// ── SVG Renderer ──────────────────────────────────────

function renderQRSvg(matrix: QRMatrix, sizePx: number): ReactNode {
  const modules = matrix.length;
  const cellSize = sizePx / modules;
  const rects: ReactNode[] = [];

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      const row = matrix[r];
      if (row && row[c] === 1) {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={c * cellSize}
            y={r * cellSize}
            width={cellSize}
            height={cellSize}
          />,
        );
      }
    }
  }

  return rects;
}

// ── Context (Compound API) ────────────────────────────

interface QRCodeContextValue {
  matrix: QRMatrix;
  size: QRCodeSize;
  classNames: ClassNames<QRCodeSlot> | undefined;
  styles: Styles<QRCodeSlot> | undefined;
}

const QRCodeContext = createContext<QRCodeContextValue | null>(null);

function useQRCodeContext(): QRCodeContextValue {
  const ctx = useContext(QRCodeContext);
  if (!ctx) throw new Error('QRCode compound sub-components must be used within <QRCode>.');
  return ctx;
}

// ── Compound: QRCode.Svg ──────────────────────────────

/** QRCode.Svg props */
export interface QRCodeSvgProps {
  /** Ek className / Additional className */
  className?: string;
}

const QRCodeSvg = forwardRef<SVGSVGElement, QRCodeSvgProps>(
  function QRCodeSvg(props, ref) {
    const { className } = props;
    const ctx = useQRCodeContext();
    const sizePx = SIZE_PX_MAP[ctx.size];
    const veClass = `${svgStyle} ${svgSizeStyles[ctx.size]}`;
    const slot = getSlotProps('svg', veClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <svg
        ref={ref}
        className={cls}
        style={slot.style}
        viewBox={`0 0 ${sizePx} ${sizePx}`}
        role="img"
        aria-label="QR Code"
        data-testid="qrcode-svg"
      >
        {renderQRSvg(ctx.matrix, sizePx)}
      </svg>
    );
  },
);

// ── Compound: QRCode.Label ────────────────────────────

/** QRCode.Label props */
export interface QRCodeLabelProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const QRCodeLabel = forwardRef<HTMLParagraphElement, QRCodeLabelProps>(
  function QRCodeLabel(props, ref) {
    const { children, className } = props;
    const ctx = useQRCodeContext();
    const slot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <p ref={ref} className={cls} style={slot.style} data-testid="qrcode-label">
        {children}
      </p>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface QRCodeComponentProps extends SlotStyleProps<QRCodeSlot> {
  /** Kodlanacak veri (zorunlu) / Data to encode (required) */
  value: string;
  /** Boyut / Size */
  size?: QRCodeSize;
  /** Hata duzeltme seviyesi / Error correction level */
  errorCorrection?: ErrorCorrectionLevel;
  /** Props-based: alt metin / Label text */
  label?: ReactNode;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const QRCodeBase = forwardRef<HTMLDivElement, QRCodeComponentProps>(
  function QRCode(props, ref) {
    const {
      value,
      size = 'md',
      errorCorrection = 'M',
      label,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const qrResult = useMemo(
      () => generateQRCode({ value, errorCorrection }),
      [value, errorCorrection],
    );

    const rootVeClass = `${rootStyle} ${sizeStyles[size]}`;
    const rootSlot = getSlotProps('root', rootVeClass, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: QRCodeContextValue = { matrix: qrResult.matrix, size, classNames, styles };

    // ── Compound API ──
    if (children) {
      return (
        <QRCodeContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="qrcode-root"
            data-size={size}
          >
            {children}
          </div>
        </QRCodeContext.Provider>
      );
    }

    // ── Props-based API ──
    const sizePx = SIZE_PX_MAP[size];
    const svgVeClass = `${svgStyle} ${svgSizeStyles[size]}`;
    const svgSlot = getSlotProps('svg', svgVeClass, classNames, styles);
    const labelSlot = getSlotProps('label', labelStyle, classNames, styles);

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="qrcode-root"
        data-size={size}
      >
        <svg
          className={svgSlot.className}
          style={svgSlot.style}
          viewBox={`0 0 ${sizePx} ${sizePx}`}
          role="img"
          aria-label="QR Code"
          data-testid="qrcode-svg"
        >
          {renderQRSvg(qrResult.matrix, sizePx)}
        </svg>
        {label !== undefined && (
          <p
            className={labelSlot.className}
            style={labelSlot.style}
            data-testid="qrcode-label"
          >
            {label}
          </p>
        )}
      </div>
    );
  },
);

/**
 * QRCode bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <QRCode value="https://relteco.com" size="md" label="Tara" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <QRCode value="https://relteco.com">
 *   <QRCode.Svg />
 *   <QRCode.Label>Tara</QRCode.Label>
 * </QRCode>
 * ```
 */
export const QRCode = Object.assign(QRCodeBase, {
  Svg: QRCodeSvg,
  Label: QRCodeLabel,
});
