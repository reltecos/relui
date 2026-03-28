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
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(<Checkbox aria-label="Test" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
  });

  it('label ile render eder / renders with label', () => {
    render(<Checkbox>Kabul ediyorum</Checkbox>);

    expect(screen.getByText('Kabul ediyorum')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Checked state
  // ──────────────────────────────────────────

  it('varsayılan unchecked / default unchecked', () => {
    render(<Checkbox aria-label="Test" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('checked durumda doğru attribute set edilir', () => {
    render(<Checkbox aria-label="Test" checked />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('indeterminate durumda doğru attribute set edilir', () => {
    render(<Checkbox aria-label="Test" checked="indeterminate" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  });

  // ──────────────────────────────────────────
  // Toggle — uncontrolled
  // ──────────────────────────────────────────

  it('click ile toggle eder (uncontrolled)', () => {
    render(<Checkbox aria-label="Test" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('Space tuşu ile toggle eder', () => {
    render(<Checkbox aria-label="Test" />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.keyDown(checkbox, { key: ' ' });
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  // ──────────────────────────────────────────
  // Toggle — controlled
  // ──────────────────────────────────────────

  it('controlled mode — onCheckedChange çağrılır', () => {
    const handleChange = vi.fn();
    render(<Checkbox aria-label="Test" checked={false} onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('controlled mode — indeterminate toggle true döner', () => {
    const handleChange = vi.fn();
    render(
      <Checkbox aria-label="Test" checked="indeterminate" onCheckedChange={handleChange} />,
    );
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda toggle yoksayılır', () => {
    render(<Checkbox aria-label="Test" disabled />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    expect(checkbox).toHaveAttribute('data-disabled', '');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  // ──────────────────────────────────────────
  // ReadOnly
  // ──────────────────────────────────────────

  it('readOnly durumda toggle yoksayılır', () => {
    render(<Checkbox aria-label="Test" readOnly checked />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-readonly', 'true');
    expect(checkbox).toHaveAttribute('data-readonly', '');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  // ──────────────────────────────────────────
  // Invalid
  // ──────────────────────────────────────────

  it('invalid durumda doğru attribute set edilir', () => {
    render(<Checkbox aria-label="Test" invalid />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute('data-invalid', '');
  });

  // ──────────────────────────────────────────
  // Required
  // ──────────────────────────────────────────

  it('required durumda doğru attribute set edilir', () => {
    render(<Checkbox aria-label="Test" required />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-required', 'true');
  });

  // ──────────────────────────────────────────
  // ARIA
  // ──────────────────────────────────────────

  it('role=checkbox set edilir', () => {
    render(<Checkbox aria-label="Test" />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('role', 'checkbox');
  });

  it('tabIndex=0 set edilir', () => {
    render(<Checkbox aria-label="Test" />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('tabindex', '0');
  });

  it('aria-label doğru set edilir', () => {
    render(<Checkbox aria-label="Kabul" />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-label', 'Kabul');
  });

  it('aria-describedby doğru set edilir', () => {
    render(<Checkbox aria-label="Test" aria-describedby="help" />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-describedby', 'help');
  });

  // ──────────────────────────────────────────
  // Hidden input (form entegrasyonu)
  // ──────────────────────────────────────────

  it('name prop ile hidden input render eder', () => {
    render(<Checkbox aria-label="Test" name="accept" />);

    const hidden = document.querySelector('input[type="checkbox"][name="accept"]');
    expect(hidden).toBeInTheDocument();
    expect(hidden).toHaveAttribute('aria-hidden', 'true');
  });

  it('name prop yoksa hidden input render etmez', () => {
    render(<Checkbox aria-label="Test" />);

    const hidden = document.querySelector('input[type="checkbox"]');
    expect(hidden).not.toBeInTheDocument();
  });

  it('hidden input checked durumunu yansıtır', () => {
    render(<Checkbox aria-label="Test" name="accept" checked />);

    const hidden = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(hidden.checked).toBe(true);
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id doğru iletilir / id is forwarded correctly', () => {
    const { container } = render(<Checkbox aria-label="Test" id="my-cb" />);

    expect(container.querySelector('#my-cb')).toBeInTheDocument();
  });

  it('className doğru iletilir / className is forwarded correctly', () => {
    render(<Checkbox className="custom-class">Label</Checkbox>);

    const label = screen.getByText('Label').closest('label');
    expect(label?.className).toContain('custom-class');
  });

  // ──────────────────────────────────────────
  // Check icon render
  // ──────────────────────────────────────────

  it('unchecked durumda ikon gösterilmez', () => {
    render(<Checkbox aria-label="Test" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox.querySelector('svg')).not.toBeInTheDocument();
  });

  it('checked durumda check ikonu gösterilir', () => {
    render(<Checkbox aria-label="Test" checked />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox.querySelector('svg')).toBeInTheDocument();
  });

  it('indeterminate durumda dash ikonu gösterilir', () => {
    render(<Checkbox aria-label="Test" checked="indeterminate" />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox.querySelector('svg')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  it('classNames.root label modunda uygulanir', () => {
    render(<Checkbox classNames={{ root: 'slot-root' }}>Label</Checkbox>);

    const label = screen.getByText('Label').closest('label');
    expect(label).toHaveClass('slot-root');
  });

  it('classNames.root labelsiz modda uygulanir', () => {
    const { container } = render(
      <Checkbox aria-label="Test" classNames={{ root: 'slot-root' }} />,
    );

    expect(container.firstChild).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    render(
      <Checkbox styles={{ root: { margin: '10px' } }}>Label</Checkbox>,
    );

    const label = screen.getByText('Label').closest('label');
    expect(label).toHaveStyle({ margin: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    render(
      <Checkbox className="legacy" classNames={{ root: 'slot-root' }}>Label</Checkbox>,
    );
    const label = screen.getByText('Label').closest('label');

    expect(label).toHaveClass('legacy');
    expect(label).toHaveClass('slot-root');
  });

  it('classNames.control uygulanir', () => {
    render(<Checkbox aria-label="Test" classNames={{ control: 'my-control' }} />);

    expect(screen.getByRole('checkbox')).toHaveClass('my-control');
  });

  it('classNames.label uygulanir', () => {
    render(<Checkbox classNames={{ label: 'my-label' }}>Metin</Checkbox>);

    expect(screen.getByText('Metin')).toHaveClass('my-label');
  });

  // ── Slot API: styles ──────────────────────────────────────────────

  it('styles.control control elemana uygulanir', () => {
    render(<Checkbox aria-label="Test" styles={{ control: { padding: '4px' } }} />);

    expect(screen.getByRole('checkbox')).toHaveStyle({ padding: '4px' });
  });

  it('styles.label label elemana uygulanir', () => {
    render(
      <Checkbox styles={{ label: { letterSpacing: '0.5px' } }}>Metin</Checkbox>,
    );

    expect(screen.getByText('Metin')).toHaveStyle({ letterSpacing: '0.5px' });
  });

  it('styles.icon icon elemana uygulanir', () => {
    render(<Checkbox aria-label="Test" checked styles={{ icon: { opacity: '0.7' } }} />);
    const checkbox = screen.getByRole('checkbox');
    const svg = checkbox.querySelector('svg');

    expect(svg).toHaveStyle({ opacity: '0.7' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Checkbox ref={ref} aria-label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Checkbox (Compound)', () => {
  it('compound: Indicator render edilir', () => {
    render(
      <Checkbox>
        <Checkbox.Indicator />
        <Checkbox.Label>Kabul ediyorum</Checkbox.Label>
      </Checkbox>,
    );
    expect(screen.getByTestId('checkbox-indicator')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('compound: Label render edilir', () => {
    render(
      <Checkbox>
        <Checkbox.Indicator />
        <Checkbox.Label>Kabul ediyorum</Checkbox.Label>
      </Checkbox>,
    );
    expect(screen.getByTestId('checkbox-label')).toHaveTextContent('Kabul ediyorum');
  });

  it('compound: checked state context ile aktarilir', () => {
    render(
      <Checkbox checked>
        <Checkbox.Indicator />
        <Checkbox.Label>Secili</Checkbox.Label>
      </Checkbox>,
    );
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Checkbox classNames={{ label: 'cmp-label-cls' }}>
        <Checkbox.Indicator />
        <Checkbox.Label>Test</Checkbox.Label>
      </Checkbox>,
    );
    expect(screen.getByTestId('checkbox-label').className).toContain('cmp-label-cls');
  });

  it('compound: context disinda kullanilirsa hata firlatir', () => {
    expect(() => {
      render(<Checkbox.Indicator />);
    }).toThrow('Checkbox compound sub-components must be used within <Checkbox>.');
  });
});
