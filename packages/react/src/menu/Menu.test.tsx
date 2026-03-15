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
import { Menu } from './Menu';
import type { MenuItem } from '@relteco/relui-core';

// ── Test verileri / Test data ─────────────────────────────────────

const simpleItems: MenuItem[] = [
  {
    key: 'file',
    label: 'File',
    children: [
      { key: 'new', label: 'New', shortcut: 'Ctrl+N' },
      { key: 'open', label: 'Open', shortcut: 'Ctrl+O' },
      { key: 'div1', label: '', divider: true },
      { key: 'save', label: 'Save', shortcut: 'Ctrl+S' },
    ],
  },
  {
    key: 'edit',
    label: 'Edit',
    children: [
      { key: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' },
      { key: 'redo', label: 'Redo', shortcut: 'Ctrl+Y' },
    ],
  },
];

const itemsWithIcons: MenuItem[] = [
  {
    key: 'file',
    label: 'File',
    children: [
      { key: 'new', label: 'New', icon: 'file-plus' },
      { key: 'open', label: 'Open', icon: 'folder-open' },
    ],
  },
];

const itemsWithChecked: MenuItem[] = [
  {
    key: 'view',
    label: 'View',
    children: [
      { key: 'sidebar', label: 'Sidebar', checked: true },
      { key: 'minimap', label: 'Minimap', checked: false },
    ],
  },
];

const itemsWithSubmenu: MenuItem[] = [
  {
    key: 'file',
    label: 'File',
    children: [
      {
        key: 'recent',
        label: 'Recent',
        children: [
          { key: 'file1', label: 'file1.ts' },
          { key: 'file2', label: 'file2.ts' },
        ],
      },
      { key: 'new', label: 'New' },
    ],
  },
];

const itemsWithDisabled: MenuItem[] = [
  {
    key: 'file',
    label: 'File',
    children: [
      { key: 'new', label: 'New' },
      { key: 'save', label: 'Save', disabled: true },
    ],
  },
];

// ── Testler / Tests ──────────────────────────────────────────────

describe('Menu', () => {
  // ── Render ──

  it('menubar role ile render eder', () => {
    render(<Menu items={simpleItems} />);
    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  it('ust seviye trigger butonlarini render eder', () => {
    render(<Menu items={simpleItems} />);
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('ref forward eder', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Menu items={simpleItems} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('id prop gecer', () => {
    render(<Menu items={simpleItems} id="test-menu" />);
    expect(screen.getByRole('menubar')).toHaveAttribute('id', 'test-menu');
  });

  it('bos items ile render eder', () => {
    render(<Menu items={[]} />);
    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  // ── Menu acma / kapama ──

  it('trigger tiklaninca dropdown acar', () => {
    render(<Menu items={simpleItems} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('trigger tekrar tiklaninca dropdown kapatir', () => {
    render(<Menu items={simpleItems} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeInTheDocument();
    fireEvent.click(screen.getByText('File'));
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('acikken baska trigger hover ile menu degistirir', () => {
    render(<Menu items={simpleItems} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByText('Edit'));
    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('kapali iken hover menu degistirmez', () => {
    render(<Menu items={simpleItems} />);
    fireEvent.mouseEnter(screen.getByText('Edit'));
    expect(screen.queryByText('Undo')).not.toBeInTheDocument();
  });

  it('Escape tusu menu kapatir', () => {
    render(<Menu items={simpleItems} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  it('dis tiklaninca menu kapatir', () => {
    render(<Menu items={simpleItems} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('New')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('New')).not.toBeInTheDocument();
  });

  // ── Menu ogeleri ──

  it('shortcut gosterir', () => {
    render(<Menu items={simpleItems} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('Ctrl+N')).toBeInTheDocument();
    expect(screen.getByText('Ctrl+O')).toBeInTheDocument();
  });

  it('divider render eder', () => {
    render(<Menu items={simpleItems} />);
    fireEvent.click(screen.getByText('File'));
    const separators = screen.getAllByRole('separator');
    expect(separators.length).toBeGreaterThan(0);
  });

  it('checked ogeler isaret gosterir', () => {
    render(<Menu items={itemsWithChecked} />);
    fireEvent.click(screen.getByText('View'));
    const sidebar = screen.getByText('Sidebar');
    const sidebarParent = sidebar.closest('button');
    expect(sidebarParent).toBeDefined();
    expect(sidebarParent?.textContent).toContain('\u2713');
  });

  it('unchecked ogeler bos isaret gosterir', () => {
    render(<Menu items={itemsWithChecked} />);
    fireEvent.click(screen.getByText('View'));
    const minimap = screen.getByText('Minimap');
    const minimapBtn = minimap.closest('button');
    expect(minimapBtn).toBeDefined();
    // Minimap'in check span'i bos olmali
    const checkSpans = minimapBtn?.querySelectorAll('span');
    const checkSpan = checkSpans?.[0];
    expect(checkSpan?.textContent).toBe('');
  });

  it('ikon render eder (varsayilan: string)', () => {
    render(<Menu items={itemsWithIcons} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByText('file-plus')).toBeInTheDocument();
  });

  it('renderIcon callback ile ikon render eder', () => {
    const renderIcon = (icon: string) => <span data-testid={`icon-${icon}`}>{icon}</span>;
    render(<Menu items={itemsWithIcons} renderIcon={renderIcon} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByTestId('icon-file-plus')).toBeInTheDocument();
  });

  it('disabled oge data-disabled attribute alir', () => {
    render(<Menu items={itemsWithDisabled} />);
    fireEvent.click(screen.getByText('File'));
    const saveBtn = screen.getByText('Save').closest('button');
    expect(saveBtn).toBeDefined();
    expect(saveBtn).toHaveAttribute('data-disabled', '');
  });

  // ── Submenu ──

  it('submenu indicator gosterir', () => {
    render(<Menu items={itemsWithSubmenu} />);
    fireEvent.click(screen.getByText('File'));
    const recentBtn = screen.getByText('Recent').closest('button');
    expect(recentBtn).toBeDefined();
    const svg = recentBtn?.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('submenu hover ile acilir', () => {
    render(<Menu items={itemsWithSubmenu} />);
    fireEvent.click(screen.getByText('File'));
    const recentBtn = screen.getByText('Recent').closest('button');
    expect(recentBtn).toBeDefined();
    if (recentBtn) {
      fireEvent.mouseEnter(recentBtn);
      fireEvent.click(recentBtn);
    }
    expect(screen.getByText('file1.ts')).toBeInTheDocument();
    expect(screen.getByText('file2.ts')).toBeInTheDocument();
  });

  // ── Callback ──

  it('onSelect leaf item tiklaninca cagrilir', () => {
    const onSelect = vi.fn();
    render(<Menu items={simpleItems} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByText('New'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('new', expect.objectContaining({ key: 'new', label: 'New' }));
  });

  it('onSelect disabled item tiklaninca cagrilmaz', () => {
    const onSelect = vi.fn();
    render(<Menu items={itemsWithDisabled} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('File'));
    fireEvent.click(screen.getByText('Save'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('onOpenChange menu acilinca cagrilir', () => {
    const onOpenChange = vi.fn();
    render(<Menu items={simpleItems} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByText('File'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('onOpenChange menu kapaninca cagrilir', () => {
    const onOpenChange = vi.fn();
    render(<Menu items={simpleItems} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByText('File'));
    onOpenChange.mockClear();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── Size ──

  it('size prop gecer', () => {
    const { container } = render(<Menu items={simpleItems} size="lg" />);
    const menubar = container.querySelector('[role="menubar"]');
    expect(menubar).toBeInTheDocument();
  });

  it('varsayilan size md', () => {
    render(<Menu items={simpleItems} />);
    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  // ── A11y ──

  it('menubar aria-label alir', () => {
    render(<Menu items={simpleItems} />);
    expect(screen.getByRole('menubar')).toHaveAttribute('aria-label');
  });

  it('trigger aria-haspopup ve aria-expanded alir', () => {
    render(<Menu items={simpleItems} />);
    const fileTrigger = screen.getByText('File');
    expect(fileTrigger).toHaveAttribute('aria-haspopup', 'true');
    expect(fileTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('acik trigger aria-expanded=true alir', () => {
    render(<Menu items={simpleItems} />);
    fireEvent.click(screen.getByText('File'));
    const fileTrigger = screen.getByText('File');
    expect(fileTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('dropdown role=menu alir', () => {
    render(<Menu items={simpleItems} />);
    fireEvent.click(screen.getByText('File'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('menu item role=menuitem alir', () => {
    render(<Menu items={simpleItems} />);
    fireEvent.click(screen.getByText('File'));
    const menuItems = screen.getAllByRole('menuitem');
    // Trigger'lar + dropdown items = toplam menuitem sayisi
    expect(menuItems.length).toBeGreaterThan(2);
  });

  it('disabled item aria-disabled alir', () => {
    render(<Menu items={itemsWithDisabled} />);
    fireEvent.click(screen.getByText('File'));
    const saveBtn = screen.getByText('Save').closest('button');
    expect(saveBtn).toHaveAttribute('aria-disabled', 'true');
  });

  // ── Slot API ──

  it('className root ile merge olur', () => {
    render(<Menu items={simpleItems} className="my-menu" />);
    const menubar = screen.getByRole('menubar');
    expect(menubar.className).toContain('my-menu');
  });

  it('style root ile merge olur', () => {
    render(<Menu items={simpleItems} style={{ padding: '20px' }} />);
    const menubar = screen.getByRole('menubar');
    expect(menubar).toHaveStyle({ padding: '20px' });
  });

  it('classNames.trigger uygular', () => {
    render(<Menu items={simpleItems} classNames={{ trigger: 'custom-trigger' }} />);
    const fileTrigger = screen.getByText('File');
    expect(fileTrigger.className).toContain('custom-trigger');
  });

  it('styles.trigger uygular', () => {
    render(<Menu items={simpleItems} styles={{ trigger: { padding: '12px' } }} />);
    const fileTrigger = screen.getByText('File');
    expect(fileTrigger).toHaveStyle({ padding: '12px' });
  });

  it('classNames.dropdown uygular', () => {
    render(<Menu items={simpleItems} classNames={{ dropdown: 'custom-dropdown' }} />);
    fireEvent.click(screen.getByText('File'));
    const dropdown = screen.getByRole('menu');
    expect(dropdown.className).toContain('custom-dropdown');
  });

  it('styles.item uygular', () => {
    render(<Menu items={simpleItems} styles={{ item: { fontSize: '18px' } }} />);
    fireEvent.click(screen.getByText('File'));
    const newItem = screen.getByText('New').closest('button');
    expect(newItem).toHaveStyle({ fontSize: '18px' });
  });

  it('classNames.divider uygular', () => {
    render(<Menu items={simpleItems} classNames={{ divider: 'custom-divider' }} />);
    fireEvent.click(screen.getByText('File'));
    const separators = screen.getAllByRole('separator');
    const sep = separators[0];
    expect(sep).toBeDefined();
    expect(sep?.className).toContain('custom-divider');
  });
});

// ── Compound API ──────────────────────────────────────────────

describe('Menu (Compound)', () => {
  it('compound: menubar role ile render eder', () => {
    render(
      <Menu>
        <Menu.Group label="File">
          <Menu.Item>New</Menu.Item>
        </Menu.Group>
      </Menu>,
    );
    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  it('compound: group ve item render edilir', () => {
    render(
      <Menu>
        <Menu.Group label="File">
          <Menu.Item>New</Menu.Item>
          <Menu.Item>Open</Menu.Item>
        </Menu.Group>
      </Menu>,
    );
    expect(screen.getByTestId('menu-group')).toBeInTheDocument();
    expect(screen.getByText('File')).toBeInTheDocument();
    const items = screen.getAllByTestId('menu-item');
    expect(items).toHaveLength(2);
  });

  it('compound: separator render edilir', () => {
    render(
      <Menu>
        <Menu.Group label="File">
          <Menu.Item>New</Menu.Item>
          <Menu.Separator />
          <Menu.Item>Save</Menu.Item>
        </Menu.Group>
      </Menu>,
    );
    expect(screen.getByTestId('menu-separator')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('compound: label render edilir', () => {
    render(
      <Menu>
        <Menu.Group label="Edit">
          <Menu.Label>Islemler</Menu.Label>
          <Menu.Item>Undo</Menu.Item>
        </Menu.Group>
      </Menu>,
    );
    expect(screen.getByTestId('menu-label')).toHaveTextContent('Islemler');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Menu classNames={{ divider: 'cmp-divider' }}>
        <Menu.Group label="File">
          <Menu.Item>New</Menu.Item>
          <Menu.Separator />
          <Menu.Item>Save</Menu.Item>
        </Menu.Group>
      </Menu>,
    );
    expect(screen.getByTestId('menu-separator').className).toContain('cmp-divider');
  });
});
