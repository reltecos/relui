/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { RadialMenu } from './RadialMenu';
import type { RadialMenuItem } from '@relteco/relui-core';
import { useState } from 'react';

// ── Test verileri ──────────────────────────────────────────────

const basicItems: RadialMenuItem[] = [
  { key: 'cut', label: 'Kes' },
  { key: 'copy', label: 'Kopyala' },
  { key: 'paste', label: 'Yapistir' },
  { key: 'delete', label: 'Sil' },
];

const mixedItems: RadialMenuItem[] = [
  { key: 'a', label: 'A' },
  { key: 'b', label: 'B', disabled: true },
  { key: 'c', label: 'C' },
];

const submenuItems: RadialMenuItem[] = [
  { key: 'file', label: 'Dosya', children: [
    { key: 'new', label: 'Yeni' },
    { key: 'open', label: 'Ac' },
  ]},
  { key: 'edit', label: 'Duzenle' },
];

const iconItems: RadialMenuItem[] = [
  { key: 'cut', label: 'Kes', icon: 'scissors' },
  { key: 'copy', label: 'Kopyala', icon: 'copy' },
];

// ── Wrapper — menu acik ve pozisyon verilmis ──

function OpenRadialMenu(
  props: Omit<React.ComponentProps<typeof RadialMenu>, 'open' | 'position'> & {
    initialOpen?: boolean;
  },
) {
  const { initialOpen = true, ...rest } = props;
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <RadialMenu
      {...rest}
      open={isOpen}
      position={{ x: 200, y: 200 }}
      onOpenChange={(open) => {
        setIsOpen(open);
        rest.onOpenChange?.(open);
      }}
    />
  );
}

// ── Render ─────────────────────────────────────────────────────

describe('RadialMenu render', () => {
  it('kapali durumda render etmez', () => {
    const { container } = render(
      <RadialMenu items={basicItems} open={false} position={{ x: 0, y: 0 }} />,
    );
    expect(container.querySelector('[role="menu"]')).not.toBeInTheDocument();
  });

  it('acik durumda render eder', () => {
    render(<OpenRadialMenu items={basicItems} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('ref destekler', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<OpenRadialMenu items={basicItems} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('id prop destekler', () => {
    render(<OpenRadialMenu items={basicItems} id="test-radial" />);
    const menu = document.getElementById('test-radial');
    expect(menu).toBeInTheDocument();
  });

  it('4 sektor render eder', () => {
    render(<OpenRadialMenu items={basicItems} />);
    const sectors = screen.getAllByRole('menuitem');
    expect(sectors).toHaveLength(4);
  });

  it('sektor label gosterir', () => {
    render(<OpenRadialMenu items={basicItems} />);
    expect(screen.getByText('Kes')).toBeInTheDocument();
    expect(screen.getByText('Kopyala')).toBeInTheDocument();
    expect(screen.getByText('Yapistir')).toBeInTheDocument();
    expect(screen.getByText('Sil')).toBeInTheDocument();
  });

  it('bos items ile bos menu render eder', () => {
    render(<OpenRadialMenu items={[]} />);
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
  });

  it('overlay render eder', () => {
    render(<OpenRadialMenu items={basicItems} />);
    expect(screen.getByTestId('radial-overlay')).toBeInTheDocument();
  });

  it('merkez noktasi render eder', () => {
    render(<OpenRadialMenu items={basicItems} />);
    expect(screen.getByTestId('radial-center')).toBeInTheDocument();
  });
});

// ── Boyutlar ──────────────────────────────────────────────────

describe('RadialMenu sizes', () => {
  it('varsayilan md boyutu', () => {
    render(<OpenRadialMenu items={basicItems} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('xs boyutu render eder', () => {
    render(<OpenRadialMenu items={basicItems} size="xs" />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('xl boyutu render eder', () => {
    render(<OpenRadialMenu items={basicItems} size="xl" />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

// ── Disabled ogeler ──────────────────────────────────────────

describe('RadialMenu disabled items', () => {
  it('disabled oge aria-disabled gosterir', () => {
    render(<OpenRadialMenu items={mixedItems} />);
    const sectors = screen.getAllByRole('menuitem');
    // B disabled (index 1)
    const disabledSector = sectors[1];
    expect(disabledSector).toHaveAttribute('aria-disabled', 'true');
  });

  it('disabled oge data-disabled gosterir', () => {
    render(<OpenRadialMenu items={mixedItems} />);
    const sectors = screen.getAllByRole('menuitem');
    const disabledSector = sectors[1];
    expect(disabledSector).toHaveAttribute('data-disabled', '');
  });
});

// ── Icon render ──────────────────────────────────────────────

describe('RadialMenu icons', () => {
  it('renderIcon callback ile ikon render eder', () => {
    const renderIcon = (icon: string) => <span data-testid={`icon-${icon}`}>{icon}</span>;
    render(<OpenRadialMenu items={iconItems} renderIcon={renderIcon} />);
    expect(screen.getByTestId('icon-scissors')).toBeInTheDocument();
    expect(screen.getByTestId('icon-copy')).toBeInTheDocument();
  });

  it('renderIcon olmadan ikon render etmez', () => {
    const { container } = render(<OpenRadialMenu items={iconItems} />);
    expect(container.querySelectorAll('[data-testid^="icon-"]')).toHaveLength(0);
  });
});

// ── Submenu indicator ────────────────────────────────────────

describe('RadialMenu submenu indicator', () => {
  it('children olan ogede submenu indicator gosterir', () => {
    render(<OpenRadialMenu items={submenuItems} />);
    // Portal document.body'ye render eder — document uzerinden sorgula
    const labels = screen.getByText('Dosya').parentElement;
    expect(labels).toBeInTheDocument();
    // children olan ogede submenu indicator (kucuk dot) olmali
    const indicator = labels?.querySelector('span:last-child');
    expect(indicator).toBeInTheDocument();
  });
});

// ── Keyboard ─────────────────────────────────────────────────

describe('RadialMenu keyboard', () => {
  it('Escape ile kapatir', () => {
    const onOpenChange = vi.fn();
    render(<OpenRadialMenu items={basicItems} onOpenChange={onOpenChange} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('ArrowDown ile sonraki sektore gecer', () => {
    render(<OpenRadialMenu items={basicItems} />);
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    const sectors = screen.getAllByRole('menuitem');
    expect(sectors[0]).toBeInTheDocument();
  });

  it('ArrowUp ile onceki sektore gecer', () => {
    render(<OpenRadialMenu items={basicItems} />);
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
  });

  it('Enter ile secim yapar', () => {
    const onSelect = vi.fn();
    render(<OpenRadialMenu items={basicItems} onSelect={onSelect} />);
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('cut', expect.objectContaining({ key: 'cut' }));
  });

  it('Space ile secim yapar', () => {
    const onSelect = vi.fn();
    render(<OpenRadialMenu items={basicItems} onSelect={onSelect} />);
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: ' ' });
    expect(onSelect).toHaveBeenCalledWith('cut', expect.objectContaining({ key: 'cut' }));
  });
});

// ── Callbacks ────────────────────────────────────────────────

describe('RadialMenu callbacks', () => {
  it('onSelect yaprak ogede cagirilir', () => {
    const onSelect = vi.fn();
    render(<OpenRadialMenu items={basicItems} onSelect={onSelect} />);
    const sectors = screen.getAllByRole('menuitem');
    const first = sectors[0];
    if (first) fireEvent.click(first);
    expect(onSelect).toHaveBeenCalledWith('cut', expect.objectContaining({ key: 'cut' }));
  });

  it('onSelect disabled ogede cagirilmaz', () => {
    const onSelect = vi.fn();
    render(<OpenRadialMenu items={mixedItems} onSelect={onSelect} />);
    const sectors = screen.getAllByRole('menuitem');
    const second = sectors[1];
    if (second) fireEvent.click(second); // B disabled
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('onOpenChange kapandiginda cagirilir', () => {
    const onOpenChange = vi.fn();
    render(<OpenRadialMenu items={basicItems} onOpenChange={onOpenChange} />);
    // Escape ile kapat
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ── Overlay tiklama ──────────────────────────────────────────

describe('RadialMenu overlay', () => {
  it('overlay tiklaninca menu kapanir', () => {
    const onOpenChange = vi.fn();
    render(<OpenRadialMenu items={basicItems} onOpenChange={onOpenChange} />);
    const overlay = screen.getByTestId('radial-overlay');
    fireEvent.click(overlay);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ── A11y ─────────────────────────────────────────────────────

describe('RadialMenu a11y', () => {
  it('menu role gosterir', () => {
    render(<OpenRadialMenu items={basicItems} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('aria-label gosterir', () => {
    render(<OpenRadialMenu items={basicItems} />);
    expect(screen.getByRole('menu')).toHaveAttribute('aria-label', 'Radial Menu');
  });

  it('sektorler menuitem role gosterir', () => {
    render(<OpenRadialMenu items={basicItems} />);
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(4);
  });

  it('sektor aria-label dogru', () => {
    render(<OpenRadialMenu items={basicItems} />);
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems[0]).toHaveAttribute('aria-label', 'Kes');
  });
});

// ── Slot API ─────────────────────────────────────────────────

describe('RadialMenu slot API', () => {
  it('className root slot', () => {
    render(<OpenRadialMenu items={basicItems} className="custom-root" />);
    const menu = screen.getByRole('menu');
    expect(menu.className).toContain('custom-root');
  });

  it('style root slot', () => {
    render(<OpenRadialMenu items={basicItems} style={{ opacity: 0.5 }} />);
    const menu = screen.getByRole('menu');
    expect(menu.style.opacity).toBe('0.5');
  });

  it('classNames.overlay slot', () => {
    render(
      <OpenRadialMenu
        items={basicItems}
        classNames={{ overlay: 'my-overlay' }}
      />,
    );
    const overlay = screen.getByTestId('radial-overlay');
    expect(overlay.className).toContain('my-overlay');
  });

  it('styles.overlay slot', () => {
    render(
      <OpenRadialMenu
        items={basicItems}
        styles={{ overlay: { opacity: 0.8 } }}
      />,
    );
    const overlay = screen.getByTestId('radial-overlay');
    expect(overlay.style.opacity).toBe('0.8');
  });
});

// ── Compound API ──────────────────────────────────────────────

describe('RadialMenu (Compound)', () => {
  it('compound: Center sub-component render edilir', () => {
    render(
      <OpenRadialMenu items={basicItems}>
        <RadialMenu.Center>
          <span data-testid="custom-center">X</span>
        </RadialMenu.Center>
      </OpenRadialMenu>,
    );
    expect(screen.getByTestId('radial-center')).toBeInTheDocument();
    expect(screen.getByTestId('custom-center')).toBeInTheDocument();
  });

  it('compound: Center children olmadan varsayilan render edilir', () => {
    render(<OpenRadialMenu items={basicItems} />);
    expect(screen.getByTestId('radial-center')).toBeInTheDocument();
  });

  it('compound: Item sub-component render edilir', () => {
    render(<OpenRadialMenu items={basicItems} />);
    expect(screen.getByText('Kes')).toBeInTheDocument();
    expect(screen.getByText('Kopyala')).toBeInTheDocument();
  });

  it('compound: classNames context ile Center a aktarilir', () => {
    render(
      <OpenRadialMenu items={basicItems} classNames={{ center: 'cmp-center' }}>
        <RadialMenu.Center />
      </OpenRadialMenu>,
    );
    expect(screen.getByTestId('radial-center').className).toContain('cmp-center');
  });

  it('compound: styles context ile Center a aktarilir', () => {
    render(
      <OpenRadialMenu items={basicItems} styles={{ center: { letterSpacing: '3px' } }}>
        <RadialMenu.Center />
      </OpenRadialMenu>,
    );
    expect(screen.getByTestId('radial-center')).toHaveStyle({ letterSpacing: '3px' });
  });
});
