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
import { Sidebar } from './Sidebar';
import type { SidebarItem } from '@relteco/relui-core';

// ── Test verileri ──────────────────────────────────────────────────

const simpleItems: SidebarItem[] = [
  { key: 'home', label: 'Ana Sayfa', icon: 'H', href: '/' },
  { key: 'products', label: 'Urunler', icon: 'P', href: '/products' },
  { key: 'about', label: 'Hakkinda', icon: 'A', href: '/about' },
];

const groupedItems: SidebarItem[] = [
  { key: 'home', label: 'Ana Sayfa', icon: 'H' },
  {
    key: 'settings',
    label: 'Ayarlar',
    icon: 'S',
    children: [
      { key: 'profile', label: 'Profil' },
      { key: 'security', label: 'Guvenlik' },
    ],
  },
];

// ── Render ──────────────────────────────────────────────────────────

describe('Sidebar render', () => {
  it('nav elementi render eder', () => {
    render(<Sidebar items={simpleItems} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Sidebar');
  });

  it('tum ogeleri render eder', () => {
    render(<Sidebar items={simpleItems} />);
    expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
    expect(screen.getByText('Urunler')).toBeInTheDocument();
    expect(screen.getByText('Hakkinda')).toBeInTheDocument();
  });

  it('href olan ogeler link olarak render edilir', () => {
    render(<Sidebar items={simpleItems} />);
    const homeLink = screen.getByText('Ana Sayfa').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('ref iletilir', () => {
    const ref = vi.fn();
    render(<Sidebar items={simpleItems} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });

  it('id prop eklenir', () => {
    render(<Sidebar items={simpleItems} id="sb-1" />);
    expect(screen.getByRole('navigation')).toHaveAttribute('id', 'sb-1');
  });

  it('bos items ile render eder', () => {
    render(<Sidebar items={[]} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

// ── A11y ────────────────────────────────────────────────────────────

describe('Sidebar a11y', () => {
  it('aktif ogede aria-current=page', () => {
    render(<Sidebar items={simpleItems} defaultActiveKey="home" />);
    const homeEl = screen.getByText('Ana Sayfa').closest('a');
    expect(homeEl).toHaveAttribute('aria-current', 'page');
  });

  it('aktif olmayan ogede aria-current yok', () => {
    render(<Sidebar items={simpleItems} defaultActiveKey="home" />);
    const prodEl = screen.getByText('Urunler').closest('a');
    expect(prodEl).not.toHaveAttribute('aria-current');
  });

  it('disabled oge aria-disabled', () => {
    const items: SidebarItem[] = [
      { key: 'a', label: 'Normal' },
      { key: 'b', label: 'Disabled', disabled: true },
    ];
    render(<Sidebar items={items} />);
    const disabledEl = screen.getByText('Disabled').closest('button');
    expect(disabledEl).toHaveAttribute('aria-disabled', 'true');
  });
});

// ── Active item ─────────────────────────────────────────────────────

describe('Sidebar active item', () => {
  it('oge tiklaninca aktif olur', () => {
    const onActiveChange = vi.fn();
    render(<Sidebar items={simpleItems} onActiveChange={onActiveChange} />);
    fireEvent.click(screen.getByText('Urunler'));
    expect(onActiveChange).toHaveBeenCalledWith('products');
  });

  it('zaten aktif olan ogeye tiklaninca callback tetiklenmez', () => {
    const onActiveChange = vi.fn();
    render(<Sidebar items={simpleItems} defaultActiveKey="home" onActiveChange={onActiveChange} />);
    fireEvent.click(screen.getByText('Ana Sayfa'));
    expect(onActiveChange).not.toHaveBeenCalled();
  });
});

// ── Collapse ────────────────────────────────────────────────────────

describe('Sidebar collapse', () => {
  it('daralt butonu gosterilir', () => {
    render(<Sidebar items={simpleItems} />);
    expect(screen.getByLabelText('Daralt')).toBeInTheDocument();
  });

  it('daralt butonuna tiklaninca daraltilir', () => {
    const onCollapseChange = vi.fn();
    render(<Sidebar items={simpleItems} onCollapseChange={onCollapseChange} />);
    fireEvent.click(screen.getByLabelText('Daralt'));
    expect(onCollapseChange).toHaveBeenCalledWith(true);
  });

  it('daraltilmis halde genislet butonu gosterilir', () => {
    render(<Sidebar items={simpleItems} defaultCollapsed />);
    expect(screen.getByLabelText('Genislet')).toBeInTheDocument();
  });

  it('showCollapseButton=false ile buton gizli', () => {
    render(<Sidebar items={simpleItems} showCollapseButton={false} />);
    expect(screen.queryByLabelText('Daralt')).not.toBeInTheDocument();
  });

  it('daraltilmis halde data-collapsed attribute', () => {
    render(<Sidebar items={simpleItems} defaultCollapsed />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('data-collapsed', '');
  });
});

// ── Groups ──────────────────────────────────────────────────────────

describe('Sidebar groups', () => {
  it('grup trigger render eder', () => {
    render(<Sidebar items={groupedItems} />);
    expect(screen.getByText('Ayarlar')).toBeInTheDocument();
  });

  it('grup varsayilan kapali', () => {
    render(<Sidebar items={groupedItems} />);
    expect(screen.queryByText('Profil')).not.toBeInTheDocument();
  });

  it('grup tiklaninca acilir', () => {
    render(<Sidebar items={groupedItems} />);
    fireEvent.click(screen.getByText('Ayarlar'));
    expect(screen.getByText('Profil')).toBeInTheDocument();
    expect(screen.getByText('Guvenlik')).toBeInTheDocument();
  });

  it('acik grup tekrar tiklaninca kapanir', () => {
    render(<Sidebar items={groupedItems} defaultExpandedKeys={['settings']} />);
    expect(screen.getByText('Profil')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Ayarlar'));
    expect(screen.queryByText('Profil')).not.toBeInTheDocument();
  });

  it('defaultExpandedKeys ile baslangiçta acik', () => {
    render(<Sidebar items={groupedItems} defaultExpandedKeys={['settings']} />);
    expect(screen.getByText('Profil')).toBeInTheDocument();
  });

  it('grup trigger aria-expanded', () => {
    render(<Sidebar items={groupedItems} defaultExpandedKeys={['settings']} />);
    const trigger = screen.getByText('Ayarlar').closest('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});

// ── Header / Footer ─────────────────────────────────────────────────

describe('Sidebar header/footer', () => {
  it('header render eder', () => {
    render(<Sidebar items={simpleItems} header={<div>Logo</div>} />);
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('footer render eder', () => {
    render(<Sidebar items={simpleItems} footer={<div>Version 1.0</div>} />);
    expect(screen.getByText('Version 1.0')).toBeInTheDocument();
  });

  it('header ve footer olmadan da calisir', () => {
    render(<Sidebar items={simpleItems} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

// ── Special items ───────────────────────────────────────────────────

describe('Sidebar special items', () => {
  it('divider render eder', () => {
    const items: SidebarItem[] = [
      { key: 'a', label: 'A' },
      { key: 'div1', label: '', divider: true },
      { key: 'b', label: 'B' },
    ];
    render(<Sidebar items={items} />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('sectionHeader render eder', () => {
    const items: SidebarItem[] = [
      { key: 'sec1', label: 'Bolum 1', sectionHeader: true },
      { key: 'a', label: 'A' },
    ];
    render(<Sidebar items={items} />);
    expect(screen.getByText('Bolum 1')).toBeInTheDocument();
  });

  it('badge render eder', () => {
    const items: SidebarItem[] = [
      { key: 'inbox', label: 'Gelen Kutusu', badge: '5' },
    ];
    render(<Sidebar items={items} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});

// ── Slot API ────────────────────────────────────────────────────────

describe('Sidebar slot API', () => {
  it('classNames.root eklenir', () => {
    render(<Sidebar items={simpleItems} classNames={{ root: 'custom-root' }} />);
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('custom-root');
  });

  it('styles.root uygulanir', () => {
    render(<Sidebar items={simpleItems} styles={{ root: { padding: '10px' } }} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveStyle({ padding: '10px' });
  });

  it('className prop root ile birlesir', () => {
    render(
      <Sidebar items={simpleItems} className="outer" classNames={{ root: 'inner' }} />,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('outer');
    expect(nav.className).toContain('inner');
  });

  it('style prop root ile birlesir', () => {
    render(
      <Sidebar
        items={simpleItems}
        style={{ opacity: '0.9' }}
        styles={{ root: { padding: '4px' } }}
      />,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveStyle({ opacity: '0.9' });
    expect(nav).toHaveStyle({ padding: '4px' });
  });
});

// ── Position ────────────────────────────────────────────────────────

describe('Sidebar position', () => {
  it('varsayilan position left', () => {
    render(<Sidebar items={simpleItems} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-position', 'left');
  });

  it('position right', () => {
    render(<Sidebar items={simpleItems} position="right" />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-position', 'right');
  });
});

// ── renderIcon ──────────────────────────────────────────────────────

describe('Sidebar renderIcon', () => {
  it('renderIcon callback kullanilir', () => {
    render(
      <Sidebar
        items={simpleItems}
        renderIcon={(icon) => <span data-testid="custom-icon">{icon}</span>}
      />,
    );
    const icons = screen.getAllByTestId('custom-icon');
    expect(icons).toHaveLength(3);
  });
});

// ── Compound API ──────────────────────────────────────────────────

describe('Sidebar (Compound)', () => {
  it('compound: header render edilir', () => {
    render(
      <Sidebar>
        <Sidebar.Header>MyLogo</Sidebar.Header>
        <Sidebar.Section>
          <Sidebar.Item>Home</Sidebar.Item>
        </Sidebar.Section>
      </Sidebar>,
    );
    expect(screen.getByTestId('sidebar-header')).toHaveTextContent('MyLogo');
  });

  it('compound: section ve item render edilir', () => {
    render(
      <Sidebar>
        <Sidebar.Section title="Nav">
          <Sidebar.Item>Home</Sidebar.Item>
          <Sidebar.Item>About</Sidebar.Item>
        </Sidebar.Section>
      </Sidebar>,
    );
    expect(screen.getByTestId('sidebar-section')).toBeInTheDocument();
    expect(screen.getByText('Nav')).toBeInTheDocument();
    const items = screen.getAllByTestId('sidebar-item');
    expect(items).toHaveLength(2);
  });

  it('compound: footer render edilir', () => {
    render(
      <Sidebar>
        <Sidebar.Section>
          <Sidebar.Item>Home</Sidebar.Item>
        </Sidebar.Section>
        <Sidebar.Footer>v1.0</Sidebar.Footer>
      </Sidebar>,
    );
    expect(screen.getByTestId('sidebar-footer')).toHaveTextContent('v1.0');
  });

  it('compound: active item aria-current alir', () => {
    render(
      <Sidebar>
        <Sidebar.Section>
          <Sidebar.Item active>Home</Sidebar.Item>
          <Sidebar.Item>About</Sidebar.Item>
        </Sidebar.Section>
      </Sidebar>,
    );
    const items = screen.getAllByTestId('sidebar-item');
    expect(items[0]).toHaveAttribute('aria-current', 'page');
    expect(items[1]).not.toHaveAttribute('aria-current');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Sidebar classNames={{ header: 'cmp-header' }}>
        <Sidebar.Header>Logo</Sidebar.Header>
        <Sidebar.Section>
          <Sidebar.Item>Home</Sidebar.Item>
        </Sidebar.Section>
      </Sidebar>,
    );
    expect(screen.getByTestId('sidebar-header').className).toContain('cmp-header');
  });

  it('Sidebar.Header context disinda hata firlatir', () => {
    expect(() => render(<Sidebar.Header>Test</Sidebar.Header>)).toThrow();
  });
});
