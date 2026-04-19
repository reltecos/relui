/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createImageEditor, type ImageEditorConfig, type ImageEditorAPI, type ImageFilter, type CropRect, type AnnotationItem } from '@relteco/relui-core';

export type UseImageEditorProps = ImageEditorConfig;
export type UseImageEditorReturn = ReturnType<ImageEditorAPI['getContext']> & {
  rotateCW: () => void; rotateCCW: () => void; toggleFlipH: () => void; toggleFlipV: () => void;
  setFilter: (f: Partial<ImageFilter>) => void; resetFilter: () => void;
  setCrop: (c: CropRect | null) => void; addAnnotation: (a: AnnotationItem) => void;
  removeAnnotation: (id: string) => void; undo: () => void; redo: () => void; reset: () => void;
  api: ImageEditorAPI;
};

export function useImageEditor(props: UseImageEditorProps = {}): UseImageEditorReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<ImageEditorAPI | null>(null);
  if (apiRef.current === null) apiRef.current = createImageEditor(props);
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const ctx = api.getContext();
  return {
    ...ctx, api,
    rotateCW: useCallback(() => api.send({ type: 'ROTATE_CW' }), [api]),
    rotateCCW: useCallback(() => api.send({ type: 'ROTATE_CCW' }), [api]),
    toggleFlipH: useCallback(() => api.send({ type: 'FLIP_H' }), [api]),
    toggleFlipV: useCallback(() => api.send({ type: 'FLIP_V' }), [api]),
    setFilter: useCallback((f: Partial<ImageFilter>) => api.send({ type: 'SET_FILTER', filter: f }), [api]),
    resetFilter: useCallback(() => api.send({ type: 'RESET_FILTER' }), [api]),
    setCrop: useCallback((c: CropRect | null) => api.send({ type: 'SET_CROP', crop: c }), [api]),
    addAnnotation: useCallback((a: AnnotationItem) => api.send({ type: 'ADD_ANNOTATION', annotation: a }), [api]),
    removeAnnotation: useCallback((id: string) => api.send({ type: 'REMOVE_ANNOTATION', id }), [api]),
    undo: useCallback(() => api.send({ type: 'UNDO' }), [api]),
    redo: useCallback(() => api.send({ type: 'REDO' }), [api]),
    reset: useCallback(() => api.send({ type: 'RESET' }), [api]),
  };
}
