/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Chip — styled React chip component (Dual API).
 * Chip — stilize edilmis React chip bileseni (Dual API).
 *
 * Props-based: `<Chip removable onRemove={fn}>Filtre</Chip>`
 * Compound:    `<Chip><Chip.Icon>...</Chip.Icon>Filtre<Chip.RemoveButton /></Chip>`
 *
 * @packageDocumentation
 */

import { forwardRef, useCallback, createContext, useContext, type ReactNode } from 'react';
import type { ChipSize, ChipColor } from '@relteco/relui-core';
import { CloseIcon } from '@relteco/relui-icons';
import { chipRecipe, chipIconStyle, chipRemoveButtonStyle } from './chip.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Chip slot isimleri. */
export type ChipSlot = 'root' | 'icon' | 'removeButton';

// ── Context (Compound API) ──────────────────────────

interface ChipContextValue {
  size: ChipSize;
  color: ChipColor;
  selected: boolean;
  disabled: boolean;
  onRemove: (() => void) | undefined;
  classNames: ClassNames<ChipSlot> | undefined;
  styles: Styles<ChipSlot> | undefined;
}

const ChipContext = createContext<ChipContextValue | null>(null);

function useChipContext(): ChipContextValue {
  const ctx = useContext(ChipContext);
  if (!ctx) throw new Error('Chip compound sub-components must be used within <Chip>.');
  return ctx;
}

// ── Compound: Chip.Icon ─────────────────────────────

/** Chip.Icon props */
export interface ChipIconProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ChipIcon = forwardRef<HTMLSpanElement, ChipIconProps>(
  function ChipIcon(props, ref) {
    const { children, className } = props;
    const ctx = useChipContext();
    const slot = getSlotProps('icon', chipIconStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="chip-icon">
        {children}
      </span>
    );
  },
);

// ── Compound: Chip.RemoveButton ─────────────────────

/** Chip.RemoveButton props */
export interface ChipRemoveButtonProps {
  /** Ek className / Additional className */
  className?: string;
  /** Aria label */
  'aria-label'?: string;
}

const ChipRemoveButton = forwardRef<HTMLSpanElement, ChipRemoveButtonProps>(
  function ChipRemoveButton(props, ref) {
    const { className, 'aria-label': ariaLabel = 'Kaldır' } = props;
    const ctx = useChipContext();
    const slot = getSlotProps('removeButton', chipRemoveButtonStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const handleClick = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        if (ctx.disabled) return;
        ctx.onRemove?.();
      },
      [ctx.disabled, ctx.onRemove],
    );

    return (
      <span
        ref={ref}
        role="button"
        tabIndex={ctx.disabled ? -1 : 0}
        className={cls}
        style={slot.style}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleClick(e as unknown as React.MouseEvent);
        }}
        aria-label={ariaLabel}
        data-testid="chip-remove"
      >
        <CloseIcon size="0.75em" />
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

/**
 * Chip bilesen props'lari.
 * Chip component props.
 */
export interface ChipComponentProps extends SlotStyleProps<ChipSlot> {
  /** Boyut / Size */
  size?: ChipSize;

  /** Renk semasi / Color scheme */
  color?: ChipColor;

  /** Secili durumu / Selected state */
  selected?: boolean;

  /** Secim callback'i / Selection callback */
  onSelectedChange?: (selected: boolean) => void;

  /** Kaldirilabilir mi / Is removable */
  removable?: boolean;

  /** Kaldirma callback'i / Remove callback */
  onRemove?: () => void;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Ek CSS sinifi / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** Icerik / Content */
  children?: ReactNode;
}

// ── Component ─────────────────────────────────────────

const ChipBase = forwardRef<HTMLButtonElement, ChipComponentProps>(function Chip(
  {
    size = 'md',
    color = 'accent',
    selected = false,
    onSelectedChange,
    removable = false,
    onRemove,
    disabled = false,
    className,
    id,
    style: inlineStyle,
    classNames,
    styles,
    children,
  },
  forwardedRef,
) {
  const recipeClass = chipRecipe({ size, color, selected });
  const rootSlot = getSlotProps('root', recipeClass, classNames, styles, inlineStyle);
  const combinedClassName = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;

  const removeBtnSlot = getSlotProps('removeButton', chipRemoveButtonStyle, classNames, styles);

  const handleClick = useCallback(() => {
    if (disabled) return;
    onSelectedChange?.(!selected);
  }, [disabled, selected, onSelectedChange]);

  const handleRemoveClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (disabled) return;
      onRemove?.();
    },
    [disabled, onRemove],
  );

  const ctxValue: ChipContextValue = {
    size,
    color,
    selected,
    disabled,
    onRemove,
    classNames,
    styles,
  };

  return (
    <ChipContext.Provider value={ctxValue}>
      <button
        ref={forwardedRef}
        type="button"
        id={id}
        className={combinedClassName}
        style={rootSlot.style}
        onClick={handleClick}
        disabled={disabled}
        data-selected={selected ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        aria-pressed={selected}
        role="option"
        aria-selected={selected}
      >
        {children}
        {removable && (
          <span
            role="button"
            tabIndex={disabled ? -1 : 0}
            className={removeBtnSlot.className}
            style={removeBtnSlot.style}
            onClick={handleRemoveClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ')
                handleRemoveClick(e as unknown as React.MouseEvent);
            }}
            aria-label="Kaldır"
            data-testid="chip-removebutton"
          >
            <CloseIcon size="0.75em" />
          </span>
        )}
      </button>
    </ChipContext.Provider>
  );
});

/**
 * Chip bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Chip selected={isActive} onSelectedChange={setIsActive}>Filtre</Chip>
 * <Chip removable onRemove={handleRemove}>Secili oge</Chip>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Chip selected onRemove={handleRemove}>
 *   <Chip.Icon><FilterIcon /></Chip.Icon>
 *   Filtre
 *   <Chip.RemoveButton />
 * </Chip>
 * ```
 */
export const Chip = Object.assign(ChipBase, {
  Icon: ChipIcon,
  RemoveButton: ChipRemoveButton,
});
