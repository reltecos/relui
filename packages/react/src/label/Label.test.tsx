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
import { Label } from './Label';

describe('Label', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(<Label>E-posta</Label>);

    expect(screen.getByText('E-posta')).toBeInTheDocument();
  });

  it('label elementi olarak render edilir', () => {
    const { container } = render(<Label>İsim</Label>);

    expect(container.querySelector('label')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // htmlFor
  // ──────────────────────────────────────────

  it('htmlFor doğru set edilir', () => {
    const { container } = render(<Label htmlFor="email">E-posta</Label>);
    const label = container.querySelector('label');

    expect(label).toHaveAttribute('for', 'email');
  });

  // ──────────────────────────────────────────
  // Required
  // ──────────────────────────────────────────

  it('required göstergesi render edilir', () => {
    render(<Label required>E-posta</Label>);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('required=false ise gösterge yok', () => {
    render(<Label>E-posta</Label>);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('required göstergesi aria-hidden', () => {
    render(<Label required>E-posta</Label>);
    const asterisk = screen.getByText('*');

    expect(asterisk).toHaveAttribute('aria-hidden', 'true');
  });

  it('data-required set edilir', () => {
    const { container } = render(<Label required>E-posta</Label>);

    expect(container.querySelector('label')).toHaveAttribute('data-required', '');
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda data-disabled set edilir', () => {
    const { container } = render(<Label disabled>E-posta</Label>);

    expect(container.querySelector('label')).toHaveAttribute('data-disabled', '');
  });

  it('disabled=false ise data-disabled yok', () => {
    const { container } = render(<Label>E-posta</Label>);

    expect(container.querySelector('label')).not.toHaveAttribute('data-disabled');
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id doğru iletilir', () => {
    const { container } = render(<Label id="my-label">E-posta</Label>);

    expect(container.querySelector('#my-label')).toBeInTheDocument();
  });

  it('className doğru iletilir', () => {
    const { container } = render(<Label className="custom">E-posta</Label>);

    expect(container.querySelector('label')).toHaveClass('custom');
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    const { container } = render(<Label classNames={{ root: 'slot-root' }}>E-posta</Label>);

    expect(container.querySelector('label')).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = render(
      <Label styles={{ root: { padding: '10px' } }}>E-posta</Label>,
    );

    expect(container.querySelector('label')).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = render(
      <Label className="legacy" classNames={{ root: 'slot-root' }}>E-posta</Label>,
    );
    const el = container.querySelector('label');

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('classNames.requiredIndicator uygulanir', () => {
    const { container } = render(
      <Label required classNames={{ requiredIndicator: 'my-indicator' }}>E-posta</Label>,
    );

    expect(container.querySelector('span')).toHaveClass('my-indicator');
  });

  it('styles.requiredIndicator uygulanir', () => {
    const { container } = render(
      <Label required styles={{ requiredIndicator: { fontSize: '10px' } }}>E-posta</Label>,
    );

    expect(container.querySelector('span')).toHaveStyle({ fontSize: '10px' });
  });
});

// ── Compound API ──

describe('Label (Compound)', () => {
  it('compound: Label.Text render edilir', () => {
    render(
      <Label>
        <Label.Text>E-posta</Label.Text>
      </Label>,
    );
    expect(screen.getByTestId('label-text')).toHaveTextContent('E-posta');
  });

  it('compound: Label.RequiredIndicator render edilir', () => {
    render(
      <Label>
        <Label.Text>E-posta</Label.Text>
        <Label.RequiredIndicator />
      </Label>,
    );
    expect(screen.getByTestId('label-required')).toBeInTheDocument();
    expect(screen.getByTestId('label-required')).toHaveTextContent('*');
  });

  it('compound: Label.RequiredIndicator ozel karakter', () => {
    render(
      <Label>
        <Label.Text>E-posta</Label.Text>
        <Label.RequiredIndicator>(zorunlu)</Label.RequiredIndicator>
      </Label>,
    );
    expect(screen.getByTestId('label-required')).toHaveTextContent('(zorunlu)');
  });

  it('compound: classNames context ile Label.Text a aktarilir', () => {
    render(
      <Label classNames={{ text: 'cmp-text-cls' }}>
        <Label.Text>E-posta</Label.Text>
      </Label>,
    );
    expect(screen.getByTestId('label-text').className).toContain('cmp-text-cls');
  });

  it('compound: styles context ile Label.RequiredIndicator a aktarilir', () => {
    render(
      <Label styles={{ requiredIndicator: { letterSpacing: '3px' } }}>
        <Label.Text>E-posta</Label.Text>
        <Label.RequiredIndicator />
      </Label>,
    );
    expect(screen.getByTestId('label-required')).toHaveStyle({ letterSpacing: '3px' });
  });

  it('compound: Label.RequiredIndicator aria-hidden', () => {
    render(
      <Label>
        <Label.Text>E-posta</Label.Text>
        <Label.RequiredIndicator />
      </Label>,
    );
    expect(screen.getByTestId('label-required')).toHaveAttribute('aria-hidden', 'true');
  });

  it('compound: Label.Text context disinda hata firlat', () => {
    expect(() => {
      render(<Label.Text>test</Label.Text>);
    }).toThrow('Label compound sub-components must be used within <Label>.');
  });

  it('compound: Label.RequiredIndicator context disinda hata firlat', () => {
    expect(() => {
      render(<Label.RequiredIndicator />);
    }).toThrow('Label compound sub-components must be used within <Label>.');
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Label ref={ref}>E-posta</Label>);
    expect(ref).toHaveBeenCalled();
  });
});
