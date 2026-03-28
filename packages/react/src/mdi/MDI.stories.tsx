/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MDI } from './MDI';

const meta: Meta<typeof MDI> = {
  title: 'Window Manager/MDI',
  component: MDI,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof MDI>;

const windowContent = (id: string, title: string) => (
  <div style={{ padding: 16 }}>
    <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>{title}</h3>
    <p style={{ color: 'var(--rel-color-text-muted, #64748b)', fontSize: 13, margin: 0 }}>
      Bu pencere {id} ID'sine sahip.
    </p>
    <div style={{ marginTop: 12, padding: 12, background: 'var(--rel-color-bg-subtle, #f8fafc)', borderRadius: 6, fontSize: 12 }}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </div>
  </div>
);

export const Default: Story = {
  render: () => (
    <div style={{ height: 600 }}>
      <MDI
        windows={[
          { id: 'doc1', title: 'Document 1', x: 50, y: 30 },
          { id: 'doc2', title: 'Document 2', x: 150, y: 80 },
          { id: 'doc3', title: 'Document 3', x: 250, y: 130 },
        ]}
        renderWindow={windowContent}
      />
    </div>
  ),
};

export const CustomPositions: Story = {
  render: () => (
    <div style={{ height: 600 }}>
      <MDI
        windows={[
          { id: 'a', title: 'Top Left', x: 10, y: 10, width: 300, height: 250 },
          { id: 'b', title: 'Center', x: 200, y: 100, width: 400, height: 300 },
          { id: 'c', title: 'Bottom Right', x: 400, y: 200, width: 350, height: 250 },
        ]}
        renderWindow={windowContent}
      />
    </div>
  ),
};

export const NoTaskbar: Story = {
  render: () => (
    <div style={{ height: 600 }}>
      <MDI
        windows={[
          { id: 'a', title: 'Window A', x: 50, y: 50 },
          { id: 'b', title: 'Window B', x: 200, y: 100 },
        ]}
        showTaskbar={false}
        renderWindow={windowContent}
      />
    </div>
  ),
};

export const ManyWindows: Story = {
  render: () => (
    <div style={{ height: 600 }}>
      <MDI
        windows={Array.from({ length: 6 }, (_, i) => ({
          id: `win-${i}`,
          title: `Window ${i + 1}`,
          width: 300,
          height: 200,
        }))}
        renderWindow={windowContent}
      />
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <div style={{ height: 600 }}>
      <MDI
        windows={[
          { id: 'a', title: 'Custom A', x: 50, y: 30 },
          { id: 'b', title: 'Custom B', x: 200, y: 100 },
        ]}
        classNames={{ root: 'custom-mdi' }}
        styles={{
          root: { background: 'var(--rel-color-bg-inverse, #0f172a)' },
          window: { borderRadius: 12 },
          titleBar: { background: 'var(--rel-color-primary, #4f46e5)' },
          title: { color: 'var(--rel-color-text-inverse, #fff)' },
          content: { padding: 16, background: 'var(--rel-color-bg-subtle, #f8fafc)' },
          taskbar: { background: 'var(--rel-color-bg-inverse, #1e293b)' },
          taskbarItem: { borderRadius: 6 },
        }}
        renderWindow={windowContent}
      />
    </div>
  ),
};

export const Compound: Story = {
  render: () => (
    <div style={{ height: 600 }}>
      <MDI>
        <MDI.Window id="doc1" title="Document 1">
          <div style={{ padding: 16 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>Document 1</h3>
            <p style={{ color: 'var(--rel-color-text-muted, #64748b)', fontSize: 13 }}>Compound API ile olusturuldu.</p>
          </div>
        </MDI.Window>
        <MDI.Window id="doc2" title="Document 2">
          <div style={{ padding: 16 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>Document 2</h3>
            <p style={{ color: 'var(--rel-color-text-muted, #64748b)', fontSize: 13 }}>Ikinci pencere.</p>
          </div>
        </MDI.Window>
        <MDI.Toolbar>
          <span style={{ fontSize: 12, padding: '0 8px', color: 'var(--rel-color-text-muted, #64748b)' }}>MDI Toolbar</span>
        </MDI.Toolbar>
      </MDI>
    </div>
  ),
};
