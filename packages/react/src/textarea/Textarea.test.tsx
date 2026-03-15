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
import { Textarea } from './Textarea';

describe('Textarea', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(<Textarea aria-label="Test" />);
    const textarea = screen.getByRole('textbox');

    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('placeholder render eder / renders placeholder', () => {
    render(<Textarea placeholder="Metin girin" />);

    expect(screen.getByPlaceholderText('Metin girin')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Native textarea attributes
  // ──────────────────────────────────────────

  it('varsayılan rows 3 / default rows is 3', () => {
    render(<Textarea aria-label="Test" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3');
  });

  it('rows doğru set edilir / rows is set correctly', () => {
    render(<Textarea aria-label="Test" rows={5} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('name attribute doğru set edilir / name is set correctly', () => {
    render(<Textarea name="description" aria-label="Test" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'description');
  });

  // ──────────────────────────────────────────
  // Events
  // ──────────────────────────────────────────

  it('onChange çağrılır / onChange is called', () => {
    const handleChange = vi.fn();
    render(<Textarea aria-label="Test" onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('onFocus çağrılır / onFocus is called', () => {
    const handleFocus = vi.fn();
    render(<Textarea aria-label="Test" onFocus={handleFocus} />);

    fireEvent.focus(screen.getByRole('textbox'));
    expect(handleFocus).toHaveBeenCalledOnce();
  });

  it('onBlur çağrılır / onBlur is called', () => {
    const handleBlur = vi.fn();
    render(<Textarea aria-label="Test" onBlur={handleBlur} />);

    fireEvent.focus(screen.getByRole('textbox'));
    fireEvent.blur(screen.getByRole('textbox'));
    expect(handleBlur).toHaveBeenCalledOnce();
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda disabled attribute set edilir', () => {
    render(<Textarea aria-label="Test" disabled />);
    const textarea = screen.getByRole('textbox');

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute('data-disabled', '');
  });

  // ──────────────────────────────────────────
  // ReadOnly
  // ──────────────────────────────────────────

  it('readOnly durumda readOnly attribute set edilir', () => {
    render(<Textarea aria-label="Test" readOnly value="test" />);
    const textarea = screen.getByRole('textbox');

    expect(textarea).toHaveAttribute('readonly');
    expect(textarea).toHaveAttribute('aria-readonly', 'true');
    expect(textarea).toHaveAttribute('data-readonly', '');
  });

  // ──────────────────────────────────────────
  // Invalid
  // ──────────────────────────────────────────

  it('invalid durumda aria-invalid set edilir', () => {
    render(<Textarea aria-label="Test" invalid />);
    const textarea = screen.getByRole('textbox');

    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('data-invalid', '');
  });

  // ──────────────────────────────────────────
  // Required
  // ──────────────────────────────────────────

  it('required durumda required attribute set edilir', () => {
    render(<Textarea aria-label="Test" required />);
    const textarea = screen.getByRole('textbox');

    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute('aria-required', 'true');
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id doğru iletilir / id is forwarded correctly', () => {
    render(<Textarea aria-label="Test" id="my-textarea" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-textarea');
  });

  it('className doğru iletilir / className is forwarded correctly', () => {
    render(<Textarea aria-label="Test" className="custom-class" />);
    const textarea = screen.getByRole('textbox');

    expect(textarea.className).toContain('custom-class');
  });

  it('value controlled mode / controlled mode works', () => {
    render(<Textarea aria-label="Test" value="kontrollü" onChange={() => {}} />);

    expect(screen.getByRole('textbox')).toHaveValue('kontrollü');
  });

  it('aria-label doğru set edilir / aria-label is set correctly', () => {
    render(<Textarea aria-label="Açıklama" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Açıklama');
  });

  it('aria-describedby doğru set edilir / aria-describedby is set correctly', () => {
    render(<Textarea aria-label="Test" aria-describedby="help-text" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'help-text');
  });

  // ──────────────────────────────────────────
  // data-state
  // ──────────────────────────────────────────

  it('data-state başlangıçta idle / data-state is idle initially', () => {
    render(<Textarea aria-label="Test" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('data-state', 'idle');
  });

  it('focus sonrası data-state focused olur / data-state becomes focused', () => {
    render(<Textarea aria-label="Test" />);
    const textarea = screen.getByRole('textbox');

    fireEvent.focus(textarea);
    expect(textarea).toHaveAttribute('data-state', 'focused');
  });

  it('blur sonrası data-state idle olur / data-state becomes idle after blur', () => {
    render(<Textarea aria-label="Test" />);
    const textarea = screen.getByRole('textbox');

    fireEvent.focus(textarea);
    fireEvent.blur(textarea);
    expect(textarea).toHaveAttribute('data-state', 'idle');
  });

  // ──────────────────────────────────────────
  // autoResize
  // ──────────────────────────────────────────

  it('autoResize aktifken overflow hidden uygulanır', () => {
    render(<Textarea aria-label="Test" autoResize />);
    const textarea = screen.getByRole('textbox');

    expect(textarea.style.overflow).toBe('hidden');
  });

  it('autoResize kapalıyken overflow set edilmez', () => {
    render(<Textarea aria-label="Test" />);
    const textarea = screen.getByRole('textbox');

    expect(textarea.style.overflow).toBe('');
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    render(<Textarea aria-label="Test" classNames={{ root: 'slot-root' }} />);

    expect(screen.getByRole('textbox')).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    render(<Textarea aria-label="Test" styles={{ root: { padding: '10px' } }} />);

    expect(screen.getByRole('textbox')).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    render(
      <Textarea aria-label="Test" className="legacy" classNames={{ root: 'slot-root' }} />,
    );
    const el = screen.getByRole('textbox');

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('style + styles.root birlestirilir', () => {
    render(
      <Textarea
        aria-label="Test"
        style={{ margin: '4px' }}
        styles={{ root: { padding: '10px' } }}
      />,
    );
    const el = screen.getByRole('textbox');

    expect(el).toHaveStyle({ margin: '4px' });
    expect(el).toHaveStyle({ padding: '10px' });
  });
});

// ── Compound API ──

describe('Textarea (Compound)', () => {
  it('compound: Label render edilir', () => {
    render(
      <Textarea aria-label="Test" placeholder="Yaz...">
        <Textarea.Label>Aciklama</Textarea.Label>
      </Textarea>,
    );
    expect(screen.getByTestId('textarea-label')).toBeInTheDocument();
    expect(screen.getByTestId('textarea-label')).toHaveTextContent('Aciklama');
  });

  it('compound: Counter render edilir', () => {
    render(
      <Textarea aria-label="Test" placeholder="Yaz...">
        <Textarea.Counter count={42} max={500} />
      </Textarea>,
    );
    expect(screen.getByTestId('textarea-counter')).toBeInTheDocument();
    expect(screen.getByTestId('textarea-counter')).toHaveTextContent('42/500');
  });

  it('compound: Counter max olmadan render edilir', () => {
    render(
      <Textarea aria-label="Test">
        <Textarea.Counter count={10} />
      </Textarea>,
    );
    expect(screen.getByTestId('textarea-counter')).toHaveTextContent('10');
  });

  it('compound: Label ve Counter birlikte render edilir', () => {
    render(
      <Textarea aria-label="Test">
        <Textarea.Label>Aciklama</Textarea.Label>
        <Textarea.Counter count={0} max={200} />
      </Textarea>,
    );
    expect(screen.getByTestId('textarea-label')).toBeInTheDocument();
    expect(screen.getByTestId('textarea-counter')).toBeInTheDocument();
  });

  it('compound: context disinda kullanim hata firlatir', () => {
    expect(() => {
      render(<Textarea.Label>Test</Textarea.Label>);
    }).toThrow('Textarea compound sub-components must be used within <Textarea>.');
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Textarea aria-label="Test" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
