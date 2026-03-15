/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FAB } from './FAB';
import type { FabAction } from '@relteco/relui-core';

const meta: Meta<typeof FAB> = {
  title: 'Navigation/FAB',
  component: FAB,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FAB>;

// ── Demo actions ────────────────────────────────────────

const demoActions: FabAction[] = [
  { id: 'add', label: 'Add item' },
  { id: 'edit', label: 'Edit' },
  { id: 'share', label: 'Share' },
];

const fullActions: FabAction[] = [
  { id: 'note', label: 'New Note' },
  { id: 'task', label: 'New Task' },
  { id: 'event', label: 'New Event' },
  { id: 'contact', label: 'New Contact' },
];

// ── Page wrapper ────────────────────────────────────────

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', padding: 24, fontFamily: 'system-ui' }}>
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>FAB Demo</h2>
      <p style={{ color: '#64748b', fontSize: 14 }}>
        Click the floating action button to see the speed dial menu.
      </p>
      {children}
    </div>
  );
}

// ── Default ─────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <PageWrapper>
      <FAB actions={demoActions} />
    </PageWrapper>
  ),
};

// ── All Positions ───────────────────────────────────────

export const AllPositions: Story = {
  render: () => (
    <PageWrapper>
      <FAB actions={demoActions} position="bottom-right" />
      <FAB actions={demoActions} position="bottom-left" variant="secondary" />
      <FAB actions={demoActions} position="top-right" variant="danger" />
      <FAB actions={demoActions} position="top-left" />
    </PageWrapper>
  ),
};

// ── All Sizes ───────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <PageWrapper>
      <FAB actions={demoActions} size="sm" position="bottom-right" style={{ right: 24 }} />
      <FAB actions={demoActions} size="md" position="bottom-right" style={{ right: 88 }} />
      <FAB actions={demoActions} size="lg" position="bottom-right" style={{ right: 164 }} />
    </PageWrapper>
  ),
};

// ── All Variants ────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <PageWrapper>
      <FAB actions={demoActions} variant="filled" position="bottom-right" style={{ right: 24 }} />
      <FAB actions={demoActions} variant="secondary" position="bottom-right" style={{ right: 100 }} />
      <FAB actions={demoActions} variant="danger" position="bottom-right" style={{ right: 176 }} />
    </PageWrapper>
  ),
};

// ── With Overlay ────────────────────────────────────────

export const WithOverlay: Story = {
  render: () => (
    <PageWrapper>
      <FAB actions={fullActions} showOverlay />
    </PageWrapper>
  ),
};

// ── No Actions (Simple FAB) ─────────────────────────────

export const SimpleButton: Story = {
  render: () => (
    <PageWrapper>
      <FAB
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="100%" height="100%">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        }
        aria-label="New message"
      />
    </PageWrapper>
  ),
};

// ── Custom Slot Styles ──────────────────────────────────

export const CustomSlotStyles: Story = {
  render: () => (
    <PageWrapper>
      <FAB
        actions={demoActions}
        styles={{
          button: {
            backgroundColor: '#1a1a2e',
            boxShadow: '0 4px 16px rgba(26,26,46,0.4)',
          },
        }}
      />
    </PageWrapper>
  ),
};

// ── Compound ────────────────────────────────────────────

export const Compound: Story = {
  render: () => (
    <PageWrapper>
      <FAB>
        <FAB.Icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width="100%" height="100%">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </FAB.Icon>
      </FAB>
    </PageWrapper>
  ),
};

// ── CompoundWithLabel ─────────────────────────────────────

export const CompoundWithLabel: Story = {
  render: () => (
    <PageWrapper>
      <FAB>
        <FAB.Icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width="100%" height="100%">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </FAB.Icon>
        <FAB.Label>Yeni</FAB.Label>
      </FAB>
    </PageWrapper>
  ),
};

// ── Playground ──────────────────────────────────────────

export const Playground: Story = {
  args: {
    actions: fullActions,
    position: 'bottom-right',
    variant: 'filled',
    size: 'md',
    showOverlay: false,
  },
  render: (args) => (
    <PageWrapper>
      <FAB {...args} />
    </PageWrapper>
  ),
};
