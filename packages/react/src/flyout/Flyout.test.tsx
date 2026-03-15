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
import { Flyout } from './Flyout';
import { useState } from 'react';

// ── Helpers ──

function TestFlyout(props: Partial<React.ComponentProps<typeof Flyout>> = {}) {
  return (
    <Flyout
      trigger={<button>Open Flyout</button>}
      title="Flyout Baslik"
      {...props}
    >
      <p>Flyout content</p>
    </Flyout>
  );
}

function ControlledFlyout(props: Partial<React.ComponentProps<typeof Flyout>> = {}) {
  const [open, setOpen] = useState(false);
  return (
    <Flyout
      trigger={<button>Open Flyout</button>}
      title="Controlled Flyout"
      open={open}
      onOpenChange={setOpen}
      {...props}
    >
      <p>Controlled content</p>
    </Flyout>
  );
}

describe('Flyout', () => {
  // ── Render ──

  it('trigger render edilir', () => {
    render(<TestFlyout />);
    expect(screen.getByText('Open Flyout')).toBeInTheDocument();
  });

  it('varsayilan olarak panel gorunmez', () => {
    render(<TestFlyout />);
    expect(screen.queryByTestId('flyout-panel')).not.toBeInTheDocument();
  });

  it('defaultOpen ile acik baslar', () => {
    render(<TestFlyout defaultOpen />);
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();
    expect(screen.getByText('Flyout content')).toBeInTheDocument();
  });

  // ── Toggle ──

  it('trigger tiklaninca acilir', () => {
    render(<TestFlyout />);
    fireEvent.click(screen.getByText('Open Flyout'));
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();
  });

  it('tekrar tiklaninca kapanir', () => {
    render(<TestFlyout />);
    fireEvent.click(screen.getByText('Open Flyout'));
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Open Flyout'));
    expect(screen.queryByTestId('flyout-panel')).not.toBeInTheDocument();
  });

  // ── Header ──

  it('baslik render edilir', () => {
    render(<TestFlyout defaultOpen />);
    expect(screen.getByTestId('flyout-title')).toHaveTextContent('Flyout Baslik');
  });

  it('close button render edilir', () => {
    render(<TestFlyout defaultOpen />);
    expect(screen.getByTestId('flyout-close')).toBeInTheDocument();
  });

  it('close button tiklaninca kapanir', () => {
    render(<TestFlyout />);
    fireEvent.click(screen.getByText('Open Flyout'));
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('flyout-close'));
    expect(screen.queryByTestId('flyout-panel')).not.toBeInTheDocument();
  });

  it('showCloseButton=false ise close button yok', () => {
    render(<TestFlyout defaultOpen showCloseButton={false} />);
    expect(screen.queryByTestId('flyout-close')).not.toBeInTheDocument();
  });

  // ── Footer ──

  it('footer render edilir', () => {
    render(<TestFlyout defaultOpen footer={<button>Save</button>} />);
    expect(screen.getByTestId('flyout-footer')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('footer olmadan footer render edilmez', () => {
    render(<TestFlyout defaultOpen />);
    expect(screen.queryByTestId('flyout-footer')).not.toBeInTheDocument();
  });

  // ── Controlled ──

  it('controlled mod — open prop ile acilir', () => {
    render(<ControlledFlyout />);
    expect(screen.queryByTestId('flyout-panel')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Open Flyout'));
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();
  });

  it('controlled mod — onOpenChange cagirilir', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Flyout
        trigger={<button>Open Flyout</button>}
        title="Test"
        open={false}
        onOpenChange={onChange}
      >
        <p>Content</p>
      </Flyout>,
    );
    fireEvent.click(screen.getByText('Open Flyout'));
    expect(onChange).toHaveBeenCalledWith(true);

    rerender(
      <Flyout
        trigger={<button>Open Flyout</button>}
        title="Test"
        open={true}
        onOpenChange={onChange}
      >
        <p>Content</p>
      </Flyout>,
    );
    fireEvent.click(screen.getByText('Open Flyout'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  // ── Escape ──

  it('Escape ile kapanir', () => {
    render(<TestFlyout />);
    fireEvent.click(screen.getByText('Open Flyout'));
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('flyout-panel')).not.toBeInTheDocument();
  });

  it('closeOnEscape=false ise Escape ile kapanmaz', () => {
    render(<TestFlyout closeOnEscape={false} />);
    fireEvent.click(screen.getByText('Open Flyout'));
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();
  });

  // ── Outside click ──

  it('dis tiklamada kapanir', () => {
    render(
      <div>
        <TestFlyout />
        <div data-testid="outside">Outside</div>
      </div>,
    );
    fireEvent.click(screen.getByText('Open Flyout'));
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByTestId('flyout-panel')).not.toBeInTheDocument();
  });

  it('closeOnOutsideClick=false ise dis tiklamada kapanmaz', () => {
    render(
      <div>
        <TestFlyout closeOnOutsideClick={false} />
        <div data-testid="outside">Outside</div>
      </div>,
    );
    fireEvent.click(screen.getByText('Open Flyout'));
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();
  });

  // ── Panel icine tiklaninca kapanmaz ──

  it('panel icine tiklaninca kapanmaz', () => {
    render(<TestFlyout />);
    fireEvent.click(screen.getByText('Open Flyout'));
    const panel = screen.getByTestId('flyout-panel');
    expect(panel).toBeInTheDocument();

    fireEvent.mouseDown(panel);
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();
  });

  // ── Placement ──

  it('placement data attribute render edilir', () => {
    render(<TestFlyout defaultOpen placement="top" />);
    expect(screen.getByTestId('flyout-panel')).toHaveAttribute('data-placement', 'top');
  });

  it('placement bottom varsayilan', () => {
    render(<TestFlyout defaultOpen />);
    expect(screen.getByTestId('flyout-panel')).toHaveAttribute('data-placement', 'bottom');
  });

  // ── Size ──

  it('size data attribute render edilir', () => {
    render(<TestFlyout defaultOpen size="lg" />);
    expect(screen.getByTestId('flyout-panel')).toHaveAttribute('data-size', 'lg');
  });

  it('size md varsayilan', () => {
    render(<TestFlyout defaultOpen />);
    expect(screen.getByTestId('flyout-panel')).toHaveAttribute('data-size', 'md');
  });

  // ── A11y ──

  it('trigger aria-expanded dogrulanir', () => {
    render(<TestFlyout />);
    const button = screen.getByText('Open Flyout');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('trigger aria-haspopup=true set edilir', () => {
    render(<TestFlyout />);
    expect(screen.getByText('Open Flyout')).toHaveAttribute('aria-haspopup', 'true');
  });

  it('panel role=dialog vardir', () => {
    render(<TestFlyout defaultOpen />);
    expect(screen.getByTestId('flyout-panel')).toHaveAttribute('role', 'dialog');
  });

  it('close button aria-label=Kapat vardir', () => {
    render(<TestFlyout defaultOpen />);
    expect(screen.getByTestId('flyout-close')).toHaveAttribute('aria-label', 'Kapat');
  });

  // ── className & style ──

  it('className panel elemana eklenir', () => {
    render(<TestFlyout defaultOpen className="my-flyout" />);
    const panel = screen.getByTestId('flyout-panel');
    expect(panel.className).toContain('my-flyout');
  });

  it('style panel elemana eklenir', () => {
    render(<TestFlyout defaultOpen style={{ padding: '20px' }} />);
    expect(screen.getByTestId('flyout-panel')).toHaveStyle({ padding: '20px' });
  });

  // ── Slot API: classNames ──

  it('classNames.panel panel elemana eklenir', () => {
    render(
      <TestFlyout defaultOpen classNames={{ panel: 'custom-panel' }} />,
    );
    const panel = screen.getByTestId('flyout-panel');
    expect(panel.className).toContain('custom-panel');
  });

  it('classNames.header header elemana eklenir', () => {
    render(
      <TestFlyout defaultOpen classNames={{ header: 'custom-header' }} />,
    );
    const header = screen.getByTestId('flyout-header');
    expect(header.className).toContain('custom-header');
  });

  it('classNames.body body elemana eklenir', () => {
    render(
      <TestFlyout defaultOpen classNames={{ body: 'custom-body' }} />,
    );
    const body = screen.getByTestId('flyout-body');
    expect(body.className).toContain('custom-body');
  });

  // ── Slot API: styles ──

  it('styles.panel panel elemana eklenir', () => {
    render(
      <TestFlyout defaultOpen styles={{ panel: { padding: '24px' } }} />,
    );
    expect(screen.getByTestId('flyout-panel')).toHaveStyle({ padding: '24px' });
  });

  it('styles.body body elemana eklenir', () => {
    render(
      <TestFlyout defaultOpen styles={{ body: { fontSize: '18px' } }} />,
    );
    expect(screen.getByTestId('flyout-body')).toHaveStyle({ fontSize: '18px' });
  });

  // ── Trigger onClick preserved ──

  it('trigger orijinal onClick korunur', () => {
    const onTriggerClick = vi.fn();
    render(
      <Flyout trigger={<button onClick={onTriggerClick}>Open Flyout</button>} title="Test">
        <p>Content</p>
      </Flyout>,
    );
    fireEvent.click(screen.getByText('Open Flyout'));
    expect(onTriggerClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();
  });

  // ── Children render ──

  it('children icerik olarak render edilir', () => {
    render(
      <Flyout trigger={<button>Open</button>} title="Test" defaultOpen>
        <span data-testid="custom">Custom child</span>
      </Flyout>,
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  // ── Anchor render ──

  it('anchor span render edilir', () => {
    render(<TestFlyout />);
    expect(screen.getByTestId('flyout-anchor')).toBeInTheDocument();
  });
});

// ── Compound API ──

describe('Flyout (Compound)', () => {
  it('compound: trigger render edilir', () => {
    render(
      <Flyout>
        <Flyout.Trigger><button>Compound Flyout</button></Flyout.Trigger>
        <Flyout.Content>
          <Flyout.Body>Compound icerik</Flyout.Body>
        </Flyout.Content>
      </Flyout>,
    );
    expect(screen.getByText('Compound Flyout')).toBeInTheDocument();
  });

  it('compound: trigger tiklaninca panel acilir', () => {
    render(
      <Flyout>
        <Flyout.Trigger><button>Compound Flyout</button></Flyout.Trigger>
        <Flyout.Content>
          <Flyout.Body>Compound icerik</Flyout.Body>
        </Flyout.Content>
      </Flyout>,
    );
    fireEvent.click(screen.getByText('Compound Flyout'));
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();
    expect(screen.getByTestId('flyout-body')).toHaveTextContent('Compound icerik');
  });

  it('compound: header render edilir', () => {
    render(
      <Flyout defaultOpen>
        <Flyout.Trigger><button>Open</button></Flyout.Trigger>
        <Flyout.Content>
          <Flyout.Header><h3>Baslik</h3></Flyout.Header>
          <Flyout.Body>Icerik</Flyout.Body>
        </Flyout.Content>
      </Flyout>,
    );
    expect(screen.getByTestId('flyout-header')).toBeInTheDocument();
    expect(screen.getByText('Baslik')).toBeInTheDocument();
  });

  it('compound: tekrar tiklaninca kapanir', () => {
    render(
      <Flyout>
        <Flyout.Trigger><button>Compound Flyout</button></Flyout.Trigger>
        <Flyout.Content>
          <Flyout.Body>Icerik</Flyout.Body>
        </Flyout.Content>
      </Flyout>,
    );
    fireEvent.click(screen.getByText('Compound Flyout'));
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Compound Flyout'));
    expect(screen.queryByTestId('flyout-panel')).not.toBeInTheDocument();
  });

  it('compound: Escape ile kapanir', () => {
    render(
      <Flyout>
        <Flyout.Trigger><button>Open</button></Flyout.Trigger>
        <Flyout.Content>
          <Flyout.Body>Icerik</Flyout.Body>
        </Flyout.Content>
      </Flyout>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('flyout-panel')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('flyout-panel')).not.toBeInTheDocument();
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Flyout defaultOpen classNames={{ body: 'cmp-body' }}>
        <Flyout.Trigger><button>Open</button></Flyout.Trigger>
        <Flyout.Content>
          <Flyout.Body>Icerik</Flyout.Body>
        </Flyout.Content>
      </Flyout>,
    );
    expect(screen.getByTestId('flyout-body').className).toContain('cmp-body');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Flyout defaultOpen styles={{ body: { padding: '32px' } }}>
        <Flyout.Trigger><button>Open</button></Flyout.Trigger>
        <Flyout.Content>
          <Flyout.Body>Icerik</Flyout.Body>
        </Flyout.Content>
      </Flyout>,
    );
    expect(screen.getByTestId('flyout-body')).toHaveStyle({ padding: '32px' });
  });
});
