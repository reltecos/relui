/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu } from './DropdownMenu';
import type { ContextMenuItem } from '@relteco/relui-core';
import { FilePlusIcon, CopyIcon, SaveIcon, ScissorsIcon } from '@relteco/relui-icons';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Overlay/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 6,
  border: '1px solid var(--rel-color-border, #d1d5db)',
  background: 'var(--rel-color-bg, #fff)',
  cursor: 'pointer',
  fontFamily: 'system-ui, sans-serif',
  fontSize: 14,
};

// ── Default ─────────────────────────────────────────

const defaultItems: ContextMenuItem[] = [
  { id: 'new', label: 'Yeni Dosya', shortcut: 'Ctrl+N', icon: <FilePlusIcon size={14} /> },
  { id: 'save', label: 'Kaydet', shortcut: 'Ctrl+S', icon: <SaveIcon size={14} /> },
  { id: 'sep1', type: 'separator' },
  { id: 'cut', label: 'Kes', shortcut: 'Ctrl+X', icon: <ScissorsIcon size={14} /> },
  { id: 'copy', label: 'Kopyala', shortcut: 'Ctrl+C', icon: <CopyIcon size={14} /> },
  { id: 'sep2', type: 'separator' },
  { id: 'disabled-item', label: 'Devre Disi', disabled: true },
];

export const Default: Story = {
  render: () => (
    <div style={{ padding: 40 }}>
      <DropdownMenu
        trigger={<button style={buttonStyle}>Dosya</button>}
        items={defaultItems}
        onSelect={(id) => alert(`Secilen: ${id}`)}
      />
    </div>
  ),
};

// ── WithSubmenu ─────────────────────────────────────

const submenuItems: ContextMenuItem[] = [
  { id: 'edit', label: 'Duzenle' },
  { id: 'duplicate', label: 'Cokla' },
  { id: 'sep1', type: 'separator' },
  {
    id: 'move',
    label: 'Tasi',
    type: 'submenu',
    children: [
      { id: 'move-top', label: 'Basa' },
      { id: 'move-bottom', label: 'Sona' },
      { id: 'move-folder', label: 'Klasore' },
    ],
  },
  {
    id: 'share',
    label: 'Paylas',
    type: 'submenu',
    children: [
      { id: 'share-email', label: 'E-posta' },
      { id: 'share-link', label: 'Link kopyala' },
    ],
  },
  { id: 'sep2', type: 'separator' },
  { id: 'delete', label: 'Sil' },
];

export const WithSubmenu: Story = {
  render: () => (
    <div style={{ padding: 40 }}>
      <DropdownMenu
        trigger={<button style={buttonStyle}>Islemler</button>}
        items={submenuItems}
        onSelect={(id) => alert(`Secilen: ${id}`)}
      />
    </div>
  ),
};

// ── CustomSlotStyles ────────────────────────────────

export const CustomSlotStyles: Story = {
  render: () => (
    <div style={{ padding: 40 }}>
      <DropdownMenu
        trigger={
          <button style={{ ...buttonStyle, background: 'var(--rel-color-info, #6366f1)', color: 'var(--rel-color-text-inverse, #fff)', border: 'none' }}>
            Tema
          </button>
        }
        items={defaultItems}
        onSelect={(id) => alert(`Secilen: ${id}`)}
        styles={{
          menu: {
            backgroundColor: 'var(--rel-color-bg-inverse, #1f2937)',
            borderColor: 'var(--rel-color-bg-inverse-subtle, #374151)',
            borderRadius: 12,
          },
          item: {
            color: 'var(--rel-color-text-secondary, #e5e7eb)',
          },
          separator: {
            backgroundColor: 'var(--rel-color-bg-inverse-subtle, #374151)',
          },
        }}
      />
    </div>
  ),
};
