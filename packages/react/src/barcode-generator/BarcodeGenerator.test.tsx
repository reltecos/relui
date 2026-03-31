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
import { BarcodeGenerator } from './BarcodeGenerator';

describe('BarcodeGenerator', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<BarcodeGenerator value="12345" />);
    expect(screen.getByTestId('barcode-root')).toBeInTheDocument();
  });

  it('varsayilan format code128', () => {
    render(<BarcodeGenerator value="12345" />);
    expect(screen.getByTestId('barcode-root')).toHaveAttribute('data-format', 'code128');
  });

  it('format set edilir', () => {
    render(<BarcodeGenerator value="12345" format="code39" />);
    expect(screen.getByTestId('barcode-root')).toHaveAttribute('data-format', 'code39');
  });

  // ── SVG ──

  it('svg render edilir', () => {
    render(<BarcodeGenerator value="12345" />);
    expect(screen.getByTestId('barcode-svg')).toBeInTheDocument();
  });

  it('svg aria-label iceriyor', () => {
    render(<BarcodeGenerator value="HELLO" format="code128" />);
    expect(screen.getByTestId('barcode-svg')).toHaveAttribute('aria-label', 'Barcode: HELLO');
  });

  it('gecersiz deger ile error gosterilir', () => {
    render(<BarcodeGenerator value="@@@" format="ean13" />);
    expect(screen.getByTestId('barcode-error')).toBeInTheDocument();
  });

  // ── Value ──

  it('showValue ile deger gosterilir', () => {
    render(<BarcodeGenerator value="12345" showValue />);
    expect(screen.getByTestId('barcode-value')).toHaveTextContent('12345');
  });

  it('showValue false ile deger gizlenir', () => {
    render(<BarcodeGenerator value="12345" showValue={false} />);
    expect(screen.queryByTestId('barcode-value')).not.toBeInTheDocument();
  });

  // ── Label ──

  it('label render edilir', () => {
    render(<BarcodeGenerator value="12345" label="Product ID" />);
    expect(screen.getByTestId('barcode-label')).toHaveTextContent('Product ID');
  });

  it('label olmadan label render edilmez', () => {
    render(<BarcodeGenerator value="12345" />);
    expect(screen.queryByTestId('barcode-label')).not.toBeInTheDocument();
  });

  // ── Formats ──

  it('code128 render eder', () => {
    render(<BarcodeGenerator value="Hello" format="code128" />);
    expect(screen.getByTestId('barcode-svg')).toBeInTheDocument();
  });

  it('code39 render eder', () => {
    render(<BarcodeGenerator value="HELLO" format="code39" />);
    expect(screen.getByTestId('barcode-svg')).toBeInTheDocument();
  });

  it('ean13 render eder', () => {
    render(<BarcodeGenerator value="590123412345" format="ean13" />);
    expect(screen.getByTestId('barcode-svg')).toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<BarcodeGenerator value="12345" className="my-bc" />);
    expect(screen.getByTestId('barcode-root').className).toContain('my-bc');
  });

  it('style root elemana eklenir', () => {
    render(<BarcodeGenerator value="12345" style={{ padding: '16px' }} />);
    expect(screen.getByTestId('barcode-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<BarcodeGenerator value="12345" classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('barcode-root').className).toContain('custom-root');
  });

  it('classNames.value value elemana eklenir', () => {
    render(<BarcodeGenerator value="12345" classNames={{ value: 'custom-val' }} />);
    expect(screen.getByTestId('barcode-value').className).toContain('custom-val');
  });

  it('classNames.label label elemana eklenir', () => {
    render(<BarcodeGenerator value="12345" label="L" classNames={{ label: 'custom-lbl' }} />);
    expect(screen.getByTestId('barcode-label').className).toContain('custom-lbl');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<BarcodeGenerator value="12345" styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('barcode-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.value value elemana eklenir', () => {
    render(<BarcodeGenerator value="12345" styles={{ value: { fontSize: '18px' } }} />);
    expect(screen.getByTestId('barcode-value')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.label label elemana eklenir', () => {
    render(<BarcodeGenerator value="12345" label="L" styles={{ label: { letterSpacing: '0.1em' } }} />);
    expect(screen.getByTestId('barcode-label')).toHaveStyle({ letterSpacing: '0.1em' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<BarcodeGenerator value="12345" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('BarcodeGenerator (Compound)', () => {
  it('compound: svg render edilir', () => {
    render(
      <BarcodeGenerator value="12345">
        <BarcodeGenerator.Svg />
      </BarcodeGenerator>,
    );
    expect(screen.getByTestId('barcode-svg')).toBeInTheDocument();
  });

  it('compound: label render edilir', () => {
    render(
      <BarcodeGenerator value="12345">
        <BarcodeGenerator.Label>Test Label</BarcodeGenerator.Label>
        <BarcodeGenerator.Svg />
      </BarcodeGenerator>,
    );
    expect(screen.getByTestId('barcode-label')).toHaveTextContent('Test Label');
  });

  it('compound: value render edilir', () => {
    render(
      <BarcodeGenerator value="12345">
        <BarcodeGenerator.Svg />
        <BarcodeGenerator.Value />
      </BarcodeGenerator>,
    );
    expect(screen.getByTestId('barcode-value')).toHaveTextContent('12345');
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <BarcodeGenerator value="12345" classNames={{ label: 'cmp-lbl' }}>
        <BarcodeGenerator.Label>T</BarcodeGenerator.Label>
      </BarcodeGenerator>,
    );
    expect(screen.getByTestId('barcode-label').className).toContain('cmp-lbl');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <BarcodeGenerator value="12345" styles={{ value: { fontSize: '20px' } }}>
        <BarcodeGenerator.Value />
      </BarcodeGenerator>,
    );
    expect(screen.getByTestId('barcode-value')).toHaveStyle({ fontSize: '20px' });
  });

  it('BarcodeGenerator.Svg context disinda hata firlatir', () => {
    expect(() => render(<BarcodeGenerator.Svg />)).toThrow();
  });
});
