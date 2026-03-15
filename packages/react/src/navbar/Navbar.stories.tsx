/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Navbar } from './Navbar';
import type { NavbarItem } from '@relteco/relui-core';

const meta: Meta<typeof Navbar> = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

// ── Test verileri ──────────────────────────────────────────────

const simpleItems: NavbarItem[] = [
  { key: 'home', label: 'Ana Sayfa', href: '/' },
  { key: 'products', label: 'Urunler', href: '/products' },
  { key: 'pricing', label: 'Fiyatlar', href: '/pricing' },
  { key: 'about', label: 'Hakkinda', href: '/about' },
  { key: 'contact', label: 'Iletisim', href: '/contact' },
];

const iconItems: NavbarItem[] = [
  { key: 'home', label: 'Ana Sayfa', icon: 'H', href: '/' },
  { key: 'products', label: 'Urunler', icon: 'P', href: '/products' },
  { key: 'orders', label: 'Siparisler', icon: 'S', href: '/orders' },
  { key: 'settings', label: 'Ayarlar', icon: 'A', href: '/settings' },
];

// ── Stories ────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    items: simpleItems,
    defaultActiveKey: 'home',
    brand: <span style={{ fontSize: 18, fontWeight: 700 }}>RelUI</span>,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Navbar
          key={size}
          items={simpleItems.slice(0, 3)}
          size={size}
          defaultActiveKey="home"
          brand={<span style={{ fontWeight: 700 }}>{size.toUpperCase()}</span>}
        />
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['solid', 'transparent', 'blur'] as const).map((variant) => (
        <div key={variant} style={{ background: variant === 'transparent' ? '#f0f0f0' : undefined }}>
          <Navbar
            items={simpleItems.slice(0, 3)}
            variant={variant}
            defaultActiveKey="home"
            brand={<span style={{ fontWeight: 700 }}>{variant}</span>}
          />
        </div>
      ))}
    </div>
  ),
};

export const WithBrand: Story = {
  args: {
    items: simpleItems,
    defaultActiveKey: 'home',
    brand: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: '#3b82f6',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          R
        </div>
        <span style={{ fontSize: 16, fontWeight: 700 }}>RelUI</span>
      </div>
    ),
  },
};

export const WithActions: Story = {
  args: {
    items: simpleItems,
    defaultActiveKey: 'home',
    brand: <span style={{ fontSize: 16, fontWeight: 700 }}>RelUI</span>,
    actions: (
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          style={{
            padding: '6px 16px',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Giris Yap
        </button>
        <button
          type="button"
          style={{
            padding: '6px 16px',
            borderRadius: 6,
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Uye Ol
        </button>
      </div>
    ),
  },
};

export const WithIcons: Story = {
  args: {
    items: iconItems,
    defaultActiveKey: 'home',
    brand: <span style={{ fontSize: 16, fontWeight: 700 }}>Panel</span>,
    renderIcon: (icon: string) => (
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#e5e7eb',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 9,
          fontWeight: 700,
        }}
      >
        {icon}
      </span>
    ),
  },
};

export const Sticky: Story = {
  render: () => (
    <div style={{ height: 600, overflow: 'auto' }}>
      <Navbar
        items={simpleItems}
        defaultActiveKey="home"
        brand={<span style={{ fontWeight: 700 }}>Sticky</span>}
        sticky
      />
      <div style={{ padding: 24 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} style={{ margin: '16px 0', lineHeight: 1.6 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Paragraf {i + 1}.
          </p>
        ))}
      </div>
    </div>
  ),
};

export const MobileOpen: Story = {
  args: {
    items: simpleItems,
    defaultActiveKey: 'home',
    defaultMobileOpen: true,
    brand: <span style={{ fontWeight: 700 }}>RelUI</span>,
    actions: <button type="button" style={{ padding: '6px 12px', fontSize: 13 }}>Login</button>,
  },
};

export const DisabledItems: Story = {
  args: {
    items: [
      { key: 'home', label: 'Ana Sayfa', href: '/' },
      { key: 'products', label: 'Urunler', href: '/products' },
      { key: 'premium', label: 'Premium', disabled: true },
      { key: 'admin', label: 'Admin', disabled: true },
      { key: 'about', label: 'Hakkinda', href: '/about' },
    ],
    defaultActiveKey: 'home',
    brand: <span style={{ fontWeight: 700 }}>RelUI</span>,
  },
};

export const Controlled: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('home');

    return (
      <div>
        <Navbar
          items={simpleItems}
          defaultActiveKey={activeKey}
          onActiveChange={setActiveKey}
          brand={<span style={{ fontWeight: 700 }}>RelUI</span>}
          actions={
            <span style={{ fontSize: 12, opacity: 0.6 }}>Aktif: {activeKey}</span>
          }
        />
        <div style={{ padding: 24 }}>
          <p>
            <strong>Aktif sayfa:</strong> {activeKey}
          </p>
        </div>
      </div>
    );
  },
};

export const Compound: Story = {
  render: () => (
    <Navbar variant="solid" size="md">
      <Navbar.Brand>
        <span style={{ fontSize: 18, fontWeight: 700 }}>RelUI</span>
      </Navbar.Brand>
      <Navbar.Items>
        <Navbar.Item active href="/">Ana Sayfa</Navbar.Item>
        <Navbar.Item href="/products">Urunler</Navbar.Item>
        <Navbar.Item href="/pricing">Fiyatlar</Navbar.Item>
        <Navbar.Item href="/about">Hakkinda</Navbar.Item>
      </Navbar.Items>
      <Navbar.Actions>
        <button type="button" style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #d1d5db', background: 'transparent', cursor: 'pointer', fontSize: 13 }}>
          Giris Yap
        </button>
      </Navbar.Actions>
    </Navbar>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    items: simpleItems,
    defaultActiveKey: 'home',
    brand: <span style={{ fontWeight: 700, color: '#fff' }}>Dark Nav</span>,
    styles: {
      root: {
        background: '#1e1e2e',
        borderColor: '#313244',
      },
      item: {
        color: '#a6adc8',
      },
      mobileToggle: {
        color: '#a6adc8',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    items: simpleItems,
    size: 'md',
    variant: 'solid',
    defaultActiveKey: 'home',
    sticky: false,
    brand: <span style={{ fontWeight: 700 }}>Playground</span>,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'transparent', 'blur'],
    },
    sticky: {
      control: 'boolean',
    },
  },
};
