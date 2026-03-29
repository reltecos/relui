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
import { Carousel } from './Carousel';

const SLIDES = [<div key="1">Slide 1</div>, <div key="2">Slide 2</div>, <div key="3">Slide 3</div>];

describe('Carousel', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Carousel slides={SLIDES} />);
    expect(screen.getByTestId('carousel-root')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-root')).toHaveAttribute('role', 'region');
  });

  it('aria-roledescription carousel', () => {
    render(<Carousel slides={SLIDES} />);
    expect(screen.getByTestId('carousel-root')).toHaveAttribute('aria-roledescription', 'carousel');
  });

  // ── Slides ──

  it('slides render edilir', () => {
    render(<Carousel slides={SLIDES} />);
    const slides = screen.getAllByTestId('carousel-slide');
    expect(slides).toHaveLength(3);
  });

  it('slayt icerigi render edilir', () => {
    render(<Carousel slides={SLIDES} />);
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });

  // ── Viewport ──

  it('viewport render edilir', () => {
    render(<Carousel slides={SLIDES} />);
    expect(screen.getByTestId('carousel-viewport')).toBeInTheDocument();
  });

  it('viewport translateX baslangicta 0', () => {
    render(<Carousel slides={SLIDES} />);
    expect(screen.getByTestId('carousel-viewport').style.transform).toBe('translateX(-0%)');
  });

  // ── Navigation ──

  it('navigation butonlari render edilir', () => {
    render(<Carousel slides={SLIDES} />);
    expect(screen.getByTestId('carousel-prevButton')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-nextButton')).toBeInTheDocument();
  });

  it('next butonuna tiklaninca sonraki slayta gecer', () => {
    render(<Carousel slides={SLIDES} />);
    fireEvent.click(screen.getByTestId('carousel-nextButton'));
    expect(screen.getByTestId('carousel-viewport').style.transform).toBe('translateX(-100%)');
  });

  it('prev butonuna tiklaninca onceki slayta gecer', () => {
    render(<Carousel slides={SLIDES} defaultIndex={2} />);
    fireEvent.click(screen.getByTestId('carousel-prevButton'));
    expect(screen.getByTestId('carousel-viewport').style.transform).toBe('translateX(-100%)');
  });

  it('ilk slaytta prev button disabled', () => {
    render(<Carousel slides={SLIDES} />);
    expect(screen.getByTestId('carousel-prevButton')).toBeDisabled();
  });

  it('son slaytta next button disabled', () => {
    render(<Carousel slides={SLIDES} defaultIndex={2} />);
    expect(screen.getByTestId('carousel-nextButton')).toBeDisabled();
  });

  it('showNavigation false ise butonlar gosterilmez', () => {
    render(<Carousel slides={SLIDES} showNavigation={false} />);
    expect(screen.queryByTestId('carousel-prevButton')).not.toBeInTheDocument();
    expect(screen.queryByTestId('carousel-nextButton')).not.toBeInTheDocument();
  });

  // ── Indicators ──

  it('indicators render edilir', () => {
    render(<Carousel slides={SLIDES} />);
    expect(screen.getByTestId('carousel-indicators')).toBeInTheDocument();
    const dots = screen.getAllByTestId('carousel-indicator');
    expect(dots).toHaveLength(3);
  });

  it('indicator a tiklaninca o slayta gider', () => {
    render(<Carousel slides={SLIDES} />);
    const dots = screen.getAllByTestId('carousel-indicator');
    fireEvent.click(dots[2]);
    expect(screen.getByTestId('carousel-viewport').style.transform).toBe('translateX(-200%)');
  });

  it('showIndicators false ise gostergeler gosterilmez', () => {
    render(<Carousel slides={SLIDES} showIndicators={false} />);
    expect(screen.queryByTestId('carousel-indicators')).not.toBeInTheDocument();
  });

  // ── onSlideChange ──

  it('onSlideChange callback cagirilir', () => {
    const onSlideChange = vi.fn();
    render(<Carousel slides={SLIDES} onSlideChange={onSlideChange} />);
    fireEvent.click(screen.getByTestId('carousel-nextButton'));
    expect(onSlideChange).toHaveBeenCalledWith(1);
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Carousel slides={SLIDES} className="my-carousel" />);
    expect(screen.getByTestId('carousel-root').className).toContain('my-carousel');
  });

  it('style root elemana eklenir', () => {
    render(<Carousel slides={SLIDES} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('carousel-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Carousel slides={SLIDES} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('carousel-root').className).toContain('custom-root');
  });

  it('classNames.viewport viewport elemana eklenir', () => {
    render(<Carousel slides={SLIDES} classNames={{ viewport: 'custom-vp' }} />);
    expect(screen.getByTestId('carousel-viewport').className).toContain('custom-vp');
  });

  it('classNames.slide slide elemana eklenir', () => {
    render(<Carousel slides={SLIDES} classNames={{ slide: 'custom-slide' }} />);
    expect(screen.getAllByTestId('carousel-slide')[0].className).toContain('custom-slide');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Carousel slides={SLIDES} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('carousel-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.indicators indicators elemana eklenir', () => {
    render(<Carousel slides={SLIDES} styles={{ indicators: { padding: '20px' } }} />);
    expect(screen.getByTestId('carousel-indicators')).toHaveStyle({ padding: '20px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Carousel slides={SLIDES} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Carousel (Compound)', () => {
  it('compound: viewport ve slide render edilir', () => {
    render(
      <Carousel>
        <Carousel.Viewport>
          <Carousel.Slide>Slayt A</Carousel.Slide>
          <Carousel.Slide>Slayt B</Carousel.Slide>
        </Carousel.Viewport>
      </Carousel>,
    );
    expect(screen.getByTestId('carousel-viewport')).toBeInTheDocument();
    expect(screen.getAllByTestId('carousel-slide')).toHaveLength(2);
    expect(screen.getByText('Slayt A')).toBeInTheDocument();
  });

  it('compound: navigation butonlari calisir', () => {
    render(
      <Carousel>
        <Carousel.Viewport>
          <Carousel.Slide>A</Carousel.Slide>
          <Carousel.Slide>B</Carousel.Slide>
        </Carousel.Viewport>
        <Carousel.PrevButton />
        <Carousel.NextButton />
      </Carousel>,
    );
    expect(screen.getByTestId('carousel-prevButton')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-nextButton')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Carousel classNames={{ slide: 'cmp-slide' }}>
        <Carousel.Viewport>
          <Carousel.Slide>A</Carousel.Slide>
        </Carousel.Viewport>
      </Carousel>,
    );
    expect(screen.getByTestId('carousel-slide').className).toContain('cmp-slide');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Carousel styles={{ viewport: { padding: '10px' } }}>
        <Carousel.Viewport>
          <Carousel.Slide>A</Carousel.Slide>
        </Carousel.Viewport>
      </Carousel>,
    );
    expect(screen.getByTestId('carousel-viewport')).toHaveStyle({ padding: '10px' });
  });

  it('Carousel.Slide context disinda hata firlatir', () => {
    expect(() => render(<Carousel.Slide>Test</Carousel.Slide>)).toThrow();
  });
});
