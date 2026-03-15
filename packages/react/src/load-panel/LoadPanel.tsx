/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * LoadPanel — yukleme overlay bilesen (Dual API).
 * LoadPanel — loading overlay component (Dual API).
 *
 * Props-based: `<LoadPanel visible message="Yukleniyor..." />`
 * Compound:    `<LoadPanel visible><LoadPanel.Spinner /><LoadPanel.Message>Yukleniyor</LoadPanel.Message></LoadPanel>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import {
  loadPanelOverlayRecipe,
  loadPanelContentStyle,
  loadPanelSpinnerRecipe,
  loadPanelMessageStyle,
} from './load-panel.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

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

// ── Context (Compound API) ──────────────────────────

interface LoadPanelContextValue {
  size: LoadPanelSize;
  classNames: ClassNames<LoadPanelSlot> | undefined;
  styles: Styles<LoadPanelSlot> | undefined;
}

const LoadPanelContext = createContext<LoadPanelContextValue | null>(null);

function useLoadPanelContext(): LoadPanelContextValue {
  const ctx = useContext(LoadPanelContext);
  if (!ctx) throw new Error('LoadPanel compound sub-components must be used within <LoadPanel>.');
  return ctx;
}

// ── Compound: LoadPanel.Spinner ─────────────────────

/** LoadPanel.Spinner props */
export interface LoadPanelSpinnerProps {
  /** Ozel icerik (varsayilan: SVG spinner) / Custom content (default: SVG spinner) */
  children?: ReactNode;
  /** Spinner rengi / Spinner color */
  color?: string;
  /** Spinner kalinligi / Spinner thickness */
  thickness?: number;
  /** Ek className / Additional className */
  className?: string;
}

const LoadPanelSpinner = forwardRef<HTMLDivElement, LoadPanelSpinnerProps>(
  function LoadPanelSpinner(props, ref) {
    const { children, color = 'var(--rel-color-primary, #3b82f6)', thickness = 3, className } = props;
    const ctx = useLoadPanelContext();
    const slot = getSlotProps('spinner', loadPanelSpinnerRecipe({ size: ctx.size }), ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    if (children) {
      return (
        <div ref={ref} className={cls} style={slot.style} data-testid="load-panel-spinner">
          {children}
        </div>
      );
    }

    return (
      <svg
        ref={ref as React.Ref<SVGSVGElement>}
        className={cls}
        style={slot.style}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        data-testid="load-panel-spinner"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth={thickness}
          opacity={0.2}
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
        />
      </svg>
    );
  },
);

// ── Compound: LoadPanel.Message ──────────────────────

/** LoadPanel.Message props */
export interface LoadPanelMessageProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const LoadPanelMessage = forwardRef<HTMLDivElement, LoadPanelMessageProps>(
  function LoadPanelMessage(props, ref) {
    const { children, className } = props;
    const ctx = useLoadPanelContext();
    const slot = getSlotProps('message', loadPanelMessageStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="load-panel-message">
        {children}
      </div>
    );
  },
);

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
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** id */
  id?: string;
}

// ── Component ─────────────────────────────────────────

/**
 * LoadPanel bilesen — Dual API (props-based + compound).
 * LoadPanel component — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <LoadPanel visible message="Yukleniyor..." />
 * ```
 *
 * @example Compound
 * ```tsx
 * <LoadPanel visible>
 *   <LoadPanel.Spinner />
 *   <LoadPanel.Message>Yukleniyor...</LoadPanel.Message>
 * </LoadPanel>
 * ```
 */
const LoadPanelBase = forwardRef<HTMLDivElement, LoadPanelComponentProps>(
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
      children,
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

    const ctxValue: LoadPanelContextValue = { size, classNames, styles };

    // ── Compound API ──
    if (children) {
      return (
        <LoadPanelContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={combinedRootClassName}
            style={combinedRootStyle}
            id={id}
            data-testid="load-panel"
            role="status"
            aria-busy="true"
            aria-label="Yukleniyor"
          >
            <div className={contentSlot.className} style={contentSlot.style}>
              {children}
            </div>
          </div>
        </LoadPanelContext.Provider>
      );
    }

    // ── Props-based API ──
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

/**
 * LoadPanel bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <LoadPanel visible message="Yukleniyor..." />
 * ```
 *
 * @example Compound
 * ```tsx
 * <LoadPanel visible>
 *   <LoadPanel.Spinner />
 *   <LoadPanel.Message>Yukleniyor...</LoadPanel.Message>
 * </LoadPanel>
 * ```
 */
export const LoadPanel = Object.assign(LoadPanelBase, {
  Spinner: LoadPanelSpinner,
  Message: LoadPanelMessage,
});
