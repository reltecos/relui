/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Toast — bildirim bilesen.
 * Toast — notification component.
 *
 * Stack, auto-dismiss, pozisyon, hover pause.
 *
 * @packageDocumentation
 */

import { forwardRef, useEffect, useRef, useState } from 'react';
import {
  toastContainerRecipe,
  toastItemRecipe,
  toastIconStyle,
  toastContentStyle,
  toastTitleStyle,
  toastMessageStyle,
  toastCloseButtonStyle,
  toastProgressBarStyle,
} from './toast.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import type { ToastItem, ToastPosition, ToastStatus } from '@relteco/relui-core';
import {
  InfoCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  CloseIcon,
} from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * Toast slot isimleri / Toast slot names.
 */
export type ToastSlot = 'root' | 'item' | 'icon' | 'content' | 'title' | 'message' | 'closeButton' | 'progressBar';

// ── Animation helper ────────────────────────────────

function getAnimation(position: ToastPosition): 'slide-right' | 'slide-left' | 'slide-down' | 'slide-up' {
  if (position.includes('right')) return 'slide-right';
  if (position.includes('left')) return 'slide-left';
  if (position.startsWith('top')) return 'slide-down';
  return 'slide-up';
}

// ── Default Icons ───────────────────────────────────

const defaultIcons: Record<ToastStatus, typeof InfoCircleIcon> = {
  info: InfoCircleIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  error: XCircleIcon,
};

// ── Component Props ─────────────────────────────────

export interface ToastComponentProps extends SlotStyleProps<ToastSlot> {
  /** Toast listesi / Toast list */
  toasts: ToastItem[];
  /** Pozisyon / Position */
  position?: ToastPosition;
  /** Hover'da duraklat / Pause on hover */
  pauseOnHover?: boolean;
  /** Ilerleme cubugu goster / Show progress bar */
  showProgress?: boolean;
  /** Toast kapat / On close */
  onClose?: (id: string) => void;
  /** Toast duraklat / On pause */
  onPause?: (id: string) => void;
  /** Toast devam ettir / On resume */
  onResume?: (id: string) => void;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** id */
  id?: string;
}

// ── Toast Item Component ────────────────────────────

interface ToastItemComponentProps {
  toast: ToastItem;
  animation: 'slide-right' | 'slide-left' | 'slide-down' | 'slide-up';
  pauseOnHover: boolean;
  showProgress: boolean;
  onClose?: (id: string) => void;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  itemSlot: { className: string; style?: React.CSSProperties };
  iconSlot: { className: string; style?: React.CSSProperties };
  contentSlot: { className: string; style?: React.CSSProperties };
  titleSlot: { className: string; style?: React.CSSProperties };
  messageSlot: { className: string; style?: React.CSSProperties };
  closeBtnSlot: { className: string; style?: React.CSSProperties };
  progressSlot: { className: string; style?: React.CSSProperties };
}

function ToastItemComponent(props: ToastItemComponentProps) {
  const {
    toast,
    animation,
    pauseOnHover,
    showProgress,
    onClose,
    onPause,
    onResume,
    itemSlot,
    iconSlot,
    contentSlot,
    titleSlot,
    messageSlot,
    closeBtnSlot,
    progressSlot,
  } = props;

  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!showProgress || toast.duration <= 0 || toast.paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const startTime = Date.now();
    const totalDuration = toast.remaining;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, totalDuration - elapsed);
      setProgress((remaining / toast.duration) * 100);
      if (remaining <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [showProgress, toast.duration, toast.paused, toast.remaining]);

  const Icon = defaultIcons[toast.status];
  const itemClass = toastItemRecipe({ status: toast.status, animation });

  return (
    <div
      className={itemSlot.className ? `${itemClass} ${itemSlot.className}` : itemClass}
      style={itemSlot.style}
      data-testid="toast-item"
      data-status={toast.status}
      onPointerEnter={pauseOnHover ? () => onPause?.(toast.id) : undefined}
      onPointerLeave={pauseOnHover ? () => onResume?.(toast.id) : undefined}
    >
      <span className={iconSlot.className} style={iconSlot.style}>
        <Icon size={18} />
      </span>

      <div className={contentSlot.className} style={contentSlot.style}>
        {toast.title && (
          <div className={titleSlot.className} style={titleSlot.style} data-testid="toast-title">
            {toast.title}
          </div>
        )}
        <div className={messageSlot.className} style={messageSlot.style} data-testid="toast-message">
          {toast.message}
        </div>
      </div>

      {toast.closable && (
        <button
          className={closeBtnSlot.className}
          style={closeBtnSlot.style}
          onClick={() => onClose?.(toast.id)}
          type="button"
          aria-label="Close"
          data-testid="toast-close"
        >
          <CloseIcon size={12} />
        </button>
      )}

      {showProgress && toast.duration > 0 && (
        <div
          className={progressSlot.className}
          style={{ ...progressSlot.style, width: `${progress}%` }}
          data-testid="toast-progress"
        />
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────

/**
 * Toast bilesen — bildirim stack.
 * Toast component — notification stack.
 *
 * @example
 * ```tsx
 * const { toasts, add, remove, pause, resume } = useToast();
 *
 * <button onClick={() => add({ message: 'Kaydedildi!', status: 'success' })}>
 *   Kaydet
 * </button>
 *
 * <Toast
 *   toasts={toasts}
 *   position="top-right"
 *   pauseOnHover
 *   showProgress
 *   onClose={remove}
 *   onPause={pause}
 *   onResume={resume}
 * />
 * ```
 */
export const Toast = forwardRef<HTMLDivElement, ToastComponentProps>(
  function Toast(props, ref) {
    const {
      toasts,
      position = 'top-right',
      pauseOnHover = true,
      showProgress = false,
      onClose,
      onPause,
      onResume,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
    } = props;

    if (toasts.length === 0) return null;

    // ── Slots ──
    const rootClass = toastContainerRecipe({ position });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const itemSlot = getSlotProps('item', '', classNames, styles);
    const iconSlot = getSlotProps('icon', toastIconStyle, classNames, styles);
    const contentSlot = getSlotProps('content', toastContentStyle, classNames, styles);
    const titleSlot = getSlotProps('title', toastTitleStyle, classNames, styles);
    const messageSlot = getSlotProps('message', toastMessageStyle, classNames, styles);
    const closeBtnSlot = getSlotProps('closeButton', toastCloseButtonStyle, classNames, styles);
    const progressSlot = getSlotProps('progressBar', toastProgressBarStyle, classNames, styles);

    const animation = getAnimation(position);

    return (
      <div
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        data-testid="toast-container"
        role="region"
        aria-label="Bildirimler"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <ToastItemComponent
            key={toast.id}
            toast={toast}
            animation={animation}
            pauseOnHover={pauseOnHover}
            showProgress={showProgress}
            onClose={onClose}
            onPause={onPause}
            onResume={onResume}
            itemSlot={itemSlot}
            iconSlot={iconSlot}
            contentSlot={contentSlot}
            titleSlot={titleSlot}
            messageSlot={messageSlot}
            closeBtnSlot={closeBtnSlot}
            progressSlot={progressSlot}
          />
        ))}
      </div>
    );
  },
);
