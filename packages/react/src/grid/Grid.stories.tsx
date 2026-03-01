/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';
import { Box } from '../box';

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Grid>;

const Cell = ({ children }: { children: React.ReactNode }) => (
  <Box p={4} style={{ background: '#ede9fe', borderRadius: '8px', textAlign: 'center' }}>
    {children}
  </Box>
);

export const Default: Story = {
  render: () => (
    <Grid columns={3} gap={4}>
      <Cell>1</Cell>
      <Cell>2</Cell>
      <Cell>3</Cell>
      <Cell>4</Cell>
      <Cell>5</Cell>
      <Cell>6</Cell>
    </Grid>
  ),
};

export const ResponsiveColumns: Story = {
  render: () => (
    <Grid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
      {Array.from({ length: 8 }, (_, i) => (
        <Cell key={i}>Item {i + 1}</Cell>
      ))}
    </Grid>
  ),
};

export const TwoColumns: Story = {
  render: () => (
    <Grid columns={2} gap={6}>
      <Cell>Sol</Cell>
      <Cell>Sağ</Cell>
    </Grid>
  ),
};

export const TwelveColumns: Story = {
  render: () => (
    <Grid columns={12} gap={2}>
      <Box gridColumn="span-8" p={4} style={{ background: '#dbeafe', borderRadius: '8px' }}>
        8 / 12
      </Box>
      <Box gridColumn="span-4" p={4} style={{ background: '#fef3c7', borderRadius: '8px' }}>
        4 / 12
      </Box>
      <Box gridColumn="span-3" p={4} style={{ background: '#dcfce7', borderRadius: '8px' }}>
        3 / 12
      </Box>
      <Box gridColumn="span-6" p={4} style={{ background: '#fce7f3', borderRadius: '8px' }}>
        6 / 12
      </Box>
      <Box gridColumn="span-3" p={4} style={{ background: '#fed7aa', borderRadius: '8px' }}>
        3 / 12
      </Box>
    </Grid>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Grid
      columns={2}
      gap={4}
      classNames={{ root: 'custom-grid' }}
      styles={{ root: { border: '2px dashed #8b5cf6', padding: '16px', borderRadius: '12px' } }}
    >
      <Cell>Slot styled</Cell>
      <Cell>Grid</Cell>
    </Grid>
  ),
};
