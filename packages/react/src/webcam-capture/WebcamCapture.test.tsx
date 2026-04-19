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
import { WebcamCapture } from './WebcamCapture';

describe('WebcamCapture', () => {
  it('root render edilir', () => {
    render(<WebcamCapture />);
    expect(screen.getByTestId('webcam-capture-root')).toBeInTheDocument();
  });

  it('role application set edilir', () => {
    render(<WebcamCapture />);
    expect(screen.getByTestId('webcam-capture-root')).toHaveAttribute('role', 'application');
  });

  it('video render edilir', () => {
    render(<WebcamCapture />);
    expect(screen.getByTestId('webcam-capture-video')).toBeInTheDocument();
  });

  it('video state idle', () => {
    render(<WebcamCapture />);
    expect(screen.getByTestId('webcam-capture-video')).toHaveAttribute('data-state', 'idle');
  });

  it('controls render edilir', () => {
    render(<WebcamCapture />);
    expect(screen.getByTestId('webcam-capture-controls')).toBeInTheDocument();
  });

  it('start butonu idle durumunda render edilir', () => {
    render(<WebcamCapture />);
    expect(screen.getByTestId('webcam-capture-btn-start')).toBeInTheDocument();
  });

  it('start butonuna tiklaninca requesting durumuna gecer', () => {
    render(<WebcamCapture />);
    fireEvent.click(screen.getByTestId('webcam-capture-btn-start'));
    expect(screen.getByTestId('webcam-capture-status')).toHaveTextContent('requesting');
  });

  it('status gosterilir', () => {
    render(<WebcamCapture />);
    expect(screen.getByTestId('webcam-capture-status')).toHaveTextContent('idle');
  });

  it('preview bos baslarken render edilmez', () => {
    render(<WebcamCapture />);
    expect(screen.queryByTestId('webcam-capture-preview')).not.toBeInTheDocument();
  });

  it('className root elemana eklenir', () => {
    render(<WebcamCapture className="my-wc" />);
    expect(screen.getByTestId('webcam-capture-root').className).toContain('my-wc');
  });

  it('style root elemana eklenir', () => {
    render(<WebcamCapture style={{ padding: '16px' }} />);
    expect(screen.getByTestId('webcam-capture-root')).toHaveStyle({ padding: '16px' });
  });

  it('classNames.root root elemana eklenir', () => {
    render(<WebcamCapture classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('webcam-capture-root').className).toContain('custom-root');
  });

  it('classNames.video video elemana eklenir', () => {
    render(<WebcamCapture classNames={{ video: 'custom-vid' }} />);
    expect(screen.getByTestId('webcam-capture-video').className).toContain('custom-vid');
  });

  it('classNames.controls controls elemana eklenir', () => {
    render(<WebcamCapture classNames={{ controls: 'custom-ctrl' }} />);
    expect(screen.getByTestId('webcam-capture-controls').className).toContain('custom-ctrl');
  });

  it('styles.root root elemana eklenir', () => {
    render(<WebcamCapture styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('webcam-capture-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.controls controls elemana eklenir', () => {
    render(<WebcamCapture styles={{ controls: { padding: '12px' } }} />);
    expect(screen.getByTestId('webcam-capture-controls')).toHaveStyle({ padding: '12px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<WebcamCapture ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('WebcamCapture (Compound)', () => {
  it('compound: video render edilir', () => {
    render(<WebcamCapture><WebcamCapture.Video /></WebcamCapture>);
    expect(screen.getByTestId('webcam-capture-video')).toBeInTheDocument();
  });

  it('compound: controls render edilir', () => {
    render(<WebcamCapture><WebcamCapture.Controls /></WebcamCapture>);
    expect(screen.getByTestId('webcam-capture-controls')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(<WebcamCapture classNames={{ controls: 'cmp-ctrl' }}><WebcamCapture.Controls /></WebcamCapture>);
    expect(screen.getByTestId('webcam-capture-controls').className).toContain('cmp-ctrl');
  });

  it('compound: styles context ile aktarilir', () => {
    render(<WebcamCapture styles={{ controls: { padding: '30px' } }}><WebcamCapture.Controls /></WebcamCapture>);
    expect(screen.getByTestId('webcam-capture-controls')).toHaveStyle({ padding: '30px' });
  });

  it('WebcamCapture.Video context disinda hata firlatir', () => {
    expect(() => render(<WebcamCapture.Video />)).toThrow();
  });

  it('WebcamCapture.Controls context disinda hata firlatir', () => {
    expect(() => render(<WebcamCapture.Controls />)).toThrow();
  });
});
