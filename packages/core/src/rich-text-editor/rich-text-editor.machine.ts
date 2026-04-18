/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RichTextEditor state machine + document model.
 *
 * @packageDocumentation
 */

import type {
  RichTextBlock,
  RichTextBlockType,
  RichTextInline,
  ActiveFormats,
  RichTextEditorConfig,
  RichTextEditorContext,
  RichTextEditorEvent,
  RichTextEditorAPI,
} from './rich-text-editor.types';

// ── ID Counter ───────────────────────────────────────

let blockIdCounter = 0;

function nextBlockId(): string {
  return `rtb-${++blockIdCounter}`;
}

/** Block ID counter sifirla (test icin) / Reset block ID counter */
export function resetBlockIdCounter(): void {
  blockIdCounter = 0;
}

// ── Serialization: Blocks → HTML ─────────────────────

function inlineToHtml(inline: RichTextInline): string {
  let html = inline.text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (inline.code) html = `<code>${html}</code>`;
  if (inline.bold) html = `<strong>${html}</strong>`;
  if (inline.italic) html = `<em>${html}</em>`;
  if (inline.underline) html = `<u>${html}</u>`;
  if (inline.strikethrough) html = `<del>${html}</del>`;
  if (inline.link) html = `<a href="${inline.link}">${html}</a>`;

  return html;
}

/** Bloklardan HTML olusturur / Serializes blocks to HTML */
export function blocksToHtml(blocks: readonly RichTextBlock[]): string {
  return blocks.map((block) => {
    const content = block.children.map(inlineToHtml).join('');

    switch (block.type) {
      case 'heading1': return `<h1>${content}</h1>`;
      case 'heading2': return `<h2>${content}</h2>`;
      case 'heading3': return `<h3>${content}</h3>`;
      case 'unorderedList': return `<ul><li>${content}</li></ul>`;
      case 'orderedList': return `<ol><li>${content}</li></ol>`;
      case 'code': return `<pre><code>${content}</code></pre>`;
      case 'blockquote': return `<blockquote>${content}</blockquote>`;
      case 'paragraph':
      default:
        return `<p>${content}</p>`;
    }
  }).join('\n');
}

/** HTML den bloklar olusturur (basit regex-based) / Parses HTML to blocks */
export function htmlToBlocks(html: string): RichTextBlock[] {
  if (!html.trim()) {
    return [{ id: nextBlockId(), type: 'paragraph', children: [{ text: '' }] }];
  }

  const blocks: RichTextBlock[] = [];

  // Basit tag-based parse (DOMParser olmadan calisir)
  const blockRegex = /<(h[1-3]|p|pre|blockquote|ul|ol)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  let match = blockRegex.exec(html);

  while (match !== null) {
    const tag = (match[1] ?? '').toLowerCase();
    const innerHtml = match[2] ?? '';
    const inlines = parseInlineHtml(innerHtml);

    let blockType: RichTextBlockType = 'paragraph';
    if (tag === 'h1') blockType = 'heading1';
    else if (tag === 'h2') blockType = 'heading2';
    else if (tag === 'h3') blockType = 'heading3';
    else if (tag === 'ul') blockType = 'unorderedList';
    else if (tag === 'ol') blockType = 'orderedList';
    else if (tag === 'pre') blockType = 'code';
    else if (tag === 'blockquote') blockType = 'blockquote';

    blocks.push({ id: nextBlockId(), type: blockType, children: inlines });
    match = blockRegex.exec(html);
  }

  if (blocks.length === 0) {
    // Saf metin veya parse edilemeyen HTML
    const textContent = html.replace(/<[^>]*>/g, '');
    blocks.push({ id: nextBlockId(), type: 'paragraph', children: [{ text: textContent }] });
  }

  return blocks;
}

function parseInlineHtml(html: string): RichTextInline[] {
  // Basit: tum HTML taglerini strip edip tek inline olustur
  // Gelismis inline parse yerine temel destekle
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li>([\s\S]*?)<\/li>/gi, '$1')
    .replace(/<code>([\s\S]*?)<\/code>/gi, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');

  const bold = /<strong>|<b>/i.test(html);
  const italic = /<em>|<i>/i.test(html);
  const underline = /<u>/i.test(html);
  const strikethrough = /<del>|<s>/i.test(html);
  const code = /<code>/i.test(html);

  const linkMatch = /<a\s+href="([^"]*)">/i.exec(html);
  const link = linkMatch ? linkMatch[1] : undefined;

  return [{
    text,
    ...(bold ? { bold: true } : {}),
    ...(italic ? { italic: true } : {}),
    ...(underline ? { underline: true } : {}),
    ...(strikethrough ? { strikethrough: true } : {}),
    ...(code ? { code: true } : {}),
    ...(link ? { link } : {}),
  }];
}

// ── State Machine ────────────────────────────────────

const DEFAULT_FORMATS: ActiveFormats = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  code: false,
};

/**
 * RichTextEditor state machine olusturur.
 * Creates a RichTextEditor state machine.
 */
export function createRichTextEditor(config: RichTextEditorConfig = {}): RichTextEditorAPI {
  const {
    defaultBlocks,
    defaultHtml,
    onChange,
  } = config;

  // ── State ──
  let blocks: RichTextBlock[] = defaultBlocks
    ? [...defaultBlocks]
    : defaultHtml
      ? htmlToBlocks(defaultHtml)
      : [{ id: nextBlockId(), type: 'paragraph', children: [{ text: '' }] }];
  let html = blocksToHtml(blocks);
  let activeFormats: ActiveFormats = { ...DEFAULT_FORMATS };
  const undoStack: RichTextBlock[][] = [];
  const redoStack: RichTextBlock[][] = [];

  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function pushUndo(): void {
    undoStack.push(blocks.map((b) => ({ ...b, children: [...b.children] })));
    redoStack.length = 0;
  }

  function syncHtml(): void {
    html = blocksToHtml(blocks);
    onChange?.(blocks, html);
  }

  function send(event: RichTextEditorEvent): void {
    switch (event.type) {
      case 'SET_BLOCKS': {
        pushUndo();
        blocks = event.blocks;
        syncHtml();
        notify();
        break;
      }
      case 'SET_HTML': {
        pushUndo();
        blocks = htmlToBlocks(event.html);
        html = event.html;
        onChange?.(blocks, html);
        notify();
        break;
      }
      case 'FORMAT_INLINE': {
        activeFormats = {
          ...activeFormats,
          [event.format]: !activeFormats[event.format],
        };
        notify();
        break;
      }
      case 'FORMAT_BLOCK': {
        pushUndo();
        // Tum bloklarin tipini degistir (basitlestirilmis)
        blocks = blocks.map((b) => ({ ...b, type: event.blockType }));
        syncHtml();
        notify();
        break;
      }
      case 'INSERT_LINK': {
        // Aktif format olarak link bilgisi sakla
        notify();
        break;
      }
      case 'SET_ACTIVE_FORMATS': {
        activeFormats = event.formats;
        notify();
        break;
      }
      case 'UNDO': {
        if (undoStack.length === 0) return;
        redoStack.push(blocks.map((b) => ({ ...b, children: [...b.children] })));
        const prev = undoStack.pop();
        if (prev) {
          blocks = prev;
          syncHtml();
        }
        notify();
        break;
      }
      case 'REDO': {
        if (redoStack.length === 0) return;
        undoStack.push(blocks.map((b) => ({ ...b, children: [...b.children] })));
        const next = redoStack.pop();
        if (next) {
          blocks = next;
          syncHtml();
        }
        notify();
        break;
      }
    }
  }

  return {
    getContext(): RichTextEditorContext {
      return {
        blocks,
        html,
        activeFormats,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
      };
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => { listeners.delete(callback); };
    },
    destroy(): void {
      listeners.clear();
    },
  };
}
