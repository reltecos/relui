/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof Badge> = {
  title: 'Data Display/Badge',
  component: Badge,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['accent', 'neutral', 'destructive', 'success', 'warning'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'soft', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: 'Badge',
    size: 'md',
    color: 'accent',
    variant: 'solid',
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Badge color="accent">Accent</Badge>
      <Badge color="neutral">Neutral</Badge>
      <Badge color="destructive">Hata</Badge>
      <Badge color="success">Başarılı</Badge>
      <Badge color="warning">Uyarı</Badge>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Badge variant="solid" color="accent">Solid</Badge>
        <Badge variant="solid" color="success">Solid</Badge>
        <Badge variant="solid" color="destructive">Solid</Badge>
        <Badge variant="solid" color="warning">Solid</Badge>
        <Badge variant="solid" color="neutral">Solid</Badge>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Badge variant="soft" color="accent">Soft</Badge>
        <Badge variant="soft" color="success">Soft</Badge>
        <Badge variant="soft" color="destructive">Soft</Badge>
        <Badge variant="soft" color="warning">Soft</Badge>
        <Badge variant="soft" color="neutral">Soft</Badge>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Badge variant="outline" color="accent">Outline</Badge>
        <Badge variant="outline" color="success">Outline</Badge>
        <Badge variant="outline" color="destructive">Outline</Badge>
        <Badge variant="outline" color="warning">Outline</Badge>
        <Badge variant="outline" color="neutral">Outline</Badge>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Badge size="sm">Küçük</Badge>
      <Badge size="md">Orta</Badge>
      <Badge size="lg">Büyük</Badge>
    </div>
  ),
};

export const WithNumbers: Story = {
  name: 'Sayılarla / With Numbers',
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Badge color="destructive" size="sm">3</Badge>
      <Badge color="accent">42</Badge>
      <Badge color="success" size="lg">99+</Badge>
    </div>
  ),
};

export const StatusIndicators: Story = {
  name: 'Durum Göstergeleri / Status Indicators',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Badge color="success" variant="soft" size="sm">Aktif</Badge>
        <span>Sunucu çalışıyor</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Badge color="warning" variant="soft" size="sm">Bakım</Badge>
        <span>Planlı bakım</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Badge color="destructive" variant="soft" size="sm">Çevrimdışı</Badge>
        <span>Sunucu kapalı</span>
      </div>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Badge
        classNames={{ root: 'my-badge-root' }}
        styles={{ root: { letterSpacing: '0.1em', textTransform: 'uppercase' } }}
      >
        Custom
      </Badge>
      <Badge
        color="success"
        className="legacy-class"
        classNames={{ root: 'slot-class' }}
        styles={{ root: { boxShadow: '0 0 0 2px currentColor' } }}
      >
        Merged
      </Badge>
    </div>
  ),
};
