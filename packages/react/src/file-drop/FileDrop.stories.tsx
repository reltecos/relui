/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FileDropItem } from '@relteco/relui-core';
import { FileDrop, formatFileSize } from './FileDrop';

const meta: Meta<typeof FileDrop> = {
  title: 'Form/FileDrop',
  component: FileDrop,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    maxFiles: {
      control: 'number',
    },
    maxSize: {
      control: 'number',
    },
    accept: {
      control: 'text',
    },
    multiple: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileDrop>;

// ── Default ──

export const Default: Story = {
  args: {},
};

// ── SingleFile ──

export const SingleFile: Story = {
  args: {
    multiple: false,
  },
};

// ── ImagesOnly ──

export const ImagesOnly: Story = {
  args: {
    accept: 'image/*',
  },
};

// ── WithMaxSize ──

export const WithMaxSize: Story = {
  args: {
    maxSize: 5 * 1024 * 1024,
    maxFiles: 3,
  },
};

// ── WithFiles ──

export const WithFiles: Story = {
  render: () => {
    const [files, setFiles] = useState<FileDropItem[]>([]);
    return (
      <div style={{ width: 400 }}>
        <FileDrop
          onFilesChange={setFiles}
          maxFiles={5}
        />
        {files.length > 0 && (
          <div
            style={{
              marginTop: 12,
              fontSize: 'var(--rel-text-sm, 14px)',
              color: 'var(--rel-color-text-secondary, #6b7280)',
            }}
          >
            {files.length} dosya secildi, toplam{' '}
            {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}
          </div>
        )}
      </div>
    );
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <FileDrop maxFiles={5}>
        <FileDrop.Zone>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 32,
                color: 'var(--rel-color-primary, #3b82f6)',
              }}
            >
              +
            </span>
            <span
              style={{
                fontSize: 'var(--rel-text-sm, 14px)',
                color: 'var(--rel-color-text-secondary, #6b7280)',
              }}
            >
              Dosya yuklemek icin tiklayin veya surukleyin
            </span>
          </div>
        </FileDrop.Zone>
        <FileDrop.FileList />
      </FileDrop>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    styles: {
      root: { padding: 16 },
      zone: { padding: 48, opacity: 0.9 },
    },
    classNames: {
      root: 'custom-file-drop',
    },
  },
};
