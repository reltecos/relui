/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    children: 'This is an informational alert message.',
  },
};

export const AllSeverities: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert severity="info">This is an info alert.</Alert>
      <Alert severity="success">This is a success alert.</Alert>
      <Alert severity="warning">This is a warning alert.</Alert>
      <Alert severity="error">This is an error alert.</Alert>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert variant="subtle" severity="info">Subtle variant</Alert>
      <Alert variant="outline" severity="info">Outline variant</Alert>
      <Alert variant="filled" severity="info">Filled variant</Alert>
    </div>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert severity="success" title="Success!">Your changes have been saved successfully.</Alert>
      <Alert severity="error" title="Error">Something went wrong. Please try again.</Alert>
      <Alert severity="warning" title="Warning">Your session will expire in 5 minutes.</Alert>
    </div>
  ),
};

export const Closable: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert closable severity="info">Click the close button to dismiss this alert.</Alert>
      <Alert closable severity="success" title="Saved">Your profile has been updated.</Alert>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Alert
      severity="error"
      title="Connection Lost"
      action={
        <button style={{ fontSize: 12, padding: '4px 12px', borderRadius: 4, border: '1px solid currentColor', background: 'none', color: 'inherit', cursor: 'pointer' }}>
          Retry
        </button>
      }
    >
      Unable to connect to the server. Please check your network connection.
    </Alert>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert size="sm">Small alert</Alert>
      <Alert size="md">Medium alert</Alert>
      <Alert size="lg">Large alert</Alert>
    </div>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <Alert
      icon={<span style={{ fontSize: 18 }}>🔔</span>}
      title="Notification"
    >
      You have 3 new messages.
    </Alert>
  ),
};

export const NoIcon: Story = {
  render: () => (
    <Alert icon={null} severity="info">Alert without an icon.</Alert>
  ),
};

export const Compound: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Alert severity="error" compound>
        <Alert.Icon><span style={{ fontSize: 18 }}>X</span></Alert.Icon>
        <div style={{ flex: 1 }}>
          <Alert.Title>Hata Olustu</Alert.Title>
          <Alert.Description>Islem sirasinda bir sorun ile karsilasildi.</Alert.Description>
        </div>
        <Alert.CloseButton />
      </Alert>
      <Alert severity="success" compound>
        <Alert.Icon><span style={{ fontSize: 18 }}>V</span></Alert.Icon>
        <div style={{ flex: 1 }}>
          <Alert.Title>Basarili!</Alert.Title>
          <Alert.Description>Degisiklikler kaydedildi.</Alert.Description>
        </div>
      </Alert>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Alert
      severity="info"
      title="Dark Alert"
      styles={{
        root: {
          backgroundColor: '#1a1a2e',
          padding: '16px 20px',
        },
        title: { letterSpacing: '0.5px' },
      }}
    >
      This alert uses custom slot styles.
    </Alert>
  ),
};

export const Playground: Story = {
  args: {
    severity: 'info',
    variant: 'subtle',
    size: 'md',
    title: 'Alert Title',
    children: 'Alert description text goes here.',
    closable: false,
  },
};
