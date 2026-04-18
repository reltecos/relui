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
import { FontPicker } from './FontPicker';

describe('FontPicker', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<FontPicker />);
    expect(screen.getByTestId('font-picker-root')).toBeInTheDocument();
  });

  // ── Family Select ──

  it('family select render edilir', () => {
    render(<FontPicker />);
    expect(screen.getByTestId('font-picker-family')).toBeInTheDocument();
  });

  it('family select varsayilan Arial', () => {
    render(<FontPicker />);
    expect(screen.getByTestId('font-picker-family')).toHaveValue('Arial');
  });

  it('family degistirilir', () => {
    render(<FontPicker />);
    fireEvent.change(screen.getByTestId('font-picker-family'), { target: { value: 'Georgia' } });
    expect(screen.getByTestId('font-picker-family')).toHaveValue('Georgia');
  });

  it('ozel font listesi kullanilir', () => {
    render(<FontPicker fonts={['MyFont', 'OtherFont']} />);
    const options = screen.getByTestId('font-picker-family').querySelectorAll('option');
    expect(options).toHaveLength(2);
  });

  // ── Size Input ──

  it('size input render edilir', () => {
    render(<FontPicker />);
    expect(screen.getByTestId('font-picker-size')).toBeInTheDocument();
  });

  it('size varsayilan 16', () => {
    render(<FontPicker />);
    expect(screen.getByTestId('font-picker-size')).toHaveValue(16);
  });

  it('size degistirilir', () => {
    render(<FontPicker />);
    fireEvent.change(screen.getByTestId('font-picker-size'), { target: { value: '24' } });
    expect(screen.getByTestId('font-picker-size')).toHaveValue(24);
  });

  // ── Style Toggle ──

  it('style toggle render edilir', () => {
    render(<FontPicker />);
    expect(screen.getByTestId('font-picker-style-toggle')).toBeInTheDocument();
  });

  it('bold toggle tiklanir', () => {
    render(<FontPicker />);
    const boldBtn = screen.getByTestId('font-picker-bold');
    expect(boldBtn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(boldBtn);
    expect(boldBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('italic toggle tiklanir', () => {
    render(<FontPicker />);
    fireEvent.click(screen.getByTestId('font-picker-italic'));
    expect(screen.getByTestId('font-picker-italic')).toHaveAttribute('aria-pressed', 'true');
  });

  it('underline toggle tiklanir', () => {
    render(<FontPicker />);
    fireEvent.click(screen.getByTestId('font-picker-underline'));
    expect(screen.getByTestId('font-picker-underline')).toHaveAttribute('aria-pressed', 'true');
  });

  // ── Preview ──

  it('preview render edilir', () => {
    render(<FontPicker />);
    expect(screen.getByTestId('font-picker-preview')).toBeInTheDocument();
  });

  it('showPreview false ile preview gizlenir', () => {
    render(<FontPicker showPreview={false} />);
    expect(screen.queryByTestId('font-picker-preview')).not.toBeInTheDocument();
  });

  it('preview font stilini yansitir', () => {
    render(<FontPicker defaultConfig={{ family: 'Georgia', size: 24, bold: true }} />);
    const preview = screen.getByTestId('font-picker-preview');
    expect(preview.style.fontFamily).toBe('Georgia');
  });

  // ── Labels ──

  it('label lar render edilir', () => {
    render(<FontPicker />);
    const labels = screen.getAllByTestId('font-picker-label');
    expect(labels.length).toBeGreaterThanOrEqual(3);
  });

  // ── Callback ──

  it('onChange callback cagrilir', () => {
    const onChange = vi.fn();
    render(<FontPicker onChange={onChange} />);
    fireEvent.change(screen.getByTestId('font-picker-size'), { target: { value: '20' } });
    expect(onChange).toHaveBeenCalled();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<FontPicker className="my-fp" />);
    expect(screen.getByTestId('font-picker-root').className).toContain('my-fp');
  });

  it('style root elemana eklenir', () => {
    render(<FontPicker style={{ padding: '16px' }} />);
    expect(screen.getByTestId('font-picker-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<FontPicker classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('font-picker-root').className).toContain('custom-root');
  });

  it('classNames.familySelect familySelect elemana eklenir', () => {
    render(<FontPicker classNames={{ familySelect: 'custom-fam' }} />);
    expect(screen.getByTestId('font-picker-family').className).toContain('custom-fam');
  });

  it('classNames.sizeInput sizeInput elemana eklenir', () => {
    render(<FontPicker classNames={{ sizeInput: 'custom-size' }} />);
    expect(screen.getByTestId('font-picker-size').className).toContain('custom-size');
  });

  it('classNames.preview preview elemana eklenir', () => {
    render(<FontPicker classNames={{ preview: 'custom-prev' }} />);
    expect(screen.getByTestId('font-picker-preview').className).toContain('custom-prev');
  });

  it('classNames.label label elemana eklenir', () => {
    render(<FontPicker classNames={{ label: 'custom-lbl' }} />);
    expect(screen.getAllByTestId('font-picker-label')[0].className).toContain('custom-lbl');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<FontPicker styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('font-picker-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.familySelect familySelect elemana eklenir', () => {
    render(<FontPicker styles={{ familySelect: { fontSize: '18px' } }} />);
    // Note: fontFamily da inline olarak eklenir, style merge ile calismali
    expect(screen.getByTestId('font-picker-family')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.sizeInput sizeInput elemana eklenir', () => {
    render(<FontPicker styles={{ sizeInput: { fontWeight: '600' } }} />);
    expect(screen.getByTestId('font-picker-size')).toHaveStyle({ fontWeight: '600' });
  });

  it('styles.preview preview elemana eklenir', () => {
    render(<FontPicker styles={{ preview: { padding: '24px' } }} />);
    expect(screen.getByTestId('font-picker-preview')).toHaveStyle({ padding: '24px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<FontPicker ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('FontPicker (Compound)', () => {
  it('compound: family select render edilir', () => {
    render(
      <FontPicker>
        <FontPicker.FamilySelect />
      </FontPicker>,
    );
    expect(screen.getByTestId('font-picker-family')).toBeInTheDocument();
  });

  it('compound: size input render edilir', () => {
    render(
      <FontPicker>
        <FontPicker.SizeInput />
      </FontPicker>,
    );
    expect(screen.getByTestId('font-picker-size')).toBeInTheDocument();
  });

  it('compound: style toggle render edilir', () => {
    render(
      <FontPicker>
        <FontPicker.StyleToggle />
      </FontPicker>,
    );
    expect(screen.getByTestId('font-picker-style-toggle')).toBeInTheDocument();
  });

  it('compound: preview render edilir', () => {
    render(
      <FontPicker>
        <FontPicker.Preview text="Custom preview text" />
      </FontPicker>,
    );
    expect(screen.getByTestId('font-picker-preview')).toHaveTextContent('Custom preview text');
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <FontPicker classNames={{ familySelect: 'cmp-fam' }}>
        <FontPicker.FamilySelect />
      </FontPicker>,
    );
    expect(screen.getByTestId('font-picker-family').className).toContain('cmp-fam');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <FontPicker styles={{ sizeInput: { fontWeight: '700' } }}>
        <FontPicker.SizeInput />
      </FontPicker>,
    );
    expect(screen.getByTestId('font-picker-size')).toHaveStyle({ fontWeight: '700' });
  });

  it('FontPicker.FamilySelect context disinda hata firlatir', () => {
    expect(() => render(<FontPicker.FamilySelect />)).toThrow();
  });
});
