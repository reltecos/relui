/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createJsonEditor,
  jsonToTree,
  treeToJson,
  detectType,
  parseJsonSafe,
  resetJsonNodeIdCounter,
} from './json-editor.machine';

beforeEach(() => {
  resetJsonNodeIdCounter();
});

// ── Helpers ──

describe('detectType', () => {
  it('string tespiti', () => expect(detectType('hello')).toBe('string'));
  it('number tespiti', () => expect(detectType(42)).toBe('number'));
  it('boolean tespiti', () => expect(detectType(true)).toBe('boolean'));
  it('null tespiti', () => expect(detectType(null)).toBe('null'));
  it('array tespiti', () => expect(detectType([1, 2])).toBe('array'));
  it('object tespiti', () => expect(detectType({ a: 1 })).toBe('object'));
});

describe('jsonToTree / treeToJson', () => {
  it('basit obje donusturulur', () => {
    const tree = jsonToTree({ name: 'Ali', age: 30 }, null, 'root', 0);
    expect(tree.type).toBe('object');
    expect(tree.children).toHaveLength(2);
    expect(tree.children[0]?.key).toBe('name');
    expect(tree.children[0]?.value).toBe('Ali');
    expect(tree.children[1]?.key).toBe('age');
    expect(tree.children[1]?.value).toBe(30);
  });

  it('nested obje donusturulur', () => {
    const tree = jsonToTree({ user: { name: 'Ali' } }, null, 'root', 0);
    expect(tree.children[0]?.type).toBe('object');
    expect(tree.children[0]?.children[0]?.value).toBe('Ali');
  });

  it('array donusturulur', () => {
    const tree = jsonToTree([1, 2, 3], null, 'root', 0);
    expect(tree.type).toBe('array');
    expect(tree.children).toHaveLength(3);
    expect(tree.children[0]?.key).toBe('0');
  });

  it('tree den json a geri donus', () => {
    const original = { name: 'Ali', items: [1, 2], active: true };
    const tree = jsonToTree(original, null, 'root', 0);
    const result = treeToJson(tree);
    expect(result).toEqual(original);
  });

  it('null deger donusturulur', () => {
    const tree = jsonToTree({ val: null }, null, 'root', 0);
    expect(tree.children[0]?.type).toBe('null');
    expect(tree.children[0]?.value).toBeNull();
  });
});

describe('parseJsonSafe', () => {
  it('gecerli JSON parse edilir', () => {
    const result = parseJsonSafe('{"a":1}');
    expect(result.valid).toBe(true);
    expect(result.value).toEqual({ a: 1 });
    expect(result.error).toBeNull();
  });

  it('gecersiz JSON hata doner', () => {
    const result = parseJsonSafe('{invalid}');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

// ── State Machine ──

describe('createJsonEditor', () => {
  it('varsayilan degerle olusturulur', () => {
    const editor = createJsonEditor();
    const ctx = editor.getContext();
    expect(ctx.rootNode).not.toBeNull();
    expect(ctx.mode).toBe('tree');
    expect(ctx.valid).toBe(true);
  });

  it('custom deger ile olusturulur', () => {
    const editor = createJsonEditor({ defaultValue: { name: 'Ali' } });
    const ctx = editor.getContext();
    expect(ctx.rootNode?.children[0]?.value).toBe('Ali');
  });

  it('SET_JSON ile deger guncellenir', () => {
    const editor = createJsonEditor();
    editor.send({ type: 'SET_JSON', value: { x: 10 } });
    const ctx = editor.getContext();
    expect(ctx.rootNode?.children[0]?.key).toBe('x');
    expect(ctx.rootNode?.children[0]?.value).toBe(10);
  });

  it('SET_TEXT ile gecerli JSON guncellenir', () => {
    const editor = createJsonEditor();
    editor.send({ type: 'SET_TEXT', text: '{"hello":"world"}' });
    const ctx = editor.getContext();
    expect(ctx.valid).toBe(true);
    expect(ctx.rootNode?.children[0]?.value).toBe('world');
  });

  it('SET_TEXT ile gecersiz JSON hata verir', () => {
    const editor = createJsonEditor();
    editor.send({ type: 'SET_TEXT', text: '{bad json}' });
    const ctx = editor.getContext();
    expect(ctx.valid).toBe(false);
    expect(ctx.error).toBeTruthy();
  });

  it('TOGGLE_NODE ile node acilip kapanir', () => {
    const editor = createJsonEditor({ defaultValue: { a: 1 } });
    const rootId = editor.getContext().rootNode?.id ?? '';
    expect(editor.getContext().expandedIds.has(rootId)).toBe(true);
    editor.send({ type: 'TOGGLE_NODE', nodeId: rootId });
    expect(editor.getContext().expandedIds.has(rootId)).toBe(false);
    editor.send({ type: 'TOGGLE_NODE', nodeId: rootId });
    expect(editor.getContext().expandedIds.has(rootId)).toBe(true);
  });

  it('EXPAND_ALL tum node lar acilir', () => {
    const editor = createJsonEditor({ defaultValue: { a: { b: { c: 1 } } } });
    editor.send({ type: 'COLLAPSE_ALL' });
    editor.send({ type: 'EXPAND_ALL' });
    const ctx = editor.getContext();
    expect(ctx.expandedIds.size).toBeGreaterThan(1);
  });

  it('COLLAPSE_ALL sadece root acik kalir', () => {
    const editor = createJsonEditor({ defaultValue: { a: { b: 1 } } });
    editor.send({ type: 'EXPAND_ALL' });
    editor.send({ type: 'COLLAPSE_ALL' });
    const ctx = editor.getContext();
    expect(ctx.expandedIds.size).toBe(1);
  });

  it('UPDATE_NODE_VALUE ile deger guncellenir', () => {
    const editor = createJsonEditor({ defaultValue: { name: 'Ali' } });
    const nodeId = editor.getContext().rootNode?.children[0]?.id ?? '';
    editor.send({ type: 'UPDATE_NODE_VALUE', nodeId, value: 'Veli', valueType: 'string' });
    expect(editor.getContext().rootNode?.children[0]?.value).toBe('Veli');
  });

  it('UPDATE_NODE_KEY ile anahtar guncellenir', () => {
    const editor = createJsonEditor({ defaultValue: { name: 'Ali' } });
    const nodeId = editor.getContext().rootNode?.children[0]?.id ?? '';
    editor.send({ type: 'UPDATE_NODE_KEY', nodeId, key: 'fullName' });
    expect(editor.getContext().rootNode?.children[0]?.key).toBe('fullName');
  });

  it('ADD_NODE ile yeni node eklenir', () => {
    const editor = createJsonEditor({ defaultValue: { a: 1 } });
    const parentId = editor.getContext().rootNode?.id ?? '';
    editor.send({ type: 'ADD_NODE', parentId, key: 'b', value: 2, valueType: 'number' });
    expect(editor.getContext().rootNode?.children).toHaveLength(2);
  });

  it('DELETE_NODE ile node silinir', () => {
    const editor = createJsonEditor({ defaultValue: { a: 1, b: 2 } });
    const nodeId = editor.getContext().rootNode?.children[0]?.id ?? '';
    editor.send({ type: 'DELETE_NODE', nodeId });
    expect(editor.getContext().rootNode?.children).toHaveLength(1);
  });

  it('DELETE_NODE root silinemez', () => {
    const editor = createJsonEditor({ defaultValue: { a: 1 } });
    const rootId = editor.getContext().rootNode?.id ?? '';
    editor.send({ type: 'DELETE_NODE', nodeId: rootId });
    expect(editor.getContext().rootNode).not.toBeNull();
  });

  it('SET_MODE ile mod degisir', () => {
    const editor = createJsonEditor();
    editor.send({ type: 'SET_MODE', mode: 'text' });
    expect(editor.getContext().mode).toBe('text');
  });

  it('SELECT_NODE ile node secilir', () => {
    const editor = createJsonEditor({ defaultValue: { a: 1 } });
    const nodeId = editor.getContext().rootNode?.children[0]?.id ?? '';
    editor.send({ type: 'SELECT_NODE', nodeId });
    expect(editor.getContext().selectedNodeId).toBe(nodeId);
  });

  it('onChange callback cagirilir', () => {
    const onChange = vi.fn();
    const editor = createJsonEditor({ onChange });
    editor.send({ type: 'SET_JSON', value: { x: 1 } });
    expect(onChange).toHaveBeenCalled();
  });

  it('onValidate callback cagirilir', () => {
    const onValidate = vi.fn();
    const editor = createJsonEditor({ onValidate });
    editor.send({ type: 'SET_TEXT', text: '{bad}' });
    expect(onValidate).toHaveBeenCalledWith(false, expect.anything());
  });

  it('subscribe calisiyor', () => {
    const editor = createJsonEditor();
    const listener = vi.fn();
    editor.subscribe(listener);
    editor.send({ type: 'SET_JSON', value: { x: 1 } });
    expect(listener).toHaveBeenCalled();
  });

  it('unsubscribe calisiyor', () => {
    const editor = createJsonEditor();
    const listener = vi.fn();
    const unsub = editor.subscribe(listener);
    unsub();
    editor.send({ type: 'SET_JSON', value: { x: 1 } });
    expect(listener).not.toHaveBeenCalled();
  });

  it('destroy tum listener lari temizler', () => {
    const editor = createJsonEditor();
    const listener = vi.fn();
    editor.subscribe(listener);
    editor.destroy();
    editor.send({ type: 'SET_JSON', value: { x: 1 } });
    expect(listener).not.toHaveBeenCalled();
  });

  it('text modundan tree moduna geciste sync olur', () => {
    const editor = createJsonEditor({ defaultMode: 'text' });
    editor.send({ type: 'SET_TEXT', text: '{"new":"val"}' });
    editor.send({ type: 'SET_MODE', mode: 'tree' });
    expect(editor.getContext().rootNode?.children[0]?.value).toBe('val');
  });
});
