/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DateFormatter } from './DateFormatter';

const meta: Meta<typeof DateFormatter> = {
  title: 'Data Display/DateFormatter',
  component: DateFormatter,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    dateStyle: {
      control: 'select',
      options: ['full', 'long', 'medium', 'short'],
    },
    timeStyle: {
      control: 'select',
      options: ['full', 'long', 'medium', 'short'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateFormatter>;

const fixedDate = new Date(2025, 2, 15, 14, 30, 0);

// ── Default ──

export const Default: Story = {
  args: {
    value: fixedDate,
    locale: 'en-US',
    dateStyle: 'long',
  },
};

// ── AllDateStyles ──

export const AllDateStyles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['full', 'long', 'medium', 'short'] as const).map((ds) => (
        <div key={ds}>
          <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>{ds}: </span>
          <DateFormatter value={fixedDate} locale="en-US" dateStyle={ds} />
        </div>
      ))}
    </div>
  ),
};

// ── WithTime ──

export const WithTime: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>Date only: </span>
        <DateFormatter value={fixedDate} locale="en-US" dateStyle="medium" />
      </div>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>Time only: </span>
        <DateFormatter value={fixedDate} locale="en-US" timeStyle="short" />
      </div>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>Date + Time: </span>
        <DateFormatter value={fixedDate} locale="en-US" dateStyle="medium" timeStyle="short" />
      </div>
    </div>
  ),
};

// ── Locales ──

export const Locales: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>en-US: </span>
        <DateFormatter value={fixedDate} locale="en-US" dateStyle="long" />
      </div>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>tr-TR: </span>
        <DateFormatter value={fixedDate} locale="tr-TR" dateStyle="long" />
      </div>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>de-DE: </span>
        <DateFormatter value={fixedDate} locale="de-DE" dateStyle="long" />
      </div>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>ja-JP: </span>
        <DateFormatter value={fixedDate} locale="ja-JP" dateStyle="long" />
      </div>
    </div>
  ),
};

// ── GranularFormat ──

export const GranularFormat: Story = {
  args: {
    value: fixedDate,
    locale: 'en-US',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <DateFormatter locale="en-US" dateStyle="long">
      <DateFormatter.Prefix>Created: </DateFormatter.Prefix>
      <DateFormatter.Value>{fixedDate}</DateFormatter.Value>
      <DateFormatter.Suffix> (active)</DateFormatter.Suffix>
    </DateFormatter>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    value: fixedDate,
    locale: 'en-US',
    dateStyle: 'long',
    prefix: 'Date: ',
    suffix: ' (today)',
    styles: {
      root: { padding: 8 },
      value: { fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' },
      prefix: { fontSize: 12 },
      suffix: { fontSize: 12, opacity: 0.6 },
    },
  },
};
