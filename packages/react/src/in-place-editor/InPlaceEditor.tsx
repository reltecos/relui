/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * InPlaceEditor — styled React in-place editing bilesen (Dual API).
 * InPlaceEditor — styled React in-place editing component (Dual API).
 *
 * Props-based: `<InPlaceEditor defaultValue="Merhaba" />`
 * Compound:    `<InPlaceEditor defaultValue="Merhaba"><InPlaceEditor.Display>...</InPlaceEditor.Display>...</InPlaceEditor>`
 *
 * Metin goruntular, tiklayinca input a donusur. Enter kaydeder, Escape iptal eder.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useRef, useEffect, type KeyboardEvent, type ReactNode } from 'react';
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
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** InPlaceEditor slot isimleri. */
export type InPlaceEditorSlot =
  | 'root'
  | 'display'
  | 'input'
  | 'actions'
  | 'confirmButton'
  | 'cancelButton';

// ── Context (Compound API) ──────────────────────────

interface InPlaceEditorContextValue {
  classNames: ClassNames<InPlaceEditorSlot> | undefined;
  styles: Styles<InPlaceEditorSlot> | undefined;
  state: 'reading' | 'editing';
  variant: InputVariant;
  size: InputSize;
}

const InPlaceEditorContext = createContext<InPlaceEditorContextValue | null>(null);

function useInPlaceEditorContext(): InPlaceEditorContextValue {
  const ctx = useContext(InPlaceEditorContext);
  if (!ctx) throw new Error('InPlaceEditor compound sub-components must be used within <InPlaceEditor>.');
  return ctx;
}

// ── Compound: InPlaceEditor.Display ─────────────────

/** InPlaceEditor.Display props */
export interface InPlaceEditorDisplayProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const InPlaceEditorDisplay = forwardRef<HTMLSpanElement, InPlaceEditorDisplayProps>(
  function InPlaceEditorDisplay(props, ref) {
    const { children, className } = props;
    const ctx = useInPlaceEditorContext();
    const slot = getSlotProps('display', inPlaceEditorDisplayStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="in-place-editor-display"
        data-state={ctx.state}
      >
        {children}
      </span>
    );
  },
);

// ── Compound: InPlaceEditor.Input ───────────────────

/** InPlaceEditor.Input props */
export interface InPlaceEditorInputProps {
  /** Icerik / Content (opsiyonel) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const InPlaceEditorInput = forwardRef<HTMLDivElement, InPlaceEditorInputProps>(
  function InPlaceEditorInput(props, ref) {
    const { children, className } = props;
    const ctx = useInPlaceEditorContext();
    const recipeClass = inputRecipe({ variant: ctx.variant, size: ctx.size });
    const slot = getSlotProps('input', recipeClass, ctx.classNames, ctx.styles, {
      width: '100%',
    });
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="in-place-editor-input"
        data-state={ctx.state}
      >
        {children}
      </div>
    );
  },
);

// ── Compound: InPlaceEditor.Actions ─────────────────

/** InPlaceEditor.Actions props */
export interface InPlaceEditorActionsProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const InPlaceEditorActions = forwardRef<HTMLDivElement, InPlaceEditorActionsProps>(
  function InPlaceEditorActions(props, ref) {
    const { children, className } = props;
    const ctx = useInPlaceEditorContext();
    const slot = getSlotProps('actions', inPlaceEditorActionsStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="in-place-editor-actions"
      >
        {children}
      </div>
    );
  },
);

/**
 * InPlaceEditor bilesen props lari.
 * InPlaceEditor component props.
 */
export interface InPlaceEditorComponentProps
  extends UseInPlaceEditorProps,
    SlotStyleProps<InPlaceEditorSlot> {
  /** Gorsel varyant / Visual variant */
  variant?: InputVariant;

  /** Boyut / Size */
  size?: InputSize;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /**
   * Aksiyon butonlarini goster / Show action buttons (confirm/cancel).
   *
   * @default true
   */
  showActions?: boolean;

  /** Onay ikonu / Confirm icon */
  confirmIcon?: ReactNode;

  /** Iptal ikonu / Cancel icon */
  cancelIcon?: ReactNode;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;

  /** Ek CSS sinifi / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** aria-label */
  'aria-label'?: string;
}

/**
 * InPlaceEditor — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <InPlaceEditor defaultValue="Merhaba" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <InPlaceEditor defaultValue="Merhaba">
 *   <InPlaceEditor.Display>Ozel gorunum</InPlaceEditor.Display>
 *   <InPlaceEditor.Input />
 *   <InPlaceEditor.Actions>
 *     <button>Kaydet</button>
 *     <button>Iptal</button>
 *   </InPlaceEditor.Actions>
 * </InPlaceEditor>
 * ```
 */
const InPlaceEditorBase = forwardRef<HTMLInputElement, InPlaceEditorComponentProps>(
  function InPlaceEditor(
    {
      variant = 'outline',
      size = 'md',
      placeholder,
      showActions = true,
      confirmIcon,
      cancelIcon,
      children,
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

    // Edit moduna girince input a focus ver
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

    const ctxValue: InPlaceEditorContextValue = {
      classNames,
      styles,
      state,
      variant,
      size,
    };

    // ── Compound API ──
    if (children) {
      return (
        <InPlaceEditorContext.Provider value={ctxValue}>
          <div
            id={id}
            className={combinedRootClass}
            style={rootSlot.style}
            data-state={state}
            data-testid="in-place-editor-root"
          >
            {children}
          </div>
        </InPlaceEditorContext.Provider>
      );
    }

    // ── Props-based API ──
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

/**
 * InPlaceEditor bilesen — Dual API (props-based + compound).
 */
export const InPlaceEditor = Object.assign(InPlaceEditorBase, {
  Display: InPlaceEditorDisplay,
  Input: InPlaceEditorInput,
  Actions: InPlaceEditorActions,
});
