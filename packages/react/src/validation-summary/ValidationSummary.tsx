/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ValidationSummary — form hatalarinin toplu gosterimi (Dual API).
 * ValidationSummary — form errors summary display (Dual API).
 *
 * Props-based: `<ValidationSummary errors={errors} onErrorClick={handler} />`
 * Compound:    `<ValidationSummary errors={errors}><ValidationSummary.Title>Hatalar</ValidationSummary.Title>...</ValidationSummary>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useRef, useEffect, useReducer, type ReactNode } from 'react';
import {
  validationSummaryRootStyle,
  validationSummaryTitleStyle,
  validationSummaryListStyle,
  validationSummaryItemRecipe,
  validationSummaryItemIconRecipe,
  validationSummaryItemMessageStyle,
} from './validation-summary.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import {
  createValidationSummary,
  type ValidationSummaryAPI,
  type ValidationError,
} from '@relteco/relui-core';
import { XCircleIcon, AlertTriangleIcon } from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * ValidationSummary slot isimleri / ValidationSummary slot names.
 */
export type ValidationSummarySlot =
  | 'root'
  | 'title'
  | 'list'
  | 'item'
  | 'itemIcon'
  | 'itemMessage';

// ── Context (Compound API) ──────────────────────────

interface ValidationSummaryContextValue {
  classNames: ClassNames<ValidationSummarySlot> | undefined;
  styles: Styles<ValidationSummarySlot> | undefined;
}

const ValidationSummaryContext = createContext<ValidationSummaryContextValue | null>(null);

function useValidationSummaryContext(): ValidationSummaryContextValue {
  const ctx = useContext(ValidationSummaryContext);
  if (!ctx) throw new Error('ValidationSummary compound sub-components must be used within <ValidationSummary>.');
  return ctx;
}

// ── Compound: ValidationSummary.Item ────────────────

/** ValidationSummary.Item props */
export interface ValidationSummaryItemProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Severity / Severity */
  severity?: 'error' | 'warning';
  /** data-field / data-field */
  field?: string;
  /** Tiklaninca callback / On click callback */
  onClick?: () => void;
  /** Ek className / Additional className */
  className?: string;
}

const ValidationSummaryItem = forwardRef<HTMLLIElement, ValidationSummaryItemProps>(
  function ValidationSummaryItem(props, ref) {
    const { children, severity = 'error', field, onClick, className } = props;
    const ctx = useValidationSummaryContext();
    const itemClass = validationSummaryItemRecipe({ severity });
    const slot = getSlotProps('item', itemClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <li
        ref={ref}
        className={cls}
        style={slot.style}
        onClick={onClick}
        data-testid="validation-summary-item"
        data-field={field}
        data-severity={severity}
      >
        {children}
      </li>
    );
  },
);

// ── Compound: ValidationSummary.Icon ────────────────

/** ValidationSummary.Icon props */
export interface ValidationSummaryIconProps {
  /** Icerik (varsayilan: severity ikonlari) / Content (default: severity icons) */
  children?: ReactNode;
  /** Severity / Severity */
  severity?: 'error' | 'warning';
  /** Ek className / Additional className */
  className?: string;
}

const ValidationSummaryIcon = forwardRef<HTMLSpanElement, ValidationSummaryIconProps>(
  function ValidationSummaryIcon(props, ref) {
    const { children, severity = 'error', className } = props;
    const ctx = useValidationSummaryContext();
    const iconClass = validationSummaryItemIconRecipe({ severity });
    const slot = getSlotProps('itemIcon', iconClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="validation-summary-icon">
        {children ?? (severity === 'warning' ? <AlertTriangleIcon size={16} aria-hidden="true" /> : <XCircleIcon size={16} aria-hidden="true" />)}
      </span>
    );
  },
);

// ── Compound: ValidationSummary.Title ───────────────

/** ValidationSummary.Title props */
export interface ValidationSummaryTitleProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ValidationSummaryTitle = forwardRef<HTMLDivElement, ValidationSummaryTitleProps>(
  function ValidationSummaryTitle(props, ref) {
    const { children, className } = props;
    const ctx = useValidationSummaryContext();
    const slot = getSlotProps('title', validationSummaryTitleStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="validation-summary-title">
        {children}
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface ValidationSummaryComponentProps extends SlotStyleProps<ValidationSummarySlot> {
  /** Hata listesi / Error list */
  errors: ValidationError[];
  /** Baslik / Title (default: 'Lutfen asagidaki hatalari duzeltin') */
  title?: string;
  /** Baslik goster / Show title */
  showTitle?: boolean;
  /** Hataya tiklaninca callback / On error click callback */
  onErrorClick?: (error: ValidationError) => void;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const ValidationSummaryBase = forwardRef<HTMLDivElement, ValidationSummaryComponentProps>(
  function ValidationSummary(props, ref) {
    const {
      errors,
      title = 'Lutfen asagidaki hatalari duzeltin',
      showTitle = true,
      onErrorClick,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── Core API ──
    const apiRef = useRef<ValidationSummaryAPI | null>(null);
    if (!apiRef.current) {
      apiRef.current = createValidationSummary({ errors });
    }
    const api = apiRef.current;

    // ── Prop sync: errors ──
    const prevErrorsRef = useRef<ValidationError[] | undefined>(undefined);
    if (errors !== prevErrorsRef.current) {
      api.send({ type: 'SET_ERRORS', errors });
      prevErrorsRef.current = errors;
    }

    // ── Subscribe ──
    useEffect(() => {
      return api.subscribe(() => forceRender());
    }, [api]);

    const ctx = api.getContext();

    // Hata yoksa render etme / Don't render if no errors
    if (ctx.errors.length === 0) return null;

    // ── Slots ──
    const rootSlot = getSlotProps('root', validationSummaryRootStyle, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: ValidationSummaryContextValue = { classNames, styles };

    // ── Compound API ──
    if (children) {
      return (
        <ValidationSummaryContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            role="alert"
            aria-live="polite"
            data-testid="validation-summary-root"
          >
            {children}
          </div>
        </ValidationSummaryContext.Provider>
      );
    }

    // ── Props-based API ──
    const titleSlot = getSlotProps('title', validationSummaryTitleStyle, classNames, styles);
    const listSlot = getSlotProps('list', validationSummaryListStyle, classNames, styles);
    const msgSlot = getSlotProps('itemMessage', validationSummaryItemMessageStyle, classNames, styles);

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        role="alert"
        aria-live="polite"
        data-testid="validation-summary-root"
      >
        {showTitle && (
          <div
            className={titleSlot.className}
            style={titleSlot.style}
            data-testid="validation-summary-title"
          >
            <XCircleIcon size={18} aria-hidden="true" />
            {title}
          </div>
        )}

        <ul
          className={listSlot.className}
          style={listSlot.style}
          data-testid="validation-summary-list"
        >
          {ctx.errors.map((error) => {
            const severity = error.severity ?? 'error';
            const itemClass = validationSummaryItemRecipe({ severity });
            const itemSlot = getSlotProps('item', itemClass, classNames, styles);
            const iconClass = validationSummaryItemIconRecipe({ severity });
            const iconSlot = getSlotProps('itemIcon', iconClass, classNames, styles);

            return (
              <li
                key={error.field}
                className={itemSlot.className}
                style={itemSlot.style}
                onClick={() => onErrorClick?.(error)}
                data-testid="validation-summary-item"
                data-field={error.field}
                data-severity={severity}
              >
                <span className={iconSlot.className} style={iconSlot.style}>
                  {severity === 'warning' ? <AlertTriangleIcon size={16} aria-hidden="true" /> : <XCircleIcon size={16} aria-hidden="true" />}
                </span>
                <span
                  className={msgSlot.className}
                  style={msgSlot.style}
                  data-testid="validation-summary-item-message"
                >
                  {error.message}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);

/**
 * ValidationSummary bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <ValidationSummary errors={errors} onErrorClick={handler} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <ValidationSummary errors={errors}>
 *   <ValidationSummary.Title>Hatalar</ValidationSummary.Title>
 *   <ValidationSummary.Item severity="error">Ad zorunludur</ValidationSummary.Item>
 * </ValidationSummary>
 * ```
 */
export const ValidationSummary = Object.assign(ValidationSummaryBase, {
  Item: ValidationSummaryItem,
  Icon: ValidationSummaryIcon,
  Title: ValidationSummaryTitle,
});
