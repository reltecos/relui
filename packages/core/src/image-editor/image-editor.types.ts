/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface ImageFilter {
  readonly brightness: number;
  readonly contrast: number;
  readonly saturate: number;
  readonly blur: number;
  readonly grayscale: number;
}

export interface CropRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export type AnnotationType = 'text' | 'arrow' | 'freehand';

export interface AnnotationItem {
  readonly id: string;
  readonly type: AnnotationType;
  readonly x: number;
  readonly y: number;
  readonly data: string;
}

export type ImageEditorEvent =
  | { type: 'ROTATE_CW' }
  | { type: 'ROTATE_CCW' }
  | { type: 'FLIP_H' }
  | { type: 'FLIP_V' }
  | { type: 'SET_FILTER'; filter: Partial<ImageFilter> }
  | { type: 'RESET_FILTER' }
  | { type: 'SET_CROP'; crop: CropRect | null }
  | { type: 'ADD_ANNOTATION'; annotation: AnnotationItem }
  | { type: 'REMOVE_ANNOTATION'; id: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' };

export interface ImageEditorState {
  readonly rotation: number;
  readonly flipH: boolean;
  readonly flipV: boolean;
  readonly filter: ImageFilter;
  readonly crop: CropRect | null;
  readonly annotations: readonly AnnotationItem[];
}

export interface ImageEditorContext extends ImageEditorState {
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly cssFilter: string;
}

export interface ImageEditorConfig {
  onChange?: (state: ImageEditorState) => void;
}

export interface ImageEditorAPI {
  getContext(): ImageEditorContext;
  send(event: ImageEditorEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
