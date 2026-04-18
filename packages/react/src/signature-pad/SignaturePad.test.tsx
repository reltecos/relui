/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { SignaturePad } from './SignaturePad';

// Canvas mock
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
    left: 0, top: 0, right: 400, bottom: 200, width: 400, height: 200, x: 0, y: 0, toJSON: vi.fn(),
  });
});

describe('SignaturePad', () => {
  it('root render edilir', () => {
    render(<SignaturePad />);
    expect(screen.getByTestId('signaturepad-root')).toBeInTheDocument();
  });

  it('canvas render edilir', () => {
    render(<SignaturePad />);
    expect(screen.getByTestId('signaturepad-canvas')).toBeInTheDocument();
  });

  it('controls render edilir', () => {
    render(<SignaturePad />);
    expect(screen.getByTestId('signaturepad-controls')).toBeInTheDocument();
  });

  it('canvas width ve height ayarlanir', () => {
    render(<SignaturePad width={300} height={150} />);
    const canvas = screen.getByTestId('signaturepad-canvas') as HTMLCanvasElement;
    expect(canvas.width).toBe(300);
    expect(canvas.height).toBe(150);
  });

  it('canvas role img', () => {
    render(<SignaturePad />);
    expect(screen.getByTestId('signaturepad-canvas')).toHaveAttribute('role', 'img');
  });

  it('undo butonu render edilir', () => {
    render(<SignaturePad />);
    expect(screen.getByTestId('signaturepad-undo')).toBeInTheDocument();
  });

  it('clear butonu render edilir', () => {
    render(<SignaturePad />);
    expect(screen.getByTestId('signaturepad-clear')).toBeInTheDocument();
  });

  it('undo baslangicta disabled', () => {
    render(<SignaturePad />);
    expect(screen.getByTestId('signaturepad-undo')).toBeDisabled();
  });

  it('clear baslangicta disabled', () => {
    render(<SignaturePad />);
    expect(screen.getByTestId('signaturepad-clear')).toBeDisabled();
  });

  it('mousedown ile cizim baslar', () => {
    render(<SignaturePad />);
    const canvas = screen.getByTestId('signaturepad-canvas');
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseUp(canvas);
    // After drawing, undo should be enabled
    expect(screen.getByTestId('signaturepad-undo')).not.toBeDisabled();
  });

  it('cizim sonrasi clear enabled olur', () => {
    render(<SignaturePad />);
    const canvas = screen.getByTestId('signaturepad-canvas');
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseUp(canvas);
    expect(screen.getByTestId('signaturepad-clear')).not.toBeDisabled();
  });

  it('className root elemana eklenir', () => {
    render(<SignaturePad className="my-sp" />);
    expect(screen.getByTestId('signaturepad-root').className).toContain('my-sp');
  });

  it('style root elemana eklenir', () => {
    render(<SignaturePad style={{ padding: '16px' }} />);
    expect(screen.getByTestId('signaturepad-root')).toHaveStyle({ padding: '16px' });
  });

  it('classNames.root eklenir', () => {
    render(<SignaturePad classNames={{ root: 'c-root' }} />);
    expect(screen.getByTestId('signaturepad-root').className).toContain('c-root');
  });

  it('classNames.canvas eklenir', () => {
    render(<SignaturePad classNames={{ canvas: 'c-canvas' }} />);
    expect(screen.getByTestId('signaturepad-canvas').className).toContain('c-canvas');
  });

  it('classNames.controls eklenir', () => {
    render(<SignaturePad classNames={{ controls: 'c-ctrls' }} />);
    expect(screen.getByTestId('signaturepad-controls').className).toContain('c-ctrls');
  });

  it('styles.root eklenir', () => {
    render(<SignaturePad styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('signaturepad-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.controls eklenir', () => {
    render(<SignaturePad styles={{ controls: { padding: '8px' } }} />);
    expect(screen.getByTestId('signaturepad-controls')).toHaveStyle({ padding: '8px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<SignaturePad ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('SignaturePad (Compound)', () => {
  it('compound: canvas render edilir', () => {
    render(
      <SignaturePad>
        <SignaturePad.Canvas />
        <SignaturePad.Controls />
      </SignaturePad>,
    );
    expect(screen.getByTestId('signaturepad-canvas')).toBeInTheDocument();
  });

  it('compound: controls render edilir', () => {
    render(
      <SignaturePad>
        <SignaturePad.Canvas />
        <SignaturePad.Controls />
      </SignaturePad>,
    );
    expect(screen.getByTestId('signaturepad-controls')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <SignaturePad classNames={{ canvas: 'cmp-canvas' }}>
        <SignaturePad.Canvas />
      </SignaturePad>,
    );
    expect(screen.getByTestId('signaturepad-canvas').className).toContain('cmp-canvas');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <SignaturePad styles={{ controls: { padding: '12px' } }}>
        <SignaturePad.Canvas />
        <SignaturePad.Controls />
      </SignaturePad>,
    );
    expect(screen.getByTestId('signaturepad-controls')).toHaveStyle({ padding: '12px' });
  });

  it('SignaturePad.Canvas context disinda hata firlatir', () => {
    expect(() => render(<SignaturePad.Canvas />)).toThrow();
  });
});
