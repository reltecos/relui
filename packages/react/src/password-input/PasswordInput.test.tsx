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
import { PasswordInput } from './PasswordInput';

/**
 * Helper — PasswordInput'un input'u type=password olduğu için
 * getByRole('textbox') çalışmaz. aria-label ile buluruz.
 */
function renderPw(props: Record<string, unknown> = {}) {
  const defaultProps = { 'aria-label': 'Şifre', ...props };
  return render(<PasswordInput {...defaultProps} />);
}

function getInput() {
  return screen.getByLabelText('Şifre');
}

function getToggle() {
  return screen.getByRole('button', { name: /şifreyi/i });
}

describe('PasswordInput', () => {
  // ── Render ──────────────────────────────────────────────────────

  it('render edilir / renders', () => {
    renderPw();
    expect(getInput()).toBeInTheDocument();
  });

  it('varsayılan type password / default type is password', () => {
    renderPw();
    expect(getInput()).toHaveAttribute('type', 'password');
  });

  it('placeholder görünür / placeholder is shown', () => {
    renderPw({ placeholder: 'Şifrenizi girin' });
    expect(screen.getByPlaceholderText('Şifrenizi girin')).toBeInTheDocument();
  });

  it('value kontrollü çalışır / controlled value works', () => {
    renderPw({ value: 'secret123', onChange: () => {} });
    expect(getInput()).toHaveAttribute('value', 'secret123');
  });

  it('ref forward edilir / ref is forwarded', () => {
    const ref = vi.fn();
    render(<PasswordInput ref={ref} aria-label="Şifre" />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Toggle Visibility ───────────────────────────────────────────

  it('toggle buton görünür / toggle button is visible', () => {
    renderPw();
    expect(getToggle()).toBeInTheDocument();
  });

  it('toggle tıklanınca type text olur / click toggle changes type to text', () => {
    renderPw();
    const input = getInput();
    const button = getToggle();

    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(button);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('ikinci toggle tıklamasıyla password geri döner / second click reverts to password', () => {
    renderPw();
    const input = getInput();
    const button = getToggle();

    fireEvent.click(button);
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: /şifreyi/i }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('defaultVisible true ile başlangıçta text / defaultVisible true starts as text', () => {
    renderPw({ defaultVisible: true });
    expect(getInput()).toHaveAttribute('type', 'text');
  });

  // ── Controlled Visibility ───────────────────────────────────────

  it('controlled visible prop çalışır / controlled visible prop works', () => {
    const { rerender } = render(
      <PasswordInput visible={false} onVisibleChange={() => {}} aria-label="Şifre" />,
    );
    expect(getInput()).toHaveAttribute('type', 'password');

    rerender(
      <PasswordInput visible={true} onVisibleChange={() => {}} aria-label="Şifre" />,
    );
    expect(getInput()).toHaveAttribute('type', 'text');
  });

  it('onVisibleChange callback çağrılır / onVisibleChange callback is called', () => {
    const onVisibleChange = vi.fn();
    render(
      <PasswordInput visible={false} onVisibleChange={onVisibleChange} aria-label="Şifre" />,
    );
    fireEvent.click(getToggle());
    expect(onVisibleChange).toHaveBeenCalledWith(true);
  });

  // ── Icons ───────────────────────────────────────────────────────

  it('varsayılan ikon SVG render eder / default icons render SVG', () => {
    renderPw();
    const button = getToggle();
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('custom showIcon/hideIcon kullanılabilir / custom showIcon/hideIcon works', () => {
    render(
      <PasswordInput
        aria-label="Şifre"
        showIcon={<span data-testid="custom-show">S</span>}
        hideIcon={<span data-testid="custom-hide">H</span>}
      />,
    );
    const button = getToggle();

    // Başlangıçta password gizli → showIcon gösterilir
    expect(button.querySelector('[data-testid="custom-show"]')).toBeInTheDocument();
    expect(button.querySelector('[data-testid="custom-hide"]')).not.toBeInTheDocument();

    // Toggle → hideIcon gösterilir
    fireEvent.click(button);
    const updatedButton = screen.getByRole('button', { name: /şifreyi/i });
    expect(updatedButton.querySelector('[data-testid="custom-hide"]')).toBeInTheDocument();
    expect(updatedButton.querySelector('[data-testid="custom-show"]')).not.toBeInTheDocument();
  });

  // ── Disabled ────────────────────────────────────────────────────

  it('disabled durumda input disabled olur / input is disabled when disabled', () => {
    renderPw({ disabled: true });
    expect(getInput()).toHaveAttribute('data-disabled', '');
  });

  it('disabled durumda toggle buton tıklanamaz / toggle button is not clickable when disabled', () => {
    renderPw({ disabled: true });
    const button = getToggle();
    expect(button).toHaveAttribute('data-disabled', '');
    expect(button).toHaveAttribute('tabIndex', '-1');
  });

  // ── ReadOnly ────────────────────────────────────────────────────

  it('readOnly durumda readonly olur / readOnly state works', () => {
    renderPw({ readOnly: true });
    expect(getInput()).toHaveAttribute('data-readonly', '');
  });

  // ── Invalid ─────────────────────────────────────────────────────

  it('invalid durumda invalid olur / invalid state works', () => {
    renderPw({ invalid: true });
    expect(getInput()).toHaveAttribute('data-invalid', '');
  });

  // ── ARIA ────────────────────────────────────────────────────────

  it('toggle buton aria-label gizle/göster / toggle button has correct aria-label', () => {
    renderPw();
    const button = getToggle();

    // Başlangıçta gizli → "Şifreyi göster"
    expect(button).toHaveAttribute('aria-label', 'Şifreyi göster');

    fireEvent.click(button);
    // Görünür → "Şifreyi gizle"
    const updated = screen.getByRole('button', { name: /şifreyi/i });
    expect(updated).toHaveAttribute('aria-label', 'Şifreyi gizle');
  });

  it('aria-label geçirilir / aria-label is passed', () => {
    render(<PasswordInput aria-label="Şifre alanı" />);
    expect(screen.getByLabelText('Şifre alanı')).toBeInTheDocument();
  });

  it('aria-describedby geçirilir / aria-describedby is passed', () => {
    renderPw({ 'aria-describedby': 'hint' });
    expect(getInput()).toHaveAttribute('aria-describedby', 'hint');
  });

  // ── Autocomplete ────────────────────────────────────────────────

  it('varsayılan autocomplete current-password / default autocomplete is current-password', () => {
    renderPw();
    expect(getInput()).toHaveAttribute('autocomplete', 'current-password');
  });

  it('custom autocomplete geçirilir / custom autocomplete is passed', () => {
    renderPw({ autoComplete: 'new-password' });
    expect(getInput()).toHaveAttribute('autocomplete', 'new-password');
  });

  // ── Name / ID ───────────────────────────────────────────────────

  it('name geçirilir / name is passed', () => {
    renderPw({ name: 'password' });
    expect(getInput()).toHaveAttribute('name', 'password');
  });

  it('id geçirilir / id is passed', () => {
    renderPw({ id: 'pw-field' });
    expect(getInput()).toHaveAttribute('id', 'pw-field');
  });

  // ── Variants & Sizes ───────────────────────────────────────────

  it('variant outline default uygulanır / variant outline default is applied', () => {
    renderPw();
    const input = getInput();
    expect(input.className).toBeTruthy();
  });

  it('farklı size render edilir / different size renders', () => {
    const { unmount } = render(<PasswordInput size="sm" aria-label="Küçük" />);
    const i1ClassName = screen.getByLabelText('Küçük').className;
    unmount();

    render(<PasswordInput size="xl" aria-label="Büyük" />);
    const i2ClassName = screen.getByLabelText('Büyük').className;

    expect(i1ClassName).not.toBe(i2ClassName);
  });

  it('variant filled render edilir / variant filled renders', () => {
    renderPw({ variant: 'filled' });
    expect(getInput()).toBeInTheDocument();
  });

  it('variant flushed render edilir / variant flushed renders', () => {
    renderPw({ variant: 'flushed' });
    expect(getInput()).toBeInTheDocument();
  });

  // ── onChange ─────────────────────────────────────────────────────

  it('onChange callback çağrılır / onChange callback is called', () => {
    const onChange = vi.fn();
    renderPw({ onChange });
    fireEvent.change(getInput(), { target: { value: 'abc' } });
    expect(onChange).toHaveBeenCalled();
  });

  // ── classNames & styles ───────────────────────────────────────

  describe('classNames & styles', () => {
    it('classNames.root uygulanir', () => {
      const { container } = renderPw({ classNames: { root: 'slot-root' } });
      expect(container.firstElementChild).toHaveClass('slot-root');
    });

    it('styles.root uygulanir', () => {
      const { container } = renderPw({ styles: { root: { padding: '10px' } } });
      expect(container.firstElementChild).toHaveStyle({ padding: '10px' });
    });

    it('classNames.input uygulanir', () => {
      renderPw({ classNames: { input: 'my-input' } });
      expect(getInput()).toHaveClass('my-input');
    });

    it('className + classNames.input birlestirilir', () => {
      renderPw({ className: 'legacy', classNames: { input: 'slot-input' } });
      const el = getInput();
      expect(el).toHaveClass('legacy');
      expect(el).toHaveClass('slot-input');
    });

    it('classNames.toggleButton uygulanir', () => {
      renderPw({ classNames: { toggleButton: 'my-toggle' } });
      expect(getToggle()).toHaveClass('my-toggle');
    });

    it('styles.toggleButton uygulanir', () => {
      renderPw({ styles: { toggleButton: { opacity: 0.5 } } });
      expect(getToggle()).toHaveStyle({ opacity: '0.5' });
    });
  });
});

// ── Compound API ──

describe('PasswordInput (Compound)', () => {
  it('compound: ToggleButton render edilir', () => {
    render(
      <PasswordInput aria-label="Sifre" placeholder="Sifre">
        <PasswordInput.ToggleButton />
      </PasswordInput>,
    );
    expect(screen.getByTestId('passwordinput-toggle')).toBeInTheDocument();
  });

  it('compound: toggle tiklaninca type degisir', () => {
    render(
      <PasswordInput aria-label="Sifre" placeholder="Sifre">
        <PasswordInput.ToggleButton />
      </PasswordInput>,
    );
    const input = screen.getByLabelText('Sifre');
    const toggle = screen.getByTestId('passwordinput-toggle');

    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('compound: root data-testid eklenir', () => {
    render(
      <PasswordInput aria-label="Sifre">
        <PasswordInput.ToggleButton />
      </PasswordInput>,
    );
    expect(screen.getByTestId('passwordinput-root')).toBeInTheDocument();
  });

  it('compound: custom ikonlar kullanilabilir', () => {
    render(
      <PasswordInput aria-label="Sifre">
        <PasswordInput.ToggleButton
          showIcon={<span data-testid="cmp-show">S</span>}
          hideIcon={<span data-testid="cmp-hide">H</span>}
        />
      </PasswordInput>,
    );
    const toggle = screen.getByTestId('passwordinput-toggle');
    expect(toggle.querySelector('[data-testid="cmp-show"]')).toBeInTheDocument();
  });

  it('compound: context disinda kullanim hata firlatir', () => {
    expect(() => {
      render(<PasswordInput.ToggleButton />);
    }).toThrow('PasswordInput compound sub-components must be used within <PasswordInput>.');
  });
});
