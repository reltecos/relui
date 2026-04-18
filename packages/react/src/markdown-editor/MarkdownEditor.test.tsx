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
import { MarkdownEditor } from './MarkdownEditor';

describe('MarkdownEditor', () => {
  it('root render edilir', () => {
    render(<MarkdownEditor />);
    expect(screen.getByTestId('markdown-editor-root')).toBeInTheDocument();
  });

  it('varsayilan mod split', () => {
    render(<MarkdownEditor />);
    expect(screen.getByTestId('markdown-editor-root')).toHaveAttribute('data-mode', 'split');
  });

  it('role application set edilir', () => {
    render(<MarkdownEditor />);
    expect(screen.getByTestId('markdown-editor-root')).toHaveAttribute('role', 'application');
  });

  it('toolbar render edilir', () => {
    render(<MarkdownEditor />);
    expect(screen.getByTestId('markdown-editor-toolbar')).toBeInTheDocument();
  });

  it('textarea render edilir (split modda)', () => {
    render(<MarkdownEditor />);
    expect(screen.getByTestId('markdown-editor-textarea')).toBeInTheDocument();
  });

  it('preview render edilir (split modda)', () => {
    render(<MarkdownEditor />);
    expect(screen.getByTestId('markdown-editor-preview')).toBeInTheDocument();
  });

  it('value ile markdown gosterilir', () => {
    render(<MarkdownEditor value="# Hello" />);
    const textarea = screen.getByTestId('markdown-editor-textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('# Hello');
  });

  it('preview da HTML render edilir', () => {
    render(<MarkdownEditor value="**bold**" />);
    const preview = screen.getByTestId('markdown-editor-preview');
    expect(preview.innerHTML).toContain('<strong>bold</strong>');
  });

  it('textarea da icerik degistirilir', () => {
    render(<MarkdownEditor />);
    const textarea = screen.getByTestId('markdown-editor-textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '# New' } });
    expect(textarea.value).toBe('# New');
  });

  it('edit modunda sadece textarea gosterilir', () => {
    render(<MarkdownEditor defaultMode="edit" />);
    expect(screen.getByTestId('markdown-editor-textarea')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-editor-preview')).not.toBeInTheDocument();
  });

  it('preview modunda sadece preview gosterilir', () => {
    render(<MarkdownEditor defaultMode="preview" />);
    expect(screen.queryByTestId('markdown-editor-textarea')).not.toBeInTheDocument();
    expect(screen.getByTestId('markdown-editor-preview')).toBeInTheDocument();
  });

  it('mode butonlari render edilir', () => {
    render(<MarkdownEditor />);
    expect(screen.getByTestId('markdown-editor-mode-edit')).toBeInTheDocument();
    expect(screen.getByTestId('markdown-editor-mode-split')).toBeInTheDocument();
    expect(screen.getByTestId('markdown-editor-mode-preview')).toBeInTheDocument();
  });

  it('Edit butonuna tiklaninca edit moduna gecilir', () => {
    render(<MarkdownEditor />);
    fireEvent.click(screen.getByTestId('markdown-editor-mode-edit'));
    expect(screen.getByTestId('markdown-editor-root')).toHaveAttribute('data-mode', 'edit');
  });

  it('Preview butonuna tiklaninca preview moduna gecilir', () => {
    render(<MarkdownEditor />);
    fireEvent.click(screen.getByTestId('markdown-editor-mode-preview'));
    expect(screen.getByTestId('markdown-editor-root')).toHaveAttribute('data-mode', 'preview');
  });

  it('format butonlari render edilir', () => {
    render(<MarkdownEditor />);
    expect(screen.getByTestId('markdown-editor-btn-bold')).toBeInTheDocument();
    expect(screen.getByTestId('markdown-editor-btn-italic')).toBeInTheDocument();
  });

  it('className root elemana eklenir', () => {
    render(<MarkdownEditor className="my-md" />);
    expect(screen.getByTestId('markdown-editor-root').className).toContain('my-md');
  });

  it('style root elemana eklenir', () => {
    render(<MarkdownEditor style={{ padding: '16px' }} />);
    expect(screen.getByTestId('markdown-editor-root')).toHaveStyle({ padding: '16px' });
  });

  it('classNames.root root elemana eklenir', () => {
    render(<MarkdownEditor classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('markdown-editor-root').className).toContain('custom-root');
  });

  it('classNames.toolbar toolbar elemana eklenir', () => {
    render(<MarkdownEditor classNames={{ toolbar: 'custom-tb' }} />);
    expect(screen.getByTestId('markdown-editor-toolbar').className).toContain('custom-tb');
  });

  it('classNames.editor editor elemana eklenir', () => {
    render(<MarkdownEditor classNames={{ editor: 'custom-ed' }} />);
    expect(screen.getByTestId('markdown-editor-textarea').className).toContain('custom-ed');
  });

  it('classNames.preview preview elemana eklenir', () => {
    render(<MarkdownEditor classNames={{ preview: 'custom-pv' }} />);
    expect(screen.getByTestId('markdown-editor-preview').className).toContain('custom-pv');
  });

  it('styles.root root elemana eklenir', () => {
    render(<MarkdownEditor styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('markdown-editor-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.toolbar toolbar elemana eklenir', () => {
    render(<MarkdownEditor styles={{ toolbar: { padding: '12px' } }} />);
    expect(screen.getByTestId('markdown-editor-toolbar')).toHaveStyle({ padding: '12px' });
  });

  it('styles.editor editor elemana eklenir', () => {
    render(<MarkdownEditor styles={{ editor: { fontSize: '18px' } }} />);
    expect(screen.getByTestId('markdown-editor-textarea')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.preview preview elemana eklenir', () => {
    render(<MarkdownEditor styles={{ preview: { padding: '20px' } }} />);
    expect(screen.getByTestId('markdown-editor-preview')).toHaveStyle({ padding: '20px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<MarkdownEditor ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('MarkdownEditor (Compound)', () => {
  it('compound: toolbar render edilir', () => {
    render(
      <MarkdownEditor>
        <MarkdownEditor.Toolbar />
      </MarkdownEditor>,
    );
    expect(screen.getByTestId('markdown-editor-toolbar')).toBeInTheDocument();
  });

  it('compound: editor render edilir', () => {
    render(
      <MarkdownEditor>
        <MarkdownEditor.Editor />
      </MarkdownEditor>,
    );
    expect(screen.getByTestId('markdown-editor-textarea')).toBeInTheDocument();
  });

  it('compound: preview render edilir', () => {
    render(
      <MarkdownEditor value="**bold**">
        <MarkdownEditor.Preview />
      </MarkdownEditor>,
    );
    expect(screen.getByTestId('markdown-editor-preview')).toBeInTheDocument();
    expect(screen.getByTestId('markdown-editor-preview').innerHTML).toContain('<strong>bold</strong>');
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <MarkdownEditor classNames={{ toolbar: 'cmp-tb' }}>
        <MarkdownEditor.Toolbar />
      </MarkdownEditor>,
    );
    expect(screen.getByTestId('markdown-editor-toolbar').className).toContain('cmp-tb');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <MarkdownEditor styles={{ toolbar: { padding: '30px' } }}>
        <MarkdownEditor.Toolbar />
      </MarkdownEditor>,
    );
    expect(screen.getByTestId('markdown-editor-toolbar')).toHaveStyle({ padding: '30px' });
  });

  it('MarkdownEditor.Toolbar context disinda hata firlatir', () => {
    expect(() => render(<MarkdownEditor.Toolbar />)).toThrow();
  });

  it('MarkdownEditor.Editor context disinda hata firlatir', () => {
    expect(() => render(<MarkdownEditor.Editor />)).toThrow();
  });

  it('MarkdownEditor.Preview context disinda hata firlatir', () => {
    expect(() => render(<MarkdownEditor.Preview />)).toThrow();
  });
});
