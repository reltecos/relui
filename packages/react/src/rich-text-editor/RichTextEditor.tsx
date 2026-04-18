/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RichTextEditor — WYSIWYG duzenleyici bilesen (Dual API).
 * RichTextEditor — WYSIWYG editor component (Dual API).
 *
 * Props-based: `<RichTextEditor value="<p>Hello</p>" onChange={fn} />`
 * Compound:
 * ```tsx
 * <RichTextEditor value="<p>Hello</p>">
 *   <RichTextEditor.Toolbar />
 *   <RichTextEditor.Content />
 * </RichTextEditor>
 * ```
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useRef, useCallback, type ReactNode } from 'react';
import type { RichTextBlock, RichTextBlockType, InlineFormat, ActiveFormats } from '@relteco/relui-core';
import {
  rootStyle,
  toolbarStyle,
  toolbarButtonStyle,
  toolbarSeparatorStyle,
  contentStyle,
} from './rich-text-editor.css';
import { useRichTextEditor, type UseRichTextEditorProps } from './useRichTextEditor';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type RichTextEditorSlot = 'root' | 'toolbar' | 'content' | 'toolbarButton' | 'toolbarSeparator';

// ── Context ─────────────────────────────────────────

interface RichTextEditorContextValue {
  html: string;
  blocks: readonly RichTextBlock[];
  activeFormats: ActiveFormats;
  canUndo: boolean;
  canRedo: boolean;
  formatInline: (format: InlineFormat) => void;
  formatBlock: (blockType: RichTextBlockType) => void;
  setHtml: (html: string) => void;
  undo: () => void;
  redo: () => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
  classNames: ClassNames<RichTextEditorSlot> | undefined;
  styles: Styles<RichTextEditorSlot> | undefined;
}

const RichTextEditorContext = createContext<RichTextEditorContextValue | null>(null);

function useRichTextEditorContext(): RichTextEditorContextValue {
  const ctx = useContext(RichTextEditorContext);
  if (!ctx) throw new Error('RichTextEditor compound sub-components must be used within <RichTextEditor>.');
  return ctx;
}

// ── Helper: ToolbarFormatBtn ─────────��──────────────

function ToolbarFormatBtn(props: {
  format: InlineFormat;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={toolbarButtonStyle}
      data-active={props.active}
      onClick={props.onClick}
      aria-label={props.format}
      aria-pressed={props.active}
      data-testid={`rich-text-editor-btn-${props.format}`}
    >
      {props.label}
    </button>
  );
}

function ToolbarBlockBtn(props: {
  blockType: RichTextBlockType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={toolbarButtonStyle}
      onClick={props.onClick}
      aria-label={props.blockType}
      data-testid={`rich-text-editor-btn-${props.blockType}`}
    >
      {props.label}
    </button>
  );
}

// ── Compound: RichTextEditor.Toolbar ────────────────

export interface RichTextEditorToolbarProps {
  className?: string;
}

const RichTextEditorToolbar = forwardRef<HTMLDivElement, RichTextEditorToolbarProps>(
  function RichTextEditorToolbar(props, ref) {
    const { className } = props;
    const ctx = useRichTextEditorContext();
    const slot = getSlotProps('toolbar', toolbarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="rich-text-editor-toolbar" role="toolbar">
        <ToolbarFormatBtn format="bold" label="B" active={ctx.activeFormats.bold} onClick={() => ctx.formatInline('bold')} />
        <ToolbarFormatBtn format="italic" label="I" active={ctx.activeFormats.italic} onClick={() => ctx.formatInline('italic')} />
        <ToolbarFormatBtn format="underline" label="U" active={ctx.activeFormats.underline} onClick={() => ctx.formatInline('underline')} />
        <ToolbarFormatBtn format="strikethrough" label="S" active={ctx.activeFormats.strikethrough} onClick={() => ctx.formatInline('strikethrough')} />
        <ToolbarFormatBtn format="code" label="<>" active={ctx.activeFormats.code} onClick={() => ctx.formatInline('code')} />
        <span className={toolbarSeparatorStyle} data-testid="rich-text-editor-toolbar-separator" />
        <ToolbarBlockBtn blockType="heading1" label="H1" onClick={() => ctx.formatBlock('heading1')} />
        <ToolbarBlockBtn blockType="heading2" label="H2" onClick={() => ctx.formatBlock('heading2')} />
        <ToolbarBlockBtn blockType="heading3" label="H3" onClick={() => ctx.formatBlock('heading3')} />
        <span className={toolbarSeparatorStyle} />
        <ToolbarBlockBtn blockType="unorderedList" label="UL" onClick={() => ctx.formatBlock('unorderedList')} />
        <ToolbarBlockBtn blockType="orderedList" label="OL" onClick={() => ctx.formatBlock('orderedList')} />
        <ToolbarBlockBtn blockType="blockquote" label="&gt;" onClick={() => ctx.formatBlock('blockquote')} />
        <ToolbarBlockBtn blockType="code" label="Code" onClick={() => ctx.formatBlock('code')} />
        <span className={toolbarSeparatorStyle} />
        <button
          type="button"
          className={toolbarButtonStyle}
          disabled={!ctx.canUndo}
          onClick={() => ctx.undo()}
          aria-label="Undo"
          data-testid="rich-text-editor-btn-undo"
        >
          &#8617;
        </button>
        <button
          type="button"
          className={toolbarButtonStyle}
          disabled={!ctx.canRedo}
          onClick={() => ctx.redo()}
          aria-label="Redo"
          data-testid="rich-text-editor-btn-redo"
        >
          &#8618;
        </button>
      </div>
    );
  },
);

// ── Compound: RichTextEditor.Content ────────────────

export interface RichTextEditorContentProps {
  className?: string;
}

const RichTextEditorContent = forwardRef<HTMLDivElement, RichTextEditorContentProps>(
  function RichTextEditorContent(props, ref) {
    const { className } = props;
    const ctx = useRichTextEditorContext();
    const slot = getSlotProps('content', contentStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      ctx.setHtml(target.innerHTML);
    }, [ctx]);

    return (
      <div
        ref={(el) => {
          (ctx.contentRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        className={cls}
        style={slot.style}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: ctx.html }}
        role="textbox"
        aria-multiline
        aria-label="Rich text content"
        data-testid="rich-text-editor-content"
      />
    );
  },
);

// ── Compound: RichTextEditor.ToolbarButton ──────────

export interface RichTextEditorToolbarButtonProps {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  className?: string;
}

const RichTextEditorToolbarButton = forwardRef<HTMLButtonElement, RichTextEditorToolbarButtonProps>(
  function RichTextEditorToolbarButton(props, ref) {
    const { children, onClick, active = false, className } = props;
    const ctx = useRichTextEditorContext();
    const slot = getSlotProps('toolbarButton', toolbarButtonStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={slot.style}
        data-active={active}
        onClick={onClick}
        data-testid="rich-text-editor-toolbar-button"
      >
        {children}
      </button>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface RichTextEditorComponentProps extends SlotStyleProps<RichTextEditorSlot> {
  /** HTML icerigi / HTML content */
  value?: string;
  /** Varsayilan HTML / Default HTML */
  defaultHtml?: string;
  /** Varsayilan bloklar / Default blocks */
  defaultBlocks?: RichTextBlock[];
  /** Degisince callback / On change */
  onChange?: (blocks: readonly RichTextBlock[], html: string) => void;
  /** Compound children / Compound children */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ─��� Component ─────────────────────────────────────────

const RichTextEditorBase = forwardRef<HTMLDivElement, RichTextEditorComponentProps>(
  function RichTextEditor(props, ref) {
    const {
      value,
      defaultHtml,
      defaultBlocks,
      onChange,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseRichTextEditorProps = {
      value,
      defaultHtml,
      defaultBlocks,
      onChange,
    };
    const editor = useRichTextEditor(hookProps);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: RichTextEditorContextValue = {
      html: editor.html,
      blocks: editor.blocks,
      activeFormats: editor.activeFormats,
      canUndo: editor.canUndo,
      canRedo: editor.canRedo,
      formatInline: editor.formatInline,
      formatBlock: editor.formatBlock,
      setHtml: editor.setHtml,
      undo: editor.undo,
      redo: editor.redo,
      contentRef,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <RichTextEditorContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="rich-text-editor-root"
            role="application"
            aria-label="Rich text editor"
          >
            {children}
          </div>
        </RichTextEditorContext.Provider>
      );
    }

    // ── Props-based API ──
    const toolbarSlot = getSlotProps('toolbar', toolbarStyle, classNames, styles);
    const contentSlot = getSlotProps('content', contentStyle, classNames, styles);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      editor.setHtml(e.currentTarget.innerHTML);
    };

    return (
      <RichTextEditorContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="rich-text-editor-root"
          role="application"
          aria-label="Rich text editor"
        >
          <div className={toolbarSlot.className} style={toolbarSlot.style} data-testid="rich-text-editor-toolbar" role="toolbar">
            <ToolbarFormatBtn format="bold" label="B" active={editor.activeFormats.bold} onClick={() => editor.formatInline('bold')} />
            <ToolbarFormatBtn format="italic" label="I" active={editor.activeFormats.italic} onClick={() => editor.formatInline('italic')} />
            <ToolbarFormatBtn format="underline" label="U" active={editor.activeFormats.underline} onClick={() => editor.formatInline('underline')} />
            <ToolbarFormatBtn format="strikethrough" label="S" active={editor.activeFormats.strikethrough} onClick={() => editor.formatInline('strikethrough')} />
            <span className={toolbarSeparatorStyle} data-testid="rich-text-editor-toolbar-separator" />
            <ToolbarBlockBtn blockType="heading1" label="H1" onClick={() => editor.formatBlock('heading1')} />
            <ToolbarBlockBtn blockType="heading2" label="H2" onClick={() => editor.formatBlock('heading2')} />
            <span className={toolbarSeparatorStyle} />
            <ToolbarBlockBtn blockType="unorderedList" label="UL" onClick={() => editor.formatBlock('unorderedList')} />
            <ToolbarBlockBtn blockType="orderedList" label="OL" onClick={() => editor.formatBlock('orderedList')} />
            <span className={toolbarSeparatorStyle} />
            <button
              type="button"
              className={toolbarButtonStyle}
              disabled={!editor.canUndo}
              onClick={() => editor.undo()}
              aria-label="Undo"
              data-testid="rich-text-editor-btn-undo"
            >
              &#8617;
            </button>
            <button
              type="button"
              className={toolbarButtonStyle}
              disabled={!editor.canRedo}
              onClick={() => editor.redo()}
              aria-label="Redo"
              data-testid="rich-text-editor-btn-redo"
            >
              &#8618;
            </button>
          </div>

          <div
            ref={contentRef}
            className={contentSlot.className}
            style={contentSlot.style}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            dangerouslySetInnerHTML={{ __html: editor.html }}
            role="textbox"
            aria-multiline
            aria-label="Rich text content"
            data-testid="rich-text-editor-content"
          />
        </div>
      </RichTextEditorContext.Provider>
    );
  },
);

export const RichTextEditor = Object.assign(RichTextEditorBase, {
  Toolbar: RichTextEditorToolbar,
  Content: RichTextEditorContent,
  ToolbarButton: RichTextEditorToolbarButton,
});
