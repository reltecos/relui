/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CodeBlock — kod gosterimi bilesen (Dual API).
 * CodeBlock — code display component (Dual API).
 *
 * Props-based: `<CodeBlock code="const x = 1;" language="javascript" />`
 * Compound:    `<CodeBlock code="..." language="javascript"><CodeBlock.Header /><CodeBlock.CopyButton /></CodeBlock>`
 *
 * @packageDocumentation
 */

import { forwardRef, useMemo, useCallback, useState, type ReactNode } from 'react';
import { highlightCode, type CodeLanguage } from '@relteco/relui-core';
import { CopyIcon, CheckIcon } from '@relteco/relui-icons';
import {
  rootStyle, themeStyles, headerStyle, bodyStyle, lineStyle,
  lineNumberStyle, contentStyle, copyButtonStyle, languageStyle, tokenStyles,
} from './code-block.css';
import { CodeBlockCtx, useCodeBlockContext } from './code-block-context';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** CodeBlock slot isimleri / CodeBlock slot names. */
export type CodeBlockSlot = 'root' | 'header' | 'body' | 'line' | 'lineNumber' | 'content' | 'copyButton' | 'language';

// ── Sub: CodeBlock.Header ───────────────────────────

/** CodeBlock.Header props */
export interface CodeBlockHeaderProps { children?: ReactNode; className?: string; }

export const CodeBlockHeader = forwardRef<HTMLDivElement, CodeBlockHeaderProps>(
  function CodeBlockHeader(props, ref) {
    const { children, className } = props;
    const ctx = useCodeBlockContext();
    const slot = getSlotProps('header', headerStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="code-block-header">
        {children ?? (
          <>
            <span className={getSlotProps('language', languageStyle, ctx.classNames, ctx.styles).className} data-testid="code-block-language">{ctx.language}</span>
          </>
        )}
      </div>
    );
  },
);

// ── Sub: CodeBlock.CopyButton ───────────────────────

/** CodeBlock.CopyButton props */
export interface CodeBlockCopyButtonProps { className?: string; }

export const CodeBlockCopyButton = forwardRef<HTMLButtonElement, CodeBlockCopyButtonProps>(
  function CodeBlockCopyButton(props, ref) {
    const { className } = props;
    const ctx = useCodeBlockContext();
    const [copied, setCopied] = useState(false);
    const slot = getSlotProps('copyButton', copyButtonStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const handleCopy = useCallback(() => {
      navigator.clipboard.writeText(ctx.code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }, [ctx.code]);

    return (
      <button ref={ref} className={cls} style={slot.style} onClick={handleCopy} type="button" data-testid="code-block-copy-btn" aria-label="Copy code">
        {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      </button>
    );
  },
);

// ── Sub: CodeBlock.Line ─────────────────────────────

/** CodeBlock.Line props */
export interface CodeBlockLineProps { children?: ReactNode; className?: string; }

export const CodeBlockLine = forwardRef<HTMLDivElement, CodeBlockLineProps>(
  function CodeBlockLine(props, ref) {
    const { children, className } = props;
    const ctx = useCodeBlockContext();
    const slot = getSlotProps('line', lineStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <div ref={ref} className={cls} style={slot.style} data-testid="code-block-line">{children}</div>;
  },
);

// ── Sub: CodeBlock.LineNumber ────────────────────────

/** CodeBlock.LineNumber props */
export interface CodeBlockLineNumberProps { children?: ReactNode; className?: string; }

export const CodeBlockLineNumber = forwardRef<HTMLSpanElement, CodeBlockLineNumberProps>(
  function CodeBlockLineNumber(props, ref) {
    const { children, className } = props;
    const ctx = useCodeBlockContext();
    const slot = getSlotProps('lineNumber', lineNumberStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <span ref={ref} className={cls} style={slot.style} data-testid="code-block-line-number" aria-hidden="true">{children}</span>;
  },
);

// ── Sub: CodeBlock.Content ──────────────────────────

/** CodeBlock.Content props */
export interface CodeBlockContentProps { children?: ReactNode; className?: string; }

export const CodeBlockContent = forwardRef<HTMLSpanElement, CodeBlockContentProps>(
  function CodeBlockContent(props, ref) {
    const { children, className } = props;
    const ctx = useCodeBlockContext();
    const slot = getSlotProps('content', contentStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <span ref={ref} className={cls} style={slot.style} data-testid="code-block-content">{children}</span>;
  },
);

// ── Component Props ──────────────────────────────────

export interface CodeBlockComponentProps extends SlotStyleProps<CodeBlockSlot> {
  /** Kod / Code string */
  code: string;
  /** Dil / Language */
  language?: CodeLanguage;
  /** Tema / Theme */
  theme?: 'light' | 'dark';
  /** Satir numaralarini goster / Show line numbers */
  showLineNumbers?: boolean;
  /** Baslik / Title */
  title?: string;
  /** Kopyalama butonu goster / Show copy button */
  copyable?: boolean;
  /** Compound children */
  children?: ReactNode;
  /** Ek className */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const CodeBlockBase = forwardRef<HTMLDivElement, CodeBlockComponentProps>(
  function CodeBlock(props, ref) {
    const {
      code, language = 'text', theme = 'light',
      showLineNumbers = true, title, copyable = true,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const result = useMemo(() => highlightCode(code, language), [code, language]);
    const rootSlot = getSlotProps('root', `${rootStyle} ${themeStyles[theme]}`, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue = { code, language, theme, showLineNumbers, result, classNames, styles };

    if (children) {
      return (
        <CodeBlockCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="code-block-root" data-language={language} data-theme={theme}>
            {children}
          </div>
        </CodeBlockCtx.Provider>
      );
    }

    const headerSlot = getSlotProps('header', headerStyle, classNames, styles);
    const bodySlotVal = getSlotProps('body', bodyStyle, classNames, styles);
    const lineSlot = getSlotProps('line', lineStyle, classNames, styles);
    const lineNumSlot = getSlotProps('lineNumber', lineNumberStyle, classNames, styles);
    const contentSlot = getSlotProps('content', contentStyle, classNames, styles);

    return (
      <CodeBlockCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="code-block-root" data-language={language} data-theme={theme}>
          {(title || copyable) && (
            <div className={headerSlot.className} style={headerSlot.style} data-testid="code-block-header">
              <span className={getSlotProps('language', languageStyle, classNames, styles).className} data-testid="code-block-language">{title ?? language}</span>
              {copyable && <CodeBlockCopyButton />}
            </div>
          )}
          <div className={bodySlotVal.className} style={bodySlotVal.style} data-testid="code-block-body" role="region" aria-label="Code">
            {result.lines.map((line) => (
              <div key={line.lineNumber} className={lineSlot.className} style={lineSlot.style} data-testid="code-block-line">
                {showLineNumbers && (
                  <span className={lineNumSlot.className} style={lineNumSlot.style} data-testid="code-block-line-number" aria-hidden="true">
                    {line.lineNumber}
                  </span>
                )}
                <span className={contentSlot.className} style={contentSlot.style} data-testid="code-block-content">
                  {line.tokens.map((token, ti) => (
                    <span key={ti} className={tokenStyles[token.type]}>{token.value}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CodeBlockCtx.Provider>
    );
  },
);

/**
 * CodeBlock bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <CodeBlock code="const x = 1;" language="javascript" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <CodeBlock code="const x = 1;" language="javascript">
 *   <CodeBlock.Header>utils.ts</CodeBlock.Header>
 *   <CodeBlock.CopyButton />
 * </CodeBlock>
 * ```
 */
export const CodeBlock = Object.assign(CodeBlockBase, {
  Header: CodeBlockHeader,
  CopyButton: CodeBlockCopyButton,
  Line: CodeBlockLine,
  LineNumber: CodeBlockLineNumber,
  Content: CodeBlockContent,
});
