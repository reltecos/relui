/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { themes } from './index';
import type { SemanticColors, ThemeVariant } from './types';

/**
 * SemanticColors interface'indeki tüm zorunlu key'ler.
 * All required keys from SemanticColors interface.
 */
const REQUIRED_COLOR_KEYS: (keyof SemanticColors)[] = [
  'bgApp', 'bgSubtle', 'bgComponent', 'bgComponentHover', 'bgComponentActive', 'bgOverlay',
  'fgDefault', 'fgMuted', 'fgDisabled', 'fgInverse',
  'borderDefault', 'borderHover', 'borderFocus', 'borderSubtle',
  'accentDefault', 'accentHover', 'accentActive', 'accentFg', 'accentSubtle', 'accentSubtleFg',
  'destructiveDefault', 'destructiveHover', 'destructiveFg', 'destructiveSubtle', 'destructiveSubtleFg',
  'successDefault', 'successHover', 'successFg', 'successSubtle', 'successSubtleFg',
  'warningDefault', 'warningHover', 'warningFg', 'warningSubtle', 'warningSubtleFg',
  'infoDefault', 'infoHover', 'infoFg', 'infoSubtle', 'infoSubtleFg',
  'inputBg', 'inputBorder', 'inputBorderFocus', 'inputPlaceholder',
  'surfaceRaised', 'surfaceOverlay', 'surfaceSunken',
  'shadowColor',
];

const ALL_VARIANTS: ThemeVariant[] = [
  'default-dark', 'default-light',
  'ocean-dark', 'ocean-light',
  'forest-dark', 'forest-light',
];

describe('Theme definitions', () => {
  it('tüm tema varyantları tanımlı olmalı / all theme variants should be defined', () => {
    for (const variant of ALL_VARIANTS) {
      expect(themes[variant]).toBeDefined();
      expect(themes[variant].name).toBeTruthy();
      expect(themes[variant].mode).toMatch(/^(dark|light)$/);
    }
  });

  it('6 tema varyantı olmalı / should have exactly 6 theme variants', () => {
    expect(Object.keys(themes)).toHaveLength(6);
  });

  for (const variant of ALL_VARIANTS) {
    describe(`${variant}`, () => {
      it('tüm semantic renk key\'leri mevcut olmalı / all semantic color keys should exist', () => {
        const theme = themes[variant];
        for (const key of REQUIRED_COLOR_KEYS) {
          expect(theme.colors[key]).toBeDefined();
          expect(theme.colors[key]).not.toBe('');
        }
      });

      it('renk değerleri geçerli CSS renk formatında olmalı / color values should be valid CSS colors', () => {
        const theme = themes[variant];
        for (const [key, value] of Object.entries(theme.colors)) {
          expect(
            value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl') || value === 'transparent',
          ).toBe(true);

          // Geçersiz boş string kontrolü
          if (key !== 'shadowColor') {
            expect(value.length).toBeGreaterThan(3);
          }
        }
      });

      it('mode doğru ayarlanmış olmalı / mode should match variant suffix', () => {
        const theme = themes[variant];
        const expectedMode = variant.endsWith('-dark') ? 'dark' : 'light';
        expect(theme.mode).toBe(expectedMode);
      });

      it('name doğru ayarlanmış olmalı / name should match variant prefix', () => {
        const theme = themes[variant];
        const expectedName = variant.replace(/-dark$/, '').replace(/-light$/, '');
        expect(theme.name).toBe(expectedName);
      });
    });
  }
});

describe('Theme contrast', () => {
  for (const variant of ALL_VARIANTS) {
    it(`${variant}: arka plan ve ön plan farklı olmalı / bg and fg should differ`, () => {
      const theme = themes[variant];
      expect(theme.colors.bgApp).not.toBe(theme.colors.fgDefault);
    });

    it(`${variant}: accent ve destructive farklı olmalı / accent and destructive should differ`, () => {
      const theme = themes[variant];
      expect(theme.colors.accentDefault).not.toBe(theme.colors.destructiveDefault);
    });
  }
});
