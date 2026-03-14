/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Alert — bilgi/uyari/hata bildirimi bilesen.
 * Alert — info/warning/error feedback component.
 *
 * 4 severity (info/success/warning/error), 3 variant, kapatilabilir.
 *
 * @packageDocumentation
 */

import { forwardRef, useRef, useReducer, useEffect, type ReactNode } from 'react';
import {
  alertRootRecipe,
  alertIconStyle,
  alertContentStyle,
  alertTitleStyle,
  alertDescriptionStyle,
  alertCloseButtonStyle,
  alertActionStyle,
} from './alert.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import { createAlert, type AlertSeverity, type AlertVariant, type AlertSize, type AlertAPI } from '@relteco/relui-core';
import {
  InfoCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  CloseIcon,
} from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * Alert slot isimleri / Alert slot names.
 */
export type AlertSlot = 'root' | 'icon' | 'content' | 'title' | 'description' | 'closeButton' | 'action';

// ── Component Props ──────────────────────────────────

export interface AlertComponentProps extends SlotStyleProps<AlertSlot> {
  /** Ciddiyet / Severity */
  severity?: AlertSeverity;

  /** Variant / Variant */
  variant?: AlertVariant;

  /** Boyut / Size */
  size?: AlertSize;

  /** Baslik / Title */
  title?: ReactNode;

  /** Aciklama / Description (children) */
  children?: ReactNode;

  /** Kapatilabilir mi / Closable */
  closable?: boolean;

  /** Kontrol edilen gorunurluk / Controlled visibility */
  open?: boolean;

  /** Kapaninca callback / Close callback */
  onClose?: () => void;

  /** Ozel ikon / Custom icon */
  icon?: ReactNode;

  /** Aksiyon alani / Action area */
  action?: ReactNode;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;
}

// ── Default Icons (from @relteco/relui-icons) ────────

const defaultIcons: Record<AlertSeverity, typeof InfoCircleIcon> = {
  info: InfoCircleIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  error: XCircleIcon,
};

// ── Component ────────────────────────────────────────

/**
 * Alert bilesen — bilgi/uyari/hata bildirimi.
 * Alert component — info/warning/error feedback.
 *
 * @example
 * ```tsx
 * <Alert severity="success" title="Basarili!">Islem tamamlandi.</Alert>
 * <Alert severity="error" closable>Bir hata olustu.</Alert>
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertComponentProps>(
  function Alert(props, ref) {
    const {
      severity = 'info',
      variant = 'subtle',
      size = 'md',
      title,
      children,
      closable = false,
      open: openProp,
      onClose,
      icon,
      action,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
    } = props;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    const apiRef = useRef<AlertAPI | null>(null);
    if (!apiRef.current) {
      apiRef.current = createAlert({
        open: openProp ?? true,
        onClose: () => onCloseRef.current?.(),
      });
    }
    const api = apiRef.current;

    // ── Prop sync ──
    const prevOpenRef = useRef<boolean | undefined>(undefined);
    if (openProp !== undefined && openProp !== prevOpenRef.current) {
      api.send({ type: 'SET_OPEN', open: openProp });
      prevOpenRef.current = openProp;
      forceRender();
    }

    // ── Subscribe ──
    useEffect(() => {
      return api.subscribe(() => forceRender());
    }, [api]);

    const ctx = api.getContext();

    if (!ctx.open) return null;

    // ── Slots ──
    const rootClass = alertRootRecipe({ variant, severity, size });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const iconSlot = getSlotProps('icon', alertIconStyle, classNames, styles);
    const contentSlot = getSlotProps('content', alertContentStyle, classNames, styles);
    const titleSlot = getSlotProps('title', alertTitleStyle, classNames, styles);
    const descSlot = getSlotProps('description', alertDescriptionStyle, classNames, styles);
    const closeBtnSlot = getSlotProps('closeButton', alertCloseButtonStyle, classNames, styles);
    const actionSlot = getSlotProps('action', alertActionStyle, classNames, styles);

    // ── Resolve icon ──
    const DefaultIcon = defaultIcons[severity];
    const resolvedIcon = icon !== undefined ? icon : <DefaultIcon size="100%" />;

    return (
      <div
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        role="alert"
        data-testid="alert"
        data-severity={severity}
      >
        {/* Icon */}
        {resolvedIcon !== null && (
          <span className={iconSlot.className} style={iconSlot.style}>
            {resolvedIcon}
          </span>
        )}

        {/* Content */}
        <div className={contentSlot.className} style={contentSlot.style}>
          {title && (
            <div className={titleSlot.className} style={titleSlot.style}>
              {title}
            </div>
          )}
          {children && (
            <div className={descSlot.className} style={descSlot.style}>
              {children}
            </div>
          )}
          {action && (
            <div className={actionSlot.className} style={actionSlot.style}>
              {action}
            </div>
          )}
        </div>

        {/* Close button */}
        {closable && (
          <button
            className={closeBtnSlot.className}
            style={closeBtnSlot.style}
            onClick={() => api.send({ type: 'CLOSE' })}
            type="button"
            aria-label="Close"
            data-testid="alert-close"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>
    );
  },
);
