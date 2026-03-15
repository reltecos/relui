/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CommandPalette — styled arama-tabanli komut calistiricisi bilesen (Dual API).
 * CommandPalette — styled search-driven command launcher component (Dual API).
 *
 * Props-based: `<CommandPalette items={[...]} open={true} />`
 * Compound:    `<CommandPalette open={true}><CommandPalette.Input /><CommandPalette.List>...</CommandPalette.List></CommandPalette>`
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  useEffect,
  useCallback,
  useRef,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import type { CommandPaletteSize } from '@relteco/relui-core';
import { useCommandPalette, type UseCommandPaletteProps } from './useCommandPalette';
import {
  cpRootRecipe,
  cpOverlayStyle,
  cpInputStyle,
  cpListStyle,
  cpGroupStyle,
  cpItemStyle,
  cpItemIconStyle,
  cpItemLabelStyle,
  cpItemDescriptionStyle,
  cpItemShortcutStyle,
  cpShortcutKeyStyle,
  cpEmptyStyle,
} from './command-palette.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/**
 * CommandPalette slot isimleri / CommandPalette slot names.
 */
export type CommandPaletteSlot =
  | 'root'
  | 'overlay'
  | 'input'
  | 'list'
  | 'group'
  | 'item'
  | 'itemIcon'
  | 'itemLabel'
  | 'itemDescription'
  | 'itemShortcut'
  | 'empty';

// ── Context (Compound API) ──────────────────────────────────

interface CommandPaletteContextValue {
  size: CommandPaletteSize;
  classNames: ClassNames<CommandPaletteSlot> | undefined;
  styles: Styles<CommandPaletteSlot> | undefined;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

function useCommandPaletteContext(): CommandPaletteContextValue {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error('CommandPalette compound sub-components must be used within <CommandPalette>.');
  return ctx;
}

// ── Compound: CommandPalette.Input ──────────────────────────────

/** CommandPalette.Input props */
export interface CommandPaletteInputProps {
  /** Placeholder / Placeholder */
  placeholder?: string;
  /** Deger / Value */
  value?: string;
  /** Degisim callback / Change callback */
  onChange?: (value: string) => void;
  /** Ek className / Additional className */
  className?: string;
}

const CommandPaletteInput = forwardRef<HTMLInputElement, CommandPaletteInputProps>(
  function CommandPaletteInput(props, ref) {
    const { placeholder, value, onChange, className } = props;
    const ctx = useCommandPaletteContext();
    const slot = getSlotProps('input', cpInputStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <input
        ref={ref}
        type="text"
        className={cls}
        style={slot.style}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        data-testid="cp-input"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="true"
      />
    );
  },
);

// ── Compound: CommandPalette.List ───────────────────────────────

/** CommandPalette.List props */
export interface CommandPaletteListProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CommandPaletteList = forwardRef<HTMLDivElement, CommandPaletteListProps>(
  function CommandPaletteList(props, ref) {
    const { children, className } = props;
    const ctx = useCommandPaletteContext();
    const slot = getSlotProps('list', cpListStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} role="listbox" data-testid="cp-list">
        {children}
      </div>
    );
  },
);

// ── Compound: CommandPalette.Item ───────────────────────────────

/** CommandPalette.Item props */
export interface CommandPaletteItemComponentProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Devre disi mi / Is disabled */
  disabled?: boolean;
  /** Tiklama callback / Click callback */
  onClick?: () => void;
  /** Ikon / Icon */
  icon?: ReactNode;
  /** Aciklama / Description */
  description?: string;
  /** Kisayol / Shortcut */
  shortcut?: string;
}

const CommandPaletteItemCompound = forwardRef<HTMLDivElement, CommandPaletteItemComponentProps>(
  function CommandPaletteItem(props, ref) {
    const { children, className, disabled, onClick, icon, description, shortcut } = props;
    const ctx = useCommandPaletteContext();
    const slot = getSlotProps('item', cpItemStyle, ctx.classNames, ctx.styles);
    const iconSlot = getSlotProps('itemIcon', cpItemIconStyle, ctx.classNames, ctx.styles);
    const labelSlot = getSlotProps('itemLabel', cpItemLabelStyle, ctx.classNames, ctx.styles);
    const descSlot = getSlotProps('itemDescription', cpItemDescriptionStyle, ctx.classNames, ctx.styles);
    const shortcutSlot = getSlotProps('itemShortcut', cpItemShortcutStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        role="option"
        data-testid="cp-item"
        data-disabled={disabled ? '' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        onClick={disabled ? undefined : onClick}
      >
        {icon && (
          <span className={iconSlot.className} style={iconSlot.style}>
            {icon}
          </span>
        )}
        <span className={labelSlot.className} style={labelSlot.style}>
          {children}
        </span>
        {description && (
          <span className={descSlot.className} style={descSlot.style}>
            {description}
          </span>
        )}
        {shortcut && (
          <span className={shortcutSlot.className} style={shortcutSlot.style}>
            {shortcut.split('+').map((part) => (
              <kbd key={part} className={cpShortcutKeyStyle}>
                {part.trim()}
              </kbd>
            ))}
          </span>
        )}
      </div>
    );
  },
);

// ── Compound: CommandPalette.Group ──────────────────────────────

/** CommandPalette.Group props */
export interface CommandPaletteGroupProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Grup basligi / Group heading */
  heading?: string;
  /** Ek className / Additional className */
  className?: string;
}

const CommandPaletteGroup = forwardRef<HTMLDivElement, CommandPaletteGroupProps>(
  function CommandPaletteGroup(props, ref) {
    const { children, heading, className } = props;
    const ctx = useCommandPaletteContext();
    const groupSlot = getSlotProps('group', cpGroupStyle, ctx.classNames, ctx.styles);

    return (
      <div ref={ref} data-testid="cp-group" className={className}>
        {heading && (
          <div className={groupSlot.className} style={groupSlot.style}>
            {heading}
          </div>
        )}
        {children}
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────────────

export interface CommandPaletteComponentProps
  extends UseCommandPaletteProps,
    SlotStyleProps<CommandPaletteSlot> {
  /** Boyut / Size */
  size?: CommandPaletteSize;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;

  /** Ikon render callback / Icon render callback */
  renderIcon?: (icon: string) => ReactNode;

  /** Portal hedef elementi / Portal container element */
  portalContainer?: HTMLElement;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

/**
 * Shortcut string'ini parcalara ayir / Split shortcut string into parts.
 * "Ctrl+Shift+S" → ["Ctrl", "Shift", "S"]
 */
function splitShortcut(shortcut: string): string[] {
  return shortcut.split('+').map((s) => s.trim());
}

/**
 * CommandPalette bilesen — arama-tabanli komut calistiricisi.
 * CommandPalette component — search-driven command launcher.
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   items={[
 *     { key: 'save', label: 'Save File', shortcut: 'Ctrl+S', group: 'file' },
 *     { key: 'open', label: 'Open File', shortcut: 'Ctrl+O', group: 'file' },
 *     { key: 'copy', label: 'Copy', shortcut: 'Ctrl+C', group: 'edit' },
 *   ]}
 *   open={isOpen}
 *   onSelect={(key) => console.log('Selected:', key)}
 *   onOpenChange={(open) => setIsOpen(open)}
 * />
 * ```
 */
const CommandPaletteBase = forwardRef<HTMLDivElement, CommandPaletteComponentProps>(
  function CommandPalette(props, ref) {
    const {
      size = 'md',
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      renderIcon,
      portalContainer,
      children,
      ...hookProps
    } = props;

    const {
      containerProps,
      inputProps,
      listProps,
      getItemProps,
      filteredItems,
      highlightedIndex,
      queryValue,
      isOpen,
      placeholder,
      emptyMessage,
      close,
      setQuery,
      highlightNext,
      highlightPrev,
      select,
      selectIndex,
    } = useCommandPalette(hookProps);

    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const anchorRef = useRef<HTMLSpanElement>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    // ── Portal hedefi — en yakin [data-theme] ancestor ──
    useEffect(() => {
      if (portalContainer) {
        setPortalTarget(portalContainer);
        return;
      }
      const anchor = anchorRef.current;
      if (!anchor) return;
      const themeContainer = anchor.closest('[data-theme]') as HTMLElement | null;
      setPortalTarget(themeContainer ?? document.body);
    }, [portalContainer]);

    // ── Acildiginda input'a focus ──
    useEffect(() => {
      if (isOpen) {
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    }, [isOpen]);

    // ── Vurgulanan item'i gorunur alana kaydir ──
    useEffect(() => {
      if (highlightedIndex < 0 || !listRef.current) return;
      const el = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (el) {
        el.scrollIntoView({ block: 'nearest' });
      }
    }, [highlightedIndex]);

    // ── Keyboard ──
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            highlightNext();
            break;
          case 'ArrowUp':
            e.preventDefault();
            highlightPrev();
            break;
          case 'Enter':
            e.preventDefault();
            if (highlightedIndex >= 0) {
              select();
            }
            break;
          case 'Escape':
            e.preventDefault();
            close();
            break;
        }
      },
      [highlightNext, highlightPrev, highlightedIndex, select, close],
    );

    // ── Overlay click ──
    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          close();
        }
      },
      [close],
    );

    // ── Slots ──
    const rootClass = cpRootRecipe({ size });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const overlaySlot = getSlotProps('overlay', cpOverlayStyle, classNames, styles);
    const inputSlot = getSlotProps('input', cpInputStyle, classNames, styles);
    const listSlot = getSlotProps('list', cpListStyle, classNames, styles);
    const groupSlot = getSlotProps('group', cpGroupStyle, classNames, styles);
    const itemSlot = getSlotProps('item', cpItemStyle, classNames, styles);
    const itemIconSlot = getSlotProps('itemIcon', cpItemIconStyle, classNames, styles);
    const itemLabelSlot = getSlotProps('itemLabel', cpItemLabelStyle, classNames, styles);
    const itemDescSlot = getSlotProps('itemDescription', cpItemDescriptionStyle, classNames, styles);
    const itemShortcutSlot = getSlotProps('itemShortcut', cpItemShortcutStyle, classNames, styles);
    const emptySlot = getSlotProps('empty', cpEmptyStyle, classNames, styles);

    const ctxValue: CommandPaletteContextValue = { size, classNames, styles };

    // ── Compound API ──
    if (children) {
      const anchor = <span ref={anchorRef} style={{ display: 'none' }} />;
      if (!isOpen || !portalTarget) return anchor;

      const compoundOverlay = (
        <div
          className={overlaySlot.className}
          style={overlaySlot.style}
          onClick={handleOverlayClick}
          data-testid="cp-overlay"
        >
          <CommandPaletteContext.Provider value={ctxValue}>
            <div
              ref={ref}
              className={combinedRootClassName}
              style={combinedRootStyle}
              id={id}
              role="dialog"
              aria-label="Command Palette"
              aria-modal="true"
              data-testid="cp-root"
            >
              {children}
            </div>
          </CommandPaletteContext.Provider>
        </div>
      );

      return (
        <>
          {anchor}
          {createPortal(compoundOverlay, portalTarget)}
        </>
      );
    }

    // ── Gruplama — filtrelenmis ogeleri gruplara ayir ──
    const groups: { key: string; label: string; items: { item: typeof filteredItems[0]; globalIndex: number }[] }[] = [];
    const ungrouped: { item: typeof filteredItems[0]; globalIndex: number }[] = [];

    filteredItems.forEach((item, index) => {
      if (item.group) {
        let group = groups.find((g) => g.key === item.group);
        if (!group) {
          group = { key: item.group, label: item.group, items: [] };
          groups.push(group);
        }
        group.items.push({ item, globalIndex: index });
      } else {
        ungrouped.push({ item, globalIndex: index });
      }
    });

    // Gizli anchor
    const anchor = <span ref={anchorRef} style={{ display: 'none' }} />;

    if (!isOpen || !portalTarget) return anchor;

    const overlay = (
      <div
        className={overlaySlot.className}
        style={overlaySlot.style}
        onClick={handleOverlayClick}
        data-testid="cp-overlay"
      >
        <div
          ref={ref}
          className={combinedRootClassName}
          style={combinedRootStyle}
          id={id}
          onKeyDown={handleKeyDown}
          {...containerProps}
        >
          {/* Search input */}
          <input
            ref={inputRef}
            className={inputSlot.className}
            style={inputSlot.style}
            type="text"
            value={queryValue}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            data-testid="cp-input"
            {...inputProps}
          />

          {/* Results list */}
          {filteredItems.length > 0 ? (
            <div
              ref={listRef}
              className={listSlot.className}
              style={listSlot.style}
              {...listProps}
            >
              {/* Ungrouped items */}
              {ungrouped.map(({ item, globalIndex }) => {
                const domProps = getItemProps(globalIndex);
                return (
                  <div
                    key={item.key}
                    className={itemSlot.className}
                    style={itemSlot.style}
                    onClick={() => {
                      if (!item.disabled) selectIndex(globalIndex);
                    }}
                    onPointerEnter={() => {
                      // Hover ile vurgulama — performans icin state degil ref
                    }}
                    {...domProps}
                  >
                    {item.icon && renderIcon && (
                      <span className={itemIconSlot.className} style={itemIconSlot.style}>
                        {renderIcon(item.icon)}
                      </span>
                    )}
                    <span className={itemLabelSlot.className} style={itemLabelSlot.style}>
                      {item.label}
                    </span>
                    {item.description && (
                      <span className={itemDescSlot.className} style={itemDescSlot.style}>
                        {item.description}
                      </span>
                    )}
                    {item.shortcut && (
                      <span className={itemShortcutSlot.className} style={itemShortcutSlot.style}>
                        {splitShortcut(item.shortcut).map((part) => (
                          <kbd key={part} className={cpShortcutKeyStyle}>
                            {part}
                          </kbd>
                        ))}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Grouped items */}
              {groups.map((group) => (
                <div key={group.key}>
                  <div className={groupSlot.className} style={groupSlot.style}>
                    {group.label}
                  </div>
                  {group.items.map(({ item, globalIndex }) => {
                    const domProps = getItemProps(globalIndex);
                    return (
                      <div
                        key={item.key}
                        className={itemSlot.className}
                        style={itemSlot.style}
                        onClick={() => {
                          if (!item.disabled) selectIndex(globalIndex);
                        }}
                        {...domProps}
                      >
                        {item.icon && renderIcon && (
                          <span className={itemIconSlot.className} style={itemIconSlot.style}>
                            {renderIcon(item.icon)}
                          </span>
                        )}
                        <span className={itemLabelSlot.className} style={itemLabelSlot.style}>
                          {item.label}
                        </span>
                        {item.description && (
                          <span className={itemDescSlot.className} style={itemDescSlot.style}>
                            {item.description}
                          </span>
                        )}
                        {item.shortcut && (
                          <span className={itemShortcutSlot.className} style={itemShortcutSlot.style}>
                            {splitShortcut(item.shortcut).map((part) => (
                              <kbd key={part} className={cpShortcutKeyStyle}>
                                {part}
                              </kbd>
                            ))}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={emptySlot.className}
              style={emptySlot.style}
              data-testid="cp-empty"
            >
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    );

    return (
      <>
        {anchor}
        {createPortal(overlay, portalTarget)}
      </>
    );
  },
);

/**
 * CommandPalette bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <CommandPalette items={[...]} open={isOpen} onSelect={(key) => handle(key)} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <CommandPalette open={isOpen} onOpenChange={setIsOpen}>
 *   <CommandPalette.Input placeholder="Search..." value={q} onChange={setQ} />
 *   <CommandPalette.List>
 *     <CommandPalette.Group heading="File">
 *       <CommandPalette.Item shortcut="Ctrl+S">Save</CommandPalette.Item>
 *     </CommandPalette.Group>
 *   </CommandPalette.List>
 * </CommandPalette>
 * ```
 */
export const CommandPalette = Object.assign(CommandPaletteBase, {
  Input: CommandPaletteInput,
  List: CommandPaletteList,
  Item: CommandPaletteItemCompound,
  Group: CommandPaletteGroup,
});
