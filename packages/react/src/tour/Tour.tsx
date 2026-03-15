/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tour — adim adim rehber overlay bilesen (Dual API).
 * Tour — step-by-step guide overlay component (Dual API).
 *
 * Props-based: `<Tour steps={steps} active={true} onComplete={handler} />`
 * Compound:    `<Tour active={true}><Tour.Step target="#el">...</Tour.Step></Tour>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useRef, useEffect, useReducer, useState, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  tourOverlayStyle,
  tourSpotlightStyle,
  tourPopoverRecipe,
  tourTitleStyle,
  tourDescriptionStyle,
  tourFooterStyle,
  tourStepIndicatorStyle,
  tourButtonGroupStyle,
  tourSkipButtonStyle,
  tourPrevButtonStyle,
  tourNextButtonStyle,
} from './tour.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import { createTour, type TourAPI, type TourStep, type TourPlacement } from '@relteco/relui-core';

// ── Slot ──────────────────────────────────────────────

/**
 * Tour slot isimleri / Tour slot names.
 */
export type TourSlot =
  | 'root'
  | 'overlay'
  | 'spotlight'
  | 'popover'
  | 'title'
  | 'description'
  | 'footer'
  | 'stepIndicator'
  | 'skipButton'
  | 'prevButton'
  | 'nextButton';

// ── Context (Compound API) ──────────────────────────

interface TourContextValue {
  classNames: ClassNames<TourSlot> | undefined;
  styles: Styles<TourSlot> | undefined;
}

const TourContext = createContext<TourContextValue | null>(null);

function useTourContext(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('Tour compound sub-components must be used within <Tour>.');
  return ctx;
}

// ── Compound: Tour.Step ─────────────────────────────

/** Tour.Step props */
export interface TourStepProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const TourStepComponent = forwardRef<HTMLDivElement, TourStepProps>(
  function TourStep(props, ref) {
    const { children, className } = props;
    const ctx = useTourContext();
    const popoverClass = tourPopoverRecipe({ placement: 'bottom' });
    const slot = getSlotProps('popover', popoverClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="tour-step">
        {children}
      </div>
    );
  },
);

// ── Compound: Tour.StepTitle ────────────────────────

/** Tour.StepTitle props */
export interface TourStepTitleProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const TourStepTitle = forwardRef<HTMLDivElement, TourStepTitleProps>(
  function TourStepTitle(props, ref) {
    const { children, className } = props;
    const ctx = useTourContext();
    const slot = getSlotProps('title', tourTitleStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="tour-steptitle">
        {children}
      </div>
    );
  },
);

// ── Compound: Tour.StepContent ──────────────────────

/** Tour.StepContent props */
export interface TourStepContentProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const TourStepContent = forwardRef<HTMLDivElement, TourStepContentProps>(
  function TourStepContent(props, ref) {
    const { children, className } = props;
    const ctx = useTourContext();
    const slot = getSlotProps('description', tourDescriptionStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="tour-stepcontent">
        {children}
      </div>
    );
  },
);

// ── Compound: Tour.Navigation ───────────────────────

/** Tour.Navigation props */
export interface TourNavigationProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const TourNavigation = forwardRef<HTMLDivElement, TourNavigationProps>(
  function TourNavigation(props, ref) {
    const { children, className } = props;
    const ctx = useTourContext();
    const slot = getSlotProps('footer', tourFooterStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="tour-navigation">
        {children}
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface TourComponentProps extends SlotStyleProps<TourSlot> {
  /** Adimlar / Steps */
  steps?: TourStep[];
  /** Aktif mi / Is active */
  active: boolean;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Tur bitince callback / On complete callback */
  onComplete?: () => void;
  /** Adim degisince callback / On step change callback */
  onStepChange?: (index: number) => void;
  /** Turu bitir callback / On stop callback */
  onStop?: () => void;
  /** "Gec" butonu goster / Show skip button */
  showSkip?: boolean;
  /** "Gec" buton metni / Skip button label */
  skipLabel?: string;
  /** "Ileri" buton metni / Next button label */
  nextLabel?: string;
  /** "Geri" buton metni / Prev button label */
  prevLabel?: string;
  /** "Bitir" buton metni / Finish button label */
  finishLabel?: string;
  /** Portal hedefi / Portal container */
  portalContainer?: HTMLElement;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Position helper ─────────────────────────────────

function getPopoverPosition(
  targetRect: DOMRect,
  placement: TourPlacement,
  gap: number,
): React.CSSProperties {
  switch (placement) {
    case 'bottom':
      return {
        top: targetRect.bottom + gap,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      };
    case 'top':
      return {
        bottom: window.innerHeight - targetRect.top + gap,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      };
    case 'left':
      return {
        top: targetRect.top + targetRect.height / 2,
        right: window.innerWidth - targetRect.left + gap,
        transform: 'translateY(-50%)',
      };
    case 'right':
      return {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + gap,
        transform: 'translateY(-50%)',
      };
  }
}

// ── Component ─────────────────────────────────────────

/**
 * Tour bilesen — adim adim rehber.
 * Tour component — step-by-step guide.
 *
 * @example
 * ```tsx
 * <Tour
 *   steps={[
 *     { target: '#btn', title: 'Merhaba', description: 'Bu butona tikla' },
 *     { target: '#input', description: 'Buraya yaz', placement: 'right' },
 *   ]}
 *   active={tourActive}
 *   onComplete={() => setTourActive(false)}
 *   onStop={() => setTourActive(false)}
 * />
 * ```
 */
const TourBase = forwardRef<HTMLDivElement, TourComponentProps>(
  function Tour(props, ref) {
    const {
      steps,
      active,
      children,
      onComplete,
      onStepChange,
      onStop,
      showSkip = true,
      skipLabel = 'Gec',
      nextLabel = 'Ileri',
      prevLabel = 'Geri',
      finishLabel = 'Bitir',
      portalContainer,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    // ── Hooks (daima cagrilmali — React kurali) ──
    const stepList = steps ?? [];

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;
    const onStepChangeRef = useRef(onStepChange);
    onStepChangeRef.current = onStepChange;

    const apiRef = useRef<TourAPI | null>(null);
    if (!apiRef.current && !children) {
      apiRef.current = createTour({
        steps: stepList,
        onComplete: () => onCompleteRef.current?.(),
        onStepChange: (idx) => onStepChangeRef.current?.(idx),
      });
    }
    const api = apiRef.current;

    const prevActiveRef = useRef<boolean | undefined>(undefined);
    if (!children && api && active !== prevActiveRef.current) {
      if (active) {
        api.send({ type: 'START' });
      } else {
        api.send({ type: 'STOP' });
      }
      prevActiveRef.current = active;
    }

    useEffect(() => {
      if (!api) return;
      return api.subscribe(() => forceRender());
    }, [api]);

    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const ctx = api ? api.getContext() : { active: false, currentStep: 0, totalSteps: 0 };
    const currentStep = api ? api.getStep() : undefined;

    useEffect(() => {
      if (!api || !ctx.active || !currentStep) {
        setTargetRect(null);
        return;
      }
      const el = document.querySelector(currentStep.target);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        setTargetRect(null);
      }
    }, [api, ctx.active, ctx.currentStep, currentStep]);

    useEffect(() => {
      if (!api || !ctx.active) return;
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          api.send({ type: 'STOP' });
          onStop?.();
        }
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }, [api, ctx.active, onStop]);

    const anchorRef = useRef<HTMLSpanElement>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
      if (children) return;
      if (portalContainer) {
        setPortalTarget(portalContainer);
        return;
      }
      const anchor = anchorRef.current;
      if (!anchor) return;
      const themeContainer = anchor.closest('[data-theme]') as HTMLElement | null;
      setPortalTarget(themeContainer ?? document.body);
    }, [children, portalContainer]);

    const handleNext = useCallback(() => api?.send({ type: 'NEXT' }), [api]);
    const handlePrev = useCallback(() => api?.send({ type: 'PREV' }), [api]);
    const handleSkip = useCallback(() => {
      api?.send({ type: 'STOP' });
      onStop?.();
    }, [api, onStop]);

    // ── Compound API ──
    if (children) {
      const ctxValue: TourContextValue = { classNames, styles };
      return (
        <TourContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={className}
            style={styleProp}
            data-testid="tour-compound-root"
          >
            {children}
          </div>
        </TourContext.Provider>
      );
    }

    // ── Props-based API ──
    const anchor = <span ref={anchorRef} style={{ display: 'none' }} data-testid="tour-anchor" />;

    if (!ctx.active || !currentStep || !portalTarget) return anchor;

    // ── Slots ──
    const overlaySlot = getSlotProps('overlay', tourOverlayStyle, classNames, styles);
    const spotlightSlot = getSlotProps('spotlight', tourSpotlightStyle, classNames, styles);
    const placement = currentStep.placement || 'bottom';
    const popoverClass = tourPopoverRecipe({ placement });
    const popoverSlot = getSlotProps('popover', popoverClass, classNames, styles);
    const combinedPopoverClassName = className
      ? `${popoverSlot.className} ${className}`
      : popoverSlot.className;
    const titleSlot = getSlotProps('title', tourTitleStyle, classNames, styles);
    const descSlot = getSlotProps('description', tourDescriptionStyle, classNames, styles);
    const footerSlot = getSlotProps('footer', tourFooterStyle, classNames, styles);
    const stepIndSlot = getSlotProps('stepIndicator', tourStepIndicatorStyle, classNames, styles);
    const skipSlot = getSlotProps('skipButton', tourSkipButtonStyle, classNames, styles);
    const prevSlot = getSlotProps('prevButton', tourPrevButtonStyle, classNames, styles);
    const nextSlot = getSlotProps('nextButton', tourNextButtonStyle, classNames, styles);

    const isFirst = ctx.currentStep === 0;
    const isLast = ctx.currentStep === ctx.totalSteps - 1;
    const popoverPos = targetRect
      ? getPopoverPosition(targetRect, placement, 12)
      : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const content = (
      <div ref={ref} data-testid="tour-root">
        {/* Overlay */}
        <div
          className={overlaySlot.className}
          style={overlaySlot.style}
          data-testid="tour-overlay"
          aria-hidden="true"
        />

        {/* Spotlight */}
        {targetRect && (
          <div
            className={spotlightSlot.className}
            style={{
              ...spotlightSlot.style,
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
            }}
            data-testid="tour-spotlight"
          />
        )}

        {/* Popover */}
        <div
          className={combinedPopoverClassName}
          style={{ ...popoverSlot.style, ...popoverPos, ...styleProp }}
          role="dialog"
          aria-modal="false"
          data-testid="tour-popover"
        >
          {currentStep.title && (
            <div className={titleSlot.className} style={titleSlot.style} data-testid="tour-title">
              {currentStep.title}
            </div>
          )}
          <div className={descSlot.className} style={descSlot.style} data-testid="tour-description">
            {currentStep.description}
          </div>
          <div className={footerSlot.className} style={footerSlot.style} data-testid="tour-footer">
            <span className={stepIndSlot.className} style={stepIndSlot.style} data-testid="tour-step-indicator">
              {ctx.currentStep + 1} / {ctx.totalSteps}
            </span>
            <div className={tourButtonGroupStyle}>
              {showSkip && !isLast && (
                <button
                  className={skipSlot.className}
                  style={skipSlot.style}
                  onClick={handleSkip}
                  type="button"
                  data-testid="tour-skip"
                >
                  {skipLabel}
                </button>
              )}
              {!isFirst && (
                <button
                  className={prevSlot.className}
                  style={prevSlot.style}
                  onClick={handlePrev}
                  type="button"
                  data-testid="tour-prev"
                >
                  {prevLabel}
                </button>
              )}
              <button
                className={nextSlot.className}
                style={nextSlot.style}
                onClick={handleNext}
                type="button"
                data-testid="tour-next"
              >
                {isLast ? finishLabel : nextLabel}
              </button>
            </div>
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
 * Tour bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Tour steps={steps} active={true} onComplete={handler} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Tour active={true}>
 *   <Tour.Step>
 *     <Tour.StepTitle>Merhaba</Tour.StepTitle>
 *     <Tour.StepContent>Bu butona tikla</Tour.StepContent>
 *   </Tour.Step>
 *   <Tour.Navigation>...</Tour.Navigation>
 * </Tour>
 * ```
 */
export const Tour = Object.assign(TourBase, {
  Step: TourStepComponent,
  StepTitle: TourStepTitle,
  StepContent: TourStepContent,
  Navigation: TourNavigation,
});
