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
import { ImageEditor } from './ImageEditor';

describe('ImageEditor', () => {
  it('root render edilir', () => { render(<ImageEditor />); expect(screen.getByTestId('image-editor-root')).toBeInTheDocument(); });
  it('toolbar render edilir', () => { render(<ImageEditor />); expect(screen.getByTestId('image-editor-toolbar')).toBeInTheDocument(); });
  it('canvas render edilir', () => { render(<ImageEditor />); expect(screen.getByTestId('image-editor-canvas')).toBeInTheDocument(); });
  it('src ile image render edilir', () => { render(<ImageEditor src="/img.png" />); expect(screen.getByTestId('image-editor-image')).toBeInTheDocument(); });
  it('rotateCW butonu calisir', () => { render(<ImageEditor src="/img.png" />); fireEvent.click(screen.getByTestId('image-editor-rotateCW')); expect(screen.getByTestId('image-editor-image')).toBeInTheDocument(); });
  it('rotateCCW butonu calisir', () => { render(<ImageEditor src="/img.png" />); fireEvent.click(screen.getByTestId('image-editor-rotateCCW')); expect(screen.getByTestId('image-editor-image')).toBeInTheDocument(); });
  it('flipH butonu calisir', () => { render(<ImageEditor src="/img.png" />); fireEvent.click(screen.getByTestId('image-editor-flipH')); expect(screen.getByTestId('image-editor-image')).toBeInTheDocument(); });
  it('flipV butonu calisir', () => { render(<ImageEditor src="/img.png" />); fireEvent.click(screen.getByTestId('image-editor-flipV')); expect(screen.getByTestId('image-editor-image')).toBeInTheDocument(); });
  it('undo butonu render edilir', () => { render(<ImageEditor />); expect(screen.getByTestId('image-editor-undo')).toBeInTheDocument(); });
  it('redo butonu render edilir', () => { render(<ImageEditor />); expect(screen.getByTestId('image-editor-redo')).toBeInTheDocument(); });
  it('undo ilk basta disabled', () => { render(<ImageEditor />); expect(screen.getByTestId('image-editor-undo')).toBeDisabled(); });
  it('redo ilk basta disabled', () => { render(<ImageEditor />); expect(screen.getByTestId('image-editor-redo')).toBeDisabled(); });
  it('undo islem sonrasi aktif', () => { render(<ImageEditor src="/img.png" />); fireEvent.click(screen.getByTestId('image-editor-rotateCW')); expect(screen.getByTestId('image-editor-undo')).not.toBeDisabled(); });
  it('reset butonu calisir', () => { render(<ImageEditor src="/img.png" />); fireEvent.click(screen.getByTestId('image-editor-rotateCW')); fireEvent.click(screen.getByTestId('image-editor-reset')); expect(screen.getByTestId('image-editor-image')).toBeInTheDocument(); });
  it('showFilters true ise filtre paneli gosterilir', () => { render(<ImageEditor showFilters />); expect(screen.getByTestId('image-editor-filterPanel')).toBeInTheDocument(); });
  it('showFilters false ise filtre paneli gizlenir', () => { render(<ImageEditor />); expect(screen.queryByTestId('image-editor-filterPanel')).not.toBeInTheDocument(); });
  it('filtre slider render edilir', () => { render(<ImageEditor showFilters />); expect(screen.getByTestId('image-editor-filter-brightness')).toBeInTheDocument(); });
  it('filtre resetle butonu calisir', () => { render(<ImageEditor showFilters />); expect(screen.getByTestId('image-editor-resetFilter')).toBeInTheDocument(); });

  // ── Slot API ──
  it('className root elemana eklenir', () => { render(<ImageEditor className="my-ie" />); expect(screen.getByTestId('image-editor-root').className).toContain('my-ie'); });
  it('style root elemana eklenir', () => { render(<ImageEditor style={{ padding: '8px' }} />); expect(screen.getByTestId('image-editor-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<ImageEditor classNames={{ root: 'cr' }} />); expect(screen.getByTestId('image-editor-root').className).toContain('cr'); });
  it('styles.root eklenir', () => { render(<ImageEditor styles={{ root: { padding: '12px' } }} />); expect(screen.getByTestId('image-editor-root')).toHaveStyle({ padding: '12px' }); });
  it('classNames.toolbar eklenir', () => { render(<ImageEditor classNames={{ toolbar: 'ct' }} />); expect(screen.getByTestId('image-editor-toolbar').className).toContain('ct'); });
  it('styles.toolbar eklenir', () => { render(<ImageEditor styles={{ toolbar: { padding: '10px' } }} />); expect(screen.getByTestId('image-editor-toolbar')).toHaveStyle({ padding: '10px' }); });
  it('classNames.canvas eklenir', () => { render(<ImageEditor classNames={{ canvas: 'cc' }} />); expect(screen.getByTestId('image-editor-canvas').className).toContain('cc'); });
  it('styles.canvas eklenir', () => { render(<ImageEditor styles={{ canvas: { padding: '20px' } }} />); expect(screen.getByTestId('image-editor-canvas')).toHaveStyle({ padding: '20px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<ImageEditor ref={ref} />); expect(ref).toHaveBeenCalled(); });
});

describe('ImageEditor (Compound)', () => {
  it('compound: Toolbar render edilir', () => { render(<ImageEditor><ImageEditor.Toolbar /></ImageEditor>); expect(screen.getByTestId('image-editor-toolbar')).toBeInTheDocument(); });
  it('compound: Canvas render edilir', () => { render(<ImageEditor><ImageEditor.Canvas src="/img.png" /></ImageEditor>); expect(screen.getByTestId('image-editor-canvas')).toBeInTheDocument(); });
  it('compound: FilterPanel render edilir', () => { render(<ImageEditor><ImageEditor.FilterPanel /></ImageEditor>); expect(screen.getByTestId('image-editor-filterPanel')).toBeInTheDocument(); });
  it('compound: classNames context ile aktarilir', () => { render(<ImageEditor classNames={{ toolbar: 'ct' }}><ImageEditor.Toolbar /></ImageEditor>); expect(screen.getByTestId('image-editor-toolbar').className).toContain('ct'); });
  it('compound: styles context ile aktarilir', () => { render(<ImageEditor styles={{ toolbar: { padding: '20px' } }}><ImageEditor.Toolbar /></ImageEditor>); expect(screen.getByTestId('image-editor-toolbar')).toHaveStyle({ padding: '20px' }); });
  it('ImageEditor.Toolbar context disinda hata firlatir', () => { expect(() => render(<ImageEditor.Toolbar />)).toThrow(); });
});
