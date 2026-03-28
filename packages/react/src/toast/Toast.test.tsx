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
import { Toast, type ToastComponentProps } from './Toast';
import type { ToastItem } from '@relteco/relui-core';

// ── Helper ──────────────────────────────────────────

function makeToast(overrides: Partial<ToastItem> = {}): ToastItem {
  return {
    id: 'toast-1',
    status: 'info',
    message: 'Test mesaji',
    duration: 5000,
    closable: true,
    createdAt: Date.now(),
    paused: false,
    remaining: 5000,
    ...overrides,
  };
}

function renderToast(props: Partial<ToastComponentProps> = {}) {
  const defaultProps: ToastComponentProps = {
    toasts: [makeToast()],
    ...props,
  };
  return render(<Toast {...defaultProps} />);
}

// ── Tests ───────────────────────────────────────────

describe('Toast', () => {
  // ── Render ──

  it('bos liste ile render etmez', () => {
    const { container } = render(<Toast toasts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('toast item render eder', () => {
    renderToast();
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    expect(screen.getByTestId('toast-item')).toBeInTheDocument();
  });

  it('mesaji gosterir', () => {
    renderToast({ toasts: [makeToast({ message: 'Basarili!' })] });
    expect(screen.getByTestId('toast-message')).toHaveTextContent('Basarili!');
  });

  it('basligi gosterir', () => {
    renderToast({ toasts: [makeToast({ title: 'Bilgi', message: 'Detay' })] });
    expect(screen.getByTestId('toast-title')).toHaveTextContent('Bilgi');
  });

  it('baslik yoksa title elementi render etmez', () => {
    renderToast({ toasts: [makeToast({ title: undefined })] });
    expect(screen.queryByTestId('toast-title')).not.toBeInTheDocument();
  });

  it('birden fazla toast render eder', () => {
    renderToast({
      toasts: [
        makeToast({ id: 'a', message: 'Birinci' }),
        makeToast({ id: 'b', message: 'Ikinci' }),
        makeToast({ id: 'c', message: 'Ucuncu' }),
      ],
    });
    const items = screen.getAllByTestId('toast-item');
    expect(items).toHaveLength(3);
  });

  // ── Status ──

  it('data-status attribute yazar', () => {
    renderToast({ toasts: [makeToast({ status: 'success' })] });
    expect(screen.getByTestId('toast-item')).toHaveAttribute('data-status', 'success');
  });

  it.each(['info', 'success', 'warning', 'error'] as const)(
    '%s status icin ikon render eder',
    (status) => {
      renderToast({ toasts: [makeToast({ status })] });
      const item = screen.getByTestId('toast-item');
      const svg = item.querySelector('svg');
      expect(svg).toBeInTheDocument();
    },
  );

  // ── Close ──

  it('closable toast icin kapat butonu gosterir', () => {
    renderToast({ toasts: [makeToast({ closable: true })] });
    expect(screen.getByTestId('toast-close')).toBeInTheDocument();
  });

  it('closable=false iken kapat butonu gostermez', () => {
    renderToast({ toasts: [makeToast({ closable: false })] });
    expect(screen.queryByTestId('toast-close')).not.toBeInTheDocument();
  });

  it('kapat butonuna tiklaninca onClose cagirilir', () => {
    const onClose = vi.fn();
    renderToast({
      toasts: [makeToast({ id: 'x' })],
      onClose,
    });
    fireEvent.click(screen.getByTestId('toast-close'));
    expect(onClose).toHaveBeenCalledWith('x');
  });

  it('kapat butonu aria-label="Close" tasir', () => {
    renderToast();
    expect(screen.getByTestId('toast-close')).toHaveAttribute('aria-label', 'Close');
  });

  // ── Hover Pause ──

  it('pauseOnHover aktifken pointer enter/leave onPause/onResume cagirir', () => {
    const onPause = vi.fn();
    const onResume = vi.fn();
    renderToast({
      toasts: [makeToast({ id: 'p1' })],
      pauseOnHover: true,
      onPause,
      onResume,
    });
    const item = screen.getByTestId('toast-item');
    fireEvent.pointerEnter(item);
    expect(onPause).toHaveBeenCalledWith('p1');
    fireEvent.pointerLeave(item);
    expect(onResume).toHaveBeenCalledWith('p1');
  });

  it('pauseOnHover=false iken pointer olaylari dinlenmez', () => {
    const onPause = vi.fn();
    const onResume = vi.fn();
    renderToast({
      toasts: [makeToast()],
      pauseOnHover: false,
      onPause,
      onResume,
    });
    const item = screen.getByTestId('toast-item');
    fireEvent.pointerEnter(item);
    fireEvent.pointerLeave(item);
    expect(onPause).not.toHaveBeenCalled();
    expect(onResume).not.toHaveBeenCalled();
  });

  // ── Progress Bar ──

  it('showProgress aktifken progress bar render eder', () => {
    renderToast({
      toasts: [makeToast({ duration: 5000 })],
      showProgress: true,
    });
    expect(screen.getByTestId('toast-progress')).toBeInTheDocument();
  });

  it('showProgress=false iken progress bar render etmez', () => {
    renderToast({
      toasts: [makeToast({ duration: 5000 })],
      showProgress: false,
    });
    expect(screen.queryByTestId('toast-progress')).not.toBeInTheDocument();
  });

  it('duration=0 iken progress bar render etmez (showProgress aktif olsa bile)', () => {
    renderToast({
      toasts: [makeToast({ duration: 0 })],
      showProgress: true,
    });
    expect(screen.queryByTestId('toast-progress')).not.toBeInTheDocument();
  });

  // ── Position ──

  it.each([
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ] as const)('position=%s ile container render eder', (position) => {
    renderToast({ position });
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  // ── A11y ──

  it('container role="region" tasir', () => {
    renderToast();
    expect(screen.getByTestId('toast-container')).toHaveAttribute('role', 'region');
  });

  it('container aria-live="polite" tasir', () => {
    renderToast();
    expect(screen.getByTestId('toast-container')).toHaveAttribute('aria-live', 'polite');
  });

  it('container aria-label tasir', () => {
    renderToast();
    expect(screen.getByTestId('toast-container')).toHaveAttribute('aria-label', 'Bildirimler');
  });

  // ── ref ──

  it('ref iletir', () => {
    const ref = vi.fn();
    render(<Toast ref={ref} toasts={[makeToast()]} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  // ── id ──

  it('id prop iletir', () => {
    renderToast({ id: 'my-toast-container' });
    expect(screen.getByTestId('toast-container')).toHaveAttribute('id', 'my-toast-container');
  });

  // ── className + style ──

  it('className prop merge edilir', () => {
    renderToast({ className: 'custom-toast' });
    expect(screen.getByTestId('toast-container').className).toContain('custom-toast');
  });

  it('style prop uygulanir', () => {
    renderToast({ style: { opacity: '0.5' } });
    expect(screen.getByTestId('toast-container')).toHaveStyle({ opacity: '0.5' });
  });

  // ── Slot API: classNames ──

  it('classNames.root container a eklenir', () => {
    renderToast({ classNames: { root: 'slot-root' } });
    expect(screen.getByTestId('toast-container').className).toContain('slot-root');
  });

  it('classNames.item toast item a eklenir', () => {
    renderToast({ classNames: { item: 'slot-item' } });
    expect(screen.getByTestId('toast-item').className).toContain('slot-item');
  });

  it('classNames.closeButton kapat butonuna eklenir', () => {
    renderToast({
      toasts: [makeToast({ closable: true })],
      classNames: { closeButton: 'slot-close' },
    });
    expect(screen.getByTestId('toast-close').className).toContain('slot-close');
  });

  it('classNames.progressBar progress bar a eklenir', () => {
    renderToast({
      toasts: [makeToast({ duration: 5000 })],
      showProgress: true,
      classNames: { progressBar: 'slot-progress' },
    });
    expect(screen.getByTestId('toast-progress').className).toContain('slot-progress');
  });

  // ── Slot API: styles ──

  it('styles.root container a uygulanir', () => {
    renderToast({ styles: { root: { padding: '20px' } } });
    expect(screen.getByTestId('toast-container')).toHaveStyle({ padding: '20px' });
  });

  it('styles.item toast item a uygulanir', () => {
    renderToast({ styles: { item: { fontSize: '18px' } } });
    expect(screen.getByTestId('toast-item')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.closeButton kapat butonuna uygulanir', () => {
    renderToast({
      toasts: [makeToast({ closable: true })],
      styles: { closeButton: { padding: '4px' } },
    });
    expect(screen.getByTestId('toast-close')).toHaveStyle({ padding: '4px' });
  });

  it('styles.progressBar progress bar a uygulanir', () => {
    renderToast({
      toasts: [makeToast({ duration: 5000 })],
      showProgress: true,
      styles: { progressBar: { opacity: '0.5' } },
    });
    expect(screen.getByTestId('toast-progress')).toHaveStyle({ opacity: '0.5' });
  });

  it('styles.title title elemana uygulanir', () => {
    renderToast({
      toasts: [makeToast({ title: 'Bilgi' })],
      styles: { title: { fontSize: '18px' } },
    });
    expect(screen.getByTestId('toast-title')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.message message elemana uygulanir', () => {
    renderToast({
      styles: { message: { letterSpacing: '1px' } },
    });
    expect(screen.getByTestId('toast-message')).toHaveStyle({ letterSpacing: '1px' });
  });

  it('styles.icon icon elemana uygulanir', () => {
    renderToast({
      styles: { icon: { padding: '20px' } },
    });
    const item = screen.getByTestId('toast-item');
    const iconSpan = item.querySelector('span') as HTMLElement;
    expect(iconSpan).toHaveStyle({ padding: '20px' });
  });

  it('styles.content content elemana uygulanir', () => {
    renderToast({
      styles: { content: { letterSpacing: '2px' } },
    });
    const item = screen.getByTestId('toast-item');
    const contentDiv = item.querySelector('div') as HTMLElement;
    expect(contentDiv).toHaveStyle({ letterSpacing: '2px' });
  });

  // ── Default position ──

  it('varsayilan position top-right olarak render eder', () => {
    renderToast();
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  // ── pauseOnHover default ──

  it('pauseOnHover varsayilan olarak true', () => {
    const onPause = vi.fn();
    renderToast({ toasts: [makeToast({ id: 'def' })], onPause });
    fireEvent.pointerEnter(screen.getByTestId('toast-item'));
    expect(onPause).toHaveBeenCalledWith('def');
  });
});

// ── Compound API ──

describe('Toast (Compound)', () => {
  it('compound: children ile container render eder', () => {
    render(
      <Toast>
        <Toast.Title>Bilgi</Toast.Title>
        <Toast.Description>Islem basarili.</Toast.Description>
      </Toast>,
    );
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  it('compound: Toast.Title render edilir', () => {
    render(
      <Toast>
        <Toast.Title>Baslik</Toast.Title>
      </Toast>,
    );
    expect(screen.getByTestId('toast-title')).toHaveTextContent('Baslik');
  });

  it('compound: Toast.Description render edilir', () => {
    render(
      <Toast>
        <Toast.Description>Aciklama metni</Toast.Description>
      </Toast>,
    );
    expect(screen.getByTestId('toast-description')).toHaveTextContent('Aciklama metni');
  });

  it('compound: Toast.Icon render edilir', () => {
    render(
      <Toast>
        <Toast.Icon><span data-testid="cmp-icon">i</span></Toast.Icon>
      </Toast>,
    );
    expect(screen.getByTestId('cmp-icon')).toBeInTheDocument();
    expect(screen.getByTestId('toast-icon')).toBeInTheDocument();
  });

  it('compound: Toast.CloseButton render edilir ve tiklanir', () => {
    const onClick = vi.fn();
    render(
      <Toast>
        <Toast.CloseButton onClick={onClick} />
      </Toast>,
    );
    const btn = screen.getByTestId('toast-closebutton');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-label', 'Close');
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Toast classNames={{ title: 'cmp-title' }}>
        <Toast.Title>Test</Toast.Title>
      </Toast>,
    );
    expect(screen.getByTestId('toast-title').className).toContain('cmp-title');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Toast styles={{ message: { fontSize: '20px' } }}>
        <Toast.Description>Test</Toast.Description>
      </Toast>,
    );
    expect(screen.getByTestId('toast-description')).toHaveStyle({ fontSize: '20px' });
  });
});
