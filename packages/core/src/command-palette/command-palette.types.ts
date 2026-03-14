/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CommandPalette tip tanimlari.
 * CommandPalette type definitions.
 *
 * VS Code Ctrl+K / Ctrl+P tarzi arama-tabanli komut calistiricisi.
 *
 * @packageDocumentation
 */

// ── Boyut ────────────────────────────────────────────────────

/** Bileşen boyutu / Component size */
export type CommandPaletteSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ── Item ─────────────────────────────────────────────────────

/**
 * CommandPalette ogesi / CommandPalette item.
 *
 * @example
 * ```ts
 * const item: CommandPaletteItem = {
 *   key: 'save',
 *   label: 'Save File',
 *   description: 'Save the current file',
 *   icon: 'save',
 *   shortcut: 'Ctrl+S',
 *   group: 'file',
 * };
 * ```
 */
export interface CommandPaletteItem {
  /** Benzersiz anahtar / Unique key */
  key: string;

  /** Gorunen etiket / Display label */
  label: string;

  /** Aciklama / Description */
  description?: string;

  /** Ikon adi / Icon name */
  icon?: string;

  /** Klavye kisayolu gosterimi / Keyboard shortcut display */
  shortcut?: string;

  /** Grup anahtari / Group key */
  group?: string;

  /** Devre disi / Disabled */
  disabled?: boolean;

  /** Ek arama terimleri / Additional search keywords */
  keywords?: string[];
}

// ── Props ────────────────────────────────────────────────────

/**
 * CommandPalette olusturma secenekleri / Creation options.
 */
export interface CommandPaletteProps {
  /** Oge listesi / Item list */
  items: CommandPaletteItem[];

  /** Arama placeholder / Search placeholder */
  placeholder?: string;

  /** Bos sonuc mesaji / Empty result message */
  emptyMessage?: string;

  /**
   * Ozel filtreleme fonksiyonu / Custom filter function.
   * Varsayilan: substring + fuzzy match.
   */
  filter?: (item: CommandPaletteItem, query: string) => boolean;
}

// ── Machine Context ──────────────────────────────────────────

/**
 * Machine dahili durumu / Internal machine state.
 */
export interface CommandPaletteMachineContext {
  /** Tum ogeler / All items */
  items: CommandPaletteItem[];

  /** Arama sorgusu / Search query */
  query: string;

  /** Filtrelenmis ogeler / Filtered items */
  filteredItems: CommandPaletteItem[];

  /** Vurgulanan oge indeksi / Highlighted item index */
  highlightedIndex: number;

  /** Acik mi / Is open */
  open: boolean;

  /** Placeholder / Placeholder */
  placeholder: string;

  /** Bos sonuc mesaji / Empty message */
  emptyMessage: string;
}

// ── Event ────────────────────────────────────────────────────

/**
 * CommandPalette event'leri / Events.
 */
export type CommandPaletteEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'HIGHLIGHT_NEXT' }
  | { type: 'HIGHLIGHT_PREV' }
  | { type: 'SELECT' }
  | { type: 'SELECT_INDEX'; index: number }
  | { type: 'SET_ITEMS'; items: CommandPaletteItem[] };

// ── DOM Props ────────────────────────────────────────────────

/**
 * Root container DOM attribute'lari / Root container DOM attributes.
 */
export interface CommandPaletteDOMProps {
  /** role="dialog" — dialog pattern */
  role: 'dialog';

  /** Erisilebilirlik etiketi / Accessibility label */
  'aria-label': string;

  /** Modal / Modal */
  'aria-modal': true;
}

/**
 * Input DOM attribute'lari / Input DOM attributes.
 */
export interface CommandPaletteInputDOMProps {
  /** role="combobox" */
  role: 'combobox';

  /** Acik mi / Is expanded */
  'aria-expanded': boolean;

  /** Otomatik tamamlama / Autocomplete */
  'aria-autocomplete': 'list';

  /** Kontrol ettigi liste / Controls listbox */
  'aria-controls': string;

  /** Aktif secenk / Active descendant */
  'aria-activedescendant': string | undefined;
}

/**
 * Listbox DOM attribute'lari / Listbox DOM attributes.
 */
export interface CommandPaletteListDOMProps {
  /** role="listbox" */
  role: 'listbox';

  /** id */
  id: string;

  /** Erisilebilirlik etiketi / Accessibility label */
  'aria-label': string;
}

/**
 * Item DOM attribute'lari / Item DOM attributes.
 */
export interface CommandPaletteItemDOMProps {
  /** role="option" */
  role: 'option';

  /** id */
  id: string;

  /** Secili mi / Is selected */
  'aria-selected': boolean;

  /** Devre disi mi / Is disabled */
  'aria-disabled': true | undefined;

  /** Vurgulu data attribute / Highlighted data attribute */
  'data-highlighted': '' | undefined;

  /** Devre disi data attribute / Disabled data attribute */
  'data-disabled': '' | undefined;

  /** Indeks / Index */
  'data-index': number;
}

// ── API ──────────────────────────────────────────────────────

/**
 * CommandPalette API — machine disina acilan arayuz.
 * CommandPalette API — public interface exposed by the machine.
 */
export interface CommandPaletteAPI {
  /** Mevcut durumu al / Get current context */
  getContext: () => CommandPaletteMachineContext;

  /** Event gonder / Send event */
  send: (event: CommandPaletteEvent) => void;

  /** Root DOM props / Root DOM attributes */
  getContainerProps: () => CommandPaletteDOMProps;

  /** Input DOM props / Input DOM attributes */
  getInputProps: () => CommandPaletteInputDOMProps;

  /** List DOM props / List DOM attributes */
  getListProps: () => CommandPaletteListDOMProps;

  /** Item DOM props / Item DOM attributes */
  getItemProps: (index: number) => CommandPaletteItemDOMProps;

  /** Oge bul / Find item by key */
  findItem: (key: string) => CommandPaletteItem | null;
}
