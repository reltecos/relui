/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Menu } from './Menu';
import type { MenuItem } from '@relteco/relui-core';
import {
  FilePlusIcon,
  FolderOpenIcon,
  SaveIcon,
  ScissorsIcon,
  CopyIcon,
  ClipboardIcon,
  UndoIcon,
  RedoIcon,
  SearchIcon,
} from '@relteco/relui-icons';

// ── Icon haritasi / Icon map ──────────────────────────────────────

const iconMap: Record<string, ReactNode> = {
  'file-plus': <FilePlusIcon size={14} />,
  'folder-open': <FolderOpenIcon size={14} />,
  save: <SaveIcon size={14} />,
  scissors: <ScissorsIcon size={14} />,
  copy: <CopyIcon size={14} />,
  clipboard: <ClipboardIcon size={14} />,
  undo: <UndoIcon size={14} />,
  redo: <RedoIcon size={14} />,
  search: <SearchIcon size={14} />,
};

const renderIcon = (icon: string): ReactNode => iconMap[icon] ?? null;

// ── Menu verileri / Menu data ─────────────────────────────────────

const fileItems: MenuItem[] = [
  {
    key: 'file',
    label: 'File',
    children: [
      { key: 'new', label: 'New', shortcut: 'Ctrl+N', icon: 'file-plus' },
      { key: 'open', label: 'Open', shortcut: 'Ctrl+O', icon: 'folder-open' },
      { key: 'open-recent', label: 'Open Recent', children: [
        { key: 'file1', label: 'project.ts' },
        { key: 'file2', label: 'utils.ts' },
        { key: 'file3', label: 'config.json' },
      ]},
      { key: 'div1', label: '', divider: true },
      { key: 'save', label: 'Save', shortcut: 'Ctrl+S', icon: 'save' },
      { key: 'save-as', label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
      { key: 'div2', label: '', divider: true },
      { key: 'exit', label: 'Exit' },
    ],
  },
  {
    key: 'edit',
    label: 'Edit',
    children: [
      { key: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', icon: 'undo' },
      { key: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', icon: 'redo' },
      { key: 'div3', label: '', divider: true },
      { key: 'cut', label: 'Cut', shortcut: 'Ctrl+X', icon: 'scissors' },
      { key: 'copy', label: 'Copy', shortcut: 'Ctrl+C', icon: 'copy' },
      { key: 'paste', label: 'Paste', shortcut: 'Ctrl+V', icon: 'clipboard' },
    ],
  },
  {
    key: 'view',
    label: 'View',
    children: [
      { key: 'sidebar', label: 'Sidebar', checked: true },
      { key: 'minimap', label: 'Minimap', checked: false },
      { key: 'statusbar', label: 'Status Bar', checked: true },
      { key: 'div4', label: '', divider: true },
      { key: 'zoom-in', label: 'Zoom In', shortcut: 'Ctrl+=' },
      { key: 'zoom-out', label: 'Zoom Out', shortcut: 'Ctrl+-' },
    ],
  },
  {
    key: 'help',
    label: 'Help',
    children: [
      { key: 'docs', label: 'Documentation' },
      { key: 'about', label: 'About' },
    ],
  },
];

const simpleItems: MenuItem[] = [
  {
    key: 'file',
    label: 'File',
    children: [
      { key: 'new', label: 'New', shortcut: 'Ctrl+N' },
      { key: 'open', label: 'Open', shortcut: 'Ctrl+O' },
      { key: 'div1', label: '', divider: true },
      { key: 'save', label: 'Save', shortcut: 'Ctrl+S' },
      { key: 'div2', label: '', divider: true },
      { key: 'exit', label: 'Exit' },
    ],
  },
  {
    key: 'edit',
    label: 'Edit',
    children: [
      { key: 'undo', label: 'Undo', shortcut: 'Ctrl+Z' },
      { key: 'redo', label: 'Redo', shortcut: 'Ctrl+Y' },
    ],
  },
];

// ── Meta ──────────────────────────────────────────────────────────

const meta: Meta<typeof Menu> = {
  title: 'Navigation/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    items: fileItems,
    renderIcon,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Menu>;

// ── Default ──

export const Default: Story = {};

// ── All Sizes ──

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size}>
          <div style={{ marginBottom: '4px', fontSize: '12px', color: 'var(--rel-color-text-muted, #888)' }}>{size}</div>
          <Menu {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};

// ── With Icons ──

export const WithIcons: Story = {
  args: {
    items: fileItems,
    renderIcon,
  },
};

// ── Without Icons ──

export const WithoutIcons: Story = {
  args: {
    items: simpleItems,
    renderIcon: undefined,
  },
};

// ── With Checked Items ──

export const WithCheckedItems: Story = {
  args: {
    items: [
      {
        key: 'view',
        label: 'View',
        children: [
          { key: 'sidebar', label: 'Sidebar', checked: true },
          { key: 'minimap', label: 'Minimap', checked: false },
          { key: 'statusbar', label: 'Status Bar', checked: true },
          { key: 'wordwrap', label: 'Word Wrap', checked: true },
          { key: 'div1', label: '', divider: true },
          { key: 'fullscreen', label: 'Toggle Full Screen', shortcut: 'F11' },
        ],
      },
      {
        key: 'settings',
        label: 'Settings',
        children: [
          { key: 'autosave', label: 'Auto Save', checked: true },
          { key: 'darkmode', label: 'Dark Mode', checked: false },
          { key: 'spellcheck', label: 'Spell Check', checked: true },
        ],
      },
    ],
  },
};

// ── With Submenus ──

export const WithSubmenus: Story = {
  args: {
    items: [
      {
        key: 'file',
        label: 'File',
        children: [
          { key: 'new', label: 'New', shortcut: 'Ctrl+N', icon: 'file-plus' },
          { key: 'open-recent', label: 'Open Recent', children: [
            { key: 'proj1', label: 'my-project/' },
            { key: 'proj2', label: 'old-project/' },
            { key: 'div-r', label: '', divider: true },
            { key: 'clear', label: 'Clear Recent' },
          ]},
          { key: 'export', label: 'Export', children: [
            { key: 'export-pdf', label: 'PDF' },
            { key: 'export-html', label: 'HTML' },
            { key: 'export-md', label: 'Markdown' },
          ]},
          { key: 'div1', label: '', divider: true },
          { key: 'exit', label: 'Exit' },
        ],
      },
      {
        key: 'edit',
        label: 'Edit',
        children: [
          { key: 'find', label: 'Find & Replace', icon: 'search', children: [
            { key: 'find-text', label: 'Find', shortcut: 'Ctrl+F' },
            { key: 'replace-text', label: 'Replace', shortcut: 'Ctrl+H' },
            { key: 'find-files', label: 'Find in Files', shortcut: 'Ctrl+Shift+F' },
          ]},
          { key: 'div2', label: '', divider: true },
          { key: 'preferences', label: 'Preferences', shortcut: 'Ctrl+,' },
        ],
      },
    ],
  },
};

// ── With Disabled Items ──

export const WithDisabledItems: Story = {
  args: {
    items: [
      {
        key: 'file',
        label: 'File',
        children: [
          { key: 'new', label: 'New', icon: 'file-plus' },
          { key: 'save', label: 'Save', icon: 'save', disabled: true },
          { key: 'save-as', label: 'Save As...', disabled: true },
          { key: 'div1', label: '', divider: true },
          { key: 'exit', label: 'Exit' },
        ],
      },
      {
        key: 'edit',
        label: 'Edit',
        children: [
          { key: 'undo', label: 'Undo', icon: 'undo', disabled: true },
          { key: 'redo', label: 'Redo', icon: 'redo', disabled: true },
          { key: 'div2', label: '', divider: true },
          { key: 'cut', label: 'Cut', icon: 'scissors' },
          { key: 'copy', label: 'Copy', icon: 'copy' },
          { key: 'paste', label: 'Paste', icon: 'clipboard' },
        ],
      },
    ],
  },
};

// ── Minimal ──

export const Minimal: Story = {
  args: {
    items: [
      {
        key: 'actions',
        label: 'Actions',
        children: [
          { key: 'run', label: 'Run', shortcut: 'F5' },
          { key: 'debug', label: 'Debug', shortcut: 'F9' },
          { key: 'div1', label: '', divider: true },
          { key: 'stop', label: 'Stop', shortcut: 'Shift+F5' },
        ],
      },
      {
        key: 'help',
        label: 'Help',
        children: [
          { key: 'docs', label: 'Documentation' },
          { key: 'about', label: 'About' },
        ],
      },
    ],
    renderIcon: undefined,
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <Menu size="md">
      <Menu.Group label="File">
        <Menu.Item shortcut="Ctrl+N">New</Menu.Item>
        <Menu.Item shortcut="Ctrl+O">Open</Menu.Item>
        <Menu.Separator />
        <Menu.Item shortcut="Ctrl+S">Save</Menu.Item>
      </Menu.Group>
      <Menu.Group label="Edit">
        <Menu.Item shortcut="Ctrl+Z">Undo</Menu.Item>
        <Menu.Item shortcut="Ctrl+Y">Redo</Menu.Item>
        <Menu.Separator />
        <Menu.Label>Clipboard</Menu.Label>
        <Menu.Item shortcut="Ctrl+C">Copy</Menu.Item>
        <Menu.Item shortcut="Ctrl+V">Paste</Menu.Item>
      </Menu.Group>
    </Menu>
  ),
  decorators: [
    (Story) => (
      <div style={{ minHeight: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

// ── Custom Slot Styles (Dark Theme) ──

export const CustomSlotStyles: Story = {
  args: {
    items: fileItems,
    style: {
      backgroundColor: 'var(--rel-color-bg-inverse, #1e1e2e)',
      borderBottomColor: 'var(--rel-color-bg-inverse-subtle, #313244)',
    },
    classNames: {},
    styles: {
      trigger: {
        color: 'var(--rel-color-text-inverse, #cdd6f4)',
      },
      dropdown: {
        backgroundColor: 'var(--rel-color-bg-inverse, #1e1e2e)',
        borderColor: 'var(--rel-color-bg-inverse-subtle, #313244)',
      },
      item: {
        color: 'var(--rel-color-text-inverse, #cdd6f4)',
      },
      itemShortcut: {
        color: 'var(--rel-color-text-muted, #6c7086)',
      },
      divider: {
        backgroundColor: 'var(--rel-color-bg-inverse-subtle, #313244)',
      },
    },
  },
};

// ── Controlled ──

export const Controlled: Story = {
  render: (args) => {
    const handleSelect = (key: string) => {
      alert(`Selected: ${key}`);
    };

    return <Menu {...args} onSelect={handleSelect} />;
  },
};

// ── IDE Style ──

export const IDEStyle: Story = {
  args: {
    items: [
      {
        key: 'file',
        label: 'File',
        children: [
          { key: 'new-file', label: 'New File', shortcut: 'Ctrl+N', icon: 'file-plus' },
          { key: 'new-window', label: 'New Window', shortcut: 'Ctrl+Shift+N' },
          { key: 'div1', label: '', divider: true },
          { key: 'open-file', label: 'Open File...', shortcut: 'Ctrl+O', icon: 'folder-open' },
          { key: 'open-folder', label: 'Open Folder...' },
          { key: 'open-recent', label: 'Open Recent', children: [
            { key: 'r1', label: 'project-a/' },
            { key: 'r2', label: 'project-b/' },
            { key: 'r3', label: 'config.ts' },
          ]},
          { key: 'div2', label: '', divider: true },
          { key: 'save', label: 'Save', shortcut: 'Ctrl+S', icon: 'save' },
          { key: 'save-all', label: 'Save All', shortcut: 'Ctrl+K S' },
          { key: 'div3', label: '', divider: true },
          { key: 'auto-save', label: 'Auto Save', checked: true },
          { key: 'div4', label: '', divider: true },
          { key: 'close', label: 'Close Editor', shortcut: 'Ctrl+W' },
          { key: 'close-all', label: 'Close All', shortcut: 'Ctrl+K Ctrl+W' },
        ],
      },
      {
        key: 'edit',
        label: 'Edit',
        children: [
          { key: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', icon: 'undo' },
          { key: 'redo', label: 'Redo', shortcut: 'Ctrl+Shift+Z', icon: 'redo' },
          { key: 'div5', label: '', divider: true },
          { key: 'cut', label: 'Cut', shortcut: 'Ctrl+X', icon: 'scissors' },
          { key: 'copy', label: 'Copy', shortcut: 'Ctrl+C', icon: 'copy' },
          { key: 'paste', label: 'Paste', shortcut: 'Ctrl+V', icon: 'clipboard' },
          { key: 'div6', label: '', divider: true },
          { key: 'find', label: 'Find', shortcut: 'Ctrl+F', icon: 'search' },
          { key: 'replace', label: 'Replace', shortcut: 'Ctrl+H' },
          { key: 'find-in-files', label: 'Find in Files', shortcut: 'Ctrl+Shift+F' },
        ],
      },
      {
        key: 'selection',
        label: 'Selection',
        children: [
          { key: 'select-all', label: 'Select All', shortcut: 'Ctrl+A' },
          { key: 'expand-sel', label: 'Expand Selection', shortcut: 'Shift+Alt+Right' },
          { key: 'shrink-sel', label: 'Shrink Selection', shortcut: 'Shift+Alt+Left' },
        ],
      },
      {
        key: 'view',
        label: 'View',
        children: [
          { key: 'explorer', label: 'Explorer', shortcut: 'Ctrl+Shift+E', checked: true },
          { key: 'search-view', label: 'Search', shortcut: 'Ctrl+Shift+F', checked: false },
          { key: 'scm', label: 'Source Control', shortcut: 'Ctrl+Shift+G', checked: false },
          { key: 'debug-view', label: 'Run and Debug', shortcut: 'Ctrl+Shift+D', checked: false },
          { key: 'div7', label: '', divider: true },
          { key: 'terminal', label: 'Terminal', shortcut: 'Ctrl+`' },
          { key: 'output', label: 'Output', shortcut: 'Ctrl+Shift+U' },
        ],
      },
      {
        key: 'run',
        label: 'Run',
        children: [
          { key: 'start-debug', label: 'Start Debugging', shortcut: 'F5' },
          { key: 'run-no-debug', label: 'Run Without Debugging', shortcut: 'Ctrl+F5' },
          { key: 'stop-debug', label: 'Stop Debugging', shortcut: 'Shift+F5', disabled: true },
          { key: 'div8', label: '', divider: true },
          { key: 'toggle-bp', label: 'Toggle Breakpoint', shortcut: 'F9' },
        ],
      },
      {
        key: 'help',
        label: 'Help',
        children: [
          { key: 'welcome', label: 'Welcome' },
          { key: 'docs-help', label: 'Documentation' },
          { key: 'div9', label: '', divider: true },
          { key: 'about-help', label: 'About' },
        ],
      },
    ],
    size: 'sm',
  },
};

// ── Playground ──

export const Playground: Story = {
  args: {
    items: fileItems,
    size: 'md',
    renderIcon,
  },
};
