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
import { Section } from './Section';

describe('Section', () => {
  // ── Root ──
  it('renders as section element', () => {
    render(<Section data-testid="section">content</Section>);
    const el = screen.getByTestId('section');
    expect(el.tagName).toBe('SECTION');
    expect(el).toHaveTextContent('content');
  });

  it('applies sprinkles props', () => {
    render(<Section data-testid="section" display="flex" gap={4} p={6} />);
    expect(screen.getByTestId('section').className).toBeTruthy();
  });

  it('passes through HTML attributes', () => {
    render(
      <Section data-testid="section" id="features" aria-labelledby="title" />,
    );
    const el = screen.getByTestId('section');
    expect(el).toHaveAttribute('id', 'features');
    expect(el).toHaveAttribute('aria-labelledby', 'title');
  });

  it('forwards ref', () => {
    let refValue: HTMLElement | null = null;
    render(<Section ref={(el) => { refValue = el; }} data-testid="section" />);
    expect(refValue).toBe(screen.getByTestId('section'));
  });

  it('renders children', () => {
    render(
      <Section data-testid="section">
        <div data-testid="child">child</div>
      </Section>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders empty without children', () => {
    render(<Section data-testid="section" />);
    expect(screen.getByTestId('section')).toBeInTheDocument();
  });

  it('applies className', () => {
    render(<Section data-testid="section" className="custom" />);
    expect(screen.getByTestId('section')).toHaveClass('custom');
  });

  it('applies inline style', () => {
    render(<Section data-testid="section" style={{ opacity: '0.5' }} />);
    expect(screen.getByTestId('section')).toHaveStyle({ opacity: '0.5' });
  });

  it('accepts Box props (p, width)', () => {
    render(<Section data-testid="section" p={4} width="full" />);
    expect(screen.getByTestId('section').className).toBeTruthy();
  });

  it('renders multiple children', () => {
    render(
      <Section data-testid="section">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Section>,
    );
    expect(screen.getByTestId('section').children).toHaveLength(3);
  });

  // ── classNames & styles ──
  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<Section data-testid="section" classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('section')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <Section data-testid="section" styles={{ root: { opacity: '0.7' } }} />,
      );
      expect(screen.getByTestId('section')).toHaveStyle({ opacity: '0.7' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Section
          data-testid="section"
          className="outer"
          classNames={{ root: 'inner' }}
        />,
      );
      const el = screen.getByTestId('section');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <Section
          data-testid="section"
          style={{ opacity: '0.5' }}
          styles={{ root: { padding: '20px' } }}
        />,
      );
      const el = screen.getByTestId('section');
      expect(el).toHaveStyle({ opacity: '0.5' });
      expect(el).toHaveStyle({ padding: '20px' });
    });

    it('styles.root with fontSize', () => {
      render(
        <Section data-testid="section" styles={{ root: { fontSize: '18px' } }} />,
      );
      expect(screen.getByTestId('section')).toHaveStyle({ fontSize: '18px' });
    });
  });

  // ── Compound: Section.Header & Section.Content ──
  describe('Section (Compound)', () => {
    it('compound: Section.Header render edilir', () => {
      render(
        <Section data-testid="section">
          <Section.Header>Baslik</Section.Header>
        </Section>,
      );
      const header = screen.getByTestId('section-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Baslik');
      expect(header.tagName).toBe('H2');
    });

    it('compound: Section.Header as prop ile farkli heading', () => {
      render(
        <Section>
          <Section.Header as="h3">H3 Baslik</Section.Header>
        </Section>,
      );
      expect(screen.getByTestId('section-header').tagName).toBe('H3');
    });

    it('compound: Section.Content render edilir', () => {
      render(
        <Section>
          <Section.Content>Icerik</Section.Content>
        </Section>,
      );
      const content = screen.getByTestId('section-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Icerik');
    });

    it('compound: Header ve Content birlikte render edilir', () => {
      render(
        <Section>
          <Section.Header>Baslik</Section.Header>
          <Section.Content>Icerik</Section.Content>
        </Section>,
      );
      expect(screen.getByTestId('section-header')).toBeInTheDocument();
      expect(screen.getByTestId('section-content')).toBeInTheDocument();
    });

    it('compound: classNames.header context ile aktarilir', () => {
      render(
        <Section classNames={{ header: 'custom-header' }}>
          <Section.Header>test</Section.Header>
        </Section>,
      );
      expect(screen.getByTestId('section-header').className).toContain('custom-header');
    });

    it('compound: classNames.content context ile aktarilir', () => {
      render(
        <Section classNames={{ content: 'custom-content' }}>
          <Section.Content>test</Section.Content>
        </Section>,
      );
      expect(screen.getByTestId('section-content').className).toContain('custom-content');
    });

    it('compound: styles.header context ile aktarilir', () => {
      render(
        <Section styles={{ header: { padding: '10px' } }}>
          <Section.Header>test</Section.Header>
        </Section>,
      );
      expect(screen.getByTestId('section-header')).toHaveStyle({ padding: '10px' });
    });

    it('compound: styles.content context ile aktarilir', () => {
      render(
        <Section styles={{ content: { padding: '12px' } }}>
          <Section.Content>test</Section.Content>
        </Section>,
      );
      expect(screen.getByTestId('section-content')).toHaveStyle({ padding: '12px' });
    });

    it('compound: Section.Header ref forward edilir', () => {
      let refValue: HTMLHeadingElement | null = null;
      render(
        <Section>
          <Section.Header ref={(el) => { refValue = el; }}>test</Section.Header>
        </Section>,
      );
      expect(refValue).toBe(screen.getByTestId('section-header'));
    });

    it('compound: Section.Content ref forward edilir', () => {
      let refValue: HTMLDivElement | null = null;
      render(
        <Section>
          <Section.Content ref={(el) => { refValue = el; }}>test</Section.Content>
        </Section>,
      );
      expect(refValue).toBe(screen.getByTestId('section-content'));
    });

    it('Section.Header context disinda hata firlatir', () => {
      expect(() => render(<Section.Header>Test</Section.Header>)).toThrow();
    });
  });
});
