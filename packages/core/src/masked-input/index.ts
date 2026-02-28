/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export {
  createMaskedInput,
  parseMask,
  applyMask,
  stripMask,
  filterRawValue,
  isComplete,
  getNextEditableIndex,
  MASK_PRESETS,
  type MaskedInputAPI,
} from './masked-input.machine';

export type {
  MaskedInputProps,
  MaskedInputVariant,
  MaskedInputSize,
  MaskedInputInteractionState,
  MaskedInputMachineContext,
  MaskedInputEvent,
  MaskedInputDOMProps,
  MaskSlot,
} from './masked-input.types';
