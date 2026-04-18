/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * JSONEditor tipleri.
 * JSONEditor types.
 *
 * @packageDocumentation
 */

// ── Node Types ───────────────────────────────────────

/** JSON deger tipi / JSON value type */
export type JsonNodeType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object';

/** JSON agac dugumu / JSON tree node */
export interface JsonNode {
  /** Benzersiz id / Unique id */
  readonly id: string;
  /** Anahtar (object property veya array index) / Key */
  readonly key: string;
  /** Deger (primitive icin) / Value (for primitives) */
  readonly value: string | number | boolean | null;
  /** Deger tipi / Value type */
  readonly type: JsonNodeType;
  /** Ust dugum id / Parent node id */
  readonly parentId: string | null;
  /** Alt dugumler (object/array icin) / Child nodes */
  readonly children: readonly JsonNode[];
  /** Derinlik / Depth */
  readonly depth: number;
}

// ── Editor Mode ──────────────────────────────────────

/** Editor modu / Editor mode */
export type JsonEditorMode = 'tree' | 'text';

// ── Events ───────────────────────────────────────────

/** JSONEditor event'leri / JSONEditor events */
export type JsonEditorEvent =
  | { type: 'SET_JSON'; value: unknown }
  | { type: 'SET_TEXT'; text: string }
  | { type: 'TOGGLE_NODE'; nodeId: string }
  | { type: 'EXPAND_ALL' }
  | { type: 'COLLAPSE_ALL' }
  | { type: 'UPDATE_NODE_VALUE'; nodeId: string; value: string | number | boolean | null; valueType: JsonNodeType }
  | { type: 'UPDATE_NODE_KEY'; nodeId: string; key: string }
  | { type: 'ADD_NODE'; parentId: string; key: string; value: string | number | boolean | null; valueType: JsonNodeType }
  | { type: 'DELETE_NODE'; nodeId: string }
  | { type: 'SET_MODE'; mode: JsonEditorMode }
  | { type: 'SELECT_NODE'; nodeId: string | null };

// ── Context ──────────────────────────────────────────

/** JSONEditor state / JSONEditor context */
export interface JsonEditorContext {
  /** Kok dugum / Root node */
  readonly rootNode: JsonNode | null;
  /** Editor modu / Editor mode */
  readonly mode: JsonEditorMode;
  /** Metin icerigi / Text content */
  readonly text: string;
  /** Gecerli JSON mi / Is valid JSON */
  readonly valid: boolean;
  /** Hata mesaji / Error message */
  readonly error: string | null;
  /** Acik dugum id'leri / Expanded node ids */
  readonly expandedIds: ReadonlySet<string>;
  /** Secili dugum id / Selected node id */
  readonly selectedNodeId: string | null;
}

// ── Config ───────────────────────────────────────────

/** JSONEditor yapilandirmasi / JSONEditor configuration */
export interface JsonEditorConfig {
  /** Varsayilan deger / Default value */
  defaultValue?: unknown;
  /** Varsayilan mod / Default mode */
  defaultMode?: JsonEditorMode;
  /** Deger degisince callback / On change callback */
  onChange?: (value: unknown, text: string) => void;
  /** Dogrulama callback / On validate callback */
  onValidate?: (valid: boolean, error: string | null) => void;
}

// ── API ──────────────────────────────────────────────

/** JSONEditor API / JSONEditor API */
export interface JsonEditorAPI {
  /** Guncel context / Get current context */
  getContext(): JsonEditorContext;
  /** Event gonder / Send event */
  send(event: JsonEditorEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}
