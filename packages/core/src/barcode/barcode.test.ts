/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { encodeBarcode } from './barcode.machine';

describe('encodeBarcode', () => {
  // ── Code128 ──

  it('code128 gecerli deger encode eder', () => {
    const result = encodeBarcode('Hello', 'code128');
    expect(result.valid).toBe(true);
    expect(result.bars.length).toBeGreaterThan(0);
    expect(result.text).toBe('Hello');
    expect(result.format).toBe('code128');
  });

  it('code128 sayi encode eder', () => {
    const result = encodeBarcode('12345', 'code128');
    expect(result.valid).toBe(true);
    expect(result.bars.length).toBeGreaterThan(0);
  });

  it('code128 bos string encode eder', () => {
    const result = encodeBarcode('', 'code128');
    expect(result.valid).toBe(true);
  });

  it('code128 bars boolean array doner', () => {
    const result = encodeBarcode('A', 'code128');
    expect(result.bars.every((b) => typeof b === 'boolean')).toBe(true);
  });

  it('code128 farkli degerler farkli bars uretir', () => {
    const a = encodeBarcode('A', 'code128');
    const b = encodeBarcode('B', 'code128');
    expect(a.bars).not.toEqual(b.bars);
  });

  // ── Code39 ──

  it('code39 gecerli deger encode eder', () => {
    const result = encodeBarcode('HELLO', 'code39');
    expect(result.valid).toBe(true);
    expect(result.bars.length).toBeGreaterThan(0);
  });

  it('code39 sayi encode eder', () => {
    const result = encodeBarcode('12345', 'code39');
    expect(result.valid).toBe(true);
  });

  it('code39 kucuk harf buyuk harfe cevirir', () => {
    const result = encodeBarcode('hello', 'code39');
    expect(result.valid).toBe(true);
  });

  it('code39 gecersiz karakter reddeder', () => {
    const result = encodeBarcode('hello@world', 'code39');
    expect(result.valid).toBe(false);
    expect(result.bars).toEqual([]);
  });

  it('code39 ozel karakterler destekler', () => {
    const result = encodeBarcode('A-B.C', 'code39');
    expect(result.valid).toBe(true);
  });

  // ── EAN-13 ──

  it('ean13 12 haneli deger encode eder (check digit ekler)', () => {
    const result = encodeBarcode('590123412345', 'ean13');
    expect(result.valid).toBe(true);
    expect(result.text).toHaveLength(13);
  });

  it('ean13 13 haneli gecerli deger kabul eder', () => {
    const result = encodeBarcode('5901234123457', 'ean13');
    expect(result.valid).toBe(true);
    expect(result.text).toBe('5901234123457');
  });

  it('ean13 yanlis check digit reddeder', () => {
    const result = encodeBarcode('5901234123458', 'ean13');
    expect(result.valid).toBe(false);
  });

  it('ean13 sayi olmayan deger reddeder', () => {
    const result = encodeBarcode('abcdefghijkl', 'ean13');
    expect(result.valid).toBe(false);
  });

  it('ean13 kisa deger reddeder', () => {
    const result = encodeBarcode('12345', 'ean13');
    expect(result.valid).toBe(false);
  });

  it('ean13 bars uzunlugu 95 (standart)', () => {
    const result = encodeBarcode('590123412345', 'ean13');
    expect(result.bars).toHaveLength(95);
  });

  it('ean13 start guard dogru', () => {
    const result = encodeBarcode('590123412345', 'ean13');
    expect(result.bars.slice(0, 3)).toEqual([true, false, true]);
  });

  it('ean13 end guard dogru', () => {
    const result = encodeBarcode('590123412345', 'ean13');
    expect(result.bars.slice(-3)).toEqual([true, false, true]);
  });

  // ── General ──

  it('format code128 doner', () => {
    expect(encodeBarcode('X', 'code128').format).toBe('code128');
  });

  it('format code39 doner', () => {
    expect(encodeBarcode('X', 'code39').format).toBe('code39');
  });

  it('format ean13 doner', () => {
    expect(encodeBarcode('590123412345', 'ean13').format).toBe('ean13');
  });
});
