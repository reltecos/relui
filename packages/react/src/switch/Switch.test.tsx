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
import { Switch } from './Switch';

describe('Switch', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(<Switch aria-label="Test" />);
    const sw = screen.getByRole('switch');

    expect(sw).toBeInTheDocument();
  });

  it('label ile render eder / renders with label', () => {
    render(<Switch>Bildirimleri aç</Switch>);

    expect(screen.getByText('Bildirimleri aç')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Checked state
  // ──────────────────────────────────────────

  it('varsayılan unchecked / default unchecked', () => {
    render(<Switch aria-label="Test" />);
    const sw = screen.getByRole('switch');

    expect(sw).toHaveAttribute('aria-checked', 'false');
    expect(sw).toHaveAttribute('data-state', 'unchecked');
  });

  it('checked durumda doğru attribute set edilir', () => {
    render(<Switch aria-label="Test" checked />);
    const sw = screen.getByRole('switch');

    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(sw).toHaveAttribute('data-state', 'checked');
  });

  // ──────────────────────────────────────────
  // Toggle — uncontrolled
  // ──────────────────────────────────────────

  it('click ile toggle eder (uncontrolled)', () => {
    render(<Switch aria-label="Test" />);
    const sw = screen.getByRole('switch');

    expect(sw).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  it('Space tuşu ile toggle eder', () => {
    render(<Switch aria-label="Test" />);
    const sw = screen.getByRole('switch');

    fireEvent.keyDown(sw, { key: ' ' });
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  // ──────────────────────────────────────────
  // Toggle — controlled
  // ──────────────────────────────────────────

  it('controlled mode — onCheckedChange çağrılır', () => {
    const handleChange = vi.fn();
    render(<Switch aria-label="Test" checked={false} onCheckedChange={handleChange} />);
    const sw = screen.getByRole('switch');

    fireEvent.click(sw);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('controlled mode — checked true → false toggle', () => {
    const handleChange = vi.fn();
    render(<Switch aria-label="Test" checked onCheckedChange={handleChange} />);
    const sw = screen.getByRole('switch');

    fireEvent.click(sw);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda toggle yoksayılır', () => {
    render(<Switch aria-label="Test" disabled />);
    const sw = screen.getByRole('switch');

    expect(sw).toHaveAttribute('aria-disabled', 'true');
    expect(sw).toHaveAttribute('data-disabled', '');
    fireEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  // ──────────────────────────────────────────
  // ReadOnly
  // ──────────────────────────────────────────

  it('readOnly durumda toggle yoksayılır', () => {
    render(<Switch aria-label="Test" readOnly checked />);
    const sw = screen.getByRole('switch');

    expect(sw).toHaveAttribute('aria-readonly', 'true');
    expect(sw).toHaveAttribute('data-readonly', '');
    fireEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  // ──────────────────────────────────────────
  // Invalid
  // ──────────────────────────────────────────

  it('invalid durumda doğru attribute set edilir', () => {
    render(<Switch aria-label="Test" invalid />);
    const sw = screen.getByRole('switch');

    expect(sw).toHaveAttribute('aria-invalid', 'true');
    expect(sw).toHaveAttribute('data-invalid', '');
  });

  // ──────────────────────────────────────────
  // Required
  // ──────────────────────────────────────────

  it('required durumda doğru attribute set edilir', () => {
    render(<Switch aria-label="Test" required />);
    const sw = screen.getByRole('switch');

    expect(sw).toHaveAttribute('aria-required', 'true');
  });

  // ──────────────────────────────────────────
  // ARIA
  // ──────────────────────────────────────────

  it('role=switch set edilir', () => {
    render(<Switch aria-label="Test" />);

    expect(screen.getByRole('switch')).toHaveAttribute('role', 'switch');
  });

  it('tabIndex=0 set edilir', () => {
    render(<Switch aria-label="Test" />);

    expect(screen.getByRole('switch')).toHaveAttribute('tabindex', '0');
  });

  it('aria-label doğru set edilir', () => {
    render(<Switch aria-label="WiFi" />);

    expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'WiFi');
  });

  it('aria-describedby doğru set edilir', () => {
    render(<Switch aria-label="Test" aria-describedby="help" />);

    expect(screen.getByRole('switch')).toHaveAttribute('aria-describedby', 'help');
  });

  // ──────────────────────────────────────────
  // Hidden input (form entegrasyonu)
  // ──────────────────────────────────────────

  it('name prop ile hidden input render eder', () => {
    render(<Switch aria-label="Test" name="darkMode" />);

    const hidden = document.querySelector('input[type="checkbox"][name="darkMode"]');
    expect(hidden).toBeInTheDocument();
    expect(hidden).toHaveAttribute('aria-hidden', 'true');
  });

  it('name prop yoksa hidden input render etmez', () => {
    render(<Switch aria-label="Test" />);

    const hidden = document.querySelector('input[type="checkbox"]');
    expect(hidden).not.toBeInTheDocument();
  });

  it('hidden input checked durumunu yansıtır', () => {
    render(<Switch aria-label="Test" name="darkMode" checked />);

    const hidden = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(hidden.checked).toBe(true);
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id doğru iletilir / id is forwarded correctly', () => {
    const { container } = render(<Switch aria-label="Test" id="my-switch" />);

    expect(container.querySelector('#my-switch')).toBeInTheDocument();
  });

  it('className doğru iletilir / className is forwarded correctly', () => {
    render(<Switch className="custom-class">Label</Switch>);

    const label = screen.getByText('Label').closest('label');
    expect(label?.className).toContain('custom-class');
  });

  // ──────────────────────────────────────────
  // Knob render
  // ──────────────────────────────────────────

  it('knob (span) her zaman render edilir', () => {
    render(<Switch aria-label="Test" />);
    const sw = screen.getByRole('switch');

    expect(sw.querySelector('span')).toBeInTheDocument();
  });
});

describe('Switch — classNames & styles', () => {
  // ── classNames & styles ──────────────────────────────────

  it('classNames.root uygulanir', () => {
    render(<Switch classNames={{ root: 'slot-root' }}>Label</Switch>);

    const root = screen.getByText('Label').closest('label');
    expect(root).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    render(
      <Switch styles={{ root: { padding: '10px' } }}>Label</Switch>,
    );

    const root = screen.getByText('Label').closest('label');
    expect(root).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    render(
      <Switch className="legacy" classNames={{ root: 'slot-root' }}>Label</Switch>,
    );
    const root = screen.getByText('Label').closest('label');

    expect(root).toHaveClass('legacy');
    expect(root).toHaveClass('slot-root');
  });

  it('classNames.track uygulanir', () => {
    render(
      <Switch classNames={{ track: 'my-track' }} aria-label="Test" />,
    );

    expect(screen.getByRole('switch')).toHaveClass('my-track');
  });

  it('styles.track uygulanir', () => {
    render(
      <Switch styles={{ track: { padding: '4px' } }} aria-label="Test" />,
    );

    expect(screen.getByRole('switch')).toHaveStyle({ padding: '4px' });
  });

  it('classNames.label uygulanir', () => {
    render(
      <Switch classNames={{ label: 'my-label' }}>Label text</Switch>,
    );

    const labelSpan = screen.getByText('Label text');
    expect(labelSpan).toHaveClass('my-label');
  });
});
