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
import { Input } from './Input';

describe('Input', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(<Input aria-label="Test" />);
    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('placeholder render eder / renders placeholder', () => {
    render(<Input placeholder="Metin girin" />);

    expect(screen.getByPlaceholderText('Metin girin')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Native input attributes
  // ──────────────────────────────────────────

  it('type=text varsayılan / type=text is default', () => {
    render(<Input aria-label="Test" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('type=email doğru set edilir / type=email is set correctly', () => {
    render(<Input type="email" aria-label="Email" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('name attribute doğru set edilir / name is set correctly', () => {
    render(<Input name="username" aria-label="Test" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username');
  });

  // ──────────────────────────────────────────
  // Events
  // ──────────────────────────────────────────

  it('onChange çağrılır / onChange is called', () => {
    const handleChange = vi.fn();
    render(<Input aria-label="Test" onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('onFocus çağrılır / onFocus is called', () => {
    const handleFocus = vi.fn();
    render(<Input aria-label="Test" onFocus={handleFocus} />);

    fireEvent.focus(screen.getByRole('textbox'));
    expect(handleFocus).toHaveBeenCalledOnce();
  });

  it('onBlur çağrılır / onBlur is called', () => {
    const handleBlur = vi.fn();
    render(<Input aria-label="Test" onBlur={handleBlur} />);

    fireEvent.focus(screen.getByRole('textbox'));
    fireEvent.blur(screen.getByRole('textbox'));
    expect(handleBlur).toHaveBeenCalledOnce();
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda disabled attribute set edilir', () => {
    render(<Input aria-label="Test" disabled />);
    const input = screen.getByRole('textbox');

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('data-disabled', '');
  });

  // ──────────────────────────────────────────
  // ReadOnly
  // ──────────────────────────────────────────

  it('readOnly durumda readOnly attribute set edilir', () => {
    render(<Input aria-label="Test" readOnly value="test" />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('aria-readonly', 'true');
    expect(input).toHaveAttribute('data-readonly', '');
  });

  // ──────────────────────────────────────────
  // Invalid
  // ──────────────────────────────────────────

  it('invalid durumda aria-invalid set edilir', () => {
    render(<Input aria-label="Test" invalid />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('data-invalid', '');
  });

  // ──────────────────────────────────────────
  // Required
  // ──────────────────────────────────────────

  it('required durumda required attribute set edilir', () => {
    render(<Input aria-label="Test" required />);
    const input = screen.getByRole('textbox');

    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  // ──────────────────────────────────────────
  // Elements (left/right)
  // ──────────────────────────────────────────

  it('leftElement render eder / renders leftElement', () => {
    render(
      <Input
        aria-label="Test"
        leftElement={<span data-testid="left-el">L</span>}
      />,
    );

    expect(screen.getByTestId('left-el')).toBeInTheDocument();
  });

  it('rightElement render eder / renders rightElement', () => {
    render(
      <Input
        aria-label="Test"
        rightElement={<span data-testid="right-el">R</span>}
      />,
    );

    expect(screen.getByTestId('right-el')).toBeInTheDocument();
  });

  it('element olmadan wrapper render edilmez / no wrapper without elements', () => {
    const { container } = render(<Input aria-label="Test" />);

    // Input doğrudan render edilir, wrapper div yok
    expect(container.firstChild?.nodeName).toBe('INPUT');
  });

  it('element varken wrapper render edilir / wrapper rendered with elements', () => {
    const { container } = render(
      <Input aria-label="Test" leftElement={<span>L</span>} />,
    );

    // Wrapper div render edilir
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('element aria-hidden ile gizlenir / elements are aria-hidden', () => {
    render(
      <Input
        aria-label="Test"
        leftElement={<span>L</span>}
        rightElement={<span>R</span>}
      />,
    );

    const hiddenElements = document.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenElements.length).toBe(2);
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id doğru iletilir / id is forwarded correctly', () => {
    render(<Input aria-label="Test" id="my-input" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-input');
  });

  it('className doğru iletilir / className is forwarded correctly', () => {
    render(<Input aria-label="Test" className="custom-class" />);
    const input = screen.getByRole('textbox');

    expect(input.className).toContain('custom-class');
  });

  it('value controlled mode / controlled mode works', () => {
    render(<Input aria-label="Test" value="kontrollü" onChange={() => {}} />);

    expect(screen.getByRole('textbox')).toHaveValue('kontrollü');
  });

  it('aria-label doğru set edilir / aria-label is set correctly', () => {
    render(<Input aria-label="E-posta" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'E-posta');
  });

  it('aria-describedby doğru set edilir / aria-describedby is set correctly', () => {
    render(<Input aria-label="Test" aria-describedby="help-text" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'help-text');
  });

  // ──────────────────────────────────────────
  // data-state
  // ──────────────────────────────────────────

  it('data-state başlangıçta idle / data-state is idle initially', () => {
    render(<Input aria-label="Test" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('data-state', 'idle');
  });

  it('focus sonrası data-state focused olur / data-state becomes focused', () => {
    render(<Input aria-label="Test" />);
    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    expect(input).toHaveAttribute('data-state', 'focused');
  });

  it('blur sonrası data-state idle olur / data-state becomes idle after blur', () => {
    render(<Input aria-label="Test" />);
    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(input).toHaveAttribute('data-state', 'idle');
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    render(<Input aria-label="Test" classNames={{ root: 'slot-root' }} />);

    expect(screen.getByRole('textbox')).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    render(<Input aria-label="Test" styles={{ root: { fontSize: '16px' } }} />);

    expect(screen.getByRole('textbox')).toHaveStyle({ fontSize: '16px' });
  });

  it('className + classNames.root birlestirilir', () => {
    render(
      <Input aria-label="Test" className="legacy" classNames={{ root: 'slot-root' }} />,
    );
    const el = screen.getByRole('textbox');

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('style + styles.root birlestirilir', () => {
    render(
      <Input
        aria-label="Test"
        style={{ margin: '4px' }}
        styles={{ root: { letterSpacing: '2px' } }}
      />,
    );
    const el = screen.getByRole('textbox');

    expect(el).toHaveStyle({ margin: '4px' });
    expect(el).toHaveStyle({ letterSpacing: '2px' });
  });

  it('classNames.wrapper uygulanir', () => {
    const { container } = render(
      <Input
        aria-label="Test"
        leftElement={<span>L</span>}
        classNames={{ wrapper: 'my-wrapper' }}
      />,
    );

    expect(container.firstChild).toHaveClass('my-wrapper');
  });

  it('classNames.leftElement ve classNames.rightElement uygulanir', () => {
    render(
      <Input
        aria-label="Test"
        leftElement={<span>L</span>}
        rightElement={<span>R</span>}
        classNames={{ leftElement: 'my-left', rightElement: 'my-right' }}
      />,
    );

    const hiddenSpans = document.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenSpans[0]).toHaveClass('my-left');
    expect(hiddenSpans[1]).toHaveClass('my-right');
  });
});
