/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @relteco/relui-core
 *
 * Framework-agnostic headless UI state machines and logic.
 * Tüm framework binding'lerinin temel aldığı saf TypeScript core katmanı.
 *
 * @packageDocumentation
 */

export const RELUI_CORE_VERSION = '0.1.0';

// ── Button ──────────────────────────────────────────
export {
  createButton,
  shouldTriggerClick,
  shouldTriggerClickOnKeyUp,
} from './button';
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  ButtonColor,
  ButtonInteractionState,
  ButtonElementType,
  ButtonMachineContext,
  ButtonEvent,
  ButtonDOMProps,
  ButtonAPI,
} from './button';

// ── IconButton ───────────────────────────────────────
export type { IconButtonProps } from './icon-button';

// ── ButtonGroup ──────────────────────────────────────
export type {
  ButtonGroupProps,
  ButtonGroupOrientation,
  ButtonGroupContext,
} from './button-group';

// ── Input ────────────────────────────────────────────
export { createInput } from './input';
export type {
  InputProps,
  InputVariant,
  InputSize,
  InputInteractionState,
  InputType,
  InputMachineContext,
  InputEvent,
  InputDOMProps,
  InputAPI,
} from './input';

// ── Textarea ─────────────────────────────────────────
export { createTextarea } from './textarea';
export type {
  TextareaProps,
  TextareaVariant,
  TextareaSize,
  TextareaInteractionState,
  TextareaResize,
  TextareaMachineContext,
  TextareaEvent,
  TextareaDOMProps,
  TextareaAPI,
} from './textarea';

// ── Checkbox ─────────────────────────────────────────
export { createCheckbox } from './checkbox';
export type {
  CheckboxProps,
  CheckboxSize,
  CheckboxColor,
  CheckboxInteractionState,
  CheckboxCheckedState,
  CheckboxMachineContext,
  CheckboxEvent,
  CheckboxDOMProps,
  CheckboxAPI,
} from './checkbox';

// ── Radio ────────────────────────────────────────────
export { createRadio } from './radio';
export type {
  RadioProps,
  RadioSize,
  RadioColor,
  RadioInteractionState,
  RadioMachineContext,
  RadioEvent,
  RadioDOMProps,
  RadioAPI,
} from './radio';

// ── RadioGroup ───────────────────────────────────────
export type {
  RadioGroupProps,
  RadioGroupOrientation,
  RadioGroupContext,
} from './radio-group';

// ── Switch ──────────────────────────────────────────
export { createSwitch } from './switch';
export type {
  SwitchProps,
  SwitchSize,
  SwitchColor,
  SwitchInteractionState,
  SwitchMachineContext,
  SwitchEvent,
  SwitchDOMProps,
  SwitchAPI,
} from './switch';

// ── Slider ──────────────────────────────────────────
export { createSlider, getPercent } from './slider';
export type {
  SliderProps,
  SliderSize,
  SliderColor,
  SliderOrientation,
  SliderInteractionState,
  SliderMachineContext,
  SliderEvent,
  SliderThumbDOMProps,
  SliderTrackDOMProps,
  SliderAPI,
} from './slider';

// ── RangeSlider ────────────────────────────────────
export { createRangeSlider } from './range-slider';
export type {
  RangeSliderProps,
  RangeSliderThumb,
  RangeSliderMachineContext,
  RangeSliderEvent,
  RangeSliderThumbDOMProps,
  RangeSliderTrackDOMProps,
  RangeSliderAPI,
} from './range-slider';

// ── Label ──────────────────────────────────────────
export type { LabelProps, LabelSize } from './label';

// ── FormField ──────────────────────────────────────
export { createFormFieldIds } from './form-field';
export type { FormFieldProps, FormFieldContext } from './form-field';

// ── FormGroup ──────────────────────────────────────
export type { FormGroupProps, FormGroupOrientation } from './form-group';

// ── Badge ──────────────────────────────────────────
export type { BadgeProps, BadgeSize, BadgeColor, BadgeVariant } from './badge';

// ── Tag ────────────────────────────────────────────
export type { TagProps, TagSize, TagColor, TagVariant } from './tag';

// ── Chip ───────────────────────────────────────────
export type { ChipProps, ChipSize, ChipColor, ChipVariant } from './chip';

// ── NumberInput ─────────────────────────────────────
export { createNumberInput } from './number-input';
export type {
  NumberInputProps,
  NumberInputVariant,
  NumberInputSize,
  NumberInputInteractionState,
  NumberInputMachineContext,
  NumberInputEvent,
  NumberInputRootDOMProps,
  NumberInputDOMProps,
  NumberInputStepperDOMProps,
  NumberInputAPI,
} from './number-input';

// ── MaskedInput ─────────────────────────────────────
export {
  createMaskedInput,
  parseMask,
  applyMask,
  stripMask,
  filterRawValue,
  isComplete,
  getNextEditableIndex,
  MASK_PRESETS,
} from './masked-input';
export type {
  MaskedInputProps,
  MaskedInputVariant,
  MaskedInputSize,
  MaskedInputInteractionState,
  MaskedInputMachineContext,
  MaskedInputEvent,
  MaskedInputDOMProps,
  MaskSlot,
  MaskedInputAPI,
} from './masked-input';

// ── CurrencyInput ────────────────────────────────────
export {
  createCurrencyInput,
  formatCurrencyValue,
  parseCurrencyString,
  resolveLocaleInfo,
} from './currency-input';
export type {
  CurrencyInputProps,
  CurrencyInputVariant,
  CurrencyInputSize,
  CurrencyInputInteractionState,
  CurrencyInputMachineContext,
  CurrencyInputEvent,
  CurrencyInputDOMProps,
  CurrencyDisplay,
  CurrencyLocaleInfo,
  CurrencyInputAPI,
} from './currency-input';

// ── Select ──────────────────────────────────────────
export {
  createSelect,
  flattenOptions,
  findIndexByValue,
  findLabelByValue,
  isOptionGroup,
} from './select';
export type {
  SelectProps,
  SelectVariant,
  SelectSize,
  SelectInteractionState,
  SelectValue,
  SelectOption,
  SelectOptionGroup,
  SelectOptionOrGroup,
  SelectMachineContext,
  SelectEvent,
  SelectTriggerDOMProps,
  SelectListboxDOMProps,
  SelectOptionDOMProps,
  SelectAPI,
} from './select';

// ── MultiSelect ─────────────────────────────────────
export {
  createMultiSelect,
  getSelectedLabels,
} from './multi-select';
export type {
  MultiSelectVariant,
  MultiSelectSize,
  MultiSelectInteractionState,
  MultiSelectProps,
  MultiSelectMachineContext,
  MultiSelectEvent,
  MultiSelectTriggerDOMProps,
  MultiSelectListboxDOMProps,
  MultiSelectOptionDOMProps,
  MultiSelectAPI,
} from './multi-select';

// ── Combobox ────────────────────────────────────────
export {
  createCombobox,
} from './combobox';
export type {
  ComboboxVariant,
  ComboboxSize,
  ComboboxInteractionState,
  ComboboxFilterFn,
  ComboboxProps,
  ComboboxMachineContext,
  ComboboxEvent,
  ComboboxInputDOMProps,
  ComboboxListboxDOMProps,
  ComboboxOptionDOMProps,
  ComboboxAPI,
} from './combobox';

// ── SegmentedControl ────────────────────────────────
export {
  createSegmentedControl,
} from './segmented-control';
export type {
  SegmentedControlSize,
  SegmentedControlOption,
  SegmentedControlInteractionState,
  SegmentedControlProps,
  SegmentedControlMachineContext,
  SegmentedControlEvent,
  SegmentedControlRootDOMProps,
  SegmentedControlItemDOMProps,
  SegmentedControlAPI,
} from './segmented-control';

// ── TagInput ────────────────────────────────────────
export {
  createTagInput,
} from './tag-input';
export type {
  TagInputVariant,
  TagInputSize,
  TagInputFilterFn,
  TagInputInteractionState,
  TagInputProps,
  TagInputMachineContext,
  TagInputEvent,
  TagInputInputDOMProps,
  TagInputListboxDOMProps,
  TagInputOptionDOMProps,
  TagInputAPI,
} from './tag-input';
