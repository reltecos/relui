/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import type { SidebarItem } from '@relteco/relui-core';

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ height: 500, display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: 24, background: '#f5f5f5' }}>
          <p>Ana icerik alani / Main content area</p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// ── Test verileri ──────────────────────────────────────────────

const simpleItems: SidebarItem[] = [
  { key: 'home', label: 'Ana Sayfa', icon: 'H', href: '/' },
  { key: 'products', label: 'Urunler', icon: 'P', href: '/products' },
  { key: 'orders', label: 'Siparisler', icon: 'S', href: '/orders' },
  { key: 'customers', label: 'Musteriler', icon: 'M', href: '/customers' },
  { key: 'about', label: 'Hakkinda', icon: 'A', href: '/about' },
];

const groupedItems: SidebarItem[] = [
  { key: 'home', label: 'Ana Sayfa', icon: 'H' },
  { key: 'sec-nav', label: 'Navigasyon', sectionHeader: true },
  {
    key: 'products',
    label: 'Urunler',
    icon: 'P',
    children: [
      { key: 'all-products', label: 'Tum Urunler' },
      { key: 'categories', label: 'Kategoriler' },
      { key: 'inventory', label: 'Envanter' },
    ],
  },
  {
    key: 'settings',
    label: 'Ayarlar',
    icon: 'S',
    children: [
      { key: 'profile', label: 'Profil' },
      { key: 'security', label: 'Guvenlik' },
      { key: 'notifications', label: 'Bildirimler' },
    ],
  },
  { key: 'div-1', label: '', divider: true },
  { key: 'sec-other', label: 'Diger', sectionHeader: true },
  { key: 'help', label: 'Yardim', icon: 'Y' },
  { key: 'logout', label: 'Cikis', icon: 'C' },
];

const badgeItems: SidebarItem[] = [
  { key: 'inbox', label: 'Gelen Kutusu', icon: 'G', badge: '12' },
  { key: 'sent', label: 'Gonderilenler', icon: 'S' },
  { key: 'drafts', label: 'Taslaklar', icon: 'T', badge: '3' },
  { key: 'spam', label: 'Spam', icon: 'X', badge: '99+' },
  { key: 'trash', label: 'Cop Kutusu', icon: 'C' },
];

// ── Stories ────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    items: simpleItems,
    defaultActiveKey: 'home',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, height: 400 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Sidebar
          key={size}
          items={simpleItems.slice(0, 3)}
          size={size}
          defaultActiveKey="home"
          header={<div style={{ fontWeight: 600 }}>{size.toUpperCase()}</div>}
          showCollapseButton={false}
        />
      ))}
    </div>
  ),
  decorators: [],
};

export const WithGroups: Story = {
  args: {
    items: groupedItems,
    defaultActiveKey: 'home',
    defaultExpandedKeys: ['products'],
    header: <div style={{ fontWeight: 700, fontSize: 16 }}>RelUI Panel</div>,
  },
};

export const WithBadges: Story = {
  args: {
    items: badgeItems,
    defaultActiveKey: 'inbox',
    header: <div style={{ fontWeight: 700, fontSize: 16 }}>Posta</div>,
  },
};

export const Collapsed: Story = {
  args: {
    items: simpleItems,
    defaultCollapsed: true,
    defaultActiveKey: 'home',
  },
};

export const PositionRight: Story = {
  args: {
    items: simpleItems,
    position: 'right',
    defaultActiveKey: 'home',
  },
  decorators: [
    (Story) => (
      <div style={{ height: 500, display: 'flex' }}>
        <div style={{ flex: 1, padding: 24, background: '#f5f5f5' }}>
          <p>Ana icerik alani / Main content area</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const HeaderAndFooter: Story = {
  args: {
    items: groupedItems,
    defaultActiveKey: 'home',
    defaultExpandedKeys: ['products'],
    header: (
      <div style={{ fontWeight: 700, fontSize: 18 }}>
        RelUI
      </div>
    ),
    footer: (
      <div style={{ fontSize: 11, opacity: 0.6 }}>
        v1.0.0 — Relteco LLC
      </div>
    ),
  },
};

export const DisabledItems: Story = {
  args: {
    items: [
      { key: 'home', label: 'Ana Sayfa', icon: 'H' },
      { key: 'products', label: 'Urunler', icon: 'P' },
      { key: 'premium', label: 'Premium', icon: 'X', disabled: true },
      { key: 'admin', label: 'Admin', icon: 'A', disabled: true },
      { key: 'settings', label: 'Ayarlar', icon: 'S' },
    ],
    defaultActiveKey: 'home',
  },
};

export const WithRenderIcon: Story = {
  args: {
    items: simpleItems,
    defaultActiveKey: 'home',
    renderIcon: (icon: string) => (
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#3b82f6',
          color: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {icon}
      </span>
    ),
  },
};

export const Controlled: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('home');
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div style={{ display: 'flex', height: 500 }}>
        <Sidebar
          items={groupedItems}
          defaultExpandedKeys={['products', 'settings']}
          defaultActiveKey={activeKey}
          onActiveChange={setActiveKey}
          onCollapseChange={setCollapsed}
          header={
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              {collapsed ? 'R' : 'RelUI Panel'}
            </div>
          }
          footer={
            <div style={{ fontSize: 11, opacity: 0.6 }}>
              Aktif: {activeKey}
            </div>
          }
        />
        <div style={{ flex: 1, padding: 24, background: '#f5f5f5' }}>
          <p>
            <strong>Aktif oge:</strong> {activeKey}
          </p>
          <p>
            <strong>Daraltilmis:</strong> {collapsed ? 'Evet' : 'Hayir'}
          </p>
        </div>
      </div>
    );
  },
  decorators: [],
};

export const CustomSlotStyles: Story = {
  args: {
    items: groupedItems,
    defaultActiveKey: 'home',
    defaultExpandedKeys: ['products'],
    header: <div style={{ fontWeight: 700, color: '#fff' }}>Dark Panel</div>,
    classNames: {
      root: 'dark-sidebar',
    },
    styles: {
      root: {
        background: '#1e1e2e',
        borderColor: '#313244',
        color: '#cdd6f4',
      },
      header: {
        borderColor: '#313244',
      },
      item: {
        color: '#a6adc8',
      },
      groupTrigger: {
        color: '#a6adc8',
      },
      sectionHeader: {
        color: '#585b70',
      },
      divider: {
        background: '#313244',
      },
      collapseButton: {
        color: '#a6adc8',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    items: groupedItems,
    size: 'md',
    position: 'left',
    defaultActiveKey: 'home',
    defaultExpandedKeys: ['products'],
    showCollapseButton: true,
    header: <div style={{ fontWeight: 700, fontSize: 16 }}>Playground</div>,
    footer: <div style={{ fontSize: 11, opacity: 0.6 }}>Footer</div>,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    position: {
      control: 'select',
      options: ['left', 'right'],
    },
    showCollapseButton: {
      control: 'boolean',
    },
  },
};
