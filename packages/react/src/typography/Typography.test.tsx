/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Typography } from './Typography';

describe('Typography', () => {
  // ── Props-based API ──

  it('root render edilir', () => {
    render(<Typography>Hello</Typography>);
    expect(screen.getByTestId('typography-root')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('varsayilan variant body1', () => {
    render(<Typography>Text</Typography>);
    expect(screen.getByTestId('typography-root')).toHaveAttribute('data-variant', 'body1');
  });

  it('variant h1 set edilir', () => {
    render(<Typography variant="h1">Baslik</Typography>);
    const el = screen.getByTestId('typography-root');
    expect(el).toHaveAttribute('data-variant', 'h1');
    expect(el.tagName).toBe('H1');
  });

  it('variant h3 uygun element kullanir', () => {
    render(<Typography variant="h3">Baslik</Typography>);
    expect(screen.getByTestId('typography-root').tagName).toBe('H3');
  });

  it('variant body2 p element kullanir', () => {
    render(<Typography variant="body2">Metin</Typography>);
    expect(screen.getByTestId('typography-root').tagName).toBe('P');
  });

  it('variant caption span element kullanir', () => {
    render(<Typography variant="caption">Kucuk</Typography>);
    expect(screen.getByTestId('typography-root').tagName).toBe('SPAN');
  });

  it('variant overline span element kullanir', () => {
    render(<Typography variant="overline">OVERLINE</Typography>);
    expect(screen.getByTestId('typography-root').tagName).toBe('SPAN');
  });

  it('variant subtitle1 h6 element kullanir', () => {
    render(<Typography variant="subtitle1">Sub</Typography>);
    expect(screen.getByTestId('typography-root').tagName).toBe('H6');
  });

  it('as prop ile element degisir', () => {
    render(<Typography variant="h1" as="div">Baslik</Typography>);
    expect(screen.getByTestId('typography-root').tagName).toBe('DIV');
  });

  it('gutterBottom margin-bottom ekler', () => {
    render(<Typography gutterBottom>Metin</Typography>);
    expect(screen.getByTestId('typography-root').className).toBeTruthy();
  });

  it('truncate overflow hidden ekler', () => {
    render(<Typography truncate>Uzun metin</Typography>);
    expect(screen.getByTestId('typography-root').className).toBeTruthy();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Typography className="my-typo">Text</Typography>);
    expect(screen.getByTestId('typography-root').className).toContain('my-typo');
  });

  it('style root elemana eklenir', () => {
    render(<Typography style={{ padding: '10px' }}>Text</Typography>);
    expect(screen.getByTestId('typography-root')).toHaveStyle({ padding: '10px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Typography classNames={{ root: 'custom-root' }}>Text</Typography>);
    expect(screen.getByTestId('typography-root').className).toContain('custom-root');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Typography styles={{ root: { padding: '20px' } }}>Text</Typography>);
    expect(screen.getByTestId('typography-root')).toHaveStyle({ padding: '20px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Typography ref={ref}>Text</Typography>);
    expect(ref).toHaveBeenCalled();
  });

  // ── Compound API: Typography.Heading ──

  it('Heading sub-component render edilir', () => {
    render(
      <Typography>
        <Typography.Heading level={2}>Baslik</Typography.Heading>
      </Typography>,
    );
    const heading = screen.getByTestId('typography-heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveTextContent('Baslik');
  });

  it('Heading varsayilan level 1', () => {
    render(
      <Typography>
        <Typography.Heading>H1</Typography.Heading>
      </Typography>,
    );
    expect(screen.getByTestId('typography-heading').tagName).toBe('H1');
  });

  it('Heading as prop ile element degisir', () => {
    render(
      <Typography>
        <Typography.Heading level={1} as="div">Div</Typography.Heading>
      </Typography>,
    );
    expect(screen.getByTestId('typography-heading').tagName).toBe('DIV');
  });

  // ── Compound API: Typography.Text ──

  it('Text sub-component render edilir', () => {
    render(
      <Typography>
        <Typography.Text>Metin</Typography.Text>
      </Typography>,
    );
    const text = screen.getByTestId('typography-text');
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent('Metin');
  });

  it('Text varsayilan variant body1, p element', () => {
    render(
      <Typography>
        <Typography.Text>Paragraf</Typography.Text>
      </Typography>,
    );
    expect(screen.getByTestId('typography-text').tagName).toBe('P');
  });

  it('Text variant caption span element kullanir', () => {
    render(
      <Typography>
        <Typography.Text variant="caption">Kucuk</Typography.Text>
      </Typography>,
    );
    expect(screen.getByTestId('typography-text').tagName).toBe('SPAN');
  });

  it('Text as prop ile element degisir', () => {
    render(
      <Typography>
        <Typography.Text as="span">Span</Typography.Text>
      </Typography>,
    );
    expect(screen.getByTestId('typography-text').tagName).toBe('SPAN');
  });

  // ── Compound: Heading + Text birlikte ──

  it('Heading ve Text birlikte render edilir', () => {
    render(
      <Typography>
        <Typography.Heading level={3}>Baslik</Typography.Heading>
        <Typography.Text variant="body2">Icerik</Typography.Text>
      </Typography>,
    );
    expect(screen.getByTestId('typography-heading')).toHaveTextContent('Baslik');
    expect(screen.getByTestId('typography-text')).toHaveTextContent('Icerik');
  });
});
