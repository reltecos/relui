/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'Veri bulunamadi',
    description: 'Henuz kayit eklenmemis. Yeni bir kayit ekleyerek baslayabilirsiniz.',
    size: 'md',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    title: 'Proje bulunamadi',
    description: 'Henuz hic proje olusturulmamis.',
    action: (
      <button
        style={{
          padding: '8px 16px',
          borderRadius: 6,
          border: 'none',
          backgroundColor: 'var(--rel-color-primary, #3b82f6)',
          color: 'var(--rel-color-text-inverse, #fff)',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        Yeni Proje Olustur
      </button>
    ),
  },
};

export const CustomIcon: Story = {
  args: {
    title: 'Arama sonucu yok',
    description: 'Farkli anahtar kelimeler ile tekrar deneyin.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width="100%" height="100%">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
};

export const NoIcon: Story = {
  args: {
    title: 'Liste bos',
    description: 'Icerik ekleyin.',
    icon: null,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ border: '1px dashed var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}>
        <EmptyState size="sm" title="Kucuk" description="SM boyut ornegi." />
      </div>
      <div style={{ border: '1px dashed var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}>
        <EmptyState size="md" title="Orta" description="MD boyut ornegi." />
      </div>
      <div style={{ border: '1px dashed var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}>
        <EmptyState size="lg" title="Buyuk" description="LG boyut ornegi." />
      </div>
    </div>
  ),
};

export const Compound: Story = {
  render: () => (
    <div style={{ border: '1px dashed var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}>
      <EmptyState>
        <EmptyState.Icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width="100%" height="100%">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </EmptyState.Icon>
        <EmptyState.Title>Sonuc bulunamadi</EmptyState.Title>
        <EmptyState.Description>Farkli anahtar kelimeler ile tekrar deneyin.</EmptyState.Description>
        <EmptyState.Action>
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: 'var(--rel-color-primary, #3b82f6)',
              color: 'var(--rel-color-text-inverse, #fff)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Yeniden Ara
          </button>
        </EmptyState.Action>
      </EmptyState>
    </div>
  ),
};

export const MultipleActions: Story = {
  args: {
    title: 'Dosya bulunamadi',
    description: 'Aradaginiz dosya mevcut degil veya silinmis olabilir.',
    action: (
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: '1px solid var(--rel-color-border, #e2e8f0)',
            backgroundColor: 'var(--rel-color-bg, #fff)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Geri Don
        </button>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: 'var(--rel-color-primary, #3b82f6)',
            color: 'var(--rel-color-text-inverse, #fff)',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Yeni Dosya Yukle
        </button>
      </div>
    ),
  },
};
