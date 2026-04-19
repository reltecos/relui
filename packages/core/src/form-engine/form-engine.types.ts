/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type FormFieldType = 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea' | 'radio';

export interface FormFieldOption {
  readonly label: string;
  readonly value: string;
}

export interface FormFieldDef {
  readonly name: string;
  readonly type: FormFieldType;
  readonly label: string;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly min?: number;
  readonly max?: number;
  readonly pattern?: string;
  readonly options?: readonly FormFieldOption[];
  readonly defaultValue?: string | number | boolean;
  readonly customValidate?: (value: unknown) => string | null;
}

export interface ValidationError {
  readonly field: string;
  readonly message: string;
}

export type FormEngineEvent =
  | { type: 'SET_VALUE'; field: string; value: unknown }
  | { type: 'SET_TOUCHED'; field: string }
  | { type: 'VALIDATE' }
  | { type: 'SUBMIT' }
  | { type: 'RESET' }
  | { type: 'SET_SCHEMA'; fields: FormFieldDef[] };

export interface FormEngineContext {
  readonly fields: readonly FormFieldDef[];
  readonly values: Readonly<Record<string, unknown>>;
  readonly errors: readonly ValidationError[];
  readonly touched: Readonly<Record<string, boolean>>;
  readonly dirty: boolean;
  readonly isValid: boolean;
  readonly isSubmitting: boolean;
}

export interface FormEngineConfig {
  fields?: FormFieldDef[];
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
  onChange?: (values: Record<string, unknown>) => void;
}

export interface FormEngineAPI {
  getContext(): FormEngineContext;
  send(event: FormEngineEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
