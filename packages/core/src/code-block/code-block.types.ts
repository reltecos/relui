/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CodeBlock tipleri.
 * CodeBlock types.
 *
 * @packageDocumentation
 */

/** Desteklenen diller / Supported languages */
export type CodeLanguage = 'javascript' | 'typescript' | 'css' | 'html' | 'json' | 'text';

/** Token tipi / Token type */
export type TokenType = 'keyword' | 'string' | 'comment' | 'number' | 'punctuation' | 'operator' | 'tag' | 'attribute' | 'property' | 'text';

/** Tekil token / Single token */
export interface CodeToken {
  /** Token tipi / Token type */
  type: TokenType;
  /** Token icerigi / Token content */
  value: string;
}

/** Satirlik token dizisi / Line of tokens */
export interface CodeLine {
  /** Satir numarasi (1-based) / Line number (1-based) */
  lineNumber: number;
  /** Token listesi / Token list */
  tokens: CodeToken[];
}

/** Tokenizer sonucu / Tokenizer result */
export interface HighlightResult {
  /** Satirlar / Lines */
  lines: CodeLine[];
  /** Dil / Language */
  language: CodeLanguage;
}
