/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * QR Code encoder — sifirdan implementasyon.
 * QR Code encoder — from-scratch implementation.
 *
 * Byte mode encoding, Reed-Solomon error correction (GF(256)),
 * matrix placement, masking, format/version info.
 *
 * Desteklenen: Version 1-10, Error correction L/M/Q/H
 *
 * @packageDocumentation
 */

import type { ErrorCorrectionLevel, QRMatrix, QRModule, QRCodeConfig, QRCodeResult } from './qrcode.types';

// ── Galois Field GF(256) ──────────────────────────────

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

function initGaloisField(): void {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x = x << 1;
    if (x >= 256) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = gfExp(i - 255);
  }
}

/** Safe access to GF_EXP */
function gfExp(i: number): number {
  return GF_EXP[i] ?? 0;
}

/** Safe access to GF_LOG */
function gfLog(i: number): number {
  return GF_LOG[i] ?? 0;
}

initGaloisField();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return gfExp(gfLog(a) + gfLog(b));
}

// ── Reed-Solomon ──────────────────────────────────────

function rsGeneratorPoly(nsym: number): Uint8Array {
  let g = new Uint8Array([1]);
  for (let i = 0; i < nsym; i++) {
    const newG = new Uint8Array(g.length + 1);
    const factor = gfExp(i);
    for (let j = 0; j < g.length; j++) {
      const gj = g[j] ?? 0;
      newG[j] = (newG[j] ?? 0) ^ gj;
      newG[j + 1] = ((newG[j + 1] ?? 0) ^ gfMul(gj, factor)) as number;
    }
    g = newG;
  }
  return g;
}

function rsEncode(data: Uint8Array, nsym: number): Uint8Array {
  const gen = rsGeneratorPoly(nsym);
  const result = new Uint8Array(data.length + nsym);
  result.set(data);

  for (let i = 0; i < data.length; i++) {
    const coef = result[i] ?? 0;
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        result[i + j] = ((result[i + j] ?? 0) ^ gfMul(gen[j] ?? 0, coef)) as number;
      }
    }
  }

  return result.slice(data.length);
}

// ── QR Code Data Tables ───────────────────────────────

/** [totalCodewords, ecCodewordsPerBlock, numBlocks] per version per EC level */
const VERSION_TABLE: Record<ErrorCorrectionLevel, [number, number, number][]> = {
  L: [
    [26, 7, 1], [44, 10, 1], [70, 15, 1], [100, 20, 1], [134, 26, 1],
    [172, 18, 2], [196, 20, 2], [242, 24, 2], [292, 30, 2], [346, 18, 4],
  ],
  M: [
    [26, 10, 1], [44, 16, 1], [70, 26, 1], [100, 18, 2], [134, 24, 2],
    [172, 16, 4], [196, 18, 4], [242, 22, 4], [292, 22, 5], [346, 26, 5],
  ],
  Q: [
    [26, 13, 1], [44, 22, 1], [70, 18, 2], [100, 26, 2], [134, 18, 4],
    [172, 24, 4], [196, 18, 6], [242, 22, 6], [292, 20, 8], [346, 24, 8],
  ],
  H: [
    [26, 17, 1], [44, 28, 1], [70, 22, 2], [100, 16, 4], [134, 22, 4],
    [172, 28, 4], [196, 26, 5], [242, 26, 6], [292, 24, 8], [346, 28, 8],
  ],
};

/** Alignment pattern positions per version (1-10) */
const ALIGNMENT_POSITIONS: number[][] = [
  [],          // v1: no alignment
  [6, 18],     // v2
  [6, 22],     // v3
  [6, 26],     // v4
  [6, 30],     // v5
  [6, 34],     // v6
  [6, 22, 38], // v7
  [6, 24, 42], // v8
  [6, 26, 46], // v9
  [6, 28, 52], // v10
];

/** EC level index for format info */
const EC_LEVEL_BITS: Record<ErrorCorrectionLevel, number> = { L: 1, M: 0, Q: 3, H: 2 };

// ── Matrix Helpers ────────────────────────────────────

function mGet(matrix: QRMatrix, r: number, c: number): QRModule {
  const row = matrix[r];
  return row ? (row[c] ?? 0) : 0;
}

function mSet(matrix: QRMatrix, r: number, c: number, v: QRModule): void {
  const row = matrix[r];
  if (row) row[c] = v;
}

function rGet(reserved: boolean[][], r: number, c: number): boolean {
  const row = reserved[r];
  return row ? (row[c] ?? false) : false;
}

function rSet(reserved: boolean[][], r: number, c: number, v: boolean): void {
  const row = reserved[r];
  if (row) row[c] = v;
}

// ── Byte Mode Encoding ────────────────────────────────

function encodeData(value: string, version: number, ecLevel: ErrorCorrectionLevel): Uint8Array {
  const table = VERSION_TABLE[ecLevel];
  const entry = table[version - 1] ?? [26, 10, 1];
  const totalCodewords = entry[0];
  const ecPerBlock = entry[1];
  const numBlocks = entry[2];
  const dataCodewords = totalCodewords - ecPerBlock * numBlocks;

  const bytes = new TextEncoder().encode(value);
  const bits: number[] = [];

  // Mode indicator: 0100 (byte mode)
  bits.push(0, 1, 0, 0);

  // Character count: 8 bits for v1-9, 16 bits for v10+
  const countBits = version <= 9 ? 8 : 16;
  for (let i = countBits - 1; i >= 0; i--) {
    bits.push((bytes.length >> i) & 1);
  }

  // Data
  for (const byte of bytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1);
    }
  }

  // Terminator (up to 4 bits)
  const maxBits = dataCodewords * 8;
  for (let i = 0; i < 4 && bits.length < maxBits; i++) {
    bits.push(0);
  }

  // Pad to byte boundary
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  // Pad bytes (0xEC, 0x11 alternating)
  const padPattern = [0xec, 0x11] as const;
  let padIdx = 0;
  while (bits.length < maxBits) {
    const pb = padPattern[padIdx % 2] ?? 0xec;
    for (let i = 7; i >= 0; i--) {
      bits.push((pb >> i) & 1);
    }
    padIdx++;
  }

  // Convert bits to bytes
  const dataBytes = new Uint8Array(dataCodewords);
  for (let i = 0; i < dataCodewords; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | (bits[i * 8 + j] ?? 0);
    }
    dataBytes[i] = byte;
  }

  // Split into blocks and add EC
  const blockDataSize = Math.floor(dataCodewords / numBlocks);
  const largerBlocks = dataCodewords % numBlocks;
  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  let offset = 0;

  for (let b = 0; b < numBlocks; b++) {
    const sz = blockDataSize + (b >= numBlocks - largerBlocks ? 1 : 0);
    const block = dataBytes.slice(offset, offset + sz);
    dataBlocks.push(block);
    ecBlocks.push(rsEncode(block, ecPerBlock));
    offset += sz;
  }

  // Interleave data blocks
  const maxDataBlockSize = blockDataSize + (largerBlocks > 0 ? 1 : 0);
  const result: number[] = [];

  for (let i = 0; i < maxDataBlockSize; i++) {
    for (let b = 0; b < numBlocks; b++) {
      const blk = dataBlocks[b];
      if (blk && i < blk.length) {
        result.push(blk[i] ?? 0);
      }
    }
  }

  // Interleave EC blocks
  for (let i = 0; i < ecPerBlock; i++) {
    for (let b = 0; b < numBlocks; b++) {
      const blk = ecBlocks[b];
      if (blk) result.push(blk[i] ?? 0);
    }
  }

  return new Uint8Array(result);
}

// ── Matrix Construction ───────────────────────────────

function createMatrix(size: number): { matrix: QRMatrix; reserved: boolean[][] } {
  const matrix: QRMatrix = Array.from({ length: size }, () =>
    new Array<QRModule>(size).fill(0),
  );
  const reserved: boolean[][] = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false),
  );
  return { matrix, reserved };
}

function placeFinderPattern(matrix: QRMatrix, reserved: boolean[][], row: number, col: number): void {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const mr = row + r;
      const mc = col + c;
      if (mr < 0 || mr >= matrix.length || mc < 0 || mc >= matrix.length) continue;

      let val: QRModule = 0;
      if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          val = 1;
        }
      }
      mSet(matrix, mr, mc, val);
      rSet(reserved, mr, mc, true);
    }
  }
}

function placeAlignmentPattern(matrix: QRMatrix, reserved: boolean[][], row: number, col: number): void {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      if (rGet(reserved, row + r, col + c)) return;
    }
  }
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const val: QRModule = (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) ? 1 : 0;
      mSet(matrix, row + r, col + c, val);
      rSet(reserved, row + r, col + c, true);
    }
  }
}

function placeTimingPatterns(matrix: QRMatrix, reserved: boolean[][]): void {
  const size = matrix.length;
  for (let i = 8; i < size - 8; i++) {
    const val: QRModule = i % 2 === 0 ? 1 : 0;
    if (!rGet(reserved, 6, i)) {
      mSet(matrix, 6, i, val);
      rSet(reserved, 6, i, true);
    }
    if (!rGet(reserved, i, 6)) {
      mSet(matrix, i, 6, val);
      rSet(reserved, i, 6, true);
    }
  }
}

function reserveFormatArea(matrix: QRMatrix, reserved: boolean[][]): void {
  const size = matrix.length;
  for (let i = 0; i <= 8; i++) {
    if (i < size) {
      rSet(reserved, 8, i, true);
      rSet(reserved, i, 8, true);
    }
  }
  for (let i = 0; i <= 7; i++) {
    rSet(reserved, 8, size - 1 - i, true);
  }
  for (let i = 0; i <= 7; i++) {
    rSet(reserved, size - 1 - i, 8, true);
  }
  mSet(matrix, size - 8, 8, 1);
  rSet(reserved, size - 8, 8, true);
}

function placeData(matrix: QRMatrix, reserved: boolean[][], data: Uint8Array): void {
  const size = matrix.length;
  const totalBits = data.length * 8;
  let bitIdx = 0;

  let col = size - 1;
  let upward = true;

  while (col >= 0) {
    if (col === 6) col--;

    const rowStart = upward ? size - 1 : 0;
    const rowEnd = upward ? -1 : size;
    const rowStep = upward ? -1 : 1;

    for (let row = rowStart; row !== rowEnd; row += rowStep) {
      for (let dc = 0; dc <= 1; dc++) {
        const c = col - dc;
        if (c < 0) continue;
        if (rGet(reserved, row, c)) continue;

        if (bitIdx < totalBits) {
          const byteIdx = Math.floor(bitIdx / 8);
          const bitPos = 7 - (bitIdx % 8);
          mSet(matrix, row, c, (((data[byteIdx] ?? 0) >> bitPos) & 1) as QRModule);
          bitIdx++;
        }
      }
    }

    col -= 2;
    upward = !upward;
  }
}

// ── Masking ───────────────────────────────────────────

type MaskFn = (row: number, col: number) => boolean;

const MASK_FUNCTIONS: MaskFn[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

function getMaskFn(idx: number): MaskFn {
  return MASK_FUNCTIONS[idx] ?? MASK_FUNCTIONS[0] ?? (() => false);
}

function applyMask(matrix: QRMatrix, reserved: boolean[][], maskIdx: number): QRMatrix {
  const size = matrix.length;
  const masked: QRMatrix = matrix.map((row) => [...row]);
  const fn = getMaskFn(maskIdx);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!rGet(reserved, r, c) && fn(r, c)) {
        mSet(masked, r, c, mGet(masked, r, c) === 1 ? 0 : 1);
      }
    }
  }
  return masked;
}

function penaltyScore(matrix: QRMatrix): number {
  const size = matrix.length;
  let score = 0;

  // Rule 1: consecutive same-color modules in row/col
  for (let r = 0; r < size; r++) {
    let count = 1;
    for (let c = 1; c < size; c++) {
      if (mGet(matrix, r, c) === mGet(matrix, r, c - 1)) {
        count++;
      } else {
        if (count >= 5) score += count - 2;
        count = 1;
      }
    }
    if (count >= 5) score += count - 2;
  }
  for (let c = 0; c < size; c++) {
    let count = 1;
    for (let r = 1; r < size; r++) {
      if (mGet(matrix, r, c) === mGet(matrix, r - 1, c)) {
        count++;
      } else {
        if (count >= 5) score += count - 2;
        count = 1;
      }
    }
    if (count >= 5) score += count - 2;
  }

  // Rule 2: 2x2 same-color blocks
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = mGet(matrix, r, c);
      if (v === mGet(matrix, r, c + 1) && v === mGet(matrix, r + 1, c) && v === mGet(matrix, r + 1, c + 1)) {
        score += 3;
      }
    }
  }

  // Rule 4: dark/light ratio
  let dark = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (mGet(matrix, r, c) === 1) dark++;
    }
  }
  const total = size * size;
  const pct = (dark / total) * 100;
  const prev5 = Math.floor(pct / 5) * 5;
  const next5 = prev5 + 5;
  score += Math.min(Math.abs(prev5 - 50) / 5, Math.abs(next5 - 50) / 5) * 10;

  return score;
}

// ── Format Information ────────────────────────────────

function placeFormatInfo(matrix: QRMatrix, ecLevel: ErrorCorrectionLevel, maskIdx: number): void {
  const size = matrix.length;
  const data = (EC_LEVEL_BITS[ecLevel] << 3) | maskIdx;

  // BCH(15,5) encoding
  let bits = data << 10;
  const gen = 0x537;
  for (let i = 4; i >= 0; i--) {
    if (bits & (1 << (i + 10))) {
      bits ^= gen << i;
    }
  }
  const formatBits = ((data << 10) | bits) ^ 0x5412;

  // Place format bits — two copies
  const fp1: [number, number][] = [
    [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [7, 8], [8, 8],
    [8, 7], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  ];
  const fp2: [number, number][] = [
    [8, size - 1], [8, size - 2], [8, size - 3], [8, size - 4],
    [8, size - 5], [8, size - 6], [8, size - 7],
    [size - 7, 8], [size - 6, 8], [size - 5, 8], [size - 4, 8],
    [size - 3, 8], [size - 2, 8], [size - 1, 8],
  ];

  for (let i = 0; i < 15; i++) {
    const bit = ((formatBits >> i) & 1) as QRModule;
    const pos1 = fp1[i];
    if (pos1) mSet(matrix, pos1[0], pos1[1], bit);
    const pos2 = fp2[i];
    if (pos2) mSet(matrix, pos2[0], pos2[1], bit);
  }
}

// ── Version Selection ─────────────────────────────────

function selectVersion(value: string, ecLevel: ErrorCorrectionLevel): number {
  const byteLen = new TextEncoder().encode(value).length;
  const table = VERSION_TABLE[ecLevel];

  for (let v = 0; v < table.length; v++) {
    const entry = table[v];
    if (!entry) continue;
    const dataCW = entry[0] - entry[1] * entry[2];
    const countBits = v < 9 ? 8 : 16;
    const maxBytes = Math.floor((dataCW * 8 - 4 - countBits) / 8);
    if (byteLen <= maxBytes) return v + 1;
  }

  throw new Error(`Data too long for QR code (max version 10). Byte length: ${byteLen}`);
}

// ── Public API ────────────────────────────────────────

/**
 * QR kod olusturur / Generate QR code.
 *
 * @param config - QR kod ayarlari / QR code config
 * @returns QR kod sonucu (matrix, version, size) / QR code result
 */
export function generateQRCode(config: QRCodeConfig): QRCodeResult {
  const { value, errorCorrection = 'M' } = config;

  if (!value) {
    throw new Error('QR code value cannot be empty.');
  }

  const version = selectVersion(value, errorCorrection);
  const size = version * 4 + 17;

  const { matrix, reserved } = createMatrix(size);

  // Place finder patterns (top-left, top-right, bottom-left)
  placeFinderPattern(matrix, reserved, 0, 0);
  placeFinderPattern(matrix, reserved, 0, size - 7);
  placeFinderPattern(matrix, reserved, size - 7, 0);

  // Place alignment patterns
  const alignPositions = ALIGNMENT_POSITIONS[version - 1];
  if (alignPositions && alignPositions.length > 0) {
    for (const r of alignPositions) {
      for (const c of alignPositions) {
        placeAlignmentPattern(matrix, reserved, r, c);
      }
    }
  }

  // Timing patterns
  placeTimingPatterns(matrix, reserved);

  // Reserve format area
  reserveFormatArea(matrix, reserved);

  // Encode data
  const codewords = encodeData(value, version, errorCorrection);

  // Place data
  placeData(matrix, reserved, codewords);

  // Find best mask
  let bestMask = 0;
  let bestScore = Infinity;

  for (let m = 0; m < 8; m++) {
    const masked = applyMask(matrix, reserved, m);
    placeFormatInfo(masked, errorCorrection, m);
    const sc = penaltyScore(masked);
    if (sc < bestScore) {
      bestScore = sc;
      bestMask = m;
    }
  }

  // Apply best mask
  const finalMatrix = applyMask(matrix, reserved, bestMask);
  placeFormatInfo(finalMatrix, errorCorrection, bestMask);

  return { matrix: finalMatrix, version, size };
}
