/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { NumberFormatter } from './NumberFormatter';

const meta: Meta<typeof NumberFormatter> = {
  title: 'Data Display/NumberFormatter',
  component: NumberFormatter,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    formatStyle: {
      control: 'select',
      options: ['decimal', 'currency', 'percent', 'unit'],
    },
    notation: {
      control: 'select',
      options: ['standard', 'scientific', 'engineering', 'compact'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NumberFormatter>;

// ── Default ──

export const Default: Story = {
  args: {
    value: 1234567.89,
    locale: 'en-US',
  },
};

// ── AllFormats ──

export const AllFormats: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>Decimal: </span>
        <NumberFormatter value={1234567.89} locale="en-US" />
      </div>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>Currency: </span>
        <NumberFormatter value={1234.5} locale="en-US" formatStyle="currency" currency="USD" />
      </div>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>Percent: </span>
        <NumberFormatter value={0.8567} formatStyle="percent" maximumFractionDigits={1} />
      </div>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>Compact: </span>
        <NumberFormatter value={1500000} locale="en-US" notation="compact" />
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
        <NumberFormatter value={1234567.89} locale="en-US" />
      </div>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>tr-TR: </span>
        <NumberFormatter value={1234567.89} locale="tr-TR" />
      </div>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>de-DE: </span>
        <NumberFormatter value={1234567.89} locale="de-DE" />
      </div>
      <div>
        <span style={{ color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 12 }}>ja-JP: </span>
        <NumberFormatter value={1234567.89} locale="ja-JP" />
      </div>
    </div>
  ),
};

// ── Currency ──

export const Currency: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <NumberFormatter value={1234.5} locale="en-US" formatStyle="currency" currency="USD" />
      <NumberFormatter value={1234.5} locale="tr-TR" formatStyle="currency" currency="TRY" />
      <NumberFormatter value={1234.5} locale="de-DE" formatStyle="currency" currency="EUR" />
      <NumberFormatter value={1234.5} locale="ja-JP" formatStyle="currency" currency="JPY" />
    </div>
  ),
};

// ── WithPrefixSuffix ──

export const WithPrefixSuffix: Story = {
  args: {
    value: 42567,
    locale: 'en-US',
    prefix: 'Total: ',
    suffix: ' items',
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <NumberFormatter locale="en-US" formatStyle="currency" currency="USD">
      <NumberFormatter.Prefix>Price: </NumberFormatter.Prefix>
      <NumberFormatter.Value>{1234.5}</NumberFormatter.Value>
      <NumberFormatter.Suffix> (incl. tax)</NumberFormatter.Suffix>
    </NumberFormatter>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    value: 99999,
    locale: 'en-US',
    prefix: 'Revenue: ',
    suffix: ' USD',
    styles: {
      root: { padding: 8 },
      value: { fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' },
      prefix: { fontSize: 12 },
      suffix: { fontSize: 12 },
    },
  },
};
