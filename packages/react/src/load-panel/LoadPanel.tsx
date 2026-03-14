/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * LoadPanel — yukleme overlay bilesen.
 * LoadPanel — loading overlay component.
 *
 * Overlay + spinner + mesaj — islem sirasinda alani kaplar.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import {
  loadPanelOverlayRecipe,
  loadPanelContentStyle,
  loadPanelSpinnerRecipe,
  loadPanelMessageStyle,
} from './load-panel.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/**
 * LoadPanel slot isimleri / LoadPanel slot names.
 */
export type LoadPanelSlot = 'root' | 'content' | 'spinner' | 'message';

// ── Types ─────────────────────────────────────────────

/** LoadPanel boyutu / LoadPanel size. */
export type LoadPanelSize = 'sm' | 'md' | 'lg';

/** LoadPanel arka plan / LoadPanel backdrop. */
export type LoadPanelBackdrop = 'light' | 'dark' | 'none';

// ── Component Props ───────────────────────────────────

export interface LoadPanelComponentProps extends SlotStyleProps<LoadPanelSlot> {
  /** Gorunur mu / Visible */
  visible?: boolean;
  /** Mesaj / Message */
  message?: ReactNode;
  /** Boyut / Size (spinner boyutu) */
  size?: LoadPanelSize;
  /** Arka plan / Backdrop */
  backdrop?: LoadPanelBackdrop;
  /** Tam ekran / Fullscreen (fixed position) */
  fullscreen?: boolean;
  /** Spinner rengi / Spinner color */
  spinnerColor?: string;
  /** Spinner kalinligi / Spinner thickness */
  spinnerThickness?: number;
  /** Ozel spinner / Custom spinner (varsayilani override eder) */
  indicator?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** id */
  id?: string;
}

// ── Component ─────────────────────────────────────────

/**
 * LoadPanel bilesen — yukleme overlay.
 * LoadPanel component — loading overlay.
 *
 * @example
 * ```tsx
 * <div style={{ position: 'relative', height: 300 }}>
 *   <LoadPanel visible message="Yukleniyor..." />
 *   <Content />
 * </div>
 * ```
 */
export const LoadPanel = forwardRef<HTMLDivElement, LoadPanelComponentProps>(
  function LoadPanel(props, ref) {
    const {
      visible = true,
      message,
      size = 'md',
      backdrop = 'light',
      fullscreen = false,
      spinnerColor = 'var(--rel-color-primary, #3b82f6)',
      spinnerThickness = 3,
      indicator,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
    } = props;

    if (!visible) return null;

    // ── Slots ──
    const rootClass = loadPanelOverlayRecipe({ backdrop, fullscreen });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const contentSlot = getSlotProps('content', loadPanelContentStyle, classNames, styles);
    const spinnerSlot = getSlotProps('spinner', loadPanelSpinnerRecipe({ size }), classNames, styles);
    const messageSlot = getSlotProps('message', loadPanelMessageStyle, classNames, styles);

    // ── Default spinner SVG ──
    const defaultSpinner = (
      <svg
        className={spinnerSlot.className}
        style={spinnerSlot.style}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        data-testid="load-panel-spinner"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={spinnerColor}
          strokeWidth={spinnerThickness}
          opacity={0.2}
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke={spinnerColor}
          strokeWidth={spinnerThickness}
          strokeLinecap="round"
        />
      </svg>
    );

    return (
      <div
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        data-testid="load-panel"
        role="status"
        aria-busy="true"
        aria-label={typeof message === 'string' ? message : 'Yukleniyor'}
      >
        <div className={contentSlot.className} style={contentSlot.style}>
          {indicator !== undefined ? indicator : defaultSpinner}

          {message && (
            <div className={messageSlot.className} style={messageSlot.style} data-testid="load-panel-message">
              {message}
            </div>
          )}
        </div>
      </div>
    );
  },
);
