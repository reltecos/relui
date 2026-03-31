/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { highlightCode } from './code-block.machine';

describe('highlightCode', () => {
  // ── Basic ──

  it('bos string tek bos satir doner', () => {
    const result = highlightCode('', 'text');
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].tokens).toEqual([]);
  });

  it('cok satirli kodu satirlara boler', () => {
    const result = highlightCode('a\nb\nc', 'text');
    expect(result.lines).toHaveLength(3);
    expect(result.lines[0].lineNumber).toBe(1);
    expect(result.lines[2].lineNumber).toBe(3);
  });

  it('language doner', () => {
    expect(highlightCode('x', 'javascript').language).toBe('javascript');
    expect(highlightCode('x', 'css').language).toBe('css');
  });

  it('text dili tum icerigi text token olarak doner', () => {
    const result = highlightCode('hello world', 'text');
    expect(result.lines[0].tokens).toEqual([{ type: 'text', value: 'hello world' }]);
  });

  // ── JavaScript ──

  it('js keyword tanir', () => {
    const result = highlightCode('const x = 1;', 'javascript');
    const types = result.lines[0].tokens.map((t) => t.type);
    expect(types).toContain('keyword');
    expect(result.lines[0].tokens.find((t) => t.value === 'const')?.type).toBe('keyword');
  });

  it('js string tanir', () => {
    const result = highlightCode('"hello"', 'javascript');
    expect(result.lines[0].tokens.find((t) => t.type === 'string')).toBeDefined();
  });

  it('js tek tirnak string tanir', () => {
    const result = highlightCode("'world'", 'javascript');
    expect(result.lines[0].tokens.find((t) => t.type === 'string')).toBeDefined();
  });

  it('js template literal tanir', () => {
    const result = highlightCode('`hello ${x}`', 'javascript');
    expect(result.lines[0].tokens.find((t) => t.type === 'string')).toBeDefined();
  });

  it('js number tanir', () => {
    const result = highlightCode('42', 'javascript');
    expect(result.lines[0].tokens.find((t) => t.type === 'number')).toBeDefined();
  });

  it('js comment tanir', () => {
    const result = highlightCode('// comment', 'javascript');
    expect(result.lines[0].tokens.find((t) => t.type === 'comment')).toBeDefined();
  });

  it('js operator tanir', () => {
    const result = highlightCode('a => b', 'javascript');
    expect(result.lines[0].tokens.find((t) => t.type === 'operator')).toBeDefined();
  });

  it('js identifier text olarak doner', () => {
    const result = highlightCode('myVar', 'javascript');
    expect(result.lines[0].tokens.find((t) => t.value === 'myVar')?.type).toBe('text');
  });

  // ── TypeScript ──

  it('ts ek keyword tanir (interface, type)', () => {
    const result = highlightCode('interface Foo {}', 'typescript');
    expect(result.lines[0].tokens.find((t) => t.value === 'interface')?.type).toBe('keyword');
  });

  // ── CSS ──

  it('css property tanir', () => {
    const result = highlightCode('display: flex;', 'css');
    expect(result.lines[0].tokens.find((t) => t.type === 'property')).toBeDefined();
  });

  it('css number + unit tanir', () => {
    const result = highlightCode('10px', 'css');
    expect(result.lines[0].tokens.find((t) => t.type === 'number')).toBeDefined();
  });

  // ── HTML ──

  it('html tag tanir', () => {
    const result = highlightCode('<div>', 'html');
    expect(result.lines[0].tokens.find((t) => t.type === 'tag')).toBeDefined();
  });

  it('html comment tanir', () => {
    const result = highlightCode('<!-- comment -->', 'html');
    expect(result.lines[0].tokens.find((t) => t.type === 'comment')).toBeDefined();
  });

  // ── JSON ──

  it('json string tanir', () => {
    const result = highlightCode('{"key": "value"}', 'json');
    const strings = result.lines[0].tokens.filter((t) => t.type === 'string');
    expect(strings.length).toBeGreaterThanOrEqual(2);
  });

  it('json number tanir', () => {
    const result = highlightCode('{"n": 42}', 'json');
    expect(result.lines[0].tokens.find((t) => t.type === 'number')).toBeDefined();
  });

  it('json boolean tanir', () => {
    const result = highlightCode('true', 'json');
    expect(result.lines[0].tokens.find((t) => t.value === 'true')?.type).toBe('keyword');
  });

  it('json null tanir', () => {
    const result = highlightCode('null', 'json');
    expect(result.lines[0].tokens.find((t) => t.value === 'null')?.type).toBe('keyword');
  });

  // ── Multi-line ──

  it('cok satirli js dogru tokenize eder', () => {
    const code = 'const x = 1;\nconst y = 2;';
    const result = highlightCode(code, 'javascript');
    expect(result.lines).toHaveLength(2);
    expect(result.lines[0].tokens.find((t) => t.value === 'const')?.type).toBe('keyword');
    expect(result.lines[1].tokens.find((t) => t.value === 'const')?.type).toBe('keyword');
  });

  it('hex number tanir', () => {
    const result = highlightCode('0xff', 'javascript');
    expect(result.lines[0].tokens.find((t) => t.type === 'number')).toBeDefined();
  });

  it('punctuation tanir', () => {
    const result = highlightCode('{}', 'javascript');
    const puncts = result.lines[0].tokens.filter((t) => t.type === 'punctuation');
    expect(puncts).toHaveLength(2);
  });
});
