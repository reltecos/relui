/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MarkdownEditor state machine + Markdown parser.
 *
 * @packageDocumentation
 */

import type {
  MarkdownFormat,
  MarkdownEditorMode,
  MarkdownEditorConfig,
  MarkdownEditorContext,
  MarkdownEditorEvent,
  MarkdownEditorAPI,
} from './markdown-editor.types';

// ── Markdown → HTML Parser ───────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseInline(text: string): string {
  let result = escapeHtml(text);

  // Bold: **text** or __text__
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.+?)_/g, '<em>$1</em>');

  // Strikethrough: ~~text~~
  result = result.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Inline code: `text`
  result = result.replace(/`(.+?)`/g, '<code>$1</code>');

  // Image: ![alt](url)
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Link: [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  return result;
}

/**
 * Markdown metni HTML'e donusturur.
 * Converts markdown text to HTML.
 */
export function parseMarkdown(markdown: string): string {
  const lines = markdown.split('\n');
  const htmlParts: string[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let inList = false;
  let listOrdered = false;

  function closeList(): void {
    if (inList) {
      htmlParts.push(listOrdered ? '</ol>' : '</ul>');
      inList = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';

    // Code block: ```
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        htmlParts.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        codeLines = [];
        inCodeBlock = false;
      } else {
        closeList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      closeList();
      continue;
    }

    // Heading: # ## ### #### ##### ######
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1]?.length ?? 1;
      const content = headingMatch[2] ?? '';
      htmlParts.push(`<h${level}>${parseInline(content)}</h${level}>`);
      continue;
    }

    // HR: --- or *** or ___
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      closeList();
      htmlParts.push('<hr />');
      continue;
    }

    // Blockquote: >
    const quoteMatch = /^>\s?(.*)$/.exec(line);
    if (quoteMatch) {
      closeList();
      htmlParts.push(`<blockquote>${parseInline(quoteMatch[1] ?? '')}</blockquote>`);
      continue;
    }

    // Unordered list: - or * or +
    const ulMatch = /^[\-\*\+]\s+(.+)$/.exec(line);
    if (ulMatch) {
      if (!inList || listOrdered) {
        closeList();
        htmlParts.push('<ul>');
        inList = true;
        listOrdered = false;
      }
      htmlParts.push(`<li>${parseInline(ulMatch[1] ?? '')}</li>`);
      continue;
    }

    // Ordered list: 1. 2. etc
    const olMatch = /^\d+\.\s+(.+)$/.exec(line);
    if (olMatch) {
      if (!inList || !listOrdered) {
        closeList();
        htmlParts.push('<ol>');
        inList = true;
        listOrdered = true;
      }
      htmlParts.push(`<li>${parseInline(olMatch[1] ?? '')}</li>`);
      continue;
    }

    // Paragraph
    closeList();
    htmlParts.push(`<p>${parseInline(line)}</p>`);
  }

  // Close any remaining code block
  if (inCodeBlock) {
    htmlParts.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
  }

  closeList();

  return htmlParts.join('\n');
}

// ── Format Insertion ─────────────────────────────────

/**
 * Markdown metnine format ekler.
 * Inserts format into markdown text at selection.
 */
export function insertFormat(
  markdown: string,
  format: MarkdownFormat,
  selectionStart: number,
  selectionEnd: number,
): { markdown: string; cursorPosition: number } {
  const before = markdown.slice(0, selectionStart);
  const selected = markdown.slice(selectionStart, selectionEnd);
  const after = markdown.slice(selectionEnd);

  let insert = '';
  let cursorOffset = 0;

  switch (format) {
    case 'bold':
      insert = `**${selected || 'bold'}**`;
      cursorOffset = selected ? insert.length : 2;
      break;
    case 'italic':
      insert = `*${selected || 'italic'}*`;
      cursorOffset = selected ? insert.length : 1;
      break;
    case 'code':
      insert = `\`${selected || 'code'}\``;
      cursorOffset = selected ? insert.length : 1;
      break;
    case 'strikethrough':
      insert = `~~${selected || 'strikethrough'}~~`;
      cursorOffset = selected ? insert.length : 2;
      break;
    case 'link':
      insert = `[${selected || 'link text'}](url)`;
      cursorOffset = insert.length;
      break;
    case 'image':
      insert = `![${selected || 'alt text'}](image-url)`;
      cursorOffset = insert.length;
      break;
    case 'heading1':
      insert = `# ${selected || 'Heading 1'}`;
      cursorOffset = insert.length;
      break;
    case 'heading2':
      insert = `## ${selected || 'Heading 2'}`;
      cursorOffset = insert.length;
      break;
    case 'heading3':
      insert = `### ${selected || 'Heading 3'}`;
      cursorOffset = insert.length;
      break;
    case 'unorderedList':
      insert = `- ${selected || 'list item'}`;
      cursorOffset = insert.length;
      break;
    case 'orderedList':
      insert = `1. ${selected || 'list item'}`;
      cursorOffset = insert.length;
      break;
    case 'blockquote':
      insert = `> ${selected || 'quote'}`;
      cursorOffset = insert.length;
      break;
    case 'codeBlock':
      insert = `\`\`\`\n${selected || 'code'}\n\`\`\``;
      cursorOffset = selected ? insert.length : 4;
      break;
    case 'hr':
      insert = '\n---\n';
      cursorOffset = insert.length;
      break;
  }

  return {
    markdown: before + insert + after,
    cursorPosition: selectionStart + cursorOffset,
  };
}

// ── State Machine ────────────────────────────────────

/**
 * MarkdownEditor state machine olusturur.
 * Creates a MarkdownEditor state machine.
 */
export function createMarkdownEditor(config: MarkdownEditorConfig = {}): MarkdownEditorAPI {
  const {
    defaultMarkdown = '',
    defaultMode = 'split',
    onChange,
  } = config;

  let markdown = defaultMarkdown;
  let html = parseMarkdown(markdown);
  let mode: MarkdownEditorMode = defaultMode;

  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function send(event: MarkdownEditorEvent): void {
    switch (event.type) {
      case 'SET_MARKDOWN': {
        markdown = event.markdown;
        html = parseMarkdown(markdown);
        onChange?.(markdown, html);
        notify();
        break;
      }
      case 'INSERT_FORMAT': {
        const result = insertFormat(markdown, event.format, event.selectionStart, event.selectionEnd);
        markdown = result.markdown;
        html = parseMarkdown(markdown);
        onChange?.(markdown, html);
        notify();
        break;
      }
      case 'SET_MODE': {
        if (mode === event.mode) return;
        mode = event.mode;
        notify();
        break;
      }
    }
  }

  return {
    getContext(): MarkdownEditorContext {
      return { markdown, html, mode };
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
