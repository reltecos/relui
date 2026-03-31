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
import { FileDrop } from './FileDrop';

describe('FileDrop', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<FileDrop />);
    expect(screen.getByTestId('file-drop-root')).toBeInTheDocument();
  });

  it('zone render edilir', () => {
    render(<FileDrop />);
    expect(screen.getByTestId('file-drop-zone')).toBeInTheDocument();
  });

  it('zone role=button sahiptir', () => {
    render(<FileDrop />);
    expect(screen.getByTestId('file-drop-zone')).toHaveAttribute('role', 'button');
  });

  it('zone upload metni gosterir', () => {
    render(<FileDrop />);
    expect(screen.getByText('Dosyalari surukleyin veya tiklayin')).toBeInTheDocument();
  });

  it('zone aria-label sahiptir', () => {
    render(<FileDrop />);
    expect(screen.getByTestId('file-drop-zone')).toHaveAttribute('aria-label', 'Drop files here');
  });

  it('zone tabIndex=0 sahiptir', () => {
    render(<FileDrop />);
    expect(screen.getByTestId('file-drop-zone')).toHaveAttribute('tabindex', '0');
  });

  // ── File List ──

  it('dosya listesi basta bos', () => {
    render(<FileDrop />);
    expect(screen.queryByTestId('file-drop-fileList')).not.toBeInTheDocument();
  });

  // ── Hidden Input ──

  it('gizli file input render edilir', () => {
    render(<FileDrop />);
    const input = screen.getByTestId('file-drop-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'file');
  });

  it('accept prop gizli inputa aktarilir', () => {
    render(<FileDrop accept="image/*" />);
    const input = screen.getByTestId('file-drop-input');
    expect(input).toHaveAttribute('accept', 'image/*');
  });

  it('multiple prop gizli inputa aktarilir', () => {
    render(<FileDrop multiple={false} />);
    const input = screen.getByTestId('file-drop-input');
    expect(input).not.toHaveAttribute('multiple');
  });

  it('multiple=true ise input multiple sahiptir', () => {
    render(<FileDrop multiple={true} />);
    const input = screen.getByTestId('file-drop-input');
    expect(input).toHaveAttribute('multiple');
  });

  // ── Drag Events ──

  it('dragOver event preventDefault cagirilir', () => {
    render(<FileDrop />);
    const zone = screen.getByTestId('file-drop-zone');
    const event = new Event('dragover', { bubbles: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    fireEvent(zone, event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('drop event preventDefault cagirilir', () => {
    render(<FileDrop />);
    const zone = screen.getByTestId('file-drop-zone');
    const event = new Event('drop', { bubbles: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    Object.defineProperty(event, 'dataTransfer', {
      value: { files: [] },
    });
    fireEvent(zone, event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  // ── Zone Click ──

  it('zone tiklandiginda gizli input click tetiklenir', () => {
    render(<FileDrop />);
    const input = screen.getByTestId('file-drop-input');
    const clickSpy = vi.spyOn(input, 'click');
    const zone = screen.getByTestId('file-drop-zone');
    fireEvent.click(zone);
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  // ── Keyboard ──

  it('Enter tusuna basinca gizli input click tetiklenir', () => {
    render(<FileDrop />);
    const input = screen.getByTestId('file-drop-input');
    const clickSpy = vi.spyOn(input, 'click');
    const zone = screen.getByTestId('file-drop-zone');
    fireEvent.keyDown(zone, { key: 'Enter' });
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('Space tusuna basinca gizli input click tetiklenir', () => {
    render(<FileDrop />);
    const input = screen.getByTestId('file-drop-input');
    const clickSpy = vi.spyOn(input, 'click');
    const zone = screen.getByTestId('file-drop-zone');
    fireEvent.keyDown(zone, { key: ' ' });
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<FileDrop className="my-filedrop" />);
    expect(screen.getByTestId('file-drop-root').className).toContain('my-filedrop');
  });

  it('style root elemana eklenir', () => {
    render(<FileDrop style={{ padding: '16px' }} />);
    expect(screen.getByTestId('file-drop-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<FileDrop classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('file-drop-root').className).toContain('custom-root');
  });

  it('classNames.zone zone elemana eklenir', () => {
    render(<FileDrop classNames={{ zone: 'custom-zone' }} />);
    expect(screen.getByTestId('file-drop-zone').className).toContain('custom-zone');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<FileDrop styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('file-drop-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.zone zone elemana eklenir', () => {
    render(<FileDrop styles={{ zone: { padding: '40px' } }} />);
    expect(screen.getByTestId('file-drop-zone')).toHaveStyle({ padding: '40px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<FileDrop ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('FileDrop (Compound)', () => {
  it('compound: Zone render edilir', () => {
    render(
      <FileDrop>
        <FileDrop.Zone />
      </FileDrop>,
    );
    expect(screen.getByTestId('file-drop-zone')).toBeInTheDocument();
  });

  it('compound: Zone ozel icerik render eder', () => {
    render(
      <FileDrop>
        <FileDrop.Zone>
          <span data-testid="custom-zone-content">Custom content</span>
        </FileDrop.Zone>
      </FileDrop>,
    );
    expect(screen.getByTestId('custom-zone-content')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <FileDrop classNames={{ zone: 'cmp-zone' }}>
        <FileDrop.Zone />
      </FileDrop>,
    );
    expect(screen.getByTestId('file-drop-zone').className).toContain('cmp-zone');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <FileDrop styles={{ zone: { padding: '50px' } }}>
        <FileDrop.Zone />
      </FileDrop>,
    );
    expect(screen.getByTestId('file-drop-zone')).toHaveStyle({ padding: '50px' });
  });

  it('FileDrop.Zone context disinda hata firlatir', () => {
    expect(() => render(<FileDrop.Zone />)).toThrow();
  });

  it('FileDrop.FileList context disinda hata firlatir', () => {
    expect(() => render(<FileDrop.FileList />)).toThrow();
  });
});

// ── formatFileSize ──

describe('formatFileSize', () => {
  it('0 B formatlar', async () => {
    const { formatFileSize } = await import('./FileDrop');
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('byte formatlar', async () => {
    const { formatFileSize } = await import('./FileDrop');
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('KB formatlar', async () => {
    const { formatFileSize } = await import('./FileDrop');
    expect(formatFileSize(1024)).toBe('1 KB');
  });

  it('MB formatlar', async () => {
    const { formatFileSize } = await import('./FileDrop');
    const result = formatFileSize(5 * 1024 * 1024);
    expect(result).toBe('5 MB');
  });
});
