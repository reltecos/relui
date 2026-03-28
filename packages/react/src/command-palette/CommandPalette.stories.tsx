/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CommandPalette } from './CommandPalette';
import type { CommandPaletteItem } from '@relteco/relui-core';
import {
  SaveIcon,
  SearchIcon,
  CopyIcon,
  ClipboardIcon,
  UndoIcon,
  RedoIcon,
  FilePlusIcon,
  FolderOpenIcon,
  ScissorsIcon,
} from '@relteco/relui-icons';

// ── Icon haritasi ──────────────────────────────────────────

const iconMap: Record<string, ReactNode> = {
  save: <SaveIcon size={16} />,
  search: <SearchIcon size={16} />,
  copy: <CopyIcon size={16} />,
  clipboard: <ClipboardIcon size={16} />,
  undo: <UndoIcon size={16} />,
  redo: <RedoIcon size={16} />,
  'file-plus': <FilePlusIcon size={16} />,
  'folder-open': <FolderOpenIcon size={16} />,
  scissors: <ScissorsIcon size={16} />,
};

const renderIcon = (icon: string): ReactNode => iconMap[icon] ?? null;

// ── Test verileri ──────────────────────────────────────────

const basicItems: CommandPaletteItem[] = [
  { key: 'save', label: 'Save File', shortcut: 'Ctrl+S' },
  { key: 'open', label: 'Open File', shortcut: 'Ctrl+O' },
  { key: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
  { key: 'paste', label: 'Paste', shortcut: 'Ctrl+V' },
  { key: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' },
  { key: 'redo', label: 'Redo', shortcut: 'Ctrl+Shift+Z' },
];

const iconItemsData: CommandPaletteItem[] = [
  { key: 'save', label: 'Save File', icon: 'save', shortcut: 'Ctrl+S' },
  { key: 'open', label: 'Open File', icon: 'folder-open', shortcut: 'Ctrl+O' },
  { key: 'new', label: 'New File', icon: 'file-plus', shortcut: 'Ctrl+N' },
  { key: 'search', label: 'Search in Files', icon: 'search', shortcut: 'Ctrl+Shift+F' },
  { key: 'copy', label: 'Copy', icon: 'copy', shortcut: 'Ctrl+C' },
  { key: 'cut', label: 'Cut', icon: 'scissors', shortcut: 'Ctrl+X' },
  { key: 'paste', label: 'Paste', icon: 'clipboard', shortcut: 'Ctrl+V' },
  { key: 'undo', label: 'Undo', icon: 'undo', shortcut: 'Ctrl+Z' },
  { key: 'redo', label: 'Redo', icon: 'redo', shortcut: 'Ctrl+Shift+Z' },
];

const groupedItems: CommandPaletteItem[] = [
  { key: 'save', label: 'Save File', icon: 'save', shortcut: 'Ctrl+S', group: 'File' },
  { key: 'open', label: 'Open File', icon: 'folder-open', shortcut: 'Ctrl+O', group: 'File' },
  { key: 'new', label: 'New File', icon: 'file-plus', shortcut: 'Ctrl+N', group: 'File' },
  { key: 'copy', label: 'Copy', icon: 'copy', shortcut: 'Ctrl+C', group: 'Edit' },
  { key: 'cut', label: 'Cut', icon: 'scissors', shortcut: 'Ctrl+X', group: 'Edit' },
  { key: 'paste', label: 'Paste', icon: 'clipboard', shortcut: 'Ctrl+V', group: 'Edit' },
  { key: 'undo', label: 'Undo', icon: 'undo', shortcut: 'Ctrl+Z', group: 'Edit' },
  { key: 'redo', label: 'Redo', icon: 'redo', shortcut: 'Ctrl+Shift+Z', group: 'Edit' },
  { key: 'search', label: 'Search in Files', icon: 'search', shortcut: 'Ctrl+Shift+F', group: 'Search' },
];

const descItems: CommandPaletteItem[] = [
  { key: 'save', label: 'Save File', icon: 'save', description: 'Save the current document', shortcut: 'Ctrl+S' },
  { key: 'open', label: 'Open File', icon: 'folder-open', description: 'Open an existing file from disk', shortcut: 'Ctrl+O' },
  { key: 'search', label: 'Search', icon: 'search', description: 'Search across all files in workspace', shortcut: 'Ctrl+Shift+F' },
  { key: 'copy', label: 'Copy', icon: 'copy', description: 'Copy selection to clipboard' },
  { key: 'undo', label: 'Undo', icon: 'undo', description: 'Undo the last action', shortcut: 'Ctrl+Z' },
];

const disabledItems: CommandPaletteItem[] = [
  { key: 'save', label: 'Save File', icon: 'save', shortcut: 'Ctrl+S' },
  { key: 'open', label: 'Open File', icon: 'folder-open', shortcut: 'Ctrl+O' },
  { key: 'paste', label: 'Paste', icon: 'clipboard', shortcut: 'Ctrl+V', disabled: true },
  { key: 'undo', label: 'Undo', icon: 'undo', shortcut: 'Ctrl+Z', disabled: true },
];

// ── Wrapper ──────────────────────────────────────────────

function CommandPaletteDemo(
  props: Omit<React.ComponentProps<typeof CommandPalette>, 'open' | 'onOpenChange'>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleOpen = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{
      fontFamily: 'var(--rel-font-sans, system-ui)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      alignItems: 'center',
      paddingTop: '40px',
    }}>
      <button
        onClick={handleOpen}
        style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: '1px solid var(--rel-color-border, #ccc)',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'inherit',
        }}
      >
        <SearchIcon size={14} />
        Search commands...
        <kbd style={{
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: 'var(--rel-color-bg-subtle, rgba(128,128,128,0.15))',
          border: '1px solid var(--rel-color-border, rgba(128,128,128,0.2))',
          fontSize: '11px',
          marginLeft: '16px',
        }}>
          Ctrl+K
        </kbd>
      </button>

      {selected && (
        <div style={{ fontSize: '13px', opacity: 0.7 }}>
          Selected: <strong>{selected}</strong>
        </div>
      )}

      <CommandPalette
        {...props}
        open={isOpen}
        onSelect={(key, item) => {
          setSelected(key);
          props.onSelect?.(key, item);
        }}
        onOpenChange={setIsOpen}
      />
    </div>
  );
}

// ── Meta ─────────────────────────────────────────────────

const meta: Meta<typeof CommandPalette> = {
  title: 'Navigation/CommandPalette',
  component: CommandPalette,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

// ── Stories ──────────────────────────────────────────────

export const Default: Story = {
  render: () => <CommandPaletteDemo items={basicItems} />,
};

export const WithIcons: Story = {
  render: () => (
    <CommandPaletteDemo items={iconItemsData} renderIcon={renderIcon} />
  ),
};

export const WithGroups: Story = {
  render: () => (
    <CommandPaletteDemo items={groupedItems} renderIcon={renderIcon} />
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <CommandPaletteDemo items={descItems} renderIcon={renderIcon} />
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <CommandPaletteDemo items={disabledItems} renderIcon={renderIcon} />
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size}>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '8px',
            fontFamily: 'var(--rel-font-sans, system-ui)',
          }}>
            Size: {size}
          </div>
          <CommandPaletteDemo
            items={iconItemsData}
            size={size}
            renderIcon={renderIcon}
          />
        </div>
      ))}
    </div>
  ),
};

export const CustomPlaceholder: Story = {
  render: () => (
    <CommandPaletteDemo
      items={iconItemsData}
      renderIcon={renderIcon}
      placeholder="What do you want to do?"
      emptyMessage="No matching commands"
    />
  ),
};

export const Compound: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}>
        <button onClick={() => setIsOpen(true)} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--rel-color-border, #ccc)', background: 'transparent', cursor: 'pointer' }}>
          Open Compound Command Palette
        </button>
        <CommandPalette open={isOpen} onOpenChange={setIsOpen} items={[]}>
          <CommandPalette.Input placeholder="Type a command..." value={query} onChange={setQuery} />
          <CommandPalette.List>
            <CommandPalette.Group heading="File">
              <CommandPalette.Item shortcut="Ctrl+S" icon={<SaveIcon size={16} />}>Save File</CommandPalette.Item>
              <CommandPalette.Item shortcut="Ctrl+O" icon={<FolderOpenIcon size={16} />}>Open File</CommandPalette.Item>
            </CommandPalette.Group>
            <CommandPalette.Group heading="Edit">
              <CommandPalette.Item shortcut="Ctrl+C" icon={<CopyIcon size={16} />}>Copy</CommandPalette.Item>
              <CommandPalette.Item shortcut="Ctrl+V" icon={<ClipboardIcon size={16} />}>Paste</CommandPalette.Item>
            </CommandPalette.Group>
          </CommandPalette.List>
        </CommandPalette>
      </div>
    );
  },
};

export const CustomSlotStyles: Story = {
  render: () => (
    <CommandPaletteDemo
      items={iconItemsData}
      renderIcon={renderIcon}
      styles={{
        root: {
          backgroundColor: 'var(--rel-color-bg-inverse, #1a1a2e)',
          borderColor: 'var(--rel-color-border, #16213e)',
        },
        overlay: {
          backgroundColor: 'var(--rel-color-overlay, rgba(0,0,0,0.6))',
        },
        input: {
          color: 'var(--rel-color-text-inverse, #e0e0e0)',
          borderBottomColor: 'var(--rel-color-border, #16213e)',
        },
        item: {
          color: 'var(--rel-color-text-inverse, #e0e0e0)',
        },
      }}
    />
  ),
};

export const Playground: Story = {
  args: {
    items: iconItemsData,
    size: 'md',
    placeholder: 'Type a command...',
  },
  render: (args) => (
    <CommandPaletteDemo {...args} renderIcon={renderIcon} />
  ),
};
