/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DragDrop } from './DragDrop';

const meta: Meta<typeof DragDrop> = { title: 'Interaction/DragDrop', component: DragDrop, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof DragDrop>;

export const Default: Story = {
  render: () => (
    <DragDrop>
      <div style={{ display: 'flex', gap: 24 }}>
        <div><DragDrop.Draggable>Surukle beni</DragDrop.Draggable></div>
        <DragDrop.Droppable>Buraya birak</DragDrop.Droppable>
      </div>
    </DragDrop>
  ),
};
export const MultipleDraggables: Story = {
  name: 'Birden Fazla Oge',
  render: () => (
    <DragDrop>
      <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
        <DragDrop.Draggable>Oge 1</DragDrop.Draggable>
        <DragDrop.Draggable>Oge 2</DragDrop.Draggable>
        <DragDrop.Draggable>Oge 3</DragDrop.Draggable>
        <DragDrop.Droppable>Hedef bolge</DragDrop.Droppable>
      </div>
    </DragDrop>
  ),
};
export const WithOverlay: Story = {
  name: 'Overlay ile',
  render: () => (
    <DragDrop>
      <DragDrop.Draggable>Surukle</DragDrop.Draggable>
      <DragDrop.Droppable>Birak</DragDrop.Droppable>
      <DragDrop.Overlay>Overlay icerigi</DragDrop.Overlay>
    </DragDrop>
  ),
};
export const CustomSlotStyles: Story = { name: 'Slot Customization', render: () => (<DragDrop styles={{ root: { padding: 8 } }} classNames={{ root: 'custom-dd' }}><DragDrop.Draggable>Styled</DragDrop.Draggable></DragDrop>) };
export const MultipleDropZones: Story = {
  name: 'Coklu Hedef',
  render: () => (
    <DragDrop>
      <DragDrop.Draggable>Oge</DragDrop.Draggable>
      <div style={{ display: 'flex', gap: 16 }}>
        <DragDrop.Droppable>Bolge A</DragDrop.Droppable>
        <DragDrop.Droppable>Bolge B</DragDrop.Droppable>
      </div>
    </DragDrop>
  ),
};
export const IsOverState: Story = { name: 'Over Durumu', render: () => (<DragDrop><DragDrop.Droppable isOver>Uzerinde</DragDrop.Droppable></DragDrop>) };
export const Playground: Story = { render: () => (<DragDrop><DragDrop.Draggable>Playground</DragDrop.Draggable><DragDrop.Droppable>Birak</DragDrop.Droppable></DragDrop>) };
