/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MaskedInput } from './MaskedInput';
import { MASK_PRESETS } from '@relteco/relui-core';

/**
 * Helper — MaskedInput render eder.
 */
function renderMI(props: Record<string, unknown> = {}) {
  const defaultProps = {
    'aria-label': 'Telefon',
    mask: '(###) ### ## ##',
    ...props,
  };
  return render(<MaskedInput {...defaultProps} />);
}

function getInput() {
  return screen.getByLabelText('Telefon');
}

describe('MaskedInput', () => {
  // ── Render ──────────────────────────────────────────────────────

  it('render edilir / renders', () => {
    renderMI();
    expect(getInput()).toBeInTheDocument();
  });

  it('type text / type is text', () => {
    renderMI();
    expect(getInput()).toHaveAttribute('type', 'text');
  });

  it('ref forward edilir / ref is forwarded', () => {
    const ref = vi.fn();
    render(<MaskedInput ref={ref} mask="###" aria-label="Telefon" />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Formatlama ──────────────────────────────────────────────────

  it('baslangic degeri formatli gosterilir / initial value shown formatted', () => {
    renderMI({ value: '5321234567' });
    expect(getInput()).toHaveValue('(532) 123 45 67');
  });

  it('bos deger mask placeholder gosterir / empty value shows mask placeholder', () => {
    renderMI();
    expect(getInput()).toHaveValue('(___) ___ __ __');
  });

  it('kismi deger formatli gosterilir / partial value shown formatted', () => {
    renderMI({ value: '532' });
    expect(getInput()).toHaveValue('(532) ___ __ __');
  });

  it('farkli maskChar kullanilabilir / different maskChar works', () => {
    renderMI({ maskChar: '0' });
    expect(getInput()).toHaveValue('(000) 000 00 00');
  });

  // ── Farkli mask pattern'lari ──────────────────────────────────

  it('tarih mask dogru formatlar / date mask formats correctly', () => {
    render(<MaskedInput mask="##/##/####" value="25122025" aria-label="Tarih" />);
    expect(screen.getByLabelText('Tarih')).toHaveValue('25/12/2025');
  });

  it('kredi karti mask dogru formatlar / credit card mask formats correctly', () => {
    render(
      <MaskedInput mask={MASK_PRESETS.creditCard} value="4111111111111111" aria-label="Kart" />,
    );
    expect(screen.getByLabelText('Kart')).toHaveValue('4111 1111 1111 1111');
  });

  it('IP mask dogru formatlar / IP mask formats correctly', () => {
    render(<MaskedInput mask={MASK_PRESETS.ipv4} value="192168001001" aria-label="IP" />);
    expect(screen.getByLabelText('IP')).toHaveValue('192.168.001.001');
  });

  it('saat mask dogru formatlar / time mask formats correctly', () => {
    render(<MaskedInput mask={MASK_PRESETS.time} value="1430" aria-label="Saat" />);
    expect(screen.getByLabelText('Saat')).toHaveValue('14:30');
  });

  // ── onValueChange ─────────────────────────────────────────────

  it('onValueChange deger degisince cagrilir / called when value changes', () => {
    const onValueChange = vi.fn();
    renderMI({ onValueChange });
    const input = getInput();

    fireEvent.focus(input);
    // Kullanıcı formatli deger girer
    fireEvent.change(input, { target: { value: '(532) 123 45 67' } });

    expect(onValueChange).toHaveBeenCalledWith('5321234567');
  });

  // ── Disabled ────────────────────────────────────────────────────

  it('disabled durumda input disabled olur / input is disabled when disabled', () => {
    renderMI({ disabled: true });
    expect(getInput()).toHaveAttribute('data-disabled', '');
  });

  // ── ReadOnly ────────────────────────────────────────────────────

  it('readOnly durumda readonly olur / readOnly state works', () => {
    renderMI({ readOnly: true });
    expect(getInput()).toHaveAttribute('data-readonly', '');
  });

  // ── Invalid ─────────────────────────────────────────────────────

  it('invalid durumda invalid olur / invalid state works', () => {
    renderMI({ invalid: true });
    expect(getInput()).toHaveAttribute('data-invalid', '');
  });

  // ── ARIA ────────────────────────────────────────────────────────

  it('aria-label gecirilir / aria-label is passed', () => {
    render(<MaskedInput mask="###" aria-label="Numara" />);
    expect(screen.getByLabelText('Numara')).toBeInTheDocument();
  });

  it('aria-describedby gecirilir / aria-describedby is passed', () => {
    renderMI({ 'aria-describedby': 'hint' });
    expect(getInput()).toHaveAttribute('aria-describedby', 'hint');
  });

  // ── Autocomplete ────────────────────────────────────────────────

  it('varsayilan autocomplete off / default autocomplete is off', () => {
    renderMI();
    expect(getInput()).toHaveAttribute('autocomplete', 'off');
  });

  // ── Name / ID ───────────────────────────────────────────────────

  it('name gecirilir / name is passed', () => {
    renderMI({ name: 'phone' });
    expect(getInput()).toHaveAttribute('name', 'phone');
  });

  it('id gecirilir / id is passed', () => {
    renderMI({ id: 'phone-field' });
    expect(getInput()).toHaveAttribute('id', 'phone-field');
  });

  // ── Placeholder ─────────────────────────────────────────────────

  it('varsayilan placeholder mask placeholder / default placeholder is mask placeholder', () => {
    renderMI();
    expect(getInput()).toHaveAttribute('placeholder', '(___) ___ __ __');
  });

  it('custom placeholder kullanilabilir / custom placeholder works', () => {
    renderMI({ placeholder: 'Telefon giriniz' });
    expect(getInput()).toHaveAttribute('placeholder', 'Telefon giriniz');
  });

  // ── Variants & Sizes ───────────────────────────────────────────

  it('farkli size render edilir / different size renders', () => {
    const { unmount } = render(
      <MaskedInput mask="###" size="sm" aria-label="Kucuk" />,
    );
    const smClass = screen.getByLabelText('Kucuk').className;
    unmount();

    render(<MaskedInput mask="###" size="xl" aria-label="Buyuk" />);
    const xlClass = screen.getByLabelText('Buyuk').className;

    expect(smClass).not.toBe(xlClass);
  });

  it('variant filled render edilir / variant filled renders', () => {
    renderMI({ variant: 'filled' });
    expect(getInput()).toBeInTheDocument();
  });

  it('variant flushed render edilir / variant flushed renders', () => {
    renderMI({ variant: 'flushed' });
    expect(getInput()).toBeInTheDocument();
  });

  // ── Gecersiz karakter filtreleme ────────────────────────────────

  it('baslangic degerinde gecersiz karakterler filtrelenir / invalid chars filtered in initial', () => {
    renderMI({ value: '5a3b2c' });
    // mask ### ### ## ## → sadece 532 kalir
    expect(getInput()).toHaveValue('(532) ___ __ __');
  });

  // ── Preset mask ile test ────────────────────────────────────────

  it('MASK_PRESETS.phoneTR preset calisir / phoneTR preset works', () => {
    render(
      <MaskedInput
        mask={MASK_PRESETS.phoneTR}
        value="5321234567"
        aria-label="Tel"
      />,
    );
    expect(screen.getByLabelText('Tel')).toHaveValue('(532) 123 45 67');
  });

  // ── classNames & styles ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    renderMI({ classNames: { root: 'slot-root' } });

    expect(getInput()).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    renderMI({ styles: { root: { padding: '10px' } } });

    expect(getInput()).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    renderMI({ className: 'legacy', classNames: { root: 'slot-root' } });
    const el = getInput();

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('style + styles.root birlestirilir', () => {
    renderMI({ style: { margin: '4px' }, styles: { root: { padding: '10px' } } });
    const el = getInput();

    expect(el).toHaveStyle({ margin: '4px' });
    expect(el).toHaveStyle({ padding: '10px' });
  });
});
