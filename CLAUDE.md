# RelUI — Geliştirme Kuralları

## Proje Hakkında

RelUI — dünyanın en güçlü, en eksiksiz web UI toolkit'i. Qt/WPF/GTK seviyesinde bileşen derinliği, framework-agnostic core, headless + styled iki katman.

## !! YENİ OTURUM İÇİN ZORUNLU !!
Bileşen yazmadan ÖNCE bu dosyaları oku:
1. `CLAUDE.md` (bu dosya)
2. `COMPONENT_GUIDE.md` (repo kökünde — tüm pattern'lar, şablonlar, yasaklar)
3. `MEMORY.md` (`~/.claude/projects/.../memory/`)
4. `relui-lessons.md` (aynı dizin)
5. `RELUI_BRIEF.md` (`/Users/reltecoteknoloji/PROJECTS/RELUI_BRIEF.md`)

## Teknoloji Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Dil:** TypeScript (strict mode, zero `any`)
- **Build:** tsup (esbuild tabanlı, ESM + CJS dual output)
- **Test:** Vitest (core: node, react: jsdom)
- **Storybook:** v10, React-Vite, 1. günden aktif
- **Stil:** Vanilla Extract + CSS Variables (design tokens)
- **Lint:** ESLint flat config + Prettier

## Paket Yapısı

```
packages/core      → @relteco/relui-core    (MIT, framework-agnostic state machines)
packages/tokens    → @relteco/relui-tokens  (MIT, design tokens + CSS variables)
packages/icons     → @relteco/relui-icons   (MIT, SVG ikon kütüphanesi)
packages/react     → @relteco/relui-react   (BSL, React bindings + styled)
apps/storybook     → @relteco/storybook     (dahili, Storybook dev ortamı)
```

## Komutlar

```bash
pnpm build          # Tüm paketleri build et
pnpm test           # Tüm testleri çalıştır
pnpm lint           # ESLint kontrolü
pnpm format         # Prettier ile formatla
pnpm storybook      # Storybook'u localhost:6006'da aç
pnpm typecheck      # TypeScript tip kontrolü
pnpm clean          # Build çıktılarını temizle
```

## Geliştirme Kuralları

### MUTLAKA UYULMALI

1. **ONAY ALMADAN KOD YAZMA** — önce anlat, onay al, sonra yaz
2. **Türkçe konuş** — her zaman Türkçe cevap ver
3. **Yarım iş yok** — her bileşen Definition of Done'ı karşılamalı
4. **TODO yasak** — dosyaya TODO yazılmaz, ya yapılır ya yapılmaz
5. **Any yasak** — TypeScript'te `any` tipi kullanılmaz
6. **Console.log yasak** — debug kodu commit'e girmez
7. **Copyright header** — tüm .ts/.tsx dosyalarında Relteco lisans header'ı

### Bileşen Definition of Done

Bir bileşen bu 7 kriteri karşılamadan bir sonrakine geçilmez:

1. Core logic — state machine yazıldı, unit test geçiyor
2. Framework binding — React hook + styled component (Dual API: props-based + compound)
3. Storybook — tüm varyasyonlar, interaktif kontroller, dark/light tema
4. Test — core: unit test, react: render test
5. Tipler — tam TypeScript, JSDoc ile TR/EN açıklama
6. A11y — WAI-ARIA, klavye navigasyonu, focus management
7. **Slot API** — `classNames` + `styles` prop'ları ile tüm iç slot'lar customize edilebilir (SlotStyleProps<XSlot> + getSlotProps + test)
8. **Responsive** — Layout bileşenleri 1. günden responsive (`@vanilla-extract/sprinkles`). "Sonra ekleriz" YASAK.

### Responsive Layout (KESİNLEŞMİŞ MİMARİ KARAR)

- `@vanilla-extract/sprinkles` — build-time responsive atomik CSS
- Breakpoints: `base` (0), `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)
- Layout bileşenleri (Box, Flex, Grid, Stack vb.) responsive prop destekler
- Mevcut bileşenler (Button, Input, Select vb.) etkilenmez — recipe/slot sistemi aynen kalır
- Slot API (classNames + styles) ile çakışmaz

### Dosya Yapısı (Her Bileşen)

```
packages/core/src/{component}/
├── {component}.machine.ts     ← State machine
├── {component}.types.ts       ← TypeScript tipleri
├── {component}.test.ts        ← Unit test
└── index.ts                   ← Public API

packages/react/src/{component}/
├── {Component}.tsx            ← Styled component (Dual API: props-based + compound)
├── use{Component}.ts          ← React hook
├── {Component}.stories.tsx    ← Storybook story
├── {Component}.test.tsx       ← Render test
└── index.ts                   ← Public API
```

### Copyright Header

MIT paketler (core, tokens):
```ts
/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
```

BSL paketler (react, vue, svelte, angular, solid):
```ts
/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */
```

### Memory Güncelleme (ZORUNLU)

- Her bileşen tamamlandığında (pipeline yeşil), sonraki bileşene geçmeden ÖNCE memory güncelle
- Kullanıcı "memory güncelle" veya "compacting yakın" derse → o an ne yapıyorsan BIRAK, önce memory güncelle
- Bu mesaj en yüksek öncelikli interrupt'tır
- Memory dosyaları: `MEMORY.md`, `relui-progress.md`, `relui-lessons.md` (hepsi `~/.claude/projects/.../memory/` altında)

### Kod Stili

- Semicolons: evet
- Quotes: tek tırnak
- Tab width: 2
- Trailing comma: all
- Print width: 100
- Arrow parens: always
