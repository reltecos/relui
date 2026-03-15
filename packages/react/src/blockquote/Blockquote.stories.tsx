/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Blockquote } from './Blockquote';

const meta: Meta<typeof Blockquote> = {
  title: 'Typography/Blockquote',
  component: Blockquote,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered'],
      description: 'Gorsel varyant / Visual variant',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Blockquote>;

// ── Default (Props-based) ──

export const Default: Story = {
  args: {
    cite: 'Mustafa Kemal Ataturk',
    children: 'Hayatta en hakiki mursit ilimdir.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Bordered ──

export const Bordered: Story = {
  name: 'Kenarlıkli / Bordered',
  args: {
    variant: 'bordered',
    cite: 'Albert Einstein',
    children: 'Hayal gucü bilgiden daha onemlidir. Bilgi sinirlidir, hayal gucü ise dunyayi kusatir.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

// ── With Icon ──

export const WithIcon: Story = {
  name: 'Ikonlu / With Icon',
  args: {
    icon: <span style={{ fontSize: 24 }}>&ldquo;</span>,
    cite: 'Yunus Emre',
    children: 'Ilim ilim bilmektir, ilim kendin bilmektir. Sen kendini bilmezsen, ya nice okumaktir.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

// ── All Variants ──

export const AllVariants: Story = {
  name: 'Tum Varyantlar / All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 480 }}>
      <Blockquote cite="Kaynak 1">
        Default varyant — arka plan renkli, yuvarlatilmis koseler.
      </Blockquote>
      <Blockquote variant="bordered" cite="Kaynak 2">
        Bordered varyant — sol kenarlık ile belirgin alinti.
      </Blockquote>
    </div>
  ),
};

// ── With Color (styles slot API ile) ──

export const WithColor: Story = {
  name: 'Renkli / With Color',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 480 }}>
      <Blockquote variant="bordered" cite="Kirmizi kaynak" styles={{ root: { borderLeftColor: '#ef4444' } }}>
        Kirmizi kenarlıkli alinti.
      </Blockquote>
      <Blockquote variant="bordered" cite="Yesil kaynak" styles={{ root: { borderLeftColor: '#22c55e' } }}>
        Yesil kenarlikli alinti.
      </Blockquote>
      <Blockquote cite="Mavi kaynak" styles={{ root: { backgroundColor: 'rgba(59, 130, 246, 0.1)' } }}>
        Mavi arka planli alinti.
      </Blockquote>
    </div>
  ),
};

// ── Compound API ──

export const CompoundAPI: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ width: 480 }}>
      <Blockquote variant="bordered">
        <Blockquote.Content>
          Compound API ile alinti blogu olusturulabilir. Content ve Cite alt bilesenleri
          kullanilarak tam kontrol saglanir.
        </Blockquote.Content>
        <Blockquote.Cite>Compound Kaynak</Blockquote.Cite>
      </Blockquote>
    </div>
  ),
};

// ── Slot Customization ──

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: {
    cite: 'Ozel Stil',
    children: 'Slot API ile her bolum ozellestirilmis alinti.',
    styles: {
      root: { padding: '24px' },
      content: { fontSize: '18px' },
      cite: { letterSpacing: '0.05em' },
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

// ── Playground ──

export const Playground: Story = {
  args: {
    variant: 'default',
    cite: 'Kaynak',
    children: 'Playground ile tum prop lari deneyin.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};
