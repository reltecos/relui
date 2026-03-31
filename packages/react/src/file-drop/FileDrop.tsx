/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FileDrop — dosya surukle-birak bilesen (Dual API).
 * FileDrop — file drag-and-drop component (Dual API).
 *
 * Props-based: `<FileDrop maxFiles={3} accept="image/*" onFilesChange={handleChange} />`
 * Compound:    `<FileDrop><FileDrop.Zone /><FileDrop.FileList /></FileDrop>`
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  useRef,
  type ReactNode,
  type KeyboardEvent,
  type DragEvent,
  type ChangeEvent,
} from 'react';
import type { FileDropItem } from '@relteco/relui-core';
import { UploadIcon, CloseIcon } from '@relteco/relui-icons';
import {
  rootStyle,
  zoneStyle,
  zoneDraggingStyle,
  zoneTextStyle,
  zoneIconStyle,
  fileListStyle,
  fileItemStyle,
  fileNameStyle,
  fileSizeStyle,
  removeButtonStyle,
  progressBarContainerStyle,
  progressBarFillStyle,
} from './file-drop.css';
import { useFileDrop, processNativeFiles } from './useFileDrop';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** FileDrop slot isimleri / FileDrop slot names. */
export type FileDropSlot =
  | 'root'
  | 'zone'
  | 'fileList'
  | 'fileItem'
  | 'fileName'
  | 'fileSize'
  | 'removeButton'
  | 'progressBar';

// ── Context (Compound API) ──────────────────────────

interface FileDropContextValue {
  files: readonly FileDropItem[];
  isDragging: boolean;
  totalSize: number;
  fileCount: number;
  maxFiles: number;
  maxSize: number;
  accept: string | undefined;
  multiple: boolean;
  disabled: boolean;
  addFiles: (files: Array<{ id: string; name: string; size: number; type: string }>) => void;
  removeFile: (id: string) => void;
  setDragging: (isDragging: boolean) => void;
  clear: () => void;
  classNames: ClassNames<FileDropSlot> | undefined;
  styles: Styles<FileDropSlot> | undefined;
}

const FileDropContext = createContext<FileDropContextValue | null>(null);

function useFileDropContext(): FileDropContextValue {
  const ctx = useContext(FileDropContext);
  if (!ctx) throw new Error('FileDrop compound sub-components must be used within <FileDrop>.');
  return ctx;
}

// ── Helpers ─────────────────────────────────────────

/**
 * Dosya boyutunu okunabilir formata cevirir.
 * Formats file size to human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value % 1 === 0 ? value : value.toFixed(1)} ${units[i]}`;
}

// ── Compound: FileDrop.Zone ─────────────────────────

/** FileDrop.Zone props */
export interface FileDropZoneProps {
  /** Ozel icerik / Custom content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const FileDropZone = forwardRef<HTMLDivElement, FileDropZoneProps>(
  function FileDropZone(props, ref) {
    const { children, className } = props;
    const ctx = useFileDropContext();
    const inputRef = useRef<HTMLInputElement>(null);

    const zoneCls = ctx.isDragging
      ? `${zoneStyle} ${zoneDraggingStyle}`
      : zoneStyle;
    const slot = getSlotProps('zone', zoneCls, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!ctx.disabled) {
        ctx.setDragging(true);
      }
    };

    const handleDragLeave = (_e: DragEvent<HTMLDivElement>) => {
      ctx.setDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      ctx.setDragging(false);
      if (ctx.disabled) return;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const processed = processNativeFiles(e.dataTransfer.files);
        ctx.addFiles(processed);
      }
    };

    const handleClick = () => {
      if (ctx.disabled) return;
      inputRef.current?.click();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const processed = processNativeFiles(e.target.files);
        ctx.addFiles(processed);
        // Reset input value so same file can be selected again
        e.target.value = '';
      }
    };

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Drop files here"
        data-testid="file-drop-zone"
      >
        <input
          ref={inputRef}
          type="file"
          accept={ctx.accept}
          multiple={ctx.multiple}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          tabIndex={-1}
          data-testid="file-drop-input"
        />
        {children || (
          <>
            <span className={zoneIconStyle}>
              <UploadIcon size={24} />
            </span>
            <p className={zoneTextStyle}>Dosyalari surukleyin veya tiklayin</p>
          </>
        )}
      </div>
    );
  },
);

// ── Compound: FileDrop.FileList ──────────────────────

/** FileDrop.FileList props */
export interface FileDropFileListProps {
  /** Ek className / Additional className */
  className?: string;
  /** Ozel icerik / Custom children */
  children?: ReactNode;
}

const FileDropFileList = forwardRef<HTMLDivElement, FileDropFileListProps>(
  function FileDropFileList(props, ref) {
    const { className, children } = props;
    const ctx = useFileDropContext();
    const slot = getSlotProps('fileList', fileListStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    if (ctx.files.length === 0 && !children) return null;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        role="list"
        data-testid="file-drop-fileList"
      >
        {children ||
          ctx.files.map((file) => (
            <FileDropFileItem key={file.id} fileId={file.id} />
          ))}
      </div>
    );
  },
);

// ── Compound: FileDrop.FileItem ─────────────────────

/** FileDrop.FileItem props */
export interface FileDropFileItemProps {
  /** Dosya id'si / File ID */
  fileId: string;
  /** Ek className / Additional className */
  className?: string;
}

const FileDropFileItem = forwardRef<HTMLDivElement, FileDropFileItemProps>(
  function FileDropFileItem(props, ref) {
    const { fileId, className } = props;
    const ctx = useFileDropContext();
    const file = ctx.files.find((f) => f.id === fileId);
    if (!file) return null;

    const itemSlot = getSlotProps('fileItem', fileItemStyle, ctx.classNames, ctx.styles);
    const nameSlot = getSlotProps('fileName', fileNameStyle, ctx.classNames, ctx.styles);
    const sizeSlot = getSlotProps('fileSize', fileSizeStyle, ctx.classNames, ctx.styles);
    const removeBtnSlot = getSlotProps('removeButton', removeButtonStyle, ctx.classNames, ctx.styles);

    const itemCls = className
      ? `${itemSlot.className} ${className}`
      : itemSlot.className;

    return (
      <div
        ref={ref}
        className={itemCls}
        style={itemSlot.style}
        role="listitem"
        data-testid="file-drop-fileItem"
      >
        <span
          className={nameSlot.className}
          style={nameSlot.style}
          data-testid="file-drop-fileName"
        >
          {file.name}
        </span>
        <span
          className={sizeSlot.className}
          style={sizeSlot.style}
          data-testid="file-drop-fileSize"
        >
          {formatFileSize(file.size)}
        </span>
        <button
          type="button"
          className={removeBtnSlot.className}
          style={removeBtnSlot.style}
          onClick={(e) => {
            e.stopPropagation();
            ctx.removeFile(file.id);
          }}
          aria-label={`Remove ${file.name}`}
          data-testid="file-drop-removeButton"
        >
          <CloseIcon size={14} />
        </button>
        {file.status === 'uploading' && (
          <FileDropProgressBar fileId={file.id} />
        )}
      </div>
    );
  },
);

// ── Compound: FileDrop.ProgressBar ──────────────────

/** FileDrop.ProgressBar props */
export interface FileDropProgressBarProps {
  /** Dosya id'si / File ID */
  fileId: string;
  /** Ek className / Additional className */
  className?: string;
}

const FileDropProgressBar = forwardRef<HTMLDivElement, FileDropProgressBarProps>(
  function FileDropProgressBar(props, ref) {
    const { fileId, className } = props;
    const ctx = useFileDropContext();
    const file = ctx.files.find((f) => f.id === fileId);
    if (!file) return null;

    const slot = getSlotProps('progressBar', progressBarContainerStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        role="progressbar"
        aria-valuenow={file.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        data-testid="file-drop-progressBar"
      >
        <div
          className={progressBarFillStyle}
          style={{ width: `${file.progress}%` }}
        />
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface FileDropComponentProps extends SlotStyleProps<FileDropSlot> {
  /** Maksimum dosya sayisi / Maximum number of files */
  maxFiles?: number;
  /** Maksimum dosya boyutu (byte) / Maximum file size in bytes */
  maxSize?: number;
  /** Kabul edilen dosya tipleri / Accepted file types */
  accept?: string;
  /** Birden fazla dosya secimi / Allow multiple files */
  multiple?: boolean;
  /** Dosyalar degistiginde callback / On files change */
  onFilesChange?: (files: FileDropItem[]) => void;
  /** Hata oldugunda callback / On error */
  onError?: (error: string) => void;
  /** Devre disi / Disabled */
  disabled?: boolean;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const FileDropBase = forwardRef<HTMLDivElement, FileDropComponentProps>(
  function FileDrop(props, ref) {
    const {
      maxFiles = Infinity,
      maxSize = Infinity,
      accept,
      multiple = true,
      onFilesChange,
      onError,
      disabled = false,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hook = useFileDrop({
      maxFiles,
      maxSize,
      accept,
      multiple,
      onFilesChange,
      onError,
    });

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: FileDropContextValue = {
      files: hook.files,
      isDragging: hook.isDragging,
      totalSize: hook.totalSize,
      fileCount: hook.fileCount,
      maxFiles,
      maxSize,
      accept,
      multiple,
      disabled,
      addFiles: hook.addFiles,
      removeFile: hook.removeFile,
      setDragging: hook.setDragging,
      clear: hook.clear,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <FileDropContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="file-drop-root"
          >
            {children}
          </div>
        </FileDropContext.Provider>
      );
    }

    // ── Props-based API ──
    return (
      <FileDropContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="file-drop-root"
        >
          <FileDropZone />
          <FileDropFileList />
        </div>
      </FileDropContext.Provider>
    );
  },
);

/**
 * FileDrop bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <FileDrop maxFiles={5} accept="image/*" onFilesChange={handleChange} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <FileDrop>
 *   <FileDrop.Zone />
 *   <FileDrop.FileList />
 * </FileDrop>
 * ```
 */
export const FileDrop = Object.assign(FileDropBase, {
  Zone: FileDropZone,
  FileList: FileDropFileList,
  FileItem: FileDropFileItem,
  ProgressBar: FileDropProgressBar,
});
