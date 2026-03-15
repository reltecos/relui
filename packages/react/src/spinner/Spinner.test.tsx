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
import { Spinner } from './Spinner';

// ── Render ─────────────────────────────────────────────

describe('Spinner render', () => {
  it('spinner render eder', () => {
    render(<Spinner />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('svg render eder', () => {
    render(<Spinner />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner.querySelector('svg')).toBeInTheDocument();
  });

  it('ref destekler', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('id prop destekler', () => {
    render(<Spinner id="my-spinner" />);
    expect(document.getElementById('my-spinner')).toBeInTheDocument();
  });
});

// ── Label ──────────────────────────────────────────────

describe('Spinner label', () => {
  it('label render eder', () => {
    render(<Spinner label="Yukleniyor..." />);
    expect(screen.getByText('Yukleniyor...')).toBeInTheDocument();
  });

  it('label olmadan render eder', () => {
    render(<Spinner />);
    expect(screen.queryByText('Yukleniyor...')).not.toBeInTheDocument();
  });

  it('ReactNode label destekler', () => {
    render(<Spinner label={<span data-testid="custom-label">Loading</span>} />);
    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
  });
});

// ── Sizes ──────────────────────────────────────────────

describe('Spinner sizes', () => {
  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('%s boyutu render eder', (size) => {
    render(<Spinner size={size} />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});

// ── Color ──────────────────────────────────────────────

describe('Spinner color', () => {
  it('ozel renk uygulanir', () => {
    render(<Spinner color="#ff0000" />);
    const spinner = screen.getByTestId('spinner');
    const circle = spinner.querySelector('circle');
    expect(circle).toHaveAttribute('stroke', '#ff0000');
  });
});

// ── Thickness ──────────────────────────────────────────

describe('Spinner thickness', () => {
  it('ozel kalinlik uygulanir', () => {
    render(<Spinner thickness={5} />);
    const spinner = screen.getByTestId('spinner');
    const circle = spinner.querySelector('circle');
    expect(circle).toHaveAttribute('stroke-width', '5');
  });
});

// ── A11y ──────────────────────────────────────────────

describe('Spinner a11y', () => {
  it('role=status ayarlar', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('varsayilan aria-label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('label string ise aria-label olarak kullanilir', () => {
    render(<Spinner label="Yukleniyor" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Yukleniyor');
  });

  it('svg aria-hidden tasir', () => {
    render(<Spinner />);
    const svg = screen.getByTestId('spinner').querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});

// ── Slot API ──────────────────────────────────────────

describe('Spinner slot API', () => {
  it('className root slot', () => {
    render(<Spinner className="custom-spinner" />);
    expect(screen.getByTestId('spinner').className).toContain('custom-spinner');
  });

  it('style root slot', () => {
    render(<Spinner style={{ opacity: 0.5 }} />);
    expect(screen.getByTestId('spinner').style.opacity).toBe('0.5');
  });

  it('classNames.root slot', () => {
    render(<Spinner classNames={{ root: 'my-spinner' }} />);
    expect(screen.getByTestId('spinner').className).toContain('my-spinner');
  });

  it('styles.root slot', () => {
    render(<Spinner styles={{ root: { fontSize: '20px' } }} />);
    expect(screen.getByTestId('spinner').style.fontSize).toBe('20px');
  });
});

// ── Compound API ──

describe('Spinner (Compound)', () => {
  it('compound: Spinner.Label render edilir', () => {
    render(
      <Spinner>
        <Spinner.Label>Yukleniyor...</Spinner.Label>
      </Spinner>,
    );
    expect(screen.getByTestId('spinner-label')).toHaveTextContent('Yukleniyor...');
  });

  it('compound: svg hala render edilir', () => {
    render(
      <Spinner>
        <Spinner.Label>Bekleyin</Spinner.Label>
      </Spinner>,
    );
    const spinner = screen.getByTestId('spinner');
    expect(spinner.querySelector('svg')).toBeInTheDocument();
  });

  it('compound: classNames context ile Spinner.Label a aktarilir', () => {
    render(
      <Spinner classNames={{ label: 'cmp-label-cls' }}>
        <Spinner.Label>Yukleniyor</Spinner.Label>
      </Spinner>,
    );
    expect(screen.getByTestId('spinner-label').className).toContain('cmp-label-cls');
  });

  it('compound: styles context ile Spinner.Label a aktarilir', () => {
    render(
      <Spinner styles={{ label: { fontSize: '16px' } }}>
        <Spinner.Label>Yukleniyor</Spinner.Label>
      </Spinner>,
    );
    expect(screen.getByTestId('spinner-label')).toHaveStyle({ fontSize: '16px' });
  });

  it('compound: role=status ayarlanir', () => {
    render(
      <Spinner>
        <Spinner.Label>Test</Spinner.Label>
      </Spinner>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('compound: Spinner.Label context disinda hata firlat', () => {
    expect(() => {
      render(<Spinner.Label>test</Spinner.Label>);
    }).toThrow('Spinner compound sub-components must be used within <Spinner>.');
  });
});
