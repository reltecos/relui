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
import { Navbar } from './Navbar';
import type { NavbarItem } from '@relteco/relui-core';

// ── Test verileri ──────────────────────────────────────────────

const simpleItems: NavbarItem[] = [
  { key: 'home', label: 'Ana Sayfa', icon: 'H', href: '/' },
  { key: 'products', label: 'Urunler', icon: 'P', href: '/products' },
  { key: 'about', label: 'Hakkinda', icon: 'A', href: '/about' },
];

// ── Render ─────────────────────────────────────────────────────

describe('Navbar render', () => {
  it('nav elementi render eder', () => {
    render(<Navbar items={simpleItems} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Navbar');
  });

  it('tum ogeleri render eder', () => {
    render(<Navbar items={simpleItems} />);
    expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
    expect(screen.getByText('Urunler')).toBeInTheDocument();
    expect(screen.getByText('Hakkinda')).toBeInTheDocument();
  });

  it('href olan ogeler link olarak render edilir', () => {
    render(<Navbar items={simpleItems} />);
    const homeLink = screen.getByText('Ana Sayfa').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('href olmayan oge button olarak render edilir', () => {
    const items: NavbarItem[] = [{ key: 'x', label: 'Buton' }];
    render(<Navbar items={items} />);
    const btn = screen.getByText('Buton').closest('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('ref iletilir', () => {
    const ref = vi.fn();
    render(<Navbar items={simpleItems} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });

  it('id prop eklenir', () => {
    render(<Navbar items={simpleItems} id="nav-1" />);
    expect(screen.getByRole('navigation')).toHaveAttribute('id', 'nav-1');
  });

  it('bos items ile render eder', () => {
    render(<Navbar items={[]} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

// ── A11y ───────────────────────────────────────────────────────

describe('Navbar a11y', () => {
  it('aktif ogede aria-current=page', () => {
    render(<Navbar items={simpleItems} defaultActiveKey="home" />);
    const homeEl = screen.getByText('Ana Sayfa').closest('a');
    expect(homeEl).toHaveAttribute('aria-current', 'page');
  });

  it('aktif olmayan ogede aria-current yok', () => {
    render(<Navbar items={simpleItems} defaultActiveKey="home" />);
    const prodEl = screen.getByText('Urunler').closest('a');
    expect(prodEl).not.toHaveAttribute('aria-current');
  });

  it('disabled oge aria-disabled', () => {
    const items: NavbarItem[] = [
      { key: 'a', label: 'Normal' },
      { key: 'b', label: 'Disabled', disabled: true },
    ];
    render(<Navbar items={items} />);
    const disabledEl = screen.getByText('Disabled').closest('button');
    expect(disabledEl).toHaveAttribute('aria-disabled', 'true');
  });
});

// ── Active item ────────────────────────────────────────────────

describe('Navbar active item', () => {
  it('oge tiklaninca aktif olur', () => {
    const onActiveChange = vi.fn();
    render(<Navbar items={simpleItems} onActiveChange={onActiveChange} />);
    fireEvent.click(screen.getByText('Urunler'));
    expect(onActiveChange).toHaveBeenCalledWith('products');
  });

  it('zaten aktif olan ogeye tiklaninca callback tetiklenmez', () => {
    const onActiveChange = vi.fn();
    render(
      <Navbar items={simpleItems} defaultActiveKey="home" onActiveChange={onActiveChange} />,
    );
    fireEvent.click(screen.getByText('Ana Sayfa'));
    expect(onActiveChange).not.toHaveBeenCalled();
  });

  it('disabled ogeye tiklaninca callback tetiklenmez', () => {
    const onActiveChange = vi.fn();
    const items: NavbarItem[] = [
      { key: 'a', label: 'Normal' },
      { key: 'b', label: 'Disabled', disabled: true },
    ];
    render(<Navbar items={items} onActiveChange={onActiveChange} />);
    fireEvent.click(screen.getByText('Disabled'));
    expect(onActiveChange).not.toHaveBeenCalled();
  });
});

// ── Brand ──────────────────────────────────────────────────────

describe('Navbar brand', () => {
  it('brand render eder', () => {
    render(<Navbar items={simpleItems} brand={<span>Logo</span>} />);
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('brand olmadan da calisir', () => {
    render(<Navbar items={simpleItems} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

// ── Actions ────────────────────────────────────────────────────

describe('Navbar actions', () => {
  it('actions render eder', () => {
    render(<Navbar items={simpleItems} actions={<button>Login</button>} />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('actions olmadan da calisir', () => {
    render(<Navbar items={simpleItems} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

// ── Mobile menu ────────────────────────────────────────────────

describe('Navbar mobile menu', () => {
  it('mobil toggle butonu render edilir', () => {
    render(<Navbar items={simpleItems} />);
    const toggle = screen.getByLabelText('Menuyu ac');
    expect(toggle).toBeInTheDocument();
  });

  it('toggle tiklaninca mobil menu acilir', () => {
    const onMobileOpenChange = vi.fn();
    render(<Navbar items={simpleItems} onMobileOpenChange={onMobileOpenChange} />);
    fireEvent.click(screen.getByLabelText('Menuyu ac'));
    expect(onMobileOpenChange).toHaveBeenCalledWith(true);
  });

  it('acik durumda toggle tiklaninca kapanir', () => {
    const onMobileOpenChange = vi.fn();
    render(<Navbar items={simpleItems} defaultMobileOpen onMobileOpenChange={onMobileOpenChange} />);
    fireEvent.click(screen.getByLabelText('Menuyu kapat'));
    expect(onMobileOpenChange).toHaveBeenCalledWith(false);
  });

  it('defaultMobileOpen ile baslangiçta acik', () => {
    render(<Navbar items={simpleItems} defaultMobileOpen />);
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
  });

  it('kapali durumda mobil menu yok', () => {
    render(<Navbar items={simpleItems} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('mobil menude actions render edilir', () => {
    render(
      <Navbar items={simpleItems} defaultMobileOpen actions={<button>Login</button>} />,
    );
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
    // Actions should appear in both desktop and mobile
    const loginButtons = screen.getAllByText('Login');
    expect(loginButtons.length).toBeGreaterThanOrEqual(1);
  });
});

// ── Variant ────────────────────────────────────────────────────

describe('Navbar variant', () => {
  it('varsayilan variant solid', () => {
    render(<Navbar items={simpleItems} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-variant', 'solid');
  });

  it('variant transparent', () => {
    render(<Navbar items={simpleItems} variant="transparent" />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-variant', 'transparent');
  });

  it('variant blur', () => {
    render(<Navbar items={simpleItems} variant="blur" />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-variant', 'blur');
  });
});

// ── Sticky ─────────────────────────────────────────────────────

describe('Navbar sticky', () => {
  it('sticky=true ile data-sticky attribute', () => {
    render(<Navbar items={simpleItems} sticky />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-sticky', '');
  });

  it('sticky=false ile data-sticky yok', () => {
    render(<Navbar items={simpleItems} />);
    expect(screen.getByRole('navigation')).not.toHaveAttribute('data-sticky');
  });
});

// ── Slot API ───────────────────────────────────────────────────

describe('Navbar slot API', () => {
  it('classNames.root eklenir', () => {
    render(<Navbar items={simpleItems} classNames={{ root: 'custom-root' }} />);
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('custom-root');
  });

  it('styles.root uygulanir', () => {
    render(<Navbar items={simpleItems} styles={{ root: { padding: '10px' } }} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveStyle({ padding: '10px' });
  });

  it('className prop root ile birlesir', () => {
    render(
      <Navbar items={simpleItems} className="outer" classNames={{ root: 'inner' }} />,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('outer');
    expect(nav.className).toContain('inner');
  });

  it('style prop root ile birlesir', () => {
    render(
      <Navbar
        items={simpleItems}
        style={{ opacity: '0.9' }}
        styles={{ root: { letterSpacing: '1px' } }}
      />,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveStyle({ opacity: '0.9' });
    expect(nav).toHaveStyle({ letterSpacing: '1px' });
  });
});

// ── renderIcon ─────────────────────────────────────────────────

describe('Navbar renderIcon', () => {
  it('renderIcon callback kullanilir', () => {
    render(
      <Navbar
        items={simpleItems}
        renderIcon={(icon) => <span data-testid="custom-icon">{icon}</span>}
      />,
    );
    const icons = screen.getAllByTestId('custom-icon');
    expect(icons).toHaveLength(3);
  });
});
