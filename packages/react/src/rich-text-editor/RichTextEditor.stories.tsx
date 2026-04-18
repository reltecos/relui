/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { RichTextEditor } from './RichTextEditor';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Editors/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof RichTextEditor>;

const SAMPLE_HTML = '<h1>Baslik</h1><p>Bu bir <strong>kalin</strong> ve <em>italic</em> metin.</p><ul><li>Liste ogesi 1</li></ul><blockquote>Alinti metni</blockquote>';

export const Default: Story = {
  args: { value: SAMPLE_HTML },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const Empty: Story = {
  args: {},
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const WithHeadings: Story = {
  args: { value: '<h1>H1</h1><h2>H2</h2><h3>H3</h3><p>Normal metin</p>' },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const WithLists: Story = {
  args: { value: '<ul><li>Maddeli liste</li></ul><ol><li>Numarali liste</li></ol>' },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const WithCode: Story = {
  args: { value: '<p>Bir <code>inline code</code> ornegi.</p><pre><code>const x = 42;</code></pre>' },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};

export const Compound: Story = {
  render: () => (
    <div style={{ width: 700 }}>
      <RichTextEditor value={SAMPLE_HTML}>
        <RichTextEditor.Toolbar />
        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  ),
};

export const CompoundCustomToolbar: Story = {
  render: () => (
    <div style={{ width: 700 }}>
      <RichTextEditor value="<p>Custom toolbar ornegi</p>">
        <div style={{ padding: 8, display: 'flex', gap: 4 }}>
          <RichTextEditor.ToolbarButton onClick={() => {}}>Bold</RichTextEditor.ToolbarButton>
          <RichTextEditor.ToolbarButton onClick={() => {}}>Italic</RichTextEditor.ToolbarButton>
        </div>
        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    value: SAMPLE_HTML,
    styles: {
      root: { padding: 4 },
      toolbar: { padding: '8px 12px' },
      content: { fontSize: '18px', padding: 24 },
    },
  },
  decorators: [(Story) => <div style={{ width: 700 }}><Story /></div>],
};
