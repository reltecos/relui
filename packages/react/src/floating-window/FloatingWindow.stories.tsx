/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FloatingWindow } from './FloatingWindow';

const meta: Meta<typeof FloatingWindow> = {
  title: 'Window Manager/FloatingWindow',
  component: FloatingWindow,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof FloatingWindow>;

export const Default: Story = {
  render: () => (
    <div style={{ position: 'relative', width: '100%', height: 600, background: '#f1f5f9' }}>
      <FloatingWindow
        title="Floating Window"
        defaultPosition={{ x: 100, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
      >
        <div style={{ padding: 16 }}>
          <p>Bu bir taşınabilir pencere.</p>
          <p style={{ color: '#64748b', fontSize: 13 }}>
            Title bar'dan sürükleyerek taşıyabilirsin.
          </p>
        </div>
      </FloatingWindow>
    </div>
  ),
};

export const MultipleWindows: Story = {
  render: () => (
    <div style={{ position: 'relative', width: '100%', height: 600, background: '#f1f5f9' }}>
      <FloatingWindow
        title="Window 1"
        defaultPosition={{ x: 50, y: 30 }}
        defaultSize={{ width: 350, height: 250 }}
        zIndex={1001}
      >
        <div style={{ padding: 16 }}>İlk pencere</div>
      </FloatingWindow>
      <FloatingWindow
        title="Window 2"
        defaultPosition={{ x: 250, y: 100 }}
        defaultSize={{ width: 350, height: 250 }}
        zIndex={1002}
      >
        <div style={{ padding: 16 }}>İkinci pencere</div>
      </FloatingWindow>
      <FloatingWindow
        title="Window 3"
        defaultPosition={{ x: 450, y: 170 }}
        defaultSize={{ width: 350, height: 250 }}
        zIndex={1003}
      >
        <div style={{ padding: 16 }}>Üçüncü pencere</div>
      </FloatingWindow>
    </div>
  ),
};

export const WithMinMax: Story = {
  render: () => (
    <div style={{ position: 'relative', width: '100%', height: 600, background: '#f1f5f9' }}>
      <FloatingWindow
        title="Min/Max Kısıtlı"
        defaultPosition={{ x: 100, y: 50 }}
        defaultSize={{ width: 400, height: 300 }}
        minSize={{ width: 300, height: 200 }}
        maxSize={{ width: 700, height: 500 }}
      >
        <div style={{ padding: 16 }}>
          <p>Min: 300×200, Max: 700×500</p>
        </div>
      </FloatingWindow>
    </div>
  ),
};

export const Closable: Story = {
  render: () => {
    const Comp = () => {
      const [open, setOpen] = useState(true);
      return (
        <div style={{ position: 'relative', width: '100%', height: 600, background: '#f1f5f9' }}>
          {open ? (
            <FloatingWindow
              title="Kapatılabilir Pencere"
              defaultPosition={{ x: 100, y: 50 }}
              onClose={() => setOpen(false)}
            >
              <div style={{ padding: 16 }}>
                <p>Close butonuna tıklayarak kapat.</p>
              </div>
            </FloatingWindow>
          ) : (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <button onClick={() => setOpen(true)} style={{ padding: '8px 16px' }}>
                Pencereyi Aç
              </button>
            </div>
          )}
        </div>
      );
    };
    return <Comp />;
  },
};

export const NoControls: Story = {
  render: () => (
    <div style={{ position: 'relative', width: '100%', height: 600, background: '#f1f5f9' }}>
      <FloatingWindow
        title="Sadece Sürükle"
        defaultPosition={{ x: 100, y: 50 }}
        showMinimize={false}
        showMaximize={false}
        showClose={false}
      >
        <div style={{ padding: 16 }}>
          <p>Pencere kontrolleri gizlenmiş.</p>
        </div>
      </FloatingWindow>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <div style={{ position: 'relative', width: '100%', height: 600, background: '#f1f5f9' }}>
      <FloatingWindow
        title="Custom Styled"
        defaultPosition={{ x: 100, y: 50 }}
        classNames={{ root: 'custom-window' }}
        styles={{
          root: { borderRadius: 16 },
          titleBar: { background: '#4f46e5', color: '#fff' },
          title: { color: '#fff' },
          content: { padding: 24, background: '#eef2ff' },
        }}
      >
        <p>Custom slot styled window</p>
      </FloatingWindow>
    </div>
  ),
};

export const Compound: Story = {
  render: () => (
    <div style={{ position: 'relative', width: '100%', height: 600, background: '#f1f5f9' }}>
      <FloatingWindow defaultPosition={{ x: 100, y: 50 }} defaultSize={{ width: 400, height: 300 }}>
        <FloatingWindow.Header title="Compound Window" />
        <FloatingWindow.Body>
          <div style={{ padding: 16 }}>
            <p>Bu pencere Compound API ile olusturuldu.</p>
            <p style={{ color: '#64748b', fontSize: 13 }}>
              Header ve Body ayri sub-component olarak kullanildi.
            </p>
          </div>
        </FloatingWindow.Body>
      </FloatingWindow>
    </div>
  ),
};
