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
import { Alert } from './Alert';

// ── Render ─────────────────────────────────────────────

describe('Alert render', () => {
  it('alert render eder', () => {
    render(<Alert>Mesaj</Alert>);
    expect(screen.getByTestId('alert')).toBeInTheDocument();
  });

  it('children render eder', () => {
    render(<Alert>Test mesaji</Alert>);
    expect(screen.getByText('Test mesaji')).toBeInTheDocument();
  });

  it('title render eder', () => {
    render(<Alert title="Baslik">Aciklama</Alert>);
    expect(screen.getByText('Baslik')).toBeInTheDocument();
    expect(screen.getByText('Aciklama')).toBeInTheDocument();
  });

  it('ref destekler', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Alert ref={ref}>Mesaj</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('id prop destekler', () => {
    render(<Alert id="my-alert">Mesaj</Alert>);
    expect(document.getElementById('my-alert')).toBeInTheDocument();
  });

  it('varsayilan ikon render eder', () => {
    render(<Alert>Mesaj</Alert>);
    const alert = screen.getByTestId('alert');
    expect(alert.querySelector('svg')).toBeInTheDocument();
  });

  it('ozel ikon render eder', () => {
    render(<Alert icon={<span data-testid="custom-icon">!</span>}>Mesaj</Alert>);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('ikon null ile gizlenir', () => {
    render(<Alert icon={null}>Mesaj</Alert>);
    const alert = screen.getByTestId('alert');
    expect(alert.querySelector('svg')).not.toBeInTheDocument();
  });
});

// ── Severity ────────────────────────────────────────────

describe('Alert severity', () => {
  it.each(['info', 'success', 'warning', 'error'] as const)(
    '%s severity render eder',
    (severity) => {
      render(<Alert severity={severity}>Mesaj</Alert>);
      expect(screen.getByTestId('alert')).toHaveAttribute('data-severity', severity);
    },
  );
});

// ── Variants ────────────────────────────────────────────

describe('Alert variants', () => {
  it.each(['filled', 'outline', 'subtle'] as const)(
    '%s variant render eder',
    (variant) => {
      render(<Alert variant={variant}>Mesaj</Alert>);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
    },
  );
});

// ── Sizes ────────────────────────────────────────────

describe('Alert sizes', () => {
  it.each(['sm', 'md', 'lg'] as const)(
    '%s boyutu render eder',
    (size) => {
      render(<Alert size={size}>Mesaj</Alert>);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
    },
  );
});

// ── Closable ────────────────────────────────────────────

describe('Alert closable', () => {
  it('closable=false iken kapat butonu yok', () => {
    render(<Alert>Mesaj</Alert>);
    expect(screen.queryByTestId('alert-close')).not.toBeInTheDocument();
  });

  it('closable=true iken kapat butonu var', () => {
    render(<Alert closable>Mesaj</Alert>);
    expect(screen.getByTestId('alert-close')).toBeInTheDocument();
  });

  it('kapat butonu tiklaninca gizlenir', () => {
    render(<Alert closable>Mesaj</Alert>);
    fireEvent.click(screen.getByTestId('alert-close'));
    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
  });

  it('onClose callback cagrilir', () => {
    const onClose = vi.fn();
    render(<Alert closable onClose={onClose}>Mesaj</Alert>);
    fireEvent.click(screen.getByTestId('alert-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ── Controlled ──────────────────────────────────────────

describe('Alert controlled', () => {
  it('open=false iken gizli', () => {
    render(<Alert open={false}>Mesaj</Alert>);
    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
  });

  it('open=true iken gorunur', () => {
    render(<Alert open={true}>Mesaj</Alert>);
    expect(screen.getByTestId('alert')).toBeInTheDocument();
  });
});

// ── Action ──────────────────────────────────────────────

describe('Alert action', () => {
  it('action alani render eder', () => {
    render(
      <Alert action={<button data-testid="action-btn">Yeniden dene</button>}>
        Hata olustu
      </Alert>,
    );
    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });
});

// ── A11y ────────────────────────────────────────────────

describe('Alert a11y', () => {
  it('role=alert ayarlar', () => {
    render(<Alert>Mesaj</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('kapat butonu aria-label tasir', () => {
    render(<Alert closable>Mesaj</Alert>);
    expect(screen.getByTestId('alert-close')).toHaveAttribute('aria-label', 'Close');
  });

  it('kapat butonu type=button', () => {
    render(<Alert closable>Mesaj</Alert>);
    expect(screen.getByTestId('alert-close')).toHaveAttribute('type', 'button');
  });
});

// ── Slot API ────────────────────────────────────────────

describe('Alert slot API', () => {
  it('className root slot', () => {
    render(<Alert className="custom-alert">Mesaj</Alert>);
    expect(screen.getByTestId('alert').className).toContain('custom-alert');
  });

  it('style root slot', () => {
    render(<Alert style={{ opacity: 0.5 }}>Mesaj</Alert>);
    expect(screen.getByTestId('alert').style.opacity).toBe('0.5');
  });

  it('classNames.root slot', () => {
    render(<Alert classNames={{ root: 'my-alert' }}>Mesaj</Alert>);
    expect(screen.getByTestId('alert').className).toContain('my-alert');
  });

  it('styles.root slot', () => {
    render(<Alert styles={{ root: { fontSize: '20px' } }}>Mesaj</Alert>);
    expect(screen.getByTestId('alert').style.fontSize).toBe('20px');
  });
});
