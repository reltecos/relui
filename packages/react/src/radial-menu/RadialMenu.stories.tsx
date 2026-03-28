/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useCallback, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadialMenu } from './RadialMenu';
import type { RadialMenuItem } from '@relteco/relui-core';
import {
  ScissorsIcon,
  CopyIcon,
  ClipboardIcon,
  UndoIcon,
  RedoIcon,
  SaveIcon,
  FilePlusIcon,
  FolderOpenIcon,
  SearchIcon,
} from '@relteco/relui-icons';

// ── Icon haritasi / Icon map ──────────────────────────────────────

const iconMap: Record<string, ReactNode> = {
  scissors: <ScissorsIcon size={16} />,
  copy: <CopyIcon size={16} />,
  clipboard: <ClipboardIcon size={16} />,
  undo: <UndoIcon size={16} />,
  redo: <RedoIcon size={16} />,
  save: <SaveIcon size={16} />,
  'file-plus': <FilePlusIcon size={16} />,
  'folder-open': <FolderOpenIcon size={16} />,
  search: <SearchIcon size={16} />,
};

const renderIcon = (icon: string): ReactNode => iconMap[icon] ?? null;

// ── Test verileri ──────────────────────────────────────────────

const basicItems: RadialMenuItem[] = [
  { key: 'cut', label: 'Cut' },
  { key: 'copy', label: 'Copy' },
  { key: 'paste', label: 'Paste' },
  { key: 'delete', label: 'Delete' },
];

const iconItems: RadialMenuItem[] = [
  { key: 'cut', label: 'Cut', icon: 'scissors' },
  { key: 'copy', label: 'Copy', icon: 'copy' },
  { key: 'paste', label: 'Paste', icon: 'clipboard' },
  { key: 'undo', label: 'Undo', icon: 'undo' },
  { key: 'redo', label: 'Redo', icon: 'redo' },
  { key: 'save', label: 'Save', icon: 'save' },
];

const submenuItems: RadialMenuItem[] = [
  {
    key: 'file',
    label: 'File',
    icon: 'folder-open',
    children: [
      { key: 'new', label: 'New', icon: 'file-plus' },
      { key: 'open', label: 'Open', icon: 'folder-open' },
      { key: 'save', label: 'Save', icon: 'save' },
    ],
  },
  { key: 'cut', label: 'Cut', icon: 'scissors' },
  { key: 'copy', label: 'Copy', icon: 'copy' },
  { key: 'paste', label: 'Paste', icon: 'clipboard' },
  {
    key: 'search',
    label: 'Search',
    icon: 'search',
    children: [
      { key: 'find', label: 'Find' },
      { key: 'replace', label: 'Replace' },
    ],
  },
];

const disabledItems: RadialMenuItem[] = [
  { key: 'cut', label: 'Cut', icon: 'scissors' },
  { key: 'copy', label: 'Copy', icon: 'copy' },
  { key: 'paste', label: 'Paste', icon: 'clipboard', disabled: true },
  { key: 'undo', label: 'Undo', icon: 'undo', disabled: true },
];

// ── Wrapper bileşen ──────────────────────────────────────────

function RadialMenuDemo(
  props: Omit<React.ComponentProps<typeof RadialMenu>, 'open' | 'position' | 'onOpenChange'>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<string | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  }, []);

  return (
    <div
      onContextMenu={handleContextMenu}
      style={{
        width: '100%',
        height: '400px',
        border: '2px dashed var(--rel-color-border, #ccc)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '8px',
        userSelect: 'none',
        cursor: 'context-menu',
        fontFamily: 'var(--rel-font-sans, system-ui)',
        color: 'var(--rel-color-text-muted, #666)',
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: 600 }}>
        Right-click to open radial menu
      </div>
      {selected && (
        <div style={{ fontSize: '12px', opacity: 0.7 }}>
          Selected: <strong>{selected}</strong>
        </div>
      )}
      <RadialMenu
        {...props}
        open={isOpen}
        position={position}
        onSelect={(key, item) => {
          setSelected(key);
          props.onSelect?.(key, item);
        }}
        onOpenChange={(open) => {
          setIsOpen(open);
        }}
      />
    </div>
  );
}

// ── Meta ──────────────────────────────────────────────────────

const meta: Meta<typeof RadialMenu> = {
  title: 'Navigation/RadialMenu',
  component: RadialMenu,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadialMenu>;

// ── Stories ──────────────────────────────────────────────────

export const Default: Story = {
  render: () => <RadialMenuDemo items={basicItems} />,
};

export const WithIcons: Story = {
  render: () => (
    <RadialMenuDemo items={iconItems} renderIcon={renderIcon} />
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <RadialMenuDemo items={submenuItems} renderIcon={renderIcon} />
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <RadialMenuDemo items={disabledItems} renderIcon={renderIcon} />
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
          <RadialMenuDemo items={iconItems} size={size} renderIcon={renderIcon} />
        </div>
      ))}
    </div>
  ),
};

export const ContextMenu: Story = {
  render: () => {
    const contextItems: RadialMenuItem[] = [
      { key: 'cut', label: 'Cut', icon: 'scissors' },
      { key: 'copy', label: 'Copy', icon: 'copy' },
      { key: 'paste', label: 'Paste', icon: 'clipboard' },
      { key: 'find', label: 'Find', icon: 'search' },
      { key: 'undo', label: 'Undo', icon: 'undo' },
      { key: 'redo', label: 'Redo', icon: 'redo' },
      { key: 'save', label: 'Save', icon: 'save' },
      { key: 'new', label: 'New', icon: 'file-plus' },
    ];

    return (
      <RadialMenuDemo items={contextItems} renderIcon={renderIcon} size="lg" />
    );
  },
};

export const Controlled: Story = {
  render: () => {
    function ControlledExample() {
      const [isOpen, setIsOpen] = useState(false);
      const [selected, setSelected] = useState<string | null>(null);

      return (
        <div style={{
          fontFamily: 'var(--rel-font-sans, system-ui)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsOpen(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid var(--rel-color-border, #ccc)',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Open Menu
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid var(--rel-color-border, #ccc)',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Close Menu
            </button>
          </div>

          {selected && (
            <div style={{ fontSize: '13px' }}>
              Last selected: <strong>{selected}</strong>
            </div>
          )}

          <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            border: '2px dashed var(--rel-color-border, #ccc)',
            borderRadius: '12px',
          }}>
            <RadialMenu
              items={iconItems}
              renderIcon={renderIcon}
              open={isOpen}
              position={{ x: 300, y: 250 }}
              onSelect={(key) => {
                setSelected(key);
                setIsOpen(false);
              }}
              onOpenChange={(open) => setIsOpen(open)}
            />
          </div>
        </div>
      );
    }

    return <ControlledExample />;
  },
};

export const CustomSlotStyles: Story = {
  render: () => (
    <RadialMenuDemo
      items={iconItems}
      renderIcon={renderIcon}
      styles={{
        root: {
          backgroundColor: 'var(--rel-color-bg-inverse, #1a1a2e)',
          borderColor: 'var(--rel-color-border, #16213e)',
          boxShadow: '0 8px 32px var(--rel-color-shadow, rgba(0,0,0,0.4))',
        },
        overlay: {
          backgroundColor: 'var(--rel-color-overlay, rgba(0,0,0,0.3))',
        },
        label: {
          color: 'var(--rel-color-text-secondary, #e0e0e0)',
        },
        center: {
          backgroundColor: 'var(--rel-color-bg-inverse, #1a1a2e)',
          borderColor: 'var(--rel-color-border, #16213e)',
        },
      }}
    />
  ),
};

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <RadialMenuDemo items={iconItems} renderIcon={renderIcon}>
      <RadialMenu.Center>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--rel-color-primary, #3b82f6)' }}>R</span>
      </RadialMenu.Center>
    </RadialMenuDemo>
  ),
};

export const CompoundCustomSlotStyles: Story = {
  name: 'Compound + Custom Slot Styles',
  render: () => (
    <RadialMenuDemo
      items={iconItems}
      renderIcon={renderIcon}
      styles={{
        center: {
          backgroundColor: 'var(--rel-color-bg-inverse, #1a1a2e)',
          borderColor: 'var(--rel-color-primary, #3b82f6)',
        },
      }}
    >
      <RadialMenu.Center>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--rel-color-primary, #60a5fa)' }}>+</span>
      </RadialMenu.Center>
    </RadialMenuDemo>
  ),
};

export const Playground: Story = {
  args: {
    items: iconItems,
    size: 'md',
  },
  render: (args) => (
    <RadialMenuDemo {...args} renderIcon={renderIcon} />
  ),
};
