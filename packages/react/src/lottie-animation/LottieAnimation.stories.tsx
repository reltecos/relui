/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { LottieAnimation } from './LottieAnimation';
import type { LottieData } from '@relteco/relui-core';

const meta: Meta<typeof LottieAnimation> = {
  title: 'Media/LottieAnimation',
  component: LottieAnimation,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof LottieAnimation>;

const SAMPLE: LottieData = {
  frameRate: 30, totalFrames: 60, width: 200, height: 200,
  layers: [{
    name: 'Circle', inFrame: 0, outFrame: 60,
    opacity: [{ frame: 0, value: 100 }, { frame: 30, value: 50 }, { frame: 60, value: 100 }],
    positionX: [{ frame: 0, value: 0 }, { frame: 60, value: 180 }],
    positionY: [{ frame: 0, value: 90 }],
    scaleX: [{ frame: 0, value: 1 }, { frame: 30, value: 1.5 }, { frame: 60, value: 1 }],
    scaleY: [{ frame: 0, value: 1 }, { frame: 30, value: 1.5 }, { frame: 60, value: 1 }],
    rotation: [{ frame: 0, value: 0 }, { frame: 60, value: 360 }],
  }],
};

export const Default: Story = { args: { data: SAMPLE } };
export const NoData: Story = { args: {} };
export const AutoPlay: Story = { args: { data: SAMPLE, autoPlay: true } };
export const SlowSpeed: Story = { args: { data: SAMPLE, speed: 0.5 } };
export const NoLoop: Story = { args: { data: SAMPLE, loop: false } };

export const Compound: Story = {
  render: () => (
    <LottieAnimation data={SAMPLE}>
      <LottieAnimation.Canvas />
      <LottieAnimation.Controls />
    </LottieAnimation>
  ),
};

export const CustomSlotStyles: Story = {
  args: { data: SAMPLE, styles: { root: { padding: 8 }, controls: { padding: '12px 16px' } } },
};
