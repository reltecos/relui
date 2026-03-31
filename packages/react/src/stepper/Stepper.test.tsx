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
import { Stepper } from './Stepper';

const defaultSteps = [
  { title: 'Bilgi' },
  { title: 'Onay' },
  { title: 'Tamamla' },
];

describe('Stepper', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Stepper steps={defaultSteps} activeIndex={0} />);
    expect(screen.getByTestId('stepper-root')).toBeInTheDocument();
  });

  it('root role list', () => {
    render(<Stepper steps={defaultSteps} activeIndex={0} />);
    expect(screen.getByTestId('stepper-root')).toHaveAttribute('role', 'list');
  });

  it('dogru sayida adim render edilir', () => {
    render(<Stepper steps={defaultSteps} activeIndex={0} />);
    expect(screen.getAllByTestId('stepper-step')).toHaveLength(3);
  });

  it('varsayilan orientation horizontal', () => {
    render(<Stepper steps={defaultSteps} activeIndex={0} />);
    expect(screen.getByTestId('stepper-root')).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('orientation vertical set edilir', () => {
    render(<Stepper steps={defaultSteps} activeIndex={0} orientation="vertical" />);
    expect(screen.getByTestId('stepper-root')).toHaveAttribute('data-orientation', 'vertical');
  });

  // ── Active step ──

  it('aktif adim aria-current step alir', () => {
    render(<Stepper steps={defaultSteps} activeIndex={1} />);
    const steps = screen.getAllByTestId('stepper-step');
    expect(steps[1]).toHaveAttribute('aria-current', 'step');
  });

  it('aktif olmayan adim aria-current almaz', () => {
    render(<Stepper steps={defaultSteps} activeIndex={1} />);
    const steps = screen.getAllByTestId('stepper-step');
    expect(steps[0]).not.toHaveAttribute('aria-current');
    expect(steps[2]).not.toHaveAttribute('aria-current');
  });

  it('adim statusleri dogru set edilir', () => {
    render(<Stepper steps={defaultSteps} activeIndex={1} />);
    const steps = screen.getAllByTestId('stepper-step');
    expect(steps[0]).toHaveAttribute('data-status', 'completed');
    expect(steps[1]).toHaveAttribute('data-status', 'active');
    expect(steps[2]).toHaveAttribute('data-status', 'pending');
  });

  // ── Indicator ──

  it('indicator render edilir', () => {
    render(<Stepper steps={defaultSteps} activeIndex={0} />);
    expect(screen.getAllByTestId('stepper-indicator')).toHaveLength(3);
  });

  it('pending adim numarasini gosterir', () => {
    render(<Stepper steps={defaultSteps} activeIndex={0} />);
    const indicators = screen.getAllByTestId('stepper-indicator');
    expect(indicators[1]).toHaveTextContent('2');
  });

  it('completed adim CheckIcon gosterir', () => {
    render(<Stepper steps={defaultSteps} activeIndex={2} />);
    const indicators = screen.getAllByTestId('stepper-indicator');
    // First two are completed, should have SVG (CheckIcon)
    const svg = indicators[0].querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // ── Title ──

  it('adim basliklari render edilir', () => {
    render(<Stepper steps={defaultSteps} activeIndex={0} />);
    const titles = screen.getAllByTestId('stepper-title');
    expect(titles[0]).toHaveTextContent('Bilgi');
    expect(titles[1]).toHaveTextContent('Onay');
    expect(titles[2]).toHaveTextContent('Tamamla');
  });

  // ── Description ──

  it('adim aciklamalari render edilir', () => {
    const stepsWithDesc = [
      { title: 'Bilgi', description: 'Kisisel bilgilerinizi girin' },
      { title: 'Onay', description: 'Bilgileri onaylayin' },
    ];
    render(<Stepper steps={stepsWithDesc} activeIndex={0} />);
    const descriptions = screen.getAllByTestId('stepper-description');
    expect(descriptions[0]).toHaveTextContent('Kisisel bilgilerinizi girin');
  });

  it('aciklama olmadan description render edilmez', () => {
    render(<Stepper steps={[{ title: 'A' }]} activeIndex={0} />);
    expect(screen.queryByTestId('stepper-description')).not.toBeInTheDocument();
  });

  // ── Connector ──

  it('connector adimlar arasinda render edilir', () => {
    render(<Stepper steps={defaultSteps} activeIndex={0} />);
    // 3 steps = 2 connectors
    expect(screen.getAllByTestId('stepper-connector')).toHaveLength(2);
  });

  it('son adimdan sonra connector render edilmez', () => {
    render(<Stepper steps={[{ title: 'A' }]} activeIndex={0} />);
    expect(screen.queryByTestId('stepper-connector')).not.toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Stepper steps={defaultSteps} activeIndex={0} className="my-stepper" />);
    expect(screen.getByTestId('stepper-root').className).toContain('my-stepper');
  });

  it('style root elemana eklenir', () => {
    render(<Stepper steps={defaultSteps} activeIndex={0} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('stepper-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(
      <Stepper steps={defaultSteps} activeIndex={0} classNames={{ root: 'custom-root' }} />,
    );
    expect(screen.getByTestId('stepper-root').className).toContain('custom-root');
  });

  it('classNames.step step elemana eklenir', () => {
    render(
      <Stepper steps={defaultSteps} activeIndex={0} classNames={{ step: 'custom-step' }} />,
    );
    expect(screen.getAllByTestId('stepper-step')[0].className).toContain('custom-step');
  });

  it('classNames.indicator indicator elemana eklenir', () => {
    render(
      <Stepper steps={defaultSteps} activeIndex={0} classNames={{ indicator: 'custom-ind' }} />,
    );
    expect(screen.getAllByTestId('stepper-indicator')[0].className).toContain('custom-ind');
  });

  it('classNames.connector connector elemana eklenir', () => {
    render(
      <Stepper steps={defaultSteps} activeIndex={0} classNames={{ connector: 'custom-conn' }} />,
    );
    expect(screen.getAllByTestId('stepper-connector')[0].className).toContain('custom-conn');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(
      <Stepper steps={defaultSteps} activeIndex={0} styles={{ root: { padding: '24px' } }} />,
    );
    expect(screen.getByTestId('stepper-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.step step elemana eklenir', () => {
    render(
      <Stepper steps={defaultSteps} activeIndex={0} styles={{ step: { padding: '8px' } }} />,
    );
    expect(screen.getAllByTestId('stepper-step')[0]).toHaveStyle({ padding: '8px' });
  });

  it('styles.indicator indicator elemana eklenir', () => {
    render(
      <Stepper
        steps={defaultSteps}
        activeIndex={0}
        styles={{ indicator: { fontSize: '20px' } }}
      />,
    );
    expect(screen.getAllByTestId('stepper-indicator')[0]).toHaveStyle({ fontSize: '20px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Stepper steps={defaultSteps} activeIndex={0} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Stepper (Compound)', () => {
  it('compound: step render edilir', () => {
    render(
      <Stepper activeIndex={0}>
        <Stepper.Step index={0}>
          <Stepper.Indicator index={0} />
          <Stepper.Title>Bilgi</Stepper.Title>
        </Stepper.Step>
      </Stepper>,
    );
    expect(screen.getByTestId('stepper-step')).toBeInTheDocument();
  });

  it('compound: indicator render edilir', () => {
    render(
      <Stepper activeIndex={0}>
        <Stepper.Step index={0}>
          <Stepper.Indicator index={0} />
          <Stepper.Title>Test</Stepper.Title>
        </Stepper.Step>
      </Stepper>,
    );
    expect(screen.getByTestId('stepper-indicator')).toBeInTheDocument();
  });

  it('compound: title render edilir', () => {
    render(
      <Stepper activeIndex={0}>
        <Stepper.Step index={0}>
          <Stepper.Indicator index={0} />
          <Stepper.Title>Bilgi</Stepper.Title>
        </Stepper.Step>
      </Stepper>,
    );
    expect(screen.getByTestId('stepper-title')).toHaveTextContent('Bilgi');
  });

  it('compound: description render edilir', () => {
    render(
      <Stepper activeIndex={0}>
        <Stepper.Step index={0}>
          <Stepper.Indicator index={0} />
          <Stepper.Title>Test</Stepper.Title>
          <Stepper.Description>Aciklama</Stepper.Description>
        </Stepper.Step>
      </Stepper>,
    );
    expect(screen.getByTestId('stepper-description')).toHaveTextContent('Aciklama');
  });

  it('compound: connector render edilir', () => {
    render(
      <Stepper activeIndex={0}>
        <Stepper.Step index={0}>
          <Stepper.Indicator index={0} />
          <Stepper.Title>A</Stepper.Title>
        </Stepper.Step>
        <Stepper.Connector index={0} />
        <Stepper.Step index={1}>
          <Stepper.Indicator index={1} />
          <Stepper.Title>B</Stepper.Title>
        </Stepper.Step>
      </Stepper>,
    );
    expect(screen.getByTestId('stepper-connector')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Stepper activeIndex={0} classNames={{ title: 'cmp-title' }}>
        <Stepper.Step index={0}>
          <Stepper.Indicator index={0} />
          <Stepper.Title>Test</Stepper.Title>
        </Stepper.Step>
      </Stepper>,
    );
    expect(screen.getByTestId('stepper-title').className).toContain('cmp-title');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Stepper activeIndex={0} styles={{ title: { fontSize: '20px' } }}>
        <Stepper.Step index={0}>
          <Stepper.Indicator index={0} />
          <Stepper.Title>Test</Stepper.Title>
        </Stepper.Step>
      </Stepper>,
    );
    expect(screen.getByTestId('stepper-title')).toHaveStyle({ fontSize: '20px' });
  });

  it('Stepper.Step context disinda hata firlatir', () => {
    expect(() =>
      render(
        <Stepper.Step index={0}>
          <Stepper.Indicator index={0} />
        </Stepper.Step>,
      ),
    ).toThrow();
  });
});
