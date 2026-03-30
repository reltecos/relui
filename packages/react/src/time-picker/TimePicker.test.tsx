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
import { TimePicker } from './TimePicker';

// ── jsdom mock ──
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe('TimePicker', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<TimePicker />);
    expect(screen.getByTestId('time-picker-root')).toBeInTheDocument();
  });

  it('input render edilir', () => {
    render(<TimePicker />);
    expect(screen.getByTestId('time-picker-input')).toBeInTheDocument();
  });

  it('placeholder gosterilir', () => {
    render(<TimePicker placeholder="Pick a time" />);
    expect(screen.getByText('Pick a time')).toBeInTheDocument();
  });

  it('varsayilan deger gosterilir', () => {
    render(<TimePicker defaultValue="14:30" is24h />);
    expect(screen.getByText('14:30')).toBeInTheDocument();
  });

  it('12h formatinda deger AM/PM ile gosterilir', () => {
    render(<TimePicker defaultValue="14:30" />);
    expect(screen.getByText('02:30 PM')).toBeInTheDocument();
  });

  // ── Dropdown ──

  it('input tiklaninca dropdown acilir', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    expect(screen.getByTestId('time-picker-dropdown')).toBeInTheDocument();
  });

  it('dropdown kapali iken gosterilmez', () => {
    render(<TimePicker />);
    expect(screen.queryByTestId('time-picker-dropdown')).not.toBeInTheDocument();
  });

  // ── Hour Column ──

  it('saat kolonu render edilir', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    expect(screen.getByTestId('time-picker-hourColumn')).toBeInTheDocument();
  });

  // ── Minute Column ──

  it('dakika kolonu render edilir', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    expect(screen.getByTestId('time-picker-minuteColumn')).toBeInTheDocument();
  });

  // ── Cell Selection ──

  it('saat hucresine tiklaninca secilir', () => {
    render(<TimePicker is24h />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    const cells = screen.getByTestId('time-picker-hourColumn').querySelectorAll('[data-testid="time-picker-cell"]');
    fireEvent.click(cells[9]); // hour 9
    expect(cells[9]).toHaveAttribute('data-selected');
  });

  it('dakika hucresine tiklaninca secilir', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    const cells = screen.getByTestId('time-picker-minuteColumn').querySelectorAll('[data-testid="time-picker-cell"]');
    fireEvent.click(cells[30]); // minute 30
    expect(cells[30]).toHaveAttribute('data-selected');
  });

  // ── onChange ──

  it('onChange cagirilir', () => {
    const onChange = vi.fn();
    render(<TimePicker is24h onChange={onChange} />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    const cells = screen.getByTestId('time-picker-hourColumn').querySelectorAll('[data-testid="time-picker-cell"]');
    fireEvent.click(cells[10]); // hour 10
    expect(onChange).toHaveBeenCalled();
  });

  // ── 24h Format ──

  it('24h formatinda 24 saat hucresi render edilir', () => {
    render(<TimePicker is24h />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    const cells = screen.getByTestId('time-picker-hourColumn').querySelectorAll('[data-testid="time-picker-cell"]');
    expect(cells).toHaveLength(24);
  });

  // ── 12h Format ──

  it('12h formatinda 12 saat hucresi ve period render edilir', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    const cells = screen.getByTestId('time-picker-hourColumn').querySelectorAll('[data-testid="time-picker-cell"]');
    expect(cells).toHaveLength(12);
    expect(screen.getByTestId('time-picker-period')).toBeInTheDocument();
  });

  // ── Period ──

  it('period toggle calisir', () => {
    render(<TimePicker defaultValue="10:00" />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    const periodCells = screen.getByTestId('time-picker-period').querySelectorAll('[data-testid="time-picker-cell"]');
    // Initial: AM (10:00 is AM)
    expect(periodCells[0]).toHaveAttribute('data-selected'); // AM selected
    fireEvent.click(periodCells[1]); // Click PM
    expect(periodCells[1]).toHaveAttribute('data-selected'); // PM selected
  });

  // ── showSeconds ──

  it('showSeconds true iken saniye kolonu gosterilir', () => {
    render(<TimePicker showSeconds />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    expect(screen.getByTestId('time-picker-secondColumn')).toBeInTheDocument();
  });

  it('showSeconds false iken saniye kolonu gosterilmez', () => {
    render(<TimePicker />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    expect(screen.queryByTestId('time-picker-secondColumn')).not.toBeInTheDocument();
  });

  // ── Step ──

  it('step dakika degerlerini etkiler', () => {
    render(<TimePicker step={15} />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    const cells = screen.getByTestId('time-picker-minuteColumn').querySelectorAll('[data-testid="time-picker-cell"]');
    expect(cells).toHaveLength(4); // 0, 15, 30, 45
    expect(cells[0]).toHaveTextContent('00');
    expect(cells[1]).toHaveTextContent('15');
    expect(cells[2]).toHaveTextContent('30');
    expect(cells[3]).toHaveTextContent('45');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<TimePicker className="my-picker" />);
    expect(screen.getByTestId('time-picker-root').className).toContain('my-picker');
  });

  it('style root elemana eklenir', () => {
    render(<TimePicker style={{ padding: '16px' }} />);
    expect(screen.getByTestId('time-picker-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<TimePicker classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('time-picker-root').className).toContain('custom-root');
  });

  it('classNames.input input elemana eklenir', () => {
    render(<TimePicker classNames={{ input: 'custom-input' }} />);
    expect(screen.getByTestId('time-picker-input').className).toContain('custom-input');
  });

  it('classNames.dropdown dropdown elemana eklenir', () => {
    render(<TimePicker classNames={{ dropdown: 'custom-dd' }} />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    expect(screen.getByTestId('time-picker-dropdown').className).toContain('custom-dd');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<TimePicker styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('time-picker-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.input input elemana eklenir', () => {
    render(<TimePicker styles={{ input: { fontSize: '18px' } }} />);
    expect(screen.getByTestId('time-picker-input')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.dropdown dropdown elemana eklenir', () => {
    render(<TimePicker styles={{ dropdown: { padding: '16px' } }} />);
    fireEvent.click(screen.getByTestId('time-picker-input'));
    expect(screen.getByTestId('time-picker-dropdown')).toHaveStyle({ padding: '16px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<TimePicker ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('TimePicker (Compound)', () => {
  it('compound: input render edilir', () => {
    render(
      <TimePicker>
        <TimePicker.Input />
      </TimePicker>,
    );
    expect(screen.getByTestId('time-picker-input')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <TimePicker classNames={{ input: 'cmp-input' }}>
        <TimePicker.Input />
      </TimePicker>,
    );
    expect(screen.getByTestId('time-picker-input').className).toContain('cmp-input');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <TimePicker styles={{ input: { fontSize: '20px' } }}>
        <TimePicker.Input />
      </TimePicker>,
    );
    expect(screen.getByTestId('time-picker-input')).toHaveStyle({ fontSize: '20px' });
  });

  it('TimePicker.Input context disinda hata firlatir', () => {
    expect(() => render(<TimePicker.Input />)).toThrow();
  });
});
