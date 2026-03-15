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
import { InPlaceEditor } from './InPlaceEditor';

describe('InPlaceEditor', () => {
  // ──────────────────────────────────────────
  // Render — Reading mode
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(<InPlaceEditor defaultValue="Merhaba" />);

    expect(screen.getByText('Merhaba')).toBeInTheDocument();
  });

  it('reading modunda display span render eder', () => {
    render(<InPlaceEditor defaultValue="Test" />);
    const display = screen.getByRole('button');

    expect(display.tagName).toBe('SPAN');
    expect(display).toHaveAttribute('data-state', 'reading');
  });

  it('placeholder gosterir (bos deger)', () => {
    render(<InPlaceEditor placeholder="Isim girin" />);

    expect(screen.getByText('Isim girin')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Edit mode — click activation
  // ──────────────────────────────────────────

  it('click ile editing moduna gecer', () => {
    render(<InPlaceEditor defaultValue="Test" />);
    const display = screen.getByRole('button');

    fireEvent.click(display);

    const input = screen.getByDisplayValue('Test');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('doubleClick activation modunda tek click ile gecmez', () => {
    render(<InPlaceEditor defaultValue="Test" activationMode="doubleClick" />);
    const display = screen.getByRole('button');

    fireEvent.click(display);

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Test')).not.toBeInTheDocument();
  });

  it('doubleClick ile editing moduna gecer', () => {
    render(<InPlaceEditor defaultValue="Test" activationMode="doubleClick" />);
    const display = screen.getByRole('button');

    fireEvent.doubleClick(display);

    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
  });

  it('Enter tusu ile editing moduna gecer', () => {
    render(<InPlaceEditor defaultValue="Test" />);
    const display = screen.getByRole('button');

    fireEvent.keyDown(display, { key: 'Enter' });

    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
  });

  it('Space tusu ile editing moduna gecer', () => {
    render(<InPlaceEditor defaultValue="Test" />);
    const display = screen.getByRole('button');

    fireEvent.keyDown(display, { key: ' ' });

    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Confirm & Cancel
  // ──────────────────────────────────────────

  it('Enter tusu ile onaylar', () => {
    const handleConfirm = vi.fn();
    render(<InPlaceEditor defaultValue="eski" onConfirm={handleConfirm} />);

    fireEvent.click(screen.getByRole('button'));

    const input = screen.getByDisplayValue('eski');
    fireEvent.change(input, { target: { value: 'yeni' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleConfirm).toHaveBeenCalledWith('yeni');
    expect(screen.getByText('yeni')).toBeInTheDocument();
  });

  it('Escape tusu ile iptal eder', () => {
    const handleCancel = vi.fn();
    render(<InPlaceEditor defaultValue="eski" onCancel={handleCancel} />);

    fireEvent.click(screen.getByRole('button'));

    const input = screen.getByDisplayValue('eski');
    fireEvent.change(input, { target: { value: 'yeni' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(handleCancel).toHaveBeenCalledOnce();
    expect(screen.getByText('eski')).toBeInTheDocument();
  });

  it('onay butonu ile onaylar', () => {
    const handleConfirm = vi.fn();
    render(<InPlaceEditor defaultValue="eski" onConfirm={handleConfirm} submitOnBlur={false} />);

    fireEvent.click(screen.getByRole('button'));

    const input = screen.getByDisplayValue('eski');
    fireEvent.change(input, { target: { value: 'yeni' } });
    fireEvent.click(screen.getByLabelText('Onayla'));

    expect(handleConfirm).toHaveBeenCalledWith('yeni');
  });

  it('iptal butonu ile iptal eder', () => {
    const handleCancel = vi.fn();
    render(<InPlaceEditor defaultValue="eski" onCancel={handleCancel} submitOnBlur={false} />);

    fireEvent.click(screen.getByRole('button'));

    const input = screen.getByDisplayValue('eski');
    fireEvent.change(input, { target: { value: 'yeni' } });
    fireEvent.click(screen.getByLabelText('İptal'));

    expect(handleCancel).toHaveBeenCalledOnce();
  });

  // ──────────────────────────────────────────
  // submitOnBlur
  // ──────────────────────────────────────────

  it('submitOnBlur=true (varsayilan) blur ile onaylar', () => {
    const handleConfirm = vi.fn();
    render(<InPlaceEditor defaultValue="eski" onConfirm={handleConfirm} />);

    fireEvent.click(screen.getByRole('button'));

    const input = screen.getByDisplayValue('eski');
    fireEvent.change(input, { target: { value: 'yeni' } });
    fireEvent.blur(input);

    expect(handleConfirm).toHaveBeenCalledWith('yeni');
  });

  // ──────────────────────────────────────────
  // showActions
  // ──────────────────────────────────────────

  it('showActions=true aksiyon butonlarini gosterir', () => {
    render(<InPlaceEditor defaultValue="Test" />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByLabelText('Onayla')).toBeInTheDocument();
    expect(screen.getByLabelText('İptal')).toBeInTheDocument();
  });

  it('showActions=false aksiyon butonlarini gizler', () => {
    render(<InPlaceEditor defaultValue="Test" showActions={false} />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByLabelText('Onayla')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('İptal')).not.toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Disabled & ReadOnly
  // ──────────────────────────────────────────

  it('disabled durumda editing moduna gecmez', () => {
    render(<InPlaceEditor defaultValue="Test" disabled />);
    const display = screen.getByRole('button');

    expect(display).toHaveAttribute('data-disabled', '');
    fireEvent.click(display);

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Test')).not.toBeInTheDocument();
  });

  it('readOnly durumda editing moduna gecmez', () => {
    render(<InPlaceEditor defaultValue="Test" readOnly />);
    const display = screen.getByRole('button');

    expect(display).toHaveAttribute('data-readonly', '');
    fireEvent.click(display);

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Test')).not.toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // onValueChange callback
  // ──────────────────────────────────────────

  it('onValueChange confirm ile cagrilir', () => {
    const handleChange = vi.fn();
    render(<InPlaceEditor defaultValue="eski" onValueChange={handleChange} />);

    fireEvent.click(screen.getByRole('button'));

    const input = screen.getByDisplayValue('eski');
    fireEvent.change(input, { target: { value: 'yeni' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalledWith('yeni');
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id dogru iletilir', () => {
    const { container } = render(
      <InPlaceEditor defaultValue="Test" id="my-editor" />,
    );

    expect(container.querySelector('#my-editor')).toBeInTheDocument();
  });

  it('className dogru iletilir', () => {
    const { container } = render(
      <InPlaceEditor defaultValue="Test" className="custom" />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass('custom');
  });

  it('aria-label dogru set edilir (display)', () => {
    render(<InPlaceEditor defaultValue="Test" aria-label="Isim" />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Isim');
  });

  it('aria-label dogru set edilir (input)', () => {
    render(<InPlaceEditor defaultValue="Test" aria-label="Isim" />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByDisplayValue('Test')).toHaveAttribute('aria-label', 'Isim');
  });

  it('data-state root elementinde set edilir', () => {
    const { container } = render(<InPlaceEditor defaultValue="Test" />);
    const root = container.firstElementChild;

    expect(root).toHaveAttribute('data-state', 'reading');

    fireEvent.click(screen.getByRole('button'));

    expect(root).toHaveAttribute('data-state', 'editing');
  });
});

describe('InPlaceEditor — classNames & styles', () => {
  // ── classNames & styles ──────────────────────────────────

  it('classNames.root uygulanir', () => {
    const { container } = render(
      <InPlaceEditor defaultValue="Test" classNames={{ root: 'slot-root' }} />,
    );

    expect(container.firstElementChild).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = render(
      <InPlaceEditor defaultValue="Test" styles={{ root: { padding: '10px' } }} />,
    );

    expect(container.firstElementChild).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = render(
      <InPlaceEditor defaultValue="Test" className="legacy" classNames={{ root: 'slot-root' }} />,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass('legacy');
    expect(root).toHaveClass('slot-root');
  });

  it('classNames.display uygulanir', () => {
    render(
      <InPlaceEditor defaultValue="Test" classNames={{ display: 'my-display' }} />,
    );

    expect(screen.getByRole('button')).toHaveClass('my-display');
  });

  it('styles.display uygulanir', () => {
    render(
      <InPlaceEditor defaultValue="Test" styles={{ display: { fontSize: '20px' } }} />,
    );

    expect(screen.getByRole('button')).toHaveStyle({ fontSize: '20px' });
  });

  it('classNames.input uygulanir', () => {
    render(
      <InPlaceEditor defaultValue="Test" classNames={{ input: 'my-input' }} />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByDisplayValue('Test')).toHaveClass('my-input');
  });

  it('styles.input uygulanir', () => {
    render(
      <InPlaceEditor defaultValue="Test" styles={{ input: { letterSpacing: '2px' } }} />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByDisplayValue('Test')).toHaveStyle({ letterSpacing: '2px' });
  });

  it('classNames.confirmButton uygulanir', () => {
    render(
      <InPlaceEditor defaultValue="Test" classNames={{ confirmButton: 'my-confirm' }} />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByLabelText('Onayla')).toHaveClass('my-confirm');
  });

  it('classNames.cancelButton uygulanir', () => {
    render(
      <InPlaceEditor defaultValue="Test" classNames={{ cancelButton: 'my-cancel' }} />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByLabelText('İptal')).toHaveClass('my-cancel');
  });
});

// ── Compound API ──────────────────────────────────────

describe('InPlaceEditor (Compound)', () => {
  it('compound: Display sub-component render edilir', () => {
    render(
      <InPlaceEditor defaultValue="Test">
        <InPlaceEditor.Display>Ozel metin</InPlaceEditor.Display>
      </InPlaceEditor>,
    );
    expect(screen.getByTestId('in-place-editor-display')).toHaveTextContent('Ozel metin');
  });

  it('compound: Input sub-component render edilir', () => {
    render(
      <InPlaceEditor defaultValue="Test">
        <InPlaceEditor.Input>
          <span data-testid="custom-input">Custom</span>
        </InPlaceEditor.Input>
      </InPlaceEditor>,
    );
    expect(screen.getByTestId('in-place-editor-input')).toBeInTheDocument();
    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });

  it('compound: Actions sub-component render edilir', () => {
    render(
      <InPlaceEditor defaultValue="Test">
        <InPlaceEditor.Actions>
          <button data-testid="cmp-save">Kaydet</button>
          <button data-testid="cmp-cancel">Iptal</button>
        </InPlaceEditor.Actions>
      </InPlaceEditor>,
    );
    expect(screen.getByTestId('in-place-editor-actions')).toBeInTheDocument();
    expect(screen.getByTestId('cmp-save')).toBeInTheDocument();
    expect(screen.getByTestId('cmp-cancel')).toBeInTheDocument();
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <InPlaceEditor defaultValue="Test" classNames={{ display: 'cmp-display' }}>
        <InPlaceEditor.Display>Metin</InPlaceEditor.Display>
      </InPlaceEditor>,
    );
    expect(screen.getByTestId('in-place-editor-display').className).toContain('cmp-display');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <InPlaceEditor defaultValue="Test" styles={{ actions: { padding: '12px' } }}>
        <InPlaceEditor.Actions>
          <button>OK</button>
        </InPlaceEditor.Actions>
      </InPlaceEditor>,
    );
    expect(screen.getByTestId('in-place-editor-actions')).toHaveStyle({ padding: '12px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<InPlaceEditor defaultValue="Test" ref={ref} />);
    // ref sadece editing modunda input mount olunca cagrilir
    const displayEl = screen.getByText('Test');
    fireEvent.click(displayEl);
    expect(ref).toHaveBeenCalled();
  });
});
