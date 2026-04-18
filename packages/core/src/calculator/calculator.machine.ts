/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Calculator state machine — shunting-yard expression evaluation.
 *
 * @packageDocumentation
 */

import type { CalculatorConfig, CalculatorContext, CalculatorEvent, CalculatorAPI } from './calculator.types';

export function createCalculator(config: CalculatorConfig = {}): CalculatorAPI {
  const { precision = 10, onResult } = config;

  let display = '0';
  let expression = '';
  let memory = 0;
  let history: string[] = [];
  let lastWasEquals = false;

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function getContext(): CalculatorContext {
    return { display, expression, memory, history: [...history] };
  }

  function appendToExpression(value: string): void {
    if (lastWasEquals) {
      expression = '';
      lastWasEquals = false;
    }
    expression += value;
  }

  function send(event: CalculatorEvent): void {
    switch (event.type) {
      case 'DIGIT':
        if (lastWasEquals) { display = ''; expression = ''; lastWasEquals = false; }
        if (display === '0' || display === 'Error') display = '';
        display += event.digit;
        notify();
        break;

      case 'DECIMAL':
        if (lastWasEquals) { display = '0'; expression = ''; lastWasEquals = false; }
        if (!display.includes('.')) display += '.';
        notify();
        break;

      case 'OPERATOR': {
        appendToExpression(display + ' ' + event.operator + ' ');
        display = '0';
        notify();
        break;
      }

      case 'EQUALS': {
        const fullExpr = expression + display;
        const result = evaluate(fullExpr, precision);
        const entry = fullExpr + ' = ' + result;
        history = [...history, entry];
        expression = '';
        display = result;
        lastWasEquals = true;
        const num = parseFloat(result);
        if (!Number.isNaN(num)) onResult?.(num);
        notify();
        break;
      }

      case 'CLEAR':
        display = '0';
        expression = '';
        lastWasEquals = false;
        notify();
        break;

      case 'CLEAR_ENTRY':
        display = '0';
        notify();
        break;

      case 'BACKSPACE':
        if (display.length > 1) {
          display = display.slice(0, -1);
        } else {
          display = '0';
        }
        notify();
        break;

      case 'NEGATE': {
        if (display !== '0' && display !== 'Error') {
          display = display.startsWith('-') ? display.slice(1) : '-' + display;
        }
        notify();
        break;
      }

      case 'PERCENT': {
        const val = parseFloat(display);
        if (!Number.isNaN(val)) display = String(val / 100);
        notify();
        break;
      }

      case 'PAREN_OPEN':
        appendToExpression('( ');
        display = '0';
        notify();
        break;

      case 'PAREN_CLOSE':
        appendToExpression(display + ' ) ');
        display = '0';
        notify();
        break;

      case 'MEMORY_ADD': {
        const v = parseFloat(display);
        if (!Number.isNaN(v)) memory += v;
        notify();
        break;
      }

      case 'MEMORY_SUBTRACT': {
        const v = parseFloat(display);
        if (!Number.isNaN(v)) memory -= v;
        notify();
        break;
      }

      case 'MEMORY_RECALL':
        display = String(memory);
        notify();
        break;

      case 'MEMORY_CLEAR':
        memory = 0;
        notify();
        break;
    }
  }

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  }

  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy };
}

// ── Expression evaluator ────────────────────────────

function evaluate(expr: string, precision: number): string {
  try {
    const tokens = tokenize(expr);
    const rpn = shuntingYard(tokens);
    const result = evaluateRPN(rpn);
    if (!Number.isFinite(result)) return 'Error';
    return parseFloat(result.toFixed(precision)).toString();
  } catch {
    return 'Error';
  }
}

type Token = { type: 'number'; value: number } | { type: 'op'; value: string } | { type: 'paren'; value: string };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  const parts = expr.trim().split(/\s+/);
  for (const part of parts) {
    if (part === '') continue;
    if (part === '(' || part === ')') {
      tokens.push({ type: 'paren', value: part });
    } else if (['+', '-', '*', '/'].includes(part)) {
      tokens.push({ type: 'op', value: part });
    } else {
      const num = parseFloat(part);
      if (Number.isNaN(num)) throw new Error(`Invalid token: ${part}`);
      tokens.push({ type: 'number', value: num });
    }
  }
  return tokens;
}

function precedence(op: string): number {
  if (op === '+' || op === '-') return 1;
  if (op === '*' || op === '/') return 2;
  return 0;
}

function shuntingYard(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const opStack: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token);
    } else if (token.type === 'op') {
      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1];
        if (top && top.type === 'op' && precedence(top.value) >= precedence(token.value)) {
          output.push(opStack.pop() as Token);
        } else {
          break;
        }
      }
      opStack.push(token);
    } else if (token.type === 'paren' && token.value === '(') {
      opStack.push(token);
    } else if (token.type === 'paren' && token.value === ')') {
      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1];
        if (top && top.type === 'paren' && top.value === '(') {
          opStack.pop();
          break;
        }
        output.push(opStack.pop() as Token);
      }
    }
  }

  while (opStack.length > 0) {
    output.push(opStack.pop() as Token);
  }

  return output;
}

function evaluateRPN(rpn: Token[]): number {
  const stack: number[] = [];
  for (const token of rpn) {
    if (token.type === 'number') {
      stack.push(token.value);
    } else if (token.type === 'op') {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error('Invalid expression');
      switch (token.value) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(a / b); break;
      }
    }
  }
  if (stack.length !== 1) throw new Error('Invalid expression');
  return stack[0] as number;
}
