/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Popover } from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

// ── Default ─────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div style={{ padding: 100 }}>
      <Popover
        trigger={
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: '#fff',
              cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
              fontSize: 14,
            }}
          >
            Tikla
          </button>
        }
        placement="bottom"
        showArrow
      >
        <div style={{ padding: 4, minWidth: 180 }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Bilgi</p>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Bu bir popover bilesen ornegi.
          </p>
        </div>
      </Popover>
    </div>
  ),
};

// ── AllPlacements ───────────────────────────────────

export const AllPlacements: Story = {
  render: () => {
    const placements = ['top', 'bottom', 'left', 'right'] as const;
    return (
      <div
        style={{
          display: 'flex',
          gap: 40,
          flexWrap: 'wrap',
          padding: 120,
          justifyContent: 'center',
        }}
      >
        {placements.map((p) => (
          <Popover
            key={p}
            trigger={
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #d1d5db',
                  background: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 14,
                }}
              >
                {p}
              </button>
            }
            placement={p}
            showArrow
          >
            <div style={{ padding: 4, minWidth: 120 }}>
              <p style={{ margin: 0 }}>Placement: <strong>{p}</strong></p>
            </div>
          </Popover>
        ))}
      </div>
    );
  },
};

// ── Controlled ──────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 100, textAlign: 'center' }}>
        <p style={{ marginBottom: 16, fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
          Durum: <strong>{open ? 'Acik' : 'Kapali'}</strong>
        </p>
        <Popover
          trigger={
            <button
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                background: '#fff',
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif',
                fontSize: 14,
              }}
            >
              Toggle
            </button>
          }
          open={open}
          onOpenChange={setOpen}
          placement="bottom"
          showArrow
        >
          <div style={{ padding: 4, minWidth: 180 }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Controlled Popover</p>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Bu popover disaridan kontrol ediliyor.
            </p>
            <button
              style={{
                marginTop: 8,
                padding: '4px 12px',
                borderRadius: 4,
                border: '1px solid #d1d5db',
                background: '#f3f4f6',
                cursor: 'pointer',
                fontSize: 12,
              }}
              onClick={() => setOpen(false)}
            >
              Kapat
            </button>
          </div>
        </Popover>
      </div>
    );
  },
};

// ── CustomSlotStyles ────────────────────────────────

export const CustomSlotStyles: Story = {
  render: () => (
    <div style={{ padding: 100 }}>
      <Popover
        trigger={
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #6366f1',
              background: '#6366f1',
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
              fontSize: 14,
            }}
          >
            Styled
          </button>
        }
        placement="bottom"
        showArrow
        classNames={{ content: 'dark-popover' }}
        styles={{
          content: {
            backgroundColor: '#1f2937',
            color: '#f9fafb',
            borderColor: '#374151',
            borderRadius: 12,
            padding: 16,
          },
          arrow: {
            backgroundColor: '#1f2937',
            borderColor: '#374151',
          },
        }}
      >
        <div style={{ minWidth: 180 }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Dark Theme</p>
          <p style={{ margin: 0, opacity: 0.7 }}>
            classNames + styles ile stil ozellestirmesi.
          </p>
        </div>
      </Popover>
    </div>
  ),
};

// ── Compound ────────────────────────────────────────

export const Compound: Story = {
  render: () => (
    <div style={{ padding: 100 }}>
      <Popover placement="bottom">
        <Popover.Trigger>
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #8b5cf6',
              background: '#8b5cf6',
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
              fontSize: 14,
            }}
          >
            Compound Popover
          </button>
        </Popover.Trigger>
        <Popover.Content>
          <div style={{ padding: 4, minWidth: 180 }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Compound API</p>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Trigger ve Content ayri sub-component olarak verilir.
            </p>
          </div>
        </Popover.Content>
        <Popover.Arrow />
      </Popover>
    </div>
  ),
};

// ── Playground ──────────────────────────────────────

export const Playground: Story = {
  render: () => {
    const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
    const [showArrow, setShowArrow] = useState(true);

    return (
      <div style={{ padding: 120, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            Placement:
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value as 'top' | 'bottom' | 'left' | 'right')}
              style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #d1d5db' }}
            >
              <option value="top">top</option>
              <option value="bottom">bottom</option>
              <option value="left">left</option>
              <option value="right">right</option>
            </select>
          </label>
          <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="checkbox"
              checked={showArrow}
              onChange={(e) => setShowArrow(e.target.checked)}
            />
            Ok goster
          </label>
        </div>
        <Popover
          trigger={
            <button
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: '1px solid #3b82f6',
                background: '#3b82f6',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Popover Ac
            </button>
          }
          placement={placement}
          showArrow={showArrow}
        >
          <div style={{ padding: 4, minWidth: 200 }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Playground</p>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>
              Placement: <strong>{placement}</strong>, Ok: <strong>{showArrow ? 'Evet' : 'Hayir'}</strong>
            </p>
          </div>
        </Popover>
      </div>
    );
  },
};
