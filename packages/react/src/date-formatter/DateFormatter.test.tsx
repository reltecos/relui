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
import { DateFormatter } from './DateFormatter';

const fixedDate = new Date(2025, 2, 15, 14, 30, 0);

describe('DateFormatter', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<DateFormatter value={fixedDate} />);
    expect(screen.getByTestId('date-formatter-root')).toBeInTheDocument();
  });

  // ── Value ──

  it('value varsayilan locale ile formatlanir', () => {
    render(<DateFormatter value={fixedDate} locale="en-US" />);
    const text = screen.getByTestId('date-formatter-value').textContent ?? '';
    expect(text).toContain('2025');
  });

  it('value dateStyle long ile formatlanir', () => {
    render(<DateFormatter value={fixedDate} locale="en-US" dateStyle="long" />);
    const text = screen.getByTestId('date-formatter-value').textContent ?? '';
    expect(text).toContain('March');
    expect(text).toContain('2025');
  });

  it('value dateStyle short ile formatlanir', () => {
    render(<DateFormatter value={fixedDate} locale="en-US" dateStyle="short" />);
    const text = screen.getByTestId('date-formatter-value').textContent ?? '';
    expect(text).toContain('3/15/25');
  });

  it('value timeStyle ile formatlanir', () => {
    render(<DateFormatter value={fixedDate} locale="en-US" timeStyle="short" />);
    const text = screen.getByTestId('date-formatter-value').textContent ?? '';
    expect(text).toMatch(/2:30|14:30/);
  });

  it('value dateStyle ve timeStyle birlikte kullanilir', () => {
    render(<DateFormatter value={fixedDate} locale="en-US" dateStyle="short" timeStyle="short" />);
    const text = screen.getByTestId('date-formatter-value').textContent ?? '';
    expect(text).toContain('3/15/25');
  });

  it('value granular options ile formatlanir', () => {
    render(<DateFormatter value={fixedDate} locale="en-US" year="numeric" month="short" />);
    const text = screen.getByTestId('date-formatter-value').textContent ?? '';
    expect(text).toContain('Mar');
    expect(text).toContain('2025');
  });

  it('value string tarih kabul eder', () => {
    render(<DateFormatter value="2025-03-15" locale="en-US" dateStyle="long" />);
    const text = screen.getByTestId('date-formatter-value').textContent ?? '';
    expect(text).toContain('March');
  });

  it('value timestamp kabul eder', () => {
    render(<DateFormatter value={fixedDate.getTime()} locale="en-US" dateStyle="short" />);
    const text = screen.getByTestId('date-formatter-value').textContent ?? '';
    expect(text).toContain('3/15/25');
  });

  it('value undefined ise bos string render edilir', () => {
    render(<DateFormatter />);
    expect(screen.getByTestId('date-formatter-value')).toHaveTextContent('');
  });

  // ── Prefix & Suffix ──

  it('prefix render edilir', () => {
    render(<DateFormatter value={fixedDate} prefix="Tarih: " />);
    expect(screen.getByTestId('date-formatter-prefix')).toHaveTextContent('Tarih:');
  });

  it('suffix render edilir', () => {
    render(<DateFormatter value={fixedDate} suffix=" (bugun)" />);
    expect(screen.getByTestId('date-formatter-suffix')).toHaveTextContent('(bugun)');
  });

  it('prefix olmadan prefix render edilmez', () => {
    render(<DateFormatter value={fixedDate} />);
    expect(screen.queryByTestId('date-formatter-prefix')).not.toBeInTheDocument();
  });

  it('suffix olmadan suffix render edilmez', () => {
    render(<DateFormatter value={fixedDate} />);
    expect(screen.queryByTestId('date-formatter-suffix')).not.toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<DateFormatter value={fixedDate} className="my-date" />);
    expect(screen.getByTestId('date-formatter-root').className).toContain('my-date');
  });

  it('style root elemana eklenir', () => {
    render(<DateFormatter value={fixedDate} style={{ padding: '8px' }} />);
    expect(screen.getByTestId('date-formatter-root')).toHaveStyle({ padding: '8px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<DateFormatter value={fixedDate} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('date-formatter-root').className).toContain('custom-root');
  });

  it('classNames.value value elemana eklenir', () => {
    render(<DateFormatter value={fixedDate} classNames={{ value: 'custom-value' }} />);
    expect(screen.getByTestId('date-formatter-value').className).toContain('custom-value');
  });

  it('classNames.prefix prefix elemana eklenir', () => {
    render(<DateFormatter value={fixedDate} prefix="P" classNames={{ prefix: 'custom-prefix' }} />);
    expect(screen.getByTestId('date-formatter-prefix').className).toContain('custom-prefix');
  });

  it('classNames.suffix suffix elemana eklenir', () => {
    render(<DateFormatter value={fixedDate} suffix="S" classNames={{ suffix: 'custom-suffix' }} />);
    expect(screen.getByTestId('date-formatter-suffix').className).toContain('custom-suffix');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<DateFormatter value={fixedDate} styles={{ root: { padding: '16px' } }} />);
    expect(screen.getByTestId('date-formatter-root')).toHaveStyle({ padding: '16px' });
  });

  it('styles.value value elemana eklenir', () => {
    render(<DateFormatter value={fixedDate} styles={{ value: { fontSize: '24px' } }} />);
    expect(screen.getByTestId('date-formatter-value')).toHaveStyle({ fontSize: '24px' });
  });

  it('styles.prefix prefix elemana eklenir', () => {
    render(
      <DateFormatter value={fixedDate} prefix="P" styles={{ prefix: { letterSpacing: '0.1em' } }} />,
    );
    expect(screen.getByTestId('date-formatter-prefix')).toHaveStyle({ letterSpacing: '0.1em' });
  });

  it('styles.suffix suffix elemana eklenir', () => {
    render(
      <DateFormatter value={fixedDate} suffix="S" styles={{ suffix: { padding: '4px' } }} />,
    );
    expect(screen.getByTestId('date-formatter-suffix')).toHaveStyle({ padding: '4px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<DateFormatter value={fixedDate} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('DateFormatter (Compound)', () => {
  it('compound: value Date ile render edilir', () => {
    render(
      <DateFormatter locale="en-US" dateStyle="short">
        <DateFormatter.Value>{fixedDate}</DateFormatter.Value>
      </DateFormatter>,
    );
    expect(screen.getByTestId('date-formatter-value')).toHaveTextContent('3/15/25');
  });

  it('compound: value string ile render edilir', () => {
    render(
      <DateFormatter locale="en-US" dateStyle="long">
        <DateFormatter.Value>2025-03-15</DateFormatter.Value>
      </DateFormatter>,
    );
    const text = screen.getByTestId('date-formatter-value').textContent ?? '';
    expect(text).toContain('March');
  });

  it('compound: prefix render edilir', () => {
    render(
      <DateFormatter>
        <DateFormatter.Prefix>Date: </DateFormatter.Prefix>
        <DateFormatter.Value>{fixedDate}</DateFormatter.Value>
      </DateFormatter>,
    );
    expect(screen.getByTestId('date-formatter-prefix')).toHaveTextContent('Date:');
  });

  it('compound: suffix render edilir', () => {
    render(
      <DateFormatter>
        <DateFormatter.Value>{fixedDate}</DateFormatter.Value>
        <DateFormatter.Suffix> (today)</DateFormatter.Suffix>
      </DateFormatter>,
    );
    expect(screen.getByTestId('date-formatter-suffix')).toHaveTextContent('(today)');
  });

  it('compound: dateStyle context ile aktarilir', () => {
    render(
      <DateFormatter locale="en-US" dateStyle="long">
        <DateFormatter.Value>{fixedDate}</DateFormatter.Value>
      </DateFormatter>,
    );
    const text = screen.getByTestId('date-formatter-value').textContent ?? '';
    expect(text).toContain('March');
    expect(text).toContain('15');
    expect(text).toContain('2025');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <DateFormatter classNames={{ value: 'cmp-val' }}>
        <DateFormatter.Value>{fixedDate}</DateFormatter.Value>
      </DateFormatter>,
    );
    expect(screen.getByTestId('date-formatter-value').className).toContain('cmp-val');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <DateFormatter styles={{ value: { fontSize: '32px' } }}>
        <DateFormatter.Value>{fixedDate}</DateFormatter.Value>
      </DateFormatter>,
    );
    expect(screen.getByTestId('date-formatter-value')).toHaveStyle({ fontSize: '32px' });
  });

  it('DateFormatter.Value context disinda hata firlatir', () => {
    expect(() => render(<DateFormatter.Value>{fixedDate}</DateFormatter.Value>)).toThrow();
  });
});
