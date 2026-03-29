/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from './Carousel';

const meta: Meta<typeof Carousel> = {
  title: 'Data Display/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    autoplay: { control: 'boolean' },
    loop: { control: 'boolean' },
    showNavigation: { control: 'boolean' },
    showIndicators: { control: 'boolean' },
    autoplayInterval: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const slideStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 200,
  fontSize: 24,
  fontWeight: 600,
  borderRadius: 8,
};

const DEMO_SLIDES = [
  <div key="1" style={{ ...slideStyle, backgroundColor: 'var(--rel-color-primary-light, #dbeafe)' }}>Slayt 1</div>,
  <div key="2" style={{ ...slideStyle, backgroundColor: 'var(--rel-color-success-light, #dcfce7)' }}>Slayt 2</div>,
  <div key="3" style={{ ...slideStyle, backgroundColor: 'var(--rel-color-warning-light, #fef3c7)' }}>Slayt 3</div>,
  <div key="4" style={{ ...slideStyle, backgroundColor: 'var(--rel-color-error-light, #fee2e2)' }}>Slayt 4</div>,
];

// ── Default ──

export const Default: Story = {
  args: {
    slides: DEMO_SLIDES,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

// ── AutoPlay ──

export const AutoPlay: Story = {
  args: {
    slides: DEMO_SLIDES,
    autoplay: true,
    autoplayInterval: 2000,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Loop ──

export const Loop: Story = {
  args: {
    slides: DEMO_SLIDES,
    loop: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

// ── WithoutNavigation ──

export const WithoutNavigation: Story = {
  args: {
    slides: DEMO_SLIDES,
    showNavigation: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Carousel loop>
        <Carousel.Viewport>
          <Carousel.Slide>
            <div style={{ ...slideStyle, backgroundColor: 'var(--rel-color-primary-light, #dbeafe)' }}>
              Compound A
            </div>
          </Carousel.Slide>
          <Carousel.Slide>
            <div style={{ ...slideStyle, backgroundColor: 'var(--rel-color-success-light, #dcfce7)' }}>
              Compound B
            </div>
          </Carousel.Slide>
          <Carousel.Slide>
            <div style={{ ...slideStyle, backgroundColor: 'var(--rel-color-warning-light, #fef3c7)' }}>
              Compound C
            </div>
          </Carousel.Slide>
        </Carousel.Viewport>
        <Carousel.PrevButton />
        <Carousel.NextButton />
        <Carousel.Indicators />
      </Carousel>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    slides: DEMO_SLIDES,
    styles: {
      root: { borderRadius: 16, overflow: 'hidden' },
      indicators: { padding: '16px 0' },
      indicator: { borderRadius: 4, width: 24, height: 4 },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};
