/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MasterDetailLayout } from './MasterDetailLayout';

const meta: Meta<typeof MasterDetailLayout> = {
  title: 'Layout/MasterDetailLayout',
  component: MasterDetailLayout,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    masterPosition: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    masterSize: { control: { type: 'range', min: 100, max: 600, step: 50 } },
    collapsible: { control: 'boolean' },
    collapsed: { control: 'boolean' },
    detailVisibility: {
      control: 'select',
      options: ['always', 'onSelect', 'responsive'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MasterDetailLayout>;

const listItems = Array.from({ length: 8 }, (_, i) => ({
  id: `item-${i + 1}`,
  title: `Item ${i + 1}`,
  desc: `Bu ${i + 1}. öğenin açıklaması`,
}));

const MasterPanel = ({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) => (
  <div style={{ padding: 8 }}>
    <div style={{ padding: '8px 12px', fontWeight: 600, fontSize: 14, borderBottom: '1px solid #e2e8f0', marginBottom: 4 }}>
      Öğeler
    </div>
    {listItems.map((item) => (
      <div
        key={item.id}
        onClick={() => onSelect(item.id)}
        style={{
          padding: '10px 12px',
          cursor: 'pointer',
          borderRadius: 6,
          marginBottom: 2,
          background: selectedId === item.id ? '#eff6ff' : 'transparent',
          borderLeft: selectedId === item.id ? '3px solid #3b82f6' : '3px solid transparent',
          fontSize: 13,
        }}
      >
        <div style={{ fontWeight: 500 }}>{item.title}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{item.desc}</div>
      </div>
    ))}
  </div>
);

const DetailPanel = ({ selectedId }: { selectedId: string | null }) => (
  <div style={{ padding: 24 }}>
    {selectedId ? (
      <>
        <h2 style={{ margin: 0, fontSize: 20 }}>
          {listItems.find((i) => i.id === selectedId)?.title}
        </h2>
        <p style={{ color: '#64748b', marginTop: 8 }}>
          {listItems.find((i) => i.id === selectedId)?.desc}
        </p>
        <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
          Detay içeriği burada gösterilir...
        </div>
      </>
    ) : (
      <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: 64 }}>
        Listeden bir öğe seçin
      </div>
    )}
  </div>
);

const InteractiveTemplate = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <MasterDetailLayout
      masterSize={280}
      selectedId={selectedId}
      style={{ height: '100vh', background: '#fff' }}
      styles={{
        master: { borderRight: '1px solid #e2e8f0', background: '#fafafa' },
      }}
      master={<MasterPanel selectedId={selectedId} onSelect={setSelectedId} />}
      detail={<DetailPanel selectedId={selectedId} />}
    />
  );
};

export const Default: Story = {
  render: () => <InteractiveTemplate />,
};

export const RightPosition: Story = {
  render: () => {
    const Comp = () => {
      const [selectedId, setSelectedId] = useState<string | null>('item-1');
      return (
        <MasterDetailLayout
          masterPosition="right"
          masterSize={300}
          selectedId={selectedId}
          style={{ height: 500, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}
          styles={{
            master: { borderLeft: '1px solid #e2e8f0', background: '#fafafa' },
          }}
          master={<MasterPanel selectedId={selectedId} onSelect={setSelectedId} />}
          detail={<DetailPanel selectedId={selectedId} />}
        />
      );
    };
    return <Comp />;
  },
};

export const TopPosition: Story = {
  render: () => {
    const Comp = () => {
      const [selectedId, setSelectedId] = useState<string | null>('item-1');
      return (
        <MasterDetailLayout
          masterPosition="top"
          masterSize={200}
          selectedId={selectedId}
          style={{ height: 600, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}
          styles={{
            master: { borderBottom: '1px solid #e2e8f0', background: '#fafafa', overflowY: 'auto' },
          }}
          master={
            <div style={{ display: 'flex', gap: 8, padding: 8, flexWrap: 'wrap' }}>
              {listItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: selectedId === item.id ? '#3b82f6' : '#f1f5f9',
                    color: selectedId === item.id ? '#fff' : '#334155',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {item.title}
                </div>
              ))}
            </div>
          }
          detail={<DetailPanel selectedId={selectedId} />}
        />
      );
    };
    return <Comp />;
  },
};

export const Collapsible: Story = {
  render: () => {
    const Comp = () => {
      const [selectedId, setSelectedId] = useState<string | null>('item-1');
      const [collapsed, setCollapsed] = useState(false);
      return (
        <MasterDetailLayout
          masterSize={280}
          collapsible
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
          selectedId={selectedId}
          style={{ height: 500, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}
          styles={{
            master: { borderRight: '1px solid #e2e8f0', background: '#fafafa' },
            collapseButton: {
              width: 24,
              background: '#f1f5f9',
              border: 'none',
              borderLeft: '1px solid #e2e8f0',
              borderRight: '1px solid #e2e8f0',
              cursor: 'pointer',
              flexShrink: 0,
            },
          }}
          master={<MasterPanel selectedId={selectedId} onSelect={setSelectedId} />}
          detail={<DetailPanel selectedId={selectedId} />}
        />
      );
    };
    return <Comp />;
  },
};

export const OnSelectVisibility: Story = {
  render: () => {
    const Comp = () => {
      const [selectedId, setSelectedId] = useState<string | null>(null);
      return (
        <MasterDetailLayout
          masterSize={280}
          detailVisibility="onSelect"
          selectedId={selectedId}
          style={{ height: 500, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}
          styles={{
            master: { borderRight: '1px solid #e2e8f0', background: '#fafafa' },
          }}
          master={<MasterPanel selectedId={selectedId} onSelect={setSelectedId} />}
          detail={<DetailPanel selectedId={selectedId} />}
        />
      );
    };
    return <Comp />;
  },
};

export const CustomSlotStyles: Story = {
  render: () => (
    <MasterDetailLayout
      masterSize={250}
      classNames={{ root: 'custom-layout' }}
      styles={{
        root: { border: '2px dashed #6366f1', borderRadius: 12, height: 400 },
        master: { background: '#eef2ff', padding: 16 },
        detail: { background: '#faf5ff', padding: 16 },
      }}
      master={<div>Master panel</div>}
      detail={<div>Detail panel</div>}
    />
  ),
};
