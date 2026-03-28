/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 6,
  border: '1px solid var(--rel-color-border, #d1d5db)',
  background: 'var(--rel-color-bg, #fff)',
  cursor: 'pointer',
  fontFamily: 'system-ui, sans-serif',
  fontSize: 14,
};

// ── Default ─────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <Tooltip label="Bu bir tooltip ipucu">
        <button style={buttonStyle}>Uzerine gel</button>
      </Tooltip>
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
          padding: 100,
          justifyContent: 'center',
        }}
      >
        {placements.map((p) => (
          <Tooltip key={p} label={`Placement: ${p}`} placement={p}>
            <button style={buttonStyle}>{p}</button>
          </Tooltip>
        ))}
      </div>
    );
  },
};

// ── WithDelay ───────────────────────────────────────

export const WithDelay: Story = {
  render: () => (
    <div style={{ padding: 80, display: 'flex', gap: 24 }}>
      <Tooltip label="Hemen acilir" delay={0}>
        <button style={buttonStyle}>delay=0</button>
      </Tooltip>
      <Tooltip label="300ms gecikme (varsayilan)" delay={300}>
        <button style={buttonStyle}>delay=300</button>
      </Tooltip>
      <Tooltip label="1 saniye gecikme" delay={1000}>
        <button style={buttonStyle}>delay=1000</button>
      </Tooltip>
    </div>
  ),
};

// ── CustomSlotStyles ────────────────────────────────

export const CustomSlotStyles: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <Tooltip
        label="Ozel stil tooltip"
        styles={{
          content: {
            backgroundColor: 'var(--rel-color-info, #6366f1)',
            color: 'var(--rel-color-text-inverse, #fff)',
            borderRadius: 12,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 500,
          },
          arrow: {
            backgroundColor: 'var(--rel-color-info, #6366f1)',
          },
        }}
      >
        <button
          style={{
            ...buttonStyle,
            border: '1px solid var(--rel-color-info, #6366f1)',
            color: 'var(--rel-color-info, #6366f1)',
          }}
        >
          Styled Tooltip
        </button>
      </Tooltip>
    </div>
  ),
};

// ── Compound ────────────────────────────────────────

export const Compound: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <Tooltip delay={0}>
        <Tooltip.Trigger>
          <button
            style={{
              ...buttonStyle,
              border: '1px solid var(--rel-color-accent, #8b5cf6)',
              color: 'var(--rel-color-accent, #8b5cf6)',
            }}
          >
            Compound Tooltip
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          Compound API ile verilen tooltip icerigi
        </Tooltip.Content>
      </Tooltip>
    </div>
  ),
};

// ── Playground ──────────────────────────────────────

export const Playground: Story = {
  render: () => {
    const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
    const [delay, setDelay] = useState(300);

    return (
      <div style={{ padding: 100, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            Placement:
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value as 'top' | 'bottom' | 'left' | 'right')}
              style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--rel-color-border, #d1d5db)' }}
            >
              <option value="top">top</option>
              <option value="bottom">bottom</option>
              <option value="left">left</option>
              <option value="right">right</option>
            </select>
          </label>
          <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            Delay: {delay}ms
            <input
              type="range"
              min={0}
              max={2000}
              step={100}
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              style={{ width: 120 }}
            />
          </label>
        </div>
        <Tooltip
          label={`Placement: ${placement}, Delay: ${delay}ms`}
          placement={placement}
          delay={delay}
        >
          <button style={{ ...buttonStyle, padding: '12px 24px', fontWeight: 600 }}>
            Uzerine Gel
          </button>
        </Tooltip>
      </div>
    );
  },
};
