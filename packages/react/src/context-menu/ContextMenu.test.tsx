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
import { ContextMenu } from './ContextMenu';
import type { ContextMenuItem } from '@relteco/relui-core';

const sampleItems: ContextMenuItem[] = [
  { id: 'cut', label: 'Kes', shortcut: 'Ctrl+X' },
  { id: 'copy', label: 'Kopyala', shortcut: 'Ctrl+C' },
  { id: 'paste', label: 'Yapistir', shortcut: 'Ctrl+V' },
  { id: 'sep1', type: 'separator' },
  { id: 'delete', label: 'Sil', disabled: true },
  {
    id: 'more',
    label: 'Daha fazla',
    type: 'submenu',
    children: [
      { id: 'sub1', label: 'Alt oge 1' },
      { id: 'sub2', label: 'Alt oge 2' },
    ],
  },
];

function TestContextMenu(props: Partial<React.ComponentProps<typeof ContextMenu>> = {}) {
  return (
    <ContextMenu items={sampleItems} {...props}>
      <div data-testid="trigger" style={{ width: 200, height: 100 }}>
        Sag tikla
      </div>
    </ContextMenu>
  );
}

describe('ContextMenu', () => {
  // ── Render ──

  it('trigger render edilir', () => {
    render(<TestContextMenu />);
    expect(screen.getByTestId('trigger')).toBeInTheDocument();
  });

  it('varsayilan olarak menu gorunmez', () => {
    render(<TestContextMenu />);
    expect(screen.queryByTestId('context-menu')).not.toBeInTheDocument();
  });

  // ── Sag tik ile acma ──

  it('sag tik ile menu acilir', () => {
    render(<TestContextMenu />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByTestId('context-menu')).toBeInTheDocument();
  });

  it('menu ogeleri render edilir', () => {
    render(<TestContextMenu />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByText('Kes')).toBeInTheDocument();
    expect(screen.getByText('Kopyala')).toBeInTheDocument();
    expect(screen.getByText('Yapistir')).toBeInTheDocument();
  });

  it('separator render edilir', () => {
    render(<TestContextMenu />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByTestId('context-menu-separator')).toBeInTheDocument();
  });

  it('shortcut gosterilir', () => {
    render(<TestContextMenu />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    const shortcuts = screen.getAllByTestId('context-menu-shortcut');
    expect(shortcuts.length).toBe(3);
    expect(shortcuts[0]).toHaveTextContent('Ctrl+X');
  });

  // ── Select ──

  it('oge tiklaninca onSelect cagirilir ve menu kapanir', () => {
    const onSelect = vi.fn();
    render(<TestContextMenu onSelect={onSelect} />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    fireEvent.click(screen.getByText('Kes'));
    expect(onSelect).toHaveBeenCalledWith('cut');
    expect(screen.queryByTestId('context-menu')).not.toBeInTheDocument();
  });

  it('disabled oge tiklaninca secilmez', () => {
    const onSelect = vi.fn();
    render(<TestContextMenu onSelect={onSelect} />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    fireEvent.click(screen.getByText('Sil'));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByTestId('context-menu')).toBeInTheDocument();
  });

  // ── Escape ──

  it('Escape ile kapanir', () => {
    render(<TestContextMenu />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByTestId('context-menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('context-menu')).not.toBeInTheDocument();
  });

  // ── Outside click ──

  it('dis tiklamada kapanir', () => {
    render(
      <div>
        <TestContextMenu />
        <div data-testid="outside">Outside</div>
      </div>,
    );
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByTestId('context-menu')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByTestId('context-menu')).not.toBeInTheDocument();
  });

  // ── Submenu ──

  it('submenu ogesine hover ile alt menu acilir', () => {
    render(<TestContextMenu />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    fireEvent.mouseEnter(screen.getByText('Daha fazla'));
    expect(screen.getByTestId('context-menu-submenu')).toBeInTheDocument();
    expect(screen.getByText('Alt oge 1')).toBeInTheDocument();
  });

  it('submenu icindeki oge secilebilir', () => {
    const onSelect = vi.fn();
    render(<TestContextMenu onSelect={onSelect} />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    fireEvent.mouseEnter(screen.getByText('Daha fazla'));
    fireEvent.click(screen.getByText('Alt oge 1'));
    expect(onSelect).toHaveBeenCalledWith('sub1');
  });

  // ── A11y ──

  it('menu role=menu set edilir', () => {
    render(<TestContextMenu />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByTestId('context-menu')).toHaveAttribute('role', 'menu');
  });

  it('item role=menuitem set edilir', () => {
    render(<TestContextMenu />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    const menuItems = screen.getAllByTestId('context-menu-item');
    menuItems.forEach((item) => {
      expect(item).toHaveAttribute('role', 'menuitem');
    });
  });

  it('disabled item aria-disabled set edilir', () => {
    render(<TestContextMenu />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    const deleteItem = screen.getByText('Sil').closest('[role="menuitem"]') as HTMLElement;
    expect(deleteItem).toHaveAttribute('aria-disabled', 'true');
  });

  it('separator role=separator set edilir', () => {
    render(<TestContextMenu />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByTestId('context-menu-separator')).toHaveAttribute('role', 'separator');
  });

  // ── Keyboard navigation ──

  it('ArrowDown ile sonraki oge vurgulanir', () => {
    render(<TestContextMenu />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    const menu = screen.getByTestId('context-menu');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });

    const items = screen.getAllByTestId('context-menu-item');
    const highlighted = items.find((item) => item.getAttribute('data-highlighted'));
    expect(highlighted).toBeDefined();
  });

  it('Enter ile secilir', () => {
    const onSelect = vi.fn();
    render(<TestContextMenu onSelect={onSelect} />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    const menu = screen.getByTestId('context-menu');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    fireEvent.keyDown(menu, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalled();
  });

  // ── className & style ──

  it('className menu elemana eklenir', () => {
    render(<TestContextMenu className="my-ctx" />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByTestId('context-menu').className).toContain('my-ctx');
  });

  it('style menu elemana eklenir', () => {
    render(<TestContextMenu style={{ padding: '20px' }} />);
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByTestId('context-menu')).toHaveStyle({ padding: '20px' });
  });

  // ── Slot API ──

  it('classNames.menu menu elemana eklenir', () => {
    render(
      <TestContextMenu classNames={{ menu: 'custom-menu' }} />,
    );
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByTestId('context-menu').className).toContain('custom-menu');
  });

  it('styles.menu menu elemana eklenir', () => {
    render(
      <TestContextMenu styles={{ menu: { padding: '16px' } }} />,
    );
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByTestId('context-menu')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: styles ──

  it('styles.menu menu elemana fontSize eklenir', () => {
    render(
      <TestContextMenu styles={{ menu: { fontSize: '14px' } }} />,
    );
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(screen.getByTestId('context-menu')).toHaveStyle({ fontSize: '14px' });
  });

  it('styles.item item elemana letterSpacing eklenir', () => {
    render(
      <TestContextMenu styles={{ item: { letterSpacing: '1px' } }} />,
    );
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    const items = screen.getAllByTestId('context-menu-item');
    expect(items[0]).toHaveStyle({ letterSpacing: '1px' });
  });

  // ── Trigger onContextMenu korunur ──

  it('trigger orijinal onContextMenu korunur', () => {
    const onCtx = vi.fn();
    render(
      <ContextMenu items={sampleItems}>
        <div data-testid="trigger" onContextMenu={onCtx}>Test</div>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(onCtx).toHaveBeenCalledTimes(1);
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(
      <ContextMenu items={sampleItems} ref={ref}>
        <div data-testid="trigger">Test</div>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByTestId('trigger'));
    expect(ref).toHaveBeenCalled();
  });
});
