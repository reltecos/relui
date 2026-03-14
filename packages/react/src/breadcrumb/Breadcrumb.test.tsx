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
import { Breadcrumb } from './Breadcrumb';
import type { BreadcrumbItem } from '@relteco/relui-core';

// ── Test verileri ──────────────────────────────────────────────────

const simpleItems: BreadcrumbItem[] = [
  { key: 'home', label: 'Ana Sayfa', href: '/' },
  { key: 'products', label: 'Urunler', href: '/products' },
  { key: 'detail', label: 'Urun Detayi' },
];

const longItems: BreadcrumbItem[] = [
  { key: 'home', label: 'Ana Sayfa', href: '/' },
  { key: 'cat', label: 'Kategori', href: '/cat' },
  { key: 'sub', label: 'Alt Kategori', href: '/cat/sub' },
  { key: 'brand', label: 'Marka', href: '/cat/sub/brand' },
  { key: 'product', label: 'Urun', href: '/cat/sub/brand/product' },
  { key: 'detail', label: 'Detay' },
];

// ── Render ──────────────────────────────────────────────────────────

describe('Breadcrumb render', () => {
  it('nav elementi render eder', () => {
    render(<Breadcrumb items={simpleItems} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });

  it('ol listesi render eder', () => {
    render(<Breadcrumb items={simpleItems} />);
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
  });

  it('tum ogeleri render eder', () => {
    render(<Breadcrumb items={simpleItems} />);
    expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
    expect(screen.getByText('Urunler')).toBeInTheDocument();
    expect(screen.getByText('Urun Detayi')).toBeInTheDocument();
  });

  it('href olan ogeler link olarak render edilir', () => {
    render(<Breadcrumb items={simpleItems} />);
    const homeLink = screen.getByText('Ana Sayfa');
    expect(homeLink.tagName).toBe('A');
    expect(homeLink).toHaveAttribute('href', '/');

    const productsLink = screen.getByText('Urunler');
    expect(productsLink.tagName).toBe('A');
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  it('son oge span olarak render edilir (link degil)', () => {
    render(<Breadcrumb items={simpleItems} />);
    const lastItem = screen.getByText('Urun Detayi');
    expect(lastItem.tagName).toBe('SPAN');
  });

  it('bos items ile render eder', () => {
    render(<Breadcrumb items={[]} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('tek oge ile render eder', () => {
    render(<Breadcrumb items={[{ key: 'only', label: 'Tek Sayfa' }]} />);
    expect(screen.getByText('Tek Sayfa')).toBeInTheDocument();
  });

  it('ref iletilir', () => {
    const ref = vi.fn();
    render(<Breadcrumb items={simpleItems} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });
});

// ── A11y ────────────────────────────────────────────────────────────

describe('Breadcrumb a11y', () => {
  it('son ogede aria-current=page', () => {
    render(<Breadcrumb items={simpleItems} />);
    const lastItem = screen.getByText('Urun Detayi');
    expect(lastItem).toHaveAttribute('aria-current', 'page');
  });

  it('son olmayan ogelerde aria-current yok', () => {
    render(<Breadcrumb items={simpleItems} />);
    const homeLink = screen.getByText('Ana Sayfa');
    expect(homeLink).not.toHaveAttribute('aria-current');
  });

  it('disabled oge aria-disabled=true', () => {
    const items: BreadcrumbItem[] = [
      { key: 'a', label: 'Normal', href: '/' },
      { key: 'b', label: 'Disabled', href: '/dis', disabled: true },
      { key: 'c', label: 'Son' },
    ];
    render(<Breadcrumb items={items} />);
    const disabledItem = screen.getByText('Disabled');
    expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
    expect(disabledItem).toHaveAttribute('data-disabled', '');
  });

  it('separator aria-hidden=true', () => {
    render(<Breadcrumb items={simpleItems} />);
    const separators = document.querySelectorAll('[aria-hidden="true"]');
    expect(separators.length).toBe(2);
  });
});

// ── Separator ───────────────────────────────────────────────────────

describe('Breadcrumb separator', () => {
  it('varsayilan separator /', () => {
    render(<Breadcrumb items={simpleItems} />);
    const separators = document.querySelectorAll('[aria-hidden="true"]');
    separators.forEach((sep) => {
      expect(sep.textContent).toBe('/');
    });
  });

  it('ozel separator', () => {
    render(<Breadcrumb items={simpleItems} separator=">" />);
    const separators = document.querySelectorAll('[aria-hidden="true"]');
    separators.forEach((sep) => {
      expect(sep.textContent).toBe('>');
    });
  });

  it('ReactNode separator', () => {
    render(
      <Breadcrumb
        items={simpleItems}
        separator={<span data-testid="custom-sep">→</span>}
      />,
    );
    const seps = screen.getAllByTestId('custom-sep');
    expect(seps).toHaveLength(2);
  });

  it('ilk ogeden once separator yok', () => {
    render(<Breadcrumb items={simpleItems} />);
    const list = screen.getByRole('list');
    const firstLi = list.querySelector('li:first-child');
    const sep = firstLi?.querySelector('[aria-hidden="true"]');
    expect(sep).toBeNull();
  });
});

// ── Collapse / Expand ───────────────────────────────────────────────

describe('Breadcrumb collapse/expand', () => {
  it('maxItems ile daraltma aktif', () => {
    render(<Breadcrumb items={longItems} maxItems={4} />);
    const ellipsisBtn = screen.getByLabelText('Daha fazla');
    expect(ellipsisBtn).toBeInTheDocument();
    expect(ellipsisBtn.textContent).toBe('...');
  });

  it('daraltilmis halde bas ve son ogeler gosterilir', () => {
    render(<Breadcrumb items={longItems} maxItems={4} />);
    expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
    expect(screen.getByText('Detay')).toBeInTheDocument();
    // Ortadakiler gorunmez
    expect(screen.queryByText('Kategori')).not.toBeInTheDocument();
    expect(screen.queryByText('Alt Kategori')).not.toBeInTheDocument();
    expect(screen.queryByText('Marka')).not.toBeInTheDocument();
    expect(screen.queryByText('Urun')).not.toBeInTheDocument();
  });

  it('ellipsis butonuna tiklaninca genisler', () => {
    render(<Breadcrumb items={longItems} maxItems={4} />);
    const ellipsisBtn = screen.getByLabelText('Daha fazla');
    fireEvent.click(ellipsisBtn);
    // Artik tum ogeler gorunur
    expect(screen.getByText('Kategori')).toBeInTheDocument();
    expect(screen.getByText('Alt Kategori')).toBeInTheDocument();
    expect(screen.getByText('Marka')).toBeInTheDocument();
    expect(screen.getByText('Urun')).toBeInTheDocument();
    // Ellipsis kaybolur
    expect(screen.queryByLabelText('Daha fazla')).not.toBeInTheDocument();
  });

  it('onExpand callback tetiklenir', () => {
    const onExpand = vi.fn();
    render(<Breadcrumb items={longItems} maxItems={4} onExpand={onExpand} />);
    fireEvent.click(screen.getByLabelText('Daha fazla'));
    expect(onExpand).toHaveBeenCalledTimes(1);
  });

  it('ozel itemsBeforeCollapse / itemsAfterCollapse', () => {
    render(
      <Breadcrumb
        items={longItems}
        maxItems={4}
        itemsBeforeCollapse={2}
        itemsAfterCollapse={2}
      />,
    );
    // 2 bastan, 2 sondan
    expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
    expect(screen.getByText('Kategori')).toBeInTheDocument();
    expect(screen.getByText('Urun')).toBeInTheDocument();
    expect(screen.getByText('Detay')).toBeInTheDocument();
    // Ortadakiler gorunmez
    expect(screen.queryByText('Alt Kategori')).not.toBeInTheDocument();
    expect(screen.queryByText('Marka')).not.toBeInTheDocument();
  });

  it('maxItems olmadan daraltma yok', () => {
    render(<Breadcrumb items={longItems} />);
    expect(screen.queryByLabelText('Daha fazla')).not.toBeInTheDocument();
    expect(screen.getByText('Kategori')).toBeInTheDocument();
  });
});

// ── Size ────────────────────────────────────────────────────────────

describe('Breadcrumb size', () => {
  it('varsayilan size md', () => {
    render(<Breadcrumb items={simpleItems} />);
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
  });

  it('size prop kabul edilir', () => {
    const { container } = render(<Breadcrumb items={simpleItems} size="lg" />);
    const list = container.querySelector('ol');
    expect(list).toBeInTheDocument();
  });
});

// ── Slot API ────────────────────────────────────────────────────────

describe('Breadcrumb slot API', () => {
  it('classNames.root eklenir', () => {
    render(<Breadcrumb items={simpleItems} classNames={{ root: 'custom-root' }} />);
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('custom-root');
  });

  it('classNames.list eklenir', () => {
    render(<Breadcrumb items={simpleItems} classNames={{ list: 'custom-list' }} />);
    const list = screen.getByRole('list');
    expect(list.className).toContain('custom-list');
  });

  it('classNames.link eklenir', () => {
    render(<Breadcrumb items={simpleItems} classNames={{ link: 'custom-link' }} />);
    const homeLink = screen.getByText('Ana Sayfa');
    expect(homeLink.className).toContain('custom-link');
  });

  it('classNames.separator eklenir', () => {
    render(<Breadcrumb items={simpleItems} classNames={{ separator: 'custom-sep' }} />);
    const seps = document.querySelectorAll('[aria-hidden="true"]');
    seps.forEach((sep) => {
      expect(sep.className).toContain('custom-sep');
    });
  });

  it('classNames.ellipsis eklenir', () => {
    render(
      <Breadcrumb items={longItems} maxItems={4} classNames={{ ellipsis: 'custom-ell' }} />,
    );
    const btn = screen.getByLabelText('Daha fazla');
    expect(btn.className).toContain('custom-ell');
  });

  it('styles.root uygulanir', () => {
    render(
      <Breadcrumb items={simpleItems} styles={{ root: { padding: '10px' } }} />,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveStyle({ padding: '10px' });
  });

  it('styles.list uygulanir', () => {
    render(
      <Breadcrumb items={simpleItems} styles={{ list: { gap: '12px' } }} />,
    );
    const list = screen.getByRole('list');
    expect(list).toHaveStyle({ gap: '12px' });
  });

  it('className prop root ile birlesir', () => {
    render(
      <Breadcrumb
        items={simpleItems}
        className="outer-class"
        classNames={{ root: 'inner-root' }}
      />,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('outer-class');
    expect(nav.className).toContain('inner-root');
  });

  it('style prop root ile birlesir', () => {
    render(
      <Breadcrumb
        items={simpleItems}
        style={{ opacity: '0.8' }}
        styles={{ root: { padding: '4px' } }}
      />,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveStyle({ opacity: '0.8' });
    expect(nav).toHaveStyle({ padding: '4px' });
  });
});

// ── id prop ─────────────────────────────────────────────────────────

describe('Breadcrumb id', () => {
  it('id nav elementine eklenir', () => {
    render(<Breadcrumb items={simpleItems} id="bc-1" />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('id', 'bc-1');
  });
});
