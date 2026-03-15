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
import { ThemePreview } from './ThemePreview';

describe('ThemePreview', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<ThemePreview />);
    expect(screen.getByTestId('theme-preview-root')).toBeInTheDocument();
  });

  it('varsayilan tema default-dark', () => {
    render(<ThemePreview />);
    expect(screen.getByTestId('theme-preview-root')).toHaveAttribute('data-theme', 'default-dark');
  });

  it('defaultTheme prop ile varsayilan tema degistirilir', () => {
    render(<ThemePreview defaultTheme="ocean-light" />);
    expect(screen.getByTestId('theme-preview-root')).toHaveAttribute('data-theme', 'ocean-light');
  });

  it('activeTheme prop ile kontrolllu tema set edilir', () => {
    render(<ThemePreview activeTheme="forest-dark" />);
    expect(screen.getByTestId('theme-preview-root')).toHaveAttribute('data-theme', 'forest-dark');
  });

  // ── ref forwarding ──

  it('ref forward edilir', () => {
    let refValue: HTMLDivElement | null = null;
    render(<ThemePreview ref={(el) => { refValue = el; }} />);
    expect(refValue).toBe(screen.getByTestId('theme-preview-root'));
  });

  // ── Selector ──

  it('tema selector butonlari render edilir', () => {
    render(<ThemePreview />);
    const buttons = screen.getAllByTestId('theme-preview-selector-button');
    expect(buttons.length).toBeGreaterThanOrEqual(6);
  });

  it('aktif tema butonunda data-active attribute var', () => {
    render(<ThemePreview defaultTheme="default-dark" />);
    const buttons = screen.getAllByTestId('theme-preview-selector-button');
    const activeBtn = buttons.find((btn) => btn.textContent === 'default-dark');
    expect(activeBtn).toHaveAttribute('data-active');
  });

  it('tema butonu tiklaninca tema degisir', () => {
    render(<ThemePreview />);
    const buttons = screen.getAllByTestId('theme-preview-selector-button');
    const oceanBtn = buttons.find((btn) => btn.textContent === 'ocean-light');
    if (oceanBtn) fireEvent.click(oceanBtn);
    expect(screen.getByTestId('theme-preview-root')).toHaveAttribute('data-theme', 'ocean-light');
  });

  it('onThemeChange callback cagrilir', () => {
    const handleChange = vi.fn();
    render(<ThemePreview onThemeChange={handleChange} />);
    const buttons = screen.getAllByTestId('theme-preview-selector-button');
    const forestBtn = buttons.find((btn) => btn.textContent === 'forest-dark');
    if (forestBtn) fireEvent.click(forestBtn);
    expect(handleChange).toHaveBeenCalledWith('forest-dark');
  });

  it('custom variants prop ile sadece belirtilen temalar gosterilir', () => {
    render(<ThemePreview variants={['default-dark', 'default-light']} />);
    const buttons = screen.getAllByTestId('theme-preview-selector-button');
    expect(buttons).toHaveLength(2);
  });

  // ── Color Sections ──

  it('renk sectionlari render edilir', () => {
    render(<ThemePreview />);
    const sections = screen.getAllByTestId('theme-preview-color-section');
    expect(sections.length).toBeGreaterThanOrEqual(9);
  });

  it('renk sectionlarinda baslik gorulur', () => {
    render(<ThemePreview />);
    const titles = screen.getAllByTestId('theme-preview-color-section-title');
    expect(titles[0]).toHaveTextContent('Background');
  });

  it('renk swatchlari render edilir', () => {
    render(<ThemePreview />);
    const swatches = screen.getAllByTestId('theme-preview-swatch');
    expect(swatches.length).toBeGreaterThan(0);
  });

  it('custom colorGroups ile sadece belirtilen gruplar gosterilir', () => {
    const customGroups = [
      { title: 'Test Group', vars: [{ name: 'accentDefault', label: 'Default' }] },
    ];
    render(<ThemePreview colorGroups={customGroups} />);
    const sections = screen.getAllByTestId('theme-preview-color-section');
    expect(sections).toHaveLength(1);
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<ThemePreview className="my-theme" />);
    expect(screen.getByTestId('theme-preview-root').className).toContain('my-theme');
  });

  it('style root elemana eklenir', () => {
    render(<ThemePreview style={{ maxWidth: 800 }} />);
    expect(screen.getByTestId('theme-preview-root')).toHaveStyle({ maxWidth: '800px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<ThemePreview classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('theme-preview-root').className).toContain('custom-root');
  });

  it('classNames.selector selector elemana eklenir', () => {
    render(<ThemePreview classNames={{ selector: 'custom-selector' }} />);
    expect(screen.getByTestId('theme-preview-selector').className).toContain('custom-selector');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<ThemePreview styles={{ root: { padding: '32px' } }} />);
    expect(screen.getByTestId('theme-preview-root')).toHaveStyle({ padding: '32px' });
  });

  it('styles.selector selector elemana eklenir', () => {
    render(<ThemePreview styles={{ selector: { gap: '16px' } }} />);
    expect(screen.getByTestId('theme-preview-selector')).toHaveStyle({ gap: '16px' });
  });
});

// ── Compound API ──

describe('ThemePreview (Compound)', () => {
  it('compound: ColorSection render edilir', () => {
    render(
      <ThemePreview>
        <ThemePreview.ColorSection
          title="Test Colors"
          vars={[{ name: 'accentDefault', label: 'Default' }]}
        />
      </ThemePreview>,
    );
    expect(screen.getByTestId('theme-preview-color-section')).toBeInTheDocument();
    expect(screen.getByTestId('theme-preview-color-section-title')).toHaveTextContent('Test Colors');
  });

  it('compound: TypographySection render edilir', () => {
    render(
      <ThemePreview>
        <ThemePreview.TypographySection>
          <p>Typography test</p>
        </ThemePreview.TypographySection>
      </ThemePreview>,
    );
    expect(screen.getByTestId('theme-preview-typography-section')).toBeInTheDocument();
    expect(screen.getByText('Typography test')).toBeInTheDocument();
  });

  it('compound: TypographySection custom title', () => {
    render(
      <ThemePreview>
        <ThemePreview.TypographySection title="Fonts">
          <p>Font preview</p>
        </ThemePreview.TypographySection>
      </ThemePreview>,
    );
    expect(screen.getByText('Fonts')).toBeInTheDocument();
  });

  it('compound: tema degisimi children ile de calisir', () => {
    render(
      <ThemePreview defaultTheme="ocean-dark">
        <ThemePreview.ColorSection
          title="Accent"
          vars={[{ name: 'accentDefault', label: 'Default' }]}
        />
      </ThemePreview>,
    );
    expect(screen.getByTestId('theme-preview-root')).toHaveAttribute('data-theme', 'ocean-dark');

    const buttons = screen.getAllByTestId('theme-preview-selector-button');
    const lightBtn = buttons.find((btn) => btn.textContent === 'default-light');
    if (lightBtn) fireEvent.click(lightBtn);
    expect(screen.getByTestId('theme-preview-root')).toHaveAttribute('data-theme', 'default-light');
  });

  it('compound: classNames context ile sub-componentlara aktarilir', () => {
    render(
      <ThemePreview classNames={{ colorSection: 'cmp-section' }}>
        <ThemePreview.ColorSection
          title="Test"
          vars={[{ name: 'accentDefault', label: 'D' }]}
        />
      </ThemePreview>,
    );
    expect(screen.getByTestId('theme-preview-color-section').className).toContain('cmp-section');
  });

  it('compound: styles context ile sub-componentlara aktarilir', () => {
    render(
      <ThemePreview styles={{ colorSection: { padding: '12px' } }}>
        <ThemePreview.ColorSection
          title="Test"
          vars={[{ name: 'accentDefault', label: 'D' }]}
        />
      </ThemePreview>,
    );
    expect(screen.getByTestId('theme-preview-color-section')).toHaveStyle({ padding: '12px' });
  });
});
