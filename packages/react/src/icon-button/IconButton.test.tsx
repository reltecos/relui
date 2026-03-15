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
import { IconButton } from './IconButton';

const TestIcon = () => <svg data-testid="test-icon" />;

describe('IconButton', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Test" />);
    const button = screen.getByRole('button', { name: 'Test' });

    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('ikonu render eder / renders the icon', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Test" />);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('aria-label doğru set edilir / aria-label is set correctly', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Ayarları aç" />);
    const button = screen.getByRole('button', { name: 'Ayarları aç' });

    expect(button).toHaveAttribute('aria-label', 'Ayarları aç');
  });

  it('ikon aria-hidden ile gizlenir / icon is hidden from screen readers', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Test" />);
    const button = screen.getByRole('button');
    const iconWrapper = button.querySelector('[aria-hidden="true"]');

    expect(iconWrapper).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Native button attributes
  // ──────────────────────────────────────────

  it('native button attribute döner / returns native button attributes', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Test" />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toHaveAttribute('role');
  });

  it('type=submit doğru set edilir / type=submit is set correctly', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Test" type="submit" />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'submit');
  });

  // ──────────────────────────────────────────
  // Click
  // ──────────────────────────────────────────

  it('onClick çağrılır / onClick is called', () => {
    const handleClick = vi.fn();
    render(<IconButton icon={<TestIcon />} aria-label="Test" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda click engellenir / click is blocked when disabled', () => {
    const handleClick = vi.fn();
    render(<IconButton icon={<TestIcon />} aria-label="Test" onClick={handleClick} disabled />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('disabled durumda aria-disabled set edilir / aria-disabled is set when disabled', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Test" disabled />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('data-disabled', '');
  });

  // ──────────────────────────────────────────
  // Loading
  // ──────────────────────────────────────────

  it('loading durumda click engellenir / click is blocked when loading', () => {
    const handleClick = vi.fn();
    render(<IconButton icon={<TestIcon />} aria-label="Test" onClick={handleClick} loading />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('loading durumda aria-busy ve spinner gösterilir / aria-busy and spinner shown when loading', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Test" loading />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('data-loading', '');
  });

  it('loading durumda ikon gizlenir / icon is hidden when loading', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Test" loading />);

    expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id doğru iletilir / id is forwarded correctly', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Test" id="my-icon-btn" />);

    expect(screen.getByRole('button')).toHaveAttribute('id', 'my-icon-btn');
  });

  it('className doğru iletilir / className is forwarded correctly', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Test" className="custom-class" />);
    const button = screen.getByRole('button');

    expect(button.className).toContain('custom-class');
  });

  it('style doğru iletilir / style is forwarded correctly', () => {
    render(
      <IconButton icon={<TestIcon />} aria-label="Test" style={{ marginTop: '10px' }} />,
    );
    const button = screen.getByRole('button');

    expect(button.style.marginTop).toBe('10px');
  });

  // ──────────────────────────────────────────
  // data-state
  // ──────────────────────────────────────────

  it('data-state başlangıçta idle / data-state is idle initially', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Test" />);

    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'idle');
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Test" classNames={{ root: 'slot-root' }} />);

    expect(screen.getByRole('button')).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    render(
      <IconButton icon={<TestIcon />} aria-label="Test" styles={{ root: { padding: '10px' } }} />,
    );

    expect(screen.getByRole('button')).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    render(
      <IconButton
        icon={<TestIcon />}
        aria-label="Test"
        className="legacy"
        classNames={{ root: 'slot-root' }}
      />,
    );
    const el = screen.getByRole('button');

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('style + styles.root birlestirilir', () => {
    render(
      <IconButton
        icon={<TestIcon />}
        aria-label="Test"
        style={{ marginTop: '5px' }}
        styles={{ root: { padding: '10px' } }}
      />,
    );
    const el = screen.getByRole('button');

    expect(el).toHaveStyle({ marginTop: '5px' });
    expect(el).toHaveStyle({ padding: '10px' });
  });

  it('classNames.spinner uygulanir', () => {
    render(
      <IconButton
        icon={<TestIcon />}
        aria-label="Test"
        loading
        classNames={{ spinner: 'my-spinner' }}
      />,
    );
    const button = screen.getByRole('button');
    const spinner = button.querySelector('[aria-hidden="true"]');

    expect(spinner).toHaveClass('my-spinner');
  });

  it('styles.spinner uygulanir', () => {
    render(
      <IconButton
        icon={<TestIcon />}
        aria-label="Test"
        loading
        styles={{ spinner: { opacity: 0.5 } }}
      />,
    );
    const button = screen.getByRole('button');
    const spinner = button.querySelector('[aria-hidden="true"]');

    expect(spinner).toHaveStyle({ opacity: '0.5' });
  });

  it('classNames.icon uygulanir', () => {
    render(
      <IconButton
        icon={<TestIcon />}
        aria-label="Test"
        classNames={{ icon: 'my-icon' }}
      />,
    );
    const button = screen.getByRole('button');
    const iconWrapper = button.querySelector('[aria-hidden="true"]');

    expect(iconWrapper).toHaveClass('my-icon');
  });

  it('styles.icon uygulanir', () => {
    render(
      <IconButton
        icon={<TestIcon />}
        aria-label="Test"
        styles={{ icon: { padding: '8px' } }}
      />,
    );
    const button = screen.getByRole('button');
    const iconWrapper = button.querySelector('[aria-hidden="true"]');

    expect(iconWrapper).toHaveStyle({ padding: '8px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<IconButton icon={<TestIcon />} aria-label="Test" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('IconButton (Compound)', () => {
  it('compound: Icon render edilir', () => {
    render(
      <IconButton aria-label="Ara">
        <IconButton.Icon><TestIcon /></IconButton.Icon>
      </IconButton>,
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByTestId('iconbutton-icon')).toBeInTheDocument();
  });

  it('compound: aria-label dogru set edilir', () => {
    render(
      <IconButton aria-label="Ayarlar">
        <IconButton.Icon><TestIcon /></IconButton.Icon>
      </IconButton>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Ayarlar');
  });

  it('compound: classNames context ile sub-component a aktarilir', () => {
    render(
      <IconButton aria-label="Test" classNames={{ icon: 'cmp-icon-cls' }}>
        <IconButton.Icon><TestIcon /></IconButton.Icon>
      </IconButton>,
    );
    expect(screen.getByTestId('iconbutton-icon').className).toContain('cmp-icon-cls');
  });

  it('compound: styles context ile sub-component a aktarilir', () => {
    render(
      <IconButton aria-label="Test" styles={{ icon: { letterSpacing: '3px' } }}>
        <IconButton.Icon><TestIcon /></IconButton.Icon>
      </IconButton>,
    );
    expect(screen.getByTestId('iconbutton-icon')).toHaveStyle({ letterSpacing: '3px' });
  });

  it('compound: context disinda kullanilirsa hata firlatir', () => {
    expect(() => {
      render(<IconButton.Icon><TestIcon /></IconButton.Icon>);
    }).toThrow('IconButton compound sub-components must be used within <IconButton>.');
  });
});
