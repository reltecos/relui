/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { FormFieldDef, FormFieldType } from '../form-engine/form-engine.types';

export interface DesignerField extends FormFieldDef {
  readonly id: string;
  readonly order: number;
}

export type FormDesignerEvent =
  | { type: 'ADD_FIELD'; fieldType: FormFieldType; label?: string }
  | { type: 'REMOVE_FIELD'; id: string }
  | { type: 'UPDATE_FIELD'; id: string; updates: Partial<Omit<DesignerField, 'id' | 'order'>> }
  | { type: 'REORDER'; id: string; newOrder: number }
  | { type: 'SELECT_FIELD'; id: string | null }
  | { type: 'SET_FIELDS'; fields: DesignerField[] };

export interface FormDesignerContext {
  readonly fields: readonly DesignerField[];
  readonly selectedFieldId: string | null;
  readonly schema: readonly FormFieldDef[];
  readonly fieldCount: number;
}

export interface FormDesignerConfig {
  fields?: DesignerField[];
  onChange?: (fields: DesignerField[]) => void;
}

export interface FormDesignerAPI {
  getContext(): FormDesignerContext;
  send(event: FormDesignerEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
