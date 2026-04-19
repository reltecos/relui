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
import { SankeyDiagram } from './SankeyDiagram';
import type { SankeyNodeDef, SankeyLinkDef } from '@relteco/relui-core';

const nodes: SankeyNodeDef[] = [
  { id: 'a', name: 'Source A' },
  { id: 'b', name: 'Source B' },
  { id: 'c', name: 'Target C' },
  { id: 'd', name: 'Target D' },
];

const links: SankeyLinkDef[] = [
  { source: 'a', target: 'c', value: 50 },
  { source: 'a', target: 'd', value: 30 },
  { source: 'b', target: 'c', value: 40 },
  { source: 'b', target: 'd', value: 20 },
];

describe('SankeyDiagram', () => {
  it('root render edilir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} />);
    expect(screen.getByTestId('sankey-diagram-root')).toBeInTheDocument();
  });

  it('svg render edilir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} />);
    expect(screen.getByTestId('sankey-diagram-root').querySelector('svg')).toBeInTheDocument();
  });

  it('node rect render edilir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} />);
    expect(screen.getAllByTestId('sankey-diagram-node-rect')).toHaveLength(4);
  });

  it('link path render edilir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} />);
    expect(screen.getAllByTestId('sankey-diagram-link-path')).toHaveLength(4);
  });

  it('label text render edilir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} />);
    expect(screen.getAllByTestId('sankey-diagram-label-text')).toHaveLength(4);
  });

  it('label icerik dogru', () => {
    render(<SankeyDiagram nodes={nodes} links={links} />);
    const labels = screen.getAllByTestId('sankey-diagram-label-text');
    const texts = labels.map((l) => l.textContent);
    expect(texts).toContain('Source A');
  });

  it('showLabels false ile label gizlenir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} showLabels={false} />);
    expect(screen.queryByTestId('sankey-diagram-label-text')).not.toBeInTheDocument();
  });

  it('legend render edilir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} />);
    expect(screen.getByTestId('sankey-diagram-legend')).toBeInTheDocument();
  });

  it('showLegend false ile legend gizlenir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} showLegend={false} />);
    expect(screen.queryByTestId('sankey-diagram-legend')).not.toBeInTheDocument();
  });

  it('svg role img ve aria-label', () => {
    render(<SankeyDiagram nodes={nodes} links={links} />);
    const svg = screen.getByTestId('sankey-diagram-root').querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Sankey diagram');
  });

  it('bos veri ile hata vermez', () => {
    render(<SankeyDiagram nodes={[]} links={[]} />);
    expect(screen.getByTestId('sankey-diagram-root')).toBeInTheDocument();
  });

  it('custom width/height ile render edilir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} width={700} height={400} />);
    const svg = screen.getByTestId('sankey-diagram-root').querySelector('svg');
    expect(svg).toHaveAttribute('width', '700');
    expect(svg).toHaveAttribute('height', '400');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} className="my-sankey" />);
    expect(screen.getByTestId('sankey-diagram-root').className).toContain('my-sankey');
  });

  it('style root elemana eklenir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('sankey-diagram-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('sankey-diagram-root').className).toContain('custom-root');
  });

  it('classNames.node node elemana eklenir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} classNames={{ node: 'custom-node' }} />);
    expect(screen.getAllByTestId('sankey-diagram-node-rect')[0].getAttribute('class')).toContain('custom-node');
  });

  it('classNames.link link elemana eklenir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} classNames={{ link: 'custom-link' }} />);
    expect(screen.getAllByTestId('sankey-diagram-link-path')[0].getAttribute('class')).toContain('custom-link');
  });

  it('classNames.label label elemana eklenir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} classNames={{ label: 'custom-label' }} />);
    expect(screen.getAllByTestId('sankey-diagram-label-text')[0].getAttribute('class')).toContain('custom-label');
  });

  it('classNames.legend legend elemana eklenir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} classNames={{ legend: 'custom-legend' }} />);
    expect(screen.getByTestId('sankey-diagram-legend').className).toContain('custom-legend');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('sankey-diagram-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.legend legend elemana eklenir', () => {
    render(<SankeyDiagram nodes={nodes} links={links} styles={{ legend: { padding: '8px' } }} />);
    expect(screen.getByTestId('sankey-diagram-legend')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<SankeyDiagram nodes={nodes} links={links} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('SankeyDiagram (Compound)', () => {
  it('compound: node render edilir', () => {
    render(
      <SankeyDiagram nodes={nodes} links={links}>
        <SankeyDiagram.Node />
      </SankeyDiagram>,
    );
    expect(screen.getByTestId('sankey-diagram-node')).toBeInTheDocument();
  });

  it('compound: link render edilir', () => {
    render(
      <SankeyDiagram nodes={nodes} links={links}>
        <SankeyDiagram.Link />
        <SankeyDiagram.Node />
      </SankeyDiagram>,
    );
    expect(screen.getByTestId('sankey-diagram-link')).toBeInTheDocument();
  });

  it('compound: label render edilir', () => {
    render(
      <SankeyDiagram nodes={nodes} links={links}>
        <SankeyDiagram.Node />
        <SankeyDiagram.Label />
      </SankeyDiagram>,
    );
    expect(screen.getByTestId('sankey-diagram-label')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <SankeyDiagram nodes={nodes} links={links} classNames={{ legend: 'cmp-legend' }}>
        <SankeyDiagram.Node />
        <SankeyDiagram.Link />
        <SankeyDiagram.Legend />
      </SankeyDiagram>,
    );
  });

  it('compound: legend compound modda render edilir', () => {
    render(
      <SankeyDiagram nodes={nodes} links={links}>
        <SankeyDiagram.Node />
        <SankeyDiagram.Legend />
      </SankeyDiagram>,
    );
    expect(screen.getByTestId('sankey-diagram-legend')).toBeInTheDocument();
  });

  it('SankeyDiagram.Node context disinda hata firlatir', () => {
    expect(() => render(<SankeyDiagram.Node />)).toThrow();
  });

  it('SankeyDiagram.Link context disinda hata firlatir', () => {
    expect(() => render(<SankeyDiagram.Link />)).toThrow();
  });

  it('SankeyDiagram.Label context disinda hata firlatir', () => {
    expect(() => render(<SankeyDiagram.Label />)).toThrow();
  });

  it('SankeyDiagram.Legend context disinda hata firlatir', () => {
    expect(() => render(<SankeyDiagram.Legend />)).toThrow();
  });
});
