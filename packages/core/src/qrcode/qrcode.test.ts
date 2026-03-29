/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { generateQRCode } from './qrcode.machine';

describe('generateQRCode', () => {
  // ── Basic generation ──

  it('basit metin icin QR kod olusturur', () => {
    const result = generateQRCode({ value: 'Hello' });
    expect(result).toBeDefined();
    expect(result.matrix).toBeDefined();
    expect(result.version).toBeGreaterThanOrEqual(1);
    expect(result.size).toBe(result.version * 4 + 17);
  });

  it('matrix boyutu size ile eslesir', () => {
    const result = generateQRCode({ value: 'Test' });
    expect(result.matrix.length).toBe(result.size);
    expect(result.matrix[0].length).toBe(result.size);
  });

  it('matrix sadece 0 ve 1 icerir', () => {
    const result = generateQRCode({ value: 'Binary' });
    for (const row of result.matrix) {
      for (const cell of row) {
        expect(cell === 0 || cell === 1).toBe(true);
      }
    }
  });

  it('matrix kare seklindedir', () => {
    const result = generateQRCode({ value: 'Square' });
    for (const row of result.matrix) {
      expect(row.length).toBe(result.size);
    }
  });

  // ── Version selection ──

  it('kisa metin icin version 1 secer', () => {
    const result = generateQRCode({ value: 'Hi', errorCorrection: 'L' });
    expect(result.version).toBe(1);
    expect(result.size).toBe(21); // v1 = 21x21
  });

  it('uzun metin icin daha yuksek version secer', () => {
    const longText = 'A'.repeat(100);
    const result = generateQRCode({ value: longText, errorCorrection: 'L' });
    expect(result.version).toBeGreaterThan(2);
  });

  it('version 1 boyutu 21x21', () => {
    const result = generateQRCode({ value: 'A', errorCorrection: 'L' });
    expect(result.version).toBe(1);
    expect(result.size).toBe(21);
  });

  // ── Error correction levels ──

  it('EC level L ile olusturur', () => {
    const result = generateQRCode({ value: 'Test', errorCorrection: 'L' });
    expect(result.matrix.length).toBe(result.size);
  });

  it('EC level M ile olusturur (varsayilan)', () => {
    const result = generateQRCode({ value: 'Test' });
    expect(result.matrix.length).toBe(result.size);
  });

  it('EC level Q ile olusturur', () => {
    const result = generateQRCode({ value: 'Test', errorCorrection: 'Q' });
    expect(result.matrix.length).toBe(result.size);
  });

  it('EC level H ile olusturur', () => {
    const result = generateQRCode({ value: 'Test', errorCorrection: 'H' });
    expect(result.matrix.length).toBe(result.size);
  });

  it('yuksek EC level daha buyuk version gerektirir', () => {
    const text = 'A'.repeat(30);
    const resultL = generateQRCode({ value: text, errorCorrection: 'L' });
    const resultH = generateQRCode({ value: text, errorCorrection: 'H' });
    expect(resultH.version).toBeGreaterThanOrEqual(resultL.version);
  });

  // ── Finder patterns ──

  it('sol ust kosede finder pattern vardir', () => {
    const result = generateQRCode({ value: 'FP' });
    const m = result.matrix;
    // Top-left finder: 7x7, top-left corner should be 1
    expect(m[0][0]).toBe(1);
    expect(m[0][6]).toBe(1);
    expect(m[6][0]).toBe(1);
    expect(m[6][6]).toBe(1);
    // Center of finder
    expect(m[3][3]).toBe(1);
    // Separator (row 7 or col 7 around finder)
    expect(m[7][0]).toBe(0);
  });

  it('sag ust kosede finder pattern vardir', () => {
    const result = generateQRCode({ value: 'FP' });
    const m = result.matrix;
    const s = result.size;
    expect(m[0][s - 1]).toBe(1);
    expect(m[0][s - 7]).toBe(1);
    expect(m[6][s - 1]).toBe(1);
    expect(m[3][s - 4]).toBe(1);
  });

  it('sol alt kosede finder pattern vardir', () => {
    const result = generateQRCode({ value: 'FP' });
    const m = result.matrix;
    const s = result.size;
    expect(m[s - 1][0]).toBe(1);
    expect(m[s - 7][0]).toBe(1);
    expect(m[s - 1][6]).toBe(1);
    expect(m[s - 4][3]).toBe(1);
  });

  // ── Deterministic output ──

  it('ayni girdi ayni ciktiyi uretir', () => {
    const r1 = generateQRCode({ value: 'Deterministic', errorCorrection: 'M' });
    const r2 = generateQRCode({ value: 'Deterministic', errorCorrection: 'M' });
    expect(r1.matrix).toEqual(r2.matrix);
    expect(r1.version).toBe(r2.version);
    expect(r1.size).toBe(r2.size);
  });

  it('farkli girdi farkli cikti uretir', () => {
    const r1 = generateQRCode({ value: 'AAA' });
    const r2 = generateQRCode({ value: 'BBB' });
    const flat1 = r1.matrix.flat().join('');
    const flat2 = r2.matrix.flat().join('');
    expect(flat1).not.toBe(flat2);
  });

  // ── Edge cases ──

  it('bos string icin hata firlatir', () => {
    expect(() => generateQRCode({ value: '' })).toThrow('QR code value cannot be empty');
  });

  it('cok uzun metin icin hata firlatir', () => {
    const tooLong = 'X'.repeat(500);
    expect(() => generateQRCode({ value: tooLong })).toThrow('Data too long');
  });

  it('URL icin QR kod olusturur', () => {
    const result = generateQRCode({ value: 'https://relteco.com' });
    expect(result.matrix.length).toBeGreaterThan(0);
  });

  it('ozel karakterler icin QR kod olusturur', () => {
    const result = generateQRCode({ value: 'Hello & World <test>' });
    expect(result.matrix.length).toBeGreaterThan(0);
  });

  it('tek karakter icin QR kod olusturur', () => {
    const result = generateQRCode({ value: 'A', errorCorrection: 'L' });
    expect(result.version).toBe(1);
  });

  it('sayi dizisi icin QR kod olusturur', () => {
    const result = generateQRCode({ value: '1234567890' });
    expect(result.matrix.length).toBeGreaterThan(0);
  });
});
