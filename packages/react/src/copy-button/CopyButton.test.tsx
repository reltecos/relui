/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { CopyButton } from './CopyButton';

// ── Clipboard API mock ──────────────────────────────────────────
const writeTextMock = vi.fn(() => Promise.resolve());

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: { writeText: writeTextMock },
  });
  writeTextMock.mockClear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('CopyButton', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(<CopyButton value="test" aria-label="Kopyala" />);

    expect(screen.getByRole('button', { name: 'Kopyala' })).toBeInTheDocument();
  });

  it('button elementi olarak render edilir', () => {
    const { container } = render(<CopyButton value="test" aria-label="Kopyala" />);

    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('ikon span aria-hidden render eder', () => {
    const { container } = render(<CopyButton value="test" aria-label="Kopyala" />);
    const span = container.querySelector('span');

    expect(span).toHaveAttribute('aria-hidden', 'true');
  });

  // ──────────────────────────────────────────
  // Copy
  // ──────────────────────────────────────────

  it('click ile clipboard a kopyalar', async () => {
    render(<CopyButton value="merhaba" aria-label="Kopyala" />);
    const btn = screen.getByRole('button', { name: 'Kopyala' });

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(writeTextMock).toHaveBeenCalledWith('merhaba');
  });

  it('kopyalama sonrasi data-copied set edilir', async () => {
    render(<CopyButton value="test" aria-label="Kopyala" />);
    const btn = screen.getByRole('button', { name: 'Kopyala' });

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(btn).toHaveAttribute('data-copied', '');
  });

  it('copiedDuration sonrasi data-copied kalkar', async () => {
    render(<CopyButton value="test" aria-label="Kopyala" copiedDuration={1000} />);
    const btn = screen.getByRole('button', { name: 'Kopyala' });

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(btn).toHaveAttribute('data-copied', '');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(btn).not.toHaveAttribute('data-copied');
  });

  it('varsayilan copiedDuration 2000ms', async () => {
    render(<CopyButton value="test" aria-label="Kopyala" />);
    const btn = screen.getByRole('button', { name: 'Kopyala' });

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(btn).toHaveAttribute('data-copied', '');

    act(() => {
      vi.advanceTimersByTime(1999);
    });
    expect(btn).toHaveAttribute('data-copied', '');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(btn).not.toHaveAttribute('data-copied');
  });

  it('onCopy callback cagrilir', async () => {
    const handleCopy = vi.fn();
    render(<CopyButton value="test" aria-label="Kopyala" onCopy={handleCopy} />);
    const btn = screen.getByRole('button', { name: 'Kopyala' });

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(handleCopy).toHaveBeenCalledOnce();
  });

  // ──────────────────────────────────────────
  // Disabled
  // ──────────────────────────────────────────

  it('disabled durumda kopyalama calismiyor', async () => {
    render(<CopyButton value="test" aria-label="Kopyala" disabled />);
    const btn = screen.getByRole('button', { name: 'Kopyala' });

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(writeTextMock).not.toHaveBeenCalled();
  });

  it('disabled durumda buton disabled attribute alir', () => {
    render(<CopyButton value="test" aria-label="Kopyala" disabled />);
    const btn = screen.getByRole('button', { name: 'Kopyala' });

    expect(btn).toBeDisabled();
  });

  // ──────────────────────────────────────────
  // Custom icons
  // ──────────────────────────────────────────

  it('custom copyIcon render eder', () => {
    render(
      <CopyButton
        value="test"
        aria-label="Kopyala"
        copyIcon={<span data-testid="custom-copy">C</span>}
      />,
    );

    expect(screen.getByTestId('custom-copy')).toBeInTheDocument();
  });

  it('custom copiedIcon render eder', async () => {
    render(
      <CopyButton
        value="test"
        aria-label="Kopyala"
        copiedIcon={<span data-testid="custom-check">OK</span>}
      />,
    );
    const btn = screen.getByRole('button', { name: 'Kopyala' });

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(screen.getByTestId('custom-check')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id dogru iletilir', () => {
    const { container } = render(
      <CopyButton value="test" aria-label="Kopyala" id="my-copy" />,
    );

    expect(container.querySelector('#my-copy')).toBeInTheDocument();
  });

  it('className dogru iletilir', () => {
    render(<CopyButton value="test" aria-label="Kopyala" className="custom" />);
    const btn = screen.getByRole('button', { name: 'Kopyala' });

    expect(btn).toHaveClass('custom');
  });

  it('aria-label dogru set edilir', () => {
    render(<CopyButton value="test" aria-label="Kodu kopyala" />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Kodu kopyala');
  });
});

describe('CopyButton — classNames & styles', () => {
  // ── classNames & styles ──────────────────────────────────

  it('classNames.root uygulanir', () => {
    render(
      <CopyButton
        value="test"
        aria-label="Kopyala"
        classNames={{ root: 'slot-root' }}
      />,
    );

    expect(screen.getByRole('button')).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    render(
      <CopyButton
        value="test"
        aria-label="Kopyala"
        styles={{ root: { padding: '10px' } }}
      />,
    );

    expect(screen.getByRole('button')).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    render(
      <CopyButton
        value="test"
        aria-label="Kopyala"
        className="legacy"
        classNames={{ root: 'slot-root' }}
      />,
    );
    const btn = screen.getByRole('button');

    expect(btn).toHaveClass('legacy');
    expect(btn).toHaveClass('slot-root');
  });

  it('classNames.icon uygulanir', () => {
    const { container } = render(
      <CopyButton
        value="test"
        aria-label="Kopyala"
        classNames={{ icon: 'my-icon' }}
      />,
    );

    expect(container.querySelector('span')).toHaveClass('my-icon');
  });

  it('styles.icon uygulanir', () => {
    const { container } = render(
      <CopyButton
        value="test"
        aria-label="Kopyala"
        styles={{ icon: { fontSize: '20px' } }}
      />,
    );

    expect(container.querySelector('span')).toHaveStyle({ fontSize: '20px' });
  });
});

// ── Compound API ──

describe('CopyButton (Compound)', () => {
  it('compound: CopyButton.Icon render edilir', () => {
    render(
      <CopyButton value="test" aria-label="Kopyala">
        <CopyButton.Icon />
      </CopyButton>,
    );
    expect(screen.getByTestId('copy-button-icon')).toBeInTheDocument();
  });

  it('compound: CopyButton.Label render edilir', () => {
    render(
      <CopyButton value="test" aria-label="Kopyala">
        <CopyButton.Icon />
        <CopyButton.Label>Kopyala</CopyButton.Label>
      </CopyButton>,
    );
    expect(screen.getByTestId('copy-button-label')).toBeInTheDocument();
    expect(screen.getByTestId('copy-button-label')).toHaveTextContent('Kopyala');
  });

  it('compound: click ile kopyalama calisir', async () => {
    render(
      <CopyButton value="compound-test" aria-label="Kopyala">
        <CopyButton.Icon />
      </CopyButton>,
    );
    const btn = screen.getByRole('button', { name: 'Kopyala' });

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(writeTextMock).toHaveBeenCalledWith('compound-test');
    expect(btn).toHaveAttribute('data-copied', '');
  });

  it('compound: icon aria-hidden', () => {
    render(
      <CopyButton value="test" aria-label="Kopyala">
        <CopyButton.Icon />
      </CopyButton>,
    );
    expect(screen.getByTestId('copy-button-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<CopyButton value="test" aria-label="Kopyala" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
