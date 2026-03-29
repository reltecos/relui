/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Watermark } from './Watermark';

const meta: Meta<typeof Watermark> = {
  title: 'Feedback/Watermark',
  component: Watermark,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    rotate: {
      control: { type: 'range', min: -90, max: 90, step: 1 },
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Watermark>;

const demoContent = (
  <div style={{ padding: 32 }}>
    <h2 style={{ margin: '0 0 12px', fontWeight: 600 }}>Belge Basligi</h2>
    <p style={{ margin: '0 0 8px', lineHeight: 1.6 }}>
      Bu bir ornek belge icerigidir. Watermark bilesen, icerigin uzerine
      tekrarlayan filigran pattern i yerlestirir. Kullanici icerigi okuyabilir
      ancak kopyalama/ekran goruntusu alindiginda filigran gorunur.
    </p>
    <p style={{ margin: 0, lineHeight: 1.6 }}>
      Filigran boyutu, acisi ve opakligi ayarlanabilir. Metin veya ozel
      icerikle kullanilabilir.
    </p>
  </div>
);

// ── Default ──

export const Default: Story = {
  args: {
    text: 'GIZLI',
    children: demoContent,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
};

// ── AllSizes ──

export const AllSizes: Story = {
  name: 'Tum Boyutlar / All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ width: 400, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}>
          <Watermark text={`SIZE: ${size.toUpperCase()}`} size={size}>
            <div style={{ padding: 24 }}>
              <p style={{ margin: 0 }}>Size: <strong>{size}</strong> — Filigran boyutu</p>
            </div>
          </Watermark>
        </div>
      ))}
    </div>
  ),
};

// ── CustomAngle ──

export const CustomAngle: Story = {
  name: 'Ozel Aci / Custom Angle',
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      {[-45, -22, 0, 22, 45].map((angle) => (
        <div key={angle} style={{ width: 200, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}>
          <Watermark text="TASLAK" rotate={angle}>
            <div style={{ padding: 24, height: 120 }}>
              <p style={{ margin: 0, fontSize: 12 }}>rotate={angle}</p>
            </div>
          </Watermark>
        </div>
      ))}
    </div>
  ),
};

// ── CustomOpacity ──

export const CustomOpacity: Story = {
  name: 'Opaklik / Opacity',
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      {[0.05, 0.15, 0.3, 0.5].map((op) => (
        <div key={op} style={{ width: 200, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}>
          <Watermark text="KOPYA" opacity={op}>
            <div style={{ padding: 24, height: 120 }}>
              <p style={{ margin: 0, fontSize: 12 }}>opacity={op}</p>
            </div>
          </Watermark>
        </div>
      ))}
    </div>
  ),
};

// ── Compound ──

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ width: 480, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}>
      <Watermark>
        <Watermark.Content>
          <div style={{ padding: 32 }}>
            <h2 style={{ margin: '0 0 12px', fontWeight: 600 }}>Compound Watermark</h2>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              Compound API ile filigran icerigi tamamen ozellestirilebilir.
              Overlay sub-component ile istediginiz filigrani ekleyebilirsiniz.
            </p>
          </div>
        </Watermark.Content>
        <Watermark.Overlay>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            fontSize: 48,
            fontWeight: 700,
            opacity: 0.08,
            transform: 'rotate(-22deg)',
          }}>
            TASLAK
          </div>
        </Watermark.Overlay>
      </Watermark>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: {
    text: 'OZEL STIL',
    children: (
      <div style={{ padding: 32 }}>
        <p style={{ margin: 0 }}>Slot API ile overlay ve content ozellestirilebilir.</p>
      </div>
    ),
    styles: {
      root: { padding: 4 },
      content: { padding: '8px' },
      overlay: { opacity: '0.8' },
    },
    classNames: {
      root: 'custom-watermark',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Playground ──

export const Playground: Story = {
  args: {
    text: 'WATERMARK',
    rotate: -22,
    opacity: 0.15,
    size: 'md',
    children: demoContent,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
};
