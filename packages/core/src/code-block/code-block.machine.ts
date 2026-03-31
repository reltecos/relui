/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CodeBlock tokenizer — regex tabanli syntax highlighter.
 * CodeBlock tokenizer — regex-based syntax highlighter.
 *
 * @packageDocumentation
 */

import type { CodeLanguage, CodeToken, CodeLine, HighlightResult } from './code-block.types';

// ── Keyword sets ────────────────────────────────────

const JS_KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'new', 'delete', 'typeof', 'instanceof',
  'in', 'of', 'try', 'catch', 'finally', 'throw', 'class', 'extends', 'super',
  'this', 'import', 'export', 'from', 'default', 'async', 'await', 'yield',
  'true', 'false', 'null', 'undefined', 'void', 'static', 'get', 'set',
]);

const TS_KEYWORDS = new Set([
  ...JS_KEYWORDS,
  'type', 'interface', 'enum', 'namespace', 'declare', 'abstract', 'implements',
  'readonly', 'as', 'is', 'keyof', 'infer', 'never', 'unknown', 'any',
  'string', 'number', 'boolean', 'symbol', 'object', 'bigint',
]);

const CSS_KEYWORDS = new Set([
  'display', 'position', 'margin', 'padding', 'border', 'background', 'color',
  'font', 'width', 'height', 'top', 'left', 'right', 'bottom', 'flex',
  'grid', 'align', 'justify', 'overflow', 'opacity', 'transform', 'transition',
  'animation', 'z-index', 'none', 'auto', 'inherit', 'initial', 'important',
]);

const HTML_KEYWORDS = new Set([
  'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'h1', 'h2', 'h3',
  'h4', 'h5', 'h6', 'table', 'tr', 'td', 'th', 'form', 'input', 'button',
  'select', 'option', 'textarea', 'label', 'section', 'header', 'footer',
  'nav', 'main', 'article', 'aside', 'script', 'style', 'link', 'meta',
]);

// ── Token patterns ──────────────────────────────────

interface TokenPattern {
  type: CodeToken['type'];
  regex: RegExp;
}

function buildPatterns(language: CodeLanguage): TokenPattern[] {
  switch (language) {
    case 'javascript':
    case 'typescript':
      return [
        { type: 'comment', regex: /^\/\/[^\n]*/ },
        { type: 'comment', regex: /^\/\*[\s\S]*?\*\// },
        { type: 'string', regex: /^`(?:[^`\\]|\\.)*`/ },
        { type: 'string', regex: /^"(?:[^"\\]|\\.)*"/ },
        { type: 'string', regex: /^'(?:[^'\\]|\\.)*'/ },
        { type: 'number', regex: /^(?:0x[\da-fA-F]+|0b[01]+|0o[0-7]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)/ },
        { type: 'punctuation', regex: /^[{}()\[\];,.]/ },
        { type: 'operator', regex: /^(?:=>|===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%=<>!&|^~?:])/ },
        { type: 'keyword', regex: /^[a-zA-Z_$][\w$]*/ },
      ];
    case 'css':
      return [
        { type: 'comment', regex: /^\/\*[\s\S]*?\*\// },
        { type: 'string', regex: /^"(?:[^"\\]|\\.)*"/ },
        { type: 'string', regex: /^'(?:[^'\\]|\\.)*'/ },
        { type: 'number', regex: /^-?\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|deg|s|ms)?/ },
        { type: 'punctuation', regex: /^[{}();:,.]/ },
        { type: 'property', regex: /^[a-zA-Z-][\w-]*(?=\s*:)/ },
        { type: 'keyword', regex: /^[a-zA-Z_-][\w-]*/ },
      ];
    case 'html':
      return [
        { type: 'comment', regex: /^<!--[\s\S]*?-->/ },
        { type: 'string', regex: /^"(?:[^"\\]|\\.)*"/ },
        { type: 'string', regex: /^'(?:[^'\\]|\\.)*'/ },
        { type: 'tag', regex: /^<\/?[a-zA-Z][\w-]*/ },
        { type: 'punctuation', regex: /^[<>\/=]/ },
        { type: 'attribute', regex: /^[a-zA-Z-][\w-]*(?==)/ },
        { type: 'keyword', regex: /^[a-zA-Z_][\w]*/ },
      ];
    case 'json':
      return [
        { type: 'string', regex: /^"(?:[^"\\]|\\.)*"/ },
        { type: 'number', regex: /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/ },
        { type: 'keyword', regex: /^(?:true|false|null)/ },
        { type: 'punctuation', regex: /^[{}()\[\]:,]/ },
      ];
    case 'text':
    default:
      return [];
  }
}

const JSON_KEYWORDS = new Set(['true', 'false', 'null']);

function getKeywords(language: CodeLanguage): Set<string> {
  switch (language) {
    case 'javascript': return JS_KEYWORDS;
    case 'typescript': return TS_KEYWORDS;
    case 'css': return CSS_KEYWORDS;
    case 'html': return HTML_KEYWORDS;
    case 'json': return JSON_KEYWORDS;
    default: return new Set();
  }
}

// ── Tokenize single line ────────────────────────────

function tokenizeLine(line: string, patterns: TokenPattern[], keywords: Set<string>): CodeToken[] {
  if (patterns.length === 0) {
    return line.length > 0 ? [{ type: 'text', value: line }] : [];
  }

  const tokens: CodeToken[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    // Skip whitespace
    const wsMatch = remaining.match(/^\s+/);
    if (wsMatch) {
      tokens.push({ type: 'text', value: wsMatch[0] });
      remaining = remaining.slice(wsMatch[0].length);
      continue;
    }

    let matched = false;
    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match) {
        const value = match[0];
        let tokenType = pattern.type;

        // Check if identifier is a keyword
        if (tokenType === 'keyword') {
          tokenType = keywords.has(value) ? 'keyword' : 'text';
        }

        tokens.push({ type: tokenType, value });
        remaining = remaining.slice(value.length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ type: 'text', value: remaining[0] ?? '' });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}

// ── Public API ──────────────────────────────────────

/**
 * Kodu tokenize eder / Tokenizes code into highlighted lines.
 */
export function highlightCode(code: string, language: CodeLanguage): HighlightResult {
  const patterns = buildPatterns(language);
  const keywords = getKeywords(language);
  const rawLines = code.split('\n');

  const lines: CodeLine[] = rawLines.map((line, index) => ({
    lineNumber: index + 1,
    tokens: tokenizeLine(line, patterns, keywords),
  }));

  return { lines, language };
}
