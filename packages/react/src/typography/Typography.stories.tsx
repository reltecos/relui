/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Typography/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'subtitle1', 'subtitle2',
        'body1', 'body2',
        'caption', 'overline',
      ],
      description: 'Tipografi varyanti / Typography variant',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
      description: 'Metin hizalama / Text alignment',
    },
    truncate: {
      control: 'boolean',
      description: 'Metin kisaltma / Text truncation',
    },
    gutterBottom: {
      control: 'boolean',
      description: 'Alt bosluk / Bottom gutter',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

// ── Default (Props-based) ──

export const Default: Story = {
  args: {
    variant: 'body1',
    children: 'Bu bir tipografi bilesenidir. Variant prop ile farkli metin stilleri uygulanabilir.',
  },
};

// ── Headings ──

export const Headings: Story = {
  name: 'Basliklar / Headings',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Typography variant="h1">h1 — Ana Baslik</Typography>
      <Typography variant="h2">h2 — Ikinci Baslik</Typography>
      <Typography variant="h3">h3 — Ucuncu Baslik</Typography>
      <Typography variant="h4">h4 — Dorduncu Baslik</Typography>
      <Typography variant="h5">h5 — Besinci Baslik</Typography>
      <Typography variant="h6">h6 — Altinci Baslik</Typography>
    </div>
  ),
};

// ── Body & Subtitles ──

export const BodyAndSubtitles: Story = {
  name: 'Govde ve Alt Basliklar / Body & Subtitles',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Typography variant="subtitle1">Subtitle 1 — Daha buyuk alt baslik</Typography>
      <Typography variant="subtitle2">Subtitle 2 — Daha kucuk alt baslik</Typography>
      <Typography variant="body1">
        Body 1 — Ana govde metni. Bu varyant paragraflar icin kullanilir ve 16px boyutundadir.
      </Typography>
      <Typography variant="body2">
        Body 2 — Ikincil govde metni. Daha kucuk paragraflar icin 14px boyutundadir.
      </Typography>
      <Typography variant="caption">Caption — Kucuk aciklama metni</Typography>
      <Typography variant="overline">Overline — Ust baslik</Typography>
    </div>
  ),
};

// ── Alignment ──

export const Alignment: Story = {
  name: 'Hizalama / Alignment',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
      <Typography align="left">Sola hizali metin (left)</Typography>
      <Typography align="center">Ortaya hizali metin (center)</Typography>
      <Typography align="right">Saga hizali metin (right)</Typography>
      <Typography align="justify">
        Iki yana yasli metin (justify). Bu metin yeterince uzun oldugundan iki yana yaslama efekti
        gorulebilir.
      </Typography>
    </div>
  ),
};

// ── Truncate ──

export const Truncate: Story = {
  name: 'Metin Kisaltma / Truncation',
  render: () => (
    <div style={{ maxWidth: 250 }}>
      <Typography truncate>
        Bu cok uzun bir metin ve tasacak sekilde kesilecektir. Devami gorunmez.
      </Typography>
    </div>
  ),
};

// ── Polymorphic (as) ──

export const Polymorphic: Story = {
  name: 'Polimorfik Element / Polymorphic',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Typography variant="h1" as="div">h1 stili, div element</Typography>
      <Typography variant="body1" as="span">body1 stili, span element</Typography>
      <Typography variant="caption" as="label">caption stili, label element</Typography>
    </div>
  ),
};

// ── Color (style ile) ──

export const WithColor: Story = {
  name: 'Renkli / With Color',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Typography variant="h3" style={{ color: 'var(--rel-color-primary, #3b82f6)' }}>Mavi baslik</Typography>
      <Typography variant="body1" style={{ color: 'var(--rel-color-error, #ef4444)' }}>Kirmizi metin</Typography>
      <Typography variant="caption" style={{ color: 'var(--rel-color-success, #22c55e)' }}>Yesil aciklama</Typography>
    </div>
  ),
};

// ── Compound API ──

export const CompoundAPI: Story = {
  name: 'Compound API',
  render: () => (
    <Typography as="div">
      <Typography.Heading level={2}>Compound Baslik</Typography.Heading>
      <Typography.Text variant="body1">
        Bu metin compound API ile render edilmistir. Alt bilesenler context uzerinden
        slot stillerini paylasmaktadir.
      </Typography.Text>
      <Typography.Text variant="caption" style={{ color: 'var(--rel-color-text-muted, #6b7280)' }}>
        Kucuk aciklama metni
      </Typography.Text>
    </Typography>
  ),
};

// ── Slot API ──

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: {
    variant: 'h2',
    children: 'Ozel stil uygulanmis baslik',
    styles: {
      root: { padding: '16px', letterSpacing: '0.05em' },
    },
    classNames: {
      root: 'custom-typography',
    },
  },
};

// ── Playground ──

export const Playground: Story = {
  args: {
    variant: 'body1',
    children: 'Playground ile tum prop lari deneyin.',
    align: 'left',
    truncate: false,
    gutterBottom: false,
  },
};
