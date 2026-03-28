/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Data Display/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// ── Default Items ──

const defaultItems = [
  {
    id: 'about',
    title: 'Hakkinda',
    content: (
      <p style={{ margin: 0 }}>
        RelUI, dunyanin en guclu web UI toolkit'idir. Qt, WPF ve GTK seviyesinde
        bilesen derinligi sunar.
      </p>
    ),
  },
  {
    id: 'features',
    title: 'Ozellikler',
    content: (
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        <li>200+ bilesen</li>
        <li>Framework-agnostic core</li>
        <li>Tam TypeScript destegi</li>
        <li>WAI-ARIA uyumluluk</li>
      </ul>
    ),
  },
  {
    id: 'license',
    title: 'Lisans',
    content: (
      <p style={{ margin: 0 }}>
        Core ve Tokens MIT lisanslidir. Framework paketleri BSL (Business Source License)
        ile lisanslanmistir.
      </p>
    ),
  },
];

// ── Default ──

export const Default: Story = {
  args: {
    items: defaultItems,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Multiple ──

export const Multiple: Story = {
  args: {
    items: defaultItems,
    allowMultiple: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

// ── DefaultExpanded ──

export const DefaultExpanded: Story = {
  args: {
    items: defaultItems,
    defaultExpanded: ['about'],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Controlled ──

export const Controlled: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>(['features']);
    return (
      <div style={{ width: 480 }}>
        <p style={{ marginBottom: 8, fontSize: 14, color: 'var(--rel-color-text-muted, #6b7280)' }}>
          Acik: <strong>{expanded.length > 0 ? expanded.join(', ') : 'Yok'}</strong>
        </p>
        <Accordion
          items={defaultItems}
          expanded={expanded}
          onExpandChange={setExpanded}
        />
      </div>
    );
  },
};

// ── WithDisabled ──

export const WithDisabled: Story = {
  args: {
    items: [
      ...defaultItems,
      {
        id: 'disabled',
        title: 'Devre Disi Bolum',
        content: <p>Bu icerik gorunmez.</p>,
        disabled: true,
      },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Compound API ──

export const Compound: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Accordion>
        <Accordion.Item id="about">
          <Accordion.Trigger>Hakkinda</Accordion.Trigger>
          <Accordion.Content>
            <p style={{ margin: 0 }}>
              RelUI, dunyanin en guclu web UI toolkit&apos;idir.
            </p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item id="features">
          <Accordion.Trigger>Ozellikler</Accordion.Trigger>
          <Accordion.Content>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>200+ bilesen</li>
              <li>Framework-agnostic core</li>
            </ul>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item id="license">
          <Accordion.Trigger>Lisans</Accordion.Trigger>
          <Accordion.Content>
            <p style={{ margin: 0 }}>Core ve Tokens MIT lisanslidir.</p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

// ── Compound + CustomSlotStyles ──

export const CompoundCustomSlotStyles: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Accordion
        defaultExpanded={['about']}
        styles={{
          trigger: { padding: '16px 20px', fontSize: 16 },
          content: { padding: '0 20px 16px' },
        }}
      >
        <Accordion.Item id="about">
          <Accordion.Trigger>Hakkinda</Accordion.Trigger>
          <Accordion.Content>
            <p style={{ margin: 0 }}>Ozellestirilmis slot stilleri</p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    items: defaultItems,
    defaultExpanded: ['about'],
    styles: {
      root: {
        borderRadius: 12,
        overflow: 'hidden',
      },
      trigger: {
        padding: '16px 20px',
        fontSize: 16,
      },
      content: {
        padding: '0 20px 16px',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};
