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
import { ImageCropper } from './ImageCropper';

const testSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

describe('ImageCropper', () => {
  it('root render edilir', () => { render(<ImageCropper src={testSrc} />); expect(screen.getByTestId('imagecropper-root')).toBeInTheDocument(); });
  it('preview render edilir', () => { render(<ImageCropper src={testSrc} />); expect(screen.getByTestId('imagecropper-preview')).toBeInTheDocument(); });
  it('image render edilir', () => { render(<ImageCropper src={testSrc} />); expect(screen.getByTestId('imagecropper-image')).toBeInTheDocument(); });
  it('controls render edilir', () => { render(<ImageCropper src={testSrc} />); expect(screen.getByTestId('imagecropper-controls')).toBeInTheDocument(); });
  it('zoom slider render edilir', () => { render(<ImageCropper src={testSrc} />); expect(screen.getByTestId('imagecropper-zoom')).toBeInTheDocument(); });
  it('rotate left butonu render edilir', () => { render(<ImageCropper src={testSrc} />); expect(screen.getByTestId('imagecropper-rotateLeft')).toBeInTheDocument(); });
  it('rotate right butonu render edilir', () => { render(<ImageCropper src={testSrc} />); expect(screen.getByTestId('imagecropper-rotateRight')).toBeInTheDocument(); });
  it('reset butonu render edilir', () => { render(<ImageCropper src={testSrc} />); expect(screen.getByTestId('imagecropper-reset')).toBeInTheDocument(); });

  it('image src ayarlanir', () => {
    render(<ImageCropper src={testSrc} />);
    expect(screen.getByTestId('imagecropper-image')).toHaveAttribute('src', testSrc);
  });

  it('zoom slider degisince zoom guncellenir', () => {
    render(<ImageCropper src={testSrc} />);
    const slider = screen.getByTestId('imagecropper-zoom') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '200' } });
    const img = screen.getByTestId('imagecropper-image');
    expect(img.style.transform).toContain('scale(2)');
  });

  it('rotate right tiklaninca rotation degisir', () => {
    render(<ImageCropper src={testSrc} />);
    fireEvent.click(screen.getByTestId('imagecropper-rotateRight'));
    const img = screen.getByTestId('imagecropper-image');
    expect(img.style.transform).toContain('rotate(90deg)');
  });

  it('rotate left tiklaninca rotation degisir', () => {
    render(<ImageCropper src={testSrc} />);
    fireEvent.click(screen.getByTestId('imagecropper-rotateLeft'));
    const img = screen.getByTestId('imagecropper-image');
    expect(img.style.transform).toContain('rotate(270deg)');
  });

  it('reset tiklaninca zoom 1 olur', () => {
    render(<ImageCropper src={testSrc} />);
    const slider = screen.getByTestId('imagecropper-zoom') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '300' } });
    fireEvent.click(screen.getByTestId('imagecropper-reset'));
    expect(screen.getByTestId('imagecropper-image').style.transform).toContain('scale(1)');
  });

  it('className root elemana eklenir', () => {
    render(<ImageCropper src={testSrc} className="my-ic" />);
    expect(screen.getByTestId('imagecropper-root').className).toContain('my-ic');
  });

  it('style root elemana eklenir', () => {
    render(<ImageCropper src={testSrc} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('imagecropper-root')).toHaveStyle({ padding: '16px' });
  });

  it('classNames.root eklenir', () => {
    render(<ImageCropper src={testSrc} classNames={{ root: 'c-r' }} />);
    expect(screen.getByTestId('imagecropper-root').className).toContain('c-r');
  });

  it('classNames.preview eklenir', () => {
    render(<ImageCropper src={testSrc} classNames={{ preview: 'c-p' }} />);
    expect(screen.getByTestId('imagecropper-preview').className).toContain('c-p');
  });

  it('classNames.controls eklenir', () => {
    render(<ImageCropper src={testSrc} classNames={{ controls: 'c-c' }} />);
    expect(screen.getByTestId('imagecropper-controls').className).toContain('c-c');
  });

  it('styles.root eklenir', () => {
    render(<ImageCropper src={testSrc} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('imagecropper-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.preview eklenir', () => {
    render(<ImageCropper src={testSrc} styles={{ preview: { padding: '8px' } }} />);
    expect(screen.getByTestId('imagecropper-preview')).toHaveStyle({ padding: '8px' });
  });

  it('styles.controls eklenir', () => {
    render(<ImageCropper src={testSrc} styles={{ controls: { padding: '4px' } }} />);
    expect(screen.getByTestId('imagecropper-controls')).toHaveStyle({ padding: '4px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<ImageCropper ref={ref} src={testSrc} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('ImageCropper (Compound)', () => {
  it('compound: preview render edilir', () => {
    render(<ImageCropper src={testSrc}><ImageCropper.Preview /><ImageCropper.Controls /></ImageCropper>);
    expect(screen.getByTestId('imagecropper-preview')).toBeInTheDocument();
  });
  it('compound: classNames context ile aktarilir', () => {
    render(<ImageCropper src={testSrc} classNames={{ controls: 'cmp-c' }}><ImageCropper.Preview /><ImageCropper.Controls /></ImageCropper>);
    expect(screen.getByTestId('imagecropper-controls').className).toContain('cmp-c');
  });
  it('compound: styles context ile aktarilir', () => {
    render(<ImageCropper src={testSrc} styles={{ preview: { padding: '12px' } }}><ImageCropper.Preview /></ImageCropper>);
    expect(screen.getByTestId('imagecropper-preview')).toHaveStyle({ padding: '12px' });
  });
  it('ImageCropper.Preview context disinda hata firlatir', () => {
    expect(() => render(<ImageCropper.Preview />)).toThrow();
  });
});
