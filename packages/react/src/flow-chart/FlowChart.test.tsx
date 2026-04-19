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
import { FlowChart } from './FlowChart';
import type { FlowNode, FlowEdge } from '@relteco/relui-core';

const S: FlowNode = { id: 's', type: 'start', label: 'Start', x: 0, y: 0, width: 120, height: 60 };
const P: FlowNode = { id: 'p', type: 'process', label: 'Process', x: 200, y: 0, width: 160, height: 80 };
const E1: FlowEdge = { id: 'e1', sourceId: 's', targetId: 'p' };

describe('FlowChart', () => {
  it('root render edilir', () => { render(<FlowChart nodes={[S, P]} edges={[E1]} />); expect(screen.getByTestId('flow-chart-root')).toBeInTheDocument(); });
  it('role application set edilir', () => { render(<FlowChart />); expect(screen.getByTestId('flow-chart-root')).toHaveAttribute('role', 'application'); });
  it('toolbar render edilir', () => { render(<FlowChart />); expect(screen.getByTestId('flow-chart-toolbar')).toBeInTheDocument(); });
  it('canvas render edilir', () => { render(<FlowChart />); expect(screen.getByTestId('flow-chart-canvas')).toBeInTheDocument(); });
  it('node lar render edilir', () => { render(<FlowChart nodes={[S, P]} />); expect(screen.getAllByTestId('flow-chart-node')).toHaveLength(2); });
  it('edge ler render edilir', () => { render(<FlowChart nodes={[S, P]} edges={[E1]} />); expect(screen.getAllByTestId('flow-chart-edge')).toHaveLength(1); });
  it('minimap render edilir', () => { render(<FlowChart nodes={[S]} />); expect(screen.getByTestId('flow-chart-minimap')).toBeInTheDocument(); });
  it('undo butonu render edilir', () => { render(<FlowChart />); expect(screen.getByTestId('flow-chart-btn-undo')).toBeInTheDocument(); });
  it('layout butonu render edilir', () => { render(<FlowChart />); expect(screen.getByTestId('flow-chart-btn-layout')).toBeInTheDocument(); });
  it('zoom butonlari render edilir', () => { render(<FlowChart />); expect(screen.getByTestId('flow-chart-btn-zoom-in')).toBeInTheDocument(); });
  it('node tiklaninca secilir', () => { render(<FlowChart nodes={[S]} />); const n = screen.getByTestId('flow-chart-node'); fireEvent.click(n); expect(n).toHaveAttribute('data-selected', 'true'); });
  it('canvas tiklaninca secim temizlenir', () => { render(<FlowChart nodes={[S]} />); const n = screen.getByTestId('flow-chart-node'); fireEvent.click(n); fireEvent.click(screen.getByTestId('flow-chart-canvas')); expect(n).not.toHaveAttribute('data-selected', 'true'); });
  it('bos node listesi ile hata vermez', () => { render(<FlowChart />); expect(screen.getByTestId('flow-chart-root')).toBeInTheDocument(); });
  it('className root elemana eklenir', () => { render(<FlowChart className="my-fc" />); expect(screen.getByTestId('flow-chart-root').className).toContain('my-fc'); });
  it('style root elemana eklenir', () => { render(<FlowChart style={{ padding: '16px' }} />); expect(screen.getByTestId('flow-chart-root')).toHaveStyle({ padding: '16px' }); });
  it('classNames.root root elemana eklenir', () => { render(<FlowChart classNames={{ root: 'custom-root' }} />); expect(screen.getByTestId('flow-chart-root').className).toContain('custom-root'); });
  it('classNames.toolbar toolbar elemana eklenir', () => { render(<FlowChart classNames={{ toolbar: 'custom-tb' }} />); expect(screen.getByTestId('flow-chart-toolbar').className).toContain('custom-tb'); });
  it('classNames.canvas canvas elemana eklenir', () => { render(<FlowChart classNames={{ canvas: 'custom-cv' }} />); expect(screen.getByTestId('flow-chart-canvas').className).toContain('custom-cv'); });
  it('classNames.minimap minimap elemana eklenir', () => { render(<FlowChart classNames={{ minimap: 'custom-mm' }} />); expect(screen.getByTestId('flow-chart-minimap').className).toContain('custom-mm'); });
  it('styles.root root elemana eklenir', () => { render(<FlowChart styles={{ root: { padding: '24px' } }} />); expect(screen.getByTestId('flow-chart-root')).toHaveStyle({ padding: '24px' }); });
  it('styles.toolbar toolbar elemana eklenir', () => { render(<FlowChart styles={{ toolbar: { padding: '12px' } }} />); expect(screen.getByTestId('flow-chart-toolbar')).toHaveStyle({ padding: '12px' }); });
  it('styles.minimap minimap elemana eklenir', () => { render(<FlowChart styles={{ minimap: { opacity: '0.8' } }} />); expect(screen.getByTestId('flow-chart-minimap')).toHaveStyle({ opacity: '0.8' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<FlowChart ref={ref} />); expect(ref).toHaveBeenCalled(); });
});

describe('FlowChart (Compound)', () => {
  it('compound: toolbar render edilir', () => { render(<FlowChart><FlowChart.Toolbar /></FlowChart>); expect(screen.getByTestId('flow-chart-toolbar')).toBeInTheDocument(); });
  it('compound: canvas render edilir', () => { render(<FlowChart nodes={[S]}><FlowChart.Canvas /></FlowChart>); expect(screen.getByTestId('flow-chart-canvas')).toBeInTheDocument(); });
  it('compound: minimap render edilir', () => { render(<FlowChart nodes={[S]}><FlowChart.Minimap /></FlowChart>); expect(screen.getByTestId('flow-chart-minimap')).toBeInTheDocument(); });
  it('compound: classNames context ile aktarilir', () => { render(<FlowChart classNames={{ toolbar: 'cmp-tb' }}><FlowChart.Toolbar /></FlowChart>); expect(screen.getByTestId('flow-chart-toolbar').className).toContain('cmp-tb'); });
  it('compound: styles context ile aktarilir', () => { render(<FlowChart styles={{ toolbar: { padding: '30px' } }}><FlowChart.Toolbar /></FlowChart>); expect(screen.getByTestId('flow-chart-toolbar')).toHaveStyle({ padding: '30px' }); });
  it('FlowChart.Toolbar context disinda hata firlatir', () => { expect(() => render(<FlowChart.Toolbar />)).toThrow(); });
  it('FlowChart.Canvas context disinda hata firlatir', () => { expect(() => render(<FlowChart.Canvas />)).toThrow(); });
});
