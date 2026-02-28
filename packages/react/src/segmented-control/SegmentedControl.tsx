/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SegmentedControl — styled segmented control bileşeni.
 * SegmentedControl — styled segmented control component.
 *
 * iOS-tarzı toggle kontrol. tablist/tab WAI-ARIA pattern.
 * Boyut varyantları, kayan gösterge, disabled/readOnly desteği.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import type { SegmentedControlSize } from '@relteco/relui-core';
import { useSegmentedControl, type UseSegmentedControlProps } from './useSegmentedControl';
import {
  segmentedControlRootRecipe,
  segmentedControlItemStyle,
} from './segmented-control.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** SegmentedControl slot isimleri. */
export type SegmentedControlSlot = 'root' | 'item';

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
}

/**
 * SegmentedControl bileşeni — iOS-tarzı segment toggle.
 * SegmentedControl component — iOS-style segment toggle.
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { value: 'list', label: 'Liste' },
 *     { value: 'grid', label: 'Izgara' },
 *     { value: 'kanban', label: 'Kanban' },
 *   ]}
 *   defaultValue="list"
 *   onValueChange={(v) => console.log(v)}
 * />
 * ```
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlComponentProps>(
  function SegmentedControl(props, ref) {
    const {
      size = 'md',
      className,
      classNames,
      styles,
      'aria-label': ariaLabel,
      id,
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

    const itemSlot = getSlotProps('item', segmentedControlItemStyle, classNames, styles);

    return (
      <div
        ref={ref}
        className={combinedClassName}
        style={rootSlot.style}
        aria-label={ariaLabel}
        id={id}
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
