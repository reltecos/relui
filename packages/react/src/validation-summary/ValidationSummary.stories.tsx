/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import { ValidationSummary } from './ValidationSummary';
import type { ValidationError } from '@relteco/relui-core';

export default {
  title: 'Feedback/ValidationSummary',
  component: ValidationSummary,
  tags: ['autodocs'],
};

// ── Default ──

const defaultErrors: ValidationError[] = [
  { field: 'name', message: 'Ad alani zorunludur' },
  { field: 'email', message: 'Gecerli bir e-posta adresi girin' },
  { field: 'password', message: 'Sifre en az 8 karakter olmali' },
  { field: 'age', message: 'Yas 18 den buyuk olmali', severity: 'warning' },
];

export const Default = () => (
  <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 500 }}>
    <ValidationSummary
      errors={defaultErrors}
      onErrorClick={(err) => {
        const el = document.getElementById(err.field);
        if (el) {
          el.focus();
          el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }}
    />

    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        id="name"
        placeholder="Ad"
        style={{
          padding: '8px 12px',
          border: '1px solid var(--rel-color-error, #ef4444)',
          borderRadius: 6,
          outline: 'none',
        }}
      />
      <input
        id="email"
        placeholder="E-posta"
        style={{
          padding: '8px 12px',
          border: '1px solid var(--rel-color-error, #ef4444)',
          borderRadius: 6,
          outline: 'none',
        }}
      />
      <input
        id="password"
        type="password"
        placeholder="Sifre"
        style={{
          padding: '8px 12px',
          border: '1px solid var(--rel-color-error, #ef4444)',
          borderRadius: 6,
          outline: 'none',
        }}
      />
      <input
        id="age"
        type="number"
        placeholder="Yas"
        style={{
          padding: '8px 12px',
          border: '1px solid var(--rel-color-warning, #d97706)',
          borderRadius: 6,
          outline: 'none',
        }}
      />
    </div>
  </div>
);

// ── Interactive ──

function InteractiveDemo() {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const validate = () => {
    const newErrors: ValidationError[] = [];
    if (!name.trim()) {
      newErrors.push({ field: 'name', message: 'Ad alani zorunludur' });
    }
    if (!email.trim()) {
      newErrors.push({ field: 'email', message: 'E-posta alani zorunludur' });
    } else if (!email.includes('@')) {
      newErrors.push({ field: 'email', message: 'Gecerli bir e-posta girin', severity: 'warning' });
    }
    setErrors(newErrors);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 500 }}>
      {errors.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <ValidationSummary
            errors={errors}
            onErrorClick={(err) => {
              const el = document.getElementById(`interactive-${err.field}`);
              if (el) el.focus();
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          id="interactive-name"
          placeholder="Ad"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--rel-color-border, #d1d5db)',
            borderRadius: 6,
            outline: 'none',
          }}
        />
        <input
          id="interactive-email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--rel-color-border, #d1d5db)',
            borderRadius: 6,
            outline: 'none',
          }}
        />
        <button
          onClick={validate}
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
          Dogrula
        </button>
      </div>
    </div>
  );
}

export const Interactive = () => <InteractiveDemo />;

// ── CustomSlotStyles ──

export const CustomSlotStyles = () => (
  <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 500 }}>
    <ValidationSummary
      errors={defaultErrors}
      title="Form Errors"
      styles={{
        root: {
          backgroundColor: 'var(--rel-color-bg-inverse, #1e293b)',
          borderColor: 'var(--rel-color-error, #f87171)',
          borderRadius: '12px',
        },
        title: { color: 'var(--rel-color-error, #fca5a5)' },
        list: { gap: '8px' },
        itemMessage: { color: 'var(--rel-color-text-secondary, #e2e8f0)' },
      }}
    />
  </div>
);

// ── Compound ──

export const Compound = () => (
  <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 500 }}>
    <ValidationSummary errors={defaultErrors}>
      <ValidationSummary.Title>Form hatalari (Compound)</ValidationSummary.Title>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {defaultErrors.map((err) => (
          <ValidationSummary.Item
            key={err.field}
            severity={err.severity ?? 'error'}
            field={err.field}
          >
            <ValidationSummary.Icon severity={err.severity ?? 'error'} />
            <span style={{ flex: 1, lineHeight: 1.4 }}>{err.message}</span>
          </ValidationSummary.Item>
        ))}
      </ul>
    </ValidationSummary>
  </div>
);

// ── EmptyState ──

export const EmptyState = () => (
  <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 500 }}>
    <ValidationSummary errors={[]} />
  </div>
);

// ── WithWarnings ──

const warningErrors: ValidationError[] = [
  { field: 'username', message: 'Kullanici adi cok kisa', severity: 'warning' },
  { field: 'phone', message: 'Telefon numarasi eksik olabilir', severity: 'warning' },
  { field: 'bio', message: 'Biyografi alani bos birakilmis', severity: 'warning' },
  { field: 'email', message: 'Gecersiz e-posta adresi' },
];

export const WithWarnings = () => (
  <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 500 }}>
    <ValidationSummary
      errors={warningErrors}
      title="Dogrulama Sonuclari"
      onErrorClick={(err) => {
        const el = document.getElementById(err.field);
        if (el) el.focus();
      }}
    />
  </div>
);
