/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DockLayout types — VS Code seviyesi recursive split tree dock layout tipleri.
 *
 * Recursive binary/n-ary tree mimarisi:
 * - DockSplitNode: branch node (horizontal/vertical split, children[], sizes[])
 * - DockGroupNode: leaf node (tab group, panelIds[], activePanelId)
 *
 * @packageDocumentation
 */

// ── Node Types (Recursive Tree) ─────────────────────

/** Dock tree node — split (branch) veya group (leaf). */
export type DockNode = DockSplitNode | DockGroupNode;

/** Split node — n-ary branch. Direction + children + sizes. */
export interface DockSplitNode {
  /** Node tipi. */
  type: 'split';
  /** Benzersiz node kimliği. */
  id: string;
  /** Bölme yönü. */
  direction: 'horizontal' | 'vertical';
  /** Alt node'lar. */
  children: DockNode[];
  /** Flex ratio'lar (toplam = 1.0). */
  sizes: number[];
}

/** Group node — leaf. Tab grubu. */
export interface DockGroupNode {
  /** Node tipi. */
  type: 'group';
  /** Benzersiz node kimliği. */
  id: string;
  /** Gruptaki panel ID'leri. */
  panelIds: string[];
  /** Aktif (görünen) panel ID. */
  activePanelId: string;
}

// ── Panel State ─────────────────────────────────────

/** Panel yapılandırması (oluşturma). */
export interface DockPanelConfig {
  /** Benzersiz panel kimliği. */
  id: string;
  /** Panel başlığı. */
  title: string;
  /** Hedef grup ID (varsa bu gruba ekle). */
  targetGroupId?: string;
  /** Kapatılabilir mi. Varsayılan: true. */
  closable?: boolean;
  /** Float yapılabilir mi. Varsayılan: true. */
  floatable?: boolean;
  /** Auto-hide yapılabilir mi. Varsayılan: true. */
  autoHideable?: boolean;
  /** Minimize edilebilir mi. Varsayılan: true. */
  minimizable?: boolean;
}

/** Panel durum bilgisi. */
export interface DockPanelState {
  /** Panel ID. */
  id: string;
  /** Panel başlığı. */
  title: string;
  /** Kapatılabilir mi. */
  closable: boolean;
  /** Float edilebilir mi. */
  floatable: boolean;
  /** Auto-hide edilebilir mi. */
  autoHideable: boolean;
  /** Minimize edilebilir mi. */
  minimizable: boolean;
}

// ── Floating Panel ──────────────────────────────────

/** Floating (yüzen) panel grubu. */
export interface DockFloatingGroup {
  /** Benzersiz floating grup kimliği. */
  id: string;
  /** Tab grubu. */
  group: DockGroupNode;
  /** X pozisyonu (px). */
  x: number;
  /** Y pozisyonu (px). */
  y: number;
  /** Genişlik (px). */
  width: number;
  /** Yükseklik (px). */
  height: number;
  /** Z-index sırası. */
  zIndex: number;
}

// ── Auto-Hidden Panel ───────────────────────────────

/** Auto-hidden (kenar şeridine küçültülmüş) panel. */
export interface DockAutoHiddenPanel {
  /** Panel ID. */
  panelId: string;
  /** Kenar tarafı. */
  side: 'left' | 'right' | 'top' | 'bottom';
}

// ── Drop Target (DnD) ──────────────────────────────

/** Drop pozisyonu. */
export type DropPosition = 'left' | 'right' | 'top' | 'bottom' | 'center';

/** Drop hedefi. */
export interface DropTarget {
  /** Hedef grup ID. */
  groupId: string;
  /** Drop pozisyonu. */
  position: DropPosition;
}

// ── Drag State ──────────────────────────────────────

/** Sürükleme durumu. */
export interface DragState {
  /** Sürüklenen panel ID. */
  panelId: string;
  /** Kaynak grup ID. */
  sourceGroupId: string;
}

// ── Resize Handle State ─────────────────────────────

/** Resize handle durumu (split handle sürüklerken). */
export interface ResizeHandleState {
  /** Split node ID. */
  splitId: string;
  /** Handle indeksi (children arasındaki). */
  handleIndex: number;
  /** Sürükleme başlangıcındaki size'lar. */
  startSizes: number[];
}

// ── Workspace ───────────────────────────────────────

/** Kaydedilmiş workspace (layout preset). */
export interface DockWorkspace {
  /** Workspace adı. */
  name: string;
  /** Layout snapshot'ı. */
  snapshot: DockLayoutSnapshot;
}

// ── Serialization Snapshot ──────────────────────────

/** Serileştirilmiş layout durumu. */
export interface DockLayoutSnapshot {
  /** Recursive tree root. */
  root: SerializedNode;
  /** Panel bilgileri. */
  panels: Record<string, SerializedPanelState>;
  /** Floating grup bilgileri. */
  floatingGroups: SerializedFloatingGroup[];
  /** Auto-hidden panel bilgileri. */
  autoHiddenPanels: DockAutoHiddenPanel[];
}

/** Serileştirilmiş node. */
export type SerializedNode = SerializedSplitNode | SerializedGroupNode;

/** Serileştirilmiş split node. */
export interface SerializedSplitNode {
  /** Node tipi. */
  type: 'split';
  /** Node ID. */
  id: string;
  /** Bölme yönü. */
  direction: 'horizontal' | 'vertical';
  /** Alt node'lar. */
  children: SerializedNode[];
  /** Size'lar. */
  sizes: number[];
}

/** Serileştirilmiş group node. */
export interface SerializedGroupNode {
  /** Node tipi. */
  type: 'group';
  /** Node ID. */
  id: string;
  /** Panel ID'leri. */
  panelIds: string[];
  /** Aktif panel ID. */
  activePanelId: string;
}

/** Serileştirilmiş panel durumu. */
export interface SerializedPanelState {
  /** Panel başlığı. */
  title: string;
  /** Kapatılabilir mi. */
  closable: boolean;
  /** Float edilebilir mi. */
  floatable: boolean;
  /** Auto-hide edilebilir mi. */
  autoHideable: boolean;
  /** Minimize edilebilir mi. */
  minimizable: boolean;
}

/** Serileştirilmiş floating grup. */
export interface SerializedFloatingGroup {
  /** Floating grup ID. */
  id: string;
  /** Grup bilgisi. */
  group: SerializedGroupNode;
  /** X pozisyonu. */
  x: number;
  /** Y pozisyonu. */
  y: number;
  /** Genişlik. */
  width: number;
  /** Yükseklik. */
  height: number;
}

// ── DockLayout Props ────────────────────────────────

/** DockLayout yapılandırma prop'ları. */
export interface DockLayoutProps {
  /** Başlangıç panelleri. */
  panels?: DockPanelConfig[];
  /** Başlangıç root layout (varsa panels'ten önce gelir). */
  initialRoot?: DockNode;
}

// ── Events ──────────────────────────────────────────

/** DockLayout state machine event'leri. */
export type DockLayoutEvent =
  // Panel lifecycle
  | { type: 'ADD_PANEL'; panel: DockPanelConfig; targetGroupId?: string }
  | { type: 'REMOVE_PANEL'; panelId: string }
  | { type: 'CLOSE_PANEL'; panelId: string }
  | { type: 'ACTIVATE_PANEL'; panelId: string }
  | { type: 'SET_PANEL_TITLE'; panelId: string; title: string }
  // Tab move (programmatic)
  | { type: 'MOVE_PANEL'; panelId: string; targetGroupId: string; index?: number }
  // Split operations
  | { type: 'SPLIT_GROUP'; groupId: string; direction: 'horizontal' | 'vertical'; panelId: string; position: 'before' | 'after' }
  // Split resize
  | { type: 'RESIZE_START'; splitId: string; handleIndex: number }
  | { type: 'RESIZE_DRAG'; delta: number }
  | { type: 'RESIZE_END' }
  | { type: 'SET_SIZES'; splitId: string; sizes: number[] }
  // Tab drag & drop
  | { type: 'DRAG_START'; panelId: string }
  | { type: 'DROP'; target: DropTarget }
  | { type: 'DROP_TO_FLOAT'; panelId: string; x: number; y: number; width: number; height: number }
  | { type: 'DRAG_CANCEL' }
  // Float
  | { type: 'FLOAT_PANEL'; panelId: string; x?: number; y?: number; width?: number; height?: number }
  | { type: 'DOCK_PANEL'; panelId: string; targetGroupId?: string }
  | { type: 'MOVE_FLOATING'; floatingGroupId: string; x: number; y: number }
  | { type: 'RESIZE_FLOATING'; floatingGroupId: string; width: number; height: number }
  | { type: 'ACTIVATE_FLOATING'; floatingGroupId: string }
  // Auto-hide
  | { type: 'AUTO_HIDE_PANEL'; panelId: string; side: 'left' | 'right' | 'top' | 'bottom' }
  | { type: 'RESTORE_PANEL'; panelId: string }
  // Maximize
  | { type: 'MAXIMIZE_PANEL'; panelId: string }
  | { type: 'RESTORE_MAXIMIZED' }
  // Workspace
  | { type: 'SAVE_WORKSPACE'; name: string }
  | { type: 'LOAD_WORKSPACE'; name: string }
  | { type: 'DELETE_WORKSPACE'; name: string }
  // Serialize
  | { type: 'DESERIALIZE'; snapshot: DockLayoutSnapshot };

// ── API ─────────────────────────────────────────────

/** DockLayout state machine API. */
export interface DockLayoutAPI {
  /** Tree root'u al. */
  getRoot: () => DockNode | null;
  /** Belirli bir node'u ID ile bul. */
  getNode: (id: string) => DockNode | undefined;
  /** Panel bilgisi al. */
  getPanel: (id: string) => DockPanelState | undefined;
  /** Tüm panelleri al. */
  getPanels: () => DockPanelState[];
  /** Belirli bir panel'in bulunduğu group'u bul. */
  getGroupByPanelId: (panelId: string) => DockGroupNode | undefined;
  /** Floating grupları al. */
  getFloatingGroups: () => DockFloatingGroup[];
  /** Auto-hidden panelleri al. */
  getAutoHiddenPanels: () => DockAutoHiddenPanel[];
  /** Maximize edilmiş panel ID (yoksa null). */
  getMaximizedPanelId: () => string | null;
  /** Sürükleme durumu (yoksa null). */
  getDragState: () => DragState | null;
  /** Resize handle durumu (yoksa null). */
  getResizeState: () => ResizeHandleState | null;
  /** Workspace listesini al. */
  getWorkspaces: () => DockWorkspace[];
  /** Layout'u JSON olarak serialize et. */
  serialize: () => DockLayoutSnapshot;
  /** Event gönder. */
  send: (event: DockLayoutEvent) => void;
}
