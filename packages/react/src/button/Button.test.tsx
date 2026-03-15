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
import { Button } from './Button';

describe('Button', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('children render eder / renders children', () => {
    render(<Button>Kaydet</Button>);
    expect(screen.getByRole('button', { name: 'Kaydet' })).toBeInTheDocument();
  });

  it('native button olarak render eder / renders as native button', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');

    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('submit type destekler / supports submit type', () => {
    render(<Button type="submit">Gönder</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  // ──────────────────────────────────────────
  // Click
  // ──────────────────────────────────────────

  it('onClick çağrılır / onClick is called', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Tıkla</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda click engellenir / click is blocked when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Tıkla</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('disabled durumda doğru ARIA attribute / correct ARIA when disabled', () => {
    render(<Button disabled>Test</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('data-disabled', '');
  });

  // ──────────────────────────────────────────
  // Loading
  // ──────────────────────────────────────────

  it('loading durumda click engellenir / click is blocked when loading', () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Kaydet</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('loading durumda aria-busy / aria-busy when loading', () => {
    render(<Button loading>Kaydet</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('data-loading', '');
  });

  it('loading durumda spinner gösterir / shows spinner when loading', () => {
    render(<Button loading>Kaydet</Button>);
    const button = screen.getByRole('button');

    // Spinner aria-hidden olmalı
    const spinner = button.querySelector('[aria-hidden="true"]');
    expect(spinner).toBeInTheDocument();
  });

  it('loadingText gösterir / shows loadingText', () => {
    render(<Button loading loadingText="Kaydediliyor...">Kaydet</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Kaydediliyor...');
  });

  // ──────────────────────────────────────────
  // Icons
  // ──────────────────────────────────────────

  it('leftIcon render eder / renders leftIcon', () => {
    render(
      <Button leftIcon={<span data-testid="left-icon">L</span>}>Test</Button>,
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('rightIcon render eder / renders rightIcon', () => {
    render(
      <Button rightIcon={<span data-testid="right-icon">R</span>}>Test</Button>,
    );
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('loading durumda ikonlar gizlenir / icons hidden when loading', () => {
    render(
      <Button
        loading
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      >
        Test
      </Button>,
    );
    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id prop iletir / forwards id prop', () => {
    render(<Button id="my-button">Test</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('id', 'my-button');
  });

  it('className eklenir / className is added', () => {
    render(<Button className="custom-class">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('inline style uygulanır / inline style is applied', () => {
    render(<Button style={{ marginTop: '1rem' }}>Test</Button>);
    expect(screen.getByRole('button')).toHaveStyle({ marginTop: '1rem' });
  });

  // ──────────────────────────────────────────
  // Variants (CSS class uygulanıyor mu)
  // ──────────────────────────────────────────

  it('data-state idle ile başlar / starts with data-state idle', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'idle');
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    render(<Button classNames={{ root: 'slot-root' }}>Test</Button>);

    expect(screen.getByRole('button')).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    render(<Button styles={{ root: { padding: '10px' } }}>Test</Button>);

    expect(screen.getByRole('button')).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    render(
      <Button className="legacy" classNames={{ root: 'slot-root' }}>Test</Button>,
    );
    const el = screen.getByRole('button');

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('style + styles.root birlestirilir', () => {
    render(
      <Button style={{ marginTop: '5px' }} styles={{ root: { padding: '10px' } }}>
        Test
      </Button>,
    );
    const el = screen.getByRole('button');

    expect(el).toHaveStyle({ marginTop: '5px' });
    expect(el).toHaveStyle({ padding: '10px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Test</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it('classNames.spinner uygulanir', () => {
    render(<Button loading classNames={{ spinner: 'my-spinner' }}>Test</Button>);
    const button = screen.getByRole('button');
    const spinner = button.querySelector('[aria-hidden="true"]');

    expect(spinner).toHaveClass('my-spinner');
  });

  it('styles.spinner uygulanir', () => {
    render(<Button loading styles={{ spinner: { opacity: 0.5 } }}>Test</Button>);
    const button = screen.getByRole('button');
    const spinner = button.querySelector('[aria-hidden="true"]');

    expect(spinner).toHaveStyle({ opacity: '0.5' });
  });

  it('classNames.leftIcon uygulanir', () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">L</span>}
        classNames={{ leftIcon: 'my-left-icon' }}
      >
        Test
      </Button>,
    );
    const iconWrapper = screen.getByTestId('left-icon').parentElement;

    expect(iconWrapper).toHaveClass('my-left-icon');
  });

  it('styles.leftIcon uygulanir', () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">L</span>}
        styles={{ leftIcon: { padding: '13px' } }}
      >
        Test
      </Button>,
    );
    const iconWrapper = screen.getByTestId('left-icon').parentElement;

    expect(iconWrapper).toHaveStyle({ padding: '13px' });
  });

  it('classNames.rightIcon uygulanir', () => {
    render(
      <Button
        rightIcon={<span data-testid="right-icon">R</span>}
        classNames={{ rightIcon: 'my-right-icon' }}
      >
        Test
      </Button>,
    );
    const iconWrapper = screen.getByTestId('right-icon').parentElement;

    expect(iconWrapper).toHaveClass('my-right-icon');
  });

  it('styles.rightIcon uygulanir', () => {
    render(
      <Button
        rightIcon={<span data-testid="right-icon">R</span>}
        styles={{ rightIcon: { padding: '17px' } }}
      >
        Test
      </Button>,
    );
    const iconWrapper = screen.getByTestId('right-icon').parentElement;

    expect(iconWrapper).toHaveStyle({ padding: '17px' });
  });
});

// ── Compound API ──

describe('Button (Compound)', () => {
  it('compound: LeftIcon render edilir', () => {
    render(
      <Button>
        <Button.LeftIcon><span data-testid="cmp-left">L</span></Button.LeftIcon>
        Kaydet
      </Button>,
    );
    expect(screen.getByTestId('cmp-left')).toBeInTheDocument();
    expect(screen.getByTestId('button-lefticon')).toBeInTheDocument();
  });

  it('compound: RightIcon render edilir', () => {
    render(
      <Button>
        Devam
        <Button.RightIcon><span data-testid="cmp-right">R</span></Button.RightIcon>
      </Button>,
    );
    expect(screen.getByTestId('cmp-right')).toBeInTheDocument();
    expect(screen.getByTestId('button-righticon')).toBeInTheDocument();
  });

  it('compound: LeftIcon + RightIcon birlikte render edilir', () => {
    render(
      <Button>
        <Button.LeftIcon><span data-testid="cmp-left">L</span></Button.LeftIcon>
        Ara
        <Button.RightIcon><span data-testid="cmp-right">R</span></Button.RightIcon>
      </Button>,
    );
    expect(screen.getByTestId('cmp-left')).toBeInTheDocument();
    expect(screen.getByTestId('cmp-right')).toBeInTheDocument();
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Button classNames={{ leftIcon: 'cmp-left-cls' }}>
        <Button.LeftIcon><span>L</span></Button.LeftIcon>
        Test
      </Button>,
    );
    expect(screen.getByTestId('button-lefticon').className).toContain('cmp-left-cls');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Button styles={{ rightIcon: { letterSpacing: '3px' } }}>
        Test
        <Button.RightIcon><span>R</span></Button.RightIcon>
      </Button>,
    );
    expect(screen.getByTestId('button-righticon')).toHaveStyle({ letterSpacing: '3px' });
  });

  it('compound: context disinda kullanilirsa hata firlatir', () => {
    expect(() => {
      render(<Button.LeftIcon><span>L</span></Button.LeftIcon>);
    }).toThrow('Button compound sub-components must be used within <Button>.');
  });
});
