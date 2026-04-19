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
// Midnight Gray — deep navy-tinted neutral (midnight tema)
// ---------------------------------------------------------------------------

export const midnightGray = {
  1: '#080a14',
  2: '#0e1120',
  3: '#151a2e',
  4: '#1c233c',
  5: '#232d4a',
  6: '#2d3859',
  7: '#3a476e',
  8: '#4d5b87',
  9: '#6370a0',
  10: '#8088b3',
  11: '#a0a6c8',
  12: '#e4e6f0',
} as const;

export const midnightGrayLight = {
  1: '#f7f8fc',
  2: '#f0f1f8',
  3: '#e5e7f2',
  4: '#d8dbed',
  5: '#cbcfe6',
  6: '#bbbfdb',
  7: '#a5aacc',
  8: '#8a90b8',
  9: '#7178a5',
  10: '#5a6190',
  11: '#444b77',
  12: '#141834',
} as const;

// ---------------------------------------------------------------------------
// Indigo — primary accent (midnight tema)
// ---------------------------------------------------------------------------

export const indigo = {
  1: '#0a0817',
  2: '#140f2a',
  3: '#1e1742',
  4: '#29205c',
  5: '#352a76',
  6: '#413590',
  7: '#5042ac',
  8: '#6254c8',
  9: '#6366f1',
  10: '#818cf8',
  11: '#a5b4fc',
  12: '#e0e7ff',
} as const;

export const indigoLight = {
  1: '#f5f5ff',
  2: '#ededff',
  3: '#dddcff',
  4: '#c7c3ff',
  5: '#ada6fc',
  6: '#9189f5',
  7: '#766dec',
  8: '#6254db',
  9: '#4f46e5',
  10: '#4338ca',
  11: '#3730a3',
  12: '#1a1550',
} as const;

// ---------------------------------------------------------------------------
// Orange — primary accent (sunrise tema — Relteco markası)
// ---------------------------------------------------------------------------

export const orange = {
  1: '#160c04',
  2: '#261508',
  3: '#3a200e',
  4: '#502c14',
  5: '#66381a',
  6: '#7e4520',
  7: '#9a5628',
  8: '#ba6a32',
  9: '#e8792a',
  10: '#f59b4f',
  11: '#fbbf7a',
  12: '#fde8cc',
} as const;

export const orangeLight = {
  1: '#fff9f5',
  2: '#fff2ea',
  3: '#ffe4d4',
  4: '#ffd0b5',
  5: '#ffb88e',
  6: '#ff9c64',
  7: '#f58040',
  8: '#e56a28',
  9: '#d4620e',
  10: '#b54e0a',
  11: '#943f08',
  12: '#4a1c02',
} as const;

// ---------------------------------------------------------------------------
// Sunrise Gray — warm-tinted neutral (sunrise tema)
// ---------------------------------------------------------------------------

export const sunriseGray = {
  1: '#0f0b08',
  2: '#1a1510',
  3: '#262019',
  4: '#322b22',
  5: '#3e372c',
  6: '#4c4437',
  7: '#605645',
  8: '#796c58',
  9: '#93846e',
  10: '#ada08c',
  11: '#c7bcac',
  12: '#f0ece6',
} as const;

export const sunriseGrayLight = {
  1: '#fdfcfa',
  2: '#f9f7f4',
  3: '#f3f0eb',
  4: '#ece8e1',
  5: '#e4dfd6',
  6: '#d9d3c8',
  7: '#c9c1b4',
  8: '#b2a898',
  9: '#9a8e7e',
  10: '#7f7464',
  11: '#635a4c',
  12: '#2a2318',
} as const;

// ---------------------------------------------------------------------------
// Slate Gray — pure neutral (slate tema)
// ---------------------------------------------------------------------------

export const slateGray = {
  1: '#0a0a0c',
  2: '#121214',
  3: '#1a1a1e',
  4: '#232328',
  5: '#2b2b32',
  6: '#35353e',
  7: '#42424e',
  8: '#565664',
  9: '#6b6b7c',
  10: '#868696',
  11: '#a5a5b2',
  12: '#eeeeef',
} as const;

export const slateGrayLight = {
  1: '#fcfcfd',
  2: '#f8f8f9',
  3: '#f1f1f3',
  4: '#eaeaed',
  5: '#e2e2e6',
  6: '#d6d6dc',
  7: '#c5c5ce',
  8: '#ababb8',
  9: '#9090a0',
  10: '#707084',
  11: '#535368',
  12: '#1c1c28',
} as const;

// ---------------------------------------------------------------------------
// Violet — primary accent (slate tema — premium nötr)
// ---------------------------------------------------------------------------

export const violet = {
  1: '#0c0812',
  2: '#170f24',
  3: '#24183a',
  4: '#322252',
  5: '#402c6a',
  6: '#503882',
  7: '#62469e',
  8: '#7758ba',
  9: '#8b5cf6',
  10: '#a78bfa',
  11: '#c4b5fd',
  12: '#ede9fe',
} as const;

export const violetLight = {
  1: '#faf8ff',
  2: '#f5f0ff',
  3: '#ebe0ff',
  4: '#ddc9ff',
  5: '#cbabfc',
  6: '#b58df5',
  7: '#9e72ea',
  8: '#885ad9',
  9: '#7c3aed',
  10: '#6d28d9',
  11: '#5b21b6',
  12: '#2e1065',
} as const;

// ---------------------------------------------------------------------------
// Rose — primary accent (rose tema)
// ---------------------------------------------------------------------------

export const rose = {
  1: '#160810',
  2: '#280e1c',
  3: '#3e162c',
  4: '#561e3e',
  5: '#6e2650',
  6: '#882e62',
  7: '#a43878',
  8: '#c44490',
  9: '#f43f5e',
  10: '#fb7185',
  11: '#fda4af',
  12: '#ffe4e6',
} as const;

export const roseLight = {
  1: '#fff5f6',
  2: '#ffe8ea',
  3: '#ffd4d8',
  4: '#ffb4bc',
  5: '#ff8c98',
  6: '#f86476',
  7: '#e84458',
  8: '#d42e44',
  9: '#e11d48',
  10: '#be123c',
  11: '#9f1239',
  12: '#4c0519',
} as const;

// ---------------------------------------------------------------------------
// Rose Gray — pink-tinted neutral (rose tema)
// ---------------------------------------------------------------------------

export const roseGray = {
  1: '#0e090a',
  2: '#191214',
  3: '#241b1e',
  4: '#302428',
  5: '#3c2d32',
  6: '#49383e',
  7: '#5c464e',
  8: '#745a64',
  9: '#8d707c',
  10: '#a68c96',
  11: '#c0abb2',
  12: '#f0e8eb',
} as const;

export const roseGrayLight = {
  1: '#fdfbfc',
  2: '#f9f6f7',
  3: '#f3eff1',
  4: '#ece7ea',
  5: '#e4dee1',
  6: '#d9d1d5',
  7: '#c9bfc4',
  8: '#b0a4aa',
  9: '#988a91',
  10: '#7c7078',
  11: '#615660',
  12: '#2a2126',
} as const;

// ---------------------------------------------------------------------------
// Gold — primary accent (amber tema — lüks fintech)
// ---------------------------------------------------------------------------

export const gold = {
  1: '#140f04',
  2: '#221a08',
  3: '#36280d',
  4: '#4a3712',
  5: '#604718',
  6: '#76581e',
  7: '#906c26',
  8: '#ae8330',
  9: '#d4a017',
  10: '#eab830',
  11: '#f5d060',
  12: '#fcf0c8',
} as const;

export const goldLight = {
  1: '#fffdf5',
  2: '#fffaeb',
  3: '#fff3cc',
  4: '#ffe8a0',
  5: '#ffd96e',
  6: '#ffc83d',
  7: '#f0b223',
  8: '#d99b12',
  9: '#c28a06',
  10: '#a07309',
  11: '#7d5a0b',
  12: '#3d2b04',
} as const;

// ---------------------------------------------------------------------------
// Amber Gray — golden-tinted neutral (amber tema)
// ---------------------------------------------------------------------------

export const amberGray = {
  1: '#0e0c08',
  2: '#1a1810',
  3: '#262319',
  4: '#332e22',
  5: '#403a2c',
  6: '#4e4738',
  7: '#625847',
  8: '#7b6e5a',
  9: '#958570',
  10: '#ad9e8a',
  11: '#c8bba8',
  12: '#f0ece2',
} as const;

export const amberGrayLight = {
  1: '#fdfcf8',
  2: '#faf8f2',
  3: '#f4f1e8',
  4: '#ede9dd',
  5: '#e5e0d2',
  6: '#dad4c4',
  7: '#cac2b0',
  8: '#b3a995',
  9: '#9b907c',
  10: '#807662',
  11: '#655d4c',
  12: '#2c2618',
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
