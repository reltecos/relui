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
import { FormGroup } from './FormGroup';

describe('FormGroup', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    const { container } = render(
      <FormGroup>
        <div>İçerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('fieldset')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Legend
  // ──────────────────────────────────────────

  it('legend render edilir', () => {
    render(
      <FormGroup legend="Kişisel Bilgiler">
        <div>İçerik</div>
      </FormGroup>,
    );

    expect(screen.getByText('Kişisel Bilgiler')).toBeInTheDocument();
  });

  it('legend elementi doğru tag ile render edilir', () => {
    const { container } = render(
      <FormGroup legend="Başlık">
        <div>İçerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('legend')).toBeInTheDocument();
  });

  it('legend yoksa render edilmez', () => {
    const { container } = render(
      <FormGroup>
        <div>İçerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('legend')).not.toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Orientation
  // ──────────────────────────────────────────

  it('varsayılan orientation vertical', () => {
    const { container } = render(
      <FormGroup>
        <div>İçerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('fieldset')).toHaveAttribute('data-orientation', 'vertical');
  });

  it('horizontal orientation set edilir', () => {
    const { container } = render(
      <FormGroup orientation="horizontal">
        <div>İçerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('fieldset')).toHaveAttribute('data-orientation', 'horizontal');
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled fieldset disabled attribute set eder', () => {
    const { container } = render(
      <FormGroup disabled>
        <div>İçerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('fieldset')).toBeDisabled();
  });

  it('disabled=false ise disabled yok', () => {
    const { container } = render(
      <FormGroup>
        <div>İçerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('fieldset')).not.toBeDisabled();
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id doğru iletilir', () => {
    const { container } = render(
      <FormGroup id="my-group">
        <div>İçerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('#my-group')).toBeInTheDocument();
  });

  it('className doğru iletilir', () => {
    const { container } = render(
      <FormGroup className="custom">
        <div>İçerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('fieldset')).toHaveClass('custom');
  });

  // ──────────────────────────────────────────
  // Children
  // ──────────────────────────────────────────

  it('children doğru render edilir', () => {
    render(
      <FormGroup>
        <div data-testid="child-1">Birinci</div>
        <div data-testid="child-2">İkinci</div>
      </FormGroup>,
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    const { container } = render(
      <FormGroup classNames={{ root: 'slot-root' }}>
        <div>Icerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('fieldset')).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = render(
      <FormGroup styles={{ root: { padding: '10px' } }}>
        <div>Icerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('fieldset')).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = render(
      <FormGroup className="legacy" classNames={{ root: 'slot-root' }}>
        <div>Icerik</div>
      </FormGroup>,
    );
    const el = container.querySelector('fieldset');

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('style + styles.root birlestirilir', () => {
    const { container } = render(
      <FormGroup style={{ margin: '4px' }} styles={{ root: { padding: '10px' } }}>
        <div>Icerik</div>
      </FormGroup>,
    );
    const el = container.querySelector('fieldset');

    expect(el).toHaveStyle({ margin: '4px' });
    expect(el).toHaveStyle({ padding: '10px' });
  });

  it('classNames.legend uygulanir', () => {
    const { container } = render(
      <FormGroup legend="Baslik" classNames={{ legend: 'my-legend' }}>
        <div>Icerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('legend')).toHaveClass('my-legend');
  });

  it('styles.legend uygulanir', () => {
    const { container } = render(
      <FormGroup legend="Baslik" styles={{ legend: { fontSize: '16px' } }}>
        <div>Icerik</div>
      </FormGroup>,
    );

    expect(container.querySelector('legend')).toHaveStyle({ fontSize: '16px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(
      <FormGroup ref={ref}>
        <div>Icerik</div>
      </FormGroup>,
    );
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──────────────────────────────────────

describe('FormGroup (Compound)', () => {
  it('compound: Legend sub-component render edilir', () => {
    render(
      <FormGroup>
        <FormGroup.Legend>Kisisel Bilgiler</FormGroup.Legend>
        <div>Icerik</div>
      </FormGroup>,
    );
    expect(screen.getByTestId('form-group-legend')).toHaveTextContent('Kisisel Bilgiler');
  });

  it('compound: Content sub-component render edilir', () => {
    render(
      <FormGroup>
        <FormGroup.Legend>Baslik</FormGroup.Legend>
        <FormGroup.Content>
          <div data-testid="inner-field">Alan</div>
        </FormGroup.Content>
      </FormGroup>,
    );
    expect(screen.getByTestId('form-group-content')).toBeInTheDocument();
    expect(screen.getByTestId('inner-field')).toBeInTheDocument();
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <FormGroup classNames={{ legend: 'cmp-legend' }}>
        <FormGroup.Legend>Test</FormGroup.Legend>
      </FormGroup>,
    );
    expect(screen.getByTestId('form-group-legend').className).toContain('cmp-legend');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <FormGroup styles={{ legend: { letterSpacing: '3px' } }}>
        <FormGroup.Legend>Test</FormGroup.Legend>
      </FormGroup>,
    );
    expect(screen.getByTestId('form-group-legend')).toHaveStyle({ letterSpacing: '3px' });
  });

  it('compound: Content styles context ile aktarilir', () => {
    render(
      <FormGroup styles={{ content: { padding: '12px' } }}>
        <FormGroup.Content>
          <div>Icerik</div>
        </FormGroup.Content>
      </FormGroup>,
    );
    expect(screen.getByTestId('form-group-content')).toHaveStyle({ padding: '12px' });
  });
});
