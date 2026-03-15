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
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders', () => {
    render(<NumberInput aria-label="Sayı" />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('varsayılan değeri gösterir / shows default value', () => {
    render(<NumberInput aria-label="Sayı" value={42} />);
    expect(screen.getByRole('spinbutton')).toHaveValue('42');
  });

  it('null değerde boş gösterir / shows empty for null value', () => {
    render(<NumberInput aria-label="Sayı" />);
    expect(screen.getByRole('spinbutton')).toHaveValue('');
  });

  it('placeholder gösterir / shows placeholder', () => {
    render(<NumberInput placeholder="Miktar" aria-label="Sayı" />);
    expect(screen.getByPlaceholderText('Miktar')).toBeInTheDocument();
  });

  it('ref forward eder / forwards ref', () => {
    const ref = vi.fn();
    render(<NumberInput ref={ref} aria-label="Sayı" />);
    expect(ref).toHaveBeenCalled();
  });

  // ──────────────────────────────────────────
  // Stepper butonları
  // ──────────────────────────────────────────

  describe('stepper buttons', () => {
    it('stepper butonları render edilir / stepper buttons render', () => {
      render(<NumberInput aria-label="Sayı" />);
      const buttons = screen.getAllByRole('button', { hidden: true });
      expect(buttons).toHaveLength(2);
    });

    it('hideStepper true iken butonlar gizlenir / buttons hidden when hideStepper', () => {
      render(<NumberInput aria-label="Sayı" hideStepper />);
      const buttons = screen.queryAllByRole('button', { hidden: true });
      expect(buttons).toHaveLength(0);
    });

    it('increment butonu değeri artırır / increment button increases value', () => {
      const onValueChange = vi.fn();
      render(
        <NumberInput aria-label="Sayı" value={5} step={1} onValueChange={onValueChange} />,
      );
      const buttons = screen.getAllByRole('button', { hidden: true });
      fireEvent.pointerDown(buttons[0]);
      fireEvent.pointerUp(buttons[0]);
      expect(onValueChange).toHaveBeenCalledWith(6);
    });

    it('decrement butonu değeri azaltır / decrement button decreases value', () => {
      const onValueChange = vi.fn();
      render(
        <NumberInput aria-label="Sayı" value={5} step={1} onValueChange={onValueChange} />,
      );
      const buttons = screen.getAllByRole('button', { hidden: true });
      fireEvent.pointerDown(buttons[1]);
      fireEvent.pointerUp(buttons[1]);
      expect(onValueChange).toHaveBeenCalledWith(4);
    });
  });

  // ──────────────────────────────────────────
  // Keyboard
  // ──────────────────────────────────────────

  describe('keyboard', () => {
    it('ArrowUp ile artırır / increments with ArrowUp', async () => {
      const onValueChange = vi.fn();
      render(
        <NumberInput aria-label="Sayı" value={5} step={1} onValueChange={onValueChange} />,
      );
      const input = screen.getByRole('spinbutton');
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(onValueChange).toHaveBeenCalledWith(6);
    });

    it('ArrowDown ile azaltır / decrements with ArrowDown', async () => {
      const onValueChange = vi.fn();
      render(
        <NumberInput aria-label="Sayı" value={5} step={1} onValueChange={onValueChange} />,
      );
      const input = screen.getByRole('spinbutton');
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(onValueChange).toHaveBeenCalledWith(4);
    });

    it('Home ile min değerine gider / Home goes to min', () => {
      const onValueChange = vi.fn();
      render(
        <NumberInput aria-label="Sayı" value={50} min={0} onValueChange={onValueChange} />,
      );
      const input = screen.getByRole('spinbutton');
      fireEvent.keyDown(input, { key: 'Home' });
      expect(onValueChange).toHaveBeenCalledWith(0);
    });

    it('End ile max değerine gider / End goes to max', () => {
      const onValueChange = vi.fn();
      render(
        <NumberInput aria-label="Sayı" value={50} max={100} onValueChange={onValueChange} />,
      );
      const input = screen.getByRole('spinbutton');
      fireEvent.keyDown(input, { key: 'End' });
      expect(onValueChange).toHaveBeenCalledWith(100);
    });
  });

  // ──────────────────────────────────────────
  // Min / Max
  // ──────────────────────────────────────────

  describe('min / max', () => {
    it('max sınırında artırmaz / does not increment past max', () => {
      const onValueChange = vi.fn();
      render(
        <NumberInput aria-label="Sayı" value={100} max={100} onValueChange={onValueChange} />,
      );
      const input = screen.getByRole('spinbutton');
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('min sınırında azaltmaz / does not decrement past min', () => {
      const onValueChange = vi.fn();
      render(
        <NumberInput aria-label="Sayı" value={0} min={0} onValueChange={onValueChange} />,
      );
      const input = screen.getByRole('spinbutton');
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  describe('disabled', () => {
    it('disabled durumda input disabled olur', () => {
      render(<NumberInput aria-label="Sayı" disabled />);
      expect(screen.getByRole('spinbutton')).toBeDisabled();
    });

    it('disabled durumda data-disabled set edilir', () => {
      const { container } = render(<NumberInput aria-label="Sayı" disabled />);
      const root = container.firstElementChild;
      expect(root).toHaveAttribute('data-disabled', '');
    });
  });

  // ──────────────────────────────────────────
  // ReadOnly
  // ──────────────────────────────────────────

  describe('readOnly', () => {
    it('readOnly durumda input readOnly olur', () => {
      render(<NumberInput aria-label="Sayı" readOnly />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('readonly');
    });

    it('readOnly durumda data-readonly set edilir', () => {
      const { container } = render(<NumberInput aria-label="Sayı" readOnly />);
      const root = container.firstElementChild;
      expect(root).toHaveAttribute('data-readonly', '');
    });
  });

  // ──────────────────────────────────────────
  // Invalid
  // ──────────────────────────────────────────

  describe('invalid', () => {
    it('invalid durumda aria-invalid set edilir', () => {
      render(<NumberInput aria-label="Sayı" invalid />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true');
    });

    it('invalid durumda data-invalid set edilir', () => {
      const { container } = render(<NumberInput aria-label="Sayı" invalid />);
      const root = container.firstElementChild;
      expect(root).toHaveAttribute('data-invalid', '');
    });
  });

  // ──────────────────────────────────────────
  // ARIA
  // ──────────────────────────────────────────

  describe('aria', () => {
    it('spinbutton role set edilir', () => {
      render(<NumberInput aria-label="Sayı" />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('aria-valuemin/max set edilir', () => {
      render(<NumberInput aria-label="Sayı" min={0} max={100} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-valuemin', '0');
      expect(input).toHaveAttribute('aria-valuemax', '100');
    });

    it('aria-valuenow set edilir', () => {
      render(<NumberInput aria-label="Sayı" value={42} />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-valuenow', '42');
    });

    it('aria-label geçirilir / passes aria-label', () => {
      render(<NumberInput aria-label="Miktar" />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-label', 'Miktar');
    });

    it('inputMode decimal set edilir', () => {
      render(<NumberInput aria-label="Sayı" />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('inputmode', 'decimal');
    });
  });

  // ──────────────────────────────────────────
  // Precision
  // ──────────────────────────────────────────

  describe('precision', () => {
    it('precision ile formatlanmış değer gösterir', () => {
      render(<NumberInput aria-label="Sayı" value={3.1} precision={2} />);
      expect(screen.getByRole('spinbutton')).toHaveValue('3.10');
    });
  });

  // ──────────────────────────────────────────
  // Variants & sizes
  // ──────────────────────────────────────────

  describe('variants & sizes', () => {
    it('outline variant render edilir', () => {
      const { container } = render(<NumberInput aria-label="Sayı" variant="outline" />);
      expect(container.firstElementChild).toBeInTheDocument();
    });

    it('filled variant render edilir', () => {
      const { container } = render(<NumberInput aria-label="Sayı" variant="filled" />);
      expect(container.firstElementChild).toBeInTheDocument();
    });

    it('flushed variant render edilir', () => {
      const { container } = render(<NumberInput aria-label="Sayı" variant="flushed" />);
      expect(container.firstElementChild).toBeInTheDocument();
    });

    it('tüm size\'lar render edilir / all sizes render', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
      sizes.forEach((s) => {
        const { container } = render(<NumberInput aria-label={s} size={s} />);
        expect(container.firstElementChild).toBeInTheDocument();
      });
    });
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  describe('classNames & styles', () => {
    it('classNames.root uygulanir', () => {
      const { container } = render(
        <NumberInput aria-label="Sayi" classNames={{ root: 'slot-root' }} />,
      );
      expect(container.firstElementChild).toHaveClass('slot-root');
    });

    it('styles.root uygulanir', () => {
      const { container } = render(
        <NumberInput aria-label="Sayi" styles={{ root: { padding: '10px' } }} />,
      );
      expect(container.firstElementChild).toHaveStyle({ padding: '10px' });
    });

    it('className + classNames.root birlestirilir', () => {
      const { container } = render(
        <NumberInput aria-label="Sayi" className="legacy" classNames={{ root: 'slot-root' }} />,
      );
      const el = container.firstElementChild;
      expect(el).toHaveClass('legacy');
      expect(el).toHaveClass('slot-root');
    });

    it('classNames.input uygulanir', () => {
      render(
        <NumberInput aria-label="Sayi" classNames={{ input: 'my-input' }} />,
      );
      expect(screen.getByRole('spinbutton')).toHaveClass('my-input');
    });

    it('styles.input uygulanir', () => {
      render(
        <NumberInput aria-label="Sayi" styles={{ input: { fontSize: '14px' } }} />,
      );
      expect(screen.getByRole('spinbutton')).toHaveStyle({ fontSize: '14px' });
    });

    it('classNames.incrementButton ve decrementButton uygulanir', () => {
      render(
        <NumberInput
          aria-label="Sayi"
          classNames={{ incrementButton: 'my-inc', decrementButton: 'my-dec' }}
        />,
      );
      const buttons = screen.getAllByRole('button', { hidden: true });
      expect(buttons[0]).toHaveClass('my-inc');
      expect(buttons[1]).toHaveClass('my-dec');
    });
  });
});

// ── Compound API ──

describe('NumberInput (Compound)', () => {
  it('compound: Field render edilir', () => {
    render(
      <NumberInput aria-label="Sayi" value={42}>
        <NumberInput.Field placeholder="Sayi girin" />
      </NumberInput>,
    );
    expect(screen.getByTestId('numberinput-field')).toBeInTheDocument();
  });

  it('compound: IncrementButton render edilir', () => {
    render(
      <NumberInput aria-label="Sayi">
        <NumberInput.Field />
        <NumberInput.IncrementButton />
      </NumberInput>,
    );
    expect(screen.getByTestId('numberinput-increment')).toBeInTheDocument();
  });

  it('compound: DecrementButton render edilir', () => {
    render(
      <NumberInput aria-label="Sayi">
        <NumberInput.Field />
        <NumberInput.DecrementButton />
      </NumberInput>,
    );
    expect(screen.getByTestId('numberinput-decrement')).toBeInTheDocument();
  });

  it('compound: root data-testid eklenir', () => {
    render(
      <NumberInput aria-label="Sayi">
        <NumberInput.Field />
      </NumberInput>,
    );
    expect(screen.getByTestId('numberinput-root')).toBeInTheDocument();
  });

  it('compound: context disinda kullanim hata firlatir', () => {
    expect(() => {
      render(<NumberInput.Field />);
    }).toThrow('NumberInput compound sub-components must be used within <NumberInput>.');
  });
});
