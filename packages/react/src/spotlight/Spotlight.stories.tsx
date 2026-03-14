/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spotlight } from './Spotlight';
import type { SpotlightItem } from '@relteco/relui-core';
import {
  SearchIcon,
  SaveIcon,
  FolderOpenIcon,
  FilePlusIcon,
} from '@relteco/relui-icons';

// ── Icon haritasi ──────────────────────────────────────────

const iconMap: Record<string, ReactNode> = {
  search: <SearchIcon size={16} />,
  save: <SaveIcon size={16} />,
  file: <FilePlusIcon size={16} />,
  folder: <FolderOpenIcon size={16} />,
};

const renderIcon = (icon: string): ReactNode => iconMap[icon] ?? null;

// ── Test verileri ──────────────────────────────────────────

const fileItems: SpotlightItem[] = [
  { key: 'readme', label: 'README.md', description: 'Project documentation', icon: 'file', group: 'Files' },
  { key: 'pkg', label: 'package.json', description: 'Package configuration', icon: 'file', group: 'Files' },
  { key: 'tsconfig', label: 'tsconfig.json', description: 'TypeScript config', icon: 'file', group: 'Files' },
  { key: 'index', label: 'src/index.ts', description: 'Entry point', icon: 'file', group: 'Files' },
  { key: 'settings', label: 'Settings', description: 'Open application settings', icon: 'folder', group: 'Actions' },
  { key: 'theme', label: 'Toggle Theme', description: 'Switch between light and dark mode', group: 'Actions' },
  { key: 'save-all', label: 'Save All', description: 'Save all open files', icon: 'save', group: 'Actions' },
  { key: 'help', label: 'Help Center', description: 'Open help documentation', group: 'Navigation' },
  { key: 'shortcuts', label: 'Keyboard Shortcuts', description: 'View all keyboard shortcuts', group: 'Navigation' },
];

const basicItems: SpotlightItem[] = [
  { key: 'doc1', label: 'Document One', description: 'First document' },
  { key: 'doc2', label: 'Document Two', description: 'Second document' },
  { key: 'settings', label: 'Settings', description: 'App settings' },
  { key: 'profile', label: 'User Profile', description: 'Edit profile' },
  { key: 'logout', label: 'Log Out', description: 'Sign out of your account' },
];

// ── Wrapper ──────────────────────────────────────────────

function SpotlightDemo(
  props: Omit<React.ComponentProps<typeof Spotlight>, 'open' | 'onOpenChange'>,
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
          padding: '12px 24px',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'inherit',
          minWidth: '280px',
        }}
      >
        <SearchIcon size={16} />
        Search anything...
        <kbd style={{
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: 'rgba(128,128,128,0.12)',
          border: '1px solid rgba(128,128,128,0.2)',
          fontSize: '11px',
          marginLeft: 'auto',
        }}>
          Ctrl+K
        </kbd>
      </button>

      {selected && (
        <div style={{ fontSize: '13px', opacity: 0.7 }}>
          Selected: <strong>{selected}</strong>
        </div>
      )}

      <Spotlight
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

// ── Async Wrapper ────────────────────────────────────────

function AsyncSpotlightDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<SpotlightItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleOpen = useCallback(() => setIsOpen(true), []);

  const handleQueryChange = useCallback((q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      // Simule async arama
      const results = fileItems.filter(
        (item) => item.label.toLowerCase().includes(q.toLowerCase()),
      );
      setItems(results);
      setLoading(false);
    }, 500);
  }, []);

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
          padding: '12px 24px',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          fontSize: '14px',
          color: 'inherit',
        }}
      >
        <SearchIcon size={16} /> Async Search (500ms delay)
      </button>

      <Spotlight
        items={items}
        open={isOpen}
        query={query}
        onQueryChange={handleQueryChange}
        onOpenChange={setIsOpen}
        renderIcon={renderIcon}
        searchIcon={<SearchIcon size={18} />}
        placeholder="Search files and actions..."
        loadingMessage="Searching..."
      />

      {loading && (
        <div style={{ fontSize: '12px', opacity: 0.5 }}>Loading...</div>
      )}
    </div>
  );
}

// ── Meta ─────────────────────────────────────────────────

const meta: Meta<typeof Spotlight> = {
  title: 'Navigation/Spotlight',
  component: Spotlight,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Spotlight>;

// ── Stories ──────────────────────────────────────────────

export const Default: Story = {
  render: () => <SpotlightDemo items={basicItems} searchIcon={<SearchIcon size={18} />} />,
};

export const WithIcons: Story = {
  render: () => (
    <SpotlightDemo
      items={fileItems}
      renderIcon={renderIcon}
      searchIcon={<SearchIcon size={18} />}
    />
  ),
};

export const WithGroups: Story = {
  render: () => (
    <SpotlightDemo
      items={fileItems}
      renderIcon={renderIcon}
      searchIcon={<SearchIcon size={18} />}
    />
  ),
};

export const WithRecentSearches: Story = {
  render: () => (
    <SpotlightDemo
      items={fileItems}
      renderIcon={renderIcon}
      searchIcon={<SearchIcon size={18} />}
      recentSearches={['package.json', 'settings', 'theme']}
    />
  ),
};

export const AsyncSearch: Story = {
  render: () => <AsyncSpotlightDemo />,
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
          <SpotlightDemo
            items={fileItems}
            size={size}
            renderIcon={renderIcon}
            searchIcon={<SearchIcon size={18} />}
          />
        </div>
      ))}
    </div>
  ),
};

export const CustomPlaceholder: Story = {
  render: () => (
    <SpotlightDemo
      items={fileItems}
      renderIcon={renderIcon}
      searchIcon={<SearchIcon size={18} />}
      placeholder="What are you looking for?"
      emptyMessage="No matching results"
    />
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <SpotlightDemo
      items={fileItems}
      renderIcon={renderIcon}
      searchIcon={<SearchIcon size={18} />}
      styles={{
        root: {
          backgroundColor: '#1a1a2e',
          borderColor: '#16213e',
        },
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.6)',
        },
        input: {
          color: '#e0e0e0',
        },
        item: {
          color: '#e0e0e0',
        },
      }}
    />
  ),
};

export const Playground: Story = {
  args: {
    items: fileItems,
    size: 'md',
    placeholder: 'Search...',
  },
  render: (args) => (
    <SpotlightDemo
      {...args}
      renderIcon={renderIcon}
      searchIcon={<SearchIcon size={18} />}
    />
  ),
};
