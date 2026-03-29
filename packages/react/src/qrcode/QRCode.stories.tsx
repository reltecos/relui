/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { QRCode } from './QRCode';

const meta: Meta<typeof QRCode> = {
  title: 'Data Display/QRCode',
  component: QRCode,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    errorCorrection: {
      control: 'select',
      options: ['L', 'M', 'Q', 'H'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof QRCode>;

// ── Default ──

export const Default: Story = {
  args: {
    value: 'https://relteco.com',
    label: 'Relteco',
  },
};

// ── AllSizes ──

export const AllSizes: Story = {
  name: 'Tum Boyutlar / All Sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <QRCode value="https://relteco.com" size="sm" label="Small" />
      <QRCode value="https://relteco.com" size="md" label="Medium" />
      <QRCode value="https://relteco.com" size="lg" label="Large" />
    </div>
  ),
};

// ── Error Correction Levels ──

export const ErrorCorrectionLevels: Story = {
  name: 'Hata Duzeltme / EC Levels',
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      {(['L', 'M', 'Q', 'H'] as const).map((ec) => (
        <QRCode key={ec} value="Hello World" size="sm" errorCorrection={ec} label={`EC: ${ec}`} />
      ))}
    </div>
  ),
};

// ── Various Data ──

export const VariousData: Story = {
  name: 'Cesitli Veriler / Various Data',
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <QRCode value="https://relteco.com" size="sm" label="URL" />
      <QRCode value="info@relteco.com" size="sm" label="E-posta" />
      <QRCode value="+905551234567" size="sm" label="Telefon" />
      <QRCode value="RelUI - Dunyanin en guclu UI toolkit i" size="sm" label="Metin" />
    </div>
  ),
};

// ── Compound API ──

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <QRCode value="https://relteco.com" size="lg">
      <QRCode.Svg />
      <QRCode.Label>QR kodu tarayin</QRCode.Label>
    </QRCode>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: {
    value: 'https://relteco.com',
    label: 'Ozel stil',
    styles: {
      root: { padding: 16 },
      label: { fontSize: 16, letterSpacing: '0.02em' },
    },
    classNames: {
      root: 'custom-qr',
    },
  },
};

// ── Playground ──

export const Playground: Story = {
  args: {
    value: 'https://relteco.com',
    size: 'md',
    errorCorrection: 'M',
    label: 'Playground',
  },
};
