/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Clock } from './Clock';

describe('Clock', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Clock />);
    expect(screen.getByTestId('clock-root')).toBeInTheDocument();
    expect(screen.getByTestId('clock-root')).toHaveAttribute('role', 'timer');
  });

  it('varsayilan mode digital', () => {
    render(<Clock />);
    expect(screen.getByTestId('clock-root')).toHaveAttribute('data-mode', 'digital');
  });

  it('varsayilan size md', () => {
    render(<Clock />);
    expect(screen.getByTestId('clock-root')).toHaveAttribute('data-size', 'md');
  });

  it('size sm set edilir', () => {
    render(<Clock size="sm" />);
    expect(screen.getByTestId('clock-root')).toHaveAttribute('data-size', 'sm');
  });

  it('size lg set edilir', () => {
    render(<Clock size="lg" />);
    expect(screen.getByTestId('clock-root')).toHaveAttribute('data-size', 'lg');
  });

  // ── Digital Mode ──

  it('digital modda clock-digital render edilir', () => {
    render(<Clock mode="digital" />);
    expect(screen.getByTestId('clock-digital')).toBeInTheDocument();
  });

  it('digital modda zaman gosterilir', () => {
    render(<Clock mode="digital" />);
    const text = screen.getByTestId('clock-digital').textContent;
    expect(text).toBeTruthy();
    expect(text).toMatch(/\d{2}:\d{2}/);
  });

  it('12h formatta period gosterilir', () => {
    render(<Clock mode="digital" is24h={false} />);
    expect(screen.getByTestId('clock-period')).toBeInTheDocument();
    const period = screen.getByTestId('clock-period').textContent;
    expect(period === 'AM' || period === 'PM').toBe(true);
  });

  it('24h formatta period gosterilmez', () => {
    render(<Clock mode="digital" is24h />);
    expect(screen.queryByTestId('clock-period')).not.toBeInTheDocument();
  });

  it('showSeconds false ise saniye gosterilmez', () => {
    render(<Clock mode="digital" showSeconds={false} />);
    const text = screen.getByTestId('clock-digital').textContent;
    // HH:MM format (no seconds)
    expect(text?.split(':').length).toBe(2);
  });

  it('showSeconds true ise saniye gosterilir', () => {
    render(<Clock mode="digital" showSeconds />);
    const text = screen.getByTestId('clock-digital').textContent;
    // HH:MM:SS format
    expect(text?.split(':').length).toBe(3);
  });

  // ── Analog Mode ──

  it('analog modda clock-face render edilir', () => {
    render(<Clock mode="analog" />);
    expect(screen.getByTestId('clock-face')).toBeInTheDocument();
    expect(screen.getByTestId('clock-root')).toHaveAttribute('data-mode', 'analog');
  });

  it('analog modda hour hand render edilir', () => {
    render(<Clock mode="analog" />);
    expect(screen.getByTestId('clock-hourHand')).toBeInTheDocument();
  });

  it('analog modda minute hand render edilir', () => {
    render(<Clock mode="analog" />);
    expect(screen.getByTestId('clock-minuteHand')).toBeInTheDocument();
  });

  it('analog modda showSeconds true ise second hand render edilir', () => {
    render(<Clock mode="analog" showSeconds />);
    expect(screen.getByTestId('clock-secondHand')).toBeInTheDocument();
  });

  it('analog modda showSeconds false ise second hand render edilmez', () => {
    render(<Clock mode="analog" showSeconds={false} />);
    expect(screen.queryByTestId('clock-secondHand')).not.toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Clock className="my-clock" />);
    expect(screen.getByTestId('clock-root').className).toContain('my-clock');
  });

  it('style root elemana eklenir', () => {
    render(<Clock style={{ padding: '16px' }} />);
    expect(screen.getByTestId('clock-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Clock classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('clock-root').className).toContain('custom-root');
  });

  it('classNames.digital digital elemana eklenir', () => {
    render(<Clock mode="digital" classNames={{ digital: 'custom-digi' }} />);
    expect(screen.getByTestId('clock-digital').className).toContain('custom-digi');
  });

  it('classNames.face face elemana eklenir', () => {
    render(<Clock mode="analog" classNames={{ face: 'custom-face' }} />);
    expect(screen.getByTestId('clock-face').className).toContain('custom-face');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Clock styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('clock-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.digital digital elemana eklenir', () => {
    render(<Clock mode="digital" styles={{ digital: { letterSpacing: '0.1em' } }} />);
    expect(screen.getByTestId('clock-digital')).toHaveStyle({ letterSpacing: '0.1em' });
  });

  it('styles.period period elemana eklenir', () => {
    render(<Clock mode="digital" is24h={false} styles={{ period: { fontSize: '10px' } }} />);
    expect(screen.getByTestId('clock-period')).toHaveStyle({ fontSize: '10px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Clock ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Clock (Compound)', () => {
  it('compound: digital render edilir', () => {
    render(
      <Clock>
        <Clock.Digital />
      </Clock>,
    );
    expect(screen.getByTestId('clock-digital')).toBeInTheDocument();
  });

  it('compound: face render edilir', () => {
    render(
      <Clock mode="analog">
        <Clock.Face />
      </Clock>,
    );
    expect(screen.getByTestId('clock-face')).toBeInTheDocument();
  });

  it('compound: period render edilir (12h)', () => {
    render(
      <Clock is24h={false}>
        <Clock.Digital />
        <Clock.Period />
      </Clock>,
    );
    expect(screen.getByTestId('clock-period')).toBeInTheDocument();
  });

  it('compound: period gizlenir (24h)', () => {
    render(
      <Clock is24h>
        <Clock.Digital />
        <Clock.Period />
      </Clock>,
    );
    expect(screen.queryByTestId('clock-period')).not.toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Clock classNames={{ digital: 'cmp-digi' }}>
        <Clock.Digital />
      </Clock>,
    );
    expect(screen.getByTestId('clock-digital').className).toContain('cmp-digi');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Clock styles={{ digital: { fontSize: '40px' } }}>
        <Clock.Digital />
      </Clock>,
    );
    expect(screen.getByTestId('clock-digital')).toHaveStyle({ fontSize: '40px' });
  });

  it('Clock.Digital context disinda hata firlatir', () => {
    expect(() => render(<Clock.Digital />)).toThrow();
  });
});
