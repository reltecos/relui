/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PropertyGrid — nesne ozellikleri duzenleme bilesen (Dual API).
 * PropertyGrid — object property editor component (Dual API).
 *
 * Props-based: `<PropertyGrid properties={defs} onValueChange={(k,v) => ...} />`
 * Compound:    `<PropertyGrid properties={defs}><PropertyGrid.Category label="Layout">...</PropertyGrid.Category></PropertyGrid>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useCallback, useMemo, type ReactNode } from 'react';
import { ChevronDownIcon } from '@relteco/relui-icons';
import type { PropertyDef } from '@relteco/relui-core';
import {
  rootStyle, searchInputStyle, categoryStyle, categoryHeaderStyle,
  propertyStyle, labelStyle, editorStyle, editorInputStyle,
  editorCheckboxStyle, editorSelectStyle, chevronStyle,
} from './property-grid.css';
import { usePropertyGrid, type UsePropertyGridProps } from './usePropertyGrid';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type PropertyGridSlot = 'root' | 'category' | 'property' | 'editor' | 'label' | 'searchInput';

// ── Context ───────────────────────────────────────────

interface PropertyGridContextValue {
  values: ReadonlyMap<string, unknown>;
  collapsedCategories: ReadonlySet<string>;
  filter: string;
  properties: PropertyDef[];
  onSetValue: (key: string, value: unknown) => void;
  onToggleCategory: (cat: string) => void;
  onSetFilter: (f: string) => void;
  classNames: ClassNames<PropertyGridSlot> | undefined;
  styles: Styles<PropertyGridSlot> | undefined;
}

const PropertyGridContext = createContext<PropertyGridContextValue | null>(null);

function usePropertyGridContext(): PropertyGridContextValue {
  const ctx = useContext(PropertyGridContext);
  if (!ctx) throw new Error('PropertyGrid compound sub-components must be used within <PropertyGrid>.');
  return ctx;
}

// ── Internal: Editor renderer ─────────────────────────

function renderEditor(
  prop: PropertyDef,
  value: unknown,
  onSetValue: (key: string, val: unknown) => void,
): ReactNode {
  const disabled = prop.readonly ?? false;

  switch (prop.type) {
    case 'boolean':
      return (
        <input
          type="checkbox"
          className={editorCheckboxStyle}
          checked={Boolean(value)}
          onChange={(e) => onSetValue(prop.key, e.target.checked)}
          disabled={disabled}
          data-testid="propertygrid-editor-checkbox"
        />
      );
    case 'number':
      return (
        <input
          type="number"
          className={editorInputStyle}
          value={value !== undefined && value !== null ? String(value) : ''}
          onChange={(e) => onSetValue(prop.key, e.target.value === '' ? 0 : Number(e.target.value))}
          disabled={disabled}
          data-testid="propertygrid-editor-number"
        />
      );
    case 'color':
      return (
        <input
          type="color"
          value={typeof value === 'string' ? value : '#000000'}
          onChange={(e) => onSetValue(prop.key, e.target.value)}
          disabled={disabled}
          data-testid="propertygrid-editor-color"
        />
      );
    case 'enum':
      return (
        <select
          className={editorSelectStyle}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onSetValue(prop.key, e.target.value)}
          disabled={disabled}
          data-testid="propertygrid-editor-select"
        >
          {prop.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    default:
      return (
        <input
          type="text"
          className={editorInputStyle}
          value={typeof value === 'string' ? value : String(value ?? '')}
          onChange={(e) => onSetValue(prop.key, e.target.value)}
          disabled={disabled}
          data-testid="propertygrid-editor-text"
        />
      );
  }
}

// ── Compound: PropertyGrid.Category ───────────────────

export interface PropertyGridCategoryProps {
  /** Kategori etiketi / Category label */
  label: string;
  /** Alt icerik / Children */
  children?: ReactNode;
  /** Ek className */
  className?: string;
}

const PropertyGridCategory = forwardRef<HTMLDivElement, PropertyGridCategoryProps>(
  function PropertyGridCategory(props, ref) {
    const { label, children, className } = props;
    const ctx = usePropertyGridContext();
    const isCollapsed = ctx.collapsedCategories.has(label);
    const slot = getSlotProps('category', categoryStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="propertygrid-category">
        <div
          className={categoryHeaderStyle}
          onClick={() => ctx.onToggleCategory(label)}
          data-testid="propertygrid-category-header"
        >
          <span className={chevronStyle} data-collapsed={isCollapsed}>
            <ChevronDownIcon size={12} />
          </span>
          {label}
        </div>
        {!isCollapsed && children}
      </div>
    );
  },
);

// ── Compound: PropertyGrid.Property ───────────────────

export interface PropertyGridPropertyProps {
  /** Ozellik anahtari / Property key */
  propertyKey: string;
  /** Ek className */
  className?: string;
}

const PropertyGridProperty = forwardRef<HTMLDivElement, PropertyGridPropertyProps>(
  function PropertyGridProperty(props, ref) {
    const { propertyKey, className } = props;
    const ctx = usePropertyGridContext();
    const prop = ctx.properties.find((p) => p.key === propertyKey);
    if (!prop) return null;

    const value = ctx.values.get(prop.key);
    const propSlot = getSlotProps('property', propertyStyle, ctx.classNames, ctx.styles);
    const lblSlot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const edSlot = getSlotProps('editor', editorStyle, ctx.classNames, ctx.styles);
    const propCls = className ? `${propSlot.className} ${className}` : propSlot.className;

    return (
      <div ref={ref} className={propCls} style={propSlot.style} role="row" data-testid="propertygrid-property">
        <div className={lblSlot.className} style={lblSlot.style} role="rowheader" data-testid="propertygrid-label" title={prop.description}>
          {prop.label}
        </div>
        <div className={edSlot.className} style={edSlot.style} role="gridcell" data-testid="propertygrid-editor">
          {renderEditor(prop, value, ctx.onSetValue)}
        </div>
      </div>
    );
  },
);

// ── Compound: PropertyGrid.Editor ─────────────────────

export interface PropertyGridEditorProps {
  /** Ozellik anahtari / Property key */
  propertyKey: string;
  /** Ozel editor render / Custom editor render */
  children: (value: unknown, setValue: (v: unknown) => void) => ReactNode;
  /** Ek className */
  className?: string;
}

const PropertyGridEditor = forwardRef<HTMLDivElement, PropertyGridEditorProps>(
  function PropertyGridEditor(props, ref) {
    const { propertyKey, children, className } = props;
    const ctx = usePropertyGridContext();
    const value = ctx.values.get(propertyKey);
    const edSlot = getSlotProps('editor', editorStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${edSlot.className} ${className}` : edSlot.className;

    return (
      <div ref={ref} className={cls} style={edSlot.style} role="gridcell" data-testid="propertygrid-editor">
        {children(value, (v) => ctx.onSetValue(propertyKey, v))}
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface PropertyGridComponentProps extends SlotStyleProps<PropertyGridSlot> {
  /** Ozellik tanimlari / Property definitions */
  properties: PropertyDef[];
  /** Deger degisince / On value change */
  onValueChange?: (key: string, value: unknown) => void;
  /** Arama gosterilsin mi / Show search */
  showSearch?: boolean;
  /** Compound children */
  children?: ReactNode;
  /** Ek className */
  className?: string;
  /** Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const PropertyGridBase = forwardRef<HTMLDivElement, PropertyGridComponentProps>(
  function PropertyGrid(props, ref) {
    const {
      properties,
      onValueChange,
      showSearch = true,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UsePropertyGridProps = { properties, onValueChange };
    const { context, send } = usePropertyGrid(hookProps);

    const onSetValue = useCallback(
      (key: string, value: unknown) => send({ type: 'SET_VALUE', key, value }),
      [send],
    );
    const onToggleCategory = useCallback(
      (cat: string) => send({ type: 'TOGGLE_CATEGORY', category: cat }),
      [send],
    );
    const onSetFilter = useCallback(
      (f: string) => send({ type: 'SET_FILTER', filter: f }),
      [send],
    );

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const searchSlot = getSlotProps('searchInput', searchInputStyle, classNames, styles);

    const ctxValue: PropertyGridContextValue = {
      values: context.values,
      collapsedCategories: context.collapsedCategories,
      filter: context.filter,
      properties,
      onSetValue,
      onToggleCategory,
      onSetFilter,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <PropertyGridContext.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} role="grid" data-testid="propertygrid-root">
            {showSearch && (
              <input
                className={searchSlot.className}
                style={searchSlot.style}
                placeholder="Ara..."
                value={context.filter}
                onChange={(e) => onSetFilter(e.target.value)}
                data-testid="propertygrid-searchInput"
                aria-label="Filter properties"
              />
            )}
            {children}
          </div>
        </PropertyGridContext.Provider>
      );
    }

    // ── Props-based API ──
    const filterLc = context.filter.toLowerCase();
    const filtered = filterLc
      ? properties.filter((p) => p.label.toLowerCase().includes(filterLc) || p.key.toLowerCase().includes(filterLc))
      : properties;

    // Group by category
    const categoryMap = useMemo(() => {
      const map = new Map<string, PropertyDef[]>();
      for (const p of filtered) {
        const cat = p.category ?? 'Other';
        const arr = map.get(cat);
        if (arr) arr.push(p);
        else map.set(cat, [p]);
      }
      return map;
    }, [filtered]);

    const catSlot = getSlotProps('category', categoryStyle, classNames, styles);
    const propSlot = getSlotProps('property', propertyStyle, classNames, styles);
    const lblSlot = getSlotProps('label', labelStyle, classNames, styles);
    const edSlot = getSlotProps('editor', editorStyle, classNames, styles);

    return (
      <PropertyGridContext.Provider value={ctxValue}>
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} role="grid" data-testid="propertygrid-root">
          {showSearch && (
            <input
              className={searchSlot.className}
              style={searchSlot.style}
              placeholder="Ara..."
              value={context.filter}
              onChange={(e) => onSetFilter(e.target.value)}
              data-testid="propertygrid-searchInput"
              aria-label="Filter properties"
            />
          )}
          {Array.from(categoryMap.entries()).map(([cat, catProps]) => {
            const isCollapsed = context.collapsedCategories.has(cat);
            return (
              <div key={cat} className={catSlot.className} style={catSlot.style} data-testid="propertygrid-category">
                <div
                  className={categoryHeaderStyle}
                  onClick={() => onToggleCategory(cat)}
                  data-testid="propertygrid-category-header"
                >
                  <span className={chevronStyle} data-collapsed={isCollapsed}>
                    <ChevronDownIcon size={12} />
                  </span>
                  {cat}
                </div>
                {!isCollapsed && catProps.map((p) => (
                  <div key={p.key} className={propSlot.className} style={propSlot.style} role="row" data-testid="propertygrid-property">
                    <div className={lblSlot.className} style={lblSlot.style} role="rowheader" data-testid="propertygrid-label" title={p.description}>
                      {p.label}
                    </div>
                    <div className={edSlot.className} style={edSlot.style} role="gridcell" data-testid="propertygrid-editor">
                      {renderEditor(p, context.values.get(p.key), onSetValue)}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </PropertyGridContext.Provider>
    );
  },
);

/**
 * PropertyGrid bilesen — Dual API (props-based + compound).
 */
export const PropertyGrid = Object.assign(PropertyGridBase, {
  Category: PropertyGridCategory,
  Property: PropertyGridProperty,
  Editor: PropertyGridEditor,
});
