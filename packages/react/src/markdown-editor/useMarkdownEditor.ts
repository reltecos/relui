/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useMarkdownEditor — MarkdownEditor React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createMarkdownEditor,
  type MarkdownEditorConfig,
  type MarkdownEditorAPI,
  type MarkdownEditorMode,
  type MarkdownFormat,
} from '@relteco/relui-core';

export interface UseMarkdownEditorProps extends MarkdownEditorConfig {
  /** Controlled markdown / Controlled markdown */
  value?: string;
  /** Controlled mod / Controlled mode */
  mode?: MarkdownEditorMode;
}

export interface UseMarkdownEditorReturn {
  markdown: string;
  html: string;
  mode: MarkdownEditorMode;
  setMarkdown: (md: string) => void;
  insertFormat: (format: MarkdownFormat, selStart: number, selEnd: number) => void;
  setMode: (mode: MarkdownEditorMode) => void;
  api: MarkdownEditorAPI;
}

export function useMarkdownEditor(props: UseMarkdownEditorProps = {}): UseMarkdownEditorReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<MarkdownEditorAPI | null>(null);
  const prevRef = useRef<UseMarkdownEditorProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createMarkdownEditor({
      defaultMarkdown: props.value ?? props.defaultMarkdown,
      defaultMode: props.mode ?? props.defaultMode,
      onChange: props.onChange,
    });
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.value !== props.value && props.value !== undefined) {
      api.send({ type: 'SET_MARKDOWN', markdown: props.value });
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
    markdown: ctx.markdown,
    html: ctx.html,
    mode: ctx.mode,
    setMarkdown: useCallback((md: string) => api.send({ type: 'SET_MARKDOWN', markdown: md }), [api]),
    insertFormat: useCallback((format: MarkdownFormat, s: number, e: number) =>
      api.send({ type: 'INSERT_FORMAT', format, selectionStart: s, selectionEnd: e }), [api]),
    setMode: useCallback((m: MarkdownEditorMode) => api.send({ type: 'SET_MODE', mode: m }), [api]),
    api,
  };
}
