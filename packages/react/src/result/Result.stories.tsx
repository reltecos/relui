/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Result } from './Result';

const meta: Meta<typeof Result> = {
  title: 'Feedback/Result',
  component: Result,
  tags: ['autodocs'],
  args: {
    status: 'success',
    title: 'Islem basarili!',
    subtitle: 'Siparisiniz basariyla olusturuldu.',
    size: 'md',
  },
  argTypes: {
    status: { control: 'select', options: ['success', 'error', 'warning', 'info', '404'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Result>;

export const Success: Story = {
  args: {
    status: 'success',
    title: 'Odeme basarili!',
    subtitle: 'Siparisiniz onaylandi ve kargoya verilecek.',
    action: (
      <button
        style={{
          padding: '10px 24px',
          borderRadius: 6,
          border: 'none',
          backgroundColor: '#16a34a',
          color: '#fff',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        Siparisi Goruntule
      </button>
    ),
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    title: 'Islem basarisiz',
    subtitle: 'Odeme islenirken bir hata olustu. Lutfen tekrar deneyin.',
    action: (
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          style={{
            padding: '10px 24px',
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            backgroundColor: '#fff',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Geri Don
        </button>
        <button
          style={{
            padding: '10px 24px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#dc2626',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Tekrar Dene
        </button>
      </div>
    ),
  },
};

export const Warning: Story = {
  args: {
    status: 'warning',
    title: 'Dikkat!',
    subtitle: 'Hesabiniz 3 gun icinde sona erecek. Lutfen yenileyin.',
  },
};

export const Info: Story = {
  args: {
    status: 'info',
    title: 'Bilgilendirme',
    subtitle: 'Sisteme yeni ozellikler eklendi. Detaylar icin dokumantasyonu inceleyin.',
  },
};

export const NotFound: Story = {
  args: {
    status: '404',
    title: '404 — Sayfa Bulunamadi',
    subtitle: 'Aradaginiz sayfa mevcut degil veya tasinmis olabilir.',
    action: (
      <button
        style={{
          padding: '10px 24px',
          borderRadius: 6,
          border: 'none',
          backgroundColor: '#3b82f6',
          color: '#fff',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        Ana Sayfaya Don
      </button>
    ),
  },
};

export const WithExtra: Story = {
  args: {
    status: 'success',
    title: 'Kayit tamamlandi',
    subtitle: 'Email adresinize dogrulama linki gonderildi.',
    extra: (
      <div
        style={{
          padding: 16,
          backgroundColor: '#f8fafc',
          borderRadius: 8,
          fontSize: 13,
          color: '#64748b',
          maxWidth: 360,
        }}
      >
        <strong>Siparis No:</strong> #12345678
        <br />
        <strong>Tarih:</strong> 14 Mart 2026
        <br />
        <strong>Tutar:</strong> 1.250,00 TL
      </div>
    ),
    action: (
      <button
        style={{
          padding: '10px 24px',
          borderRadius: 6,
          border: 'none',
          backgroundColor: '#16a34a',
          color: '#fff',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        Devam
      </button>
    ),
  },
};

export const Compound: Story = {
  render: () => (
    <Result status="success">
      <Result.Icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="100%" height="100%">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Result.Icon>
      <Result.Title>Siparis Onaylandi</Result.Title>
      <Result.Description>Siparisiniiz basariyla olusturuldu ve kargoya verilecektir.</Result.Description>
      <Result.Extra>
        <div style={{ padding: 16, backgroundColor: '#f8fafc', borderRadius: 8, fontSize: 13, color: '#64748b', maxWidth: 360 }}>
          <strong>Siparis No:</strong> #12345678
        </div>
      </Result.Extra>
    </Result>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ border: '1px dashed #e2e8f0', borderRadius: 8 }}>
        <Result size="sm" status="success" title="SM Boyut" subtitle="Kucuk sonuc sayfasi." />
      </div>
      <div style={{ border: '1px dashed #e2e8f0', borderRadius: 8 }}>
        <Result size="md" status="info" title="MD Boyut" subtitle="Orta sonuc sayfasi." />
      </div>
      <div style={{ border: '1px dashed #e2e8f0', borderRadius: 8 }}>
        <Result size="lg" status="error" title="LG Boyut" subtitle="Buyuk sonuc sayfasi." />
      </div>
    </div>
  ),
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Result status="success" title="Basarili" subtitle="Islem tamamlandi." />
      <Result status="error" title="Hata" subtitle="Bir sorun olustu." />
      <Result status="warning" title="Uyari" subtitle="Dikkat edilmesi gereken bir durum." />
      <Result status="info" title="Bilgi" subtitle="Bilgilendirme mesaji." />
      <Result status="404" title="404" subtitle="Sayfa bulunamadi." />
    </div>
  ),
};
