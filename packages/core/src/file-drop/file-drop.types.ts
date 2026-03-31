/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FileDrop tipleri.
 * FileDrop types.
 *
 * @packageDocumentation
 */

// ── Status ──────────────────────────────────────────

/** Dosya durumu / File status */
export type FileDropStatus = 'pending' | 'uploading' | 'completed' | 'error';

// ── Item ────────────────────────────────────────────

/** Tekil dosya ogesi / Single file item */
export interface FileDropItem {
  /** Benzersiz kimlik / Unique identifier */
  readonly id: string;
  /** Dosya adi / File name */
  readonly name: string;
  /** Dosya boyutu (byte) / File size in bytes */
  readonly size: number;
  /** MIME tipi / MIME type */
  readonly type: string;
  /** Dosya durumu / File status */
  readonly status: FileDropStatus;
  /** Yukleme ilerlemesi (0-100) / Upload progress (0-100) */
  readonly progress: number;
  /** Hata mesaji / Error message */
  readonly error?: string;
}

// ── Events ──────────────────────────────────────────

/** FileDrop event'leri / FileDrop events */
export type FileDropEvent =
  | { type: 'ADD_FILES'; files: Array<{ id: string; name: string; size: number; type: string }> }
  | { type: 'REMOVE_FILE'; id: string }
  | { type: 'SET_PROGRESS'; id: string; progress: number }
  | { type: 'SET_STATUS'; id: string; status: FileDropStatus; error?: string }
  | { type: 'SET_DRAGGING'; isDragging: boolean }
  | { type: 'CLEAR' };

// ── Context ─────────────────────────────────────────

/** FileDrop state / FileDrop context */
export interface FileDropContext {
  /** Dosya listesi / File list */
  readonly files: readonly FileDropItem[];
  /** Surukleme durumu / Dragging state */
  readonly isDragging: boolean;
  /** Toplam dosya boyutu (byte) / Total file size in bytes */
  readonly totalSize: number;
  /** Dosya sayisi / File count */
  readonly fileCount: number;
}

// ── Config ──────────────────────────────────────────

/** FileDrop yapilandirmasi / FileDrop configuration */
export interface FileDropConfig {
  /** Maksimum dosya sayisi / Maximum number of files */
  maxFiles?: number;
  /** Maksimum dosya boyutu (byte) / Maximum file size in bytes */
  maxSize?: number;
  /** Kabul edilen dosya tipleri (orn. "image/*,.pdf") / Accepted file types */
  accept?: string;
  /** Birden fazla dosya secimi / Allow multiple file selection */
  multiple?: boolean;
  /** Dosyalar degistiginde callback / On files change callback */
  onFilesChange?: (files: FileDropItem[]) => void;
  /** Hata oldugunda callback / On error callback */
  onError?: (error: string) => void;
}

// ── API ─────────────────────────────────────────────

/** FileDrop API / FileDrop API */
export interface FileDropAPI {
  /** Guncel context / Get current context */
  getContext(): FileDropContext;
  /** Event gonder / Send event */
  send(event: FileDropEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizle ve dinleyicileri kaldir / Cleanup and remove listeners */
  destroy(): void;
}
