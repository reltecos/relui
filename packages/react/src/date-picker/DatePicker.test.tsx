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
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<DatePicker />);
    expect(screen.getByTestId('date-picker-root')).toBeInTheDocument();
  });

  // ── Input ──

  it('input render edilir', () => {
    render(<DatePicker />);
    expect(screen.getByTestId('date-picker-input')).toBeInTheDocument();
  });

  it('placeholder gosterilir', () => {
    render(<DatePicker placeholder="Bir tarih secin" />);
    expect(screen.getByText('Bir tarih secin')).toBeInTheDocument();
  });

  it('defaultValue ile deger gosterilir', () => {
    render(<DatePicker defaultValue="2025-06-15" />);
    expect(screen.getByText('15/06/2025')).toBeInTheDocument();
  });

  // ── Open/Close ──

  it('input tiklaninca takvim acilir', () => {
    render(<DatePicker />);
    fireEvent.click(screen.getByTestId('date-picker-input'));
    expect(screen.getByTestId('date-picker-calendar')).toBeInTheDocument();
  });

  it('kapaliyken takvim gosterilmez', () => {
    render(<DatePicker />);
    expect(screen.queryByTestId('date-picker-calendar')).not.toBeInTheDocument();
  });

  it('aria-expanded input ile set edilir', () => {
    render(<DatePicker />);
    expect(screen.getByTestId('date-picker-input')).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(screen.getByTestId('date-picker-input'));
    expect(screen.getByTestId('date-picker-input')).toHaveAttribute('aria-expanded', 'true');
  });

  // ── Navigation ──

  it('ay navigasyon header render edilir', () => {
    render(<DatePicker />);
    fireEvent.click(screen.getByTestId('date-picker-input'));
    expect(screen.getByTestId('date-picker-header')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker-monthLabel')).toBeInTheDocument();
  });

  it('navButton tiklaninca ay degisir', () => {
    render(<DatePicker defaultValue="2025-06-15" />);
    fireEvent.click(screen.getByTestId('date-picker-input'));
    const label = screen.getByTestId('date-picker-monthLabel');
    expect(label).toHaveTextContent('Haziran 2025');
    const navButtons = screen.getAllByTestId('date-picker-navButton');
    fireEvent.click(navButtons[0]);
    expect(label).toHaveTextContent('Mayis 2025');
  });

  // ── Grid ──

  it('grid render edilir', () => {
    render(<DatePicker />);
    fireEvent.click(screen.getByTestId('date-picker-input'));
    expect(screen.getByTestId('date-picker-grid')).toBeInTheDocument();
  });

  it('gun hucreleri render edilir', () => {
    render(<DatePicker />);
    fireEvent.click(screen.getByTestId('date-picker-input'));
    const cells = screen.getAllByTestId('date-picker-dayCell');
    expect(cells.length).toBeGreaterThanOrEqual(28);
  });

  // ── Select Date ──

  it('gun secilince onChange cagirilir', () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue="2025-06-01" onChange={onChange} />);
    fireEvent.click(screen.getByTestId('date-picker-input'));
    const cells = screen.getAllByTestId('date-picker-dayCell');
    const dayCell = cells.find((c) => c.textContent === '15' && c.getAttribute('aria-label')?.includes('2025-06'));
    if (dayCell) fireEvent.click(dayCell);
    expect(onChange).toHaveBeenCalledWith('2025-06-15');
  });

  it('gun secilince takvim kapanir', () => {
    render(<DatePicker defaultValue="2025-06-01" />);
    fireEvent.click(screen.getByTestId('date-picker-input'));
    const cells = screen.getAllByTestId('date-picker-dayCell');
    const dayCell = cells.find((c) => c.textContent === '10' && c.getAttribute('aria-label')?.includes('2025-06'));
    if (dayCell) fireEvent.click(dayCell);
    expect(screen.queryByTestId('date-picker-calendar')).not.toBeInTheDocument();
  });

  // ── minDate / maxDate ──

  it('minDate altindaki gunler disabled', () => {
    render(<DatePicker defaultValue="2025-06-15" minDate="2025-06-10" />);
    fireEvent.click(screen.getByTestId('date-picker-input'));
    const cells = screen.getAllByTestId('date-picker-dayCell');
    const day5 = cells.find((c) => c.textContent === '5' && c.getAttribute('aria-label')?.includes('2025-06'));
    if (day5) expect(day5).toBeDisabled();
  });

  it('maxDate ustundeki gunler disabled', () => {
    render(<DatePicker defaultValue="2025-06-15" maxDate="2025-06-20" />);
    fireEvent.click(screen.getByTestId('date-picker-input'));
    const cells = screen.getAllByTestId('date-picker-dayCell');
    const day25 = cells.find((c) => c.textContent === '25' && c.getAttribute('aria-label')?.includes('2025-06'));
    if (day25) expect(day25).toBeDisabled();
  });

  // ── disabledDates ──

  it('disabledDates ile belirli gun disabled', () => {
    render(<DatePicker defaultValue="2025-06-01" disabledDates={(d) => d === '2025-06-15'} />);
    fireEvent.click(screen.getByTestId('date-picker-input'));
    const cells = screen.getAllByTestId('date-picker-dayCell');
    const day15 = cells.find((c) => c.getAttribute('aria-label') === '2025-06-15');
    if (day15) expect(day15).toBeDisabled();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<DatePicker className="my-dp" />);
    expect(screen.getByTestId('date-picker-root').className).toContain('my-dp');
  });

  it('style root elemana eklenir', () => {
    render(<DatePicker style={{ padding: '16px' }} />);
    expect(screen.getByTestId('date-picker-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<DatePicker classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('date-picker-root').className).toContain('custom-root');
  });

  it('classNames.input input elemana eklenir', () => {
    render(<DatePicker classNames={{ input: 'custom-input' }} />);
    expect(screen.getByTestId('date-picker-input').className).toContain('custom-input');
  });

  it('classNames.calendar calendar elemana eklenir', () => {
    render(<DatePicker classNames={{ calendar: 'custom-cal' }} />);
    fireEvent.click(screen.getByTestId('date-picker-input'));
    expect(screen.getByTestId('date-picker-calendar').className).toContain('custom-cal');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<DatePicker styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('date-picker-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.input input elemana eklenir', () => {
    render(<DatePicker styles={{ input: { padding: '12px' } }} />);
    expect(screen.getByTestId('date-picker-input')).toHaveStyle({ padding: '12px' });
  });

  it('styles.header header elemana eklenir', () => {
    render(<DatePicker styles={{ header: { padding: '10px' } }} />);
    fireEvent.click(screen.getByTestId('date-picker-input'));
    expect(screen.getByTestId('date-picker-header')).toHaveStyle({ padding: '10px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<DatePicker ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('DatePicker (Compound)', () => {
  it('compound: input render edilir', () => {
    render(
      <DatePicker>
        <DatePicker.Input />
        <DatePicker.Calendar />
      </DatePicker>,
    );
    expect(screen.getByTestId('date-picker-input')).toBeInTheDocument();
  });

  it('compound: input tiklaninca calendar acilir', () => {
    render(
      <DatePicker>
        <DatePicker.Input />
        <DatePicker.Calendar />
      </DatePicker>,
    );
    fireEvent.click(screen.getByTestId('date-picker-input'));
    expect(screen.getByTestId('date-picker-calendar')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <DatePicker classNames={{ input: 'cmp-input' }}>
        <DatePicker.Input />
      </DatePicker>,
    );
    expect(screen.getByTestId('date-picker-input').className).toContain('cmp-input');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <DatePicker styles={{ input: { padding: '20px' } }}>
        <DatePicker.Input />
      </DatePicker>,
    );
    expect(screen.getByTestId('date-picker-input')).toHaveStyle({ padding: '20px' });
  });

  it('DatePicker.Input context disinda hata firlatir', () => {
    expect(() => render(<DatePicker.Input />)).toThrow();
  });
});
