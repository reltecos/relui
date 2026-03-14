/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Result — sonuc sayfasi bilesen.
 * Result — result page component.
 *
 * Basari, hata, uyari, bilgi, 404 durumlari icin.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import {
  resultRootRecipe,
  resultIconRecipe,
  resultTitleRecipe,
  resultSubtitleRecipe,
  resultExtraStyle,
  resultActionStyle,
} from './result.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
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

// ── Component Props ───────────────────────────────────

export interface ResultComponentProps extends SlotStyleProps<ResultSlot> {
  /** Durum / Status */
  status?: ResultStatus;
  /** Baslik / Title */
  title: ReactNode;
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

/**
 * Result bilesen — sonuc sayfasi.
 * Result component — result page.
 *
 * @example
 * ```tsx
 * <Result status="success" title="Odeme basarili!" subtitle="Siparisiniz onaylandi." />
 * <Result status="404" title="Sayfa bulunamadi" action={<Button>Ana Sayfaya Don</Button>} />
 * ```
 */
export const Result = forwardRef<HTMLDivElement, ResultComponentProps>(
  function Result(props, ref) {
    const {
      status = 'info',
      title,
      subtitle,
      icon,
      extra,
      action,
      size = 'md',
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

        <h2 className={titleSlot.className} style={titleSlot.style} data-testid="result-title">
          {title}
        </h2>

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
