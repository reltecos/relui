/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Popover — trigger elemana baglanarak acilan popup bilesen (Dual API).
 * Popover — popup component attached to a trigger element (Dual API).
 *
 * Props-based: `<Popover trigger={<button>Tikla</button>}>Icerik</Popover>`
 * Compound:    `<Popover><Popover.Trigger><button>Tikla</button></Popover.Trigger><Popover.Content>Icerik</Popover.Content></Popover>`
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
  cloneElement,
  isValidElement,
  Children,
  type ReactNode,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import { popoverContentStyle, popoverArrowStyle } from './popover.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import {
  createPopover,
  type PopoverAPI,
  type PopoverPlacement,
  type PopoverAlignment,
} from '@relteco/relui-core';

// ── Slot ──────────────────────────────────────────────

/**
 * Popover slot isimleri / Popover slot names.
 */
export type PopoverSlot = 'root' | 'trigger' | 'content' | 'arrow';

// ── Context (Compound API) ──────────────────────────

interface PopoverContextValue {
  open: boolean;
  onToggle: () => void;
  classNames: ClassNames<PopoverSlot> | undefined;
  styles: Styles<PopoverSlot> | undefined;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

export function usePopoverContext(): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error('Popover compound sub-components must be used within <Popover>.');
  return ctx;
}

// ── Compound: Popover.Trigger ───────────────────────

/** Popover.Trigger props */
export interface PopoverTriggerProps {
  /** Trigger elementi / Trigger element */
  children: ReactElement;
  /** Ek className / Additional className */
  className?: string;
}

const PopoverTrigger = forwardRef<HTMLElement, PopoverTriggerProps>(
  function PopoverTrigger(_props, _ref) {
    // Rendering is handled by the parent Popover component.
    // This component is only used as a marker for compound mode detection.
    return null;
  },
);

// ── Compound: Popover.Content ───────────────────────

/** Popover.Content props */
export interface PopoverContentProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(_props, _ref) {
    // Rendering is handled by the parent Popover component.
    // This component is only used as a marker for compound mode detection.
    return null;
  },
);

// ── Compound: Popover.Arrow ─────────────────────────

/** Popover.Arrow props */
export interface PopoverArrowProps {
  /** Ek className / Additional className */
  className?: string;
}

const PopoverArrow = forwardRef<HTMLSpanElement, PopoverArrowProps>(
  function PopoverArrow(_props, _ref) {
    // Rendering is handled by the parent Popover component.
    // This component is only used as a marker for compound mode detection.
    return null;
  },
);

// ── Component Props ─────────────────────────────────

export interface PopoverComponentProps extends SlotStyleProps<PopoverSlot> {
  /** Acik mi (controlled) / Is open (controlled) */
  open?: boolean;
  /** Varsayilan acik mi (uncontrolled) / Default open (uncontrolled) */
  defaultOpen?: boolean;
  /** Acik/kapali degisince callback / On open change callback */
  onOpenChange?: (open: boolean) => void;
  /** Yerlesim yonu / Placement direction */
  placement?: PopoverPlacement;
  /** Hizalama / Alignment */
  alignment?: PopoverAlignment;
  /** Trigger'dan uzaklik (px) / Offset from trigger (px) */
  offset?: number;
  /** Ok isareti goster / Show arrow */
  showArrow?: boolean;
  /** Dis tiklamada kapat / Close on outside click */
  closeOnOutsideClick?: boolean;
  /** Escape ile kapat / Close on Escape */
  closeOnEscape?: boolean;
  /** Trigger elementi (props-based) / Trigger element (props-based) */
  trigger?: React.ReactElement;
  /** Portal hedefi / Portal container */
  portalContainer?: HTMLElement;
  /** Icerik / Content */
  children?: React.ReactNode;
  /** Ek className (content'e) / Additional className (applied to content) */
  className?: string;
  /** Inline style (content'e) / Inline style (applied to content) */
  style?: React.CSSProperties;
}

// ── Position calculator ─────────────────────────────

interface Position {
  top: number;
  left: number;
  arrowTop?: number;
  arrowLeft?: number;
  arrowBorderTop?: string;
  arrowBorderRight?: string;
  arrowBorderBottom?: string;
  arrowBorderLeft?: string;
}

function calculatePosition(
  triggerRect: DOMRect,
  contentRect: DOMRect,
  placement: PopoverPlacement,
  alignment: PopoverAlignment,
  offset: number,
  portalRect: DOMRect,
): Position {
  let top = 0;
  let left = 0;

  // Placement yonune gore ana eksen pozisyonu
  switch (placement) {
    case 'top':
      top = triggerRect.top - contentRect.height - offset - portalRect.top;
      break;
    case 'bottom':
      top = triggerRect.bottom + offset - portalRect.top;
      break;
    case 'left':
      left = triggerRect.left - contentRect.width - offset - portalRect.left;
      break;
    case 'right':
      left = triggerRect.right + offset - portalRect.left;
      break;
  }

  // Alignment (capraz eksen)
  if (placement === 'top' || placement === 'bottom') {
    switch (alignment) {
      case 'start':
        left = triggerRect.left - portalRect.left;
        break;
      case 'center':
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2 - portalRect.left;
        break;
      case 'end':
        left = triggerRect.right - contentRect.width - portalRect.left;
        break;
    }
  } else {
    switch (alignment) {
      case 'start':
        top = triggerRect.top - portalRect.top;
        break;
      case 'center':
        top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2 - portalRect.top;
        break;
      case 'end':
        top = triggerRect.bottom - contentRect.height - portalRect.top;
        break;
    }
  }

  // Arrow pozisyonu
  const arrowSize = 10;
  const halfArrow = arrowSize / 2;
  let arrowTop: number | undefined;
  let arrowLeft: number | undefined;
  let arrowBorderTop = '1px solid var(--rel-color-border, #e5e7eb)';
  let arrowBorderRight = '1px solid var(--rel-color-border, #e5e7eb)';
  let arrowBorderBottom = '1px solid var(--rel-color-border, #e5e7eb)';
  let arrowBorderLeft = '1px solid var(--rel-color-border, #e5e7eb)';

  const triggerCenterX = triggerRect.left + triggerRect.width / 2 - portalRect.left - left;
  const triggerCenterY = triggerRect.top + triggerRect.height / 2 - portalRect.top - top;

  switch (placement) {
    case 'top':
      arrowTop = contentRect.height - halfArrow;
      arrowLeft = Math.max(halfArrow, Math.min(triggerCenterX - halfArrow, contentRect.width - halfArrow * 3));
      arrowBorderTop = 'none';
      arrowBorderLeft = 'none';
      break;
    case 'bottom':
      arrowTop = -halfArrow;
      arrowLeft = Math.max(halfArrow, Math.min(triggerCenterX - halfArrow, contentRect.width - halfArrow * 3));
      arrowBorderBottom = 'none';
      arrowBorderRight = 'none';
      break;
    case 'left':
      arrowLeft = contentRect.width - halfArrow;
      arrowTop = Math.max(halfArrow, Math.min(triggerCenterY - halfArrow, contentRect.height - halfArrow * 3));
      arrowBorderBottom = 'none';
      arrowBorderLeft = 'none';
      break;
    case 'right':
      arrowLeft = -halfArrow;
      arrowTop = Math.max(halfArrow, Math.min(triggerCenterY - halfArrow, contentRect.height - halfArrow * 3));
      arrowBorderTop = 'none';
      arrowBorderRight = 'none';
      break;
  }

  return {
    top,
    left,
    arrowTop,
    arrowLeft,
    arrowBorderTop,
    arrowBorderRight,
    arrowBorderBottom,
    arrowBorderLeft,
  };
}

// ── Compound mode helpers ───────────────────────────

function extractCompoundChildren(children: ReactNode): {
  triggerChild: ReactElement | null;
  contentChild: ReactNode;
  hasArrow: boolean;
} {
  let triggerChild: ReactElement | null = null;
  let contentChild: ReactNode = null;
  let hasArrow = false;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === PopoverTrigger) {
      triggerChild = (child.props as PopoverTriggerProps).children;
    } else if (child.type === PopoverContent) {
      contentChild = (child.props as PopoverContentProps).children;
    } else if (child.type === PopoverArrow) {
      hasArrow = true;
    }
  });

  return { triggerChild, contentChild, hasArrow };
}

function isCompoundMode(children: ReactNode, trigger: ReactElement | undefined): boolean {
  if (trigger) return false;
  if (!children) return false;
  const arr = Array.isArray(children) ? children : [children];
  return arr.some(
    (child) =>
      child !== null &&
      child !== undefined &&
      typeof child === 'object' &&
      'type' in child &&
      (child.type === PopoverTrigger ||
        child.type === PopoverContent ||
        child.type === PopoverArrow),
  );
}

// ── Component ─────────────────────────────────────────

/**
 * Popover bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Popover trigger={<button>Tikla</button>} placement="bottom">
 *   <p>Popover icerigi</p>
 * </Popover>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Popover placement="bottom">
 *   <Popover.Trigger><button>Tikla</button></Popover.Trigger>
 *   <Popover.Content><p>Popover icerigi</p></Popover.Content>
 *   <Popover.Arrow />
 * </Popover>
 * ```
 */
const PopoverBase = forwardRef<HTMLDivElement, PopoverComponentProps>(
  function Popover(props, ref) {
    const {
      open: controlledOpen,
      defaultOpen,
      onOpenChange,
      placement = 'bottom',
      alignment = 'center',
      offset: offsetProp = 8,
      showArrow = false,
      closeOnOutsideClick = true,
      closeOnEscape = true,
      trigger,
      portalContainer,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const compound = isCompoundMode(children, trigger);

    // ── Extract compound children ──
    const {
      triggerChild: compoundTrigger,
      contentChild: compoundContent,
      hasArrow: compoundHasArrow,
    } = compound ? extractCompoundChildren(children) : { triggerChild: null, contentChild: null, hasArrow: false };

    const effectiveTrigger = compound ? compoundTrigger : trigger;
    const effectiveContent = compound ? compoundContent : children;
    const effectiveShowArrow = compound ? compoundHasArrow : showArrow;

    const isControlled = controlledOpen !== undefined;
    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── Core API ──
    const onOpenChangeRef = useRef(onOpenChange);
    onOpenChangeRef.current = onOpenChange;

    const apiRef = useRef<PopoverAPI | null>(null);
    if (!apiRef.current) {
      apiRef.current = createPopover({
        open: isControlled ? controlledOpen : (defaultOpen ?? false),
        onOpenChange: (isOpen) => {
          onOpenChangeRef.current?.(isOpen);
        },
      });
    }
    const api = apiRef.current;

    // ── Prop sync: controlled open ──
    const prevOpenRef = useRef<boolean | undefined>(undefined);
    if (isControlled && controlledOpen !== prevOpenRef.current) {
      if (controlledOpen) {
        api.send({ type: 'OPEN' });
      } else {
        api.send({ type: 'CLOSE' });
      }
      prevOpenRef.current = controlledOpen;
    }

    // ── Subscribe ──
    useEffect(() => {
      return api.subscribe(() => forceRender());
    }, [api]);

    const ctx = api.getContext();

    // ── Refs ──
    const triggerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<Position | null>(null);

    // ── Toggle handler ──
    const handleTriggerClick = useCallback(() => {
      if (isControlled) {
        onOpenChangeRef.current?.(!ctx.open);
      } else {
        api.send({ type: 'TOGGLE' });
      }
    }, [isControlled, ctx.open, api]);

    // ── Position calculation ──
    useEffect(() => {
      if (!ctx.open) {
        setPosition(null);
        return;
      }

      const triggerEl = triggerRef.current;
      const contentEl = contentRef.current;
      if (!triggerEl || !contentEl) return;

      const calculate = () => {
        const triggerRect = triggerEl.getBoundingClientRect();
        const contentRect = contentEl.getBoundingClientRect();
        const portalTarget = portalContainer ?? document.body;
        const portalRect = portalTarget === document.body
          ? new DOMRect(0, 0, window.innerWidth, window.innerHeight)
          : portalTarget.getBoundingClientRect();

        const pos = calculatePosition(
          triggerRect,
          contentRect,
          placement,
          alignment,
          offsetProp,
          portalRect,
        );
        setPosition(pos);
      };

      // Ilk hesaplama — raf ile render sonrasini bekle
      const raf = requestAnimationFrame(calculate);
      return () => cancelAnimationFrame(raf);
    }, [ctx.open, placement, alignment, offsetProp, portalContainer]);

    // ── Outside click ──
    useEffect(() => {
      if (!ctx.open || !closeOnOutsideClick) return;

      const handleClick = (e: MouseEvent) => {
        const target = e.target as Node;
        const triggerEl = triggerRef.current;
        const contentEl = contentRef.current;

        if (triggerEl && triggerEl.contains(target)) return;
        if (contentEl && contentEl.contains(target)) return;

        if (isControlled) {
          onOpenChangeRef.current?.(false);
        } else {
          api.send({ type: 'CLOSE' });
        }
      };

      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [ctx.open, closeOnOutsideClick, isControlled, api]);

    // ── Escape key ──
    useEffect(() => {
      if (!ctx.open || !closeOnEscape) return;

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (isControlled) {
            onOpenChangeRef.current?.(false);
          } else {
            api.send({ type: 'CLOSE' });
          }
        }
      };

      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }, [ctx.open, closeOnEscape, isControlled, api]);

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

    // ── Trigger clone ──
    const triggerElement = isValidElement(effectiveTrigger)
      ? cloneElement(effectiveTrigger as React.ReactElement<Record<string, unknown>>, {
          ref: triggerRef,
          onClick: (e: React.MouseEvent) => {
            handleTriggerClick();
            const origClick = (effectiveTrigger as React.ReactElement<Record<string, unknown>>).props.onClick;
            if (typeof origClick === 'function') {
              origClick(e);
            }
          },
          'aria-expanded': ctx.open,
          'aria-haspopup': 'true',
          'data-testid': 'popover-trigger',
        })
      : effectiveTrigger;

    // ── Slots ──
    const contentSlot = getSlotProps('content', popoverContentStyle, classNames, styles);
    const arrowSlot = getSlotProps('arrow', popoverArrowStyle, classNames, styles);

    const contentClassName = className
      ? `${contentSlot.className} ${className}`
      : contentSlot.className;

    // ── Context value ──
    const ctxValue: PopoverContextValue = {
      open: ctx.open,
      onToggle: handleTriggerClick,
      classNames,
      styles,
    };

    // ── Render ──
    const anchor = <span ref={anchorRef} style={{ display: 'none' }} data-testid="popover-root" />;

    const contentElement = ctx.open && portalTarget ? createPortal(
      <div
        ref={(el) => {
          (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        className={contentClassName}
        style={{
          ...contentSlot.style,
          ...styleProp,
          top: position ? position.top : -9999,
          left: position ? position.left : -9999,
          visibility: position ? 'visible' : 'hidden',
        }}
        role="dialog"
        data-placement={placement}
        data-alignment={alignment}
        data-testid="popover-content"
      >
        {effectiveContent}
        {effectiveShowArrow && position && (
          <span
            className={arrowSlot.className}
            style={{
              ...arrowSlot.style,
              top: position.arrowTop,
              left: position.arrowLeft,
              borderTop: position.arrowBorderTop,
              borderRight: position.arrowBorderRight,
              borderBottom: position.arrowBorderBottom,
              borderLeft: position.arrowBorderLeft,
            }}
            data-testid="popover-arrow"
          />
        )}
      </div>,
      portalTarget,
    ) : null;

    if (compound) {
      return (
        <PopoverContext.Provider value={ctxValue}>
          {anchor}
          {triggerElement}
          {contentElement}
        </PopoverContext.Provider>
      );
    }

    return (
      <>
        {anchor}
        {triggerElement}
        {contentElement}
      </>
    );
  },
);

export const Popover = Object.assign(PopoverBase, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Arrow: PopoverArrow,
});
