/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Container — ortalanmis, max-width sinirlamali layout bilesen (Dual API).
 * Sayfa icerigini responsive genislikte tutar.
 *
 * Props-based: `<Container size="lg" px={4}>icerik</Container>`
 * Compound:    `<Container>icerik</Container>` (minimal)
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { rootStyle, sizeStyles } from './container.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import { Box, type BoxProps } from '../box';

// ── Slot ──────────────────────────────────────────────

/** Container slot isimleri / Container slot names. */
export type ContainerSlot = 'root';

// ── Types ─────────────────────────────────────────────

/** Container boyut presetleri. */
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

// ── Context (Compound API) ────────────────────────────

interface ContainerContextValue {
  size: ContainerSize;
  classNames: ClassNames<ContainerSlot> | undefined;
  styles: Styles<ContainerSlot> | undefined;
}

const ContainerContext = createContext<ContainerContextValue | null>(null);

/**
 * Container context hook.
 * Container compound sub-components must be used within Container.
 */
export function useContainerContext(): ContainerContextValue {
  const ctx = useContext(ContainerContext);
  if (!ctx) throw new Error('Container compound sub-components must be used within <Container>.');
  return ctx;
}

// ── Component Props ───────────────────────────────────

/**
 * Container prop'lari.
 *
 * Box'un tum prop'larini destekler + `size` ve `centerContent` prop'lari.
 */
export interface ContainerProps extends Omit<BoxProps, 'classNames' | 'styles'>, SlotStyleProps<ContainerSlot> {
  /**
   * Maksimum genislik preseti.
   * Varsayilan: 'lg' (1024px).
   */
  size?: ContainerSize;
  /**
   * Icerigi hem yatay hem dikey ortala.
   * Varsayilan: false.
   */
  centerContent?: boolean;
  /** Alt elementler. */
  children?: ReactNode;
  /** Inline stil. */
  style?: CSSProperties;
}

// ── Component ─────────────────────────────────────────

const ContainerBase = forwardRef<HTMLElement, ContainerProps>(
  function Container(props, ref) {
    const {
      size = 'lg',
      centerContent = false,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
      ...rest
    } = props;

    const baseClass = `${rootStyle} ${sizeStyles[size]}`;
    const rootSlot = getSlotProps('root', baseClass, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: ContainerContextValue = { size, classNames, styles };

    return (
      <ContainerContext.Provider value={ctxValue}>
        <Box
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="container-root"
          data-size={size}
          {...(centerContent
            ? { display: 'flex', flexDirection: 'column', alignItems: 'center' }
            : {})}
          {...rest}
        >
          {children}
        </Box>
      </ContainerContext.Provider>
    );
  },
);

/**
 * Container bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Container size="lg" px={4}>
 *   <h1>Sayfa Icerigi</h1>
 *   <p>Maksimum 1024px genislikte, ortalanmis.</p>
 * </Container>
 * ```
 *
 * @example Compound (minimal)
 * ```tsx
 * <Container size="md" centerContent>
 *   <Box>Ortalanmis icerik</Box>
 * </Container>
 * ```
 */
export const Container = Object.assign(ContainerBase, {});
