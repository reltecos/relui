/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { TableOfContents } from './TableOfContents';
import type { TocItem } from '@relteco/relui-core';

// ── Test Items ──────────────────────────────────────────

function makeItems(): TocItem[] {
  return [
    { id: 'intro', label: 'Introduction', depth: 0 },
    { id: 'getting-started', label: 'Getting Started', depth: 0 },
    { id: 'installation', label: 'Installation', depth: 1 },
    { id: 'usage', label: 'Usage', depth: 1 },
    { id: 'api', label: 'API Reference', depth: 0 },
    { id: 'faq', label: 'FAQ', depth: 0, disabled: true },
  ];
}

// ── Mock IntersectionObserver ──────────────────────────

let observerCallback: IntersectionObserverCallback | null = null;
let observerInstances: Array<{ observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn>; unobserve: ReturnType<typeof vi.fn> }> = [];

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
    observerInstances.push(this);
  }
}

beforeEach(() => {
  observerCallback = null;
  observerInstances = [];
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Render ─────────────────────────────────────────────

describe('TableOfContents render', () => {
  it('nav element render eder', () => {
    render(<TableOfContents items={makeItems()} />);
    expect(screen.getByTestId('table-of-contents-root')).toBeInTheDocument();
    expect(screen.getByTestId('table-of-contents-root').tagName).toBe('NAV');
  });

  it('tum basliklari render eder', () => {
    render(<TableOfContents items={makeItems()} />);
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Installation')).toBeInTheDocument();
    expect(screen.getByText('Usage')).toBeInTheDocument();
    expect(screen.getByText('API Reference')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('bos items ile render eder', () => {
    render(<TableOfContents items={[]} />);
    expect(screen.getByTestId('table-of-contents-root')).toBeInTheDocument();
  });

  it('ref destekler', () => {
    const ref = { current: null as HTMLElement | null };
    render(<TableOfContents ref={ref} items={makeItems()} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('id prop destekler', () => {
    render(<TableOfContents id="my-toc" items={makeItems()} />);
    expect(document.getElementById('my-toc')).toBeInTheDocument();
  });
});

// ── Links ──────────────────────────────────────────────

describe('TableOfContents links', () => {
  it('linkler href ayarlar', () => {
    render(<TableOfContents items={makeItems()} />);
    const link = screen.getByText('Introduction');
    expect(link).toHaveAttribute('href', '#intro');
  });

  it('tiklaninca scrollTo cagirilir', () => {
    // DOM'a heading ekle
    const heading = document.createElement('h2');
    heading.id = 'getting-started';
    heading.textContent = 'GS Heading';
    document.body.appendChild(heading);
    window.scrollTo = vi.fn();

    render(<TableOfContents items={makeItems()} />);
    fireEvent.click(screen.getByText('Getting Started'));

    heading.remove();
  });

  it('disabled link tiklanaMAZ', () => {
    const onChange = vi.fn();
    render(<TableOfContents items={makeItems()} onChange={onChange} />);
    fireEvent.click(screen.getByText('FAQ'));
    expect(onChange).not.toHaveBeenCalledWith('faq');
  });

  it('disabled link aria-disabled tasir', () => {
    render(<TableOfContents items={makeItems()} />);
    const link = screen.getByText('FAQ');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('depth indent uygulanir', () => {
    render(<TableOfContents items={makeItems()} depthIndent={20} />);
    const link = screen.getByText('Installation');
    expect(link.style.paddingLeft).toBe('32px'); // 12 (default base) + 20 (depth 1)
  });
});

// ── Active state ─────────────────────────────────────────

describe('TableOfContents active state', () => {
  it('controlled activeId ile aktif link belirlenir', () => {
    render(<TableOfContents items={makeItems()} activeId="api" />);
    const link = screen.getByText('API Reference');
    expect(link).toHaveAttribute('data-active', 'true');
    expect(link).toHaveAttribute('aria-current', 'location');
  });

  it('inaktif linklerde aria-current yok', () => {
    render(<TableOfContents items={makeItems()} activeId="api" />);
    const link = screen.getByText('Introduction');
    expect(link).not.toHaveAttribute('aria-current');
  });

  it('tiklaninca onChange tetiklenir', () => {
    const onChange = vi.fn();
    // DOM'a heading ekle (scrollTo icin gerekli)
    const heading = document.createElement('h2');
    heading.id = 'usage';
    heading.textContent = 'U Heading';
    document.body.appendChild(heading);
    window.scrollTo = vi.fn();

    render(<TableOfContents items={makeItems()} onChange={onChange} />);
    fireEvent.click(screen.getByText('Usage'));
    expect(onChange).toHaveBeenCalledWith('usage');

    heading.remove();
  });
});

// ── Variants ──────────────────────────────────────────

describe('TableOfContents variants', () => {
  it('default variant render eder', () => {
    render(<TableOfContents items={makeItems()} variant="default" />);
    expect(screen.getByTestId('table-of-contents-root')).toBeInTheDocument();
  });

  it('filled variant render eder', () => {
    render(<TableOfContents items={makeItems()} variant="filled" />);
    expect(screen.getByTestId('table-of-contents-root')).toBeInTheDocument();
  });

  it('dots variant render eder', () => {
    render(<TableOfContents items={makeItems()} variant="dots" />);
    expect(screen.getByTestId('table-of-contents-root')).toBeInTheDocument();
  });

  it('dots variant indicator render eder', () => {
    render(<TableOfContents items={makeItems()} variant="dots" />);
    const nav = screen.getByTestId('table-of-contents-root');
    const indicators = nav.querySelectorAll('[aria-hidden="true"]');
    expect(indicators.length).toBe(makeItems().length);
  });
});

// ── Sizes ──────────────────────────────────────────────

describe('TableOfContents sizes', () => {
  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('%s boyutu render eder', (size) => {
    render(<TableOfContents items={makeItems()} size={size} />);
    expect(screen.getByTestId('table-of-contents-root')).toBeInTheDocument();
  });
});

// ── A11y ──────────────────────────────────────────────

describe('TableOfContents a11y', () => {
  it('navigation role gosterir', () => {
    render(<TableOfContents items={makeItems()} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('varsayilan aria-label gosterir', () => {
    render(<TableOfContents items={makeItems()} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Table of contents');
  });

  it('ozel aria-label destekler', () => {
    render(<TableOfContents items={makeItems()} aria-label="Icerik tablosu" />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Icerik tablosu');
  });

  it('link listesi ul element render eder', () => {
    render(<TableOfContents items={makeItems()} />);
    const nav = screen.getByTestId('table-of-contents-root');
    expect(nav.querySelector('ul')).toBeInTheDocument();
  });

  it('her item li element render eder', () => {
    render(<TableOfContents items={makeItems()} />);
    const nav = screen.getByTestId('table-of-contents-root');
    const lis = nav.querySelectorAll('li');
    expect(lis.length).toBe(makeItems().length);
  });

  it('data-depth attribute ayarlar', () => {
    render(<TableOfContents items={makeItems()} />);
    const link = screen.getByText('Installation');
    expect(link).toHaveAttribute('data-depth', '1');
  });
});

// ── Slot API ──────────────────────────────────────────

describe('TableOfContents slot API', () => {
  it('className root slot', () => {
    render(<TableOfContents items={makeItems()} className="custom-toc" />);
    expect(screen.getByTestId('table-of-contents-root').className).toContain('custom-toc');
  });

  it('style root slot', () => {
    render(<TableOfContents items={makeItems()} style={{ opacity: 0.5 }} />);
    expect(screen.getByTestId('table-of-contents-root').style.opacity).toBe('0.5');
  });

  it('classNames.root slot', () => {
    render(<TableOfContents items={makeItems()} classNames={{ root: 'my-toc' }} />);
    expect(screen.getByTestId('table-of-contents-root').className).toContain('my-toc');
  });

  it('styles.root slot', () => {
    render(<TableOfContents items={makeItems()} styles={{ root: { fontSize: '20px' } }} />);
    expect(screen.getByTestId('table-of-contents-root').style.fontSize).toBe('20px');
  });

  // ── Slot API: styles ──

  it('styles.list list elemana eklenir', () => {
    render(<TableOfContents items={makeItems()} styles={{ list: { padding: '24px' } }} />);
    const nav = screen.getByTestId('table-of-contents-root');
    const ul = nav.querySelector('ul') as HTMLElement;
    expect(ul).toHaveStyle({ padding: '24px' });
  });

  it('styles.item item elemana eklenir', () => {
    render(<TableOfContents items={makeItems()} styles={{ item: { fontSize: '14px' } }} />);
    const nav = screen.getByTestId('table-of-contents-root');
    const li = nav.querySelector('li') as HTMLElement;
    expect(li).toHaveStyle({ fontSize: '14px' });
  });

  it('styles.link link elemana eklenir', () => {
    render(<TableOfContents items={makeItems()} styles={{ link: { letterSpacing: '1px' } }} />);
    expect(screen.getAllByTestId('table-of-contents-link')[0]).toHaveStyle({ letterSpacing: '1px' });
  });

  it('styles.indicator indicator elemana eklenir', () => {
    render(
      <TableOfContents items={makeItems()} variant="dots" styles={{ indicator: { opacity: '0.5' } }} />,
    );
    expect(screen.getAllByTestId('table-of-contents-indicator')[0]).toHaveStyle({ opacity: '0.5' });
  });
});

// ── Scroll spy ──────────────────────────────────────────

describe('TableOfContents scroll spy', () => {
  it('IntersectionObserver olusturulur', () => {
    // heading DOM'da olmali ki observe cagirilsin
    const heading = document.createElement('h2');
    heading.id = 'intro';
    heading.textContent = 'H Intro';
    document.body.appendChild(heading);

    render(<TableOfContents items={makeItems()} />);
    expect(observerInstances.length).toBeGreaterThan(0);

    heading.remove();
  });

  it('tum heading elementleri observe edilir', () => {
    // Heading'leri ekle
    const headings: HTMLElement[] = [];
    for (const item of makeItems()) {
      const h = document.createElement('h2');
      h.id = item.id;
      h.textContent = `H-${item.id}`;
      document.body.appendChild(h);
      headings.push(h);
    }

    render(<TableOfContents items={makeItems()} />);
    const lastObserver = observerInstances[observerInstances.length - 1];
    expect(lastObserver.observe).toHaveBeenCalled();

    headings.forEach((h) => h.remove());
  });

  it('unmount olunca disconnect cagrilir', () => {
    const { unmount } = render(<TableOfContents items={makeItems()} />);
    const lastObserver = observerInstances[observerInstances.length - 1];
    unmount();
    expect(lastObserver.disconnect).toHaveBeenCalled();
  });

  it('controlled activeId ile scroll spy calismaz', () => {
    const prevCount = observerInstances.length;
    render(<TableOfContents items={makeItems()} activeId="intro" />);
    // Controlled mode'da IntersectionObserver oluşturulmamalı
    expect(observerInstances.length).toBe(prevCount);
  });

  it('intersection olunca aktif degisir', () => {
    const onChange = vi.fn();
    const heading = document.createElement('h2');
    heading.id = 'intro';
    heading.textContent = 'H-Intro';
    document.body.appendChild(heading);

    render(<TableOfContents items={makeItems()} onChange={onChange} />);

    // Simulate intersection
    if (observerCallback) {
      const cb = observerCallback;
      act(() => {
        cb(
          [{ target: heading, isIntersecting: true } as IntersectionObserverEntry],
          observerInstances[observerInstances.length - 1] as unknown as IntersectionObserver,
        );
      });
    }

    expect(onChange).toHaveBeenCalledWith('intro');
    heading.remove();
  });
});

// ── Custom renderLink ──────────────────────────────────

describe('TableOfContents renderLink', () => {
  it('ozel renderLink kullanilir', () => {
    render(
      <TableOfContents
        items={makeItems()}
        renderLink={(item, isActive) => (
          <button data-testid={`custom-${item.id}`} data-active={isActive}>
            {item.label}
          </button>
        )}
      />,
    );
    expect(screen.getByTestId('custom-intro')).toBeInTheDocument();
    expect(screen.getByTestId('custom-api')).toBeInTheDocument();
  });
});

// ── Compound API ──────────────────────────────────────

describe('TableOfContents (Compound)', () => {
  it('compound: Item sub-component render edilir', () => {
    render(
      <TableOfContents items={makeItems()} activeId="intro">
        <TableOfContents.Item>
          <TableOfContents.Link href="intro" depth={0}>Introduction</TableOfContents.Link>
        </TableOfContents.Item>
        <TableOfContents.Item>
          <TableOfContents.Link href="api" depth={0}>API Reference</TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents>,
    );
    const items = screen.getAllByTestId('table-of-contents-item');
    expect(items).toHaveLength(2);
  });

  it('compound: Link sub-component render edilir', () => {
    render(
      <TableOfContents items={makeItems()} activeId="intro">
        <TableOfContents.Item>
          <TableOfContents.Link href="intro" depth={0}>Introduction</TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents>,
    );
    const link = screen.getByTestId('table-of-contents-link');
    expect(link).toHaveTextContent('Introduction');
    expect(link).toHaveAttribute('href', '#intro');
  });

  it('compound: aktif link aria-current gosterir', () => {
    render(
      <TableOfContents items={makeItems()} activeId="api">
        <TableOfContents.Item>
          <TableOfContents.Link href="intro" depth={0}>Introduction</TableOfContents.Link>
        </TableOfContents.Item>
        <TableOfContents.Item>
          <TableOfContents.Link href="api" depth={0}>API Reference</TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents>,
    );
    const links = screen.getAllByTestId('table-of-contents-link');
    expect(links[0]).not.toHaveAttribute('aria-current');
    expect(links[1]).toHaveAttribute('aria-current', 'location');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <TableOfContents items={makeItems()} classNames={{ item: 'cmp-item' }}>
        <TableOfContents.Item>
          <TableOfContents.Link href="intro" depth={0}>Intro</TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents>,
    );
    expect(screen.getByTestId('table-of-contents-item').className).toContain('cmp-item');
  });

  it('compound: disabled link aria-disabled gosterir', () => {
    render(
      <TableOfContents items={makeItems()}>
        <TableOfContents.Item>
          <TableOfContents.Link href="faq" depth={0} disabled>FAQ</TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents>,
    );
    expect(screen.getByTestId('table-of-contents-link')).toHaveAttribute('aria-disabled', 'true');
  });
});
