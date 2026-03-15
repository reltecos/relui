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
import { Modal } from './Modal';

describe('Modal', () => {
  // ── Render ──

  it('open=false iken sadece anchor render eder', () => {
    render(<Modal open={false}>Icerik</Modal>);
    expect(screen.getByTestId('modal-anchor')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-root')).not.toBeInTheDocument();
  });

  it('open=true iken modal render eder', () => {
    render(<Modal open={true}>Icerik</Modal>);
    expect(screen.getByTestId('modal-root')).toBeInTheDocument();
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });

  it('children body icinde render edilir', () => {
    render(<Modal open={true}>Modal icerigi</Modal>);
    expect(screen.getByTestId('modal-body')).toHaveTextContent('Modal icerigi');
  });

  // ── Title ──

  it('title verilince header ve baslik render eder', () => {
    render(<Modal open={true} title="Test Baslik">Icerik</Modal>);
    expect(screen.getByTestId('modal-header')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Test Baslik');
  });

  it('title verilmezse baslik render edilmez', () => {
    render(<Modal open={true}>Icerik</Modal>);
    expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
  });

  // ── Close button ──

  it('varsayilan olarak kapat butonu gosterir', () => {
    render(<Modal open={true}>Icerik</Modal>);
    expect(screen.getByTestId('modal-close')).toBeInTheDocument();
  });

  it('showCloseButton=false iken kapat butonu gorunmez', () => {
    render(<Modal open={true} showCloseButton={false}>Icerik</Modal>);
    expect(screen.queryByTestId('modal-close')).not.toBeInTheDocument();
  });

  it('showCloseButton=false ve title yok iken header gorunmez', () => {
    render(<Modal open={true} showCloseButton={false}>Icerik</Modal>);
    expect(screen.queryByTestId('modal-header')).not.toBeInTheDocument();
  });

  it('kapat butonuna tiklaninca onClose cagirilir', () => {
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose}>Icerik</Modal>);
    fireEvent.click(screen.getByTestId('modal-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // ── Footer ──

  it('footer verilince render eder', () => {
    render(
      <Modal open={true} footer={<button>Kaydet</button>}>
        Icerik
      </Modal>,
    );
    expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
    expect(screen.getByText('Kaydet')).toBeInTheDocument();
  });

  it('footer verilmezse footer render edilmez', () => {
    render(<Modal open={true}>Icerik</Modal>);
    expect(screen.queryByTestId('modal-footer')).not.toBeInTheDocument();
  });

  // ── Overlay click ──

  it('overlay tiklaninca onClose cagirilir', () => {
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose}>Icerik</Modal>);
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnOverlay=false iken overlay tiklaninca kapanmaz', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} closeOnOverlay={false}>
        Icerik
      </Modal>,
    );
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).not.toHaveBeenCalled();
  });

  // ── Escape key ──

  it('Escape tusuna basilinca onClose cagirilir', () => {
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose}>Icerik</Modal>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnEscape=false iken Escape calismaz', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} closeOnEscape={false}>
        Icerik
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  // ── A11y ──

  it('content role=dialog icerir', () => {
    render(<Modal open={true}>Icerik</Modal>);
    expect(screen.getByTestId('modal-content')).toHaveAttribute('role', 'dialog');
  });

  it('content aria-modal=true icerir', () => {
    render(<Modal open={true}>Icerik</Modal>);
    expect(screen.getByTestId('modal-content')).toHaveAttribute('aria-modal', 'true');
  });

  it('title varken aria-labelledby ayarlanir', () => {
    render(<Modal open={true} title="Baslik">Icerik</Modal>);
    expect(screen.getByTestId('modal-content')).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('kapat butonu aria-label icerir', () => {
    render(<Modal open={true}>Icerik</Modal>);
    expect(screen.getByTestId('modal-close')).toHaveAttribute('aria-label', 'Kapat');
  });

  it('kapat butonu type=button icerir', () => {
    render(<Modal open={true}>Icerik</Modal>);
    expect(screen.getByTestId('modal-close')).toHaveAttribute('type', 'button');
  });

  it('overlay aria-hidden=true icerir', () => {
    render(<Modal open={true}>Icerik</Modal>);
    expect(screen.getByTestId('modal-overlay')).toHaveAttribute('aria-hidden', 'true');
  });

  // ── ref ──

  it('ref root elementine iletilir', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Modal ref={ref} open={true}>Icerik</Modal>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // ── className & style ──

  it('className content elementine eklenir', () => {
    render(<Modal open={true} className="custom-modal">Icerik</Modal>);
    expect(screen.getByTestId('modal-content').className).toContain('custom-modal');
  });

  it('style content elementine uygulanir', () => {
    render(<Modal open={true} style={{ padding: '40px' }}>Icerik</Modal>);
    expect(screen.getByTestId('modal-content')).toHaveStyle({ padding: '40px' });
  });

  // ── Slot API: classNames ──

  it('classNames.overlay overlay elementine eklenir', () => {
    render(
      <Modal open={true} classNames={{ overlay: 'custom-overlay' }}>
        Icerik
      </Modal>,
    );
    expect(screen.getByTestId('modal-overlay').className).toContain('custom-overlay');
  });

  it('classNames.header header elementine eklenir', () => {
    render(
      <Modal open={true} title="T" classNames={{ header: 'custom-header' }}>
        Icerik
      </Modal>,
    );
    expect(screen.getByTestId('modal-header').className).toContain('custom-header');
  });

  it('classNames.body body elementine eklenir', () => {
    render(
      <Modal open={true} classNames={{ body: 'custom-body' }}>
        Icerik
      </Modal>,
    );
    expect(screen.getByTestId('modal-body').className).toContain('custom-body');
  });

  // ── Slot API: styles ──

  it('styles.overlay overlay elementine uygulanir', () => {
    render(
      <Modal open={true} styles={{ overlay: { opacity: '0.8' } }}>
        Icerik
      </Modal>,
    );
    expect(screen.getByTestId('modal-overlay')).toHaveStyle({ opacity: '0.8' });
  });

  it('styles.body body elementine uygulanir', () => {
    render(
      <Modal open={true} styles={{ body: { padding: '40px' } }}>
        Icerik
      </Modal>,
    );
    expect(screen.getByTestId('modal-body')).toHaveStyle({ padding: '40px' });
  });

  it('styles.footer footer elementine uygulanir', () => {
    render(
      <Modal open={true} footer={<span>F</span>} styles={{ footer: { padding: '20px' } }}>
        Icerik
      </Modal>,
    );
    expect(screen.getByTestId('modal-footer')).toHaveStyle({ padding: '20px' });
  });

  it('styles.closeButton close butonuna uygulanir', () => {
    render(
      <Modal open={true} styles={{ closeButton: { opacity: '0.5' } }}>
        Icerik
      </Modal>,
    );
    expect(screen.getByTestId('modal-close')).toHaveStyle({ opacity: '0.5' });
  });
});

// ── Compound API ──

describe('Modal (Compound)', () => {
  it('compound: header render edilir', () => {
    render(
      <Modal open={true}>
        <Modal.Header>
          <h2>Compound Baslik</h2>
        </Modal.Header>
        <Modal.Body>Icerik</Modal.Body>
      </Modal>,
    );
    expect(screen.getByTestId('modal-header')).toBeInTheDocument();
    expect(screen.getByText('Compound Baslik')).toBeInTheDocument();
  });

  it('compound: body render edilir', () => {
    render(
      <Modal open={true}>
        <Modal.Body>Compound icerik</Modal.Body>
      </Modal>,
    );
    expect(screen.getByTestId('modal-body')).toHaveTextContent('Compound icerik');
  });

  it('compound: footer render edilir', () => {
    render(
      <Modal open={true}>
        <Modal.Body>Icerik</Modal.Body>
        <Modal.Footer>
          <button>Kaydet</button>
        </Modal.Footer>
      </Modal>,
    );
    expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
    expect(screen.getByText('Kaydet')).toBeInTheDocument();
  });

  it('compound: close button render edilir ve onClose cagirilir', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <Modal.Header>
          <h2>Baslik</h2>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>Icerik</Modal.Body>
      </Modal>,
    );
    expect(screen.getByTestId('modal-close')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('modal-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Modal open={true} classNames={{ body: 'cmp-body' }}>
        <Modal.Body>Icerik</Modal.Body>
      </Modal>,
    );
    expect(screen.getByTestId('modal-body').className).toContain('cmp-body');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Modal open={true} styles={{ body: { padding: '40px' } }}>
        <Modal.Body>Icerik</Modal.Body>
      </Modal>,
    );
    expect(screen.getByTestId('modal-body')).toHaveStyle({ padding: '40px' });
  });

  it('compound: overlay ve content hala dogru render edilir', () => {
    render(
      <Modal open={true}>
        <Modal.Body>Icerik</Modal.Body>
      </Modal>,
    );
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toHaveAttribute('role', 'dialog');
  });
});
