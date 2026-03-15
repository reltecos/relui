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
import { DropdownMenu } from './DropdownMenu';
import type { ContextMenuItem } from '@relteco/relui-core';

const sampleItems: ContextMenuItem[] = [
  { id: 'edit', label: 'Duzenle', shortcut: 'Ctrl+E' },
  { id: 'duplicate', label: 'Cokla' },
  { id: 'sep1', type: 'separator' },
  { id: 'archive', label: 'Arsivle', disabled: true },
  { id: 'delete', label: 'Sil' },
  {
    id: 'share',
    label: 'Paylas',
    type: 'submenu',
    children: [
      { id: 'email', label: 'E-posta' },
      { id: 'link', label: 'Link' },
    ],
  },
];

function TestDropdownMenu(props: Partial<React.ComponentProps<typeof DropdownMenu>> = {}) {
  return (
    <DropdownMenu
      trigger={<button>Islemler</button>}
      items={sampleItems}
      {...props}
    />
  );
}

describe('DropdownMenu', () => {
  // ── Render ──

  it('trigger render edilir', () => {
    render(<TestDropdownMenu />);
    expect(screen.getByText('Islemler')).toBeInTheDocument();
  });

  it('varsayilan olarak menu gorunmez', () => {
    render(<TestDropdownMenu />);
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  // ── Toggle ──

  it('trigger tiklaninca menu acilir', () => {
    render(<TestDropdownMenu />);
    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('tekrar tiklaninca kapanir', () => {
    render(<TestDropdownMenu />);
    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  // ── Items ──

  it('menu ogeleri render edilir', () => {
    render(<TestDropdownMenu />);
    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.getByText('Duzenle')).toBeInTheDocument();
    expect(screen.getByText('Cokla')).toBeInTheDocument();
    expect(screen.getByText('Sil')).toBeInTheDocument();
  });

  it('separator render edilir', () => {
    render(<TestDropdownMenu />);
    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.getByTestId('dropdown-menu-separator')).toBeInTheDocument();
  });

  it('shortcut gosterilir', () => {
    render(<TestDropdownMenu />);
    fireEvent.click(screen.getByText('Islemler'));
    const shortcuts = screen.getAllByTestId('dropdown-menu-shortcut');
    expect(shortcuts.length).toBe(1);
    expect(shortcuts[0]).toHaveTextContent('Ctrl+E');
  });

  // ── Select ──

  it('oge tiklaninca onSelect cagirilir ve menu kapanir', () => {
    const onSelect = vi.fn();
    render(<TestDropdownMenu onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Islemler'));
    fireEvent.click(screen.getByText('Duzenle'));
    expect(onSelect).toHaveBeenCalledWith('edit');
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  it('disabled oge tiklaninca secilmez', () => {
    const onSelect = vi.fn();
    render(<TestDropdownMenu onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Islemler'));
    fireEvent.click(screen.getByText('Arsivle'));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  // ── Escape ──

  it('Escape ile kapanir', () => {
    render(<TestDropdownMenu />);
    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  // ── Outside click ──

  it('dis tiklamada kapanir', () => {
    render(
      <div>
        <TestDropdownMenu />
        <div data-testid="outside">Outside</div>
      </div>,
    );
    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  // ── Submenu ──

  it('submenu ogesine hover ile alt menu acilir', () => {
    render(<TestDropdownMenu />);
    fireEvent.click(screen.getByText('Islemler'));
    fireEvent.mouseEnter(screen.getByText('Paylas'));
    expect(screen.getByTestId('dropdown-menu-submenu')).toBeInTheDocument();
    expect(screen.getByText('E-posta')).toBeInTheDocument();
  });

  it('submenu ogesi secilebilir', () => {
    const onSelect = vi.fn();
    render(<TestDropdownMenu onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Islemler'));
    fireEvent.mouseEnter(screen.getByText('Paylas'));
    fireEvent.click(screen.getByText('E-posta'));
    expect(onSelect).toHaveBeenCalledWith('email');
  });

  // ── A11y ──

  it('menu role=menu set edilir', () => {
    render(<TestDropdownMenu />);
    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.getByTestId('dropdown-menu')).toHaveAttribute('role', 'menu');
  });

  it('trigger aria-expanded set edilir', () => {
    render(<TestDropdownMenu />);
    const button = screen.getByText('Islemler');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('trigger aria-haspopup=menu set edilir', () => {
    render(<TestDropdownMenu />);
    expect(screen.getByText('Islemler')).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('disabled item aria-disabled set edilir', () => {
    render(<TestDropdownMenu />);
    fireEvent.click(screen.getByText('Islemler'));
    const archiveItem = screen.getByText('Arsivle').closest('[role="menuitem"]') as HTMLElement;
    expect(archiveItem).toHaveAttribute('aria-disabled', 'true');
  });

  // ── Keyboard ──

  it('ArrowDown ile sonraki oge vurgulanir', () => {
    render(<TestDropdownMenu />);
    fireEvent.click(screen.getByText('Islemler'));
    const menu = screen.getByTestId('dropdown-menu');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    const items = screen.getAllByTestId('dropdown-menu-item');
    const highlighted = items.find((item) => item.getAttribute('data-highlighted'));
    expect(highlighted).toBeDefined();
  });

  it('Enter ile secilir', () => {
    const onSelect = vi.fn();
    render(<TestDropdownMenu onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Islemler'));
    const menu = screen.getByTestId('dropdown-menu');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    fireEvent.keyDown(menu, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalled();
  });

  // ── Placement ──

  it('placement data attribute set edilir', () => {
    render(<TestDropdownMenu placement="bottom-end" />);
    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.getByTestId('dropdown-menu')).toHaveAttribute('data-placement', 'bottom-end');
  });

  // ── Chevron ──

  it('showChevron=false ise chevron gizli', () => {
    render(<TestDropdownMenu showChevron={false} />);
    const wrapper = screen.getByTestId('dropdown-menu-trigger-wrapper');
    // ChevronDown yoksa sadece trigger text olur
    expect(wrapper.querySelectorAll('svg').length).toBe(0);
  });

  // ── className & style ──

  it('className menu elemana eklenir', () => {
    render(<TestDropdownMenu className="my-dropdown" />);
    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.getByTestId('dropdown-menu').className).toContain('my-dropdown');
  });

  it('style menu elemana eklenir', () => {
    render(<TestDropdownMenu style={{ padding: '20px' }} />);
    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.getByTestId('dropdown-menu')).toHaveStyle({ padding: '20px' });
  });

  // ── Slot API ──

  it('classNames.menu menu elemana eklenir', () => {
    render(
      <TestDropdownMenu classNames={{ menu: 'custom-menu' }} />,
    );
    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.getByTestId('dropdown-menu').className).toContain('custom-menu');
  });

  it('styles.menu menu elemana eklenir', () => {
    render(
      <TestDropdownMenu styles={{ menu: { padding: '16px' } }} />,
    );
    fireEvent.click(screen.getByText('Islemler'));
    expect(screen.getByTestId('dropdown-menu')).toHaveStyle({ padding: '16px' });
  });

  // ── Trigger onClick korunur ──

  it('trigger orijinal onClick korunur', () => {
    const onClick = vi.fn();
    render(
      <DropdownMenu trigger={<button onClick={onClick}>Click</button>} items={sampleItems} />,
    );
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
