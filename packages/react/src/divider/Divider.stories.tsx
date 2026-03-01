/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';
import { Box } from '../box';
import { Flex } from '../flex';
import { Stack } from '../stack';

const meta: Meta<typeof Divider> = {
  title: 'Layout/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box p={4}>Üst içerik</Box>
      <Divider />
      <Box p={4}>Alt içerik</Box>
    </Stack>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Flex gap={4} height={24} alignItems="stretch">
      <Box p={4}>Sol</Box>
      <Divider orientation="vertical" />
      <Box p={4}>Sağ</Box>
    </Flex>
  ),
};

export const Dashed: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box p={4}>Üst</Box>
      <Divider variant="dashed" />
      <Box p={4}>Alt</Box>
    </Stack>
  ),
};

export const Dotted: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box p={4}>Üst</Box>
      <Divider variant="dotted" />
      <Box p={4}>Alt</Box>
    </Stack>
  ),
};

export const WithSpacing: Story = {
  render: () => (
    <Box>
      <Box p={4}>Üst (spacing=6)</Box>
      <Divider spacing={6} />
      <Box p={4}>Alt</Box>
    </Box>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={6}>
      <Box>
        <Box p={2}>Solid (varsayılan)</Box>
        <Divider variant="solid" />
      </Box>
      <Box>
        <Box p={2}>Dashed</Box>
        <Divider variant="dashed" />
      </Box>
      <Box>
        <Box p={2}>Dotted</Box>
        <Divider variant="dotted" />
      </Box>
    </Stack>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box p={4}>Üst</Box>
      <Divider
        classNames={{ root: 'custom-divider' }}
        styles={{ root: { opacity: 0.3 } }}
      />
      <Box p={4}>Alt</Box>
    </Stack>
  ),
};
