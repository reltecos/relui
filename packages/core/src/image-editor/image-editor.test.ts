/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createImageEditor } from './image-editor.machine';

describe('createImageEditor', () => {
  it('varsayilan context', () => { const api = createImageEditor(); const ctx = api.getContext(); expect(ctx.rotation).toBe(0); expect(ctx.flipH).toBe(false); expect(ctx.flipV).toBe(false); expect(ctx.filter.brightness).toBe(100); expect(ctx.crop).toBeNull(); expect(ctx.annotations).toHaveLength(0); expect(ctx.canUndo).toBe(false); expect(ctx.canRedo).toBe(false); api.destroy(); });
  it('ROTATE_CW 90 derece dondurur', () => { const api = createImageEditor(); api.send({ type: 'ROTATE_CW' }); expect(api.getContext().rotation).toBe(90); api.send({ type: 'ROTATE_CW' }); expect(api.getContext().rotation).toBe(180); api.destroy(); });
  it('ROTATE_CW 360 de 0 olur', () => { const api = createImageEditor(); for (let i = 0; i < 4; i++) api.send({ type: 'ROTATE_CW' }); expect(api.getContext().rotation).toBe(0); api.destroy(); });
  it('ROTATE_CCW 270 derece dondurur', () => { const api = createImageEditor(); api.send({ type: 'ROTATE_CCW' }); expect(api.getContext().rotation).toBe(270); api.destroy(); });
  it('FLIP_H yatay cevirir', () => { const api = createImageEditor(); api.send({ type: 'FLIP_H' }); expect(api.getContext().flipH).toBe(true); api.send({ type: 'FLIP_H' }); expect(api.getContext().flipH).toBe(false); api.destroy(); });
  it('FLIP_V dikey cevirir', () => { const api = createImageEditor(); api.send({ type: 'FLIP_V' }); expect(api.getContext().flipV).toBe(true); api.destroy(); });
  it('SET_FILTER filtre gunceller', () => { const api = createImageEditor(); api.send({ type: 'SET_FILTER', filter: { brightness: 150 } }); expect(api.getContext().filter.brightness).toBe(150); expect(api.getContext().filter.contrast).toBe(100); api.destroy(); });
  it('RESET_FILTER filtreyi sifirlar', () => { const api = createImageEditor(); api.send({ type: 'SET_FILTER', filter: { brightness: 50, blur: 5 } }); api.send({ type: 'RESET_FILTER' }); expect(api.getContext().filter.brightness).toBe(100); expect(api.getContext().filter.blur).toBe(0); api.destroy(); });
  it('cssFilter string uretir', () => { const api = createImageEditor(); api.send({ type: 'SET_FILTER', filter: { brightness: 120, blur: 2 } }); const css = api.getContext().cssFilter; expect(css).toContain('brightness(120%)'); expect(css).toContain('blur(2px)'); api.destroy(); });
  it('cssFilter varsayilanda none', () => { const api = createImageEditor(); expect(api.getContext().cssFilter).toBe('none'); api.destroy(); });
  it('SET_CROP kirpma alani ayarlar', () => { const api = createImageEditor(); api.send({ type: 'SET_CROP', crop: { x: 10, y: 20, width: 100, height: 80 } }); expect(api.getContext().crop?.x).toBe(10); api.destroy(); });
  it('ADD_ANNOTATION eklenir', () => { const api = createImageEditor(); api.send({ type: 'ADD_ANNOTATION', annotation: { id: 'a1', type: 'text', x: 10, y: 20, data: 'Hello' } }); expect(api.getContext().annotations).toHaveLength(1); api.destroy(); });
  it('REMOVE_ANNOTATION kaldirilir', () => { const api = createImageEditor(); api.send({ type: 'ADD_ANNOTATION', annotation: { id: 'a1', type: 'text', x: 0, y: 0, data: 'X' } }); api.send({ type: 'REMOVE_ANNOTATION', id: 'a1' }); expect(api.getContext().annotations).toHaveLength(0); api.destroy(); });
  it('UNDO geri alir', () => { const api = createImageEditor(); api.send({ type: 'ROTATE_CW' }); expect(api.getContext().rotation).toBe(90); api.send({ type: 'UNDO' }); expect(api.getContext().rotation).toBe(0); expect(api.getContext().canUndo).toBe(false); api.destroy(); });
  it('REDO yeniden uygular', () => { const api = createImageEditor(); api.send({ type: 'ROTATE_CW' }); api.send({ type: 'UNDO' }); api.send({ type: 'REDO' }); expect(api.getContext().rotation).toBe(90); api.destroy(); });
  it('UNDO bos iken islem yapmaz', () => { const api = createImageEditor(); const l = vi.fn(); api.subscribe(l); api.send({ type: 'UNDO' }); expect(l).not.toHaveBeenCalled(); api.destroy(); });
  it('RESET sifirlar', () => { const api = createImageEditor(); api.send({ type: 'ROTATE_CW' }); api.send({ type: 'SET_FILTER', filter: { brightness: 50 } }); api.send({ type: 'RESET' }); expect(api.getContext().rotation).toBe(0); expect(api.getContext().filter.brightness).toBe(100); api.destroy(); });
  it('onChange callback cagirilir', () => { const onChange = vi.fn(); const api = createImageEditor({ onChange }); api.send({ type: 'ROTATE_CW' }); expect(onChange).toHaveBeenCalled(); api.destroy(); });
  it('canUndo/canRedo dogru', () => { const api = createImageEditor(); expect(api.getContext().canUndo).toBe(false); api.send({ type: 'ROTATE_CW' }); expect(api.getContext().canUndo).toBe(true); api.send({ type: 'UNDO' }); expect(api.getContext().canRedo).toBe(true); api.destroy(); });
  it('yeni islem redo stack temizler', () => { const api = createImageEditor(); api.send({ type: 'ROTATE_CW' }); api.send({ type: 'UNDO' }); api.send({ type: 'FLIP_H' }); expect(api.getContext().canRedo).toBe(false); api.destroy(); });
  it('subscribe/destroy', () => { const api = createImageEditor(); const l = vi.fn(); api.subscribe(l); api.send({ type: 'ROTATE_CW' }); expect(l).toHaveBeenCalledTimes(1); api.destroy(); api.send({ type: 'ROTATE_CW' }); expect(l).toHaveBeenCalledTimes(1); });
});
