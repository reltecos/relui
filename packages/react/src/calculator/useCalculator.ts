/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createCalculator, type CalculatorAPI, type CalculatorContext, type CalculatorEvent } from '@relteco/relui-core';

export interface UseCalculatorProps {
  precision?: number;
  onResult?: (result: number) => void;
}

export interface UseCalculatorReturn {
  api: CalculatorAPI;
  ctx: CalculatorContext;
  handleKeyboard: (e: React.KeyboardEvent | KeyboardEvent) => void;
}

export function useCalculator(props: UseCalculatorProps): UseCalculatorReturn {
  const { precision, onResult } = props;
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<CalculatorAPI | null>(null);

  if (apiRef.current === null) {
    apiRef.current = createCalculator({ precision, onResult });
  }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const handleKeyboard = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    const key = e.key;
    let event: CalculatorEvent | null = null;

    if (/^[0-9]$/.test(key)) {
      event = { type: 'DIGIT', digit: key };
    } else if (key === '.') {
      event = { type: 'DECIMAL' };
    } else if (key === '+') {
      event = { type: 'OPERATOR', operator: '+' };
    } else if (key === '-') {
      event = { type: 'OPERATOR', operator: '-' };
    } else if (key === '*') {
      event = { type: 'OPERATOR', operator: '*' };
    } else if (key === '/') {
      event = { type: 'OPERATOR', operator: '/' };
    } else if (key === 'Enter' || key === '=') {
      event = { type: 'EQUALS' };
    } else if (key === 'Escape') {
      event = { type: 'CLEAR' };
    } else if (key === 'Backspace') {
      event = { type: 'BACKSPACE' };
    } else if (key === '%') {
      event = { type: 'PERCENT' };
    } else if (key === '(') {
      event = { type: 'PAREN_OPEN' };
    } else if (key === ')') {
      event = { type: 'PAREN_CLOSE' };
    }

    if (event) {
      e.preventDefault();
      api.send(event);
    }
  }, [api]);

  return { api, ctx: api.getContext(), handleKeyboard };
}
