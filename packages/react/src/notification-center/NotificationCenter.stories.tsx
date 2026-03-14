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
              border: '1px solid #ddd',
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
          border: '1px solid #3b82f6',
          backgroundColor: '#3b82f6',
          color: '#fff',
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
              backgroundColor: '#dc2626',
              color: '#fff',
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
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}
        >
          Sistem Bildirimi
        </button>
        <button
          onClick={() => add({ severity: 'success', title: 'Siparis', message: 'Siparis onaylandi.', group: 'Siparisler' })}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}
        >
          Siparis Bildirimi
        </button>
        <button
          onClick={() => add({ severity: 'warning', message: 'Genel uyari mesaji.' })}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}
        >
          Grupsuz
        </button>
      </div>
      <button
        onClick={toggle}
        style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer' }}
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
