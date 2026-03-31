/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Stepper — adim adim ilerleme bilesen (Dual API).
 * Stepper — step-by-step progress component (Dual API).
 *
 * Props-based: `<Stepper steps={[{title:'A'},{title:'B'}]} activeIndex={1} />`
 * Compound:    `<Stepper activeIndex={1}><Stepper.Step index={0}>...</Stepper.Step></Stepper>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import { CheckIcon } from '@relteco/relui-icons';
import type { StepStatus } from '@relteco/relui-core';
import {
  rootStyle,
  horizontalStyle,
  verticalStyle,
  stepStyle,
  stepVerticalStyle,
  indicatorBaseStyle,
  indicatorStatusStyles,
  titleStyle,
  descriptionStyle,
  connectorStyle,
  connectorCompletedStyle,
  connectorVerticalStyle,
} from './stepper.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Stepper slot isimleri / Stepper slot names. */
export type StepperSlot = 'root' | 'step' | 'indicator' | 'title' | 'description' | 'connector';

// ── Types ─────────────────────────────────────────────

/** Stepper yonu / Stepper orientation */
export type StepperOrientation = 'horizontal' | 'vertical';

/** Props-based adim tanimi / Props-based step definition */
export interface StepperStepDef {
  /** Adim basligi / Step title */
  title: string;
  /** Adim aciklamasi / Step description */
  description?: string;
  /** Ozel ikon / Custom icon */
  icon?: ReactNode;
}

// ── Context (Compound API) ──────────────────────────

interface StepperContextValue {
  activeIndex: number;
  steps: readonly { status: StepStatus }[];
  orientation: StepperOrientation;
  stepCount: number;
  classNames: ClassNames<StepperSlot> | undefined;
  styles: Styles<StepperSlot> | undefined;
}

const StepperContext = createContext<StepperContextValue | null>(null);

function useStepperContext(): StepperContextValue {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error('Stepper compound sub-components must be used within <Stepper>.');
  return ctx;
}

// ── Compound: Stepper.Step ───────────────────────────

/** Stepper.Step props */
export interface StepperStepProps {
  /** Adim indeksi / Step index */
  index: number;
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const StepperStep = forwardRef<HTMLDivElement, StepperStepProps>(
  function StepperStep(props, ref) {
    const { index, children, className } = props;
    const ctx = useStepperContext();
    const status = ctx.steps[index]?.status ?? 'pending';
    const isVertical = ctx.orientation === 'vertical';

    const baseClass = isVertical ? `${stepStyle} ${stepVerticalStyle}` : stepStyle;
    const slot = getSlotProps('step', baseClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="stepper-step"
        data-status={status}
        role="listitem"
        aria-current={status === 'active' ? 'step' : undefined}
      >
        {children}
      </div>
    );
  },
);

// ── Compound: Stepper.Indicator ─────────────────────

/** Stepper.Indicator props */
export interface StepperIndicatorProps {
  /** Adim indeksi / Step index */
  index: number;
  /** Ozel ikon / Custom icon */
  icon?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const StepperIndicator = forwardRef<HTMLDivElement, StepperIndicatorProps>(
  function StepperIndicator(props, ref) {
    const { index, icon, className } = props;
    const ctx = useStepperContext();
    const status = ctx.steps[index]?.status ?? 'pending';

    const indicatorCls = `${indicatorBaseStyle} ${indicatorStatusStyles[status as keyof typeof indicatorStatusStyles]}`;
    const slot = getSlotProps('indicator', indicatorCls, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    let content: ReactNode;
    if (icon) {
      content = icon;
    } else if (status === 'completed') {
      content = <CheckIcon size={16} />;
    } else {
      content = index + 1;
    }

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="stepper-indicator"
      >
        {content}
      </div>
    );
  },
);

// ── Compound: Stepper.Title ─────────────────────────

/** Stepper.Title props */
export interface StepperTitleProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const StepperTitle = forwardRef<HTMLSpanElement, StepperTitleProps>(
  function StepperTitle(props, ref) {
    const { children, className } = props;
    const ctx = useStepperContext();
    const slot = getSlotProps('title', titleStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="stepper-title"
      >
        {children}
      </span>
    );
  },
);

// ── Compound: Stepper.Description ───────────────────

/** Stepper.Description props */
export interface StepperDescriptionProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const StepperDescription = forwardRef<HTMLSpanElement, StepperDescriptionProps>(
  function StepperDescription(props, ref) {
    const { children, className } = props;
    const ctx = useStepperContext();
    const slot = getSlotProps('description', descriptionStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="stepper-description"
      >
        {children}
      </span>
    );
  },
);

// ── Compound: Stepper.Connector ─────────────────────

/** Stepper.Connector props */
export interface StepperConnectorProps {
  /** Adim indeksi / Step index */
  index: number;
  /** Ek className / Additional className */
  className?: string;
}

const StepperConnector = forwardRef<HTMLDivElement, StepperConnectorProps>(
  function StepperConnector(props, ref) {
    const { index, className } = props;
    const ctx = useStepperContext();
    const status = ctx.steps[index]?.status ?? 'pending';
    const isVertical = ctx.orientation === 'vertical';

    let connCls = connectorStyle;
    if (status === 'completed') {
      connCls = `${connectorStyle} ${connectorCompletedStyle}`;
    }
    if (isVertical) {
      connCls = `${connCls} ${connectorVerticalStyle}`;
    }

    const slot = getSlotProps('connector', connCls, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="stepper-connector"
      />
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface StepperComponentProps extends SlotStyleProps<StepperSlot> {
  /** Props-based: adim tanimlari / Step definitions */
  steps?: StepperStepDef[];
  /** Aktif adim indeksi / Active step index */
  activeIndex?: number;
  /** Adim degistiginde callback / On step change callback */
  onStepChange?: (index: number) => void;
  /** Yon / Orientation */
  orientation?: StepperOrientation;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const StepperBase = forwardRef<HTMLDivElement, StepperComponentProps>(
  function Stepper(props, ref) {
    const {
      steps: stepDefs,
      activeIndex = 0,
      orientation = 'horizontal',
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    // ── Build steps context from activeIndex ──
    const stepsCtx: { status: StepStatus }[] = [];

    if (stepDefs) {
      for (let i = 0; i < stepDefs.length; i++) {
        let status: StepStatus = 'pending';
        if (i < activeIndex) status = 'completed';
        else if (i === activeIndex) status = 'active';
        stepsCtx.push({ status });
      }
    }

    // ── Slots ──
    const orientationCls = orientation === 'vertical' ? verticalStyle : horizontalStyle;
    const rootSlot = getSlotProps('root', `${rootStyle} ${orientationCls}`, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: StepperContextValue = {
      activeIndex,
      steps: stepsCtx,
      orientation,
      stepCount: stepDefs ? stepDefs.length : 0,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      // For compound, we need to count children for stepCount context
      // The user provides step data via sub-components
      const compoundCtx: StepperContextValue = {
        activeIndex,
        steps: [],
        orientation,
        stepCount: 0,
        classNames,
        styles,
      };

      // Build a dynamic steps array based on activeIndex up to a reasonable limit
      // We derive steps from the activeIndex + expected number
      const derivedSteps: { status: StepStatus }[] = [];
      for (let i = 0; i < 100; i++) {
        let status: StepStatus = 'pending';
        if (i < activeIndex) status = 'completed';
        else if (i === activeIndex) status = 'active';
        derivedSteps.push({ status });
      }
      compoundCtx.steps = derivedSteps;

      return (
        <StepperContext.Provider value={compoundCtx}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="stepper-root"
            data-orientation={orientation}
            role="list"
          >
            {children}
          </div>
        </StepperContext.Provider>
      );
    }

    // ── Props-based API ──
    if (!stepDefs) return null;

    return (
      <StepperContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="stepper-root"
          data-orientation={orientation}
          role="list"
        >
          {stepDefs.map((step, i) => {
            const status = stepsCtx[i]?.status ?? 'pending';
            const isLast = i === stepDefs.length - 1;
            const isVertical = orientation === 'vertical';

            // Step container
            const stepBaseCls = isVertical
              ? `${stepStyle} ${stepVerticalStyle}`
              : stepStyle;
            const stepSlot = getSlotProps('step', stepBaseCls, classNames, styles);

            // Indicator
            const indicCls = `${indicatorBaseStyle} ${indicatorStatusStyles[status as keyof typeof indicatorStatusStyles]}`;
            const indicSlot = getSlotProps('indicator', indicCls, classNames, styles);

            let indicContent: ReactNode;
            if (step.icon) {
              indicContent = step.icon;
            } else if (status === 'completed') {
              indicContent = <CheckIcon size={16} />;
            } else {
              indicContent = i + 1;
            }

            // Title
            const titleSlot = getSlotProps('title', titleStyle, classNames, styles);

            // Description
            const descSlot = getSlotProps('description', descriptionStyle, classNames, styles);

            // Connector
            let connCls = connectorStyle;
            if (status === 'completed') {
              connCls = `${connectorStyle} ${connectorCompletedStyle}`;
            }
            if (isVertical) {
              connCls = `${connCls} ${connectorVerticalStyle}`;
            }
            const connSlot = getSlotProps('connector', connCls, classNames, styles);

            return (
              <div
                key={i}
                className={stepSlot.className}
                style={stepSlot.style}
                data-testid="stepper-step"
                data-status={status}
                role="listitem"
                aria-current={status === 'active' ? 'step' : undefined}
              >
                <div
                  className={indicSlot.className}
                  style={indicSlot.style}
                  data-testid="stepper-indicator"
                >
                  {indicContent}
                </div>
                <div>
                  <span
                    className={titleSlot.className}
                    style={titleSlot.style}
                    data-testid="stepper-title"
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span
                      className={descSlot.className}
                      style={descSlot.style}
                      data-testid="stepper-description"
                    >
                      {step.description}
                    </span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={connSlot.className}
                    style={connSlot.style}
                    data-testid="stepper-connector"
                  />
                )}
              </div>
            );
          })}
        </div>
      </StepperContext.Provider>
    );
  },
);

/**
 * Stepper bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Stepper
 *   steps={[{ title: 'Bilgi' }, { title: 'Onay' }, { title: 'Tamamla' }]}
 *   activeIndex={1}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Stepper activeIndex={1}>
 *   <Stepper.Step index={0}>
 *     <Stepper.Indicator index={0} />
 *     <Stepper.Title>Bilgi</Stepper.Title>
 *   </Stepper.Step>
 *   <Stepper.Connector index={0} />
 *   <Stepper.Step index={1}>
 *     <Stepper.Indicator index={1} />
 *     <Stepper.Title>Onay</Stepper.Title>
 *   </Stepper.Step>
 * </Stepper>
 * ```
 */
export const Stepper = Object.assign(StepperBase, {
  Step: StepperStep,
  Indicator: StepperIndicator,
  Title: StepperTitle,
  Description: StepperDescription,
  Connector: StepperConnector,
});
