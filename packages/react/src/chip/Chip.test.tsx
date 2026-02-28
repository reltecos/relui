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
import { Chip } from './Chip';

describe('Chip', () => {
  it('render edilir / renders correctly', () => {
    render(<Chip>Filtre</Chip>);

    expect(screen.getByText('Filtre')).toBeInTheDocument();
  });

  it('button elementi olarak render edilir', () => {
    render(<Chip>Test</Chip>);

    expect(screen.getByRole('option')).toBeInTheDocument();
  });

  // ── Selection ──────────────────────────────────────────

  it('selected=true ise data-selected set edilir', () => {
    render(<Chip selected>Aktif</Chip>);

    expect(screen.getByRole('option')).toHaveAttribute('data-selected', '');
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'true');
  });

  it('selected=false ise data-selected yok', () => {
    render(<Chip>Pasif</Chip>);

    expect(screen.getByRole('option')).not.toHaveAttribute('data-selected');
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'false');
  });

  it('tıklama ile onSelectedChange çağrılır', () => {
    const handleChange = vi.fn();
    render(<Chip onSelectedChange={handleChange}>Filtre</Chip>);

    fireEvent.click(screen.getByRole('option'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('seçili iken tıklama false gönderir', () => {
    const handleChange = vi.fn();
    render(<Chip selected onSelectedChange={handleChange}>Filtre</Chip>);

    fireEvent.click(screen.getByRole('option'));
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  // ── Removable ─────────────────────────────────────────

  it('removable=true ise kaldırma butonu render edilir', () => {
    render(<Chip removable>Filtre</Chip>);

    expect(screen.getByRole('button', { name: 'Kaldır' })).toBeInTheDocument();
  });

  it('onRemove callback çağrılır', () => {
    const handleRemove = vi.fn();
    render(<Chip removable onRemove={handleRemove}>Filtre</Chip>);

    fireEvent.click(screen.getByRole('button', { name: 'Kaldır' }));
    expect(handleRemove).toHaveBeenCalledOnce();
  });

  // ── Disabled ──────────────────────────────────────────

  it('disabled iken button disabled', () => {
    render(<Chip disabled>Pasif</Chip>);

    expect(screen.getByRole('option')).toBeDisabled();
  });

  it('disabled data-disabled set eder', () => {
    render(<Chip disabled>Pasif</Chip>);

    expect(screen.getByRole('option')).toHaveAttribute('data-disabled', '');
  });

  // ── Props forwarding ──────────────────────────────────

  it('id doğru iletilir', () => {
    render(<Chip id="my-chip">Test</Chip>);

    expect(document.getElementById('my-chip')).toBeInTheDocument();
  });

  it('className doğru iletilir', () => {
    render(<Chip className="custom">Test</Chip>);

    expect(screen.getByRole('option')).toHaveClass('custom');
  });

  // ── classNames & styles ──────────────────────────────────

  it('classNames.root uygulanir', () => {
    render(<Chip classNames={{ root: 'slot-root' }}>Test</Chip>);

    expect(screen.getByRole('option')).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    render(<Chip styles={{ root: { padding: '10px' } }}>Test</Chip>);

    expect(screen.getByRole('option')).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    render(
      <Chip className="legacy" classNames={{ root: 'slot-root' }}>Test</Chip>,
    );
    const el = screen.getByRole('option');

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('classNames.removeButton uygulanir', () => {
    render(
      <Chip removable classNames={{ removeButton: 'my-remove' }}>Test</Chip>,
    );

    expect(screen.getByRole('button', { name: 'Kaldır' })).toHaveClass('my-remove');
  });

  it('styles.removeButton uygulanir', () => {
    render(
      <Chip removable styles={{ removeButton: { opacity: 0.5 } }}>Test</Chip>,
    );

    expect(screen.getByRole('button', { name: 'Kaldır' })).toHaveStyle({ opacity: '0.5' });
  });
});
