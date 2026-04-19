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
import { ImageGallery } from './ImageGallery';

const images = [
  { id: '1', src: 'a.jpg', alt: 'A' },
  { id: '2', src: 'b.jpg', alt: 'B' },
  { id: '3', src: 'c.jpg', alt: 'C' },
];

describe('ImageGallery', () => {
  it('root render edilir', () => { render(<ImageGallery images={images} />); expect(screen.getByTestId('imagegallery-root')).toBeInTheDocument(); });
  it('grid render edilir', () => { render(<ImageGallery images={images} />); expect(screen.getByTestId('imagegallery-grid')).toBeInTheDocument(); });
  it('grid item lar render edilir', () => { render(<ImageGallery images={images} />); expect(screen.getAllByTestId('imagegallery-gridItem').length).toBe(3); });
  it('thumbnails render edilir', () => { render(<ImageGallery images={images} />); expect(screen.getByTestId('imagegallery-thumbnails')).toBeInTheDocument(); });
  it('thumb lar render edilir', () => { render(<ImageGallery images={images} />); expect(screen.getAllByTestId('imagegallery-thumb').length).toBe(3); });
  it('lightbox baslangicta kapali', () => { render(<ImageGallery images={images} />); expect(screen.queryByTestId('imagegallery-lightbox')).not.toBeInTheDocument(); });

  it('grid item tikla ile lightbox acilir', () => {
    render(<ImageGallery images={images} />);
    fireEvent.click(screen.getAllByTestId('imagegallery-gridItem')[0] as HTMLElement);
    expect(screen.getByTestId('imagegallery-lightbox')).toBeInTheDocument();
  });

  it('lightbox next butonu calisir', () => {
    render(<ImageGallery images={images} />);
    fireEvent.click(screen.getAllByTestId('imagegallery-gridItem')[0] as HTMLElement);
    fireEvent.click(screen.getByTestId('imagegallery-next'));
    // active index should be 1 now — thumb[1] should be active
    const thumbs = screen.getAllByTestId('imagegallery-thumb');
    expect(thumbs[1]).toHaveAttribute('data-active', 'true');
  });

  it('lightbox prev butonu calisir', () => {
    render(<ImageGallery images={images} />);
    fireEvent.click(screen.getAllByTestId('imagegallery-gridItem')[1] as HTMLElement);
    fireEvent.click(screen.getByTestId('imagegallery-prev'));
    const thumbs = screen.getAllByTestId('imagegallery-thumb');
    expect(thumbs[0]).toHaveAttribute('data-active', 'true');
  });

  it('lightbox tikla ile kapanir', () => {
    render(<ImageGallery images={images} />);
    fireEvent.click(screen.getAllByTestId('imagegallery-gridItem')[0] as HTMLElement);
    fireEvent.click(screen.getByTestId('imagegallery-lightbox'));
    expect(screen.queryByTestId('imagegallery-lightbox')).not.toBeInTheDocument();
  });

  it('lightbox role dialog', () => {
    render(<ImageGallery images={images} />);
    fireEvent.click(screen.getAllByTestId('imagegallery-gridItem')[0] as HTMLElement);
    expect(screen.getByTestId('imagegallery-lightbox')).toHaveAttribute('role', 'dialog');
  });

  it('thumbnail tikla ile secim degisir', () => {
    render(<ImageGallery images={images} />);
    fireEvent.click(screen.getAllByTestId('imagegallery-thumb')[2] as HTMLElement);
    // grid item 2 should be active
    expect(screen.getAllByTestId('imagegallery-gridItem')[2]).toHaveAttribute('data-active', 'true');
  });

  it('Escape ile lightbox kapanir', () => {
    render(<ImageGallery images={images} />);
    fireEvent.click(screen.getAllByTestId('imagegallery-gridItem')[0] as HTMLElement);
    expect(screen.getByTestId('imagegallery-lightbox')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('imagegallery-lightbox')).not.toBeInTheDocument();
  });

  it('className root eklenir', () => { render(<ImageGallery images={images} className="my-ig" />); expect(screen.getByTestId('imagegallery-root').className).toContain('my-ig'); });
  it('style root eklenir', () => { render(<ImageGallery images={images} style={{ padding: '8px' }} />); expect(screen.getByTestId('imagegallery-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<ImageGallery images={images} classNames={{ root: 'c-r' }} />); expect(screen.getByTestId('imagegallery-root').className).toContain('c-r'); });
  it('classNames.grid eklenir', () => { render(<ImageGallery images={images} classNames={{ grid: 'c-g' }} />); expect(screen.getByTestId('imagegallery-grid').className).toContain('c-g'); });
  it('styles.root eklenir', () => { render(<ImageGallery images={images} styles={{ root: { padding: '16px' } }} />); expect(screen.getByTestId('imagegallery-root')).toHaveStyle({ padding: '16px' }); });
  it('styles.grid eklenir', () => { render(<ImageGallery images={images} styles={{ grid: { padding: '8px' } }} />); expect(screen.getByTestId('imagegallery-grid')).toHaveStyle({ padding: '8px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<ImageGallery ref={ref} images={images} />); expect(ref).toHaveBeenCalled(); });
});

describe('ImageGallery (Compound)', () => {
  it('compound: grid render edilir', () => {
    render(<ImageGallery images={images}><ImageGallery.Grid /><ImageGallery.Thumbnails /><ImageGallery.Lightbox /></ImageGallery>);
    expect(screen.getByTestId('imagegallery-grid')).toBeInTheDocument();
  });
  it('compound: classNames aktarilir', () => {
    render(<ImageGallery images={images} classNames={{ grid: 'cmp-g' }}><ImageGallery.Grid /></ImageGallery>);
    expect(screen.getByTestId('imagegallery-grid').className).toContain('cmp-g');
  });
  it('ImageGallery.Grid context disinda hata', () => { expect(() => render(<ImageGallery.Grid />)).toThrow(); });
});
