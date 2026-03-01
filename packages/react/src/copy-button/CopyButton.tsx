/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CopyButton — styled React copy-to-clipboard button component.
 * CopyButton — stilize edilmiş React panoya kopyalama buton bileşeni.
 *
 * IconButton bileşenini temel alır, kopyalama sonrası CopyIcon → CheckIcon swap.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { ButtonVariant, ButtonSize, ButtonColor } from '@relteco/relui-core';
import { CopyIcon, CheckIcon } from '@relteco/relui-icons';
import { useButton, type UseButtonProps } from '../button/useButton';
import { buttonRecipe } from '../button/button.css';
import { iconButtonSizeRecipe } from '../icon-button/icon-button.css';
import { useCopyButton } from './useCopyButton';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** CopyButton slot isimleri. */
export type CopyButtonSlot = 'root' | 'icon';

/**
 * CopyButton bileşen props'ları.
 * CopyButton component props.
 */
export interface CopyButtonComponentProps extends SlotStyleProps<CopyButtonSlot> {
  /** Kopyalanacak metin / Text to copy */
  value: string;

  /** Görsel varyant / Visual variant */
  variant?: ButtonVariant;

  /** Boyut / Size */
  size?: ButtonSize;

  /** Renk şeması / Color scheme */
  color?: ButtonColor;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /**
   * Kopyalama sonrası onay süresi (ms) / Copied confirmation duration (ms).
   *
   * @default 2000
   */
  copiedDuration?: number;

  /** Kopyalama sonrası callback / Callback after copy */
  onCopy?: () => void;

  /**
   * Kopyala ikonu / Copy icon (kopyalanmadan önce gösterilir).
   * Varsayılan: CopyIcon.
   */
  copyIcon?: ReactNode;

  /**
   * Kopyalandı ikonu / Copied icon (kopyalandıktan sonra gösterilir).
   * Varsayılan: CheckIcon.
   */
  copiedIcon?: ReactNode;

  /**
   * Erişilebilirlik etiketi — ZORUNLU.
   * Accessibility label — REQUIRED.
   */
  'aria-label': string;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;
}

/**
 * CopyButton — RelUI panoya kopyalama buton bileşeni.
 * CopyButton — RelUI copy-to-clipboard button component.
 *
 * Kare boyutlu, kopyalama sonrası kısa süre onay ikonu gösterir.
 * IconButton pattern'ını reuse eder.
 *
 * @example
 * ```tsx
 * <CopyButton value="Kopyalanacak metin" aria-label="Kopyala" />
 *
 * <CopyButton
 *   value={apiKey}
 *   aria-label="API anahtarını kopyala"
 *   variant="ghost"
 *   color="neutral"
 *   copiedDuration={3000}
 * />
 *
 * <CopyButton
 *   value={code}
 *   aria-label="Kodu kopyala"
 *   copyIcon={<MyCopyIcon />}
 *   copiedIcon={<MyCheckIcon />}
 * />
 * ```
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonComponentProps>(
  function CopyButton(
    {
      value,
      variant = 'ghost',
      size = 'md',
      color = 'neutral',
      disabled = false,
      copiedDuration,
      onCopy,
      copyIcon,
      copiedIcon,
      'aria-label': ariaLabel,
      className,
      id,
      style: inlineStyle,
      classNames,
      styles,
    },
    forwardedRef,
  ) {
    const { copied, copy } = useCopyButton({
      value,
      copiedDuration,
      disabled,
      onCopy,
    });

    const buttonHookProps: UseButtonProps = { disabled };
    const { buttonProps } = useButton(buttonHookProps);

    const baseClass = buttonRecipe({ variant, size, color });
    const squareClass = iconButtonSizeRecipe({ size });
    const veRootClass = `${baseClass} ${squareClass}`;
    const rootSlot = getSlotProps('root', veRootClass, classNames, styles, inlineStyle);
    const combinedClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const iconSlot = getSlotProps('icon', undefined, classNames, styles);

    // Varsayılan ikonlar / Default icons
    const currentCopyIcon = copyIcon ?? <CopyIcon />;
    const currentCopiedIcon = copiedIcon ?? <CheckIcon />;

    return (
      <button
        {...buttonProps}
        ref={forwardedRef}
        id={id}
        className={combinedClassName}
        style={rootSlot.style}
        aria-label={ariaLabel}
        onClick={copy}
        data-copied={copied ? '' : undefined}
      >
        <span
          className={iconSlot.className || undefined}
          style={iconSlot.style}
          aria-hidden="true"
        >
          {copied ? currentCopiedIcon : currentCopyIcon}
        </span>
      </button>
    );
  },
);
