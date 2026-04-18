/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createMarkdownEditor, parseMarkdown, insertFormat } from './markdown-editor.machine';

// ── Parser Tests ──

describe('parseMarkdown', () => {
  it('paragraf donusturulur', () => {
    expect(parseMarkdown('Hello world')).toBe('<p>Hello world</p>');
  });

  it('heading 1 donusturulur', () => {
    expect(parseMarkdown('# Title')).toBe('<h1>Title</h1>');
  });

  it('heading 2 donusturulur', () => {
    expect(parseMarkdown('## Subtitle')).toBe('<h2>Subtitle</h2>');
  });

  it('heading 3 donusturulur', () => {
    expect(parseMarkdown('### H3')).toBe('<h3>H3</h3>');
  });

  it('bold donusturulur', () => {
    expect(parseMarkdown('**bold**')).toBe('<p><strong>bold</strong></p>');
  });

  it('italic donusturulur', () => {
    expect(parseMarkdown('*italic*')).toBe('<p><em>italic</em></p>');
  });

  it('strikethrough donusturulur', () => {
    expect(parseMarkdown('~~deleted~~')).toBe('<p><del>deleted</del></p>');
  });

  it('inline code donusturulur', () => {
    expect(parseMarkdown('`code`')).toBe('<p><code>code</code></p>');
  });

  it('link donusturulur', () => {
    expect(parseMarkdown('[Google](https://google.com)')).toBe(
      '<p><a href="https://google.com">Google</a></p>',
    );
  });

  it('image donusturulur', () => {
    expect(parseMarkdown('![alt](img.png)')).toBe(
      '<p><img src="img.png" alt="alt" /></p>',
    );
  });

  it('unordered list donusturulur', () => {
    const md = '- Item 1\n- Item 2';
    const result = parseMarkdown(md);
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>Item 1</li>');
    expect(result).toContain('<li>Item 2</li>');
    expect(result).toContain('</ul>');
  });

  it('ordered list donusturulur', () => {
    const md = '1. First\n2. Second';
    const result = parseMarkdown(md);
    expect(result).toContain('<ol>');
    expect(result).toContain('<li>First</li>');
    expect(result).toContain('</ol>');
  });

  it('blockquote donusturulur', () => {
    expect(parseMarkdown('> Quote')).toBe('<blockquote>Quote</blockquote>');
  });

  it('hr donusturulur', () => {
    expect(parseMarkdown('---')).toBe('<hr />');
  });

  it('code block donusturulur', () => {
    const md = '```\nconst x = 1;\n```';
    const result = parseMarkdown(md);
    expect(result).toContain('<pre><code>');
    expect(result).toContain('const x = 1;');
    expect(result).toContain('</code></pre>');
  });

  it('html karakterleri escape edilir', () => {
    expect(parseMarkdown('<script>')).toContain('&lt;script&gt;');
  });

  it('bos metin bos doner', () => {
    expect(parseMarkdown('')).toBe('');
  });

  it('complex markdown donusturulur', () => {
    const md = '# Title\n\nSome **bold** and *italic* text.\n\n- Item 1\n- Item 2';
    const result = parseMarkdown(md);
    expect(result).toContain('<h1>Title</h1>');
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<em>italic</em>');
    expect(result).toContain('<ul>');
  });
});

// ── Format Insertion ──

describe('insertFormat', () => {
  it('bold secili metne eklenir', () => {
    const result = insertFormat('hello world', 'bold', 6, 11);
    expect(result.markdown).toBe('hello **world**');
  });

  it('italic secili metne eklenir', () => {
    const result = insertFormat('hello world', 'italic', 6, 11);
    expect(result.markdown).toBe('hello *world*');
  });

  it('code secili metne eklenir', () => {
    const result = insertFormat('hello world', 'code', 6, 11);
    expect(result.markdown).toBe('hello `world`');
  });

  it('link eklenir', () => {
    const result = insertFormat('hello', 'link', 5, 5);
    expect(result.markdown).toContain('[link text](url)');
  });

  it('heading1 eklenir', () => {
    const result = insertFormat('', 'heading1', 0, 0);
    expect(result.markdown).toBe('# Heading 1');
  });

  it('hr eklenir', () => {
    const result = insertFormat('text', 'hr', 4, 4);
    expect(result.markdown).toContain('---');
  });
});

// ── State Machine ──

describe('createMarkdownEditor', () => {
  it('varsayilan degerle olusturulur', () => {
    const editor = createMarkdownEditor();
    const ctx = editor.getContext();
    expect(ctx.markdown).toBe('');
    expect(ctx.html).toBe('');
    expect(ctx.mode).toBe('split');
  });

  it('custom markdown ile olusturulur', () => {
    const editor = createMarkdownEditor({ defaultMarkdown: '# Hello' });
    expect(editor.getContext().html).toContain('<h1>Hello</h1>');
  });

  it('SET_MARKDOWN ile icerik guncellenir', () => {
    const editor = createMarkdownEditor();
    editor.send({ type: 'SET_MARKDOWN', markdown: '**bold**' });
    const ctx = editor.getContext();
    expect(ctx.markdown).toBe('**bold**');
    expect(ctx.html).toContain('<strong>bold</strong>');
  });

  it('INSERT_FORMAT ile format eklenir', () => {
    const editor = createMarkdownEditor({ defaultMarkdown: 'hello' });
    editor.send({ type: 'INSERT_FORMAT', format: 'bold', selectionStart: 0, selectionEnd: 5 });
    expect(editor.getContext().markdown).toBe('**hello**');
  });

  it('SET_MODE ile mod degisir', () => {
    const editor = createMarkdownEditor();
    editor.send({ type: 'SET_MODE', mode: 'edit' });
    expect(editor.getContext().mode).toBe('edit');
  });

  it('SET_MODE ayni mod ile notify etmez', () => {
    const listener = vi.fn();
    const editor = createMarkdownEditor();
    editor.subscribe(listener);
    editor.send({ type: 'SET_MODE', mode: 'split' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('onChange callback cagirilir', () => {
    const onChange = vi.fn();
    const editor = createMarkdownEditor({ onChange });
    editor.send({ type: 'SET_MARKDOWN', markdown: 'test' });
    expect(onChange).toHaveBeenCalledWith('test', expect.anything());
  });

  it('subscribe calisiyor', () => {
    const editor = createMarkdownEditor();
    const listener = vi.fn();
    editor.subscribe(listener);
    editor.send({ type: 'SET_MARKDOWN', markdown: 'x' });
    expect(listener).toHaveBeenCalled();
  });

  it('destroy calisiyor', () => {
    const editor = createMarkdownEditor();
    const listener = vi.fn();
    editor.subscribe(listener);
    editor.destroy();
    editor.send({ type: 'SET_MARKDOWN', markdown: 'x' });
    expect(listener).not.toHaveBeenCalled();
  });
});
