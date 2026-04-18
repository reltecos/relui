/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MarkdownEditor — Markdown duzenleyici bilesen (Dual API).
 * MarkdownEditor — Markdown editor component (Dual API).
 *
 * Props-based: `<MarkdownEditor value="# Hello" onChange={fn} />`
 * Compound:
 * ```tsx
 * <MarkdownEditor value="# Hello">
 *   <MarkdownEditor.Toolbar />
 *   <MarkdownEditor.Editor />
 *   <MarkdownEditor.Preview />
 * </MarkdownEditor>
 * ```
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useRef, type ReactNode } from 'react';
import type { MarkdownEditorMode, MarkdownFormat } from '@relteco/relui-core';
import {
  rootStyle,
  toolbarStyle,
  toolbarButtonStyle,
  toolbarSeparatorStyle,
  splitContainerStyle,
  editorStyle,
  previewStyle,
  modeButtonStyle,
} from './markdown-editor.css';
import { useMarkdownEditor, type UseMarkdownEditorProps } from './useMarkdownEditor';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type MarkdownEditorSlot = 'root' | 'toolbar' | 'editor' | 'preview' | 'splitContainer';

// ── Context ─────────────────────────────────────────

interface MarkdownEditorContextValue {
  markdown: string;
  html: string;
  mode: MarkdownEditorMode;
  setMarkdown: (md: string) => void;
  insertFormat: (format: MarkdownFormat, s: number, e: number) => void;
  setMode: (mode: MarkdownEditorMode) => void;
  editorRef: React.RefObject<HTMLTextAreaElement | null>;
  classNames: ClassNames<MarkdownEditorSlot> | undefined;
  styles: Styles<MarkdownEditorSlot> | undefined;
}

const MarkdownEditorContext = createContext<MarkdownEditorContextValue | null>(null);

function useMarkdownEditorContext(): MarkdownEditorContextValue {
  const ctx = useContext(MarkdownEditorContext);
  if (!ctx) throw new Error('MarkdownEditor compound sub-components must be used within <MarkdownEditor>.');
  return ctx;
}

// ── Helper: toolbar format button ───────────────────

function FormatButton(props: { format: MarkdownFormat; label: string; ctx: MarkdownEditorContextValue }) {
  const { format, label, ctx } = props;
  return (
    <button
      type="button"
      className={toolbarButtonStyle}
      onClick={() => {
        const el = ctx.editorRef.current;
        const start = el?.selectionStart ?? 0;
        const end = el?.selectionEnd ?? 0;
        ctx.insertFormat(format, start, end);
      }}
      aria-label={format}
      data-testid={`markdown-editor-btn-${format}`}
    >
      {label}
    </button>
  );
}

// ── Compound: MarkdownEditor.Toolbar ────────────────

export interface MarkdownEditorToolbarProps {
  className?: string;
}

const MarkdownEditorToolbar = forwardRef<HTMLDivElement, MarkdownEditorToolbarProps>(
  function MarkdownEditorToolbar(props, ref) {
    const { className } = props;
    const ctx = useMarkdownEditorContext();
    const slot = getSlotProps('toolbar', toolbarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="markdown-editor-toolbar" role="toolbar">
        <FormatButton format="bold" label="B" ctx={ctx} />
        <FormatButton format="italic" label="I" ctx={ctx} />
        <FormatButton format="strikethrough" label="S" ctx={ctx} />
        <FormatButton format="code" label="<>" ctx={ctx} />
        <span className={toolbarSeparatorStyle} />
        <FormatButton format="heading1" label="H1" ctx={ctx} />
        <FormatButton format="heading2" label="H2" ctx={ctx} />
        <FormatButton format="heading3" label="H3" ctx={ctx} />
        <span className={toolbarSeparatorStyle} />
        <FormatButton format="unorderedList" label="UL" ctx={ctx} />
        <FormatButton format="orderedList" label="OL" ctx={ctx} />
        <FormatButton format="blockquote" label="&gt;" ctx={ctx} />
        <span className={toolbarSeparatorStyle} />
        <FormatButton format="link" label="Link" ctx={ctx} />
        <FormatButton format="image" label="Img" ctx={ctx} />
        <FormatButton format="codeBlock" label="```" ctx={ctx} />
        <FormatButton format="hr" label="HR" ctx={ctx} />

        <button
          type="button"
          className={modeButtonStyle}
          data-active={ctx.mode === 'edit'}
          onClick={() => ctx.setMode('edit')}
          data-testid="markdown-editor-mode-edit"
        >
          Edit
        </button>
        <button
          type="button"
          className={modeButtonStyle}
          data-active={ctx.mode === 'split'}
          onClick={() => ctx.setMode('split')}
          data-testid="markdown-editor-mode-split"
        >
          Split
        </button>
        <button
          type="button"
          className={modeButtonStyle}
          data-active={ctx.mode === 'preview'}
          onClick={() => ctx.setMode('preview')}
          data-testid="markdown-editor-mode-preview"
        >
          Preview
        </button>
      </div>
    );
  },
);

// ── Compound: MarkdownEditor.Editor ─────────────────

export interface MarkdownEditorEditorProps {
  className?: string;
}

const MarkdownEditorEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorEditorProps>(
  function MarkdownEditorEditor(props, ref) {
    const { className } = props;
    const ctx = useMarkdownEditorContext();
    const slot = getSlotProps('editor', editorStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <textarea
        ref={(el) => {
          (ctx.editorRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
        }}
        className={cls}
        style={slot.style}
        value={ctx.markdown}
        onChange={(e) => ctx.setMarkdown(e.target.value)}
        spellCheck={false}
        aria-label="Markdown editor"
        data-testid="markdown-editor-textarea"
      />
    );
  },
);

// ── Compound: MarkdownEditor.Preview ────────────────

export interface MarkdownEditorPreviewProps {
  className?: string;
}

const MarkdownEditorPreview = forwardRef<HTMLDivElement, MarkdownEditorPreviewProps>(
  function MarkdownEditorPreview(props, ref) {
    const { className } = props;
    const ctx = useMarkdownEditorContext();
    const slot = getSlotProps('preview', previewStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        dangerouslySetInnerHTML={{ __html: ctx.html }}
        aria-label="Preview"
        data-testid="markdown-editor-preview"
      />
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface MarkdownEditorComponentProps extends SlotStyleProps<MarkdownEditorSlot> {
  /** Markdown metni / Markdown text */
  value?: string;
  /** Varsayilan markdown / Default markdown */
  defaultMarkdown?: string;
  /** Degisince callback / On change */
  onChange?: (markdown: string, html: string) => void;
  /** Mod / Mode */
  mode?: MarkdownEditorMode;
  /** Varsayilan mod / Default mode */
  defaultMode?: MarkdownEditorMode;
  /** Compound API children / Compound children */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const MarkdownEditorBase = forwardRef<HTMLDivElement, MarkdownEditorComponentProps>(
  function MarkdownEditor(props, ref) {
    const {
      value,
      defaultMarkdown,
      onChange,
      mode: modeProp,
      defaultMode,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseMarkdownEditorProps = {
      value,
      defaultMarkdown,
      mode: modeProp,
      defaultMode,
      onChange,
    };
    const editor = useMarkdownEditor(hookProps);
    const editorRef = useRef<HTMLTextAreaElement | null>(null);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: MarkdownEditorContextValue = {
      markdown: editor.markdown,
      html: editor.html,
      mode: editor.mode,
      setMarkdown: editor.setMarkdown,
      insertFormat: editor.insertFormat,
      setMode: editor.setMode,
      editorRef,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <MarkdownEditorContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="markdown-editor-root"
            data-mode={editor.mode}
            role="application"
            aria-label="Markdown editor"
          >
            {children}
          </div>
        </MarkdownEditorContext.Provider>
      );
    }

    // ── Props-based API ──
    const toolbarSlot = getSlotProps('toolbar', toolbarStyle, classNames, styles);
    const editorSlotCss = getSlotProps('editor', editorStyle, classNames, styles);
    const previewSlot = getSlotProps('preview', previewStyle, classNames, styles);
    const splitSlot = getSlotProps('splitContainer', splitContainerStyle, classNames, styles);

    const showEditor = editor.mode === 'edit' || editor.mode === 'split';
    const showPreview = editor.mode === 'preview' || editor.mode === 'split';

    return (
      <MarkdownEditorContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="markdown-editor-root"
          data-mode={editor.mode}
          role="application"
          aria-label="Markdown editor"
        >
          {/* Toolbar */}
          <div className={toolbarSlot.className} style={toolbarSlot.style} data-testid="markdown-editor-toolbar" role="toolbar">
            <FormatButton format="bold" label="B" ctx={ctxValue} />
            <FormatButton format="italic" label="I" ctx={ctxValue} />
            <FormatButton format="code" label="<>" ctx={ctxValue} />
            <span className={toolbarSeparatorStyle} />
            <FormatButton format="heading1" label="H1" ctx={ctxValue} />
            <FormatButton format="heading2" label="H2" ctx={ctxValue} />
            <FormatButton format="link" label="Link" ctx={ctxValue} />

            <button
              type="button"
              className={modeButtonStyle}
              data-active={editor.mode === 'edit'}
              onClick={() => editor.setMode('edit')}
              data-testid="markdown-editor-mode-edit"
            >
              Edit
            </button>
            <button
              type="button"
              className={modeButtonStyle}
              data-active={editor.mode === 'split'}
              onClick={() => editor.setMode('split')}
              data-testid="markdown-editor-mode-split"
            >
              Split
            </button>
            <button
              type="button"
              className={modeButtonStyle}
              data-active={editor.mode === 'preview'}
              onClick={() => editor.setMode('preview')}
              data-testid="markdown-editor-mode-preview"
            >
              Preview
            </button>
          </div>

          {/* Content */}
          <div className={splitSlot.className} style={splitSlot.style} data-testid="markdown-editor-split">
            {showEditor && (
              <textarea
                ref={editorRef}
                className={editorSlotCss.className}
                style={editorSlotCss.style}
                value={editor.markdown}
                onChange={(e) => editor.setMarkdown(e.target.value)}
                spellCheck={false}
                aria-label="Markdown editor"
                data-testid="markdown-editor-textarea"
              />
            )}
            {showPreview && (
              <div
                className={previewSlot.className}
                style={previewSlot.style}
                dangerouslySetInnerHTML={{ __html: editor.html }}
                aria-label="Preview"
                data-testid="markdown-editor-preview"
              />
            )}
          </div>
        </div>
      </MarkdownEditorContext.Provider>
    );
  },
);

export const MarkdownEditor = Object.assign(MarkdownEditorBase, {
  Toolbar: MarkdownEditorToolbar,
  Editor: MarkdownEditorEditor,
  Preview: MarkdownEditorPreview,
});
