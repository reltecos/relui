/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import { themes, generateCSS } from '@relteco/relui-tokens';
import type { ThemeVariant } from '@relteco/relui-tokens';

const themeCSS = generateCSS(themes);

const colorGroups = [
  {
    title: 'Background',
    vars: [
      { name: 'bgApp', label: 'App' },
      { name: 'bgSubtle', label: 'Subtle' },
      { name: 'bgComponent', label: 'Component' },
      { name: 'bgComponentHover', label: 'Hover' },
      { name: 'bgComponentActive', label: 'Active' },
    ],
  },
  {
    title: 'Foreground',
    vars: [
      { name: 'fgDefault', label: 'Default' },
      { name: 'fgMuted', label: 'Muted' },
      { name: 'fgDisabled', label: 'Disabled' },
    ],
  },
  {
    title: 'Border',
    vars: [
      { name: 'borderDefault', label: 'Default' },
      { name: 'borderHover', label: 'Hover' },
      { name: 'borderFocus', label: 'Focus' },
      { name: 'borderSubtle', label: 'Subtle' },
    ],
  },
  {
    title: 'Accent',
    vars: [
      { name: 'accentDefault', label: 'Default' },
      { name: 'accentHover', label: 'Hover' },
      { name: 'accentActive', label: 'Active' },
      { name: 'accentSubtle', label: 'Subtle' },
    ],
  },
  {
    title: 'Destructive',
    vars: [
      { name: 'destructiveDefault', label: 'Default' },
      { name: 'destructiveHover', label: 'Hover' },
      { name: 'destructiveSubtle', label: 'Subtle' },
    ],
  },
  {
    title: 'Success',
    vars: [
      { name: 'successDefault', label: 'Default' },
      { name: 'successHover', label: 'Hover' },
      { name: 'successSubtle', label: 'Subtle' },
    ],
  },
  {
    title: 'Warning',
    vars: [
      { name: 'warningDefault', label: 'Default' },
      { name: 'warningHover', label: 'Hover' },
      { name: 'warningSubtle', label: 'Subtle' },
    ],
  },
  {
    title: 'Surface',
    vars: [
      { name: 'surfaceRaised', label: 'Raised' },
      { name: 'surfaceOverlay', label: 'Overlay' },
      { name: 'surfaceSunken', label: 'Sunken' },
    ],
  },
  {
    title: 'Input',
    vars: [
      { name: 'inputBg', label: 'Background' },
      { name: 'inputBorder', label: 'Border' },
      { name: 'inputBorderFocus', label: 'Focus' },
    ],
  },
] as const;

const ALL_VARIANTS: ThemeVariant[] = [
  'default-dark', 'default-light',
  'ocean-dark', 'ocean-light',
  'forest-dark', 'forest-light',
];

/**
 * ThemePreview — tüm tema renklerinin görsel önizlemesi.
 * ThemePreview — visual preview of all theme colors.
 */
export function ThemePreview() {
  const [activeTheme, setActiveTheme] = useState<ThemeVariant>('default-dark');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      <div
        data-theme={activeTheme}
        style={{
          background: 'var(--rel-color-bg-app)',
          color: 'var(--rel-color-fg-default)',
          padding: '24px',
          borderRadius: '12px',
          fontFamily: "'Inter', sans-serif",
          minWidth: '600px',
        }}
      >
        {/* Theme selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {ALL_VARIANTS.map((variant) => (
            <button
              key={variant}
              onClick={() => setActiveTheme(variant)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: activeTheme === variant ? '2px solid var(--rel-color-accent-default)' : '1px solid var(--rel-color-border-default)',
                background: activeTheme === variant ? 'var(--rel-color-accent-subtle)' : 'var(--rel-color-bg-component)',
                color: activeTheme === variant ? 'var(--rel-color-accent-subtle-fg)' : 'var(--rel-color-fg-default)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTheme === variant ? 600 : 400,
              }}
            >
              {variant}
            </button>
          ))}
        </div>

        {/* Color groups */}
        {colorGroups.map((group) => (
          <div key={group.title} style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--rel-color-fg-muted)',
                marginBottom: '8px',
              }}
            >
              {group.title}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {group.vars.map((v) => (
                <div
                  key={v.name}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: `var(--rel-color-${v.name.replace(/([A-Z])/g, '-$1').toLowerCase()})`,
                      border: '1px solid var(--rel-color-border-subtle)',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '10px',
                      color: 'var(--rel-color-fg-muted)',
                    }}
                  >
                    {v.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
