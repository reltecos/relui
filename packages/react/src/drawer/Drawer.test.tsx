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
import { Drawer } from './Drawer';

describe('Drawer', () => {
  // ── Render ──

  it('open=false iken sadece anchor render eder', () => {
    render(<Drawer open={false}>Icerik</Drawer>);
    expect(screen.getByTestId('drawer-anchor')).toBeInTheDocument();
    expect(screen.queryByTestId('drawer-root')).not.toBeInTheDocument();
  });

  it('open=true iken drawer render eder', () => {
    render(<Drawer open={true}>Icerik</Drawer>);
    expect(screen.getByTestId('drawer-root')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-panel')).toBeInTheDocument();
  });

  it('children body icinde render edilir', () => {
    render(<Drawer open={true}>Drawer icerigi</Drawer>);
    expect(screen.getByTestId('drawer-body')).toHaveTextContent('Drawer icerigi');
  });

  // ── Placement ──

  it('varsayilan placement right', () => {
    render(<Drawer open={true}>Icerik</Drawer>);
    expect(screen.getByTestId('drawer-panel')).toHaveAttribute('data-placement', 'right');
  });

  it('placement=left', () => {
    render(<Drawer open={true} placement="left">Icerik</Drawer>);
    expect(screen.getByTestId('drawer-panel')).toHaveAttribute('data-placement', 'left');
  });

  it('placement=top', () => {
    render(<Drawer open={true} placement="top">Icerik</Drawer>);
    expect(screen.getByTestId('drawer-panel')).toHaveAttribute('data-placement', 'top');
  });

  it('placement=bottom', () => {
    render(<Drawer open={true} placement="bottom">Icerik</Drawer>);
    expect(screen.getByTestId('drawer-panel')).toHaveAttribute('data-placement', 'bottom');
  });

  // ── Title ──

  it('title verilince header ve baslik render eder', () => {
    render(<Drawer open={true} title="Menu">Icerik</Drawer>);
    expect(screen.getByTestId('drawer-header')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-title')).toHaveTextContent('Menu');
  });

  it('title verilmezse baslik render edilmez', () => {
    render(<Drawer open={true}>Icerik</Drawer>);
    expect(screen.queryByTestId('drawer-title')).not.toBeInTheDocument();
  });

  // ── Close button ──

  it('varsayilan olarak kapat butonu gosterir', () => {
    render(<Drawer open={true}>Icerik</Drawer>);
    expect(screen.getByTestId('drawer-close')).toBeInTheDocument();
  });

  it('showCloseButton=false iken kapat butonu gorunmez', () => {
    render(<Drawer open={true} showCloseButton={false}>Icerik</Drawer>);
    expect(screen.queryByTestId('drawer-close')).not.toBeInTheDocument();
  });

  it('kapat butonuna tiklaninca onClose cagirilir', () => {
    const onClose = vi.fn();
    render(<Drawer open={true} onClose={onClose}>Icerik</Drawer>);
    fireEvent.click(screen.getByTestId('drawer-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // ── Footer ──

  it('footer verilince render eder', () => {
    render(
      <Drawer open={true} footer={<button>Kaydet</button>}>
        Icerik
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-footer')).toBeInTheDocument();
  });

  it('footer verilmezse footer render edilmez', () => {
    render(<Drawer open={true}>Icerik</Drawer>);
    expect(screen.queryByTestId('drawer-footer')).not.toBeInTheDocument();
  });

  // ── Overlay click ──

  it('overlay tiklaninca onClose cagirilir', () => {
    const onClose = vi.fn();
    render(<Drawer open={true} onClose={onClose}>Icerik</Drawer>);
    fireEvent.click(screen.getByTestId('drawer-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnOverlay=false iken overlay tiklaninca kapanmaz', () => {
    const onClose = vi.fn();
    render(
      <Drawer open={true} onClose={onClose} closeOnOverlay={false}>
        Icerik
      </Drawer>,
    );
    fireEvent.click(screen.getByTestId('drawer-overlay'));
    expect(onClose).not.toHaveBeenCalled();
  });

  // ── Escape key ──

  it('Escape tusuna basilinca onClose cagirilir', () => {
    const onClose = vi.fn();
    render(<Drawer open={true} onClose={onClose}>Icerik</Drawer>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnEscape=false iken Escape calismaz', () => {
    const onClose = vi.fn();
    render(
      <Drawer open={true} onClose={onClose} closeOnEscape={false}>
        Icerik
      </Drawer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  // ── A11y ──

  it('panel role=dialog icerir', () => {
    render(<Drawer open={true}>Icerik</Drawer>);
    expect(screen.getByTestId('drawer-panel')).toHaveAttribute('role', 'dialog');
  });

  it('panel aria-modal=true icerir', () => {
    render(<Drawer open={true}>Icerik</Drawer>);
    expect(screen.getByTestId('drawer-panel')).toHaveAttribute('aria-modal', 'true');
  });

  it('title varken aria-labelledby ayarlanir', () => {
    render(<Drawer open={true} title="Test">Icerik</Drawer>);
    expect(screen.getByTestId('drawer-panel')).toHaveAttribute('aria-labelledby', 'drawer-title');
  });

  it('kapat butonu aria-label icerir', () => {
    render(<Drawer open={true}>Icerik</Drawer>);
    expect(screen.getByTestId('drawer-close')).toHaveAttribute('aria-label', 'Kapat');
  });

  it('overlay aria-hidden=true icerir', () => {
    render(<Drawer open={true}>Icerik</Drawer>);
    expect(screen.getByTestId('drawer-overlay')).toHaveAttribute('aria-hidden', 'true');
  });

  // ── ref ──

  it('ref root elementine iletilir', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Drawer ref={ref} open={true}>Icerik</Drawer>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── className & style ──

  it('className panel elementine eklenir', () => {
    render(<Drawer open={true} className="custom-drawer">Icerik</Drawer>);
    expect(screen.getByTestId('drawer-panel').className).toContain('custom-drawer');
  });

  it('style panel elementine uygulanir', () => {
    render(<Drawer open={true} style={{ padding: '40px' }}>Icerik</Drawer>);
    expect(screen.getByTestId('drawer-panel')).toHaveStyle({ padding: '40px' });
  });

  // ── Slot API: classNames ──

  it('classNames.overlay overlay elementine eklenir', () => {
    render(
      <Drawer open={true} classNames={{ overlay: 'custom-overlay' }}>
        Icerik
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-overlay').className).toContain('custom-overlay');
  });

  it('classNames.body body elementine eklenir', () => {
    render(
      <Drawer open={true} classNames={{ body: 'custom-body' }}>
        Icerik
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-body').className).toContain('custom-body');
  });

  // ── Slot API: styles ──

  it('styles.overlay overlay elementine uygulanir', () => {
    render(
      <Drawer open={true} styles={{ overlay: { opacity: '0.8' } }}>
        Icerik
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-overlay')).toHaveStyle({ opacity: '0.8' });
  });

  it('styles.body body elementine uygulanir', () => {
    render(
      <Drawer open={true} styles={{ body: { padding: '40px' } }}>
        Icerik
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-body')).toHaveStyle({ padding: '40px' });
  });

  it('styles.header header elementine uygulanir', () => {
    render(
      <Drawer open={true} title="T" styles={{ header: { padding: '24px' } }}>
        Icerik
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-header')).toHaveStyle({ padding: '24px' });
  });
});

// ── Compound API ──

describe('Drawer (Compound)', () => {
  it('compound: header render edilir', () => {
    render(
      <Drawer open={true}>
        <Drawer.Header>
          <h2>Compound Menu</h2>
        </Drawer.Header>
        <Drawer.Body>Icerik</Drawer.Body>
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-header')).toBeInTheDocument();
    expect(screen.getByText('Compound Menu')).toBeInTheDocument();
  });

  it('compound: body render edilir', () => {
    render(
      <Drawer open={true}>
        <Drawer.Body>Compound icerik</Drawer.Body>
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-body')).toHaveTextContent('Compound icerik');
  });

  it('compound: footer render edilir', () => {
    render(
      <Drawer open={true}>
        <Drawer.Body>Icerik</Drawer.Body>
        <Drawer.Footer>
          <button>Kaydet</button>
        </Drawer.Footer>
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-footer')).toBeInTheDocument();
    expect(screen.getByText('Kaydet')).toBeInTheDocument();
  });

  it('compound: close button render edilir ve onClose cagirilir', () => {
    const onClose = vi.fn();
    render(
      <Drawer open={true} onClose={onClose}>
        <Drawer.Header>
          <h2>Baslik</h2>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>Icerik</Drawer.Body>
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-close')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('drawer-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Drawer open={true} classNames={{ body: 'cmp-body' }}>
        <Drawer.Body>Icerik</Drawer.Body>
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-body').className).toContain('cmp-body');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Drawer open={true} styles={{ body: { padding: '40px' } }}>
        <Drawer.Body>Icerik</Drawer.Body>
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-body')).toHaveStyle({ padding: '40px' });
  });

  it('compound: overlay ve panel hala dogru render edilir', () => {
    render(
      <Drawer open={true}>
        <Drawer.Body>Icerik</Drawer.Body>
      </Drawer>,
    );
    expect(screen.getByTestId('drawer-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-panel')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-panel')).toHaveAttribute('role', 'dialog');
  });
});
