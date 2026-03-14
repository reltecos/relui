/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from './AlertDialog';
import type { AlertDialogSeverity } from '@relteco/relui-core';

const meta: Meta<typeof AlertDialog> = {
  title: 'Feedback/AlertDialog',
  component: AlertDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof AlertDialog>;

// ── Helpers ─────────────────────────────────────────

function DangerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #dc2626', color: '#dc2626', cursor: 'pointer' }}
      >
        Kaydi Sil
      </button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        severity="danger"
        title="Kaydi silmek istediginize emin misiniz?"
        description="Bu islem geri alinamaz. Tum iliskili veriler de silinecektir."
        confirmLabel="Evet, Sil"
        cancelLabel="Vazgec"
        onConfirm={() => {}}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}

function WarningDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #f59e0b', color: '#92400e', cursor: 'pointer' }}
      >
        Degisiklikleri Kaydetmeden Cik
      </button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        severity="warning"
        title="Kaydedilmemis degisiklikler var"
        description="Sayfadan cikarsaniz yaptiginiz degisiklikler kaybolacaktir."
        confirmLabel="Cik"
        cancelLabel="Kalmaya Devam Et"
        onConfirm={() => {}}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}

function InfoDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer' }}
      >
        Dosyayi Indir
      </button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        severity="info"
        title="Dosya indirilecek"
        description="rapor_2026.pdf dosyasi indirilecektir. Devam etmek istiyor musunuz?"
        confirmLabel="Indir"
        cancelLabel="Iptal"
        onConfirm={() => {}}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}

function AsyncDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #dc2626', color: '#dc2626', cursor: 'pointer' }}
      >
        Async Silme
      </button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        severity="danger"
        title="Kalici olarak silmek istiyor musunuz?"
        description="Sunucu ile iletisim kurulacak, bekleyin..."
        confirmLabel="Sil"
        cancelLabel="Vazgec"
        onConfirm={() =>
          new Promise<void>((resolve) => setTimeout(resolve, 2000))
        }
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}

function AllSeveritiesDemo() {
  const [activeDialog, setActiveDialog] = useState<AlertDialogSeverity | null>(null);

  const configs: Array<{ severity: AlertDialogSeverity; label: string; title: string; description: string }> = [
    {
      severity: 'danger',
      label: 'Danger Dialog',
      title: 'Tehlikeli islem',
      description: 'Bu islem geri alinamaz.',
    },
    {
      severity: 'warning',
      label: 'Warning Dialog',
      title: 'Uyari',
      description: 'Devam etmek istiyor musunuz?',
    },
    {
      severity: 'info',
      label: 'Info Dialog',
      title: 'Bilgi',
      description: 'Bu islem hakkinda bilgi.',
    },
  ];

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {configs.map(({ severity, label, title, description }) => (
        <div key={severity}>
          <button
            onClick={() => setActiveDialog(severity)}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #ddd',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {label}
          </button>
          <AlertDialog
            open={activeDialog === severity}
            onOpenChange={(v) => !v && setActiveDialog(null)}
            severity={severity}
            title={title}
            description={description}
            onConfirm={() => setActiveDialog(null)}
            onCancel={() => setActiveDialog(null)}
          />
        </div>
      ))}
    </div>
  );
}

// ── Stories ──────────────────────────────────────────

export const Default: Story = {
  render: () => <DangerDemo />,
};

export const Warning: Story = {
  render: () => <WarningDemo />,
};

export const Info: Story = {
  render: () => <InfoDemo />,
};

export const AsyncConfirm: Story = {
  render: () => <AsyncDemo />,
};

export const AllSeverities: Story = {
  render: () => <AllSeveritiesDemo />,
};
