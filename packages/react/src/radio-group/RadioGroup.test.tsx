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
import { RadioGroup } from './RadioGroup';

// Basit Radio mock — gercek Radio bileseni yerine
function MockRadio({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <label data-testid={`radio-${value}`}>
      <input type="radio" value={value} name="mock" readOnly />
      <span>{children}</span>
    </label>
  );
}

describe('RadioGroup', () => {
  // ── Root render ──

  it('root render edilir', () => {
    render(
      <RadioGroup aria-label="Plan">
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('role radiogroup set edilir', () => {
    render(
      <RadioGroup aria-label="Plan">
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('role', 'radiogroup');
  });

  it('children render edilir', () => {
    render(
      <RadioGroup aria-label="Plan">
        <MockRadio value="a">Secenek A</MockRadio>
        <MockRadio value="b">Secenek B</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByText('Secenek A')).toBeInTheDocument();
    expect(screen.getByText('Secenek B')).toBeInTheDocument();
  });

  // ── Orientation ──

  it('varsayilan orientation vertical', () => {
    const { container } = render(
      <RadioGroup aria-label="Plan">
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    const group = container.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(group.className).toBeTruthy();
  });

  it('orientation horizontal class uygulanir', () => {
    const { container: vertCont } = render(
      <RadioGroup aria-label="V" orientation="vertical">
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    const { container: horzCont } = render(
      <RadioGroup aria-label="H" orientation="horizontal">
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    const vertGroup = vertCont.querySelector('[role="radiogroup"]') as HTMLElement;
    const horzGroup = horzCont.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(vertGroup.className).not.toBe(horzGroup.className);
  });

  // ── ARIA ──

  it('aria-label set edilir', () => {
    render(
      <RadioGroup aria-label="Plan Secimi">
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'Plan Secimi');
  });

  it('aria-labelledby set edilir', () => {
    render(
      <RadioGroup aria-labelledby="plan-heading">
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-labelledby', 'plan-heading');
  });

  it('aria-required set edilir', () => {
    render(
      <RadioGroup aria-label="Plan" required>
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
  });

  it('aria-invalid set edilir', () => {
    render(
      <RadioGroup aria-label="Plan" invalid>
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
  });

  it('required=false durumda aria-required yok', () => {
    render(
      <RadioGroup aria-label="Plan">
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-required');
  });

  it('invalid=false durumda aria-invalid yok', () => {
    render(
      <RadioGroup aria-label="Plan">
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-invalid');
  });

  // ── Props forwarding ──

  it('id set edilir', () => {
    render(
      <RadioGroup aria-label="Plan" id="plan-group">
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('id', 'plan-group');
  });

  it('ref forward edilir', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <RadioGroup aria-label="Plan" ref={(el) => { refValue = el; }}>
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(refValue).toBe(screen.getByRole('radiogroup'));
  });

  // ── className & style ──

  it('className eklenir', () => {
    render(
      <RadioGroup aria-label="Plan" className="my-group">
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup').className).toContain('my-group');
  });

  it('style uygulanir', () => {
    render(
      <RadioGroup aria-label="Plan" style={{ padding: '16px' }}>
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(
      <RadioGroup aria-label="Plan" classNames={{ root: 'custom-root' }}>
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup').className).toContain('custom-root');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(
      <RadioGroup aria-label="Plan" styles={{ root: { gap: '24px' } }}>
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toHaveStyle({ gap: '24px' });
  });

  it('className + classNames.root birlestirilir', () => {
    render(
      <RadioGroup aria-label="Plan" className="outer" classNames={{ root: 'inner' }}>
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    const el = screen.getByRole('radiogroup');
    expect(el).toHaveClass('outer');
    expect(el).toHaveClass('inner');
  });

  it('style + styles.root birlestirilir', () => {
    render(
      <RadioGroup aria-label="Plan" style={{ margin: '4px' }} styles={{ root: { padding: '8px' } }}>
        <MockRadio value="a">A</MockRadio>
      </RadioGroup>,
    );
    const el = screen.getByRole('radiogroup');
    expect(el).toHaveStyle({ margin: '4px', padding: '8px' });
  });

  // ── Context propagation (basic) ──

  it('birden fazla children render edilir', () => {
    render(
      <RadioGroup aria-label="Plan">
        <MockRadio value="free">Ucretsiz</MockRadio>
        <MockRadio value="pro">Pro</MockRadio>
        <MockRadio value="enterprise">Enterprise</MockRadio>
      </RadioGroup>,
    );
    expect(screen.getByText('Ucretsiz')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });
});
