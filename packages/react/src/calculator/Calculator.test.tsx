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
import { Calculator } from './Calculator';

describe('Calculator', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Calculator />);
    expect(screen.getByTestId('calculator-root')).toBeInTheDocument();
  });

  it('role application ve aria-label set edilir', () => {
    render(<Calculator />);
    const root = screen.getByTestId('calculator-root');
    expect(root).toHaveAttribute('role', 'application');
    expect(root).toHaveAttribute('aria-label', 'Calculator');
  });

  it('tabIndex 0 ile focus alinabilir', () => {
    render(<Calculator />);
    expect(screen.getByTestId('calculator-root')).toHaveAttribute('tabindex', '0');
  });

  // ── Display ──

  it('display render edilir', () => {
    render(<Calculator />);
    expect(screen.getByTestId('calculator-display')).toBeInTheDocument();
  });

  it('display baslangicta 0 gosterir', () => {
    render(<Calculator />);
    expect(screen.getByTestId('calculator-display-value')).toHaveTextContent('0');
  });

  it('expression baslangicta bos', () => {
    render(<Calculator />);
    expect(screen.getByTestId('calculator-expression')).toHaveTextContent('');
  });

  // ── Keypad ──

  it('keypad render edilir', () => {
    render(<Calculator />);
    expect(screen.getByTestId('calculator-keypad')).toBeInTheDocument();
  });

  it('tuslara basilinca display guncellenir', () => {
    render(<Calculator />);
    const keys = screen.getAllByTestId('calculator-key');
    const key5 = keys.find((k) => k.textContent === '5');
    if (key5) fireEvent.click(key5);
    expect(screen.getByTestId('calculator-display-value')).toHaveTextContent('5');
  });

  it('toplama islemi yapar', () => {
    render(<Calculator />);
    const keys = screen.getAllByTestId('calculator-key');
    const findKey = (text: string) => keys.find((k) => k.textContent === text);
    const key3 = findKey('3');
    const keyPlus = keys.find((k) => k.getAttribute('aria-label') === 'Add');
    const key2 = findKey('2');
    const keyEq = keys.find((k) => k.getAttribute('aria-label') === 'Equals');

    if (key3) fireEvent.click(key3);
    if (keyPlus) fireEvent.click(keyPlus);
    if (key2) fireEvent.click(key2);
    if (keyEq) fireEvent.click(keyEq);

    expect(screen.getByTestId('calculator-display-value')).toHaveTextContent('5');
  });

  it('C tusu sifirlar', () => {
    render(<Calculator />);
    const keys = screen.getAllByTestId('calculator-key');
    const key5 = keys.find((k) => k.textContent === '5');
    const keyC = keys.find((k) => k.getAttribute('aria-label') === 'Clear');

    if (key5) fireEvent.click(key5);
    if (keyC) fireEvent.click(keyC);

    expect(screen.getByTestId('calculator-display-value')).toHaveTextContent('0');
  });

  // ── Keyboard ──

  it('klavye ile rakam girilir', () => {
    render(<Calculator />);
    fireEvent.keyDown(screen.getByTestId('calculator-root'), { key: '7' });
    expect(screen.getByTestId('calculator-display-value')).toHaveTextContent('7');
  });

  it('klavye ile toplama yapilir', () => {
    render(<Calculator />);
    const root = screen.getByTestId('calculator-root');
    fireEvent.keyDown(root, { key: '4' });
    fireEvent.keyDown(root, { key: '+' });
    fireEvent.keyDown(root, { key: '6' });
    fireEvent.keyDown(root, { key: 'Enter' });
    expect(screen.getByTestId('calculator-display-value')).toHaveTextContent('10');
  });

  it('Escape ile sifirlanir', () => {
    render(<Calculator />);
    const root = screen.getByTestId('calculator-root');
    fireEvent.keyDown(root, { key: '5' });
    fireEvent.keyDown(root, { key: 'Escape' });
    expect(screen.getByTestId('calculator-display-value')).toHaveTextContent('0');
  });

  it('Backspace ile son karakter silinir', () => {
    render(<Calculator />);
    const root = screen.getByTestId('calculator-root');
    fireEvent.keyDown(root, { key: '1' });
    fireEvent.keyDown(root, { key: '2' });
    fireEvent.keyDown(root, { key: 'Backspace' });
    expect(screen.getByTestId('calculator-display-value')).toHaveTextContent('1');
  });

  // ── History ──

  it('showHistory false ise history gosterilmez', () => {
    render(<Calculator />);
    expect(screen.queryByTestId('calculator-history')).not.toBeInTheDocument();
  });

  it('showHistory true ve islem sonrasi history gosterilir', () => {
    render(<Calculator showHistory />);
    const root = screen.getByTestId('calculator-root');
    fireEvent.keyDown(root, { key: '2' });
    fireEvent.keyDown(root, { key: '+' });
    fireEvent.keyDown(root, { key: '3' });
    fireEvent.keyDown(root, { key: 'Enter' });
    expect(screen.getByTestId('calculator-history')).toBeInTheDocument();
    expect(screen.getByTestId('calculator-history-item')).toBeInTheDocument();
  });

  // ── Callback ──

  it('onResult callback cagrilir', () => {
    const onResult = vi.fn();
    render(<Calculator onResult={onResult} />);
    const root = screen.getByTestId('calculator-root');
    fireEvent.keyDown(root, { key: '5' });
    fireEvent.keyDown(root, { key: '+' });
    fireEvent.keyDown(root, { key: '5' });
    fireEvent.keyDown(root, { key: 'Enter' });
    expect(onResult).toHaveBeenCalledWith(10);
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Calculator className="my-calc" />);
    expect(screen.getByTestId('calculator-root').className).toContain('my-calc');
  });

  it('style root elemana eklenir', () => {
    render(<Calculator style={{ padding: '16px' }} />);
    expect(screen.getByTestId('calculator-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Calculator classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('calculator-root').className).toContain('custom-root');
  });

  it('classNames.display display elemana eklenir', () => {
    render(<Calculator classNames={{ display: 'custom-disp' }} />);
    expect(screen.getByTestId('calculator-display').className).toContain('custom-disp');
  });

  it('classNames.keypad keypad elemana eklenir', () => {
    render(<Calculator classNames={{ keypad: 'custom-kp' }} />);
    expect(screen.getByTestId('calculator-keypad').className).toContain('custom-kp');
  });

  it('classNames.key key elemana eklenir', () => {
    render(<Calculator classNames={{ key: 'custom-key' }} />);
    const keys = screen.getAllByTestId('calculator-key');
    expect(keys[4].className).toContain('custom-key');
  });

  it('classNames.expression expression elemana eklenir', () => {
    render(<Calculator classNames={{ expression: 'custom-expr' }} />);
    expect(screen.getByTestId('calculator-expression').className).toContain('custom-expr');
  });

  it('classNames.memoryKey memoryKey elemana eklenir', () => {
    render(<Calculator classNames={{ memoryKey: 'custom-mk' }} />);
    const keys = screen.getAllByTestId('calculator-key');
    // First 4 keys are memory keys
    expect(keys[0].className).toContain('custom-mk');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Calculator styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('calculator-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.display display elemana eklenir', () => {
    render(<Calculator styles={{ display: { padding: '20px' } }} />);
    expect(screen.getByTestId('calculator-display')).toHaveStyle({ padding: '20px' });
  });

  it('styles.keypad keypad elemana eklenir', () => {
    render(<Calculator styles={{ keypad: { padding: '8px' } }} />);
    expect(screen.getByTestId('calculator-keypad')).toHaveStyle({ padding: '8px' });
  });

  it('styles.expression expression elemana eklenir', () => {
    render(<Calculator styles={{ expression: { fontSize: '14px' } }} />);
    expect(screen.getByTestId('calculator-expression')).toHaveStyle({ fontSize: '14px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Calculator ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Calculator (Compound)', () => {
  it('compound: display render edilir', () => {
    render(
      <Calculator>
        <Calculator.Display />
      </Calculator>,
    );
    expect(screen.getByTestId('calculator-display')).toBeInTheDocument();
  });

  it('compound: keypad render edilir', () => {
    render(
      <Calculator>
        <Calculator.Display />
        <Calculator.Keypad />
      </Calculator>,
    );
    expect(screen.getByTestId('calculator-keypad')).toBeInTheDocument();
  });

  it('compound: history render edilir', () => {
    render(
      <Calculator>
        <Calculator.Display />
        <Calculator.Keypad />
        <Calculator.History />
      </Calculator>,
    );
    // History bos oldugu icin null render eder
    expect(screen.queryByTestId('calculator-history')).not.toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Calculator classNames={{ display: 'cmp-disp' }}>
        <Calculator.Display />
      </Calculator>,
    );
    expect(screen.getByTestId('calculator-display').className).toContain('cmp-disp');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Calculator styles={{ display: { padding: '32px' } }}>
        <Calculator.Display />
      </Calculator>,
    );
    expect(screen.getByTestId('calculator-display')).toHaveStyle({ padding: '32px' });
  });

  it('Calculator.Display context disinda hata firlatir', () => {
    expect(() => render(<Calculator.Display />)).toThrow();
  });
});
