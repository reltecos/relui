/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { computeDiff } from './diff-viewer.machine';

describe('computeDiff', () => {
  it('ayni metin tum satirlar equal', () => {
    const result = computeDiff('hello\nworld', 'hello\nworld');
    expect(result.lines.every((l) => l.type === 'equal')).toBe(true);
    expect(result.addedCount).toBe(0);
    expect(result.removedCount).toBe(0);
  });

  it('bos metinler bos result', () => {
    const result = computeDiff('', '');
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0]?.type).toBe('equal');
  });

  it('eklenen satirlar add olarak isareti', () => {
    const result = computeDiff('a', 'a\nb');
    const adds = result.lines.filter((l) => l.type === 'add');
    expect(adds).toHaveLength(1);
    expect(adds[0]?.newValue).toBe('b');
    expect(result.addedCount).toBe(1);
  });

  it('silinen satirlar remove olarak isareti', () => {
    const result = computeDiff('a\nb', 'a');
    const removes = result.lines.filter((l) => l.type === 'remove');
    expect(removes).toHaveLength(1);
    expect(removes[0]?.oldValue).toBe('b');
    expect(result.removedCount).toBe(1);
  });

  it('degistirilen satir remove + add olarak gosterilir', () => {
    const result = computeDiff('hello', 'world');
    expect(result.removedCount).toBe(1);
    expect(result.addedCount).toBe(1);
  });

  it('coklu ekleme ve silme', () => {
    const result = computeDiff('a\nb\nc', 'a\nx\ny\nc');
    expect(result.addedCount).toBeGreaterThanOrEqual(2);
    expect(result.removedCount).toBeGreaterThanOrEqual(1);
  });

  it('equal satirlarda oldNum ve newNum var', () => {
    const result = computeDiff('hello\nworld', 'hello\nworld');
    expect(result.lines[0]?.oldNum).toBe(1);
    expect(result.lines[0]?.newNum).toBe(1);
  });

  it('add satirlarda oldNum null', () => {
    const result = computeDiff('', 'hello');
    const add = result.lines.find((l) => l.type === 'add');
    expect(add?.oldNum).toBeNull();
    expect(add?.newNum).not.toBeNull();
  });

  it('remove satirlarda newNum null', () => {
    const result = computeDiff('hello', '');
    const rem = result.lines.find((l) => l.type === 'remove');
    expect(rem?.newNum).toBeNull();
    expect(rem?.oldNum).not.toBeNull();
  });

  it('uzun metin diff performans sorunu yok', () => {
    const old = Array.from({ length: 100 }, (_, i) => `line ${i}`).join('\n');
    const next = Array.from({ length: 100 }, (_, i) => i === 50 ? 'CHANGED' : `line ${i}`).join('\n');
    const result = computeDiff(old, next);
    expect(result.lines.length).toBeGreaterThan(0);
  });

  it('tamamen farkli metinler', () => {
    const result = computeDiff('a\nb\nc', 'x\ny\nz');
    expect(result.removedCount).toBe(3);
    expect(result.addedCount).toBe(3);
  });

  it('bos eski metin tum satirlar add', () => {
    const result = computeDiff('', 'a\nb');
    expect(result.addedCount).toBeGreaterThanOrEqual(1);
  });

  it('bos yeni metin tum satirlar remove', () => {
    const result = computeDiff('a\nb', '');
    expect(result.removedCount).toBeGreaterThanOrEqual(1);
  });
});
