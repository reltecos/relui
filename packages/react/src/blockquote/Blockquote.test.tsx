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
import { Blockquote } from './Blockquote';

describe('Blockquote', () => {
  // ── Props-based API ──

  it('root render edilir', () => {
    render(<Blockquote cite="Kaynak">Alinti metni</Blockquote>);
    expect(screen.getByTestId('blockquote-root')).toBeInTheDocument();
  });

  it('children content olarak render edilir', () => {
    render(<Blockquote cite="Yazar">Metin icerik</Blockquote>);
    expect(screen.getByTestId('blockquote-content')).toHaveTextContent('Metin icerik');
  });

  it('cite prop render edilir', () => {
    render(<Blockquote cite="Ataturk">Alinti</Blockquote>);
    expect(screen.getByTestId('blockquote-cite')).toHaveTextContent('Ataturk');
  });

  it('cite olmadan cite render edilmez', () => {
    render(
      <Blockquote>
        <Blockquote.Content>Sadece metin</Blockquote.Content>
      </Blockquote>,
    );
    expect(screen.queryByTestId('blockquote-cite')).not.toBeInTheDocument();
  });

  it('icon render edilir', () => {
    render(<Blockquote icon={<span>Q</span>} cite="Kaynak">Alinti</Blockquote>);
    expect(screen.getByTestId('blockquote-icon')).toBeInTheDocument();
    expect(screen.getByText('Q')).toBeInTheDocument();
  });

  it('icon aria-hidden true', () => {
    render(<Blockquote icon={<span>Q</span>} cite="Kaynak">Alinti</Blockquote>);
    expect(screen.getByTestId('blockquote-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  // ── Variant ──

  it('varsayilan variant default', () => {
    render(<Blockquote cite="K">Metin</Blockquote>);
    expect(screen.getByTestId('blockquote-root')).toHaveAttribute('data-variant', 'default');
  });

  it('variant bordered set edilir', () => {
    render(<Blockquote variant="bordered" cite="K">Metin</Blockquote>);
    expect(screen.getByTestId('blockquote-root')).toHaveAttribute('data-variant', 'bordered');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Blockquote className="my-quote" cite="K">Metin</Blockquote>);
    expect(screen.getByTestId('blockquote-root').className).toContain('my-quote');
  });

  it('style root elemana eklenir', () => {
    render(<Blockquote style={{ padding: '24px' }} cite="K">Metin</Blockquote>);
    expect(screen.getByTestId('blockquote-root')).toHaveStyle({ padding: '24px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Blockquote classNames={{ root: 'custom-root' }} cite="K">Metin</Blockquote>);
    expect(screen.getByTestId('blockquote-root').className).toContain('custom-root');
  });

  it('classNames.content content elemana eklenir', () => {
    render(<Blockquote classNames={{ content: 'custom-content' }} cite="K">Metin</Blockquote>);
    expect(screen.getByTestId('blockquote-content').className).toContain('custom-content');
  });

  it('classNames.cite cite elemana eklenir', () => {
    render(<Blockquote classNames={{ cite: 'custom-cite' }} cite="Yazar">Metin</Blockquote>);
    expect(screen.getByTestId('blockquote-cite').className).toContain('custom-cite');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Blockquote styles={{ root: { padding: '32px' } }} cite="K">Metin</Blockquote>);
    expect(screen.getByTestId('blockquote-root')).toHaveStyle({ padding: '32px' });
  });

  it('styles.content content elemana eklenir', () => {
    render(<Blockquote styles={{ content: { fontSize: '20px' } }} cite="K">Metin</Blockquote>);
    expect(screen.getByTestId('blockquote-content')).toHaveStyle({ fontSize: '20px' });
  });

  it('styles.cite cite elemana eklenir', () => {
    render(<Blockquote styles={{ cite: { letterSpacing: '0.05em' } }} cite="K">Metin</Blockquote>);
    expect(screen.getByTestId('blockquote-cite')).toHaveStyle({ letterSpacing: '0.05em' });
  });

  it('styles.icon icon elemana eklenir', () => {
    render(
      <Blockquote icon={<span>Q</span>} cite="K" styles={{ icon: { padding: '20px' } }}>
        Metin
      </Blockquote>,
    );
    expect(screen.getByTestId('blockquote-icon')).toHaveStyle({ padding: '20px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Blockquote ref={ref} cite="K">Metin</Blockquote>);
    expect(ref).toHaveBeenCalled();
  });

  // ── Compound API ──

  it('compound Content render edilir', () => {
    render(
      <Blockquote>
        <Blockquote.Content>Compound alinti</Blockquote.Content>
      </Blockquote>,
    );
    expect(screen.getByTestId('blockquote-content')).toHaveTextContent('Compound alinti');
  });

  it('compound Cite render edilir', () => {
    render(
      <Blockquote>
        <Blockquote.Content>Alinti</Blockquote.Content>
        <Blockquote.Cite>Yazar Adi</Blockquote.Cite>
      </Blockquote>,
    );
    expect(screen.getByTestId('blockquote-cite')).toHaveTextContent('Yazar Adi');
  });

  it('compound Content ve Cite birlikte render edilir', () => {
    render(
      <Blockquote variant="bordered">
        <Blockquote.Content>Alinti metni burada</Blockquote.Content>
        <Blockquote.Cite>Kaynakca</Blockquote.Cite>
      </Blockquote>,
    );
    expect(screen.getByTestId('blockquote-content')).toHaveTextContent('Alinti metni burada');
    expect(screen.getByTestId('blockquote-cite')).toHaveTextContent('Kaynakca');
    expect(screen.getByTestId('blockquote-root')).toHaveAttribute('data-variant', 'bordered');
  });

  it('compound Cite context disinda hata verir', () => {
    expect(() => {
      render(<Blockquote.Cite>Hata</Blockquote.Cite>);
    }).toThrow('Blockquote sub-components must be used within <Blockquote>');
  });

  it('compound Content context disinda hata verir', () => {
    expect(() => {
      render(<Blockquote.Content>Hata</Blockquote.Content>);
    }).toThrow('Blockquote sub-components must be used within <Blockquote>');
  });
});
