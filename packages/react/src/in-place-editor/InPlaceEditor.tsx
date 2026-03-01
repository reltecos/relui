/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * InPlaceEditor — styled React in-place editing component.
 * InPlaceEditor — stilize edilmiş React yerinde düzenleme bileşeni.
 *
 * Metin görüntüler, tıklayınca input'a dönüşür. Enter kaydeder, Escape iptal eder.
 *
 * @packageDocumentation
 */

import { forwardRef, useRef, useEffect, type KeyboardEvent, type ReactNode } from 'react';
import type { InputVariant, InputSize } from '@relteco/relui-core';
import { CheckIcon, CloseIcon } from '@relteco/relui-icons';
import { inputRecipe } from '../input/input.css';
import {
  inPlaceEditorRootStyle,
  inPlaceEditorDisplayStyle,
  inPlaceEditorPlaceholderStyle,
  inPlaceEditorActionsStyle,
} from './in-place-editor.css';
import { useInPlaceEditor, type UseInPlaceEditorProps } from './useInPlaceEditor';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** InPlaceEditor slot isimleri. */
export type InPlaceEditorSlot =
  | 'root'
  | 'display'
  | 'input'
  | 'actions'
  | 'confirmButton'
  | 'cancelButton';

/**
 * InPlaceEditor bileşen props'ları.
 * InPlaceEditor component props.
 */
export interface InPlaceEditorComponentProps
  extends UseInPlaceEditorProps,
    SlotStyleProps<InPlaceEditorSlot> {
  /** Görsel varyant / Visual variant */
  variant?: InputVariant;

  /** Boyut / Size */
  size?: InputSize;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /**
   * Aksiyon butonlarını göster / Show action buttons (confirm/cancel).
   *
   * @default true
   */
  showActions?: boolean;

  /** Onay ikonu / Confirm icon */
  confirmIcon?: ReactNode;

  /** İptal ikonu / Cancel icon */
  cancelIcon?: ReactNode;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** aria-label */
  'aria-label'?: string;
}

/**
 * InPlaceEditor — RelUI yerinde düzenleme bileşeni.
 * InPlaceEditor — RelUI in-place editing component.
 *
 * @example
 * ```tsx
 * <InPlaceEditor defaultValue="Merhaba" />
 *
 * <InPlaceEditor
 *   value={name}
 *   onValueChange={setName}
 *   variant="filled"
 *   size="lg"
 *   placeholder="İsim girin"
 * />
 *
 * <InPlaceEditor
 *   defaultValue="Düzenle"
 *   activationMode="doubleClick"
 *   submitOnBlur={false}
 *   showActions
 * />
 * ```
 */
export const InPlaceEditor = forwardRef<HTMLInputElement, InPlaceEditorComponentProps>(
  function InPlaceEditor(
    {
      variant = 'outline',
      size = 'md',
      placeholder,
      showActions = true,
      confirmIcon,
      cancelIcon,
      className,
      id,
      style: inlineStyle,
      classNames,
      styles,
      'aria-label': ariaLabel,
      ...hookProps
    },
    forwardedRef,
  ) {
    const {
      state,
      value,
      editValue,
      startEdit,
      confirm,
      cancel,
      setEditValue,
      isDisabled,
      isReadOnly,
      activationMode,
      submitOnBlur,
      selectOnEdit,
    } = useInPlaceEditor(hookProps);

    const inputRef = useRef<HTMLInputElement | null>(null);

    // Edit moduna girince input'a focus ver
    useEffect(() => {
      if (state === 'editing' && inputRef.current) {
        inputRef.current.focus();
        if (selectOnEdit) {
          inputRef.current.select();
        }
      }
    }, [state, selectOnEdit]);

    // Ref merge (forwardedRef + internal ref)
    const setInputRef = (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef) {
        forwardedRef.current = el;
      }
    };

    // ── Slot props ────────────────────────────────────
    const rootSlot = getSlotProps('root', inPlaceEditorRootStyle, classNames, styles, inlineStyle);
    const combinedRootClass = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const displaySlot = getSlotProps(
      'display',
      inPlaceEditorDisplayStyle,
      classNames,
      styles,
    );

    const recipeClass = inputRecipe({ variant, size });
    const inputSlot = getSlotProps('input', recipeClass, classNames, styles, {
      width: '100%',
    });

    const actionsSlot = getSlotProps('actions', inPlaceEditorActionsStyle, classNames, styles);
    const confirmSlot = getSlotProps('confirmButton', undefined, classNames, styles);
    const cancelSlot = getSlotProps('cancelButton', undefined, classNames, styles);

    // ── Display element handlers ─────────────────────
    const handleDisplayClick = () => {
      if (activationMode === 'click') startEdit();
    };

    const handleDisplayDoubleClick = () => {
      if (activationMode === 'doubleClick') startEdit();
    };

    const handleDisplayKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startEdit();
      }
    };

    // ── Input element handlers ───────────────────────
    const handleInputKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirm();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    };

    const handleInputBlur = () => {
      if (submitOnBlur) {
        confirm();
      }
    };

    // ── Render ───────────────────────────────────────
    const isEditing = state === 'editing';

    const displayText = value || undefined;
    const showPlaceholder = !displayText;

    const currentConfirmIcon = confirmIcon ?? <CheckIcon size="0.875em" />;
    const currentCancelIcon = cancelIcon ?? <CloseIcon size="0.875em" />;

    return (
      <div
        id={id}
        className={combinedRootClass}
        style={rootSlot.style}
        data-state={state}
      >
        {isEditing ? (
          <>
            <input
              ref={setInputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onBlur={showActions && !submitOnBlur ? undefined : handleInputBlur}
              className={inputSlot.className}
              style={inputSlot.style}
              disabled={isDisabled}
              readOnly={isReadOnly}
              placeholder={placeholder}
              aria-label={ariaLabel}
              data-state={state}
            />

            {showActions && (
              <div
                className={actionsSlot.className}
                style={actionsSlot.style}
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={confirm}
                  className={confirmSlot.className || undefined}
                  style={confirmSlot.style}
                  aria-label="Onayla"
                  tabIndex={-1}
                >
                  {currentConfirmIcon}
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={cancel}
                  className={cancelSlot.className || undefined}
                  style={cancelSlot.style}
                  aria-label="İptal"
                  tabIndex={-1}
                >
                  {currentCancelIcon}
                </button>
              </div>
            )}
          </>
        ) : (
          <span
            {...(isDisabled ? { 'data-disabled': '' } : {})}
            {...(isReadOnly ? { 'data-readonly': '' } : {})}
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            onClick={handleDisplayClick}
            onDoubleClick={handleDisplayDoubleClick}
            onKeyDown={handleDisplayKeyDown}
            className={displaySlot.className}
            style={displaySlot.style}
            data-state={state}
            aria-label={ariaLabel}
          >
            {showPlaceholder ? (
              <span className={inPlaceEditorPlaceholderStyle}>
                {placeholder || '\u00A0'}
              </span>
            ) : (
              displayText
            )}
          </span>
        )}
      </div>
    );
  },
);
