/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FileDrop state machine.
 *
 * @packageDocumentation
 */

import type {
  FileDropConfig,
  FileDropContext,
  FileDropEvent,
  FileDropItem,
  FileDropAPI,
} from './file-drop.types';

/**
 * Accept string'ini parse ederek dosya tipini kontrol eder.
 * Validates a file against the accept string.
 */
function isAccepted(
  fileName: string,
  fileType: string,
  accept: string | undefined,
): boolean {
  if (!accept) return true;

  const parts = accept.split(',').map((s) => s.trim());
  for (const part of parts) {
    // Wildcard MIME type check: "image/*"
    if (part.endsWith('/*')) {
      const prefix = part.slice(0, -2); // e.g. "image"
      if (fileType.startsWith(`${prefix}/`)) return true;
    }
    // Extension check: ".pdf"
    else if (part.startsWith('.')) {
      if (fileName.toLowerCase().endsWith(part.toLowerCase())) return true;
    }
    // Exact MIME type check: "application/pdf"
    else if (fileType === part) {
      return true;
    }
  }

  return false;
}

/**
 * FileDrop state machine olusturur.
 * Creates a file drop state machine.
 */
export function createFileDrop(config: FileDropConfig = {}): FileDropAPI {
  const {
    maxFiles = Infinity,
    maxSize = Infinity,
    accept,
    multiple = true,
    onFilesChange,
    onError,
  } = config;

  // ── State ──
  let files: FileDropItem[] = [];
  let isDragging = false;

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  function notifyFilesChange(): void {
    onFilesChange?.([...files]);
  }

  // ── Send ──
  function send(event: FileDropEvent): void {
    switch (event.type) {
      case 'ADD_FILES': {
        const incoming = event.files;
        const validFiles: FileDropItem[] = [];
        const errors: string[] = [];

        // multiple=false ise sadece ilk dosyayi al
        const filesToProcess = multiple ? incoming : incoming.slice(0, 1);

        for (const f of filesToProcess) {
          // maxSize kontrolu
          if (f.size > maxSize) {
            errors.push(`"${f.name}" dosyasi cok buyuk (max ${maxSize} byte)`);
            continue;
          }

          // accept kontrolu
          if (!isAccepted(f.name, f.type, accept)) {
            errors.push(`"${f.name}" dosya tipi kabul edilmiyor`);
            continue;
          }

          validFiles.push({
            id: f.id,
            name: f.name,
            size: f.size,
            type: f.type,
            status: 'pending',
            progress: 0,
          });
        }

        // maxFiles kontrolu
        const totalAfterAdd = files.length + validFiles.length;
        if (totalAfterAdd > maxFiles) {
          const allowable = maxFiles - files.length;
          if (allowable <= 0) {
            errors.push(`Maksimum dosya sayisina ulasildi (max ${maxFiles})`);
            validFiles.length = 0;
          } else {
            const rejected = validFiles.splice(allowable);
            for (const r of rejected) {
              errors.push(`"${r.name}" eklenemedi: maksimum dosya sayisina ulasildi`);
            }
          }
        }

        // Hatalari bildir
        for (const err of errors) {
          onError?.(err);
        }

        if (validFiles.length > 0) {
          // multiple=false ise mevcut dosyalari temizle
          if (!multiple) {
            files = validFiles;
          } else {
            files = [...files, ...validFiles];
          }
          notifyFilesChange();
          notify();
        }
        break;
      }

      case 'REMOVE_FILE': {
        const idx = files.findIndex((f) => f.id === event.id);
        if (idx === -1) return;
        files = files.filter((f) => f.id !== event.id);
        notifyFilesChange();
        notify();
        break;
      }

      case 'SET_PROGRESS': {
        const idx = files.findIndex((f) => f.id === event.id);
        if (idx === -1) return;
        const clamped = Math.max(0, Math.min(100, event.progress));
        files = files.map((f) =>
          f.id === event.id ? { ...f, progress: clamped } : f,
        );
        notify();
        break;
      }

      case 'SET_STATUS': {
        const idx = files.findIndex((f) => f.id === event.id);
        if (idx === -1) return;
        files = files.map((f) =>
          f.id === event.id
            ? { ...f, status: event.status, error: event.error }
            : f,
        );
        notify();
        break;
      }

      case 'SET_DRAGGING': {
        isDragging = event.isDragging;
        notify();
        break;
      }

      case 'CLEAR': {
        if (files.length === 0) return;
        files = [];
        notifyFilesChange();
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): FileDropContext {
      return {
        files,
        isDragging,
        totalSize: files.reduce((sum, f) => sum + f.size, 0),
        fileCount: files.length,
      };
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    destroy(): void {
      listeners.clear();
    },
  };
}
