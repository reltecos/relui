/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Tag } from './Tag';

describe('Tag', () => {
  it('render edilir / renders correctly', () => {
    render(<Tag>React</Tag>);

    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('span elementi olarak render edilir', () => {
    const { container } = render(<Tag>Test</Tag>);

    expect(container.querySelector('span')).toBeInTheDocument();
  });

  // ── Remove button ──────────────────────────────────────

  it('removable=true ise kaldırma butonu render edilir', () => {
    render(<Tag removable>React</Tag>);

    expect(screen.getByRole('button', { name: 'Kaldır' })).toBeInTheDocument();
  });

  it('removable=false ise kaldırma butonu yok', () => {
    render(<Tag>React</Tag>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('onRemove callback çağrılır', () => {
    const handleRemove = vi.fn();
    render(<Tag removable onRemove={handleRemove}>React</Tag>);

    fireEvent.click(screen.getByRole('button', { name: 'Kaldır' }));
    expect(handleRemove).toHaveBeenCalledOnce();
  });

  // ── Disabled ───────────────────────────────────────────

  it('disabled data-disabled set eder', () => {
    const { container } = render(<Tag disabled>React</Tag>);

    expect(container.querySelector('span')).toHaveAttribute('data-disabled', '');
  });

  it('disabled iken kaldırma butonu disabled', () => {
    render(<Tag removable disabled>React</Tag>);

    expect(screen.getByRole('button', { name: 'Kaldır' })).toBeDisabled();
  });

  // ── Props forwarding ──────────────────────────────────

  it('id doğru iletilir', () => {
    const { container } = render(<Tag id="my-tag">React</Tag>);

    expect(container.querySelector('#my-tag')).toBeInTheDocument();
  });

  it('className doğru iletilir', () => {
    const { container } = render(<Tag className="custom">React</Tag>);

    expect(container.querySelector('span')).toHaveClass('custom');
  });

  // ── classNames & styles ──────────────────────────────────

  it('classNames.root uygulanir', () => {
    const { container } = render(<Tag classNames={{ root: 'slot-root' }}>React</Tag>);

    expect(container.querySelector('span')).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = render(
      <Tag styles={{ root: { padding: '10px' } }}>React</Tag>,
    );

    expect(container.querySelector('span')).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = render(
      <Tag className="legacy" classNames={{ root: 'slot-root' }}>React</Tag>,
    );
    const el = container.querySelector('span');

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('classNames.removeButton uygulanir', () => {
    render(
      <Tag removable classNames={{ removeButton: 'my-remove' }}>React</Tag>,
    );

    expect(screen.getByRole('button', { name: 'Kaldır' })).toHaveClass('my-remove');
  });

  it('styles.removeButton uygulanir', () => {
    render(
      <Tag removable styles={{ removeButton: { opacity: 0.5 } }}>React</Tag>,
    );

    expect(screen.getByRole('button', { name: 'Kaldır' })).toHaveStyle({ opacity: '0.5' });
  });
});

// ── Compound API ──

describe('Tag (Compound)', () => {
  it('compound: Tag.Icon render edilir', () => {
    render(
      <Tag>
        <Tag.Icon><span data-testid="cmp-icon">C</span></Tag.Icon>
        React
      </Tag>,
    );
    expect(screen.getByTestId('cmp-icon')).toBeInTheDocument();
    expect(screen.getByTestId('tag-icon')).toBeInTheDocument();
  });

  it('compound: Tag.RemoveButton render edilir', () => {
    const handleRemove = vi.fn();
    render(
      <Tag onRemove={handleRemove}>
        React
        <Tag.RemoveButton />
      </Tag>,
    );
    const removeBtn = screen.getByTestId('tag-remove');
    expect(removeBtn).toBeInTheDocument();
    fireEvent.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledOnce();
  });

  it('compound: classNames context ile Tag.Icon a aktarilir', () => {
    render(
      <Tag classNames={{ icon: 'cmp-icon-cls' }}>
        <Tag.Icon><span>C</span></Tag.Icon>
        React
      </Tag>,
    );
    expect(screen.getByTestId('tag-icon').className).toContain('cmp-icon-cls');
  });

  it('compound: styles context ile Tag.RemoveButton a aktarilir', () => {
    render(
      <Tag styles={{ removeButton: { opacity: 0.3 } }}>
        React
        <Tag.RemoveButton />
      </Tag>,
    );
    expect(screen.getByTestId('tag-remove')).toHaveStyle({ opacity: '0.3' });
  });

  it('compound: disabled durumda Tag.RemoveButton disabled', () => {
    render(
      <Tag disabled>
        React
        <Tag.RemoveButton />
      </Tag>,
    );
    expect(screen.getByTestId('tag-remove')).toBeDisabled();
  });

  it('compound: Tag.Icon context disinda hata firlat', () => {
    expect(() => {
      render(<Tag.Icon><span>I</span></Tag.Icon>);
    }).toThrow('Tag compound sub-components must be used within <Tag>.');
  });

  it('compound: Tag.RemoveButton context disinda hata firlat', () => {
    expect(() => {
      render(<Tag.RemoveButton />);
    }).toThrow('Tag compound sub-components must be used within <Tag>.');
  });

  it('compound: root data-testid mevcut', () => {
    render(
      <Tag>
        <Tag.Icon><span>C</span></Tag.Icon>
        React
      </Tag>,
    );
    expect(screen.getByTestId('tag-root')).toBeInTheDocument();
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Tag ref={ref}>React</Tag>);
    expect(ref).toHaveBeenCalled();
  });
});
