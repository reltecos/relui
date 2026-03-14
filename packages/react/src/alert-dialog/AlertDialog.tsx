/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * AlertDialog — onay diyalogu bilesen.
 * AlertDialog — confirmation dialog component.
 *
 * Tehlikeli islemler icin kullanicidan onay alma.
 * Confirm dangerous actions from the user.
 *
 * @packageDocumentation
 */

import { forwardRef, useRef, useEffect, useReducer, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  alertDialogOverlayStyle,
  alertDialogContentRecipe,
  alertDialogHeaderStyle,
  alertDialogIconRecipe,
  alertDialogTitleStyle,
  alertDialogDescriptionStyle,
  alertDialogFooterStyle,
  alertDialogCancelButtonStyle,
  alertDialogConfirmButtonRecipe,
} from './alert-dialog.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import { createAlertDialog, type AlertDialogAPI, type AlertDialogSeverity } from '@relteco/relui-core';
import {
  AlertTriangleIcon,
  XCircleIcon,
  InfoCircleIcon,
} from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * AlertDialog slot isimleri / AlertDialog slot names.
 */
export type AlertDialogSlot =
  | 'root'
  | 'overlay'
  | 'content'
  | 'icon'
  | 'title'
  | 'description'
  | 'footer'
  | 'confirmButton'
  | 'cancelButton';

// ── Default Icons ───────────────────────────────────

const defaultIcons: Record<AlertDialogSeverity, typeof AlertTriangleIcon> = {
  danger: XCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoCircleIcon,
};

// ── Component Props ─────────────────────────────────

export interface AlertDialogComponentProps extends SlotStyleProps<AlertDialogSlot> {
  /** Acik mi / Is open */
  open: boolean;
  /** Durum degisim callback / Open change callback */
  onOpenChange?: (open: boolean) => void;
  /** Ciddiyet seviyesi / Severity */
  severity?: AlertDialogSeverity;
  /** Baslik / Title */
  title: string;
  /** Aciklama / Description */
  description?: string;
  /** Onay butonu metni / Confirm button label */
  confirmLabel?: string;
  /** Iptal butonu metni / Cancel button label */
  cancelLabel?: string;
  /** Onay callback / Confirm callback */
  onConfirm?: () => void | Promise<void>;
  /** Iptal callback / Cancel callback */
  onCancel?: () => void;
  /** Overlay tiklaninca kapat / Close on overlay click */
  closeOnOverlay?: boolean;
  /** Escape tusuyla kapat / Close on escape key */
  closeOnEscape?: boolean;
  /** Onay buton loading / Confirm button loading */
  loading?: boolean;
  /** Portal hedefi / Portal container */
  portalContainer?: HTMLElement;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** id */
  id?: string;
}

// ── Component ─────────────────────────────────────────

/**
 * AlertDialog bilesen — onay diyalogu.
 * AlertDialog component — confirmation dialog.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <AlertDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   severity="danger"
 *   title="Silmek istediginize emin misiniz?"
 *   description="Bu islem geri alinamaz."
 *   confirmLabel="Sil"
 *   cancelLabel="Vazgec"
 *   onConfirm={() => deleteItem()}
 *   onCancel={() => setOpen(false)}
 * />
 * ```
 */
export const AlertDialog = forwardRef<HTMLDivElement, AlertDialogComponentProps>(
  function AlertDialog(props, ref) {
    const {
      open,
      onOpenChange,
      severity = 'danger',
      title,
      description,
      confirmLabel = 'Onayla',
      cancelLabel = 'Vazgec',
      onConfirm,
      onCancel,
      closeOnOverlay = true,
      closeOnEscape = true,
      loading: loadingProp,
      portalContainer,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
    } = props;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── Core API ──
    const apiRef = useRef<AlertDialogAPI | null>(null);
    const onConfirmRef = useRef(onConfirm);
    onConfirmRef.current = onConfirm;
    const onCancelRef = useRef(onCancel);
    onCancelRef.current = onCancel;
    const onOpenChangeRef = useRef(onOpenChange);
    onOpenChangeRef.current = onOpenChange;

    if (!apiRef.current) {
      apiRef.current = createAlertDialog({
        open,
        closeOnOverlay,
        closeOnEscape,
        onConfirm: () => onConfirmRef.current?.(),
        onCancel: () => onCancelRef.current?.(),
        onOpenChange: (v) => onOpenChangeRef.current?.(v),
      });
    }
    const api = apiRef.current;

    // ── Prop sync ──
    const prevOpenRef = useRef<boolean | undefined>(undefined);
    if (open !== prevOpenRef.current) {
      if (open) {
        api.send({ type: 'OPEN' });
      } else {
        api.send({ type: 'CLOSE' });
      }
      prevOpenRef.current = open;
    }

    // ── Loading prop sync ──
    const prevLoadingRef = useRef<boolean | undefined>(undefined);
    if (loadingProp !== undefined && loadingProp !== prevLoadingRef.current) {
      api.send({ type: 'SET_LOADING', loading: loadingProp });
      prevLoadingRef.current = loadingProp;
    }

    // ── Subscribe ──
    useEffect(() => {
      return api.subscribe(() => forceRender());
    }, [api]);

    // ── Portal target ──
    const anchorRef = useRef<HTMLSpanElement>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
      if (portalContainer) {
        setPortalTarget(portalContainer);
        return;
      }
      const anchor = anchorRef.current;
      if (!anchor) return;
      const themeContainer = anchor.closest('[data-theme]') as HTMLElement | null;
      setPortalTarget(themeContainer ?? document.body);
    }, [portalContainer]);

    // ── Focus management ──
    const cancelBtnRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
      const ctx = api.getContext();
      if (ctx.open) {
        previousFocusRef.current = document.activeElement as HTMLElement;
        requestAnimationFrame(() => {
          cancelBtnRef.current?.focus();
        });
      } else if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }, [api.getContext().open, api]);

    // ── Escape key ──
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) {
          e.preventDefault();
          e.stopPropagation();
          api.send({ type: 'CANCEL' });
        }
        // Focus trap: Tab wrapping
        if (e.key === 'Tab') {
          const content = (e.currentTarget as HTMLElement);
          const focusable = content.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (!first || !last) return;
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      },
      [api, closeOnEscape],
    );

    // ── Overlay click ──
    const handleOverlayClick = useCallback(() => {
      if (closeOnOverlay) {
        api.send({ type: 'CANCEL' });
      }
    }, [api, closeOnOverlay]);

    // ── Render ──
    const ctx = api.getContext();
    const isLoading = loadingProp ?? ctx.loading;

    // Anchor span (portal target detection icin)
    const anchor = <span ref={anchorRef} style={{ display: 'none' }} data-testid="alert-dialog-anchor" />;

    if (!ctx.open || !portalTarget) return anchor;

    // ── Slots ──
    const overlaySlot = getSlotProps('overlay', alertDialogOverlayStyle, classNames, styles);
    const contentClass = alertDialogContentRecipe({ severity });
    const contentSlot = getSlotProps('content', contentClass, classNames, styles);
    const combinedContentClassName = className
      ? `${contentSlot.className} ${className}`
      : contentSlot.className;
    const combinedContentStyle = styleProp
      ? { ...contentSlot.style, ...styleProp }
      : contentSlot.style;
    const iconClass = alertDialogIconRecipe({ severity });
    const iconSlot = getSlotProps('icon', iconClass, classNames, styles);
    const titleSlot = getSlotProps('title', alertDialogTitleStyle, classNames, styles);
    const descriptionSlot = getSlotProps('description', alertDialogDescriptionStyle, classNames, styles);
    const footerSlot = getSlotProps('footer', alertDialogFooterStyle, classNames, styles);
    const cancelBtnSlot = getSlotProps('cancelButton', alertDialogCancelButtonStyle, classNames, styles);
    const confirmBtnClass = alertDialogConfirmButtonRecipe({ severity });
    const confirmBtnSlot = getSlotProps('confirmButton', confirmBtnClass, classNames, styles);

    const Icon = defaultIcons[severity];

    const dialog = (
      <>
        {/* Overlay */}
        <div
          className={overlaySlot.className}
          style={overlaySlot.style}
          onClick={handleOverlayClick}
          data-testid="alert-dialog-overlay"
          aria-hidden="true"
        />
        {/* Content */}
        <div
          ref={ref}
          className={combinedContentClassName}
          style={combinedContentStyle}
          id={id}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={id ? `${id}-title` : undefined}
          aria-describedby={description ? (id ? `${id}-desc` : undefined) : undefined}
          data-testid="alert-dialog-content"
          data-severity={severity}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Header */}
          <div className={alertDialogHeaderStyle} data-testid="alert-dialog-header">
            <span className={iconSlot.className} style={iconSlot.style} data-testid="alert-dialog-icon">
              <Icon size={24} />
            </span>
            <h2
              className={titleSlot.className}
              style={titleSlot.style}
              id={id ? `${id}-title` : undefined}
              data-testid="alert-dialog-title"
            >
              {title}
            </h2>
          </div>

          {/* Description */}
          {description && (
            <p
              className={descriptionSlot.className}
              style={descriptionSlot.style}
              id={id ? `${id}-desc` : undefined}
              data-testid="alert-dialog-description"
            >
              {description}
            </p>
          )}

          {/* Footer */}
          <div className={footerSlot.className} style={footerSlot.style} data-testid="alert-dialog-footer">
            <button
              ref={cancelBtnRef}
              className={cancelBtnSlot.className}
              style={cancelBtnSlot.style}
              onClick={() => api.send({ type: 'CANCEL' })}
              type="button"
              disabled={isLoading}
              data-testid="alert-dialog-cancel"
            >
              {cancelLabel}
            </button>
            <button
              className={confirmBtnSlot.className}
              style={confirmBtnSlot.style}
              onClick={() => api.send({ type: 'CONFIRM' })}
              type="button"
              disabled={isLoading}
              data-testid="alert-dialog-confirm"
            >
              {isLoading ? 'Yukleniyor...' : confirmLabel}
            </button>
          </div>
        </div>
      </>
    );

    return (
      <>
        {anchor}
        {createPortal(dialog, portalTarget)}
      </>
    );
  },
);
