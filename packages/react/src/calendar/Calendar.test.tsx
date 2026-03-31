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
import { Calendar } from './Calendar';
import type { CalendarEventDef } from '@relteco/relui-core';

const fixedDate = new Date(2025, 2, 15);
const events: CalendarEventDef[] = [
  { id: 'e1', title: 'Meeting', start: new Date(2025, 2, 10, 9, 0), end: new Date(2025, 2, 10, 10, 0) },
  { id: 'e2', title: 'Lunch', start: new Date(2025, 2, 15, 12, 0), end: new Date(2025, 2, 15, 13, 0) },
];

describe('Calendar', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Calendar defaultDate={fixedDate} />);
    expect(screen.getByTestId('calendar-root')).toBeInTheDocument();
  });

  // ── Header ──

  it('header render edilir', () => {
    render(<Calendar defaultDate={fixedDate} />);
    expect(screen.getByTestId('calendar-header')).toBeInTheDocument();
  });

  it('ay basligini gosterir', () => {
    render(<Calendar defaultDate={fixedDate} locale="en-US" />);
    expect(screen.getByTestId('calendar-title')).toHaveTextContent('March 2025');
  });

  it('navigation butonlari render edilir', () => {
    render(<Calendar defaultDate={fixedDate} />);
    expect(screen.getByTestId('calendar-prev')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-next')).toBeInTheDocument();
  });

  it('prev butonuyla onceki aya gider', () => {
    render(<Calendar defaultDate={fixedDate} locale="en-US" />);
    fireEvent.click(screen.getByTestId('calendar-prev'));
    expect(screen.getByTestId('calendar-title')).toHaveTextContent('February 2025');
  });

  it('next butonuyla sonraki aya gider', () => {
    render(<Calendar defaultDate={fixedDate} locale="en-US" />);
    fireEvent.click(screen.getByTestId('calendar-next'));
    expect(screen.getByTestId('calendar-title')).toHaveTextContent('April 2025');
  });

  it('today butonu render edilir', () => {
    render(<Calendar defaultDate={fixedDate} />);
    expect(screen.getByTestId('calendar-today-btn')).toBeInTheDocument();
  });

  // ── View ──

  it('view butonlari render edilir', () => {
    render(<Calendar defaultDate={fixedDate} />);
    expect(screen.getByTestId('calendar-view-month')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-view-week')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-view-day')).toBeInTheDocument();
  });

  it('varsayilan view month ve aria-pressed true', () => {
    render(<Calendar defaultDate={fixedDate} />);
    expect(screen.getByTestId('calendar-view-month')).toHaveAttribute('aria-pressed', 'true');
  });

  // ── Grid ──

  it('grid render edilir', () => {
    render(<Calendar defaultDate={fixedDate} />);
    expect(screen.getByTestId('calendar-grid')).toBeInTheDocument();
  });

  it('hafta gunleri render edilir', () => {
    render(<Calendar defaultDate={fixedDate} />);
    expect(screen.getByTestId('calendar-week-header')).toBeInTheDocument();
  });

  it('42 gun hucresi render edilir', () => {
    render(<Calendar defaultDate={fixedDate} />);
    expect(screen.getAllByTestId('calendar-day-cell')).toHaveLength(42);
  });

  it('gun tiklaninca secilir', () => {
    const onDateSelect = vi.fn();
    render(<Calendar defaultDate={fixedDate} onDateSelect={onDateSelect} />);
    const cells = screen.getAllByTestId('calendar-day-cell');
    fireEvent.click(cells[15]);
    expect(onDateSelect).toHaveBeenCalled();
  });

  // ── Events ──

  it('etkinlikler gun hucresinde gosterilir', () => {
    render(<Calendar defaultDate={fixedDate} events={events} />);
    expect(screen.getAllByTestId('calendar-event').length).toBeGreaterThanOrEqual(1);
  });

  it('etkinlik basligi render edilir', () => {
    render(<Calendar defaultDate={fixedDate} events={events} />);
    expect(screen.getByText('Meeting')).toBeInTheDocument();
  });

  // ── Keyboard ──

  it('Enter ile gun secilir', () => {
    const onDateSelect = vi.fn();
    render(<Calendar defaultDate={fixedDate} onDateSelect={onDateSelect} />);
    const cells = screen.getAllByTestId('calendar-day-cell');
    fireEvent.keyDown(cells[10], { key: 'Enter' });
    expect(onDateSelect).toHaveBeenCalled();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Calendar defaultDate={fixedDate} className="my-cal" />);
    expect(screen.getByTestId('calendar-root').className).toContain('my-cal');
  });

  it('style root elemana eklenir', () => {
    render(<Calendar defaultDate={fixedDate} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('calendar-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Calendar defaultDate={fixedDate} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('calendar-root').className).toContain('custom-root');
  });

  it('classNames.header header elemana eklenir', () => {
    render(<Calendar defaultDate={fixedDate} classNames={{ header: 'custom-hdr' }} />);
    expect(screen.getByTestId('calendar-header').className).toContain('custom-hdr');
  });

  it('classNames.grid grid elemana eklenir', () => {
    render(<Calendar defaultDate={fixedDate} classNames={{ grid: 'custom-grid' }} />);
    expect(screen.getByTestId('calendar-grid').className).toContain('custom-grid');
  });

  it('classNames.dayCell dayCell elemana eklenir', () => {
    render(<Calendar defaultDate={fixedDate} classNames={{ dayCell: 'custom-dc' }} />);
    expect(screen.getAllByTestId('calendar-day-cell')[0].className).toContain('custom-dc');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Calendar defaultDate={fixedDate} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('calendar-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.header header elemana eklenir', () => {
    render(<Calendar defaultDate={fixedDate} styles={{ header: { padding: '16px' } }} />);
    expect(screen.getByTestId('calendar-header')).toHaveStyle({ padding: '16px' });
  });

  it('styles.grid grid elemana eklenir', () => {
    render(<Calendar defaultDate={fixedDate} styles={{ grid: { fontSize: '16px' } }} />);
    expect(screen.getByTestId('calendar-grid')).toHaveStyle({ fontSize: '16px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Calendar defaultDate={fixedDate} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Calendar (Compound)', () => {
  it('compound: header render edilir', () => {
    render(
      <Calendar defaultDate={fixedDate}>
        <Calendar.Header />
      </Calendar>,
    );
    expect(screen.getByTestId('calendar-header')).toBeInTheDocument();
  });

  it('compound: grid render edilir', () => {
    render(
      <Calendar defaultDate={fixedDate}>
        <Calendar.Header />
        <Calendar.Grid />
      </Calendar>,
    );
    expect(screen.getByTestId('calendar-grid')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Calendar defaultDate={fixedDate} classNames={{ header: 'cmp-hdr' }}>
        <Calendar.Header />
      </Calendar>,
    );
    expect(screen.getByTestId('calendar-header').className).toContain('cmp-hdr');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Calendar defaultDate={fixedDate} styles={{ header: { padding: '20px' } }}>
        <Calendar.Header />
      </Calendar>,
    );
    expect(screen.getByTestId('calendar-header')).toHaveStyle({ padding: '20px' });
  });

  it('Calendar.Header context disinda hata firlatir', () => {
    expect(() => render(<Calendar.Header />)).toThrow();
  });
});
