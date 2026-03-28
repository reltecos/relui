/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TagInput } from './TagInput';

// ── Test Verileri ───────────────────────────────────────────────────

const frameworks = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'qwik', label: 'Qwik' },
  { value: 'lit', label: 'Lit' },
  { value: 'preact', label: 'Preact' },
];

const withDisabled = [
  { value: 'a', label: 'Aktif secenek' },
  { value: 'b', label: 'Pasif secenek', disabled: true },
  { value: 'c', label: 'Baska aktif secenek' },
  { value: 'd', label: 'Dorduncu secenek' },
];

// ── Meta ─────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'flushed'],
      description: 'Gorsel varyant / Visual variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Boyut / Size',
    },
    disabled: {
      control: 'boolean',
      description: 'Pasif durum / Disabled state',
    },
    readOnly: {
      control: 'boolean',
      description: 'Salt okunur / Read-only',
    },
    invalid: {
      control: 'boolean',
      description: 'Gecersiz durum / Invalid state',
    },
  },
  args: {
    variant: 'outline',
    size: 'md',
    options: frameworks,
    placeholder: 'Teknoloji arayin...',
  },
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ──────────────────────────────────────────────────────────

/** Varsayilan / Default */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <TagInput {...args} aria-label="Teknolojiler" />
    </div>
  ),
};

/** Secili degerler / With values */
export const WithValues: Story = {
  name: 'Secili Degerler / With Values',
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <TagInput
        options={frameworks}
        defaultValue={['react', 'vue', 'svelte']}
        placeholder="Teknoloji arayin"
        aria-label="Teknolojiler"
      />
    </div>
  ),
};

/** Kontrollu / Controlled */
export const Controlled: Story = {
  name: 'Kontrollu / Controlled',
  render: () => {
    const [values, setValues] = useState<string[]>(['react']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
        <TagInput
          options={frameworks}
          value={values}
          onValueChange={setValues}
          placeholder="Teknoloji arayin"
          aria-label="Teknolojiler"
        />
        <div style={{ fontSize: '0.875rem', color: 'var(--rel-color-text-muted, #64748b)' }}>
          Secili: {values.length > 0 ? values.join(', ') : '(bos)'}
        </div>
        <button
          type="button"
          onClick={() => setValues([])}
          style={{ alignSelf: 'flex-start', fontSize: '0.75rem' }}
        >
          Temizle
        </button>
      </div>
    );
  },
};

/** Tum boyutlar / All sizes */
export const AllSizes: Story = {
  name: 'Tum Boyutlar / All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <TagInput
          key={size}
          size={size}
          options={frameworks}
          defaultValue={['react', 'vue']}
          aria-label={`Teknolojiler ${size}`}
        />
      ))}
    </div>
  ),
};

/** Tum varyantlar / All variants */
export const AllVariants: Story = {
  name: 'Tum Varyantlar / All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      {(['outline', 'filled', 'flushed'] as const).map((variant) => (
        <TagInput
          key={variant}
          variant={variant}
          options={frameworks}
          defaultValue={['react', 'vue']}
          aria-label={`Teknolojiler ${variant}`}
        />
      ))}
    </div>
  ),
};

/** Pasif / Disabled */
export const Disabled: Story = {
  name: 'Pasif / Disabled',
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <TagInput
        options={frameworks}
        defaultValue={['react', 'vue']}
        disabled
        aria-label="Teknolojiler"
      />
    </div>
  ),
};

/** Salt okunur / ReadOnly */
export const ReadOnly: Story = {
  name: 'Salt Okunur / ReadOnly',
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <TagInput
        options={frameworks}
        defaultValue={['react', 'vue']}
        readOnly
        aria-label="Teknolojiler"
      />
    </div>
  ),
};

/** Gecersiz / Invalid */
export const Invalid: Story = {
  name: 'Gecersiz / Invalid',
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <TagInput
        options={frameworks}
        invalid
        placeholder="Teknoloji arayin"
        aria-label="Teknolojiler"
      />
    </div>
  ),
};

/** Pasif secenek / Disabled option */
export const DisabledOption: Story = {
  name: 'Pasif Secenek / Disabled Option',
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <TagInput
        options={withDisabled}
        placeholder="Secenek arayin"
        aria-label="Secenekler"
      />
    </div>
  ),
};

/** Maksimum tag / Max tags */
export const MaxTags: Story = {
  name: 'Maksimum Tag / Max Tags',
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
        <TagInput
          options={frameworks}
          value={values}
          onValueChange={setValues}
          maxTags={3}
          placeholder="En fazla 3 secin"
          aria-label="Teknolojiler"
        />
        <div style={{ fontSize: '0.875rem', color: 'var(--rel-color-text-muted, #64748b)' }}>
          Secili: {values.length}/3
        </div>
      </div>
    );
  },
};

/** Serbest deger / Allow custom value */
export const AllowCustomValue: Story = {
  name: 'Serbest Deger / Allow Custom Value',
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
        <TagInput
          options={frameworks}
          value={values}
          onValueChange={setValues}
          allowCustomValue
          placeholder="Yazip ekleyebilirsiniz"
          aria-label="Teknolojiler"
        />
        <div style={{ fontSize: '0.875rem', color: 'var(--rel-color-text-muted, #64748b)' }}>
          Secili: {values.length > 0 ? values.join(', ') : '(bos)'}
        </div>
      </div>
    );
  },
};

/** Slot Customization — classNames & styles */
export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      <TagInput
        options={frameworks}
        defaultValue={['react', 'vue']}
        aria-label="Slot customization"
        classNames={{ root: 'my-tag-input-root' }}
        styles={{
          root: { border: '2px dashed var(--rel-color-warning, #f59e0b)', padding: '4px' },
          triggerWrapper: { backgroundColor: 'var(--rel-color-warning-light, #fef3c7)' },
          tag: { fontWeight: 'bold' },
          input: { fontStyle: 'italic' },
          clearButton: { color: 'var(--rel-color-error, #ef4444)' },
        }}
      />
      <TagInput
        options={frameworks}
        aria-label="Merged class"
        className="legacy-class"
        classNames={{ root: 'slot-class' }}
        styles={{ root: { boxShadow: '0 0 0 2px currentColor' } }}
      />
    </div>
  ),
};

/** Playground — interaktif kontroller / Interactive controls */
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <TagInput {...args} aria-label="Teknolojiler" />
    </div>
  ),
};

// ── Compound API ──────────────────────────────────────

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <TagInput options={frameworks} aria-label="Compound Teknolojiler">
        <TagInput.Tag>React</TagInput.Tag>
        <TagInput.Tag>Vue</TagInput.Tag>
        <TagInput.Input />
      </TagInput>
    </div>
  ),
};
