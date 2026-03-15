/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { AvatarGroup } from './AvatarGroup';

const ITEMS = [
  { name: 'Ali Veli' },
  { name: 'Zeynep Kara' },
  { name: 'Mehmet Oz' },
  { name: 'Ayse Yilmaz' },
  { name: 'Can Demir' },
];

describe('AvatarGroup', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<AvatarGroup items={ITEMS} />);
    expect(screen.getByTestId('avatar-group-root')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-group-root')).toHaveAttribute('role', 'group');
  });

  // ── Avatars ──

  it('tum avatarlar render edilir', () => {
    render(<AvatarGroup items={ITEMS} />);
    const avatars = screen.getAllByTestId('avatar-group-avatar');
    expect(avatars).toHaveLength(5);
  });

  it('bos items ile avatar render edilmez', () => {
    render(<AvatarGroup items={[]} />);
    expect(screen.queryByTestId('avatar-group-avatar')).not.toBeInTheDocument();
  });

  // ── Max ──

  it('max prop ile gorunen avatar sayisi sinirlanir', () => {
    render(<AvatarGroup items={ITEMS} max={3} />);
    const avatars = screen.getAllByTestId('avatar-group-avatar');
    expect(avatars).toHaveLength(3);
  });

  it('max verilince overflow gosterilir', () => {
    render(<AvatarGroup items={ITEMS} max={3} />);
    const overflow = screen.getByTestId('avatar-group-overflow');
    expect(overflow).toBeInTheDocument();
    expect(overflow).toHaveTextContent('+2');
  });

  it('max items sayisindan buyukse overflow gosterilmez', () => {
    render(<AvatarGroup items={ITEMS} max={10} />);
    expect(screen.queryByTestId('avatar-group-overflow')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('avatar-group-avatar')).toHaveLength(5);
  });

  it('max items sayisina esitse overflow gosterilmez', () => {
    render(<AvatarGroup items={ITEMS} max={5} />);
    expect(screen.queryByTestId('avatar-group-overflow')).not.toBeInTheDocument();
  });

  it('max olmadan overflow gosterilmez', () => {
    render(<AvatarGroup items={ITEMS} />);
    expect(screen.queryByTestId('avatar-group-overflow')).not.toBeInTheDocument();
  });

  // ── Size ──

  it('size prop avatarlara aktarilir', () => {
    render(<AvatarGroup items={[{ name: 'Ali' }]} size="lg" />);
    expect(screen.getByTestId('avatar-root')).toHaveAttribute('data-size', 'lg');
  });

  // ── Variant ──

  it('variant prop avatarlara aktarilir', () => {
    render(<AvatarGroup items={[{ name: 'Ali' }]} variant="square" />);
    expect(screen.getByTestId('avatar-root')).toHaveAttribute('data-variant', 'square');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<AvatarGroup items={ITEMS} className="my-group" />);
    expect(screen.getByTestId('avatar-group-root').className).toContain('my-group');
  });

  it('style root elemana eklenir', () => {
    render(<AvatarGroup items={ITEMS} style={{ padding: '8px' }} />);
    expect(screen.getByTestId('avatar-group-root')).toHaveStyle({ padding: '8px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<AvatarGroup items={ITEMS} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('avatar-group-root').className).toContain('custom-root');
  });

  it('classNames.avatar avatar wrapper elemana eklenir', () => {
    render(
      <AvatarGroup items={[{ name: 'Ali' }]} classNames={{ avatar: 'custom-av' }} />,
    );
    expect(screen.getByTestId('avatar-group-avatar').className).toContain('custom-av');
  });

  it('classNames.overflow overflow elemana eklenir', () => {
    render(
      <AvatarGroup items={ITEMS} max={2} classNames={{ overflow: 'custom-ov' }} />,
    );
    expect(screen.getByTestId('avatar-group-overflow').className).toContain('custom-ov');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<AvatarGroup items={ITEMS} styles={{ root: { padding: '12px' } }} />);
    expect(screen.getByTestId('avatar-group-root')).toHaveStyle({ padding: '12px' });
  });

  it('styles.avatar avatar wrapper elemana eklenir', () => {
    render(
      <AvatarGroup
        items={[{ name: 'Ali' }]}
        styles={{ avatar: { opacity: '0.8' } }}
      />,
    );
    expect(screen.getByTestId('avatar-group-avatar')).toHaveStyle({ opacity: '0.8' });
  });

  it('styles.overflow overflow elemana eklenir', () => {
    render(
      <AvatarGroup
        items={ITEMS}
        max={2}
        styles={{ overflow: { fontSize: '18px' } }}
      />,
    );
    expect(screen.getByTestId('avatar-group-overflow')).toHaveStyle({ fontSize: '18px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<AvatarGroup items={ITEMS} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('AvatarGroup (Compound)', () => {
  it('compound: children render edilir', () => {
    render(
      <AvatarGroup>
        <AvatarGroup.Avatar name="Ali Veli" />
        <AvatarGroup.Avatar name="Zeynep Kara" />
      </AvatarGroup>,
    );
    const avatars = screen.getAllByTestId('avatar-group-avatar');
    expect(avatars).toHaveLength(2);
  });

  it('compound: size context ile avatarlara aktarilir', () => {
    render(
      <AvatarGroup size="lg">
        <AvatarGroup.Avatar name="Ali" />
      </AvatarGroup>,
    );
    expect(screen.getByTestId('avatar-root')).toHaveAttribute('data-size', 'lg');
  });

  it('compound: variant context ile avatarlara aktarilir', () => {
    render(
      <AvatarGroup variant="square">
        <AvatarGroup.Avatar name="Ali" />
      </AvatarGroup>,
    );
    expect(screen.getByTestId('avatar-root')).toHaveAttribute('data-variant', 'square');
  });

  it('compound: max ile overflow gosterilir', () => {
    render(
      <AvatarGroup max={2}>
        <AvatarGroup.Avatar name="Ali" />
        <AvatarGroup.Avatar name="Veli" />
        <AvatarGroup.Avatar name="Can" />
        <AvatarGroup.Avatar name="Zeynep" />
      </AvatarGroup>,
    );
    const avatars = screen.getAllByTestId('avatar-group-avatar');
    expect(avatars).toHaveLength(2);
    const overflow = screen.getByTestId('avatar-group-overflow');
    expect(overflow).toHaveTextContent('+2');
  });

  it('compound: max olmadan overflow gosterilmez', () => {
    render(
      <AvatarGroup>
        <AvatarGroup.Avatar name="Ali" />
        <AvatarGroup.Avatar name="Veli" />
      </AvatarGroup>,
    );
    expect(screen.queryByTestId('avatar-group-overflow')).not.toBeInTheDocument();
  });

  it('compound: classNames.avatar compound avatar wrapper a eklenir', () => {
    render(
      <AvatarGroup classNames={{ avatar: 'cmp-av' }}>
        <AvatarGroup.Avatar name="Ali" />
      </AvatarGroup>,
    );
    expect(screen.getByTestId('avatar-group-avatar').className).toContain('cmp-av');
  });
});
