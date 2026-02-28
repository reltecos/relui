/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { FormField } from './FormField';
import { useFormFieldContext } from './FormFieldContext';

// Test helper — context değerlerini okuyan bileşen
function ContextReader() {
  const ctx = useFormFieldContext();
  if (!ctx) return <div data-testid="no-context" />;
  return (
    <div
      data-testid="context"
      data-input-id={ctx.inputId}
      data-label-id={ctx.labelId}
      data-required={String(ctx.required)}
      data-disabled={String(ctx.disabled)}
      data-invalid={String(ctx.invalid)}
      data-size={ctx.size}
    />
  );
}

describe('FormField', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    const { container } = render(
      <FormField label="E-posta">
        <input />
      </FormField>,
    );

    expect(container.querySelector('[role="group"]')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Label
  // ──────────────────────────────────────────

  it('label render edilir', () => {
    render(
      <FormField label="E-posta">
        <input />
      </FormField>,
    );

    expect(screen.getByText('E-posta')).toBeInTheDocument();
  });

  it('label yoksa render edilmez', () => {
    const { container } = render(
      <FormField>
        <input />
      </FormField>,
    );

    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('required label * göstergesi içerir', () => {
    render(
      <FormField label="E-posta" required>
        <input />
      </FormField>,
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Helper text
  // ──────────────────────────────────────────

  it('helperText render edilir', () => {
    render(
      <FormField label="E-posta" helperText="İş e-postanızı girin">
        <input />
      </FormField>,
    );

    expect(screen.getByText('İş e-postanızı girin')).toBeInTheDocument();
  });

  it('helperText yoksa render edilmez', () => {
    render(
      <FormField label="E-posta">
        <input />
      </FormField>,
    );

    expect(screen.queryByText('İş e-postanızı girin')).not.toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Error message
  // ──────────────────────────────────────────

  it('errorMessage render edilir', () => {
    render(
      <FormField label="E-posta" errorMessage="Geçersiz e-posta">
        <input />
      </FormField>,
    );

    expect(screen.getByText('Geçersiz e-posta')).toBeInTheDocument();
  });

  it('errorMessage role=alert içerir', () => {
    render(
      <FormField label="E-posta" errorMessage="Hata">
        <input />
      </FormField>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('errorMessage varken helperText gizlenir', () => {
    render(
      <FormField label="E-posta" helperText="Yardımcı" errorMessage="Hata">
        <input />
      </FormField>,
    );

    expect(screen.queryByText('Yardımcı')).not.toBeInTheDocument();
    expect(screen.getByText('Hata')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Data attributes
  // ──────────────────────────────────────────

  it('disabled data-disabled set eder', () => {
    const { container } = render(
      <FormField label="E-posta" disabled>
        <input />
      </FormField>,
    );

    expect(container.querySelector('[role="group"]')).toHaveAttribute('data-disabled', '');
  });

  it('invalid data-invalid set eder', () => {
    const { container } = render(
      <FormField label="E-posta" invalid>
        <input />
      </FormField>,
    );

    expect(container.querySelector('[role="group"]')).toHaveAttribute('data-invalid', '');
  });

  it('errorMessage varsa otomatik data-invalid set eder', () => {
    const { container } = render(
      <FormField label="E-posta" errorMessage="Hata">
        <input />
      </FormField>,
    );

    expect(container.querySelector('[role="group"]')).toHaveAttribute('data-invalid', '');
  });

  it('required data-required set eder', () => {
    const { container } = render(
      <FormField label="E-posta" required>
        <input />
      </FormField>,
    );

    expect(container.querySelector('[role="group"]')).toHaveAttribute('data-required', '');
  });

  // ──────────────────────────────────────────
  // Context
  // ──────────────────────────────────────────

  it('context doğru değerleri sağlar', () => {
    render(
      <FormField id="email" label="E-posta" required disabled size="lg">
        <ContextReader />
      </FormField>,
    );

    const ctx = screen.getByTestId('context');
    expect(ctx).toHaveAttribute('data-input-id', 'email');
    expect(ctx).toHaveAttribute('data-label-id', 'email-label');
    expect(ctx).toHaveAttribute('data-required', 'true');
    expect(ctx).toHaveAttribute('data-disabled', 'true');
    expect(ctx).toHaveAttribute('data-size', 'lg');
  });

  it('FormField dışında context null döner', () => {
    render(<ContextReader />);

    expect(screen.getByTestId('no-context')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('className doğru iletilir', () => {
    const { container } = render(
      <FormField className="custom">
        <input />
      </FormField>,
    );

    expect(container.firstChild).toHaveClass('custom');
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    const { container } = render(
      <FormField classNames={{ root: 'slot-root' }}>
        <input />
      </FormField>,
    );

    expect(container.querySelector('[role="group"]')).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = render(
      <FormField styles={{ root: { padding: '10px' } }}>
        <input />
      </FormField>,
    );

    expect(container.querySelector('[role="group"]')).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = render(
      <FormField className="legacy" classNames={{ root: 'slot-root' }}>
        <input />
      </FormField>,
    );
    const el = container.querySelector('[role="group"]');

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('classNames.helperText uygulanir', () => {
    const { container } = render(
      <FormField helperText="Yardimci" classNames={{ helperText: 'my-helper' }}>
        <input />
      </FormField>,
    );

    expect(container.querySelector('p')).toHaveClass('my-helper');
  });

  it('styles.helperText uygulanir', () => {
    const { container } = render(
      <FormField helperText="Yardimci" styles={{ helperText: { fontSize: '14px' } }}>
        <input />
      </FormField>,
    );

    expect(container.querySelector('p')).toHaveStyle({ fontSize: '14px' });
  });

  it('classNames.errorMessage uygulanir', () => {
    render(
      <FormField errorMessage="Hata" classNames={{ errorMessage: 'my-error' }}>
        <input />
      </FormField>,
    );

    expect(screen.getByRole('alert')).toHaveClass('my-error');
  });

  it('styles.errorMessage uygulanir', () => {
    render(
      <FormField errorMessage="Hata" styles={{ errorMessage: { fontSize: '12px' } }}>
        <input />
      </FormField>,
    );

    expect(screen.getByRole('alert')).toHaveStyle({ fontSize: '12px' });
  });
});
