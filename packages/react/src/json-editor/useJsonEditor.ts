/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useJsonEditor — JSONEditor React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createJsonEditor,
  type JsonEditorConfig,
  type JsonEditorAPI,
  type JsonEditorMode,
  type JsonNode,
  type JsonNodeType,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export interface UseJsonEditorProps extends JsonEditorConfig {
  /** Controlled deger / Controlled value */
  value?: unknown;
  /** Controlled mod / Controlled mode */
  mode?: JsonEditorMode;
}

// ── Hook Return ─────────────────────────────────────

export interface UseJsonEditorReturn {
  /** Kok dugum / Root node */
  rootNode: JsonNode | null;
  /** Mod / Mode */
  mode: JsonEditorMode;
  /** Metin / Text */
  text: string;
  /** Gecerli mi / Is valid */
  valid: boolean;
  /** Hata / Error */
  error: string | null;
  /** Acik dugumler / Expanded ids */
  expandedIds: ReadonlySet<string>;
  /** Secili dugum / Selected node id */
  selectedNodeId: string | null;
  /** JSON ayarla / Set JSON */
  setJson: (value: unknown) => void;
  /** Metin ayarla / Set text */
  setText: (text: string) => void;
  /** Node ac/kapa / Toggle node */
  toggleNode: (nodeId: string) => void;
  /** Tumu ac / Expand all */
  expandAll: () => void;
  /** Tumu kapa / Collapse all */
  collapseAll: () => void;
  /** Node deger guncelle / Update node value */
  updateNodeValue: (nodeId: string, value: string | number | boolean | null, valueType: JsonNodeType) => void;
  /** Node anahtar guncelle / Update node key */
  updateNodeKey: (nodeId: string, key: string) => void;
  /** Node ekle / Add node */
  addNode: (parentId: string, key: string, value: string | number | boolean | null, valueType: JsonNodeType) => void;
  /** Node sil / Delete node */
  deleteNode: (nodeId: string) => void;
  /** Mod degistir / Set mode */
  setMode: (mode: JsonEditorMode) => void;
  /** Node sec / Select node */
  selectNode: (nodeId: string | null) => void;
  /** Core API / Core API */
  api: JsonEditorAPI;
}

/**
 * useJsonEditor — JSONEditor yonetim hook.
 * useJsonEditor — JSONEditor management hook.
 */
export function useJsonEditor(props: UseJsonEditorProps = {}): UseJsonEditorReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<JsonEditorAPI | null>(null);
  const prevRef = useRef<UseJsonEditorProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createJsonEditor({
      defaultValue: props.value ?? props.defaultValue,
      defaultMode: props.mode ?? props.defaultMode,
      onChange: props.onChange,
      onValidate: props.onValidate,
    });
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }

    if (prev.value !== props.value && props.value !== undefined) {
      api.send({ type: 'SET_JSON', value: props.value });
      forceRender();
    }
    if (prev.mode !== props.mode && props.mode !== undefined) {
      api.send({ type: 'SET_MODE', mode: props.mode });
      forceRender();
    }

    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  return {
    rootNode: ctx.rootNode,
    mode: ctx.mode,
    text: ctx.text,
    valid: ctx.valid,
    error: ctx.error,
    expandedIds: ctx.expandedIds,
    selectedNodeId: ctx.selectedNodeId,
    setJson: useCallback((v: unknown) => api.send({ type: 'SET_JSON', value: v }), [api]),
    setText: useCallback((t: string) => api.send({ type: 'SET_TEXT', text: t }), [api]),
    toggleNode: useCallback((id: string) => api.send({ type: 'TOGGLE_NODE', nodeId: id }), [api]),
    expandAll: useCallback(() => api.send({ type: 'EXPAND_ALL' }), [api]),
    collapseAll: useCallback(() => api.send({ type: 'COLLAPSE_ALL' }), [api]),
    updateNodeValue: useCallback((id: string, v: string | number | boolean | null, vt: JsonNodeType) =>
      api.send({ type: 'UPDATE_NODE_VALUE', nodeId: id, value: v, valueType: vt }), [api]),
    updateNodeKey: useCallback((id: string, k: string) =>
      api.send({ type: 'UPDATE_NODE_KEY', nodeId: id, key: k }), [api]),
    addNode: useCallback((pid: string, k: string, v: string | number | boolean | null, vt: JsonNodeType) =>
      api.send({ type: 'ADD_NODE', parentId: pid, key: k, value: v, valueType: vt }), [api]),
    deleteNode: useCallback((id: string) => api.send({ type: 'DELETE_NODE', nodeId: id }), [api]),
    setMode: useCallback((m: JsonEditorMode) => api.send({ type: 'SET_MODE', mode: m }), [api]),
    selectNode: useCallback((id: string | null) => api.send({ type: 'SELECT_NODE', nodeId: id }), [api]),
    api,
  };
}
