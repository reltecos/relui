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
import { Highlight } from './Highlight';

describe('Highlight', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Highlight text="hello" terms="hello" />);
    expect(screen.getByTestId('highlight-root')).toBeInTheDocument();
  });

  // ── Matching ──

  it('eslesen terim mark ile render edilir', () => {
    render(<Highlight text="hello world" terms="world" />);
    const marks = screen.getAllByTestId('highlight-mark');
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent('world');
  });

  it('eslesmeyen metin text ile render edilir', () => {
    render(<Highlight text="hello world" terms="world" />);
    const texts = screen.getAllByTestId('highlight-text');
    expect(texts).toHaveLength(1);
    expect(texts[0]).toHaveTextContent('hello');
  });

  it('esleme yoksa tum metin text olarak render edilir', () => {
    render(<Highlight text="hello world" terms="xyz" />);
    const texts = screen.getAllByTestId('highlight-text');
    expect(texts).toHaveLength(1);
    expect(texts[0]).toHaveTextContent('hello world');
  });

  it('coklu terim destegi', () => {
    render(<Highlight text="the quick brown fox" terms={['quick', 'fox']} />);
    const marks = screen.getAllByTestId('highlight-mark');
    expect(marks).toHaveLength(2);
    expect(marks[0]).toHaveTextContent('quick');
    expect(marks[1]).toHaveTextContent('fox');
  });

  it('case-insensitive varsayilan', () => {
    render(<Highlight text="Hello World" terms="hello" />);
    expect(screen.getAllByTestId('highlight-mark')[0]).toHaveTextContent('Hello');
  });

  it('case-sensitive mod', () => {
    render(<Highlight text="Hello World" terms="hello" caseSensitive />);
    expect(screen.queryByTestId('highlight-mark')).not.toBeInTheDocument();
  });

  it('birden fazla esleme', () => {
    render(<Highlight text="ab ab ab" terms="ab" />);
    expect(screen.getAllByTestId('highlight-mark')).toHaveLength(3);
  });

  it('tum metin esleme', () => {
    render(<Highlight text="hello" terms="hello" />);
    expect(screen.getAllByTestId('highlight-mark')).toHaveLength(1);
    expect(screen.queryByTestId('highlight-text')).not.toBeInTheDocument();
  });

  it('bos terim ile esleme yok', () => {
    render(<Highlight text="hello" terms="" />);
    expect(screen.queryByTestId('highlight-mark')).not.toBeInTheDocument();
  });

  it('mark element <mark> tag kullanir', () => {
    render(<Highlight text="hello" terms="hello" />);
    const mark = screen.getByTestId('highlight-mark');
    expect(mark.tagName.toLowerCase()).toBe('mark');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Highlight text="hello" terms="x" className="my-hl" />);
    expect(screen.getByTestId('highlight-root').className).toContain('my-hl');
  });

  it('style root elemana eklenir', () => {
    render(<Highlight text="hello" terms="x" style={{ padding: '8px' }} />);
    expect(screen.getByTestId('highlight-root')).toHaveStyle({ padding: '8px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Highlight text="hello" terms="x" classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('highlight-root').className).toContain('custom-root');
  });

  it('classNames.mark mark elemana eklenir', () => {
    render(<Highlight text="hello" terms="hello" classNames={{ mark: 'custom-mark' }} />);
    expect(screen.getByTestId('highlight-mark').className).toContain('custom-mark');
  });

  it('classNames.text text elemana eklenir', () => {
    render(<Highlight text="hello world" terms="world" classNames={{ text: 'custom-text' }} />);
    expect(screen.getByTestId('highlight-text').className).toContain('custom-text');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Highlight text="hello" terms="x" styles={{ root: { padding: '16px' } }} />);
    expect(screen.getByTestId('highlight-root')).toHaveStyle({ padding: '16px' });
  });

  it('styles.mark mark elemana eklenir', () => {
    render(<Highlight text="hello" terms="hello" styles={{ mark: { fontWeight: '700' } }} />);
    expect(screen.getByTestId('highlight-mark')).toHaveStyle({ fontWeight: '700' });
  });

  it('styles.text text elemana eklenir', () => {
    render(<Highlight text="hello world" terms="world" styles={{ text: { opacity: '0.5' } }} />);
    expect(screen.getByTestId('highlight-text')).toHaveStyle({ opacity: '0.5' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Highlight text="hello" terms="x" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Highlight (Compound)', () => {
  it('compound: mark render edilir', () => {
    render(
      <Highlight text="hello" terms="hello">
        <Highlight.Mark>custom</Highlight.Mark>
      </Highlight>,
    );
    expect(screen.getByTestId('highlight-mark')).toHaveTextContent('custom');
  });

  it('compound: text render edilir', () => {
    render(
      <Highlight text="hello" terms="x">
        <Highlight.Text>plain</Highlight.Text>
      </Highlight>,
    );
    expect(screen.getByTestId('highlight-text')).toHaveTextContent('plain');
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Highlight text="hello" terms="hello" classNames={{ mark: 'cmp-mark' }}>
        <Highlight.Mark>hi</Highlight.Mark>
      </Highlight>,
    );
    expect(screen.getByTestId('highlight-mark').className).toContain('cmp-mark');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Highlight text="hello" terms="hello" styles={{ mark: { fontWeight: '600' } }}>
        <Highlight.Mark>hi</Highlight.Mark>
      </Highlight>,
    );
    expect(screen.getByTestId('highlight-mark')).toHaveStyle({ fontWeight: '600' });
  });

  it('Highlight.Mark context disinda hata firlatir', () => {
    expect(() => render(<Highlight.Mark>test</Highlight.Mark>)).toThrow();
  });
});
