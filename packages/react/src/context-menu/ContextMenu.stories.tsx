/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from './ContextMenu';
import type { ContextMenuItem } from '@relteco/relui-core';
import { ScissorsIcon, ClipboardIcon, CopyIcon } from '@relteco/relui-icons';

const meta: Meta<typeof ContextMenu> = {
  title: 'Overlay/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

const triggerStyle: React.CSSProperties = {
  width: 400,
  height: 200,
  border: '2px dashed var(--rel-color-border, #d1d5db)',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'system-ui, sans-serif',
  fontSize: 14,
  color: 'var(--rel-color-text-muted, #6b7280)',
  cursor: 'context-menu',
};

// ── Default ─────────────────────────────────────────

const defaultItems: ContextMenuItem[] = [
  { id: 'cut', label: 'Kes', shortcut: 'Ctrl+X', icon: <ScissorsIcon size={14} /> },
  { id: 'copy', label: 'Kopyala', shortcut: 'Ctrl+C', icon: <CopyIcon size={14} /> },
  { id: 'paste', label: 'Yapistir', shortcut: 'Ctrl+V', icon: <ClipboardIcon size={14} /> },
  { id: 'sep1', type: 'separator' },
  { id: 'select-all', label: 'Tumunu Sec', shortcut: 'Ctrl+A' },
  { id: 'sep2', type: 'separator' },
  { id: 'delete', label: 'Sil', disabled: true },
];

export const Default: Story = {
  render: () => (
    <ContextMenu
      items={defaultItems}
      onSelect={(id) => alert(`Secilen: ${id}`)}
    >
      <div style={triggerStyle}>Sag tikla</div>
    </ContextMenu>
  ),
};

// ── WithSubmenu ─────────────────────────────────────

const submenuItems: ContextMenuItem[] = [
  { id: 'new', label: 'Yeni' },
  { id: 'open', label: 'Ac' },
  { id: 'sep1', type: 'separator' },
  {
    id: 'export',
    label: 'Disari Aktar',
    type: 'submenu',
    children: [
      { id: 'export-pdf', label: 'PDF olarak' },
      { id: 'export-png', label: 'PNG olarak' },
      { id: 'export-csv', label: 'CSV olarak' },
    ],
  },
  {
    id: 'share',
    label: 'Paylas',
    type: 'submenu',
    children: [
      { id: 'share-email', label: 'E-posta ile' },
      { id: 'share-link', label: 'Link kopyala' },
    ],
  },
  { id: 'sep2', type: 'separator' },
  { id: 'settings', label: 'Ayarlar' },
];

export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu
      items={submenuItems}
      onSelect={(id) => alert(`Secilen: ${id}`)}
    >
      <div style={triggerStyle}>Sag tikla — alt menulu</div>
    </ContextMenu>
  ),
};

// ── CustomSlotStyles ────────────────────────────────

export const CustomSlotStyles: Story = {
  render: () => (
    <ContextMenu
      items={defaultItems}
      onSelect={(id) => alert(`Secilen: ${id}`)}
      styles={{
        menu: {
          backgroundColor: 'var(--rel-color-bg-inverse, #1f2937)',
          borderColor: 'var(--rel-color-bg-inverse-subtle, #374151)',
          borderRadius: 12,
        },
        item: {
          color: 'var(--rel-color-border, #e5e7eb)',
        },
        separator: {
          backgroundColor: 'var(--rel-color-bg-inverse-subtle, #374151)',
        },
      }}
    >
      <div style={{ ...triggerStyle, border: '2px dashed var(--rel-color-bg-inverse-subtle, #4b5563)', color: 'var(--rel-color-text-muted, #9ca3af)' }}>
        Sag tikla — koyu tema
      </div>
    </ContextMenu>
  ),
};
