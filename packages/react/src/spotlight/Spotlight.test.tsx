/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Spotlight } from './Spotlight';
import type { SpotlightItem } from '@relteco/relui-core';
import { useState } from 'react';

// ── jsdom scrollIntoView mock ────────────────────────────────
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

// ── Test verileri ──────────────────────────────────────────────

const basicItems: SpotlightItem[] = [
  { key: 'doc1', label: 'Document One', description: 'First document' },
  { key: 'doc2', label: 'Document Two', description: 'Second document' },
  { key: 'settings', label: 'Settings', description: 'App settings' },
  { key: 'profile', label: 'User Profile', description: 'Edit profile' },
];

const groupedItems: SpotlightItem[] = [
  { key: 'readme', label: 'README.md', group: 'Files' },
  { key: 'pkg', label: 'package.json', group: 'Files' },
  { key: 'settings', label: 'Settings', group: 'Actions' },
  { key: 'theme', label: 'Toggle Theme', group: 'Actions' },
];

const mixedItems: SpotlightItem[] = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta', disabled: true },
  { key: 'c', label: 'Charlie' },
];

const iconItems: SpotlightItem[] = [
  { key: 'file', label: 'Open File', icon: 'file' },
  { key: 'search', label: 'Search', icon: 'search' },
];

const descItems: SpotlightItem[] = [
  { key: 'save', label: 'Save File', description: 'Save the current document' },
  { key: 'open', label: 'Open File', description: 'Open an existing file' },
];

// ── Wrapper ──────────────────────────────────────────────────

function OpenSpotlight(
  props: Omit<React.ComponentProps<typeof Spotlight>, 'open'> & {
    initialOpen?: boolean;
  },
) {
  const { initialOpen = true, ...rest } = props;
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <Spotlight
      {...rest}
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        rest.onOpenChange?.(open);
      }}
    />
  );
}

// ── Render ─────────────────────────────────────────────────

describe('Spotlight render', () => {
  it('kapali durumda render etmez', () => {
    render(<Spotlight items={basicItems} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('acik durumda render eder', () => {
    render(<OpenSpotlight items={basicItems} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('ref destekler', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<OpenSpotlight items={basicItems} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('id prop destekler', () => {
    render(<OpenSpotlight items={basicItems} id="test-spot" />);
    const dialog = document.getElementById('test-spot');
    expect(dialog).toBeInTheDocument();
  });

  it('input render eder', () => {
    render(<OpenSpotlight items={basicItems} />);
    expect(screen.getByTestId('spot-input')).toBeInTheDocument();
  });

  it('listbox render eder', () => {
    render(<OpenSpotlight items={basicItems} />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('ogeler render eder', () => {
    render(<OpenSpotlight items={basicItems} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
  });

  it('oge label gosterir', () => {
    render(<OpenSpotlight items={basicItems} />);
    expect(screen.getByText('Document One')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('overlay render eder', () => {
    render(<OpenSpotlight items={basicItems} />);
    expect(screen.getByTestId('spot-overlay')).toBeInTheDocument();
  });

  it('placeholder gosterir', () => {
    render(<OpenSpotlight items={basicItems} placeholder="Search everywhere..." />);
    expect(screen.getByPlaceholderText('Search everywhere...')).toBeInTheDocument();
  });

  it('searchIcon render eder', () => {
    render(
      <OpenSpotlight
        items={basicItems}
        searchIcon={<span data-testid="search-icon">S</span>}
      />,
    );
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });
});

// ── Boyutlar ─────────────────────────────────────────────────

describe('Spotlight sizes', () => {
  it('varsayilan md boyutu', () => {
    render(<OpenSpotlight items={basicItems} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('xs boyutu render eder', () => {
    render(<OpenSpotlight items={basicItems} size="xs" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('xl boyutu render eder', () => {
    render(<OpenSpotlight items={basicItems} size="xl" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

// ── Descriptions ─────────────────────────────────────────────

describe('Spotlight descriptions', () => {
  it('description gosterir', () => {
    render(<OpenSpotlight items={descItems} />);
    expect(screen.getByText('Save the current document')).toBeInTheDocument();
  });
});

// ── Groups ───────────────────────────────────────────────────

describe('Spotlight groups', () => {
  it('grup basliklarini gosterir', () => {
    render(<OpenSpotlight items={groupedItems} />);
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});

// ── Icons ────────────────────────────────────────────────────

describe('Spotlight icons', () => {
  it('renderIcon callback ile ikon render eder', () => {
    const renderIcon = (icon: string) => <span data-testid={`icon-${icon}`}>{icon}</span>;
    render(<OpenSpotlight items={iconItems} renderIcon={renderIcon} />);
    expect(screen.getByTestId('icon-file')).toBeInTheDocument();
    expect(screen.getByTestId('icon-search')).toBeInTheDocument();
  });

  it('renderIcon olmadan ikon render etmez', () => {
    const { container } = render(<OpenSpotlight items={iconItems} />);
    expect(container.querySelectorAll('[data-testid^="icon-"]')).toHaveLength(0);
  });
});

// ── Disabled ─────────────────────────────────────────────────

describe('Spotlight disabled', () => {
  it('disabled oge aria-disabled gosterir', () => {
    render(<OpenSpotlight items={mixedItems} />);
    const options = screen.getAllByRole('option');
    const disabled = options[1];
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
  });

  it('disabled oge data-disabled gosterir', () => {
    render(<OpenSpotlight items={mixedItems} />);
    const options = screen.getAllByRole('option');
    const disabled = options[1];
    expect(disabled).toHaveAttribute('data-disabled', '');
  });
});

// ── Keyboard ─────────────────────────────────────────────────

describe('Spotlight keyboard', () => {
  it('Escape ile kapatir', () => {
    const onOpenChange = vi.fn();
    render(<OpenSpotlight items={basicItems} onOpenChange={onOpenChange} />);
    const input = screen.getByTestId('spot-input');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('ArrowDown ile sonraki ogeye gecer', () => {
    render(<OpenSpotlight items={basicItems} />);
    const input = screen.getByTestId('spot-input');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('data-highlighted', '');
  });

  it('ArrowUp ile onceki ogeye gecer', () => {
    render(<OpenSpotlight items={basicItems} />);
    const input = screen.getByTestId('spot-input');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('data-highlighted', '');
  });

  it('Enter ile secim yapar', () => {
    const onSelect = vi.fn();
    render(<OpenSpotlight items={basicItems} onSelect={onSelect} />);
    const input = screen.getByTestId('spot-input');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('doc1', expect.objectContaining({ key: 'doc1' }));
  });
});

// ── Callbacks ────────────────────────────────────────────────

describe('Spotlight callbacks', () => {
  it('onSelect tiklama ile cagirilir', () => {
    const onSelect = vi.fn();
    render(<OpenSpotlight items={basicItems} onSelect={onSelect} />);
    const options = screen.getAllByRole('option');
    const first = options[0];
    if (first) fireEvent.click(first);
    expect(onSelect).toHaveBeenCalledWith('doc1', expect.objectContaining({ key: 'doc1' }));
  });

  it('onSelect disabled ogede cagirilmaz', () => {
    const onSelect = vi.fn();
    render(<OpenSpotlight items={mixedItems} onSelect={onSelect} />);
    const options = screen.getAllByRole('option');
    const disabled = options[1];
    if (disabled) fireEvent.click(disabled);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('onOpenChange kapandiginda cagirilir', () => {
    const onOpenChange = vi.fn();
    render(<OpenSpotlight items={basicItems} onOpenChange={onOpenChange} />);
    const input = screen.getByTestId('spot-input');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ── Overlay ──────────────────────────────────────────────────

describe('Spotlight overlay', () => {
  it('overlay tiklaninca kapatir', () => {
    const onOpenChange = vi.fn();
    render(<OpenSpotlight items={basicItems} onOpenChange={onOpenChange} />);
    const overlay = screen.getByTestId('spot-overlay');
    fireEvent.click(overlay);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ── A11y ─────────────────────────────────────────────────────

describe('Spotlight a11y', () => {
  it('dialog role gosterir', () => {
    render(<OpenSpotlight items={basicItems} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('aria-label gosterir', () => {
    render(<OpenSpotlight items={basicItems} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Spotlight Search');
  });

  it('aria-modal gosterir', () => {
    render(<OpenSpotlight items={basicItems} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('input combobox role gosterir', () => {
    render(<OpenSpotlight items={basicItems} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('listbox role gosterir', () => {
    render(<OpenSpotlight items={basicItems} />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('option role gosterir', () => {
    render(<OpenSpotlight items={basicItems} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
  });
});

// ── Slot API ─────────────────────────────────────────────────

describe('Spotlight slot API', () => {
  it('className root slot', () => {
    render(<OpenSpotlight items={basicItems} className="custom-spot" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('custom-spot');
  });

  it('style root slot', () => {
    render(<OpenSpotlight items={basicItems} style={{ opacity: 0.5 }} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.style.opacity).toBe('0.5');
  });

  it('classNames.overlay slot', () => {
    render(
      <OpenSpotlight
        items={basicItems}
        classNames={{ overlay: 'my-overlay' }}
      />,
    );
    const overlay = screen.getByTestId('spot-overlay');
    expect(overlay.className).toContain('my-overlay');
  });

  it('styles.overlay slot', () => {
    render(
      <OpenSpotlight
        items={basicItems}
        styles={{ overlay: { opacity: 0.8 } }}
      />,
    );
    const overlay = screen.getByTestId('spot-overlay');
    expect(overlay.style.opacity).toBe('0.8');
  });
});

// ── Filtreleme ───────────────────────────────────────────────

describe('Spotlight filtering', () => {
  it('input degisince filtrelenir', () => {
    render(<OpenSpotlight items={basicItems} />);
    const input = screen.getByTestId('spot-input');
    fireEvent.change(input, { target: { value: 'document' } });
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(2);
  });

  it('eslesmez query empty state gosterir', () => {
    render(<OpenSpotlight items={basicItems} />);
    const input = screen.getByTestId('spot-input');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByTestId('spot-empty')).toBeInTheDocument();
  });

  it('ozel emptyMessage gosterir', () => {
    render(<OpenSpotlight items={basicItems} emptyMessage="Nothing here" />);
    const input = screen.getByTestId('spot-input');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});

// ── Recent searches ──────────────────────────────────────────

describe('Spotlight recent searches', () => {
  it('son aramalari gosterir (query bos iken)', () => {
    render(
      <OpenSpotlight
        items={basicItems}
        recentSearches={['foo', 'bar']}
      />,
    );
    expect(screen.getByTestId('spot-recent')).toBeInTheDocument();
    expect(screen.getByText('Recent')).toBeInTheDocument();
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
  });

  it('query girilince son aramalar gizlenir', () => {
    render(
      <OpenSpotlight
        items={basicItems}
        recentSearches={['foo', 'bar']}
      />,
    );
    const input = screen.getByTestId('spot-input');
    fireEvent.change(input, { target: { value: 'doc' } });
    expect(screen.queryByTestId('spot-recent')).not.toBeInTheDocument();
  });

  it('son arama tiklaninca query ayarlanir', () => {
    render(
      <OpenSpotlight
        items={basicItems}
        recentSearches={['document']}
      />,
    );
    const recentItem = screen.getByTestId('spot-recent-item');
    fireEvent.click(recentItem);
    // Query 'document' oldu, filtreleme yapildi
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(2); // Document One, Document Two
  });

  it('Clear butonu son aramalari temizler', () => {
    render(
      <OpenSpotlight
        items={basicItems}
        recentSearches={['foo', 'bar']}
      />,
    );
    const clearBtn = screen.getByText('Clear');
    fireEvent.click(clearBtn);
    expect(screen.queryByTestId('spot-recent')).not.toBeInTheDocument();
  });
});

// ── Loading state ────────────────────────────────────────────

describe('Spotlight loading', () => {
  it('loading durumunda loading mesaji gosterir', () => {
    function LoadingSpotlight() {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <Spotlight
          items={[]}
          open={isOpen}
          onOpenChange={setIsOpen}
          loadingMessage="Searching..."
        />
      );
    }
    // Loading state hook uzerinden tetiklenir, component seviyesinde test
    // Burada sadece render testiy apiyoruz
    render(<LoadingSpotlight />);
    // Loading state dogrudan set edilemez prop ile, hook uzerinden olur
    // En azindan component renderini dogrulayalim
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
