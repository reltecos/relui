/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BackToTop } from './BackToTop';

// ── Scroll target helper ────────────────────────────────────

function createScrollTarget(scrollTop = 0) {
  const div = document.createElement('div');
  let currentScrollTop = scrollTop;

  Object.defineProperty(div, 'scrollTop', {
    get: () => currentScrollTop,
    set: (v: number) => { currentScrollTop = v; },
    configurable: true,
  });

  div.scrollTo = vi.fn();

  function setScrollTop(value: number) {
    currentScrollTop = value;
    act(() => {
      div.dispatchEvent(new Event('scroll'));
    });
  }

  return { div, setScrollTop };
}

// ── window.scrollTo mock ────────────────────────────────────

beforeEach(() => {
  window.scrollTo = vi.fn();
});

// ── Render ─────────────────────────────────────────────────

describe('BackToTop render', () => {
  it('scroll 0 iken gorunmez', () => {
    const { div } = createScrollTarget(0);
    render(<BackToTop scrollTarget={div} />);
    expect(screen.queryByTestId('back-to-top')).not.toBeInTheDocument();
  });

  it('esik asildiktan sonra gorunur', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });

  it('esik altina dusunce gizlenir', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
    setScrollTop(100);
    expect(screen.queryByTestId('back-to-top')).not.toBeInTheDocument();
  });

  it('ozel esik degeri destekler', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop scrollTarget={div} visibilityThreshold={100} />);
    setScrollTop(50);
    expect(screen.queryByTestId('back-to-top')).not.toBeInTheDocument();
    setScrollTop(150);
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });

  it('ref destekler', () => {
    const ref = { current: null as HTMLButtonElement | null };
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop ref={ref} scrollTarget={div} />);
    setScrollTop(400);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('id prop destekler', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop id="my-btt" scrollTarget={div} />);
    setScrollTop(400);
    expect(document.getElementById('my-btt')).toBeInTheDocument();
  });
});

// ── Click ───────────────────────────────────────────────────

describe('BackToTop click', () => {
  it('tiklaninca scrollTo cagirir', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop scrollTarget={div} />);
    setScrollTop(400);
    fireEvent.click(screen.getByTestId('back-to-top'));
    expect(div.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('ozel scrollBehavior destekler', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop scrollTarget={div} scrollBehavior="instant" />);
    setScrollTop(400);
    fireEvent.click(screen.getByTestId('back-to-top'));
    expect(div.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
  });
});

// ── Variants ────────────────────────────────────────────────

describe('BackToTop variants', () => {
  it('filled variant render eder', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop variant="filled" scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });

  it('outline variant render eder', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop variant="outline" scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });

  it('subtle variant render eder', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop variant="subtle" scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });
});

// ── Sizes ───────────────────────────────────────────────────

describe('BackToTop sizes', () => {
  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('%s boyutu render eder', (size) => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop size={size} scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });
});

// ── Shapes ──────────────────────────────────────────────────

describe('BackToTop shapes', () => {
  it('circle shape render eder', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop shape="circle" scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });

  it('rounded shape render eder', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop shape="rounded" scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });
});

// ── Custom icon ─────────────────────────────────────────────

describe('BackToTop icon', () => {
  it('varsayilan ok ikonu render eder', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop scrollTarget={div} />);
    setScrollTop(400);
    const btn = screen.getByTestId('back-to-top');
    expect(btn.querySelector('svg')).toBeInTheDocument();
  });

  it('ozel ikon render eder', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop icon={<span data-testid="custom-icon">UP</span>} scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});

// ── A11y ────────────────────────────────────────────────────

describe('BackToTop a11y', () => {
  it('button role gosterir', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('varsayilan aria-label gosterir', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Back to top');
  });

  it('ozel aria-label destekler', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop aria-label="Yukari don" scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Yukari don');
  });

  it('type=button ayarlar', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});

// ── Slot API ────────────────────────────────────────────────

describe('BackToTop slot API', () => {
  it('className root slot', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop className="custom-btt" scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top').className).toContain('custom-btt');
  });

  it('style root slot', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop style={{ opacity: 0.5 }} scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top').style.opacity).toBe('0.5');
  });

  it('classNames.root slot', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop classNames={{ root: 'my-btt' }} scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top').className).toContain('my-btt');
  });

  it('styles.root slot', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(<BackToTop styles={{ root: { fontSize: '20px' } }} scrollTarget={div} />);
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top').style.fontSize).toBe('20px');
  });
});

// ── Compound API ────────────────────────────────────────────

describe('BackToTop (Compound)', () => {
  it('compound: BackToTop.Icon render edilir', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(
      <BackToTop scrollTarget={div}>
        <BackToTop.Icon><span data-testid="custom-arrow">UP</span></BackToTop.Icon>
      </BackToTop>,
    );
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top-icon')).toBeInTheDocument();
    expect(screen.getByTestId('custom-arrow')).toBeInTheDocument();
  });

  it('compound: children ile varsayilan ikon gosterilmez', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(
      <BackToTop scrollTarget={div}>
        <BackToTop.Icon><span>UP</span></BackToTop.Icon>
      </BackToTop>,
    );
    setScrollTop(400);
    const btn = screen.getByTestId('back-to-top');
    expect(btn.querySelector('svg')).not.toBeInTheDocument();
  });

  it('compound: tiklaninca scrollTo cagirir', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(
      <BackToTop scrollTarget={div}>
        <BackToTop.Icon><span>UP</span></BackToTop.Icon>
      </BackToTop>,
    );
    setScrollTop(400);
    fireEvent.click(screen.getByTestId('back-to-top'));
    expect(div.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('compound: classNames context ile aktarilir', () => {
    const { div, setScrollTop } = createScrollTarget(0);
    render(
      <BackToTop scrollTarget={div} classNames={{ icon: 'custom-icon-cls' }}>
        <BackToTop.Icon><span>UP</span></BackToTop.Icon>
      </BackToTop>,
    );
    setScrollTop(400);
    expect(screen.getByTestId('back-to-top-icon').className).toContain('custom-icon-cls');
  });

  it('compound: context disinda hata firlatir', () => {
    expect(() => {
      render(<BackToTop.Icon><span>UP</span></BackToTop.Icon>);
    }).toThrow('BackToTop compound sub-components must be used within <BackToTop>.');
  });
});
