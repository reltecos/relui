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

// ── CopyButton ──────────────────────────────────────
export type { CopyButtonProps, CopyButtonSize } from './copy-button';

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

// ── InPlaceEditor ───────────────────────────────────
export { createInPlaceEditor } from './in-place-editor';
export type {
  InPlaceEditorProps,
  InPlaceEditorState,
  InPlaceEditorActivation,
  InPlaceEditorVariant,
  InPlaceEditorSize,
  InPlaceEditorMachineContext,
  InPlaceEditorEvent,
  InPlaceEditorDisplayDOMProps,
  InPlaceEditorInputDOMProps,
  InPlaceEditorAPI,
} from './in-place-editor';

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

// ── Cascader ────────────────────────────────────────
export {
  createCascader,
  getColumnsFromPath,
  getLabelsFromPath,
} from './cascader';
export type {
  CascaderVariant,
  CascaderSize,
  CascaderValue,
  CascaderOption,
  CascaderInteractionState,
  CascaderExpandTrigger,
  CascaderProps,
  CascaderMachineContext,
  CascaderEvent,
  CascaderTriggerDOMProps,
  CascaderColumnDOMProps,
  CascaderOptionDOMProps,
  CascaderAPI,
} from './cascader';

// ── MultiColumnCombobox ────────────────────────────
export {
  createMCCombobox,
  findItemIndexByValue,
  findItemLabelByValue,
} from './multi-column-combobox';
export type {
  MCComboboxVariant,
  MCComboboxSize,
  MCComboboxInteractionState,
  MCComboboxColumn,
  MCComboboxItem,
  MCComboboxFilterFn,
  MCComboboxProps,
  MCComboboxMachineContext,
  MCComboboxEvent,
  MCComboboxInputDOMProps,
  MCComboboxGridDOMProps,
  MCComboboxRowDOMProps,
  MCComboboxListboxDOMProps,
  MCComboboxAPI,
} from './multi-column-combobox';

// ── DropdownTree ───────────────────────────────────
export {
  createDropdownTree,
  collectAllValues,
  findNodeByValue,
  findLabelByNodeValue,
  flattenVisibleNodes,
  filterTree,
  getTreeSelectedLabels,
} from './dropdown-tree';
export type {
  DropdownTreeVariant,
  DropdownTreeSize,
  DropdownTreeInteractionState,
  DropdownTreeSelectionMode,
  TreeNode,
  FlatTreeNode,
  DropdownTreeFilterFn,
  DropdownTreeProps,
  DropdownTreeMachineContext,
  DropdownTreeEvent,
  DropdownTreeTriggerDOMProps,
  DropdownTreePanelDOMProps,
  DropdownTreeNodeDOMProps,
  DropdownTreeAPI,
} from './dropdown-tree';

// ── ScrollArea ────────────────────────────────────────
export { createScrollArea } from './scroll-area';
export type {
  ScrollAreaProps,
  ScrollAreaType,
  ScrollAreaOrientation,
  ScrollPosition,
  ScrollDimensions,
  ThumbInfo,
  ScrollAreaEvent,
  ScrollAreaAPI,
} from './scroll-area';

// ── Sticky ────────────────────────────────────────────
export { createSticky } from './sticky';
export type {
  StickyProps,
  StickyPosition,
  StickyState,
  StickyEvent,
  StickyAPI,
} from './sticky';

// ── Resizable ─────────────────────────────────────────
export { createResizable } from './resizable';
export type {
  ResizableProps,
  ResizeDirection,
  ResizableState,
  ResizeSize,
  ResizableEvent,
  ResizableAPI,
} from './resizable';

// ── Masonry ───────────────────────────────────────────
export { createMasonry } from './masonry';
export type {
  MasonryProps,
  MasonryItemPosition,
  MasonryEvent,
  MasonryAPI,
} from './masonry';

// ── MasterDetail ──────────────────────────────────────
export { createMasterDetail } from './master-detail';
export type {
  MasterDetailProps,
  MasterPosition,
  DetailVisibility,
  MasterDetailEvent,
  MasterDetailAPI,
} from './master-detail';

// ── SplitPanel ───────────────────────────────────────
export { createSplitPanel } from './split-panel';
export type {
  SplitPanelProps,
  SplitOrientation,
  SplitPanelEvent,
  SplitPanelAPI,
} from './split-panel';

// ── FloatingWindow ───────────────────────────────────
export { createFloatingWindow } from './floating-window';
export type {
  FloatingWindowProps,
  WindowState,
  WindowPosition,
  WindowSize,
  FloatingWindowEvent,
  FloatingWindowAPI,
} from './floating-window';

// ── TileLayout ──────────────────────────────────────
export { createTileLayout } from './tile-layout';
export type {
  TileLayoutProps,
  TileItem,
  TileLayoutEvent,
  TileLayoutAPI,
} from './tile-layout';

// ── BookLayout ──────────────────────────────────────
export { createBookLayout } from './book-layout';
export type {
  BookLayoutProps,
  PageDirection,
  BookLayoutEvent,
  BookLayoutAPI,
} from './book-layout';

// ── DockLayout ──────────────────────────────────────
export {
  createDockLayout,
  generateDockId,
  resetDockIdCounter,
  findNode,
  findParent,
  findGroupByPanelId,
  collectAllGroups,
  removeNodeFromTree,
  splitGroup,
  normalizeSizes,
  serializeNode,
  deserializeNode,
} from './dock-layout';
export type {
  DockNode,
  DockSplitNode,
  DockGroupNode,
  DockPanelConfig,
  DockPanelState,
  DockFloatingGroup,
  DockAutoHiddenPanel,
  DropPosition,
  DropTarget,
  DragState,
  ResizeHandleState,
  DockWorkspace,
  DockLayoutSnapshot,
  SerializedNode,
  SerializedSplitNode,
  SerializedGroupNode,
  SerializedPanelState,
  SerializedFloatingGroup,
  DockLayoutProps,
  DockLayoutEvent,
  DockLayoutAPI,
} from './dock-layout';

// ── MDI ─────────────────────────────────────────────
export { createMDI } from './mdi';
export type {
  MDIProps,
  MDIWindowState,
  MDIArrangement,
  MDIWindowConfig,
  MDIWindowInfo,
  MDIEvent,
  MDIAPI,
} from './mdi';

// ── Navigation: Tabs ────────────────────────────────
export { createTabs } from './tabs';
export type {
  TabsSize,
  TabsVariant,
  TabsOrientation,
  TabsActivationMode,
  TabItem,
  TabsInteractionState,
  TabsProps,
  TabsMachineContext,
  TabsEvent,
  TabsListDOMProps,
  TabDOMProps,
  TabPanelDOMProps,
  TabsAPI,
} from './tabs';

// ── Navigation: Breadcrumb ─────────────────────────
export { createBreadcrumb } from './breadcrumb';
export type {
  BreadcrumbSize,
  BreadcrumbItem,
  BreadcrumbProps,
  BreadcrumbMachineContext,
  BreadcrumbEvent,
  BreadcrumbVisibleItem,
  BreadcrumbNavDOMProps,
  BreadcrumbListDOMProps,
  BreadcrumbItemDOMProps,
  BreadcrumbAPI,
} from './breadcrumb';

// ── Navigation: Pagination ─────────────────────────
export { createPagination } from './pagination';
export type {
  PaginationSize,
  PaginationVariant,
  PaginationRangeItem,
  PaginationProps,
  PaginationMachineContext,
  PaginationEvent,
  PaginationNavDOMProps,
  PaginationPageDOMProps,
  PaginationControlDOMProps,
  PaginationAPI,
} from './pagination';

// ── Navigation: Sidebar ───────────────────────────
export { createSidebar } from './sidebar';
export type {
  SidebarSize,
  SidebarPosition,
  SidebarItem,
  SidebarProps,
  SidebarMachineContext,
  SidebarEvent,
  SidebarNavDOMProps,
  SidebarItemDOMProps,
  SidebarGroupDOMProps,
  SidebarAPI,
} from './sidebar';

// ── Navigation: Navbar ────────────────────────────
export { createNavbar } from './navbar';
export type {
  NavbarSize,
  NavbarVariant,
  NavbarItem,
  NavbarProps,
  NavbarMachineContext,
  NavbarEvent,
  NavbarNavDOMProps,
  NavbarItemDOMProps,
  NavbarMobileToggleDOMProps,
  NavbarAPI,
} from './navbar';

// ── Menu ──────────────────────────────────────────────
export { createMenu } from './menu';
export type {
  MenuSize,
  MenuItem,
  MenuProps,
  MenuMachineContext,
  MenuEvent,
  MenuBarDOMProps,
  MenuTriggerDOMProps,
  MenuItemDOMProps,
  MenuDropdownDOMProps,
  MenuAPI,
} from './menu';

// ── RadialMenu ──────────────────────────────────────────
export { createRadialMenu } from './radial-menu';
export type {
  RadialMenuSize,
  RadialMenuItem,
  RadialMenuProps,
  RadialMenuPosition,
  SectorInfo,
  RadialMenuMachineContext,
  RadialMenuEvent,
  RadialMenuDOMProps,
  RadialMenuSectorDOMProps,
  RadialMenuAPI,
} from './radial-menu';

// ── CommandPalette ──────────────────────────────────────
export { createCommandPalette } from './command-palette';
export type {
  CommandPaletteSize,
  CommandPaletteItem,
  CommandPaletteProps,
  CommandPaletteMachineContext,
  CommandPaletteEvent,
  CommandPaletteDOMProps,
  CommandPaletteInputDOMProps,
  CommandPaletteListDOMProps,
  CommandPaletteItemDOMProps,
  CommandPaletteAPI,
} from './command-palette';

// ── Spotlight ──────────────────────────────────────────
export { createSpotlight } from './spotlight';
export type {
  SpotlightSize,
  SpotlightItem,
  SpotlightProps,
  SpotlightMachineContext,
  SpotlightEvent,
  SpotlightDOMProps,
  SpotlightInputDOMProps,
  SpotlightListDOMProps,
  SpotlightItemDOMProps,
  SpotlightAPI,
} from './spotlight';

// ── TableOfContents ──────────────────────────────────────
export { createTableOfContents } from './table-of-contents';
export type {
  TocItem,
  TocEvent,
  TocSetItemsEvent,
  TocSetActiveEvent,
  TocScrollToEvent,
  TocSetOffsetEvent,
  TocContext,
  TocConfig,
  TocAPI,
} from './table-of-contents';

// ── FAB (FloatingActionButton) ──────────────────────────
export { createFAB } from './fab';
export type {
  FabAction,
  FabPosition,
  FabEvent,
  FabOpenEvent,
  FabCloseEvent,
  FabToggleEvent,
  FabSelectActionEvent,
  FabSetActionsEvent,
  FabSetOpenEvent,
  FabContext,
  FabConfig,
  FabAPI,
} from './fab';

// ── Alert ──────────────────────────────────────────────
export { createAlert } from './alert';
export type {
  AlertSeverity,
  AlertVariant,
  AlertSize,
  AlertEvent,
  AlertCloseEvent,
  AlertSetOpenEvent,
  AlertContext,
  AlertConfig,
  AlertAPI,
} from './alert';

// ── Progress ──────────────────────────────────────────
export { createProgress } from './progress';
export type {
  ProgressSize,
  ProgressEvent,
  ProgressContext,
  ProgressConfig,
  ProgressAPI,
} from './progress';

// ── Toast ─────────────────────────────────────────────
export { createToast } from './toast';
export type {
  ToastStatus,
  ToastPosition,
  ToastItem,
  ToastEvent,
  ToastContext,
  ToastConfig,
  ToastAPI,
} from './toast';

// ── AlertDialog ──────────────────────────────────────────
export { createAlertDialog } from './alert-dialog';
export type {
  AlertDialogSeverity,
  AlertDialogEvent,
  AlertDialogContext,
  AlertDialogConfig,
  AlertDialogAPI,
} from './alert-dialog';

// ── NotificationCenter ───────────────────────────────────
export { createNotificationCenter } from './notification-center';
export type {
  NotificationSeverity,
  NotificationItem,
  NotificationCenterEvent,
  NotificationCenterContext,
  NotificationCenterConfig,
  NotificationCenterAPI,
} from './notification-center';

// ── Tour ─────────────────────────────────────────────────
export { createTour } from './tour';
export type {
  TourPlacement,
  TourStep,
  TourEvent,
  TourContext,
  TourConfig,
  TourAPI,
} from './tour';

// ── SplashScreen ─────────────────────────────────────────
export { createSplashScreen } from './splash-screen';
export type {
  SplashScreenEvent,
  SplashScreenContext,
  SplashScreenConfig,
  SplashScreenAPI,
} from './splash-screen';

// ── ValidationSummary ────────────────────────────────────
export { createValidationSummary } from './validation-summary';
export type {
  ValidationSeverity,
  ValidationError,
  ValidationSummaryEvent,
  ValidationSummaryContext,
  ValidationSummaryConfig,
  ValidationSummaryAPI,
} from './validation-summary';

// ── Modal ────────────────────────────────────────────────
export { createModal } from './modal';
export type {
  ModalSize,
  ModalEvent,
  ModalContext,
  ModalConfig,
  ModalAPI,
} from './modal';

// ── Drawer ───────────────────────────────────────────────
export { createDrawer } from './drawer';
export type {
  DrawerPlacement,
  DrawerSize,
  DrawerEvent,
  DrawerContext,
  DrawerConfig,
  DrawerAPI,
} from './drawer';

// ── Popover ─────────────────────────────────────────────
export { createPopover } from './popover';
export type {
  PopoverPlacement,
  PopoverAlignment,
  PopoverEvent,
  PopoverContext,
  PopoverConfig,
  PopoverAPI,
} from './popover';

// ── Tooltip ─────────────────────────────────────────────
export { createTooltip } from './tooltip';
export type {
  TooltipPlacement,
  TooltipAlignment,
  TooltipEvent,
  TooltipContext,
  TooltipConfig,
  TooltipAPI,
} from './tooltip';

// ── ContextMenu ─────────────────────────────────────────
export { createContextMenu } from './context-menu';
export type {
  ContextMenuItemType,
  ContextMenuItem,
  ContextMenuEvent,
  ContextMenuContext,
  ContextMenuConfig,
  ContextMenuAPI,
} from './context-menu';

// ── DropdownMenu ────────────────────────────────────────
export { createDropdownMenu } from './dropdown-menu';
export type {
  DropdownMenuItem,
  DropdownMenuItemType,
  DropdownMenuPlacement,
  DropdownMenuEvent,
  DropdownMenuContext,
  DropdownMenuConfig,
  DropdownMenuAPI,
} from './dropdown-menu';

// ── Flyout ──────────────────────────────────────────────
export { createFlyout } from './flyout';
export type {
  FlyoutPlacement,
  FlyoutSize,
  FlyoutEvent,
  FlyoutContext,
  FlyoutConfig,
  FlyoutAPI,
} from './flyout';

// ── Accordion ───────────────────────────────────────────
export { createAccordion } from './accordion';
export type {
  AccordionEvent,
  AccordionContext,
  AccordionConfig,
  AccordionAPI,
} from './accordion';
