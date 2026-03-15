/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CopyButton — styled React copy-to-clipboard button component (Dual API).
 * CopyButton — stilize edilmis React panoya kopyalama buton bileseni (Dual API).
 *
 * Props-based: `<CopyButton value="text" aria-label="Kopyala" />`
 * Compound:    `<CopyButton value="text" aria-label="Kopyala"><CopyButton.Icon /><CopyButton.Label>Kopyala</CopyButton.Label></CopyButton>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { ButtonVariant, ButtonSize, ButtonColor } from '@relteco/relui-core';
import { CopyIcon, CheckIcon } from '@relteco/relui-icons';
import { useButton, type UseButtonProps } from '../button/useButton';
import { buttonRecipe, iconButtonSizeRecipe } from './copy-button.css';
import { useCopyButton } from './useCopyButton';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import type { ClassNames, Styles } from '../utils/slot-styles';

/** CopyButton slot isimleri. */
export type CopyButtonSlot = 'root' | 'icon' | 'label';

// ── Context (Compound API) ──────────────────────────

interface CopyButtonContextValue {
  copied: boolean;
  classNames: ClassNames<CopyButtonSlot> | undefined;
  styles: Styles<CopyButtonSlot> | undefined;
  copyIcon: ReactNode;
  copiedIcon: ReactNode;
}

const CopyButtonContext = createContext<CopyButtonContextValue | null>(null);

/** CopyButton compound context hook. */
export function useCopyButtonContext(): CopyButtonContextValue {
  const ctx = useContext(CopyButtonContext);
  if (!ctx) throw new Error('CopyButton compound sub-components must be used within <CopyButton>.');
  return ctx;
}

// ── Compound: CopyButton.Icon ───────────────────────

/** CopyButton.Icon props */
export interface CopyButtonIconProps {
  /** Ek className / Additional className */
  className?: string;
}

const CopyButtonIcon = forwardRef<HTMLSpanElement, CopyButtonIconProps>(
  function CopyButtonIcon(props, ref) {
    const { className } = props;
    const ctx = useCopyButtonContext();

    const iconSlot = getSlotProps('icon', undefined, ctx.classNames, ctx.styles);
    const cls = [iconSlot.className, className].filter(Boolean).join(' ') || undefined;

    return (
      <span
        ref={ref}
        className={cls}
        style={iconSlot.style}
        aria-hidden="true"
        data-testid="copy-button-icon"
      >
        {ctx.copied ? ctx.copiedIcon : ctx.copyIcon}
      </span>
    );
  },
);

// ── Compound: CopyButton.Label ──────────────────────

/** CopyButton.Label props */
export interface CopyButtonLabelProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CopyButtonLabel = forwardRef<HTMLSpanElement, CopyButtonLabelProps>(
  function CopyButtonLabel(props, ref) {
    const { children, className } = props;
    const ctx = useCopyButtonContext();

    const labelSlot = getSlotProps('label', undefined, ctx.classNames, ctx.styles);
    const cls = [labelSlot.className, className].filter(Boolean).join(' ') || undefined;

    return (
      <span
        ref={ref}
        className={cls}
        style={labelSlot.style}
        data-testid="copy-button-label"
      >
        {children}
      </span>
    );
  },
);

/**
 * CopyButton bilesen props'lari.
 * CopyButton component props.
 */
export interface CopyButtonComponentProps extends SlotStyleProps<CopyButtonSlot> {
  /** Kopyalanacak metin / Text to copy */
  value: string;

  /** Gorsel varyant / Visual variant */
  variant?: ButtonVariant;

  /** Boyut / Size */
  size?: ButtonSize;

  /** Renk semasi / Color scheme */
  color?: ButtonColor;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /**
   * Kopyalama sonrasi onay suresi (ms) / Copied confirmation duration (ms).
   *
   * @default 2000
   */
  copiedDuration?: number;

  /** Kopyalama sonrasi callback / Callback after copy */
  onCopy?: () => void;

  /**
   * Kopyala ikonu / Copy icon (kopyalanmadan once gosterilir).
   * Varsayilan: CopyIcon.
   */
  copyIcon?: ReactNode;

  /**
   * Kopyalandi ikonu / Copied icon (kopyalandiktan sonra gosterilir).
   * Varsayilan: CheckIcon.
   */
  copiedIcon?: ReactNode;

  /**
   * Erisilebilirlik etiketi — ZORUNLU.
   * Accessibility label — REQUIRED.
   */
  'aria-label': string;

  /** Ek CSS sinifi / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

// ── Component ─────────────────────────────────────────

const CopyButtonBase = forwardRef<HTMLButtonElement, CopyButtonComponentProps>(
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
      children,
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

    // Varsayilan ikonlar / Default icons
    const currentCopyIcon = copyIcon ?? <CopyIcon />;
    const currentCopiedIcon = copiedIcon ?? <CheckIcon />;

    const ctxValue: CopyButtonContextValue = {
      copied,
      classNames,
      styles,
      copyIcon: currentCopyIcon,
      copiedIcon: currentCopiedIcon,
    };

    // ── Compound API ──
    if (children) {
      return (
        <CopyButtonContext.Provider value={ctxValue}>
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
            {children}
          </button>
        </CopyButtonContext.Provider>
      );
    }

    // ── Props-based API ──
    const iconSlot = getSlotProps('icon', undefined, classNames, styles);

    return (
      <CopyButtonContext.Provider value={ctxValue}>
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
      </CopyButtonContext.Provider>
    );
  },
);

/**
 * CopyButton — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <CopyButton value="Kopyalanacak metin" aria-label="Kopyala" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <CopyButton value="text" aria-label="Kopyala">
 *   <CopyButton.Icon />
 *   <CopyButton.Label>Kopyala</CopyButton.Label>
 * </CopyButton>
 * ```
 */
export const CopyButton = Object.assign(CopyButtonBase, {
  Icon: CopyButtonIcon,
  Label: CopyButtonLabel,
});
