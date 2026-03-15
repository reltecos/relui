/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * AlertDialog — onay diyalogu bilesen (Dual API).
 * AlertDialog — confirmation dialog component (Dual API).
 *
 * Props-based: `<AlertDialog open={open} title="Emin misiniz?" onConfirm={fn} />`
 * Compound:    `<AlertDialog open={open}><AlertDialog.Title>...</AlertDialog.Title>...</AlertDialog>`
 *
 * Tehlikeli islemler icin kullanicidan onay alma.
 * Confirm dangerous actions from the user.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useRef, useEffect, useReducer, useCallback, useState, type ReactNode } from 'react';
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
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
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

// ── Context (Compound API) ──────────────────────────

interface AlertDialogContextValue {
  severity: AlertDialogSeverity;
  classNames: ClassNames<AlertDialogSlot> | undefined;
  styles: Styles<AlertDialogSlot> | undefined;
  id: string | undefined;
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext(): AlertDialogContextValue {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) throw new Error('AlertDialog compound sub-components must be used within <AlertDialog>.');
  return ctx;
}

// ── Compound: AlertDialog.Title ──────────────────────

/** AlertDialog.Title props */
export interface AlertDialogTitleProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  function AlertDialogTitle(props, ref) {
    const { children, className } = props;
    const ctx = useAlertDialogContext();
    const slot = getSlotProps('title', alertDialogTitleStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <h2
        ref={ref}
        className={cls}
        style={slot.style}
        id={ctx.id ? `${ctx.id}-title` : undefined}
        data-testid="alert-dialog-title"
      >
        {children}
      </h2>
    );
  },
);

// ── Compound: AlertDialog.Description ────────────────

/** AlertDialog.Description props */
export interface AlertDialogDescriptionProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const AlertDialogDescription = forwardRef<HTMLParagraphElement, AlertDialogDescriptionProps>(
  function AlertDialogDescription(props, ref) {
    const { children, className } = props;
    const ctx = useAlertDialogContext();
    const slot = getSlotProps('description', alertDialogDescriptionStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <p
        ref={ref}
        className={cls}
        style={slot.style}
        id={ctx.id ? `${ctx.id}-desc` : undefined}
        data-testid="alert-dialog-description"
      >
        {children}
      </p>
    );
  },
);

// ── Compound: AlertDialog.Actions ────────────────────

/** AlertDialog.Actions props */
export interface AlertDialogActionsProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const AlertDialogActions = forwardRef<HTMLDivElement, AlertDialogActionsProps>(
  function AlertDialogActions(props, ref) {
    const { children, className } = props;
    const ctx = useAlertDialogContext();
    const slot = getSlotProps('footer', alertDialogFooterStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="alert-dialog-footer"
      >
        {children}
      </div>
    );
  },
);

// ── Compound: AlertDialog.CancelButton ───────────────

/** AlertDialog.CancelButton props */
export interface AlertDialogCancelButtonProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Tiklaninca / On click */
  onClick?: () => void;
  /** Devre disi / Disabled */
  disabled?: boolean;
}

const AlertDialogCancelButton = forwardRef<HTMLButtonElement, AlertDialogCancelButtonProps>(
  function AlertDialogCancelButton(props, ref) {
    const { children, className, onClick, disabled } = props;
    const ctx = useAlertDialogContext();
    const slot = getSlotProps('cancelButton', alertDialogCancelButtonStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <button
        ref={ref}
        className={cls}
        style={slot.style}
        onClick={onClick}
        type="button"
        disabled={disabled}
        data-testid="alert-dialog-cancel"
      >
        {children}
      </button>
    );
  },
);

// ── Compound: AlertDialog.ConfirmButton ──────────────

/** AlertDialog.ConfirmButton props */
export interface AlertDialogConfirmButtonProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Tiklaninca / On click */
  onClick?: () => void;
  /** Devre disi / Disabled */
  disabled?: boolean;
}

const AlertDialogConfirmButton = forwardRef<HTMLButtonElement, AlertDialogConfirmButtonProps>(
  function AlertDialogConfirmButton(props, ref) {
    const { children, className, onClick, disabled } = props;
    const ctx = useAlertDialogContext();
    const confirmBtnClass = alertDialogConfirmButtonRecipe({ severity: ctx.severity });
    const slot = getSlotProps('confirmButton', confirmBtnClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <button
        ref={ref}
        className={cls}
        style={slot.style}
        onClick={onClick}
        type="button"
        disabled={disabled}
        data-testid="alert-dialog-confirm"
      >
        {children}
      </button>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface AlertDialogComponentProps extends SlotStyleProps<AlertDialogSlot> {
  /** Acik mi / Is open */
  open: boolean;
  /** Durum degisim callback / Open change callback */
  onOpenChange?: (open: boolean) => void;
  /** Ciddiyet seviyesi / Severity */
  severity?: AlertDialogSeverity;
  /** Props-based: Baslik / Title */
  title?: string;
  /** Props-based: Aciklama / Description */
  description?: string;
  /** Props-based: Onay butonu metni / Confirm button label */
  confirmLabel?: string;
  /** Props-based: Iptal butonu metni / Cancel button label */
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
 * AlertDialog bilesen — Dual API (props-based + compound).
 * AlertDialog component — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
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
 *
 * @example Compound
 * ```tsx
 * <AlertDialog open={open} onOpenChange={setOpen} severity="danger">
 *   <AlertDialog.Title>Emin misiniz?</AlertDialog.Title>
 *   <AlertDialog.Description>Bu islem geri alinamaz.</AlertDialog.Description>
 *   <AlertDialog.Actions>
 *     <AlertDialog.CancelButton onClick={() => setOpen(false)}>Vazgec</AlertDialog.CancelButton>
 *     <AlertDialog.ConfirmButton onClick={handleDelete}>Sil</AlertDialog.ConfirmButton>
 *   </AlertDialog.Actions>
 * </AlertDialog>
 * ```
 */
const AlertDialogBase = forwardRef<HTMLDivElement, AlertDialogComponentProps>(
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
      children,
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

    const ctxValue: AlertDialogContextValue = { severity, classNames, styles, id };

    // ── Compound API ──
    if (children) {
      const dialog = (
        <AlertDialogContext.Provider value={ctxValue}>
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
            data-testid="alert-dialog-content"
            data-severity={severity}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {children}
          </div>
        </AlertDialogContext.Provider>
      );

      return (
        <>
          {anchor}
          {createPortal(dialog, portalTarget)}
        </>
      );
    }

    // ── Props-based API ──
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

/**
 * AlertDialog bilesen — Dual API (props-based + compound).
 */
export const AlertDialog = Object.assign(AlertDialogBase, {
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Actions: AlertDialogActions,
  CancelButton: AlertDialogCancelButton,
  ConfirmButton: AlertDialogConfirmButton,
});
