/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlayer } from './VideoPlayer';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Media/VideoPlayer', component: VideoPlayer, tags: ['autodocs'], parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof VideoPlayer>;

const SRC = 'https://www.w3schools.com/html/mov_bbb.mp4';

export const Default: Story = { args: { src: SRC }, decorators: [(S) => <div style={{ width: 480 }}><S /></div>] };
export const WithPoster: Story = { args: { src: SRC, poster: 'https://via.placeholder.com/480x270' }, decorators: [(S) => <div style={{ width: 480 }}><S /></div>] };
export const AutoPlay: Story = { args: { src: SRC, autoPlay: true }, decorators: [(S) => <div style={{ width: 480 }}><S /></div>] };
export const MutedStart: Story = { args: { src: SRC, muted: true }, decorators: [(S) => <div style={{ width: 480 }}><S /></div>] };
export const LowVolume: Story = { args: { src: SRC, volume: 0.3 }, decorators: [(S) => <div style={{ width: 480 }}><S /></div>] };

export const Compound: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <VideoPlayer src={SRC}>
        <VideoPlayer.Controls />
      </VideoPlayer>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  args: { src: SRC, styles: { root: { borderRadius: 16 }, controls: { padding: '12px 16px' } } },
  decorators: [(S) => <div style={{ width: 480 }}><S /></div>],
};
