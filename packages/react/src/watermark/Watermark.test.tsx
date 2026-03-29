/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Watermark } from './Watermark';

describe('Watermark', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Watermark text="GIZLI"><p>Icerik</p></Watermark>);
    expect(screen.getByTestId('watermark-root')).toBeInTheDocument();
  });

  it('varsayilan size md', () => {
    render(<Watermark text="TEST"><p>Icerik</p></Watermark>);
    expect(screen.getByTestId('watermark-root')).toHaveAttribute('data-size', 'md');
  });

  it('size sm set edilir', () => {
    render(<Watermark text="TEST" size="sm"><p>Icerik</p></Watermark>);
    expect(screen.getByTestId('watermark-root')).toHaveAttribute('data-size', 'sm');
  });

  it('size lg set edilir', () => {
    render(<Watermark text="TEST" size="lg"><p>Icerik</p></Watermark>);
    expect(screen.getByTestId('watermark-root')).toHaveAttribute('data-size', 'lg');
  });

  // ── Content ──

  it('children content icinde render edilir', () => {
    render(<Watermark text="GIZLI"><p>Merhaba</p></Watermark>);
    expect(screen.getByTestId('watermark-content')).toBeInTheDocument();
    expect(screen.getByText('Merhaba')).toBeInTheDocument();
  });

  // ── Overlay ──

  it('overlay render edilir', () => {
    render(<Watermark text="GIZLI"><p>Icerik</p></Watermark>);
    expect(screen.getByTestId('watermark-overlay')).toBeInTheDocument();
  });

  it('overlay aria-hidden true', () => {
    render(<Watermark text="GIZLI"><p>Icerik</p></Watermark>);
    expect(screen.getByTestId('watermark-overlay')).toHaveAttribute('aria-hidden', 'true');
  });

  it('overlay backgroundImage SVG data URI icerir', () => {
    render(<Watermark text="TEST"><p>Icerik</p></Watermark>);
    const overlay = screen.getByTestId('watermark-overlay');
    const bg = overlay.style.backgroundImage;
    expect(bg).toContain('data:image/svg+xml');
    expect(bg).toContain('TEST');
  });

  it('text degisince backgroundImage guncellenir', () => {
    const { rerender } = render(<Watermark text="AAA"><p>Icerik</p></Watermark>);
    const bg1 = screen.getByTestId('watermark-overlay').style.backgroundImage;
    expect(bg1).toContain('AAA');

    rerender(<Watermark text="BBB"><p>Icerik</p></Watermark>);
    const bg2 = screen.getByTestId('watermark-overlay').style.backgroundImage;
    expect(bg2).toContain('BBB');
    expect(bg2).not.toContain('AAA');
  });

  // ── Rotate & Opacity ──

  it('rotate parametresi SVG icinde kullanilir', () => {
    render(<Watermark text="TEST" rotate={-45}><p>Icerik</p></Watermark>);
    const bg = screen.getByTestId('watermark-overlay').style.backgroundImage;
    expect(bg).toContain('rotate(-45');
  });

  it('varsayilan rotate -22', () => {
    render(<Watermark text="TEST"><p>Icerik</p></Watermark>);
    const bg = screen.getByTestId('watermark-overlay').style.backgroundImage;
    expect(bg).toContain('rotate(-22');
  });

  it('opacity parametresi SVG icinde kullanilir', () => {
    render(<Watermark text="TEST" opacity={0.3}><p>Icerik</p></Watermark>);
    const bg = screen.getByTestId('watermark-overlay').style.backgroundImage;
    expect(bg).toContain(encodeURIComponent('opacity="0.3"'));
  });

  it('varsayilan opacity 0.15', () => {
    render(<Watermark text="TEST"><p>Icerik</p></Watermark>);
    const bg = screen.getByTestId('watermark-overlay').style.backgroundImage;
    expect(bg).toContain(encodeURIComponent('opacity="0.15"'));
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Watermark text="T" className="my-wm"><p>X</p></Watermark>);
    expect(screen.getByTestId('watermark-root').className).toContain('my-wm');
  });

  it('style root elemana eklenir', () => {
    render(<Watermark text="T" style={{ padding: '16px' }}><p>X</p></Watermark>);
    expect(screen.getByTestId('watermark-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Watermark text="T" classNames={{ root: 'custom-root' }}><p>X</p></Watermark>);
    expect(screen.getByTestId('watermark-root').className).toContain('custom-root');
  });

  it('classNames.content content elemana eklenir', () => {
    render(<Watermark text="T" classNames={{ content: 'custom-content' }}><p>X</p></Watermark>);
    expect(screen.getByTestId('watermark-content').className).toContain('custom-content');
  });

  it('classNames.overlay overlay elemana eklenir', () => {
    render(<Watermark text="T" classNames={{ overlay: 'custom-overlay' }}><p>X</p></Watermark>);
    expect(screen.getByTestId('watermark-overlay').className).toContain('custom-overlay');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Watermark text="T" styles={{ root: { padding: '24px' } }}><p>X</p></Watermark>);
    expect(screen.getByTestId('watermark-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.content content elemana eklenir', () => {
    render(<Watermark text="T" styles={{ content: { padding: '12px' } }}><p>X</p></Watermark>);
    expect(screen.getByTestId('watermark-content')).toHaveStyle({ padding: '12px' });
  });

  it('styles.overlay overlay elemana eklenir', () => {
    render(<Watermark text="T" styles={{ overlay: { opacity: '0.5' } }}><p>X</p></Watermark>);
    expect(screen.getByTestId('watermark-overlay')).toHaveStyle({ opacity: '0.5' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Watermark text="T" ref={ref}><p>X</p></Watermark>);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Watermark (Compound)', () => {
  it('compound: content render edilir', () => {
    render(
      <Watermark>
        <Watermark.Content>Icerik burada</Watermark.Content>
      </Watermark>,
    );
    expect(screen.getByTestId('watermark-content')).toHaveTextContent('Icerik burada');
  });

  it('compound: overlay render edilir', () => {
    render(
      <Watermark>
        <Watermark.Content>Icerik</Watermark.Content>
        <Watermark.Overlay>Ozel filigran</Watermark.Overlay>
      </Watermark>,
    );
    expect(screen.getByTestId('watermark-overlay')).toHaveTextContent('Ozel filigran');
    expect(screen.getByTestId('watermark-overlay')).toHaveAttribute('aria-hidden', 'true');
  });

  it('compound: content ve overlay birlikte render edilir', () => {
    render(
      <Watermark size="lg">
        <Watermark.Content>Belge</Watermark.Content>
        <Watermark.Overlay>TASLAK</Watermark.Overlay>
      </Watermark>,
    );
    expect(screen.getByTestId('watermark-content')).toBeInTheDocument();
    expect(screen.getByTestId('watermark-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('watermark-root')).toHaveAttribute('data-size', 'lg');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Watermark classNames={{ content: 'cmp-content' }}>
        <Watermark.Content>Test</Watermark.Content>
      </Watermark>,
    );
    expect(screen.getByTestId('watermark-content').className).toContain('cmp-content');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Watermark styles={{ overlay: { opacity: '0.8' } }}>
        <Watermark.Content>Test</Watermark.Content>
        <Watermark.Overlay>WM</Watermark.Overlay>
      </Watermark>,
    );
    expect(screen.getByTestId('watermark-overlay')).toHaveStyle({ opacity: '0.8' });
  });

  it('Watermark.Content context disinda hata firlatir', () => {
    expect(() => render(<Watermark.Content>Hata</Watermark.Content>)).toThrow();
  });

  it('Watermark.Overlay context disinda hata firlatir', () => {
    expect(() => render(<Watermark.Overlay>Hata</Watermark.Overlay>)).toThrow();
  });
});
