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
import { NotificationCenter, type NotificationCenterComponentProps } from './NotificationCenter';
import type { NotificationItem } from '@relteco/relui-core';

// ── Helper ──────────────────────────────────────────

function makeNotif(overrides: Partial<NotificationItem> = {}): NotificationItem {
  return {
    id: 'n1',
    severity: 'info',
    message: 'Test mesaji',
    createdAt: Date.now(),
    read: false,
    ...overrides,
  };
}

function renderNC(props: Partial<NotificationCenterComponentProps> = {}) {
  const defaultProps: NotificationCenterComponentProps = {
    notifications: [makeNotif()],
    open: true,
    unreadCount: 1,
    ...props,
  };
  return render(<NotificationCenter {...defaultProps} />);
}

// ── Tests ───────────────────────────────────────────

describe('NotificationCenter', () => {
  // ── Render ──

  it('open=true iken panel render eder', () => {
    renderNC();
    expect(screen.getByTestId('nc-panel')).toBeInTheDocument();
  });

  it('open=false iken render etmez', () => {
    renderNC({ open: false });
    expect(screen.queryByTestId('nc-panel')).not.toBeInTheDocument();
  });

  it('overlay render eder', () => {
    renderNC();
    expect(screen.getByTestId('nc-overlay')).toBeInTheDocument();
  });

  it('varsayilan baslik "Bildirimler" gosterir', () => {
    renderNC();
    expect(screen.getByTestId('nc-panel')).toHaveAttribute('aria-label', 'Bildirimler');
  });

  it('ozel baslik gosterir', () => {
    renderNC({ title: 'Haberler' });
    expect(screen.getByTestId('nc-panel')).toHaveAttribute('aria-label', 'Haberler');
  });

  // ── Badge ──

  it('unreadCount > 0 iken badge gosterir', () => {
    renderNC({ unreadCount: 5 });
    expect(screen.getByTestId('nc-badge')).toHaveTextContent('5');
  });

  it('unreadCount = 0 iken badge gostermez', () => {
    renderNC({ unreadCount: 0 });
    expect(screen.queryByTestId('nc-badge')).not.toBeInTheDocument();
  });

  // ── Bildirim listesi ──

  it('bildirim mesajini gosterir', () => {
    renderNC({ notifications: [makeNotif({ message: 'Yeni guncelleme' })] });
    expect(screen.getByTestId('nc-item-message')).toHaveTextContent('Yeni guncelleme');
  });

  it('bildirim basligini gosterir', () => {
    renderNC({ notifications: [makeNotif({ title: 'Baslik', message: 'Mesaj' })] });
    expect(screen.getByTestId('nc-item-title')).toHaveTextContent('Baslik');
  });

  it('baslik yoksa title elementi render etmez', () => {
    renderNC({ notifications: [makeNotif({ title: undefined })] });
    expect(screen.queryByTestId('nc-item-title')).not.toBeInTheDocument();
  });

  it('birden fazla bildirim render eder', () => {
    renderNC({
      notifications: [
        makeNotif({ id: 'a', message: 'Bir' }),
        makeNotif({ id: 'b', message: 'Iki' }),
        makeNotif({ id: 'c', message: 'Uc' }),
      ],
    });
    expect(screen.getAllByTestId('nc-item')).toHaveLength(3);
  });

  it('zaman damgasini gosterir', () => {
    renderNC({
      notifications: [makeNotif()],
      formatTime: () => '5 dk once',
    });
    expect(screen.getByTestId('nc-item-timestamp')).toHaveTextContent('5 dk once');
  });

  // ── Severity ──

  it.each(['info', 'success', 'warning', 'error'] as const)(
    '%s severity icin ikon render eder',
    (severity) => {
      renderNC({ notifications: [makeNotif({ severity })] });
      const item = screen.getByTestId('nc-item');
      expect(item).toHaveAttribute('data-severity', severity);
      const svg = item.querySelector('svg');
      expect(svg).toBeInTheDocument();
    },
  );

  // ── Read/unread ──

  it('okunmamis bildirim data-read="false" tasir', () => {
    renderNC({ notifications: [makeNotif({ read: false })] });
    expect(screen.getByTestId('nc-item')).toHaveAttribute('data-read', 'false');
  });

  it('okunmus bildirim data-read="true" tasir', () => {
    renderNC({ notifications: [makeNotif({ read: true })] });
    expect(screen.getByTestId('nc-item')).toHaveAttribute('data-read', 'true');
  });

  // ── Callbacks ──

  it('onClick bildirimi tiklaninca cagirilir', () => {
    const onClick = vi.fn();
    renderNC({ notifications: [makeNotif({ id: 'x' })], onClick });
    fireEvent.click(screen.getByTestId('nc-item'));
    expect(onClick).toHaveBeenCalledWith('x');
  });

  it('onRemove kapat butonuyla cagirilir', () => {
    const onRemove = vi.fn();
    renderNC({ notifications: [makeNotif({ id: 'y' })], onRemove });
    fireEvent.click(screen.getByTestId('nc-item-close'));
    expect(onRemove).toHaveBeenCalledWith('y');
  });

  it('onRemove tiklaninca onClick tetiklenmez (stopPropagation)', () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    renderNC({ notifications: [makeNotif()], onClick, onRemove });
    fireEvent.click(screen.getByTestId('nc-item-close'));
    expect(onRemove).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('onClose overlay tiklaninca cagirilir', () => {
    const onClose = vi.fn();
    renderNC({ onClose, closeOnOverlay: true });
    fireEvent.click(screen.getByTestId('nc-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnOverlay=false iken overlay tiklama kapamaz', () => {
    const onClose = vi.fn();
    renderNC({ onClose, closeOnOverlay: false });
    fireEvent.click(screen.getByTestId('nc-overlay'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('onClose kapat butonuyla cagirilir', () => {
    const onClose = vi.fn();
    renderNC({ onClose });
    fireEvent.click(screen.getByTestId('nc-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('onMarkAllRead butonuyla cagirilir', () => {
    const onMarkAllRead = vi.fn();
    renderNC({ onMarkAllRead });
    fireEvent.click(screen.getByTestId('nc-mark-all-read'));
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });

  it('onClearAll butonuyla cagirilir', () => {
    const onClearAll = vi.fn();
    renderNC({ onClearAll });
    fireEvent.click(screen.getByTestId('nc-clear-all'));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  // ── Header butonlari disabled ──

  it('unreadCount=0 iken "Tumunu oku" butonu disabled', () => {
    renderNC({ unreadCount: 0, onMarkAllRead: vi.fn() });
    expect(screen.getByTestId('nc-mark-all-read')).toBeDisabled();
  });

  it('notifications bos iken "Temizle" butonu disabled', () => {
    renderNC({ notifications: [], unreadCount: 0, onClearAll: vi.fn() });
    expect(screen.getByTestId('nc-clear-all')).toBeDisabled();
  });

  // ── Empty state ──

  it('bos listede bos durum mesaji gosterir', () => {
    renderNC({ notifications: [], unreadCount: 0 });
    expect(screen.getByTestId('nc-empty')).toHaveTextContent('Bildirim yok');
  });

  // ── Gruplama ──

  it('gruplu bildirimleri gruplayarak gosterir', () => {
    renderNC({
      notifications: [
        makeNotif({ id: 'a', group: 'Sistem', message: 'A' }),
        makeNotif({ id: 'b', group: 'Sistem', message: 'B' }),
        makeNotif({ id: 'c', message: 'C' }),
      ],
      unreadCount: 3,
    });
    expect(screen.getByTestId('nc-group')).toBeInTheDocument();
    expect(screen.getByTestId('nc-group-title')).toHaveTextContent('Sistem');
    expect(screen.getAllByTestId('nc-item')).toHaveLength(3);
  });

  // ── A11y ──

  it('panel role="region" tasir', () => {
    renderNC();
    expect(screen.getByTestId('nc-panel')).toHaveAttribute('role', 'region');
  });

  it('overlay aria-hidden="true" tasir', () => {
    renderNC();
    expect(screen.getByTestId('nc-overlay')).toHaveAttribute('aria-hidden', 'true');
  });

  it('kapat butonu aria-label tasir', () => {
    renderNC({ onClose: vi.fn() });
    expect(screen.getByTestId('nc-close')).toHaveAttribute('aria-label', 'Kapat');
  });

  it('bildirim kapat butonu aria-label tasir', () => {
    renderNC({ onRemove: vi.fn() });
    expect(screen.getByTestId('nc-item-close')).toHaveAttribute('aria-label', 'Bildirimi kaldir');
  });

  // ── ref ──

  it('ref iletir', () => {
    const ref = vi.fn();
    render(
      <NotificationCenter
        ref={ref}
        notifications={[makeNotif()]}
        open={true}
        unreadCount={1}
      />,
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  // ── id ──

  it('id prop iletir', () => {
    renderNC({ id: 'my-nc' });
    expect(screen.getByTestId('nc-panel')).toHaveAttribute('id', 'my-nc');
  });

  // ── className + style ──

  it('className prop panel e eklenir', () => {
    renderNC({ className: 'custom-nc' });
    expect(screen.getByTestId('nc-panel').className).toContain('custom-nc');
  });

  it('style prop panel e uygulanir', () => {
    renderNC({ style: { opacity: '0.9' } });
    expect(screen.getByTestId('nc-panel')).toHaveStyle({ opacity: '0.9' });
  });

  // ── Slot API: classNames ──

  it('classNames.overlay overlay a eklenir', () => {
    renderNC({ classNames: { overlay: 'slot-overlay' } });
    expect(screen.getByTestId('nc-overlay').className).toContain('slot-overlay');
  });

  it('classNames.panel panel a eklenir', () => {
    renderNC({ classNames: { panel: 'slot-panel' } });
    expect(screen.getByTestId('nc-panel').className).toContain('slot-panel');
  });

  it('classNames.header header a eklenir', () => {
    renderNC({ classNames: { header: 'slot-header' } });
    expect(screen.getByTestId('nc-header').className).toContain('slot-header');
  });

  it('classNames.list list e eklenir', () => {
    renderNC({ classNames: { list: 'slot-list' } });
    expect(screen.getByTestId('nc-list').className).toContain('slot-list');
  });

  // ── Slot API: styles ──

  it('styles.panel panel a uygulanir', () => {
    renderNC({ styles: { panel: { padding: '24px' } } });
    expect(screen.getByTestId('nc-panel')).toHaveStyle({ padding: '24px' });
  });

  it('styles.header header a uygulanir', () => {
    renderNC({ styles: { header: { padding: '16px' } } });
    expect(screen.getByTestId('nc-header')).toHaveStyle({ padding: '16px' });
  });

  it('styles.list list e uygulanir', () => {
    renderNC({ styles: { list: { padding: '8px' } } });
    expect(screen.getByTestId('nc-list')).toHaveStyle({ padding: '8px' });
  });

  it('styles.emptyState bos durum mesajina uygulanir', () => {
    renderNC({ notifications: [], unreadCount: 0, styles: { emptyState: { fontSize: '18px' } } });
    expect(screen.getByTestId('nc-empty')).toHaveStyle({ fontSize: '18px' });
  });
});

// ── Compound API ──

describe('NotificationCenter (Compound)', () => {
  it('compound: children ile panel render eder', () => {
    render(
      <NotificationCenter notifications={[makeNotif()]} open={true} unreadCount={1}>
        <NotificationCenter.Header>Bildirimler</NotificationCenter.Header>
      </NotificationCenter>,
    );
    expect(screen.getByTestId('nc-panel')).toBeInTheDocument();
    expect(screen.getByTestId('nc-overlay')).toBeInTheDocument();
  });

  it('compound: NotificationCenter.Header render edilir', () => {
    render(
      <NotificationCenter notifications={[makeNotif()]} open={true} unreadCount={1}>
        <NotificationCenter.Header>Ozel Baslik</NotificationCenter.Header>
      </NotificationCenter>,
    );
    expect(screen.getByTestId('nc-header')).toHaveTextContent('Ozel Baslik');
  });

  it('compound: NotificationCenter.Item render edilir', () => {
    render(
      <NotificationCenter notifications={[makeNotif()]} open={true} unreadCount={1}>
        <NotificationCenter.Item severity="success" read={false}>
          Islem basarili
        </NotificationCenter.Item>
      </NotificationCenter>,
    );
    const item = screen.getByTestId('nc-item');
    expect(item).toBeInTheDocument();
    expect(item).toHaveAttribute('data-severity', 'success');
    expect(item).toHaveAttribute('data-read', 'false');
  });

  it('compound: NotificationCenter.EmptyState render edilir', () => {
    render(
      <NotificationCenter notifications={[]} open={true} unreadCount={0}>
        <NotificationCenter.EmptyState>Hic bildirim yok</NotificationCenter.EmptyState>
      </NotificationCenter>,
    );
    expect(screen.getByTestId('nc-empty')).toHaveTextContent('Hic bildirim yok');
  });

  it('compound: NotificationCenter.EmptyState varsayilan metin', () => {
    render(
      <NotificationCenter notifications={[]} open={true} unreadCount={0}>
        <NotificationCenter.EmptyState />
      </NotificationCenter>,
    );
    expect(screen.getByTestId('nc-empty')).toHaveTextContent('Bildirim yok');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <NotificationCenter
        notifications={[makeNotif()]}
        open={true}
        unreadCount={1}
        classNames={{ header: 'cmp-header' }}
      >
        <NotificationCenter.Header>Test</NotificationCenter.Header>
      </NotificationCenter>,
    );
    expect(screen.getByTestId('nc-header').className).toContain('cmp-header');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <NotificationCenter
        notifications={[]}
        open={true}
        unreadCount={0}
        styles={{ emptyState: { fontSize: '24px' } }}
      >
        <NotificationCenter.EmptyState />
      </NotificationCenter>,
    );
    expect(screen.getByTestId('nc-empty')).toHaveStyle({ fontSize: '24px' });
  });
});
