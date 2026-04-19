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
import { Image } from './Image';

const testSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

describe('Image', () => {
  it('root render edilir', () => { render(<Image src={testSrc} />); expect(screen.getByTestId('image-root')).toBeInTheDocument(); });
  it('placeholder gorunur (loading state)', () => { render(<Image src={testSrc} />); expect(screen.getByTestId('image-placeholder')).toBeInTheDocument(); });
  it('image element render edilir', () => { render(<Image src={testSrc} />); expect(screen.getByTestId('image-image')).toBeInTheDocument(); });
  it('image src dogru', () => { render(<Image src={testSrc} />); expect(screen.getByTestId('image-image')).toHaveAttribute('src', testSrc); });
  it('image alt dogru', () => { render(<Image src={testSrc} alt="Test" />); expect(screen.getByTestId('image-image')).toHaveAttribute('alt', 'Test'); });

  it('load basarili olunca placeholder kaybolur', () => {
    render(<Image src={testSrc} />);
    fireEvent.load(screen.getByTestId('image-image'));
    expect(screen.queryByTestId('image-placeholder')).not.toBeInTheDocument();
  });

  it('load basarili olunca image opacity 1', () => {
    render(<Image src={testSrc} />);
    fireEvent.load(screen.getByTestId('image-image'));
    expect(screen.getByTestId('image-image')).toHaveStyle({ opacity: '1' });
  });

  it('load hatasi durumunda fallback gorunur', () => {
    render(<Image src="bad.jpg" />);
    fireEvent.error(screen.getByTestId('image-image'));
    expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
  });

  it('lightbox tikla ile acilir', () => {
    render(<Image src={testSrc} lightbox />);
    fireEvent.load(screen.getByTestId('image-image'));
    fireEvent.click(screen.getByTestId('image-image'));
    expect(screen.getByTestId('image-lightbox')).toBeInTheDocument();
  });

  it('lightbox tikla ile kapanir', () => {
    render(<Image src={testSrc} lightbox />);
    fireEvent.load(screen.getByTestId('image-image'));
    fireEvent.click(screen.getByTestId('image-image'));
    fireEvent.click(screen.getByTestId('image-lightbox'));
    expect(screen.queryByTestId('image-lightbox')).not.toBeInTheDocument();
  });

  it('lightbox false ise acilmaz', () => {
    render(<Image src={testSrc} />);
    fireEvent.load(screen.getByTestId('image-image'));
    fireEvent.click(screen.getByTestId('image-image'));
    expect(screen.queryByTestId('image-lightbox')).not.toBeInTheDocument();
  });

  it('onLoad callback cagirilir', () => {
    const fn = vi.fn();
    render(<Image src={testSrc} onLoad={fn} />);
    fireEvent.load(screen.getByTestId('image-image'));
    expect(fn).toHaveBeenCalled();
  });

  it('onError callback cagirilir', () => {
    const fn = vi.fn();
    render(<Image src="bad.jpg" onError={fn} />);
    fireEvent.error(screen.getByTestId('image-image'));
    expect(fn).toHaveBeenCalled();
  });

  it('className root eklenir', () => { render(<Image src={testSrc} className="my-img" />); expect(screen.getByTestId('image-root').className).toContain('my-img'); });
  it('style root eklenir', () => { render(<Image src={testSrc} style={{ padding: '8px' }} />); expect(screen.getByTestId('image-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<Image src={testSrc} classNames={{ root: 'c-r' }} />); expect(screen.getByTestId('image-root').className).toContain('c-r'); });
  it('styles.root eklenir', () => { render(<Image src={testSrc} styles={{ root: { padding: '16px' } }} />); expect(screen.getByTestId('image-root')).toHaveStyle({ padding: '16px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<Image ref={ref} src={testSrc} />); expect(ref).toHaveBeenCalled(); });
  it('data-state attribute set edilir', () => { render(<Image src={testSrc} />); expect(screen.getByTestId('image-root')).toHaveAttribute('data-state', 'loading'); });
  it('width ve height ayarlanir', () => { render(<Image src={testSrc} width={200} height={150} />); expect(screen.getByTestId('image-root')).toHaveStyle({ width: '200px', height: '150px' }); });
});

describe('Image (Compound)', () => {
  it('compound: img render edilir', () => {
    render(<Image src={testSrc}><Image.Img /><Image.Placeholder /><Image.Fallback /></Image>);
    expect(screen.getByTestId('image-image')).toBeInTheDocument();
  });
  it('Image.Img context disinda hata', () => { expect(() => render(<Image.Img />)).toThrow(); });
});
