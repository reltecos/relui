/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from './Tabs';
import type { TabItem } from '@relteco/relui-core';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['line', 'enclosed', 'outline', 'pills'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    activationMode: {
      control: 'select',
      options: ['automatic', 'manual'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// ── Ortak tab tanımları ──────────────────────────────────────────

const basicItems: TabItem[] = [
  { value: 'overview', label: 'Genel Bakış' },
  { value: 'features', label: 'Özellikler' },
  { value: 'pricing', label: 'Fiyatlandırma' },
  { value: 'faq', label: 'SSS' },
];

const basicPanels = [
  {
    value: 'overview',
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px' }}>Genel Bakış</h3>
        <p style={{ margin: 0, color: 'var(--rel-color-text-muted, #666)' }}>
          RelUI, dünyanın en güçlü web UI toolkit&apos;idir. Qt/WPF/GTK seviyesinde bileşen derinliği sunar.
        </p>
      </div>
    ),
  },
  {
    value: 'features',
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px' }}>Özellikler</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--rel-color-text-muted, #666)' }}>
          <li>200+ bileşen</li>
          <li>Framework-agnostic core</li>
          <li>Headless + styled iki katman</li>
          <li>WAI-ARIA erişilebilirlik</li>
        </ul>
      </div>
    ),
  },
  {
    value: 'pricing',
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px' }}>Fiyatlandırma</h3>
        <p style={{ margin: 0, color: 'var(--rel-color-text-muted, #666)' }}>
          Core + Tokens: MIT (ücretsiz). Framework paketleri: BSL lisansı.
        </p>
      </div>
    ),
  },
  {
    value: 'faq',
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px' }}>Sıkça Sorulan Sorular</h3>
        <p style={{ margin: 0, color: 'var(--rel-color-text-muted, #666)' }}>
          <strong>Hangi framework&apos;leri destekliyor?</strong> React, Vue, Svelte, Angular, Solid.
        </p>
      </div>
    ),
  },
];

// ── Default ──────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    items: basicItems,
    defaultValue: 'overview',
    panels: basicPanels,
    variant: 'line',
    size: 'md',
  },
};

// ── All Variants ──────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {(['line', 'enclosed', 'outline', 'pills'] as const).map((variant) => (
        <div key={variant}>
          <h4 style={{ margin: '0 0 8px', fontFamily: 'sans-serif', textTransform: 'capitalize' }}>
            {variant}
          </h4>
          <Tabs
            items={basicItems}
            defaultValue="overview"
            panels={basicPanels}
            variant={variant}
          />
        </div>
      ))}
    </div>
  ),
};

// ── All Sizes ────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size}>
          <h4 style={{ margin: '0 0 8px', fontFamily: 'sans-serif' }}>{size}</h4>
          <Tabs
            items={basicItems}
            defaultValue="overview"
            variant="line"
            size={size}
          />
        </div>
      ))}
    </div>
  ),
};

// ── Vertical ────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {(['line', 'enclosed', 'outline', 'pills'] as const).map((variant) => (
        <div key={variant}>
          <h4 style={{ margin: '0 0 8px', fontFamily: 'sans-serif', textTransform: 'capitalize' }}>
            {variant} (vertical)
          </h4>
          <Tabs
            items={basicItems}
            defaultValue="overview"
            panels={basicPanels}
            variant={variant}
            orientation="vertical"
          />
        </div>
      ))}
    </div>
  ),
};

// ── Closable Tabs ────────────────────────────────────────────────

function ClosableTabsDemo() {
  const [items, setItems] = useState<TabItem[]>([
    { value: 'index-ts', label: 'index.ts', closable: true },
    { value: 'app-tsx', label: 'App.tsx', closable: true },
    { value: 'styles-css', label: 'styles.css', closable: true },
    { value: 'readme', label: 'README.md', closable: true },
    { value: 'config', label: 'config.json' },
  ]);
  const [value, setValue] = useState('index-ts');

  const handleClose = (closedValue: string) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.value !== closedValue);
      if (value === closedValue && filtered.length > 0) {
        const idx = prev.findIndex((item) => item.value === closedValue);
        const newIdx = idx >= filtered.length ? filtered.length - 1 : idx;
        const newItem = filtered[newIdx];
        if (newItem) {
          setValue(newItem.value);
        }
      }
      return filtered;
    });
  };

  return (
    <div>
      <p style={{ margin: '0 0 12px', fontFamily: 'sans-serif', color: 'var(--rel-color-text-muted, #666)', fontSize: '14px' }}>
        Tab&apos;ların yanındaki × ile kapatılabilir. &quot;config.json&quot; kapatılamaz.
      </p>
      <Tabs
        items={items}
        value={value}
        onValueChange={setValue}
        onClose={handleClose}
        variant="enclosed"
        renderPanel={(v) => (
          <div style={{ fontFamily: 'monospace', color: 'var(--rel-color-text-muted, #666)' }}>
            Dosya içeriği: {v}
          </div>
        )}
      />
    </div>
  );
}

export const ClosableTabs: Story = {
  render: () => <ClosableTabsDemo />,
};

// ── Manual Activation ────────────────────────────────────────────

export const ManualActivation: Story = {
  render: () => (
    <div>
      <p style={{ margin: '0 0 12px', fontFamily: 'sans-serif', color: 'var(--rel-color-text-muted, #666)', fontSize: '14px' }}>
        Manual mod: Arrow tuşları sadece focus verir, Enter/Space ile seçilir.
      </p>
      <Tabs
        items={basicItems}
        defaultValue="overview"
        panels={basicPanels}
        activationMode="manual"
        variant="outline"
      />
    </div>
  ),
};

// ── Disabled ────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px', fontFamily: 'sans-serif' }}>Tamamen disabled</h4>
        <Tabs items={basicItems} defaultValue="overview" panels={basicPanels} disabled />
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', fontFamily: 'sans-serif' }}>Tek tab disabled</h4>
        <Tabs
          items={[
            { value: 'a', label: 'Aktif Tab' },
            { value: 'b', label: 'Disabled Tab', disabled: true },
            { value: 'c', label: 'Aktif Tab 2' },
          ]}
          defaultValue="a"
          panels={[
            { value: 'a', children: <div>A içeriği</div> },
            { value: 'b', children: <div>B içeriği</div> },
            { value: 'c', children: <div>C içeriği</div> },
          ]}
        />
      </div>
    </div>
  ),
};

// ── Grow ──────────────────────────────────────────────────────

export const Grow: Story = {
  render: () => (
    <div>
      <p style={{ margin: '0 0 12px', fontFamily: 'sans-serif', color: 'var(--rel-color-text-muted, #666)', fontSize: '14px' }}>
        grow prop ile tab&apos;lar eşit genişlikte büyür.
      </p>
      <Tabs
        items={basicItems}
        defaultValue="overview"
        panels={basicPanels}
        grow
        variant="pills"
      />
    </div>
  ),
};

// ── Custom Slot Styles ──────────────────────────────────────────

export const CustomSlotStyles: Story = {
  render: () => (
    <Tabs
      items={basicItems}
      defaultValue="overview"
      panels={basicPanels}
      classNames={{
        list: 'custom-tabs-list',
      }}
      styles={{
        root: { fontFamily: 'monospace' },
        tab: { letterSpacing: '0.5px' },
        panel: { padding: '24px', fontSize: '14px' },
      }}
    />
  ),
};

// ── Compound API ──────────────────────────────────────────────────

export const Compound: Story = {
  render: () => (
    <Tabs items={basicItems} defaultValue="overview">
      <Tabs.List aria-label="Bilgi Sekmeleri">
        <Tabs.Tab value="overview">Genel Bakis</Tabs.Tab>
        <Tabs.Tab value="features">Ozellikler</Tabs.Tab>
        <Tabs.Tab value="pricing">Fiyatlandirma</Tabs.Tab>
        <Tabs.Tab value="faq">SSS</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <p>RelUI, dunyanin en guclu web UI toolkit&apos;idir.</p>
      </Tabs.Panel>
      <Tabs.Panel value="features">
        <ul>
          <li>200+ bilesen</li>
          <li>Framework-agnostic core</li>
        </ul>
      </Tabs.Panel>
      <Tabs.Panel value="pricing">
        <p>Core + Tokens: MIT (ucretsiz).</p>
      </Tabs.Panel>
      <Tabs.Panel value="faq">
        <p>Sikca Sorulan Sorular</p>
      </Tabs.Panel>
    </Tabs>
  ),
};

// ── Compound + CustomSlotStyles ──────────────────────────────────

export const CompoundCustomSlotStyles: Story = {
  render: () => (
    <Tabs
      items={basicItems}
      defaultValue="overview"
      classNames={{ list: 'custom-list' }}
      styles={{
        root: { fontFamily: 'monospace' },
        tab: { letterSpacing: '0.5px' },
        panel: { padding: '24px', fontSize: '14px' },
      }}
    >
      <Tabs.List aria-label="Bilgi Sekmeleri">
        <Tabs.Tab value="overview">Genel Bakis</Tabs.Tab>
        <Tabs.Tab value="features">Ozellikler</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Genel bakis icerigi</Tabs.Panel>
      <Tabs.Panel value="features">Ozellikler icerigi</Tabs.Panel>
    </Tabs>
  ),
};

// ── Playground ──────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    items: basicItems,
    defaultValue: 'overview',
    panels: basicPanels,
    variant: 'line',
    size: 'md',
    orientation: 'horizontal',
    activationMode: 'automatic',
    disabled: false,
    grow: false,
  },
};
