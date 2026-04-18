/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { CodeEditor } from './CodeEditor';

const SAMPLE = 'const x = 1;\nconst y = 2;\nconst z = 3;';

describe('CodeEditor', () => {
  it('root render edilir', () => {
    render(<CodeEditor value={SAMPLE} />);
    expect(screen.getByTestId('code-editor-root')).toBeInTheDocument();
  });

  it('role application set edilir', () => {
    render(<CodeEditor value={SAMPLE} />);
    expect(screen.getByTestId('code-editor-root')).toHaveAttribute('role', 'application');
  });

  it('aria-label set edilir', () => {
    render(<CodeEditor value={SAMPLE} />);
    expect(screen.getByTestId('code-editor-root')).toHaveAttribute('aria-label', 'Code editor');
  });

  it('data-language set edilir', () => {
    render(<CodeEditor value={SAMPLE} language="javascript" />);
    expect(screen.getByTestId('code-editor-root')).toHaveAttribute('data-language', 'javascript');
  });

  it('toolbar render edilir', () => {
    render(<CodeEditor value={SAMPLE} />);
    expect(screen.getByTestId('code-editor-toolbar')).toBeInTheDocument();
  });

  it('gutter render edilir', () => {
    render(<CodeEditor value={SAMPLE} />);
    expect(screen.getByTestId('code-editor-gutter')).toBeInTheDocument();
  });

  it('content render edilir', () => {
    render(<CodeEditor value={SAMPLE} />);
    expect(screen.getByTestId('code-editor-content')).toBeInTheDocument();
  });

  it('satir numaralari render edilir', () => {
    render(<CodeEditor value={SAMPLE} />);
    const lineNums = screen.getAllByTestId('code-editor-line-number');
    expect(lineNums).toHaveLength(3);
    expect(lineNums[0]).toHaveTextContent('1');
    expect(lineNums[2]).toHaveTextContent('3');
  });

  it('satirlar render edilir', () => {
    render(<CodeEditor value={SAMPLE} />);
    const lines = screen.getAllByTestId('code-editor-line');
    expect(lines).toHaveLength(3);
  });

  it('aktif satir isaretlenir', () => {
    render(<CodeEditor value={SAMPLE} />);
    const lines = screen.getAllByTestId('code-editor-line');
    expect(lines[0]).toHaveAttribute('data-active', 'true');
  });

  it('undo butonu render edilir', () => {
    render(<CodeEditor value={SAMPLE} />);
    expect(screen.getByTestId('code-editor-btn-undo')).toBeInTheDocument();
  });

  it('redo butonu render edilir', () => {
    render(<CodeEditor value={SAMPLE} />);
    expect(screen.getByTestId('code-editor-btn-redo')).toBeInTheDocument();
  });

  it('find panel showFind true ile render edilir', () => {
    render(<CodeEditor value={SAMPLE} showFind />);
    expect(screen.getByTestId('code-editor-find-panel')).toBeInTheDocument();
  });

  it('find panel showFind false ile render edilmez', () => {
    render(<CodeEditor value={SAMPLE} />);
    expect(screen.queryByTestId('code-editor-find-panel')).not.toBeInTheDocument();
  });

  it('find input deger degistirilir', () => {
    render(<CodeEditor value={SAMPLE} showFind />);
    const input = screen.getByTestId('code-editor-find-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'const' } });
    expect(input.value).toBe('const');
    expect(screen.getByTestId('code-editor-find-count')).toHaveTextContent('3 matches');
  });

  it('syntax highlight token lari render edilir', () => {
    render(<CodeEditor value="const x = 1;" language="typescript" />);
    const content = screen.getByTestId('code-editor-content');
    expect(content.textContent).toContain('const');
  });

  it('className root elemana eklenir', () => {
    render(<CodeEditor value="" className="my-editor" />);
    expect(screen.getByTestId('code-editor-root').className).toContain('my-editor');
  });

  it('style root elemana eklenir', () => {
    render(<CodeEditor value="" style={{ padding: '16px' }} />);
    expect(screen.getByTestId('code-editor-root')).toHaveStyle({ padding: '16px' });
  });

  it('classNames.root root elemana eklenir', () => {
    render(<CodeEditor value="" classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('code-editor-root').className).toContain('custom-root');
  });

  it('classNames.toolbar toolbar elemana eklenir', () => {
    render(<CodeEditor value="" classNames={{ toolbar: 'custom-tb' }} />);
    expect(screen.getByTestId('code-editor-toolbar').className).toContain('custom-tb');
  });

  it('classNames.gutter gutter elemana eklenir', () => {
    render(<CodeEditor value="" classNames={{ gutter: 'custom-gtr' }} />);
    expect(screen.getByTestId('code-editor-gutter').className).toContain('custom-gtr');
  });

  it('classNames.content content elemana eklenir', () => {
    render(<CodeEditor value="" classNames={{ content: 'custom-cnt' }} />);
    expect(screen.getByTestId('code-editor-content').className).toContain('custom-cnt');
  });

  it('styles.root root elemana eklenir', () => {
    render(<CodeEditor value="" styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('code-editor-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.toolbar toolbar elemana eklenir', () => {
    render(<CodeEditor value="" styles={{ toolbar: { padding: '12px' } }} />);
    expect(screen.getByTestId('code-editor-toolbar')).toHaveStyle({ padding: '12px' });
  });

  it('styles.gutter gutter elemana eklenir', () => {
    render(<CodeEditor value="" styles={{ gutter: { padding: '8px' } }} />);
    expect(screen.getByTestId('code-editor-gutter')).toHaveStyle({ padding: '8px' });
  });

  it('styles.content content elemana eklenir', () => {
    render(<CodeEditor value="" styles={{ content: { fontSize: '16px' } }} />);
    expect(screen.getByTestId('code-editor-content')).toHaveStyle({ fontSize: '16px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<CodeEditor value="" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('CodeEditor (Compound)', () => {
  it('compound: toolbar render edilir', () => {
    render(
      <CodeEditor value={SAMPLE}>
        <CodeEditor.Toolbar />
      </CodeEditor>,
    );
    expect(screen.getByTestId('code-editor-toolbar')).toBeInTheDocument();
  });

  it('compound: gutter render edilir', () => {
    render(
      <CodeEditor value={SAMPLE}>
        <CodeEditor.Gutter />
      </CodeEditor>,
    );
    expect(screen.getByTestId('code-editor-gutter')).toBeInTheDocument();
  });

  it('compound: content render edilir', () => {
    render(
      <CodeEditor value={SAMPLE}>
        <CodeEditor.Content />
      </CodeEditor>,
    );
    expect(screen.getByTestId('code-editor-content')).toBeInTheDocument();
  });

  it('compound: find panel render edilir', () => {
    render(
      <CodeEditor value={SAMPLE}>
        <CodeEditor.FindPanel />
      </CodeEditor>,
    );
    expect(screen.getByTestId('code-editor-find-panel')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <CodeEditor value="" classNames={{ toolbar: 'cmp-tb' }}>
        <CodeEditor.Toolbar />
      </CodeEditor>,
    );
    expect(screen.getByTestId('code-editor-toolbar').className).toContain('cmp-tb');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <CodeEditor value="" styles={{ toolbar: { padding: '30px' } }}>
        <CodeEditor.Toolbar />
      </CodeEditor>,
    );
    expect(screen.getByTestId('code-editor-toolbar')).toHaveStyle({ padding: '30px' });
  });

  it('CodeEditor.Toolbar context disinda hata firlatir', () => {
    expect(() => render(<CodeEditor.Toolbar />)).toThrow();
  });

  it('CodeEditor.Content context disinda hata firlatir', () => {
    expect(() => render(<CodeEditor.Content />)).toThrow();
  });

  it('CodeEditor.Gutter context disinda hata firlatir', () => {
    expect(() => render(<CodeEditor.Gutter />)).toThrow();
  });
});
