/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type CanvasShapeType = 'rect' | 'ellipse' | 'line' | 'text';

export interface CanvasShape {
  readonly id: string;
  readonly type: CanvasShapeType;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly rotation: number;
  readonly fill: string;
  readonly stroke: string;
  readonly strokeWidth: number;
  readonly text?: string;
  readonly fontSize?: number;
  readonly zIndex: number;
  readonly visible: boolean;
  readonly locked: boolean;
}

export type Canvas2DEvent =
  | { type: 'ADD_SHAPE'; shape: CanvasShape }
  | { type: 'DELETE_SHAPE'; shapeId: string }
  | { type: 'UPDATE_SHAPE'; shapeId: string; updates: Partial<Omit<CanvasShape, 'id'>> }
  | { type: 'SELECT'; ids: string[] }
  | { type: 'DESELECT_ALL' }
  | { type: 'MOVE_SHAPE'; shapeId: string; x: number; y: number }
  | { type: 'RESIZE_SHAPE'; shapeId: string; width: number; height: number }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_PAN'; panX: number; panY: number }
  | { type: 'BRING_FORWARD'; shapeId: string }
  | { type: 'SEND_BACKWARD'; shapeId: string }
  | { type: 'UNDO' }
  | { type: 'REDO' };

export interface Canvas2DContext {
  readonly shapes: readonly CanvasShape[];
  readonly selectedIds: ReadonlySet<string>;
  readonly zoom: number;
  readonly panX: number;
  readonly panY: number;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
}

export interface Canvas2DConfig {
  defaultShapes?: CanvasShape[];
  gridSize?: number;
  snapToGrid?: boolean;
  onChange?: (shapes: readonly CanvasShape[]) => void;
}

export interface Canvas2DAPI {
  getContext(): Canvas2DContext;
  send(event: Canvas2DEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
  exportJSON(): string;
}
