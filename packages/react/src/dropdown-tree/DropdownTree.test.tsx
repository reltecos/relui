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
import { DropdownTree } from './DropdownTree';
import type { TreeNode } from '@relteco/relui-core';

// ── Test verileri ───────────────────────────────────────────────────

const sampleNodes: TreeNode[] = [
  {
    value: 'fruits',
    label: 'Meyveler',
    children: [
      { value: 'apple', label: 'Elma' },
      { value: 'banana', label: 'Muz' },
      { value: 'cherry', label: 'Kiraz', disabled: true },
    ],
  },
  {
    value: 'vegetables',
    label: 'Sebzeler',
    children: [
      { value: 'carrot', label: 'Havuc' },
      {
        value: 'greens',
        label: 'Yesillikler',
        children: [
          { value: 'spinach', label: 'Ispanak' },
          { value: 'lettuce', label: 'Marul' },
        ],
      },
    ],
  },
  { value: 'bread', label: 'Ekmek' },
];

// ── Render ──────────────────────────────────────────────────────────

describe('DropdownTree', () => {
  it('render edilir', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Secin" />);
    expect(screen.getByText('Secin')).toBeInTheDocument();
  });

  it('trigger combobox role ine sahip', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Sec" />);
    const trigger = screen.getByRole('combobox');

    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'tree');
  });

  it('defaultValue ile secili deger gosterir', () => {
    render(
      <DropdownTree nodes={sampleNodes} defaultValue="apple" expandAll />,
    );

    expect(screen.getByText('Elma')).toBeInTheDocument();
  });

  // ── Dropdown ac/kapa ───────────────────────────────────────────

  it('click ile dropdown acar', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Sec" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // Kok dugumleri gorunmeli
    expect(screen.getByText('Meyveler')).toBeInTheDocument();
    expect(screen.getByText('Sebzeler')).toBeInTheDocument();
    expect(screen.getByText('Ekmek')).toBeInTheDocument();
  });

  it('ikinci click ile kapatir', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Sec" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('Escape ile kapatir', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Sec" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  // ── Expand & Select (single) ───────────────────────────────────

  it('leaf node secer ve kapatir', () => {
    const handleChange = vi.fn();
    render(
      <DropdownTree
        nodes={sampleNodes}
        placeholder="Sec"
        onValueChange={handleChange}
      />,
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByText('Ekmek'));

    expect(handleChange).toHaveBeenCalledWith('bread');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('parent node tiklaninca expand eder', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Sec" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByText('Meyveler'));

    // Cocuk dugumler gorunmeli
    expect(screen.getByText('Elma')).toBeInTheDocument();
    expect(screen.getByText('Muz')).toBeInTheDocument();
  });

  it('expandAll tum cocuklari gosterir', () => {
    render(
      <DropdownTree nodes={sampleNodes} placeholder="Sec" expandAll />,
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);

    expect(screen.getByText('Ispanak')).toBeInTheDocument();
    expect(screen.getByText('Marul')).toBeInTheDocument();
  });

  it('cocuk secildikten sonra deger gosterir', () => {
    render(
      <DropdownTree nodes={sampleNodes} placeholder="Sec" expandAll />,
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByText('Elma'));

    expect(screen.getByText('Elma')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  // ── Multiple mode ──────────────────────────────────────────────

  it('multiple mode coklu secim yapar', () => {
    const handleChange = vi.fn();
    render(
      <DropdownTree
        nodes={sampleNodes}
        selectionMode="multiple"
        expandAll
        onValuesChange={handleChange}
      />,
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByText('Elma'));

    expect(handleChange).toHaveBeenCalled();
    // Dropdown acik kalmali
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('multiple mode defaultValues ile baslar', () => {
    render(
      <DropdownTree
        nodes={sampleNodes}
        selectionMode="multiple"
        defaultValues={['apple', 'carrot']}
      />,
    );

    // Tags gorunmeli
    expect(screen.getByText('Elma')).toBeInTheDocument();
    expect(screen.getByText('Havuc')).toBeInTheDocument();
  });

  // ── Keyboard ──────────────────────────────────────────────────

  it('ArrowDown ile acar', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Sec" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('Enter ile acar', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Sec" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.keyDown(trigger, { key: 'Enter' });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('ArrowRight ile expand eder', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Sec" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    // Highlight ilk dugumde (Meyveler)
    fireEvent.keyDown(trigger, { key: 'ArrowRight' });

    expect(screen.getByText('Elma')).toBeInTheDocument();
  });

  it('ArrowLeft ile collapse eder', () => {
    render(
      <DropdownTree nodes={sampleNodes} placeholder="Sec" expandAll />,
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    // Highlight ilk dugumde (Meyveler — expanded)
    fireEvent.keyDown(trigger, { key: 'ArrowLeft' });

    // Cocuklar gizlenmeli
    expect(screen.queryByText('Elma')).not.toBeInTheDocument();
  });

  // ── Disabled & ReadOnly ───────────────────────────────────────

  it('disabled durumda acilamaz', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Sec" disabled />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-disabled', '');
  });

  it('readOnly durumda acilamaz', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Sec" readOnly />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-readonly', '');
  });

  it('disabled node secilemez', () => {
    const handleChange = vi.fn();
    render(
      <DropdownTree
        nodes={sampleNodes}
        expandAll
        onValueChange={handleChange}
      />,
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByText('Kiraz'));

    expect(handleChange).not.toHaveBeenCalled();
  });

  // ── Props forwarding ──────────────────────────────────────────

  it('id dogru iletilir', () => {
    const { container } = render(
      <DropdownTree nodes={sampleNodes} id="my-tree" />,
    );

    expect(container.querySelector('#my-tree')).toBeInTheDocument();
  });

  it('className dogru iletilir', () => {
    const { container } = render(
      <DropdownTree nodes={sampleNodes} className="custom" />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass('custom');
  });

  it('aria-label dogru set edilir', () => {
    render(<DropdownTree nodes={sampleNodes} aria-label="Kategori" />);

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', 'Kategori');
  });

  it('name ile hidden input render eder', () => {
    const { container } = render(
      <DropdownTree
        nodes={sampleNodes}
        name="category"
        defaultValue="apple"
      />,
    );

    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden).toBeInTheDocument();
    expect(hidden.name).toBe('category');
    expect(hidden.value).toBe('apple');
  });

  it('multiple mode name ile comma-separated hidden input', () => {
    const { container } = render(
      <DropdownTree
        nodes={sampleNodes}
        name="categories"
        selectionMode="multiple"
        defaultValues={['apple', 'carrot']}
      />,
    );

    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden).toBeInTheDocument();
    expect(hidden.value).toContain('apple');
    expect(hidden.value).toContain('carrot');
  });

  // ── onOpenChange ──────────────────────────────────────────────

  it('onOpenChange acma/kapama callback', () => {
    const handleOpen = vi.fn();
    render(
      <DropdownTree
        nodes={sampleNodes}
        placeholder="Sec"
        onOpenChange={handleOpen}
      />,
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);
    expect(handleOpen).toHaveBeenCalledWith(true);

    fireEvent.click(trigger);
    expect(handleOpen).toHaveBeenCalledWith(false);
  });

  // ── Tree a11y ─────────────────────────────────────────────────

  it('panel tree role une sahip', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Sec" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);

    expect(screen.getByRole('tree')).toBeInTheDocument();
  });

  it('multiple modda aria-multiselectable true', () => {
    render(
      <DropdownTree
        nodes={sampleNodes}
        selectionMode="multiple"
        placeholder="Sec"
      />,
    );
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);

    expect(screen.getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('treeitem role leri doğru', () => {
    render(<DropdownTree nodes={sampleNodes} placeholder="Sec" />);
    const trigger = screen.getByRole('combobox');

    fireEvent.click(trigger);

    const treeitems = screen.getAllByRole('treeitem');
    expect(treeitems.length).toBe(3); // kok dugumler
  });
});

// ── classNames & styles ────────────────────────────────────────────

describe('DropdownTree — classNames & styles', () => {
  it('classNames.root uygulanir', () => {
    const { container } = render(
      <DropdownTree nodes={sampleNodes} classNames={{ root: 'slot-root' }} />,
    );

    expect(container.firstElementChild).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = render(
      <DropdownTree nodes={sampleNodes} styles={{ root: { padding: '10px' } }} />,
    );

    expect(container.firstElementChild).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = render(
      <DropdownTree nodes={sampleNodes} className="legacy" classNames={{ root: 'slot-root' }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass('legacy');
    expect(root).toHaveClass('slot-root');
  });

  it('classNames.trigger uygulanir', () => {
    render(
      <DropdownTree nodes={sampleNodes} classNames={{ trigger: 'my-trigger' }} />,
    );

    expect(screen.getByRole('combobox')).toHaveClass('my-trigger');
  });

  it('styles.trigger uygulanir', () => {
    render(
      <DropdownTree nodes={sampleNodes} styles={{ trigger: { fontSize: '20px' } }} />,
    );

    expect(screen.getByRole('combobox')).toHaveStyle({ fontSize: '20px' });
  });

  it('classNames.panel uygulanir', () => {
    render(
      <DropdownTree nodes={sampleNodes} classNames={{ panel: 'my-panel' }} />,
    );

    fireEvent.click(screen.getByRole('combobox'));

    expect(screen.getByRole('tree')).toHaveClass('my-panel');
  });

  it('classNames.node uygulanir', () => {
    render(
      <DropdownTree nodes={sampleNodes} classNames={{ node: 'my-node' }} />,
    );

    fireEvent.click(screen.getByRole('combobox'));

    const treeitems = screen.getAllByRole('treeitem');
    expect(treeitems[0]).toHaveClass('my-node');
  });

  it('styles.node uygulanir', () => {
    render(
      <DropdownTree nodes={sampleNodes} styles={{ node: { letterSpacing: '2px' } }} />,
    );

    fireEvent.click(screen.getByRole('combobox'));

    const treeitems = screen.getAllByRole('treeitem');
    expect(treeitems[0]).toHaveStyle({ letterSpacing: '2px' });
  });
});
