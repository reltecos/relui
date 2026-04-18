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
import { DragDrop } from './DragDrop';

describe('DragDrop', () => {
  it('root render edilir', () => { render(<DragDrop>content</DragDrop>); expect(screen.getByTestId('dragdrop-root')).toBeInTheDocument(); });

  it('draggable render edilir', () => {
    render(<DragDrop><DragDrop.Draggable>drag me</DragDrop.Draggable></DragDrop>);
    expect(screen.getByTestId('dragdrop-draggable')).toBeInTheDocument();
  });

  it('draggable draggable attr var', () => {
    render(<DragDrop><DragDrop.Draggable>d</DragDrop.Draggable></DragDrop>);
    expect(screen.getByTestId('dragdrop-draggable')).toHaveAttribute('draggable');
  });

  it('droppable render edilir', () => {
    render(<DragDrop><DragDrop.Droppable>drop here</DragDrop.Droppable></DragDrop>);
    expect(screen.getByTestId('dragdrop-droppable')).toBeInTheDocument();
  });

  it('droppable data-over false', () => {
    render(<DragDrop><DragDrop.Droppable>drop</DragDrop.Droppable></DragDrop>);
    expect(screen.getByTestId('dragdrop-droppable')).toHaveAttribute('data-over', 'false');
  });

  it('droppable data-over true ayarlanabilir', () => {
    render(<DragDrop><DragDrop.Droppable isOver>drop</DragDrop.Droppable></DragDrop>);
    expect(screen.getByTestId('dragdrop-droppable')).toHaveAttribute('data-over', 'true');
  });

  it('overlay surukleme yoksa render edilmez', () => {
    render(<DragDrop><DragDrop.Overlay>overlay</DragDrop.Overlay></DragDrop>);
    expect(screen.queryByTestId('dragdrop-overlay')).not.toBeInTheDocument();
  });

  it('className root elemana eklenir', () => {
    render(<DragDrop className="my-dd">c</DragDrop>);
    expect(screen.getByTestId('dragdrop-root').className).toContain('my-dd');
  });

  it('style root elemana eklenir', () => {
    render(<DragDrop style={{ padding: '16px' }}>c</DragDrop>);
    expect(screen.getByTestId('dragdrop-root')).toHaveStyle({ padding: '16px' });
  });

  it('classNames.root eklenir', () => {
    render(<DragDrop classNames={{ root: 'c-r' }}>c</DragDrop>);
    expect(screen.getByTestId('dragdrop-root').className).toContain('c-r');
  });

  it('classNames.draggable eklenir', () => {
    render(<DragDrop classNames={{ draggable: 'c-d' }}><DragDrop.Draggable>d</DragDrop.Draggable></DragDrop>);
    expect(screen.getByTestId('dragdrop-draggable').className).toContain('c-d');
  });

  it('classNames.droppable eklenir', () => {
    render(<DragDrop classNames={{ droppable: 'c-dp' }}><DragDrop.Droppable>dp</DragDrop.Droppable></DragDrop>);
    expect(screen.getByTestId('dragdrop-droppable').className).toContain('c-dp');
  });

  it('styles.root eklenir', () => {
    render(<DragDrop styles={{ root: { padding: '24px' } }}>c</DragDrop>);
    expect(screen.getByTestId('dragdrop-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.draggable eklenir', () => {
    render(<DragDrop styles={{ draggable: { padding: '8px' } }}><DragDrop.Draggable>d</DragDrop.Draggable></DragDrop>);
    expect(screen.getByTestId('dragdrop-draggable')).toHaveStyle({ padding: '8px' });
  });

  it('styles.droppable eklenir', () => {
    render(<DragDrop styles={{ droppable: { padding: '12px' } }}><DragDrop.Droppable>dp</DragDrop.Droppable></DragDrop>);
    expect(screen.getByTestId('dragdrop-droppable')).toHaveStyle({ padding: '12px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<DragDrop ref={ref}>c</DragDrop>);
    expect(ref).toHaveBeenCalled();
  });

  it('DragDrop.Draggable context disinda hata firlatir', () => {
    expect(() => render(<DragDrop.Draggable>d</DragDrop.Draggable>)).toThrow();
  });

  it('DragDrop.Droppable context disinda hata firlatir', () => {
    expect(() => render(<DragDrop.Droppable>d</DragDrop.Droppable>)).toThrow();
  });

  it('DragDrop.Overlay context disinda hata firlatir', () => {
    expect(() => render(<DragDrop.Overlay>o</DragDrop.Overlay>)).toThrow();
  });

  it('draggable ve droppable birlikte render edilir', () => {
    render(
      <DragDrop>
        <DragDrop.Draggable>drag</DragDrop.Draggable>
        <DragDrop.Droppable>drop</DragDrop.Droppable>
      </DragDrop>,
    );
    expect(screen.getByTestId('dragdrop-draggable')).toBeInTheDocument();
    expect(screen.getByTestId('dragdrop-droppable')).toBeInTheDocument();
  });

  it('draggable children render eder', () => {
    render(<DragDrop><DragDrop.Draggable>Hello Drag</DragDrop.Draggable></DragDrop>);
    expect(screen.getByText('Hello Drag')).toBeInTheDocument();
  });

  it('droppable children render eder', () => {
    render(<DragDrop><DragDrop.Droppable>Drop Zone</DragDrop.Droppable></DragDrop>);
    expect(screen.getByText('Drop Zone')).toBeInTheDocument();
  });
});
