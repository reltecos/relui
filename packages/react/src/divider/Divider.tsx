/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Divider — yatay veya dikey ayirici cizgi bileseni (Dual API).
 *
 * Props-based: `<Divider label="veya" />`
 * Compound:    `<Divider><Divider.Label>veya</Divider.Label></Divider>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type HTMLAttributes, type CSSProperties, type Ref, type ReactNode } from 'react';
import {
  dividerRecipe,
  dividerWithLabelStyle,
  dividerLabelLineStyle,
  dividerLabelTextStyle,
  type DividerRecipeVariants,
} from './divider.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import type { Sprinkles } from '../utils/sprinkles.css';
import { sprinkles } from '../utils/sprinkles.css';

// ── Slot ──────────────────────────────────────────────

/** Divider slot isimleri. */
export type DividerSlot = 'root' | 'label';

// ── Context (Compound API) ──────────────────────────

interface DividerContextValue {
  orientation: NonNullable<DividerRecipeVariants>['orientation'];
  classNames: ClassNames<DividerSlot> | undefined;
  styles: Styles<DividerSlot> | undefined;
}

const DividerContext = createContext<DividerContextValue | null>(null);

function useDividerContext(): DividerContextValue {
  const ctx = useContext(DividerContext);
  if (!ctx) throw new Error('Divider compound sub-components must be used within <Divider>.');
  return ctx;
}

// ── Compound: Divider.Label ─────────────────────────

/** Divider.Label props */
export interface DividerLabelProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DividerLabel = forwardRef<HTMLSpanElement, DividerLabelProps>(
  function DividerLabel(props, ref) {
    const { children, className } = props;
    const ctx = useDividerContext();
    const slot = getSlotProps('label', dividerLabelTextStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="divider-label">
        {children}
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

/**
 * Divider prop'lari.
 */
export interface DividerProps
  extends Omit<HTMLAttributes<HTMLHRElement>, keyof Sprinkles>,
    SlotStyleProps<DividerSlot> {
  /** Ayirici yonu. Varsayilan: 'horizontal'. */
  orientation?: NonNullable<DividerRecipeVariants>['orientation'];
  /** Cizgi stili. Varsayilan: 'solid'. */
  variant?: NonNullable<DividerRecipeVariants>['variant'];
  /** Ek CSS sinifi. */
  className?: string;
  /** Inline stil. */
  style?: CSSProperties;
  /** Ust-alt bosluk (yatay) veya sol-sag bosluk (dikey). Spacing token. */
  spacing?: Sprinkles['marginTop'];
  /** Props-based: etiket metni / Label text */
  label?: ReactNode;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ref. */
  ref?: Ref<HTMLHRElement>;
}

// ── Component ─────────────────────────────────────────

const DividerBase = forwardRef<HTMLHRElement, DividerProps>(
  function Divider(props, ref) {
    const {
      orientation = 'horizontal',
      variant = 'solid',
      spacing,
      className,
      style,
      classNames,
      styles,
      label,
      children,
      ...htmlProps
    } = props;

    const ctxValue: DividerContextValue = { orientation, classNames, styles };

    // ── With label (props-based or compound) ──
    const hasLabel = label !== undefined || children !== undefined;

    if (hasLabel && orientation === 'horizontal') {
      const spacingClass = spacing !== undefined
        ? sprinkles({ marginTop: spacing, marginBottom: spacing })
        : '';

      const { className: rootSlotClass, style: rootSlotStyle } = getSlotProps(
        'root',
        [dividerWithLabelStyle, spacingClass].filter(Boolean).join(' '),
        classNames,
        styles,
        style,
      );
      const finalClass = [rootSlotClass, className].filter(Boolean).join(' ');
      const labelSlot = getSlotProps('label', dividerLabelTextStyle, classNames, styles);

      return (
        <DividerContext.Provider value={ctxValue}>
          <div
            ref={ref as Ref<HTMLDivElement>}
            role="separator"
            className={finalClass || undefined}
            style={rootSlotStyle}
            data-testid="divider"
            {...(htmlProps as HTMLAttributes<HTMLDivElement>)}
          >
            <span className={dividerLabelLineStyle} />
            {children !== undefined ? (
              children
            ) : (
              <span
                className={labelSlot.className}
                style={labelSlot.style}
                data-testid="divider-label"
              >
                {label}
              </span>
            )}
            <span className={dividerLabelLineStyle} />
          </div>
        </DividerContext.Provider>
      );
    }

    // ── Standard divider (no label) ──
    const recipeClass = dividerRecipe({ orientation, variant });

    let spacingClass = '';
    if (spacing !== undefined) {
      if (orientation === 'horizontal') {
        spacingClass = sprinkles({ marginTop: spacing, marginBottom: spacing });
      } else {
        spacingClass = sprinkles({ marginLeft: spacing, marginRight: spacing });
      }
    }

    const combinedVeClass = [recipeClass, spacingClass].filter(Boolean).join(' ');

    const { className: slotClass, style: slotStyle } = getSlotProps(
      'root',
      combinedVeClass,
      classNames,
      styles,
      style,
    );
    const finalClass = [slotClass, className].filter(Boolean).join(' ');

    return (
      <DividerContext.Provider value={ctxValue}>
        <hr
          ref={ref}
          role={orientation === 'vertical' ? 'separator' : undefined}
          aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
          className={finalClass || undefined}
          style={slotStyle}
          data-testid="divider"
          {...htmlProps}
        />
      </DividerContext.Provider>
    );
  },
);

/**
 * Divider bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Divider />
 * <Divider label="veya" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Divider>
 *   <Divider.Label>veya</Divider.Label>
 * </Divider>
 * ```
 */
export const Divider = Object.assign(DividerBase, {
  Label: DividerLabel,
});
