# RelUI — Bileşen Geliştirme Rehberi

> Bu rehberi okumadan TEK SATIR KOD YAZMA. Tüm bileşenler bu pattern'lara uymalı.

## Zorunlu İlk Adımlar (HER OTURUMDA)

1. `CLAUDE.md` oku (repo kökünde)
2. `MEMORY.md` oku (`~/.claude/projects/.../memory/`)
3. `relui-lessons.md` oku (aynı dizin)
4. `RELUI_BRIEF.md` oku (`/Users/reltecoteknoloji/PROJECTS/RELUI_BRIEF.md`)
5. **BU DOSYAYI** oku

## Komutlar

```bash
pnpm build          # Tüm paketleri build (5/5 geçmeli)
pnpm test           # Tüm testleri çalıştır (direkt vitest run YASAK!)
pnpm lint           # ESLint kontrolü (8/8 geçmeli)
pnpm storybook      # Storybook dev server (localhost:6006)
```

---

## ⭐ REFERANS BİLEŞEN: Stat

**Tüm yeni bileşenler `Stat` bileşenini referans almalıdır.**
Dosyalar:
- `packages/react/src/stat/Stat.tsx` — Ana bileşen (Dual API, 5 sub-component)
- `packages/react/src/stat/stat.css.ts` — CSS (%100 token)
- `packages/react/src/stat/Stat.test.tsx` — Test (29 test, props + compound + slot)
- `packages/react/src/stat/Stat.stories.tsx` — Story (7 story, props + compound + slot)
- `packages/react/src/stat/index.ts` — Export (tüm type'lar dahil)

---

## ✅ BİLEŞEN TAMAMLANMA CHECKLİSTİ

**Her bileşen yazıldıktan sonra bu listeyi referans al. TÜMÜ karşılanmadan bileşen TAMAMLANMIŞ SAYILMAZ.**

### A. DOSYA YAPISI

- `{component}.css.ts` dosyası VAR (inline style YASAK, Vanilla Extract ZORUNLU)
- `{Component}.tsx` dosyası VAR
- `{Component}.test.tsx` dosyası VAR
- `{Component}.stories.tsx` dosyası VAR
- `index.ts` dosyası VAR
- Core'lu bileşen ise: `use{Component}.ts` hook dosyası VAR
- Tüm dosyalarda BSL 1.1 copyright header VAR

### B. DUAL API (ZORUNLU — İSTİSNASIZ HER BİLEŞEN)

- **Props-based API:** Bileşen prop'larla çalışıyor (items array veya doğrudan prop'lar)
- **Compound API:** Sub-component'lar VAR (Object.assign ile bağlı)
- **createContext:** Bileşen-spesifik context oluşturulmuş
- **useXContext():** Context hook yazılmış, `<X>` dışında kullanılırsa hata fırlatıyor
- **Context değerleri:** classNames, styles + bileşen-spesifik state (size, variant vb.) aktarılıyor
- **Object.assign:** `export const X = Object.assign(XBase, { Sub1, Sub2, ... })`
- **forwardRef:** Ana bileşen VE her sub-component `forwardRef` ile sarılmış
- **Sub-component isimleri:** `function XSub(props, ref)` — named function (anonymous YASAK)

**Sub-component belirleme kuralı:**
Her bileşenin içindeki her anlamlı DOM bölümü bir sub-component olmalı. Örnekler:
- `Stat` → Value, Label, HelpText, Icon, Trend (5 sub-component)
- `Avatar` → Image, Fallback (2 sub-component)
- `Alert` → Icon, Title, Description, CloseButton (4 sub-component)
- `Card` → Header, Body, Footer (3 sub-component)
- `Button` → LeftIcon, RightIcon (2 sub-component — label zaten children)
- `Modal` → Header, Body, Footer, CloseButton (4 sub-component)

### C. CSS / RENK / TEMA

- **Ayrı CSS dosyası:** Tüm stiller `{component}.css.ts` dosyasında (inline style SADECE dinamik değerler için)
- **%100 Token kullanımı:** Her renk `var(--rel-color-token, #fallback)` formatında
- **Font token'ları:** `var(--rel-text-sm, 14px)`, `var(--rel-font-sans, system-ui, sans-serif)`
- **Shadow token'ları:** `var(--rel-shadow-md, ...)` (hardcode rgba YASAK)
- **Border token'ları:** `var(--rel-color-border, #e5e7eb)`
- **Spacing:** Sabit px değer kullanılabilir (spacing token opsiyonel)
- **Hiçbir yerde raw hex/named color YOK** (var() wrapper olmadan)
- **`resolveColor` import YOK** (silinmiş utility, YASAK)
- **`color` prop YOK** (istisnalar: Avatar fallback bg, Timeline dot gibi bileşen-spesifik durumlar)
- **recipe/styleVariants:** Variant değerleri boş `{}` DEĞİL (Lesson #5)

### D. SLOT API

- **SlotStyleProps<XSlot>** extend ediliyor (ComponentProps interface'inde)
- **Slot tipi tanımlı:** `export type XSlot = 'root' | 'header' | 'body' | ...`
- **getSlotProps()** her slot için çağrılıyor
- **classNames prop:** Kullanıcı her slot'a className ekleyebilir
- **styles prop:** Kullanıcı her slot'a inline style ekleyebilir
- **className prop:** Root elemana ek className (rootSlot.className ile birleşir)
- **style prop:** Root elemana ek inline style (rootSlot.style ile merge)
- **Context'e aktarım:** classNames ve styles compound sub-component'lara context ile geçiyor

### E. TEST

- **Import sırası doğru:**
  ```typescript
  import { describe, it, expect, vi } from 'vitest';
  import { render, screen, fireEvent } from '@testing-library/react';
  import '@testing-library/jest-dom/vitest';  // ← ZORUNLU 3. SATIR
  ```
- **Props-based testler:** Root render, her prop, her variant, her size
- **Compound testler:** Her sub-component render, context aktarımı
- **Slot API testleri:** classNames.root, classNames.{slot}, styles.root, styles.{slot}
- **className testi:** Root elemana ek className eklenir
- **style testi:** Root elemana ek inline style eklenir
- **Ref testi:** `ref` forward edilir (en az 1 test)
- **data-testid:** Her slot elemanında `data-testid="{component}-{slot}"` VAR
- **Güvenli CSS property'ler:** padding, fontSize, letterSpacing, opacity, fontWeight
- **YASAK CSS property'ler:** color, border, background → jsdom dönüşüm yapar (Lesson #16)
- **Hex renk testi:** `bg === '#ff0000' || bg === 'rgb(255, 0, 0)'` pattern (jsdom dönüşümü)
- **Türkçe apostrof YOK:** `it('blurda')` doğru, `it('blur'da')` YANLIŞ (Lesson #9)
- **En az 20+ test** (props + compound + slot)

### F. STORYBOOK

- **Meta tanımı:** `title`, `component`, `tags: ['autodocs']`
- **argTypes:** Tüm variant/size/boolean prop'lar için control
- **Default story:** args ile temel kullanım
- **Variant story:** Tüm variant'ları yan yana gösteren story
- **Size story:** Tüm size'ları yan yana gösteren story
- **Compound story:** Sub-component'larla compound kullanım örneği
- **CustomSlotStyles story:** classNames/styles ile özelleştirme örneği
- **Story container renkleri:** `var(--rel-color-bg-subtle, #f8fafc)` — hardcode YASAK
- **Demo text renkleri:** `var(--rel-color-text-muted, ...)` — hardcode YASAK
- **En az 6+ story**

### G. EXPORT

- **index.ts:** Ana bileşen export
- **ComponentProps type** export
- **Slot type** export
- **Variant/Size/Direction type'lar** export (varsa)
- **Her sub-component props type** export (örn: StatValueProps, StatLabelProps)
- **ItemDef type** export (props-based items array varsa)
- **Helper fonksiyonlar** export (getInitials, getColorFromName gibi — varsa)
- **Ana index.ts'e ekleme:** `packages/react/src/index.ts` — tüm type'lar dahil

### H. A11Y

- **Semantik HTML:** Doğru element seçimi (button, ul/li, h1-h6, nav, aside vb.)
- **role attribute:** Gerekli yerlerde (img, list, navigation vb.)
- **aria-label:** Anlamlı label (alt text, name vb.)
- **Klavye navigasyonu:** Tab, Enter, Escape, Arrow keys (interaktif bileşenler)
- **Focus yönetimi:** Görünür focus indicator

### I. KOD KALİTESİ

- **`any` tipi YOK**
- **`console.log` YOK**
- **`TODO` YOK**
- **Unused import YOK** (TS6133/TS6196 — build kırar)
- **Named function:** `forwardRef` içinde `function ComponentName(props, ref)` — anonymous YASAK
- **JSDoc:** TR/EN açıklamalar (props, types, component üstünde)
- **@packageDocumentation:** Dosya başında bileşen açıklaması + Props-based ve Compound kullanım örnekleri

---

## Dosya Yapısı

### Core'suz Bileşen (presentational — Avatar, Badge, Typography gibi)
```
packages/react/src/{component}/
├── {component}.css.ts        ← Vanilla Extract stiller
├── {Component}.tsx           ← Styled component (Dual API)
├── {Component}.test.tsx      ← React render test
├── {Component}.stories.tsx   ← Storybook story
└── index.ts                  ← Public API export
```

### Core'lu Bileşen (state machine — Carousel, Clock gibi)
```
packages/core/src/{component}/
├── {component}.types.ts      ← TypeScript tipleri
├── {component}.machine.ts    ← State machine
├── {component}.test.ts       ← Unit test
└── index.ts                  ← Public API export

packages/react/src/{component}/
├── {component}.css.ts        ← Vanilla Extract stiller
├── use{Component}.ts         ← React hook (core binding)
├── {Component}.tsx           ← Styled component (Dual API)
├── {Component}.test.tsx      ← React render test
├── {Component}.stories.tsx   ← Storybook story
└── index.ts                  ← Public API export
```

## Copyright Headers

**MIT** (core, tokens, icons):
```ts
/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
```

**BSL** (react):
```ts
/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */
```

---

## Core State Machine Pattern

Hafif, framework-agnostic, mutable closure tabanlı state machine.

**Referans:** `packages/core/src/accordion/accordion.machine.ts` dosyasını oku.

```ts
// {component}.types.ts
export type {Component}Event =
  | { type: 'EVENT_ONE'; payload: string }
  | { type: 'EVENT_TWO' };

export interface {Component}Context {
  readonly value: string;
  readonly isActive: boolean;
}

export interface {Component}Config {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export interface {Component}API {
  getContext(): {Component}Context;
  send(event: {Component}Event): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}
```

```ts
// {component}.machine.ts
export function create{Component}(config: {Component}Config = {}): {Component}API {
  let value = config.defaultValue ?? '';
  let isActive = false;
  const listeners = new Set<() => void>();

  function notify() { for (const fn of listeners) fn(); }

  function getContext(): {Component}Context {
    return { value, isActive };
  }

  function send(event: {Component}Event): void {
    switch (event.type) {
      case 'EVENT_ONE':
        value = event.payload;
        config.onChange?.(value);
        notify();
        break;
      case 'EVENT_TWO':
        isActive = !isActive;
        notify();
        break;
    }
  }

  function subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy };
}
```

---

## React Hook Pattern

**Referans:** `packages/react/src/accordion/useAccordion.ts` (veya `useSelect.ts`) dosyasını oku.

```ts
// use{Component}.ts
import { useRef, useReducer, useEffect } from 'react';
import { create{Component} } from '@relteco/relui-core';

export function use{Component}(props: Use{Component}Props): Use{Component}Return {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<ReturnType<typeof create{Component}> | null>(null);
  const prevRef = useRef<Use{Component}Props | undefined>(undefined); // ← undefined ile başlat!

  if (apiRef.current === null) {
    apiRef.current = create{Component}(props);
  }
  const api = apiRef.current;

  // Prop sync — prevRef undefined başlar, ilk render'da her prop sync olur
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.someValue !== props.someValue) {
      api.send({ type: 'SET_VALUE', value: props.someValue });
      forceRender(); // ← ZORUNLU!
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();
  return { /* ... */ };
}
```

**KRİTİK:** `prevRef = useRef(undefined)` — prop değerini ilk değer olarak VERME! (Lesson #21)

---

## Vanilla Extract CSS Pattern

**Referans:** `packages/react/src/stat/stat.css.ts` — EN DOĞRU ÖRNEK

```ts
// {component}.css.ts
import { style, styleVariants } from '@vanilla-extract/css';

// DOĞRU: Her renk var(--token, #fallback) formatında
export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
});

// DOĞRU: Size variant'ları
export const sizeStyles = styleVariants({
  sm: { gap: 2 },
  md: { gap: 4 },   // ← boş {} YASAK, her variant'ta gerçek CSS olmalı
  lg: { gap: 6 },
});

// DOĞRU: Renk variant'ları token ile
export const trendDirectionStyles = styleVariants({
  up: { color: 'var(--rel-color-success, #16a34a)' },
  down: { color: 'var(--rel-color-error, #dc2626)' },
  neutral: { color: 'var(--rel-color-text-secondary, #6b7280)' },
});
```

**YASAKLAR:**
- Boş `{}` variant value YASAK → runtime crash (Lesson #5)
- `cssVar` sadece renk token'ları için → font/spacing: `'var(--rel-text-sm)'` (Lesson #6)
- `.css.ts`'den fonksiyon export YASAK → sadece serializable değerler (Lesson #4)
- Raw hex/named color YASAK → her renk `var(--rel-color-*, #fallback)` ile sarılmalı
- Hardcode shadow YASAK → `var(--rel-shadow-md, ...)` kullan

---

## Dual API — Styled Component Pattern (ZORUNLU — HER BİLEŞEN)

**⚠️ İSTİSNA YOK. Her bileşen Dual API ile yazılır. "Compound anlamsız" diye atlama YASAK.**

### Referans: Stat bileşeni

```tsx
// {Component}.tsx
import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import { rootStyle, sizeStyles, valueStyle, labelStyle } from './{component}.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── 1. Slot tipi ──
export type XSlot = 'root' | 'value' | 'label' | 'helpText' | 'icon';

// ── 2. Types ──
export type XSize = 'sm' | 'md' | 'lg';

// ── 3. Context (compound sub-component'ler için) ──
interface XContextValue {
  size: XSize;
  classNames: ClassNames<XSlot> | undefined;
  styles: Styles<XSlot> | undefined;
}

const XContext = createContext<XContextValue | null>(null);

function useXContext(): XContextValue {
  const ctx = useContext(XContext);
  if (!ctx) throw new Error('X compound sub-components must be used within <X>.');
  return ctx;
}

// ── 4. Sub-component'lar (her biri forwardRef + named function) ──

export interface XValueProps {
  children: ReactNode;
  className?: string;
}

const XValue = forwardRef<HTMLParagraphElement, XValueProps>(
  function XValue(props, ref) {
    const { children, className } = props;
    const ctx = useXContext();
    const slot = getSlotProps('value', valueStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <p ref={ref} className={cls} style={slot.style} data-testid="x-value">
        {children}
      </p>
    );
  },
);

// ... diğer sub-component'lar aynı pattern ile ...

// ── 5. Component Props ──
export interface XComponentProps extends SlotStyleProps<XSlot> {
  /** Props-based prop'lar */
  value?: ReactNode;
  label?: ReactNode;
  /** Compound API */
  children?: ReactNode;
  /** Boyut */
  size?: XSize;
  /** Ek className */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

// ── 6. Ana bileşen ──
const XBase = forwardRef<HTMLDivElement, XComponentProps>(
  function X(props, ref) {
    const {
      value, label, size = 'md',
      children, className, style: styleProp,
      classNames, styles,
    } = props;

    const rootSlot = getSlotProps('root', `${rootStyle} ${sizeStyles[size]}`, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: XContextValue = { size, classNames, styles };

    // ── Compound API (children varsa) ──
    if (children) {
      return (
        <XContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="x-root"
            data-size={size}
          >
            {children}
          </div>
        </XContext.Provider>
      );
    }

    // ── Props-based API ──
    const valueSlot = getSlotProps('value', valueStyle, classNames, styles);
    const labelSlot = getSlotProps('label', labelStyle, classNames, styles);

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="x-root"
        data-size={size}
      >
        <p className={valueSlot.className} style={valueSlot.style} data-testid="x-value">
          {value}
        </p>
        <p className={labelSlot.className} style={labelSlot.style} data-testid="x-label">
          {label}
        </p>
      </div>
    );
  },
);

// ── 7. JSDoc + Object.assign ──
/**
 * X bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <X value="100" label="Test" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <X>
 *   <X.Value>100</X.Value>
 *   <X.Label>Test</X.Label>
 * </X>
 * ```
 */
export const X = Object.assign(XBase, {
  Value: XValue,
  Label: XLabel,
});
```

---

## Slot API Pattern (ZORUNLU)

Her bileşende `classNames` + `styles` prop'ları ile iç slot'lara erişim.

```tsx
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type MySlot = 'root' | 'header' | 'body';

interface Props extends SlotStyleProps<MySlot> { /* ... */ }

// Kullanım:
const rootSlot = getSlotProps('root', rootStyle, classNames, styles, style);
const headerSlot = getSlotProps('header', headerStyle, classNames, styles);
```

**Test pattern (jsdom-uyumlu CSS property'ler):**
```tsx
it('classNames ile slot stillendirilir', () => {
  render(<MyComponent classNames={{ header: 'custom-cls' }} />);
  expect(screen.getByTestId('x-header').className).toContain('custom-cls');
});

it('styles ile slot stillendirilir', () => {
  render(<MyComponent styles={{ header: { padding: '20px' } }} />);
  expect(screen.getByTestId('x-header')).toHaveStyle({ padding: '20px' });
});
```

**Güvenli CSS property'ler:** `padding`, `fontSize`, `letterSpacing`, `opacity`, `fontWeight`
**YASAK:** `color`, `border`, `background` → jsdom dönüşüm yapar, toHaveStyle fail olur (Lesson #16)

---

## Test Pattern

### React Test — ZORUNLU Import Sırası:
```ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';  // ← BU SATIR ZORUNLU! UNUTMA!
```

### Test Yapısı (Stat referans):
```ts
describe('X', () => {
  // ── Root ──
  it('root render edilir', () => { ... });
  it('varsayilan size md', () => { ... });
  it('size sm set edilir', () => { ... });
  it('size lg set edilir', () => { ... });

  // ── Her prop için ──
  it('value render edilir', () => { ... });
  it('label render edilir', () => { ... });
  it('opsiyonel prop olmadan render edilmez', () => { ... });

  // ── className & style ──
  it('className root elemana eklenir', () => { ... });
  it('style root elemana eklenir', () => { ... });

  // ── Slot API: classNames ──
  it('classNames.root root elemana eklenir', () => { ... });
  it('classNames.{slot} elemana eklenir', () => { ... });

  // ── Slot API: styles ──
  it('styles.root root elemana eklenir', () => { ... });
  it('styles.{slot} elemana eklenir', () => { ... });

  // ── Ref ──
  it('ref forward edilir', () => { ... });
});

describe('X (Compound)', () => {
  it('compound: value render edilir', () => { ... });
  it('compound: label render edilir', () => { ... });
  it('compound: size context ile aktarilir', () => { ... });
  it('compound: classNames context ile aktarilir', () => { ... });
  it('compound: styles context ile aktarilir', () => { ... });
});
```

### jsdom Mock'ları:
```ts
// scrollIntoView mock (Lesson #22)
beforeAll(() => { Element.prototype.scrollIntoView = vi.fn(); });

// window.scrollY yerine custom scrollTarget kullan (Lesson #23)
```

### Test Çalıştırma:
```bash
pnpm test                                          # Tüm pipeline
pnpm --filter @relteco/relui-react test            # Sadece react
pnpm --filter @relteco/relui-core test             # Sadece core
```
**YASAK:** `pnpm vitest run dosya.tsx` → jsdom yüklenmez, sahte hatalar (Lesson #15)

### Test İsimlendirme:
- Türkçe apostrof YASAK → `it('blurda parse edilir')` (Lesson #9)

---

## Story Pattern

**Referans:** `packages/react/src/stat/Stat.stories.tsx`

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { X } from './X';

const meta: Meta<typeof X> = {
  title: 'Category/X',
  component: X,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'outlined'] },
  },
};
export default meta;
type Story = StoryObj<typeof X>;

// 1. Default — args ile
export const Default: Story = {
  args: { value: '1,234', label: 'Toplam' },
};

// 2. AllSizes — tüm size'lar
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <X value="1" label="sm" size="sm" />
      <X value="2" label="md" size="md" />
      <X value="3" label="lg" size="lg" />
    </div>
  ),
};

// 3. Variants — tüm variant'lar
export const Variants: Story = { ... };

// 4. Compound — sub-component kullanımı
export const Compound: Story = {
  render: () => (
    <X>
      <X.Value>1,234</X.Value>
      <X.Label>Toplam</X.Label>
    </X>
  ),
};

// 5. CustomSlotStyles — classNames/styles demo
export const CustomSlotStyles: Story = {
  args: {
    value: '99%',
    label: 'Uptime',
    styles: {
      root: { padding: 20 },
      value: { fontSize: 36 },
    },
  },
};
```

**Story renk kuralları:**
- Container arka plan: `var(--rel-color-bg-subtle, #f8fafc)` — hardcode `#f1f5f9` YASAK
- Text renkleri: `var(--rel-color-text-muted, ...)` — hardcode YASAK
- CustomSlotStyles: Token kullan, raw hex YASAK

---

## Index.ts Export Pattern

```ts
// packages/react/src/{component}/index.ts
export {
  X,
  type XComponentProps,
  type XSlot,
  type XSize,              // varsa
  type XVariant,           // varsa
  type XValueProps,        // her sub-component props
  type XLabelProps,        // her sub-component props
  type XItemDef,           // items array tipi (varsa)
} from './X';
```

**Ana index.ts'e ekleme:** `packages/react/src/index.ts` — tüm type'lar dahil export edilmeli.

---

## İkon Kullanımı

- Tüm ikonlar `@relteco/relui-icons` paketinden: `import { ChevronDownIcon } from '@relteco/relui-icons';`
- Inline SVG YASAK, 3. parti ikon kütüphanesi YASAK
- Yeni ikon gerekiyorsa → ÖNCE icon paketine `createIcon` ile ekle, test yaz, sonra kullan (Lesson #20)
- Mevcut ikonlar: CheckIcon, MinusIcon, CloseIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, EyeOffIcon, CopyIcon, SearchIcon, PlusIcon, ArrowUpIcon, ExternalLinkIcon, InfoCircleIcon, CheckCircleIcon, AlertTriangleIcon, XCircleIcon, FileXIcon, MessageSquareIcon, FilePlusIcon, FolderOpenIcon, SaveIcon, ScissorsIcon, ClipboardIcon, UndoIcon, RedoIcon

---

## YASAKLAR (İHLAL ETME)

1. **`any` tipi YASAK** — her şey tipli
2. **`console.log` YASAK** — debug kodu commit'e girmez
3. **TODO YASAK** — ya yap ya yapma
4. **Inline SVG YASAK** — `@relteco/relui-icons` kullan
5. **3. parti ikon YASAK** — kendi paketimiz
6. **Boş `{}` variant YASAK** — VE crash eder
7. **`pnpm vitest run` YASAK** — sadece `pnpm test`
8. **`prevRef = useRef(initialValue)` YASAK** — `useRef(undefined)` kullan
9. **Geçici çözüm YASAK** — hata alırsan kullanıcıya danış
10. **Türkçe apostrof test string'lerinde YASAK** — `it('blurda')`
11. **`resolveColor` YASAK** — silinmiş utility, import etme
12. **Inline style ile renk YASAK** — CSS dosyasında `var(--rel-color-*, #fallback)` kullan
13. **`color` prop YASAK** — style/styles slot API ile override (istisnalar: bileşen-spesifik)
14. **Hardcode shadow YASAK** — `var(--rel-shadow-*, fallback)` kullan
15. **Story'de hardcode renk YASAK** — `var(--rel-color-*, #fallback)` kullan
16. **Props-only bileşen YASAK** — HER bileşen Dual API (props + compound)
