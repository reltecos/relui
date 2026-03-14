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
import { CommandPalette } from './CommandPalette';
import type { CommandPaletteItem } from '@relteco/relui-core';
import { useState } from 'react';

// ── jsdom scrollIntoView mock ────────────────────────────────────
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

// ── Test verileri ──────────────────────────────────────────────

const basicItems: CommandPaletteItem[] = [
  { key: 'save', label: 'Save File', shortcut: 'Ctrl+S' },
  { key: 'open', label: 'Open File', shortcut: 'Ctrl+O' },
  { key: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
  { key: 'paste', label: 'Paste', shortcut: 'Ctrl+V' },
];

const mixedItems: CommandPaletteItem[] = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta', disabled: true },
  { key: 'c', label: 'Charlie' },
];

const groupedItems: CommandPaletteItem[] = [
  { key: 'save', label: 'Save', group: 'file' },
  { key: 'open', label: 'Open', group: 'file' },
  { key: 'copy', label: 'Copy', group: 'edit' },
  { key: 'undo', label: 'Undo', group: 'edit' },
];

const iconItems: CommandPaletteItem[] = [
  { key: 'save', label: 'Save', icon: 'save' },
  { key: 'search', label: 'Search', icon: 'search' },
];

const descItems: CommandPaletteItem[] = [
  { key: 'save', label: 'Save File', description: 'Save the current document' },
  { key: 'open', label: 'Open File', description: 'Open an existing file' },
];

// ── Wrapper ──────────────────────────────────────────────────

function OpenCommandPalette(
  props: Omit<React.ComponentProps<typeof CommandPalette>, 'open'> & {
    initialOpen?: boolean;
  },
) {
  const { initialOpen = true, ...rest } = props;
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <CommandPalette
      {...rest}
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        rest.onOpenChange?.(open);
      }}
    />
  );
}

// ── Render ─────────────────────────────────────────────────────

describe('CommandPalette render', () => {
  it('kapali durumda render etmez', () => {
    render(<CommandPalette items={basicItems} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('acik durumda render eder', () => {
    render(<OpenCommandPalette items={basicItems} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('ref destekler', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<OpenCommandPalette items={basicItems} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('id prop destekler', () => {
    render(<OpenCommandPalette items={basicItems} id="test-cp" />);
    const dialog = document.getElementById('test-cp');
    expect(dialog).toBeInTheDocument();
  });

  it('input render eder', () => {
    render(<OpenCommandPalette items={basicItems} />);
    expect(screen.getByTestId('cp-input')).toBeInTheDocument();
  });

  it('listbox render eder', () => {
    render(<OpenCommandPalette items={basicItems} />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('ogeler render eder', () => {
    render(<OpenCommandPalette items={basicItems} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
  });

  it('oge label gosterir', () => {
    render(<OpenCommandPalette items={basicItems} />);
    expect(screen.getByText('Save File')).toBeInTheDocument();
    expect(screen.getByText('Open File')).toBeInTheDocument();
  });

  it('overlay render eder', () => {
    render(<OpenCommandPalette items={basicItems} />);
    expect(screen.getByTestId('cp-overlay')).toBeInTheDocument();
  });

  it('placeholder gosterir', () => {
    render(<OpenCommandPalette items={basicItems} placeholder="Search commands..." />);
    expect(screen.getByPlaceholderText('Search commands...')).toBeInTheDocument();
  });

  it('bos items ile empty state gosterir', () => {
    render(<OpenCommandPalette items={[]} />);
    expect(screen.getByTestId('cp-empty')).toBeInTheDocument();
  });

  it('ozel emptyMessage gosterir', () => {
    render(<OpenCommandPalette items={[]} emptyMessage="Nothing found" />);
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });
});

// ── Boyutlar ─────────────────────────────────────────────────

describe('CommandPalette sizes', () => {
  it('varsayilan md boyutu', () => {
    render(<OpenCommandPalette items={basicItems} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('xs boyutu render eder', () => {
    render(<OpenCommandPalette items={basicItems} size="xs" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('xl boyutu render eder', () => {
    render(<OpenCommandPalette items={basicItems} size="xl" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

// ── Shortcut ─────────────────────────────────────────────────

describe('CommandPalette shortcuts', () => {
  it('shortcut gosterir', () => {
    render(<OpenCommandPalette items={basicItems} />);
    const ctrls = screen.getAllByText('Ctrl');
    expect(ctrls.length).toBeGreaterThan(0);
    expect(screen.getByText('S')).toBeInTheDocument();
  });
});

// ── Description ──────────────────────────────────────────────

describe('CommandPalette descriptions', () => {
  it('description gosterir', () => {
    render(<OpenCommandPalette items={descItems} />);
    expect(screen.getByText('Save the current document')).toBeInTheDocument();
  });
});

// ── Groups ───────────────────────────────────────────────────

describe('CommandPalette groups', () => {
  it('grup basliklarini gosterir', () => {
    render(<OpenCommandPalette items={groupedItems} />);
    expect(screen.getByText('file')).toBeInTheDocument();
    expect(screen.getByText('edit')).toBeInTheDocument();
  });
});

// ── Icons ────────────────────────────────────────────────────

describe('CommandPalette icons', () => {
  it('renderIcon callback ile ikon render eder', () => {
    const renderIcon = (icon: string) => <span data-testid={`icon-${icon}`}>{icon}</span>;
    render(<OpenCommandPalette items={iconItems} renderIcon={renderIcon} />);
    expect(screen.getByTestId('icon-save')).toBeInTheDocument();
    expect(screen.getByTestId('icon-search')).toBeInTheDocument();
  });

  it('renderIcon olmadan ikon render etmez', () => {
    const { container } = render(<OpenCommandPalette items={iconItems} />);
    expect(container.querySelectorAll('[data-testid^="icon-"]')).toHaveLength(0);
  });
});

// ── Disabled ─────────────────────────────────────────────────

describe('CommandPalette disabled', () => {
  it('disabled oge aria-disabled gosterir', () => {
    render(<OpenCommandPalette items={mixedItems} />);
    const options = screen.getAllByRole('option');
    const disabled = options[1];
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
  });

  it('disabled oge data-disabled gosterir', () => {
    render(<OpenCommandPalette items={mixedItems} />);
    const options = screen.getAllByRole('option');
    const disabled = options[1];
    expect(disabled).toHaveAttribute('data-disabled', '');
  });
});

// ── Keyboard ─────────────────────────────────────────────────

describe('CommandPalette keyboard', () => {
  it('Escape ile kapatir', () => {
    const onOpenChange = vi.fn();
    render(<OpenCommandPalette items={basicItems} onOpenChange={onOpenChange} />);
    const input = screen.getByTestId('cp-input');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('ArrowDown ile sonraki ogeye gecer', () => {
    render(<OpenCommandPalette items={basicItems} />);
    const input = screen.getByTestId('cp-input');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('data-highlighted', '');
  });

  it('ArrowUp ile onceki ogeye gecer', () => {
    render(<OpenCommandPalette items={basicItems} />);
    const input = screen.getByTestId('cp-input');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('data-highlighted', '');
  });

  it('Enter ile secim yapar', () => {
    const onSelect = vi.fn();
    render(<OpenCommandPalette items={basicItems} onSelect={onSelect} />);
    const input = screen.getByTestId('cp-input');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('save', expect.objectContaining({ key: 'save' }));
  });
});

// ── Callbacks ────────────────────────────────────────────────

describe('CommandPalette callbacks', () => {
  it('onSelect tiklama ile cagirilir', () => {
    const onSelect = vi.fn();
    render(<OpenCommandPalette items={basicItems} onSelect={onSelect} />);
    const options = screen.getAllByRole('option');
    const first = options[0];
    if (first) fireEvent.click(first);
    expect(onSelect).toHaveBeenCalledWith('save', expect.objectContaining({ key: 'save' }));
  });

  it('onSelect disabled ogede cagirilmaz', () => {
    const onSelect = vi.fn();
    render(<OpenCommandPalette items={mixedItems} onSelect={onSelect} />);
    const options = screen.getAllByRole('option');
    const disabled = options[1];
    if (disabled) fireEvent.click(disabled);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('onOpenChange kapandiginda cagirilir', () => {
    const onOpenChange = vi.fn();
    render(<OpenCommandPalette items={basicItems} onOpenChange={onOpenChange} />);
    const input = screen.getByTestId('cp-input');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ── Overlay ──────────────────────────────────────────────────

describe('CommandPalette overlay', () => {
  it('overlay tiklaninca kapatir', () => {
    const onOpenChange = vi.fn();
    render(<OpenCommandPalette items={basicItems} onOpenChange={onOpenChange} />);
    const overlay = screen.getByTestId('cp-overlay');
    fireEvent.click(overlay);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ── A11y ─────────────────────────────────────────────────────

describe('CommandPalette a11y', () => {
  it('dialog role gosterir', () => {
    render(<OpenCommandPalette items={basicItems} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('aria-label gosterir', () => {
    render(<OpenCommandPalette items={basicItems} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Command Palette');
  });

  it('aria-modal gosterir', () => {
    render(<OpenCommandPalette items={basicItems} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('input combobox role gosterir', () => {
    render(<OpenCommandPalette items={basicItems} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('listbox role gosterir', () => {
    render(<OpenCommandPalette items={basicItems} />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('option role gosterir', () => {
    render(<OpenCommandPalette items={basicItems} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
  });
});

// ── Slot API ─────────────────────────────────────────────────

describe('CommandPalette slot API', () => {
  it('className root slot', () => {
    render(<OpenCommandPalette items={basicItems} className="custom-cp" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('custom-cp');
  });

  it('style root slot', () => {
    render(<OpenCommandPalette items={basicItems} style={{ opacity: 0.5 }} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.style.opacity).toBe('0.5');
  });

  it('classNames.overlay slot', () => {
    render(
      <OpenCommandPalette
        items={basicItems}
        classNames={{ overlay: 'my-overlay' }}
      />,
    );
    const overlay = screen.getByTestId('cp-overlay');
    expect(overlay.className).toContain('my-overlay');
  });

  it('styles.overlay slot', () => {
    render(
      <OpenCommandPalette
        items={basicItems}
        styles={{ overlay: { opacity: 0.8 } }}
      />,
    );
    const overlay = screen.getByTestId('cp-overlay');
    expect(overlay.style.opacity).toBe('0.8');
  });
});

// ── Filtreleme ───────────────────────────────────────────────

describe('CommandPalette filtering', () => {
  it('input degisince filtrelenir', () => {
    render(<OpenCommandPalette items={basicItems} />);
    const input = screen.getByTestId('cp-input');
    fireEvent.change(input, { target: { value: 'save' } });
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(1);
    expect(screen.getByText('Save File')).toBeInTheDocument();
  });

  it('eslesmez query empty state gosterir', () => {
    render(<OpenCommandPalette items={basicItems} />);
    const input = screen.getByTestId('cp-input');
    fireEvent.change(input, { target: { value: 'xyznonexistent' } });
    expect(screen.getByTestId('cp-empty')).toBeInTheDocument();
  });
});
