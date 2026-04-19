/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AudioPlayer } from './AudioPlayer';

const meta: Meta<typeof AudioPlayer> = { title: 'Media/AudioPlayer', component: AudioPlayer, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof AudioPlayer>;

const TRACKS = [
  { id: '1', title: 'Song A', src: '/a.mp3', artist: 'Artist A' },
  { id: '2', title: 'Song B', src: '/b.mp3', artist: 'Artist B' },
  { id: '3', title: 'Song C', src: '/c.mp3' },
];

export const Default: Story = { args: { tracks: TRACKS }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const WithPlaylist: Story = { args: { tracks: TRACKS, showPlaylist: true }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const SingleTrack: Story = { args: { tracks: TRACKS[0] ? [TRACKS[0]] : [] }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const LowVolume: Story = { args: { tracks: TRACKS, volume: 0.3 }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const Compound: Story = { render: () => (<div style={{ width: 400 }}><AudioPlayer tracks={TRACKS}><AudioPlayer.TrackInfo /><AudioPlayer.Controls /><AudioPlayer.Playlist /></AudioPlayer></div>) };
export const CustomSlotStyles: Story = { args: { tracks: TRACKS, styles: { root: { borderRadius: 16, padding: 16 }, controls: { padding: '10px' } } }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const Empty: Story = { args: { tracks: [] }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
