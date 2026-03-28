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
import { DescriptionList } from './DescriptionList';

const sampleItems = [
  { id: '1', term: 'Ad', description: 'Ali' },
  { id: '2', term: 'Soyad', description: 'Yilmaz' },
  { id: '3', term: 'Sehir', description: 'Istanbul' },
];

describe('DescriptionList', () => {
  // ── Props-based API ──

  it('root render edilir', () => {
    render(<DescriptionList items={sampleItems} />);
    expect(screen.getByTestId('dl-root')).toBeInTheDocument();
  });

  it('items prop ile ogeler render edilir', () => {
    render(<DescriptionList items={sampleItems} />);
    const terms = screen.getAllByTestId('dl-term');
    const descriptions = screen.getAllByTestId('dl-description');
    expect(terms).toHaveLength(3);
    expect(descriptions).toHaveLength(3);
    expect(terms[0]).toHaveTextContent('Ad');
    expect(descriptions[0]).toHaveTextContent('Ali');
    expect(terms[1]).toHaveTextContent('Soyad');
    expect(descriptions[1]).toHaveTextContent('Yilmaz');
  });

  it('bos items ile oge render edilmez', () => {
    render(<DescriptionList items={[]} />);
    expect(screen.queryByTestId('dl-term')).not.toBeInTheDocument();
  });

  // ── Direction ──

  it('varsayilan direction vertical', () => {
    render(<DescriptionList items={sampleItems} />);
    expect(screen.getByTestId('dl-root')).toHaveAttribute('data-direction', 'vertical');
  });

  it('direction horizontal set edilir', () => {
    render(<DescriptionList items={sampleItems} direction="horizontal" />);
    expect(screen.getByTestId('dl-root')).toHaveAttribute('data-direction', 'horizontal');
  });

  it('vertical modda item wrapper render edilir', () => {
    render(<DescriptionList items={sampleItems} direction="vertical" />);
    expect(screen.getAllByTestId('dl-item')).toHaveLength(3);
  });

  it('horizontal modda item wrapper render edilmez', () => {
    render(<DescriptionList items={sampleItems} direction="horizontal" />);
    expect(screen.queryByTestId('dl-item')).not.toBeInTheDocument();
  });

  // ── Size ──

  it('varsayilan size md', () => {
    render(<DescriptionList items={sampleItems} />);
    expect(screen.getByTestId('dl-root')).toHaveAttribute('data-size', 'md');
  });

  it('size sm set edilir', () => {
    render(<DescriptionList items={sampleItems} size="sm" />);
    expect(screen.getByTestId('dl-root')).toHaveAttribute('data-size', 'sm');
  });

  it('size lg set edilir', () => {
    render(<DescriptionList items={sampleItems} size="lg" />);
    expect(screen.getByTestId('dl-root')).toHaveAttribute('data-size', 'lg');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<DescriptionList items={sampleItems} className="my-dl" />);
    expect(screen.getByTestId('dl-root').className).toContain('my-dl');
  });

  it('style root elemana eklenir', () => {
    render(<DescriptionList items={sampleItems} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('dl-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<DescriptionList items={sampleItems} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('dl-root').className).toContain('custom-root');
  });

  it('classNames.term term elemana eklenir', () => {
    render(<DescriptionList items={sampleItems} classNames={{ term: 'custom-term' }} />);
    const terms = screen.getAllByTestId('dl-term');
    expect(terms[0].className).toContain('custom-term');
  });

  it('classNames.description description elemana eklenir', () => {
    render(<DescriptionList items={sampleItems} classNames={{ description: 'custom-desc' }} />);
    const descs = screen.getAllByTestId('dl-description');
    expect(descs[0].className).toContain('custom-desc');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<DescriptionList items={sampleItems} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('dl-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.term term elemana eklenir', () => {
    render(<DescriptionList items={sampleItems} styles={{ term: { fontSize: '18px' } }} />);
    const terms = screen.getAllByTestId('dl-term');
    expect(terms[0]).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.description description elemana eklenir', () => {
    render(
      <DescriptionList items={sampleItems} styles={{ description: { letterSpacing: '0.05em' } }} />,
    );
    const descs = screen.getAllByTestId('dl-description');
    expect(descs[0]).toHaveStyle({ letterSpacing: '0.05em' });
  });

  it('styles.item item elemana eklenir', () => {
    render(
      <DescriptionList items={sampleItems} styles={{ item: { padding: '20px' } }} />,
    );
    const items = screen.getAllByTestId('dl-item');
    expect(items[0]).toHaveStyle({ padding: '20px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<DescriptionList ref={ref} items={sampleItems} />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Compound API ──

  it('compound Item render edilir', () => {
    render(
      <DescriptionList>
        <DescriptionList.Item term="Ad" description="Veli" />
      </DescriptionList>,
    );
    expect(screen.getByTestId('dl-term')).toHaveTextContent('Ad');
    expect(screen.getByTestId('dl-description')).toHaveTextContent('Veli');
  });

  it('compound birden fazla Item render edilir', () => {
    render(
      <DescriptionList>
        <DescriptionList.Item term="Ad" description="Veli" />
        <DescriptionList.Item term="Soyad" description="Kara" />
        <DescriptionList.Item term="Yas" description="30" />
      </DescriptionList>,
    );
    const terms = screen.getAllByTestId('dl-term');
    expect(terms).toHaveLength(3);
    expect(terms[2]).toHaveTextContent('Yas');
  });

  it('compound horizontal modda calisir', () => {
    render(
      <DescriptionList direction="horizontal">
        <DescriptionList.Item term="Anahtar" description="Deger" />
      </DescriptionList>,
    );
    expect(screen.getByTestId('dl-root')).toHaveAttribute('data-direction', 'horizontal');
    expect(screen.getByTestId('dl-term')).toHaveTextContent('Anahtar');
    expect(screen.getByTestId('dl-description')).toHaveTextContent('Deger');
  });

  it('compound Item context disinda hata verir', () => {
    expect(() => {
      render(<DescriptionList.Item term="A" description="B" />);
    }).toThrow('DescriptionList.Item must be used within <DescriptionList>');
  });

  // ── Props-based + compound birlikte ──

  it('items ve children birlikte render edilir', () => {
    render(
      <DescriptionList items={[{ id: '1', term: 'Prop', description: 'Deger' }]}>
        <DescriptionList.Item term="Compound" description="Deger2" />
      </DescriptionList>,
    );
    const terms = screen.getAllByTestId('dl-term');
    expect(terms).toHaveLength(2);
    expect(terms[0]).toHaveTextContent('Prop');
    expect(terms[1]).toHaveTextContent('Compound');
  });
});
