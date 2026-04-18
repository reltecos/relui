/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RichTextEditor tipleri.
 * RichTextEditor types.
 *
 * @packageDocumentation
 */

// ── Block Types ──────────────────────────────────────

/** Blok tipi / Block type */
export type RichTextBlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'unorderedList'
  | 'orderedList'
  | 'code'
  | 'blockquote';

/** Inline metin parcasi / Inline text span */
export interface RichTextInline {
  /** Metin / Text */
  readonly text: string;
  /** Kalin / Bold */
  readonly bold?: boolean;
  /** Italic / Italic */
  readonly italic?: boolean;
  /** Alti cizili / Underline */
  readonly underline?: boolean;
  /** Ustu cizili / Strikethrough */
  readonly strikethrough?: boolean;
  /** Kod / Code */
  readonly code?: boolean;
  /** Link URL / Link URL */
  readonly link?: string;
}

/** Icerik blogu / Content block */
export interface RichTextBlock {
  /** Benzersiz id / Unique id */
  readonly id: string;
  /** Blok tipi / Block type */
  readonly type: RichTextBlockType;
  /** Inline icerikler / Inline contents */
  readonly children: readonly RichTextInline[];
}

// ── Inline Format ────────────────────────────────────

/** Inline format tipleri / Inline format types */
export type InlineFormat = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code';

// ── Active Formats ───────────────────────────────────

/** Aktif formatlar / Active formats */
export interface ActiveFormats {
  readonly bold: boolean;
  readonly italic: boolean;
  readonly underline: boolean;
  readonly strikethrough: boolean;
  readonly code: boolean;
}

// ── Events ───────────────────────────────────────────

/** RichTextEditor event'leri / RichTextEditor events */
export type RichTextEditorEvent =
  | { type: 'SET_BLOCKS'; blocks: RichTextBlock[] }
  | { type: 'SET_HTML'; html: string }
  | { type: 'FORMAT_INLINE'; format: InlineFormat }
  | { type: 'FORMAT_BLOCK'; blockType: RichTextBlockType }
  | { type: 'INSERT_LINK'; url: string }
  | { type: 'SET_ACTIVE_FORMATS'; formats: ActiveFormats }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// ── Context ──────────────────────────────────────────

/** RichTextEditor state / RichTextEditor context */
export interface RichTextEditorContext {
  /** Icerik bloklari / Content blocks */
  readonly blocks: readonly RichTextBlock[];
  /** HTML ciktisi / HTML output */
  readonly html: string;
  /** Aktif formatlar / Active formats */
  readonly activeFormats: ActiveFormats;
  /** Geri alma gecmisi / Undo stack size */
  readonly canUndo: boolean;
  /** Yineleme gecmisi / Redo stack size */
  readonly canRedo: boolean;
}

// ── Config ───────────────────────────────────────────

/** RichTextEditor yapilandirmasi / RichTextEditor configuration */
export interface RichTextEditorConfig {
  /** Varsayilan bloklar / Default blocks */
  defaultBlocks?: RichTextBlock[];
  /** Varsayilan HTML / Default HTML */
  defaultHtml?: string;
  /** Degisince callback / On change callback */
  onChange?: (blocks: readonly RichTextBlock[], html: string) => void;
}

// ── API ──────────────────────────────────────────────

/** RichTextEditor API / RichTextEditor API */
export interface RichTextEditorAPI {
  /** Guncel context / Get current context */
  getContext(): RichTextEditorContext;
  /** Event gonder / Send event */
  send(event: RichTextEditorEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
