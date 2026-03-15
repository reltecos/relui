/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ResponsiveBox — breakpoint kurallariyla otomatik layout degisimi (Dual API).
 *
 * Props-based: `<ResponsiveBox display="flex"><Box>A</Box></ResponsiveBox>`
 * Compound:    `<ResponsiveBox display="flex"><ResponsiveBox.Item>A</ResponsiveBox.Item></ResponsiveBox>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext } from 'react';
import { getSlotProps, type SlotStyleProps } from '../utils';
import type { ClassNames, Styles } from '../utils/slot-styles';
import { Box, type BoxProps } from '../box';
import { responsiveBoxItemStyle } from './responsive-box.css';

/** ResponsiveBox slot isimleri. */
export type ResponsiveBoxSlot = 'root' | 'item';

/** Breakpoint kurali. */
export interface ResponsiveRule {
  /** Minimum genislik (px). */
  minWidth?: number;
  /** Maksimum genislik (px). */
  maxWidth?: number;
  /** Bu aralikta uygulanacak Box props. */
  props: Omit<BoxProps, 'children' | 'ref' | 'classNames' | 'styles'>;
}

// ── Context (Compound API) ──────────────────────────

interface ResponsiveBoxContextValue {
  classNames: ClassNames<ResponsiveBoxSlot> | undefined;
  styles: Styles<ResponsiveBoxSlot> | undefined;
}

const ResponsiveBoxContext = createContext<ResponsiveBoxContextValue | null>(null);

/** ResponsiveBox compound context hook. */
export function useResponsiveBoxContext(): ResponsiveBoxContextValue {
  const ctx = useContext(ResponsiveBoxContext);
  if (!ctx) throw new Error('ResponsiveBox compound sub-components must be used within <ResponsiveBox>.');
  return ctx;
}

// ── Compound: ResponsiveBox.Item ────────────────────

/** ResponsiveBox.Item props */
export interface ResponsiveBoxItemProps extends Omit<BoxProps, 'classNames' | 'styles'> {
  /** Ek className / Additional className */
  className?: string;
}

const ResponsiveBoxItem = forwardRef<HTMLElement, ResponsiveBoxItemProps>(
  function ResponsiveBoxItem(props, ref) {
    const { className, style, ...boxProps } = props;
    const ctx = useResponsiveBoxContext();

    const itemSlot = getSlotProps('item', responsiveBoxItemStyle, ctx.classNames, ctx.styles, style);
    const cls = [itemSlot.className, className].filter(Boolean).join(' ') || undefined;

    return (
      <Box
        ref={ref}
        {...boxProps}
        className={cls}
        style={itemSlot.style}
        data-testid="responsive-box-item"
      />
    );
  },
);

/** ResponsiveBox bilesen prop'lari. */
export interface ResponsiveBoxProps
  extends SlotStyleProps<ResponsiveBoxSlot>,
    Omit<BoxProps, 'classNames' | 'styles'> {
  /** Breakpoint kurallari. */
  rules?: ResponsiveRule[];
}

/**
 * ResponsiveBox — breakpoint kurallariyla otomatik layout degisimi (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <ResponsiveBox display={{ base: 'block', md: 'flex' }} gap={{ base: 4, md: 6 }}>
 *   <Box width={{ base: 'full', md: '1/2' }}>Sol</Box>
 * </ResponsiveBox>
 * ```
 *
 * @example Compound
 * ```tsx
 * <ResponsiveBox display="flex" gap={4}>
 *   <ResponsiveBox.Item>Oge 1</ResponsiveBox.Item>
 *   <ResponsiveBox.Item>Oge 2</ResponsiveBox.Item>
 * </ResponsiveBox>
 * ```
 */
const ResponsiveBoxBase = forwardRef<HTMLElement, ResponsiveBoxProps>(
  function ResponsiveBox(props, ref) {
    const {
      classNames,
      styles,
      className,
      style,
      ...boxProps
    } = props;

    const rootSlot = getSlotProps('root', undefined, classNames, styles, style);
    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    const ctxValue: ResponsiveBoxContextValue = { classNames, styles };

    return (
      <ResponsiveBoxContext.Provider value={ctxValue}>
        <Box
          ref={ref}
          {...boxProps}
          className={finalClass}
          style={rootSlot.style}
        />
      </ResponsiveBoxContext.Provider>
    );
  },
);

/**
 * ResponsiveBox — Dual API (props-based + compound).
 */
export const ResponsiveBox = Object.assign(ResponsiveBoxBase, {
  Item: ResponsiveBoxItem,
});
