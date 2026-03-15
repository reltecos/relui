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
import { Avatar, getInitials, getColorFromName } from './Avatar';

describe('Avatar', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Avatar name="Ali Veli" />);
    expect(screen.getByTestId('avatar-root')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-root')).toHaveAttribute('role', 'img');
  });

  // ── Props-based: Image ──

  it('src verilince image render edilir', () => {
    render(<Avatar src="/photo.jpg" name="Ali Veli" />);
    const img = screen.getByTestId('avatar-image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/photo.jpg');
  });

  it('src verilince fallback render edilmez', () => {
    render(<Avatar src="/photo.jpg" name="Ali Veli" />);
    expect(screen.queryByTestId('avatar-fallback')).not.toBeInTheDocument();
  });

  it('alt metni img elementine set edilir', () => {
    render(<Avatar src="/photo.jpg" alt="Kullanici resmi" />);
    expect(screen.getByTestId('avatar-image')).toHaveAttribute('alt', 'Kullanici resmi');
  });

  // ── Props-based: Fallback ──

  it('src olmadan fallback initials render edilir', () => {
    render(<Avatar name="Ali Veli" />);
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AV');
  });

  it('tek isimde tek harf gosterilir', () => {
    render(<Avatar name="Ali" />);
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('A');
  });

  it('uc isimde ilk ve son harfler alinir', () => {
    render(<Avatar name="Ali Can Veli" />);
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AV');
  });

  it('image error da fallback gosterilir', () => {
    render(<Avatar src="/broken.jpg" name="Ali Veli" />);
    fireEvent.error(screen.getByTestId('avatar-image'));
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AV');
    expect(screen.queryByTestId('avatar-image')).not.toBeInTheDocument();
  });

  // ── Size ──

  it('size prop data-size olarak set edilir', () => {
    render(<Avatar name="Ali" size="lg" />);
    expect(screen.getByTestId('avatar-root')).toHaveAttribute('data-size', 'lg');
  });

  it('varsayilan size md', () => {
    render(<Avatar name="Ali" />);
    expect(screen.getByTestId('avatar-root')).toHaveAttribute('data-size', 'md');
  });

  // ── Variant ──

  it('variant prop data-variant olarak set edilir', () => {
    render(<Avatar name="Ali" variant="square" />);
    expect(screen.getByTestId('avatar-root')).toHaveAttribute('data-variant', 'square');
  });

  it('varsayilan variant circle', () => {
    render(<Avatar name="Ali" />);
    expect(screen.getByTestId('avatar-root')).toHaveAttribute('data-variant', 'circle');
  });

  // ── Color ──

  it('hex color dogrudan set edilir', () => {
    render(<Avatar name="Ali" color="#ff0000" />);
    const bg = screen.getByTestId('avatar-root').style.backgroundColor;
    expect(bg === '#ff0000' || bg === 'rgb(255, 0, 0)').toBe(true);
  });

  it('CSS variable color dogrudan set edilir', () => {
    render(<Avatar name="Ali" color="var(--rel-color-primary)" />);
    expect(screen.getByTestId('avatar-root').style.backgroundColor).toBe('var(--rel-color-primary)');
  });

  it('fallback rengi tema token ile gelir', () => {
    render(<Avatar name="Ali Veli" />);
    const bg = screen.getByTestId('avatar-root').style.backgroundColor;
    expect(bg).toContain('var(--rel-color-');
  });

  // ── aria-label ──

  it('aria-label alt metninden alinir', () => {
    render(<Avatar name="Ali" alt="Kullanici" />);
    expect(screen.getByTestId('avatar-root')).toHaveAttribute('aria-label', 'Kullanici');
  });

  it('alt yoksa aria-label name den alinir', () => {
    render(<Avatar name="Ali Veli" />);
    expect(screen.getByTestId('avatar-root')).toHaveAttribute('aria-label', 'Ali Veli');
  });

  // ── Compound API ──

  it('compound: Avatar.Image render edilir', () => {
    render(
      <Avatar name="Ali Veli">
        <Avatar.Image src="/photo.jpg" />
        <Avatar.Fallback />
      </Avatar>,
    );
    expect(screen.getByTestId('avatar-image')).toHaveAttribute('src', '/photo.jpg');
  });

  it('compound: Avatar.Fallback render edilir (src yok)', () => {
    render(
      <Avatar name="Ali Veli">
        <Avatar.Fallback />
      </Avatar>,
    );
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('AV');
  });

  it('compound: Avatar.Fallback custom icerik', () => {
    render(
      <Avatar name="Ali Veli">
        <Avatar.Fallback>XY</Avatar.Fallback>
      </Avatar>,
    );
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('XY');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Avatar name="Ali" className="my-avatar" />);
    expect(screen.getByTestId('avatar-root').className).toContain('my-avatar');
  });

  it('style root elemana eklenir', () => {
    render(<Avatar name="Ali" style={{ opacity: '0.5' }} />);
    expect(screen.getByTestId('avatar-root')).toHaveStyle({ opacity: '0.5' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Avatar name="Ali" classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('avatar-root').className).toContain('custom-root');
  });

  it('classNames.fallback fallback elemana eklenir', () => {
    render(<Avatar name="Ali" classNames={{ fallback: 'custom-fb' }} />);
    expect(screen.getByTestId('avatar-fallback').className).toContain('custom-fb');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Avatar name="Ali" styles={{ root: { padding: '4px' } }} />);
    expect(screen.getByTestId('avatar-root')).toHaveStyle({ padding: '4px' });
  });

  it('styles.fallback fallback elemana eklenir', () => {
    render(<Avatar name="Ali" styles={{ fallback: { letterSpacing: '0.1em' } }} />);
    expect(screen.getByTestId('avatar-fallback')).toHaveStyle({ letterSpacing: '0.1em' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Avatar name="Ali" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Helper fonksiyonlar ──

describe('getInitials', () => {
  it('iki isimden bas harfler alinir', () => {
    expect(getInitials('Ali Veli')).toBe('AV');
  });

  it('tek isimden tek harf alinir', () => {
    expect(getInitials('Ali')).toBe('A');
  });

  it('uc isimden ilk ve son alinir', () => {
    expect(getInitials('Ali Can Veli')).toBe('AV');
  });

  it('bos string bos doner', () => {
    expect(getInitials('')).toBe('');
  });

  it('kucuk harfler buyuk donusturulur', () => {
    expect(getInitials('ali veli')).toBe('AV');
  });
});

describe('getColorFromName', () => {
  it('ayni isim ayni renk uretir', () => {
    const color1 = getColorFromName('Ali Veli');
    const color2 = getColorFromName('Ali Veli');
    expect(color1).toBe(color2);
  });

  it('uretilen renk tema tokeni icerir', () => {
    const color = getColorFromName('Ali');
    expect(color).toContain('var(--rel-color-');
  });
});
