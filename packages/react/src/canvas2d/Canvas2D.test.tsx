/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Canvas2D } from './Canvas2D';
import type { CanvasShape } from '@relteco/relui-core';

// Canvas mock for jsdom
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    fillRect: vi.fn(), clearRect: vi.fn(), strokeRect: vi.fn(),
    beginPath: vi.fn(), closePath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(),
    arc: vi.fn(), fill: vi.fn(), stroke: vi.fn(), save: vi.fn(), restore: vi.fn(),
    translate: vi.fn(), rotate: vi.fn(), scale: vi.fn(), setTransform: vi.fn(),
    fillText: vi.fn(), measureText: vi.fn().mockReturnValue({ width: 0 }),
    drawImage: vi.fn(),
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

const RECT: CanvasShape = { id: 'r1', type: 'rect', x: 10, y: 20, width: 100, height: 50, rotation: 0, fill: '#f00', stroke: '#000', strokeWidth: 1, zIndex: 0, visible: true, locked: false };
const ELLIPSE: CanvasShape = { id: 'e1', type: 'ellipse', x: 200, y: 100, width: 80, height: 60, rotation: 0, fill: '#0f0', stroke: '#000', strokeWidth: 1, zIndex: 1, visible: true, locked: false };

describe('Canvas2D', () => {
  it('root render edilir', () => { render(<Canvas2D shapes={[RECT]} />); expect(screen.getByTestId('canvas2d-root')).toBeInTheDocument(); });
  it('role application set edilir', () => { render(<Canvas2D />); expect(screen.getByTestId('canvas2d-root')).toHaveAttribute('role', 'application'); });
  it('surface render edilir', () => { render(<Canvas2D />); expect(screen.getByTestId('canvas2d-surface')).toBeInTheDocument(); });
  it('toolbar render edilir', () => { render(<Canvas2D />); expect(screen.getByTestId('canvas2d-toolbar')).toBeInTheDocument(); });
  it('layer panel render edilir', () => { render(<Canvas2D shapes={[RECT]} />); expect(screen.getByTestId('canvas2d-layer-panel')).toBeInTheDocument(); });
  it('layer item render edilir', () => { render(<Canvas2D shapes={[RECT, ELLIPSE]} />); expect(screen.getAllByTestId('canvas2d-layer-item')).toHaveLength(2); });
  it('undo butonu render edilir', () => { render(<Canvas2D />); expect(screen.getByTestId('canvas2d-btn-undo')).toBeInTheDocument(); });
  it('redo butonu render edilir', () => { render(<Canvas2D />); expect(screen.getByTestId('canvas2d-btn-redo')).toBeInTheDocument(); });
  it('zoom butonlari render edilir', () => { render(<Canvas2D />); expect(screen.getByTestId('canvas2d-btn-zoom-in')).toBeInTheDocument(); expect(screen.getByTestId('canvas2d-btn-zoom-out')).toBeInTheDocument(); });
  it('bos shapes ile hata vermez', () => { render(<Canvas2D />); expect(screen.getByTestId('canvas2d-root')).toBeInTheDocument(); });
  it('className root elemana eklenir', () => { render(<Canvas2D className="my-c2d" />); expect(screen.getByTestId('canvas2d-root').className).toContain('my-c2d'); });
  it('style root elemana eklenir', () => { render(<Canvas2D style={{ padding: '16px' }} />); expect(screen.getByTestId('canvas2d-root')).toHaveStyle({ padding: '16px' }); });
  it('classNames.root root elemana eklenir', () => { render(<Canvas2D classNames={{ root: 'custom-root' }} />); expect(screen.getByTestId('canvas2d-root').className).toContain('custom-root'); });
  it('classNames.toolbar toolbar elemana eklenir', () => { render(<Canvas2D classNames={{ toolbar: 'custom-tb' }} />); expect(screen.getByTestId('canvas2d-toolbar').className).toContain('custom-tb'); });
  it('classNames.canvas canvas elemana eklenir', () => { render(<Canvas2D classNames={{ canvas: 'custom-cv' }} />); expect(screen.getByTestId('canvas2d-surface').className).toContain('custom-cv'); });
  it('classNames.layerPanel layerPanel elemana eklenir', () => { render(<Canvas2D classNames={{ layerPanel: 'custom-lp' }} />); expect(screen.getByTestId('canvas2d-layer-panel').className).toContain('custom-lp'); });
  it('styles.root root elemana eklenir', () => { render(<Canvas2D styles={{ root: { padding: '24px' } }} />); expect(screen.getByTestId('canvas2d-root')).toHaveStyle({ padding: '24px' }); });
  it('styles.toolbar toolbar elemana eklenir', () => { render(<Canvas2D styles={{ toolbar: { padding: '12px' } }} />); expect(screen.getByTestId('canvas2d-toolbar')).toHaveStyle({ padding: '12px' }); });
  it('styles.layerPanel layerPanel elemana eklenir', () => { render(<Canvas2D styles={{ layerPanel: { padding: '8px' } }} />); expect(screen.getByTestId('canvas2d-layer-panel')).toHaveStyle({ padding: '8px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<Canvas2D ref={ref} />); expect(ref).toHaveBeenCalled(); });
});

describe('Canvas2D (Compound)', () => {
  it('compound: surface render edilir', () => { render(<Canvas2D><Canvas2D.Surface /></Canvas2D>); expect(screen.getByTestId('canvas2d-surface')).toBeInTheDocument(); });
  it('compound: toolbar render edilir', () => { render(<Canvas2D><Canvas2D.Toolbar /></Canvas2D>); expect(screen.getByTestId('canvas2d-toolbar')).toBeInTheDocument(); });
  it('compound: layer panel render edilir', () => { render(<Canvas2D shapes={[RECT]}><Canvas2D.LayerPanel /></Canvas2D>); expect(screen.getByTestId('canvas2d-layer-panel')).toBeInTheDocument(); });
  it('compound: classNames context ile aktarilir', () => { render(<Canvas2D classNames={{ toolbar: 'cmp-tb' }}><Canvas2D.Toolbar /></Canvas2D>); expect(screen.getByTestId('canvas2d-toolbar').className).toContain('cmp-tb'); });
  it('compound: styles context ile aktarilir', () => { render(<Canvas2D styles={{ toolbar: { padding: '30px' } }}><Canvas2D.Toolbar /></Canvas2D>); expect(screen.getByTestId('canvas2d-toolbar')).toHaveStyle({ padding: '30px' }); });
  it('Canvas2D.Surface context disinda hata firlatir', () => { expect(() => render(<Canvas2D.Surface />)).toThrow(); });
  it('Canvas2D.Toolbar context disinda hata firlatir', () => { expect(() => render(<Canvas2D.Toolbar />)).toThrow(); });
  it('Canvas2D.LayerPanel context disinda hata firlatir', () => { expect(() => render(<Canvas2D.LayerPanel />)).toThrow(); });
});
