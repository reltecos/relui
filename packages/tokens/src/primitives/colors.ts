/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Primitive color palette — raw color values.
 * Ham renk değerleri. Semantic token'lar bu değerleri referans alır.
 *
 * 12-step scale (Radix Colors yaklaşımı):
 * 1-2:  Backgrounds (app bg, subtle bg)
 * 3-5:  Component backgrounds (default, hover, active)
 * 6-7:  Borders (subtle, default)
 * 8:    Solid backgrounds (buttons, badges)
 * 9:    Solid backgrounds hovered
 * 10:   Low contrast text
 * 11:   Medium contrast text
 * 12:   High contrast text
 *
 * @packageDocumentation
 */

// ---------------------------------------------------------------------------
// Gray — blue-tinted neutral (premium hissi — varsayılan tema)
// ---------------------------------------------------------------------------

export const gray = {
  1: '#0a0a0f',
  2: '#111118',
  3: '#191922',
  4: '#21212d',
  5: '#282838',
  6: '#323245',
  7: '#3e3e54',
  8: '#505068',
  9: '#64647c',
  10: '#818196',
  11: '#a1a1b5',
  12: '#ededf0',
} as const;

export const grayLight = {
  1: '#fcfcfd',
  2: '#f8f8fa',
  3: '#f1f1f5',
  4: '#eaeaef',
  5: '#e2e2e9',
  6: '#d6d6e0',
  7: '#c5c5d3',
  8: '#ababbe',
  9: '#8e8ea4',
  10: '#6e6e87',
  11: '#51516a',
  12: '#1a1a2e',
} as const;

// ---------------------------------------------------------------------------
// Ocean Gray — teal-tinted neutral (ocean tema)
// ---------------------------------------------------------------------------

export const oceanGray = {
  1: '#070c0e',
  2: '#0d1517',
  3: '#141f23',
  4: '#1b2930',
  5: '#22343c',
  6: '#2c4049',
  7: '#384f5a',
  8: '#4a6570',
  9: '#5e7c88',
  10: '#7a969f',
  11: '#9bb2ba',
  12: '#e6eef0',
} as const;

export const oceanGrayLight = {
  1: '#f7fcfd',
  2: '#f0f8fa',
  3: '#e5f2f5',
  4: '#d8eaee',
  5: '#cbe1e6',
  6: '#bad4db',
  7: '#a3c2cc',
  8: '#85a9b5',
  9: '#6a919e',
  10: '#537782',
  11: '#3d5d67',
  12: '#142328',
} as const;

// ---------------------------------------------------------------------------
// Forest Gray — green-tinted neutral (forest tema)
// ---------------------------------------------------------------------------

export const forestGray = {
  1: '#090c09',
  2: '#101510',
  3: '#181f18',
  4: '#202a20',
  5: '#283528',
  6: '#324032',
  7: '#3f503f',
  8: '#526552',
  9: '#657c65',
  10: '#82967f',
  11: '#a2b39e',
  12: '#e8ede6',
} as const;

export const forestGrayLight = {
  1: '#f8fcf7',
  2: '#f1f8f0',
  3: '#e6f2e4',
  4: '#d9ead6',
  5: '#cce1c9',
  6: '#bbd5b7',
  7: '#a5c4a1',
  8: '#89ad84',
  9: '#6f966a',
  10: '#577d52',
  11: '#40633c',
  12: '#1a2e18',
} as const;

// ---------------------------------------------------------------------------
// Blue — primary accent (varsayılan tema)
// ---------------------------------------------------------------------------

export const blue = {
  1: '#080d19',
  2: '#0c1528',
  3: '#0f1f3d',
  4: '#122a54',
  5: '#15356b',
  6: '#1a4080',
  7: '#2050a0',
  8: '#2b66c4',
  9: '#3b82f6',
  10: '#5a9bff',
  11: '#8ab8ff',
  12: '#d0e3ff',
} as const;

export const blueLight = {
  1: '#f5f9ff',
  2: '#ebf3ff',
  3: '#d6e8ff',
  4: '#b8d8ff',
  5: '#96c5ff',
  6: '#74b0ff',
  7: '#5299f0',
  8: '#3b82f6',
  9: '#2563eb',
  10: '#1d4ed8',
  11: '#1e40af',
  12: '#0c1c45',
} as const;

// ---------------------------------------------------------------------------
// Teal — primary accent (ocean tema)
// ---------------------------------------------------------------------------

export const teal = {
  1: '#061210',
  2: '#0a1e1a',
  3: '#0f2e28',
  4: '#143f36',
  5: '#1a5245',
  6: '#206555',
  7: '#287e6b',
  8: '#329a84',
  9: '#14b8a6',
  10: '#2dd4bf',
  11: '#5eead4',
  12: '#ccfbf1',
} as const;

export const tealLight = {
  1: '#f0fdfa',
  2: '#e0faf4',
  3: '#c5f5ea',
  4: '#a0edd9',
  5: '#73e0c6',
  6: '#4dceb0',
  7: '#30b89a',
  8: '#1aa386',
  9: '#0d9488',
  10: '#0f766e',
  11: '#115e59',
  12: '#042f2e',
} as const;

// ---------------------------------------------------------------------------
// Emerald — primary accent (forest tema)
// ---------------------------------------------------------------------------

export const emerald = {
  1: '#05120b',
  2: '#091e13',
  3: '#0e301e',
  4: '#13432a',
  5: '#195637',
  6: '#1f6a45',
  7: '#278456',
  8: '#31a06a',
  9: '#10b981',
  10: '#34d399',
  11: '#6ee7b7',
  12: '#d1fae5',
} as const;

export const emeraldLight = {
  1: '#f0fdf4',
  2: '#e2fced',
  3: '#c9f7dc',
  4: '#a7f3c9',
  5: '#7debaf',
  6: '#55de95',
  7: '#38cc7d',
  8: '#22bb68',
  9: '#059669',
  10: '#047857',
  11: '#065f46',
  12: '#022c22',
} as const;

// ---------------------------------------------------------------------------
// Green — success (tüm temalarda ortak)
// ---------------------------------------------------------------------------

export const green = {
  1: '#071209',
  2: '#0c1f10',
  3: '#113019',
  4: '#164223',
  5: '#1c5530',
  6: '#22683d',
  7: '#2a824e',
  8: '#34a062',
  9: '#22c55e',
  10: '#4ade80',
  11: '#86efac',
  12: '#d1fae5',
} as const;

export const greenLight = {
  1: '#f3fdf5',
  2: '#e6faec',
  3: '#ccf5d8',
  4: '#a7eabc',
  5: '#7ddb9e',
  6: '#57c97f',
  7: '#3ab566',
  8: '#22a352',
  9: '#16a34a',
  10: '#15803d',
  11: '#166534',
  12: '#052e16',
} as const;

// ---------------------------------------------------------------------------
// Amber — warning (tüm temalarda ortak)
// ---------------------------------------------------------------------------

export const amber = {
  1: '#140e04',
  2: '#221808',
  3: '#35250c',
  4: '#493210',
  5: '#5e4016',
  6: '#744f1c',
  7: '#916424',
  8: '#b47d2e',
  9: '#f59e0b',
  10: '#fbbf24',
  11: '#fcd34d',
  12: '#fef3c7',
} as const;

export const amberLight = {
  1: '#fffdf5',
  2: '#fffaeb',
  3: '#fff2cc',
  4: '#ffe6a0',
  5: '#ffd66e',
  6: '#ffc53d',
  7: '#f5a623',
  8: '#e09112',
  9: '#d97706',
  10: '#b45309',
  11: '#92400e',
  12: '#451a03',
} as const;

// ---------------------------------------------------------------------------
// Red — error / destructive (tüm temalarda ortak)
// ---------------------------------------------------------------------------

export const red = {
  1: '#160808',
  2: '#28100e',
  3: '#3e1614',
  4: '#551d1a',
  5: '#6e2520',
  6: '#862e28',
  7: '#a53a32',
  8: '#c8483e',
  9: '#ef4444',
  10: '#f87171',
  11: '#fca5a5',
  12: '#fee2e2',
} as const;

export const redLight = {
  1: '#fef5f5',
  2: '#fee8e8',
  3: '#fdd4d4',
  4: '#fcb5b5',
  5: '#f98e8e',
  6: '#f16868',
  7: '#e34848',
  8: '#d13333',
  9: '#dc2626',
  10: '#b91c1c',
  11: '#991b1b',
  12: '#450a0a',
} as const;

// ---------------------------------------------------------------------------
// Purple — özel vurgu (tüm temalarda ortak)
// ---------------------------------------------------------------------------

export const purple = {
  1: '#0f0a19',
  2: '#1a1228',
  3: '#271c3e',
  4: '#352656',
  5: '#44316e',
  6: '#543d88',
  7: '#664ea4',
  8: '#7c63c0',
  9: '#a855f7',
  10: '#c084fc',
  11: '#d8b4fe',
  12: '#f3e8ff',
} as const;

export const purpleLight = {
  1: '#faf5ff',
  2: '#f5edff',
  3: '#eddcff',
  4: '#dfc4ff',
  5: '#cda5fc',
  6: '#b882f0',
  7: '#a263e0',
  8: '#8b46cc',
  9: '#9333ea',
  10: '#7e22ce',
  11: '#6b21a8',
  12: '#2e0a4f',
} as const;

// ---------------------------------------------------------------------------
// Static colors — tema bağımsız
// ---------------------------------------------------------------------------

export const white = '#ffffff' as const;
export const black = '#000000' as const;
export const transparent = 'transparent' as const;

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------

/** 12 adımlı renk skalası tipi / 12-step color scale type */
export type ColorScale = {
  readonly 1: string;
  readonly 2: string;
  readonly 3: string;
  readonly 4: string;
  readonly 5: string;
  readonly 6: string;
  readonly 7: string;
  readonly 8: string;
  readonly 9: string;
  readonly 10: string;
  readonly 11: string;
  readonly 12: string;
};
