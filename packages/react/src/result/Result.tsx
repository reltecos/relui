/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Result — sonuc sayfasi bilesen (Dual API).
 * Result — result page component (Dual API).
 *
 * Props-based: `<Result status="success" title="Odeme basarili!" />`
 * Compound:    `<Result><Result.Icon>...</Result.Icon><Result.Title>...</Result.Title></Result>`
 *
 * Basari, hata, uyari, bilgi, 404 durumlari icin.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import {
  resultRootRecipe,
  resultIconRecipe,
  resultTitleRecipe,
  resultSubtitleRecipe,
  resultExtraStyle,
  resultActionStyle,
} from './result.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import {
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  InfoCircleIcon,
  FileXIcon,
} from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * Result slot isimleri / Result slot names.
 */
export type ResultSlot = 'root' | 'icon' | 'title' | 'subtitle' | 'extra' | 'action';

// ── Types ─────────────────────────────────────────────

/** Result durumu / Result status. */
export type ResultStatus = 'success' | 'error' | 'warning' | 'info' | '404';

/** Result boyutu / Result size. */
export type ResultSize = 'sm' | 'md' | 'lg';

// ── Context (Compound API) ──────────────────────────

interface ResultContextValue {
  status: ResultStatus;
  size: ResultSize;
  classNames: ClassNames<ResultSlot> | undefined;
  styles: Styles<ResultSlot> | undefined;
}

const ResultContext = createContext<ResultContextValue | null>(null);

function useResultContext(): ResultContextValue {
  const ctx = useContext(ResultContext);
  if (!ctx) throw new Error('Result compound sub-components must be used within <Result>.');
  return ctx;
}

// ── Compound: Result.Icon ────────────────────────────

/** Result.Icon props */
export interface ResultIconProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ResultIcon = forwardRef<HTMLDivElement, ResultIconProps>(
  function ResultIcon(props, ref) {
    const { children, className } = props;
    const ctx = useResultContext();
    const slot = getSlotProps('icon', resultIconRecipe({ size: ctx.size, status: ctx.status }), ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="result-icon">
        {children}
      </div>
    );
  },
);

// ── Compound: Result.Title ───────────────────────────

/** Result.Title props */
export interface ResultTitleProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ResultTitle = forwardRef<HTMLHeadingElement, ResultTitleProps>(
  function ResultTitle(props, ref) {
    const { children, className } = props;
    const ctx = useResultContext();
    const slot = getSlotProps('title', resultTitleRecipe({ size: ctx.size }), ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <h2 ref={ref} className={cls} style={slot.style} data-testid="result-title">
        {children}
      </h2>
    );
  },
);

// ── Compound: Result.Description ─────────────────────

/** Result.Description props */
export interface ResultDescriptionProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ResultDescription = forwardRef<HTMLParagraphElement, ResultDescriptionProps>(
  function ResultDescription(props, ref) {
    const { children, className } = props;
    const ctx = useResultContext();
    const slot = getSlotProps('subtitle', resultSubtitleRecipe({ size: ctx.size }), ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <p ref={ref} className={cls} style={slot.style} data-testid="result-subtitle">
        {children}
      </p>
    );
  },
);

// ── Compound: Result.Extra ───────────────────────────

/** Result.Extra props */
export interface ResultExtraProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ResultExtra = forwardRef<HTMLDivElement, ResultExtraProps>(
  function ResultExtra(props, ref) {
    const { children, className } = props;
    const ctx = useResultContext();
    const slot = getSlotProps('extra', resultExtraStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="result-extra">
        {children}
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface ResultComponentProps extends SlotStyleProps<ResultSlot> {
  /** Durum / Status */
  status?: ResultStatus;
  /** Baslik / Title */
  title?: ReactNode;
  /** Alt baslik / Subtitle */
  subtitle?: ReactNode;
  /** Ozel ikon / Custom icon */
  icon?: ReactNode;
  /** Ek icerik / Extra content */
  extra?: ReactNode;
  /** Aksiyon alani / Action area */
  action?: ReactNode;
  /** Boyut / Size */
  size?: ResultSize;
  /** Compound API children */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** id */
  id?: string;
}

// ── Default Icons (from @relteco/relui-icons) ────────

const defaultIcons: Record<ResultStatus, typeof InfoCircleIcon> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoCircleIcon,
  '404': FileXIcon,
};

// ── Component ─────────────────────────────────────────

const ResultBase = forwardRef<HTMLDivElement, ResultComponentProps>(
  function Result(props, ref) {
    const {
      status = 'info',
      title,
      subtitle,
      icon,
      extra,
      action,
      size = 'md',
      children,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
    } = props;

    // ── Slots ──
    const rootClass = resultRootRecipe({ size });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const ctxValue: ResultContextValue = { status, size, classNames, styles };

    // ── Compound API ──
    if (children) {
      return (
        <ResultContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={combinedRootClassName}
            style={combinedRootStyle}
            id={id}
            data-testid="result"
            data-status={status}
          >
            {children}
          </div>
        </ResultContext.Provider>
      );
    }

    // ── Props-based API ──
    const iconSlot = getSlotProps('icon', resultIconRecipe({ size, status }), classNames, styles);
    const titleSlot = getSlotProps('title', resultTitleRecipe({ size }), classNames, styles);
    const subtitleSlot = getSlotProps('subtitle', resultSubtitleRecipe({ size }), classNames, styles);
    const extraSlot = getSlotProps('extra', resultExtraStyle, classNames, styles);
    const actionSlot = getSlotProps('action', resultActionStyle, classNames, styles);

    // ── Resolve icon ──
    const DefaultIcon = defaultIcons[status];
    const resolvedIcon = icon !== undefined ? icon : <DefaultIcon size="100%" />;

    return (
      <div
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        data-testid="result"
        data-status={status}
      >
        {resolvedIcon !== null && (
          <div className={iconSlot.className} style={iconSlot.style} data-testid="result-icon">
            {resolvedIcon}
          </div>
        )}

        {title && (
          <h2 className={titleSlot.className} style={titleSlot.style} data-testid="result-title">
            {title}
          </h2>
        )}

        {subtitle && (
          <p className={subtitleSlot.className} style={subtitleSlot.style} data-testid="result-subtitle">
            {subtitle}
          </p>
        )}

        {extra && (
          <div className={extraSlot.className} style={extraSlot.style} data-testid="result-extra">
            {extra}
          </div>
        )}

        {action && (
          <div className={actionSlot.className} style={actionSlot.style} data-testid="result-action">
            {action}
          </div>
        )}
      </div>
    );
  },
);

/**
 * Result bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Result status="success" title="Odeme basarili!" subtitle="Siparisiniz onaylandi." />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Result status="error">
 *   <Result.Icon><XCircleIcon /></Result.Icon>
 *   <Result.Title>Islem basarisiz</Result.Title>
 *   <Result.Description>Bir sorun olustu.</Result.Description>
 *   <Result.Extra>Detaylar...</Result.Extra>
 * </Result>
 * ```
 */
export const Result = Object.assign(ResultBase, {
  Icon: ResultIcon,
  Title: ResultTitle,
  Description: ResultDescription,
  Extra: ResultExtra,
});
