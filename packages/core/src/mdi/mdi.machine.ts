/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MDI (Multiple Document Interface) state machine — iç içe pencere yönetimi.
 *
 * Pencere ekleme/kaldırma, cascade/tile düzenleme, z-ordering,
 * minimize/maximize/restore.
 *
 * @packageDocumentation
 */

import type {
  MDIProps,
  MDIEvent,
  MDIAPI,
  MDIWindowConfig,
  MDIWindowInfo,
  MDIArrangement,
} from './mdi.types';

/**
 * MDI state machine oluşturur.
 *
 * @param props - MDI yapılandırması.
 * @returns MDI API.
 */
export function createMDI(props: MDIProps = {}): MDIAPI {
  const windows = new Map<string, MDIWindowInfo>();
  let activeWindowId: string | null = null;
  let nextZIndex = 1;
  let containerWidth = props.containerWidth ?? 800;
  let containerHeight = props.containerHeight ?? 600;

  // ── Helpers ─────────────────────────────────────────

  function bringToFront(id: string): void {
    const win = windows.get(id);
    if (!win) return;

    // Önceki aktif pencereyi deactivate et
    if (activeWindowId && activeWindowId !== id) {
      const prev = windows.get(activeWindowId);
      if (prev) prev.active = false;
    }

    win.zIndex = nextZIndex++;
    win.active = true;
    activeWindowId = id;
  }

  function addWindow(config: MDIWindowConfig): void {
    if (windows.has(config.id)) return;

    const offset = windows.size * 30;
    const x = config.x ?? 50 + offset;
    const y = config.y ?? 50 + offset;
    const width = config.width ?? 400;
    const height = config.height ?? 300;

    const win: MDIWindowInfo = {
      id: config.id,
      title: config.title,
      x,
      y,
      width,
      height,
      state: 'normal',
      zIndex: nextZIndex++,
      active: false,
      restoreRect: { x, y, width, height },
    };

    windows.set(config.id, win);
    bringToFront(config.id);
  }

  function removeWindow(id: string): void {
    windows.delete(id);
    if (activeWindowId === id) {
      // En yüksek z-index'li pencereyi aktif yap
      activeWindowId = null;
      let maxZ = -1;
      for (const w of windows.values()) {
        if (w.zIndex > maxZ) {
          maxZ = w.zIndex;
          activeWindowId = w.id;
        }
      }
      if (activeWindowId) {
        const win = windows.get(activeWindowId);
        if (win) win.active = true;
      }
    }
  }

  function arrangeCascade(): void {
    let idx = 0;
    for (const win of windows.values()) {
      if (win.state === 'minimized') continue;
      if (win.state === 'maximized') {
        win.state = 'normal';
        win.x = win.restoreRect.x;
        win.y = win.restoreRect.y;
        win.width = win.restoreRect.width;
        win.height = win.restoreRect.height;
      }

      const offset = idx * 30;
      win.x = 20 + offset;
      win.y = 20 + offset;
      win.restoreRect = { x: win.x, y: win.y, width: win.width, height: win.height };
      win.zIndex = nextZIndex++;
      idx++;
    }
  }

  function arrangeTile(arrangement: MDIArrangement): void {
    const visibleWindows: MDIWindowInfo[] = [];
    for (const win of windows.values()) {
      if (win.state === 'minimized') continue;
      if (win.state === 'maximized') {
        win.state = 'normal';
      }
      visibleWindows.push(win);
    }

    if (visibleWindows.length === 0) return;

    const count = visibleWindows.length;

    if (arrangement === 'tile-horizontal') {
      const h = Math.floor(containerHeight / count);
      for (let i = 0; i < count; i++) {
        const win = visibleWindows[i] as MDIWindowInfo;
        win.x = 0;
        win.y = i * h;
        win.width = containerWidth;
        win.height = h;
        win.restoreRect = { x: win.x, y: win.y, width: win.width, height: win.height };
        win.zIndex = nextZIndex++;
      }
    } else {
      // tile-vertical
      const w = Math.floor(containerWidth / count);
      for (let i = 0; i < count; i++) {
        const win = visibleWindows[i] as MDIWindowInfo;
        win.x = i * w;
        win.y = 0;
        win.width = w;
        win.height = containerHeight;
        win.restoreRect = { x: win.x, y: win.y, width: win.width, height: win.height };
        win.zIndex = nextZIndex++;
      }
    }
  }

  // ── Başlangıç pencerelerini ekle ────────────────────

  if (props.windows) {
    for (const w of props.windows) {
      addWindow(w);
    }
  }

  // ── Event handler ───────────────────────────────────

  function send(event: MDIEvent): void {
    switch (event.type) {
      case 'ADD_WINDOW': {
        addWindow(event.window);
        break;
      }

      case 'REMOVE_WINDOW':
      case 'CLOSE_WINDOW': {
        removeWindow(event.id);
        break;
      }

      case 'ACTIVATE_WINDOW': {
        if (windows.has(event.id)) {
          bringToFront(event.id);
        }
        break;
      }

      case 'MINIMIZE_WINDOW': {
        const win = windows.get(event.id);
        if (!win) break;
        if (win.state === 'normal') {
          win.restoreRect = { x: win.x, y: win.y, width: win.width, height: win.height };
        }
        win.state = 'minimized';
        win.active = false;

        // Başka pencere aktif yap
        if (activeWindowId === event.id) {
          activeWindowId = null;
          let maxZ = -1;
          for (const w of windows.values()) {
            if (w.id !== event.id && w.state !== 'minimized' && w.zIndex > maxZ) {
              maxZ = w.zIndex;
              activeWindowId = w.id;
            }
          }
          if (activeWindowId) {
            const next = windows.get(activeWindowId);
            if (next) next.active = true;
          }
        }
        break;
      }

      case 'MAXIMIZE_WINDOW': {
        const win = windows.get(event.id);
        if (!win) break;
        if (win.state === 'normal') {
          win.restoreRect = { x: win.x, y: win.y, width: win.width, height: win.height };
        }
        win.state = 'maximized';
        win.x = 0;
        win.y = 0;
        win.width = containerWidth;
        win.height = containerHeight;
        bringToFront(event.id);
        break;
      }

      case 'RESTORE_WINDOW': {
        const win = windows.get(event.id);
        if (!win) break;
        win.state = 'normal';
        win.x = win.restoreRect.x;
        win.y = win.restoreRect.y;
        win.width = win.restoreRect.width;
        win.height = win.restoreRect.height;
        bringToFront(event.id);
        break;
      }

      case 'MOVE_WINDOW': {
        const win = windows.get(event.id);
        if (!win || win.state === 'maximized') break;
        win.x = event.x;
        win.y = event.y;
        if (win.state === 'normal') {
          win.restoreRect.x = event.x;
          win.restoreRect.y = event.y;
        }
        break;
      }

      case 'RESIZE_WINDOW': {
        const win = windows.get(event.id);
        if (!win || win.state === 'maximized') break;
        win.width = Math.max(100, event.width);
        win.height = Math.max(50, event.height);
        if (win.state === 'normal') {
          win.restoreRect.width = win.width;
          win.restoreRect.height = win.height;
        }
        break;
      }

      case 'SET_TITLE': {
        const win = windows.get(event.id);
        if (win) win.title = event.title;
        break;
      }

      case 'ARRANGE': {
        if (event.arrangement === 'cascade') {
          arrangeCascade();
        } else {
          arrangeTile(event.arrangement);
        }
        break;
      }

      case 'SET_CONTAINER_SIZE': {
        containerWidth = event.width;
        containerHeight = event.height;
        // Maximized pencereleri güncelle
        for (const win of windows.values()) {
          if (win.state === 'maximized') {
            win.width = containerWidth;
            win.height = containerHeight;
          }
        }
        break;
      }

      case 'MINIMIZE_ALL': {
        for (const win of windows.values()) {
          if (win.state !== 'minimized') {
            if (win.state === 'normal') {
              win.restoreRect = { x: win.x, y: win.y, width: win.width, height: win.height };
            }
            win.state = 'minimized';
            win.active = false;
          }
        }
        activeWindowId = null;
        break;
      }

      case 'RESTORE_ALL': {
        for (const win of windows.values()) {
          if (win.state === 'minimized') {
            win.state = 'normal';
            win.x = win.restoreRect.x;
            win.y = win.restoreRect.y;
            win.width = win.restoreRect.width;
            win.height = win.restoreRect.height;
          }
        }
        break;
      }

      case 'CLOSE_ALL': {
        windows.clear();
        activeWindowId = null;
        break;
      }
    }
  }

  // ── API ─────────────────────────────────────────────

  function copyWindow(w: MDIWindowInfo): MDIWindowInfo {
    return { ...w, restoreRect: { ...w.restoreRect } };
  }

  return {
    getWindow: (id) => {
      const w = windows.get(id);
      return w ? copyWindow(w) : undefined;
    },
    getWindows: () =>
      Array.from(windows.values())
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(copyWindow),
    getActiveWindow: () => {
      if (!activeWindowId) return undefined;
      const w = windows.get(activeWindowId);
      return w ? copyWindow(w) : undefined;
    },
    getActiveWindowId: () => activeWindowId,
    getWindowCount: () => windows.size,
    getContainerSize: () => ({ width: containerWidth, height: containerHeight }),
    send,
  };
}
