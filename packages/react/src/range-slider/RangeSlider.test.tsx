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
import { RangeSlider } from './RangeSlider';

describe('RangeSlider', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir — iki slider role bulunur', () => {
    render(<RangeSlider aria-label="Test" />);
    const sliders = screen.getAllByRole('slider');

    expect(sliders).toHaveLength(2);
  });

  // ──────────────────────────────────────────
  // ARIA attributes
  // ──────────────────────────────────────────

  it('her iki thumb da role=slider set edilir', () => {
    render(<RangeSlider aria-label="Test" />);
    const sliders = screen.getAllByRole('slider');

    expect(sliders[0]).toHaveAttribute('role', 'slider');
    expect(sliders[1]).toHaveAttribute('role', 'slider');
  });

  it('start thumb aria-valuemin/max/now doğru set edilir', () => {
    render(<RangeSlider aria-label="Test" min={0} max={100} value={[20, 80]} />);
    const sliders = screen.getAllByRole('slider');
    const start = sliders[0];

    expect(start).toHaveAttribute('aria-valuemin', '0');
    expect(start).toHaveAttribute('aria-valuemax', '80');
    expect(start).toHaveAttribute('aria-valuenow', '20');
  });

  it('end thumb aria-valuemin/max/now doğru set edilir', () => {
    render(<RangeSlider aria-label="Test" min={0} max={100} value={[20, 80]} />);
    const sliders = screen.getAllByRole('slider');
    const end = sliders[1];

    expect(end).toHaveAttribute('aria-valuemin', '20');
    expect(end).toHaveAttribute('aria-valuemax', '100');
    expect(end).toHaveAttribute('aria-valuenow', '80');
  });

  it('aria-orientation doğru set edilir', () => {
    render(<RangeSlider aria-label="Test" orientation="vertical" />);
    const sliders = screen.getAllByRole('slider');

    expect(sliders[0]).toHaveAttribute('aria-orientation', 'vertical');
    expect(sliders[1]).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('aria-label doğru set edilir', () => {
    render(<RangeSlider aria-label="Min fiyat" aria-label-end="Max fiyat" />);
    const sliders = screen.getAllByRole('slider');

    expect(sliders[0]).toHaveAttribute('aria-label', 'Min fiyat');
    expect(sliders[1]).toHaveAttribute('aria-label', 'Max fiyat');
  });

  it('aria-valuetext doğru set edilir', () => {
    render(
      <RangeSlider
        aria-label="Test"
        aria-valuetext="20 TL"
        aria-valuetext-end="80 TL"
        value={[20, 80]}
      />,
    );
    const sliders = screen.getAllByRole('slider');

    expect(sliders[0]).toHaveAttribute('aria-valuetext', '20 TL');
    expect(sliders[1]).toHaveAttribute('aria-valuetext', '80 TL');
  });

  it('data-thumb attribute doğru set edilir', () => {
    render(<RangeSlider aria-label="Test" />);
    const sliders = screen.getAllByRole('slider');

    expect(sliders[0]).toHaveAttribute('data-thumb', 'start');
    expect(sliders[1]).toHaveAttribute('data-thumb', 'end');
  });

  it('tabIndex=0 set edilir', () => {
    render(<RangeSlider aria-label="Test" />);
    const sliders = screen.getAllByRole('slider');

    expect(sliders[0]).toHaveAttribute('tabindex', '0');
    expect(sliders[1]).toHaveAttribute('tabindex', '0');
  });

  // ──────────────────────────────────────────
  // Keyboard — start thumb
  // ──────────────────────────────────────────

  it('ArrowRight ile start thumb artırır', () => {
    render(<RangeSlider aria-label="Test" value={[20, 80]} step={5} />);
    const start = screen.getAllByRole('slider')[0];

    fireEvent.keyDown(start, { key: 'ArrowRight' });
    expect(start).toHaveAttribute('aria-valuenow', '25');
  });

  it('ArrowLeft ile start thumb azaltır', () => {
    render(<RangeSlider aria-label="Test" value={[20, 80]} step={5} />);
    const start = screen.getAllByRole('slider')[0];

    fireEvent.keyDown(start, { key: 'ArrowLeft' });
    expect(start).toHaveAttribute('aria-valuenow', '15');
  });

  it('Home ile start thumb min değere gider', () => {
    render(<RangeSlider aria-label="Test" value={[30, 80]} min={0} />);
    const start = screen.getAllByRole('slider')[0];

    fireEvent.keyDown(start, { key: 'Home' });
    expect(start).toHaveAttribute('aria-valuenow', '0');
  });

  it('End ile start thumb end değerine yaklaşır', () => {
    render(<RangeSlider aria-label="Test" value={[20, 80]} />);
    const start = screen.getAllByRole('slider')[0];

    fireEvent.keyDown(start, { key: 'End' });
    expect(start).toHaveAttribute('aria-valuenow', '80');
  });

  // ──────────────────────────────────────────
  // Keyboard — end thumb
  // ──────────────────────────────────────────

  it('ArrowRight ile end thumb artırır', () => {
    render(<RangeSlider aria-label="Test" value={[20, 80]} step={5} />);
    const end = screen.getAllByRole('slider')[1];

    fireEvent.keyDown(end, { key: 'ArrowRight' });
    expect(end).toHaveAttribute('aria-valuenow', '85');
  });

  it('ArrowLeft ile end thumb azaltır', () => {
    render(<RangeSlider aria-label="Test" value={[20, 80]} step={5} />);
    const end = screen.getAllByRole('slider')[1];

    fireEvent.keyDown(end, { key: 'ArrowLeft' });
    expect(end).toHaveAttribute('aria-valuenow', '75');
  });

  it('End ile end thumb max değere gider', () => {
    render(<RangeSlider aria-label="Test" value={[20, 80]} max={100} />);
    const end = screen.getAllByRole('slider')[1];

    fireEvent.keyDown(end, { key: 'End' });
    expect(end).toHaveAttribute('aria-valuenow', '100');
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda doğru attribute set edilir', () => {
    render(<RangeSlider aria-label="Test" disabled />);
    const sliders = screen.getAllByRole('slider');

    expect(sliders[0]).toHaveAttribute('aria-disabled', 'true');
    expect(sliders[0]).toHaveAttribute('data-disabled', '');
    expect(sliders[1]).toHaveAttribute('aria-disabled', 'true');
    expect(sliders[1]).toHaveAttribute('data-disabled', '');
  });

  // ──────────────────────────────────────────
  // ReadOnly
  // ──────────────────────────────────────────

  it('readOnly durumda doğru attribute set edilir', () => {
    render(<RangeSlider aria-label="Test" readOnly />);
    const sliders = screen.getAllByRole('slider');

    expect(sliders[0]).toHaveAttribute('aria-readonly', 'true');
    expect(sliders[0]).toHaveAttribute('data-readonly', '');
    expect(sliders[1]).toHaveAttribute('aria-readonly', 'true');
  });

  // ──────────────────────────────────────────
  // Invalid
  // ──────────────────────────────────────────

  it('invalid durumda doğru attribute set edilir', () => {
    render(<RangeSlider aria-label="Test" invalid />);
    const sliders = screen.getAllByRole('slider');

    expect(sliders[0]).toHaveAttribute('aria-invalid', 'true');
    expect(sliders[0]).toHaveAttribute('data-invalid', '');
    expect(sliders[1]).toHaveAttribute('aria-invalid', 'true');
  });

  // ──────────────────────────────────────────
  // Callback
  // ──────────────────────────────────────────

  it('onValueChange — klavye ile çağrılır (start)', () => {
    const handleChange = vi.fn();
    render(
      <RangeSlider
        aria-label="Test"
        value={[20, 80]}
        step={1}
        onValueChange={handleChange}
      />,
    );
    const start = screen.getAllByRole('slider')[0];

    fireEvent.keyDown(start, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith([21, 80]);
  });

  it('onValueChange — klavye ile çağrılır (end)', () => {
    const handleChange = vi.fn();
    render(
      <RangeSlider
        aria-label="Test"
        value={[20, 80]}
        step={1}
        onValueChange={handleChange}
      />,
    );
    const end = screen.getAllByRole('slider')[1];

    fireEvent.keyDown(end, { key: 'ArrowLeft' });
    expect(handleChange).toHaveBeenCalledWith([20, 79]);
  });

  // ──────────────────────────────────────────
  // Hidden input (form entegrasyonu)
  // ──────────────────────────────────────────

  it('name prop ile iki hidden input render eder', () => {
    render(<RangeSlider aria-label="Test" name="price" value={[20, 80]} />);

    const startInput = document.querySelector('input[type="range"][name="price-start"]');
    const endInput = document.querySelector('input[type="range"][name="price-end"]');

    expect(startInput).toBeInTheDocument();
    expect(endInput).toBeInTheDocument();
    expect(startInput).toHaveAttribute('aria-hidden', 'true');
    expect(endInput).toHaveAttribute('aria-hidden', 'true');
  });

  it('name prop yoksa hidden input render etmez', () => {
    render(<RangeSlider aria-label="Test" />);

    const hidden = document.querySelector('input[type="range"]');
    expect(hidden).not.toBeInTheDocument();
  });

  it('hidden input value doğru yansıtılır', () => {
    render(<RangeSlider aria-label="Test" name="price" value={[25, 75]} />);

    const startInput = document.querySelector(
      'input[name="price-start"]',
    ) as HTMLInputElement;
    const endInput = document.querySelector(
      'input[name="price-end"]',
    ) as HTMLInputElement;

    expect(startInput.value).toBe('25');
    expect(endInput.value).toBe('75');
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id doğru iletilir', () => {
    const { container } = render(<RangeSlider aria-label="Test" id="my-range" />);

    expect(container.querySelector('#my-range')).toBeInTheDocument();
  });

  it('className doğru iletilir', () => {
    const { container } = render(<RangeSlider aria-label="Test" className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    const { container } = render(
      <RangeSlider aria-label="Test" classNames={{ root: 'slot-root' }} />,
    );

    expect(container.firstChild).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = render(
      <RangeSlider aria-label="Test" styles={{ root: { padding: '10px' } }} />,
    );

    expect(container.firstChild).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = render(
      <RangeSlider aria-label="Test" className="legacy" classNames={{ root: 'slot-root' }} />,
    );
    const el = container.firstChild as HTMLElement;

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('classNames.track uygulanir', () => {
    const { container } = render(
      <RangeSlider aria-label="Test" classNames={{ track: 'my-track' }} />,
    );
    const root = container.firstChild as HTMLElement;
    const track = root.querySelector('[data-orientation]') as HTMLElement;

    expect(track).toHaveClass('my-track');
  });

  it('classNames.startThumb uygulanir', () => {
    render(
      <RangeSlider aria-label="Test" classNames={{ startThumb: 'my-start' }} />,
    );
    const sliders = screen.getAllByRole('slider');

    expect(sliders[0]).toHaveClass('my-start');
  });

  it('styles.endThumb uygulanir', () => {
    render(
      <RangeSlider aria-label="Test" styles={{ endThumb: { boxShadow: '0 0 5px blue' } }} />,
    );
    const sliders = screen.getAllByRole('slider');

    expect(sliders[1]).toHaveStyle({ boxShadow: '0 0 5px blue' });
  });
});
