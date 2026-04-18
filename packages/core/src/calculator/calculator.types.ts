/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Calculator context */
export interface CalculatorContext {
  readonly display: string;
  readonly expression: string;
  readonly memory: number;
  readonly history: ReadonlyArray<string>;
}

/** Calculator event leri */
export type CalculatorEvent =
  | { type: 'DIGIT'; digit: string }
  | { type: 'OPERATOR'; operator: '+' | '-' | '*' | '/' }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_ENTRY' }
  | { type: 'DECIMAL' }
  | { type: 'PERCENT' }
  | { type: 'NEGATE' }
  | { type: 'BACKSPACE' }
  | { type: 'MEMORY_ADD' }
  | { type: 'MEMORY_SUBTRACT' }
  | { type: 'MEMORY_RECALL' }
  | { type: 'MEMORY_CLEAR' }
  | { type: 'PAREN_OPEN' }
  | { type: 'PAREN_CLOSE' };

/** Calculator yapilandirmasi */
export interface CalculatorConfig {
  precision?: number;
  onResult?: (result: number) => void;
}

/** Calculator API */
export interface CalculatorAPI {
  getContext(): CalculatorContext;
  send(event: CalculatorEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}
