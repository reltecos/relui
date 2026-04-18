/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CodeEditor tipleri.
 * CodeEditor types.
 *
 * @packageDocumentation
 */

import type { CodeLanguage, CodeLine } from '../code-block/code-block.types';

// ── Cursor & Selection ───────────────────────────────

/** Cursor pozisyonu / Cursor position */
export interface CursorPosition {
  /** Satir (0-based) / Line (0-based) */
  readonly line: number;
  /** Sutun (0-based) / Column (0-based) */
  readonly col: number;
}

/** Secim araligi / Selection range */
export interface Selection {
  /** Baslangic / Start */
  readonly start: CursorPosition;
  /** Bitis / End */
  readonly end: CursorPosition;
}

// ── Bracket Match ────────────────────────────────────

/** Parantez eslesme / Bracket match */
export interface BracketMatch {
  /** Acilis pozisyonu / Opening position */
  readonly open: CursorPosition;
  /** Kapanis pozisyonu / Closing position */
  readonly close: CursorPosition;
}

// ── Find Match ───────────────────────────────────────

/** Arama eslesme / Find match */
export interface FindMatch {
  /** Satir / Line */
  readonly line: number;
  /** Baslangic sutunu / Start column */
  readonly startCol: number;
  /** Bitis sutunu / End column */
  readonly endCol: number;
}

// ── Events ───────────────────────────────────────────

/** CodeEditor event'leri / CodeEditor events */
export type CodeEditorEvent =
  | { type: 'SET_CODE'; code: string }
  | { type: 'SET_LANGUAGE'; language: CodeLanguage }
  | { type: 'SET_CURSOR'; position: CursorPosition }
  | { type: 'SET_SELECTION'; selection: Selection | null }
  | { type: 'INSERT_TEXT'; text: string }
  | { type: 'DELETE_BACKWARD' }
  | { type: 'DELETE_FORWARD' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'INDENT' }
  | { type: 'OUTDENT' }
  | { type: 'TOGGLE_FOLD'; line: number }
  | { type: 'FIND'; query: string }
  | { type: 'CLEAR_FIND' }
  | { type: 'SELECT_ALL' };

// ── Context ──────────────────────────────────────────

/** CodeEditor state / CodeEditor context */
export interface CodeEditorContext {
  /** Satir dizisi / Line array */
  readonly lines: readonly string[];
  /** Tam kod / Full code */
  readonly code: string;
  /** Dil / Language */
  readonly language: CodeLanguage;
  /** Cursor pozisyonu / Cursor position */
  readonly cursor: CursorPosition;
  /** Secim / Selection */
  readonly selection: Selection | null;
  /** Katlanmis satirlar / Folded lines */
  readonly foldedLines: ReadonlySet<number>;
  /** Syntax highlight sonucu / Highlight result */
  readonly highlightedLines: readonly CodeLine[];
  /** Arama sorgusu / Find query */
  readonly findQuery: string;
  /** Arama sonuclari / Find matches */
  readonly findMatches: readonly FindMatch[];
  /** Geri alinabilir mi / Can undo */
  readonly canUndo: boolean;
  /** Yinelenebilir mi / Can redo */
  readonly canRedo: boolean;
  /** Tab boyutu / Tab size */
  readonly tabSize: number;
}

// ── Config ───────────────────────────────────────────

/** CodeEditor yapilandirmasi / CodeEditor configuration */
export interface CodeEditorConfig {
  /** Varsayilan kod / Default code */
  defaultCode?: string;
  /** Dil / Language */
  language?: CodeLanguage;
  /** Tab boyutu / Tab size */
  tabSize?: number;
  /** Degisince callback / On change callback */
  onChange?: (code: string) => void;
}

// ── API ──────────────────────────────────────────────

/** CodeEditor API / CodeEditor API */
export interface CodeEditorAPI {
  /** Guncel context / Get current context */
  getContext(): CodeEditorContext;
  /** Event gonder / Send event */
  send(event: CodeEditorEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
