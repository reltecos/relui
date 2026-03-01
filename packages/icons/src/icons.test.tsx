/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  MinusIcon,
  CloseIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  CopyIcon,
  createIcon,
} from './index';


// ── Tüm ikonların listesi / All icons list ──────────────────────────

const allIcons = [
  { name: 'EyeIcon', Component: EyeIcon },
  { name: 'EyeOffIcon', Component: EyeOffIcon },
  { name: 'CheckIcon', Component: CheckIcon },
  { name: 'MinusIcon', Component: MinusIcon },
  { name: 'CloseIcon', Component: CloseIcon },
  { name: 'ChevronUpIcon', Component: ChevronUpIcon },
  { name: 'ChevronDownIcon', Component: ChevronDownIcon },
  { name: 'ChevronLeftIcon', Component: ChevronLeftIcon },
  { name: 'ChevronRightIcon', Component: ChevronRightIcon },
  { name: 'SearchIcon', Component: SearchIcon },
  { name: 'CopyIcon', Component: CopyIcon },
] as const;

describe('Icons', () => {
  // ──────────────────────────────────────────
  // Her ikon render edilir / All icons render
  // ──────────────────────────────────────────

  describe.each(allIcons)('$name', ({ Component }) => {
    it('render edilir / renders', () => {
      const { container } = render(<Component />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('varsayılan boyut 1em / default size is 1em', () => {
      const { container } = render(<Component />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '1em');
      expect(svg).toHaveAttribute('height', '1em');
    });

    it('size prop ile boyut değişir / size prop changes dimensions', () => {
      const { container } = render(<Component size={24} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24px');
      expect(svg).toHaveAttribute('height', '24px');
    });

    it('string size desteklenir / string size is supported', () => {
      const { container } = render(<Component size="2rem" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '2rem');
      expect(svg).toHaveAttribute('height', '2rem');
    });

    it('color prop çalışır / color prop works', () => {
      const { container } = render(<Component color="red" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', 'red');
    });

    it('aria-label dekoratif olmaktan çıkarır / aria-label removes decorative', () => {
      const { container } = render(<Component aria-label="Test ikonu" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-label', 'Test ikonu');
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).not.toHaveAttribute('aria-hidden');
    });

    it('aria-label yoksa dekoratif ikon olur / decorative when no aria-label', () => {
      const { container } = render(<Component />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).not.toHaveAttribute('role');
    });

    it('className geçirilir / passes className', () => {
      const { container } = render(<Component className="my-icon" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('my-icon');
    });

    it('viewBox 0 0 24 24 / has correct viewBox', () => {
      const { container } = render(<Component />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('focusable false / is not focusable', () => {
      const { container } = render(<Component />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('focusable', 'false');
    });
  });

  // ──────────────────────────────────────────
  // createIcon
  // ──────────────────────────────────────────

  describe('createIcon', () => {
    it('custom ikon oluşturur / creates custom icon', () => {
      const CustomIcon = createIcon({
        displayName: 'CustomIcon',
        path: <rect x="4" y="4" width="16" height="16" />,
      });

      const { container } = render(<CustomIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      const rect = svg?.querySelector('rect');
      expect(rect).toBeInTheDocument();
    });

    it('fill type desteklenir / fill type is supported', () => {
      const FillIcon = createIcon({
        displayName: 'FillIcon',
        type: 'fill',
        path: <circle cx="12" cy="12" r="10" />,
      });

      const { container } = render(<FillIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'currentColor');
      expect(svg).toHaveAttribute('stroke', 'none');
    });

    it('custom viewBox desteklenir / custom viewBox is supported', () => {
      const SmallIcon = createIcon({
        displayName: 'SmallIcon',
        viewBox: '0 0 16 16',
        path: <circle cx="8" cy="8" r="6" />,
      });

      const { container } = render(<SmallIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
    });

    it('path fonksiyon olarak strokeWidth alır / path function receives strokeWidth', () => {
      const DynIcon = createIcon({
        displayName: 'DynIcon',
        path: (sw) => <line x1="0" y1="0" x2="24" y2="24" strokeWidth={sw} />,
      });

      const { container } = render(<DynIcon strokeWidth={3} />);
      const line = container.querySelector('line');
      expect(line).toHaveAttribute('stroke-width', '3');
    });

    it('ref forward edilir / ref is forwarded', () => {
      const RefIcon = createIcon({
        displayName: 'RefIcon',
        path: <circle cx="12" cy="12" r="10" />,
      });

      const ref = vi.fn();
      render(<RefIcon ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────
  // strokeWidth
  // ──────────────────────────────────────────

  describe('strokeWidth', () => {
    it('varsayılan strokeWidth 2 / default strokeWidth is 2', () => {
      const { container } = render(<CheckIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke-width', '2');
    });

    it('custom strokeWidth geçirilir / custom strokeWidth is passed', () => {
      const { container } = render(<CheckIcon strokeWidth={1.5} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke-width', '1.5');
    });
  });
});
