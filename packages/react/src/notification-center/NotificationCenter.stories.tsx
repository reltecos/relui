/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { NotificationCenter } from './NotificationCenter';
import { useNotificationCenter } from './useNotificationCenter';
import type { NotificationSeverity } from '@relteco/relui-core';

const meta: Meta<typeof NotificationCenter> = {
  title: 'Feedback/NotificationCenter',
  component: NotificationCenter,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof NotificationCenter>;

// ── Demo ────────────────────────────────────────────

function NotificationCenterDemo() {
  const {
    notifications,
    open,
    unreadCount,
    add,
    remove,
    removeAll,
    markRead,
    markAllRead,
    toggle,
  } = useNotificationCenter({ maxItems: 50 });

  const severities: NotificationSeverity[] = ['info', 'success', 'warning', 'error'];
  const messages: Record<NotificationSeverity, string> = {
    info: 'Yeni guncelleme mevcut.',
    success: 'Dosya basariyla yuklendi.',
    warning: 'Disk alani azaliyor.',
    error: 'Baglanti kesildi.',
  };

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h3>NotificationCenter Demo</h3>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {severities.map((severity) => (
          <button
            key={severity}
            onClick={() =>
              add({
                severity,
                title: severity.charAt(0).toUpperCase() + severity.slice(1),
                message: messages[severity],
                group: severity === 'error' ? 'Hatalar' : undefined,
              })
            }
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid var(--rel-color-border, #ddd)',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {severity} Ekle
          </button>
        ))}
      </div>

      <button
        onClick={toggle}
        style={{
          padding: '10px 20px',
          borderRadius: 8,
          border: '1px solid var(--rel-color-primary, #3b82f6)',
          backgroundColor: 'var(--rel-color-primary, #3b82f6)',
          color: 'var(--rel-color-text-inverse, #fff)',
          cursor: 'pointer',
          fontSize: 14,
          position: 'relative',
        }}
      >
        Bildirimler
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: 'var(--rel-color-error, #dc2626)',
              color: 'var(--rel-color-text-inverse, #fff)',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      <NotificationCenter
        notifications={notifications}
        open={open}
        unreadCount={unreadCount}
        onClose={toggle}
        onRemove={remove}
        onClick={markRead}
        onMarkAllRead={markAllRead}
        onClearAll={removeAll}
      />
    </div>
  );
}

// ── Stories ──────────────────────────────────────────

export const Default: Story = {
  render: () => <NotificationCenterDemo />,
};

function GroupedDemo() {
  const { notifications, open, unreadCount, add, remove, markRead, markAllRead, removeAll, toggle } =
    useNotificationCenter();

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h3>Gruplu Bildirimler</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => add({ severity: 'info', title: 'Sistem', message: 'Yeni versiyon mevcut.', group: 'Sistem' })}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--rel-color-border, #ddd)', cursor: 'pointer' }}
        >
          Sistem Bildirimi
        </button>
        <button
          onClick={() => add({ severity: 'success', title: 'Siparis', message: 'Siparis onaylandi.', group: 'Siparisler' })}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--rel-color-border, #ddd)', cursor: 'pointer' }}
        >
          Siparis Bildirimi
        </button>
        <button
          onClick={() => add({ severity: 'warning', message: 'Genel uyari mesaji.' })}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--rel-color-border, #ddd)', cursor: 'pointer' }}
        >
          Grupsuz
        </button>
      </div>
      <button
        onClick={toggle}
        style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--rel-color-primary, #3b82f6)', color: 'var(--rel-color-primary, #3b82f6)', cursor: 'pointer' }}
      >
        Ac ({unreadCount})
      </button>
      <NotificationCenter
        notifications={notifications}
        open={open}
        unreadCount={unreadCount}
        onClose={toggle}
        onRemove={remove}
        onClick={markRead}
        onMarkAllRead={markAllRead}
        onClearAll={removeAll}
      />
    </div>
  );
}

export const Grouped: Story = {
  render: () => <GroupedDemo />,
};

// ── Compound ──

function CompoundDemo() {
  const { notifications, open, unreadCount, add, remove, markRead, toggle } =
    useNotificationCenter();

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h3>Compound NotificationCenter</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => add({ severity: 'info', title: 'Bilgi', message: 'Compound bildirim.' })}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--rel-color-border, #ddd)', cursor: 'pointer' }}
        >
          Bildirim Ekle
        </button>
      </div>
      <button
        onClick={toggle}
        style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--rel-color-primary, #3b82f6)', backgroundColor: 'var(--rel-color-primary, #3b82f6)', color: 'var(--rel-color-text-inverse, #fff)', cursor: 'pointer' }}
      >
        Ac ({unreadCount})
      </button>
      <NotificationCenter notifications={notifications} open={open} unreadCount={unreadCount} onClose={toggle}>
        <NotificationCenter.Header>
          <span style={{ fontWeight: 600, fontSize: 16 }}>Compound Bildirimler ({unreadCount})</span>
        </NotificationCenter.Header>
        {notifications.length === 0 ? (
          <NotificationCenter.EmptyState />
        ) : (
          notifications.map((n) => (
            <NotificationCenter.Item key={n.id} severity={n.severity} read={n.read} onClick={() => markRead(n.id)}>
              <div style={{ flex: 1 }}>
                {n.title && <div style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</div>}
                <div style={{ fontSize: 13, opacity: 0.9 }}>{n.message}</div>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); remove(n.id); }} style={{ border: 'none', background: 'none', cursor: 'pointer', opacity: 0.5 }}>x</button>
            </NotificationCenter.Item>
          ))
        )}
      </NotificationCenter>
    </div>
  );
}

export const Compound: Story = {
  render: () => <CompoundDemo />,
};

// ── EmptyState ──

function EmptyStateDemo() {
  const { notifications, open, unreadCount, toggle } = useNotificationCenter();

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h3>Bos Bildirim Merkezi</h3>
      <button
        onClick={toggle}
        style={{
          padding: '10px 20px',
          borderRadius: 8,
          border: '1px solid var(--rel-color-primary, #3b82f6)',
          backgroundColor: 'var(--rel-color-primary, #3b82f6)',
          color: 'var(--rel-color-text-inverse, #fff)',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        Bildirimleri Ac
      </button>

      <NotificationCenter
        notifications={notifications}
        open={open}
        unreadCount={unreadCount}
        onClose={toggle}
        onRemove={() => {}}
        onClick={() => {}}
        onMarkAllRead={() => {}}
        onClearAll={() => {}}
      />
    </div>
  );
}

export const EmptyState: Story = {
  render: () => <EmptyStateDemo />,
};

// ── AllRead ──

function AllReadDemo() {
  const { notifications, open, unreadCount, add, remove, markRead, markAllRead, removeAll, toggle } =
    useNotificationCenter();

  const addReadNotifications = () => {
    add({ severity: 'info', title: 'Bilgi', message: 'Sistem guncellendi.' });
    add({ severity: 'success', title: 'Basarili', message: 'Dosya yuklendi.' });
    add({ severity: 'warning', title: 'Uyari', message: 'Disk alani azaliyor.' });
    setTimeout(() => markAllRead(), 50);
  };

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h3>Tumu Okunmus Bildirimler</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={addReadNotifications}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: '1px solid var(--rel-color-border, #ddd)',
            cursor: 'pointer',
          }}
        >
          Okunmus Bildirimler Ekle
        </button>
      </div>
      <button
        onClick={toggle}
        style={{
          padding: '10px 20px',
          borderRadius: 8,
          border: '1px solid var(--rel-color-primary, #3b82f6)',
          backgroundColor: 'var(--rel-color-primary, #3b82f6)',
          color: 'var(--rel-color-text-inverse, #fff)',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        Ac ({unreadCount})
      </button>

      <NotificationCenter
        notifications={notifications}
        open={open}
        unreadCount={unreadCount}
        onClose={toggle}
        onRemove={remove}
        onClick={markRead}
        onMarkAllRead={markAllRead}
        onClearAll={removeAll}
      />
    </div>
  );
}

export const AllRead: Story = {
  render: () => <AllReadDemo />,
};

// ── CustomSlotStyles ──

function CustomSlotStylesDemo() {
  const { notifications, open, unreadCount, add, remove, markRead, markAllRead, removeAll, toggle } =
    useNotificationCenter();

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h3>Koyu Tema Bildirim Merkezi</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => add({ severity: 'info', title: 'Bilgi', message: 'Koyu tema bildirimi.' })}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--rel-color-border, #ddd)', cursor: 'pointer' }}
        >
          Bildirim Ekle
        </button>
      </div>
      <button
        onClick={toggle}
        style={{
          padding: '10px 20px',
          borderRadius: 8,
          border: '1px solid var(--rel-color-info, #8b5cf6)',
          backgroundColor: 'var(--rel-color-info, #8b5cf6)',
          color: 'var(--rel-color-text-inverse, #fff)',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        Ac ({unreadCount})
      </button>

      <NotificationCenter
        notifications={notifications}
        open={open}
        unreadCount={unreadCount}
        onClose={toggle}
        onRemove={remove}
        onClick={markRead}
        onMarkAllRead={markAllRead}
        onClearAll={removeAll}
        styles={{
          panel: { backgroundColor: 'var(--rel-color-bg-inverse, #1e293b)', borderColor: 'var(--rel-color-border, #334155)' },
          header: { borderBottomColor: 'var(--rel-color-border, #334155)' },
          headerTitle: { color: 'var(--rel-color-text-inverse, #e2e8f0)' },
          item: { borderBottomColor: 'var(--rel-color-border, #334155)' },
          itemTitle: { color: 'var(--rel-color-bg-subtle, #f1f5f9)' },
          itemMessage: { color: 'var(--rel-color-text-muted, #94a3b8)' },
          emptyState: { color: 'var(--rel-color-text-muted, #64748b)' },
        }}
      />
    </div>
  );
}

export const CustomSlotStyles: Story = {
  render: () => <CustomSlotStylesDemo />,
};
