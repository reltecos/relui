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
import { EmojiPicker } from './EmojiPicker';

describe('EmojiPicker', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<EmojiPicker />);
    expect(screen.getByTestId('emoji-picker-root')).toBeInTheDocument();
  });

  // ── Search ──

  it('search render edilir', () => {
    render(<EmojiPicker />);
    expect(screen.getByTestId('emoji-picker-search')).toBeInTheDocument();
  });

  it('search input render edilir', () => {
    render(<EmojiPicker />);
    expect(screen.getByTestId('emoji-picker-search-input')).toBeInTheDocument();
  });

  it('arama ile emojiler filtrelenir', () => {
    render(<EmojiPicker />);
    fireEvent.change(screen.getByTestId('emoji-picker-search-input'), { target: { value: 'dog' } });
    const emojis = screen.getAllByTestId('emoji-picker-emoji');
    expect(emojis.length).toBeGreaterThanOrEqual(1);
  });

  it('esleme olmayan arama bos sonuc gosterir', () => {
    render(<EmojiPicker />);
    fireEvent.change(screen.getByTestId('emoji-picker-search-input'), { target: { value: 'zzzzzzz' } });
    expect(screen.getByTestId('emoji-picker-empty')).toBeInTheDocument();
  });

  // ── Categories ──

  it('categories render edilir', () => {
    render(<EmojiPicker />);
    expect(screen.getByTestId('emoji-picker-categories')).toBeInTheDocument();
  });

  it('kategori butonlari render edilir', () => {
    render(<EmojiPicker />);
    expect(screen.getAllByTestId('emoji-picker-category')).toHaveLength(9);
  });

  it('kategori tiklaninca emojiler degisir', () => {
    render(<EmojiPicker />);
    const cats = screen.getAllByTestId('emoji-picker-category');
    const animalsCat = cats.find((btn) => btn.getAttribute('aria-label') === 'animals');
    if (animalsCat) fireEvent.click(animalsCat);
    const emojis = screen.getAllByTestId('emoji-picker-emoji');
    expect(emojis.length).toBeGreaterThanOrEqual(1);
  });

  it('aktif kategori aria-selected true', () => {
    render(<EmojiPicker />);
    const cats = screen.getAllByTestId('emoji-picker-category');
    const smileysCat = cats.find((btn) => btn.getAttribute('aria-label') === 'smileys');
    expect(smileysCat).toHaveAttribute('aria-selected', 'true');
  });

  // ── Grid ──

  it('grid render edilir', () => {
    render(<EmojiPicker />);
    expect(screen.getByTestId('emoji-picker-grid')).toBeInTheDocument();
  });

  it('emojiler render edilir', () => {
    render(<EmojiPicker />);
    expect(screen.getAllByTestId('emoji-picker-emoji').length).toBeGreaterThan(0);
  });

  it('emoji tiklaninca onSelect cagrilir', () => {
    const onSelect = vi.fn();
    render(<EmojiPicker onSelect={onSelect} />);
    fireEvent.click(screen.getAllByTestId('emoji-picker-emoji')[0]);
    expect(onSelect).toHaveBeenCalled();
  });

  it('emoji tiklaninca recent listeye eklenir', () => {
    render(<EmojiPicker />);
    fireEvent.click(screen.getAllByTestId('emoji-picker-emoji')[0]);
    expect(screen.getByTestId('emoji-picker-recent')).toBeInTheDocument();
  });

  // ── Skin Tone ──

  it('showSkinTone false ise skin tone gosterilmez', () => {
    render(<EmojiPicker />);
    expect(screen.queryByTestId('emoji-picker-skin-tone')).not.toBeInTheDocument();
  });

  it('showSkinTone true ile skin tone gosterilir', () => {
    render(<EmojiPicker showSkinTone />);
    expect(screen.getByTestId('emoji-picker-skin-tone')).toBeInTheDocument();
  });

  it('6 skin tone butonu render edilir', () => {
    render(<EmojiPicker showSkinTone />);
    expect(screen.getAllByTestId('emoji-picker-skin-tone-btn')).toHaveLength(6);
  });

  // ── A11y ──

  it('grid role grid', () => {
    render(<EmojiPicker />);
    expect(screen.getByTestId('emoji-picker-grid')).toHaveAttribute('role', 'grid');
  });

  it('categories role tablist', () => {
    render(<EmojiPicker />);
    expect(screen.getByTestId('emoji-picker-categories')).toHaveAttribute('role', 'tablist');
  });

  it('emoji butonlarinda title (name) var', () => {
    render(<EmojiPicker />);
    const emojis = screen.getAllByTestId('emoji-picker-emoji');
    expect(emojis[0]).toHaveAttribute('title');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<EmojiPicker className="my-ep" />);
    expect(screen.getByTestId('emoji-picker-root').className).toContain('my-ep');
  });

  it('style root elemana eklenir', () => {
    render(<EmojiPicker style={{ padding: '16px' }} />);
    expect(screen.getByTestId('emoji-picker-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<EmojiPicker classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('emoji-picker-root').className).toContain('custom-root');
  });

  it('classNames.search search elemana eklenir', () => {
    render(<EmojiPicker classNames={{ search: 'custom-search' }} />);
    expect(screen.getByTestId('emoji-picker-search').className).toContain('custom-search');
  });

  it('classNames.categories categories elemana eklenir', () => {
    render(<EmojiPicker classNames={{ categories: 'custom-cats' }} />);
    expect(screen.getByTestId('emoji-picker-categories').className).toContain('custom-cats');
  });

  it('classNames.grid grid elemana eklenir', () => {
    render(<EmojiPicker classNames={{ grid: 'custom-grid' }} />);
    expect(screen.getByTestId('emoji-picker-grid').className).toContain('custom-grid');
  });

  it('classNames.emoji emoji elemana eklenir', () => {
    render(<EmojiPicker classNames={{ emoji: 'custom-emoji' }} />);
    expect(screen.getAllByTestId('emoji-picker-emoji')[0].className).toContain('custom-emoji');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<EmojiPicker styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('emoji-picker-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.search search elemana eklenir', () => {
    render(<EmojiPicker styles={{ search: { padding: '12px' } }} />);
    expect(screen.getByTestId('emoji-picker-search')).toHaveStyle({ padding: '12px' });
  });

  it('styles.categories categories elemana eklenir', () => {
    render(<EmojiPicker styles={{ categories: { padding: '8px' } }} />);
    expect(screen.getByTestId('emoji-picker-categories')).toHaveStyle({ padding: '8px' });
  });

  it('styles.grid grid elemana eklenir', () => {
    render(<EmojiPicker styles={{ grid: { padding: '12px' } }} />);
    expect(screen.getByTestId('emoji-picker-grid')).toHaveStyle({ padding: '12px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<EmojiPicker ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('EmojiPicker (Compound)', () => {
  it('compound: search render edilir', () => {
    render(
      <EmojiPicker>
        <EmojiPicker.Search />
      </EmojiPicker>,
    );
    expect(screen.getByTestId('emoji-picker-search')).toBeInTheDocument();
  });

  it('compound: categories render edilir', () => {
    render(
      <EmojiPicker>
        <EmojiPicker.Categories />
      </EmojiPicker>,
    );
    expect(screen.getByTestId('emoji-picker-categories')).toBeInTheDocument();
  });

  it('compound: grid render edilir', () => {
    render(
      <EmojiPicker>
        <EmojiPicker.Grid />
      </EmojiPicker>,
    );
    expect(screen.getByTestId('emoji-picker-grid')).toBeInTheDocument();
  });

  it('compound: skin tone selector render edilir', () => {
    render(
      <EmojiPicker>
        <EmojiPicker.SkinToneSelector />
      </EmojiPicker>,
    );
    expect(screen.getByTestId('emoji-picker-skin-tone')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <EmojiPicker classNames={{ grid: 'cmp-grid' }}>
        <EmojiPicker.Grid />
      </EmojiPicker>,
    );
    expect(screen.getByTestId('emoji-picker-grid').className).toContain('cmp-grid');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <EmojiPicker styles={{ search: { padding: '20px' } }}>
        <EmojiPicker.Search />
      </EmojiPicker>,
    );
    expect(screen.getByTestId('emoji-picker-search')).toHaveStyle({ padding: '20px' });
  });

  it('EmojiPicker.Search context disinda hata firlatir', () => {
    expect(() => render(<EmojiPicker.Search />)).toThrow();
  });
});
