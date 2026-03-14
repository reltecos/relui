/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Theme type definitions — semantic token structure.
 * Tema tip tanımları — tüm temaların uyması gereken yapı.
 *
 * @packageDocumentation
 */

/**
 * Semantic renk token'ları — tema bazlı anlamsal renkler.
 * Semantic color tokens — theme-aware meaningful colors.
 */
export interface SemanticColors {
  // -- Background --
  /** Uygulama arka planı / App background */
  bgApp: string;
  /** Varsayılan bileşen arka planı / Default component background (panels, menus, navbars) */
  bgDefault: string;
  /** İkincil arka plan / Subtle background */
  bgSubtle: string;
  /** Bileşen arka planı / Component background */
  bgComponent: string;
  /** Hover durumu / Hover state */
  bgComponentHover: string;
  /** Active/pressed durumu / Active state */
  bgComponentActive: string;
  /** Overlay arka planı / Overlay background */
  bgOverlay: string;

  // -- Foreground (text) --
  /** Ana metin / Primary text */
  fgDefault: string;
  /** İkincil metin / Secondary text */
  fgMuted: string;
  /** Pasif metin / Disabled text */
  fgDisabled: string;
  /** Ters metin (koyu üstüne beyaz) / Inverse text */
  fgInverse: string;

  // -- Border --
  /** Varsayılan kenarlık / Default border */
  borderDefault: string;
  /** Hover kenarlık / Hover border */
  borderHover: string;
  /** Odaklanma halkası / Focus ring */
  borderFocus: string;
  /** İnce ayraç / Subtle separator */
  borderSubtle: string;

  // -- Accent (primary action) --
  /** Accent arka plan / Accent background */
  accentDefault: string;
  /** Accent hover / Accent hovered */
  accentHover: string;
  /** Accent active / Accent pressed */
  accentActive: string;
  /** Accent üzerindeki metin / Text on accent */
  accentFg: string;
  /** Accent subtle arka plan / Accent subtle bg */
  accentSubtle: string;
  /** Accent subtle metin / Accent subtle text */
  accentSubtleFg: string;

  // -- Destructive (danger) --
  /** Destructive arka plan / Destructive background */
  destructiveDefault: string;
  /** Destructive hover */
  destructiveHover: string;
  /** Destructive üzerindeki metin / Text on destructive */
  destructiveFg: string;
  /** Destructive subtle arka plan */
  destructiveSubtle: string;
  /** Destructive subtle metin */
  destructiveSubtleFg: string;

  // -- Success --
  /** Başarı arka plan / Success background */
  successDefault: string;
  /** Başarı hover / Success hovered */
  successHover: string;
  /** Başarı üzerindeki metin / Text on success */
  successFg: string;
  /** Başarı subtle arka plan */
  successSubtle: string;
  /** Başarı subtle metin */
  successSubtleFg: string;

  // -- Warning --
  /** Uyarı arka plan / Warning background */
  warningDefault: string;
  /** Uyarı hover / Warning hovered */
  warningHover: string;
  /** Uyarı üzerindeki metin / Text on warning */
  warningFg: string;
  /** Uyarı subtle arka plan */
  warningSubtle: string;
  /** Uyarı subtle metin */
  warningSubtleFg: string;

  // -- Info --
  /** Bilgi arka plan / Info background */
  infoDefault: string;
  /** Bilgi hover / Info hovered */
  infoHover: string;
  /** Bilgi üzerindeki metin / Text on info */
  infoFg: string;
  /** Bilgi subtle arka plan */
  infoSubtle: string;
  /** Bilgi subtle metin */
  infoSubtleFg: string;

  // -- Input --
  /** Input arka planı / Input background */
  inputBg: string;
  /** Input kenarlığı / Input border */
  inputBorder: string;
  /** Input odaklanma / Input focus border */
  inputBorderFocus: string;
  /** Input placeholder / Input placeholder text */
  inputPlaceholder: string;

  // -- Surface (card, panel, popover) --
  /** Yükseltilmiş yüzey / Elevated surface */
  surfaceRaised: string;
  /** Overlay yüzeyi (modal, popover) / Overlay surface */
  surfaceOverlay: string;
  /** Sunken yüzey (inset, well) / Sunken surface */
  surfaceSunken: string;

  // -- Shadow --
  /** Gölge rengi / Shadow color */
  shadowColor: string;
}

/**
 * Tam tema tanımı / Full theme definition.
 * Her tema bu interface'i implement eder.
 */
export interface ThemeDefinition {
  /** Tema adı / Theme name */
  name: string;
  /** Tema modu / Theme mode */
  mode: 'dark' | 'light';
  /** Semantic renkler / Semantic colors */
  colors: SemanticColors;
}

/** Mevcut tema isimleri / Available theme names */
export type ThemeName = 'default' | 'ocean' | 'forest';

/** Tema varyantı / Theme variant */
export type ThemeVariant = `${ThemeName}-dark` | `${ThemeName}-light`;
