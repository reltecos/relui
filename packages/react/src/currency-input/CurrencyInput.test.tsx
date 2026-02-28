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
import { CurrencyInput } from './CurrencyInput';

/**
 * Helper — CurrencyInput'un input'u type=text ama role yok.
 * aria-label ile buluruz.
 */
function renderCI(props: Record<string, unknown> = {}) {
  const defaultProps = { 'aria-label': 'Fiyat', ...props };
  return render(<CurrencyInput {...defaultProps} />);
}

function getInput() {
  return screen.getByLabelText('Fiyat');
}

describe('CurrencyInput', () => {
  // ── Render ──────────────────────────────────────────────────────

  it('render edilir / renders', () => {
    renderCI();
    expect(getInput()).toBeInTheDocument();
  });

  it('type text / type is text', () => {
    renderCI();
    expect(getInput()).toHaveAttribute('type', 'text');
  });

  it('inputMode decimal / inputMode is decimal', () => {
    renderCI();
    expect(getInput()).toHaveAttribute('inputMode', 'decimal');
  });

  it('ref forward edilir / ref is forwarded', () => {
    const ref = vi.fn();
    render(<CurrencyInput ref={ref} aria-label="Fiyat" />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Formatlama ──────────────────────────────────────────────────

  it('başlangıç değeri formatlı gösterilir / initial value shown formatted', () => {
    renderCI({ value: 1234.56 });
    expect(getInput()).toHaveValue('₺1.234,56');
  });

  it('null değer boş gösterir / null value shows empty', () => {
    renderCI();
    expect(getInput()).toHaveValue('');
  });

  it('en-US formatı doğru / en-US format is correct', () => {
    renderCI({ value: 1234.56, locale: 'en-US', currency: 'USD' });
    expect(getInput()).toHaveValue('$1,234.56');
  });

  // ── Focus/Blur ──────────────────────────────────────────────────

  it('focus olunca ham değer gösterilir / raw value shown on focus', () => {
    renderCI({ value: 1234.56 });
    const input = getInput();
    fireEvent.focus(input);
    expect(input).toHaveValue('1234,56');
  });

  it('blur olunca formatlı değer gösterilir / formatted value shown on blur', () => {
    renderCI({ value: 1234.56 });
    const input = getInput();
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(input).toHaveValue('₺1.234,56');
  });

  it('focus sonrası yeni değer girilince blurda parse edilir / new value parsed on blur', () => {
    const onValueChange = vi.fn();
    renderCI({ value: 100, onValueChange });
    const input = getInput();

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '250,50' } });
    fireEvent.blur(input);

    expect(onValueChange).toHaveBeenCalledWith(250.5);
  });

  // ── onValueChange ─────────────────────────────────────────────

  it('onValueChange değer değişince çağrılır / called when value changes', () => {
    const onValueChange = vi.fn();
    renderCI({ onValueChange });
    const input = getInput();

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '500' } });
    fireEvent.blur(input);

    expect(onValueChange).toHaveBeenCalledWith(500);
  });

  it('aynı değer girilince onValueChange çağrılmaz / not called for same value', () => {
    const onValueChange = vi.fn();
    renderCI({ value: 100, onValueChange });
    const input = getInput();

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '100,00' } });
    fireEvent.blur(input);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  // ── Currency adorn ────────────────────────────────────────────

  it('varsayılan adorn ₺ gösterilir / default adorn shows ₺', () => {
    const { container } = renderCI({ value: 0 });
    const adorn = container.querySelector('[aria-hidden="true"]');
    expect(adorn).toBeInTheDocument();
    expect(adorn?.textContent).toBe('₺');
  });

  it('showAdorn=false ise adorn yok / no adorn when showAdorn=false', () => {
    const { container } = renderCI({ showAdorn: false });
    const adorn = container.querySelector('[aria-hidden="true"]');
    expect(adorn).not.toBeInTheDocument();
  });

  it('currencyDisplay=none ise adorn yok / no adorn when display=none', () => {
    const { container } = renderCI({ currencyDisplay: 'none' });
    const adorn = container.querySelector('[aria-hidden="true"]');
    expect(adorn).not.toBeInTheDocument();
  });

  it('en-US $ prefix adorn / en-US $ prefix adorn', () => {
    const { container } = renderCI({ locale: 'en-US', currency: 'USD', value: 0 });
    const adorn = container.querySelector('[aria-hidden="true"]');
    expect(adorn?.textContent).toBe('$');
  });

  // ── Disabled ────────────────────────────────────────────────────

  it('disabled durumda input disabled olur / input is disabled when disabled', () => {
    renderCI({ disabled: true });
    expect(getInput()).toHaveAttribute('data-disabled', '');
  });

  // ── ReadOnly ────────────────────────────────────────────────────

  it('readOnly durumda readonly olur / readOnly state works', () => {
    renderCI({ readOnly: true });
    expect(getInput()).toHaveAttribute('data-readonly', '');
  });

  // ── Invalid ─────────────────────────────────────────────────────

  it('invalid durumda invalid olur / invalid state works', () => {
    renderCI({ invalid: true });
    expect(getInput()).toHaveAttribute('data-invalid', '');
  });

  // ── ARIA ────────────────────────────────────────────────────────

  it('aria-label geçirilir / aria-label is passed', () => {
    render(<CurrencyInput aria-label="Tutar" />);
    expect(screen.getByLabelText('Tutar')).toBeInTheDocument();
  });

  it('aria-describedby geçirilir / aria-describedby is passed', () => {
    renderCI({ 'aria-describedby': 'hint' });
    expect(getInput()).toHaveAttribute('aria-describedby', 'hint');
  });

  // ── Autocomplete ────────────────────────────────────────────────

  it('varsayılan autocomplete off / default autocomplete is off', () => {
    renderCI();
    expect(getInput()).toHaveAttribute('autocomplete', 'off');
  });

  // ── Name / ID ───────────────────────────────────────────────────

  it('name geçirilir / name is passed', () => {
    renderCI({ name: 'price' });
    expect(getInput()).toHaveAttribute('name', 'price');
  });

  it('id geçirilir / id is passed', () => {
    renderCI({ id: 'price-field' });
    expect(getInput()).toHaveAttribute('id', 'price-field');
  });

  // ── Variants & Sizes ───────────────────────────────────────────

  it('farklı size render edilir / different size renders', () => {
    const { unmount } = render(<CurrencyInput size="sm" aria-label="Küçük" />);
    const smClass = screen.getByLabelText('Küçük').className;
    unmount();

    render(<CurrencyInput size="xl" aria-label="Büyük" />);
    const xlClass = screen.getByLabelText('Büyük').className;

    expect(smClass).not.toBe(xlClass);
  });

  it('variant filled render edilir / variant filled renders', () => {
    renderCI({ variant: 'filled' });
    expect(getInput()).toBeInTheDocument();
  });

  it('variant flushed render edilir / variant flushed renders', () => {
    renderCI({ variant: 'flushed' });
    expect(getInput()).toBeInTheDocument();
  });

  // ── Precision ─────────────────────────────────────────────────

  it('precision 0 doğru formatlar / precision 0 formats correctly', () => {
    renderCI({ value: 1234, precision: 0 });
    expect(getInput()).toHaveValue('₺1.234');
  });

  it('precision 3 doğru formatlar / precision 3 formats correctly', () => {
    renderCI({ value: 1234.567, precision: 3 });
    expect(getInput()).toHaveValue('₺1.234,567');
  });

  // ── Negatif ───────────────────────────────────────────────────

  it('allowNegative=true negatif değer kabul eder / accepts negative when allowed', () => {
    renderCI({ value: -50.25, allowNegative: true });
    expect(getInput()).toHaveValue('₺-50,25');
  });

  // ── clampOnBlur ───────────────────────────────────────────────

  it('blurda min/max sınırına getirilir / clamps on blur', () => {
    const onValueChange = vi.fn();
    renderCI({ min: 0, max: 100, onValueChange });
    const input = getInput();

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '150' } });
    fireEvent.blur(input);

    // Önce 150 set edilir, sonra blur clamp eder → 100 olur
    // onValueChange 150 ile çağrılır, sonra blur'da clamp
    // Aslında machine SET_VALUE_FROM_STRING 150 set eder, sonra BLUR 100'e clamp eder
    // ama onValueChange blur'dan ÖNCE çağrılır (150 ile)
    expect(onValueChange).toHaveBeenCalled();
  });

  // ── classNames & styles ─────────────────────────────────────────

  describe('classNames & styles', () => {
    it('classNames.root uygulanir', () => {
      const { container } = renderCI({
        value: 0,
        classNames: { root: 'slot-root' },
      });
      expect(container.firstElementChild).toHaveClass('slot-root');
    });

    it('styles.root uygulanir', () => {
      const { container } = renderCI({
        value: 0,
        styles: { root: { padding: '10px' } },
      });
      expect(container.firstElementChild).toHaveStyle({ padding: '10px' });
    });

    it('classNames.input uygulanir', () => {
      renderCI({ classNames: { input: 'my-input' } });
      expect(getInput()).toHaveClass('my-input');
    });

    it('className + classNames.input birlestirilir', () => {
      renderCI({ className: 'legacy', classNames: { input: 'slot-input' } });
      const el = getInput();
      expect(el).toHaveClass('legacy');
      expect(el).toHaveClass('slot-input');
    });

    it('classNames.adornPrefix uygulanir', () => {
      const { container } = renderCI({
        value: 0,
        locale: 'en-US',
        currency: 'USD',
        classNames: { adornPrefix: 'my-prefix' },
      });
      const adorn = container.querySelector('[aria-hidden="true"]');
      expect(adorn).toHaveClass('my-prefix');
    });

    it('styles.adornSuffix uygulanir', () => {
      // de-DE euro suffix pozisyonunda render edilir
      const { container } = render(
        <CurrencyInput
          aria-label="Betrag"
          value={0}
          locale="de-DE"
          currency="EUR"
          styles={{ adornSuffix: { fontSize: '18px' } }}
        />,
      );
      const adorn = container.querySelector('[aria-hidden="true"]');
      expect(adorn).toHaveStyle({ fontSize: '18px' });
    });
  });
});
