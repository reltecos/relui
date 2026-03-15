/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'subtle'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// ── Default ─────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    totalItems: 100,
    pageSize: 10,
    size: 'md',
    variant: 'outline',
  },
};

// ── All Variants ────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['outline', 'filled', 'subtle'] as const).map((variant) => (
        <div key={variant}>
          <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block', textTransform: 'capitalize' }}>
            {variant}
          </span>
          <Pagination totalItems={100} pageSize={10} defaultPage={5} variant={variant} />
        </div>
      ))}
    </div>
  ),
};

// ── All Sizes ───────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size}>
          <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
            {size}
          </span>
          <Pagination totalItems={100} pageSize={10} defaultPage={5} size={size} />
        </div>
      ))}
    </div>
  ),
};

// ── With First/Last ─────────────────────────────────────────────────

export const WithFirstLast: Story = {
  render: () => (
    <Pagination
      totalItems={200}
      pageSize={10}
      defaultPage={10}
      showFirstLast
    />
  ),
};

// ── With Info ───────────────────────────────────────────────────────

export const WithInfo: Story = {
  render: () => (
    <Pagination
      totalItems={237}
      pageSize={10}
      defaultPage={5}
      showInfo
      showFirstLast
    />
  ),
};

// ── Few Pages ───────────────────────────────────────────────────────

export const FewPages: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          1 sayfa
        </span>
        <Pagination totalItems={5} pageSize={10} />
      </div>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          3 sayfa
        </span>
        <Pagination totalItems={30} pageSize={10} />
      </div>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          5 sayfa
        </span>
        <Pagination totalItems={50} pageSize={10} />
      </div>
    </div>
  ),
};

// ── Custom Labels ───────────────────────────────────────────────────

export const CustomLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          Metin etiketler
        </span>
        <Pagination
          totalItems={100}
          pageSize={10}
          defaultPage={5}
          prevLabel="Geri"
          nextLabel="Ileri"
          showFirstLast
          firstLabel="Basa"
          lastLabel="Sona"
        />
      </div>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          Ok ikonlari
        </span>
        <Pagination
          totalItems={100}
          pageSize={10}
          defaultPage={5}
          prevLabel="←"
          nextLabel="→"
          showFirstLast
          firstLabel="⇤"
          lastLabel="⇥"
        />
      </div>
    </div>
  ),
};

// ── Controlled ──────────────────────────────────────────────────────

function ControlledDemo() {
  const [page, setPage] = useState(1);
  return (
    <div>
      <p style={{ fontFamily: 'sans-serif', fontSize: '14px', color: '#666', margin: '0 0 12px' }}>
        Mevcut sayfa: <strong>{page}</strong>
      </p>
      <Pagination
        totalItems={100}
        pageSize={10}
        page={page}
        onPageChange={setPage}
        showInfo
        showFirstLast
      />
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

// ── Custom Siblings ─────────────────────────────────────────────────

export const CustomSiblings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          siblingCount=2, boundaryCount=2
        </span>
        <Pagination
          totalItems={200}
          pageSize={10}
          defaultPage={10}
          siblingCount={2}
          boundaryCount={2}
        />
      </div>
      <div>
        <span style={{ fontFamily: 'sans-serif', fontSize: '12px', color: '#999', marginBottom: '4px', display: 'block' }}>
          siblingCount=0, boundaryCount=1
        </span>
        <Pagination
          totalItems={200}
          pageSize={10}
          defaultPage={10}
          siblingCount={0}
          boundaryCount={1}
        />
      </div>
    </div>
  ),
};

// ── Custom Slot Styles ──────────────────────────────────────────────

export const CustomSlotStyles: Story = {
  render: () => (
    <Pagination
      totalItems={100}
      pageSize={10}
      defaultPage={5}
      classNames={{
        list: 'custom-pg-list',
      }}
      styles={{
        root: { fontFamily: 'monospace' },
      }}
    />
  ),
};

// ── Compound ───────────────────────────────────────────────────────

export const Compound: Story = {
  render: () => (
    <Pagination totalItems={50} pageSize={10}>
      <Pagination.PrevButton>Geri</Pagination.PrevButton>
      <Pagination.PageButton page={1} />
      <Pagination.PageButton page={2} />
      <Pagination.PageButton page={3} />
      <Pagination.PageButton page={4} />
      <Pagination.PageButton page={5} />
      <Pagination.NextButton>Ileri</Pagination.NextButton>
    </Pagination>
  ),
};

// ── Playground ──────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    totalItems: 200,
    pageSize: 10,
    size: 'md',
    variant: 'outline',
    showFirstLast: true,
    showInfo: true,
    siblingCount: 1,
    boundaryCount: 1,
  },
};
