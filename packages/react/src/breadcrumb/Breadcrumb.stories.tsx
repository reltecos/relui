/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';
import type { BreadcrumbItem } from '@relteco/relui-core';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

// ── Ortak veri ──────────────────────────────────────────────────────

const simpleItems: BreadcrumbItem[] = [
  { key: 'home', label: 'Ana Sayfa', href: '/' },
  { key: 'products', label: 'Urunler', href: '/products' },
  { key: 'detail', label: 'Urun Detayi' },
];

const longItems: BreadcrumbItem[] = [
  { key: 'home', label: 'Ana Sayfa', href: '/' },
  { key: 'electronics', label: 'Elektronik', href: '/electronics' },
  { key: 'computers', label: 'Bilgisayar', href: '/electronics/computers' },
  { key: 'laptops', label: 'Dizustu', href: '/electronics/computers/laptops' },
  { key: 'brand', label: 'Apple', href: '/electronics/computers/laptops/apple' },
  { key: 'model', label: 'MacBook Pro 16"', href: '/electronics/computers/laptops/apple/mbp16' },
  { key: 'config', label: 'M4 Max / 64GB' },
];

// ── Default ─────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    items: simpleItems,
    size: 'md',
  },
};

// ── All Sizes ───────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size}>
          <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
            {size}
          </span>
          <Breadcrumb items={simpleItems} size={size} />
        </div>
      ))}
    </div>
  ),
};

// ── Collapsed ───────────────────────────────────────────────────────

export const Collapsed: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          maxItems=4, varsayilan (1 bas + ... + 1 son)
        </span>
        <Breadcrumb items={longItems} maxItems={4} />
      </div>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          maxItems=4, itemsBeforeCollapse=2, itemsAfterCollapse=2
        </span>
        <Breadcrumb
          items={longItems}
          maxItems={4}
          itemsBeforeCollapse={2}
          itemsAfterCollapse={2}
        />
      </div>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          maxItems=3, itemsBeforeCollapse=1, itemsAfterCollapse=2
        </span>
        <Breadcrumb
          items={longItems}
          maxItems={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={2}
        />
      </div>
    </div>
  ),
};

// ── Custom Separator ────────────────────────────────────────────────

export const CustomSeparator: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          Separator: &gt;
        </span>
        <Breadcrumb items={simpleItems} separator=">" />
      </div>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          Separator: →
        </span>
        <Breadcrumb items={simpleItems} separator="→" />
      </div>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          Separator: |
        </span>
        <Breadcrumb items={simpleItems} separator="|" />
      </div>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          Separator: custom SVG
        </span>
        <Breadcrumb
          items={simpleItems}
          separator={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          }
        />
      </div>
    </div>
  ),
};

// ── Disabled Items ──────────────────────────────────────────────────

export const DisabledItems: Story = {
  render: () => (
    <Breadcrumb
      items={[
        { key: 'home', label: 'Ana Sayfa', href: '/' },
        { key: 'archived', label: 'Arsiv', href: '/archive', disabled: true },
        { key: 'products', label: 'Urunler', href: '/products' },
        { key: 'detail', label: 'Urun Detayi' },
      ]}
    />
  ),
};

// ── Custom Slot Styles ──────────────────────────────────────────────

export const CustomSlotStyles: Story = {
  render: () => (
    <Breadcrumb
      items={simpleItems}
      classNames={{
        list: 'custom-bc-list',
      }}
      styles={{
        root: { fontFamily: 'monospace' },
        separator: { opacity: '1', fontSize: '16px' },
        link: { letterSpacing: '0.5px' },
      }}
    />
  ),
};

// ── Playground ──────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    items: longItems,
    size: 'md',
    maxItems: 4,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 1,
    separator: '/',
  },
};
