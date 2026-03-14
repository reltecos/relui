/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { useToast } from './useToast';
import type { ToastPosition, ToastStatus } from '@relteco/relui-core';

const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Toast>;

// ── Helper Wrapper ──────────────────────────────────

function ToastDemo({ position = 'top-right' as ToastPosition }) {
  const { toasts, add, remove, removeAll, pause, resume } = useToast({
    maxVisible: 5,
    defaultDuration: 5000,
  });

  const statuses: ToastStatus[] = ['info', 'success', 'warning', 'error'];

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h3>Toast Demo — {position}</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() =>
              add({
                status,
                title: status.charAt(0).toUpperCase() + status.slice(1),
                message: `Bu bir ${status} bildirimi.`,
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
            {status}
          </button>
        ))}
        <button
          onClick={() => add({ message: 'Basligi olmayan bildirim.', closable: false })}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}
        >
          Basligi yok
        </button>
        <button
          onClick={removeAll}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: '1px solid #e11d48',
            color: '#e11d48',
            cursor: 'pointer',
          }}
        >
          Tumunu Kaldir
        </button>
      </div>

      <Toast
        toasts={toasts}
        position={position}
        pauseOnHover
        showProgress
        onClose={remove}
        onPause={pause}
        onResume={resume}
      />
    </div>
  );
}

// ── Stories ──────────────────────────────────────────

export const Default: Story = {
  render: () => <ToastDemo />,
};

export const TopLeft: Story = {
  render: () => <ToastDemo position="top-left" />,
};

export const TopCenter: Story = {
  render: () => <ToastDemo position="top-center" />,
};

export const BottomLeft: Story = {
  render: () => <ToastDemo position="bottom-left" />,
};

export const BottomCenter: Story = {
  render: () => <ToastDemo position="bottom-center" />,
};

export const BottomRight: Story = {
  render: () => <ToastDemo position="bottom-right" />,
};

function AllPositionsDemo() {
  const positions: ToastPosition[] = [
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right',
  ];

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h3>Tum pozisyonlar icin butonlar asagida</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {positions.map((pos) => (
          <PositionButton key={pos} position={pos} />
        ))}
      </div>
    </div>
  );
}

function PositionButton({ position }: { position: ToastPosition }) {
  const { toasts, add, remove, pause, resume } = useToast({ maxVisible: 3 });
  return (
    <>
      <button
        onClick={() =>
          add({
            status: 'info',
            title: position,
            message: `${position} toast`,
          })
        }
        style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}
      >
        {position}
      </button>
      <Toast
        toasts={toasts}
        position={position}
        pauseOnHover
        showProgress
        onClose={remove}
        onPause={pause}
        onResume={resume}
      />
    </>
  );
}

export const AllPositions: Story = {
  render: () => <AllPositionsDemo />,
};

function CustomStyledDemo() {
  const { toasts, add, remove, pause, resume } = useToast({ maxVisible: 5 });
  return (
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h3>Custom Slot Styles</h3>
      <button
        onClick={() =>
          add({
            status: 'success',
            title: 'Basarili',
            message: 'Slot API ile ozellestirilmis toast.',
          })
        }
        style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}
      >
        Toast Ekle
      </button>
      <Toast
        toasts={toasts}
        position="top-right"
        pauseOnHover
        showProgress
        onClose={remove}
        onPause={pause}
        onResume={resume}
        classNames={{ root: 'custom-root' }}
        styles={{
          item: { borderRadius: 16 },
          title: { letterSpacing: '0.05em' },
          progressBar: { opacity: 0.5 },
        }}
      />
    </div>
  );
}

export const CustomSlotStyles: Story = {
  render: () => <CustomStyledDemo />,
};
