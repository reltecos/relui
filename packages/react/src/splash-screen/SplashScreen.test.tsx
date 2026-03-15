/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { SplashScreen } from './SplashScreen';

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Render ──

  it('visible=false iken sadece anchor render eder', () => {
    render(<SplashScreen visible={false} />);
    expect(screen.getByTestId('splash-anchor')).toBeInTheDocument();
    expect(screen.queryByTestId('splash-root')).not.toBeInTheDocument();
  });

  it('visible=true iken splash ekrani render eder', () => {
    render(<SplashScreen visible={true} />);
    expect(screen.getByTestId('splash-root')).toBeInTheDocument();
    expect(screen.getByTestId('splash-content')).toBeInTheDocument();
  });

  // ── Title ──

  it('title verilince baslik gosterir', () => {
    render(<SplashScreen visible={true} title="MyApp" />);
    expect(screen.getByTestId('splash-title')).toHaveTextContent('MyApp');
  });

  it('title verilmezse baslik render edilmez', () => {
    render(<SplashScreen visible={true} />);
    expect(screen.queryByTestId('splash-title')).not.toBeInTheDocument();
  });

  // ── Logo ──

  it('logo verilince render eder', () => {
    render(<SplashScreen visible={true} logo={<img alt="Logo" src="/logo.png" />} />);
    expect(screen.getByTestId('splash-logo')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('logo verilmezse logo alani render edilmez', () => {
    render(<SplashScreen visible={true} />);
    expect(screen.queryByTestId('splash-logo')).not.toBeInTheDocument();
  });

  // ── Progress ──

  it('showProgress varsayilan olarak progress bar gosterir', () => {
    render(<SplashScreen visible={true} />);
    expect(screen.getByTestId('splash-progress')).toBeInTheDocument();
  });

  it('showProgress=false iken progress bar gorunmez', () => {
    render(<SplashScreen visible={true} showProgress={false} />);
    expect(screen.queryByTestId('splash-progress')).not.toBeInTheDocument();
  });

  it('progress degeri fill genisligine yansir', () => {
    render(<SplashScreen visible={true} progress={60} />);
    const fill = screen.getByTestId('splash-progress-fill');
    expect(fill).toHaveStyle({ width: '60%' });
  });

  it('progress 0 iken fill %0', () => {
    render(<SplashScreen visible={true} progress={0} />);
    const fill = screen.getByTestId('splash-progress-fill');
    expect(fill).toHaveStyle({ width: '0%' });
  });

  // ── Message ──

  it('message verilince gosterir', () => {
    render(<SplashScreen visible={true} message="Yukleniyor..." />);
    expect(screen.getByTestId('splash-message')).toHaveTextContent('Yukleniyor...');
  });

  it('message bos iken mesaj alani render edilmez', () => {
    render(<SplashScreen visible={true} />);
    expect(screen.queryByTestId('splash-message')).not.toBeInTheDocument();
  });

  // ── Version ──

  it('version verilince gosterir', () => {
    render(<SplashScreen visible={true} version="v1.0.0" />);
    expect(screen.getByTestId('splash-version')).toHaveTextContent('v1.0.0');
  });

  it('version verilmezse versiyon alani render edilmez', () => {
    render(<SplashScreen visible={true} />);
    expect(screen.queryByTestId('splash-version')).not.toBeInTheDocument();
  });

  // ── A11y ──

  it('role=status icerir', () => {
    render(<SplashScreen visible={true} />);
    expect(screen.getByTestId('splash-root')).toHaveAttribute('role', 'status');
  });

  it('title verildiyse aria-label baslik olur', () => {
    render(<SplashScreen visible={true} title="MyApp" />);
    expect(screen.getByTestId('splash-root')).toHaveAttribute('aria-label', 'MyApp');
  });

  it('title verilmezse aria-label varsayilan', () => {
    render(<SplashScreen visible={true} />);
    expect(screen.getByTestId('splash-root')).toHaveAttribute('aria-label', 'Yukleniyor');
  });

  it('progressbar role ve aria degerleri dogru', () => {
    render(<SplashScreen visible={true} progress={45} />);
    const bar = screen.getByTestId('splash-progress');
    expect(bar).toHaveAttribute('role', 'progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '45');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  // ── ref ──

  it('ref splash-root elementine iletilir', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<SplashScreen ref={ref} visible={true} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── className & style ──

  it('className root elementine eklenir', () => {
    render(<SplashScreen visible={true} className="custom-splash" />);
    expect(screen.getByTestId('splash-root').className).toContain('custom-splash');
  });

  it('style root elementine uygulanir', () => {
    render(<SplashScreen visible={true} style={{ padding: '40px' }} />);
    expect(screen.getByTestId('splash-root')).toHaveStyle({ padding: '40px' });
  });

  // ── Slot API: classNames ──

  it('classNames.content content elementine eklenir', () => {
    render(
      <SplashScreen visible={true} classNames={{ content: 'custom-content' }} />,
    );
    expect(screen.getByTestId('splash-content').className).toContain('custom-content');
  });

  it('classNames.title title elementine eklenir', () => {
    render(
      <SplashScreen visible={true} title="Test" classNames={{ title: 'custom-title' }} />,
    );
    expect(screen.getByTestId('splash-title').className).toContain('custom-title');
  });

  it('classNames.progressTrack track elementine eklenir', () => {
    render(
      <SplashScreen
        visible={true}
        classNames={{ progressTrack: 'custom-track' }}
      />,
    );
    expect(screen.getByTestId('splash-progress').className).toContain('custom-track');
  });

  // ── Slot API: styles ──

  it('styles.content content elementine uygulanir', () => {
    render(
      <SplashScreen visible={true} styles={{ content: { padding: '50px' } }} />,
    );
    expect(screen.getByTestId('splash-content')).toHaveStyle({ padding: '50px' });
  });

  it('styles.version version elementine uygulanir', () => {
    render(
      <SplashScreen
        visible={true}
        version="v1.0"
        styles={{ version: { fontSize: '16px' } }}
      />,
    );
    expect(screen.getByTestId('splash-version')).toHaveStyle({ fontSize: '16px' });
  });

  it('styles.message message elementine uygulanir', () => {
    render(
      <SplashScreen
        visible={true}
        message="Test"
        styles={{ message: { letterSpacing: '2px' } }}
      />,
    );
    expect(screen.getByTestId('splash-message')).toHaveStyle({ letterSpacing: '2px' });
  });

  // ── Auto-close ──

  it('progress 100 ve autoClose ile onComplete cagirilir', () => {
    const onComplete = vi.fn();
    render(
      <SplashScreen visible={true} progress={100} onComplete={onComplete} />,
    );
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('autoClose=false iken progress 100 olsa bile kapanmaz', () => {
    const onComplete = vi.fn();
    render(
      <SplashScreen
        visible={true}
        progress={100}
        autoClose={false}
        onComplete={onComplete}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onComplete).not.toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('SplashScreen (Compound)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('compound: children ile splash-root render eder', () => {
    render(
      <SplashScreen visible={true}>
        <SplashScreen.Title>MyApp</SplashScreen.Title>
      </SplashScreen>,
    );
    expect(screen.getByTestId('splash-root')).toBeInTheDocument();
    expect(screen.getByTestId('splash-content')).toBeInTheDocument();
  });

  it('compound: SplashScreen.Title render edilir', () => {
    render(
      <SplashScreen visible={true}>
        <SplashScreen.Title>Test App</SplashScreen.Title>
      </SplashScreen>,
    );
    expect(screen.getByTestId('splash-title')).toHaveTextContent('Test App');
  });

  it('compound: SplashScreen.Logo render edilir', () => {
    render(
      <SplashScreen visible={true}>
        <SplashScreen.Logo><img alt="Logo" src="/logo.png" /></SplashScreen.Logo>
      </SplashScreen>,
    );
    expect(screen.getByTestId('splash-logo')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('compound: SplashScreen.Progress render edilir', () => {
    render(
      <SplashScreen visible={true}>
        <SplashScreen.Progress value={75} />
      </SplashScreen>,
    );
    const bar = screen.getByTestId('splash-progress');
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute('aria-valuenow', '75');
    expect(screen.getByTestId('splash-progress-fill')).toHaveStyle({ width: '75%' });
  });

  it('compound: SplashScreen.Version render edilir', () => {
    render(
      <SplashScreen visible={true}>
        <SplashScreen.Version>v2.0.0</SplashScreen.Version>
      </SplashScreen>,
    );
    expect(screen.getByTestId('splash-version')).toHaveTextContent('v2.0.0');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <SplashScreen visible={true} classNames={{ title: 'cmp-title' }}>
        <SplashScreen.Title>Test</SplashScreen.Title>
      </SplashScreen>,
    );
    expect(screen.getByTestId('splash-title').className).toContain('cmp-title');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <SplashScreen visible={true} styles={{ version: { fontSize: '20px' } }}>
        <SplashScreen.Version>v1.0</SplashScreen.Version>
      </SplashScreen>,
    );
    expect(screen.getByTestId('splash-version')).toHaveStyle({ fontSize: '20px' });
  });

  it('SplashScreen.Logo context disinda hata firlatir', () => {
    expect(() => render(<SplashScreen.Logo>Logo</SplashScreen.Logo>)).toThrow();
  });
});
