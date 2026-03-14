/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Tour } from './Tour';
import type { TourStep } from '@relteco/relui-core';

// jsdom'da scrollIntoView yok
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

const sampleSteps: TourStep[] = [
  { target: '#step1', title: 'Adim 1', description: 'Birinci adim aciklamasi', placement: 'bottom' },
  { target: '#step2', title: 'Adim 2', description: 'Ikinci adim aciklamasi', placement: 'right' },
  { target: '#step3', description: 'Ucuncu adim aciklamasi' },
];

function createTarget(id: string) {
  const el = document.createElement('div');
  el.id = id;
  el.getBoundingClientRect = () => ({
    top: 100,
    left: 100,
    bottom: 200,
    right: 300,
    width: 200,
    height: 100,
    x: 100,
    y: 100,
    toJSON: () => ({}),
  });
  document.body.appendChild(el);
  return el;
}

describe('Tour', () => {
  let targets: HTMLElement[] = [];

  beforeEach(() => {
    targets.forEach((t) => t.remove());
    targets = [];
    targets.push(createTarget('step1'));
    targets.push(createTarget('step2'));
    targets.push(createTarget('step3'));
  });

  // ── Render ──

  it('active=false iken sadece anchor render eder', () => {
    render(<Tour steps={sampleSteps} active={false} />);
    expect(screen.getByTestId('tour-anchor')).toBeInTheDocument();
    expect(screen.queryByTestId('tour-root')).not.toBeInTheDocument();
  });

  it('active=true iken overlay, popover ve icerik render eder', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    expect(screen.getByTestId('tour-root')).toBeInTheDocument();
    expect(screen.getByTestId('tour-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('tour-popover')).toBeInTheDocument();
  });

  it('aktifken spotlight render eder', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    expect(screen.getByTestId('tour-spotlight')).toBeInTheDocument();
  });

  it('ilk adimin baslik ve aciklamasini gosterir', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    expect(screen.getByTestId('tour-title')).toHaveTextContent('Adim 1');
    expect(screen.getByTestId('tour-description')).toHaveTextContent('Birinci adim aciklamasi');
  });

  it('adim gostergesi 1 / 3 gosterir', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    expect(screen.getByTestId('tour-step-indicator')).toHaveTextContent('1 / 3');
  });

  // ── Navigasyon ──

  it('Ileri butonuna tiklaninca sonraki adima gecer', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    fireEvent.click(screen.getByTestId('tour-next'));
    expect(screen.getByTestId('tour-title')).toHaveTextContent('Adim 2');
    expect(screen.getByTestId('tour-step-indicator')).toHaveTextContent('2 / 3');
  });

  it('Geri butonuna tiklaninca onceki adima doner', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    fireEvent.click(screen.getByTestId('tour-next')); // 1→2
    fireEvent.click(screen.getByTestId('tour-prev'));  // 2→1
    expect(screen.getByTestId('tour-title')).toHaveTextContent('Adim 1');
  });

  it('ilk adimda Geri butonu gorunmez', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    expect(screen.queryByTestId('tour-prev')).not.toBeInTheDocument();
  });

  it('ikinci adimda Geri butonu gorunur', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    fireEvent.click(screen.getByTestId('tour-next'));
    expect(screen.getByTestId('tour-prev')).toBeInTheDocument();
  });

  it('son adimda Ileri butonu Bitir yazisinI gosterir', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    fireEvent.click(screen.getByTestId('tour-next')); // 1→2
    fireEvent.click(screen.getByTestId('tour-next')); // 2→3
    expect(screen.getByTestId('tour-next')).toHaveTextContent('Bitir');
  });

  it('son adimda Bitir tiklaninca onComplete cagirilir', () => {
    const onComplete = vi.fn();
    render(<Tour steps={sampleSteps} active={true} onComplete={onComplete} />);
    fireEvent.click(screen.getByTestId('tour-next')); // 1→2
    fireEvent.click(screen.getByTestId('tour-next')); // 2→3
    fireEvent.click(screen.getByTestId('tour-next')); // bitir
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  // ── onStepChange ──

  it('adim degisince onStepChange cagirilir', () => {
    const onStepChange = vi.fn();
    render(<Tour steps={sampleSteps} active={true} onStepChange={onStepChange} />);
    fireEvent.click(screen.getByTestId('tour-next'));
    expect(onStepChange).toHaveBeenCalledWith(1);
  });

  // ── Skip ──

  it('Gec butonu varsayilan olarak gorunur', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    expect(screen.getByTestId('tour-skip')).toBeInTheDocument();
  });

  it('showSkip=false iken Gec butonu gorunmez', () => {
    render(<Tour steps={sampleSteps} active={true} showSkip={false} />);
    expect(screen.queryByTestId('tour-skip')).not.toBeInTheDocument();
  });

  it('son adimda Gec butonu gorunmez', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    fireEvent.click(screen.getByTestId('tour-next')); // 1→2
    fireEvent.click(screen.getByTestId('tour-next')); // 2→3
    expect(screen.queryByTestId('tour-skip')).not.toBeInTheDocument();
  });

  it('Gec butonuna tiklaninca onStop cagirilir', () => {
    const onStop = vi.fn();
    render(<Tour steps={sampleSteps} active={true} onStop={onStop} />);
    fireEvent.click(screen.getByTestId('tour-skip'));
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  // ── Escape ──

  it('Escape tusuna basilinca onStop cagirilir', () => {
    const onStop = vi.fn();
    render(<Tour steps={sampleSteps} active={true} onStop={onStop} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  // ── Ozel buton metinleri ──

  it('skipLabel ile Gec buton metni degisir', () => {
    render(<Tour steps={sampleSteps} active={true} skipLabel="Skip" />);
    expect(screen.getByTestId('tour-skip')).toHaveTextContent('Skip');
  });

  it('nextLabel ile Ileri buton metni degisir', () => {
    render(<Tour steps={sampleSteps} active={true} nextLabel="Next" />);
    expect(screen.getByTestId('tour-next')).toHaveTextContent('Next');
  });

  it('prevLabel ile Geri buton metni degisir', () => {
    render(<Tour steps={sampleSteps} active={true} prevLabel="Back" />);
    fireEvent.click(screen.getByTestId('tour-next'));
    expect(screen.getByTestId('tour-prev')).toHaveTextContent('Back');
  });

  it('finishLabel ile Bitir buton metni degisir', () => {
    render(<Tour steps={sampleSteps} active={true} finishLabel="Done" />);
    fireEvent.click(screen.getByTestId('tour-next')); // 1→2
    fireEvent.click(screen.getByTestId('tour-next')); // 2→3
    expect(screen.getByTestId('tour-next')).toHaveTextContent('Done');
  });

  // ── Baslik opsiyonel ──

  it('title olmayan adimda baslik render edilmez', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    fireEvent.click(screen.getByTestId('tour-next')); // 1→2
    fireEvent.click(screen.getByTestId('tour-next')); // 2→3 (title yok)
    expect(screen.queryByTestId('tour-title')).not.toBeInTheDocument();
  });

  // ── A11y ──

  it('popover role=dialog icerir', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    expect(screen.getByTestId('tour-popover')).toHaveAttribute('role', 'dialog');
  });

  it('overlay aria-hidden=true', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    expect(screen.getByTestId('tour-overlay')).toHaveAttribute('aria-hidden', 'true');
  });

  it('tum butonlar type=button icerir', () => {
    render(<Tour steps={sampleSteps} active={true} />);
    fireEvent.click(screen.getByTestId('tour-next')); // geri butonu gorunmesi icin
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('type', 'button');
    });
  });

  // ── ref ──

  it('ref tour-root elementine iletilir', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Tour ref={ref} steps={sampleSteps} active={true} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── className & style ──

  it('className popover elementine eklenir', () => {
    render(<Tour steps={sampleSteps} active={true} className="custom-tour" />);
    expect(screen.getByTestId('tour-popover').className).toContain('custom-tour');
  });

  it('style popover elementine uygulanir', () => {
    render(<Tour steps={sampleSteps} active={true} style={{ padding: '32px' }} />);
    expect(screen.getByTestId('tour-popover')).toHaveStyle({ padding: '32px' });
  });

  // ── Slot API: classNames ──

  it('classNames.overlay overlay elementine eklenir', () => {
    render(
      <Tour steps={sampleSteps} active={true} classNames={{ overlay: 'custom-overlay' }} />,
    );
    expect(screen.getByTestId('tour-overlay').className).toContain('custom-overlay');
  });

  it('classNames.popover popover elementine eklenir', () => {
    render(
      <Tour steps={sampleSteps} active={true} classNames={{ popover: 'custom-popover' }} />,
    );
    expect(screen.getByTestId('tour-popover').className).toContain('custom-popover');
  });

  it('classNames.title title elementine eklenir', () => {
    render(
      <Tour steps={sampleSteps} active={true} classNames={{ title: 'custom-title' }} />,
    );
    expect(screen.getByTestId('tour-title').className).toContain('custom-title');
  });

  it('classNames.nextButton next butonuna eklenir', () => {
    render(
      <Tour steps={sampleSteps} active={true} classNames={{ nextButton: 'custom-next' }} />,
    );
    expect(screen.getByTestId('tour-next').className).toContain('custom-next');
  });

  // ── Slot API: styles ──

  it('styles.overlay overlay elementine uygulanir', () => {
    render(
      <Tour steps={sampleSteps} active={true} styles={{ overlay: { opacity: '0.8' } }} />,
    );
    expect(screen.getByTestId('tour-overlay')).toHaveStyle({ opacity: '0.8' });
  });

  it('styles.description description elementine uygulanir', () => {
    render(
      <Tour
        steps={sampleSteps}
        active={true}
        styles={{ description: { fontSize: '18px' } }}
      />,
    );
    expect(screen.getByTestId('tour-description')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.footer footer elementine uygulanir', () => {
    render(
      <Tour steps={sampleSteps} active={true} styles={{ footer: { padding: '20px' } }} />,
    );
    expect(screen.getByTestId('tour-footer')).toHaveStyle({ padding: '20px' });
  });

  it('styles.skipButton skip butonuna uygulanir', () => {
    render(
      <Tour
        steps={sampleSteps}
        active={true}
        styles={{ skipButton: { fontWeight: '700' } }}
      />,
    );
    expect(screen.getByTestId('tour-skip')).toHaveStyle({ fontWeight: '700' });
  });
});
