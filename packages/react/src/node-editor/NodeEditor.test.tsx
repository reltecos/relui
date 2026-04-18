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
import { NodeEditor } from './NodeEditor';
import type { GraphNode, GraphEdge } from '@relteco/relui-core';

const N1: GraphNode = {
  id: 'n1', type: 'default', label: 'Input', x: 50, y: 50, width: 200, height: 100,
  ports: [
    { id: 'n1-out', name: 'output', direction: 'output', dataType: 'number' },
  ],
  collapsed: false,
};

const N2: GraphNode = {
  id: 'n2', type: 'default', label: 'Output', x: 350, y: 50, width: 200, height: 100,
  ports: [
    { id: 'n2-in', name: 'input', direction: 'input', dataType: 'number' },
  ],
  collapsed: false,
};

const E1: GraphEdge = {
  id: 'e1', sourceNodeId: 'n1', sourcePortId: 'n1-out', targetNodeId: 'n2', targetPortId: 'n2-in',
};

describe('NodeEditor', () => {
  it('root render edilir', () => {
    render(<NodeEditor nodes={[N1]} />);
    expect(screen.getByTestId('node-editor-root')).toBeInTheDocument();
  });

  it('role application set edilir', () => {
    render(<NodeEditor nodes={[N1]} />);
    expect(screen.getByTestId('node-editor-root')).toHaveAttribute('role', 'application');
  });

  it('aria-label set edilir', () => {
    render(<NodeEditor nodes={[N1]} />);
    expect(screen.getByTestId('node-editor-root')).toHaveAttribute('aria-label', 'Node editor');
  });

  it('toolbar render edilir', () => {
    render(<NodeEditor nodes={[N1]} />);
    expect(screen.getByTestId('node-editor-toolbar')).toBeInTheDocument();
  });

  it('canvas render edilir', () => {
    render(<NodeEditor nodes={[N1]} />);
    expect(screen.getByTestId('node-editor-canvas')).toBeInTheDocument();
  });

  it('node lar render edilir', () => {
    render(<NodeEditor nodes={[N1, N2]} />);
    const nodes = screen.getAllByTestId('node-editor-node');
    expect(nodes).toHaveLength(2);
  });

  it('node header label gosterir', () => {
    render(<NodeEditor nodes={[N1]} />);
    const headers = screen.getAllByTestId('node-editor-node-header');
    expect(headers[0]).toHaveTextContent('Input');
  });

  it('node body portlari gosterir', () => {
    render(<NodeEditor nodes={[N1]} />);
    const ports = screen.getAllByTestId('node-editor-port');
    expect(ports).toHaveLength(1);
  });

  it('port direction data attribute set edilir', () => {
    render(<NodeEditor nodes={[N1]} />);
    const port = screen.getByTestId('node-editor-port');
    expect(port).toHaveAttribute('data-direction', 'output');
  });

  it('edge ler SVG de render edilir', () => {
    render(<NodeEditor nodes={[N1, N2]} edges={[E1]} />);
    expect(screen.getByTestId('node-editor-svg')).toBeInTheDocument();
    const edges = screen.getAllByTestId('node-editor-edge');
    expect(edges).toHaveLength(1);
  });

  it('minimap render edilir', () => {
    render(<NodeEditor nodes={[N1]} />);
    expect(screen.getByTestId('node-editor-minimap')).toBeInTheDocument();
  });

  it('undo/redo butonlari render edilir', () => {
    render(<NodeEditor nodes={[N1]} />);
    expect(screen.getByTestId('node-editor-btn-undo')).toBeInTheDocument();
    expect(screen.getByTestId('node-editor-btn-redo')).toBeInTheDocument();
  });

  it('zoom butonlari render edilir', () => {
    render(<NodeEditor nodes={[N1]} />);
    expect(screen.getByTestId('node-editor-btn-zoom-in')).toBeInTheDocument();
    expect(screen.getByTestId('node-editor-btn-zoom-out')).toBeInTheDocument();
  });

  it('reset butonu render edilir', () => {
    render(<NodeEditor nodes={[N1]} />);
    expect(screen.getByTestId('node-editor-btn-reset')).toBeInTheDocument();
  });

  it('node tiklaninca secilir', () => {
    render(<NodeEditor nodes={[N1]} />);
    const node = screen.getByTestId('node-editor-node');
    fireEvent.click(node);
    expect(node).toHaveAttribute('data-selected', 'true');
  });

  it('canvas tiklaninca secim temizlenir', () => {
    render(<NodeEditor nodes={[N1]} />);
    const node = screen.getByTestId('node-editor-node');
    fireEvent.click(node);
    expect(node).toHaveAttribute('data-selected', 'true');
    fireEvent.click(screen.getByTestId('node-editor-canvas'));
    expect(node).not.toHaveAttribute('data-selected', 'true');
  });

  it('bos node listesi ile hata vermez', () => {
    render(<NodeEditor />);
    expect(screen.getByTestId('node-editor-root')).toBeInTheDocument();
  });

  it('className root elemana eklenir', () => {
    render(<NodeEditor className="my-editor" />);
    expect(screen.getByTestId('node-editor-root').className).toContain('my-editor');
  });

  it('style root elemana eklenir', () => {
    render(<NodeEditor style={{ padding: '16px' }} />);
    expect(screen.getByTestId('node-editor-root')).toHaveStyle({ padding: '16px' });
  });

  it('classNames.root root elemana eklenir', () => {
    render(<NodeEditor classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('node-editor-root').className).toContain('custom-root');
  });

  it('classNames.toolbar toolbar elemana eklenir', () => {
    render(<NodeEditor classNames={{ toolbar: 'custom-tb' }} />);
    expect(screen.getByTestId('node-editor-toolbar').className).toContain('custom-tb');
  });

  it('classNames.canvas canvas elemana eklenir', () => {
    render(<NodeEditor classNames={{ canvas: 'custom-cv' }} />);
    expect(screen.getByTestId('node-editor-canvas').className).toContain('custom-cv');
  });

  it('classNames.minimap minimap elemana eklenir', () => {
    render(<NodeEditor classNames={{ minimap: 'custom-mm' }} />);
    expect(screen.getByTestId('node-editor-minimap').className).toContain('custom-mm');
  });

  it('styles.root root elemana eklenir', () => {
    render(<NodeEditor styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('node-editor-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.toolbar toolbar elemana eklenir', () => {
    render(<NodeEditor styles={{ toolbar: { padding: '12px' } }} />);
    expect(screen.getByTestId('node-editor-toolbar')).toHaveStyle({ padding: '12px' });
  });

  it('styles.minimap minimap elemana eklenir', () => {
    render(<NodeEditor styles={{ minimap: { opacity: '0.8' } }} />);
    expect(screen.getByTestId('node-editor-minimap')).toHaveStyle({ opacity: '0.8' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<NodeEditor ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('NodeEditor (Compound)', () => {
  it('compound: toolbar render edilir', () => {
    render(
      <NodeEditor nodes={[N1]}>
        <NodeEditor.Toolbar />
      </NodeEditor>,
    );
    expect(screen.getByTestId('node-editor-toolbar')).toBeInTheDocument();
  });

  it('compound: canvas render edilir', () => {
    render(
      <NodeEditor nodes={[N1]}>
        <NodeEditor.Canvas />
      </NodeEditor>,
    );
    expect(screen.getByTestId('node-editor-canvas')).toBeInTheDocument();
  });

  it('compound: minimap render edilir', () => {
    render(
      <NodeEditor nodes={[N1]}>
        <NodeEditor.Minimap />
      </NodeEditor>,
    );
    expect(screen.getByTestId('node-editor-minimap')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <NodeEditor classNames={{ toolbar: 'cmp-tb' }}>
        <NodeEditor.Toolbar />
      </NodeEditor>,
    );
    expect(screen.getByTestId('node-editor-toolbar').className).toContain('cmp-tb');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <NodeEditor styles={{ toolbar: { padding: '30px' } }}>
        <NodeEditor.Toolbar />
      </NodeEditor>,
    );
    expect(screen.getByTestId('node-editor-toolbar')).toHaveStyle({ padding: '30px' });
  });

  it('NodeEditor.Toolbar context disinda hata firlatir', () => {
    expect(() => render(<NodeEditor.Toolbar />)).toThrow();
  });

  it('NodeEditor.Canvas context disinda hata firlatir', () => {
    expect(() => render(<NodeEditor.Canvas />)).toThrow();
  });

  it('NodeEditor.Minimap context disinda hata firlatir', () => {
    expect(() => render(<NodeEditor.Minimap />)).toThrow();
  });
});
