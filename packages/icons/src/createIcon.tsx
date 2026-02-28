/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * createIcon — ikon fabrika fonksiyonu.
 * createIcon — icon factory function.
 *
 * Tüm ikonlar bu fonksiyon ile oluşturulur.
 * Ortak SVG wrapper + props handling + forwardRef.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { IconProps } from './types';

/**
 * createIcon yapılandırması / createIcon configuration.
 */
interface CreateIconOptions {
  /** İkon görüntü adı / Icon display name */
  displayName: string;

  /**
   * SVG viewBox değeri / SVG viewBox value.
   *
   * @default '0 0 24 24'
   */
  viewBox?: string;

  /**
   * SVG path'leri / SVG paths.
   *
   * Fonksiyon olarak: strokeWidth parametresi alır.
   */
  path: ReactNode | ((strokeWidth: number) => ReactNode);

  /**
   * Varsayılan fill mı stroke mı / Default fill or stroke.
   *
   * @default 'stroke'
   */
  type?: 'stroke' | 'fill';
}

/**
 * Yeni ikon oluştur / Create a new icon component.
 *
 * @example
 * ```tsx
 * const CheckIcon = createIcon({
 *   displayName: 'CheckIcon',
 *   path: (strokeWidth) => (
 *     <polyline points="20 6 9 17 4 12" strokeWidth={strokeWidth} />
 *   ),
 * });
 * ```
 */
export function createIcon(options: CreateIconOptions) {
  const {
    displayName,
    viewBox = '0 0 24 24',
    path,
    type = 'stroke',
  } = options;

  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
    {
      size = '1em',
      color = 'currentColor',
      strokeWidth = 2,
      className,
      style,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      ...rest
    },
    ref,
  ) {
    const computedSize = typeof size === 'number' ? `${size}px` : size;

    // aria-label yoksa dekoratif ikon olarak işaretle
    const hidden = ariaHidden ?? (ariaLabel ? undefined : true);

    const svgProps = type === 'stroke'
      ? {
          fill: 'none',
          stroke: color,
          strokeWidth,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
        }
      : {
          fill: color,
          stroke: 'none',
        };

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width={computedSize}
        height={computedSize}
        className={className}
        style={style}
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
        aria-hidden={hidden}
        focusable={false}
        {...svgProps}
        {...rest}
      >
        {typeof path === 'function' ? path(strokeWidth) : path}
      </svg>
    );
  });

  Icon.displayName = displayName;

  return Icon;
}
