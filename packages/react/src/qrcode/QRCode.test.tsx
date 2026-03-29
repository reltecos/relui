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
import { QRCode } from './QRCode';

describe('QRCode', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<QRCode value="Test" />);
    expect(screen.getByTestId('qrcode-root')).toBeInTheDocument();
  });

  it('varsayilan size md', () => {
    render(<QRCode value="Test" />);
    expect(screen.getByTestId('qrcode-root')).toHaveAttribute('data-size', 'md');
  });

  it('size sm set edilir', () => {
    render(<QRCode value="Test" size="sm" />);
    expect(screen.getByTestId('qrcode-root')).toHaveAttribute('data-size', 'sm');
  });

  it('size lg set edilir', () => {
    render(<QRCode value="Test" size="lg" />);
    expect(screen.getByTestId('qrcode-root')).toHaveAttribute('data-size', 'lg');
  });

  // ── SVG ──

  it('svg render edilir', () => {
    render(<QRCode value="Hello" />);
    expect(screen.getByTestId('qrcode-svg')).toBeInTheDocument();
  });

  it('svg role img', () => {
    render(<QRCode value="Hello" />);
    expect(screen.getByTestId('qrcode-svg')).toHaveAttribute('role', 'img');
  });

  it('svg aria-label QR Code', () => {
    render(<QRCode value="Hello" />);
    expect(screen.getByTestId('qrcode-svg')).toHaveAttribute('aria-label', 'QR Code');
  });

  it('svg viewBox degeri var', () => {
    render(<QRCode value="Hello" size="md" />);
    const svg = screen.getByTestId('qrcode-svg');
    const viewBox = svg.getAttribute('viewBox');
    expect(viewBox).toMatch(/^0 0 \d+ \d+$/);
  });

  it('svg rect elementleri icerir', () => {
    render(<QRCode value="Hello" />);
    const svg = screen.getByTestId('qrcode-svg');
    const rects = svg.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(0);
  });

  // ── Label ──

  it('label render edilir', () => {
    render(<QRCode value="Test" label="Tara" />);
    expect(screen.getByTestId('qrcode-label')).toHaveTextContent('Tara');
  });

  it('label olmadan label render edilmez', () => {
    render(<QRCode value="Test" />);
    expect(screen.queryByTestId('qrcode-label')).not.toBeInTheDocument();
  });

  it('label ReactNode olabilir', () => {
    render(<QRCode value="Test" label={<strong data-testid="bold-label">Tara</strong>} />);
    expect(screen.getByTestId('bold-label')).toBeInTheDocument();
  });

  // ── Error Correction ──

  it('errorCorrection L ile render edilir', () => {
    render(<QRCode value="Test" errorCorrection="L" />);
    expect(screen.getByTestId('qrcode-svg')).toBeInTheDocument();
  });

  it('errorCorrection H ile render edilir', () => {
    render(<QRCode value="Test" errorCorrection="H" />);
    expect(screen.getByTestId('qrcode-svg')).toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<QRCode value="Test" className="my-qr" />);
    expect(screen.getByTestId('qrcode-root').className).toContain('my-qr');
  });

  it('style root elemana eklenir', () => {
    render(<QRCode value="Test" style={{ padding: '16px' }} />);
    expect(screen.getByTestId('qrcode-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<QRCode value="Test" classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('qrcode-root').className).toContain('custom-root');
  });

  it('classNames.svg svg elemana eklenir', () => {
    render(<QRCode value="Test" classNames={{ svg: 'custom-svg' }} />);
    expect(screen.getByTestId('qrcode-svg').className.baseVal || screen.getByTestId('qrcode-svg').getAttribute('class')).toContain('custom-svg');
  });

  it('classNames.label label elemana eklenir', () => {
    render(<QRCode value="Test" label="Tara" classNames={{ label: 'custom-label' }} />);
    expect(screen.getByTestId('qrcode-label').className).toContain('custom-label');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<QRCode value="Test" styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('qrcode-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.label label elemana eklenir', () => {
    render(<QRCode value="Test" label="Tara" styles={{ label: { fontSize: '18px' } }} />);
    expect(screen.getByTestId('qrcode-label')).toHaveStyle({ fontSize: '18px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<QRCode value="Test" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('QRCode (Compound)', () => {
  it('compound: svg render edilir', () => {
    render(
      <QRCode value="Hello">
        <QRCode.Svg />
      </QRCode>,
    );
    expect(screen.getByTestId('qrcode-svg')).toBeInTheDocument();
  });

  it('compound: svg rect elementleri icerir', () => {
    render(
      <QRCode value="Hello">
        <QRCode.Svg />
      </QRCode>,
    );
    const svg = screen.getByTestId('qrcode-svg');
    const rects = svg.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(0);
  });

  it('compound: label render edilir', () => {
    render(
      <QRCode value="Hello">
        <QRCode.Svg />
        <QRCode.Label>Tara beni</QRCode.Label>
      </QRCode>,
    );
    expect(screen.getByTestId('qrcode-label')).toHaveTextContent('Tara beni');
  });

  it('compound: svg ve label birlikte render edilir', () => {
    render(
      <QRCode value="URL" size="lg">
        <QRCode.Svg />
        <QRCode.Label>URL QR Kodu</QRCode.Label>
      </QRCode>,
    );
    expect(screen.getByTestId('qrcode-svg')).toBeInTheDocument();
    expect(screen.getByTestId('qrcode-label')).toBeInTheDocument();
    expect(screen.getByTestId('qrcode-root')).toHaveAttribute('data-size', 'lg');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <QRCode value="Test" classNames={{ label: 'cmp-label' }}>
        <QRCode.Svg />
        <QRCode.Label>Etiket</QRCode.Label>
      </QRCode>,
    );
    expect(screen.getByTestId('qrcode-label').className).toContain('cmp-label');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <QRCode value="Test" styles={{ label: { fontSize: '20px' } }}>
        <QRCode.Svg />
        <QRCode.Label>Etiket</QRCode.Label>
      </QRCode>,
    );
    expect(screen.getByTestId('qrcode-label')).toHaveStyle({ fontSize: '20px' });
  });

  it('QRCode.Svg context disinda hata firlatir', () => {
    expect(() => render(<QRCode.Svg />)).toThrow();
  });

  it('QRCode.Label context disinda hata firlatir', () => {
    expect(() => render(<QRCode.Label>Hata</QRCode.Label>)).toThrow();
  });
});
