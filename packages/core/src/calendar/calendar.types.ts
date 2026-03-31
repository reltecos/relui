/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Calendar tipleri.
 * Calendar types.
 *
 * @packageDocumentation
 */

/** Takvim gorunum modu / Calendar view mode */
export type CalendarView = 'month' | 'week' | 'day';

/** Takvim etkinligi / Calendar event */
export interface CalendarEventDef {
  /** Benzersiz id / Unique ID */
  id: string;
  /** Baslik / Title */
  title: string;
  /** Baslangic tarihi / Start date */
  start: Date;
  /** Bitis tarihi / End date */
  end: Date;
  /** Renk (CSS degiskeni) / Color */
  color?: string;
  /** Ek veri / Extra data */
  data?: Record<string, unknown>;
}

/** Takvim gunu bilgisi / Calendar day info */
export interface CalendarDay {
  /** Tarih / Date */
  date: Date;
  /** Bu ayin gunu mu / Is current month day */
  isCurrentMonth: boolean;
  /** Bugun mu / Is today */
  isToday: boolean;
  /** Secili mi / Is selected */
  isSelected: boolean;
  /** Bu gundeki etkinlikler / Events on this day */
  events: CalendarEventDef[];
}

/** Takvim context / Calendar context */
export interface CalendarContext {
  /** Goruntulenen tarih / Displayed date */
  readonly currentDate: Date;
  /** Gorunum modu / View mode */
  readonly view: CalendarView;
  /** Secili tarih / Selected date */
  readonly selectedDate: Date | null;
  /** Secili tarih araligi baslangic / Range selection start */
  readonly rangeStart: Date | null;
  /** Secili tarih araligi bitis / Range selection end */
  readonly rangeEnd: Date | null;
  /** Etkinlikler / Events */
  readonly events: ReadonlyArray<CalendarEventDef>;
}

/** Takvim event leri / Calendar events */
export type CalendarEvent =
  | { type: 'NAVIGATE_PREV' }
  | { type: 'NAVIGATE_NEXT' }
  | { type: 'SET_TODAY' }
  | { type: 'SET_VIEW'; view: CalendarView }
  | { type: 'SELECT_DATE'; date: Date }
  | { type: 'SELECT_RANGE'; start: Date; end: Date }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'ADD_EVENT'; event: CalendarEventDef }
  | { type: 'REMOVE_EVENT'; eventId: string }
  | { type: 'SET_EVENTS'; events: CalendarEventDef[] };

/** Takvim yapilandirmasi / Calendar configuration */
export interface CalendarConfig {
  /** Baslangic gorunum tarihi / Initial display date */
  defaultDate?: Date;
  /** Baslangic gorunum modu / Initial view mode */
  defaultView?: CalendarView;
  /** Baslangic etkinlikleri / Initial events */
  events?: CalendarEventDef[];
  /** Tarih secildiginde / On date select */
  onDateSelect?: (date: Date) => void;
  /** Gorunum degistiginde / On view change */
  onViewChange?: (view: CalendarView) => void;
  /** Navigasyon degistiginde / On navigate */
  onNavigate?: (date: Date) => void;
}

/** Takvim API / Calendar API */
export interface CalendarAPI {
  /** Guncel context / Get current context */
  getContext(): CalendarContext;
  /** Event gonder / Send event */
  send(event: CalendarEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizle / Destroy */
  destroy(): void;
}
