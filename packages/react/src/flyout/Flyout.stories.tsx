/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Flyout } from './Flyout';

const meta: Meta<typeof Flyout> = {
  title: 'Overlay/Flyout',
  component: Flyout,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Flyout>;

// ── Default ──

export const Default: Story = {
  args: {
    title: 'Bildirimler',
    placement: 'bottom',
    size: 'md',
    trigger: <button>Bildirimleri Goster</button>,
    children: (
      <div>
        <div style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
          <strong>Yeni mesaj</strong>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
            Ahmet size bir mesaj gonderdi.
          </p>
        </div>
        <div style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
          <strong>Sistem guncelleme</strong>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
            Sistem basariyla guncellendi.
          </p>
        </div>
        <div style={{ padding: '8px 0' }}>
          <strong>Hatirlatma</strong>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
            Toplanti 15 dakika sonra basliyor.
          </p>
        </div>
      </div>
    ),
  },
};

// ── AllPlacements ──

export const AllPlacements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', padding: 120 }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Flyout
          key={placement}
          trigger={<button>{placement}</button>}
          title={`Placement: ${placement}`}
          placement={placement}
          size="sm"
        >
          <p>Bu flyout <strong>{placement}</strong> yonunde acilir.</p>
        </Flyout>
      ))}
    </div>
  ),
};

// ── WithFooter ──

export const WithFooter: Story = {
  args: {
    title: 'Ayarlar',
    placement: 'bottom',
    size: 'md',
    trigger: <button>Ayarlar</button>,
    footer: (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>
          Iptal
        </button>
        <button style={{ padding: '6px 12px', borderRadius: 4, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer' }}>
          Kaydet
        </button>
      </div>
    ),
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" defaultChecked />
          Bildirimleri etkinlestir
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" />
          Karanlik tema
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" defaultChecked />
          Otomatik kaydetme
        </label>
      </div>
    ),
  },
};

// ── Controlled ──

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <p style={{ marginBottom: 8, fontSize: 14, color: '#6b7280' }}>
          Durum: <strong>{open ? 'Acik' : 'Kapali'}</strong>
        </p>
        <Flyout
          trigger={<button>Kontrollü Flyout</button>}
          title="Kontrollü Flyout"
          open={open}
          onOpenChange={setOpen}
        >
          <p>Bu flyout dis state ile kontrol edilir.</p>
          <button
            onClick={() => setOpen(false)}
            style={{ marginTop: 8, padding: '6px 12px', borderRadius: 4, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}
          >
            Kapat
          </button>
        </Flyout>
      </div>
    );
  },
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    title: 'Ozel Stil',
    placement: 'bottom',
    trigger: <button>Ozel Stil</button>,
    classNames: {},
    styles: {
      panel: {
        borderRadius: 16,
        boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      },
      header: {
        padding: '16px 20px',
      },
      title: {
        fontSize: 18,
        letterSpacing: '0.02em',
      },
      body: {
        padding: '16px 20px',
      },
    },
    children: (
      <p>Slot API ile stiller ozellestirilebilir.</p>
    ),
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ padding: 120 }}>
      <Flyout placement="bottom" size="md">
        <Flyout.Trigger>
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #8b5cf6',
              background: '#8b5cf6',
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
              fontSize: 14,
            }}
          >
            Compound Flyout
          </button>
        </Flyout.Trigger>
        <Flyout.Content>
          <Flyout.Header>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Compound Baslik</h3>
          </Flyout.Header>
          <Flyout.Body>
            <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
              Bu bir compound API ornegi. Header ve Body ayri sub-component olarak verilir.
            </p>
          </Flyout.Body>
        </Flyout.Content>
      </Flyout>
    </div>
  ),
};
