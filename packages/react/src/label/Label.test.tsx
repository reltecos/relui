/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
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
