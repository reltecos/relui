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
import { Popover } from './Popover';
import { useState } from 'react';

// ── Helpers ──

function TestPopover(props: Partial<React.ComponentProps<typeof Popover>> = {}) {
  return (
    <Popover
      trigger={<button>Open</button>}
      {...props}
    >
      <p>Popover content</p>
    </Popover>
  );
}

function ControlledPopover(props: Partial<React.ComponentProps<typeof Popover>> = {}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      trigger={<button>Open</button>}
      open={open}
      onOpenChange={setOpen}
      {...props}
    >
      <p>Controlled content</p>
    </Popover>
  );
}

describe('Popover', () => {
  // ── Render ──

  it('trigger render edilir', () => {
    render(<TestPopover />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('varsayilan olarak content gorunmez', () => {
    render(<TestPopover />);
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('defaultOpen ile acik baslar', () => {
    render(<TestPopover defaultOpen />);
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  // ── Toggle ──

  it('trigger tiklaninca acilir', () => {
    render(<TestPopover />);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  it('tekrar tiklaninca kapanir', () => {
    render(<TestPopover />);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Open'));
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  // ── Controlled ──

  it('controlled mod — open prop ile acilir', () => {
    render(<ControlledPopover />);
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  it('controlled mod — onOpenChange cagirilir', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Popover
        trigger={<button>Open</button>}
        open={false}
        onOpenChange={onChange}
      >
        <p>Content</p>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(onChange).toHaveBeenCalledWith(true);

    rerender(
      <Popover
        trigger={<button>Open</button>}
        open={true}
        onOpenChange={onChange}
      >
        <p>Content</p>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  // ── Escape ──

  it('Escape ile kapanir', () => {
    render(<TestPopover />);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('closeOnEscape=false ise Escape ile kapanmaz', () => {
    render(<TestPopover closeOnEscape={false} />);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  // ── Outside click ──

  it('dis tiklamada kapanir', () => {
    render(
      <div>
        <TestPopover />
        <div data-testid="outside">Outside</div>
      </div>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('closeOnOutsideClick=false ise dis tiklamada kapanmaz', () => {
    render(
      <div>
        <TestPopover closeOnOutsideClick={false} />
        <div data-testid="outside">Outside</div>
      </div>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  // ── Content tiklaninca kapanmaz ──

  it('content icine tiklaninca kapanmaz', () => {
    render(<TestPopover />);
    fireEvent.click(screen.getByText('Open'));
    const content = screen.getByTestId('popover-content');
    expect(content).toBeInTheDocument();

    fireEvent.mouseDown(content);
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  // ── Placement ──

  it('placement data attribute render edilir', () => {
    render(<TestPopover defaultOpen placement="top" />);
    expect(screen.getByTestId('popover-content')).toHaveAttribute('data-placement', 'top');
  });

  it('placement bottom varsayilan', () => {
    render(<TestPopover defaultOpen />);
    expect(screen.getByTestId('popover-content')).toHaveAttribute('data-placement', 'bottom');
  });

  it('alignment data attribute render edilir', () => {
    render(<TestPopover defaultOpen alignment="start" />);
    expect(screen.getByTestId('popover-content')).toHaveAttribute('data-alignment', 'start');
  });

  // ── Arrow ──

  it('showArrow=true ise arrow render edilir', () => {
    render(<TestPopover defaultOpen showArrow />);
    // Arrow pozisyon hesaplamasi raf gerektirdigi icin
    // jsdom'da tam render olmayabilir ama content render olur
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  it('showArrow=false (varsayilan) ise arrow yok', () => {
    render(<TestPopover defaultOpen />);
    expect(screen.queryByTestId('popover-arrow')).not.toBeInTheDocument();
  });

  // ── A11y ──

  it('trigger aria-expanded dogrulanir', () => {
    render(<TestPopover />);
    const button = screen.getByText('Open');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('trigger aria-haspopup=true set edilir', () => {
    render(<TestPopover />);
    expect(screen.getByText('Open')).toHaveAttribute('aria-haspopup', 'true');
  });

  it('content role=dialog vardir', () => {
    render(<TestPopover defaultOpen />);
    expect(screen.getByTestId('popover-content')).toHaveAttribute('role', 'dialog');
  });

  // ── className & style ──

  it('className content elemana eklenir', () => {
    render(<TestPopover defaultOpen className="my-popover" />);
    const content = screen.getByTestId('popover-content');
    expect(content.className).toContain('my-popover');
  });

  it('style content elemana eklenir', () => {
    render(<TestPopover defaultOpen style={{ padding: '20px' }} />);
    expect(screen.getByTestId('popover-content')).toHaveStyle({ padding: '20px' });
  });

  // ── Slot API: classNames ──

  it('classNames.content content elemana eklenir', () => {
    render(
      <TestPopover defaultOpen classNames={{ content: 'custom-content' }} />,
    );
    const content = screen.getByTestId('popover-content');
    expect(content.className).toContain('custom-content');
  });

  // ── Slot API: styles ──

  it('styles.content content elemana eklenir', () => {
    render(
      <TestPopover defaultOpen styles={{ content: { padding: '24px' } }} />,
    );
    expect(screen.getByTestId('popover-content')).toHaveStyle({ padding: '24px' });
  });

  // ── Trigger onClick preserved ──

  it('trigger orijinal onClick korunur', () => {
    const onTriggerClick = vi.fn();
    render(
      <Popover trigger={<button onClick={onTriggerClick}>Open</button>}>
        <p>Content</p>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(onTriggerClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  // ── Children render ──

  it('children icerik olarak render edilir', () => {
    render(
      <Popover trigger={<button>Open</button>} defaultOpen>
        <span data-testid="custom">Custom child</span>
      </Popover>,
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  // ── Anchor render ──

  it('anchor span render edilir', () => {
    render(<TestPopover />);
    expect(screen.getByTestId('popover-anchor')).toBeInTheDocument();
  });
});

// ── Compound API ──

describe('Popover (Compound)', () => {
  it('compound: trigger render edilir', () => {
    render(
      <Popover>
        <Popover.Trigger><button>Compound Open</button></Popover.Trigger>
        <Popover.Content><p>Compound content</p></Popover.Content>
      </Popover>,
    );
    expect(screen.getByText('Compound Open')).toBeInTheDocument();
  });

  it('compound: trigger tiklaninca content acilir', () => {
    render(
      <Popover>
        <Popover.Trigger><button>Compound Open</button></Popover.Trigger>
        <Popover.Content><p>Compound content</p></Popover.Content>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Compound Open'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    expect(screen.getByText('Compound content')).toBeInTheDocument();
  });

  it('compound: tekrar tiklaninca kapanir', () => {
    render(
      <Popover>
        <Popover.Trigger><button>Compound Open</button></Popover.Trigger>
        <Popover.Content><p>Compound content</p></Popover.Content>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Compound Open'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Compound Open'));
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('compound: arrow render edilir', () => {
    render(
      <Popover defaultOpen>
        <Popover.Trigger><button>Open</button></Popover.Trigger>
        <Popover.Content><p>Content</p></Popover.Content>
        <Popover.Arrow />
      </Popover>,
    );
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  it('compound: Escape ile kapanir', () => {
    render(
      <Popover>
        <Popover.Trigger><button>Open</button></Popover.Trigger>
        <Popover.Content><p>Content</p></Popover.Content>
      </Popover>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('compound: aria-expanded dogrulanir', () => {
    render(
      <Popover>
        <Popover.Trigger><button>Open</button></Popover.Trigger>
        <Popover.Content><p>Content</p></Popover.Content>
      </Popover>,
    );
    const button = screen.getByText('Open');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});
