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
import { Radio } from './Radio';
import { RadioGroup } from '../radio-group/RadioGroup';

describe('Radio', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(<Radio aria-label="Test" value="a" />);
    const radio = screen.getByRole('radio');

    expect(radio).toBeInTheDocument();
  });

  it('label ile render eder / renders with label', () => {
    render(<Radio value="a">Seçenek A</Radio>);

    expect(screen.getByText('Seçenek A')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Checked state
  // ──────────────────────────────────────────

  it('varsayılan unchecked / default unchecked', () => {
    render(<Radio aria-label="Test" value="a" />);
    const radio = screen.getByRole('radio');

    expect(radio).toHaveAttribute('aria-checked', 'false');
    expect(radio).toHaveAttribute('data-state', 'unchecked');
  });

  it('checked durumda doğru attribute set edilir', () => {
    render(<Radio aria-label="Test" value="a" checked />);
    const radio = screen.getByRole('radio');

    expect(radio).toHaveAttribute('aria-checked', 'true');
    expect(radio).toHaveAttribute('data-state', 'checked');
  });

  // ──────────────────────────────────────────
  // Select — uncontrolled
  // ──────────────────────────────────────────

  it('click ile select eder (uncontrolled)', () => {
    render(<Radio aria-label="Test" value="a" />);
    const radio = screen.getByRole('radio');

    expect(radio).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(radio);
    expect(radio).toHaveAttribute('aria-checked', 'true');
  });

  it('zaten checked ise click değişiklik yapmaz', () => {
    render(<Radio aria-label="Test" value="a" checked />);
    const radio = screen.getByRole('radio');

    expect(radio).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(radio);
    expect(radio).toHaveAttribute('aria-checked', 'true');
  });

  it('Space tuşu ile select eder', () => {
    render(<Radio aria-label="Test" value="a" />);
    const radio = screen.getByRole('radio');

    fireEvent.keyDown(radio, { key: ' ' });
    expect(radio).toHaveAttribute('aria-checked', 'true');
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda select yoksayılır', () => {
    render(<Radio aria-label="Test" value="a" disabled />);
    const radio = screen.getByRole('radio');

    expect(radio).toHaveAttribute('aria-disabled', 'true');
    expect(radio).toHaveAttribute('data-disabled', '');
    fireEvent.click(radio);
    expect(radio).toHaveAttribute('aria-checked', 'false');
  });

  // ──────────────────────────────────────────
  // ReadOnly
  // ──────────────────────────────────────────

  it('readOnly durumda select yoksayılır', () => {
    render(<Radio aria-label="Test" value="a" readOnly />);
    const radio = screen.getByRole('radio');

    expect(radio).toHaveAttribute('aria-readonly', 'true');
    expect(radio).toHaveAttribute('data-readonly', '');
    fireEvent.click(radio);
    expect(radio).toHaveAttribute('aria-checked', 'false');
  });

  // ──────────────────────────────────────────
  // Invalid
  // ──────────────────────────────────────────

  it('invalid durumda doğru attribute set edilir', () => {
    render(<Radio aria-label="Test" value="a" invalid />);
    const radio = screen.getByRole('radio');

    expect(radio).toHaveAttribute('aria-invalid', 'true');
    expect(radio).toHaveAttribute('data-invalid', '');
  });

  // ──────────────────────────────────────────
  // ARIA
  // ──────────────────────────────────────────

  it('role=radio set edilir', () => {
    render(<Radio aria-label="Test" value="a" />);

    expect(screen.getByRole('radio')).toHaveAttribute('role', 'radio');
  });

  it('unchecked radio tabIndex=-1 olur (roving tabindex)', () => {
    render(<Radio aria-label="Test" value="a" />);

    expect(screen.getByRole('radio')).toHaveAttribute('tabindex', '-1');
  });

  it('checked radio tabIndex=0 olur (roving tabindex)', () => {
    render(<Radio aria-label="Test" value="a" checked />);

    expect(screen.getByRole('radio')).toHaveAttribute('tabindex', '0');
  });

  it('aria-label doğru set edilir', () => {
    render(<Radio aria-label="Seçenek" value="a" />);

    expect(screen.getByRole('radio')).toHaveAttribute('aria-label', 'Seçenek');
  });

  it('aria-describedby doğru set edilir', () => {
    render(<Radio aria-label="Test" aria-describedby="help" value="a" />);

    expect(screen.getByRole('radio')).toHaveAttribute('aria-describedby', 'help');
  });

  // ──────────────────────────────────────────
  // Hidden input (form entegrasyonu)
  // ──────────────────────────────────────────

  it('name prop ile hidden input render eder', () => {
    render(<Radio aria-label="Test" name="choice" value="a" />);

    const hidden = document.querySelector('input[type="radio"][name="choice"]');
    expect(hidden).toBeInTheDocument();
    expect(hidden).toHaveAttribute('aria-hidden', 'true');
  });

  it('name prop yoksa hidden input render etmez', () => {
    render(<Radio aria-label="Test" value="a" />);

    const hidden = document.querySelector('input[type="radio"]');
    expect(hidden).not.toBeInTheDocument();
  });

  it('hidden input checked durumunu yansıtır', () => {
    render(<Radio aria-label="Test" name="choice" value="a" checked />);

    const hidden = document.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(hidden.checked).toBe(true);
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id doğru iletilir / id is forwarded correctly', () => {
    const { container } = render(<Radio aria-label="Test" id="my-radio" value="a" />);

    expect(container.querySelector('#my-radio')).toBeInTheDocument();
  });

  it('className doğru iletilir / className is forwarded correctly', () => {
    render(<Radio className="custom-class" value="a">Label</Radio>);

    const label = screen.getByText('Label').closest('label');
    expect(label?.className).toContain('custom-class');
  });

  // ──────────────────────────────────────────
  // Dot render
  // ──────────────────────────────────────────

  it('unchecked durumda dot gösterilmez', () => {
    render(<Radio aria-label="Test" value="a" />);
    const radio = screen.getByRole('radio');

    expect(radio.querySelector('span')).not.toBeInTheDocument();
  });

  it('checked durumda dot gösterilir', () => {
    render(<Radio aria-label="Test" value="a" checked />);
    const radio = screen.getByRole('radio');

    expect(radio.querySelector('span')).toBeInTheDocument();
  });
});

describe('Radio — classNames & styles', () => {
  // ── classNames & styles ──────────────────────────────────

  it('classNames.root uygulanir', () => {
    render(<Radio classNames={{ root: 'slot-root' }} value="a">Label</Radio>);

    const root = screen.getByText('Label').closest('label');
    expect(root).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    render(
      <Radio styles={{ root: { padding: '10px' } }} value="a">Label</Radio>,
    );

    const root = screen.getByText('Label').closest('label');
    expect(root).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    render(
      <Radio className="legacy" classNames={{ root: 'slot-root' }} value="a">Label</Radio>,
    );
    const root = screen.getByText('Label').closest('label');

    expect(root).toHaveClass('legacy');
    expect(root).toHaveClass('slot-root');
  });

  it('classNames.control uygulanir', () => {
    render(
      <Radio classNames={{ control: 'my-control' }} aria-label="Test" value="a" />,
    );

    expect(screen.getByRole('radio')).toHaveClass('my-control');
  });

  it('styles.control uygulanir', () => {
    render(
      <Radio styles={{ control: { padding: '6px' } }} aria-label="Test" value="a" />,
    );

    expect(screen.getByRole('radio')).toHaveStyle({ padding: '6px' });
  });

  it('classNames.label uygulanir', () => {
    render(
      <Radio classNames={{ label: 'my-label' }} value="a">Label text</Radio>,
    );

    const labelSpan = screen.getByText('Label text');
    expect(labelSpan).toHaveClass('my-label');
  });

  it('styles.dot dot elemana eklenir', () => {
    render(
      <Radio styles={{ dot: { padding: '20px' } }} aria-label="Test" value="a" checked />,
    );

    expect(screen.getByTestId('radio-dot')).toHaveStyle({ padding: '20px' });
  });

  it('styles.label label elemana eklenir', () => {
    render(
      <Radio styles={{ label: { letterSpacing: '2px' } }} value="a">Label</Radio>,
    );

    expect(screen.getByTestId('radio-label')).toHaveStyle({ letterSpacing: '2px' });
  });
});

// ── Compound API ──

describe('Radio (Compound)', () => {
  it('compound: Indicator render edilir', () => {
    render(
      <Radio value="a">
        <Radio.Indicator />
        <Radio.Label>Secenek A</Radio.Label>
      </Radio>,
    );
    expect(screen.getByTestId('radio-indicator')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('compound: Label render edilir', () => {
    render(
      <Radio value="a">
        <Radio.Indicator />
        <Radio.Label>Secenek A</Radio.Label>
      </Radio>,
    );
    expect(screen.getByTestId('radio-label')).toHaveTextContent('Secenek A');
  });

  it('compound: checked state context ile aktarilir', () => {
    render(
      <Radio value="a" checked>
        <Radio.Indicator />
        <Radio.Label>Secili</Radio.Label>
      </Radio>,
    );
    expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'true');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Radio value="a" classNames={{ label: 'cmp-label-cls' }}>
        <Radio.Indicator />
        <Radio.Label>Test</Radio.Label>
      </Radio>,
    );
    expect(screen.getByTestId('radio-label').className).toContain('cmp-label-cls');
  });

  it('compound: context disinda kullanilirsa hata firlatir', () => {
    expect(() => {
      render(<Radio.Indicator />);
    }).toThrow('Radio compound sub-components must be used within <Radio>.');
  });
});

describe('RadioGroup', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(
      <RadioGroup aria-label="Test group" name="grp">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  // ──────────────────────────────────────────
  // Value — controlled
  // ──────────────────────────────────────────

  it('value prop ile doğru radio seçili olur', () => {
    render(
      <RadioGroup value="b" aria-label="Test" name="grp">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );

    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('aria-checked', 'false');
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  });

  it('onValueChange çağrılır', () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup value="a" onValueChange={handleChange} aria-label="Test" name="grp">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[1]);
    expect(handleChange).toHaveBeenCalledWith('b');
  });

  it('zaten seçili radio tıklanınca onValueChange çağrılmaz', () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup value="a" onValueChange={handleChange} aria-label="Test" name="grp">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );

    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);
    expect(handleChange).not.toHaveBeenCalled();
  });

  // ──────────────────────────────────────────
  // Disabled (grup seviyesi)
  // ──────────────────────────────────────────

  it('disabled grupta tüm radio\'lar disabled olur', () => {
    render(
      <RadioGroup disabled aria-label="Test" name="grp">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );

    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // ──────────────────────────────────────────
  // Context — size/color devralma
  // ──────────────────────────────────────────

  it('grup name\'i child radio\'lara aktarılır', () => {
    render(
      <RadioGroup name="plan" aria-label="Test">
        <Radio value="a">A</Radio>
      </RadioGroup>,
    );

    const hidden = document.querySelector('input[type="radio"][name="plan"]');
    expect(hidden).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // ARIA
  // ──────────────────────────────────────────

  it('role=radiogroup set edilir', () => {
    render(
      <RadioGroup aria-label="Test" name="grp">
        <Radio value="a">A</Radio>
      </RadioGroup>,
    );

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('aria-label doğru set edilir', () => {
    render(
      <RadioGroup aria-label="Plan seçimi" name="grp">
        <Radio value="a">A</Radio>
      </RadioGroup>,
    );

    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'Plan seçimi');
  });
});
