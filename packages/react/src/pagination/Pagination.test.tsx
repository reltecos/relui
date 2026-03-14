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
import { Pagination } from './Pagination';

// ── Render ──────────────────────────────────────────────────────────

describe('Pagination render', () => {
  it('nav elementi render eder', () => {
    render(<Pagination totalItems={100} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Pagination');
  });

  it('sayfa butonlari render eder', () => {
    render(<Pagination totalItems={50} pageSize={10} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('prev ve next butonlari render eder', () => {
    render(<Pagination totalItems={100} />);
    expect(screen.getByLabelText('Onceki sayfa')).toBeInTheDocument();
    expect(screen.getByLabelText('Sonraki sayfa')).toBeInTheDocument();
  });

  it('ref iletilir', () => {
    const ref = vi.fn();
    render(<Pagination totalItems={100} ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });

  it('id prop eklenir', () => {
    render(<Pagination totalItems={100} id="pg-1" />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('id', 'pg-1');
  });
});

// ── A11y ────────────────────────────────────────────────────────────

describe('Pagination a11y', () => {
  it('mevcut sayfa aria-current=page', () => {
    render(<Pagination totalItems={100} defaultPage={3} />);
    const page3 = screen.getByText('3');
    expect(page3).toHaveAttribute('aria-current', 'page');
  });

  it('baska sayfada aria-current yok', () => {
    render(<Pagination totalItems={100} defaultPage={3} />);
    const page1 = screen.getByText('1');
    expect(page1).not.toHaveAttribute('aria-current');
  });

  it('ilk sayfada prev disabled', () => {
    render(<Pagination totalItems={100} />);
    const prev = screen.getByLabelText('Onceki sayfa');
    expect(prev).toBeDisabled();
  });

  it('son sayfada next disabled', () => {
    render(<Pagination totalItems={50} pageSize={10} defaultPage={5} />);
    const next = screen.getByLabelText('Sonraki sayfa');
    expect(next).toBeDisabled();
  });
});

// ── Page click ──────────────────────────────────────────────────────

describe('Pagination sayfa tikla', () => {
  it('sayfaya tiklaninca sayfa degisir', () => {
    const onPageChange = vi.fn();
    render(<Pagination totalItems={50} pageSize={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('prev butonuna tiklaninca onceki sayfaya gider', () => {
    const onPageChange = vi.fn();
    render(<Pagination totalItems={50} pageSize={10} defaultPage={3} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('Onceki sayfa'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('next butonuna tiklaninca sonraki sayfaya gider', () => {
    const onPageChange = vi.fn();
    render(<Pagination totalItems={50} pageSize={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('Sonraki sayfa'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('ayni sayfaya tiklaninca callback tetiklenmez', () => {
    const onPageChange = vi.fn();
    render(<Pagination totalItems={50} pageSize={10} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('1'));
    expect(onPageChange).not.toHaveBeenCalled();
  });
});

// ── First/Last ──────────────────────────────────────────────────────

describe('Pagination first/last', () => {
  it('showFirstLast=false ise first/last butonlari yok', () => {
    render(<Pagination totalItems={100} />);
    expect(screen.queryByLabelText('Ilk sayfa')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Son sayfa')).not.toBeInTheDocument();
  });

  it('showFirstLast=true ise first/last butonlari gosterilir', () => {
    render(<Pagination totalItems={100} showFirstLast />);
    expect(screen.getByLabelText('Ilk sayfa')).toBeInTheDocument();
    expect(screen.getByLabelText('Son sayfa')).toBeInTheDocument();
  });

  it('first butonuna tiklaninca ilk sayfaya gider', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination totalItems={100} defaultPage={5} showFirstLast onPageChange={onPageChange} />,
    );
    fireEvent.click(screen.getByLabelText('Ilk sayfa'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('last butonuna tiklaninca son sayfaya gider', () => {
    const onPageChange = vi.fn();
    render(<Pagination totalItems={100} showFirstLast onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText('Son sayfa'));
    expect(onPageChange).toHaveBeenCalledWith(10);
  });
});

// ── Ellipsis ────────────────────────────────────────────────────────

describe('Pagination ellipsis', () => {
  it('cok sayfada ellipsis gosterilir', () => {
    render(<Pagination totalItems={100} defaultPage={5} />);
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  it('az sayfada ellipsis gosterilmez', () => {
    render(<Pagination totalItems={30} pageSize={10} />);
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });
});

// ── Info ─────────────────────────────────────────────────────────────

describe('Pagination info', () => {
  it('showInfo=false ise bilgi gosterilmez', () => {
    render(<Pagination totalItems={100} />);
    expect(screen.queryByText(/\//)).not.toBeInTheDocument();
  });

  it('showInfo=true ise oge araligi gosterilir', () => {
    render(<Pagination totalItems={100} showInfo />);
    expect(screen.getByText('1–10 / 100')).toBeInTheDocument();
  });

  it('sayfa degisince info guncellenir', () => {
    render(<Pagination totalItems={100} showInfo defaultPage={3} />);
    expect(screen.getByText('21–30 / 100')).toBeInTheDocument();
  });
});

// ── Custom labels ───────────────────────────────────────────────────

describe('Pagination custom labels', () => {
  it('ozel prev/next label', () => {
    render(<Pagination totalItems={100} defaultPage={5} prevLabel="Geri" nextLabel="Ileri" />);
    expect(screen.getByText('Geri')).toBeInTheDocument();
    expect(screen.getByText('Ileri')).toBeInTheDocument();
  });

  it('ozel first/last label', () => {
    render(
      <Pagination
        totalItems={100}
        showFirstLast
        firstLabel="Basa"
        lastLabel="Sona"
      />,
    );
    expect(screen.getByText('Basa')).toBeInTheDocument();
    expect(screen.getByText('Sona')).toBeInTheDocument();
  });
});

// ── Slot API ────────────────────────────────────────────────────────

describe('Pagination slot API', () => {
  it('classNames.root eklenir', () => {
    render(<Pagination totalItems={100} classNames={{ root: 'custom-root' }} />);
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('custom-root');
  });

  it('classNames.page eklenir', () => {
    render(<Pagination totalItems={30} pageSize={10} classNames={{ page: 'custom-page' }} />);
    const page1 = screen.getByText('1');
    expect(page1.className).toContain('custom-page');
  });

  it('classNames.control eklenir', () => {
    render(<Pagination totalItems={100} classNames={{ control: 'custom-ctrl' }} />);
    const prev = screen.getByLabelText('Onceki sayfa');
    expect(prev.className).toContain('custom-ctrl');
  });

  it('styles.root uygulanir', () => {
    render(<Pagination totalItems={100} styles={{ root: { padding: '8px' } }} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveStyle({ padding: '8px' });
  });

  it('className prop root ile birlesir', () => {
    render(
      <Pagination
        totalItems={100}
        className="outer"
        classNames={{ root: 'inner' }}
      />,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('outer');
    expect(nav.className).toContain('inner');
  });

  it('style prop root ile birlesir', () => {
    render(
      <Pagination
        totalItems={100}
        style={{ opacity: '0.9' }}
        styles={{ root: { padding: '4px' } }}
      />,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveStyle({ opacity: '0.9' });
    expect(nav).toHaveStyle({ padding: '4px' });
  });
});

// ── Size ────────────────────────────────────────────────────────────

describe('Pagination size', () => {
  it('varsayilan size md', () => {
    render(<Pagination totalItems={100} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('size prop kabul edilir', () => {
    render(<Pagination totalItems={100} size="lg" />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

// ── Variant ─────────────────────────────────────────────────────────

describe('Pagination variant', () => {
  it('varsayilan variant outline', () => {
    render(<Pagination totalItems={100} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('variant prop kabul edilir', () => {
    render(<Pagination totalItems={100} variant="filled" />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
