/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SegmentedControl } from './SegmentedControl';

// ── Test verileri / Test data ───────────────────────────────────────

const basicOptions = [
  { value: 'list', label: 'Liste' },
  { value: 'grid', label: 'Izgara' },
  { value: 'kanban', label: 'Kanban' },
];

const withDisabledOptions = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B', disabled: true },
  { value: 'c', label: 'C' },
];

/**
 * Helper — SegmentedControl render eder.
 */
function renderControl(props: Record<string, unknown> = {}) {
  const defaultProps = {
    'aria-label': 'Gorunum',
    options: basicOptions,
    ...props,
  };
  return render(<SegmentedControl {...defaultProps} />);
}

function getTablist() {
  return screen.getByRole('tablist', { name: 'Gorunum' });
}

function getTabs() {
  return screen.getAllByRole('tab');
}

describe('SegmentedControl', () => {
  // ── Render ──────────────────────────────────────────────────────

  it('render edilir / renders', () => {
    renderControl();
    expect(getTablist()).toBeInTheDocument();
  });

  it('role tablist / role is tablist', () => {
    renderControl();
    expect(getTablist()).toHaveAttribute('role', 'tablist');
  });

  it('tüm segmentler render edilir / all segments rendered', () => {
    renderControl();
    const tabs = getTabs();
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveTextContent('Liste');
    expect(tabs[1]).toHaveTextContent('Izgara');
    expect(tabs[2]).toHaveTextContent('Kanban');
  });

  it('ref forward edilir / ref is forwarded', () => {
    const ref = vi.fn();
    render(
      <SegmentedControl ref={ref} options={basicOptions} aria-label="Gorunum" />,
    );
    expect(ref).toHaveBeenCalled();
  });

  // ── Seçim ───────────────────────────────────────────────────────

  it('defaultValue ile seçili segment / selected segment with defaultValue', () => {
    renderControl({ defaultValue: 'grid' });
    const tabs = getTabs();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('data-state', 'active');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
  });

  it('tiklayinca secer / click selects', () => {
    const onValueChange = vi.fn();
    renderControl({ onValueChange });
    fireEvent.click(getTabs()[1]);
    expect(onValueChange).toHaveBeenCalledWith('grid');
    expect(getTabs()[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('ayni degere tiklamak callback tetiklemez / clicking same value no callback', () => {
    const onValueChange = vi.fn();
    renderControl({ onValueChange, defaultValue: 'list' });
    fireEvent.click(getTabs()[0]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('controlled value / controlled value', () => {
    renderControl({ value: 'kanban' });
    expect(getTabs()[2]).toHaveAttribute('aria-selected', 'true');
  });

  // ── Klavye navigasyon ──────────────────────────────────────────

  it('ArrowRight ile sonraki / ArrowRight moves to next', () => {
    renderControl({ defaultValue: 'list' });
    fireEvent.keyDown(getTablist(), { key: 'ArrowRight' });
    expect(getTabs()[1]).toHaveAttribute('tabindex', '0');
  });

  it('ArrowLeft ile onceki / ArrowLeft moves to prev', () => {
    renderControl({ defaultValue: 'grid' });
    fireEvent.keyDown(getTablist(), { key: 'ArrowLeft' });
    expect(getTabs()[0]).toHaveAttribute('tabindex', '0');
  });

  it('Home ile ilk / Home moves to first', () => {
    renderControl({ defaultValue: 'kanban' });
    fireEvent.keyDown(getTablist(), { key: 'Home' });
    expect(getTabs()[0]).toHaveAttribute('tabindex', '0');
  });

  it('End ile son / End moves to last', () => {
    renderControl({ defaultValue: 'list' });
    fireEvent.keyDown(getTablist(), { key: 'End' });
    expect(getTabs()[2]).toHaveAttribute('tabindex', '0');
  });

  it('Enter ile secer / Enter selects', () => {
    const onValueChange = vi.fn();
    renderControl({ onValueChange });
    // Focus ilk segmentte, ArrowRight ile ikinciye geç
    fireEvent.keyDown(getTablist(), { key: 'ArrowRight' });
    fireEvent.keyDown(getTablist(), { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('grid');
  });

  it('Space ile secer / Space selects', () => {
    const onValueChange = vi.fn();
    renderControl({ onValueChange });
    fireEvent.keyDown(getTablist(), { key: 'ArrowRight' });
    fireEvent.keyDown(getTablist(), { key: ' ' });
    expect(onValueChange).toHaveBeenCalledWith('grid');
  });

  it('ArrowRight wrap eder / ArrowRight wraps', () => {
    renderControl({ defaultValue: 'kanban' });
    fireEvent.keyDown(getTablist(), { key: 'ArrowRight' });
    expect(getTabs()[0]).toHaveAttribute('tabindex', '0');
  });

  // ── Disabled ────────────────────────────────────────────────────

  it('disabled iken seçim engellenir / selection blocked when disabled', () => {
    const onValueChange = vi.fn();
    renderControl({ disabled: true, onValueChange });
    fireEvent.click(getTabs()[1]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('disabled data attribute / disabled data attribute', () => {
    renderControl({ disabled: true });
    expect(getTablist()).toHaveAttribute('data-disabled', '');
  });

  it('disabled iken klavye engellenir / keyboard blocked when disabled', () => {
    renderControl({ disabled: true });
    const tabs = getTabs();
    const initialTabIndex = tabs[0].getAttribute('tabindex');
    fireEvent.keyDown(getTablist(), { key: 'ArrowRight' });
    expect(tabs[0].getAttribute('tabindex')).toBe(initialTabIndex);
  });

  // ── ReadOnly ────────────────────────────────────────────────────

  it('readOnly iken seçim engellenir / selection blocked when readOnly', () => {
    const onValueChange = vi.fn();
    renderControl({ readOnly: true, onValueChange });
    fireEvent.click(getTabs()[1]);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('readOnly data attribute / readOnly data attribute', () => {
    renderControl({ readOnly: true });
    expect(getTablist()).toHaveAttribute('data-readonly', '');
  });

  // ── Disabled option ─────────────────────────────────────────────

  it('disabled segment tiklanamaz / disabled segment cannot be clicked', () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        options={withDisabledOptions}
        aria-label="Gorunum"
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByText('B'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('disabled segment data attribute / disabled segment data attribute', () => {
    render(
      <SegmentedControl options={withDisabledOptions} aria-label="Gorunum" />,
    );
    expect(screen.getByText('B')).toHaveAttribute('data-disabled', '');
    expect(screen.getByText('B')).toHaveAttribute('aria-disabled', 'true');
  });

  // ── Roving tabindex ─────────────────────────────────────────────

  it('sadece bir segment tabIndex 0 / only one segment has tabIndex 0', () => {
    renderControl({ defaultValue: 'grid' });
    const tabs = getTabs();
    expect(tabs[0]).toHaveAttribute('tabindex', '-1');
    expect(tabs[1]).toHaveAttribute('tabindex', '0');
    expect(tabs[2]).toHaveAttribute('tabindex', '-1');
  });

  // ── Sizes ───────────────────────────────────────────────────────

  it('farkli size render edilir / different size renders', () => {
    const { unmount } = render(
      <SegmentedControl options={basicOptions} size="sm" aria-label="Kucuk" />,
    );
    const smClass = screen.getByRole('tablist').className;
    unmount();

    render(
      <SegmentedControl options={basicOptions} size="xl" aria-label="Buyuk" />,
    );
    const xlClass = screen.getByRole('tablist').className;

    expect(smClass).not.toBe(xlClass);
  });

  // ── classNames & styles ─────────────────────────────────────────

  it('classNames.root uygulanir', () => {
    renderControl({ classNames: { root: 'slot-root' } });

    expect(getTablist()).toHaveClass('slot-root');
  });

  it('styles.root uygulanir', () => {
    renderControl({ styles: { root: { padding: '10px' } } });

    expect(getTablist()).toHaveStyle({ padding: '10px' });
  });

  it('className + classNames.root birlestirilir', () => {
    renderControl({ className: 'legacy', classNames: { root: 'slot-root' } });
    const el = getTablist();

    expect(el).toHaveClass('legacy');
    expect(el).toHaveClass('slot-root');
  });

  it('classNames.item uygulanir', () => {
    renderControl({ classNames: { item: 'my-item' } });
    const tabs = getTabs();

    tabs.forEach((tab) => {
      expect(tab).toHaveClass('my-item');
    });
  });

  it('styles.item uygulanir', () => {
    renderControl({ styles: { item: { fontWeight: 'bold' } } });
    const tabs = getTabs();

    tabs.forEach((tab) => {
      expect(tab).toHaveStyle({ fontWeight: 'bold' });
    });
  });

  // ── Slot API: styles ──

  it('styles.root root elemana letterSpacing eklenir', () => {
    renderControl({ styles: { root: { letterSpacing: '2px' } } });
    expect(getTablist()).toHaveStyle({ letterSpacing: '2px' });
  });

  it('styles.item item elemana fontSize eklenir', () => {
    renderControl({ styles: { item: { fontSize: '18px' } } });
    const tabs = getTabs();
    tabs.forEach((tab) => {
      expect(tab).toHaveStyle({ fontSize: '18px' });
    });
  });
});

// ── Compound API ──

describe('SegmentedControl (Compound)', () => {
  it('compound: option render edilir', () => {
    render(
      <SegmentedControl options={basicOptions} aria-label="Gorunum">
        <SegmentedControl.Option value="list">Liste</SegmentedControl.Option>
        <SegmentedControl.Option value="grid">Izgara</SegmentedControl.Option>
        <SegmentedControl.Option value="kanban">Kanban</SegmentedControl.Option>
      </SegmentedControl>,
    );
    expect(screen.getAllByTestId('segmented-control-item')).toHaveLength(3);
  });

  it('compound: tiklaninca secer', () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl options={basicOptions} aria-label="Gorunum" onValueChange={onValueChange}>
        <SegmentedControl.Option value="list">Liste</SegmentedControl.Option>
        <SegmentedControl.Option value="grid">Izgara</SegmentedControl.Option>
        <SegmentedControl.Option value="kanban">Kanban</SegmentedControl.Option>
      </SegmentedControl>,
    );
    fireEvent.click(screen.getByText('Izgara'));
    expect(onValueChange).toHaveBeenCalledWith('grid');
  });

  it('compound: secili option aria-selected=true', () => {
    render(
      <SegmentedControl options={basicOptions} defaultValue="grid" aria-label="Gorunum">
        <SegmentedControl.Option value="list">Liste</SegmentedControl.Option>
        <SegmentedControl.Option value="grid">Izgara</SegmentedControl.Option>
        <SegmentedControl.Option value="kanban">Kanban</SegmentedControl.Option>
      </SegmentedControl>,
    );
    const options = screen.getAllByTestId('segmented-control-item');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <SegmentedControl options={basicOptions} aria-label="Gorunum" classNames={{ item: 'cmp-item' }}>
        <SegmentedControl.Option value="list">Liste</SegmentedControl.Option>
      </SegmentedControl>,
    );
    expect(screen.getByTestId('segmented-control-item').className).toContain('cmp-item');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <SegmentedControl options={basicOptions} aria-label="Gorunum" styles={{ item: { fontWeight: 'bold' } }}>
        <SegmentedControl.Option value="list">Liste</SegmentedControl.Option>
      </SegmentedControl>,
    );
    expect(screen.getByTestId('segmented-control-item')).toHaveStyle({ fontWeight: 'bold' });
  });

  it('SegmentedControl.Option context disinda hata firlatir', () => {
    expect(() => render(<SegmentedControl.Option value="test">Test</SegmentedControl.Option>)).toThrow();
  });
});
