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
import { DateRangePicker } from './DateRangePicker';

describe('DateRangePicker', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<DateRangePicker />);
    expect(screen.getByTestId('date-range-picker-root')).toBeInTheDocument();
  });

  // ── StartInput & EndInput ──

  it('startInput render edilir', () => {
    render(<DateRangePicker />);
    expect(screen.getByTestId('date-range-picker-startInput')).toBeInTheDocument();
  });

  it('endInput render edilir', () => {
    render(<DateRangePicker />);
    expect(screen.getByTestId('date-range-picker-endInput')).toBeInTheDocument();
  });

  // ── Placeholder ──

  it('varsayilan placeholder gosterilir', () => {
    render(<DateRangePicker />);
    expect(screen.getByText('Baslangic')).toBeInTheDocument();
    expect(screen.getByText('Bitis')).toBeInTheDocument();
  });

  it('ozel placeholder gosterilir', () => {
    render(<DateRangePicker placeholderStart="Tarih 1" placeholderEnd="Tarih 2" />);
    expect(screen.getByText('Tarih 1')).toBeInTheDocument();
    expect(screen.getByText('Tarih 2')).toBeInTheDocument();
  });

  // ── Default Values ──

  it('defaultStartDate ve defaultEndDate ile deger gosterilir', () => {
    render(
      <DateRangePicker defaultStartDate="2025-06-01" defaultEndDate="2025-06-15" />,
    );
    expect(screen.getByText('01/06/2025')).toBeInTheDocument();
    expect(screen.getByText('15/06/2025')).toBeInTheDocument();
  });

  // ── Open/Close ──

  it('startInput tiklaninca takvim acilir', () => {
    render(<DateRangePicker />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    expect(screen.getByTestId('date-range-picker-calendar')).toBeInTheDocument();
  });

  it('kapaliyken takvim gosterilmez', () => {
    render(<DateRangePicker />);
    expect(screen.queryByTestId('date-range-picker-calendar')).not.toBeInTheDocument();
  });

  // ── Calendar Grid ──

  it('takvim grid render edilir', () => {
    render(<DateRangePicker />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    expect(screen.getByTestId('date-range-picker-grid')).toBeInTheDocument();
  });

  it('gun hucreleri render edilir', () => {
    render(<DateRangePicker />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    const cells = screen.getAllByTestId('date-range-picker-dayCell');
    expect(cells.length).toBeGreaterThanOrEqual(28);
  });

  // ── Navigation ──

  it('ay navigasyon header render edilir', () => {
    render(<DateRangePicker />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    expect(screen.getByTestId('date-range-picker-header')).toBeInTheDocument();
    expect(screen.getByTestId('date-range-picker-monthLabel')).toBeInTheDocument();
  });

  it('navButton tiklaninca ay degisir', () => {
    render(<DateRangePicker defaultStartDate="2025-06-01" />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    const label = screen.getByTestId('date-range-picker-monthLabel');
    expect(label).toHaveTextContent('Haziran 2025');
    const navButtons = screen.getAllByTestId('date-range-picker-navButton');
    fireEvent.click(navButtons[0]);
    expect(label).toHaveTextContent('Mayis 2025');
  });

  it('ileri navButton tiklaninca sonraki ay gosterilir', () => {
    render(<DateRangePicker defaultStartDate="2025-06-01" />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    const label = screen.getByTestId('date-range-picker-monthLabel');
    const navButtons = screen.getAllByTestId('date-range-picker-navButton');
    fireEvent.click(navButtons[1]);
    expect(label).toHaveTextContent('Temmuz 2025');
  });

  // ── Date Selection ──

  it('ilk tikla baslangic ikinci tikla bitis secilir', () => {
    const onChange = vi.fn();
    render(<DateRangePicker defaultStartDate="2025-06-01" onChange={onChange} />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));

    const cells = screen.getAllByTestId('date-range-picker-dayCell');
    const day5 = cells.find(
      (c) => c.textContent === '5' && c.getAttribute('aria-label')?.includes('2025-06'),
    );
    if (day5) fireEvent.click(day5);

    const day10 = cells.find(
      (c) => c.textContent === '10' && c.getAttribute('aria-label')?.includes('2025-06'),
    );
    if (day10) fireEvent.click(day10);

    expect(onChange).toHaveBeenCalledWith('2025-06-05', '2025-06-10');
  });

  it('aralik secildikten sonra takvim kapanir', () => {
    render(<DateRangePicker defaultStartDate="2025-06-01" />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));

    const cells = screen.getAllByTestId('date-range-picker-dayCell');
    const day5 = cells.find(
      (c) => c.textContent === '5' && c.getAttribute('aria-label')?.includes('2025-06'),
    );
    if (day5) fireEvent.click(day5);
    const day10 = cells.find(
      (c) => c.textContent === '10' && c.getAttribute('aria-label')?.includes('2025-06'),
    );
    if (day10) fireEvent.click(day10);

    expect(screen.queryByTestId('date-range-picker-calendar')).not.toBeInTheDocument();
  });

  // ── minDate / maxDate ──

  it('minDate altindaki gunler disabled', () => {
    render(<DateRangePicker defaultStartDate="2025-06-15" minDate="2025-06-10" />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    const cells = screen.getAllByTestId('date-range-picker-dayCell');
    const day5 = cells.find(
      (c) => c.textContent === '5' && c.getAttribute('aria-label')?.includes('2025-06'),
    );
    if (day5) expect(day5).toBeDisabled();
  });

  it('maxDate ustundeki gunler disabled', () => {
    render(<DateRangePicker defaultStartDate="2025-06-15" maxDate="2025-06-20" />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    const cells = screen.getAllByTestId('date-range-picker-dayCell');
    const day25 = cells.find(
      (c) => c.textContent === '25' && c.getAttribute('aria-label')?.includes('2025-06'),
    );
    if (day25) expect(day25).toBeDisabled();
  });

  // ── disabledDates ──

  it('disabledDates ile belirli gun disabled', () => {
    render(
      <DateRangePicker
        defaultStartDate="2025-06-01"
        disabledDates={(d) => d === '2025-06-15'}
      />,
    );
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    const cells = screen.getAllByTestId('date-range-picker-dayCell');
    const day15 = cells.find((c) => c.getAttribute('aria-label') === '2025-06-15');
    if (day15) expect(day15).toBeDisabled();
  });

  // ── Presets ──

  it('preset butonlari render edilir', () => {
    const presets = [
      { label: 'Son 7 gun', startDate: '2025-06-08', endDate: '2025-06-15' },
      { label: 'Son 30 gun', startDate: '2025-05-16', endDate: '2025-06-15' },
    ];
    render(<DateRangePicker presets={presets} />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    expect(screen.getByTestId('date-range-picker-presets')).toBeInTheDocument();
    expect(screen.getAllByTestId('date-range-picker-presetItem')).toHaveLength(2);
  });

  it('preset tiklaninca aralik set edilir', () => {
    const onChange = vi.fn();
    const presets = [
      { label: 'Son 7 gun', startDate: '2025-06-08', endDate: '2025-06-15' },
    ];
    render(<DateRangePicker presets={presets} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    fireEvent.click(screen.getByText('Son 7 gun'));
    expect(onChange).toHaveBeenCalledWith('2025-06-08', '2025-06-15');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<DateRangePicker className="my-drp" />);
    expect(screen.getByTestId('date-range-picker-root').className).toContain('my-drp');
  });

  it('style root elemana eklenir', () => {
    render(<DateRangePicker style={{ padding: '16px' }} />);
    expect(screen.getByTestId('date-range-picker-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<DateRangePicker classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('date-range-picker-root').className).toContain('custom-root');
  });

  it('classNames.startInput startInput elemana eklenir', () => {
    render(<DateRangePicker classNames={{ startInput: 'custom-start' }} />);
    expect(screen.getByTestId('date-range-picker-startInput').className).toContain('custom-start');
  });

  it('classNames.calendar calendar elemana eklenir', () => {
    render(<DateRangePicker classNames={{ calendar: 'custom-cal' }} />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    expect(screen.getByTestId('date-range-picker-calendar').className).toContain('custom-cal');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<DateRangePicker styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('date-range-picker-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.startInput startInput elemana eklenir', () => {
    render(<DateRangePicker styles={{ startInput: { padding: '12px' } }} />);
    expect(screen.getByTestId('date-range-picker-startInput')).toHaveStyle({ padding: '12px' });
  });

  it('styles.calendar calendar elemana eklenir', () => {
    render(<DateRangePicker styles={{ calendar: { padding: '20px' } }} />);
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    expect(screen.getByTestId('date-range-picker-calendar')).toHaveStyle({ padding: '20px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<DateRangePicker ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('DateRangePicker (Compound)', () => {
  it('compound: startInput render edilir', () => {
    render(
      <DateRangePicker>
        <DateRangePicker.StartInput />
        <DateRangePicker.EndInput />
        <DateRangePicker.Calendar />
      </DateRangePicker>,
    );
    expect(screen.getByTestId('date-range-picker-startInput')).toBeInTheDocument();
  });

  it('compound: endInput render edilir', () => {
    render(
      <DateRangePicker>
        <DateRangePicker.StartInput />
        <DateRangePicker.EndInput />
        <DateRangePicker.Calendar />
      </DateRangePicker>,
    );
    expect(screen.getByTestId('date-range-picker-endInput')).toBeInTheDocument();
  });

  it('compound: startInput tiklaninca calendar acilir', () => {
    render(
      <DateRangePicker>
        <DateRangePicker.StartInput />
        <DateRangePicker.EndInput />
        <DateRangePicker.Calendar />
      </DateRangePicker>,
    );
    fireEvent.click(screen.getByTestId('date-range-picker-startInput'));
    expect(screen.getByTestId('date-range-picker-calendar')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <DateRangePicker classNames={{ startInput: 'cmp-start' }}>
        <DateRangePicker.StartInput />
      </DateRangePicker>,
    );
    expect(screen.getByTestId('date-range-picker-startInput').className).toContain('cmp-start');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <DateRangePicker styles={{ startInput: { padding: '20px' } }}>
        <DateRangePicker.StartInput />
      </DateRangePicker>,
    );
    expect(screen.getByTestId('date-range-picker-startInput')).toHaveStyle({ padding: '20px' });
  });

  it('DateRangePicker.StartInput context disinda hata firlatir', () => {
    expect(() => render(<DateRangePicker.StartInput />)).toThrow();
  });
});
