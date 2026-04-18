/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CodeEditor — kod duzenleyici bilesen (Dual API).
 * CodeEditor — code editor component (Dual API).
 *
 * Props-based: `<CodeEditor value="const x = 1;" language="typescript" />`
 * Compound:
 * ```tsx
 * <CodeEditor value={code}>
 *   <CodeEditor.Toolbar />
 *   <CodeEditor.Gutter />
 *   <CodeEditor.Content />
 * </CodeEditor>
 * ```
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { CodeLanguage, CodeLine, CodeToken } from '@relteco/relui-core';
import type { CursorPosition, Selection, FindMatch } from '@relteco/relui-core';
import {
  rootStyle,
  toolbarStyle,
  toolbarButtonStyle,
  editorContainerStyle,
  gutterStyle,
  lineNumberStyle,
  contentStyle,
  lineStyle,
  activeLineStyle,
  tokenKeywordStyle,
  tokenStringStyle,
  tokenCommentStyle,
  tokenNumberStyle,
  tokenOperatorStyle,
  tokenPunctuationStyle,
  findPanelStyle,
  findInputStyle,
} from './code-editor.css';
import { useCodeEditor, type UseCodeEditorProps } from './useCodeEditor';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type CodeEditorSlot =
  | 'root'
  | 'toolbar'
  | 'gutter'
  | 'content'
  | 'line'
  | 'lineNumber'
  | 'activeLine'
  | 'findPanel';

// ── Context ─────────────────────────────────────────

interface CodeEditorContextValue {
  lines: readonly string[];
  code: string;
  language: CodeLanguage;
  cursor: CursorPosition;
  selection: Selection | null;
  foldedLines: ReadonlySet<number>;
  highlightedLines: readonly CodeLine[];
  findQuery: string;
  findMatches: readonly FindMatch[];
  canUndo: boolean;
  canRedo: boolean;
  tabSize: number;
  setCode: (code: string) => void;
  setLanguage: (lang: CodeLanguage) => void;
  setCursor: (pos: CursorPosition) => void;
  insertText: (text: string) => void;
  deleteBackward: () => void;
  undo: () => void;
  redo: () => void;
  indent: () => void;
  outdent: () => void;
  toggleFold: (line: number) => void;
  find: (query: string) => void;
  clearFind: () => void;
  selectAll: () => void;
  classNames: ClassNames<CodeEditorSlot> | undefined;
  styles: Styles<CodeEditorSlot> | undefined;
}

const CodeEditorContext = createContext<CodeEditorContextValue | null>(null);

function useCodeEditorContext(): CodeEditorContextValue {
  const ctx = useContext(CodeEditorContext);
  if (!ctx) throw new Error('CodeEditor compound sub-components must be used within <CodeEditor>.');
  return ctx;
}

// ── Token Renderer ──────────────────────────────────

function getTokenClass(type: CodeToken['type']): string {
  switch (type) {
    case 'keyword': return tokenKeywordStyle;
    case 'string': return tokenStringStyle;
    case 'comment': return tokenCommentStyle;
    case 'number': return tokenNumberStyle;
    case 'operator': return tokenOperatorStyle;
    case 'punctuation': return tokenPunctuationStyle;
    default: return '';
  }
}

function renderTokens(tokens: readonly CodeToken[]): ReactNode {
  return tokens.map((token, i) => {
    const cls = getTokenClass(token.type);
    return cls ? (
      <span key={i} className={cls}>{token.value}</span>
    ) : (
      <span key={i}>{token.value}</span>
    );
  });
}

// ── Compound: CodeEditor.Toolbar ────────────────────

export interface CodeEditorToolbarProps {
  className?: string;
}

const CodeEditorToolbar = forwardRef<HTMLDivElement, CodeEditorToolbarProps>(
  function CodeEditorToolbar(props, ref) {
    const { className } = props;
    const ctx = useCodeEditorContext();
    const slot = getSlotProps('toolbar', toolbarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="code-editor-toolbar" role="toolbar">
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.undo()} disabled={!ctx.canUndo} aria-label="Undo" data-testid="code-editor-btn-undo">Undo</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.redo()} disabled={!ctx.canRedo} aria-label="Redo" data-testid="code-editor-btn-redo">Redo</button>
      </div>
    );
  },
);

// ── Compound: CodeEditor.Gutter ─────────────────────

export interface CodeEditorGutterProps {
  className?: string;
}

const CodeEditorGutter = forwardRef<HTMLDivElement, CodeEditorGutterProps>(
  function CodeEditorGutter(props, ref) {
    const { className } = props;
    const ctx = useCodeEditorContext();
    const slot = getSlotProps('gutter', gutterStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="code-editor-gutter" aria-hidden="true">
        {ctx.lines.map((_, i) => (
          !ctx.foldedLines.has(i) && (
            <div key={i} className={lineNumberStyle} data-testid="code-editor-line-number">
              {i + 1}
            </div>
          )
        ))}
      </div>
    );
  },
);

// ── Compound: CodeEditor.Content ────────────────────

export interface CodeEditorContentProps {
  className?: string;
}

const CodeEditorContent = forwardRef<HTMLDivElement, CodeEditorContentProps>(
  function CodeEditorContent(props, ref) {
    const { className } = props;
    const ctx = useCodeEditorContext();
    const slot = getSlotProps('content', contentStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="code-editor-content" role="textbox" aria-multiline aria-label="Code content">
        {ctx.highlightedLines.map((hl, i) => {
          if (ctx.foldedLines.has(i)) return null;
          const isActive = ctx.cursor.line === i;
          const lineCls = isActive ? `${lineStyle} ${activeLineStyle}` : lineStyle;
          return (
            <div
              key={i}
              className={lineCls}
              data-testid="code-editor-line"
              data-line={i}
              data-active={isActive || undefined}
            >
              {renderTokens(hl.tokens)}
            </div>
          );
        })}
      </div>
    );
  },
);

// ── Compound: CodeEditor.FindPanel ──────────────────

export interface CodeEditorFindPanelProps {
  className?: string;
}

const CodeEditorFindPanel = forwardRef<HTMLDivElement, CodeEditorFindPanelProps>(
  function CodeEditorFindPanel(props, ref) {
    const { className } = props;
    const ctx = useCodeEditorContext();
    const slot = getSlotProps('findPanel', findPanelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="code-editor-find-panel">
        <input
          type="text"
          className={findInputStyle}
          placeholder="Find..."
          value={ctx.findQuery}
          onChange={(e) => ctx.find(e.target.value)}
          aria-label="Find"
          data-testid="code-editor-find-input"
        />
        <span data-testid="code-editor-find-count">
          {ctx.findMatches.length} matches
        </span>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.clearFind()} aria-label="Close find" data-testid="code-editor-find-close">
          Close
        </button>
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface CodeEditorComponentProps extends SlotStyleProps<CodeEditorSlot> {
  /** Kod / Code */
  value?: string;
  /** Varsayilan kod / Default code */
  defaultCode?: string;
  /** Dil / Language */
  language?: CodeLanguage;
  /** Tab boyutu / Tab size */
  tabSize?: number;
  /** Degisince callback / On change */
  onChange?: (code: string) => void;
  /** Find panel goster / Show find panel */
  showFind?: boolean;
  /** Compound children / Compound children */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const CodeEditorBase = forwardRef<HTMLDivElement, CodeEditorComponentProps>(
  function CodeEditor(props, ref) {
    const {
      value,
      defaultCode,
      language,
      tabSize,
      onChange,
      showFind = false,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseCodeEditorProps = { value, defaultCode, language, tabSize, onChange };
    const editor = useCodeEditor(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: CodeEditorContextValue = {
      lines: editor.lines,
      code: editor.code,
      language: editor.language,
      cursor: editor.cursor,
      selection: editor.selection,
      foldedLines: editor.foldedLines,
      highlightedLines: editor.highlightedLines,
      findQuery: editor.findQuery,
      findMatches: editor.findMatches,
      canUndo: editor.canUndo,
      canRedo: editor.canRedo,
      tabSize: editor.tabSize,
      setCode: editor.setCode,
      setLanguage: editor.setLanguage,
      setCursor: editor.setCursor,
      insertText: editor.insertText,
      deleteBackward: editor.deleteBackward,
      undo: editor.undo,
      redo: editor.redo,
      indent: editor.indent,
      outdent: editor.outdent,
      toggleFold: editor.toggleFold,
      find: editor.find,
      clearFind: editor.clearFind,
      selectAll: editor.selectAll,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <CodeEditorContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="code-editor-root"
            data-language={editor.language}
            role="application"
            aria-label="Code editor"
          >
            {children}
          </div>
        </CodeEditorContext.Provider>
      );
    }

    // ── Props-based API ──
    const toolbarSlotCss = getSlotProps('toolbar', toolbarStyle, classNames, styles);
    const gutterSlotCss = getSlotProps('gutter', gutterStyle, classNames, styles);
    const contentSlotCss = getSlotProps('content', contentStyle, classNames, styles);
    const findSlotCss = getSlotProps('findPanel', findPanelStyle, classNames, styles);

    return (
      <CodeEditorContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="code-editor-root"
          data-language={editor.language}
          role="application"
          aria-label="Code editor"
        >
          {/* Toolbar */}
          <div className={toolbarSlotCss.className} style={toolbarSlotCss.style} data-testid="code-editor-toolbar" role="toolbar">
            <button type="button" className={toolbarButtonStyle} onClick={() => editor.undo()} disabled={!editor.canUndo} aria-label="Undo" data-testid="code-editor-btn-undo">Undo</button>
            <button type="button" className={toolbarButtonStyle} onClick={() => editor.redo()} disabled={!editor.canRedo} aria-label="Redo" data-testid="code-editor-btn-redo">Redo</button>
          </div>

          {/* Find Panel */}
          {showFind && (
            <div className={findSlotCss.className} style={findSlotCss.style} data-testid="code-editor-find-panel">
              <input
                type="text"
                className={findInputStyle}
                placeholder="Find..."
                value={editor.findQuery}
                onChange={(e) => editor.find(e.target.value)}
                aria-label="Find"
                data-testid="code-editor-find-input"
              />
              <span data-testid="code-editor-find-count">{editor.findMatches.length} matches</span>
              <button type="button" className={toolbarButtonStyle} onClick={() => editor.clearFind()} aria-label="Close find" data-testid="code-editor-find-close">Close</button>
            </div>
          )}

          {/* Editor container */}
          <div className={editorContainerStyle}>
            {/* Gutter */}
            <div className={gutterSlotCss.className} style={gutterSlotCss.style} data-testid="code-editor-gutter" aria-hidden="true">
              {editor.lines.map((_, i) => (
                !editor.foldedLines.has(i) && (
                  <div key={i} className={lineNumberStyle} data-testid="code-editor-line-number">{i + 1}</div>
                )
              ))}
            </div>

            {/* Content */}
            <div className={contentSlotCss.className} style={contentSlotCss.style} data-testid="code-editor-content" role="textbox" aria-multiline aria-label="Code content">
              {editor.highlightedLines.map((hl, i) => {
                if (editor.foldedLines.has(i)) return null;
                const isActive = editor.cursor.line === i;
                const lineCls = isActive ? `${lineStyle} ${activeLineStyle}` : lineStyle;
                return (
                  <div key={i} className={lineCls} data-testid="code-editor-line" data-line={i} data-active={isActive || undefined}>
                    {renderTokens(hl.tokens)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CodeEditorContext.Provider>
    );
  },
);

export const CodeEditor = Object.assign(CodeEditorBase, {
  Toolbar: CodeEditorToolbar,
  Gutter: CodeEditorGutter,
  Content: CodeEditorContent,
  FindPanel: CodeEditorFindPanel,
});
