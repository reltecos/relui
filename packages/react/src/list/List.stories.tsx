/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { List } from './List';

const meta: Meta<typeof List> = {
  title: 'Data Display/List',
  component: List,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof List>;

// ── Default (Props-based) ──

export const Default: Story = {
  args: {
    items: [
      { id: '1', primary: 'Elma', secondary: 'Meyve' },
      { id: '2', primary: 'Havuc', secondary: 'Sebze' },
      { id: '3', primary: 'Ekmek', secondary: 'Firin' },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
};

// ── WithIcons ──

export const WithIcons: Story = {
  args: {
    items: [
      {
        id: '1',
        primary: 'Belgeler',
        secondary: '12 dosya',
        icon: <span style={{ fontSize: 18 }}>📄</span>,
      },
      {
        id: '2',
        primary: 'Fotograflar',
        secondary: '48 dosya',
        icon: <span style={{ fontSize: 18 }}>🖼️</span>,
      },
      {
        id: '3',
        primary: 'Muzikler',
        secondary: '120 dosya',
        icon: <span style={{ fontSize: 18 }}>🎵</span>,
      },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
};

// ── WithActions ──

export const WithActions: Story = {
  args: {
    items: [
      {
        id: '1',
        primary: 'Kullanici A',
        secondary: 'admin@example.com',
        action: (
          <button
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              background: '#fff',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Duzenle
          </button>
        ),
      },
      {
        id: '2',
        primary: 'Kullanici B',
        secondary: 'user@example.com',
        action: (
          <button
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              background: '#fff',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Duzenle
          </button>
        ),
      },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ width: 360, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <List>
        <List.Item primary="Birinci item" secondary="Compound kullanim" />
        <List.Item primary="Ikinci item" secondary="Tam kontrol" />
        <List.Item primary="Ucuncu item" />
      </List>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    items: [
      { id: '1', primary: 'Ozel stil', secondary: 'Slot API ornegi' },
      { id: '2', primary: 'Ikinci item', secondary: 'Padding arttirildi' },
    ],
    styles: {
      root: { padding: '8px' },
      item: { padding: '14px 20px' },
      itemPrimary: { fontSize: '16px', letterSpacing: '0.02em' },
      itemSecondary: { opacity: '0.7' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Playground ──

export const Playground: Story = {
  render: () => {
    const items = [
      {
        id: '1',
        primary: 'Belgeler',
        secondary: '12 dosya, 4.2 MB',
        icon: <span style={{ fontSize: 18 }}>📄</span>,
        action: (
          <button
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              background: '#fff',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Ac
          </button>
        ),
      },
      {
        id: '2',
        primary: 'Fotograflar',
        secondary: '48 dosya, 120 MB',
        icon: <span style={{ fontSize: 18 }}>🖼️</span>,
        action: (
          <button
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              background: '#fff',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Ac
          </button>
        ),
      },
      {
        id: '3',
        primary: 'Muzikler',
        secondary: '120 dosya, 1.8 GB',
        icon: <span style={{ fontSize: 18 }}>🎵</span>,
        action: (
          <button
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              background: '#fff',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Ac
          </button>
        ),
      },
      {
        id: '4',
        primary: 'Videolar',
        secondary: '8 dosya, 24 GB',
        icon: <span style={{ fontSize: 18 }}>🎬</span>,
        action: (
          <button
            style={{
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              background: '#fff',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Ac
          </button>
        ),
      },
    ];

    return (
      <div style={{ width: 400, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <List items={items} />
      </div>
    );
  },
};
