/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownEditor } from './MarkdownEditor';

const meta: Meta<typeof MarkdownEditor> = {
  title: 'Editors/MarkdownEditor',
  component: MarkdownEditor,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    defaultMode: { control: 'select', options: ['edit', 'split', 'preview'] },
  },
};
export default meta;
type Story = StoryObj<typeof MarkdownEditor>;

const SAMPLE_MD = `# Baslik

Bu bir **kalin** ve *italic* metin.

## Alt Baslik

- Liste ogesi 1
- Liste ogesi 2

> Alinti metni

\`\`\`
const x = 42;
\`\`\`

[Google](https://google.com)

---

1. Numarali oge 1
2. Numarali oge 2
`;

export const Default: Story = {
  args: { value: SAMPLE_MD },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const EditMode: Story = {
  args: { value: SAMPLE_MD, defaultMode: 'edit' },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const PreviewMode: Story = {
  args: { value: SAMPLE_MD, defaultMode: 'preview' },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const SplitMode: Story = {
  args: { value: SAMPLE_MD, defaultMode: 'split' },
  decorators: [(Story) => <div style={{ width: 900 }}><Story /></div>],
};

export const Empty: Story = {
  args: { value: '' },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const Compound: Story = {
  render: () => (
    <div style={{ width: 900 }}>
      <MarkdownEditor value={SAMPLE_MD}>
        <MarkdownEditor.Toolbar />
        <div style={{ display: 'flex' }}>
          <MarkdownEditor.Editor />
          <MarkdownEditor.Preview />
        </div>
      </MarkdownEditor>
    </div>
  ),
};

export const CompoundEditorOnly: Story = {
  render: () => (
    <div style={{ width: 700 }}>
      <MarkdownEditor value={SAMPLE_MD}>
        <MarkdownEditor.Toolbar />
        <MarkdownEditor.Editor />
      </MarkdownEditor>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    value: SAMPLE_MD,
    styles: {
      root: { padding: 4 },
      toolbar: { padding: '8px 12px' },
      editor: { fontSize: '16px' },
      preview: { padding: 20 },
    },
  },
  decorators: [(Story) => <div style={{ width: 900 }}><Story /></div>],
};
