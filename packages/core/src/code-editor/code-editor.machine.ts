/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CodeEditor state machine — satir tabanli editor model.
 * CodeEditor state machine — line-based editor model.
 *
 * @packageDocumentation
 */

import type { CodeLanguage, CodeLine } from '../code-block/code-block.types';
import { highlightCode } from '../code-block/code-block.machine';
import type {
  CursorPosition,
  Selection,
  FindMatch,
  CodeEditorConfig,
  CodeEditorContext,
  CodeEditorEvent,
  CodeEditorAPI,
} from './code-editor.types';

// ── Helpers ──────────────────────────────────────────

function clampCursor(lines: string[], pos: CursorPosition): CursorPosition {
  const line = Math.max(0, Math.min(pos.line, lines.length - 1));
  const lineLen = lines[line]?.length ?? 0;
  const col = Math.max(0, Math.min(pos.col, lineLen));
  return { line, col };
}

function linesToCode(lines: string[]): string {
  return lines.join('\n');
}

function codeToLines(code: string): string[] {
  return code.split('\n');
}

function doHighlight(code: string, language: CodeLanguage): CodeLine[] {
  return highlightCode(code, language).lines;
}

function findAllMatches(lines: string[], query: string): FindMatch[] {
  if (!query) return [];
  const matches: FindMatch[] = [];
  const lowerQuery = query.toLowerCase();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const lowerLine = line.toLowerCase();
    let idx = lowerLine.indexOf(lowerQuery);
    while (idx !== -1) {
      matches.push({ line: i, startCol: idx, endCol: idx + query.length });
      idx = lowerLine.indexOf(lowerQuery, idx + 1);
    }
  }
  return matches;
}

// ── State Machine ────────────────────────────────────

/**
 * CodeEditor state machine olusturur.
 * Creates a CodeEditor state machine.
 */
export function createCodeEditor(config: CodeEditorConfig = {}): CodeEditorAPI {
  const {
    defaultCode = '',
    language: initLang = 'typescript',
    tabSize = 2,
    onChange,
  } = config;

  // ── State ──
  let lines = codeToLines(defaultCode);
  let language: CodeLanguage = initLang;
  let cursor: CursorPosition = { line: 0, col: 0 };
  let selection: Selection | null = null;
  let highlightedLines = doHighlight(defaultCode, language);
  let findQuery = '';
  let findMatches: FindMatch[] = [];
  const foldedLines = new Set<number>();

  const undoStack: { lines: string[]; cursor: CursorPosition }[] = [];
  const redoStack: { lines: string[]; cursor: CursorPosition }[] = [];

  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function pushUndo(): void {
    undoStack.push({ lines: [...lines], cursor: { ...cursor } });
    redoStack.length = 0;
  }

  function syncHighlight(): void {
    const code = linesToCode(lines);
    highlightedLines = doHighlight(code, language);
    if (findQuery) {
      findMatches = findAllMatches(lines, findQuery);
    }
    onChange?.(code);
  }

  function deleteSelection(): void {
    if (!selection) return;
    const { start, end } = normalizeSelection(selection);
    const before = (lines[start.line] ?? '').slice(0, start.col);
    const after = (lines[end.line] ?? '').slice(end.col);
    const newLines = [
      ...lines.slice(0, start.line),
      before + after,
      ...lines.slice(end.line + 1),
    ];
    lines = newLines;
    cursor = { ...start };
    selection = null;
  }

  function normalizeSelection(sel: Selection): { start: CursorPosition; end: CursorPosition } {
    const { start, end } = sel;
    if (start.line < end.line || (start.line === end.line && start.col <= end.col)) {
      return { start, end };
    }
    return { start: end, end: start };
  }

  // ── Send ──
  function send(event: CodeEditorEvent): void {
    switch (event.type) {
      case 'SET_CODE': {
        pushUndo();
        lines = codeToLines(event.code);
        cursor = clampCursor(lines, cursor);
        selection = null;
        syncHighlight();
        notify();
        break;
      }
      case 'SET_LANGUAGE': {
        language = event.language;
        highlightedLines = doHighlight(linesToCode(lines), language);
        notify();
        break;
      }
      case 'SET_CURSOR': {
        cursor = clampCursor(lines, event.position);
        selection = null;
        notify();
        break;
      }
      case 'SET_SELECTION': {
        selection = event.selection;
        if (selection) {
          cursor = clampCursor(lines, selection.end);
        }
        notify();
        break;
      }
      case 'INSERT_TEXT': {
        pushUndo();
        if (selection) deleteSelection();

        const text = event.text;
        const currentLine = lines[cursor.line] ?? '';
        const before = currentLine.slice(0, cursor.col);
        const after = currentLine.slice(cursor.col);

        if (text === '\n') {
          // Auto-indent: orijinal satirin boslugunu al
          const indent = (lines[cursor.line] ?? '').match(/^\s*/)?.[0] ?? '';
          lines = [
            ...lines.slice(0, cursor.line),
            before,
            indent + after.trimStart(),
            ...lines.slice(cursor.line + 1),
          ];
          cursor = { line: cursor.line + 1, col: indent.length };
        } else {
          const insertLines = text.split('\n');
          if (insertLines.length === 1) {
            lines = [
              ...lines.slice(0, cursor.line),
              before + text + after,
              ...lines.slice(cursor.line + 1),
            ];
            cursor = { line: cursor.line, col: cursor.col + text.length };
          } else {
            const firstLine = before + (insertLines[0] ?? '');
            const lastLine = (insertLines[insertLines.length - 1] ?? '') + after;
            const middleLines = insertLines.slice(1, -1);
            lines = [
              ...lines.slice(0, cursor.line),
              firstLine,
              ...middleLines,
              lastLine,
              ...lines.slice(cursor.line + 1),
            ];
            cursor = {
              line: cursor.line + insertLines.length - 1,
              col: (insertLines[insertLines.length - 1] ?? '').length,
            };
          }
        }
        syncHighlight();
        notify();
        break;
      }
      case 'DELETE_BACKWARD': {
        pushUndo();
        if (selection) {
          deleteSelection();
          syncHighlight();
          notify();
          break;
        }
        if (cursor.col > 0) {
          const currentLine = lines[cursor.line] ?? '';
          lines = [
            ...lines.slice(0, cursor.line),
            currentLine.slice(0, cursor.col - 1) + currentLine.slice(cursor.col),
            ...lines.slice(cursor.line + 1),
          ];
          cursor = { line: cursor.line, col: cursor.col - 1 };
        } else if (cursor.line > 0) {
          const prevLine = lines[cursor.line - 1] ?? '';
          const currentLine = lines[cursor.line] ?? '';
          const newCol = prevLine.length;
          lines = [
            ...lines.slice(0, cursor.line - 1),
            prevLine + currentLine,
            ...lines.slice(cursor.line + 1),
          ];
          cursor = { line: cursor.line - 1, col: newCol };
        }
        syncHighlight();
        notify();
        break;
      }
      case 'DELETE_FORWARD': {
        pushUndo();
        if (selection) {
          deleteSelection();
          syncHighlight();
          notify();
          break;
        }
        const currentLine = lines[cursor.line] ?? '';
        if (cursor.col < currentLine.length) {
          lines = [
            ...lines.slice(0, cursor.line),
            currentLine.slice(0, cursor.col) + currentLine.slice(cursor.col + 1),
            ...lines.slice(cursor.line + 1),
          ];
        } else if (cursor.line < lines.length - 1) {
          const nextLine = lines[cursor.line + 1] ?? '';
          lines = [
            ...lines.slice(0, cursor.line),
            currentLine + nextLine,
            ...lines.slice(cursor.line + 2),
          ];
        }
        syncHighlight();
        notify();
        break;
      }
      case 'UNDO': {
        if (undoStack.length === 0) return;
        redoStack.push({ lines: [...lines], cursor: { ...cursor } });
        const prev = undoStack.pop();
        if (prev) {
          lines = prev.lines;
          cursor = prev.cursor;
          selection = null;
          syncHighlight();
        }
        notify();
        break;
      }
      case 'REDO': {
        if (redoStack.length === 0) return;
        undoStack.push({ lines: [...lines], cursor: { ...cursor } });
        const next = redoStack.pop();
        if (next) {
          lines = next.lines;
          cursor = next.cursor;
          selection = null;
          syncHighlight();
        }
        notify();
        break;
      }
      case 'INDENT': {
        pushUndo();
        const indent = ' '.repeat(tabSize);
        if (selection) {
          const { start, end } = normalizeSelection(selection);
          for (let i = start.line; i <= end.line; i++) {
            lines[i] = indent + (lines[i] ?? '');
          }
          selection = {
            start: { line: start.line, col: start.col + tabSize },
            end: { line: end.line, col: end.col + tabSize },
          };
        } else {
          const line = lines[cursor.line] ?? '';
          lines[cursor.line] = line.slice(0, cursor.col) + indent + line.slice(cursor.col);
          cursor = { line: cursor.line, col: cursor.col + tabSize };
        }
        syncHighlight();
        notify();
        break;
      }
      case 'OUTDENT': {
        pushUndo();
        if (selection) {
          const { start, end } = normalizeSelection(selection);
          for (let i = start.line; i <= end.line; i++) {
            const line = lines[i] ?? '';
            const stripped = line.replace(new RegExp(`^ {1,${tabSize}}`), '');
            lines[i] = stripped;
          }
        } else {
          const line = lines[cursor.line] ?? '';
          const stripped = line.replace(new RegExp(`^ {1,${tabSize}}`), '');
          const removed = line.length - stripped.length;
          lines[cursor.line] = stripped;
          cursor = { line: cursor.line, col: Math.max(0, cursor.col - removed) };
        }
        syncHighlight();
        notify();
        break;
      }
      case 'TOGGLE_FOLD': {
        if (foldedLines.has(event.line)) {
          foldedLines.delete(event.line);
        } else {
          foldedLines.add(event.line);
        }
        notify();
        break;
      }
      case 'FIND': {
        findQuery = event.query;
        findMatches = findAllMatches(lines, findQuery);
        notify();
        break;
      }
      case 'CLEAR_FIND': {
        findQuery = '';
        findMatches = [];
        notify();
        break;
      }
      case 'SELECT_ALL': {
        const lastLine = lines.length - 1;
        const lastCol = (lines[lastLine] ?? '').length;
        selection = {
          start: { line: 0, col: 0 },
          end: { line: lastLine, col: lastCol },
        };
        cursor = { line: lastLine, col: lastCol };
        notify();
        break;
      }
    }
  }

  return {
    getContext(): CodeEditorContext {
      return {
        lines,
        code: linesToCode(lines),
        language,
        cursor,
        selection,
        foldedLines,
        highlightedLines,
        findQuery,
        findMatches,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        tabSize,
      };
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => { listeners.delete(callback); };
    },
    destroy(): void {
      listeners.clear();
    },
  };
}
