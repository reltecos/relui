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
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Spacer>;

const Tag = ({ children }: { children: React.ReactNode }) => (
  <Box p={3} style={{ background: '#e0e7ff', borderRadius: '6px', whiteSpace: 'nowrap' }}>
    {children}
  </Box>
);

export const Default: Story = {
  render: () => (
    <Flex align="center" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
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
      <Tag>Sağ (4rem boşluk)</Tag>
    </Flex>
  ),
};

export const FixedSizePixel: Story = {
  render: () => (
    <Flex align="center">
      <Tag>Sol</Tag>
      <Spacer size={32} />
      <Tag>Sağ (32px boşluk)</Tag>
    </Flex>
  ),
};

export const MultipleSpacer: Story = {
  render: () => (
    <Flex align="center" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
      <Tag>Sol</Tag>
      <Spacer />
      <Tag>Orta</Tag>
      <Spacer />
      <Tag>Sağ</Tag>
    </Flex>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Flex align="center">
      <Tag>Sol</Tag>
      <Spacer
        classNames={{ root: 'custom-spacer' }}
        styles={{ root: { background: '#fef3c7', minWidth: '40px' } }}
      />
      <Tag>Sağ</Tag>
    </Flex>
  ),
};
