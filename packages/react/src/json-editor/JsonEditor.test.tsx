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
import { JSONEditor } from './JsonEditor';

const SAMPLE = { name: 'Ali', age: 30, active: true, items: [1, 2, 3] };

describe('JSONEditor', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    expect(screen.getByTestId('json-editor-root')).toBeInTheDocument();
  });

  it('varsayilan mod tree', () => {
    render(<JSONEditor value={SAMPLE} />);
    expect(screen.getByTestId('json-editor-root')).toHaveAttribute('data-mode', 'tree');
  });

  it('role application set edilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    expect(screen.getByTestId('json-editor-root')).toHaveAttribute('role', 'application');
  });

  it('aria-label set edilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    expect(screen.getByTestId('json-editor-root')).toHaveAttribute('aria-label', 'JSON editor');
  });

  // ── Toolbar ──

  it('toolbar render edilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    expect(screen.getByTestId('json-editor-toolbar')).toBeInTheDocument();
  });

  it('Tree ve Text mode butonlari render edilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    expect(screen.getByTestId('json-editor-mode-tree')).toBeInTheDocument();
    expect(screen.getByTestId('json-editor-mode-text')).toBeInTheDocument();
  });

  it('Text mode butonuna tiklaninca textarea gosterilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    fireEvent.click(screen.getByTestId('json-editor-mode-text'));
    expect(screen.getByTestId('json-editor-textarea')).toBeInTheDocument();
  });

  it('Expand/Collapse butonlari render edilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    expect(screen.getByTestId('json-editor-expand-all')).toBeInTheDocument();
    expect(screen.getByTestId('json-editor-collapse-all')).toBeInTheDocument();
  });

  // ── Tree Mode ──

  it('tree mode da agac render edilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    expect(screen.getByTestId('json-editor-tree')).toBeInTheDocument();
  });

  it('tree node lar render edilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    const nodes = screen.getAllByTestId('json-editor-node');
    expect(nodes.length).toBeGreaterThan(0);
  });

  it('node key render edilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    const keys = screen.getAllByTestId('json-editor-node-key');
    const keyTexts = keys.map((k) => k.textContent);
    expect(keyTexts).toContain('name:');
  });

  it('node value render edilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    const values = screen.getAllByTestId('json-editor-node-value');
    const valueTexts = values.map((v) => v.textContent);
    expect(valueTexts).toContain('"Ali"');
  });

  it('node type badge render edilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    const types = screen.getAllByTestId('json-editor-node-type');
    expect(types.length).toBeGreaterThan(0);
  });

  // ── Text Mode ──

  it('text mode da textarea render edilir', () => {
    render(<JSONEditor value={SAMPLE} defaultMode="text" />);
    expect(screen.getByTestId('json-editor-textarea')).toBeInTheDocument();
  });

  it('textarea da JSON metni gosterilir', () => {
    render(<JSONEditor value={SAMPLE} defaultMode="text" />);
    const textarea = screen.getByTestId('json-editor-textarea') as HTMLTextAreaElement;
    expect(textarea.value).toContain('Ali');
  });

  it('textarea da icerik degistirilir', () => {
    render(<JSONEditor value={SAMPLE} defaultMode="text" />);
    const textarea = screen.getByTestId('json-editor-textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{"x":1}' } });
    expect(textarea.value).toBe('{"x":1}');
  });

  // ── Validation ──

  it('gecerli JSON da valid gosterilir', () => {
    render(<JSONEditor value={SAMPLE} />);
    const validation = screen.getByTestId('json-editor-validation');
    expect(validation).toHaveAttribute('data-valid', 'true');
  });

  it('gecersiz JSON da error gosterilir', () => {
    render(<JSONEditor value={SAMPLE} defaultMode="text" />);
    fireEvent.change(screen.getByTestId('json-editor-textarea'), {
      target: { value: '{bad json}' },
    });
    const validation = screen.getByTestId('json-editor-validation');
    expect(validation).toHaveAttribute('data-valid', 'false');
  });

  // ── Node Expand/Collapse ──

  it('expand butonu tum node lari acar', () => {
    render(<JSONEditor value={{ a: { b: { c: 1 } } }} />);
    fireEvent.click(screen.getByTestId('json-editor-expand-all'));
    const nodes = screen.getAllByTestId('json-editor-node');
    expect(nodes.length).toBeGreaterThan(2);
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<JSONEditor value={SAMPLE} className="my-editor" />);
    expect(screen.getByTestId('json-editor-root').className).toContain('my-editor');
  });

  it('style root elemana eklenir', () => {
    render(<JSONEditor value={SAMPLE} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('json-editor-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<JSONEditor value={SAMPLE} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('json-editor-root').className).toContain('custom-root');
  });

  it('classNames.toolbar toolbar elemana eklenir', () => {
    render(<JSONEditor value={SAMPLE} classNames={{ toolbar: 'custom-toolbar' }} />);
    expect(screen.getByTestId('json-editor-toolbar').className).toContain('custom-toolbar');
  });

  it('classNames.tree tree elemana eklenir', () => {
    render(<JSONEditor value={SAMPLE} classNames={{ tree: 'custom-tree' }} />);
    expect(screen.getByTestId('json-editor-tree').className).toContain('custom-tree');
  });

  it('classNames.textArea textarea elemana eklenir', () => {
    render(<JSONEditor value={SAMPLE} defaultMode="text" classNames={{ textArea: 'custom-ta' }} />);
    expect(screen.getByTestId('json-editor-textarea').className).toContain('custom-ta');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<JSONEditor value={SAMPLE} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('json-editor-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.toolbar toolbar elemana eklenir', () => {
    render(<JSONEditor value={SAMPLE} styles={{ toolbar: { padding: '12px' } }} />);
    expect(screen.getByTestId('json-editor-toolbar')).toHaveStyle({ padding: '12px' });
  });

  it('styles.tree tree elemana eklenir', () => {
    render(<JSONEditor value={SAMPLE} styles={{ tree: { padding: '20px' } }} />);
    expect(screen.getByTestId('json-editor-tree')).toHaveStyle({ padding: '20px' });
  });

  it('styles.textArea textarea elemana eklenir', () => {
    render(<JSONEditor value={SAMPLE} defaultMode="text" styles={{ textArea: { fontSize: '16px' } }} />);
    expect(screen.getByTestId('json-editor-textarea')).toHaveStyle({ fontSize: '16px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<JSONEditor value={SAMPLE} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('JSONEditor (Compound)', () => {
  it('compound: toolbar render edilir', () => {
    render(
      <JSONEditor value={SAMPLE}>
        <JSONEditor.Toolbar />
      </JSONEditor>,
    );
    expect(screen.getByTestId('json-editor-toolbar')).toBeInTheDocument();
  });

  it('compound: tree render edilir', () => {
    render(
      <JSONEditor value={SAMPLE}>
        <JSONEditor.Tree />
      </JSONEditor>,
    );
    expect(screen.getByTestId('json-editor-tree')).toBeInTheDocument();
  });

  it('compound: text render edilir', () => {
    render(
      <JSONEditor value={SAMPLE}>
        <JSONEditor.Text />
      </JSONEditor>,
    );
    expect(screen.getByTestId('json-editor-textarea')).toBeInTheDocument();
  });

  it('compound: toolbar + tree birlikte calisir', () => {
    render(
      <JSONEditor value={SAMPLE}>
        <JSONEditor.Toolbar />
        <JSONEditor.Tree />
      </JSONEditor>,
    );
    expect(screen.getByTestId('json-editor-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('json-editor-tree')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <JSONEditor value={SAMPLE} classNames={{ toolbar: 'cmp-tb' }}>
        <JSONEditor.Toolbar />
      </JSONEditor>,
    );
    expect(screen.getByTestId('json-editor-toolbar').className).toContain('cmp-tb');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <JSONEditor value={SAMPLE} styles={{ toolbar: { padding: '30px' } }}>
        <JSONEditor.Toolbar />
      </JSONEditor>,
    );
    expect(screen.getByTestId('json-editor-toolbar')).toHaveStyle({ padding: '30px' });
  });

  it('JSONEditor.Toolbar context disinda hata firlatir', () => {
    expect(() => render(<JSONEditor.Toolbar />)).toThrow();
  });

  it('JSONEditor.Tree context disinda hata firlatir', () => {
    expect(() => render(<JSONEditor.Tree />)).toThrow();
  });

  it('JSONEditor.Text context disinda hata firlatir', () => {
    expect(() => render(<JSONEditor.Text />)).toThrow();
  });
});
