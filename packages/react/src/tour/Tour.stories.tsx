/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useRef } from 'react';
import { Tour } from './Tour';
import type { TourStep } from '@relteco/relui-core';

export default {
  title: 'Feedback/Tour',
  component: Tour,
  tags: ['autodocs'],
};

// ── Default ──

function DefaultDemo() {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps: TourStep[] = [
    {
      target: '#tour-btn-new',
      title: 'Yeni Proje',
      description: 'Bu buton ile yeni bir proje olusturabilirsiniz.',
      placement: 'bottom',
    },
    {
      target: '#tour-btn-save',
      title: 'Kaydet',
      description: 'Mevcut calismalarinizi kaydetmek icin bu butonu kullanin.',
      placement: 'bottom',
    },
    {
      target: '#tour-sidebar',
      title: 'Kenar Cubugu',
      description: 'Proje dosyalarinizi burada gorebilirsiniz.',
      placement: 'right',
    },
    {
      target: '#tour-editor',
      description: 'Kodlarinizi bu alanda duzenleyin. Baslik olmadan da adim tanimlanabilir.',
      placement: 'left',
    },
  ];

  return (
    <div ref={containerRef} data-theme style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => setActive(true)}
          style={{
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Turu Baslat
        </button>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '12px 16px',
          backgroundColor: '#f3f4f6',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <button
          id="tour-btn-new"
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
          Yeni
        </button>
        <button
          id="tour-btn-save"
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
          Kaydet
        </button>
      </div>

      {/* Layout */}
      <div style={{ display: 'flex', gap: 16, height: 300 }}>
        <div
          id="tour-sidebar"
          style={{
            width: 200,
            padding: 16,
            backgroundColor: '#f9fafb',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Dosyalar</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>index.ts</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>app.tsx</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>styles.css</div>
        </div>
        <div
          id="tour-editor"
          style={{
            flex: 1,
            padding: 16,
            backgroundColor: '#1e293b',
            borderRadius: 8,
            color: '#e2e8f0',
            fontFamily: 'monospace',
            fontSize: 13,
          }}
        >
          <div>{'const app = () => {'}</div>
          <div>{'  return <div>Merhaba Dunya</div>;'}</div>
          <div>{'};'}</div>
        </div>
      </div>

      <Tour
        steps={steps}
        active={active}
        onComplete={() => setActive(false)}
        onStop={() => setActive(false)}
        portalContainer={containerRef.current ?? undefined}
      />
    </div>
  );
}

export const Default = () => <DefaultDemo />;

// ── CustomLabels ──

function CustomLabelsDemo() {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps: TourStep[] = [
    {
      target: '#en-step1',
      title: 'Welcome',
      description: 'This is the first step of the tour.',
      placement: 'bottom',
    },
    {
      target: '#en-step2',
      title: 'Features',
      description: 'Here you can see all available features.',
      placement: 'bottom',
    },
    {
      target: '#en-step3',
      title: 'Get Started',
      description: 'Click here to get started with the application.',
      placement: 'left',
    },
  ];

  return (
    <div ref={containerRef} data-theme style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={() => setActive(true)}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          marginBottom: 24,
        }}
      >
        Start Tour
      </button>

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <div
          id="en-step1"
          style={{
            padding: 24,
            backgroundColor: '#f0f9ff',
            borderRadius: 8,
            border: '1px solid #bae6fd',
            flex: 1,
          }}
        >
          Dashboard
        </div>
        <div
          id="en-step2"
          style={{
            padding: 24,
            backgroundColor: '#f0fdf4',
            borderRadius: 8,
            border: '1px solid #bbf7d0',
            flex: 1,
          }}
        >
          Features
        </div>
        <div
          id="en-step3"
          style={{
            padding: 24,
            backgroundColor: '#fdf4ff',
            borderRadius: 8,
            border: '1px solid #f0abfc',
            flex: 1,
          }}
        >
          Get Started
        </div>
      </div>

      <Tour
        steps={steps}
        active={active}
        onComplete={() => setActive(false)}
        onStop={() => setActive(false)}
        skipLabel="Skip"
        nextLabel="Next"
        prevLabel="Back"
        finishLabel="Done"
        portalContainer={containerRef.current ?? undefined}
      />
    </div>
  );
}

export const CustomLabels = () => <CustomLabelsDemo />;

// ── CustomSlotStyles ──

function CustomSlotStylesDemo() {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps: TourStep[] = [
    {
      target: '#styled-card1',
      title: 'Koyu Tema',
      description: 'Tour bileseni slot API ile tamamen ozellestirilebilir.',
      placement: 'bottom',
    },
    {
      target: '#styled-card2',
      title: 'Slot Stilleri',
      description: 'classNames ve styles prop ile tum ic slot lara erisim.',
      placement: 'bottom',
    },
  ];

  return (
    <div ref={containerRef} data-theme style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={() => setActive(true)}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: '#8b5cf6',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          marginBottom: 24,
        }}
      >
        Koyu Tema Tour
      </button>

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <div
          id="styled-card1"
          style={{
            padding: 24,
            backgroundColor: '#faf5ff',
            borderRadius: 8,
            border: '1px solid #e9d5ff',
            flex: 1,
          }}
        >
          Kart 1
        </div>
        <div
          id="styled-card2"
          style={{
            padding: 24,
            backgroundColor: '#faf5ff',
            borderRadius: 8,
            border: '1px solid #e9d5ff',
            flex: 1,
          }}
        >
          Kart 2
        </div>
      </div>

      <Tour
        steps={steps}
        active={active}
        onComplete={() => setActive(false)}
        onStop={() => setActive(false)}
        portalContainer={containerRef.current ?? undefined}
        styles={{
          overlay: { backgroundColor: 'rgba(30, 0, 60, 0.7)' },
          popover: { backgroundColor: '#1e1b4b', borderRadius: '16px' },
          title: { color: '#c4b5fd' },
          description: { color: '#a5b4fc' },
          stepIndicator: { color: '#818cf8' },
          nextButton: { backgroundColor: '#7c3aed' },
          prevButton: { backgroundColor: '#312e81', color: '#c4b5fd', borderColor: '#4c1d95' },
          skipButton: { color: '#818cf8' },
        }}
      />
    </div>
  );
}

export const CustomSlotStyles = () => <CustomSlotStylesDemo />;

// ── Compound ──

function CompoundDemo() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 32 }}>
      <h3>Tour Compound API</h3>
      <Tour active={true}>
        <Tour.Step>
          <Tour.StepTitle>Merhaba</Tour.StepTitle>
          <Tour.StepContent>Bu bir compound tour adimi.</Tour.StepContent>
        </Tour.Step>
        <Tour.Navigation>
          <button type="button" style={{ padding: '6px 14px', borderRadius: 6, border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer' }}>
            Ileri
          </button>
        </Tour.Navigation>
      </Tour>
    </div>
  );
}

export const Compound = () => <CompoundDemo />;

// ── WithSkip ──

function WithSkipDemo() {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps: TourStep[] = [
    {
      target: '#skip-step1',
      title: 'Ilk Adim',
      description: 'Bu tur atlanabilir. Dilersen "Atla" butonuna tikla.',
      placement: 'bottom',
    },
    {
      target: '#skip-step2',
      title: 'Ikinci Adim',
      description: 'Bu ikinci adim. Istersen turu burada da atlayabilirsin.',
      placement: 'bottom',
    },
    {
      target: '#skip-step3',
      title: 'Son Adim',
      description: 'Tebrikler! Turu tamamladiniz veya atlayabilirsiniz.',
      placement: 'left',
    },
  ];

  return (
    <div ref={containerRef} data-theme style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={() => setActive(true)}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: '#f59e0b',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          marginBottom: 24,
        }}
      >
        Atlanabilir Tur Baslat
      </button>

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <div
          id="skip-step1"
          style={{
            padding: 24,
            backgroundColor: '#fffbeb',
            borderRadius: 8,
            border: '1px solid #fde68a',
            flex: 1,
          }}
        >
          Alan 1
        </div>
        <div
          id="skip-step2"
          style={{
            padding: 24,
            backgroundColor: '#fef3c7',
            borderRadius: 8,
            border: '1px solid #fcd34d',
            flex: 1,
          }}
        >
          Alan 2
        </div>
        <div
          id="skip-step3"
          style={{
            padding: 24,
            backgroundColor: '#fde68a',
            borderRadius: 8,
            border: '1px solid #f59e0b',
            flex: 1,
          }}
        >
          Alan 3
        </div>
      </div>

      <Tour
        steps={steps}
        active={active}
        onComplete={() => setActive(false)}
        onStop={() => setActive(false)}
        skipLabel="Turu Atla"
        nextLabel="Sonraki"
        prevLabel="Onceki"
        finishLabel="Bitir"
        portalContainer={containerRef.current ?? undefined}
      />
    </div>
  );
}

export const WithSkip = () => <WithSkipDemo />;

// ── Playground ──

function PlaygroundDemo() {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps: TourStep[] = [
    {
      target: '#pg-card1',
      title: 'Dashboard',
      description: 'Genel bakis paneline buradan erisebilirsiniz.',
      placement: 'bottom',
    },
    {
      target: '#pg-card2',
      title: 'Ayarlar',
      description: 'Uygulama ayarlarinizi buradan yonetebilirsiniz.',
      placement: 'bottom',
    },
    {
      target: '#pg-card3',
      title: 'Profil',
      description: 'Kullanici profiliniz ve tercihleriniz bu alanda.',
      placement: 'left',
    },
  ];

  return (
    <div ref={containerRef} data-theme style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={() => setActive(true)}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: '#10b981',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          marginBottom: 24,
        }}
      >
        Playground Turu Baslat
      </button>

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <div
          id="pg-card1"
          style={{
            padding: 24,
            backgroundColor: '#ecfdf5',
            borderRadius: 8,
            border: '1px solid #a7f3d0',
            flex: 1,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          Dashboard
        </div>
        <div
          id="pg-card2"
          style={{
            padding: 24,
            backgroundColor: '#f0fdf4',
            borderRadius: 8,
            border: '1px solid #bbf7d0',
            flex: 1,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          Ayarlar
        </div>
        <div
          id="pg-card3"
          style={{
            padding: 24,
            backgroundColor: '#dcfce7',
            borderRadius: 8,
            border: '1px solid #86efac',
            flex: 1,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          Profil
        </div>
      </div>

      <Tour
        steps={steps}
        active={active}
        onComplete={() => setActive(false)}
        onStop={() => setActive(false)}
        portalContainer={containerRef.current ?? undefined}
      />
    </div>
  );
}

export const Playground = () => <PlaygroundDemo />;
