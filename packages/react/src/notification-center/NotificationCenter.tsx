/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NotificationCenter — bildirim merkezi paneli (Dual API).
 * NotificationCenter — notification center panel (Dual API).
 *
 * Props-based: `<NotificationCenter notifications={list} open={true} unreadCount={3} />`
 * Compound:    `<NotificationCenter open={true}><NotificationCenter.Header>...</NotificationCenter.Header>...</NotificationCenter>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import {
  ncOverlayStyle,
  ncPanelStyle,
  ncHeaderStyle,
  ncHeaderTitleStyle,
  ncBadgeStyle,
  ncHeaderActionsStyle,
  ncHeaderActionButtonStyle,
  ncListStyle,
  ncGroupTitleStyle,
  ncItemRecipe,
  ncItemIconRecipe,
  ncItemContentStyle,
  ncItemTitleStyle,
  ncItemMessageStyle,
  ncItemTimestampStyle,
  ncItemCloseButtonStyle,
  ncEmptyStateStyle,
} from './notification-center.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import type { NotificationItem, NotificationSeverity } from '@relteco/relui-core';
import {
  InfoCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  CloseIcon,
} from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * NotificationCenter slot isimleri / NotificationCenter slot names.
 */
export type NotificationCenterSlot =
  | 'root'
  | 'overlay'
  | 'panel'
  | 'header'
  | 'headerTitle'
  | 'badge'
  | 'list'
  | 'group'
  | 'groupTitle'
  | 'item'
  | 'itemIcon'
  | 'itemContent'
  | 'itemTitle'
  | 'itemMessage'
  | 'itemTimestamp'
  | 'itemCloseButton'
  | 'emptyState';

// ── Default Icons ───────────────────────────────────

const defaultIcons: Record<NotificationSeverity, typeof InfoCircleIcon> = {
  info: InfoCircleIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  error: XCircleIcon,
};

// ── Helpers ─────────────────────────────────────────

function formatTimestamp(ts: number): string {
  const diff = Date.now() - ts;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'Az once';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} dk once`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa once`;
  const days = Math.floor(hours / 24);
  return `${days} gun once`;
}

// ── Context (Compound API) ──────────────────────────

interface NotificationCenterContextValue {
  classNames: ClassNames<NotificationCenterSlot> | undefined;
  styles: Styles<NotificationCenterSlot> | undefined;
}

const NotificationCenterContext = createContext<NotificationCenterContextValue | null>(null);

function useNotificationCenterContext(): NotificationCenterContextValue {
  const ctx = useContext(NotificationCenterContext);
  if (!ctx) throw new Error('NotificationCenter compound sub-components must be used within <NotificationCenter>.');
  return ctx;
}

// ── Compound: NotificationCenter.Header ─────────────

/** NotificationCenter.Header props */
export interface NotificationCenterHeaderProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const NotificationCenterHeader = forwardRef<HTMLDivElement, NotificationCenterHeaderProps>(
  function NotificationCenterHeader(props, ref) {
    const { children, className } = props;
    const ctx = useNotificationCenterContext();
    const slot = getSlotProps('header', ncHeaderStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="nc-header">
        {children}
      </div>
    );
  },
);

// ── Compound: NotificationCenter.Item ───────────────

/** NotificationCenter.Item props */
export interface NotificationCenterItemProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Okundu mu / Read */
  read?: boolean;
  /** Severity / Severity */
  severity?: NotificationSeverity;
  /** Tiklaninca callback / On click callback */
  onClick?: () => void;
  /** Ek className / Additional className */
  className?: string;
}

const NotificationCenterItem = forwardRef<HTMLDivElement, NotificationCenterItemProps>(
  function NotificationCenterItem(props, ref) {
    const { children, read = false, severity = 'info', onClick, className } = props;
    const ctx = useNotificationCenterContext();
    const itemClass = ncItemRecipe({ read });
    const slot = getSlotProps('item', itemClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="nc-item"
        data-severity={severity}
        data-read={read}
        onClick={onClick}
      >
        {children}
      </div>
    );
  },
);

// ── Compound: NotificationCenter.EmptyState ─────────

/** NotificationCenter.EmptyState props */
export interface NotificationCenterEmptyStateProps {
  /** Icerik (varsayilan: "Bildirim yok") / Content (default: "Bildirim yok") */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const NotificationCenterEmptyState = forwardRef<HTMLDivElement, NotificationCenterEmptyStateProps>(
  function NotificationCenterEmptyState(props, ref) {
    const { children, className } = props;
    const ctx = useNotificationCenterContext();
    const slot = getSlotProps('emptyState', ncEmptyStateStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="nc-empty">
        {children ?? 'Bildirim yok'}
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface NotificationCenterComponentProps extends SlotStyleProps<NotificationCenterSlot> {
  /** Bildirim listesi / Notification list */
  notifications: NotificationItem[];
  /** Panel acik mi / Is panel open */
  open: boolean;
  /** Okunmamis sayi / Unread count */
  unreadCount: number;
  /** Panel baslik / Panel title */
  title?: string;
  /** Paneli kapat / On close */
  onClose?: () => void;
  /** Bildirimi kaldir / On remove */
  onRemove?: (id: string) => void;
  /** Bildirimi tikla (okundu isaretle) / On click (mark read) */
  onClick?: (id: string) => void;
  /** Tumunu okundu isaretle / Mark all read */
  onMarkAllRead?: () => void;
  /** Tumunu temizle / Clear all */
  onClearAll?: () => void;
  /** Overlay tiklaninca kapat / Close on overlay click */
  closeOnOverlay?: boolean;
  /** Zaman formatci / Timestamp formatter */
  formatTime?: (timestamp: number) => string;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** id */
  id?: string;
}

// ── Component ─────────────────────────────────────────

const NotificationCenterBase = forwardRef<HTMLDivElement, NotificationCenterComponentProps>(
  function NotificationCenter(props, ref) {
    const {
      notifications,
      open,
      unreadCount,
      title = 'Bildirimler',
      onClose,
      onRemove,
      onClick,
      onMarkAllRead,
      onClearAll,
      closeOnOverlay = true,
      formatTime = formatTimestamp,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
    } = props;

    if (!open) return null;

    // ── Slots ──
    const overlaySlot = getSlotProps('overlay', ncOverlayStyle, classNames, styles);
    const panelSlot = getSlotProps('panel', ncPanelStyle, classNames, styles);
    const combinedPanelClassName = className
      ? `${panelSlot.className} ${className}`
      : panelSlot.className;
    const combinedPanelStyle = styleProp
      ? { ...panelSlot.style, ...styleProp }
      : panelSlot.style;

    const ctxValue: NotificationCenterContextValue = { classNames, styles };

    // ── Compound API ──
    if (children) {
      return (
        <NotificationCenterContext.Provider value={ctxValue}>
          {/* Overlay */}
          <div
            className={overlaySlot.className}
            style={overlaySlot.style}
            onClick={closeOnOverlay ? onClose : undefined}
            data-testid="nc-overlay"
            aria-hidden="true"
          />
          {/* Panel */}
          <div
            ref={ref}
            className={combinedPanelClassName}
            style={combinedPanelStyle}
            id={id}
            role="region"
            aria-label={title}
            data-testid="nc-panel"
          >
            {children}
          </div>
        </NotificationCenterContext.Provider>
      );
    }

    // ── Props-based API ──
    const headerSlot = getSlotProps('header', ncHeaderStyle, classNames, styles);
    const headerTitleSlot = getSlotProps('headerTitle', ncHeaderTitleStyle, classNames, styles);
    const badgeSlot = getSlotProps('badge', ncBadgeStyle, classNames, styles);
    const listSlot = getSlotProps('list', ncListStyle, classNames, styles);
    const groupTitleSlot = getSlotProps('groupTitle', ncGroupTitleStyle, classNames, styles);
    const itemContentSlot = getSlotProps('itemContent', ncItemContentStyle, classNames, styles);
    const itemTitleSlot = getSlotProps('itemTitle', ncItemTitleStyle, classNames, styles);
    const itemMessageSlot = getSlotProps('itemMessage', ncItemMessageStyle, classNames, styles);
    const itemTimestampSlot = getSlotProps('itemTimestamp', ncItemTimestampStyle, classNames, styles);
    const itemCloseSlot = getSlotProps('itemCloseButton', ncItemCloseButtonStyle, classNames, styles);
    const emptySlot = getSlotProps('emptyState', ncEmptyStateStyle, classNames, styles);

    // ── Gruplama ──
    const groups: Array<{ key: string; items: NotificationItem[] }> = [];
    const ungrouped: NotificationItem[] = [];

    for (const n of notifications) {
      if (n.group) {
        let group = groups.find((g) => g.key === n.group);
        if (!group) {
          group = { key: n.group, items: [] };
          groups.push(group);
        }
        group.items.push(n);
      } else {
        ungrouped.push(n);
      }
    }

    // ── Render item ──
    function renderItem(n: NotificationItem) {
      const itemClass = ncItemRecipe({ read: n.read });
      const itemSlot = getSlotProps('item', itemClass, classNames, styles);
      const iconClass = ncItemIconRecipe({ severity: n.severity });
      const iconSlot = getSlotProps('itemIcon', iconClass, classNames, styles);
      const Icon = defaultIcons[n.severity];

      return (
        <div
          key={n.id}
          className={itemSlot.className}
          style={itemSlot.style}
          data-testid="nc-item"
          data-severity={n.severity}
          data-read={n.read}
          onClick={() => onClick?.(n.id)}
        >
          <span className={iconSlot.className} style={iconSlot.style}>
            <Icon size={20} />
          </span>
          <div className={itemContentSlot.className} style={itemContentSlot.style}>
            {n.title && (
              <div className={itemTitleSlot.className} style={itemTitleSlot.style} data-testid="nc-item-title">
                {n.title}
              </div>
            )}
            <div className={itemMessageSlot.className} style={itemMessageSlot.style} data-testid="nc-item-message">
              {n.message}
            </div>
            <div className={itemTimestampSlot.className} style={itemTimestampSlot.style} data-testid="nc-item-timestamp">
              {formatTime(n.createdAt)}
            </div>
          </div>
          <button
            className={itemCloseSlot.className}
            style={itemCloseSlot.style}
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(n.id);
            }}
            type="button"
            aria-label="Bildirimi kaldir"
            data-testid="nc-item-close"
          >
            <CloseIcon size={10} />
          </button>
        </div>
      );
    }

    return (
      <>
        {/* Overlay */}
        <div
          className={overlaySlot.className}
          style={overlaySlot.style}
          onClick={closeOnOverlay ? onClose : undefined}
          data-testid="nc-overlay"
          aria-hidden="true"
        />
        {/* Panel */}
        <div
          ref={ref}
          className={combinedPanelClassName}
          style={combinedPanelStyle}
          id={id}
          role="region"
          aria-label={title}
          data-testid="nc-panel"
        >
          {/* Header */}
          <div className={headerSlot.className} style={headerSlot.style} data-testid="nc-header">
            <h2 className={headerTitleSlot.className} style={headerTitleSlot.style}>
              {title}
              {unreadCount > 0 && (
                <span className={badgeSlot.className} style={badgeSlot.style} data-testid="nc-badge">
                  {unreadCount}
                </span>
              )}
            </h2>
            <div className={ncHeaderActionsStyle}>
              {onMarkAllRead && (
                <button
                  className={ncHeaderActionButtonStyle}
                  onClick={onMarkAllRead}
                  type="button"
                  disabled={unreadCount === 0}
                  data-testid="nc-mark-all-read"
                >
                  Tumunu oku
                </button>
              )}
              {onClearAll && (
                <button
                  className={ncHeaderActionButtonStyle}
                  onClick={onClearAll}
                  type="button"
                  disabled={notifications.length === 0}
                  data-testid="nc-clear-all"
                >
                  Temizle
                </button>
              )}
              {onClose && (
                <button
                  className={ncHeaderActionButtonStyle}
                  onClick={onClose}
                  type="button"
                  aria-label="Kapat"
                  data-testid="nc-close"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className={listSlot.className} style={listSlot.style} data-testid="nc-list">
            {notifications.length === 0 ? (
              <div className={emptySlot.className} style={emptySlot.style} data-testid="nc-empty">
                Bildirim yok
              </div>
            ) : (
              <>
                {ungrouped.map(renderItem)}
                {groups.map((group) => (
                  <div key={group.key} data-testid="nc-group">
                    <div className={groupTitleSlot.className} style={groupTitleSlot.style} data-testid="nc-group-title">
                      {group.key}
                    </div>
                    {group.items.map(renderItem)}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </>
    );
  },
);

/**
 * NotificationCenter bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <NotificationCenter notifications={list} open={true} unreadCount={3} onClose={toggle} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <NotificationCenter notifications={list} open={true} unreadCount={3}>
 *   <NotificationCenter.Header>Bildirimler</NotificationCenter.Header>
 *   <NotificationCenter.Item severity="info">Yeni mesaj</NotificationCenter.Item>
 *   <NotificationCenter.EmptyState>Bildirim yok</NotificationCenter.EmptyState>
 * </NotificationCenter>
 * ```
 */
export const NotificationCenter = Object.assign(NotificationCenterBase, {
  Header: NotificationCenterHeader,
  Item: NotificationCenterItem,
  EmptyState: NotificationCenterEmptyState,
});
