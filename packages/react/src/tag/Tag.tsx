/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tag — styled React tag component (Dual API).
 * Tag — stilize edilmis React tag bileseni (Dual API).
 *
 * Props-based: `<Tag removable onRemove={fn}>React</Tag>`
 * Compound:    `<Tag><Tag.Icon>...</Tag.Icon>React<Tag.RemoveButton /></Tag>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { TagSize, TagColor, TagVariant } from '@relteco/relui-core';
import { CloseIcon } from '@relteco/relui-icons';
import { tagRecipe, tagIconStyle, tagRemoveButtonStyle } from './tag.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Tag slot isimleri. */
export type TagSlot = 'root' | 'icon' | 'removeButton';

// ── Context (Compound API) ──────────────────────────

interface TagContextValue {
  size: TagSize;
  color: TagColor;
  variant: TagVariant;
  disabled: boolean;
  onRemove: (() => void) | undefined;
  classNames: ClassNames<TagSlot> | undefined;
  styles: Styles<TagSlot> | undefined;
}

const TagContext = createContext<TagContextValue | null>(null);

function useTagContext(): TagContextValue {
  const ctx = useContext(TagContext);
  if (!ctx) throw new Error('Tag compound sub-components must be used within <Tag>.');
  return ctx;
}

// ── Compound: Tag.Icon ──────────────────────────────

/** Tag.Icon props */
export interface TagIconProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const TagIcon = forwardRef<HTMLSpanElement, TagIconProps>(
  function TagIcon(props, ref) {
    const { children, className } = props;
    const ctx = useTagContext();
    const slot = getSlotProps('icon', tagIconStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="tag-icon">
        {children}
      </span>
    );
  },
);

// ── Compound: Tag.RemoveButton ──────────────────────

/** Tag.RemoveButton props */
export interface TagRemoveButtonProps {
  /** Ek className / Additional className */
  className?: string;
  /** Aria label */
  'aria-label'?: string;
}

const TagRemoveButton = forwardRef<HTMLButtonElement, TagRemoveButtonProps>(
  function TagRemoveButton(props, ref) {
    const { className, 'aria-label': ariaLabel = 'Kaldır' } = props;
    const ctx = useTagContext();
    const slot = getSlotProps('removeButton', tagRemoveButtonStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={slot.style}
        onClick={ctx.onRemove}
        disabled={ctx.disabled}
        aria-label={ariaLabel}
        tabIndex={ctx.disabled ? -1 : 0}
        data-testid="tag-remove"
      >
        <CloseIcon size="0.75em" />
      </button>
    );
  },
);

// ── Component Props ───────────────────────────────────

/**
 * Tag bilesen props'lari.
 * Tag component props.
 */
export interface TagComponentProps extends SlotStyleProps<TagSlot> {
  /** Boyut / Size */
  size?: TagSize;

  /** Renk semasi / Color scheme */
  color?: TagColor;

  /** Gorunum varyanti / Visual variant */
  variant?: TagVariant;

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

const TagBase = forwardRef<HTMLSpanElement, TagComponentProps>(function Tag(
  {
    size = 'md',
    color = 'accent',
    variant = 'soft',
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
  const recipeClass = tagRecipe({ size, color, variant });
  const rootSlot = getSlotProps('root', recipeClass, classNames, styles, inlineStyle);
  const combinedClassName = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;

  const removeBtnSlot = getSlotProps('removeButton', tagRemoveButtonStyle, classNames, styles);

  const ctxValue: TagContextValue = {
    size,
    color,
    variant,
    disabled,
    onRemove,
    classNames,
    styles,
  };

  return (
    <TagContext.Provider value={ctxValue}>
      <span
        ref={forwardedRef}
        id={id}
        className={combinedClassName}
        style={rootSlot.style}
        data-disabled={disabled ? '' : undefined}
        data-testid="tag-root"
      >
        {children}
        {removable && (
          <button
            type="button"
            className={removeBtnSlot.className}
            style={removeBtnSlot.style}
            onClick={onRemove}
            disabled={disabled}
            aria-label="Kaldır"
            tabIndex={disabled ? -1 : 0}
          >
            <CloseIcon size="0.75em" />
          </button>
        )}
      </span>
    </TagContext.Provider>
  );
});

/**
 * Tag bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Tag color="success">React</Tag>
 * <Tag removable onRemove={() => handleRemove('ts')}>TypeScript</Tag>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Tag color="success">
 *   <Tag.Icon><CodeIcon /></Tag.Icon>
 *   React
 *   <Tag.RemoveButton />
 * </Tag>
 * ```
 */
export const Tag = Object.assign(TagBase, {
  Icon: TagIcon,
  RemoveButton: TagRemoveButton,
});
