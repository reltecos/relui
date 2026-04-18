/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { GanttChart } from './GanttChart';
import type { GanttTask } from '@relteco/relui-core';

const meta: Meta<typeof GanttChart> = {
  title: 'Data Display/GanttChart',
  component: GanttChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    zoom: { control: 'select', options: ['day', 'week', 'month'] },
  },
};

export default meta;
type Story = StoryObj<typeof GanttChart>;

function makeTask(overrides: Partial<GanttTask> & { id: string }): GanttTask {
  return {
    name: `Task ${overrides.id}`,
    startDate: '2025-06-01',
    endDate: '2025-06-05',
    progress: 0,
    dependencies: [],
    isMilestone: false,
    ...overrides,
  };
}

const DEMO_TASKS: GanttTask[] = [
  makeTask({ id: 'A', name: 'Proje Planlama', startDate: '2025-06-01', endDate: '2025-06-05', progress: 100 }),
  makeTask({ id: 'B', name: 'UI Tasarim', startDate: '2025-06-05', endDate: '2025-06-12', progress: 80, dependencies: ['A'] }),
  makeTask({ id: 'C', name: 'Backend Gelistirme', startDate: '2025-06-05', endDate: '2025-06-18', progress: 40, dependencies: ['A'] }),
  makeTask({ id: 'D', name: 'Frontend Gelistirme', startDate: '2025-06-12', endDate: '2025-06-22', progress: 20, dependencies: ['B'] }),
  makeTask({ id: 'E', name: 'Entegrasyon', startDate: '2025-06-22', endDate: '2025-06-26', progress: 0, dependencies: ['C', 'D'] }),
  makeTask({ id: 'F', name: 'Test', startDate: '2025-06-26', endDate: '2025-06-30', progress: 0, dependencies: ['E'] }),
  makeTask({ id: 'M1', name: 'Release', startDate: '2025-06-30', endDate: '2025-06-30', isMilestone: true, progress: 0, dependencies: ['F'] }),
];

// ── Default (Week zoom) ──

export const Default: Story = {
  args: {
    tasks: DEMO_TASKS,
    zoom: 'week',
  },
  decorators: [(Story) => <div style={{ width: 800 }}><Story /></div>],
};

// ── DayZoom ──

export const DayZoom: Story = {
  args: {
    tasks: DEMO_TASKS,
    zoom: 'day',
  },
  decorators: [(Story) => <div style={{ width: 800 }}><Story /></div>],
};

// ── MonthZoom ──

export const MonthZoom: Story = {
  args: {
    tasks: DEMO_TASKS,
    zoom: 'month',
  },
  decorators: [(Story) => <div style={{ width: 800 }}><Story /></div>],
};

// ── WithProgress ──

export const WithProgress: Story = {
  args: {
    tasks: [
      makeTask({ id: 'A', name: 'Tamamlandi', startDate: '2025-06-01', endDate: '2025-06-10', progress: 100 }),
      makeTask({ id: 'B', name: 'Devam ediyor', startDate: '2025-06-05', endDate: '2025-06-15', progress: 60 }),
      makeTask({ id: 'C', name: 'Baslamadi', startDate: '2025-06-10', endDate: '2025-06-20', progress: 0 }),
    ],
    zoom: 'day',
  },
  decorators: [(Story) => <div style={{ width: 800 }}><Story /></div>],
};

// ── WithMilestones ──

export const WithMilestones: Story = {
  args: {
    tasks: [
      makeTask({ id: 'A', name: 'Faz 1', startDate: '2025-06-01', endDate: '2025-06-10', progress: 100 }),
      makeTask({ id: 'M1', name: 'Faz 1 Tamamlandi', startDate: '2025-06-10', endDate: '2025-06-10', isMilestone: true, progress: 0, dependencies: ['A'] }),
      makeTask({ id: 'B', name: 'Faz 2', startDate: '2025-06-10', endDate: '2025-06-20', progress: 30, dependencies: ['M1'] }),
      makeTask({ id: 'M2', name: 'Lansman', startDate: '2025-06-20', endDate: '2025-06-20', isMilestone: true, progress: 0, dependencies: ['B'] }),
    ],
    zoom: 'day',
  },
  decorators: [(Story) => <div style={{ width: 800 }}><Story /></div>],
};

// ── WithResources ──

export const WithResources: Story = {
  args: {
    tasks: [
      makeTask({ id: 'A', name: 'Tasarim', startDate: '2025-06-01', endDate: '2025-06-07', resource: 'Ali', progress: 100 }),
      makeTask({ id: 'B', name: 'Kodlama', startDate: '2025-06-07', endDate: '2025-06-14', resource: 'Veli', progress: 50, dependencies: ['A'] }),
      makeTask({ id: 'C', name: 'QA', startDate: '2025-06-14', endDate: '2025-06-20', resource: 'Ayse', progress: 0, dependencies: ['B'] }),
    ],
    zoom: 'day',
  },
  decorators: [(Story) => <div style={{ width: 800 }}><Story /></div>],
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ width: 800 }}>
      <GanttChart tasks={DEMO_TASKS}>
        <GanttChart.Header />
        <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
          <GanttChart.TaskList />
          <GanttChart.Timeline />
        </div>
      </GanttChart>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    tasks: DEMO_TASKS,
    zoom: 'week',
    styles: {
      root: { borderRadius: 12 },
      header: { padding: '12px 20px' },
      taskRow: { padding: '10px 16px' },
    },
  },
  decorators: [(Story) => <div style={{ width: 800 }}><Story /></div>],
};
