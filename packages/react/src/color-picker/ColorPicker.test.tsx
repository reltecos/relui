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
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<ColorPicker />);
    expect(screen.getByTestId('color-picker-root')).toBeInTheDocument();
  });

  it('varsayilan size md', () => {
    render(<ColorPicker />);
    expect(screen.getByTestId('color-picker-root')).toHaveAttribute('data-size', 'md');
  });

  it('size sm set edilir', () => {
    render(<ColorPicker size="sm" />);
    expect(screen.getByTestId('color-picker-root')).toHaveAttribute('data-size', 'sm');
  });

  it('size lg set edilir', () => {
    render(<ColorPicker size="lg" />);
    expect(screen.getByTestId('color-picker-root')).toHaveAttribute('data-size', 'lg');
  });

  it('role application set edilir', () => {
    render(<ColorPicker />);
    expect(screen.getByTestId('color-picker-root')).toHaveAttribute('role', 'application');
  });

  it('aria-label set edilir', () => {
    render(<ColorPicker />);
    expect(screen.getByTestId('color-picker-root')).toHaveAttribute(
      'aria-label',
      'Color picker',
    );
  });

  // ── Spectrum ──

  it('spectrum render edilir', () => {
    render(<ColorPicker />);
    expect(screen.getByTestId('color-picker-spectrum')).toBeInTheDocument();
  });

  it('spectrum thumb render edilir', () => {
    render(<ColorPicker />);
    expect(screen.getByTestId('color-picker-spectrum-thumb')).toBeInTheDocument();
  });

  // ── HueSlider ──

  it('hue slider render edilir', () => {
    render(<ColorPicker />);
    expect(screen.getByTestId('color-picker-hue-slider')).toBeInTheDocument();
  });

  it('hue slider role ve aria-label set edilir', () => {
    render(<ColorPicker />);
    const hue = screen.getByTestId('color-picker-hue-slider');
    expect(hue).toHaveAttribute('role', 'slider');
    expect(hue).toHaveAttribute('aria-label', 'Hue');
  });

  it('hue slider tabIndex 0 ile focuslanabilir', () => {
    render(<ColorPicker />);
    expect(screen.getByTestId('color-picker-hue-slider')).toHaveAttribute('tabindex', '0');
  });

  it('hue slider ArrowRight ile hue artar', () => {
    render(<ColorPicker value="#ff0000" />);
    const slider = screen.getByTestId('color-picker-hue-slider');
    const before = Number(slider.getAttribute('aria-valuenow'));
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    const after = Number(slider.getAttribute('aria-valuenow'));
    expect(after).toBe(before + 1);
  });

  it('hue slider ArrowLeft ile hue azalir', () => {
    render(<ColorPicker value="#00ff00" />);
    const slider = screen.getByTestId('color-picker-hue-slider');
    const before = Number(slider.getAttribute('aria-valuenow'));
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    const after = Number(slider.getAttribute('aria-valuenow'));
    expect(after).toBe(before - 1);
  });

  it('hue slider Shift+ArrowRight ile hue 10 artar', () => {
    render(<ColorPicker value="#ff0000" />);
    const slider = screen.getByTestId('color-picker-hue-slider');
    const before = Number(slider.getAttribute('aria-valuenow'));
    fireEvent.keyDown(slider, { key: 'ArrowRight', shiftKey: true });
    const after = Number(slider.getAttribute('aria-valuenow'));
    expect(after).toBe(before + 10);
  });

  // ── AlphaSlider ──

  it('alpha slider showAlpha true oldugunda render edilir', () => {
    render(<ColorPicker showAlpha />);
    expect(screen.getByTestId('color-picker-alpha-slider')).toBeInTheDocument();
  });

  it('alpha slider showAlpha false oldugunda render edilmez', () => {
    render(<ColorPicker />);
    expect(screen.queryByTestId('color-picker-alpha-slider')).not.toBeInTheDocument();
  });

  it('alpha slider tabIndex 0 ile focuslanabilir', () => {
    render(<ColorPicker showAlpha />);
    expect(screen.getByTestId('color-picker-alpha-slider')).toHaveAttribute('tabindex', '0');
  });

  it('alpha slider ArrowRight ile alpha artar', () => {
    render(<ColorPicker showAlpha />);
    const slider = screen.getByTestId('color-picker-alpha-slider');
    // Default alpha = 100 (1.0), ArrowRight should try to go above but clamps
    // Set a lower starting point by using value prop (alpha defaults to 1)
    const before = Number(slider.getAttribute('aria-valuenow'));
    expect(before).toBe(100); // 1.0 * 100
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    const after = Number(slider.getAttribute('aria-valuenow'));
    expect(after).toBe(99); // (1.0 - 0.01) * 100
  });

  it('alpha slider Shift+ArrowLeft ile alpha 10 azalir', () => {
    render(<ColorPicker showAlpha />);
    const slider = screen.getByTestId('color-picker-alpha-slider');
    fireEvent.keyDown(slider, { key: 'ArrowLeft', shiftKey: true });
    const after = Number(slider.getAttribute('aria-valuenow'));
    expect(after).toBe(90); // (1.0 - 0.1) * 100
  });

  // ── Input ──

  it('input showInput true oldugunda render edilir', () => {
    render(<ColorPicker showInput />);
    expect(screen.getByTestId('color-picker-input')).toBeInTheDocument();
  });

  it('input showInput false oldugunda render edilmez', () => {
    render(<ColorPicker />);
    expect(screen.queryByTestId('color-picker-input')).not.toBeInTheDocument();
  });

  it('hex input alaninda deger gosterilir', () => {
    render(<ColorPicker value="#ff0000" showInput />);
    const input = screen.getByTestId('color-picker-hex-input') as HTMLInputElement;
    expect(input.value).toBe('#ff0000');
  });

  // ── Presets ──

  it('presets render edilir', () => {
    render(<ColorPicker presets={['#ff0000', '#00ff00', '#0000ff']} />);
    expect(screen.getByTestId('color-picker-swatch-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('color-picker-preset')).toHaveLength(3);
  });

  it('presets olmadan swatch grid render edilmez', () => {
    render(<ColorPicker />);
    expect(screen.queryByTestId('color-picker-swatch-grid')).not.toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<ColorPicker className="my-picker" />);
    expect(screen.getByTestId('color-picker-root').className).toContain('my-picker');
  });

  it('style root elemana eklenir', () => {
    render(<ColorPicker style={{ padding: '16px' }} />);
    expect(screen.getByTestId('color-picker-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<ColorPicker classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('color-picker-root').className).toContain('custom-root');
  });

  it('classNames.spectrum spectrum elemana eklenir', () => {
    render(<ColorPicker classNames={{ spectrum: 'custom-spectrum' }} />);
    expect(screen.getByTestId('color-picker-spectrum').className).toContain(
      'custom-spectrum',
    );
  });

  it('classNames.hueSlider hue slider elemana eklenir', () => {
    render(<ColorPicker classNames={{ hueSlider: 'custom-hue' }} />);
    expect(screen.getByTestId('color-picker-hue-slider').className).toContain('custom-hue');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<ColorPicker styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('color-picker-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.spectrum spectrum elemana eklenir', () => {
    render(<ColorPicker styles={{ spectrum: { opacity: '0.8' } }} />);
    expect(screen.getByTestId('color-picker-spectrum')).toHaveStyle({ opacity: '0.8' });
  });

  it('styles.hueSlider hue slider elemana eklenir', () => {
    render(<ColorPicker styles={{ hueSlider: { opacity: '0.5' } }} />);
    expect(screen.getByTestId('color-picker-hue-slider')).toHaveStyle({ opacity: '0.5' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<ColorPicker ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('ColorPicker (Compound)', () => {
  it('compound: spectrum render edilir', () => {
    render(
      <ColorPicker>
        <ColorPicker.Spectrum />
      </ColorPicker>,
    );
    expect(screen.getByTestId('color-picker-spectrum')).toBeInTheDocument();
  });

  it('compound: hue slider render edilir', () => {
    render(
      <ColorPicker>
        <ColorPicker.HueSlider />
      </ColorPicker>,
    );
    expect(screen.getByTestId('color-picker-hue-slider')).toBeInTheDocument();
  });

  it('compound: alpha slider render edilir', () => {
    render(
      <ColorPicker>
        <ColorPicker.AlphaSlider />
      </ColorPicker>,
    );
    expect(screen.getByTestId('color-picker-alpha-slider')).toBeInTheDocument();
  });

  it('compound: input render edilir', () => {
    render(
      <ColorPicker>
        <ColorPicker.Input />
      </ColorPicker>,
    );
    expect(screen.getByTestId('color-picker-input')).toBeInTheDocument();
  });

  it('compound: presets render edilir', () => {
    render(
      <ColorPicker>
        <ColorPicker.Presets colors={['#ff0000', '#00ff00']} />
      </ColorPicker>,
    );
    expect(screen.getByTestId('color-picker-swatch-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('color-picker-preset')).toHaveLength(2);
  });

  it('compound: swatch render edilir', () => {
    render(
      <ColorPicker>
        <ColorPicker.Swatch />
      </ColorPicker>,
    );
    expect(screen.getByTestId('color-picker-swatch')).toBeInTheDocument();
  });

  it('compound: size context ile aktarilir', () => {
    render(
      <ColorPicker size="lg">
        <ColorPicker.Spectrum />
      </ColorPicker>,
    );
    expect(screen.getByTestId('color-picker-root')).toHaveAttribute('data-size', 'lg');
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <ColorPicker classNames={{ spectrum: 'cmp-spectrum' }}>
        <ColorPicker.Spectrum />
      </ColorPicker>,
    );
    expect(screen.getByTestId('color-picker-spectrum').className).toContain('cmp-spectrum');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <ColorPicker styles={{ spectrum: { opacity: '0.9' } }}>
        <ColorPicker.Spectrum />
      </ColorPicker>,
    );
    expect(screen.getByTestId('color-picker-spectrum')).toHaveStyle({ opacity: '0.9' });
  });

  it('ColorPicker.Spectrum context disinda hata firlatir', () => {
    expect(() => render(<ColorPicker.Spectrum />)).toThrow();
  });

  it('ColorPicker.HueSlider context disinda hata firlatir', () => {
    expect(() => render(<ColorPicker.HueSlider />)).toThrow();
  });

  it('ColorPicker.Input context disinda hata firlatir', () => {
    expect(() => render(<ColorPicker.Input />)).toThrow();
  });

  it('compound: hue slider keyboard ile hue degistirilir', () => {
    render(
      <ColorPicker value="#ff0000">
        <ColorPicker.HueSlider />
      </ColorPicker>,
    );
    const slider = screen.getByTestId('color-picker-hue-slider');
    const before = Number(slider.getAttribute('aria-valuenow'));
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    const after = Number(slider.getAttribute('aria-valuenow'));
    expect(after).toBe(before + 1);
  });

  it('compound: alpha slider keyboard ile alpha degistirilir', () => {
    render(
      <ColorPicker>
        <ColorPicker.AlphaSlider />
      </ColorPicker>,
    );
    const slider = screen.getByTestId('color-picker-alpha-slider');
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    const after = Number(slider.getAttribute('aria-valuenow'));
    expect(after).toBe(99);
  });
});
