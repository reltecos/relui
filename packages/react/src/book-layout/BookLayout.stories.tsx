/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BookLayout } from './BookLayout';

const meta: Meta<typeof BookLayout> = {
  title: 'Window Manager/BookLayout',
  component: BookLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof BookLayout>;

const pageColors = ['#dbeafe', '#dcfce7', '#fef9c3', '#fce7f3', '#e0e7ff'];

const pageStyle = (color: string) => ({
  height: 300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  fontWeight: 600,
  background: color,
  borderRadius: 8,
});

export const Default: Story = {
  render: () => (
    <BookLayout
      totalPages={5}
      renderPage={(i) => (
        <div style={pageStyle(pageColors[i] ?? '#f1f5f9')}>
          Sayfa {i + 1}
        </div>
      )}
    />
  ),
};

export const WithLoop: Story = {
  render: () => (
    <BookLayout
      totalPages={5}
      loop
      renderPage={(i) => (
        <div style={pageStyle(pageColors[i] ?? '#f1f5f9')}>
          Sayfa {i + 1} (Döngüsel)
        </div>
      )}
    />
  ),
};

export const CustomLabels: Story = {
  render: () => (
    <BookLayout
      totalPages={5}
      prevLabel="← Önceki"
      nextLabel="Sonraki →"
      renderPage={(i) => (
        <div style={pageStyle(pageColors[i] ?? '#f1f5f9')}>
          Sayfa {i + 1}
        </div>
      )}
    />
  ),
};

export const NoIndicator: Story = {
  render: () => (
    <BookLayout
      totalPages={5}
      showPageIndicator={false}
      renderPage={(i) => (
        <div style={pageStyle(pageColors[i] ?? '#f1f5f9')}>
          Sayfa {i + 1}
        </div>
      )}
    />
  ),
};

export const Controlled: Story = {
  render: () => {
    const Comp = () => {
      const [page, setPage] = useState(0);
      return (
        <div>
          <div style={{ marginBottom: 8, display: 'flex', gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                style={{
                  padding: '4px 12px',
                  background: i === page ? '#4f46e5' : '#e2e8f0',
                  color: i === page ? '#fff' : '#1e293b',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <BookLayout
            totalPages={5}
            currentPage={page}
            onPageChange={setPage}
            showControls={false}
            renderPage={(i) => (
              <div style={pageStyle(pageColors[i] ?? '#f1f5f9')}>
                Sayfa {i + 1}
              </div>
            )}
          />
        </div>
      );
    };
    return <Comp />;
  },
};

export const CustomSlotStyles: Story = {
  render: () => (
    <BookLayout
      totalPages={5}
      classNames={{ root: 'custom-book' }}
      styles={{
        root: { background: '#f8fafc', padding: 16, borderRadius: 12 },
        page: { borderRadius: 8, border: '2px solid #e0e7ff' },
        controls: { padding: '12px 0' },
        pageIndicator: { fontWeight: 700, color: '#4f46e5' },
      }}
      renderPage={(i) => (
        <div style={pageStyle(pageColors[i] ?? '#f1f5f9')}>
          Sayfa {i + 1}
        </div>
      )}
    />
  ),
};

export const Compound: Story = {
  render: () => (
    <BookLayout totalPages={5}>
      <BookLayout.Page>
        <div style={pageStyle(pageColors[0] ?? '#f1f5f9')}>
          Compound API ile Sayfa 1
        </div>
      </BookLayout.Page>
      <BookLayout.Navigation />
    </BookLayout>
  ),
};
