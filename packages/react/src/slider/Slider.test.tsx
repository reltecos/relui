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
import { Slider } from './Slider';

describe('Slider', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(<Slider aria-label="Test" />);
    const slider = screen.getByRole('slider');

    expect(slider).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // ARIA attributes
  // ──────────────────────────────────────────

  it('role=slider set edilir', () => {
    render(<Slider aria-label="Test" />);

    expect(screen.getByRole('slider')).toHaveAttribute('role', 'slider');
  });

  it('aria-valuemin/max/now doğru set edilir', () => {
    render(<Slider aria-label="Test" min={10} max={90} value={50} />);
    const slider = screen.getByRole('slider');

    expect(slider).toHaveAttribute('aria-valuemin', '10');
    expect(slider).toHaveAttribute('aria-valuemax', '90');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  it('aria-orientation doğru set edilir', () => {
    render(<Slider aria-label="Test" orientation="vertical" />);
    const slider = screen.getByRole('slider');

    expect(slider).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('aria-label doğru set edilir', () => {
    render(<Slider aria-label="Ses seviyesi" />);

    expect(screen.getByRole('slider')).toHaveAttribute('aria-label', 'Ses seviyesi');
  });

  it('aria-valuetext doğru set edilir', () => {
    render(<Slider aria-label="Test" aria-valuetext="50 derece" value={50} />);

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '50 derece');
  });

  it('tabIndex=0 set edilir', () => {
    render(<Slider aria-label="Test" />);

    expect(screen.getByRole('slider')).toHaveAttribute('tabindex', '0');
  });

  // ──────────────────────────────────────────
  // Keyboard
  // ──────────────────────────────────────────

  it('ArrowRight ile artırır', () => {
    render(<Slider aria-label="Test" value={50} step={5} />);
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider).toHaveAttribute('aria-valuenow', '55');
  });

  it('ArrowLeft ile azaltır', () => {
    render(<Slider aria-label="Test" value={50} step={5} />);
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(slider).toHaveAttribute('aria-valuenow', '45');
  });

  it('Home ile min değere gider', () => {
    render(<Slider aria-label="Test" value={50} min={0} />);
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'Home' });
    expect(slider).toHaveAttribute('aria-valuenow', '0');
  });

  it('End ile max değere gider', () => {
    render(<Slider aria-label="Test" value={50} max={100} />);
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider).toHaveAttribute('aria-valuenow', '100');
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda doğru attribute set edilir', () => {
    render(<Slider aria-label="Test" disabled />);
    const slider = screen.getByRole('slider');

    expect(slider).toHaveAttribute('aria-disabled', 'true');
    expect(slider).toHaveAttribute('data-disabled', '');
  });

  // ──────────────────────────────────────────
  // ReadOnly
  // ──────────────────────────────────────────

  it('readOnly durumda doğru attribute set edilir', () => {
    render(<Slider aria-label="Test" readOnly />);
    const slider = screen.getByRole('slider');

    expect(slider).toHaveAttribute('aria-readonly', 'true');
    expect(slider).toHaveAttribute('data-readonly', '');
  });

  // ──────────────────────────────────────────
  // Invalid
  // ──────────────────────────────────────────

  it('invalid durumda doğru attribute set edilir', () => {
    render(<Slider aria-label="Test" invalid />);
    const slider = screen.getByRole('slider');

    expect(slider).toHaveAttribute('aria-invalid', 'true');
    expect(slider).toHaveAttribute('data-invalid', '');
  });

  // ──────────────────────────────────────────
  // Callback
  // ──────────────────────────────────────────

  it('onValueChange — klavye ile çağrılır', () => {
    const handleChange = vi.fn();
    render(<Slider aria-label="Test" value={50} step={1} onValueChange={handleChange} />);
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith(51);
  });

  // ──────────────────────────────────────────
  // Hidden input (form entegrasyonu)
  // ──────────────────────────────────────────

  it('name prop ile hidden input render eder', () => {
    render(<Slider aria-label="Test" name="volume" value={50} />);

    const hidden = document.querySelector('input[type="range"][name="volume"]');
    expect(hidden).toBeInTheDocument();
    expect(hidden).toHaveAttribute('aria-hidden', 'true');
  });

  it('name prop yoksa hidden input render etmez', () => {
    render(<Slider aria-label="Test" />);

    const hidden = document.querySelector('input[type="range"]');
    expect(hidden).not.toBeInTheDocument();
  });

  it('hidden input value doğru yansıtılır', () => {
    render(<Slider aria-label="Test" name="volume" value={75} />);

    const hidden = document.querySelector('input[type="range"]') as HTMLInputElement;
    expect(hidden.value).toBe('75');
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id doğru iletilir / id is forwarded correctly', () => {
    const { container } = render(<Slider aria-label="Test" id="my-slider" />);

    expect(container.querySelector('#my-slider')).toBeInTheDocument();
  });

  it('className doğru iletilir / className is forwarded correctly', () => {
    const { container } = render(<Slider aria-label="Test" className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    const { container } = render(
      <Slider aria-label="Test" classNames={{ root: 'slot-root' }} />,
    );

    expect(container.firstChild).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = render(
      <Slider aria-label="Test" styles={{ root: { padding: '10px' } }} />,
    );

    expect(container.firstChild).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = render(
      <Slider aria-label="Test" className="legacy" classNames={{ root: 'slot-root' }} />,
    );
    const el = container.firstChild as HTMLElement;

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('classNames.track uygulanir', () => {
    const { container } = render(
      <Slider aria-label="Test" classNames={{ track: 'my-track' }} />,
    );
    const root = container.firstChild as HTMLElement;
    const track = root.querySelector('[data-orientation]') as HTMLElement;

    expect(track).toHaveClass('my-track');
  });

  it('styles.thumb uygulanir', () => {
    render(
      <Slider aria-label="Test" styles={{ thumb: { boxShadow: '0 0 5px red' } }} />,
    );
    const thumb = screen.getByRole('slider');

    expect(thumb).toHaveStyle({ boxShadow: '0 0 5px red' });
  });

  it('styles.fill uygulanir', () => {
    const { container } = render(
      <Slider aria-label="Test" value={50} styles={{ fill: { opacity: '0.5' } }} />,
    );
    const root = container.firstChild as HTMLElement;
    const track = root.querySelector('[data-orientation]') as HTMLElement;
    const fill = track.firstChild as HTMLElement;

    expect(fill).toHaveStyle({ opacity: '0.5' });
  });
});

// ── Compound API ──

describe('Slider (Compound)', () => {
  it('compound: track render edilir', () => {
    render(
      <Slider aria-label="Test" value={50}>
        <Slider.Track />
        <Slider.Thumb aria-label="Test" />
      </Slider>,
    );
    expect(screen.getByTestId('slider-track')).toBeInTheDocument();
    expect(screen.getByTestId('slider-fill')).toBeInTheDocument();
  });

  it('compound: thumb render edilir', () => {
    render(
      <Slider aria-label="Test" value={50}>
        <Slider.Track />
        <Slider.Thumb aria-label="Test" />
      </Slider>,
    );
    expect(screen.getByTestId('slider-thumb')).toBeInTheDocument();
  });

  it('compound: label render edilir', () => {
    render(
      <Slider aria-label="Test" value={50}>
        <Slider.Track />
        <Slider.Thumb aria-label="Test" />
        <Slider.Label>50</Slider.Label>
      </Slider>,
    );
    expect(screen.getByTestId('slider-label')).toHaveTextContent('50');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Slider aria-label="Test" value={50} classNames={{ track: 'cmp-track' }}>
        <Slider.Track />
        <Slider.Thumb aria-label="Test" />
      </Slider>,
    );
    expect(screen.getByTestId('slider-track').className).toContain('cmp-track');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Slider aria-label="Test" value={50} styles={{ thumb: { boxShadow: '0 0 5px blue' } }}>
        <Slider.Track />
        <Slider.Thumb aria-label="Test" />
      </Slider>,
    );
    expect(screen.getByTestId('slider-thumb')).toHaveStyle({ boxShadow: '0 0 5px blue' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Slider aria-label="Test" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('Slider.Track context disinda hata firlatir', () => {
    expect(() => render(<Slider.Track />)).toThrow();
  });
});
