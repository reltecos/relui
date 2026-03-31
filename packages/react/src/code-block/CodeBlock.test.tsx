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
import { CodeBlock } from './CodeBlock';

describe('CodeBlock', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<CodeBlock code="hello" />);
    expect(screen.getByTestId('code-block-root')).toBeInTheDocument();
  });

  it('varsayilan language text', () => {
    render(<CodeBlock code="hello" />);
    expect(screen.getByTestId('code-block-root')).toHaveAttribute('data-language', 'text');
  });

  it('varsayilan theme light', () => {
    render(<CodeBlock code="hello" />);
    expect(screen.getByTestId('code-block-root')).toHaveAttribute('data-theme', 'light');
  });

  it('language set edilir', () => {
    render(<CodeBlock code="const x = 1;" language="javascript" />);
    expect(screen.getByTestId('code-block-root')).toHaveAttribute('data-language', 'javascript');
  });

  it('theme dark set edilir', () => {
    render(<CodeBlock code="hello" theme="dark" />);
    expect(screen.getByTestId('code-block-root')).toHaveAttribute('data-theme', 'dark');
  });

  // ── Header ──

  it('title ile header render edilir', () => {
    render(<CodeBlock code="x" title="utils.ts" />);
    expect(screen.getByTestId('code-block-header')).toBeInTheDocument();
    expect(screen.getByTestId('code-block-language')).toHaveTextContent('utils.ts');
  });

  it('copyable ile copy button render edilir', () => {
    render(<CodeBlock code="x" />);
    expect(screen.getByTestId('code-block-copy-btn')).toBeInTheDocument();
  });

  it('copyable false ile copy button gizlenir', () => {
    render(<CodeBlock code="x" copyable={false} title={undefined} />);
    expect(screen.queryByTestId('code-block-copy-btn')).not.toBeInTheDocument();
  });

  // ── Body ──

  it('body render edilir', () => {
    render(<CodeBlock code="hello" />);
    expect(screen.getByTestId('code-block-body')).toBeInTheDocument();
  });

  it('satirlar render edilir', () => {
    render(<CodeBlock code={'a\nb\nc'} />);
    expect(screen.getAllByTestId('code-block-line')).toHaveLength(3);
  });

  it('line numbers render edilir', () => {
    render(<CodeBlock code={'a\nb'} />);
    const nums = screen.getAllByTestId('code-block-line-number');
    expect(nums).toHaveLength(2);
    expect(nums[0]).toHaveTextContent('1');
    expect(nums[1]).toHaveTextContent('2');
  });

  it('showLineNumbers false ile line numbers gizlenir', () => {
    render(<CodeBlock code="x" showLineNumbers={false} />);
    expect(screen.queryByTestId('code-block-line-number')).not.toBeInTheDocument();
  });

  it('content render edilir', () => {
    render(<CodeBlock code="hello world" />);
    expect(screen.getAllByTestId('code-block-content')[0]).toHaveTextContent('hello world');
  });

  // ── Syntax highlighting ──

  it('javascript keyword renkleniyor', () => {
    render(<CodeBlock code="const x = 1;" language="javascript" />);
    const content = screen.getAllByTestId('code-block-content')[0];
    const spans = content.querySelectorAll('span');
    const constSpan = Array.from(spans).find((s) => s.textContent === 'const');
    expect(constSpan).toBeDefined();
  });

  it('cok satirli kod dogru render edilir', () => {
    render(<CodeBlock code={'line1\nline2\nline3'} language="text" />);
    expect(screen.getAllByTestId('code-block-line')).toHaveLength(3);
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<CodeBlock code="x" className="my-code" />);
    expect(screen.getByTestId('code-block-root').className).toContain('my-code');
  });

  it('style root elemana eklenir', () => {
    render(<CodeBlock code="x" style={{ padding: '16px' }} />);
    expect(screen.getByTestId('code-block-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<CodeBlock code="x" classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('code-block-root').className).toContain('custom-root');
  });

  it('classNames.header header elemana eklenir', () => {
    render(<CodeBlock code="x" title="T" classNames={{ header: 'custom-hdr' }} />);
    expect(screen.getByTestId('code-block-header').className).toContain('custom-hdr');
  });

  it('classNames.body body elemana eklenir', () => {
    render(<CodeBlock code="x" classNames={{ body: 'custom-body' }} />);
    expect(screen.getByTestId('code-block-body').className).toContain('custom-body');
  });

  it('classNames.line line elemana eklenir', () => {
    render(<CodeBlock code="x" classNames={{ line: 'custom-line' }} />);
    expect(screen.getAllByTestId('code-block-line')[0].className).toContain('custom-line');
  });

  it('classNames.lineNumber lineNumber elemana eklenir', () => {
    render(<CodeBlock code="x" classNames={{ lineNumber: 'custom-ln' }} />);
    expect(screen.getAllByTestId('code-block-line-number')[0].className).toContain('custom-ln');
  });

  it('classNames.content content elemana eklenir', () => {
    render(<CodeBlock code="x" classNames={{ content: 'custom-cnt' }} />);
    expect(screen.getAllByTestId('code-block-content')[0].className).toContain('custom-cnt');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<CodeBlock code="x" styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('code-block-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.header header elemana eklenir', () => {
    render(<CodeBlock code="x" title="T" styles={{ header: { padding: '12px' } }} />);
    expect(screen.getByTestId('code-block-header')).toHaveStyle({ padding: '12px' });
  });

  it('styles.body body elemana eklenir', () => {
    render(<CodeBlock code="x" styles={{ body: { fontSize: '16px' } }} />);
    expect(screen.getByTestId('code-block-body')).toHaveStyle({ fontSize: '16px' });
  });

  it('styles.line line elemana eklenir', () => {
    render(<CodeBlock code="x" styles={{ line: { padding: '4px' } }} />);
    expect(screen.getAllByTestId('code-block-line')[0]).toHaveStyle({ padding: '4px' });
  });

  it('styles.lineNumber lineNumber elemana eklenir', () => {
    render(<CodeBlock code="x" styles={{ lineNumber: { opacity: '0.5' } }} />);
    expect(screen.getAllByTestId('code-block-line-number')[0]).toHaveStyle({ opacity: '0.5' });
  });

  it('styles.content content elemana eklenir', () => {
    render(<CodeBlock code="x" styles={{ content: { letterSpacing: '0.05em' } }} />);
    expect(screen.getAllByTestId('code-block-content')[0]).toHaveStyle({ letterSpacing: '0.05em' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<CodeBlock code="x" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('CodeBlock (Compound)', () => {
  it('compound: header render edilir', () => {
    render(
      <CodeBlock code="const x = 1;" language="javascript">
        <CodeBlock.Header>utils.ts</CodeBlock.Header>
      </CodeBlock>,
    );
    expect(screen.getByTestId('code-block-header')).toHaveTextContent('utils.ts');
  });

  it('compound: copy button render edilir', () => {
    render(
      <CodeBlock code="x" language="text">
        <CodeBlock.CopyButton />
      </CodeBlock>,
    );
    expect(screen.getByTestId('code-block-copy-btn')).toBeInTheDocument();
  });

  it('compound: line render edilir', () => {
    render(
      <CodeBlock code="x" language="text">
        <CodeBlock.Line>
          <CodeBlock.LineNumber>1</CodeBlock.LineNumber>
          <CodeBlock.Content>hello</CodeBlock.Content>
        </CodeBlock.Line>
      </CodeBlock>,
    );
    expect(screen.getByTestId('code-block-line')).toBeInTheDocument();
    expect(screen.getByTestId('code-block-line-number')).toHaveTextContent('1');
    expect(screen.getByTestId('code-block-content')).toHaveTextContent('hello');
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <CodeBlock code="x" classNames={{ header: 'cmp-hdr' }}>
        <CodeBlock.Header>T</CodeBlock.Header>
      </CodeBlock>,
    );
    expect(screen.getByTestId('code-block-header').className).toContain('cmp-hdr');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <CodeBlock code="x" styles={{ header: { padding: '20px' } }}>
        <CodeBlock.Header>T</CodeBlock.Header>
      </CodeBlock>,
    );
    expect(screen.getByTestId('code-block-header')).toHaveStyle({ padding: '20px' });
  });

  it('CodeBlock.Header context disinda hata firlatir', () => {
    expect(() => render(<CodeBlock.Header>T</CodeBlock.Header>)).toThrow();
  });
});
