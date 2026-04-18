/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DiffViewer — metin fark gosterimi bilesen (Dual API).
 * DiffViewer — text diff viewer component (Dual API).
 *
 * Props-based: `<DiffViewer oldText="hello" newText="world" />`
 * Compound:    `<DiffViewer oldText="..." newText="..."><DiffViewer.Line /><DiffViewer.Gutter /></DiffViewer>`
 *
 * @packageDocumentation
 */

import { forwardRef, useMemo, type ReactNode } from 'react';
import { computeDiff, type DiffResult } from '@relteco/relui-core';
import {
  rootStyle, splitRootStyle, sideStyle, lineStyle, addedLineStyle, removedLineStyle,
  gutterStyle, contentStyle, addedGutterStyle, removedGutterStyle,
  prefixStyle, addedPrefixStyle, removedPrefixStyle,
} from './diff-viewer.css';
import { DiffViewerCtx, useDiffViewerContext } from './diff-viewer-context';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot & Types ────────────────────────────────────

export type DiffViewerSlot = 'root' | 'side' | 'line' | 'gutter' | 'content' | 'addedLine' | 'removedLine';
export type DiffViewerMode = 'inline' | 'split';

// ── Sub: DiffViewer.Side ────────────────────────────

export interface DiffViewerSideProps { children?: ReactNode; className?: string; }

export const DiffViewerSide = forwardRef<HTMLDivElement, DiffViewerSideProps>(
  function DiffViewerSide(props, ref) {
    const { children, className } = props;
    const ctx = useDiffViewerContext();
    const slot = getSlotProps('side', sideStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <div ref={ref} className={cls} style={slot.style} data-testid="diff-viewer-side">{children}</div>;
  },
);

// ── Sub: DiffViewer.Line ────────────────────────────

export interface DiffViewerLineProps { children?: ReactNode; className?: string; }

export const DiffViewerLine = forwardRef<HTMLDivElement, DiffViewerLineProps>(
  function DiffViewerLine(props, ref) {
    const { children, className } = props;
    const ctx = useDiffViewerContext();
    const slot = getSlotProps('line', lineStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <div ref={ref} className={cls} style={slot.style} data-testid="diff-viewer-line">{children}</div>;
  },
);

// ── Sub: DiffViewer.Gutter ──────────────────────────

export interface DiffViewerGutterProps { children?: ReactNode; className?: string; }

export const DiffViewerGutter = forwardRef<HTMLDivElement, DiffViewerGutterProps>(
  function DiffViewerGutter(props, ref) {
    const { children, className } = props;
    const ctx = useDiffViewerContext();
    const slot = getSlotProps('gutter', gutterStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <div ref={ref} className={cls} style={slot.style} data-testid="diff-viewer-gutter">{children}</div>;
  },
);

// ── Component Props ──────────────────────────────────

export interface DiffViewerComponentProps extends SlotStyleProps<DiffViewerSlot> {
  /** Eski metin / Old text */
  oldText: string;
  /** Yeni metin / New text */
  newText: string;
  /** Gorunum modu / View mode */
  mode?: DiffViewerMode;
  /** Satir numaralarini goster / Show line numbers */
  showLineNumbers?: boolean;
  /** Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const DiffViewerBase = forwardRef<HTMLDivElement, DiffViewerComponentProps>(
  function DiffViewer(props, ref) {
    const {
      oldText, newText, mode = 'inline', showLineNumbers = true,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const result = useMemo(() => computeDiff(oldText, newText), [oldText, newText]);
    const baseRootCls = mode === 'split' ? `${rootStyle} ${splitRootStyle}` : rootStyle;
    const rootSlot = getSlotProps('root', baseRootCls, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue = { result, mode, showLineNumbers, classNames, styles };

    if (children) {
      return (
        <DiffViewerCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="diff-viewer-root" data-mode={mode}>{children}</div>
        </DiffViewerCtx.Provider>
      );
    }

    if (mode === 'split') {
      return (
        <DiffViewerCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="diff-viewer-root" data-mode="split">
            <SplitView result={result} showLineNumbers={showLineNumbers} side="old" classNames={classNames} styles={styles} />
            <SplitView result={result} showLineNumbers={showLineNumbers} side="new" classNames={classNames} styles={styles} />
          </div>
        </DiffViewerCtx.Provider>
      );
    }

    // Inline mode
    const lnSlot = getSlotProps('line', lineStyle, classNames, styles);
    const gtSlot = getSlotProps('gutter', gutterStyle, classNames, styles);
    const ctSlot = getSlotProps('content', contentStyle, classNames, styles);

    return (
      <DiffViewerCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="diff-viewer-root" data-mode="inline" role="table" aria-label="Diff">
          {result.lines.map((line, i) => {
            let lineCls = lnSlot.className;
            let gutCls = gtSlot.className;
            let pfx = ' ';
            let pfxCls = prefixStyle;
            if (line.type === 'add') {
              lineCls += ` ${addedLineStyle}`;
              gutCls += ` ${addedGutterStyle}`;
              pfx = '+';
              pfxCls += ` ${addedPrefixStyle}`;
            } else if (line.type === 'remove') {
              lineCls += ` ${removedLineStyle}`;
              gutCls += ` ${removedGutterStyle}`;
              pfx = '-';
              pfxCls += ` ${removedPrefixStyle}`;
            }
            return (
              <div key={i} className={lineCls} style={lnSlot.style} data-testid="diff-viewer-line" data-type={line.type} role="row">
                {showLineNumbers && (
                  <div className={gutCls} style={gtSlot.style} data-testid="diff-viewer-gutter" role="cell">
                    {line.oldNum ?? ''}
                  </div>
                )}
                {showLineNumbers && (
                  <div className={gutCls} style={gtSlot.style} data-testid="diff-viewer-gutter" role="cell">
                    {line.newNum ?? ''}
                  </div>
                )}
                <span className={pfxCls}>{pfx}</span>
                <div className={ctSlot.className} style={ctSlot.style} data-testid="diff-viewer-content" role="cell">
                  {line.type === 'remove' ? line.oldValue : line.newValue}
                </div>
              </div>
            );
          })}
        </div>
      </DiffViewerCtx.Provider>
    );
  },
);

// ── Internal: SplitView ─────────────────────────────

function SplitView({ result, showLineNumbers, side, classNames, styles }: {
  result: DiffResult;
  showLineNumbers: boolean;
  side: 'old' | 'new';
  classNames: DiffViewerComponentProps['classNames'];
  styles: DiffViewerComponentProps['styles'];
}) {
  const sdSlot = getSlotProps('side', sideStyle, classNames, styles);
  const lnSlot = getSlotProps('line', lineStyle, classNames, styles);
  const gtSlot = getSlotProps('gutter', gutterStyle, classNames, styles);
  const ctSlot = getSlotProps('content', contentStyle, classNames, styles);

  return (
    <div className={sdSlot.className} style={sdSlot.style} data-testid="diff-viewer-side">
      {result.lines.map((line, i) => {
        const isRelevant = side === 'old' ? (line.type === 'equal' || line.type === 'remove') : (line.type === 'equal' || line.type === 'add');
        if (!isRelevant && line.type !== 'equal') {
          return (
            <div key={i} className={lnSlot.className} style={{ ...lnSlot.style, minHeight: '1.5em' }} data-testid="diff-viewer-line" data-type="empty" />
          );
        }

        let lineCls = lnSlot.className;
        let gutCls = gtSlot.className;
        if (line.type === 'add') { lineCls += ` ${addedLineStyle}`; gutCls += ` ${addedGutterStyle}`; }
        if (line.type === 'remove') { lineCls += ` ${removedLineStyle}`; gutCls += ` ${removedGutterStyle}`; }

        const num = side === 'old' ? line.oldNum : line.newNum;
        const val = side === 'old' ? line.oldValue : line.newValue;

        return (
          <div key={i} className={lineCls} style={lnSlot.style} data-testid="diff-viewer-line" data-type={line.type}>
            {showLineNumbers && <div className={gutCls} style={gtSlot.style} data-testid="diff-viewer-gutter">{num ?? ''}</div>}
            <div className={ctSlot.className} style={ctSlot.style} data-testid="diff-viewer-content">{val}</div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * DiffViewer bilesen — Dual API (props-based + compound).
 */
export const DiffViewer = Object.assign(DiffViewerBase, {
  Side: DiffViewerSide,
  Line: DiffViewerLine,
  Gutter: DiffViewerGutter,
});
