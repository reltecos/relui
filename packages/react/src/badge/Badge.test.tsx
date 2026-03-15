/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────

  it('render edilir / renders correctly', () => {
    render(<Badge>Yeni</Badge>);

    expect(screen.getByText('Yeni')).toBeInTheDocument();
  });

  it('span elementi olarak render edilir', () => {
    const { container } = render(<Badge>Test</Badge>);

    expect(container.querySelector('span')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Children
  // ──────────────────────────────────────────

  it('metin içerik doğru render edilir', () => {
    render(<Badge>Aktif</Badge>);

    expect(screen.getByText('Aktif')).toBeInTheDocument();
  });

  it('sayısal içerik doğru render edilir', () => {
    render(<Badge>42</Badge>);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  // ──────────────────────────────────────────
  // Props forwarding
  // ──────────────────────────────────────────

  it('id doğru iletilir', () => {
    const { container } = render(<Badge id="my-badge">Test</Badge>);

    expect(container.querySelector('#my-badge')).toBeInTheDocument();
  });

  it('className doğru iletilir', () => {
    const { container } = render(<Badge className="custom">Test</Badge>);

    expect(container.querySelector('span')).toHaveClass('custom');
  });

  it('inline style doğru iletilir', () => {
    const { container } = render(<Badge style={{ marginLeft: '8px' }}>Test</Badge>);

    expect(container.querySelector('span')).toHaveStyle({ marginLeft: '8px' });
  });

  // ──────────────────────────────────────────
  // Ref forwarding
  // ──────────────────────────────────────────

  it('ref doğru iletilir', () => {
    let badgeRef: HTMLSpanElement | null = null;
    render(
      <Badge ref={(el) => { badgeRef = el; }}>Test</Badge>,
    );

    expect(badgeRef).toBeInstanceOf(HTMLSpanElement);
  });

  // ──────────────────────────────────────────
  // classNames & styles
  // ──────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    const { container } = render(<Badge classNames={{ root: 'slot-root' }}>Test</Badge>);

    expect(container.querySelector('span')).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    const { container } = render(<Badge styles={{ root: { padding: '10px' } }}>Test</Badge>);

    expect(container.querySelector('span')).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    const { container } = render(
      <Badge className="legacy" classNames={{ root: 'slot-root' }}>Test</Badge>,
    );
    const el = container.querySelector('span');

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('style + styles.root birlestirilir', () => {
    const { container } = render(
      <Badge style={{ margin: '4px' }} styles={{ root: { padding: '10px' } }}>Test</Badge>,
    );
    const el = container.querySelector('span');

    expect(el).toHaveStyle({ margin: '4px' });
    expect(el).toHaveStyle({ padding: '10px' });
  });

  // ── Icon (props-based) ──

  it('icon prop ile ikon render edilir', () => {
    render(<Badge icon={<span data-testid="my-icon">I</span>}>Test</Badge>);

    expect(screen.getByTestId('my-icon')).toBeInTheDocument();
    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
  });

  it('icon prop olmadan ikon render edilmez', () => {
    render(<Badge>Test</Badge>);

    expect(screen.queryByTestId('badge-icon')).not.toBeInTheDocument();
  });
});

// ── Compound API ──

describe('Badge (Compound)', () => {
  it('compound: Badge.Icon render edilir', () => {
    render(
      <Badge>
        <Badge.Icon><span data-testid="cmp-icon">I</span></Badge.Icon>
        Test
      </Badge>,
    );
    expect(screen.getByTestId('cmp-icon')).toBeInTheDocument();
    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
  });

  it('compound: metin icerik dogru render edilir', () => {
    render(
      <Badge>
        <Badge.Icon><span>I</span></Badge.Icon>
        Aktif
      </Badge>,
    );
    expect(screen.getByText('Aktif')).toBeInTheDocument();
  });

  it('compound: classNames context ile Badge.Icon a aktarilir', () => {
    render(
      <Badge classNames={{ icon: 'cmp-icon-cls' }}>
        <Badge.Icon><span>I</span></Badge.Icon>
        Test
      </Badge>,
    );
    expect(screen.getByTestId('badge-icon').className).toContain('cmp-icon-cls');
  });

  it('compound: styles context ile Badge.Icon a aktarilir', () => {
    render(
      <Badge styles={{ icon: { fontSize: '20px' } }}>
        <Badge.Icon><span>I</span></Badge.Icon>
        Test
      </Badge>,
    );
    expect(screen.getByTestId('badge-icon')).toHaveStyle({ fontSize: '20px' });
  });

  it('compound: root data-testid mevcut', () => {
    render(
      <Badge>
        <Badge.Icon><span>I</span></Badge.Icon>
        Test
      </Badge>,
    );
    expect(screen.getByTestId('badge-root')).toBeInTheDocument();
  });

  it('compound: Badge.Icon context disinda hata firlat', () => {
    expect(() => {
      render(<Badge.Icon><span>I</span></Badge.Icon>);
    }).toThrow('Badge compound sub-components must be used within <Badge>.');
  });
});
