/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createRichTextEditor,
  blocksToHtml,
  htmlToBlocks,
  resetBlockIdCounter,
} from './rich-text-editor.machine';
import type { RichTextBlock } from './rich-text-editor.types';

beforeEach(() => {
  resetBlockIdCounter();
});

// ── Serialization ──

describe('blocksToHtml', () => {
  it('paragraf blogu donusturulur', () => {
    const blocks: RichTextBlock[] = [
      { id: '1', type: 'paragraph', children: [{ text: 'Hello' }] },
    ];
    expect(blocksToHtml(blocks)).toBe('<p>Hello</p>');
  });

  it('heading1 blogu donusturulur', () => {
    const blocks: RichTextBlock[] = [
      { id: '1', type: 'heading1', children: [{ text: 'Title' }] },
    ];
    expect(blocksToHtml(blocks)).toBe('<h1>Title</h1>');
  });

  it('bold inline donusturulur', () => {
    const blocks: RichTextBlock[] = [
      { id: '1', type: 'paragraph', children: [{ text: 'bold', bold: true }] },
    ];
    expect(blocksToHtml(blocks)).toContain('<strong>bold</strong>');
  });

  it('italic inline donusturulur', () => {
    const blocks: RichTextBlock[] = [
      { id: '1', type: 'paragraph', children: [{ text: 'ital', italic: true }] },
    ];
    expect(blocksToHtml(blocks)).toContain('<em>ital</em>');
  });

  it('link inline donusturulur', () => {
    const blocks: RichTextBlock[] = [
      { id: '1', type: 'paragraph', children: [{ text: 'link', link: 'https://x.com' }] },
    ];
    expect(blocksToHtml(blocks)).toContain('<a href="https://x.com">link</a>');
  });

  it('code bloku donusturulur', () => {
    const blocks: RichTextBlock[] = [
      { id: '1', type: 'code', children: [{ text: 'const x = 1;' }] },
    ];
    expect(blocksToHtml(blocks)).toContain('<pre><code>');
  });

  it('blockquote donusturulur', () => {
    const blocks: RichTextBlock[] = [
      { id: '1', type: 'blockquote', children: [{ text: 'Quote' }] },
    ];
    expect(blocksToHtml(blocks)).toContain('<blockquote>Quote</blockquote>');
  });

  it('unorderedList donusturulur', () => {
    const blocks: RichTextBlock[] = [
      { id: '1', type: 'unorderedList', children: [{ text: 'Item' }] },
    ];
    expect(blocksToHtml(blocks)).toContain('<ul><li>Item</li></ul>');
  });

  it('html karakterleri escape edilir', () => {
    const blocks: RichTextBlock[] = [
      { id: '1', type: 'paragraph', children: [{ text: '<script>' }] },
    ];
    expect(blocksToHtml(blocks)).toContain('&lt;script&gt;');
  });
});

describe('htmlToBlocks', () => {
  it('paragraf parse edilir', () => {
    const blocks = htmlToBlocks('<p>Hello</p>');
    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.type).toBe('paragraph');
    expect(blocks[0]?.children[0]?.text).toBe('Hello');
  });

  it('heading parse edilir', () => {
    const blocks = htmlToBlocks('<h1>Title</h1>');
    expect(blocks[0]?.type).toBe('heading1');
  });

  it('bos HTML default blok doner', () => {
    const blocks = htmlToBlocks('');
    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.type).toBe('paragraph');
  });

  it('birden fazla blok parse edilir', () => {
    const blocks = htmlToBlocks('<h1>Title</h1><p>Body</p>');
    expect(blocks).toHaveLength(2);
  });
});

// ── State Machine ──

describe('createRichTextEditor', () => {
  it('varsayilan degerle olusturulur', () => {
    const editor = createRichTextEditor();
    const ctx = editor.getContext();
    expect(ctx.blocks).toHaveLength(1);
    expect(ctx.blocks[0]?.type).toBe('paragraph');
  });

  it('defaultBlocks ile olusturulur', () => {
    const blocks: RichTextBlock[] = [
      { id: 'b1', type: 'heading1', children: [{ text: 'Title' }] },
    ];
    const editor = createRichTextEditor({ defaultBlocks: blocks });
    expect(editor.getContext().blocks[0]?.type).toBe('heading1');
  });

  it('defaultHtml ile olusturulur', () => {
    const editor = createRichTextEditor({ defaultHtml: '<h1>Title</h1>' });
    expect(editor.getContext().blocks[0]?.type).toBe('heading1');
  });

  it('SET_BLOCKS ile bloklar guncellenir', () => {
    const editor = createRichTextEditor();
    editor.send({
      type: 'SET_BLOCKS',
      blocks: [{ id: 'b1', type: 'heading2', children: [{ text: 'New' }] }],
    });
    expect(editor.getContext().blocks[0]?.type).toBe('heading2');
  });

  it('SET_HTML ile HTML guncellenir', () => {
    const editor = createRichTextEditor();
    editor.send({ type: 'SET_HTML', html: '<p>Updated</p>' });
    expect(editor.getContext().blocks[0]?.children[0]?.text).toBe('Updated');
  });

  it('FORMAT_INLINE bold toggle eder', () => {
    const editor = createRichTextEditor();
    expect(editor.getContext().activeFormats.bold).toBe(false);
    editor.send({ type: 'FORMAT_INLINE', format: 'bold' });
    expect(editor.getContext().activeFormats.bold).toBe(true);
    editor.send({ type: 'FORMAT_INLINE', format: 'bold' });
    expect(editor.getContext().activeFormats.bold).toBe(false);
  });

  it('FORMAT_INLINE italic toggle eder', () => {
    const editor = createRichTextEditor();
    editor.send({ type: 'FORMAT_INLINE', format: 'italic' });
    expect(editor.getContext().activeFormats.italic).toBe(true);
  });

  it('FORMAT_BLOCK ile blok tipi degisir', () => {
    const editor = createRichTextEditor();
    editor.send({ type: 'FORMAT_BLOCK', blockType: 'heading1' });
    expect(editor.getContext().blocks[0]?.type).toBe('heading1');
  });

  it('UNDO calisiyor', () => {
    const editor = createRichTextEditor();
    const originalHtml = editor.getContext().html;
    editor.send({
      type: 'SET_BLOCKS',
      blocks: [{ id: 'b1', type: 'heading1', children: [{ text: 'Changed' }] }],
    });
    editor.send({ type: 'UNDO' });
    expect(editor.getContext().html).toBe(originalHtml);
  });

  it('REDO calisiyor', () => {
    const editor = createRichTextEditor();
    editor.send({
      type: 'SET_BLOCKS',
      blocks: [{ id: 'b1', type: 'heading1', children: [{ text: 'Changed' }] }],
    });
    const changedHtml = editor.getContext().html;
    editor.send({ type: 'UNDO' });
    editor.send({ type: 'REDO' });
    expect(editor.getContext().html).toBe(changedHtml);
  });

  it('canUndo ve canRedo dogru set edilir', () => {
    const editor = createRichTextEditor();
    expect(editor.getContext().canUndo).toBe(false);
    expect(editor.getContext().canRedo).toBe(false);
    editor.send({
      type: 'SET_BLOCKS',
      blocks: [{ id: 'b1', type: 'paragraph', children: [{ text: 'x' }] }],
    });
    expect(editor.getContext().canUndo).toBe(true);
  });

  it('onChange callback cagirilir', () => {
    const onChange = vi.fn();
    const editor = createRichTextEditor({ onChange });
    editor.send({
      type: 'SET_BLOCKS',
      blocks: [{ id: 'b1', type: 'paragraph', children: [{ text: 'test' }] }],
    });
    expect(onChange).toHaveBeenCalled();
  });

  it('subscribe calisiyor', () => {
    const editor = createRichTextEditor();
    const listener = vi.fn();
    editor.subscribe(listener);
    editor.send({ type: 'FORMAT_INLINE', format: 'bold' });
    expect(listener).toHaveBeenCalled();
  });

  it('destroy calisiyor', () => {
    const editor = createRichTextEditor();
    const listener = vi.fn();
    editor.subscribe(listener);
    editor.destroy();
    editor.send({ type: 'FORMAT_INLINE', format: 'bold' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('SET_ACTIVE_FORMATS ile formatlar set edilir', () => {
    const editor = createRichTextEditor();
    editor.send({
      type: 'SET_ACTIVE_FORMATS',
      formats: { bold: true, italic: true, underline: false, strikethrough: false, code: false },
    });
    expect(editor.getContext().activeFormats.bold).toBe(true);
    expect(editor.getContext().activeFormats.italic).toBe(true);
  });
});
