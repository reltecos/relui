/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';
import { Box } from '../box';

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Stack>;

const Item = ({ children }: { children: React.ReactNode }) => (
  <Box p={4} style={{ background: '#dcfce7', borderRadius: '8px' }}>
    {children}
  </Box>
);

export const Default: Story = {
  render: () => (
    <Stack spacing={4}>
      <Item>Item 1</Item>
      <Item>Item 2</Item>
      <Item>Item 3</Item>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Stack direction="horizontal" spacing={4}>
      <Item>Sol</Item>
      <Item>Orta</Item>
      <Item>Sağ</Item>
    </Stack>
  ),
};

export const ResponsiveSpacing: Story = {
  render: () => (
    <Stack spacing={{ base: 2, md: 4, lg: 8 }}>
      <Item>Spacing: 2 → md: 4 → lg: 8</Item>
      <Item>Responsive gap</Item>
      <Item>Deneme</Item>
    </Stack>
  ),
};

export const NestedStacks: Story = {
  render: () => (
    <Stack spacing={6}>
      <Box p={4} style={{ background: '#f1f5f9', borderRadius: '8px' }}>
        <Stack direction="horizontal" spacing={4}>
          <Item>A1</Item>
          <Item>A2</Item>
        </Stack>
      </Box>
      <Box p={4} style={{ background: '#f1f5f9', borderRadius: '8px' }}>
        <Stack direction="horizontal" spacing={4}>
          <Item>B1</Item>
          <Item>B2</Item>
          <Item>B3</Item>
        </Stack>
      </Box>
    </Stack>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Stack
      spacing={4}
      classNames={{ root: 'custom-stack' }}
      styles={{ root: { border: '2px dashed #10b981', padding: '16px', borderRadius: '12px' } }}
    >
      <Item>Slot styled</Item>
      <Item>Stack</Item>
    </Stack>
  ),
};
