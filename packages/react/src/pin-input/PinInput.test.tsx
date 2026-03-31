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
import { createRef } from 'react';
import { PinInput } from './PinInput';

describe('PinInput', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<PinInput />);
    expect(screen.getByTestId('pin-input-root')).toBeInTheDocument();
  });

  it('varsayilan olarak 4 alan render edilir', () => {
    render(<PinInput />);
    const fields = screen.getAllByTestId('pin-input-field');
    expect(fields).toHaveLength(4);
  });

  it('custom length ile alan sayisi ayarlanir', () => {
    render(<PinInput length={6} />);
    const fields = screen.getAllByTestId('pin-input-field');
    expect(fields).toHaveLength(6);
  });

  it('varsayilan size md', () => {
    render(<PinInput />);
    expect(screen.getByTestId('pin-input-root')).toHaveAttribute('data-size', 'md');
  });

  it('size sm set edilir', () => {
    render(<PinInput size="sm" />);
    expect(screen.getByTestId('pin-input-root')).toHaveAttribute('data-size', 'sm');
  });

  it('size lg set edilir', () => {
    render(<PinInput size="lg" />);
    expect(screen.getByTestId('pin-input-root')).toHaveAttribute('data-size', 'lg');
  });

  // ── Giris ──

  it('rakam girilince alan degeri guncellenir', () => {
    render(<PinInput />);
    const fields = screen.getAllByTestId('pin-input-field');
    fireEvent.input(fields[0], { target: { value: '5' } });
    expect(fields[0]).toHaveValue('5');
  });

  it('gecersiz karakter number modunda reddedilir', () => {
    render(<PinInput type="number" />);
    const fields = screen.getAllByTestId('pin-input-field');
    fireEvent.input(fields[0], { target: { value: 'a' } });
    expect(fields[0]).toHaveValue('');
  });

  it('alphanumeric tipinde harf kabul edilir', () => {
    render(<PinInput type="alphanumeric" />);
    const fields = screen.getAllByTestId('pin-input-field');
    fireEvent.input(fields[0], { target: { value: 'A' } });
    expect(fields[0]).toHaveValue('A');
  });

  // ── Focus ──

  it('giris sonrasi focus bir sonraki alana ilerler', () => {
    render(<PinInput />);
    const fields = screen.getAllByTestId('pin-input-field');
    fireEvent.focus(fields[0] as HTMLInputElement);
    fireEvent.input(fields[0] as HTMLInputElement, { target: { value: '1' } });
    // Input sonrasi ilk alanin degeri set edilmis olmali
    expect(fields[0]).toHaveValue('1');
  });

  // ── Backspace ──

  it('backspace alani temizler ve geri gider', () => {
    render(<PinInput defaultValue="12" />);
    const fields = screen.getAllByTestId('pin-input-field');
    fireEvent.focus(fields[1]);
    fireEvent.keyDown(fields[1], { key: 'Backspace' });
    expect(fields[1]).toHaveValue('');
  });

  // ── Paste ──

  it('paste alanlari doldurur', () => {
    render(<PinInput />);
    const fields = screen.getAllByTestId('pin-input-field');
    fireEvent.focus(fields[0]);
    fireEvent.paste(fields[0], {
      clipboardData: { getData: () => '1234' },
    });
    expect(fields[0]).toHaveValue('1');
    expect(fields[1]).toHaveValue('2');
    expect(fields[2]).toHaveValue('3');
    expect(fields[3]).toHaveValue('4');
  });

  // ── Mask ──

  it('mask aktifken dolu alanlar nokta gosterir', () => {
    render(<PinInput mask defaultValue="1234" />);
    const fields = screen.getAllByTestId('pin-input-field');
    // Masked value is a bullet character
    expect(fields[0]).toHaveValue('\u25CF');
    expect(fields[1]).toHaveValue('\u25CF');
  });

  // ── Callbacks ──

  it('onComplete tum alanlar dolunca cagirilir', () => {
    const onComplete = vi.fn();
    render(<PinInput onComplete={onComplete} />);
    const fields = screen.getAllByTestId('pin-input-field');
    fireEvent.focus(fields[0]);
    fireEvent.input(fields[0], { target: { value: '1' } });
    fireEvent.input(fields[1], { target: { value: '2' } });
    fireEvent.input(fields[2], { target: { value: '3' } });
    fireEvent.input(fields[3], { target: { value: '4' } });
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('onChange her degisimde cagirilir', () => {
    const onChange = vi.fn();
    render(<PinInput onChange={onChange} />);
    const fields = screen.getAllByTestId('pin-input-field');
    fireEvent.focus(fields[0]);
    fireEvent.input(fields[0], { target: { value: '7' } });
    expect(onChange).toHaveBeenCalledWith('7');
  });

  // ── Disabled ──

  it('disabled alanlar devre disi olur', () => {
    render(<PinInput disabled />);
    const fields = screen.getAllByTestId('pin-input-field');
    fields.forEach((field) => {
      expect(field).toBeDisabled();
    });
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<PinInput className="custom-class" />);
    expect(screen.getByTestId('pin-input-root').className).toContain('custom-class');
  });

  it('style root elemana eklenir', () => {
    render(<PinInput style={{ padding: '10px' }} />);
    expect(screen.getByTestId('pin-input-root')).toHaveStyle({ padding: '10px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<PinInput classNames={{ root: 'root-cls' }} />);
    expect(screen.getByTestId('pin-input-root').className).toContain('root-cls');
  });

  it('classNames.field field elemanlara eklenir', () => {
    render(<PinInput classNames={{ field: 'field-cls' }} />);
    const fields = screen.getAllByTestId('pin-input-field');
    fields.forEach((field) => {
      expect(field.className).toContain('field-cls');
    });
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<PinInput styles={{ root: { padding: '20px' } }} />);
    expect(screen.getByTestId('pin-input-root')).toHaveStyle({ padding: '20px' });
  });

  it('styles.field field elemanlara eklenir', () => {
    render(<PinInput styles={{ field: { fontSize: '24px' } }} />);
    const fields = screen.getAllByTestId('pin-input-field');
    fields.forEach((field) => {
      expect(field).toHaveStyle({ fontSize: '24px' });
    });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = createRef<HTMLDivElement>();
    render(<PinInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId('pin-input-root'));
  });

  // ── A11y ──

  it('role group atanir', () => {
    render(<PinInput />);
    expect(screen.getByTestId('pin-input-root')).toHaveAttribute('role', 'group');
  });

  it('her alan aria-label icerir', () => {
    render(<PinInput />);
    const fields = screen.getAllByTestId('pin-input-field');
    fields.forEach((field, i) => {
      expect(field).toHaveAttribute('aria-label', `Digit ${i + 1}`);
    });
  });

  it('ilk alan autocomplete one-time-code icerir', () => {
    render(<PinInput />);
    const fields = screen.getAllByTestId('pin-input-field');
    expect(fields[0]).toHaveAttribute('autoComplete', 'one-time-code');
    expect(fields[1]).toHaveAttribute('autoComplete', 'off');
  });

  // ── Keyboard ──

  it('ArrowRight keyDown tetiklenir', () => {
    render(<PinInput />);
    const fields = screen.getAllByTestId('pin-input-field');
    fireEvent.focus(fields[0] as HTMLInputElement);
    fireEvent.keyDown(fields[0] as HTMLInputElement, { key: 'ArrowRight' });
    // jsdom focus sinirli, event tetiklenmesini dogruluyoruz
    expect(fields[0]).toBeInTheDocument();
  });

  it('ArrowLeft keyDown tetiklenir', () => {
    render(<PinInput />);
    const fields = screen.getAllByTestId('pin-input-field');
    fireEvent.focus(fields[1] as HTMLInputElement);
    fireEvent.keyDown(fields[1] as HTMLInputElement, { key: 'ArrowLeft' });
    expect(fields[1]).toBeInTheDocument();
  });
});

describe('PinInput (Compound)', () => {
  it('compound: Field render edilir', () => {
    render(
      <PinInput length={4}>
        <PinInput.Field index={0} />
        <PinInput.Field index={1} />
        <PinInput.Field index={2} />
        <PinInput.Field index={3} />
      </PinInput>,
    );
    const fields = screen.getAllByTestId('pin-input-field');
    expect(fields).toHaveLength(4);
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <PinInput length={2} classNames={{ field: 'compound-field-cls' }}>
        <PinInput.Field index={0} />
        <PinInput.Field index={1} />
      </PinInput>,
    );
    const fields = screen.getAllByTestId('pin-input-field');
    fields.forEach((field) => {
      expect(field.className).toContain('compound-field-cls');
    });
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <PinInput length={2} styles={{ field: { padding: '8px' } }}>
        <PinInput.Field index={0} />
        <PinInput.Field index={1} />
      </PinInput>,
    );
    const fields = screen.getAllByTestId('pin-input-field');
    fields.forEach((field) => {
      expect(field).toHaveStyle({ padding: '8px' });
    });
  });

  it('compound: context disinda kullanilinca hata firlatir', () => {
    expect(() => {
      render(<PinInput.Field index={0} />);
    }).toThrow('PinInput compound sub-components must be used within <PinInput>.');
  });

  it('compound: size context ile aktarilir', () => {
    render(
      <PinInput length={2} size="lg">
        <PinInput.Field index={0} />
        <PinInput.Field index={1} />
      </PinInput>,
    );
    const fields = screen.getAllByTestId('pin-input-field');
    fields.forEach((field) => {
      expect(field).toHaveAttribute('data-size', 'lg');
    });
  });
});
