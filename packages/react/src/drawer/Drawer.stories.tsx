/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import { Drawer } from './Drawer';

export default {
  title: 'Overlay/Drawer',
  component: Drawer,
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
        Drawer Ac (Sag)
      </button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Ayarlar"
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
            Kaydet
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
            Kullanici Adi
            <input
              style={{
                padding: '8px 12px',
                border: '1px solid var(--rel-color-border, #d1d5db)',
                borderRadius: 6,
                outline: 'none',
              }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
            E-posta
            <input
              style={{
                padding: '8px 12px',
                border: '1px solid var(--rel-color-border, #d1d5db)',
                borderRadius: 6,
                outline: 'none',
              }}
            />
          </label>
        </div>
      </Drawer>
    </div>
  );
}

export const Default = () => <DefaultDemo />;

// ── AllPlacements ──

function AllPlacementsDemo() {
  const [openPlacement, setOpenPlacement] = useState<string | null>(null);

  const placements = ['left', 'right', 'top', 'bottom'] as const;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', gap: 8 }}>
      {placements.map((p) => (
        <button
          key={p}
          onClick={() => setOpenPlacement(p)}
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
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}

      {placements.map((p) => (
        <Drawer
          key={p}
          open={openPlacement === p}
          onClose={() => setOpenPlacement(null)}
          title={`${p.charAt(0).toUpperCase() + p.slice(1)} Drawer`}
          placement={p}
        >
          <p style={{ margin: 0 }}>
            Bu drawer {p} yonunden acilir.
          </p>
        </Drawer>
      ))}
    </div>
  );
}

export const AllPlacements = () => <AllPlacementsDemo />;

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
        Koyu Tema Drawer
      </button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Koyu Tema"
        placement="left"
        styles={{
          overlay: { backgroundColor: 'var(--rel-color-overlay, rgba(0, 0, 0, 0.7))' },
          panel: { backgroundColor: 'var(--rel-color-bg-inverse, #1e293b)' },
          header: { borderBottomColor: 'var(--rel-color-border, #334155)' },
          title: { color: 'var(--rel-color-text-secondary, #e2e8f0)' },
          body: { color: 'var(--rel-color-text-secondary, #94a3b8)' },
          closeButton: { color: 'var(--rel-color-text-secondary, #94a3b8)' },
        }}
      >
        <p style={{ margin: 0 }}>Koyu tema drawer ornegi.</p>
      </Drawer>
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
          backgroundColor: 'var(--rel-color-accent, #8b5cf6)',
          color: 'var(--rel-color-text-inverse, #fff)',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Compound Drawer
      </button>

      <Drawer open={open} onClose={() => setOpen(false)} placement="right">
        <Drawer.Header>
          <h2 style={{ margin: 0, fontSize: 16 }}>Compound Drawer</h2>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          <p style={{ margin: 0 }}>
            Bu bir compound API ornegi. Header, Body ve Footer ayri ayri verilebilir.
          </p>
        </Drawer.Body>
        <Drawer.Footer>
          <button
            onClick={() => setOpen(false)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: 6,
              backgroundColor: 'var(--rel-color-accent, #8b5cf6)',
              color: 'var(--rel-color-text-inverse, #fff)',
              cursor: 'pointer',
            }}
          >
            Kaydet
          </button>
        </Drawer.Footer>
      </Drawer>
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
        Form Drawer Ac
      </button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Yeni Kayit Ekle"
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
              Kaydet
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
            Rol
            <select
              style={{
                padding: '8px 12px',
                border: '1px solid var(--rel-color-border, #d1d5db)',
                borderRadius: 6,
                outline: 'none',
                backgroundColor: 'var(--rel-color-bg, #fff)',
              }}
            >
              <option>Kullanici</option>
              <option>Yonetici</option>
              <option>Admin</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
            Notlar
            <textarea
              rows={3}
              style={{
                padding: '8px 12px',
                border: '1px solid var(--rel-color-border, #d1d5db)',
                borderRadius: 6,
                outline: 'none',
                resize: 'vertical',
              }}
              placeholder="Opsiyonel notlar..."
            />
          </label>
        </form>
      </Drawer>
    </div>
  );
}

export const WithForm = () => <WithFormDemo />;

// ── Sizes ──

function SizesDemo() {
  const [openSize, setOpenSize] = useState<string | null>(null);

  const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {sizes.map((s) => (
        <button
          key={s}
          onClick={() => setOpenSize(s)}
          style={{
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 500,
            backgroundColor: 'var(--rel-color-info, #6366f1)',
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
        <Drawer
          key={s}
          open={openSize === s}
          onClose={() => setOpenSize(null)}
          title={`${s.toUpperCase()} Drawer`}
          size={s}
        >
          <p style={{ margin: 0, fontSize: 14 }}>
            Bu drawer <strong>{s}</strong> boyutunda acilmistir.
          </p>
        </Drawer>
      ))}
    </div>
  );
}

export const Sizes = () => <SizesDemo />;
