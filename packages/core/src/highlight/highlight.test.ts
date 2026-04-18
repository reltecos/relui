/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { highlightText } from './highlight.machine';

describe('highlightText', () => {
  it('bos metin bos segment doner', () => {
    const result = highlightText('', 'test');
    expect(result.segments).toEqual([]);
    expect(result.matchCount).toBe(0);
  });

  it('bos terim tum metni text segment yapar', () => {
    const result = highlightText('hello', '');
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0].type).toBe('text');
    expect(result.segments[0].value).toBe('hello');
  });

  it('tek terim eslesmesi', () => {
    const result = highlightText('hello world', 'world');
    expect(result.segments).toHaveLength(2);
    expect(result.segments[0]).toEqual({ type: 'text', value: 'hello ', termIndex: -1 });
    expect(result.segments[1]).toEqual({ type: 'match', value: 'world', termIndex: 0 });
    expect(result.matchCount).toBe(1);
  });

  it('case-insensitive varsayilan', () => {
    const result = highlightText('Hello World', 'hello');
    expect(result.segments[0].type).toBe('match');
    expect(result.segments[0].value).toBe('Hello');
  });

  it('case-sensitive mod', () => {
    const result = highlightText('Hello World', 'hello', true);
    expect(result.segments[0].type).toBe('text');
    expect(result.matchCount).toBe(0);
  });

  it('birden fazla esleme', () => {
    const result = highlightText('ab ab ab', 'ab');
    expect(result.matchCount).toBe(3);
    const matches = result.segments.filter((s) => s.type === 'match');
    expect(matches).toHaveLength(3);
  });

  it('coklu terim destegi', () => {
    const result = highlightText('the quick brown fox', ['quick', 'fox']);
    const matches = result.segments.filter((s) => s.type === 'match');
    expect(matches).toHaveLength(2);
    expect(matches[0].value).toBe('quick');
    expect(matches[0].termIndex).toBe(0);
    expect(matches[1].value).toBe('fox');
    expect(matches[1].termIndex).toBe(1);
  });

  it('metin basinda esleme', () => {
    const result = highlightText('hello world', 'hello');
    expect(result.segments[0].type).toBe('match');
  });

  it('metin sonunda esleme', () => {
    const result = highlightText('hello world', 'world');
    const last = result.segments[result.segments.length - 1];
    expect(last.type).toBe('match');
  });

  it('tum metin esleme', () => {
    const result = highlightText('hello', 'hello');
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0].type).toBe('match');
    expect(result.matchCount).toBe(1);
  });

  it('esleme olmayan metin', () => {
    const result = highlightText('hello world', 'xyz');
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0].type).toBe('text');
    expect(result.matchCount).toBe(0);
  });

  it('string array olarak tek terim', () => {
    const result = highlightText('hello', ['hello']);
    expect(result.segments[0].type).toBe('match');
  });

  it('bos array terim', () => {
    const result = highlightText('hello', []);
    expect(result.segments[0].type).toBe('text');
  });

  it('ozel karakterli metin', () => {
    const result = highlightText('foo.bar', 'foo');
    expect(result.segments[0].type).toBe('match');
    expect(result.segments[0].value).toBe('foo');
  });

  it('uzun metinde performans sorunu yok', () => {
    const text = 'a'.repeat(10000);
    const result = highlightText(text, 'aaa');
    expect(result.matchCount).toBeGreaterThan(0);
  });

  it('segment value lari birlestince orijinal metni verir', () => {
    const text = 'the quick brown fox jumps';
    const result = highlightText(text, ['quick', 'fox']);
    const reconstructed = result.segments.map((s) => s.value).join('');
    expect(reconstructed).toBe(text);
  });
});
