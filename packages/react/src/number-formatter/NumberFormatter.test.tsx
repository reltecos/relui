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
import { NumberFormatter } from './NumberFormatter';

describe('NumberFormatter', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<NumberFormatter value={100} />);
    expect(screen.getByTestId('number-formatter-root')).toBeInTheDocument();
  });

  // ── Value ──

  it('value decimal formatlanir', () => {
    render(<NumberFormatter value={1234.5} locale="en-US" />);
    expect(screen.getByTestId('number-formatter-value')).toHaveTextContent('1,234.5');
  });

  it('value tr-TR locale ile formatlanir', () => {
    render(<NumberFormatter value={1234.5} locale="tr-TR" />);
    expect(screen.getByTestId('number-formatter-value').textContent).toMatch(/1\.234,5/);
  });

  it('value currency formatlanir', () => {
    render(<NumberFormatter value={1234} locale="en-US" formatStyle="currency" currency="USD" />);
    const text = screen.getByTestId('number-formatter-value').textContent ?? '';
    expect(text).toContain('1,234');
    expect(text).toContain('$');
  });

  it('value percent formatlanir', () => {
    render(<NumberFormatter value={0.85} formatStyle="percent" />);
    expect(screen.getByTestId('number-formatter-value')).toHaveTextContent('85%');
  });

  it('value compact notation ile formatlanir', () => {
    render(<NumberFormatter value={1500} locale="en-US" notation="compact" />);
    const text = screen.getByTestId('number-formatter-value').textContent ?? '';
    expect(text).toMatch(/1\.5K|1,5K|2K/);
  });

  it('minimumFractionDigits uygulanir', () => {
    render(<NumberFormatter value={42} minimumFractionDigits={2} locale="en-US" />);
    expect(screen.getByTestId('number-formatter-value')).toHaveTextContent('42.00');
  });

  it('maximumFractionDigits uygulanir', () => {
    render(<NumberFormatter value={3.14159} maximumFractionDigits={2} locale="en-US" />);
    expect(screen.getByTestId('number-formatter-value')).toHaveTextContent('3.14');
  });

  it('value undefined ise bos string render edilir', () => {
    render(<NumberFormatter />);
    expect(screen.getByTestId('number-formatter-value')).toHaveTextContent('');
  });

  // ── Prefix & Suffix ──

  it('prefix render edilir', () => {
    render(<NumberFormatter value={100} prefix="Toplam: " />);
    expect(screen.getByTestId('number-formatter-prefix')).toHaveTextContent('Toplam:');
  });

  it('suffix render edilir', () => {
    render(<NumberFormatter value={100} suffix=" adet" />);
    expect(screen.getByTestId('number-formatter-suffix')).toHaveTextContent('adet');
  });

  it('prefix olmadan prefix render edilmez', () => {
    render(<NumberFormatter value={100} />);
    expect(screen.queryByTestId('number-formatter-prefix')).not.toBeInTheDocument();
  });

  it('suffix olmadan suffix render edilmez', () => {
    render(<NumberFormatter value={100} />);
    expect(screen.queryByTestId('number-formatter-suffix')).not.toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<NumberFormatter value={100} className="my-formatter" />);
    expect(screen.getByTestId('number-formatter-root').className).toContain('my-formatter');
  });

  it('style root elemana eklenir', () => {
    render(<NumberFormatter value={100} style={{ padding: '8px' }} />);
    expect(screen.getByTestId('number-formatter-root')).toHaveStyle({ padding: '8px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<NumberFormatter value={100} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('number-formatter-root').className).toContain('custom-root');
  });

  it('classNames.value value elemana eklenir', () => {
    render(<NumberFormatter value={100} classNames={{ value: 'custom-value' }} />);
    expect(screen.getByTestId('number-formatter-value').className).toContain('custom-value');
  });

  it('classNames.prefix prefix elemana eklenir', () => {
    render(<NumberFormatter value={100} prefix="P" classNames={{ prefix: 'custom-prefix' }} />);
    expect(screen.getByTestId('number-formatter-prefix').className).toContain('custom-prefix');
  });

  it('classNames.suffix suffix elemana eklenir', () => {
    render(<NumberFormatter value={100} suffix="S" classNames={{ suffix: 'custom-suffix' }} />);
    expect(screen.getByTestId('number-formatter-suffix').className).toContain('custom-suffix');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<NumberFormatter value={100} styles={{ root: { padding: '16px' } }} />);
    expect(screen.getByTestId('number-formatter-root')).toHaveStyle({ padding: '16px' });
  });

  it('styles.value value elemana eklenir', () => {
    render(<NumberFormatter value={100} styles={{ value: { fontSize: '24px' } }} />);
    expect(screen.getByTestId('number-formatter-value')).toHaveStyle({ fontSize: '24px' });
  });

  it('styles.prefix prefix elemana eklenir', () => {
    render(<NumberFormatter value={100} prefix="P" styles={{ prefix: { letterSpacing: '0.1em' } }} />);
    expect(screen.getByTestId('number-formatter-prefix')).toHaveStyle({ letterSpacing: '0.1em' });
  });

  it('styles.suffix suffix elemana eklenir', () => {
    render(<NumberFormatter value={100} suffix="S" styles={{ suffix: { padding: '4px' } }} />);
    expect(screen.getByTestId('number-formatter-suffix')).toHaveStyle({ padding: '4px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<NumberFormatter value={100} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('NumberFormatter (Compound)', () => {
  it('compound: value render edilir', () => {
    render(
      <NumberFormatter locale="en-US">
        <NumberFormatter.Value>{1234}</NumberFormatter.Value>
      </NumberFormatter>,
    );
    expect(screen.getByTestId('number-formatter-value')).toHaveTextContent('1,234');
  });

  it('compound: string value formatlanir', () => {
    render(
      <NumberFormatter locale="en-US">
        <NumberFormatter.Value>5678.9</NumberFormatter.Value>
      </NumberFormatter>,
    );
    expect(screen.getByTestId('number-formatter-value')).toHaveTextContent('5,678.9');
  });

  it('compound: prefix render edilir', () => {
    render(
      <NumberFormatter>
        <NumberFormatter.Prefix>Total: </NumberFormatter.Prefix>
        <NumberFormatter.Value>{100}</NumberFormatter.Value>
      </NumberFormatter>,
    );
    expect(screen.getByTestId('number-formatter-prefix')).toHaveTextContent('Total:');
  });

  it('compound: suffix render edilir', () => {
    render(
      <NumberFormatter>
        <NumberFormatter.Value>{100}</NumberFormatter.Value>
        <NumberFormatter.Suffix> items</NumberFormatter.Suffix>
      </NumberFormatter>,
    );
    expect(screen.getByTestId('number-formatter-suffix')).toHaveTextContent('items');
  });

  it('compound: currency context ile aktarilir', () => {
    render(
      <NumberFormatter locale="en-US" formatStyle="currency" currency="USD">
        <NumberFormatter.Value>{1234}</NumberFormatter.Value>
      </NumberFormatter>,
    );
    const text = screen.getByTestId('number-formatter-value').textContent ?? '';
    expect(text).toContain('$');
    expect(text).toContain('1,234');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <NumberFormatter classNames={{ value: 'cmp-val' }}>
        <NumberFormatter.Value>{100}</NumberFormatter.Value>
      </NumberFormatter>,
    );
    expect(screen.getByTestId('number-formatter-value').className).toContain('cmp-val');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <NumberFormatter styles={{ value: { fontSize: '32px' } }}>
        <NumberFormatter.Value>{100}</NumberFormatter.Value>
      </NumberFormatter>,
    );
    expect(screen.getByTestId('number-formatter-value')).toHaveStyle({ fontSize: '32px' });
  });

  it('NumberFormatter.Value context disinda hata firlatir', () => {
    expect(() => render(<NumberFormatter.Value>{100}</NumberFormatter.Value>)).toThrow();
  });
});
