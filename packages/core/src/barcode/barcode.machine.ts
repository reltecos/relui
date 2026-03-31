/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Barcode encoder — Code128, Code39, EAN-13.
 * 3. parti kutuphanesiz, saf TS implementasyonu.
 *
 * @packageDocumentation
 */

import type { BarcodeFormat, BarcodeResult } from './barcode.types';

// ── Code128 ─────────────────────────────────────────

const CODE128_PATTERNS: number[][] = [
  [2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],
  [1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],
  [2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],
  [1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],
  [2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],
  [3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],
  [2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],
  [1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],
  [2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],
  [1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],
  [2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],
  [3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],
  [3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],
  [1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],
  [1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],
  [2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],
  [1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],
  [1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],
  [2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],
  [1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],
  [1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],
  [2,1,1,2,3,2],[2,3,3,1,1,1,2],
];

const CODE128_START_B = 104;
const CODE128_STOP = 106;

function patternToBars(pattern: number[]): boolean[] {
  const bars: boolean[] = [];
  for (let i = 0; i < pattern.length; i++) {
    const count = pattern[i] ?? 0;
    const isBar = i % 2 === 0;
    for (let j = 0; j < count; j++) bars.push(isBar);
  }
  return bars;
}

function encodeCode128(value: string): BarcodeResult {
  const codes: number[] = [CODE128_START_B];
  let checksum = CODE128_START_B;

  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i) - 32;
    if (code < 0 || code > 95) {
      return { bars: [], text: value, format: 'code128', valid: false };
    }
    codes.push(code);
    checksum += code * (i + 1);
  }

  codes.push(checksum % 103);
  codes.push(CODE128_STOP);

  const bars: boolean[] = [];
  for (const code of codes) {
    const pattern = CODE128_PATTERNS[code];
    if (pattern) bars.push(...patternToBars(pattern));
  }

  return { bars, text: value, format: 'code128', valid: true };
}

// ── Code39 ──────────────────────────────────────────

const CODE39_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*';
const CODE39_PATTERNS: Record<string, string> = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnn',
  '4': 'nnnwwnnnw', '5': 'wnnwwnnn', '6': 'nnwwwnnn', '7': 'nnnwnnwnw',
  '8': 'wnnwnnwn', '9': 'nnwwnnwn', 'A': 'wnnnnwnnw', 'B': 'nnwnnwnnw',
  'C': 'wnwnnwnn', 'D': 'nnnnwwnnw', 'E': 'wnnnwwnn', 'F': 'nnwnwwnn',
  'G': 'nnnnnwwnw', 'H': 'wnnnnwwn', 'I': 'nnwnnwwn', 'J': 'nnnnwwwn',
  'K': 'wnnnnnnww', 'L': 'nnwnnnnww', 'M': 'wnwnnnnw', 'N': 'nnnnwnnww',
  'O': 'wnnnwnnw', 'P': 'nnwnwnnw', 'Q': 'nnnnnnwww', 'R': 'wnnnnnww',
  'S': 'nnwnnnww', 'T': 'nnnnwnww', 'U': 'wwnnnnnnw', 'V': 'nwwnnnnnw',
  'W': 'wwwnnnnnn', 'X': 'nwnnwnnnw', 'Y': 'wwnnwnnn', 'Z': 'nwwnwnnn',
  '-': 'nwnnnnwnw', '.': 'wwnnnnwn', ' ': 'nwwnnnwn', '$': 'nwnwnwnn',
  '/': 'nwnwnnnw', '+': 'nwnnnwnw', '%': 'nnnwnwnw', '*': 'nwnnwnwn',
};

function encodeCode39(value: string): BarcodeResult {
  const upper = value.toUpperCase();
  for (const ch of upper) {
    if (!CODE39_CHARS.includes(ch)) {
      return { bars: [], text: value, format: 'code39', valid: false };
    }
  }

  const fullValue = `*${upper}*`;
  const bars: boolean[] = [];

  for (let ci = 0; ci < fullValue.length; ci++) {
    const ch = fullValue[ci] ?? '';
    const pattern = CODE39_PATTERNS[ch as keyof typeof CODE39_PATTERNS];
    if (!pattern) return { bars: [], text: value, format: 'code39', valid: false };

    if (ci > 0) bars.push(false); // inter-character gap

    for (const p of pattern) {
      const isWide = p === 'w' || p === 'W';
      const width = isWide ? 3 : 1;
      const isBar = 'nwNW'.indexOf(p) % 2 === 0;
      for (let j = 0; j < width; j++) bars.push(isBar);
    }
  }

  return { bars, text: value, format: 'code39', valid: true };
}

// ── EAN-13 ──────────────────────────────────────────

const EAN_L: string[] = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
const EAN_G: string[] = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
const EAN_R: string[] = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
const EAN_PARITY: string[] = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];

function encodeEan13(value: string): BarcodeResult {
  if (!/^\d{12,13}$/.test(value)) {
    return { bars: [], text: value, format: 'ean13', valid: false };
  }

  let digits = value.slice(0, 12);
  // Calculate check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(digits[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  digits = digits + String(check);

  if (value.length === 13 && value !== digits) {
    return { bars: [], text: value, format: 'ean13', valid: false };
  }

  const bars: boolean[] = [];
  // Start guard
  bars.push(true, false, true);

  const parity = EAN_PARITY[Number(digits[0])] ?? 'LLLLLL';

  // Left side (digits 1-6)
  for (let i = 1; i <= 6; i++) {
    const d = Number(digits[i]);
    const encoding = (parity[i - 1] ?? 'L') === 'L' ? EAN_L[d] : EAN_G[d];
    for (const bit of encoding ?? '') bars.push(bit === '1');
  }

  // Center guard
  bars.push(false, true, false, true, false);

  // Right side (digits 7-12)
  for (let i = 7; i <= 12; i++) {
    const d = Number(digits[i]);
    const encoding = EAN_R[d] ?? '';
    for (const bit of encoding) bars.push(bit === '1');
  }

  // End guard
  bars.push(true, false, true);

  return { bars, text: digits, format: 'ean13', valid: true };
}

// ── Public API ──────────────────────────────────────

/**
 * Barkod encode eder / Encodes a barcode.
 */
export function encodeBarcode(value: string, format: BarcodeFormat): BarcodeResult {
  switch (format) {
    case 'code128': return encodeCode128(value);
    case 'code39': return encodeCode39(value);
    case 'ean13': return encodeEan13(value);
  }
}
