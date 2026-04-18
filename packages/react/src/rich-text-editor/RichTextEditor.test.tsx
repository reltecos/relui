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
import { RichTextEditor } from './RichTextEditor';

describe('RichTextEditor', () => {
  it('root render edilir', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-root')).toBeInTheDocument();
  });

  it('role application set edilir', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-root')).toHaveAttribute('role', 'application');
  });

  it('aria-label set edilir', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-root')).toHaveAttribute('aria-label', 'Rich text editor');
  });

  it('toolbar render edilir', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-toolbar')).toBeInTheDocument();
  });

  it('content render edilir', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-content')).toBeInTheDocument();
  });

  it('content contentEditable', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-content')).toHaveAttribute('contenteditable', 'true');
  });

  it('content role=textbox', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-content')).toHaveAttribute('role', 'textbox');
  });

  it('value ile HTML icerik gosterilir', () => {
    render(<RichTextEditor value="<p>Hello</p>" />);
    expect(screen.getByTestId('rich-text-editor-content').innerHTML).toContain('Hello');
  });

  it('bold format butonu render edilir', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-btn-bold')).toBeInTheDocument();
  });

  it('italic format butonu render edilir', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-btn-italic')).toBeInTheDocument();
  });

  it('underline format butonu render edilir', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-btn-underline')).toBeInTheDocument();
  });

  it('bold butonuna tiklaninca aktif olur', () => {
    render(<RichTextEditor />);
    const btn = screen.getByTestId('rich-text-editor-btn-bold');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('data-active', 'true');
  });

  it('italic butonuna tiklaninca aktif olur', () => {
    render(<RichTextEditor />);
    const btn = screen.getByTestId('rich-text-editor-btn-italic');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('data-active', 'true');
  });

  it('undo butonu render edilir', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-btn-undo')).toBeInTheDocument();
  });

  it('redo butonu render edilir', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-btn-redo')).toBeInTheDocument();
  });

  it('toolbar separator render edilir', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-toolbar-separator')).toBeInTheDocument();
  });

  it('heading1 blok butonu render edilir', () => {
    render(<RichTextEditor />);
    expect(screen.getByTestId('rich-text-editor-btn-heading1')).toBeInTheDocument();
  });

  it('className root elemana eklenir', () => {
    render(<RichTextEditor className="my-rte" />);
    expect(screen.getByTestId('rich-text-editor-root').className).toContain('my-rte');
  });

  it('style root elemana eklenir', () => {
    render(<RichTextEditor style={{ padding: '16px' }} />);
    expect(screen.getByTestId('rich-text-editor-root')).toHaveStyle({ padding: '16px' });
  });

  it('classNames.root root elemana eklenir', () => {
    render(<RichTextEditor classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('rich-text-editor-root').className).toContain('custom-root');
  });

  it('classNames.toolbar toolbar elemana eklenir', () => {
    render(<RichTextEditor classNames={{ toolbar: 'custom-tb' }} />);
    expect(screen.getByTestId('rich-text-editor-toolbar').className).toContain('custom-tb');
  });

  it('classNames.content content elemana eklenir', () => {
    render(<RichTextEditor classNames={{ content: 'custom-ct' }} />);
    expect(screen.getByTestId('rich-text-editor-content').className).toContain('custom-ct');
  });

  it('styles.root root elemana eklenir', () => {
    render(<RichTextEditor styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('rich-text-editor-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.toolbar toolbar elemana eklenir', () => {
    render(<RichTextEditor styles={{ toolbar: { padding: '12px' } }} />);
    expect(screen.getByTestId('rich-text-editor-toolbar')).toHaveStyle({ padding: '12px' });
  });

  it('styles.content content elemana eklenir', () => {
    render(<RichTextEditor styles={{ content: { fontSize: '18px' } }} />);
    expect(screen.getByTestId('rich-text-editor-content')).toHaveStyle({ fontSize: '18px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<RichTextEditor ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('RichTextEditor (Compound)', () => {
  it('compound: toolbar render edilir', () => {
    render(
      <RichTextEditor>
        <RichTextEditor.Toolbar />
      </RichTextEditor>,
    );
    expect(screen.getByTestId('rich-text-editor-toolbar')).toBeInTheDocument();
  });

  it('compound: content render edilir', () => {
    render(
      <RichTextEditor>
        <RichTextEditor.Content />
      </RichTextEditor>,
    );
    expect(screen.getByTestId('rich-text-editor-content')).toBeInTheDocument();
  });

  it('compound: toolbar + content birlikte', () => {
    render(
      <RichTextEditor value="<p>Test</p>">
        <RichTextEditor.Toolbar />
        <RichTextEditor.Content />
      </RichTextEditor>,
    );
    expect(screen.getByTestId('rich-text-editor-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('rich-text-editor-content')).toBeInTheDocument();
  });

  it('compound: bold butonuna tiklaninca aktif olur', () => {
    render(
      <RichTextEditor>
        <RichTextEditor.Toolbar />
        <RichTextEditor.Content />
      </RichTextEditor>,
    );
    const btn = screen.getByTestId('rich-text-editor-btn-bold');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('data-active', 'true');
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <RichTextEditor classNames={{ toolbar: 'cmp-tb' }}>
        <RichTextEditor.Toolbar />
      </RichTextEditor>,
    );
    expect(screen.getByTestId('rich-text-editor-toolbar').className).toContain('cmp-tb');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <RichTextEditor styles={{ toolbar: { padding: '30px' } }}>
        <RichTextEditor.Toolbar />
      </RichTextEditor>,
    );
    expect(screen.getByTestId('rich-text-editor-toolbar')).toHaveStyle({ padding: '30px' });
  });

  it('compound: ToolbarButton render edilir', () => {
    render(
      <RichTextEditor>
        <RichTextEditor.ToolbarButton onClick={() => {}}>Custom</RichTextEditor.ToolbarButton>
      </RichTextEditor>,
    );
    expect(screen.getByTestId('rich-text-editor-toolbar-button')).toBeInTheDocument();
  });

  it('RichTextEditor.Toolbar context disinda hata firlatir', () => {
    expect(() => render(<RichTextEditor.Toolbar />)).toThrow();
  });

  it('RichTextEditor.Content context disinda hata firlatir', () => {
    expect(() => render(<RichTextEditor.Content />)).toThrow();
  });
});
