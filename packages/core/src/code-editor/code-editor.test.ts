/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createCodeEditor } from './code-editor.machine';

describe('createCodeEditor', () => {
  // ── Create ──

  it('varsayilan degerle olusturulur', () => {
    const editor = createCodeEditor();
    const ctx = editor.getContext();
    expect(ctx.lines).toEqual(['']);
    expect(ctx.language).toBe('typescript');
    expect(ctx.cursor).toEqual({ line: 0, col: 0 });
    expect(ctx.canUndo).toBe(false);
  });

  it('defaultCode ile olusturulur', () => {
    const editor = createCodeEditor({ defaultCode: 'const x = 1;\nconst y = 2;' });
    const ctx = editor.getContext();
    expect(ctx.lines).toHaveLength(2);
    expect(ctx.lines[0]).toBe('const x = 1;');
  });

  it('language config ile ayarlanir', () => {
    const editor = createCodeEditor({ language: 'javascript' });
    expect(editor.getContext().language).toBe('javascript');
  });

  // ── SET_CODE ──

  it('SET_CODE ile kod guncellenir', () => {
    const editor = createCodeEditor();
    editor.send({ type: 'SET_CODE', code: 'hello\nworld' });
    expect(editor.getContext().lines).toEqual(['hello', 'world']);
    expect(editor.getContext().code).toBe('hello\nworld');
  });

  it('SET_CODE onChange cagrilir', () => {
    const onChange = vi.fn();
    const editor = createCodeEditor({ onChange });
    editor.send({ type: 'SET_CODE', code: 'test' });
    expect(onChange).toHaveBeenCalledWith('test');
  });

  // ── SET_LANGUAGE ──

  it('SET_LANGUAGE ile dil degisir', () => {
    const editor = createCodeEditor();
    editor.send({ type: 'SET_LANGUAGE', language: 'css' });
    expect(editor.getContext().language).toBe('css');
  });

  it('SET_LANGUAGE highlight yenilenir', () => {
    const editor = createCodeEditor({ defaultCode: 'const x = 1;' });
    editor.send({ type: 'SET_LANGUAGE', language: 'javascript' });
    expect(editor.getContext().highlightedLines).toHaveLength(1);
  });

  // ── SET_CURSOR ──

  it('SET_CURSOR ile cursor ayarlanir', () => {
    const editor = createCodeEditor({ defaultCode: 'hello\nworld' });
    editor.send({ type: 'SET_CURSOR', position: { line: 1, col: 3 } });
    expect(editor.getContext().cursor).toEqual({ line: 1, col: 3 });
  });

  it('SET_CURSOR sinir disina clamp edilir', () => {
    const editor = createCodeEditor({ defaultCode: 'hi' });
    editor.send({ type: 'SET_CURSOR', position: { line: 100, col: 100 } });
    const ctx = editor.getContext();
    expect(ctx.cursor.line).toBe(0);
    expect(ctx.cursor.col).toBe(2);
  });

  // ── INSERT_TEXT ──

  it('INSERT_TEXT ile metin eklenir', () => {
    const editor = createCodeEditor({ defaultCode: 'ab' });
    editor.send({ type: 'SET_CURSOR', position: { line: 0, col: 1 } });
    editor.send({ type: 'INSERT_TEXT', text: 'X' });
    expect(editor.getContext().lines[0]).toBe('aXb');
    expect(editor.getContext().cursor.col).toBe(2);
  });

  it('INSERT_TEXT enter ile yeni satir olusturulur', () => {
    const editor = createCodeEditor({ defaultCode: 'hello' });
    editor.send({ type: 'SET_CURSOR', position: { line: 0, col: 2 } });
    editor.send({ type: 'INSERT_TEXT', text: '\n' });
    expect(editor.getContext().lines).toEqual(['he', 'llo']);
    expect(editor.getContext().cursor).toEqual({ line: 1, col: 0 });
  });

  it('INSERT_TEXT auto-indent calisir', () => {
    const editor = createCodeEditor({ defaultCode: '  hello' });
    editor.send({ type: 'SET_CURSOR', position: { line: 0, col: 7 } });
    editor.send({ type: 'INSERT_TEXT', text: '\n' });
    expect(editor.getContext().lines[1]).toBe('  ');
  });

  it('INSERT_TEXT cok satirli metin eklenir', () => {
    const editor = createCodeEditor({ defaultCode: '' });
    editor.send({ type: 'INSERT_TEXT', text: 'line1\nline2\nline3' });
    expect(editor.getContext().lines).toEqual(['line1', 'line2', 'line3']);
  });

  // ── DELETE_BACKWARD ──

  it('DELETE_BACKWARD ile karakter silinir', () => {
    const editor = createCodeEditor({ defaultCode: 'abc' });
    editor.send({ type: 'SET_CURSOR', position: { line: 0, col: 2 } });
    editor.send({ type: 'DELETE_BACKWARD' });
    expect(editor.getContext().lines[0]).toBe('ac');
    expect(editor.getContext().cursor.col).toBe(1);
  });

  it('DELETE_BACKWARD satir basinda satir birlestirme', () => {
    const editor = createCodeEditor({ defaultCode: 'hello\nworld' });
    editor.send({ type: 'SET_CURSOR', position: { line: 1, col: 0 } });
    editor.send({ type: 'DELETE_BACKWARD' });
    expect(editor.getContext().lines).toEqual(['helloworld']);
    expect(editor.getContext().cursor).toEqual({ line: 0, col: 5 });
  });

  it('DELETE_BACKWARD ilk satirda ilk sutunda bir sey yapmaz', () => {
    const editor = createCodeEditor({ defaultCode: 'hello' });
    editor.send({ type: 'SET_CURSOR', position: { line: 0, col: 0 } });
    editor.send({ type: 'DELETE_BACKWARD' });
    expect(editor.getContext().lines[0]).toBe('hello');
  });

  // ── DELETE_FORWARD ──

  it('DELETE_FORWARD ile karakter silinir', () => {
    const editor = createCodeEditor({ defaultCode: 'abc' });
    editor.send({ type: 'SET_CURSOR', position: { line: 0, col: 1 } });
    editor.send({ type: 'DELETE_FORWARD' });
    expect(editor.getContext().lines[0]).toBe('ac');
  });

  it('DELETE_FORWARD satir sonunda satir birlestirme', () => {
    const editor = createCodeEditor({ defaultCode: 'hello\nworld' });
    editor.send({ type: 'SET_CURSOR', position: { line: 0, col: 5 } });
    editor.send({ type: 'DELETE_FORWARD' });
    expect(editor.getContext().lines).toEqual(['helloworld']);
  });

  // ── UNDO / REDO ──

  it('UNDO son islemi geri alir', () => {
    const editor = createCodeEditor({ defaultCode: 'original' });
    editor.send({ type: 'SET_CODE', code: 'changed' });
    expect(editor.getContext().code).toBe('changed');
    editor.send({ type: 'UNDO' });
    expect(editor.getContext().code).toBe('original');
  });

  it('REDO geri alinan islemi yineler', () => {
    const editor = createCodeEditor({ defaultCode: 'original' });
    editor.send({ type: 'SET_CODE', code: 'changed' });
    editor.send({ type: 'UNDO' });
    editor.send({ type: 'REDO' });
    expect(editor.getContext().code).toBe('changed');
  });

  it('canUndo / canRedo dogru set edilir', () => {
    const editor = createCodeEditor();
    expect(editor.getContext().canUndo).toBe(false);
    editor.send({ type: 'SET_CODE', code: 'x' });
    expect(editor.getContext().canUndo).toBe(true);
    editor.send({ type: 'UNDO' });
    expect(editor.getContext().canRedo).toBe(true);
  });

  // ── INDENT / OUTDENT ──

  it('INDENT ile girinti eklenir', () => {
    const editor = createCodeEditor({ defaultCode: 'hello', tabSize: 2 });
    editor.send({ type: 'SET_CURSOR', position: { line: 0, col: 0 } });
    editor.send({ type: 'INDENT' });
    expect(editor.getContext().lines[0]).toBe('  hello');
    expect(editor.getContext().cursor.col).toBe(2);
  });

  it('OUTDENT ile girinti kaldirilir', () => {
    const editor = createCodeEditor({ defaultCode: '  hello', tabSize: 2 });
    editor.send({ type: 'SET_CURSOR', position: { line: 0, col: 2 } });
    editor.send({ type: 'OUTDENT' });
    expect(editor.getContext().lines[0]).toBe('hello');
  });

  // ── TOGGLE_FOLD ──

  it('TOGGLE_FOLD ile satir katlanir/acilir', () => {
    const editor = createCodeEditor({ defaultCode: 'a\nb\nc' });
    editor.send({ type: 'TOGGLE_FOLD', line: 0 });
    expect(editor.getContext().foldedLines.has(0)).toBe(true);
    editor.send({ type: 'TOGGLE_FOLD', line: 0 });
    expect(editor.getContext().foldedLines.has(0)).toBe(false);
  });

  // ── FIND ──

  it('FIND ile eslesmeler bulunur', () => {
    const editor = createCodeEditor({ defaultCode: 'foo bar foo baz foo' });
    editor.send({ type: 'FIND', query: 'foo' });
    expect(editor.getContext().findMatches).toHaveLength(3);
    expect(editor.getContext().findQuery).toBe('foo');
  });

  it('FIND case insensitive calisir', () => {
    const editor = createCodeEditor({ defaultCode: 'Hello hello HELLO' });
    editor.send({ type: 'FIND', query: 'hello' });
    expect(editor.getContext().findMatches).toHaveLength(3);
  });

  it('CLEAR_FIND ile arama temizlenir', () => {
    const editor = createCodeEditor({ defaultCode: 'test' });
    editor.send({ type: 'FIND', query: 'test' });
    editor.send({ type: 'CLEAR_FIND' });
    expect(editor.getContext().findQuery).toBe('');
    expect(editor.getContext().findMatches).toHaveLength(0);
  });

  // ── SELECT_ALL ──

  it('SELECT_ALL ile tum icerik secilir', () => {
    const editor = createCodeEditor({ defaultCode: 'hello\nworld' });
    editor.send({ type: 'SELECT_ALL' });
    const sel = editor.getContext().selection;
    expect(sel?.start).toEqual({ line: 0, col: 0 });
    expect(sel?.end).toEqual({ line: 1, col: 5 });
  });

  // ── Highlight ──

  it('syntax highlight uretilir', () => {
    const editor = createCodeEditor({ defaultCode: 'const x = 1;', language: 'typescript' });
    expect(editor.getContext().highlightedLines).toHaveLength(1);
    expect(editor.getContext().highlightedLines[0]?.tokens.length).toBeGreaterThan(0);
  });

  // ── Subscribe / Destroy ──

  it('subscribe calisiyor', () => {
    const editor = createCodeEditor();
    const listener = vi.fn();
    editor.subscribe(listener);
    editor.send({ type: 'SET_CODE', code: 'x' });
    expect(listener).toHaveBeenCalled();
  });

  it('unsubscribe calisiyor', () => {
    const editor = createCodeEditor();
    const listener = vi.fn();
    const unsub = editor.subscribe(listener);
    unsub();
    editor.send({ type: 'SET_CODE', code: 'x' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('destroy tum listener lari temizler', () => {
    const editor = createCodeEditor();
    const listener = vi.fn();
    editor.subscribe(listener);
    editor.destroy();
    editor.send({ type: 'SET_CODE', code: 'x' });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Selection + Delete ──

  it('selection ile INSERT_TEXT secimi siler ve yeni metin ekler', () => {
    const editor = createCodeEditor({ defaultCode: 'hello world' });
    editor.send({ type: 'SET_SELECTION', selection: { start: { line: 0, col: 0 }, end: { line: 0, col: 5 } } });
    editor.send({ type: 'INSERT_TEXT', text: 'bye' });
    expect(editor.getContext().lines[0]).toBe('bye world');
  });
});
