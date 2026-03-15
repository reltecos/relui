/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Spotlight — macOS Spotlight tarzi global arama bilesen (Dual API).
 * Spotlight — macOS Spotlight-style global search component (Dual API).
 *
 * Props-based: `<Spotlight items={[...]} open={true} />`
 * Compound:    `<Spotlight open={true}><Spotlight.Input /><Spotlight.List>...</Spotlight.List></Spotlight>`
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
import type { SpotlightSize } from '@relteco/relui-core';
import { useSpotlight, type UseSpotlightProps } from './useSpotlight';
import {
  spotRootRecipe,
  spotOverlayStyle,
  spotInputWrapperStyle,
  spotInputIconStyle,
  spotInputStyle,
  spotListStyle,
  spotGroupStyle,
  spotItemStyle,
  spotItemIconStyle,
  spotItemLabelStyle,
  spotItemDescriptionStyle,
  spotEmptyStyle,
  spotLoadingStyle,
  spotRecentHeaderStyle,
  spotRecentClearStyle,
  spotRecentItemStyle,
} from './spotlight.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/**
 * Spotlight slot isimleri / Spotlight slot names.
 */
export type SpotlightSlot =
  | 'root'
  | 'overlay'
  | 'inputWrapper'
  | 'inputIcon'
  | 'input'
  | 'list'
  | 'group'
  | 'item'
  | 'itemIcon'
  | 'itemLabel'
  | 'itemDescription'
  | 'empty'
  | 'loading'
  | 'recentHeader'
  | 'recentItem';

// ── Context (Compound API) ──────────────────────────────────

interface SpotlightContextValue {
  size: SpotlightSize;
  classNames: ClassNames<SpotlightSlot> | undefined;
  styles: Styles<SpotlightSlot> | undefined;
}

const SpotlightContext = createContext<SpotlightContextValue | null>(null);

function useSpotlightContext(): SpotlightContextValue {
  const ctx = useContext(SpotlightContext);
  if (!ctx) throw new Error('Spotlight compound sub-components must be used within <Spotlight>.');
  return ctx;
}

// ── Compound: Spotlight.Input ───────────────────────────────────

/** Spotlight.Input props */
export interface SpotlightInputProps {
  /** Placeholder / Placeholder */
  placeholder?: string;
  /** Deger / Value */
  value?: string;
  /** Degisim callback / Change callback */
  onChange?: (value: string) => void;
  /** Arama ikonu / Search icon */
  searchIcon?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SpotlightInput = forwardRef<HTMLInputElement, SpotlightInputProps>(
  function SpotlightInput(props, ref) {
    const { placeholder, value, onChange, searchIcon, className } = props;
    const ctx = useSpotlightContext();
    const wrapperSlot = getSlotProps('inputWrapper', spotInputWrapperStyle, ctx.classNames, ctx.styles);
    const iconSlot = getSlotProps('inputIcon', spotInputIconStyle, ctx.classNames, ctx.styles);
    const inputSlot = getSlotProps('input', spotInputStyle, ctx.classNames, ctx.styles);
    const inputCls = className ? `${inputSlot.className} ${className}` : inputSlot.className;

    return (
      <div className={wrapperSlot.className} style={wrapperSlot.style} data-testid="spot-input-wrapper">
        {searchIcon && (
          <span className={iconSlot.className} style={iconSlot.style}>
            {searchIcon}
          </span>
        )}
        <input
          ref={ref}
          type="text"
          className={inputCls}
          style={inputSlot.style}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          data-testid="spot-input"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="true"
        />
      </div>
    );
  },
);

// ── Compound: Spotlight.List ────────────────────────────────────

/** Spotlight.List props */
export interface SpotlightListProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SpotlightList = forwardRef<HTMLDivElement, SpotlightListProps>(
  function SpotlightList(props, ref) {
    const { children, className } = props;
    const ctx = useSpotlightContext();
    const slot = getSlotProps('list', spotListStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} role="listbox" data-testid="spot-list">
        {children}
      </div>
    );
  },
);

// ── Compound: Spotlight.Item ────────────────────────────────────

/** Spotlight.Item props */
export interface SpotlightItemComponentProps {
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
}

const SpotlightItemCompound = forwardRef<HTMLDivElement, SpotlightItemComponentProps>(
  function SpotlightItem(props, ref) {
    const { children, className, disabled, onClick, icon, description } = props;
    const ctx = useSpotlightContext();
    const slot = getSlotProps('item', spotItemStyle, ctx.classNames, ctx.styles);
    const iconSlot = getSlotProps('itemIcon', spotItemIconStyle, ctx.classNames, ctx.styles);
    const labelSlot = getSlotProps('itemLabel', spotItemLabelStyle, ctx.classNames, ctx.styles);
    const descSlot = getSlotProps('itemDescription', spotItemDescriptionStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        role="option"
        data-testid="spot-item"
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
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────────────

export interface SpotlightComponentProps
  extends UseSpotlightProps,
    SlotStyleProps<SpotlightSlot> {
  /** Boyut / Size */
  size?: SpotlightSize;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;

  /** Ikon render callback / Icon render callback */
  renderIcon?: (icon: string) => ReactNode;

  /** Arama ikonu / Search icon (input sol tarafi) */
  searchIcon?: ReactNode;

  /** Portal hedef elementi / Portal container element */
  portalContainer?: HTMLElement;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

/**
 * Spotlight bilesen — macOS Spotlight tarzi global arama.
 * Spotlight component — macOS Spotlight-style global search.
 *
 * @example
 * ```tsx
 * <Spotlight
 *   items={[
 *     { key: 'doc1', label: 'README.md', group: 'Files', icon: 'file' },
 *     { key: 'settings', label: 'Settings', group: 'Actions', icon: 'settings' },
 *   ]}
 *   open={isOpen}
 *   onSelect={(key) => console.log('Selected:', key)}
 *   onOpenChange={(open) => setIsOpen(open)}
 * />
 * ```
 */
const SpotlightBase = forwardRef<HTMLDivElement, SpotlightComponentProps>(
  function Spotlight(props, ref) {
    const {
      size = 'md',
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      renderIcon,
      searchIcon,
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
      isLoading,
      recentSearches,
      placeholder,
      emptyMessage,
      loadingMessage,
      close,
      setQuery,
      highlightNext,
      highlightPrev,
      select,
      selectIndex,
      clearRecentSearches,
    } = useSpotlight(hookProps);

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
    const rootClass = spotRootRecipe({ size });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const overlaySlot = getSlotProps('overlay', spotOverlayStyle, classNames, styles);
    const inputWrapperSlot = getSlotProps('inputWrapper', spotInputWrapperStyle, classNames, styles);
    const inputIconSlot = getSlotProps('inputIcon', spotInputIconStyle, classNames, styles);
    const inputSlot = getSlotProps('input', spotInputStyle, classNames, styles);
    const listSlot = getSlotProps('list', spotListStyle, classNames, styles);
    const groupSlot = getSlotProps('group', spotGroupStyle, classNames, styles);
    const itemSlot = getSlotProps('item', spotItemStyle, classNames, styles);
    const itemIconSlot = getSlotProps('itemIcon', spotItemIconStyle, classNames, styles);
    const itemLabelSlot = getSlotProps('itemLabel', spotItemLabelStyle, classNames, styles);
    const itemDescSlot = getSlotProps('itemDescription', spotItemDescriptionStyle, classNames, styles);
    const emptySlot = getSlotProps('empty', spotEmptyStyle, classNames, styles);
    const loadingSlotProps = getSlotProps('loading', spotLoadingStyle, classNames, styles);
    const recentHeaderSlot = getSlotProps('recentHeader', spotRecentHeaderStyle, classNames, styles);
    const recentItemSlot = getSlotProps('recentItem', spotRecentItemStyle, classNames, styles);

    const ctxValue: SpotlightContextValue = { size, classNames, styles };

    // ── Compound API ──
    if (children) {
      const anchor = <span ref={anchorRef} style={{ display: 'none' }} />;
      if (!isOpen || !portalTarget) return anchor;

      const compoundOverlay = (
        <div
          className={overlaySlot.className}
          style={overlaySlot.style}
          onClick={handleOverlayClick}
          data-testid="spot-overlay"
        >
          <SpotlightContext.Provider value={ctxValue}>
            <div
              ref={ref}
              className={combinedRootClassName}
              style={combinedRootStyle}
              id={id}
              role="dialog"
              aria-label="Spotlight Search"
              aria-modal="true"
              data-testid="spot-root"
            >
              {children}
            </div>
          </SpotlightContext.Provider>
        </div>
      );

      return (
        <>
          {anchor}
          {createPortal(compoundOverlay, portalTarget)}
        </>
      );
    }

    // ── Gruplama ──
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

    // ── Son aramalar gosterilecek mi ──
    const showRecent = queryValue === '' && recentSearches.length > 0 && filteredItems.length > 0;

    // ── Item render helper ──
    function renderItem(item: typeof filteredItems[0], globalIndex: number) {
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
        </div>
      );
    }

    // Gizli anchor
    const anchor = <span ref={anchorRef} style={{ display: 'none' }} />;

    if (!isOpen || !portalTarget) return anchor;

    const overlay = (
      <div
        className={overlaySlot.className}
        style={overlaySlot.style}
        onClick={handleOverlayClick}
        data-testid="spot-overlay"
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
          <div className={inputWrapperSlot.className} style={inputWrapperSlot.style}>
            {searchIcon && (
              <span className={inputIconSlot.className} style={inputIconSlot.style}>
                {searchIcon}
              </span>
            )}
            <input
              ref={inputRef}
              className={inputSlot.className}
              style={inputSlot.style}
              type="text"
              value={queryValue}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              data-testid="spot-input"
              {...inputProps}
            />
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div
              className={loadingSlotProps.className}
              style={loadingSlotProps.style}
              data-testid="spot-loading"
            >
              {loadingMessage}
            </div>
          ) : (
            <>
              {/* Recent searches */}
              {showRecent && (
                <div data-testid="spot-recent">
                  <div className={recentHeaderSlot.className} style={recentHeaderSlot.style}>
                    <span>Recent</span>
                    <button
                      className={spotRecentClearStyle}
                      onClick={clearRecentSearches}
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search) => (
                    <div
                      key={search}
                      className={recentItemSlot.className}
                      style={recentItemSlot.style}
                      onClick={() => setQuery(search)}
                      data-testid="spot-recent-item"
                    >
                      {search}
                    </div>
                  ))}
                </div>
              )}

              {/* Results list */}
              {filteredItems.length > 0 ? (
                <div
                  ref={listRef}
                  className={listSlot.className}
                  style={listSlot.style}
                  {...listProps}
                >
                  {/* Ungrouped items */}
                  {ungrouped.map(({ item, globalIndex }) => renderItem(item, globalIndex))}

                  {/* Grouped items */}
                  {groups.map((group) => (
                    <div key={group.key}>
                      <div className={groupSlot.className} style={groupSlot.style}>
                        {group.label}
                      </div>
                      {group.items.map(({ item, globalIndex }) => renderItem(item, globalIndex))}
                    </div>
                  ))}
                </div>
              ) : queryValue ? (
                <div
                  className={emptySlot.className}
                  style={emptySlot.style}
                  data-testid="spot-empty"
                >
                  {emptyMessage}
                </div>
              ) : null}
            </>
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
 * Spotlight bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Spotlight items={[...]} open={isOpen} onSelect={(key) => handle(key)} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Spotlight open={isOpen} onOpenChange={setIsOpen}>
 *   <Spotlight.Input placeholder="Search..." searchIcon={<SearchIcon />} />
 *   <Spotlight.List>
 *     <Spotlight.Item icon={<FileIcon />} description="Project docs">README.md</Spotlight.Item>
 *   </Spotlight.List>
 * </Spotlight>
 * ```
 */
export const Spotlight = Object.assign(SpotlightBase, {
  Input: SpotlightInput,
  List: SpotlightList,
  Item: SpotlightItemCompound,
});
