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
import { ValidationSummary } from './ValidationSummary';
import type { ValidationError } from '@relteco/relui-core';

const sampleErrors: ValidationError[] = [
  { field: 'name', message: 'Ad zorunludur' },
  { field: 'email', message: 'Gecersiz e-posta' },
  { field: 'age', message: 'Yas 0 dan buyuk olmali', severity: 'warning' },
];

describe('ValidationSummary', () => {
  // ── Render ──

  it('hata yokken render etmez', () => {
    const { container } = render(<ValidationSummary errors={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('hatalar varken root render eder', () => {
    render(<ValidationSummary errors={sampleErrors} />);
    expect(screen.getByTestId('validation-summary-root')).toBeInTheDocument();
  });

  it('varsayilan baslik gosterir', () => {
    render(<ValidationSummary errors={sampleErrors} />);
    expect(screen.getByTestId('validation-summary-title')).toHaveTextContent(
      'Lutfen asagidaki hatalari duzeltin',
    );
  });

  it('ozel baslik gosterir', () => {
    render(<ValidationSummary errors={sampleErrors} title="Hatalar" />);
    expect(screen.getByTestId('validation-summary-title')).toHaveTextContent('Hatalar');
  });

  it('showTitle=false iken baslik gorunmez', () => {
    render(<ValidationSummary errors={sampleErrors} showTitle={false} />);
    expect(screen.queryByTestId('validation-summary-title')).not.toBeInTheDocument();
  });

  // ── Hata listesi ──

  it('tum hatalari listeler', () => {
    render(<ValidationSummary errors={sampleErrors} />);
    const items = screen.getAllByTestId('validation-summary-item');
    expect(items).toHaveLength(3);
  });

  it('hata mesajlarini gosterir', () => {
    render(<ValidationSummary errors={sampleErrors} />);
    const messages = screen.getAllByTestId('validation-summary-item-message');
    expect(messages[0]).toHaveTextContent('Ad zorunludur');
    expect(messages[1]).toHaveTextContent('Gecersiz e-posta');
    expect(messages[2]).toHaveTextContent('Yas 0 dan buyuk olmali');
  });

  it('hata field data attribute icerir', () => {
    render(<ValidationSummary errors={sampleErrors} />);
    const items = screen.getAllByTestId('validation-summary-item');
    expect(items[0]).toHaveAttribute('data-field', 'name');
    expect(items[1]).toHaveAttribute('data-field', 'email');
  });

  it('severity data attribute icerir', () => {
    render(<ValidationSummary errors={sampleErrors} />);
    const items = screen.getAllByTestId('validation-summary-item');
    expect(items[0]).toHaveAttribute('data-severity', 'error');
    expect(items[2]).toHaveAttribute('data-severity', 'warning');
  });

  // ── onErrorClick ──

  it('hataya tiklaninca onErrorClick cagirilir', () => {
    const onErrorClick = vi.fn();
    render(<ValidationSummary errors={sampleErrors} onErrorClick={onErrorClick} />);
    const items = screen.getAllByTestId('validation-summary-item');
    const first = items[0];
    expect(first).toBeDefined();
    fireEvent.click(first as HTMLElement);
    expect(onErrorClick).toHaveBeenCalledTimes(1);
    expect(onErrorClick).toHaveBeenCalledWith(sampleErrors[0]);
  });

  it('ikinci hataya tiklaninca dogru error ile cagirilir', () => {
    const onErrorClick = vi.fn();
    render(<ValidationSummary errors={sampleErrors} onErrorClick={onErrorClick} />);
    const items = screen.getAllByTestId('validation-summary-item');
    const second = items[1];
    expect(second).toBeDefined();
    fireEvent.click(second as HTMLElement);
    expect(onErrorClick).toHaveBeenCalledWith(sampleErrors[1]);
  });

  // ── A11y ──

  it('role=alert icerir', () => {
    render(<ValidationSummary errors={sampleErrors} />);
    expect(screen.getByTestId('validation-summary-root')).toHaveAttribute('role', 'alert');
  });

  it('aria-live=polite icerir', () => {
    render(<ValidationSummary errors={sampleErrors} />);
    expect(screen.getByTestId('validation-summary-root')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  it('liste ul elementi ile render edilir', () => {
    render(<ValidationSummary errors={sampleErrors} />);
    expect(screen.getByTestId('validation-summary-list').tagName).toBe('UL');
  });

  it('item li elementi ile render edilir', () => {
    render(<ValidationSummary errors={sampleErrors} />);
    const items = screen.getAllByTestId('validation-summary-item');
    const firstItem = items[0];
    expect(firstItem).toBeDefined();
    expect((firstItem as HTMLElement).tagName).toBe('LI');
  });

  // ── ref ──

  it('ref root elementine iletilir', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ValidationSummary ref={ref} errors={sampleErrors} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── className & style ──

  it('className root elementine eklenir', () => {
    render(<ValidationSummary errors={sampleErrors} className="custom-vs" />);
    expect(screen.getByTestId('validation-summary-root').className).toContain('custom-vs');
  });

  it('style root elementine uygulanir', () => {
    render(<ValidationSummary errors={sampleErrors} style={{ padding: '24px' }} />);
    expect(screen.getByTestId('validation-summary-root')).toHaveStyle({ padding: '24px' });
  });

  // ── Slot API: classNames ──

  it('classNames.title title elementine eklenir', () => {
    render(
      <ValidationSummary errors={sampleErrors} classNames={{ title: 'custom-title' }} />,
    );
    expect(screen.getByTestId('validation-summary-title').className).toContain('custom-title');
  });

  it('classNames.list list elementine eklenir', () => {
    render(
      <ValidationSummary errors={sampleErrors} classNames={{ list: 'custom-list' }} />,
    );
    expect(screen.getByTestId('validation-summary-list').className).toContain('custom-list');
  });

  // ── Slot API: styles ──

  it('styles.root root elementine uygulanir', () => {
    render(
      <ValidationSummary errors={sampleErrors} styles={{ root: { fontSize: '16px' } }} />,
    );
    expect(screen.getByTestId('validation-summary-root')).toHaveStyle({ fontSize: '16px' });
  });

  it('styles.title title elementine uygulanir', () => {
    render(
      <ValidationSummary errors={sampleErrors} styles={{ title: { fontWeight: '400' } }} />,
    );
    expect(screen.getByTestId('validation-summary-title')).toHaveStyle({ fontWeight: '400' });
  });

  it('styles.list list elementine uygulanir', () => {
    render(
      <ValidationSummary errors={sampleErrors} styles={{ list: { padding: '12px' } }} />,
    );
    expect(screen.getByTestId('validation-summary-list')).toHaveStyle({ padding: '12px' });
  });

  // ── Tek hata ──

  it('tek hata dogru render edilir', () => {
    render(
      <ValidationSummary errors={[{ field: 'name', message: 'Zorunlu' }]} />,
    );
    const items = screen.getAllByTestId('validation-summary-item');
    expect(items).toHaveLength(1);
  });

  // ── Sadece warning ──

  it('sadece warning hatalar dogru severity gosterir', () => {
    render(
      <ValidationSummary
        errors={[{ field: 'x', message: 'Uyari', severity: 'warning' }]}
      />,
    );
    const item = screen.getByTestId('validation-summary-item');
    expect(item).toHaveAttribute('data-severity', 'warning');
  });
});

// ── Compound API ──

describe('ValidationSummary (Compound)', () => {
  it('compound: children ile root render eder', () => {
    render(
      <ValidationSummary errors={sampleErrors}>
        <ValidationSummary.Title>Hatalar</ValidationSummary.Title>
      </ValidationSummary>,
    );
    expect(screen.getByTestId('validation-summary-root')).toBeInTheDocument();
  });

  it('compound: ValidationSummary.Title render edilir', () => {
    render(
      <ValidationSummary errors={sampleErrors}>
        <ValidationSummary.Title>Ozel Baslik</ValidationSummary.Title>
      </ValidationSummary>,
    );
    expect(screen.getByTestId('validation-summary-title')).toHaveTextContent('Ozel Baslik');
  });

  it('compound: ValidationSummary.Item render edilir', () => {
    render(
      <ValidationSummary errors={sampleErrors}>
        <ValidationSummary.Item severity="error" field="name">
          Ad zorunludur
        </ValidationSummary.Item>
      </ValidationSummary>,
    );
    const item = screen.getByTestId('validation-summary-item');
    expect(item).toBeInTheDocument();
    expect(item).toHaveAttribute('data-severity', 'error');
    expect(item).toHaveAttribute('data-field', 'name');
  });

  it('compound: ValidationSummary.Icon render edilir', () => {
    render(
      <ValidationSummary errors={sampleErrors}>
        <ValidationSummary.Icon severity="error" />
      </ValidationSummary>,
    );
    expect(screen.getByTestId('validation-summary-icon')).toBeInTheDocument();
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <ValidationSummary errors={sampleErrors} classNames={{ title: 'cmp-title' }}>
        <ValidationSummary.Title>Test</ValidationSummary.Title>
      </ValidationSummary>,
    );
    expect(screen.getByTestId('validation-summary-title').className).toContain('cmp-title');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <ValidationSummary errors={sampleErrors} styles={{ title: { fontSize: '20px' } }}>
        <ValidationSummary.Title>Test</ValidationSummary.Title>
      </ValidationSummary>,
    );
    expect(screen.getByTestId('validation-summary-title')).toHaveStyle({ fontSize: '20px' });
  });

  it('compound: ValidationSummary.Item onClick cagirilir', () => {
    const onClick = vi.fn();
    render(
      <ValidationSummary errors={sampleErrors}>
        <ValidationSummary.Item severity="error" field="name" onClick={onClick}>
          Ad zorunludur
        </ValidationSummary.Item>
      </ValidationSummary>,
    );
    fireEvent.click(screen.getByTestId('validation-summary-item'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
