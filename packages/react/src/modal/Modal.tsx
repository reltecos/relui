/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Modal — genel amacli dialog/modal bilesen (Dual API).
 * Modal — general purpose dialog/modal component (Dual API).
 *
 * Props-based: `<Modal open={open} onClose={fn} title="Baslik" footer={<button>OK</button>}>Icerik</Modal>`
 * Compound:    `<Modal open={open} onClose={fn}><Modal.Header>Baslik</Modal.Header><Modal.Body>Icerik</Modal.Body><Modal.Footer>Footer</Modal.Footer></Modal>`
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  useRef,
  useEffect,
  useReducer,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  modalOverlayStyle,
  modalWrapperStyle,
  modalContentRecipe,
  modalHeaderStyle,
  modalTitleStyle,
  modalCloseButtonStyle,
  modalBodyStyle,
  modalFooterStyle,
} from './modal.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import { createModal, type ModalAPI, type ModalSize } from '@relteco/relui-core';
import { CloseIcon } from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * Modal slot isimleri / Modal slot names.
 */
export type ModalSlot =
  | 'root'
  | 'overlay'
  | 'content'
  | 'header'
  | 'title'
  | 'closeButton'
  | 'body'
  | 'footer';

// ── Context (Compound API) ──────────────────────────

interface ModalContextValue {
  open: boolean;
  onClose: (() => void) | undefined;
  size: ModalSize;
  classNames: ClassNames<ModalSlot> | undefined;
  styles: Styles<ModalSlot> | undefined;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('Modal compound sub-components must be used within <Modal>.');
  return ctx;
}

// ── Compound: Modal.Header ──────────────────────────

/** Modal.Header props */
export interface ModalHeaderProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  function ModalHeader(props, ref) {
    const { children, className } = props;
    const ctx = useModalContext();
    const slot = getSlotProps('header', modalHeaderStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="modal-header">
        {children}
      </div>
    );
  },
);

// ── Compound: Modal.Body ────────────────────────────

/** Modal.Body props */
export interface ModalBodyProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  function ModalBody(props, ref) {
    const { children, className } = props;
    const ctx = useModalContext();
    const slot = getSlotProps('body', modalBodyStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="modal-body">
        {children}
      </div>
    );
  },
);

// ── Compound: Modal.Footer ──────────────────────────

/** Modal.Footer props */
export interface ModalFooterProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter(props, ref) {
    const { children, className } = props;
    const ctx = useModalContext();
    const slot = getSlotProps('footer', modalFooterStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="modal-footer">
        {children}
      </div>
    );
  },
);

// ── Compound: Modal.CloseButton ─────────────────────

/** Modal.CloseButton props */
export interface ModalCloseButtonProps {
  /** Ek className / Additional className */
  className?: string;
  /** Ikon boyutu / Icon size */
  iconSize?: number;
}

const ModalCloseButton = forwardRef<HTMLButtonElement, ModalCloseButtonProps>(
  function ModalCloseButton(props, ref) {
    const { className, iconSize = 16 } = props;
    const ctx = useModalContext();
    const slot = getSlotProps('closeButton', modalCloseButtonStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <button
        ref={ref}
        className={cls}
        style={slot.style}
        onClick={ctx.onClose}
        type="button"
        aria-label="Kapat"
        data-testid="modal-close"
      >
        <CloseIcon size={iconSize} aria-hidden="true" />
      </button>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface ModalComponentProps extends SlotStyleProps<ModalSlot> {
  /** Acik mi / Is open */
  open: boolean;
  /** Kapaninca callback / On close callback */
  onClose?: () => void;
  /** Baslik / Title */
  title?: string;
  /** Boyut / Size */
  size?: ModalSize;
  /** Overlay'e tiklaninca kapat / Close on overlay click */
  closeOnOverlay?: boolean;
  /** Escape ile kapat / Close on Escape */
  closeOnEscape?: boolean;
  /** Kapat butonu goster / Show close button */
  showCloseButton?: boolean;
  /** Footer icerigi / Footer content */
  footer?: React.ReactNode;
  /** Portal hedefi / Portal container */
  portalContainer?: HTMLElement;
  /** Icerik / Content */
  children?: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Compound mode detection ─────────────────────────

function isCompoundMode(children: ReactNode): boolean {
  if (!children) return false;
  const arr = Array.isArray(children) ? children : [children];
  return arr.some(
    (child) =>
      child !== null &&
      child !== undefined &&
      typeof child === 'object' &&
      'type' in child &&
      (child.type === ModalHeader ||
        child.type === ModalBody ||
        child.type === ModalFooter ||
        child.type === ModalCloseButton),
  );
}

// ── Component ─────────────────────────────────────────

const ModalBase = forwardRef<HTMLDivElement, ModalComponentProps>(
  function Modal(props, ref) {
    const {
      open,
      onClose,
      title,
      size = 'md',
      closeOnOverlay = true,
      closeOnEscape = true,
      showCloseButton = true,
      footer,
      portalContainer,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── Core API ──
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    const apiRef = useRef<ModalAPI | null>(null);
    if (!apiRef.current) {
      apiRef.current = createModal({
        open: false,
        onOpenChange: (isOpen) => {
          if (!isOpen) onCloseRef.current?.();
        },
      });
    }
    const api = apiRef.current;

    // ── Prop sync: open ──
    const prevOpenRef = useRef<boolean | undefined>(undefined);
    if (open !== prevOpenRef.current) {
      if (open) {
        api.send({ type: 'OPEN' });
      } else {
        api.send({ type: 'CLOSE' });
      }
      prevOpenRef.current = open;
    }

    // ── Subscribe ──
    useEffect(() => {
      return api.subscribe(() => forceRender());
    }, [api]);

    // ── Focus trap ──
    const contentRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const ctx = api.getContext();

    useEffect(() => {
      if (ctx.open) {
        previousFocusRef.current = document.activeElement as HTMLElement | null;
        // Kisa gecikme ile focus — portal render sonrasi
        const timer = setTimeout(() => {
          const content = contentRef.current;
          if (!content) return;
          const focusable = content.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          const first = focusable[0];
          if (first) first.focus();
        }, 50);
        return () => clearTimeout(timer);
      } else {
        previousFocusRef.current?.focus();
      }
    }, [ctx.open]);

    // ── Body scroll lock ──
    useEffect(() => {
      if (ctx.open) {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = prev;
        };
      }
    }, [ctx.open]);

    // ── Escape key ──
    useEffect(() => {
      if (!ctx.open || !closeOnEscape) return;
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          api.send({ type: 'CLOSE' });
        }
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }, [ctx.open, closeOnEscape, api]);

    // ── Focus trap: Tab wrapping ──
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        const content = contentRef.current;
        if (!content) return;
        const focusable = content.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      },
      [],
    );

    // ── Overlay click ──
    const handleOverlayClick = useCallback(() => {
      if (closeOnOverlay) {
        api.send({ type: 'CLOSE' });
      }
    }, [closeOnOverlay, api]);

    const handleClose = useCallback(() => {
      api.send({ type: 'CLOSE' });
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

    // ── Render ──
    const anchor = <span ref={anchorRef} style={{ display: 'none' }} data-testid="modal-anchor" />;

    if (!ctx.open || !portalTarget) return anchor;

    // ── Slots ──
    const overlaySlot = getSlotProps('overlay', modalOverlayStyle, classNames, styles);
    const contentClass = modalContentRecipe({ size });
    const contentSlot = getSlotProps('content', contentClass, classNames, styles);

    const contentClassName = className
      ? `${contentSlot.className} ${className}`
      : contentSlot.className;

    // ── Compound vs Props-based detection ──
    const compound = isCompoundMode(children);

    // ── Context value ──
    const ctxValue: ModalContextValue = { open: ctx.open, onClose, size, classNames, styles };

    // ── Props-based slots (only used when NOT in compound mode) ──
    const headerSlot = getSlotProps('header', modalHeaderStyle, classNames, styles);
    const titleSlot = getSlotProps('title', modalTitleStyle, classNames, styles);
    const closeSlot = getSlotProps('closeButton', modalCloseButtonStyle, classNames, styles);
    const bodySlot = getSlotProps('body', modalBodyStyle, classNames, styles);
    const footerSlot = getSlotProps('footer', modalFooterStyle, classNames, styles);

    const hasHeader = title || showCloseButton;

    const content = (
      <div ref={ref} data-testid="modal-root">
        {/* Overlay */}
        <div
          className={overlaySlot.className}
          style={overlaySlot.style}
          onClick={handleOverlayClick}
          data-testid="modal-overlay"
          aria-hidden="true"
        />

        {/* Wrapper for centering */}
        <div
          className={modalWrapperStyle}
          onClick={(e) => {
            // content disina tiklaninca overlay gibi davran
            if (e.target === e.currentTarget && closeOnOverlay) {
              api.send({ type: 'CLOSE' });
            }
          }}
          data-testid="modal-wrapper"
        >
          {/* Content */}
          <div
            ref={contentRef}
            className={contentClassName}
            style={{ ...contentSlot.style, ...styleProp }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            onKeyDown={handleKeyDown}
            data-testid="modal-content"
          >
            {compound ? (
              <ModalContext.Provider value={ctxValue}>
                {children}
              </ModalContext.Provider>
            ) : (
              <>
                {hasHeader && (
                  <div
                    className={headerSlot.className}
                    style={headerSlot.style}
                    data-testid="modal-header"
                  >
                    {title ? (
                      <h2
                        id="modal-title"
                        className={titleSlot.className}
                        style={titleSlot.style}
                        data-testid="modal-title"
                      >
                        {title}
                      </h2>
                    ) : (
                      <span />
                    )}
                    {showCloseButton && (
                      <button
                        className={closeSlot.className}
                        style={closeSlot.style}
                        onClick={handleClose}
                        type="button"
                        aria-label="Kapat"
                        data-testid="modal-close"
                      >
                        <CloseIcon size={16} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}

                <div
                  className={bodySlot.className}
                  style={bodySlot.style}
                  data-testid="modal-body"
                >
                  {children}
                </div>

                {footer && (
                  <div
                    className={footerSlot.className}
                    style={footerSlot.style}
                    data-testid="modal-footer"
                  >
                    {footer}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <>
        {anchor}
        {createPortal(content, portalTarget)}
      </>
    );
  },
);

/**
 * Modal bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Baslik">
 *   <p>Modal icerigi</p>
 * </Modal>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Modal open={isOpen} onClose={() => setIsOpen(false)}>
 *   <Modal.Header>
 *     <h2>Baslik</h2>
 *     <Modal.CloseButton />
 *   </Modal.Header>
 *   <Modal.Body>
 *     <p>Modal icerigi</p>
 *   </Modal.Body>
 *   <Modal.Footer>
 *     <button onClick={() => setIsOpen(false)}>Tamam</button>
 *   </Modal.Footer>
 * </Modal>
 * ```
 */
export const Modal = Object.assign(ModalBase, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  CloseButton: ModalCloseButton,
});
