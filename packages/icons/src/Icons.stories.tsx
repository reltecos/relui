/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import {
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  MinusIcon,
  CloseIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  createIcon,
} from './index';
import type { IconProps } from './types';

// ── Tüm ikonlar / All icons ─────────────────────────────────────────

const allIcons = [
  { name: 'EyeIcon', Component: EyeIcon },
  { name: 'EyeOffIcon', Component: EyeOffIcon },
  { name: 'CheckIcon', Component: CheckIcon },
  { name: 'MinusIcon', Component: MinusIcon },
  { name: 'CloseIcon', Component: CloseIcon },
  { name: 'ChevronUpIcon', Component: ChevronUpIcon },
  { name: 'ChevronDownIcon', Component: ChevronDownIcon },
  { name: 'ChevronLeftIcon', Component: ChevronLeftIcon },
  { name: 'ChevronRightIcon', Component: ChevronRightIcon },
  { name: 'SearchIcon', Component: SearchIcon },
] as const;

// ── Yardımcı stil / Helper styles ───────────────────────────────────

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: '2rem',
  padding: '1rem',
};

const cellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  background: '#fff',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  color: '#64748b',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.5rem',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: '2rem',
};

const headingStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#334155',
  marginBottom: '0.75rem',
  borderBottom: '1px solid #e2e8f0',
  paddingBottom: '0.5rem',
};

// ── Playground bileşeni / Playground component ──────────────────────

function IconPlayground(props: IconProps) {
  return <EyeIcon {...props} />;
}

// ── Meta ─────────────────────────────────────────────────────────────

const meta = {
  title: 'Icons/Gallery',
  component: IconPlayground,
  argTypes: {
    size: {
      control: { type: 'text' },
      description: 'İkon boyutu / Icon size (number | string)',
    },
    color: {
      control: 'color',
      description: 'İkon rengi / Icon color',
    },
    strokeWidth: {
      control: { type: 'range', min: 0.5, max: 4, step: 0.25 },
      description: 'Çizgi kalınlığı / Stroke width',
    },
  },
  args: {
    size: '1em',
    color: 'currentColor',
    strokeWidth: 2,
  },
} satisfies Meta<typeof IconPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ──────────────────────────────────────────────────────────

/** Tüm ikonlar / All icons grid */
export const AllIcons: Story = {
  name: 'Tüm İkonlar / All Icons',
  render: (args) => (
    <div style={gridStyle}>
      {allIcons.map(({ name, Component }) => (
        <div key={name} style={cellStyle}>
          <Component size={24} color={args.color} strokeWidth={args.strokeWidth} />
          <span style={labelStyle}>{name}</span>
        </div>
      ))}
    </div>
  ),
};

/** Boyutlar / Sizes */
export const Sizes: Story = {
  name: 'Boyutlar / Sizes',
  render: () => {
    const sizes = [16, 20, 24, 32, 40, 48] as const;
    return (
      <div style={sectionStyle}>
        <div style={headingStyle}>Sayısal boyutlar / Numeric sizes (px)</div>
        <div style={rowStyle}>
          {sizes.map((s) => (
            <div key={s} style={{ ...cellStyle, minWidth: 80 }}>
              <SearchIcon size={s} />
              <span style={labelStyle}>{s}px</span>
            </div>
          ))}
        </div>
        <div style={{ ...headingStyle, marginTop: '1.5rem' }}>
          String boyutlar / String sizes
        </div>
        <div style={rowStyle}>
          {['1em', '1.5em', '2rem', '3rem'].map((s) => (
            <div key={s} style={{ ...cellStyle, minWidth: 80 }}>
              <SearchIcon size={s} />
              <span style={labelStyle}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/** Renkler / Colors */
export const Colors: Story = {
  name: 'Renkler / Colors',
  render: () => {
    const colors = [
      { label: 'currentColor', value: 'currentColor' },
      { label: 'red', value: '#ef4444' },
      { label: 'blue', value: '#3b82f6' },
      { label: 'green', value: '#22c55e' },
      { label: 'purple', value: '#a855f7' },
      { label: 'orange', value: '#f97316' },
    ];
    return (
      <div style={rowStyle}>
        {colors.map(({ label, value }) => (
          <div key={label} style={{ ...cellStyle, minWidth: 80 }}>
            <EyeIcon size={32} color={value} />
            <span style={labelStyle}>{label}</span>
          </div>
        ))}
      </div>
    );
  },
};

/** Çizgi kalınlıkları / Stroke widths */
export const StrokeWidths: Story = {
  name: 'Çizgi Kalınlıkları / Stroke Widths',
  render: () => {
    const widths = [1, 1.5, 2, 2.5, 3] as const;
    return (
      <div style={rowStyle}>
        {widths.map((sw) => (
          <div key={sw} style={{ ...cellStyle, minWidth: 80 }}>
            <CheckIcon size={32} strokeWidth={sw} />
            <span style={labelStyle}>strokeWidth: {sw}</span>
          </div>
        ))}
      </div>
    );
  },
};

/** Erişilebilirlik / Accessibility */
export const Accessibility: Story = {
  name: 'Erişilebilirlik / Accessibility',
  render: () => (
    <div style={sectionStyle}>
      <div style={headingStyle}>aria-label ile anlamlı ikon / Meaningful icon with aria-label</div>
      <div style={rowStyle}>
        <SearchIcon size={24} aria-label="Ara" />
        <code style={labelStyle}>{'<SearchIcon aria-label="Ara" />'}</code>
        <span style={{ ...labelStyle, color: '#22c55e' }}>→ role=&quot;img&quot;</span>
      </div>
      <div style={{ ...headingStyle, marginTop: '1.5rem' }}>
        aria-label olmadan dekoratif ikon / Decorative icon without aria-label
      </div>
      <div style={rowStyle}>
        <SearchIcon size={24} />
        <code style={labelStyle}>{'<SearchIcon />'}</code>
        <span style={{ ...labelStyle, color: '#64748b' }}>→ aria-hidden=&quot;true&quot;</span>
      </div>
    </div>
  ),
};

/** createIcon ile özel ikon / Custom icon with createIcon */
export const CustomIcon: Story = {
  name: 'createIcon / Custom Icon',
  render: () => {
    const HeartIcon = createIcon({
      displayName: 'HeartIcon',
      path: (
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      ),
    });

    const StarIcon = createIcon({
      displayName: 'StarIcon',
      type: 'fill',
      path: (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      ),
    });

    return (
      <div style={sectionStyle}>
        <div style={headingStyle}>createIcon factory ile özel ikonlar / Custom icons</div>
        <div style={rowStyle}>
          <div style={{ ...cellStyle, minWidth: 100 }}>
            <HeartIcon size={32} color="#ef4444" />
            <span style={labelStyle}>HeartIcon (stroke)</span>
          </div>
          <div style={{ ...cellStyle, minWidth: 100 }}>
            <StarIcon size={32} color="#f59e0b" />
            <span style={labelStyle}>StarIcon (fill)</span>
          </div>
        </div>
      </div>
    );
  },
};

/** Playground — interaktif kontroller / Interactive controls */
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={gridStyle}>
      {allIcons.map(({ name, Component }) => (
        <div key={name} style={cellStyle}>
          <Component {...args} />
          <span style={labelStyle}>{name}</span>
        </div>
      ))}
    </div>
  ),
};
