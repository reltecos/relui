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
import { LottieAnimation } from './LottieAnimation';
import type { LottieData } from '@relteco/relui-core';

const DATA: LottieData = {
  frameRate: 30, totalFrames: 60, width: 200, height: 200,
  layers: [{ name: 'L1', inFrame: 0, outFrame: 60, opacity: [{ frame: 0, value: 100 }], positionX: [{ frame: 0, value: 0 }], positionY: [{ frame: 0, value: 0 }], scaleX: [{ frame: 0, value: 1 }], scaleY: [{ frame: 0, value: 1 }], rotation: [{ frame: 0, value: 0 }] }],
};

describe('LottieAnimation', () => {
  it('root render edilir', () => {
    render(<LottieAnimation data={DATA} />);
    expect(screen.getByTestId('lottie-animation-root')).toBeInTheDocument();
  });

  it('role application set edilir', () => {
    render(<LottieAnimation data={DATA} />);
    expect(screen.getByTestId('lottie-animation-root')).toHaveAttribute('role', 'application');
  });

  it('canvas render edilir', () => {
    render(<LottieAnimation data={DATA} />);
    expect(screen.getByTestId('lottie-animation-canvas')).toBeInTheDocument();
  });

  it('controls render edilir', () => {
    render(<LottieAnimation data={DATA} />);
    expect(screen.getByTestId('lottie-animation-controls')).toBeInTheDocument();
  });

  it('play butonu render edilir', () => {
    render(<LottieAnimation data={DATA} />);
    expect(screen.getByTestId('lottie-animation-btn-play')).toBeInTheDocument();
  });

  it('stop butonu render edilir', () => {
    render(<LottieAnimation data={DATA} />);
    expect(screen.getByTestId('lottie-animation-btn-stop')).toBeInTheDocument();
  });

  it('loop butonu render edilir', () => {
    render(<LottieAnimation data={DATA} />);
    expect(screen.getByTestId('lottie-animation-btn-loop')).toBeInTheDocument();
  });

  it('progress bar render edilir', () => {
    render(<LottieAnimation data={DATA} />);
    expect(screen.getByTestId('lottie-animation-progress')).toBeInTheDocument();
  });

  it('frame info gosterilir', () => {
    render(<LottieAnimation data={DATA} />);
    expect(screen.getByTestId('lottie-animation-frame-info')).toHaveTextContent('0/60');
  });

  it('data olmadan canvas boyutu varsayilan', () => {
    render(<LottieAnimation />);
    const canvas = screen.getByTestId('lottie-animation-canvas');
    expect(canvas).toHaveAttribute('width', '200');
  });

  it('className root elemana eklenir', () => {
    render(<LottieAnimation className="my-lottie" />);
    expect(screen.getByTestId('lottie-animation-root').className).toContain('my-lottie');
  });

  it('style root elemana eklenir', () => {
    render(<LottieAnimation style={{ padding: '16px' }} />);
    expect(screen.getByTestId('lottie-animation-root')).toHaveStyle({ padding: '16px' });
  });

  it('classNames.root root elemana eklenir', () => {
    render(<LottieAnimation classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('lottie-animation-root').className).toContain('custom-root');
  });

  it('classNames.canvas canvas elemana eklenir', () => {
    render(<LottieAnimation classNames={{ canvas: 'custom-cv' }} />);
    expect(screen.getByTestId('lottie-animation-canvas').className).toContain('custom-cv');
  });

  it('classNames.controls controls elemana eklenir', () => {
    render(<LottieAnimation classNames={{ controls: 'custom-ctrl' }} />);
    expect(screen.getByTestId('lottie-animation-controls').className).toContain('custom-ctrl');
  });

  it('styles.root root elemana eklenir', () => {
    render(<LottieAnimation styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('lottie-animation-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.controls controls elemana eklenir', () => {
    render(<LottieAnimation styles={{ controls: { padding: '12px' } }} />);
    expect(screen.getByTestId('lottie-animation-controls')).toHaveStyle({ padding: '12px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<LottieAnimation ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('LottieAnimation (Compound)', () => {
  it('compound: canvas render edilir', () => {
    render(<LottieAnimation data={DATA}><LottieAnimation.Canvas /></LottieAnimation>);
    expect(screen.getByTestId('lottie-animation-canvas')).toBeInTheDocument();
  });

  it('compound: controls render edilir', () => {
    render(<LottieAnimation data={DATA}><LottieAnimation.Controls /></LottieAnimation>);
    expect(screen.getByTestId('lottie-animation-controls')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(<LottieAnimation classNames={{ controls: 'cmp-ctrl' }}><LottieAnimation.Controls /></LottieAnimation>);
    expect(screen.getByTestId('lottie-animation-controls').className).toContain('cmp-ctrl');
  });

  it('compound: styles context ile aktarilir', () => {
    render(<LottieAnimation styles={{ controls: { padding: '30px' } }}><LottieAnimation.Controls /></LottieAnimation>);
    expect(screen.getByTestId('lottie-animation-controls')).toHaveStyle({ padding: '30px' });
  });

  it('LottieAnimation.Canvas context disinda hata firlatir', () => {
    expect(() => render(<LottieAnimation.Canvas />)).toThrow();
  });

  it('LottieAnimation.Controls context disinda hata firlatir', () => {
    expect(() => render(<LottieAnimation.Controls />)).toThrow();
  });
});
