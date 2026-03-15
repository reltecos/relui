/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from './Spacer';
import { Flex } from '../flex';
import { Box } from '../box';

const meta: Meta<typeof Spacer> = {
  title: 'Layout/Spacer',
  component: Spacer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Spacer>;

const Tag = ({ children }: { children: React.ReactNode }) => (
  <Box p={3} style={{ background: 'var(--rel-color-bg-subtle, #e0e7ff)', borderRadius: '6px', whiteSpace: 'nowrap' }}>
    {children}
  </Box>
);

export const Default: Story = {
  render: () => (
    <Flex align="center" style={{ border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: '8px', padding: '8px' }}>
      <Tag>Logo</Tag>
      <Spacer />
      <Flex gap={2}>
        <Tag>Link 1</Tag>
        <Tag>Link 2</Tag>
      </Flex>
    </Flex>
  ),
};

export const FixedSize: Story = {
  render: () => (
    <Flex align="center">
      <Tag>Sol</Tag>
      <Spacer size="4rem" />
      <Tag>Sag (4rem bosluk)</Tag>
    </Flex>
  ),
};

export const FixedSizePixel: Story = {
  render: () => (
    <Flex align="center">
      <Tag>Sol</Tag>
      <Spacer size={32} />
      <Tag>Sag (32px bosluk)</Tag>
    </Flex>
  ),
};

export const MultipleSpacer: Story = {
  render: () => (
    <Flex align="center" style={{ border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: '8px', padding: '8px' }}>
      <Tag>Sol</Tag>
      <Spacer />
      <Tag>Orta</Tag>
      <Spacer />
      <Tag>Sag</Tag>
    </Flex>
  ),
};

/** Dikey Spacer — column flex icinde. */
export const Vertical: Story = {
  render: () => (
    <Flex direction="column" style={{ border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: '8px', padding: '8px', minHeight: '200px' }}>
      <Tag>Ust</Tag>
      <Spacer />
      <Tag>Alt</Tag>
    </Flex>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Flex align="center">
      <Tag>Sol</Tag>
      <Spacer
        classNames={{ root: 'custom-spacer' }}
        styles={{ root: { background: 'var(--rel-color-bg-subtle, #fef3c7)', minWidth: '40px' } }}
      />
      <Tag>Sag</Tag>
    </Flex>
  ),
};
