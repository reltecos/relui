/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ThemePreview — tum tema renklerinin gorsel onizlemesi (Dual API).
 * ThemePreview — visual preview of all theme colors (Dual API).
 *
 * Props-based: `<ThemePreview />`
 * Compound:    `<ThemePreview><ThemePreview.ColorSection ... /></ThemePreview>`
 *
 * @packageDocumentation
 */

import { forwardRef, useState, createContext, useContext, type ReactNode } from 'react';
import { themes, generateCSS } from '@relteco/relui-tokens';
import type { ThemeVariant } from '@relteco/relui-tokens';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import type { ClassNames, Styles } from '../utils/slot-styles';
import {
  rootStyle,
  selectorStyle,
  selectorButtonStyle,
  selectorButtonActiveStyle,
  colorSectionStyle,
  colorSectionTitleStyle,
  colorGridStyle,
  colorSwatchContainerStyle,
  colorSwatchStyle,
  colorSwatchLabelStyle,
  typographySectionStyle,
  typographySectionTitleStyle,
} from './theme-preview.css';

// ── Slot ──────────────────────────────────────────────

/** ThemePreview slot isimleri / ThemePreview slot names. */
export type ThemePreviewSlot =
  | 'root'
  | 'selector'
  | 'colorSection'
  | 'colorSectionTitle'
  | 'colorGrid'
  | 'colorSwatch'
  | 'colorSwatchLabel'
  | 'typographySection';

// ── Data ──────────────────────────────────────────────

const themeCSS = generateCSS(themes);

/** Renk grubu tanimi. */
export interface ColorGroup {
  title: string;
  vars: ReadonlyArray<{ name: string; label: string }>;
}

const COLOR_GROUPS: ReadonlyArray<ColorGroup> = [
  {
    title: 'Background',
    vars: [
      { name: 'bgApp', label: 'App' },
      { name: 'bgSubtle', label: 'Subtle' },
      { name: 'bgComponent', label: 'Component' },
      { name: 'bgComponentHover', label: 'Hover' },
      { name: 'bgComponentActive', label: 'Active' },
    ],
  },
  {
    title: 'Foreground',
    vars: [
      { name: 'fgDefault', label: 'Default' },
      { name: 'fgMuted', label: 'Muted' },
      { name: 'fgDisabled', label: 'Disabled' },
    ],
  },
  {
    title: 'Border',
    vars: [
      { name: 'borderDefault', label: 'Default' },
      { name: 'borderHover', label: 'Hover' },
      { name: 'borderFocus', label: 'Focus' },
      { name: 'borderSubtle', label: 'Subtle' },
    ],
  },
  {
    title: 'Accent',
    vars: [
      { name: 'accentDefault', label: 'Default' },
      { name: 'accentHover', label: 'Hover' },
      { name: 'accentActive', label: 'Active' },
      { name: 'accentSubtle', label: 'Subtle' },
    ],
  },
  {
    title: 'Destructive',
    vars: [
      { name: 'destructiveDefault', label: 'Default' },
      { name: 'destructiveHover', label: 'Hover' },
      { name: 'destructiveSubtle', label: 'Subtle' },
    ],
  },
  {
    title: 'Success',
    vars: [
      { name: 'successDefault', label: 'Default' },
      { name: 'successHover', label: 'Hover' },
      { name: 'successSubtle', label: 'Subtle' },
    ],
  },
  {
    title: 'Warning',
    vars: [
      { name: 'warningDefault', label: 'Default' },
      { name: 'warningHover', label: 'Hover' },
      { name: 'warningSubtle', label: 'Subtle' },
    ],
  },
  {
    title: 'Surface',
    vars: [
      { name: 'surfaceRaised', label: 'Raised' },
      { name: 'surfaceOverlay', label: 'Overlay' },
      { name: 'surfaceSunken', label: 'Sunken' },
    ],
  },
  {
    title: 'Input',
    vars: [
      { name: 'inputBg', label: 'Background' },
      { name: 'inputBorder', label: 'Border' },
      { name: 'inputBorderFocus', label: 'Focus' },
    ],
  },
];

const ALL_VARIANTS: ThemeVariant[] = [
  'default-dark', 'default-light',
  'ocean-dark', 'ocean-light',
  'forest-dark', 'forest-light',
];

// ── Context (Compound API) ──────────────────────────

interface ThemePreviewContextValue {
  activeTheme: ThemeVariant;
  classNames: ClassNames<ThemePreviewSlot> | undefined;
  styles: Styles<ThemePreviewSlot> | undefined;
}

const ThemePreviewContext = createContext<ThemePreviewContextValue | null>(null);

/** ThemePreview compound context hook. */
export function useThemePreviewContext(): ThemePreviewContextValue {
  const ctx = useContext(ThemePreviewContext);
  if (!ctx) throw new Error('ThemePreview compound sub-components must be used within <ThemePreview>.');
  return ctx;
}

// ── Compound: ThemePreview.ColorSection ──────────────

/** ThemePreview.ColorSection props */
export interface ThemePreviewColorSectionProps {
  /** Baslik / Title */
  title: string;
  /** Renk degiskenleri / Color variables */
  vars: ReadonlyArray<{ name: string; label: string }>;
  /** Ek className / Additional className */
  className?: string;
}

const ThemePreviewColorSection = forwardRef<HTMLDivElement, ThemePreviewColorSectionProps>(
  function ThemePreviewColorSection(props, ref) {
    const { title, vars, className } = props;
    const ctx = useThemePreviewContext();

    const sectionSlot = getSlotProps('colorSection', colorSectionStyle, ctx.classNames, ctx.styles);
    const titleSlot = getSlotProps('colorSectionTitle', colorSectionTitleStyle, ctx.classNames, ctx.styles);
    const gridSlot = getSlotProps('colorGrid', colorGridStyle, ctx.classNames, ctx.styles);
    const swatchSlot = getSlotProps('colorSwatch', colorSwatchStyle, ctx.classNames, ctx.styles);
    const labelSlot = getSlotProps('colorSwatchLabel', colorSwatchLabelStyle, ctx.classNames, ctx.styles);

    const cls = className ? `${sectionSlot.className} ${className}` : sectionSlot.className;

    return (
      <div ref={ref} className={cls} style={sectionSlot.style} data-testid="theme-preview-color-section">
        <div className={titleSlot.className} style={titleSlot.style} data-testid="theme-preview-color-section-title">
          {title}
        </div>
        <div className={gridSlot.className} style={gridSlot.style}>
          {vars.map((v) => (
            <div key={v.name} className={colorSwatchContainerStyle}>
              <div
                className={swatchSlot.className}
                style={{
                  ...swatchSlot.style,
                  background: `var(--rel-color-${v.name.replace(/([A-Z])/g, '-$1').toLowerCase()})`,
                }}
                data-testid="theme-preview-swatch"
              />
              <span className={labelSlot.className} style={labelSlot.style}>
                {v.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

// ── Compound: ThemePreview.TypographySection ─────────

/** ThemePreview.TypographySection props */
export interface ThemePreviewTypographySectionProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Baslik / Title */
  title?: string;
  /** Ek className / Additional className */
  className?: string;
}

const ThemePreviewTypographySection = forwardRef<HTMLDivElement, ThemePreviewTypographySectionProps>(
  function ThemePreviewTypographySection(props, ref) {
    const { children, title = 'Typography', className } = props;
    const ctx = useThemePreviewContext();

    const sectionSlot = getSlotProps('typographySection', typographySectionStyle, ctx.classNames, ctx.styles);
    const titleSlotProps = getSlotProps('colorSectionTitle', typographySectionTitleStyle, ctx.classNames, ctx.styles);

    const cls = className ? `${sectionSlot.className} ${className}` : sectionSlot.className;

    return (
      <div ref={ref} className={cls} style={sectionSlot.style} data-testid="theme-preview-typography-section">
        <div className={titleSlotProps.className} style={titleSlotProps.style}>
          {title}
        </div>
        {children}
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

/** ThemePreview bilesen props'lari. */
export interface ThemePreviewComponentProps extends SlotStyleProps<ThemePreviewSlot> {
  /** Varsayilan tema / Default theme */
  defaultTheme?: ThemeVariant;
  /** Kontrolllu aktif tema / Controlled active theme */
  activeTheme?: ThemeVariant;
  /** Tema degistiginde / On theme change */
  onThemeChange?: (theme: ThemeVariant) => void;
  /** Renk gruplari (varsayilan: tum gruplar) / Color groups (default: all groups) */
  colorGroups?: ReadonlyArray<ColorGroup>;
  /** Tema varyantlari (varsayilan: tum varyantlar) / Theme variants */
  variants?: ThemeVariant[];
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline stil / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const ThemePreviewBase = forwardRef<HTMLDivElement, ThemePreviewComponentProps>(
  function ThemePreview(props, ref) {
    const {
      defaultTheme = 'default-dark',
      activeTheme: controlledTheme,
      onThemeChange,
      colorGroups: customGroups,
      variants = ALL_VARIANTS,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const [internalTheme, setInternalTheme] = useState<ThemeVariant>(defaultTheme);
    const activeTheme = controlledTheme ?? internalTheme;

    const handleThemeChange = (theme: ThemeVariant) => {
      if (!controlledTheme) setInternalTheme(theme);
      onThemeChange?.(theme);
    };

    const groups = customGroups ?? COLOR_GROUPS;

    // ── Slots ──
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles, styleProp);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const selectorSlot = getSlotProps('selector', selectorStyle, classNames, styles);

    const ctxValue: ThemePreviewContextValue = { activeTheme, classNames, styles };

    // ── Compound API ──
    if (children) {
      return (
        <ThemePreviewContext.Provider value={ctxValue}>
          <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
          <div
            ref={ref}
            data-theme={activeTheme}
            className={rootCls}
            style={rootSlot.style}
            data-testid="theme-preview-root"
          >
            {/* Selector */}
            <div className={selectorSlot.className} style={selectorSlot.style} data-testid="theme-preview-selector">
              {variants.map((variant) => {
                const isActive = activeTheme === variant;
                const btnCls = isActive
                  ? `${selectorButtonStyle} ${selectorButtonActiveStyle}`
                  : selectorButtonStyle;
                return (
                  <button
                    key={variant}
                    onClick={() => handleThemeChange(variant)}
                    className={btnCls}
                    data-testid="theme-preview-selector-button"
                    data-active={isActive || undefined}
                  >
                    {variant}
                  </button>
                );
              })}
            </div>
            {children}
          </div>
        </ThemePreviewContext.Provider>
      );
    }

    // ── Props-based API ──
    return (
      <ThemePreviewContext.Provider value={ctxValue}>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
        <div
          ref={ref}
          data-theme={activeTheme}
          className={rootCls}
          style={rootSlot.style}
          data-testid="theme-preview-root"
        >
          {/* Selector */}
          <div className={selectorSlot.className} style={selectorSlot.style} data-testid="theme-preview-selector">
            {variants.map((variant) => {
              const isActive = activeTheme === variant;
              const btnCls = isActive
                ? `${selectorButtonStyle} ${selectorButtonActiveStyle}`
                : selectorButtonStyle;
              return (
                <button
                  key={variant}
                  onClick={() => handleThemeChange(variant)}
                  className={btnCls}
                  data-testid="theme-preview-selector-button"
                  data-active={isActive || undefined}
                >
                  {variant}
                </button>
              );
            })}
          </div>

          {/* Color groups */}
          {groups.map((group) => (
            <ThemePreviewColorSection
              key={group.title}
              title={group.title}
              vars={group.vars}
            />
          ))}
        </div>
      </ThemePreviewContext.Provider>
    );
  },
);

/**
 * ThemePreview — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <ThemePreview />
 * ```
 *
 * @example Compound
 * ```tsx
 * <ThemePreview>
 *   <ThemePreview.ColorSection title="Accent" vars={[{ name: 'accentDefault', label: 'Default' }]} />
 *   <ThemePreview.TypographySection>
 *     <p>Typography preview</p>
 *   </ThemePreview.TypographySection>
 * </ThemePreview>
 * ```
 */
export const ThemePreview = Object.assign(ThemePreviewBase, {
  ColorSection: ThemePreviewColorSection,
  TypographySection: ThemePreviewTypographySection,
});
