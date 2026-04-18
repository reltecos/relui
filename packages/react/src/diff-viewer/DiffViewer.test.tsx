/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { DiffViewer } from './DiffViewer';

describe('DiffViewer', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<DiffViewer oldText="hello" newText="world" />);
    expect(screen.getByTestId('diff-viewer-root')).toBeInTheDocument();
  });

  it('varsayilan mode inline', () => {
    render(<DiffViewer oldText="a" newText="b" />);
    expect(screen.getByTestId('diff-viewer-root')).toHaveAttribute('data-mode', 'inline');
  });

  it('mode split set edilir', () => {
    render(<DiffViewer oldText="a" newText="b" mode="split" />);
    expect(screen.getByTestId('diff-viewer-root')).toHaveAttribute('data-mode', 'split');
  });

  // ── Inline mode ──

  it('inline: satirlar render edilir', () => {
    render(<DiffViewer oldText="hello" newText="world" />);
    expect(screen.getAllByTestId('diff-viewer-line').length).toBeGreaterThan(0);
  });

  it('inline: eklenen satir data-type add', () => {
    render(<DiffViewer oldText="" newText="hello" />);
    const lines = screen.getAllByTestId('diff-viewer-line');
    const addLine = lines.find((l) => l.getAttribute('data-type') === 'add');
    expect(addLine).toBeDefined();
  });

  it('inline: silinen satir data-type remove', () => {
    render(<DiffViewer oldText="hello" newText="" />);
    const lines = screen.getAllByTestId('diff-viewer-line');
    const remLine = lines.find((l) => l.getAttribute('data-type') === 'remove');
    expect(remLine).toBeDefined();
  });

  it('inline: degismeyen satir data-type equal', () => {
    render(<DiffViewer oldText="same" newText="same" />);
    const lines = screen.getAllByTestId('diff-viewer-line');
    expect(lines[0]).toHaveAttribute('data-type', 'equal');
  });

  it('inline: satir numaralari gosterilir', () => {
    render(<DiffViewer oldText="a\nb" newText="a\nb" />);
    const gutters = screen.getAllByTestId('diff-viewer-gutter');
    expect(gutters.length).toBeGreaterThan(0);
  });

  it('inline: showLineNumbers false ile numara gizlenir', () => {
    render(<DiffViewer oldText="a" newText="a" showLineNumbers={false} />);
    expect(screen.queryByTestId('diff-viewer-gutter')).not.toBeInTheDocument();
  });

  it('inline: content render edilir', () => {
    render(<DiffViewer oldText="hello" newText="hello" />);
    const contents = screen.getAllByTestId('diff-viewer-content');
    expect(contents[0]).toHaveTextContent('hello');
  });

  // ── Split mode ──

  it('split: iki side render edilir', () => {
    render(<DiffViewer oldText="a" newText="b" mode="split" />);
    expect(screen.getAllByTestId('diff-viewer-side')).toHaveLength(2);
  });

  it('split: satirlar her side da render edilir', () => {
    render(<DiffViewer oldText="a\nb" newText="a\nc" mode="split" />);
    const lines = screen.getAllByTestId('diff-viewer-line');
    expect(lines.length).toBeGreaterThan(0);
  });

  // ── Ayni metin ──

  it('ayni metin tum satirlar equal', () => {
    render(<DiffViewer oldText="hello\nworld" newText="hello\nworld" />);
    const lines = screen.getAllByTestId('diff-viewer-line');
    expect(lines.every((l) => l.getAttribute('data-type') === 'equal')).toBe(true);
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<DiffViewer oldText="a" newText="b" className="my-diff" />);
    expect(screen.getByTestId('diff-viewer-root').className).toContain('my-diff');
  });

  it('style root elemana eklenir', () => {
    render(<DiffViewer oldText="a" newText="b" style={{ padding: '16px' }} />);
    expect(screen.getByTestId('diff-viewer-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<DiffViewer oldText="a" newText="b" classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('diff-viewer-root').className).toContain('custom-root');
  });

  it('classNames.line line elemana eklenir', () => {
    render(<DiffViewer oldText="a" newText="a" classNames={{ line: 'custom-line' }} />);
    expect(screen.getAllByTestId('diff-viewer-line')[0].className).toContain('custom-line');
  });

  it('classNames.gutter gutter elemana eklenir', () => {
    render(<DiffViewer oldText="a" newText="a" classNames={{ gutter: 'custom-gut' }} />);
    expect(screen.getAllByTestId('diff-viewer-gutter')[0].className).toContain('custom-gut');
  });

  it('classNames.content content elemana eklenir', () => {
    render(<DiffViewer oldText="a" newText="a" classNames={{ content: 'custom-cnt' }} />);
    expect(screen.getAllByTestId('diff-viewer-content')[0].className).toContain('custom-cnt');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<DiffViewer oldText="a" newText="b" styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('diff-viewer-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.line line elemana eklenir', () => {
    render(<DiffViewer oldText="a" newText="a" styles={{ line: { padding: '4px' } }} />);
    expect(screen.getAllByTestId('diff-viewer-line')[0]).toHaveStyle({ padding: '4px' });
  });

  it('styles.gutter gutter elemana eklenir', () => {
    render(<DiffViewer oldText="a" newText="a" styles={{ gutter: { opacity: '0.5' } }} />);
    expect(screen.getAllByTestId('diff-viewer-gutter')[0]).toHaveStyle({ opacity: '0.5' });
  });

  it('styles.content content elemana eklenir', () => {
    render(<DiffViewer oldText="a" newText="a" styles={{ content: { fontSize: '16px' } }} />);
    expect(screen.getAllByTestId('diff-viewer-content')[0]).toHaveStyle({ fontSize: '16px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<DiffViewer oldText="a" newText="b" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('DiffViewer (Compound)', () => {
  it('compound: side render edilir', () => {
    render(
      <DiffViewer oldText="a" newText="b">
        <DiffViewer.Side>Left</DiffViewer.Side>
      </DiffViewer>,
    );
    expect(screen.getByTestId('diff-viewer-side')).toHaveTextContent('Left');
  });

  it('compound: line render edilir', () => {
    render(
      <DiffViewer oldText="a" newText="b">
        <DiffViewer.Line>Custom Line</DiffViewer.Line>
      </DiffViewer>,
    );
    expect(screen.getByTestId('diff-viewer-line')).toHaveTextContent('Custom Line');
  });

  it('compound: gutter render edilir', () => {
    render(
      <DiffViewer oldText="a" newText="b">
        <DiffViewer.Gutter>1</DiffViewer.Gutter>
      </DiffViewer>,
    );
    expect(screen.getByTestId('diff-viewer-gutter')).toHaveTextContent('1');
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <DiffViewer oldText="a" newText="b" classNames={{ line: 'cmp-line' }}>
        <DiffViewer.Line>L</DiffViewer.Line>
      </DiffViewer>,
    );
    expect(screen.getByTestId('diff-viewer-line').className).toContain('cmp-line');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <DiffViewer oldText="a" newText="b" styles={{ gutter: { padding: '8px' } }}>
        <DiffViewer.Gutter>1</DiffViewer.Gutter>
      </DiffViewer>,
    );
    expect(screen.getByTestId('diff-viewer-gutter')).toHaveStyle({ padding: '8px' });
  });

  it('DiffViewer.Side context disinda hata firlatir', () => {
    expect(() => render(<DiffViewer.Side>S</DiffViewer.Side>)).toThrow();
  });
});
