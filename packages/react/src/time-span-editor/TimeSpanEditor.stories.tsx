/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { TimeSpanEditor } from './TimeSpanEditor';

const meta: Meta<typeof TimeSpanEditor> = {
  title: 'Input/TimeSpanEditor',
  component: TimeSpanEditor,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    showSeconds: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof TimeSpanEditor>;

export const Default: Story = { args: {} };
export const WithDefaults: Story = { args: { defaultHours: 1, defaultMinutes: 30, defaultSeconds: 45 } };
export const NoSeconds: Story = { args: { showSeconds: false } };
export const WithMax: Story = { args: { max: 3600, defaultMinutes: 55 } };
export const WithMin: Story = { args: { min: 60, defaultMinutes: 1 } };

export const Compound: Story = {
  render: () => (
    <TimeSpanEditor>
      <TimeSpanEditor.Field field="hours" />
      <span style={{ fontSize: 18, fontWeight: 700, padding: '0 4px' }}>:</span>
      <TimeSpanEditor.Field field="minutes" />
    </TimeSpanEditor>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    defaultHours: 2,
    defaultMinutes: 15,
    styles: {
      root: { padding: 8 },
      input: { fontSize: '20px', fontWeight: 700 },
      label: { letterSpacing: '0.1em' },
    },
  },
};
