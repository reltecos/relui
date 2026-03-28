/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SegmentedControl — styled segmented control bilesen (Dual API).
 * SegmentedControl — styled segmented control component (Dual API).
 *
 * Props-based: `<SegmentedControl options={[...]} />`
 * Compound:    `<SegmentedControl options={[...]}><SegmentedControl.Option value="a">A</SegmentedControl.Option></SegmentedControl>`
 *
 * iOS-tarzi toggle kontrol. tablist/tab WAI-ARIA pattern.
 * Boyut varyantlari, kayan gosterge, disabled/readOnly destegi.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { SegmentedControlSize } from '@relteco/relui-core';
import { useSegmentedControl, type UseSegmentedControlProps } from './useSegmentedControl';
import {
  segmentedControlRootRecipe,
  segmentedControlItemStyle,
} from './segmented-control.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** SegmentedControl slot isimleri. */
export type SegmentedControlSlot = 'root' | 'item';

// ── Context (Compound API) ──────────────────────────────────────────

interface SegmentedControlContextValue {
  size: SegmentedControlSize;
  classNames: ClassNames<SegmentedControlSlot> | undefined;
  styles: Styles<SegmentedControlSlot> | undefined;
  getItemProps: ReturnType<typeof useSegmentedControl>['getItemProps'];
  options: ReturnType<typeof useSegmentedControl>['options'];
}

const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

function useSegmentedControlContext(): SegmentedControlContextValue {
  const ctx = useContext(SegmentedControlContext);
  if (!ctx) throw new Error('SegmentedControl compound sub-components must be used within <SegmentedControl>.');
  return ctx;
}

// ── Compound: SegmentedControl.Option ───────────────────────────────

/** SegmentedControl.Option props */
export interface SegmentedControlOptionProps {
  /** Secim degeri / Selection value */
  value: string;
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SegmentedControlOption = forwardRef<HTMLButtonElement, SegmentedControlOptionProps>(
  function SegmentedControlOption(props, ref) {
    const { value, children, className } = props;
    const ctx = useSegmentedControlContext();

    const index = ctx.options.findIndex((opt) => opt.value === value);
    if (index < 0) return null;

    const slot = getSlotProps('item', segmentedControlItemStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const itemProps = ctx.getItemProps(index);

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={slot.style}
        data-testid="segmented-control-item"
        {...itemProps}
      >
        {children}
      </button>
    );
  },
);

// ── SegmentedControl Component Props ───────────────────────────────

export interface SegmentedControlComponentProps extends UseSegmentedControlProps, SlotStyleProps<SegmentedControlSlot> {
  /** Boyut / Size */
  size?: SegmentedControlSize;

  /** Ek className / Additional className */
  className?: string;

  /** aria-label */
  'aria-label'?: string;

  /** id */
  id?: string;

  /** children (compound API) */
  children?: ReactNode;
}

// ── Component ───────────────────────────────────────────────────────

const SegmentedControlBase = forwardRef<HTMLDivElement, SegmentedControlComponentProps>(
  function SegmentedControl(props, ref) {
    const {
      size = 'md',
      className,
      classNames,
      styles,
      'aria-label': ariaLabel,
      id,
      children,
      ...controlProps
    } = props;

    const {
      rootProps,
      getItemProps,
      options,
    } = useSegmentedControl(controlProps);

    const recipeClass = segmentedControlRootRecipe({ size });
    const rootSlot = getSlotProps('root', recipeClass, classNames, styles);
    const combinedClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    // ── Compound API ──
    if (children) {
      const ctxValue: SegmentedControlContextValue = {
        size,
        classNames,
        styles,
        getItemProps,
        options,
      };

      return (
        <SegmentedControlContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={combinedClassName}
            style={rootSlot.style}
            aria-label={ariaLabel}
            id={id}
            data-testid="segmented-control-root"
            {...rootProps}
          >
            {children}
          </div>
        </SegmentedControlContext.Provider>
      );
    }

    // ── Props-based API ──
    const itemSlot = getSlotProps('item', segmentedControlItemStyle, classNames, styles);

    return (
      <div
        ref={ref}
        className={combinedClassName}
        style={rootSlot.style}
        aria-label={ariaLabel}
        id={id}
        data-testid="segmented-control-root"
        {...rootProps}
      >
        {options.map((opt, index) => {
          const itemProps = getItemProps(index);
          return (
            <button
              key={opt.value}
              type="button"
              className={itemSlot.className}
              style={itemSlot.style}
              data-testid="segmented-control-item"
              {...itemProps}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  },
);

/**
 * SegmentedControl bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { value: 'list', label: 'Liste' },
 *     { value: 'grid', label: 'Izgara' },
 *   ]}
 *   defaultValue="list"
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <SegmentedControl options={[{ value: 'list', label: 'Liste' }, { value: 'grid', label: 'Izgara' }]}>
 *   <SegmentedControl.Option value="list">Liste</SegmentedControl.Option>
 *   <SegmentedControl.Option value="grid">Izgara</SegmentedControl.Option>
 * </SegmentedControl>
 * ```
 */
export const SegmentedControl = Object.assign(SegmentedControlBase, {
  Option: SegmentedControlOption,
});
