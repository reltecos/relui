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
import { Tree } from './Tree';
import type { TreeNodeDef } from '@relteco/relui-core';

const sampleNodes: TreeNodeDef[] = [
  {
    id: 'root',
    label: 'Root',
    children: [
      { id: 'child1', label: 'Child 1' },
      {
        id: 'child2',
        label: 'Child 2',
        children: [
          { id: 'grandchild1', label: 'Grandchild 1' },
        ],
      },
    ],
  },
  { id: 'leaf', label: 'Leaf Node' },
];

describe('Tree', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Tree nodes={sampleNodes} />);
    expect(screen.getByTestId('tree-root')).toBeInTheDocument();
  });

  it('root role tree', () => {
    render(<Tree nodes={sampleNodes} />);
    expect(screen.getByTestId('tree-root')).toHaveAttribute('role', 'tree');
  });

  it('varsayilan size md', () => {
    render(<Tree nodes={sampleNodes} />);
    expect(screen.getByTestId('tree-root')).toHaveAttribute('data-size', 'md');
  });

  it('size sm set edilir', () => {
    render(<Tree nodes={sampleNodes} size="sm" />);
    expect(screen.getByTestId('tree-root')).toHaveAttribute('data-size', 'sm');
  });

  it('size lg set edilir', () => {
    render(<Tree nodes={sampleNodes} size="lg" />);
    expect(screen.getByTestId('tree-root')).toHaveAttribute('data-size', 'lg');
  });

  // ── Nodes ──

  it('dugumler render edilir', () => {
    render(<Tree nodes={sampleNodes} />);
    const nodes = screen.getAllByTestId('tree-node');
    expect(nodes.length).toBe(2);
  });

  it('etiketler gorunur', () => {
    render(<Tree nodes={sampleNodes} />);
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText('Leaf Node')).toBeInTheDocument();
  });

  it('dugum role treeitem', () => {
    render(<Tree nodes={sampleNodes} />);
    const nodes = screen.getAllByTestId('tree-node');
    expect(nodes[0]).toHaveAttribute('role', 'treeitem');
  });

  // ── Expand / Collapse ──

  it('tikla ile dugum acilir', () => {
    render(<Tree nodes={sampleNodes} />);
    fireEvent.click(screen.getByText('Root'));
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('tekrar tikla ile dugum kapanir', () => {
    render(<Tree nodes={sampleNodes} />);
    fireEvent.click(screen.getByText('Root'));
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Root'));
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
  });

  it('defaultExpanded ile baslangicta acik', () => {
    render(<Tree nodes={sampleNodes} defaultExpanded={['root']} />);
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });

  it('iki seviye acilir', () => {
    render(<Tree nodes={sampleNodes} defaultExpanded={['root', 'child2']} />);
    expect(screen.getByText('Grandchild 1')).toBeInTheDocument();
  });

  it('aria-expanded branch dugumunde var', () => {
    render(<Tree nodes={sampleNodes} defaultExpanded={['root']} />);
    const rootNode = screen.getAllByTestId('tree-node')[0];
    expect(rootNode).toHaveAttribute('aria-expanded', 'true');
  });

  it('onExpandChange cagirilir', () => {
    const onExpandChange = vi.fn();
    render(<Tree nodes={sampleNodes} onExpandChange={onExpandChange} />);
    fireEvent.click(screen.getByText('Root'));
    expect(onExpandChange).toHaveBeenCalled();
  });

  // ── Selection ──

  it('dugum tiklaninca secilir', () => {
    render(<Tree nodes={sampleNodes} defaultExpanded={['root']} />);
    fireEvent.click(screen.getByText('Child 1'));
    const contentEl = screen.getByText('Child 1').closest('[data-testid="tree-node-content"]');
    expect(contentEl).toHaveAttribute('data-selected', 'true');
  });

  it('onSelectChange cagirilir', () => {
    const onSelectChange = vi.fn();
    render(<Tree nodes={[{ id: 'x', label: 'X' }]} onSelectChange={onSelectChange} />);
    fireEvent.click(screen.getByText('X'));
    expect(onSelectChange).toHaveBeenCalledWith(['x']);
  });

  // ── Checkable ──

  it('checkable false ise checkbox gorunmez', () => {
    render(<Tree nodes={sampleNodes} />);
    expect(screen.queryByTestId('tree-checkbox')).not.toBeInTheDocument();
  });

  it('checkable true ise checkbox gorunur', () => {
    render(<Tree nodes={sampleNodes} checkable />);
    const checkboxes = screen.getAllByTestId('tree-checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('checkbox tiklaninca isaret konur', () => {
    render(<Tree nodes={sampleNodes} checkable />);
    const checkbox = screen.getAllByTestId('tree-checkbox')[0] as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  // ── Tristate (indeterminate) ──

  it('parent check edilince tum children checked olur', () => {
    render(<Tree nodes={sampleNodes} checkable defaultExpanded={['root']} />);
    // Root checkbox'a tikla
    const rootCheckbox = screen.getAllByTestId('tree-checkbox')[0] as HTMLInputElement;
    fireEvent.click(rootCheckbox);
    // children da checked olmali
    const allCheckboxes = screen.getAllByTestId('tree-checkbox');
    const child1Cb = allCheckboxes[1] as HTMLInputElement;
    const child2Cb = allCheckboxes[2] as HTMLInputElement;
    expect(child1Cb.checked).toBe(true);
    expect(child2Cb.checked).toBe(true);
  });

  it('bir child uncheck edilince parent indeterminate olur', () => {
    render(<Tree nodes={sampleNodes} checkable defaultExpanded={['root']} />);
    // Once parent check et
    fireEvent.click(screen.getAllByTestId('tree-checkbox')[0] as HTMLInputElement);
    // Sonra child1 uncheck et
    fireEvent.click(screen.getAllByTestId('tree-checkbox')[1] as HTMLInputElement);
    // root indeterminate olmali — data-indeterminate attribute ile kontrol
    const rootCb = screen.getAllByTestId('tree-checkbox')[0] as HTMLInputElement;
    expect(rootCb).toHaveAttribute('data-indeterminate', 'true');
  });

  it('tum children uncheck edilince parent temiz olur', () => {
    const simpleNodes: TreeNodeDef[] = [
      { id: 'p', label: 'Parent', children: [
        { id: 'c1', label: 'C1' },
        { id: 'c2', label: 'C2' },
      ]},
    ];
    render(<Tree nodes={simpleNodes} checkable defaultExpanded={['p']} />);
    // Parent check — tum children checked olur
    fireEvent.click(screen.getAllByTestId('tree-checkbox')[0] as HTMLInputElement);
    // c1 uncheck
    fireEvent.click(screen.getAllByTestId('tree-checkbox')[1] as HTMLInputElement);
    // c2 uncheck
    fireEvent.click(screen.getAllByTestId('tree-checkbox')[2] as HTMLInputElement);
    const parentCb = screen.getAllByTestId('tree-checkbox')[0] as HTMLInputElement;
    expect(parentCb.checked).toBe(false);
    expect(parentCb).not.toHaveAttribute('data-indeterminate');
  });

  // ── Disabled ──

  it('disabled dugum tiklanmaz', () => {
    const disabledNodes: TreeNodeDef[] = [
      { id: 'd', label: 'Disabled', disabled: true, children: [{ id: 'd1', label: 'D1' }] },
    ];
    render(<Tree nodes={disabledNodes} />);
    fireEvent.click(screen.getByText('Disabled'));
    expect(screen.queryByText('D1')).not.toBeInTheDocument();
  });

  // ── Keyboard Navigation ──

  it('ArrowDown ile sonraki dugume gecilir', () => {
    render(<Tree nodes={sampleNodes} />);
    const contents = screen.getAllByTestId('tree-node-content');
    const first = contents[0] as HTMLElement;
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(contents[1]);
  });

  it('ArrowUp ile onceki dugume gecilir', () => {
    render(<Tree nodes={sampleNodes} />);
    const contents = screen.getAllByTestId('tree-node-content');
    const second = contents[1] as HTMLElement;
    second.focus();
    fireEvent.keyDown(second, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(contents[0]);
  });

  it('ArrowRight ile kapali dugum acilir', () => {
    render(<Tree nodes={sampleNodes} />);
    const rootContent = screen.getAllByTestId('tree-node-content')[0] as HTMLElement;
    rootContent.focus();
    fireEvent.keyDown(rootContent, { key: 'ArrowRight' });
    // Root should be expanded now
    expect(screen.getByText('Child 1')).toBeInTheDocument();
  });

  it('ArrowLeft ile acik dugum kapanir', () => {
    render(<Tree nodes={sampleNodes} defaultExpanded={['root']} />);
    const rootContent = screen.getAllByTestId('tree-node-content')[0] as HTMLElement;
    rootContent.focus();
    fireEvent.keyDown(rootContent, { key: 'ArrowLeft' });
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
  });

  it('Enter ile dugum secilir', () => {
    const onSelectChange = vi.fn();
    render(<Tree nodes={sampleNodes} onSelectChange={onSelectChange} />);
    const rootContent = screen.getAllByTestId('tree-node-content')[0] as HTMLElement;
    rootContent.focus();
    fireEvent.keyDown(rootContent, { key: 'Enter' });
    expect(onSelectChange).toHaveBeenCalled();
  });

  it('Space ile dugum secilir', () => {
    const onSelectChange = vi.fn();
    render(<Tree nodes={sampleNodes} onSelectChange={onSelectChange} />);
    const rootContent = screen.getAllByTestId('tree-node-content')[0] as HTMLElement;
    rootContent.focus();
    fireEvent.keyDown(rootContent, { key: ' ' });
    expect(onSelectChange).toHaveBeenCalled();
  });

  it('Home ile ilk dugume gidilir', () => {
    render(<Tree nodes={sampleNodes} defaultExpanded={['root']} />);
    const contents = screen.getAllByTestId('tree-node-content');
    const last = contents[contents.length - 1] as HTMLElement;
    last.focus();
    fireEvent.keyDown(last, { key: 'Home' });
    expect(document.activeElement).toBe(contents[0]);
  });

  it('End ile son dugume gidilir', () => {
    render(<Tree nodes={sampleNodes} />);
    const contents = screen.getAllByTestId('tree-node-content');
    const first = contents[0] as HTMLElement;
    first.focus();
    fireEvent.keyDown(first, { key: 'End' });
    expect(document.activeElement).toBe(contents[contents.length - 1]);
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Tree nodes={sampleNodes} className="my-tree" />);
    expect(screen.getByTestId('tree-root').className).toContain('my-tree');
  });

  it('style root elemana eklenir', () => {
    render(<Tree nodes={sampleNodes} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('tree-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Tree nodes={sampleNodes} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('tree-root').className).toContain('custom-root');
  });

  it('classNames.label label elemana eklenir', () => {
    render(<Tree nodes={sampleNodes} classNames={{ label: 'custom-label' }} />);
    const labels = screen.getAllByTestId('tree-label');
    expect(labels[0]?.className).toContain('custom-label');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Tree nodes={sampleNodes} styles={{ root: { padding: '20px' } }} />);
    expect(screen.getByTestId('tree-root')).toHaveStyle({ padding: '20px' });
  });

  it('styles.label label elemana eklenir', () => {
    render(<Tree nodes={sampleNodes} styles={{ label: { fontSize: '18px' } }} />);
    const labels = screen.getAllByTestId('tree-label');
    expect(labels[0]).toHaveStyle({ fontSize: '18px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Tree ref={ref} nodes={sampleNodes} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Tree (Compound)', () => {
  it('compound: dugum render edilir', () => {
    render(
      <Tree>
        <Tree.Node id="n1" label="Node 1" />
      </Tree>,
    );
    expect(screen.getByText('Node 1')).toBeInTheDocument();
  });

  it('compound: ic ice dugumler render edilir', () => {
    render(
      <Tree>
        <Tree.Node id="parent" label="Parent">
          <Tree.Node id="child" label="Child" />
        </Tree.Node>
      </Tree>,
    );
    fireEvent.click(screen.getByText('Parent'));
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('compound: size context ile aktarilir', () => {
    render(
      <Tree size="lg">
        <Tree.Node id="n1" label="LG Node" />
      </Tree>,
    );
    expect(screen.getByTestId('tree-root')).toHaveAttribute('data-size', 'lg');
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Tree classNames={{ label: 'cmp-label' }}>
        <Tree.Node id="n1" label="Styled" />
      </Tree>,
    );
    const labels = screen.getAllByTestId('tree-label');
    expect(labels[0]?.className).toContain('cmp-label');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Tree styles={{ label: { fontSize: '20px' } }}>
        <Tree.Node id="n1" label="Styled" />
      </Tree>,
    );
    const labels = screen.getAllByTestId('tree-label');
    expect(labels[0]).toHaveStyle({ fontSize: '20px' });
  });

  it('Tree.Node context disinda hata firlatir', () => {
    expect(() =>
      render(<Tree.Node id="x" label="Hata" />),
    ).toThrow();
  });

  it('compound: checkable ile checkbox gorunur', () => {
    render(
      <Tree checkable>
        <Tree.Node id="n1" label="Checkable" />
      </Tree>,
    );
    expect(screen.getByTestId('tree-checkbox')).toBeInTheDocument();
  });
});
