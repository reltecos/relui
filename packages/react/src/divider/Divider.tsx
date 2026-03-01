/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Divider — yatay veya dikey ayırıcı çizgi bileşeni.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes, type CSSProperties, type Ref } from 'react';
import { dividerRecipe, type DividerRecipeVariants } from './divider.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import type { Sprinkles } from '../utils/sprinkles.css';
import { sprinkles } from '../utils/sprinkles.css';

/** Divider slot isimleri. */
export type DividerSlot = 'root';

/**
 * Divider prop'ları.
 */
export interface DividerProps
  extends Omit<HTMLAttributes<HTMLHRElement>, keyof Sprinkles>,
    SlotStyleProps<DividerSlot> {
  /** Ayırıcı yönü. Varsayılan: 'horizontal'. */
  orientation?: NonNullable<DividerRecipeVariants>['orientation'];
  /** Çizgi stili. Varsayılan: 'solid'. */
  variant?: NonNullable<DividerRecipeVariants>['variant'];
  /** Ek CSS sınıfı. */
  className?: string;
  /** Inline stil. */
  style?: CSSProperties;
  /** Üst-alt boşluk (yatay) veya sol-sağ boşluk (dikey). Spacing token. */
  spacing?: Sprinkles['marginTop'];
  /** Ref. */
  ref?: Ref<HTMLHRElement>;
}

/**
 * Divider — yatay veya dikey ayırıcı çizgi bileşeni.
 *
 * Flex container içinde dikey, akış içinde yatay kullanılır.
 *
 * @example
 * ```tsx
 * <Stack spacing={4}>
 *   <Box>Üst</Box>
 *   <Divider />
 *   <Box>Alt</Box>
 * </Stack>
 *
 * <Flex gap={4}>
 *   <Box>Sol</Box>
 *   <Divider orientation="vertical" />
 *   <Box>Sağ</Box>
 * </Flex>
 * ```
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  function Divider(props, ref) {
    const {
      orientation = 'horizontal',
      variant = 'solid',
      spacing,
      className,
      style,
      classNames,
      styles,
      ...htmlProps
    } = props;

    const recipeClass = dividerRecipe({ orientation, variant });

    // Spacing → margin
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
      <hr
        ref={ref}
        role={orientation === 'vertical' ? 'separator' : undefined}
        aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
        className={finalClass || undefined}
        style={slotStyle}
        {...htmlProps}
      />
    );
  },
);
