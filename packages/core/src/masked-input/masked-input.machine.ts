/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MaskedInput state machine — framework-agnostic headless masked input logic.
 * MaskedInput state machine — framework bağımsız headless maskeli input mantığı.
 *
 * Mask pattern parsing, formatlama, raw value yönetimi.
 * Mask pattern parsing, formatting, raw value management.
 *
 * @packageDocumentation
 */

import type {
  MaskedInputProps,
  MaskedInputMachineContext,
  MaskedInputEvent,
  MaskedInputDOMProps,
  MaskedInputInteractionState,
  MaskSlot,
} from './masked-input.types';

// ── Yardımcı — güvenli slot erişimi / Safe slot access ─────────────

function getSlot(slots: MaskSlot[], index: number): MaskSlot | undefined {
  return slots[index];
}

// ── Mask Parser ─────────────────────────────────────────────────────

/**
 * Mask pattern'ı slot dizisine parse et.
 * Parse mask pattern to slot array.
 *
 * `#` → digit, `A` → letter, `*` → any, `\\` → escape, diğer → static
 */
export function parseMask(mask: string): MaskSlot[] {
  const slots: MaskSlot[] = [];
  let i = 0;

  while (i < mask.length) {
    const ch = mask[i];

    // Escape: sonraki karakter sabit
    if (ch === '\\' && i + 1 < mask.length) {
      slots.push({ type: 'static', char: mask[i + 1] });
      i += 2;
      continue;
    }

    if (ch === '#') {
      slots.push({ type: 'editable', accept: /[0-9]/ });
    } else if (ch === 'A') {
      slots.push({ type: 'editable', accept: /[a-zA-Z]/ });
    } else if (ch === '*') {
      slots.push({ type: 'editable', accept: /[a-zA-Z0-9]/ });
    } else {
      slots.push({ type: 'static', char: ch });
    }

    i++;
  }

  return slots;
}

/**
 * Mask slot dizisindeki editable slot sayısını döndür.
 * Return count of editable slots in mask definition.
 */
function countEditableSlots(slots: MaskSlot[]): number {
  let count = 0;
  for (const slot of slots) {
    if (slot.type === 'editable') count++;
  }
  return count;
}

// ── Mask Uygulama / Apply Mask ──────────────────────────────────────

/**
 * Ham değeri maskeye uygula, formatlı string döndür.
 * Apply raw value to mask, return formatted string.
 *
 * @param rawValue Ham değer (sadece editable karakterler)
 * @param slots Parse edilmiş mask tanımı
 * @param maskChar Boş slot gösterimi
 * @param showPlaceholder Boş slotlarda maskChar göster (true) veya kes (false)
 */
export function applyMask(
  rawValue: string,
  slots: MaskSlot[],
  maskChar: string,
  showPlaceholder: boolean = true,
): string {
  let result = '';
  let rawIdx = 0;
  let lastFilledIdx = -1;

  // Önce son dolan editable slot'u bul (trailing static'leri kesmek için)
  if (!showPlaceholder) {
    let tempRawIdx = 0;
    for (let i = 0; i < slots.length; i++) {
      const slot = getSlot(slots, i);
      if (!slot) continue;
      if (slot.type === 'editable') {
        if (tempRawIdx < rawValue.length) {
          lastFilledIdx = i;
        }
        tempRawIdx++;
      }
    }
  }

  for (let i = 0; i < slots.length; i++) {
    const slot = getSlot(slots, i);
    if (!slot) continue;

    if (slot.type === 'static') {
      // showPlaceholder=false ve son dolan editable'dan sonraysak kes
      if (!showPlaceholder && lastFilledIdx >= 0 && i > lastFilledIdx) {
        break;
      }
      // rawValue boşsa ve placeholder göstermiyorsak kes
      if (!showPlaceholder && rawIdx >= rawValue.length && lastFilledIdx < 0) {
        break;
      }
      result += slot.char ?? '';
    } else {
      // Editable slot
      if (rawIdx < rawValue.length) {
        const ch = rawValue[rawIdx] ?? '';
        // Karakter kabul ediliyor mu?
        if (slot.accept && slot.accept.test(ch)) {
          result += ch;
        } else {
          // Kabul edilmezse maskChar koy
          result += maskChar;
        }
        rawIdx++;
      } else if (showPlaceholder) {
        result += maskChar;
      } else {
        break;
      }
    }
  }

  return result;
}

/**
 * Formatlı string'den ham değeri çıkar.
 * Extract raw value from formatted string.
 *
 * Mask tanımına bakarak sadece editable pozisyonlardaki karakterleri alır.
 * maskChar olan pozisyonlar atlanır.
 */
export function stripMask(
  formattedValue: string,
  slots: MaskSlot[],
  maskChar: string,
): string {
  let raw = '';

  for (let i = 0; i < slots.length && i < formattedValue.length; i++) {
    const slot = getSlot(slots, i);
    if (!slot) continue;
    const ch = formattedValue[i] ?? '';

    if (slot.type === 'editable' && ch !== maskChar) {
      raw += ch;
    }
  }

  return raw;
}

/**
 * Ham değeri mask'a göre filtrele — kabul edilmeyen karakterleri at.
 * Filter raw value according to mask — drop characters not accepted.
 */
export function filterRawValue(rawValue: string, slots: MaskSlot[]): string {
  let filtered = '';
  let rawIdx = 0;
  let slotIdx = 0;

  while (rawIdx < rawValue.length && slotIdx < slots.length) {
    const slot = getSlot(slots, slotIdx);
    if (!slot) break;

    if (slot.type === 'static') {
      slotIdx++;
      continue;
    }

    const ch = rawValue[rawIdx] ?? '';
    if (slot.accept && slot.accept.test(ch)) {
      filtered += ch;
      slotIdx++;
    }
    rawIdx++;
  }

  return filtered;
}

/**
 * Mask tam dolu mu kontrol et.
 * Check if mask is completely filled.
 */
export function isComplete(rawValue: string, slots: MaskSlot[]): boolean {
  return rawValue.length >= countEditableSlots(slots);
}

/**
 * Verilen cursor pozisyonundan sonraki editable slot indeksini bul.
 * Find next editable slot index from given cursor position.
 */
export function getNextEditableIndex(
  position: number,
  slots: MaskSlot[],
  direction: 'forward' | 'backward' = 'forward',
): number {
  if (direction === 'forward') {
    for (let i = position; i < slots.length; i++) {
      const slot = getSlot(slots, i);
      if (slot && slot.type === 'editable') return i;
    }
    return slots.length;
  }

  for (let i = position; i >= 0; i--) {
    const slot = getSlot(slots, i);
    if (slot && slot.type === 'editable') return i;
  }
  return 0;
}

// ── Hazır Mask Preset'leri / Mask Presets ────────────────────────────

/**
 * Yaygın mask pattern'ları.
 * Common mask patterns.
 */
export const MASK_PRESETS = {
  /** Türk telefon numarası / Turkish phone number: (5##) ### ## ## */
  phoneTR: '(###) ### ## ##',

  /** Uluslararası telefon / International phone: +## (###) ###-#### */
  phoneIntl: '+## (###) ###-####',

  /** TC Kimlik No / Turkish ID: ### ### ## ### */
  tcKimlik: '### ### ## ###',

  /** Kredi kartı / Credit card: #### #### #### #### */
  creditCard: '#### #### #### ####',

  /** Tarih / Date: ##/##/#### */
  date: '##/##/####',

  /** Saat / Time: ##:## */
  time: '##:##',

  /** IPv4: ###.###.###.### */
  ipv4: '###.###.###.###',

  /** IBAN (TR): TR## #### #### #### #### #### ## */
  ibanTR: 'TR## #### #### #### #### #### ##',
} as const;

// ── Context oluşturucu / Context creator ────────────────────────────

function createInitialContext(props: MaskedInputProps): MaskedInputMachineContext {
  const maskSlots = parseMask(props.mask);
  const editableCount = countEditableSlots(maskSlots);
  const maskChar = props.maskChar ?? '_';

  // Başlangıç değerini filtrele
  const rawValue = props.value ? filterRawValue(props.value, maskSlots) : '';

  return {
    interactionState: 'idle',
    mask: props.mask,
    maskSlots,
    maskChar,
    rawValue,
    editableCount,
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: MaskedInputMachineContext,
  event: MaskedInputEvent,
): MaskedInputMachineContext {
  // ── Prop güncellemeleri her zaman uygulanır ──
  if (event.type === 'SET_DISABLED') {
    if (event.value === ctx.disabled) return ctx;
    return {
      ...ctx,
      disabled: event.value,
      interactionState: event.value ? 'idle' : ctx.interactionState,
    };
  }

  if (event.type === 'SET_READ_ONLY') {
    if (event.value === ctx.readOnly) return ctx;
    return { ...ctx, readOnly: event.value };
  }

  if (event.type === 'SET_INVALID') {
    if (event.value === ctx.invalid) return ctx;
    return { ...ctx, invalid: event.value };
  }

  // ── SET_RAW_VALUE — programatik raw değer set etme ──
  if (event.type === 'SET_RAW_VALUE') {
    const filtered = filterRawValue(event.value, ctx.maskSlots);
    if (filtered === ctx.rawValue) return ctx;
    return { ...ctx, rawValue: filtered };
  }

  // ── SET_INPUT_VALUE — kullanıcının input'a yazdığı formatlı değer ──
  if (event.type === 'SET_INPUT_VALUE') {
    const raw = stripMask(event.value, ctx.maskSlots, ctx.maskChar);
    // Ekstra karakterleri de dene — kullanıcı paste yapabilir
    // Formatlı değerden çıkamayan karakterleri ham olarak parse et
    const finalRaw = raw.length > 0 ? raw : extractRawFromInput(event.value, ctx.maskSlots);
    const filtered = filterRawValue(finalRaw, ctx.maskSlots);
    if (filtered === ctx.rawValue) return ctx;
    return { ...ctx, rawValue: filtered };
  }

  // ── Disabled durumda etkileşim engellenir ──
  if (ctx.disabled) return ctx;

  // ── Etkileşim state geçişleri ──
  const { interactionState } = ctx;
  let nextState: MaskedInputInteractionState = interactionState;

  switch (event.type) {
    case 'POINTER_ENTER':
      if (interactionState === 'idle') {
        nextState = 'hover';
      }
      break;

    case 'POINTER_LEAVE':
      if (interactionState === 'hover') {
        nextState = 'idle';
      }
      break;

    case 'FOCUS':
      nextState = 'focused';
      break;

    case 'BLUR':
      nextState = 'idle';
      break;
  }

  if (nextState === interactionState) return ctx;
  return { ...ctx, interactionState: nextState };
}

/**
 * Input'tan gelen string'den ham değeri çıkar.
 * Mask tanımındaki static karakterleri atlayarak editable olanları toplar.
 * Kullanıcı paste yapınca veya mask'sız yazınca kullanılır.
 */
function extractRawFromInput(input: string, slots: MaskSlot[]): string {
  let raw = '';
  let inputIdx = 0;

  for (let slotIdx = 0; slotIdx < slots.length && inputIdx < input.length; slotIdx++) {
    const slot = getSlot(slots, slotIdx);
    if (!slot) continue;
    const ch = input[inputIdx] ?? '';

    if (slot.type === 'static') {
      // Static karakter eşleşiyorsa atla
      if (ch === slot.char) {
        inputIdx++;
      }
      continue;
    }

    // Editable slot
    if (slot.accept && slot.accept.test(ch)) {
      raw += ch;
    }
    inputIdx++;
  }

  return raw;
}

// ── DOM Props üreticisi / DOM Props generator ───────────────────────

function getInputProps(ctx: MaskedInputMachineContext): MaskedInputDOMProps {
  return {
    type: 'text',
    disabled: ctx.disabled ? true : undefined,
    readOnly: ctx.readOnly ? true : undefined,
    required: ctx.required ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'data-state': ctx.interactionState,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
  };
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * MaskedInput API — state machine ve mask işlemleri.
 * MaskedInput API — state machine and mask operations.
 */
export interface MaskedInputAPI {
  /** Mevcut context / Current context */
  getContext(): MaskedInputMachineContext;

  /** Event gönder, yeni context döner / Send event, returns new context */
  send(event: MaskedInputEvent): MaskedInputMachineContext;

  /** Input element DOM attribute'ları / Input element DOM attributes */
  getInputProps(): MaskedInputDOMProps;

  /** Etkileşim engellenmiş mi / Is interaction blocked */
  isInteractionBlocked(): boolean;

  /**
   * Formatlı değeri döndür (mask uygulanmış, boş slotlarda maskChar).
   * Return formatted value (mask applied, maskChar for empty slots).
   */
  getFormattedValue(): string;

  /**
   * Ham değeri döndür (sadece kullanıcı girişi, mask karakterleri yok).
   * Return raw value (only user input, no mask characters).
   */
  getRawValue(): string;

  /**
   * Mask tamamen dolu mu.
   * Is mask completely filled.
   */
  isComplete(): boolean;

  /**
   * Mask placeholder'ını döndür (tüm slotlar maskChar ile dolu).
   * Return mask placeholder (all slots filled with maskChar).
   */
  getPlaceholder(): string;
}

/**
 * MaskedInput state machine oluştur.
 * Create a masked input state machine.
 *
 * @example
 * ```ts
 * const masked = createMaskedInput({ mask: '(###) ### ## ##' });
 *
 * masked.send({ type: 'SET_RAW_VALUE', value: '5321234567' });
 * masked.getFormattedValue(); // '(532) 123 45 67'
 * masked.getRawValue();       // '5321234567'
 * masked.isComplete();        // true
 * ```
 */
export function createMaskedInput(props: MaskedInputProps): MaskedInputAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: MaskedInputEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getInputProps() {
      return getInputProps(ctx);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },

    getFormattedValue() {
      return applyMask(ctx.rawValue, ctx.maskSlots, ctx.maskChar, true);
    },

    getRawValue() {
      return ctx.rawValue;
    },

    isComplete() {
      return isComplete(ctx.rawValue, ctx.maskSlots);
    },

    getPlaceholder() {
      return applyMask('', ctx.maskSlots, ctx.maskChar, true);
    },
  };
}
