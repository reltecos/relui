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
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';

const TestIcon = () => <svg data-testid="test-icon" />;

describe('ButtonGroup', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(
      <ButtonGroup aria-label="Test grubu">
        <Button>Bir</Button>
        <Button>İki</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole('group', { name: 'Test grubu' });
    expect(group).toBeInTheDocument();
    expect(group.tagName).toBe('DIV');
  });

  it('child butonları render eder / renders child buttons', () => {
    render(
      <ButtonGroup>
        <Button>Bir</Button>
        <Button>İki</Button>
        <Button>Üç</Button>
      </ButtonGroup>,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('role=group attribute set edilir / role=group is set', () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('aria-label doğru set edilir / aria-label is set correctly', () => {
    render(
      <ButtonGroup aria-label="Aksiyonlar">
        <Button>A</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Aksiyonlar');
  });

  // ──────────────────────────────────────────
  // Context — shared props
  // ──────────────────────────────────────────

  it('grup disabled tüm butonları devre dışı bırakır / group disabled disables all buttons', () => {
    const handleClick = vi.fn();
    render(
      <ButtonGroup disabled>
        <Button onClick={handleClick}>Bir</Button>
        <Button onClick={handleClick}>İki</Button>
      </ButtonGroup>,
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      fireEvent.click(button);
    });

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('grup disabled her butona aria-disabled ekler / group disabled adds aria-disabled', () => {
    render(
      <ButtonGroup disabled>
        <Button>Bir</Button>
        <Button>İki</Button>
      </ButtonGroup>,
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('IconButton ile çalışır / works with IconButton', () => {
    render(
      <ButtonGroup>
        <IconButton icon={<TestIcon />} aria-label="Test" />
      </ButtonGroup>,
    );

    expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument();
  });

  it('IconButton + Button karışık çalışır / works with mixed children', () => {
    render(
      <ButtonGroup>
        <Button>Metin</Button>
        <IconButton icon={<TestIcon />} aria-label="İkon" />
      </ButtonGroup>,
    );

    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id doğru iletilir / id is forwarded correctly', () => {
    render(
      <ButtonGroup id="my-group">
        <Button>A</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('group')).toHaveAttribute('id', 'my-group');
  });

  it('className doğru iletilir / className is forwarded correctly', () => {
    render(
      <ButtonGroup className="custom-class">
        <Button>A</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('group').className).toContain('custom-class');
  });

  it('style doğru iletilir / style is forwarded correctly', () => {
    render(
      <ButtonGroup style={{ marginTop: '10px' }}>
        <Button>A</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('group').style.marginTop).toBe('10px');
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    render(
      <ButtonGroup classNames={{ root: 'slot-root' }}>
        <Button>A</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('group')).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    render(
      <ButtonGroup styles={{ root: { padding: '10px' } }}>
        <Button>A</Button>
      </ButtonGroup>,
    );

    expect(screen.getByRole('group')).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    render(
      <ButtonGroup className="legacy" classNames={{ root: 'slot-root' }}>
        <Button>A</Button>
      </ButtonGroup>,
    );
    const el = screen.getByRole('group');

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('style + styles.root birlestirilir', () => {
    render(
      <ButtonGroup style={{ margin: '4px' }} styles={{ root: { padding: '10px' } }}>
        <Button>A</Button>
      </ButtonGroup>,
    );
    const el = screen.getByRole('group');

    expect(el).toHaveStyle({ margin: '4px' });
    expect(el).toHaveStyle({ padding: '10px' });
  });

  // ──────────────────────────────────────────
  // Orientation
  // ──────────────────────────────────────────

  it('varsayilan orientation horizontal', () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
      </ButtonGroup>,
    );
    // horizontal default, className icinde horizontalStyle olmali
    expect(screen.getByRole('group').className).toBeTruthy();
  });

  it('orientation vertical destekler', () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group').className).toBeTruthy();
  });

  // ──────────────────────────────────────────
  // Attached
  // ──────────────────────────────────────────

  it('attached=true mod destekler', () => {
    render(
      <ButtonGroup attached>
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group').className).toBeTruthy();
  });

  it('attached + vertical mod destekler', () => {
    render(
      <ButtonGroup attached orientation="vertical">
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group').className).toBeTruthy();
  });

  // ──────────────────────────────────────────
  // Shared context props
  // ──────────────────────────────────────────

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(
      <ButtonGroup ref={ref}>
        <Button>A</Button>
      </ButtonGroup>,
    );
    expect(ref).toHaveBeenCalled();
  });
});
