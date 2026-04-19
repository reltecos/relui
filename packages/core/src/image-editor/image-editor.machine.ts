/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  ImageEditorConfig, ImageEditorContext, ImageEditorEvent, ImageEditorAPI,
  ImageEditorState, ImageFilter,
} from './image-editor.types';

const DEFAULT_FILTER: ImageFilter = { brightness: 100, contrast: 100, saturate: 100, blur: 0, grayscale: 0 };

function cloneState(s: ImageEditorState): ImageEditorState {
  return { rotation: s.rotation, flipH: s.flipH, flipV: s.flipV, filter: { ...s.filter }, crop: s.crop ? { ...s.crop } : null, annotations: [...s.annotations] };
}

function buildCssFilter(f: ImageFilter): string {
  const parts: string[] = [];
  if (f.brightness !== 100) parts.push(`brightness(${f.brightness}%)`);
  if (f.contrast !== 100) parts.push(`contrast(${f.contrast}%)`);
  if (f.saturate !== 100) parts.push(`saturate(${f.saturate}%)`);
  if (f.blur > 0) parts.push(`blur(${f.blur}px)`);
  if (f.grayscale > 0) parts.push(`grayscale(${f.grayscale}%)`);
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export function createImageEditor(config: ImageEditorConfig = {}): ImageEditorAPI {
  let state: ImageEditorState = { rotation: 0, flipH: false, flipV: false, filter: { ...DEFAULT_FILTER }, crop: null, annotations: [] };
  const undoStack: ImageEditorState[] = [];
  const redoStack: ImageEditorState[] = [];

  const listeners = new Set<() => void>();
  function notify(): void { config.onChange?.(state); listeners.forEach((fn) => fn()); }

  function pushUndo(): void { undoStack.push(cloneState(state)); redoStack.length = 0; }

  function send(event: ImageEditorEvent): void {
    switch (event.type) {
      case 'ROTATE_CW': { pushUndo(); state = { ...state, rotation: (state.rotation + 90) % 360 }; notify(); break; }
      case 'ROTATE_CCW': { pushUndo(); state = { ...state, rotation: (state.rotation + 270) % 360 }; notify(); break; }
      case 'FLIP_H': { pushUndo(); state = { ...state, flipH: !state.flipH }; notify(); break; }
      case 'FLIP_V': { pushUndo(); state = { ...state, flipV: !state.flipV }; notify(); break; }
      case 'SET_FILTER': { pushUndo(); state = { ...state, filter: { ...state.filter, ...event.filter } }; notify(); break; }
      case 'RESET_FILTER': { pushUndo(); state = { ...state, filter: { ...DEFAULT_FILTER } }; notify(); break; }
      case 'SET_CROP': { pushUndo(); state = { ...state, crop: event.crop }; notify(); break; }
      case 'ADD_ANNOTATION': { pushUndo(); state = { ...state, annotations: [...state.annotations, event.annotation] }; notify(); break; }
      case 'REMOVE_ANNOTATION': { pushUndo(); state = { ...state, annotations: state.annotations.filter((a) => a.id !== event.id) }; notify(); break; }
      case 'UNDO': {
        const prev = undoStack.pop();
        if (!prev) return;
        redoStack.push(cloneState(state));
        state = prev;
        notify(); break;
      }
      case 'REDO': {
        const next = redoStack.pop();
        if (!next) return;
        undoStack.push(cloneState(state));
        state = next;
        notify(); break;
      }
      case 'RESET': {
        pushUndo();
        state = { rotation: 0, flipH: false, flipV: false, filter: { ...DEFAULT_FILTER }, crop: null, annotations: [] };
        notify(); break;
      }
    }
  }

  return {
    getContext(): ImageEditorContext {
      return { ...state, canUndo: undoStack.length > 0, canRedo: redoStack.length > 0, cssFilter: buildCssFilter(state.filter) };
    },
    send,
    subscribe(cb) { listeners.add(cb); return () => { listeners.delete(cb); }; },
    destroy() { listeners.clear(); },
  };
}
