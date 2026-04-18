/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Spreadsheet formul parser ve evaluator.
 * Spreadsheet formula parser and evaluator.
 *
 * Desteklenen fonksiyonlar: SUM, AVG, COUNT, MIN, MAX, IF, CONCAT
 * Hucre referanslari: A1, B2, A1:B5 (range)
 * Operatorler: +, -, *, /, >, <, >=, <=, =, <>
 *
 * @packageDocumentation
 */

import type { CellValue } from './spreadsheet.types';

// ── Token Types ───────────────────────────────────────

type TokenType = 'NUMBER' | 'STRING' | 'BOOL' | 'REF' | 'FUNC' | 'OP' | 'LPAREN' | 'RPAREN' | 'COMMA' | 'COLON';

interface Token {
  type: TokenType;
  value: string;
}

// ── Tokenizer ─────────────────────────────────────────

function tokenize(formula: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = formula;

  while (i < s.length) {
    const ch = s[i] ?? '';

    // Whitespace
    if (ch === ' ' || ch === '\t') { i++; continue; }

    // String literal
    if (ch === '"') {
      let str = '';
      i++;
      while (i < s.length && s[i] !== '"') {
        str += s[i];
        i++;
      }
      i++; // closing quote
      tokens.push({ type: 'STRING', value: str });
      continue;
    }

    // Number
    if (/\d/.test(ch) || (ch === '.' && i + 1 < s.length && /\d/.test(s[i + 1] ?? ''))) {
      let num = '';
      while (i < s.length && (/\d/.test(s[i] ?? '') || s[i] === '.')) {
        num += s[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: num });
      continue;
    }

    // Cell ref or function name (A1, SUM, TRUE, FALSE)
    if (/[A-Za-z]/.test(ch)) {
      let word = '';
      while (i < s.length && /[A-Za-z0-9_]/.test(s[i] ?? '')) {
        word += s[i];
        i++;
      }
      const upper = word.toUpperCase();
      if (upper === 'TRUE' || upper === 'FALSE') {
        tokens.push({ type: 'BOOL', value: upper });
      } else if (i < s.length && s[i] === '(') {
        tokens.push({ type: 'FUNC', value: upper });
      } else if (/^[A-Z]{1,3}\d{1,5}$/.test(upper)) {
        tokens.push({ type: 'REF', value: upper });
      } else {
        tokens.push({ type: 'FUNC', value: upper });
      }
      continue;
    }

    // Operators
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      tokens.push({ type: 'OP', value: ch });
      i++;
      continue;
    }

    if (ch === '>' || ch === '<' || ch === '=') {
      let op = ch;
      if (i + 1 < s.length) {
        const next = s[i + 1];
        if ((ch === '>' && next === '=') || (ch === '<' && next === '=') || (ch === '<' && next === '>')) {
          op += next;
          i++;
        }
      }
      tokens.push({ type: 'OP', value: op });
      i++;
      continue;
    }

    if (ch === '(') { tokens.push({ type: 'LPAREN', value: '(' }); i++; continue; }
    if (ch === ')') { tokens.push({ type: 'RPAREN', value: ')' }); i++; continue; }
    if (ch === ',') { tokens.push({ type: 'COMMA', value: ',' }); i++; continue; }
    if (ch === ':') { tokens.push({ type: 'COLON', value: ':' }); i++; continue; }

    // Unknown — skip
    i++;
  }

  return tokens;
}

// ── AST ───────────────────────────────────────────────

type ASTNode =
  | { kind: 'number'; value: number }
  | { kind: 'string'; value: string }
  | { kind: 'bool'; value: boolean }
  | { kind: 'ref'; address: string }
  | { kind: 'range'; start: string; end: string }
  | { kind: 'binary'; op: string; left: ASTNode; right: ASTNode }
  | { kind: 'call'; name: string; args: ASTNode[] };

// ── Parser ────────────────────────────────────────────

function parse(tokens: Token[]): ASTNode {
  let pos = 0;

  function peek(): Token | undefined { return tokens[pos]; }
  function advance(): Token { return tokens[pos++] as Token; }

  function parseExpression(): ASTNode {
    return parseComparison();
  }

  function parseComparison(): ASTNode {
    let left = parseAddSub();
    while (peek()?.type === 'OP' && ['>', '<', '>=', '<=', '=', '<>'].includes(peek()?.value ?? '')) {
      const op = advance().value;
      const right = parseAddSub();
      left = { kind: 'binary', op, left, right };
    }
    return left;
  }

  function parseAddSub(): ASTNode {
    let left = parseMulDiv();
    while (peek()?.type === 'OP' && (peek()?.value === '+' || peek()?.value === '-')) {
      const op = advance().value;
      const right = parseMulDiv();
      left = { kind: 'binary', op, left, right };
    }
    return left;
  }

  function parseMulDiv(): ASTNode {
    let left = parsePrimary();
    while (peek()?.type === 'OP' && (peek()?.value === '*' || peek()?.value === '/')) {
      const op = advance().value;
      const right = parsePrimary();
      left = { kind: 'binary', op, left, right };
    }
    return left;
  }

  function parsePrimary(): ASTNode {
    const t = peek();
    if (!t) throw new Error('Unexpected end of formula');

    if (t.type === 'NUMBER') {
      advance();
      return { kind: 'number', value: Number(t.value) };
    }

    if (t.type === 'STRING') {
      advance();
      return { kind: 'string', value: t.value };
    }

    if (t.type === 'BOOL') {
      advance();
      return { kind: 'bool', value: t.value === 'TRUE' };
    }

    if (t.type === 'REF') {
      advance();
      // Check for range (A1:B5)
      if (peek()?.type === 'COLON') {
        advance(); // consume ':'
        const endToken = advance();
        return { kind: 'range', start: t.value, end: endToken.value };
      }
      return { kind: 'ref', address: t.value };
    }

    if (t.type === 'FUNC') {
      const name = t.value;
      advance();
      // Expect '('
      if (peek()?.type === 'LPAREN') advance();
      const args: ASTNode[] = [];
      while (peek() && peek()?.type !== 'RPAREN') {
        args.push(parseExpression());
        if (peek()?.type === 'COMMA') advance();
      }
      if (peek()?.type === 'RPAREN') advance();
      return { kind: 'call', name, args };
    }

    if (t.type === 'LPAREN') {
      advance();
      const expr = parseExpression();
      if (peek()?.type === 'RPAREN') advance();
      return expr;
    }

    // Unary minus
    if (t.type === 'OP' && t.value === '-') {
      advance();
      const operand = parsePrimary();
      return { kind: 'binary', op: '*', left: { kind: 'number', value: -1 }, right: operand };
    }

    throw new Error(`Unexpected token: ${t.value}`);
  }

  return parseExpression();
}

// ── Cell Reference Helpers ────────────────────────────

/** A1 -> { row: 0, col: 0 } */
export function parseRef(ref: string): { row: number; col: number } {
  const match = ref.match(/^([A-Z]{1,3})(\d{1,5})$/);
  if (!match) throw new Error(`Invalid cell reference: ${ref}`);
  const colStr = match[1] as string;
  const rowStr = match[2] as string;
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  return { row: Number(rowStr) - 1, col: col - 1 };
}

/** { row: 0, col: 0 } -> "A1" */
export function toRef(row: number, col: number): string {
  let colStr = '';
  let c = col + 1;
  while (c > 0) {
    const r = (c - 1) % 26;
    colStr = String.fromCharCode(65 + r) + colStr;
    c = Math.floor((c - 1) / 26);
  }
  return colStr + String(row + 1);
}

/** Range icindeki tum hucreleri dondurur / Expand range to all cell addresses */
function expandRange(start: string, end: string): { row: number; col: number }[] {
  const s = parseRef(start);
  const e = parseRef(end);
  const minRow = Math.min(s.row, e.row);
  const maxRow = Math.max(s.row, e.row);
  const minCol = Math.min(s.col, e.col);
  const maxCol = Math.max(s.col, e.col);
  const cells: { row: number; col: number }[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      cells.push({ row: r, col: c });
    }
  }
  return cells;
}

// ── Evaluator ─────────────────────────────────────────

type CellLookup = (row: number, col: number) => CellValue;

function evaluate(node: ASTNode, lookup: CellLookup, visited: Set<string>): CellValue {
  switch (node.kind) {
    case 'number': return node.value;
    case 'string': return node.value;
    case 'bool': return node.value;

    case 'ref': {
      const addr = parseRef(node.address);
      const key = `${addr.row},${addr.col}`;
      if (visited.has(key)) throw new Error('Circular reference');
      visited.add(key);
      const val = lookup(addr.row, addr.col);
      visited.delete(key);
      return val;
    }

    case 'range':
      // Range alone evaluates to array — shouldn't appear alone
      throw new Error('Range must be used as function argument');

    case 'binary': {
      const left = evaluate(node.left, lookup, visited);
      const right = evaluate(node.right, lookup, visited);
      const lNum = Number(left ?? 0);
      const rNum = Number(right ?? 0);
      switch (node.op) {
        case '+': return lNum + rNum;
        case '-': return lNum - rNum;
        case '*': return lNum * rNum;
        case '/': return rNum === 0 ? null : lNum / rNum;
        case '>': return lNum > rNum;
        case '<': return lNum < rNum;
        case '>=': return lNum >= rNum;
        case '<=': return lNum <= rNum;
        case '=': return left === right;
        case '<>': return left !== right;
        default: return null;
      }
    }

    case 'call': {
      const name = node.name;

      // Collect values — expand ranges
      const collectValues = (): number[] => {
        const vals: number[] = [];
        for (const arg of node.args) {
          if (arg.kind === 'range') {
            const cells = expandRange(arg.start, arg.end);
            for (const c of cells) {
              const key = `${c.row},${c.col}`;
              if (visited.has(key)) throw new Error('Circular reference');
              visited.add(key);
              const v = lookup(c.row, c.col);
              visited.delete(key);
              if (typeof v === 'number') vals.push(v);
              else if (typeof v === 'string' && v !== '') {
                const n = Number(v);
                if (!isNaN(n)) vals.push(n);
              }
            }
          } else {
            const v = evaluate(arg, lookup, visited);
            if (typeof v === 'number') vals.push(v);
          }
        }
        return vals;
      };

      switch (name) {
        case 'SUM': {
          const vals = collectValues();
          return vals.reduce((a, b) => a + b, 0);
        }
        case 'AVG':
        case 'AVERAGE': {
          const vals = collectValues();
          return vals.length === 0 ? 0 : vals.reduce((a, b) => a + b, 0) / vals.length;
        }
        case 'COUNT': {
          const vals = collectValues();
          return vals.length;
        }
        case 'MIN': {
          const vals = collectValues();
          return vals.length === 0 ? 0 : Math.min(...vals);
        }
        case 'MAX': {
          const vals = collectValues();
          return vals.length === 0 ? 0 : Math.max(...vals);
        }
        case 'IF': {
          if (node.args.length < 3) throw new Error('IF requires 3 arguments');
          const cond = evaluate(node.args[0] as ASTNode, lookup, visited);
          if (cond) return evaluate(node.args[1] as ASTNode, lookup, visited);
          return evaluate(node.args[2] as ASTNode, lookup, visited);
        }
        case 'CONCAT': {
          return node.args.map((arg) => String(evaluate(arg, lookup, visited) ?? '')).join('');
        }
        default:
          throw new Error(`Unknown function: ${name}`);
      }
    }
  }
}

// ── Public API ────────────────────────────────────────

/**
 * Formul hesaplar / Evaluate a formula string.
 * @param formula - Formul (= olmadan) / Formula (without leading =)
 * @param lookup - Hucre deger okuyucu / Cell value reader
 * @returns Hesaplanan deger / Computed value
 */
export function evaluateFormula(formula: string, lookup: CellLookup): CellValue {
  try {
    const tokens = tokenize(formula);
    if (tokens.length === 0) return null;
    const ast = parse(tokens);
    return evaluate(ast, lookup, new Set());
  } catch {
    return '#ERROR';
  }
}
