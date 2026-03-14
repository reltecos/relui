/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { BackToTop } from './BackToTop';
import { ChevronUpIcon } from '@relteco/relui-icons';

const meta: Meta<typeof BackToTop> = {
  title: 'Navigation/BackToTop',
  component: BackToTop,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BackToTop>;

// ── Demo wrapper (uzun sayfa) ────────────────────────────────

function LongPage({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--rel-font-sans, system-ui)' }}>
      <div style={{
        padding: '24px',
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #eee',
        zIndex: 10,
      }}>
        Scroll down to see the BackToTop button
      </div>
      <div style={{ padding: '24px' }}>
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i} style={{ fontSize: '14px', lineHeight: 1.8, marginBottom: '16px', opacity: 0.7 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Paragraph {i + 1}.
          </p>
        ))}
      </div>
      {children}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <LongPage>
      <BackToTop />
    </LongPage>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <LongPage>
      <BackToTop variant="filled" style={{ right: '24px' }} />
      <BackToTop variant="outline" style={{ right: '80px' }} />
      <BackToTop variant="subtle" style={{ right: '136px' }} />
    </LongPage>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <LongPage>
      <BackToTop size="xs" style={{ right: '24px' }} />
      <BackToTop size="sm" style={{ right: '64px' }} />
      <BackToTop size="md" style={{ right: '108px' }} />
      <BackToTop size="lg" style={{ right: '160px' }} />
      <BackToTop size="xl" style={{ right: '220px' }} />
    </LongPage>
  ),
};

export const RoundedShape: Story = {
  render: () => (
    <LongPage>
      <BackToTop shape="rounded" />
    </LongPage>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <LongPage>
      <BackToTop icon={<ChevronUpIcon size={20} />} />
    </LongPage>
  ),
};

export const LowThreshold: Story = {
  render: () => (
    <LongPage>
      <BackToTop visibilityThreshold={50} />
    </LongPage>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <LongPage>
      <BackToTop
        styles={{
          root: {
            backgroundColor: '#1a1a2e',
            boxShadow: '0 4px 16px rgba(26,26,46,0.4)',
          },
        }}
      />
    </LongPage>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'filled',
    size: 'md',
    shape: 'circle',
    visibilityThreshold: 300,
    scrollBehavior: 'smooth',
  },
  render: (args) => (
    <LongPage>
      <BackToTop {...args} />
    </LongPage>
  ),
};
