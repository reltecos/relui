/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    activeIndex: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

// ── Default ──

export const Default: Story = {
  args: {
    steps: [
      { title: 'Bilgi' },
      { title: 'Onay' },
      { title: 'Tamamla' },
    ],
    activeIndex: 1,
  },
};

// ── Vertical ──

export const Vertical: Story = {
  args: {
    steps: [
      { title: 'Bilgi' },
      { title: 'Onay' },
      { title: 'Tamamla' },
    ],
    activeIndex: 1,
    orientation: 'vertical',
  },
};

// ── WithDescriptions ──

export const WithDescriptions: Story = {
  args: {
    steps: [
      { title: 'Kisisel Bilgiler', description: 'Ad, soyad ve email girin' },
      { title: 'Adres Bilgileri', description: 'Teslimat adresinizi girin' },
      { title: 'Odeme', description: 'Odeme yonteminizi secin' },
      { title: 'Ozet', description: 'Siparisi onaylayin' },
    ],
    activeIndex: 1,
  },
};

// ── ErrorStep ──

export const ErrorStep: Story = {
  render: () => (
    <div style={{ width: 600 }}>
      <Stepper
        steps={[
          { title: 'Bilgi' },
          { title: 'Dogrulama' },
          { title: 'Tamamla' },
        ]}
        activeIndex={1}
        styles={{
          root: { padding: 16 },
        }}
      />
    </div>
  ),
};

// ── AllStepsCompleted ──

export const AllStepsCompleted: Story = {
  args: {
    steps: [
      { title: 'Bilgi' },
      { title: 'Onay' },
      { title: 'Tamamla' },
    ],
    activeIndex: 2,
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <Stepper activeIndex={1}>
      <Stepper.Step index={0}>
        <Stepper.Indicator index={0} />
        <div>
          <Stepper.Title>Bilgi</Stepper.Title>
          <Stepper.Description>Kisisel bilgileriniz</Stepper.Description>
        </div>
      </Stepper.Step>
      <Stepper.Connector index={0} />
      <Stepper.Step index={1}>
        <Stepper.Indicator index={1} />
        <div>
          <Stepper.Title>Onay</Stepper.Title>
          <Stepper.Description>Bilgileri kontrol edin</Stepper.Description>
        </div>
      </Stepper.Step>
      <Stepper.Connector index={1} />
      <Stepper.Step index={2}>
        <Stepper.Indicator index={2} />
        <div>
          <Stepper.Title>Tamamla</Stepper.Title>
          <Stepper.Description>Islemi tamamlayin</Stepper.Description>
        </div>
      </Stepper.Step>
    </Stepper>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    steps: [
      { title: 'Adim 1' },
      { title: 'Adim 2' },
      { title: 'Adim 3' },
    ],
    activeIndex: 1,
    styles: {
      root: { padding: 20 },
      indicator: { fontSize: '16px' },
      title: { fontSize: '16px', fontWeight: 600 },
    },
  },
};
