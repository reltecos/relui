/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './AspectRatio';
import { Box } from '../box';
import { Grid } from '../grid';

const meta: Meta<typeof AspectRatio> = {
  title: 'Layout/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  render: () => (
    <Box width={48}>
      <AspectRatio ratio={1}>
        <Box
          width="full"
          height="full"
          style={{
            background: 'linear-gradient(135deg, var(--rel-color-primary, #6366f1), var(--rel-color-error, #ec4899))',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
          }}
        >
          1:1
        </Box>
      </AspectRatio>
    </Box>
  ),
};

export const Widescreen: Story = {
  render: () => (
    <Box width={96}>
      <AspectRatio ratio={16 / 9}>
        <Box
          width="full"
          height="full"
          style={{
            background: 'linear-gradient(135deg, var(--rel-color-success, #059669), var(--rel-color-primary, #0ea5e9))',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
          }}
        >
          16:9
        </Box>
      </AspectRatio>
    </Box>
  ),
};

export const Portrait: Story = {
  render: () => (
    <Box width={32}>
      <AspectRatio ratio={3 / 4}>
        <Box
          width="full"
          height="full"
          style={{
            background: 'linear-gradient(135deg, var(--rel-color-warning, #f59e0b), var(--rel-color-error, #ef4444))',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          3:4
        </Box>
      </AspectRatio>
    </Box>
  ),
};

export const MultipleRatios: Story = {
  render: () => (
    <Grid columns={4} gap={4}>
      {[1, 4 / 3, 16 / 9, 21 / 9].map((ratio) => (
        <AspectRatio key={ratio} ratio={ratio}>
          <Box
            width="full"
            height="full"
            style={{
              background: 'var(--rel-color-bg-subtle, #ede9fe)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {ratio === 1 ? '1:1' : ratio.toFixed(2)}
          </Box>
        </AspectRatio>
      ))}
    </Grid>
  ),
};

/** String ratio — 4/3 formatinda. */
export const StringRatio: Story = {
  render: () => (
    <Box width={48}>
      <AspectRatio ratio="4/3">
        <Box
          width="full"
          height="full"
          style={{
            background: 'var(--rel-color-bg-subtle, #fef3c7)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          4/3 (string)
        </Box>
      </AspectRatio>
    </Box>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Box width={48}>
      <AspectRatio
        ratio={16 / 9}
        classNames={{ root: 'custom-ar' }}
        styles={{ root: { border: '2px dashed var(--rel-color-primary, #8b5cf6)', borderRadius: '12px' } }}
      >
        <Box
          width="full"
          height="full"
          style={{
            background: 'var(--rel-color-bg-subtle, #f5f3ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Slot styled AspectRatio
        </Box>
      </AspectRatio>
    </Box>
  ),
};
