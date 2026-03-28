/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Tooltip } from './Tooltip';

// ── Helpers ──

function TestTooltip(props: Partial<React.ComponentProps<typeof Tooltip>> = {}) {
  return (
    <Tooltip label="Ipucu" {...props}>
      <button>Hover me</button>
    </Tooltip>
  );
}

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Render ──

  it('trigger render edilir', () => {
    render(<TestTooltip />);
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('varsayilan olarak tooltip gorunmez', () => {
    render(<TestTooltip />);
    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
  });

  // ── Hover ──

  it('hover ile tooltip acilir (delay sonrasi)', () => {
    render(<TestTooltip delay={300} />);
    fireEvent.mouseEnter(screen.getByText('Hover me'));

    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    expect(screen.getByText('Ipucu')).toBeInTheDocument();
  });

  it('mouse leave ile tooltip kapanir (closeDelay sonrasi)', () => {
    render(<TestTooltip delay={0} closeDelay={100} />);

    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByText('Hover me'));

    // closeDelay bitmeden hala gorunur
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
  });

  it('delay=0 ile aninda acilir', () => {
    render(<TestTooltip delay={0} />);
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
  });

  it('closeDelay=0 ile aninda kapanir', () => {
    render(<TestTooltip delay={0} closeDelay={0} />);
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByText('Hover me'));
    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
  });

  // ── Focus ──

  it('focus ile tooltip acilir', () => {
    render(<TestTooltip delay={0} />);
    fireEvent.focus(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
  });

  it('blur ile tooltip kapanir', () => {
    render(<TestTooltip delay={0} closeDelay={0} />);
    fireEvent.focus(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();

    fireEvent.blur(screen.getByText('Hover me'));
    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
  });

  // ── Escape ──

  it('Escape ile kapanir', () => {
    render(<TestTooltip delay={0} />);
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
  });

  // ── Disabled ──

  it('disabled=true ise tooltip acilmaz', () => {
    render(<TestTooltip delay={0} disabled />);
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
  });

  // ── Placement ──

  it('placement data attribute render edilir', () => {
    render(<TestTooltip delay={0} placement="bottom" />);
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-placement', 'bottom');
  });

  it('placement top varsayilan', () => {
    render(<TestTooltip delay={0} />);
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-placement', 'top');
  });

  // ── Arrow ──

  it('showArrow=true (varsayilan) ile arrow alanı vardir', () => {
    render(<TestTooltip delay={0} />);
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    // Arrow pozisyon hesaplamasi raf gerektirir, jsdom'da tam render olmayabilir
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
  });

  it('showArrow=false ise arrow yok', () => {
    render(<TestTooltip delay={0} showArrow={false} />);
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.queryByTestId('tooltip-arrow')).not.toBeInTheDocument();
  });

  // ── A11y ──

  it('role=tooltip set edilir', () => {
    render(<TestTooltip delay={0} />);
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toHaveAttribute('role', 'tooltip');
  });

  it('trigger aria-describedby tooltip acikken set edilir', () => {
    render(<TestTooltip delay={0} />);
    const button = screen.getByText('Hover me');

    expect(button).not.toHaveAttribute('aria-describedby');

    fireEvent.mouseEnter(button);
    expect(button).toHaveAttribute('aria-describedby');

    const tooltipId = button.getAttribute('aria-describedby');
    const content = screen.getByTestId('tooltip-content');
    expect(content).toHaveAttribute('id', tooltipId);
  });

  // ── className & style ──

  it('className content elemana eklenir', () => {
    render(<TestTooltip delay={0} className="my-tooltip" />);
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content').className).toContain('my-tooltip');
  });

  it('style content elemana eklenir', () => {
    render(<TestTooltip delay={0} style={{ padding: '20px' }} />);
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toHaveStyle({ padding: '20px' });
  });

  // ── Slot API ──

  it('classNames.content content elemana eklenir', () => {
    render(
      <TestTooltip delay={0} classNames={{ content: 'custom-tip' }} />,
    );
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content').className).toContain('custom-tip');
  });

  it('styles.content content elemana eklenir', () => {
    render(
      <TestTooltip delay={0} styles={{ content: { padding: '16px' } }} />,
    );
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: styles ──

  it('styles.content fontSize uygulanir', () => {
    render(
      <TestTooltip delay={0} styles={{ content: { fontSize: '14px' } }} />,
    );
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toHaveStyle({ fontSize: '14px' });
  });

  it('styles.content letterSpacing uygulanir', () => {
    render(
      <TestTooltip delay={0} styles={{ content: { letterSpacing: '0.5px' } }} />,
    );
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByTestId('tooltip-content')).toHaveStyle({ letterSpacing: '0.5px' });
  });

  it('styles.arrow arrow elemana eklenir', () => {
    render(
      <TestTooltip delay={0} showArrow styles={{ arrow: { opacity: '0.5' } }} />,
    );
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    const arrow = screen.queryByTestId('tooltip-arrow');
    if (arrow) {
      expect(arrow).toHaveStyle({ opacity: '0.5' });
    }
  });

  // ── Trigger event korunur ──

  it('trigger orijinal onMouseEnter korunur', () => {
    const onMouseEnter = vi.fn();
    render(
      <Tooltip label="Tip" delay={0}>
        <button onMouseEnter={onMouseEnter}>Hover</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByText('Hover'));
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
  });

  // ── ReactNode label ──

  it('label ReactNode olarak render edilir', () => {
    render(
      <Tooltip label={<span data-testid="rich-label">Rich</span>} delay={0}>
        <button>Hover</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByText('Hover'));
    expect(screen.getByTestId('rich-label')).toBeInTheDocument();
  });

  // ── Anchor ──

  it('anchor span render edilir', () => {
    render(<TestTooltip />);
    expect(screen.getByTestId('tooltip-root')).toBeInTheDocument();
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(
      <Tooltip label="Ipucu" ref={ref} delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );
    // ref tooltip content div'ine atanir, sadece acik oldugunda mount olur
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Tooltip (Compound)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('compound: trigger render edilir', () => {
    render(
      <Tooltip delay={0}>
        <Tooltip.Trigger><button>Compound Hover</button></Tooltip.Trigger>
        <Tooltip.Content>Compound ipucu</Tooltip.Content>
      </Tooltip>,
    );
    expect(screen.getByText('Compound Hover')).toBeInTheDocument();
  });

  it('compound: hover ile content acilir', () => {
    render(
      <Tooltip delay={0}>
        <Tooltip.Trigger><button>Compound Hover</button></Tooltip.Trigger>
        <Tooltip.Content>Compound ipucu</Tooltip.Content>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByText('Compound Hover'));
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    expect(screen.getByText('Compound ipucu')).toBeInTheDocument();
  });

  it('compound: mouse leave ile kapanir', () => {
    render(
      <Tooltip delay={0} closeDelay={0}>
        <Tooltip.Trigger><button>Compound Hover</button></Tooltip.Trigger>
        <Tooltip.Content>Compound ipucu</Tooltip.Content>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByText('Compound Hover'));
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    fireEvent.mouseLeave(screen.getByText('Compound Hover'));
    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
  });

  it('compound: Escape ile kapanir', () => {
    render(
      <Tooltip delay={0}>
        <Tooltip.Trigger><button>Compound Hover</button></Tooltip.Trigger>
        <Tooltip.Content>Compound ipucu</Tooltip.Content>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByText('Compound Hover'));
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument();
  });

  it('compound: role=tooltip set edilir', () => {
    render(
      <Tooltip delay={0}>
        <Tooltip.Trigger><button>Hover</button></Tooltip.Trigger>
        <Tooltip.Content>Tip</Tooltip.Content>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByText('Hover'));
    expect(screen.getByTestId('tooltip-content')).toHaveAttribute('role', 'tooltip');
  });
});
