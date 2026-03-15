/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Link } from './Link';
import { NavLink } from './NavLink';

// ── Link render ─────────────────────────────────────────────

describe('Link render', () => {
  it('anchor element render eder', () => {
    render(<Link href="/test">Test</Link>);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  it('href prop ayarlar', () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/about');
  });

  it('children render eder', () => {
    render(<Link href="#">Hello World</Link>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('ref destekler', () => {
    const ref = { current: null as HTMLAnchorElement | null };
    render(<Link href="#" ref={ref}>Link</Link>);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('id prop destekler', () => {
    render(<Link href="#" id="my-link">Link</Link>);
    expect(document.getElementById('my-link')).toBeInTheDocument();
  });
});

// ── Link variants ───────────────────────────────────────────

describe('Link variants', () => {
  it('varsayilan default variant', () => {
    render(<Link href="#">Link</Link>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('subtle variant render eder', () => {
    render(<Link href="#" variant="subtle">Link</Link>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('inherit variant render eder', () => {
    render(<Link href="#" variant="inherit">Link</Link>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});

// ── Link underline ──────────────────────────────────────────

describe('Link underline', () => {
  it('varsayilan hover underline', () => {
    render(<Link href="#">Link</Link>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('always underline render eder', () => {
    render(<Link href="#" underline="always">Link</Link>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('never underline render eder', () => {
    render(<Link href="#" underline="never">Link</Link>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});

// ── Link sizes ──────────────────────────────────────────────

describe('Link sizes', () => {
  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('%s boyutu render eder', (size) => {
    render(<Link href="#" size={size}>Link</Link>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});

// ── Link disabled ───────────────────────────────────────────

describe('Link disabled', () => {
  it('disabled durumda aria-disabled gosterir', () => {
    render(<Link href="#" disabled>Link</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('aria-disabled', 'true');
  });

  it('disabled durumda data-disabled gosterir', () => {
    render(<Link href="#" disabled>Link</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('data-disabled', '');
  });

  it('disabled durumda tabIndex -1', () => {
    render(<Link href="#" disabled>Link</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('tabindex', '-1');
  });

  it('normal durumda aria-disabled yok', () => {
    render(<Link href="#">Link</Link>);
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-disabled');
  });
});

// ── Link external ───────────────────────────────────────────

describe('Link external', () => {
  it('external link target _blank ayarlar', () => {
    render(<Link href="https://example.com" external>Example</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('external link rel noopener noreferrer ayarlar', () => {
    render(<Link href="https://example.com" external>Example</Link>);
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('external ikon gosterir', () => {
    const { container } = render(<Link href="https://example.com" external>Example</Link>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('showExternalIcon=false ikon gizler', () => {
    const { container } = render(
      <Link href="https://example.com" external showExternalIcon={false}>Example</Link>,
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('internal link target ayarlamaz', () => {
    render(<Link href="/about">About</Link>);
    expect(screen.getByRole('link')).not.toHaveAttribute('target');
  });
});

// ── Link slot API ───────────────────────────────────────────

describe('Link slot API', () => {
  it('className root slot', () => {
    render(<Link href="#" className="custom-link">Link</Link>);
    expect(screen.getByRole('link').className).toContain('custom-link');
  });

  it('style root slot', () => {
    render(<Link href="#" style={{ opacity: 0.5 }}>Link</Link>);
    expect(screen.getByRole('link').style.opacity).toBe('0.5');
  });

  it('classNames.root slot', () => {
    render(<Link href="#" classNames={{ root: 'my-root' }}>Link</Link>);
    expect(screen.getByRole('link').className).toContain('my-root');
  });

  it('styles.root slot', () => {
    render(<Link href="#" styles={{ root: { fontSize: '20px' } }}>Link</Link>);
    expect(screen.getByRole('link').style.fontSize).toBe('20px');
  });
});

// ── NavLink render ──────────────────────────────────────────

describe('NavLink render', () => {
  it('anchor element render eder', () => {
    render(<NavLink href="/home">Home</NavLink>);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
  });

  it('children render eder', () => {
    render(<NavLink href="#">Dashboard</NavLink>);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('ref destekler', () => {
    const ref = { current: null as HTMLAnchorElement | null };
    render(<NavLink href="#" ref={ref}>Link</NavLink>);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});

// ── NavLink active ──────────────────────────────────────────

describe('NavLink active', () => {
  it('aktif durumda aria-current="page" gosterir', () => {
    render(<NavLink href="/home" active>Home</NavLink>);
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  it('aktif durumda data-active gosterir', () => {
    render(<NavLink href="/home" active>Home</NavLink>);
    expect(screen.getByRole('link')).toHaveAttribute('data-active', '');
  });

  it('inaktif durumda aria-current yok', () => {
    render(<NavLink href="/about">About</NavLink>);
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
  });

  it('inaktif durumda data-active yok', () => {
    render(<NavLink href="/about">About</NavLink>);
    expect(screen.getByRole('link')).not.toHaveAttribute('data-active');
  });
});

// ── NavLink disabled ────────────────────────────────────────

describe('NavLink disabled', () => {
  it('disabled durumda aria-disabled gosterir', () => {
    render(<NavLink href="#" disabled>Link</NavLink>);
    expect(screen.getByRole('link')).toHaveAttribute('aria-disabled', 'true');
  });

  it('disabled durumda data-disabled gosterir', () => {
    render(<NavLink href="#" disabled>Link</NavLink>);
    expect(screen.getByRole('link')).toHaveAttribute('data-disabled', '');
  });
});

// ── NavLink external ────────────────────────────────────────

describe('NavLink external', () => {
  it('external link target _blank ayarlar', () => {
    render(<NavLink href="https://example.com" external>Example</NavLink>);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('external ikon gosterir', () => {
    const { container } = render(<NavLink href="https://example.com" external>Ex</NavLink>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

// ── NavLink slot API ────────────────────────────────────────

describe('NavLink slot API', () => {
  it('className root slot', () => {
    render(<NavLink href="#" className="custom-nav">Nav</NavLink>);
    expect(screen.getByRole('link').className).toContain('custom-nav');
  });

  it('style root slot', () => {
    render(<NavLink href="#" style={{ opacity: 0.7 }}>Nav</NavLink>);
    expect(screen.getByRole('link').style.opacity).toBe('0.7');
  });

  it('classNames.root slot', () => {
    render(<NavLink href="#" classNames={{ root: 'nav-root' }}>Nav</NavLink>);
    expect(screen.getByRole('link').className).toContain('nav-root');
  });

  it('styles.root slot', () => {
    render(<NavLink href="#" styles={{ root: { letterSpacing: '2px' } }}>Nav</NavLink>);
    expect(screen.getByRole('link').style.letterSpacing).toBe('2px');
  });
});

// ── NavLink variants ────────────────────────────────────────

describe('NavLink variants', () => {
  it('subtle variant render eder', () => {
    render(<NavLink href="#" variant="subtle">Nav</NavLink>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('%s boyutu render eder', (size) => {
    render(<NavLink href="#" size={size}>Nav</NavLink>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});

// ── Compound API ────────────────────────────────────────────

describe('Link (Compound)', () => {
  it('compound: Link.Icon start pozisyonunda render edilir', () => {
    render(
      <Link href="#">
        <Link.Icon><span data-testid="star">*</span></Link.Icon>
        Link Text
      </Link>,
    );
    expect(screen.getByTestId('link-icon')).toBeInTheDocument();
    expect(screen.getByTestId('star')).toBeInTheDocument();
  });

  it('compound: Link.Icon end pozisyonunda render edilir', () => {
    render(
      <Link href="#">
        Link Text
        <Link.Icon position="end"><span data-testid="arrow">→</span></Link.Icon>
      </Link>,
    );
    const icon = screen.getByTestId('link-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveStyle({ marginLeft: '0.25em' });
  });

  it('compound: Link.Icon varsayilan start marginRight', () => {
    render(
      <Link href="#">
        <Link.Icon><span>*</span></Link.Icon>
        Text
      </Link>,
    );
    const icon = screen.getByTestId('link-icon');
    expect(icon).toHaveStyle({ marginRight: '0.25em' });
  });

  it('compound: Link.Icon aria-hidden', () => {
    render(
      <Link href="#">
        <Link.Icon><span>*</span></Link.Icon>
        Text
      </Link>,
    );
    expect(screen.getByTestId('link-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('compound: context disinda hata firlatir', () => {
    expect(() => {
      render(<Link.Icon><span>*</span></Link.Icon>);
    }).toThrow('Link compound sub-components must be used within <Link>.');
  });
});
