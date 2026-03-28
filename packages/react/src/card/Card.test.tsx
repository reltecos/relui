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
import { Card } from './Card';

describe('Card', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Card>Content</Card>);
    expect(screen.getByTestId('card-root')).toBeInTheDocument();
  });

  it('children body olarak render edilir', () => {
    render(<Card><p>Hello</p></Card>);
    expect(screen.getByTestId('card-body')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('children olmadan body render edilmez', () => {
    render(<Card title="Test" />);
    expect(screen.queryByTestId('card-body')).not.toBeInTheDocument();
  });

  // ── Variant ──

  it('varsayilan variant elevated', () => {
    render(<Card>Content</Card>);
    expect(screen.getByTestId('card-root')).toHaveAttribute('data-variant', 'elevated');
  });

  it('variant outlined set edilir', () => {
    render(<Card variant="outlined">Content</Card>);
    expect(screen.getByTestId('card-root')).toHaveAttribute('data-variant', 'outlined');
  });

  it('variant filled set edilir', () => {
    render(<Card variant="filled">Content</Card>);
    expect(screen.getByTestId('card-root')).toHaveAttribute('data-variant', 'filled');
  });

  // ── Header ──

  it('title verilince header render edilir', () => {
    render(<Card title="Baslik" />);
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent('Baslik');
  });

  it('subtitle render edilir', () => {
    render(<Card title="Baslik" subtitle="Alt baslik" />);
    expect(screen.getByTestId('card-subtitle')).toHaveTextContent('Alt baslik');
  });

  it('action render edilir', () => {
    render(<Card title="Baslik" action={<button>Action</button>} />);
    expect(screen.getByTestId('card-action')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('title/subtitle/action olmadan header render edilmez', () => {
    render(<Card>Content</Card>);
    expect(screen.queryByTestId('card-header')).not.toBeInTheDocument();
  });

  it('sadece action verilince de header render edilir', () => {
    render(<Card action={<button>Menu</button>} />);
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.queryByTestId('card-title')).not.toBeInTheDocument();
  });

  // ── Footer ──

  it('footer render edilir', () => {
    render(<Card footer={<button>Kaydet</button>}>Content</Card>);
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    expect(screen.getByText('Kaydet')).toBeInTheDocument();
  });

  it('footer olmadan footer render edilmez', () => {
    render(<Card>Content</Card>);
    expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument();
  });

  // ── Media ──

  it('media render edilir', () => {
    render(<Card media={{ src: 'test.jpg', alt: 'Test' }}>Content</Card>);
    const img = screen.getByTestId('card-media');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test.jpg');
    expect(img).toHaveAttribute('alt', 'Test');
  });

  it('media height set edilir', () => {
    render(<Card media={{ src: 'test.jpg', alt: 'Test', height: 200 }}>Content</Card>);
    expect(screen.getByTestId('card-media')).toHaveStyle({ height: '200px' });
  });

  it('media olmadan img render edilmez', () => {
    render(<Card>Content</Card>);
    expect(screen.queryByTestId('card-media')).not.toBeInTheDocument();
  });

  // ── Tam kullanim ──

  it('tum prop larla tam render', () => {
    render(
      <Card
        variant="outlined"
        title="Baslik"
        subtitle="Alt baslik"
        media={{ src: 'photo.jpg', alt: 'Photo', height: 180 }}
        action={<button>Menu</button>}
        footer={<button>Aksiyon</button>}
      >
        <p>Icerik</p>
      </Card>,
    );
    expect(screen.getByTestId('card-root')).toBeInTheDocument();
    expect(screen.getByTestId('card-media')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-body')).toBeInTheDocument();
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    expect(screen.getByText('Baslik')).toBeInTheDocument();
    expect(screen.getByText('Alt baslik')).toBeInTheDocument();
    expect(screen.getByText('Icerik')).toBeInTheDocument();
    expect(screen.getByText('Aksiyon')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Card className="my-card">Content</Card>);
    expect(screen.getByTestId('card-root').className).toContain('my-card');
  });

  it('style root elemana eklenir', () => {
    render(<Card style={{ padding: '20px' }}>Content</Card>);
    expect(screen.getByTestId('card-root')).toHaveStyle({ padding: '20px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Card classNames={{ root: 'custom-root' }}>Content</Card>);
    expect(screen.getByTestId('card-root').className).toContain('custom-root');
  });

  it('classNames.header header elemana eklenir', () => {
    render(<Card title="Test" classNames={{ header: 'custom-header' }} />);
    expect(screen.getByTestId('card-header').className).toContain('custom-header');
  });

  it('classNames.body body elemana eklenir', () => {
    render(<Card classNames={{ body: 'custom-body' }}>Content</Card>);
    expect(screen.getByTestId('card-body').className).toContain('custom-body');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Card styles={{ root: { padding: '24px' } }}>Content</Card>);
    expect(screen.getByTestId('card-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.header header elemana eklenir', () => {
    render(<Card title="Test" styles={{ header: { fontSize: '18px' } }} />);
    expect(screen.getByTestId('card-header')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.body body elemana eklenir', () => {
    render(<Card styles={{ body: { letterSpacing: '0.05em' } }}>Content</Card>);
    expect(screen.getByTestId('card-body')).toHaveStyle({ letterSpacing: '0.05em' });
  });

  it('styles.footer footer elemana eklenir', () => {
    render(<Card footer={<span>F</span>} styles={{ footer: { padding: '16px' } }} />);
    expect(screen.getByTestId('card-footer')).toHaveStyle({ padding: '16px' });
  });

  it('styles.title title elemana eklenir', () => {
    render(<Card title="Test" styles={{ title: { fontSize: '24px' } }} />);
    expect(screen.getByTestId('card-title')).toHaveStyle({ fontSize: '24px' });
  });

  it('styles.subtitle subtitle elemana eklenir', () => {
    render(<Card title="T" subtitle="Alt" styles={{ subtitle: { letterSpacing: '0.05em' } }} />);
    expect(screen.getByTestId('card-subtitle')).toHaveStyle({ letterSpacing: '0.05em' });
  });

  it('styles.media media elemana eklenir', () => {
    render(
      <Card media={{ src: 'test.jpg', alt: 'Test' }} styles={{ media: { opacity: '0.8' } }}>
        Content
      </Card>,
    );
    expect(screen.getByTestId('card-media')).toHaveStyle({ opacity: '0.8' });
  });

  it('styles.action action elemana eklenir', () => {
    render(
      <Card title="T" action={<button>Act</button>} styles={{ action: { padding: '20px' } }} />,
    );
    expect(screen.getByTestId('card-action')).toHaveStyle({ padding: '20px' });
  });

  // ── ReactNode title ──

  it('title ReactNode olabilir', () => {
    render(<Card title={<em data-testid="em-title">Italic</em>} />);
    expect(screen.getByTestId('em-title')).toBeInTheDocument();
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Content</Card>);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Card (Compound)', () => {
  it('compound: header render edilir', () => {
    render(
      <Card compound>
        <Card.Header>Baslik Alani</Card.Header>
        <Card.Body>Icerik</Card.Body>
      </Card>,
    );
    expect(screen.getByTestId('card-header')).toHaveTextContent('Baslik Alani');
  });

  it('compound: body render edilir', () => {
    render(
      <Card compound>
        <Card.Body>Icerik burasi</Card.Body>
      </Card>,
    );
    expect(screen.getByTestId('card-body')).toHaveTextContent('Icerik burasi');
  });

  it('compound: footer render edilir', () => {
    render(
      <Card compound>
        <Card.Body>Icerik</Card.Body>
        <Card.Footer>Footer alani</Card.Footer>
      </Card>,
    );
    expect(screen.getByTestId('card-footer')).toHaveTextContent('Footer alani');
  });

  it('compound: tum sub-component lar birlikte render edilir', () => {
    render(
      <Card compound>
        <Card.Header>Baslik</Card.Header>
        <Card.Body>Icerik</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    );
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-body')).toBeInTheDocument();
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
  });

  it('compound: variant context ile aktarilir', () => {
    render(
      <Card compound variant="outlined">
        <Card.Body>Icerik</Card.Body>
      </Card>,
    );
    expect(screen.getByTestId('card-root')).toHaveAttribute('data-variant', 'outlined');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Card compound classNames={{ body: 'cmp-body' }}>
        <Card.Body>Icerik</Card.Body>
      </Card>,
    );
    expect(screen.getByTestId('card-body').className).toContain('cmp-body');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Card compound styles={{ body: { fontSize: '18px' } }}>
        <Card.Body>Icerik</Card.Body>
      </Card>,
    );
    expect(screen.getByTestId('card-body')).toHaveStyle({ fontSize: '18px' });
  });

  it('compound: context disinda kullanim hata firlat', () => {
    expect(() => render(<Card.Header>Baslik</Card.Header>)).toThrow(
      'Card compound sub-components must be used within <Card>.',
    );
  });

  it('compound: compound prop ile zorlanir', () => {
    render(
      <Card compound title="Baslik">
        <Card.Body>Icerik</Card.Body>
      </Card>,
    );
    expect(screen.getByTestId('card-body')).toBeInTheDocument();
    expect(screen.queryByTestId('card-title')).not.toBeInTheDocument();
  });
});
