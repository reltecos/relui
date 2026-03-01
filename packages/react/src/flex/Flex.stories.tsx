/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from './Flex';
import { Box } from '../box';

const meta: Meta<typeof Flex> = {
  title: 'Layout/Flex',
  component: Flex,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Flex>;

const Item = ({ children }: { children: React.ReactNode }) => (
  <Box p={4} style={{ background: '#e0e7ff', borderRadius: '8px', textAlign: 'center' }}>
    {children}
  </Box>
);

export const Default: Story = {
  render: () => (
    <Flex gap={4}>
      <Item>1</Item>
      <Item>2</Item>
      <Item>3</Item>
    </Flex>
  ),
};

export const Column: Story = {
  render: () => (
    <Flex direction="column" gap={4}>
      <Item>A</Item>
      <Item>B</Item>
      <Item>C</Item>
    </Flex>
  ),
};

export const Centered: Story = {
  render: () => (
    <Flex align="center" justify="center" gap={4} height={32}>
      <Item>Ortalanmış</Item>
    </Flex>
  ),
};

export const SpaceBetween: Story = {
  render: () => (
    <Flex justify="space-between" align="center">
      <Item>Logo</Item>
      <Flex gap={2}>
        <Item>Link 1</Item>
        <Item>Link 2</Item>
        <Item>Link 3</Item>
      </Flex>
    </Flex>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      gap={{ base: 2, md: 4 }}
      wrap="wrap"
    >
      <Box p={4} width={{ base: 'full', md: '1/3' }} style={{ background: '#fef3c7', borderRadius: '8px' }}>
        1/3
      </Box>
      <Box p={4} width={{ base: 'full', md: '1/3' }} style={{ background: '#fed7aa', borderRadius: '8px' }}>
        1/3
      </Box>
      <Box p={4} width={{ base: 'full', md: '1/3' }} style={{ background: '#fecaca', borderRadius: '8px' }}>
        1/3
      </Box>
    </Flex>
  ),
};

export const Wrapped: Story = {
  render: () => (
    <Flex wrap="wrap" gap={2}>
      {Array.from({ length: 12 }, (_, i) => (
        <Box key={i} p={3} width={20} style={{ background: '#dbeafe', borderRadius: '6px', textAlign: 'center' }}>
          {i + 1}
        </Box>
      ))}
    </Flex>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Flex
      gap={4}
      classNames={{ root: 'custom-flex' }}
      styles={{ root: { border: '2px dashed #6366f1', padding: '16px', borderRadius: '12px' } }}
    >
      <Item>Slot styled</Item>
      <Item>Flex</Item>
    </Flex>
  ),
};
