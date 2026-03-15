/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';
import { NavLink } from './NavLink';

// ── Link Meta ───────────────────────────────────────────────

const meta: Meta<typeof Link> = {
  title: 'Navigation/Link',
  component: Link,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Link>;

// ── Link Stories ────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--rel-font-sans, system-ui)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Link href="#">Default Link</Link>
      <Link href="#" variant="subtle">Subtle Link</Link>
      <Link href="#" variant="inherit">Inherit Link</Link>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--rel-font-sans, system-ui)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(['default', 'subtle', 'inherit'] as const).map((variant) => (
        <div key={variant}>
          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px', opacity: 0.5 }}>
            variant: {variant}
          </div>
          <Link href="#" variant={variant}>Click me</Link>
        </div>
      ))}
    </div>
  ),
};

export const AllUnderlines: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--rel-font-sans, system-ui)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(['always', 'hover', 'never'] as const).map((underline) => (
        <div key={underline}>
          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px', opacity: 0.5 }}>
            underline: {underline}
          </div>
          <Link href="#" underline={underline}>Click me</Link>
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--rel-font-sans, system-ui)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Link key={size} href="#" size={size}>
          Size {size}
        </Link>
      ))}
    </div>
  ),
};

export const ExternalLink: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--rel-font-sans, system-ui)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Link href="https://example.com" external>External with icon</Link>
      <Link href="https://example.com" external showExternalIcon={false}>External without icon</Link>
      <Link href="/internal">Internal link</Link>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--rel-font-sans, system-ui)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Link href="#">Normal Link</Link>
      <Link href="#" disabled>Disabled Link</Link>
    </div>
  ),
};

export const InlineText: Story = {
  render: () => (
    <p style={{ fontFamily: 'var(--rel-font-sans, system-ui)', fontSize: '16px', lineHeight: 1.6 }}>
      This is a paragraph with an <Link href="#">inline link</Link> that flows
      naturally within the text. You can also have{' '}
      <Link href="https://example.com" external>external links</Link> that
      open in a new tab with the external icon indicator.
    </p>
  ),
};

// ── NavLink Stories ─────────────────────────────────────────

export const NavLinkDefault: Story = {
  render: () => (
    <nav style={{ fontFamily: 'var(--rel-font-sans, system-ui)', display: 'flex', gap: '24px' }}>
      <NavLink href="/home" active>Home</NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/contact">Contact</NavLink>
      <NavLink href="/help" disabled>Help</NavLink>
    </nav>
  ),
};

export const NavLinkVertical: Story = {
  render: () => (
    <nav style={{ fontFamily: 'var(--rel-font-sans, system-ui)', display: 'flex', flexDirection: 'column', gap: '8px', width: '200px' }}>
      <NavLink href="/dashboard" active>Dashboard</NavLink>
      <NavLink href="/analytics">Analytics</NavLink>
      <NavLink href="/settings">Settings</NavLink>
      <NavLink href="/profile">Profile</NavLink>
      <NavLink href="https://docs.example.com" external>Documentation</NavLink>
    </nav>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--rel-font-sans, system-ui)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Link
        href="#"
        styles={{ root: { letterSpacing: '1px', fontWeight: 600 } }}
      >
        Custom styled link
      </Link>
      <NavLink
        href="#"
        active
        styles={{ root: { padding: '8px 16px', fontSize: '18px' } }}
      >
        Custom styled NavLink
      </NavLink>
    </div>
  ),
};

// ── Compound ────────────────────────────────────────────────

export const Compound: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--rel-font-sans, system-ui)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Link href="#">
        <Link.Icon><span style={{ fontSize: '1em' }}>★</span></Link.Icon>
        Link with start icon
      </Link>
      <Link href="#">
        Link with end icon
        <Link.Icon position="end"><span style={{ fontSize: '1em' }}>→</span></Link.Icon>
      </Link>
      <Link href="#">
        <Link.Icon><span style={{ fontSize: '1em' }}>🔍</span></Link.Icon>
        Search
        <Link.Icon position="end"><span style={{ fontSize: '1em' }}>↗</span></Link.Icon>
      </Link>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    href: '#',
    children: 'Playground Link',
    variant: 'default',
    underline: 'hover',
    size: 'md',
    disabled: false,
    external: false,
  },
};
