/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import { Modal } from './Modal';

export default {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
};

// ── Default ──

function DefaultDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: 'var(--rel-color-primary, #3b82f6)',
          color: 'var(--rel-color-text-inverse, #fff)',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Modal Ac
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Hosgeldiniz"
        footer={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--rel-color-border, #d1d5db)',
                borderRadius: 6,
                backgroundColor: 'var(--rel-color-bg, #fff)',
                cursor: 'pointer',
              }}
            >
              Iptal
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: 6,
                backgroundColor: 'var(--rel-color-primary, #3b82f6)',
                color: 'var(--rel-color-text-inverse, #fff)',
                cursor: 'pointer',
              }}
            >
              Tamam
            </button>
          </div>
        }
      >
        <p style={{ margin: 0 }}>
          Bu bir modal dialog ornegi. Icerik buraya yazilir.
          Overlay tiklanarak veya Escape tusuyla kapatilabilir.
        </p>
      </Modal>
    </div>
  );
}

export const Default = () => <DefaultDemo />;

// ── AllSizes ──

function AllSizesDemo() {
  const [openSize, setOpenSize] = useState<string | null>(null);

  const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', gap: 8 }}>
      {sizes.map((s) => (
        <button
          key={s}
          onClick={() => setOpenSize(s)}
          style={{
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 500,
            backgroundColor: 'var(--rel-color-primary, #3b82f6)',
            color: 'var(--rel-color-text-inverse, #fff)',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {s.toUpperCase()}
        </button>
      ))}

      {sizes.map((s) => (
        <Modal
          key={s}
          open={openSize === s}
          onClose={() => setOpenSize(null)}
          title={`${s.toUpperCase()} Modal`}
          size={s}
        >
          <p style={{ margin: 0 }}>
            Bu modal {s} boyutunda. Pencereyi yeniden boyutlandirarak responsive
            davranisini gorebilirsiniz.
          </p>
        </Modal>
      ))}
    </div>
  );
}

export const AllSizes = () => <AllSizesDemo />;

// ── WithLongContent ──

function WithLongContentDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: 'var(--rel-color-info, #8b5cf6)',
          color: 'var(--rel-color-text-inverse, #fff)',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Uzun Icerikli Modal
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Kullanim Kosullari"
        footer={
          <button
            onClick={() => setOpen(false)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: 6,
              backgroundColor: 'var(--rel-color-primary, #3b82f6)',
              color: 'var(--rel-color-text-inverse, #fff)',
              cursor: 'pointer',
            }}
          >
            Kabul Ediyorum
          </button>
        }
      >
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ margin: '0 0 12px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris.
          </p>
        ))}
      </Modal>
    </div>
  );
}

export const WithLongContent = () => <WithLongContentDemo />;

// ── CustomSlotStyles ──

function CustomSlotStylesDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: 'var(--rel-color-success, #059669)',
          color: 'var(--rel-color-text-inverse, #fff)',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Koyu Tema Modal
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Koyu Tema"
        footer={
          <button
            onClick={() => setOpen(false)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: 6,
              backgroundColor: 'var(--rel-color-success, #10b981)',
              color: 'var(--rel-color-text-inverse, #fff)',
              cursor: 'pointer',
            }}
          >
            Tamam
          </button>
        }
        styles={{
          overlay: { backgroundColor: 'var(--rel-color-overlay, rgba(0, 0, 0, 0.7))' },
          content: { backgroundColor: 'var(--rel-color-bg-inverse, #1e293b)', borderRadius: '16px' },
          header: { borderBottomColor: 'var(--rel-color-bg-inverse-subtle, #334155)' },
          title: { color: 'var(--rel-color-border, #e2e8f0)' },
          body: { color: 'var(--rel-color-text-muted, #94a3b8)' },
          footer: { borderTopColor: 'var(--rel-color-bg-inverse-subtle, #334155)' },
          closeButton: { color: 'var(--rel-color-text-muted, #94a3b8)' },
        }}
      >
        <p style={{ margin: 0 }}>
          Slot API ile modal bileseni tamamen ozellestirilebilir.
          Koyu tema ornegi.
        </p>
      </Modal>
    </div>
  );
}

export const CustomSlotStyles = () => <CustomSlotStylesDemo />;

// ── Compound ──

function CompoundDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: 'var(--rel-color-info, #8b5cf6)',
          color: 'var(--rel-color-text-inverse, #fff)',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Compound Modal
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>
          <h2 style={{ margin: 0, fontSize: 18 }}>Compound Baslik</h2>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <p style={{ margin: 0 }}>
            Bu bir compound API ornegi. Header, Body ve Footer ayri ayri verilebilir.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--rel-color-border, #d1d5db)',
                borderRadius: 6,
                backgroundColor: 'var(--rel-color-bg, #fff)',
                cursor: 'pointer',
              }}
            >
              Iptal
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: 6,
                backgroundColor: 'var(--rel-color-info, #8b5cf6)',
                color: 'var(--rel-color-text-inverse, #fff)',
                cursor: 'pointer',
              }}
            >
              Tamam
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export const Compound = () => <CompoundDemo />;

// ── WithForm ──

function WithFormDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          backgroundColor: 'var(--rel-color-info, #0ea5e9)',
          color: 'var(--rel-color-text-inverse, #fff)',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Form Modal Ac
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Kullanici Olustur"
        footer={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: '8px 16px',
                border: '1px solid var(--rel-color-border, #d1d5db)',
                borderRadius: 6,
                backgroundColor: 'var(--rel-color-bg, #fff)',
                cursor: 'pointer',
              }}
            >
              Iptal
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: 6,
                backgroundColor: 'var(--rel-color-info, #0ea5e9)',
                color: 'var(--rel-color-text-inverse, #fff)',
                cursor: 'pointer',
              }}
            >
              Olustur
            </button>
          </div>
        }
      >
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
            Ad Soyad
            <input
              style={{
                padding: '8px 12px',
                border: '1px solid var(--rel-color-border, #d1d5db)',
                borderRadius: 6,
                outline: 'none',
              }}
              placeholder="Ornek: Ali Yilmaz"
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
            E-posta
            <input
              type="email"
              style={{
                padding: '8px 12px',
                border: '1px solid var(--rel-color-border, #d1d5db)',
                borderRadius: 6,
                outline: 'none',
              }}
              placeholder="ornek@mail.com"
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
            Sifre
            <input
              type="password"
              style={{
                padding: '8px 12px',
                border: '1px solid var(--rel-color-border, #d1d5db)',
                borderRadius: 6,
                outline: 'none',
              }}
              placeholder="En az 8 karakter"
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <input type="checkbox" />
            Kullanim kosullarini kabul ediyorum
          </label>
        </form>
      </Modal>
    </div>
  );
}

export const WithForm = () => <WithFormDemo />;
