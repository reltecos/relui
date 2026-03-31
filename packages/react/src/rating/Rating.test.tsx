/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Rating } from './Rating';

describe('Rating', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Rating />);
    expect(screen.getByTestId('rating-root')).toBeInTheDocument();
  });

  it('root role radiogroup', () => {
    render(<Rating />);
    expect(screen.getByTestId('rating-root')).toHaveAttribute('role', 'radiogroup');
  });

  it('varsayilan size md', () => {
    render(<Rating />);
    expect(screen.getByTestId('rating-root')).toHaveAttribute('data-size', 'md');
  });

  it('size sm set edilir', () => {
    render(<Rating size="sm" />);
    expect(screen.getByTestId('rating-root')).toHaveAttribute('data-size', 'sm');
  });

  it('size lg set edilir', () => {
    render(<Rating size="lg" />);
    expect(screen.getByTestId('rating-root')).toHaveAttribute('data-size', 'lg');
  });

  // ── Default stars ──

  it('varsayilan 5 yildiz render edilir', () => {
    render(<Rating />);
    const stars = screen.getAllByTestId('rating-star');
    expect(stars).toHaveLength(5);
  });

  it('custom count 10 ile 10 yildiz render edilir', () => {
    render(<Rating count={10} />);
    const stars = screen.getAllByTestId('rating-star');
    expect(stars).toHaveLength(10);
  });

  it('custom count 3 ile 3 yildiz render edilir', () => {
    render(<Rating count={3} />);
    const stars = screen.getAllByTestId('rating-star');
    expect(stars).toHaveLength(3);
  });

  // ── Click ──

  it('yildiza tiklaninca deger atanir ve onChange cagirilir', () => {
    const onChange = vi.fn();
    render(<Rating onChange={onChange} />);
    const stars = screen.getAllByTestId('rating-star');
    fireEvent.click(stars[2]);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('readOnly modda tiklama yok sayilir', () => {
    const onChange = vi.fn();
    render(<Rating readOnly onChange={onChange} defaultValue={2} />);
    const stars = screen.getAllByTestId('rating-star');
    fireEvent.click(stars[4]);
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── allowHalf ──

  it('allowHalf true ise yarim yildiz desteklenir', () => {
    render(<Rating allowHalf defaultValue={2.5} />);
    const stars = screen.getAllByTestId('rating-star');
    expect(stars[2]).toHaveAttribute('aria-checked', 'true');
  });

  // ── Keyboard ──

  it('ArrowRight degeri arttirir', () => {
    const onChange = vi.fn();
    render(<Rating defaultValue={2} onChange={onChange} />);
    const root = screen.getByTestId('rating-root');
    fireEvent.keyDown(root, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('ArrowUp degeri arttirir', () => {
    const onChange = vi.fn();
    render(<Rating defaultValue={2} onChange={onChange} />);
    const root = screen.getByTestId('rating-root');
    fireEvent.keyDown(root, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('ArrowLeft degeri azaltir', () => {
    const onChange = vi.fn();
    render(<Rating defaultValue={3} onChange={onChange} />);
    const root = screen.getByTestId('rating-root');
    fireEvent.keyDown(root, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('ArrowDown degeri azaltir', () => {
    const onChange = vi.fn();
    render(<Rating defaultValue={3} onChange={onChange} />);
    const root = screen.getByTestId('rating-root');
    fireEvent.keyDown(root, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('Home degeri 0 yapar', () => {
    const onChange = vi.fn();
    render(<Rating defaultValue={3} onChange={onChange} />);
    const root = screen.getByTestId('rating-root');
    fireEvent.keyDown(root, { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('End degeri count yapar', () => {
    const onChange = vi.fn();
    render(<Rating defaultValue={2} count={5} onChange={onChange} />);
    const root = screen.getByTestId('rating-root');
    fireEvent.keyDown(root, { key: 'End' });
    expect(onChange).toHaveBeenCalledWith(5);
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Rating className="my-rating" />);
    expect(screen.getByTestId('rating-root').className).toContain('my-rating');
  });

  it('style root elemana eklenir', () => {
    render(<Rating style={{ padding: '16px' }} />);
    expect(screen.getByTestId('rating-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Rating classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('rating-root').className).toContain('custom-root');
  });

  it('classNames.star star elemana eklenir', () => {
    render(<Rating classNames={{ star: 'custom-star' }} />);
    const stars = screen.getAllByTestId('rating-star');
    expect(stars[0].className).toContain('custom-star');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Rating styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('rating-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.star star elemana eklenir', () => {
    render(<Rating styles={{ star: { padding: '4px' } }} />);
    const stars = screen.getAllByTestId('rating-star');
    expect(stars[0]).toHaveStyle({ padding: '4px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Rating ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  // ── CLEAR ──

  it('deger 0 a set edilebilir', () => {
    const onChange = vi.fn();
    render(<Rating defaultValue={3} onChange={onChange} />);
    const root = screen.getByTestId('rating-root');
    fireEvent.keyDown(root, { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith(0);
  });
});

// ── Compound API ──

describe('Rating (Compound)', () => {
  it('compound: Rating.Star render edilir', () => {
    render(
      <Rating>
        <Rating.Star index={0} />
        <Rating.Star index={1} />
        <Rating.Star index={2} />
      </Rating>,
    );
    const stars = screen.getAllByTestId('rating-star');
    expect(stars).toHaveLength(3);
  });

  it('compound: Rating.Label render edilir', () => {
    render(
      <Rating>
        <Rating.Star index={0} />
        <Rating.Label>My Rating</Rating.Label>
      </Rating>,
    );
    expect(screen.getByTestId('rating-label')).toHaveTextContent('My Rating');
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Rating classNames={{ star: 'cmp-star' }}>
        <Rating.Star index={0} />
      </Rating>,
    );
    expect(screen.getByTestId('rating-star').className).toContain('cmp-star');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Rating styles={{ star: { padding: '8px' } }}>
        <Rating.Star index={0} />
      </Rating>,
    );
    expect(screen.getByTestId('rating-star')).toHaveStyle({ padding: '8px' });
  });

  it('Rating.Star context disinda hata firlatir', () => {
    expect(() => render(<Rating.Star index={0} />)).toThrow();
  });

  it('Rating.Label context disinda hata firlatir', () => {
    expect(() => render(<Rating.Label>Test</Rating.Label>)).toThrow();
  });
});
