/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Section — semantik sayfa bolumu bilesen (Dual API).
 * HTML `<section>` elementi uzerine Box responsive prop'lari.
 *
 * Props-based: `<Section p={6}>icerik</Section>`
 * Compound:    `<Section><Section.Header>Baslik</Section.Header><Section.Content>icerik</Section.Content></Section>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import { Box, type BoxProps } from '../box';
import { headerStyle, contentStyle } from './section.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Section slot isimleri / Section slot names. */
export type SectionSlot = 'root' | 'header' | 'content';

// ── Context (Compound API) ────────────────────────────

interface SectionContextValue {
  classNames: ClassNames<SectionSlot> | undefined;
  styles: Styles<SectionSlot> | undefined;
}

const SectionContext = createContext<SectionContextValue | null>(null);

function useSectionContext(): SectionContextValue {
  const ctx = useContext(SectionContext);
  if (!ctx) throw new Error('Section compound sub-components must be used within <Section>.');
  return ctx;
}

// ── Compound: Section.Header ─────────────────────────

/** Section.Header props */
export interface SectionHeaderProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Header icin heading seviyesi. Varsayilan: 'h2'. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const SectionHeader = forwardRef<HTMLHeadingElement, SectionHeaderProps>(
  function SectionHeader(props, ref) {
    const { children, className, as: Tag = 'h2' } = props;
    const ctx = useSectionContext();
    const slot = getSlotProps('header', headerStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <Tag ref={ref} className={cls} style={slot.style} data-testid="section-header">
        {children}
      </Tag>
    );
  },
);

// ── Compound: Section.Content ────────────────────────

/** Section.Content props */
export interface SectionContentProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SectionContent = forwardRef<HTMLDivElement, SectionContentProps>(
  function SectionContent(props, ref) {
    const { children, className } = props;
    const ctx = useSectionContext();
    const slot = getSlotProps('content', contentStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="section-content">
        {children}
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

/**
 * Section prop'lari.
 *
 * Box'un tum prop'larini destekler. Varsayilan element: `<section>`.
 */
export interface SectionProps extends Omit<BoxProps, 'classNames' | 'styles'>, SlotStyleProps<SectionSlot> {
  /** Alt elementler. */
  children?: ReactNode;
}

// ── Component ─────────────────────────────────────────

const SectionBase = forwardRef<HTMLElement, SectionProps>(
  function Section(props, ref) {
    const { classNames, styles, ...rest } = props;

    const ctxValue: SectionContextValue = { classNames, styles };

    return (
      <SectionContext.Provider value={ctxValue}>
        <Box
          ref={ref}
          as="section"
          classNames={classNames ? { root: classNames.root } : undefined}
          styles={styles ? { root: styles.root } : undefined}
          {...rest}
        />
      </SectionContext.Provider>
    );
  },
);

/**
 * Section bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Section p={6}>
 *   <h2>Bolum Basligi</h2>
 *   <p>Bolum icerigi...</p>
 * </Section>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Section p={6}>
 *   <Section.Header>Bolum Basligi</Section.Header>
 *   <Section.Content>Bolum icerigi...</Section.Content>
 * </Section>
 * ```
 */
export const Section = Object.assign(SectionBase, {
  Header: SectionHeader,
  Content: SectionContent,
});
