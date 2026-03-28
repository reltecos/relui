/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Data Display/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ── Default ──

export const Default: Story = {
  args: {
    title: 'Kart Basligi',
    subtitle: 'Alt aciklama',
    footer: (
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{ padding: '6px 16px', borderRadius: 4, border: '1px solid var(--rel-color-border, #d1d5db)', background: 'var(--rel-color-bg, #fff)', cursor: 'pointer' }}>
          Iptal
        </button>
        <button style={{ padding: '6px 16px', borderRadius: 4, border: 'none', background: 'var(--rel-color-primary, #3b82f6)', color: 'var(--rel-color-bg, #fff)', cursor: 'pointer' }}>
          Kaydet
        </button>
      </div>
    ),
    children: (
      <p style={{ margin: 0 }}>
        Bu bir kart bilesenidir. Icerik, gorsel, baslik ve footer
        bolumlerini barindirabilir.
      </p>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

// ── AllVariants ──

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {(['elevated', 'outlined', 'filled'] as const).map((variant) => (
        <div key={variant} style={{ width: 280 }}>
          <Card
            variant={variant}
            title={variant.charAt(0).toUpperCase() + variant.slice(1)}
            subtitle={`variant="${variant}"`}
          >
            <p style={{ margin: 0 }}>Bu kart <strong>{variant}</strong> varyantini kullaniyor.</p>
          </Card>
        </div>
      ))}
    </div>
  ),
};

// ── WithMedia ──

export const WithMedia: Story = {
  args: {
    variant: 'outlined',
    media: {
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=720&h=400&fit=crop',
      alt: 'Doga manzarasi',
      height: 200,
    },
    title: 'Doga Fotograflari',
    subtitle: 'Koleksiyondan bir kare',
    footer: (
      <button style={{ padding: '6px 16px', borderRadius: 4, border: 'none', background: 'var(--rel-color-primary, #3b82f6)', color: 'var(--rel-color-bg, #fff)', cursor: 'pointer' }}>
        Kesfet
      </button>
    ),
    children: (
      <p style={{ margin: 0 }}>
        Guzel bir doga manzarasi. media prop ile gorsel eklenebilir.
      </p>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

// ── WithAction ──

export const WithAction: Story = {
  args: {
    title: 'Bildirimler',
    subtitle: '3 okunmamis bildirim',
    action: (
      <button style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--rel-color-border, #d1d5db)', background: 'var(--rel-color-bg, #fff)', fontSize: 12, cursor: 'pointer' }}>
        Tumunu oku
      </button>
    ),
    children: (
      <p style={{ margin: 0 }}>Bildirim listesi burada gorunur.</p>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

// ── CustomSlotStyles ──

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Card compound variant="outlined">
        <Card.Header>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Compound Kart</h3>
        </Card.Header>
        <Card.Body>
          <p style={{ margin: 0 }}>
            Bu kart compound API ile olusturuldu. Header, Body ve Footer ayri sub-component olarak kullanildi.
          </p>
        </Card.Body>
        <Card.Footer>
          <button style={{ padding: '6px 16px', borderRadius: 4, border: 'none', background: 'var(--rel-color-primary, #3b82f6)', color: 'var(--rel-color-bg, #fff)', cursor: 'pointer' }}>
            Tamam
          </button>
        </Card.Footer>
      </Card>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    title: 'Ozel Stil',
    subtitle: 'Slot API ile ozellestirilmis',
    footer: (
      <button style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--rel-color-primary, #3b82f6)', color: 'var(--rel-color-bg, #fff)', cursor: 'pointer' }}>
        Tamam
      </button>
    ),
    children: (
      <p style={{ margin: 0 }}>styles prop ile tum slot lar ozellestirilebilir.</p>
    ),
    styles: {
      root: { borderRadius: 16 },
      header: { padding: '20px 24px' },
      title: { fontSize: 20, letterSpacing: '0.02em' },
      body: { padding: '0 24px 20px' },
      footer: { padding: '16px 24px' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};
