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
import { AlertDialog, type AlertDialogComponentProps } from './AlertDialog';

// ── Helper ──────────────────────────────────────────

function renderDialog(props: Partial<AlertDialogComponentProps> = {}) {
  const defaultProps: AlertDialogComponentProps = {
    open: true,
    title: 'Emin misiniz?',
    portalContainer: document.body,
    ...props,
  };
  return render(<AlertDialog {...defaultProps} />);
}

// ── Tests ───────────────────────────────────────────

describe('AlertDialog', () => {
  // ── Render ──

  it('open=true iken render eder', () => {
    renderDialog();
    expect(screen.getByTestId('alert-dialog-content')).toBeInTheDocument();
  });

  it('open=false iken render etmez', () => {
    renderDialog({ open: false });
    expect(screen.queryByTestId('alert-dialog-content')).not.toBeInTheDocument();
  });

  it('basligi gosterir', () => {
    renderDialog({ title: 'Silmek istiyor musunuz?' });
    expect(screen.getByTestId('alert-dialog-title')).toHaveTextContent('Silmek istiyor musunuz?');
  });

  it('aciklamayi gosterir', () => {
    renderDialog({ description: 'Bu islem geri alinamaz.' });
    expect(screen.getByTestId('alert-dialog-description')).toHaveTextContent('Bu islem geri alinamaz.');
  });

  it('aciklama yoksa description render etmez', () => {
    renderDialog({ description: undefined });
    expect(screen.queryByTestId('alert-dialog-description')).not.toBeInTheDocument();
  });

  // ── Buton metinleri ──

  it('varsayilan buton metinlerini gosterir', () => {
    renderDialog();
    expect(screen.getByTestId('alert-dialog-cancel')).toHaveTextContent('Vazgec');
    expect(screen.getByTestId('alert-dialog-confirm')).toHaveTextContent('Onayla');
  });

  it('ozel buton metinlerini gosterir', () => {
    renderDialog({ confirmLabel: 'Sil', cancelLabel: 'Iptal' });
    expect(screen.getByTestId('alert-dialog-cancel')).toHaveTextContent('Iptal');
    expect(screen.getByTestId('alert-dialog-confirm')).toHaveTextContent('Sil');
  });

  // ── Severity ──

  it('data-severity attribute yazar', () => {
    renderDialog({ severity: 'warning' });
    expect(screen.getByTestId('alert-dialog-content')).toHaveAttribute('data-severity', 'warning');
  });

  it.each(['danger', 'warning', 'info'] as const)(
    '%s severity icin ikon render eder',
    (severity) => {
      renderDialog({ severity });
      const iconEl = screen.getByTestId('alert-dialog-icon');
      const svg = iconEl.querySelector('svg');
      expect(svg).toBeInTheDocument();
    },
  );

  // ── Callbacks ──

  it('onConfirm tiklaninca cagrilir', () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    renderDialog({ onConfirm, onOpenChange });
    fireEvent.click(screen.getByTestId('alert-dialog-confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('onCancel tiklaninca cagrilir', () => {
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    renderDialog({ onCancel, onOpenChange });
    fireEvent.click(screen.getByTestId('alert-dialog-cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── Overlay click ──

  it('overlay tiklaninca kapanir (closeOnOverlay=true)', () => {
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    renderDialog({ closeOnOverlay: true, onCancel, onOpenChange });
    fireEvent.click(screen.getByTestId('alert-dialog-overlay'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('closeOnOverlay=false iken overlay tiklama kapamaz', () => {
    const onCancel = vi.fn();
    renderDialog({ closeOnOverlay: false, onCancel });
    fireEvent.click(screen.getByTestId('alert-dialog-overlay'));
    expect(onCancel).not.toHaveBeenCalled();
  });

  // ── Escape ──

  it('Escape tusuyla kapanir (closeOnEscape=true)', () => {
    const onCancel = vi.fn();
    renderDialog({ closeOnEscape: true, onCancel });
    fireEvent.keyDown(screen.getByTestId('alert-dialog-content'), { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('closeOnEscape=false iken Escape kapamaz', () => {
    const onCancel = vi.fn();
    renderDialog({ closeOnEscape: false, onCancel });
    fireEvent.keyDown(screen.getByTestId('alert-dialog-content'), { key: 'Escape' });
    expect(onCancel).not.toHaveBeenCalled();
  });

  // ── Loading ──

  it('loading durumunda butonlar disabled olur', () => {
    renderDialog({ loading: true });
    expect(screen.getByTestId('alert-dialog-cancel')).toBeDisabled();
    expect(screen.getByTestId('alert-dialog-confirm')).toBeDisabled();
  });

  it('loading durumunda confirm butonu "Yukleniyor..." gosterir', () => {
    renderDialog({ loading: true, confirmLabel: 'Sil' });
    expect(screen.getByTestId('alert-dialog-confirm')).toHaveTextContent('Yukleniyor...');
  });

  // ── A11y ──

  it('role="alertdialog" tasir', () => {
    renderDialog();
    expect(screen.getByTestId('alert-dialog-content')).toHaveAttribute('role', 'alertdialog');
  });

  it('aria-modal="true" tasir', () => {
    renderDialog();
    expect(screen.getByTestId('alert-dialog-content')).toHaveAttribute('aria-modal', 'true');
  });

  it('aria-labelledby id ile baglıdir', () => {
    renderDialog({ id: 'dlg' });
    expect(screen.getByTestId('alert-dialog-content')).toHaveAttribute('aria-labelledby', 'dlg-title');
    expect(screen.getByTestId('alert-dialog-title')).toHaveAttribute('id', 'dlg-title');
  });

  it('aria-describedby description varsa baglıdir', () => {
    renderDialog({ id: 'dlg', description: 'Aciklama' });
    expect(screen.getByTestId('alert-dialog-content')).toHaveAttribute('aria-describedby', 'dlg-desc');
    expect(screen.getByTestId('alert-dialog-description')).toHaveAttribute('id', 'dlg-desc');
  });

  it('overlay aria-hidden="true" tasir', () => {
    renderDialog();
    expect(screen.getByTestId('alert-dialog-overlay')).toHaveAttribute('aria-hidden', 'true');
  });

  // ── id ──

  it('id prop iletir', () => {
    renderDialog({ id: 'my-dialog' });
    expect(screen.getByTestId('alert-dialog-content')).toHaveAttribute('id', 'my-dialog');
  });

  // ── className + style ──

  it('className prop content e eklenir', () => {
    renderDialog({ className: 'custom-dialog' });
    expect(screen.getByTestId('alert-dialog-content').className).toContain('custom-dialog');
  });

  it('style prop content e uygulanir', () => {
    renderDialog({ style: { padding: '40px' } });
    expect(screen.getByTestId('alert-dialog-content')).toHaveStyle({ padding: '40px' });
  });

  // ── Slot API: classNames ──

  it('classNames.overlay overlay a eklenir', () => {
    renderDialog({ classNames: { overlay: 'slot-overlay' } });
    expect(screen.getByTestId('alert-dialog-overlay').className).toContain('slot-overlay');
  });

  it('classNames.content content a eklenir', () => {
    renderDialog({ classNames: { content: 'slot-content' } });
    expect(screen.getByTestId('alert-dialog-content').className).toContain('slot-content');
  });

  it('classNames.title title a eklenir', () => {
    renderDialog({ classNames: { title: 'slot-title' } });
    expect(screen.getByTestId('alert-dialog-title').className).toContain('slot-title');
  });

  it('classNames.confirmButton confirm butonuna eklenir', () => {
    renderDialog({ classNames: { confirmButton: 'slot-confirm' } });
    expect(screen.getByTestId('alert-dialog-confirm').className).toContain('slot-confirm');
  });

  it('classNames.cancelButton cancel butonuna eklenir', () => {
    renderDialog({ classNames: { cancelButton: 'slot-cancel' } });
    expect(screen.getByTestId('alert-dialog-cancel').className).toContain('slot-cancel');
  });

  // ── Slot API: styles ──

  it('styles.overlay overlay a uygulanir', () => {
    renderDialog({ styles: { overlay: { opacity: '0.8' } } });
    expect(screen.getByTestId('alert-dialog-overlay')).toHaveStyle({ opacity: '0.8' });
  });

  it('styles.content content a uygulanir', () => {
    renderDialog({ styles: { content: { padding: '32px' } } });
    expect(screen.getByTestId('alert-dialog-content')).toHaveStyle({ padding: '32px' });
  });

  it('styles.footer footer a uygulanir', () => {
    renderDialog({ styles: { footer: { padding: '16px' } } });
    expect(screen.getByTestId('alert-dialog-footer')).toHaveStyle({ padding: '16px' });
  });

  it('styles.confirmButton confirm butonuna uygulanir', () => {
    renderDialog({ styles: { confirmButton: { fontSize: '16px' } } });
    expect(screen.getByTestId('alert-dialog-confirm')).toHaveStyle({ fontSize: '16px' });
  });

  it('styles.title title elemana uygulanir', () => {
    renderDialog({ styles: { title: { letterSpacing: '0.5px' } } });
    expect(screen.getByTestId('alert-dialog-title')).toHaveStyle({ letterSpacing: '0.5px' });
  });

  it('styles.description description elemana uygulanir', () => {
    renderDialog({ description: 'Test aciklama', styles: { description: { fontSize: '14px' } } });
    expect(screen.getByTestId('alert-dialog-description')).toHaveStyle({ fontSize: '14px' });
  });

  it('styles.cancelButton cancel butonuna uygulanir', () => {
    renderDialog({ styles: { cancelButton: { fontWeight: '600' } } });
    expect(screen.getByTestId('alert-dialog-cancel')).toHaveStyle({ fontWeight: '600' });
  });

  it('styles.icon icon elemana uygulanir', () => {
    renderDialog({ severity: 'warning', styles: { icon: { opacity: '0.8' } } });
    expect(screen.getByTestId('alert-dialog-icon')).toHaveStyle({ opacity: '0.8' });
  });

  // ── ref ──

  it('ref iletir', () => {
    const ref = vi.fn();
    render(
      <AlertDialog
        ref={ref}
        open={true}
        title="Test"
        portalContainer={document.body}
      />,
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  // ── open degisince guncellenir ──

  it('open false a cevrilince kapanir', () => {
    const { rerender } = render(
      <AlertDialog open={true} title="Test" portalContainer={document.body} />,
    );
    expect(screen.getByTestId('alert-dialog-content')).toBeInTheDocument();
    rerender(
      <AlertDialog open={false} title="Test" portalContainer={document.body} />,
    );
    expect(screen.queryByTestId('alert-dialog-content')).not.toBeInTheDocument();
  });
});

// ── Compound API ──────────────────────────────────────

describe('AlertDialog (Compound)', () => {
  it('compound: title render edilir', () => {
    render(
      <AlertDialog open={true} portalContainer={document.body}>
        <AlertDialog.Title>Compound Baslik</AlertDialog.Title>
        <AlertDialog.Actions>
          <AlertDialog.CancelButton onClick={() => {}}>Vazgec</AlertDialog.CancelButton>
          <AlertDialog.ConfirmButton onClick={() => {}}>Onayla</AlertDialog.ConfirmButton>
        </AlertDialog.Actions>
      </AlertDialog>,
    );
    expect(screen.getByTestId('alert-dialog-title')).toHaveTextContent('Compound Baslik');
  });

  it('compound: description render edilir', () => {
    render(
      <AlertDialog open={true} portalContainer={document.body}>
        <AlertDialog.Title>Test</AlertDialog.Title>
        <AlertDialog.Description>Compound aciklama</AlertDialog.Description>
        <AlertDialog.Actions>
          <AlertDialog.CancelButton onClick={() => {}}>Vazgec</AlertDialog.CancelButton>
        </AlertDialog.Actions>
      </AlertDialog>,
    );
    expect(screen.getByTestId('alert-dialog-description')).toHaveTextContent('Compound aciklama');
  });

  it('compound: actions footer render edilir', () => {
    render(
      <AlertDialog open={true} portalContainer={document.body}>
        <AlertDialog.Title>Test</AlertDialog.Title>
        <AlertDialog.Actions>
          <AlertDialog.CancelButton onClick={() => {}}>Iptal</AlertDialog.CancelButton>
          <AlertDialog.ConfirmButton onClick={() => {}}>Sil</AlertDialog.ConfirmButton>
        </AlertDialog.Actions>
      </AlertDialog>,
    );
    expect(screen.getByTestId('alert-dialog-footer')).toBeInTheDocument();
    expect(screen.getByTestId('alert-dialog-cancel')).toHaveTextContent('Iptal');
    expect(screen.getByTestId('alert-dialog-confirm')).toHaveTextContent('Sil');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <AlertDialog open={true} portalContainer={document.body} classNames={{ title: 'cmp-title' }}>
        <AlertDialog.Title>Test</AlertDialog.Title>
        <AlertDialog.Actions>
          <AlertDialog.CancelButton onClick={() => {}}>Vazgec</AlertDialog.CancelButton>
        </AlertDialog.Actions>
      </AlertDialog>,
    );
    expect(screen.getByTestId('alert-dialog-title').className).toContain('cmp-title');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <AlertDialog open={true} portalContainer={document.body} styles={{ title: { fontSize: '28px' } }}>
        <AlertDialog.Title>Test</AlertDialog.Title>
        <AlertDialog.Actions>
          <AlertDialog.CancelButton onClick={() => {}}>Vazgec</AlertDialog.CancelButton>
        </AlertDialog.Actions>
      </AlertDialog>,
    );
    expect(screen.getByTestId('alert-dialog-title')).toHaveStyle({ fontSize: '28px' });
  });
});
