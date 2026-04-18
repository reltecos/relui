/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useCodeEditor — CodeEditor React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createCodeEditor,
  type CodeEditorConfig,
  type CodeEditorAPI,
  type CursorPosition,
  type Selection,
} from '@relteco/relui-core';
import type { CodeLanguage } from '@relteco/relui-core';

export interface UseCodeEditorProps extends CodeEditorConfig {
  /** Controlled kod / Controlled code */
  value?: string;
}

export interface UseCodeEditorReturn {
  lines: readonly string[];
  code: string;
  language: CodeLanguage;
  cursor: CursorPosition;
  selection: Selection | null;
  foldedLines: ReadonlySet<number>;
  highlightedLines: ReturnType<typeof createCodeEditor>['getContext'] extends () => infer R ? R extends { highlightedLines: infer H } ? H : never : never;
  findQuery: string;
  findMatches: ReturnType<typeof createCodeEditor>['getContext'] extends () => infer R ? R extends { findMatches: infer H } ? H : never : never;
  canUndo: boolean;
  canRedo: boolean;
  tabSize: number;
  setCode: (code: string) => void;
  setLanguage: (lang: CodeLanguage) => void;
  setCursor: (pos: CursorPosition) => void;
  setSelection: (sel: Selection | null) => void;
  insertText: (text: string) => void;
  deleteBackward: () => void;
  deleteForward: () => void;
  undo: () => void;
  redo: () => void;
  indent: () => void;
  outdent: () => void;
  toggleFold: (line: number) => void;
  find: (query: string) => void;
  clearFind: () => void;
  selectAll: () => void;
  api: CodeEditorAPI;
}

export function useCodeEditor(props: UseCodeEditorProps = {}): UseCodeEditorReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<CodeEditorAPI | null>(null);
  const prevRef = useRef<UseCodeEditorProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createCodeEditor({
      defaultCode: props.value ?? props.defaultCode,
      language: props.language,
      tabSize: props.tabSize,
      onChange: props.onChange,
    });
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.value !== props.value && props.value !== undefined) {
      api.send({ type: 'SET_CODE', code: props.value });
      forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  return {
    ...ctx,
    setCode: useCallback((c: string) => api.send({ type: 'SET_CODE', code: c }), [api]),
    setLanguage: useCallback((l: CodeLanguage) => api.send({ type: 'SET_LANGUAGE', language: l }), [api]),
    setCursor: useCallback((p: CursorPosition) => api.send({ type: 'SET_CURSOR', position: p }), [api]),
    setSelection: useCallback((s: Selection | null) => api.send({ type: 'SET_SELECTION', selection: s }), [api]),
    insertText: useCallback((t: string) => api.send({ type: 'INSERT_TEXT', text: t }), [api]),
    deleteBackward: useCallback(() => api.send({ type: 'DELETE_BACKWARD' }), [api]),
    deleteForward: useCallback(() => api.send({ type: 'DELETE_FORWARD' }), [api]),
    undo: useCallback(() => api.send({ type: 'UNDO' }), [api]),
    redo: useCallback(() => api.send({ type: 'REDO' }), [api]),
    indent: useCallback(() => api.send({ type: 'INDENT' }), [api]),
    outdent: useCallback(() => api.send({ type: 'OUTDENT' }), [api]),
    toggleFold: useCallback((l: number) => api.send({ type: 'TOGGLE_FOLD', line: l }), [api]),
    find: useCallback((q: string) => api.send({ type: 'FIND', query: q }), [api]),
    clearFind: useCallback(() => api.send({ type: 'CLEAR_FIND' }), [api]),
    selectAll: useCallback(() => api.send({ type: 'SELECT_ALL' }), [api]),
    api,
  };
}
