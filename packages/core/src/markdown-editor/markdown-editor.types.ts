/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MarkdownEditor tipleri.
 * MarkdownEditor types.
 *
 * @packageDocumentation
 */

// ── Mode ─────────────────────────────────────────────

/** Editor modu / Editor mode */
export type MarkdownEditorMode = 'edit' | 'preview' | 'split';

// ── Format ───────────────────────────────────────────

/** Format tipi / Format type */
export type MarkdownFormat =
  | 'bold'
  | 'italic'
  | 'code'
  | 'strikethrough'
  | 'link'
  | 'image'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'unorderedList'
  | 'orderedList'
  | 'blockquote'
  | 'codeBlock'
  | 'hr';

// ── Events ───────────────────────────────────────────

/** MarkdownEditor event'leri / MarkdownEditor events */
export type MarkdownEditorEvent =
  | { type: 'SET_MARKDOWN'; markdown: string }
  | { type: 'INSERT_FORMAT'; format: MarkdownFormat; selectionStart: number; selectionEnd: number }
  | { type: 'SET_MODE'; mode: MarkdownEditorMode };

// ── Context ──────────────────────────────────────────

/** MarkdownEditor state / MarkdownEditor context */
export interface MarkdownEditorContext {
  /** Markdown metni / Markdown text */
  readonly markdown: string;
  /** HTML ciktisi / HTML output */
  readonly html: string;
  /** Editor modu / Editor mode */
  readonly mode: MarkdownEditorMode;
}

// ── Config ───────────────────────────────────────────

/** MarkdownEditor yapilandirmasi / MarkdownEditor configuration */
export interface MarkdownEditorConfig {
  /** Varsayilan markdown / Default markdown */
  defaultMarkdown?: string;
  /** Varsayilan mod / Default mode */
  defaultMode?: MarkdownEditorMode;
  /** Markdown degisince callback / On markdown change callback */
  onChange?: (markdown: string, html: string) => void;
}

// ── API ──────────────────────────────────────────────

/** MarkdownEditor API / MarkdownEditor API */
export interface MarkdownEditorAPI {
  /** Guncel context / Get current context */
  getContext(): MarkdownEditorContext;
  /** Event gonder / Send event */
  send(event: MarkdownEditorEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
