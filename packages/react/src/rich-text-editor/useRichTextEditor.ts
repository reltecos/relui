/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useRichTextEditor — RichTextEditor React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createRichTextEditor,
  type RichTextEditorConfig,
  type RichTextEditorAPI,
  type RichTextBlock,
  type RichTextBlockType,
  type InlineFormat,
  type ActiveFormats,
} from '@relteco/relui-core';

export interface UseRichTextEditorProps extends RichTextEditorConfig {
  /** Controlled HTML / Controlled HTML */
  value?: string;
}

export interface UseRichTextEditorReturn {
  blocks: readonly RichTextBlock[];
  html: string;
  activeFormats: ActiveFormats;
  canUndo: boolean;
  canRedo: boolean;
  setHtml: (html: string) => void;
  setBlocks: (blocks: RichTextBlock[]) => void;
  formatInline: (format: InlineFormat) => void;
  formatBlock: (blockType: RichTextBlockType) => void;
  undo: () => void;
  redo: () => void;
  setActiveFormats: (formats: ActiveFormats) => void;
  api: RichTextEditorAPI;
}

export function useRichTextEditor(props: UseRichTextEditorProps = {}): UseRichTextEditorReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<RichTextEditorAPI | null>(null);
  const prevRef = useRef<UseRichTextEditorProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createRichTextEditor({
      defaultHtml: props.value ?? props.defaultHtml,
      defaultBlocks: props.defaultBlocks,
      onChange: props.onChange,
    });
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.value !== props.value && props.value !== undefined) {
      api.send({ type: 'SET_HTML', html: props.value });
      forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  return {
    blocks: ctx.blocks,
    html: ctx.html,
    activeFormats: ctx.activeFormats,
    canUndo: ctx.canUndo,
    canRedo: ctx.canRedo,
    setHtml: useCallback((h: string) => api.send({ type: 'SET_HTML', html: h }), [api]),
    setBlocks: useCallback((b: RichTextBlock[]) => api.send({ type: 'SET_BLOCKS', blocks: b }), [api]),
    formatInline: useCallback((f: InlineFormat) => api.send({ type: 'FORMAT_INLINE', format: f }), [api]),
    formatBlock: useCallback((bt: RichTextBlockType) => api.send({ type: 'FORMAT_BLOCK', blockType: bt }), [api]),
    undo: useCallback(() => api.send({ type: 'UNDO' }), [api]),
    redo: useCallback(() => api.send({ type: 'REDO' }), [api]),
    setActiveFormats: useCallback((f: ActiveFormats) => api.send({ type: 'SET_ACTIVE_FORMATS', formats: f }), [api]),
    api,
  };
}
